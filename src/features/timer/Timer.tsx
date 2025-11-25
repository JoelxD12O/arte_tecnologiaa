import { useState, useEffect } from 'react'

export default function Timer({ chaosLevel = 0 }: { chaosLevel?: number }) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    // FÓRMULA DE ACELERACIÓN DEL TIEMPO:
    // Nivel 0: 1000ms (Normal)
    // Nivel 10: 100ms (10x más rápido)
    // Nivel 20: 50ms (Demencia)
    const speed = Math.max(50, 1000 / (1 + chaosLevel * 0.5));
    
    const interval = setInterval(() => {
      setSeconds(s => s + 1)
    }, speed)

    return () => clearInterval(interval)
  }, [chaosLevel])

  const formatTime = (totalSeconds: number) => {
    // Si el caos es muy alto, mostramos horas falsas para asustar
    if (chaosLevel > 15) {
        return `${Math.floor(totalSeconds / 3600)}:${Math.floor((totalSeconds % 3600)/60).toString().padStart(2,'0')}:${(totalSeconds % 60).toString().padStart(2,'0')}`
    }
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
    const s = (totalSeconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  let styleClass = "text-black"
  let containerClass = "bg-[#ffff00] border-black"

  // La ansiedad visual depende del tiempo "percibido"
  if (seconds > 60 || chaosLevel > 5) {
    styleClass = "text-black font-bold"
    containerClass = "bg-orange-400 border-black animate-pulse"
  } 
  if (seconds > 120 || chaosLevel > 10) {
    styleClass = "text-white font-black animate-ping"
    containerClass = "bg-red-600 border-white animate-bounce shadow-[0_0_20px_red]"
  }

  return (
    <div className={`px-4 py-1 rounded-full border-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all duration-300 ${containerClass}`}>
      <span className={`font-mono text-xl tracking-widest ${styleClass}`}>
        {formatTime(seconds)}
      </span>
    </div>
  )
}