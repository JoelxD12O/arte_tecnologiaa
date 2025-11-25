import { useState } from 'react'

export function useAudioPlayer() {
  const [muted, setMuted] = useState(false)
  
  // Variables dummy para compatibilidad si algún componente viejo las pide
  const autoplayBlocked = false 

  const toggleMute = () => {
    setMuted(!muted)
    // Nota: Por ahora esto solo cambia el icono visualmente.
    // El sonido de los videos se controla independientemente en ReelComponent.
  }

  const enableAudioFromHint = () => {
    // No hace nada porque ya matamos el tutorial
  }

  return { 
    muted, 
    autoplayBlocked, 
    toggleMute, 
    enableAudioFromHint 
  }
}