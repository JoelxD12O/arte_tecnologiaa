import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'

// Fondo de burbujas animadas
export default function BackgroundBubbles() {
  const bubbles = [
  { style: { left: '18px', top: '12px', width: 88, height: 88, background: 'radial-gradient(circle at 30% 30%, #ffd24d, #ff8a4d)' }, speed: 'animate-bubble-slow', delay: 'delay-0' },
  { style: { left: '84px', top: '6px', width: 64, height: 64, background: 'linear-gradient(135deg,#34e6d6,#14c48f)' }, speed: 'animate-bubble-med', delay: 'delay-2' },
  { style: { left: '140px', top: '18px', width: 56, height: 56, background: 'linear-gradient(135deg,#38cfff,#1aa6ff)' }, speed: 'animate-bubble-fast', delay: 'delay-3' },
  { style: { right: '22px', top: '12px', width: 72, height: 72, background: 'linear-gradient(135deg,#ff7fcf,#b06bff)' }, speed: 'animate-bubble-med', delay: 'delay-1' },
  { style: { right: '94px', top: '6px', width: 88, height: 88, background: 'linear-gradient(135deg,#ffb84d,#ff6b6b)' }, speed: 'animate-bubble-slow', delay: 'delay-4' },
  { style: { left: '6px', top: '120px', width: 72, height: 72, background: 'linear-gradient(135deg,#48e06a,#17c24f)' }, speed: 'animate-bubble-med', delay: 'delay-3' },
  { style: { left: '10px', bottom: '28px', width: 96, height: 96, background: 'linear-gradient(135deg,#ff6b8a,#ff9a6b)' }, speed: 'animate-bubble-fast', delay: 'delay-2' },
  { style: { left: '160px', bottom: '20px', width: 88, height: 88, background: 'linear-gradient(135deg,#ffc966,#ff7fb3)' }, speed: 'animate-bubble-slow', delay: 'delay-1' },
  { style: { right: '20px', bottom: '88px', width: 64, height: 64, background: 'linear-gradient(135deg,#2fe0a1,#12be78)' }, speed: 'animate-bubble-med', delay: 'delay-4' },
  { style: { right: '64px', bottom: '18px', width: 96, height: 96, background: 'linear-gradient(135deg,#6fe9ff,#9cc0ff)' }, speed: 'animate-bubble-fast', delay: 'delay-0' },
  { style: { left: '6%', bottom: '8%', width: 160, height: 160, opacity: 0.6, background: 'linear-gradient(135deg,#ff7fa0,#ffbf66)' }, speed: 'animate-bubble-slow', delay: 'delay-3' },
  { style: { right: '4%', top: '18%', width: 140, height: 140, opacity: 0.6, background: 'linear-gradient(135deg,#48e06a,#2fe0a1)' }, speed: 'animate-bubble-med', delay: 'delay-2' },
    
  { style: { left: '28px', top: '220px', width: 48, height: 48, background: 'linear-gradient(135deg,#ff4fb3,#ff6be0)' }, speed: 'animate-bubble-fast', delay: 'delay-1' },
  { style: { left: '220px', top: '40px', width: 72, height: 72, background: 'linear-gradient(135deg,#4fe9ff,#2fb9ff)' }, speed: 'animate-bubble-med', delay: 'delay-3' },
  { style: { left: '320px', top: '24px', width: 56, height: 56, background: 'linear-gradient(135deg,#ffb84d,#ff8a33)' }, speed: 'animate-bubble-slow', delay: 'delay-2' },
  { style: { left: '420px', top: '8px', width: 64, height: 64, background: 'linear-gradient(135deg,#b06bff,#7f9bff)' }, speed: 'animate-bubble-med', delay: 'delay-4' },
  { style: { left: '8%', top: '40%', width: 110, height: 110, opacity: 0.6, background: 'linear-gradient(135deg,#ffb84d,#ff7f9a)' }, speed: 'animate-bubble-slow', delay: 'delay-0' },
  { style: { left: '12%', bottom: '40px', width: 72, height: 72, background: 'linear-gradient(135deg,#2fe0a1,#18c88a)' }, speed: 'animate-bubble-med', delay: 'delay-2' },
  { style: { right: '120px', top: '120px', width: 48, height: 48, background: 'linear-gradient(135deg,#ff4f81,#ff9a6b)' }, speed: 'animate-bubble-fast', delay: 'delay-3' },
  { style: { right: '220px', bottom: '40px', width: 54, height: 54, background: 'linear-gradient(135deg,#48e06a,#2fbf6f)' }, speed: 'animate-bubble-fast', delay: 'delay-1' },
  { style: { left: '520px', bottom: '10%', width: 130, height: 130, opacity: 0.6, background: 'linear-gradient(135deg,#ffb84d,#ff7fb3)' }, speed: 'animate-bubble-slow', delay: 'delay-4' },
  { style: { left: '620px', top: '60px', width: 58, height: 58, background: 'linear-gradient(135deg,#34e6d6,#17c48f)' }, speed: 'animate-bubble-med', delay: 'delay-0' },
  { style: { left: '760px', top: '12px', width: 92, height: 92, background: 'linear-gradient(135deg,#ff6be0,#b06bff)' }, speed: 'animate-bubble-slow', delay: 'delay-2' },
  { style: { right: '8%', top: '40%', width: 100, height: 100, opacity: 0.6, background: 'linear-gradient(135deg,#6fe9ff,#9cc0ff)' }, speed: 'animate-bubble-med', delay: 'delay-3' }
  ]

  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const bubbleEls = Array.from(el.querySelectorAll<HTMLElement>('.bubble'))
    const anims: Animation[] = []

    // prepare each bubble with a random looping animation (Web Animations API)
    bubbleEls.forEach((bubble, i) => {
      // start invisible
      bubble.style.opacity = '0'
      bubble.style.transition = 'opacity 600ms ease'

      // randomized motion vector and duration
      const dx = (Math.random() - 0.5) * (80 + Math.random() * 220) // px
      const dy = (Math.random() - 0.5) * (60 + Math.random() * 200) // px
      const rotate = (Math.random() - 0.5) * 30 // degrees subtle rotation
      const duration = Math.floor((1.8 + Math.random() * 2.5) * 1000) // 1800 - 4300ms

      const keyframes = [
        { transform: `translate(0px, 0px) rotate(0deg)` },
        { transform: `translate(${dx / 2}px, ${dy / 2}px) rotate(${rotate / 2}deg)` },
        { transform: `translate(${dx}px, ${dy}px) rotate(${rotate}deg)` },
      ]

      // create animation but keep it paused until shown
      const a = (bubble as any).animate(keyframes, {
        duration,
        iterations: Infinity,
        direction: 'alternate',
        easing: 'ease-in-out',
        delay: Math.floor(Math.random() * 800),
      }) as Animation

      a.pause()
      anims.push(a)

      window.setTimeout(() => {
        bubble.style.opacity = '1'
      }, i * 60)
    })

    // handlers to show/hide bubbles
    const show = () => {
      el.style.transition = 'opacity 700ms ease'
      el.style.opacity = '1'
      el.style.pointerEvents = 'auto'
      anims.forEach((a, idx) => {
        try {
          // small stagger for play
          window.setTimeout(() => a.play(), idx * 40)
        } catch {
          void 0
        }
      })
    }

    const hide = () => {
      el.style.transition = 'opacity 300ms ease'
      el.style.opacity = '0'
      el.style.pointerEvents = 'none'
      anims.forEach((a) => {
        try {
          a.pause()
        } catch {
          void 0
        }
      })
      // fade each bubble out quickly
      bubbleEls.forEach((b, i) => {
        window.setTimeout(() => {
          b.style.transition = 'opacity 300ms ease, transform 300ms ease'
          b.style.opacity = '0'
        }, i * 10)
      })
    }

    // start visible with animations playing
    el.style.opacity = '1'
    el.style.pointerEvents = 'auto'
    anims.forEach((a, idx) => window.setTimeout(() => a.play(), idx * 30))

    window.addEventListener('bubbles-show', show)
    window.addEventListener('bubbles-hide', hide)

    return () => {
      anims.forEach((a) => {
        try {
          a.cancel()
        } catch {
          void 0
        }
      })
      window.removeEventListener('bubbles-show', show)
      window.removeEventListener('bubbles-hide', hide)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, backgroundColor: '#8fedf3', zIndex: 0 }}
    >
      <div className="bubbles-container">
        {bubbles.map((b, i) => {
          const width = typeof b.style.width === 'number' ? `${b.style.width}px` : b.style.width
          const height = typeof b.style.height === 'number' ? `${b.style.height}px` : b.style.height
          const style: CSSProperties = { ...(b.style as CSSProperties), width, height, transition: 'transform 0.3s ease' }

          return (
            <div
              key={i}
              className={`bubble ${b.speed} ${b.delay}`}
              style={style}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1.2)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)'
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
