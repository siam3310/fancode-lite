
'use client';
import Image from 'next/image';
import type { Match } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { format, formatDistanceToNow, parse } from 'date-fns';
import { Tv, PlayCircle } from 'lucide-react';
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
        // Example format: "11:00:00 PM 21-10-2025"
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
  
  const formattedStartTime = startTime ? format(startTime, 'p, MMM d') : 'TBA';
  const canWatch = match.status === 'LIVE' && match.dai_url;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Card className="flex flex-col h-full overflow-hidden bg-card hover:border-primary/50 transition-colors duration-300 group shadow-lg">
      <CardHeader className="p-0 relative">
        <div className="aspect-video relative">
            <Image
                src={match.image_url || placeholder?.imageUrl || '/fallback.png'}
                alt={match.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={placeholder?.imageHint || 'sport match'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>
        <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="font-semibold uppercase text-xs backdrop-blur-sm bg-background/50">
                {match.tour.name}
            </Badge>
        </div>
        {match.status === 'LIVE' && (
            <Badge variant="destructive" className="absolute top-2 right-2 flex items-center gap-1">
                <Tv className="h-3 w-3 animate-pulse"/> LIVE
            </Badge>
        )}
      </CardHeader>
      <CardContent className="flex-1 p-4 flex flex-col">
        <h3 className="font-headline text-xl leading-tight text-foreground flex-1 group-hover:text-primary transition-colors">
          {match.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-2">{match.squad_a.name} vs {match.squad_b.name}</p>
      </CardContent>
      <CardFooter className="p-4 border-t">
        {canWatch ? (
          <Button onClick={() => onWatchLive(match)} className="w-full font-bold">
            <PlayCircle className="mr-2 h-5 w-5" />
            Watch Live
          </Button>
        ) : (
          <div className="w-full text-center text-sm text-muted-foreground">
            {isMounted && startTime ? (
                <>
                    <p className="font-medium">{`Starts ${formatDistanceToNow(startTime, { addSuffix: true })}`}</p>
                    <p className="text-xs">{formattedStartTime}</p>
                </>
            ) : (
                <div className="h-8">{startTime ? formattedStartTime : 'Time to be announced'}</div>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}