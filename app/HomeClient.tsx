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
        className="flex items-center border border-zinc-800 rounded-xl bg-zinc-900/50 px-3 py-2 w-full"
        aria-label="Create or access a collection"
      >
        <span className="text-zinc-500 pl-4 pr-1 select-none font-mono text-sm shrink-0" aria-hidden="true">
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
          className="bg-transparent focus:ring-0 focus:outline-none text-white w-full px-3 py-2 placeholder:text-zinc-500 font-mono"
          aria-describedby="slug-description"
        />

        <button
          type="submit"
          className="ml-3 inline-flex items-center px-4 py-2 rounded-md bg-white text-black font-semibold hover:bg-zinc-200 transition-colors"
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