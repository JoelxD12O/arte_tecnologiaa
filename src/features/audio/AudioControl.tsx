import { useAudioPlayer } from './useAudioPlayer'

export default function AudioControl() {
  const { muted, toggleMute } = useAudioPlayer()

  return (
    <div className="pointer-events-auto">
      <button
        onClick={toggleMute}
        aria-pressed={!muted}
        aria-label={muted ? 'Unmute audio' : 'Mute audio'}
        className="group w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_black] hover:scale-105 active:translate-y-1 active:shadow-none transition-all"
      >
        {/* Icono del Parlante */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="group-hover:scale-110 transition-transform">
          <path d="M5 9v6h4l5 4V5L9 9H5z" fill="black" />
          {!muted && (
            <>
              <path d="M16.5 8.5a4 4 0 010 7" stroke="black" strokeWidth="2" strokeLinecap="round" />
              <path d="M18.5 6.5a7 7 0 010 11" stroke="black" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            </>
          )}
          {muted && (
            <line x1="19" y1="5" x2="23" y2="9" stroke="#ff0000" strokeWidth="3" strokeLinecap="round" />
          )}
        </svg>
      </button>
    </div>
  )
}