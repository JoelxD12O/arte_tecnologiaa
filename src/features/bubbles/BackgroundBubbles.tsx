// src/features/bubbles/BackgroundBubbles.tsx

import { useEffect, useState } from 'react'

const FRASES = [
  "SIGUE", "CONSUMIR", "MÁS", "NO PARES", "UNO MÁS",
  "Cerebro vacío", "Dopamina", "SCROLL", "Más contenido",
  "No pienses", "SIGUE BAJANDO", "Vacío", "Sin sentido",
  "¿Qué haces?", "Perdido", "CONSUMIR MÁS", "Sigue...",
  "Otro más", "VACÍO", "Sin parar", "Más y más", "SIGUE",
  "Zombi digital", "Cerebro OFF", "CONSUMIR", "MÁS MÁS MÁS"
]

const EMOJIS = ["👁️", "🧠", "💀", "🧟", "😵", "😵‍💫", "👻", "💉", "🔴", "⚠️", "❌"]

interface FloatingItem {
  id: number
  text: string
  left: number
  top: number
  size: number
  duration: number
  delay: number
  isEmoji: boolean
  animType: number
}

export default function BackgroundBubbles({ chaosLevel = 0 }: { chaosLevel?: number }) {
  const [items, setItems] = useState<FloatingItem[]>([])

  useEffect(() => {
    // Más caos = Más elementos (hasta saturar la pantalla)
    const count = 20 + (chaosLevel * 6); // Más elementos

    const newItems = Array.from({ length: count }).map((_, i) => ({
      id: i,
      text: Math.random() > 0.3
        ? FRASES[Math.floor(Math.random() * FRASES.length)]
        : EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      left: Math.random() * 95,
      top: Math.random() * 95,
      size: Math.random() * (1.5 + chaosLevel * 0.1) + 1,

      // --- AQUÍ ESTÁ EL CAMBIO DE VELOCIDAD ---
      // Antes: 20-40s (Lento) -> Ahora: 3-8s (Rápido)
      // Restamos el chaosLevel para que se vuelvan frenéticos al final
      duration: Math.max(2, (Math.random() * 6 + 4) - (chaosLevel * 0.3)),

      delay: Math.random() * -10,
      isEmoji: Math.random() <= 0.4,
      animType: Math.floor(Math.random() * 5) // 5 tipos de movimiento
    }))
    setItems(newItems)
  }, [chaosLevel])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {items.map((item) => (
        <div
          key={item.id}
          className={`absolute whitespace-nowrap font-bold select-none
            ${item.isEmoji ? 'filter drop-shadow-md' : 'font-mono tracking-tighter uppercase'}
            ${chaosLevel > 12 ? 'animate-pulse' : ''}
          `}
          style={{
            left: `${item.left}%`,
            top: `${item.top}%`,
            fontSize: `${item.size}rem`,
            animation: `float-${item.animType} ${item.duration}s infinite alternate ease-in-out`,
            // Progresión de colores según caos: negro -> rojo -> rojo brillante
            color: item.isEmoji ? undefined :
              chaosLevel > 15 ? '#ff0000' :
              chaosLevel > 10 ? '#cc0000' :
              chaosLevel > 5 ? '#990000' : '#000000',
            opacity: chaosLevel > 10 ? 0.9 : 0.6,
            textShadow: chaosLevel > 12 ? '0 0 10px rgba(255,0,0,0.8)' : 'none',
            fontWeight: chaosLevel > 10 ? 900 : 700
          }}
        >
          {item.text}
        </div>
      ))}

      {/* DEFINIMOS RUTAS DE MOVIMIENTO "LIBRES"
         (Arriba, Abajo, Izquierda, Derecha, Diagonales)
         Aumenté los píxeles (px) para que se muevan más distancia.
      */}
      <style>{`
        @keyframes float-0 {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(100px, 100px) rotate(10deg); }
        }
        @keyframes float-1 {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(-150px, 50px) rotate(-10deg); }
        }
        @keyframes float-2 {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(50px, -150px) rotate(5deg); }
        }
        @keyframes float-3 {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(-100px, -100px) rotate(-5deg); }
        }
        @keyframes float-4 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(0px, 200px) scale(1.2); } /* Caída vertical */
        }
      `}</style>
    </div>
  )
}