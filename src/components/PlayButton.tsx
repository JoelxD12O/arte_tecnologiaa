import { useCallback, useRef } from 'react'

export default function PlayButton({ onClick }: { onClick?: () => void }) {
  // Botón central: activa burbujas y audio
  const wrapperRef = useRef<HTMLButtonElement | null>(null)

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

    document.body.style.backgroundColor = 'black'

    if (onClick) onClick()
  }, [onClick])

  return (
    <div className="play-wrapper mt-200" aria-hidden="false">
      <button
        ref={wrapperRef}
        className="play-button glow"
        onClick={handleClick}
        aria-label="Toca para jugar"
        type="button"
      >
        <span className="label">Toca para jugar</span>
      </button>
    </div>
  )
}
