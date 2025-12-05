'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { SavedLink } from '@/lib/types';
import { ArrowLeft, ExternalLink, AlertCircle } from 'lucide-react';

export default function OpenPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [links, setLinks] = useState<SavedLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState(false);
  const [openedCount, setOpenedCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Fetch links on mount
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

    // Open tabs with a small delay between each to prevent browser blocking
    links.forEach((link, index) => {
      setTimeout(() => {
        try {
          const newWindow = window.open(link.url, '_blank', 'noopener,noreferrer');
          if (newWindow) {
            setOpenedCount(prev => prev + 1);
          } else {
            // Pop-up was blocked
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
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'linear-gradient(to bottom right, var(--gradient-from), var(--gradient-to))' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: 'linear-gradient(to bottom right, var(--gradient-from), var(--gradient-to))' }}>
      <div className="mx-auto max-w-2xl">
        {/* Back Button */}
        <button
          onClick={() => router.push(`/${slug}`)}
          className="mb-8 flex items-center gap-2 transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <ArrowLeft className="h-5 w-5" />
          Back to collection
        </button>

        {/* Main Card */}
        <div className="rounded-2xl shadow-xl p-8 text-center" style={{ backgroundColor: 'var(--surface)' }}>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Launch Tabs
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Collection: <span className="font-mono font-semibold" style={{ color: 'var(--primary)' }}>/{slug}</span>
            </p>
          </div>

          {/* Tab Count */}
          <div className="mb-8">
            <div className="text-6xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
              {links.length}
            </div>
            <div className="text-xl" style={{ color: 'var(--text-primary)' }}>
              {links.length === 1 ? 'tab ready' : 'tabs ready'} to open
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 border rounded-lg flex items-start gap-3" style={{ backgroundColor: 'var(--error-bg)', borderColor: 'var(--error-border)', color: 'var(--error)' }}>
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="text-left text-sm">
                {error}
              </div>
            </div>
          )}

          {/* Opening Progress */}
          {opening && (
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--primary-light)' }}>
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                Opening tabs... {openedCount} / {links.length}
              </p>
            </div>
          )}

          {/* Launch Button */}
          {links.length > 0 ? (
            <button
              onClick={launchTabs}
              disabled={opening}
              className="w-full max-w-md mx-auto px-8 py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              style={{ backgroundColor: 'var(--primary)', color: 'white' }}
              onMouseEnter={(e) => !opening && (e.currentTarget.style.backgroundColor = 'var(--primary-hover)')}
              onMouseLeave={(e) => !opening && (e.currentTarget.style.backgroundColor = 'var(--primary)')}
            >
              {opening ? 'Opening Tabs...' : 'Open All Tabs'}
            </button>
          ) : (
            <div style={{ color: 'var(--text-secondary)' }}>
              <p className="mb-4">No tabs to open yet.</p>
              <button
                onClick={() => router.push(`/${slug}`)}
                className="font-medium hover:underline"
                style={{ color: 'var(--primary)' }}
              >
                Add some links first &rarr;
              </button>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <p className="text-left">
                <strong>Note:</strong> Please allow pop-ups for this website if tabs do not open. 
                Your browser may block multiple tabs from opening automatically.
              </p>
            </div>
          </div>

          {/* Link Preview */}
          {links.length > 0 && (
            <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold mb-3 text-left" style={{ color: 'var(--text-primary)' }}>
                Tabs to open:
              </h3>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {links.map((link, index) => (
                  <div
                    key={`${link.url}-${index}`}
                    className="flex items-center gap-2 p-2 rounded text-left"
                    style={{ backgroundColor: 'var(--surface-hover)' }}
                  >
                    <ExternalLink className="h-4 w-4 shrink-0" style={{ color: 'var(--text-tertiary)' }} />
                    <span className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                      {link.url}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
          <p>All tabs will open in new browser windows/tabs</p>
        </div>
      </div>
    </div>
  );
}