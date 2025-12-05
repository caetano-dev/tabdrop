import { Metadata } from 'next';
import SlugPageClient from './SlugPageClient';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tabdrop.vercel.app';

  return {
    title: `${slug} Collection`,
    description: `View and collaborate on the "${slug}" link collection. Drop links, sync in real-time, and open all tabs at once.`,
    openGraph: {
      title: `${slug} - TabDrop Collection`,
      description: `View and collaborate on the "${slug}" link collection. Drop links, sync in real-time, and open all tabs at once.`,
      url: `${siteUrl}/${slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${slug} - TabDrop Collection`,
      description: `View and collaborate on the "${slug}" link collection.`,
    },
    alternates: {
      canonical: `${siteUrl}/${slug}`,
    },
    robots: {
      index: false, // Don't index individual collections for privacy
      follow: true,
    },
  };
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  return <SlugPageClient slug={slug} />;
}