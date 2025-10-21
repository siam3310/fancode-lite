'use client';
import { useMemo, useState } from 'react';
import type { Match } from '@/lib/types';
import { MatchCard } from './match-card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ClapprPlayer } from './clappr-player';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tv, Calendar, ListFilter } from 'lucide-react';

interface MatchListProps {
  initialMatches: Match[];
  categories: string[];
}

const statusFilters = ['All Matches', 'LIVE Now', 'UPCOMING'];

export function MatchList({ initialMatches, categories }: MatchListProps) {
  const [statusFilter, setStatusFilter] = useState('All Matches');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const filteredMatches = useMemo(() => {
    return initialMatches.filter((match) => {
      const statusMatch =
        statusFilter === 'All Matches' ||
        (statusFilter === 'LIVE Now' && match.status === 'LIVE') ||
        (statusFilter === 'UPCOMING' && match.status === 'UPCOMING');
      
      const categoryMatch = categoryFilter === 'All' || match.tour.name === categoryFilter;

      return statusMatch && categoryMatch;
    });
  }, [initialMatches, statusFilter, categoryFilter]);

  const handleWatchLive = (match: Match) => {
    setSelectedMatch(match);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-4 mb-8 sticky top-[65px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 z-10">
        <div className="flex items-center gap-2 flex-wrap">
            {statusFilters.map((filter) => (
            <Button
                key={filter}
                variant={statusFilter === filter ? 'default' : 'secondary'}
                onClick={() => setStatusFilter(filter)}
            >
                {filter === 'LIVE Now' && <Tv className="mr-2 h-4 w-4 text-red-500 animate-pulse" />}
                {filter === 'UPCOMING' && <Calendar className="mr-2 h-4 w-4" />}
                {filter}
            </Button>
            ))}
        </div>
        <div className="md:w-64">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full">
                <ListFilter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by category..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
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

      <Dialog open={!!selectedMatch} onOpenChange={(isOpen) => !isOpen && setSelectedMatch(null)}>
        <DialogContent className="max-w-4xl aspect-video p-0 border-0 bg-black">
          {selectedMatch?.dai_url && <ClapprPlayer source={selectedMatch.dai_url} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
