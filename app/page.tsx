'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Rocket, Link as LinkIcon, Zap, Users } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [slug, setSlug] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (slug.trim()) {
      router.push(`/${slug.trim().toLowerCase()}`);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, var(--gradient-from), var(--gradient-to))' }}>
      <div className="mx-auto max-w-6xl px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div 
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <Rocket className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
            TabDrop
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Share browser tabs instantly. Drop links, sync in real-time, and launch them all at once.
          </p>

          {/* Slug Input */}
          <div className="max-w-md mx-auto mb-4">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="flex-1 relative">
                <span 
                  className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  /
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="your-collection-name"
                  className="w-full pl-8 pr-4 py-4 border-2 rounded-xl text-lg font-mono focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: 'var(--surface)',
                    color: 'var(--text-primary)',
                    borderColor: 'var(--border)',
                  }}
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
                style={{ backgroundColor: 'var(--primary)', color: 'white' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
              >
                Go
              </button>
            </form>
          </div>

        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="rounded-xl p-6 shadow-lg" style={{ backgroundColor: 'var(--surface)' }}>
            <div 
              className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4"
              style={{ backgroundColor: 'var(--primary-light)' }}
            >
              <LinkIcon className="h-6 w-6" style={{ color: 'var(--primary)' }} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Drag & Drop
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Simply drag browser tabs or links onto the page. No sign-up required.
            </p>
          </div>

          <div className="rounded-xl p-6 shadow-lg" style={{ backgroundColor: 'var(--surface)' }}>
            <div 
              className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4"
              style={{ backgroundColor: 'var(--primary-light)' }}
            >
              <Zap className="h-6 w-6" style={{ color: 'var(--primary)' }} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Real-time Sync
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Changes sync instantly across all devices viewing the same collection.
            </p>
          </div>

          <div className="rounded-xl p-6 shadow-lg" style={{ backgroundColor: 'var(--surface)' }}>
            <div 
              className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4"
              style={{ backgroundColor: 'var(--primary-light)' }}
            >
              <Users className="h-6 w-6" style={{ color: 'var(--primary)' }} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Easy Sharing
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Share the URL with anyone. They can view, add, or open all tabs at once.
            </p>
          </div>
        </div>

        {/* How it Works */}
        <div className="rounded-2xl p-8 shadow-xl" style={{ backgroundColor: 'var(--surface)' }}>
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--text-primary)' }}>
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div 
                className="inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-xl mb-4"
                style={{ backgroundColor: 'var(--primary)', color: 'white' }}
              >
                1
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Create a Collection
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Enter a name and navigate to tabdrop.com/your-name
              </p>
            </div>

            <div className="text-center">
              <div 
                className="inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-xl mb-4"
                style={{ backgroundColor: 'var(--primary)', color: 'white' }}
              >
                2
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Drop Your Tabs
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Drag browser tabs onto the drop zone or paste URLs manually
              </p>
            </div>

            <div className="text-center">
              <div 
                className="inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-xl mb-4"
                style={{ backgroundColor: 'var(--primary)', color: 'white' }}
              >
                3
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Launch All Tabs
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Click &quot;Open All Tabs&quot; to open everything at once in new windows
              </p>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
            Perfect for...
          </h2>
          <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--surface-hover)' }}>
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                Research Projects
              </p>
            </div>
            <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--surface-hover)' }}>
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                Team Collaboration
              </p>
            </div>
            <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--surface-hover)' }}>
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                Reading Lists
              </p>
            </div>
            <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--surface-hover)' }}>
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                Daily Workflows
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t text-center" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Built with Next.js, Supabase, and Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}