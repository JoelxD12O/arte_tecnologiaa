import { useState, useCallback, useRef, useEffect } from 'react'
import './PlayButton.css'

interface PlayButtonProps {
  onClick?: () => void;
  isActive: boolean;
}

export default function PlayButton({ onClick, isActive }: PlayButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Inicializar AudioContext
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  // Función para generar un sonido satisfactorio de clic
  const playClickSound = useCallback(() => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    // Sonido de "pop" satisfactorio
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Frecuencia que baja rápido (efecto "pop")
    oscillator.frequency.setValueAtTime(isActive ? 800 : 1200, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(isActive ? 400 : 600, ctx.currentTime + 0.1);

    // Envelope (forma de volumen)
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  }, [isActive]);

  // Manejador para el efecto de "apretar"
  const handlePress = useCallback(() => {
    setIsPressed(true);

    // Reproducir sonido
    playClickSound();

    // Vibra el dispositivo si es posible (Feedback háptico)
    if (navigator.vibrate) navigator.vibrate(50);

    setTimeout(() => setIsPressed(false), 150);
    if (onClick) onClick();
  }, [onClick, playClickSound]);

  return (
    <button
      onClick={handlePress}
      className={`
        relative group overflow-hidden
        flex items-center gap-4 px-12 py-6
        rounded-2xl font-black text-2xl tracking-tight uppercase
        border-[5px] border-black
        transition-all duration-100 ease-out

        /* ESTADOS DE COLOR CON GRADIENTE */
        ${isActive
            ? 'bg-gradient-to-br from-[#ff0055] via-[#ff00aa] to-[#cc0044] text-white rotate-1 hover:rotate-0 hover:scale-105'
            : 'bg-gradient-to-br from-[#00ff41] via-[#00ff99] to-[#00cc33] text-black -rotate-1 hover:rotate-0 hover:scale-105'
        }

        /* SOMBRA DURA (NEO BRUTALISM) CON GLOW */
        ${isPressed
            ? 'translate-y-[8px] translate-x-[8px] shadow-none'
            : isActive
              ? 'shadow-[12px_12px_0px_0px_#000000,0_0_30px_rgba(255,0,170,0.6)]'
              : 'shadow-[12px_12px_0px_0px_#000000,0_0_30px_rgba(0,255,65,0.6)]'
        }

        /* Efecto de brillo al pasar */
        hover:shadow-[14px_14px_0px_0px_#000000,0_0_40px_${isActive ? 'rgba(255,0,170,0.9)' : 'rgba(0,255,65,0.9)'}]

        /* Cursor atractivo */
        cursor-pointer
      `}
    >
      {/* Efecto de brillo rotatorio */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

      {/* Círculo pulsante de fondo */}
      <div className={`absolute inset-0 rounded-2xl opacity-50 ${isActive ? 'bg-red-500' : 'bg-green-500'} animate-ping`}
           style={{ animationDuration: '2s' }}
      />

      {/* Icono animado más grande */}
      <span className={`text-5xl transition-transform duration-300 filter drop-shadow-lg ${isActive ? 'animate-spin' : 'group-hover:scale-125 group-hover:rotate-12'}`}>
        {isActive ? '😵‍💫' : '🧠'}
      </span>

      {/* Texto con efecto de brillo */}
      <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
        {isActive ? '¡DETENER CAOS!' : 'ESTIMULAR CEREBRO'}
      </span>

      {/* Brillo decorativo superior */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-t-2xl" />

      {/* Partículas decorativas */}
      {!isPressed && (
        <>
          <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full animate-ping opacity-75" />
          <div className="absolute bottom-3 left-4 w-2 h-2 bg-white rounded-full animate-ping opacity-75" style={{ animationDelay: '0.5s' }} />
        </>
      )}
    </button>
  )
}