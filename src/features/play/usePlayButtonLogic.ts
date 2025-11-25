// src/features/play/usePlayButtonLogic.ts
import { useCallback, useRef, useState } from 'react'

export function usePlayButtonLogic(onClick?: () => void) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [active, setActive] = useState(false)

  const handleClick = useCallback((e: React.MouseEvent) => {
    const btn = buttonRef.current
    if (!btn) return

    const rect = btn.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const ripple = document.createElement('span')

    ripple.className = 'ripple'
    ripple.style.width = ripple.style.height = `${size}px`
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`
    btn.appendChild(ripple)

    window.setTimeout(() => ripple.remove(), 900)

    // Bubbles
    const root = document.documentElement
    const DURATION = 1200

    root.classList.add('bubble-speedup-global')
    window.setTimeout(() => root.classList.remove('bubble-speedup-global'), DURATION)

    window.dispatchEvent(new CustomEvent('bubble-speedup', { detail: { duration: DURATION } }))
    window.dispatchEvent(new CustomEvent('play-next-audio'))

    if (!active) {
      document.body.style.backgroundColor = 'black'
      window.dispatchEvent(new CustomEvent('bubbles-hide'))
      window.dispatchEvent(new CustomEvent('reel-shock'))
      window.dispatchEvent(new CustomEvent('reel-play'))
    } else {
      document.body.style.backgroundColor = ''
      window.dispatchEvent(new CustomEvent('bubbles-show'))
      window.dispatchEvent(new CustomEvent('reel-stop'))
    }

    setActive(!active)
    onClick?.()
  }, [onClick, active])

  return { buttonRef, handleClick, active }
}
