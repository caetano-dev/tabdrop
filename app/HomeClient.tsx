'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface HomeClientProps {
  siteHost: string;
}

export default function HomeClient({ siteHost }: HomeClientProps) {
  const router = useRouter();
  const [slug, setSlug] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (slug.trim()) {
      router.push(`/${slug.trim().toLowerCase()}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mb-4 px-2">
      <form 
        onSubmit={handleSubmit} 
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
        aria-label="Create or access a collection"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span 
            className="font-mono text-sm sm:text-lg whitespace-nowrap shrink-0"
            style={{ color: 'var(--text-tertiary)' }}
            aria-hidden="true"
          >
            {siteHost}/
          </span>
          <label htmlFor="collection-slug" className="sr-only">
            Collection name
          </label>
          <input
            id="collection-slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="your-collection"
            className="flex-1 min-w-0 px-3 sm:px-4 py-3 sm:py-4 border-2 rounded-xl text-base sm:text-lg font-mono focus:outline-none focus:ring-2"
            style={{ 
              backgroundColor: 'var(--surface)',
              color: 'var(--text-primary)',
              borderColor: 'var(--border)',
            }}
            aria-describedby="slug-description"
          />
        </div>
        <button
          type="submit"
          className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-colors shadow-lg hover:shadow-xl whitespace-nowrap"
          style={{ backgroundColor: 'var(--primary)', color: 'white' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
          aria-label="Go to collection"
        >
          Go
        </button>
      </form>
      <p id="slug-description" className="sr-only">
        Enter a collection name to create a new collection or access an existing one
      </p>
    </div>
  );
}