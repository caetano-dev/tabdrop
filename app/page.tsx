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

  const handleRandomSlug = () => {
    const randomSlug = Math.random().toString(36).substring(2, 8);
    router.push(`/${randomSlug}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-2xl mb-6">
            <Rocket className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            TabDrop
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Share browser tabs instantly. Drop links, sync in real-time, launch them all at once.
          </p>

          {/* Slug Input */}
          <div className="max-w-md mx-auto mb-4">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-lg">
                  /
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="your-collection-name"
                  className="w-full pl-8 pr-4 py-4 border-2 border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
              >
                Go
              </button>
            </form>
          </div>

          <button
            onClick={handleRandomSlug}
            className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
          >
            or generate a random collection &rarr;
          </button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mb-4">
              <LinkIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
              Drag & Drop
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Simply drag browser tabs or links onto the page. No sign-up required.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mb-4">
              <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
              Real-time Sync
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Changes sync instantly across all devices viewing the same collection.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mb-4">
              <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
              Easy Sharing
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Share the URL with anyone. They can view, add, or open all tabs at once.
            </p>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6 text-center">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 text-white rounded-full font-bold text-xl mb-4">
                1
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Create a Collection
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Enter a name or generate a random one. Navigate to tabdrop.com/your-name
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 text-white rounded-full font-bold text-xl mb-4">
                2
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Drop Your Tabs
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Drag browser tabs onto the drop zone or paste URLs manually
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 text-white rounded-full font-bold text-xl mb-4">
                3
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Launch All Tabs
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Click &quot;Open All Tabs&quot; to open everything at once in new windows
              </p>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-8">
            Perfect for...
          </h2>
          <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-slate-200 dark:bg-slate-700 rounded-lg p-4">
              <p className="text-slate-800 dark:text-slate-200 font-medium">
                📚 Research Projects
              </p>
            </div>
            <div className="bg-slate-200 dark:bg-slate-700 rounded-lg p-4">
              <p className="text-slate-800 dark:text-slate-200 font-medium">
                👥 Team Collaboration
              </p>
            </div>
            <div className="bg-slate-200 dark:bg-slate-700 rounded-lg p-4">
              <p className="text-slate-800 dark:text-slate-200 font-medium">
                📖 Reading Lists
              </p>
            </div>
            <div className="bg-slate-200 dark:bg-slate-700 rounded-lg p-4">
              <p className="text-slate-800 dark:text-slate-200 font-medium">
                🎯 Daily Workflows
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-300 dark:border-slate-700 text-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Built with Next.js, Supabase, and Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}