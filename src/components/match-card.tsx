'use client';
import Image from 'next/image';
import type { Match } from '@/lib/types';
import { Button } from './ui/button';
import { format, parse } from 'date-fns';
import placeholderImage from '@/lib/placeholder-images.json';
import { useState, useEffect } from 'react';

interface MatchCardProps {
  match: Match;
  onWatchLive: (match: Match) => void;
}

const placeholder = placeholderImage.placeholderImages.find(p => p.id === 'match-placeholder');

function parseStartTime(timeStr: string): Date | null {
    if (!timeStr) return null;
    try {
        const parsedDate = parse(timeStr, 'hh:mm:ss a dd-MM-yyyy', new Date());
        return isNaN(parsedDate.getTime()) ? null : parsedDate;
    } catch (e) {
        console.error("Failed to parse date:", timeStr, e);
        return null;
    }
}

export function MatchCard({ match, onWatchLive }: MatchCardProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  const startTime = parseStartTime(match.startTime);
  
  const formattedStartTime = startTime ? format(startTime, 'p') : 'TBA';
  const canWatch = match.status === 'LIVE' && (match.dai_url || match.adfree_url);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative flex flex-col items-stretch justify-start rounded-md bg-[#181818] overflow-hidden border border-zinc-800">
      <div className="relative w-full aspect-video bg-zinc-900">
        <Image
          src={match.image_url || placeholder?.imageUrl || '/fallback.png'}
          alt={match.title}
          fill
          className="object-cover object-top grayscale"
          data-ai-hint={placeholder?.imageHint || 'sport match'}
        />
        {match.event_category && (
          <div className="absolute top-3 left-0">
            <span className="bg-zinc-900/70 backdrop-blur-sm text-zinc-100 text-xs font-bold uppercase tracking-widest py-1.5 px-3 border-y border-r border-zinc-700/50 rounded-r-sm">
              {match.event_category}
            </span>
          </div>
        )}
        {match.status === 'LIVE' && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-2 rounded-sm bg-red-600 px-2.5 py-1 text-xs font-bold uppercase tracking-widest text-white">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
              LIVE
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-zinc-200 text-xl font-mono uppercase leading-tight tracking-wider text-left">
            {match.match_name}
          </p>
          <p className="text-zinc-400 text-sm font-mono leading-normal tracking-wider text-left mt-1">
            {match.event_name}
          </p>
        </div>
      </div>

      <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-2 p-4">
        {canWatch ? (
          <Button
            onClick={() => onWatchLive(match)}
            className="flex items-center justify-center rounded-sm bg-white py-3 px-4 text-center text-black font-bold uppercase tracking-wider transition-transform duration-200 hover:bg-zinc-200 active:scale-95"
          >
            Watch
          </Button>
        ) : (
          <div className="flex items-center justify-center rounded-sm border border-zinc-700 bg-zinc-800/50 py-3 px-4 text-center">
            {isMounted && startTime ? (
              <p className="text-zinc-300 text-base font-normal leading-normal">
                Starts at {formattedStartTime}
              </p>
            ) : (
              <p className="text-zinc-300 text-base font-normal leading-normal">
                Time to be announced
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
