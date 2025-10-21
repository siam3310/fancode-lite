import type { Metadata } from 'next';
import { MatchList } from '@/components/match-list';
import type { ApiData, Match } from '@/lib/types';
import { format } from 'date-fns';

export const metadata: Metadata = {
  title: 'Fancode Lite',
  description: 'Live scores and streaming for your favorite matches.',
};

async function getMatches(): Promise<ApiData | null> {
  try {
    const res = await fetch('https://fan-code-api.vercel.app/api/v2/matches?status=all&per_page=1000', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      next: { revalidate: 60 }, // Revalidate every minute
    });
    if (!res.ok) {
      console.error('Failed to fetch matches:', res.statusText);
      return null;
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching matches:', error);
    return null;
  }
}

export default async function Home() {
  const data = await getMatches();

  if (!data) {
    return (
      <main className="container mx-auto flex h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-headline text-primary">Fancode Lite</h1>
        <p className="mt-4 text-destructive">Could not load match data. Please try again later.</p>
      </main>
    );
  }

  const allMatches: Match[] = data.matches || [];

  const relevantMatches = allMatches.filter(
    (match) => match.status === 'LIVE' || match.status === 'UPCOMING'
  );

  const sortedMatches = relevantMatches.sort((a, b) => {
    const isALive = a.status === 'LIVE';
    const isBLive = b.status === 'LIVE';

    if (isALive && !isBLive) return -1;
    if (!isALive && isBLive) return 1;

    return a.start_time - b.start_time;
  });

  const categories = [...new Set(allMatches.map((match) => match.tour.name))].sort();
  const lastUpdatedAt = data.meta ? format(new Date(data.meta.last_updated_at), "PPP p") : 'N/A';

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-20 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-3xl font-headline tracking-wider text-primary">FANCODE LITE</h1>
        </div>
      </header>

      <main className="flex-1">
        <MatchList initialMatches={sortedMatches} categories={categories} />
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>Last updated: {lastUpdatedAt}</p>
      </footer>
    </div>
  );
}
