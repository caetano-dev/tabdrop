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
      </div>
    </div>
  );
}