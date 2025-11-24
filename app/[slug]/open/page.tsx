'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { SavedLink } from '@/lib/types';
import { Rocket, ArrowLeft, ExternalLink, AlertCircle } from 'lucide-react';

export default function OpenPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [links, setLinks] = useState<SavedLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState(false);
  const [openedCount, setOpenedCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchLinks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('links')
        .eq('slug', slug)
        .single();

      if (error && error.code !== 'PGRST116') {
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

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  // Launch all tabs
  const launchTabs = () => {
    if (links.length === 0) return;

    setOpening(true);
    setOpenedCount(0);
    setError(null);

    links.forEach((link, index) => {
      setTimeout(() => {
        try {
          const newWindow = window.open(link.url, '_blank', 'noopener,noreferrer');
          if (newWindow) {
            setOpenedCount(prev => prev + 1);
          } else {
            if (index === 0) {
              setError('Pop-ups were blocked. Please allow pop-ups for this site and try again.');
            }
          }
        } catch (err) {
          console.error('Error opening tab:', err);
        }

        // Reset opening state after the last tab
        if (index === links.length - 1) {
          setTimeout(() => setOpening(false), 500);
        }
      }, index * 100); // 100ms delay between each tab
    });
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
      <div className="mx-auto max-w-2xl">
        {/* Back Button */}
        <button
          onClick={() => router.push(`/${slug}`)}
          className="mb-8 flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to collection
        </button>

        {/* Main Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
              <Rocket className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
              Launch Tabs
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Collection: <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">/{slug}</span>
            </p>
          </div>

          {/* Tab Count */}
          <div className="mb-8">
            <div className="text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              {links.length}
            </div>
            <div className="text-xl text-slate-700 dark:text-slate-300">
              {links.length === 1 ? 'tab ready' : 'tabs ready'} to open
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg dark:bg-red-900/30 dark:border-red-700 dark:text-red-200 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div className="text-left text-sm">
                {error}
              </div>
            </div>
          )}

          {/* Opening Progress */}
          {opening && (
            <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <p className="text-indigo-900 dark:text-indigo-100 font-medium">
                Opening tabs... {openedCount} / {links.length}
              </p>
            </div>
          )}

          {/* Launch Button */}
          {links.length > 0 ? (
            <button
              onClick={launchTabs}
              disabled={opening}
              className="w-full max-w-md mx-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-semibold text-lg transition-colors shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <Rocket className="h-6 w-6" />
              {opening ? 'Opening Tabs...' : 'Open All Tabs'}
            </button>
          ) : (
            <div className="text-slate-500 dark:text-slate-400">
              <p className="mb-4">No tabs to open yet.</p>
              <button
                onClick={() => router.push(`/${slug}`)}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                Add some links first →
              </button>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <p className="text-left">
                <strong>Note:</strong> Please allow pop-ups for this website if tabs do not open. 
                Your browser may block multiple tabs from opening automatically.
              </p>
            </div>
          </div>

          {/* Link Preview */}
          {links.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 text-left">
                Tabs to open:
              </h3>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {links.map((link, index) => (
                  <div
                    key={`${link.url}-${index}`}
                    className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900/50 rounded text-left"
                  >
                    <ExternalLink className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <span className="text-sm text-slate-600 dark:text-slate-400 truncate">
                      {link.url}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>All tabs will open in new browser windows/tabs</p>
        </div>
      </div>
    </div>
  );
}