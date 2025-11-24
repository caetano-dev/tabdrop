'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { SavedLink } from '@/lib/types';
import { isValidUrl, extractUrlFromDataTransfer, formatUrlForDisplay, getFaviconUrl } from '@/lib/utils';
import { Trash2, ExternalLink, Plus, Rocket, Link as LinkIcon } from 'lucide-react';

export default function SlugPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [links, setLinks] = useState<SavedLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch links on mount
  const fetchLinks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('links')
        .eq('slug', slug)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is fine
        console.error('Error fetching links:', error);
        setError('Failed to load links');
      }

      setLinks(data?.links || []);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load links');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  // Set up realtime subscription
  useEffect(() => {
    fetchLinks();

    const channel = supabase
      .channel(`collection-${slug}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'collections',
          filter: `slug=eq.${slug}`,
        },
        (payload) => {
          console.log('Realtime update:', payload);
          if (payload.new && 'links' in payload.new) {
            const newData = payload.new as { links?: SavedLink[] };
            setLinks(newData.links || []);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [slug, fetchLinks]);

  const persistLinks = async (updatedLinks: SavedLink[]) => {
    try {
      const { error } = await supabase
        .from('collections')
        .upsert(
          {
            slug,
            links: updatedLinks,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'slug',
          }
        );

      if (error) {
        console.error('Error persisting links:', error);
        setError('Failed to save link');
        return false;
      }
      return true;
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to save link');
      return false;
    }
  };

  const addLink = async (url: string) => {
    if (!isValidUrl(url)) {
      setError('Invalid URL. Please enter a valid http:// or https:// URL');
      return;
    }

    if (links.some(link => link.url === url)) {
      setError('This link already exists in your collection');
      return;
    }

    const newLink: SavedLink = {
      url,
      addedAt: new Date().toISOString(),
    };

    const updatedLinks = [...links, newLink];
    setLinks(updatedLinks);
    setError(null);
    setSuccessMessage('Link added successfully!');
    setTimeout(() => setSuccessMessage(null), 3000);

    await persistLinks(updatedLinks);
  };

  // Delete a link
  const deleteLink = async (index: number) => {
    // Optimistic update
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks);
    setError(null);
    setSuccessMessage('Link removed!');
    setTimeout(() => setSuccessMessage(null), 3000);

    // Persist to database
    await persistLinks(updatedLinks);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const url = extractUrlFromDataTransfer(e.dataTransfer);
    if (url) {
      await addLink(url);
    } else {
      setError('Could not extract a valid URL from the dropped item');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Manual URL input handler
  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (manualUrl.trim()) {
      await addLink(manualUrl.trim());
      setManualUrl('');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            TabDrop
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Collection: <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">/{slug}</span>
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg dark:bg-red-900/30 dark:border-red-700 dark:text-red-200">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg dark:bg-green-900/30 dark:border-green-700 dark:text-green-200">
            {successMessage}
          </div>
        )}

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mb-8 p-12 border-4 border-dashed rounded-2xl transition-all ${
            isDragOver
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 scale-105'
              : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50'
          }`}
        >
          <div className="text-center">
            <LinkIcon className="mx-auto mb-4 h-16 w-16 text-slate-400 dark:text-slate-500" />
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
              Drop Links Here
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Drag and drop browser tabs or links onto this area
            </p>

            {/* Manual URL Input */}
            <form onSubmit={handleManualAdd} className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  placeholder="Or paste a URL here..."
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Links List */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
              Saved Links ({links.length})
            </h3>
            {links.length > 0 && (
              <button
                onClick={() => router.push(`/${slug}/open`)}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Rocket className="h-5 w-5" />
                Open All Tabs
              </button>
            )}
          </div>

          {links.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <LinkIcon className="mx-auto mb-3 h-12 w-12 opacity-50" />
              <p>No links yet. Start by dropping or adding a link above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {links.map((link, index) => (
                <div
                  key={`${link.url}-${index}`}
                  className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors group"
                >
                  {/* Favicon */}
                  <img
                    src={getFaviconUrl(link.url)}
                    alt=""
                    className="w-6 h-6 flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />

                  {/* Link Info */}
                  <div className="flex-1 min-w-0">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium truncate block"
                    >
                      {formatUrlForDisplay(link.url)}
                    </a>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      Added {new Date(link.addedAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      title="Open in new tab"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                    <button
                      onClick={() => deleteLink(index)}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Delete link"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="text-center text-sm text-slate-500 dark:text-slate-400">
          <p>
            Share this page&apos;s URL with others to collaborate on the same collection.
          </p>
          <p className="mt-2">
            Changes are saved automatically and synced in real-time.
          </p>
        </div>
      </div>
    </div>
  );
}