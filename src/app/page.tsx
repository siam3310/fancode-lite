import type { Metadata } from 'next';
import { MatchList } from '@/components/match-list';
import type { ApiData, Match } from '@/lib/types';
import { format, parse } from 'date-fns';

export const metadata: Metadata = {
  title: 'Fancode Lite',
  description: 'Live scores and streaming for your favorite matches.',
};

function parseStartTime(timeStr: string): number {
    try {
        // Example format: "11:00:00 PM 21-10-2025"
        const parsedDate = parse(timeStr, 'hh:mm:ss a dd-MM-yyyy', new Date());
        return parsedDate.getTime() / 1000;
    } catch (e) {
        console.error("Failed to parse date:", timeStr, e);
        return 0; // Return epoch on failure
    }
}


async function getMatches(): Promise<ApiData | null> {
  try {
    const res = await fetch('https://raw.githubusercontent.com/drmlive/fancode-live-events/main/fancode.json', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });

    if (!res.ok) {
      console.error('Failed to fetch matches:', res.statusText);
      return null;
    }
    const data = await res.json();
    
    // The new API returns an object with a 'matches' property which is an array
    const rawMatches = data.matches || data;

    // Normalize data
    const matches: Match[] = (Array.isArray(rawMatches) ? rawMatches : []).map((item: any) => ({
      match_id: item.match_id,
      title: item.title,
      status: item.status,
      start_time: item.startTime ? parseStartTime(item.startTime) : 0,
      startTime: item.startTime,
      image_url: item.src, // Use 'src' from new API
      tour: { tour_id: item.match_id, name: item.event_name }, // Synthesize tour from event_name
      squad_a: { squad_id: 1, name: item.team_1, short_name: item.team_1 },
      squad_b: { squad_id: 2, name: item.team_2, short_name: item.team_2 },
      streaming_sources: [],
      dai_url: item.dai_url,
      event_category: item.event_category,
      team_1: item.team_1,
      team_2: item.team_2,
      event_name: item.event_name,
      match_name: item.match_name,
    }));

    return { ...data, matches: matches, meta: data.meta || { last_updated_at: new Date().toISOString()} };
  } catch (error) {
    console.error('Error fetching match data:', error);
    return null;
  }
}

export default async function Home() {
  const data = await getMatches();

  if (!data || !data.matches) {
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

  const categories = [...new Set(allMatches.filter(match => match.tour?.name).map((match) => match.tour.name))].sort();
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