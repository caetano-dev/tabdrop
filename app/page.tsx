import HomeClient from './HomeClient';

export default function Home() {
  const siteHost = process.env.NEXT_PUBLIC_SITE_URL 
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL).host 
    : 'tabdrop.vercel.app';

  return (
    <main className="min-h-screen flex items-center">
      <div className="mx-auto max-w-6xl px-4 py-16">
        {/* Hero Section */}
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight text-white">
            TabDrop
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-zinc-400">
            The easiest way to share tabs online. No login required.
          </p>

          {/* Slug Input - Client Component */}
          <HomeClient siteHost={siteHost} />
        </header>

        {/* SEO-friendly content section */}
        <section className="text-center max-w-3xl mx-auto" aria-label="Features">
          <h2 className="sr-only">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <article className="p-6 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04]">
              <div className="flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-200">
                  <path d="M12 2v20M2 12h20" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-zinc-200 font-medium text-lg mb-2">Instant Sharing</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">Drop links and share them instantly with anyone. No sign-up needed.</p>
            </article>

            <article className="p-6 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04]">
              <div className="flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-200">
                  <path d="M3 12h18M12 3v18" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-zinc-200 font-medium text-lg mb-2">Real-time Sync</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">Changes sync automatically across all devices in real-time.</p>
            </article>

            <article className="p-6 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04]">
              <div className="flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-200">
                  <path d="M4 6h16v12H4z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-zinc-200 font-medium text-lg mb-2">Open All at Once</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">Launch all your saved tabs with a single click.</p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}