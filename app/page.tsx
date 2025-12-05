import HomeClient from './HomeClient';

export default function Home() {
  const siteHost = process.env.NEXT_PUBLIC_SITE_URL 
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL).host 
    : 'tabdrop.vercel.app';

  return (
    <main 
      className="h-screen items-center flex align-middle" 
      style={{ background: 'linear-gradient(to bottom right, var(--gradient-from), var(--gradient-to))' }}
    >
      <div className="mx-auto max-w-6xl px-4 py-16">
        {/* Hero Section */}
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
            TabDrop
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            The easiest way to share tabs online. No login required.
          </p>

          {/* Slug Input - Client Component */}
          <HomeClient siteHost={siteHost} />
        </header>

        {/* SEO-friendly content section */}
        <section className="text-center max-w-3xl mx-auto" aria-label="Features">
          <h2 className="sr-only">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <article className="p-6 rounded-xl" style={{ backgroundColor: 'var(--surface)' }}>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Instant Sharing
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Drop links and share them instantly with anyone. No sign-up needed.
              </p>
            </article>
            <article className="p-6 rounded-xl" style={{ backgroundColor: 'var(--surface)' }}>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Real-time Sync
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Changes sync automatically across all devices in real-time.
              </p>
            </article>
            <article className="p-6 rounded-xl" style={{ backgroundColor: 'var(--surface)' }}>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Open All at Once
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Launch all your saved tabs with a single click.
              </p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}