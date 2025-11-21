import React, { useState, useEffect, useRef } from 'react';
import './ReelComponent.css';

interface VideoItem {
  id: string;
  src: string;
  style: React.CSSProperties;
  isMain: boolean;
}

const ReelComponent: React.FC = () => {
  const [backgroundColor] = useState<string>(
    'linear-gradient(160deg, #ff2d55, #007aff)'
  );

  const reelRef = useRef<HTMLDivElement | null>(null);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const indexRef = useRef<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const playlist = [
    new URL('../media/video1.mp4', import.meta.url).href,
    new URL('../media/video2.mp4', import.meta.url).href,
    new URL('../media/video3.mp4', import.meta.url).href,
    new URL('../media/video4.mp4', import.meta.url).href,
    new URL('../media/video5.mp4', import.meta.url).href,
    new URL('../media/video6.mp4', import.meta.url).href,
  ];

  const playbackRate = 1.8;

  // Shockwave effect
  useEffect(() => {
    const el = reelRef.current;
    if (!el) return;

    const handler = () => {
      const rect = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;

      const farX = Math.max(originX, vw - originX);
      const farY = Math.max(originY, vh - originY);
      const radius = Math.hypot(farX, farY);
      const finalDiameter = radius * 1.2;

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
      wave.style.zIndex = '800';
      wave.style.background = 'radial-gradient(circle, rgba(255,255,255,0) 30%, rgba(255,184,77,0.95) 42%, rgba(255,120,80,0.7) 52%, rgba(255,184,77,0.35) 66%, rgba(255,184,77,0) 80%)';
      wave.style.filter = 'blur(60px)';
      wave.style.transform = 'translate(-50%, -50%) scale(0.01)';
      wave.style.transition = 'transform 1600ms cubic-bezier(.2,.9,.2,1), opacity 1600ms ease';
      wave.style.boxShadow = '0 0 200px rgba(255,160,60,0.9), 0 0 60px rgba(255,120,80,0.6)';
      wave.style.opacity = '1';

      document.body.appendChild(wave);

      const scale = finalDiameter / initSize;
      // force layout
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      wave.offsetWidth;
      wave.style.transform = `translate(-50%, -50%) scale(${scale})`;
      
      window.setTimeout(() => {
        wave.style.opacity = '0';
      }, 180);

      window.setTimeout(() => wave.remove(), 1800);
    };

    window.addEventListener('reel-shock', handler);
    return () => window.removeEventListener('reel-shock', handler);
  }, []);

  // Glitch effect
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

  const addNextVideo = (isFirst = false) => {
    const idx = indexRef.current % playlist.length;
    const src = playlist[idx];
    const count = isFirst ? 0 : videos.length;
    const isChaos = count >= 2;

    let style: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'all 1s ease',
      zIndex: 10 + count,
    };

    if (count === 1) {
      style = {
        ...style,
        transform: 'scale(0.85) rotate(3deg) translate(10px, 10px)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.3)',
        zIndex: 20,
      };
    }

    if (isChaos) {
      // Chaos mode: Random positions but AVOID the button area (Bottom Center)
      // Button is roughly at bottom 10-20%, center.
      // We define safe zones or just retry if it falls in the danger zone.
      
      let randomTop = 50, randomLeft = 50;
      let attempts = 0;
      let valid = false;

      while (!valid && attempts < 10) {
        randomTop = Math.random() * 85 + 5; // 5% to 90%
        randomLeft = Math.random() * 85 + 5; // 5% to 90%

        // Danger zone: Top > 60% AND Left between 35% and 65%
        if (randomTop > 60 && randomLeft > 35 && randomLeft < 65) {
           // Too close to button, try again
           attempts++;
        } else {
           valid = true;
        }
      }
      
      // Fallback if we couldn't find a spot (unlikely)
      if (!valid) {
          randomTop = 20;
          randomLeft = 20;
      }

      style = {
        position: 'fixed',
        top: `${randomTop}%`,
        left: `${randomLeft}%`,
        width: `${20 + Math.random() * 20}vw`, // 20-40vw
        height: 'auto',
        maxHeight: '50vh',
        transform: `translate(-50%, -50%) rotate(${Math.random() * 60 - 30}deg) scale(${0.8 + Math.random() * 0.4})`,
        zIndex: 100 + count,
        boxShadow: '0 0 40px rgba(0,0,0,0.6)',
        opacity: 0.95, 
      };
    }

    const newVideo: VideoItem = {
      id: Math.random().toString(36).substr(2, 9),
      src,
      style,
      isMain: true,
    };

    setVideos(prev => {
      const oldVideos = prev.map((v, idx) => {
        // Protect the first video from chaos scattering
        // It should remain as the base layer
        if (idx === 0) {
            return { ...v, isMain: false };
        }

        let newStyle = { ...v.style };
        if (isChaos && v.style.position !== 'fixed') {
             // Scatter existing videos to random safe spots
             let rTop, rLeft;
             // Simple safe logic for background ones: keep them away from bottom center
             if (Math.random() > 0.5) {
                 // Top half
                 rTop = Math.random() * 50 + 5;
                 rLeft = Math.random() * 90 + 5;
             } else {
                 // Bottom corners
                 rTop = Math.random() * 30 + 60;
                 rLeft = Math.random() > 0.5 ? Math.random() * 25 + 5 : Math.random() * 25 + 70;
             }
             
             newStyle = {
                position: 'fixed',
                top: `${rTop}%`,
                left: `${rLeft}%`,
                width: `${15 + Math.random() * 15}vw`,
                height: 'auto',
                maxHeight: '40vh',
                transform: `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`,
                zIndex: 100,
                transition: 'all 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
                boxShadow: '0 0 40px rgba(0,0,0,0.6)',
             };
        }
        return { ...v, isMain: false, style: newStyle };
      });
      
      // Limit total videos to prevent performance issues (keep last 8)
      // BUT always keep the first video (index 0) as the background anchor
      const allVideos = [...oldVideos, newVideo];
      if (allVideos.length > 8) {
        // Keep the first one, and the last 7
        return [allVideos[0], ...allVideos.slice(allVideos.length - 7)];
      }
      return allVideos;
    });

    indexRef.current++;
  };

  // Control listeners
  useEffect(() => {
    const playHandler = () => {
      if (videos.length === 0) {
        indexRef.current = 0;
        addNextVideo(true);
      }
    };

    const stopHandler = () => {
      setVideos([]);
      indexRef.current = 0;
    };

    window.addEventListener('reel-play', playHandler);
    window.addEventListener('reel-stop', stopHandler);

    return () => {
      window.removeEventListener('reel-play', playHandler);
      window.removeEventListener('reel-stop', stopHandler);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videos.length]);

  const handleVideoEnded = (id: string) => {
    const video = videos.find(v => v.id === id);
    if (video && video.isMain) {
      addNextVideo();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div
        ref={reelRef}
        className="w-96 h-[45rem] rounded-2xl shadow-2xl transition-all relative"
        style={{ 
          background: backgroundColor, 
          zIndex: 1000,
          overflow: videos.length >= 2 ? 'visible' : 'hidden' 
        }}
      >
        <div className="reel-glitch" aria-hidden>
          <div className="glitch-layer red" />
          <div className="glitch-layer green" />
          <div className="glitch-layer blue" />
        </div>

        {videos.map((video) => (
          <video
            key={video.id}
            src={video.src}
            style={video.style}
            className="transition-all duration-1000"
            playsInline
            autoPlay
            muted={false}
            loop={!video.isMain}
            onEnded={() => handleVideoEnded(video.id)}
            ref={el => {
                if (el) {
                    el.playbackRate = playbackRate;
                    el.volume = 1.0;
                }
            }}
          />
        ))}
        
      </div>
    </div>
  );
};

export default ReelComponent;