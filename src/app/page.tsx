import type { Metadata } from 'next';
import { MatchList } from '@/components/match-list';
import type { ApiData, Match, StreamingSource } from '@/lib/types';
import { format, parse } from 'date-fns';
import { unstable_cache } from 'next/cache';

function parseStartTime(timeStr: string): number {
    try {
        if (!timeStr) return 0;
        // The format is "05 March 2026 05:00 AM"
        const parsedDate = parse(timeStr, 'dd MMMM yyyy hh:mm a', new Date());
        return isNaN(parsedDate.getTime()) ? 0 : parsedDate.getTime();
    } catch (e) {
        console.error("Failed to parse date:", timeStr, e);
        return 0;
    }
}

const getMatches = unstable_cache(
  async () => {
    try {
      const res = await fetch('https://raw.githubusercontent.com/jitendra-unatti/fancode/refs/heads/main/data/fancode.json', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch matches: ${res.statusText}`);
      }
      const data = await res.json();
      
      const rawMatches = data.matches || [];

      const matches: Match[] = (Array.isArray(rawMatches) ? rawMatches : []).map((item: any) => {
        
        const streaming_sources: StreamingSource[] = [];
        if (item.auto_streams && item.auto_streams.length > 0 && item.auto_streams[0].auto) {
            const original_manifest = item.auto_streams[0].auto;
            
            streaming_sources.push({ name: 'India', manifest: original_manifest });

            const manifest_bd = original_manifest.replace(/in-mc-flive\.fancode\.com/g, 'bd-mc-flive.fancode.com');
            streaming_sources.push({ name: 'Bangladesh', manifest: manifest_bd });
        } else if (item.STREAMING_CDN) { // Fallback to old logic if auto_streams is not present
            if (item.STREAMING_CDN?.fancode_cdn && item.STREAMING_CDN.fancode_cdn !== "Unavailable") {
                streaming_sources.push({ name: 'India', url: item.STREAMING_CDN.fancode_cdn });
            }
            if (item.STREAMING_CDN?.fancode_bd_cdn && item.STREAMING_CDN.fancode_bd_cdn !== "Unavailable") {
                streaming_sources.push({ name: 'Bangladesh', url: item.STREAMING_CDN.fancode_bd_cdn });
            }
        }

        return {
          match_id: item.match_id,
          title: item.title,
          status: item.status?.toUpperCase(),
          startTime: item.startTime,
          start_time: parseStartTime(item.startTime),
          image_url: item.image,
          tour: { name: item.tournament },
          squad_a: { name: item.team?.[0]?.name || 'TBA', short_name: item.team?.[0]?.shortName || 'TBA' },
          squad_b: { name: item.team?.[1]?.name || 'TBA', short_name: item.team?.[1]?.shortName || 'TBA' },
          streaming_sources,
          event_category: item.category,
          match_name: item.title,
          event_name: item.tournament,
        } as Match;
      });
      
      const responseData: ApiData = { matches, last_updated: data.last_updated };
      return responseData;
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
  
  const sortedMatches = allMatches.sort((a, b) => {
    const statusOrder = { 'LIVE': 1, 'UPCOMING': 2, 'COMPLETED': 3 };
    
    const aStatus = a.status || 'COMPLETED';
    const bStatus = b.status || 'COMPLETED';

    const aStatusOrder = statusOrder[aStatus as keyof typeof statusOrder] || 4;
    const bStatusOrder = statusOrder[bStatus as keyof typeof statusOrder] || 4;

    if (aStatusOrder !== bStatusOrder) {
      return aStatusOrder - bStatusOrder;
    }

    if (aStatus === 'LIVE' || aStatus === 'UPCOMING') {
      return (a.start_time || 0) - (b.start_time || 0);
    }

    if (aStatus === 'COMPLETED') {
      return (b.start_time || 0) - (a.start_time || 0);
    }

    return 0;
  });
  
  const categories = [...new Set(allMatches.filter(match => match.event_category).map((match) => match.event_category))].sort();
  const lastUpdatedAt = data?.last_updated || 'N/A';

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-20 w-full flex items-center bg-background p-4 justify-center">
        <h2 className="text-[#F5F5F5] text-4xl font-headline tracking-wider italic">FancodeBD</h2>
      </header>

      <main className="flex-1">
        <MatchList 
            initialMatches={sortedMatches} 
            categories={categories} 
        />
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>Last updated: {lastUpdatedAt}</p>
        <p className="mt-2">Copyright © 2024. Fancode API data provided by drmlive & jitendra-unatti.</p>
      </footer>
    </div>
  );
}
