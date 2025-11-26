import { useEffect, useState } from 'react'

const CHAOS_KEY = 'app_chaos_level'
const CHAOS_TIMESTAMP_KEY = 'app_chaos_timestamp'

export function useChaosSync() {
  const [chaosLevel, setChaosLevel] = useState(0)

  // Leer el nivel de caos del localStorage al iniciar
  useEffect(() => {
    const storedChaos = localStorage.getItem(CHAOS_KEY)
    const storedTimestamp = localStorage.getItem(CHAOS_TIMESTAMP_KEY)
    
    if (storedChaos && storedTimestamp) {
      const savedChaos = parseInt(storedChaos)
      const savedTime = parseInt(storedTimestamp)
      const now = Date.now()
      const elapsed = Math.floor((now - savedTime) / 1000) // segundos transcurridos
      
      // Si han pasado menos de 60 segundos, recuperar el estado
      if (elapsed < 60) {
        setChaosLevel(savedChaos)
      } else {
        // Si pasó mucho tiempo, reiniciar
        localStorage.removeItem(CHAOS_KEY)
        localStorage.removeItem(CHAOS_TIMESTAMP_KEY)
      }
    }
  }, [])

  // Escuchar cambios en el localStorage (sincronización entre páginas)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CHAOS_KEY && e.newValue) {
        setChaosLevel(parseInt(e.newValue))
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Función para incrementar el caos
  const incrementChaos = () => {
    setChaosLevel(prev => {
      const newLevel = prev + 1
      localStorage.setItem(CHAOS_KEY, newLevel.toString())
      localStorage.setItem(CHAOS_TIMESTAMP_KEY, Date.now().toString())
      return newLevel
    })
  }

  // Función para resetear el caos
  const resetChaos = () => {
    setChaosLevel(0)
    localStorage.removeItem(CHAOS_KEY)
    localStorage.removeItem(CHAOS_TIMESTAMP_KEY)
  }

  return { chaosLevel, incrementChaos, resetChaos, setChaosLevel }
}
