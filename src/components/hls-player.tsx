
'use client';
import React, { useEffect, useRef } from 'react';

declare const Hls: any;

interface HlsPlayerProps {
  src: string;
}

export const HlsPlayer: React.FC<HlsPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof Hls === 'undefined') {
      console.error('HLS.js is not loaded.');
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    // Destroy previous instance if it exists
    if (hlsInstanceRef.current) {
      hlsInstanceRef.current.destroy();
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        // This is often needed for playing content from CDNs with signed URLs
        // to prevent CORS issues.
        xhrSetup: function (xhr, url) {
            xhr.withCredentials = false;
        },
      });

      hlsInstanceRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(error => {
          console.log('Autoplay was prevented:', error);
          // Autoplay is often blocked, user might need to interact first.
        });
      });
      
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.error('HLS.js fatal error:', data.details, data);
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('Fatal network error encountered, trying to recover...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('Fatal media error encountered, trying to recover...');
              hls.recoverMediaError();
              break;
            default:
              // Cannot recover
              console.error("Unrecoverable HLS.js error, destroying instance.", data.details);
              hls.destroy();
              break;
          }
        }
      });


    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (e.g., Safari)
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
         video.play().catch(error => {
          console.log('Autoplay was prevented on native HLS:', error);
        });
      });
    }

    return () => {
      // Cleanup on component unmount
      if (hlsInstanceRef.current) {
        hlsInstanceRef.current.destroy();
      }
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      controls
      style={{ width: '100%', height: '100%' }}
      muted={false}
      autoPlay
    />
  );
};
