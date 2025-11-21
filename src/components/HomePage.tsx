import { useState } from 'react'
import { Link } from 'react-router-dom'
import BackgroundBubbles from './BackgroundBubbles'
import AudioControl from './AudioControl'
import ReelComponent from './ReelComponent'
import PlayButton from './PlayButton'
import Timer from './Timer'

// Página principal con burbujas, audio y reels
export default function HomePage() {
  const [isBlackBackground, setIsBlackBackground] = useState(false)

  return (
    <div className={`min-h-screen ${isBlackBackground ? 'bg-black' : 'bg-transparent'}`}>
      {!isBlackBackground && <BackgroundBubbles />}
      <AudioControl />
      <Timer />
      
      <Link 
        to="/camera"
        className="fixed top-6 right-6 z-50 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all backdrop-blur-sm border border-white/30 font-semibold"
      >
        📸 Cámara
      </Link>

      <div className="relative">
        <ReelComponent />
      </div>

      <div className="mt-[-120px] text-center relative z-[9999]">
        <PlayButton onClick={() => setIsBlackBackground(!isBlackBackground)} />
      </div>
    </div>
  )
}
