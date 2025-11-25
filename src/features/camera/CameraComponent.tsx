import { useCameraStream } from './useCameraStream'

interface CameraProps {
  chaosLevel: number; 
}

export default function CameraComponent({ chaosLevel = 0 }: CameraProps) {
  const { available, error } = useCameraStream('camera-video')

  // Filtros de desgaste
  const grayScale = Math.min(100, chaosLevel * 8); 
  const blurAmount = Math.min(8, chaosLevel * 0.3); 
  const brightness = Math.max(40, 100 - chaosLevel * 2);

  // Lógica de Glitch/Temblor: Se activa si el caos es alto
  const isGlitching = chaosLevel > 15;

  return (
    <div
      className={`fixed bottom-6 right-6 md:bottom-10 md:right-10 overflow-hidden bg-black ${isGlitching ? 'animate-shake' : ''}`}
      style={{
        width: '280px',
        height: '200px',
        borderRadius: '1.5rem',
        border: isGlitching ? '6px solid #ff0000' : '6px solid black', // Borde rojo si falla
        boxShadow: '10px 10px 0px rgba(0,0,0,0.5)',
        zIndex: 50,
        
        filter: `
          grayscale(${grayScale}%) 
          blur(${blurAmount}px) 
          brightness(${brightness}%)
          contrast(1.2)
        `,
        transition: 'filter 1s ease-out, border-color 0.3s ease'
      }}
    >
      {/* Estilos de animación inyectados */}
      <style>{`
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(3px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(1px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        .animate-shake {
          animation: shake 0.5s infinite;
        }
      `}</style>

      {/* Mensajes de Error o Carga */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-red-500 font-bold text-xs text-center p-4">
          NO CAMERA ACCESS
        </div>
      )}

      {!available && !error && (
        <div className="absolute inset-0 bg-gray-900 animate-pulse" />
      )}

      <video
        id="camera-video"
        autoPlay 
        muted
        playsInline
        className={`w-full h-full object-cover transform scale-x-[-1] ${available ? 'opacity-100' : 'opacity-0'}`} 
      />
      
      {/* Decoración REC */}
      <div className="absolute top-3 left-4 flex items-center gap-2 z-10">
        <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_red]"></div>
        <span className="text-white font-mono text-[10px] tracking-widest drop-shadow-md">REC</span>
      </div>

      <div className="absolute inset-0 bg-black/10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.2) 50%)', backgroundSize: '100% 4px' }} 
      />
    </div>
  )
}