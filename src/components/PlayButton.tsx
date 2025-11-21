import { useCallback, useRef, useState } from 'react'

export default function PlayButton({ onClick }: { onClick?: () => void }) {
  // Botón central: activa burbujas y audio
  const wrapperRef = useRef<HTMLButtonElement | null>(null)
  const [active, setActive] = useState(false)

  const handleClick = useCallback((e: React.MouseEvent) => {
    const btn = wrapperRef.current
    if (!btn) return

    const rect = btn.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const ripple = document.createElement('span')
    ripple.className = 'ripple'
    ripple.style.width = ripple.style.height = `${size}px`
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`
    btn.appendChild(ripple)

    window.setTimeout(() => ripple.remove(), 900)

    const DURATION = 1200

    try {
      window.dispatchEvent(new CustomEvent('bubble-speedup', { detail: { source: 'play-button', duration: DURATION } }))
    } catch {
      const ev = document.createEvent('Event')
      ev.initEvent('bubble-speedup', true, true)
      window.dispatchEvent(ev)
    }

    const root = document.documentElement
    root.classList.add('bubble-speedup-global')
    window.setTimeout(() => root.classList.remove('bubble-speedup-global'), DURATION)

    try {
      window.dispatchEvent(new CustomEvent('play-next-audio', { detail: { source: 'play-button' } }))
    } catch {
      const ev2 = document.createEvent('Event')
      ev2.initEvent('play-next-audio', true, true)
      window.dispatchEvent(ev2)
    }

    // Toggle background: if activating, set black and hide bubbles; if deactivating, show bubbles
    if (!active) {
      document.body.style.backgroundColor = 'black'
      window.dispatchEvent(new CustomEvent('bubbles-hide'))
      // emit reel shockwave
      window.dispatchEvent(new CustomEvent('reel-shock', { detail: { source: 'play-button' } }))
      // tell reels to play
      window.dispatchEvent(new CustomEvent('reel-play'))
    } else {
      document.body.style.backgroundColor = ''
      window.dispatchEvent(new CustomEvent('bubbles-show'))
      // tell reels to stop
      window.dispatchEvent(new CustomEvent('reel-stop'))
    }
    setActive(!active)

    if (onClick) onClick()
  }, [onClick, active])

  return (
    <div className="play-wrapper" aria-hidden="false" style={{ zIndex: 9999, position: 'relative' }}>
      <button
        ref={wrapperRef}
        // removed gradient classes to force solid color
        className="play-button"
        onClick={handleClick}
        aria-label="Toca para jugar"
        type="button"
        style={{
          background: 'rgba(220, 38, 38, 0.6)', // More transparent red
          color: '#ffffff',
          border: '2px solid rgba(185, 28, 28, 0.5)', // More transparent border
          padding: '14px 22px',
          borderRadius: '9999px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
          backdropFilter: 'blur(4px)',
          animation: 'pulse-attention 2s infinite',
          cursor: 'pointer',
        }}
      >
        <span className="label">Toca para jugar</span>
      </button>
    </div>
  )
}
