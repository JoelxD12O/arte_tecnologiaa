import { Link } from 'react-router-dom'
import { useCameraStream } from '../features/camera/useCameraStream'
import { useChaosSync } from '../features/shared/useChaosSync'

export default function CameraPage() {
  const { available, error } = useCameraStream('camera-fullscreen-video')
  const { chaosLevel } = useChaosSync()

  const grayScale = Math.min(100, chaosLevel * 8)
  const blurAmount = Math.min(8, chaosLevel * 0.3)
  const brightness = Math.max(40, 100 - chaosLevel * 2)

  const isGlitching = chaosLevel > 15

 return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
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

      <Link
        to="/"
        className="absolute top-6 left-6 z-50 bg-white text-black font-black text-sm md:text-base px-6 py-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_black] hover:bg-[#ff00aa] hover:text-white hover:-translate-y-1 transition-all flex items-center gap-2"
      >
        <span>←</span> <span>VOLVER</span>
      </Link>

      <div 
        className="relative w-full h-full"
        style={{
          filter: `
            grayscale(${grayScale}%) 
            blur(${blurAmount}px) 
            brightness(${brightness}%)
            contrast(1.2)
          `,
          transition: 'filter 1s ease-out'
        }}
      >
        <div className={`relative w-full h-full ${isGlitching ? 'animate-shake' : ''}`}>
          {error && (
            <div className="absolute inset-0 flex items-center justify-center text-red-500 font-bold text-xs text-center p-4 z-40">
              NO CAMERA ACCESS
            </div>
          )}

          {!available && !error && (
            <div className="absolute inset-0 bg-gray-900 animate-pulse z-40" />
          )}

          <video
            id="camera-fullscreen-video"
            autoPlay 
            muted
            playsInline
            className={`w-full h-full object-cover transform scale-x-[-1] ${available ? 'opacity-100' : 'opacity-0'}`} 
          />
          
          <div className="absolute top-6 right-6 flex items-center gap-3 z-10">
            <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse shadow-[0_0_12px_red]"></div>
            <span className="text-white font-mono text-sm tracking-widest drop-shadow-md">REC</span>
          </div>

          <div 
            className="absolute inset-0 bg-black/10 pointer-events-none z-20" 
            style={{ 
              backgroundImage: 'linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.2) 50%)', 
              backgroundSize: '100% 4px' 
            }} 
          />

          {isGlitching && (
            <div className="absolute inset-0 border-[6px] border-red-600 pointer-events-none z-30"></div>
          )}
        </div>
      </div>
    </div>
  )
}
