'use client';

import { useEffect, useRef, useId } from 'react';

// This tells TypeScript that 'Clappr' and its plugins exist in the global scope.
declare const Clappr: any;

interface ClapprPlayerProps {
  source: string;
}

export function ClapprPlayer({ source }: ClapprPlayerProps) {
  const playerRef = useRef<any>(null);
  const containerId = useId();

  useEffect(() => {
    // Ensure Clappr script and the level selector plugin are loaded.
    if (typeof Clappr === 'undefined' || typeof Clappr.LevelSelector === 'undefined' || !source) {
      console.warn('Clappr or its plugins are not available.');
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
        plugins: [Clappr.LevelSelector], // Add the plugin here
        levelSelectorConfig: {
          title: 'Quality', // Title for the quality selection menu
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
