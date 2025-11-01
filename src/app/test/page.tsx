'use client';

import { useEffect, useState } from 'react';

export default function TestPage() {
  const testUrl = "https://sonypartnersdaimenew.akamaized.net/hls/live/2018457/DAI35ME-EVSN/master.m3u8?hdnea=exp=1762000301~acl=/*~id=45920137968863618024666318893790~hmac=c6c642e8218fc1a8b5f741c55b3687b42426c7bea23c4d86a9a3697be181ab23";
  const [playerUrl, setPlayerUrl] = useState('');

  useEffect(() => {
    // We need to construct the player URL on the client-side
    // to ensure `encodeURIComponent` is available.
    setPlayerUrl(`https://v.drmlive.in/player.php?url=${encodeURIComponent(testUrl)}`);
  }, [testUrl]);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <h1 className="text-3xl font-bold mb-8 text-foreground">DRM Live Test Player</h1>
      <div className="w-full max-w-4xl aspect-video rounded-lg overflow-hidden shadow-2xl bg-black">
        {playerUrl ? (
          <iframe
            src={playerUrl}
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="w-full h-full border-0"
          ></iframe>
        ) : (
           <div className="w-full h-full flex items-center justify-center">
              <p className="text-white">Loading Player...</p>
           </div>
        )}
      </div>
       <p className="mt-4 text-sm text-muted-foreground max-w-4xl break-words text-center">
        <b>Playing via drmlive.in:</b> {testUrl}
      </p>
    </div>
  );
}
