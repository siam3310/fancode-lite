'use client';
import { useMemo, useState } from 'react';
import type { Match } from '@/lib/types';
import { MatchCard } from './match-card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ListFilter } from 'lucide-react';
import { ClapprPlayer } from './clappr-player';

interface MatchListProps {
  initialMatches: Match[];
  categories: (string | undefined)[];
}

const statusFilters = ['All Matches', 'LIVE Now', 'UPCOMING'];

export function MatchList({ initialMatches, categories }: MatchListProps) {
  const [statusFilter, setStatusFilter] = useState('All Matches');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const handleWatchLive = (match: Match) => {
    setSelectedMatch(match);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const getStreamingUrl = (match: Match | null): string => {
    if (!match?.adfree_url) return '';
    // This replacement is crucial for playback in certain regions.
    return match.adfree_url.replace('//in-mc-fdlive.fancode.com', '//bd-mc-fdlive.fancode.com');
  };

  const streamingUrl = getStreamingUrl(selectedMatch);

  const filteredMatches = useMemo(() => {
    return initialMatches.filter((match) => {
      const statusMatch =
        statusFilter === 'All Matches' ||
        (statusFilter === 'LIVE Now' && match.status === 'LIVE') ||
        (statusFilter === 'UPCOMING' && match.status === 'UPCOMING');
      
      const categoryMatch = categoryFilter === 'All' || match.event_category === categoryFilter;

      return statusMatch && categoryMatch;
    });
  }, [initialMatches, statusFilter, categoryFilter]);

  return (
    <div className="container mx-auto px-4 md:px-8">
      {selectedMatch && streamingUrl ? (
        <div className="mb-8">
          <div className="aspect-video w-full bg-card rounded-lg overflow-hidden shadow-lg">
            <ClapprPlayer source={streamingUrl} />
          </div>
          <div className="bg-[#181818] p-4 rounded-b-lg -mt-1">
            <h3 className="font-bold text-lg text-primary font-mono uppercase tracking-wider">{selectedMatch.match_name}</h3>
            <p className="text-sm text-zinc-400 font-mono uppercase tracking-wider">{selectedMatch.event_name}</p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col md:flex-row gap-4 mb-4 sticky top-[64px] bg-background py-3 z-10">
        <div className="flex items-center gap-2 flex-wrap">
          {statusFilters.map((filter) => (
            <Button
              key={filter}
              variant={statusFilter === filter ? 'default' : 'secondary'}
              onClick={() => setStatusFilter(filter)}
              className="rounded-sm h-8 px-4 text-xs font-bold uppercase tracking-wider"
            >
              {filter === 'LIVE Now' && <div className="h-2 w-2 rounded-full bg-red-600 mr-2"></div>}
              {filter}
            </Button>
          ))}
        </div>
        <div className="relative md:w-64">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full rounded-sm h-8 text-xs font-bold uppercase tracking-wider">
              <ListFilter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by category..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {categories.map((category) => (
                category && <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMatches.map((match) => (
            <MatchCard key={match.match_id} match={match} onWatchLive={handleWatchLive} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold font-headline tracking-wide">No Matches Found</h2>
          <p className="text-muted-foreground mt-2">Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}