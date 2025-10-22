
'use client';
import type { Metadata } from 'next';
import { MatchList } from '@/components/match-list';
import { ClapprPlayer } from '@/components/clappr-player';
import type { ApiData, Match } from '@/lib/types';
import { format, parse } from 'date-fns';
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Tv } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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

async function getMatches(): Promise<ApiData | null> {
  try {
    const res = await fetch('https://raw.githubusercontent.com/drmlive/fancode-live-events/main/fancode.json', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      next: { revalidate: 300 }
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
}

export default function Home() {
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  useEffect(() => {
    async function loadMatches() {
      try {
        setLoading(true);
        const matchData = await getMatches();
        if (matchData) {
          setData(matchData);
        } else {
          setError('Could not load match data. Please try again later.');
        }
      } catch (e: any) {
        setError(e.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    }
    loadMatches();
  }, []);

  const handleWatchLive = (match: Match) => {
    setSelectedMatch(match);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const getStreamingUrl = (match: Match | null): string => {
    if (!match?.adfree_url) return '';
    // Change 'in' to 'bd' in the URL
    return match.adfree_url.replace('//in-mc-fdlive.fancode.com', '//bd-mc-fdlive.fancode.com');
  };

  const streamingUrl = getStreamingUrl(selectedMatch);

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
      <header className="sticky top-0 z-20 w-full border-b border-border/40 bg-background">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <h1 className="text-3xl font-headline tracking-wider text-primary">FANCODE LITE</h1>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto p-4 md:px-8">
          <div className="mb-8">
            <div className="aspect-video w-full bg-card border rounded-lg overflow-hidden shadow-2xl">
              {streamingUrl ? (
                <ClapprPlayer source={streamingUrl} />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                  <Tv className="w-16 h-16 text-muted-foreground mb-4" />
                  <h2 className="text-2xl font-headline text-foreground">Live Player</h2>
                  <p className="text-muted-foreground mt-1">Select a live match to start streaming.</p>
                </div>
              )}
            </div>
            {selectedMatch && (
              <div className="bg-card p-4 rounded-b-lg -mt-1 border border-t-0">
                <h3 className="font-bold text-lg text-primary">{selectedMatch.match_name}</h3>
                <p className="text-sm text-muted-foreground">{selectedMatch.event_name}</p>
              </div>
            )}
          </div>

          {loading ? (
            <div className="space-y-8">
              <Skeleton className="h-10 w-1/3" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-[400px] rounded-lg" />)}
              </div>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <MatchList 
              initialMatches={sortedMatches} 
              categories={categories} 
              onWatchLive={handleWatchLive} 
            />
          )}
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>Last updated: {lastUpdatedAt}</p>
      </footer>
    </div>
  );
}
