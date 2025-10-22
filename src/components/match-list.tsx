'use client';
import { useMemo, useState } from 'react';
import type { Match } from '@/lib/types';
import { MatchCard } from './match-card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar, ListFilter, X } from 'lucide-react';

interface MatchListProps {
  initialMatches: Match[];
  categories: (string | undefined)[];
  onWatchLive: (match: Match) => void;
}

const statusFilters = ['All Matches', 'LIVE Now', 'UPCOMING'];

export function MatchList({ initialMatches, categories, onWatchLive }: MatchListProps) {
  const [statusFilter, setStatusFilter] = useState('All Matches');
  const [categoryFilter, setCategoryFilter] = useState('All');

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
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-8 sticky top-[65px] bg-background py-4 z-10">
        <div className="flex items-center gap-2 flex-wrap">
            {statusFilters.map((filter) => (
            <Button
                key={filter}
                variant={statusFilter === filter ? 'default' : 'secondary'}
                onClick={() => setStatusFilter(filter)}
                className="rounded-full h-8 px-4 text-sm"
            >
                {filter === 'LIVE Now' && <div className="live-indicator mr-2"></div>}
                {filter === 'UPCOMING' && <Calendar className="mr-2 h-4 w-4" />}
                {filter}
            </Button>
            ))}
        </div>
        <div className="relative md:w-64">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full rounded-full h-8 text-sm">
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
            <MatchCard key={match.match_id} match={match} onWatchLive={onWatchLive} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold font-headline tracking-wide">No Matches Found</h2>
          <p className="text-muted-foreground mt-2">Try adjusting your filters.</p>
        </div>
      )}
    </>
  );
}
