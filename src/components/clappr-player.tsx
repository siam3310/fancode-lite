'use client';

import { useEffect, useRef, useId } from 'react';

// This tells TypeScript that 'Clappr' and 'Hls' exist in the global scope.
declare const Clappr: any;
declare const Hls: any;

interface ClapprPlayerProps {
  source: string;
}

export function ClapprPlayer({ source }: ClapprPlayerProps) {
  const playerRef = useRef<any>(null);
  const containerId = useId();

  useEffect(() => {
    // Ensure Clappr and Hls.js script is loaded.
    if (typeof Clappr === 'undefined' || typeof Hls === 'undefined' || !source) {
      console.warn('Clappr or HLS.js is not available.');
      return;
    }

    if (playerRef.current) {
      playerRef.current.destroy();
    }
    
    try {
      playerRef.current = new Clappr.Player({
        source: source,
        parentId: `#${containerId}`,
        width: '100%',
        height: '100%',
        autoPlay: true,
        muted: false,
        playback: {
          hlsjsConfiguration: {
            // HLS.js configuration options
          },
        },
      });
    } catch (e) {
        console.error("Error creating Clappr player:", e);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [source, containerId]);

  return <div id={containerId} className="w-full h-full bg-black" />;
}
