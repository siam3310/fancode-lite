import type { Metadata } from 'next';
import { MatchList } from '@/components/match-list';
import type { ApiData, Match } from '@/lib/types';
import { format, parse } from 'date-fns';
import { unstable_cache } from 'next/cache';

function parseStartTime(timeStr: string): number {
    try {
        if (!timeStr) return 0;
        const parsedDate = parse(timeStr, 'hh:mm:ss a dd-MM-yyyy', new Date());
        return isNaN(parsedDate.getTime()) ? 0 : parsedDate.getTime();
    } catch (e) {
        console.error("Failed to parse date:", timeStr, e);
        return 0;
    }
}

const getMatches = unstable_cache(
  async () => {
    try {
      const res = await fetch('https://raw.githubusercontent.com/drmlive/fancode-live-events/main/fancode.json', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch matches: ${res.statusText}`);
      }
      const data = await res.json();
      
      const rawMatches = data.matches || data;

      const matches: Match[] = (Array.isArray(rawMatches) ? rawMatches : []).map((item: any) => ({
        match_id: item.match_id,
        title: item.title,
        status: item.status,
        start_time: parseStartTime(item.startTime),
        startTime: item.startTime,
        image_url: item.src,
        tour: { tour_id: item.match_id, name: item.event_name },
        squad_a: { squad_id: 1, name: item.team_1, short_name: item.team_1, image_url: '' },
        squad_b: { squad_id: 2, name: item.team_2, short_name: item.team_2, image_url: '' },
        streaming_sources: [],
        dai_url: item.dai_url,
        adfree_url: item.adfree_url,
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
  },
  ['matches-data'],
  { revalidate: 300 }
);


export default async function Home() {
  const data = await getMatches();
  
  const allMatches: Match[] = data?.matches || [];
  const relevantMatches = allMatches.filter(
    (match) => match.status === 'LIVE' || match.status === 'UPCOMING'
  );
  const sortedMatches = relevantMatches.sort((a, b) => {
    const isALive = a.status === 'LIVE';
    const isBLive = b.status === 'LIVE';
    if (isALive && !isBLive) return -1;
    if (!isALive && isBLive) return 1;
    return (a.start_time || 0) - (b.start_time || 0);
  });
  
  const categories = [...new Set(allMatches.filter(match => match.event_category).map((match) => match.event_category))].sort();
  const lastUpdatedAt = data?.meta?.last_updated_at ? format(new Date(data.meta.last_updated_at), "PPP p") : 'N/A';

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-20 w-full bg-background">
        <div className="container flex h-16 items-center justify-center px-4 md:px-8">
            <div className="flex items-center gap-2 text-primary" aria-label="Fancode BD">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 120 20"
                    className="h-6 w-auto"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <text
                        x="0"
                        y="15"
                        fontFamily="'Bebas Neue', sans-serif"
                        fontSize="20"
                        letterSpacing="-0.05em"
                        className="font-headline"
                    >
                        FANCODE
                    </text>
                    <text
                        x="72"
                        y="15"
                        fontFamily="'Roboto', sans-serif"
                        fontSize="18"
                        fontWeight="300"
                        letterSpacing="-0.05em"
                    >
                        BD
                    </text>
                </svg>
            </div>
        </div>
      </header>

      <main className="flex-1">
        <MatchList 
            initialMatches={sortedMatches} 
            categories={categories} 
        />
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>Last updated: {lastUpdatedAt}</p>
        <p className="mt-2">Fancode API data provided by drmlive.</p>
      </footer>
    </div>
  );
}
