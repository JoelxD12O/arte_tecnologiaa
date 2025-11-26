import { useEffect, useState } from 'react'

const CHAOS_KEY = 'app_chaos_level'
const CHAOS_TIMESTAMP_KEY = 'app_chaos_timestamp'

export function useChaosSync() {
  const [chaosLevel, setChaosLevel] = useState(0)

  // Cargar el estado inicial
  useEffect(() => {
    const storedChaos = localStorage.getItem(CHAOS_KEY)
    const storedTimestamp = localStorage.getItem(CHAOS_TIMESTAMP_KEY)
    
    if (storedChaos && storedTimestamp) {
      const savedChaos = parseInt(storedChaos)
      const savedTime = parseInt(storedTimestamp)
      const now = Date.now()
      const elapsed = Math.floor((now - savedTime) / 1000) // segundos transcurridos
      
      if (elapsed < 60) {
        setChaosLevel(savedChaos)
      } else {
        localStorage.removeItem(CHAOS_KEY)
        localStorage.removeItem(CHAOS_TIMESTAMP_KEY)
      }
    }
  }, [])

  // Escuchar cambios en localStorage (solo funciona entre pestañas diferentes)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CHAOS_KEY) {
        if (e.newValue) {
          setChaosLevel(parseInt(e.newValue))
        } else {
          // Si se eliminó la key, resetear a 0
          setChaosLevel(0)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Polling para detectar cambios en la misma pestaña
  useEffect(() => {
    const checkLocalStorage = () => {
      const storedChaos = localStorage.getItem(CHAOS_KEY)
      if (storedChaos) {
        const newChaos = parseInt(storedChaos)
        setChaosLevel(newChaos)
      } else {
        // Si no existe la key, es porque se reseteó
        setChaosLevel(0)
      }
    }

    // Verificar cada 500ms
    const interval = setInterval(checkLocalStorage, 500)
    return () => clearInterval(interval)
  }, [])

  const incrementChaos = () => {
    setChaosLevel(prev => {
      const newLevel = prev + 1
      localStorage.setItem(CHAOS_KEY, newLevel.toString())
      localStorage.setItem(CHAOS_TIMESTAMP_KEY, Date.now().toString())
      return newLevel
    })
  }

  const resetChaos = () => {
    setChaosLevel(0)
    localStorage.removeItem(CHAOS_KEY)
    localStorage.removeItem(CHAOS_TIMESTAMP_KEY)
  }

  return { chaosLevel, incrementChaos, resetChaos, setChaosLevel }
}
