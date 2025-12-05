'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { SavedLink } from '@/lib/types';
import { isValidUrl, extractUrlFromDataTransfer, formatUrlForDisplay, getFaviconUrl, getNumberOfMonthsToKeep, fetchPageTitle } from '@/lib/utils';
import { Trash2, ExternalLink, Plus, Link as LinkIcon, Loader2 } from 'lucide-react';

interface SlugPageClientProps {
  slug: string;
}

export default function SlugPageClient({ slug }: SlugPageClientProps) {
  const router = useRouter();

  const [links, setLinks] = useState<SavedLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [addingLink, setAddingLink] = useState(false);

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
      data?.links?.sort((a: SavedLink, b: SavedLink) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
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

  // Upsert links to database
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
      url = 'https://' + url;
    }

    // Check for duplicates
    if (links.some(link => link.url === url)) {
      setError('This link already exists in your collection');
      return;
    }

    setAddingLink(true);
    setError(null);

    const title = await fetchPageTitle(url);

    const newLink: SavedLink = {
      url,
      title: title || undefined,
      addedAt: new Date().toISOString(),
    };

    // Optimistic update
    const updatedLinks = [newLink, ...links];
    setLinks(updatedLinks);
    setSuccessMessage('Link added successfully!');
    setTimeout(() => setSuccessMessage(null), 3000);

    await persistLinks(updatedLinks);
    setAddingLink(false);
  };

  // Delete a link
  const deleteLink = async (index: number) => {
    // Optimistic update
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks);
    setError(null);
    setSuccessMessage('Link removed!');
    setTimeout(() => setSuccessMessage(null), 3000);

    await persistLinks(updatedLinks);
  };

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

  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (manualUrl.trim()) {
      await addLink(manualUrl.trim());
      setManualUrl('');
    }
  };

  const getLinkDisplayText = (link: SavedLink): string => {
    if (link.title) {
      return link.title;
    }
    return formatUrlForDisplay(link.url);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'linear-gradient(to bottom right, var(--gradient-from), var(--gradient-to))' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4" style={{ background: 'linear-gradient(to bottom right, var(--gradient-from), var(--gradient-to))' }}>
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 cursor-pointer" style={{ color: 'var(--primary)' }}
            onClick={() => router.push(`/`)}>
            TabDrop
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Collection: <span className="font-mono font-semibold" style={{ color: 'var(--primary)' }}>/{slug}</span>
          </p>
        </header>

        {/* Error/Success Messages */}
        {error && (
          <div role="alert" className="mb-4 p-4 border rounded-lg" style={{ backgroundColor: 'var(--error-bg)', borderColor: 'var(--error-border)', color: 'var(--error)' }}>
            {error}
          </div>
        )}
        {successMessage && (
          <div role="status" className="mb-4 p-4 border rounded-lg" style={{ backgroundColor: 'var(--success-bg)', borderColor: 'var(--success-border)', color: 'var(--success)' }}>
            {successMessage}
          </div>
        )}

        {/* Drop Zone */}
        <section
          aria-label="Drop zone for links"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mb-8 p-12 border-4 border-dashed rounded-2xl transition-all ${
            isDragOver ? 'scale-105' : ''
          }`}
          style={{
            borderColor: isDragOver ? 'var(--dropzone-hover-border)' : 'var(--dropzone-border)',
            backgroundColor: isDragOver ? 'var(--dropzone-hover-bg)' : 'var(--dropzone-bg)',
          }}
        >
          <div className="text-center">
            <LinkIcon className="mx-auto mb-4 h-16 w-16" style={{ color: 'var(--text-tertiary)' }} aria-hidden="true" />
            <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Drop Links Here
            </h2>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
            Drag the lock icon 🔒 or search bar 🔎
            </p>

            {/* Manual URL Input */}
            <form onSubmit={handleManualAdd} className="max-w-md mx-auto" aria-label="Add link form">
              <div className="flex gap-2">
                <label htmlFor="manual-url-input" className="sr-only">URL to add</label>
                <input
                  id="manual-url-input"
                  type="text"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  placeholder="Or paste a URL here..."
                  disabled={addingLink}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 disabled:opacity-50"
                  style={{
                    backgroundColor: 'var(--surface)',
                    color: 'var(--text-primary)',
                    borderColor: 'var(--border)',
                  }}
                />
                <button
                  type="submit"
                  disabled={addingLink}
                  className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                  style={{ backgroundColor: 'var(--primary)', color: 'white' }}
                  onMouseEnter={(e) => !addingLink && (e.currentTarget.style.backgroundColor = 'var(--primary-hover)')}
                  onMouseLeave={(e) => !addingLink && (e.currentTarget.style.backgroundColor = 'var(--primary)')}
                  aria-label="Add link"
                >
                  {addingLink ? (
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  ) : (
                    <Plus className="h-5 w-5" aria-hidden="true" />
                  )}
                  {addingLink ? 'Adding...' : 'Add'}
                </button>
              </div>
            </form>
            <p className="pt-2" style={{ color: 'var(--warning)' }}>
            Links expire every {getNumberOfMonthsToKeep()} months
            </p>
          </div>
        </section>

        {/* Links List */}
        <section className="rounded-xl shadow-lg p-6 mb-6" style={{ backgroundColor: 'var(--surface)' }} aria-label="Saved links">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Saved Links ({links.length})
            </h3>
            {links.length > 0 && (
              <button
                onClick={() => router.push(`/${slug}/open`)}
                className="px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                style={{ backgroundColor: 'var(--primary)', color: 'white' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
                aria-label={`Open all ${links.length} tabs`}
              >
                Open All Tabs
              </button>
            )}
          </div>

          {links.length === 0 ? (
            <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>
              <LinkIcon className="mx-auto mb-3 h-12 w-12 opacity-50" aria-hidden="true" />
              <p>No links yet. Start by dropping or adding a link above!</p>
            </div>
          ) : (
            <ul className="space-y-3" role="list">
              {links.map((link, index) => (
                <li
                  key={`${link.url}-${index}`}
                  className="flex items-center gap-3 p-4 rounded-lg transition-colors group"
                  style={{ backgroundColor: 'var(--surface-hover)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-active)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
                >
                  {/* Favicon */}
                  <img
                    src={getFaviconUrl(link.url)}
                    alt=""
                    className="w-6 h-6 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                    aria-hidden="true"
                  />

                  {/* Link Info */}
                  <div className="flex-1 min-w-0">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium truncate block hover:underline"
                      style={{ color: 'var(--primary)' }}
                      title={link.url}
                    >
                      {getLinkDisplayText(link)}
                    </a>
                    <p className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>
                      {link.title ? (
                        <span>{formatUrlForDisplay(link.url)}</span>
                      ) : (
                        <time dateTime={link.addedAt}>Added {new Date(link.addedAt).toLocaleString()}</time>
                      )}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                      title="Open in new tab"
                      aria-label={`Open ${getLinkDisplayText(link)} in new tab`}
                    >
                      <ExternalLink className="h-5 w-5" aria-hidden="true" />
                    </a>
                    <button
                      onClick={() => deleteLink(index)}
                      className="p-2 transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--error)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                      title="Delete link"
                      aria-label={`Delete ${getLinkDisplayText(link)}`}
                    >
                      <Trash2 className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Footer Info */}
        <footer className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
          <p>
            Share this page&apos;s URL with others to collaborate on the same collection.
          </p>
          <p className="mt-2">
            Changes are saved automatically and synced in real-time.
          </p>
        </footer>
      </div>
    </main>
  );
}