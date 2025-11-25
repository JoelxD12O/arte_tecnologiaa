import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import AudioControl from '../features/audio/AudioControl'
import PlayButton from '../features/play/PlayButton'
import ReelComponent from '../features/reel/ReelComponent'
import Timer from '../features/timer/Timer'
import BackgroundBubbles from '../features/bubbles/BackgroundBubbles'
import CameraComponent from '../features/camera/CameraComponent'

export default function HomePage() {
  const [isDopamineMode, setIsDopamineMode] = useState(false)
  const [chaosLevel, setChaosLevel] = useState(0)
  // Estado para el mensaje de reflexión
  const [showReflection, setShowReflection] = useState(false)

  // Lógica de degradación de color y oscurecimiento siniestro
  useEffect(() => {
    const saturation = Math.max(0, 100 - (chaosLevel * 8));
    const brightness = Math.max(30, 100 - (chaosLevel * 4)); // Oscurece progresivamente
    const darkness = Math.min(0.7, chaosLevel * 0.04); // Overlay oscuro hasta 70%

    document.documentElement.style.setProperty('--bg-saturation', `${saturation}%`);
    document.documentElement.style.setProperty('--bg-brightness', `${brightness}%`);
    document.documentElement.style.setProperty('--darkness-overlay', `${darkness}`);
  }, [chaosLevel]);

  const handleChaosIncrease = () => {
    setChaosLevel(prev => prev + 1)
  }

  // Lógica al detener/iniciar
  const handleToggleMode = () => {
    const newMode = !isDopamineMode;

    if (!newMode) {
      // AL DETENER: Mostrar reflexión y reiniciar
      setShowReflection(true);
      // Ocultar el mensaje después de 4 segundos
      setTimeout(() => setShowReflection(false), 4000);

      setChaosLevel(0);
    }

    setIsDopamineMode(newMode);
  }

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col justify-between items-center py-6">

      {/* Capa de fondo con efectos de oscurecimiento */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          filter: `brightness(var(--bg-brightness, 100%))`,
        }}
      />

      {/* Overlay de oscuridad progresiva */}
      {isDopamineMode && (
        <div
          className="fixed inset-0 bg-black pointer-events-none z-[5] transition-opacity duration-1000"
          style={{ opacity: `var(--darkness-overlay, 0)` }}
        />
      )}

      {/* MENSAJE DE REFLEXIÓN (Overlay) */}
      {showReflection && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 animate-fade-in pointer-events-none">
          <div className="text-center px-6 max-w-2xl">
            <h2 className="text-white font-black text-3xl md:text-5xl mb-4 leading-tight">
              ¿Sientes el silencio?
            </h2>
            <p className="text-gray-300 text-lg md:text-xl font-mono">
              El ruido digital se apaga, pero el eco permanece. <br/>
              Respira. Estás aquí ahora.
            </p>
          </div>
        </div>
      )}

      {/* Componentes con efectos de oscurecimiento */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          filter: `brightness(var(--bg-brightness, 100%))`,
        }}
      >
        <CameraComponent chaosLevel={chaosLevel} />
        <BackgroundBubbles chaosLevel={chaosLevel} />
      </div>

      <div className="w-full px-6 flex justify-between items-start z-50 h-20 pointer-events-none">
        <div className="flex-shrink-0 pointer-events-auto">
          <AudioControl />
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 top-6 hover:scale-110 transition-transform duration-300 pointer-events-auto">
            <Timer chaosLevel={chaosLevel} />
        </div>

        <Link
          to="/camera"
          className="pointer-events-auto flex-shrink-0 bg-white text-black font-black text-sm md:text-base px-4 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_black] hover:bg-[#ff00aa] hover:text-white hover:-translate-y-1 transition-all flex items-center gap-2"
        >
          <span>📸</span> <span className="hidden md:inline">CÁMARA</span>
        </Link>
      </div>

      <div className={`
        relative z-10 flex-shrink-0 transition-all duration-700
        ${isDopamineMode ? 'scale-100 rotate-1' : 'scale-95 rotate-0'}
      `}>
        <div
          className={`
            w-[350px] h-[600px] md:w-[400px] md:h-[700px]
            bg-white rounded-[2.5rem] border-[8px] border-black
            transition-all duration-500 p-2
            ${isDopamineMode ? 'shadow-[20px_20px_0px_#ff00aa]' : 'shadow-[10px_10px_0px_rgba(0,0,0,0.2)]'}
          `}
          style={{
            // Brillo azul que aumenta con el caos (estilo luz de pantalla)
            boxShadow: isDopamineMode
              ? `0 0 ${Math.min(80, chaosLevel * 4)}px rgba(59, 130, 246, ${Math.min(1, 0.4 + chaosLevel * 0.05)}),
                 0 0 ${Math.min(150, chaosLevel * 8)}px rgba(96, 165, 250, ${Math.min(0.9, 0.3 + chaosLevel * 0.04)}),
                 0 0 ${Math.min(200, chaosLevel * 10)}px rgba(147, 197, 253, ${Math.min(0.6, 0.2 + chaosLevel * 0.03)}),
                 20px 20px 0px #ff00aa`
              : '10px 10px 0px rgba(0,0,0,0.2)'
          }}
        >
          <div className="w-full h-full rounded-[2rem] overflow-hidden border-4 border-black bg-black relative">
            <ReelComponent
                isActive={isDopamineMode}
                onChaos={handleChaosIncrease}
            />
          </div>
        </div>
      </div>

      <div className="z-[60] w-full flex justify-center pb-4 pointer-events-none">
        <div className="hover:scale-105 transition-transform duration-200 pointer-events-auto">
            <PlayButton
                isActive={isDopamineMode}
                onClick={handleToggleMode}
            />
        </div>
      </div>

      {/* Estilo simple para el fade-in del mensaje */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}