'use client';

import { useEffect, useRef, useId } from 'react';

// This tells TypeScript that a 'Clappr' object exists in the global scope,
// as it's loaded from an external script in layout.tsx.
declare const Clappr: any;

interface ClapprPlayerProps {
  source: string;
}

export function ClapprPlayer({ source }: ClapprPlayerProps) {
  const playerRef = useRef<any>(null);
  const containerId = useId();

  useEffect(() => {
    // Ensure Clappr script is loaded and we have a source URL
    if (typeof Clappr === 'undefined' || !source) {
      console.warn('Clappr or source URL is not available.');
      return;
    }

    // If a player instance already exists, destroy it before creating a new one.
    if (playerRef.current) {
      playerRef.current.destroy();
    }
    
    try {
      // Create a new Clappr player instance
      playerRef.current = new Clappr.Player({
        source: source,
        parentId: `#${containerId}`,
        width: '100%',
        height: '100%',
        autoPlay: true,
        muted: false,
      });
    } catch (e) {
        console.error("Error creating Clappr player:", e);
    }


    // Cleanup function to destroy the player when the component unmounts
    // or when the source URL changes.
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [source, containerId]); // Rerun effect if source or containerId changes

  return <div id={containerId} className="w-full h-full bg-black" />;
}
