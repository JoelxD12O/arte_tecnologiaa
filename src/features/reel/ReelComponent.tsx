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
  const [liked, setLiked] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)

  // Inicializar AudioContext
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  // Función para reproducir sonido de "like" satisfactorio
  const playLikeSound = () => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    // Sonido de "ding" alegre y satisfactorio
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Secuencia de notas ascendentes (efecto "ding-ding")
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.setValueAtTime(1000, ctx.currentTime + 0.05);
    oscillator.frequency.setValueAtTime(1200, ctx.currentTime + 0.1);

    oscillator.type = 'sine';

    // Envelope suave
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);

    // Vibración
    if (navigator.vibrate) navigator.vibrate(30);
  };

  // Manejar clic en el corazón
  const handleLike = () => {
    setLiked(true);
    playLikeSound();
    setTimeout(() => setLiked(false), 600);
  };

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
                    className="group relative w-16 h-16 md:w-20 md:h-20
                    bg-gradient-to-br from-[#ff0055] via-[#ff00aa] to-[#aa00ff]
                    rounded-full border-4 border-white text-white
                    flex items-center justify-center
                    hover:scale-125 hover:rotate-12
                    active:scale-95 active:rotate-0
                    transition-all duration-150 ease-out
                    shadow-[0_0_20px_rgba(255,0,170,0.6),0_0_40px_rgba(170,0,255,0.4),4px_4px_0px_white]
                    hover:shadow-[0_0_30px_rgba(255,0,170,1),0_0_60px_rgba(170,0,255,0.8),6px_6px_0px_white]
                    active:shadow-[0_0_15px_rgba(255,0,170,0.8),2px_2px_0px_white]
                    animate-pulse
                    cursor-pointer
                    overflow-hidden
                    "
                >
                    {/* Efecto de brillo rotatorio */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
                         style={{ animation: 'shimmer 2s infinite' }}
                    />

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor"
                         className="size-8 md:size-10 relative z-10 group-hover:animate-bounce drop-shadow-[0_0_8px_rgba(255,255,255,1)]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                    </svg>

                    {/* Etiqueta "TAP!" parpadeante */}
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2
                                   bg-yellow-400 text-black text-[10px] md:text-xs font-black
                                   px-2 py-0.5 rounded-full border-2 border-black
                                   animate-bounce shadow-lg
                                   uppercase tracking-wider">
                        ¡TAP!
                    </span>

                    {/* Círculos pulsantes alrededor */}
                    <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping" />
                    <div className="absolute inset-0 rounded-full border-2 border-[#ff00aa]/50 animate-ping" style={{ animationDelay: '0.3s' }} />
                </button>

                {/* BOTÓN DE CORAZÓN INTERACTIVO */}
                <button
                    onClick={handleLike}
                    className="relative flex flex-col items-center gap-1 group cursor-pointer"
                >
                    <div className={`
                        relative transition-all duration-200 ease-out
                        ${liked ? 'scale-125 rotate-12' : 'scale-100 hover:scale-110'}
                    `}>
                        {/* Corazón con animación */}
                        <span className={`
                            text-3xl filter drop-shadow-lg
                            transition-all duration-200
                            ${liked ? 'animate-ping' : ''}
                        `}>
                            ❤️
                        </span>

                        {/* Efecto de explosión de partículas */}
                        {liked && (
                            <>
                                <span className="absolute top-0 left-0 text-xl animate-ping opacity-75">💖</span>
                                <span className="absolute top-0 right-0 text-xl animate-ping opacity-75" style={{ animationDelay: '0.1s' }}>✨</span>
                                <span className="absolute bottom-0 left-0 text-xl animate-ping opacity-75" style={{ animationDelay: '0.2s' }}>💕</span>
                            </>
                        )}

                        {/* Círculo de resplandor al hacer clic */}
                        {liked && (
                            <div className="absolute inset-0 -z-10 bg-pink-500 rounded-full animate-ping opacity-50" />
                        )}
                    </div>

                    <span className={`
                        text-xs font-bold text-white drop-shadow-md
                        transition-all duration-200
                        ${liked ? 'scale-110 text-pink-300' : 'group-hover:scale-105'}
                    `}>
                        {(999 + totalConsumed * 13)}k
                    </span>
                </button>
            </div>
        )}
    </div>
  )
}

export default ReelComponent