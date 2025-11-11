import React, { useState, useEffect, useRef } from 'react';

const ReelComponent: React.FC = () => {
  const [backgroundColor] = useState<string>(
    'linear-gradient(160deg, #ff2d55, #007aff)'
  );

  const reelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = reelRef.current;
    if (!el) return;

    const handler = () => {
      // create a fullscreen shockwave centered on the reel
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // distance to farthest corner -> diameter needed to cover screen
      const farX = Math.max(centerX, vw - centerX);
      const farY = Math.max(centerY, vh - centerY);
      const radius = Math.hypot(farX, farY);
      const finalDiameter = radius * 2;

      const initSize = 40; // px
      const wave = document.createElement('div');
      wave.className = 'reel-shockwave-full';
      wave.style.position = 'fixed';
      wave.style.left = `${centerX}px`;
      wave.style.top = `${centerY}px`;
      wave.style.width = `${initSize}px`;
      wave.style.height = `${initSize}px`;
      wave.style.borderRadius = '50%';
      wave.style.pointerEvents = 'none';
      wave.style.transform = 'translate(-50%, -50%) scale(0.01)';
      wave.style.background = 'rgba(255,255,255,0.28)';
      wave.style.boxShadow = '0 0 60px rgba(255,255,255,0.45)';
      wave.style.zIndex = '1000';
      wave.style.transition = 'transform 900ms cubic-bezier(.2,.9,.2,1), opacity 900ms ease';

      document.body.appendChild(wave);

      // trigger expand to cover viewport
      const scale = finalDiameter / initSize;
      // force layout
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      wave.offsetWidth;
      wave.style.transform = `translate(-50%, -50%) scale(${scale})`;
      wave.style.opacity = '0';

      // remove after animation
      window.setTimeout(() => wave.remove(), 1000);
    };

    window.addEventListener('reel-shock', handler);
    return () => window.removeEventListener('reel-shock', handler);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div
        ref={reelRef}
        className="w-96 h-[45rem] rounded-2xl shadow-2xl transition-all mb-20 relative overflow-hidden"
        style={{ background: backgroundColor }}
      ></div>
    </div>
  );
};

export default ReelComponent;