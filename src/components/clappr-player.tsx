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
    let playerInstance: any;

    if (typeof Clappr === 'undefined' || !source) {
      console.warn('Clappr is not available.');
      return;
    }

    // Ensure HLS.js is available for HLS streams
    if (source.includes('.m3u8') && typeof Hls === 'undefined') {
        console.warn('HLS.js is not available to play this stream.');
        return;
    }
    
    try {
      playerInstance = new Clappr.Player({
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
        plugins: {
          core: [Clappr.HLS]
        }
      });
      playerRef.current = playerInstance;

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
