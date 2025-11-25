import { useState, useCallback } from 'react'
import './PlayButton.css' // Asegúrate de tener este archivo o bórralo si usas solo Tailwind

interface PlayButtonProps {
  onClick?: () => void;
  isActive: boolean;
}

export default function PlayButton({ onClick, isActive }: PlayButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  // Manejador para el efecto de "apretar"
  const handlePress = useCallback(() => {
    setIsPressed(true);
    // Vibra el dispositivo si es posible (Feedback háptico)
    if (navigator.vibrate) navigator.vibrate(50);
    
    setTimeout(() => setIsPressed(false), 150);
    if (onClick) onClick();
  }, [onClick]);

  return (
    <button
      onClick={handlePress}
      className={`
        relative group overflow-hidden
        flex items-center gap-4 px-12 py-6 
        rounded-2xl font-black text-2xl tracking-tight uppercase
        border-[5px] border-black
        transition-all duration-100 ease-out
        
        /* ESTADOS DE COLOR */
        ${isActive 
            ? 'bg-[#ff0055] text-white rotate-1 hover:rotate-0 hover:bg-[#ff1a66]' 
            : 'bg-[#00ff41] text-black -rotate-1 hover:rotate-0 hover:bg-[#33ff66]'
        }

        /* SOMBRA DURA (NEO BRUTALISM) */
        ${isPressed 
            ? 'translate-y-[6px] translate-x-[6px] shadow-none' 
            : 'shadow-[10px_10px_0px_0px_#000000]'
        }
      `}
    >
      {/* Icono animado */}
      <span className={`text-4xl transition-transform duration-300 ${isActive ? 'animate-spin' : 'group-hover:scale-125'}`}>
        {isActive ? '😵‍💫' : '🧠'}
      </span>

      {/* Texto */}
      <span className="relative z-10">
        {isActive ? '¡DETENER CAOS!' : 'ESTIMULAR CEREBRO'}
      </span>
      
      {/* Brillo decorativo (Glitch) */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-white opacity-20 pointer-events-none" />
    </button>
  )
}