import { useEffect, useRef, useState } from 'react'

// Control de audio: lista, autoplay y mute
export default function AudioControl() {
  const tracks = [
    { file: 'vamosacomenzar.mp3', text: 'Hola, ¿estás listo para jugar? Vamos a comenzar.' },
    { file: 'clip02.mp3', text: 'Solo toca el botón cuando quieras. No hay prisa.' },
    { file: 'clip03.mp3', text: 'Si te sientes bien, toca otra vez.' },
    { file: 'clip03b.mp3', text: 'Está bien si quieres hacer una pausa.' },
    { file: 'clip04.mp3', text: 'Recuerda, no tienes que tocar rápido, solo toca cuando quieras.' },
    { file: 'clip05.mp3', text: '¿Vas bien? ¡Muy bien! Si quieres más, toca el botón otra vez.' },
    { file: 'clip06.mp3', text: 'Si te sientes un poquito cansado, está bien. Puedes descansar.' },
    { file: 'clip07.mp3', text: 'Toca el botón si quieres seguir jugando.' },
    { file: 'clip08.mp3', text: '¡Lo estás haciendo genial!' },
    { file: 'clip09.mp3', text: 'Mira, el color cambia un poquito. Eso significa que estás haciendo un gran trabajo.' },
    { file: 'clip10.mp3', text: 'Ahora, si prefieres parar, solo toca el botón otra vez.' },
    { file: 'clip11.mp3', text: 'Todo está bien. Respira profundo, ¡y vuelve a jugar cuando quieras!' },
    { file: 'clip12.mp3', text: 'Cuando la pantalla se calme, es tu momento para descansar un poco.' },
    { file: 'clip13.mp3', text: 'Tú decides cuándo parar o seguir. ¡Eso es lo divertido!' },
    { file: 'clip14.mp3', text: 'Recuerda, descansar es tan importante como jugar.' },
    { file: 'clip15.mp3', text: 'Cada vez que tocas el botón, estás aprendiendo algo nuevo. ¡Qué bien lo haces!' },
    { file: 'clip16.mp3', text: 'Si alguna vez quieres terminar, solo toca el botón de "Reiniciar".' },
    { file: 'clip17.mp3', text: '¡Muy bien! ¡Vamos, sigue toc' }
  ]

  const audioRefs = useRef<HTMLAudioElement[]>([])
  const indexRef = useRef(0)
  const userInteractedRef = useRef(false)
  const [muted, setMuted] = useState<boolean>(() => {
    try { return localStorage.getItem('audio-muted') === '1' } catch { return false }
  })
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)
  const playIndex = (i: number) => {
    const list = audioRefs.current
    if (!list || list.length === 0) return Promise.resolve(false)
    const idx = i % list.length
    const audio = list[idx]
    indexRef.current = (idx + 1) % list.length

  list.forEach((a) => { try { if (a !== audio) { a.pause(); a.currentTime = 0 } } catch { void 0 } })

    try {
      audio.currentTime = 0
      audio.muted = muted
      const p = audio.play()
      if (p && typeof p.then === 'function') {
        return p.then(() => true).catch(() => {
          return false
        })
      }
      return Promise.resolve(true)
    } catch {
      return Promise.resolve(false)
    }
  }

  useEffect(() => {
    
    audioRefs.current = tracks.map((t) => {
      const a = new Audio('/' + t.file)
      a.preload = 'auto'
      a.muted = muted
      return a
    })

    const handler = () => {
      userInteractedRef.current = true
      playNext()
      
      setAutoplayBlocked(false)
    }
    window.addEventListener('play-next-audio', handler)

    const welcomeTimer = window.setTimeout(() => {
      playIndex(0).then((ok) => {
        if (!ok) setAutoplayBlocked(true)
      })
    }, 2000)

    let fallbackInterval: number | null = null
    const fallbackTimeout = window.setTimeout(() => {
      if (!userInteractedRef.current) {
        playIndex(1).then(() => {
          
        })
        
        fallbackInterval = window.setInterval(() => {
          if (!userInteractedRef.current) {
            playIndex(1)
          } else if (fallbackInterval != null) {
            window.clearInterval(fallbackInterval)
            fallbackInterval = null
          }
        }, 5000)
      }
    }, 5000)

    return () => {
      window.removeEventListener('play-next-audio', handler)
      window.clearTimeout(welcomeTimer)
      window.clearTimeout(fallbackTimeout)
      if (fallbackInterval != null) window.clearInterval(fallbackInterval)
  audioRefs.current.forEach((a) => { try { a.pause(); a.src = '' } catch { void 0 } })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    audioRefs.current.forEach((a) => { try { a.muted = muted } catch { void 0 } })
    try { localStorage.setItem('audio-muted', muted ? '1' : '0') } catch { void 0 }
  }, [muted])

  const playNext = () => {
    const list = audioRefs.current
    if (!list || list.length === 0) return

    const idx = indexRef.current % list.length
    const audio = list[idx]
    indexRef.current = (idx + 1) % list.length

  list.forEach((a) => { try { if (a !== audio) { a.pause(); a.currentTime = 0 } } catch { void 0 } })

    try {
      audio.currentTime = 0
      audio.muted = muted
      const playPromise = audio.play()
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.catch(() => { void 0 })
      }
    } catch { void 0 }
  }

  const toggleMute = () => setMuted((m) => !m)
  const enableAudioFromHint = async () => {
    try {
      setMuted(false)
      userInteractedRef.current = true
      const ok = await playIndex(0)
      if (ok) setAutoplayBlocked(false)
    } catch { void 0 }
  }

  return (
    <div style={{ position: 'fixed', left: 18, bottom: 18, zIndex: 30, pointerEvents: 'auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
        
        {autoplayBlocked && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.95)', padding: '8px 12px', borderRadius: 10, boxShadow: '0 6px 18px rgba(3,15,26,0.12)' }}>
              <div style={{ fontSize: 13, color: '#072126' }}>Toca para habilitar el sonido</div>
            </div>
            <button onClick={enableAudioFromHint} style={{ height: 36, padding: '0 12px', borderRadius: 10, border: 'none', background: '#06b6d4', color: '#fff' }}>
              Habilitar
            </button>
          </div>
        )}

        <button
        aria-pressed={!muted}
        aria-label={muted ? 'Unmute audio' : 'Mute audio'}
        onClick={toggleMute}
        style={{
          width: 56,
          height: 56,
          borderRadius: 12,
          border: 'none',
          background: 'rgba(255,255,255,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 18px rgba(3,15,26,0.12)'
        }}
      >
        
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 9v6h4l5 4V5L9 9H5z" fill="#072126" />
          {!muted && (
            <path d="M16.5 8.5a4 4 0 010 7" stroke="#072126" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          )}
          {!muted && (
            <path d="M18.5 6.5a7 7 0 010 11" stroke="#072126" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9" />
          )}
          {muted && (
            <line x1="19" y1="5" x2="23" y2="9" stroke="#b22" strokeWidth="1.6" strokeLinecap="round" />
          )}
        </svg>
      </button>
      </div>
    </div>
  )
}
