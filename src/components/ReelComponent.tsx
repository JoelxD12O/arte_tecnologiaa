import React, { useState, useEffect, useRef } from 'react';
import './ReelComponent.css';

const ReelComponent: React.FC = () => {
  const [backgroundColor] = useState<string>(
    'linear-gradient(160deg, #ff2d55, #007aff)'
  );

  const reelRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState<boolean>(false);
  const indexRef = useRef<number>(0);

  const playlist = [
    new URL('../media/video1.mp4', import.meta.url).href,
    new URL('../media/video2.mp4', import.meta.url).href,
    new URL('../media/video3.mp4', import.meta.url).href,
    new URL('../media/video4.mp4', import.meta.url).href,
    new URL('../media/video5.mp4', import.meta.url).href,
    new URL('../media/video6.mp4', import.meta.url).href,

    // más más
  ];

  const playbackRate = 1.8;

  useEffect(() => {
    const el = reelRef.current;
    if (!el) return;

    const handler = () => {
      const rect = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

 
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2; // center of reel

      const farX = Math.max(originX, vw - originX);
      const farY = Math.max(originY, vh - originY);
      const radius = Math.hypot(farX, farY);
      const finalDiameter = radius * 1.2; // a bit extra so rays reach beyond corners

      // make wave more visible
      const initSize = Math.max(80, Math.min(rect.width * 0.6, 220));
      const wave = document.createElement('div');
      wave.className = 'reel-shockwave-full single-edge';
      wave.style.position = 'fixed';
      wave.style.left = `${originX}px`;
      wave.style.top = `${originY}px`;
      wave.style.width = `${initSize}px`;
      wave.style.height = `${initSize}px`;
      wave.style.borderRadius = '50%';
      wave.style.pointerEvents = 'none';
      // ensure wave sits behind the reel
      wave.style.zIndex = '800';
      // stronger colored ring: visible band with warm-orange color, thicker and higher opacity
      wave.style.background = 'radial-gradient(circle, rgba(255,255,255,0) 30%, rgba(255,184,77,0.95) 42%, rgba(255,120,80,0.7) 52%, rgba(255,184,77,0.35) 66%, rgba(255,184,77,0) 80%)';
      wave.style.filter = 'blur(60px)';
      wave.style.transform = 'translate(-50%, -50%) scale(0.01)';
      wave.style.transition = 'transform 1600ms cubic-bezier(.2,.9,.2,1), opacity 1600ms ease';
      // stronger colored glow
      wave.style.boxShadow = '0 0 200px rgba(255,160,60,0.9), 0 0 60px rgba(255,120,80,0.6)';
      // start fully visible
      wave.style.opacity = '1';

      document.body.appendChild(wave);

      const scale = finalDiameter / initSize;
      // force layout
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      wave.offsetWidth;
      wave.style.transform = `translate(-50%, -50%) scale(${scale})`;
      // fade out gradually
      window.setTimeout(() => {
        wave.style.opacity = '0';
      }, 180);

      // cleanup after animation
      window.setTimeout(() => wave.remove(), 1800);
    };

    window.addEventListener('reel-shock', handler);
    return () => window.removeEventListener('reel-shock', handler);
  }, []);

  // Toggle glitch effect when the UI goes dark (bubbles hidden)
  useEffect(() => {
    const el = reelRef.current;
    if (!el) return;

    const addGlitch = () => el.classList.add('glitch-active');
    const removeGlitch = () => el.classList.remove('glitch-active');

    window.addEventListener('bubbles-hide', addGlitch);
    window.addEventListener('bubbles-show', removeGlitch);

    return () => {
      window.removeEventListener('bubbles-hide', addGlitch);
      window.removeEventListener('bubbles-show', removeGlitch);
    };
  }, []);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const playHandler = () => {
      if (playlist.length === 0) return;
      const idx = indexRef.current || 0;
      // const url = playlist[idx];
      // quick check that the resource exists (helps catch wrong paths)
      fetch(playlist[idx], { method: 'HEAD' })
        .then((res) => {
          if (!res.ok) {
            console.error('Video not found or inaccessible:', playlist[idx], res.status);
            // still try to set src so console shows player error
          }
          try {
            vid.src = playlist[idx];
            // ensure the video is loaded and visible
            vid.load();
          } catch {
            void 0;
          }
          vid.currentTime = 0;
          // make sure video element is visible
          setPlaying(true);
          try {
            (vid as HTMLVideoElement).style.display = 'block';
            (vid as HTMLVideoElement).controls = true; // show controls for debug
            (vid as HTMLVideoElement).autoplay = true;
          } catch {
            void 0;
          }
          vid.muted = false;
          vid.volume = 1;
          try {
            vid.playbackRate = playbackRate;
          } catch {
            void 0;
          }
          vid.play().catch((err) => console.error('video play failed', err));
        })
        .catch((err) => {
          console.error('Error fetching video head', err);
        });
    };

    const stopHandler = () => {
      try {
        vid.pause();
        vid.currentTime = 0;
        vid.removeAttribute('src');
        (vid as HTMLElement).style.display = 'none';
      } catch {
        void 0;
      }
      setPlaying(false);
    };

    const endedHandler = () => {
      // advance playlist
      indexRef.current = (indexRef.current + 1) % playlist.length;
      vid.src = playlist[indexRef.current];
      vid.currentTime = 0;
      try {
        vid.playbackRate = playbackRate;
      } catch {
        void 0;
      }
      vid.play().catch(() => {});
    };

    vid.removeEventListener('ended', endedHandler);
    vid.addEventListener('ended', endedHandler);
    const errorHandler = (e: any) => {
      console.error('Video element error, skipping to next', e, vid.currentSrc);
      // skip to next video
      indexRef.current = (indexRef.current + 1) % playlist.length;
      const next = playlist[indexRef.current];
      try {
        vid.src = next;
        vid.load();
        vid.currentTime = 0;
        vid.play().catch((err) => console.error('play after error failed', err));
      } catch (err) {
        console.error('Error switching to next video after failure', err);
      }
    };
    vid.addEventListener('error', errorHandler);

    window.addEventListener('reel-play', playHandler);
    window.addEventListener('reel-stop', stopHandler);

    return () => {
      window.removeEventListener('reel-play', playHandler);
      window.removeEventListener('reel-stop', stopHandler);
      vid.removeEventListener('ended', endedHandler);
      vid.removeEventListener('error', errorHandler);
    };
  }, [playlist]);

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div
        ref={reelRef}
        className="w-96 h-[45rem] rounded-2xl shadow-2xl transition-all mb-20 relative overflow-hidden"
        style={{ background: backgroundColor, zIndex: 1000 }}
      >
        {/* Glitch layers: three color-split layers that mirror the reel's background/video */}
        <div className="reel-glitch" aria-hidden>
          <div className="glitch-layer red" />
          <div className="glitch-layer green" />
          <div className="glitch-layer blue" />
        </div>
        {/* video player: visible only when playing */}
        <video
          ref={videoRef}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: playing ? 'block' : 'none' }}
          playsInline
          preload="auto"
        />
        
      </div>
    </div>
  );
};

export default ReelComponent;