import React, { useEffect, useRef, useState } from 'react'
import './ReelComponent.css'
import { useReelPlayback } from './useReelPlayback'

interface ReelComponentProps {
  isActive: boolean;
  onChaos?: () => void;
}

const ReelComponent: React.FC<ReelComponentProps> = ({ isActive, onChaos }) => {
  const reelRef = useRef<HTMLDivElement>(null)
  const { videos, addNextVideo, clearVideos } = useReelPlayback()
  
  // ESTADÍSTICAS DE CONSUMO
  const [totalConsumed, setTotalConsumed] = useState(0)

  // CÁLCULO DE EFECTOS (Solo afecta a los videos de la tablet)
  const grayScale = Math.max(0, (totalConsumed - 10) * 8); 
  const blurAmount = Math.max(0, (totalConsumed - 20) * 0.3); 
  const currentPlaybackRate = 1.0 + (totalConsumed * 0.03); 

  const containerStyle = {
    filter: isActive ? `
        grayscale(${Math.min(100, grayScale)}%)
        blur(${Math.min(4, blurAmount)}px)
        contrast(${Math.max(80, 100 - totalConsumed)}%)
    ` : 'none',
    transition: 'filter 1s ease-out'
  };

  useEffect(() => {
    if (isActive) {
      if (videos.length === 0) {
        addNextVideo(true)
        setTotalConsumed(1)
      }
    } else {
      clearVideos()
      setTotalConsumed(0)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]) 

  // Efecto de entrada suave para el video nuevo
  useEffect(() => {
    const timer = setTimeout(() => {
        const mainVideo = document.getElementById('main-video');
        if (mainVideo) {
            mainVideo.style.transform = 'translateY(0)';
            mainVideo.style.opacity = '1';
        }
    }, 50); 
    return () => clearTimeout(timer);
  }, [videos]);


  const handleManualNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    addNextVideo();
    setTotalConsumed(prev => prev + 1);
    if (onChaos) onChaos();
  }

  const onEnd = (id: string) => {
    const v = videos.find(v => v.id === id)
    if (v?.isMain) {
        addNextVideo()
        setTotalConsumed(prev => prev + 1);
    }
  }

  // Glitch logic
  useEffect(() => {
    const el = reelRef.current
    if (isActive) el?.classList.remove('glitch-active')
    else el?.classList.add('glitch-active')
  }, [isActive])

  return (
    <div
        ref={reelRef}
        // Fondo negro sólido para la tablet (objeto físico)
        className="relative w-full h-full bg-[#121212] overflow-hidden brainrot-static transition-all duration-300"
        style={containerStyle}
    >
        {/* --- DATOS DE CONSUMO --- */}
        {isActive && (
            <div className="absolute top-6 left-0 w-full z-[150] pointer-events-none flex justify-center">
                <div className="bg-black/60 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20">
                    <p className="text-white font-mono text-xs tracking-widest uppercase">
                        REEL ACTUAL: <span className="text-[#00ff41] font-bold text-sm">#{totalConsumed}</span>
                    </p>
                </div>
            </div>
        )}

        <div className={`reel-glitch ${!isActive ? 'opacity-100' : 'opacity-0'}`} aria-hidden>
          <div className="glitch-layer red" />
          <div className="glitch-layer green" />
          <div className="glitch-layer blue" />
        </div>

        {/* VIDEOS */}
        {videos.map(v => (
          <video
            key={v.id}
            id={v.isMain ? 'main-video' : undefined}
            src={v.src}
            style={v.style} 
            autoPlay
            playsInline
            loop
            muted={!v.isMain}
            onEnded={() => onEnd(v.id)}
            className="absolute shadow-xl"
            ref={el => { if (el) el.playbackRate = currentPlaybackRate }}
          />
        ))}

        {/* CONTROLES */}
        {isActive && videos.length > 0 && (
            <div className="absolute bottom-6 right-4 z-[100] flex flex-col gap-5 items-center">
                <button 
                    onClick={handleManualNext}
                    className="group relative w-12 h-12 md:w-14 md:h-14 bg-black/40 backdrop-blur-md rounded-full border-2 border-white text-white flex items-center justify-center hover:bg-[#ff00aa] hover:scale-110 hover:border-black transition-all shadow-[2px_2px_0px_black] active:translate-y-1 active:shadow-none"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-6 md:size-8 group-hover:animate-bounce">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                    </svg>
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-white animate-pulse">
                        NEXT
                    </span>
                </button>
                <div className="flex flex-col items-center gap-1 opacity-90 drop-shadow-md">
                    <span className="text-3xl filter drop-shadow-lg cursor-pointer">❤️</span>
                    <span className="text-xs font-bold text-white">{(999 + totalConsumed * 13)}k</span>
                </div>
            </div>
        )}
    </div>
  )
}

export default ReelComponent