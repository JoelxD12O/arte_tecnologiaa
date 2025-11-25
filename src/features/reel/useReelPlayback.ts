// src/features/reel/useReelPlayback.ts

import { useRef, useState } from 'react'
import { videoPlaylist } from './videoPlaylist'

interface VideoItem {
  id: string
  src: string
  style: React.CSSProperties
  isMain: boolean
}

export function useReelPlayback() {
  const [videos, setVideos] = useState<VideoItem[]>([])
  const indexRef = useRef(0)

  const addNextVideo = (isFirst = false) => {
    const idx = indexRef.current % videoPlaylist.length
    const src = videoPlaylist[idx]
    const newId = Math.random().toString(36).substring(2)

    // Estilo para el video NUEVO (Entra desde abajo)
    // Si es el primero, aparece directo. Si no, entra con animación.
    const entryStyle: React.CSSProperties = {
      position: 'absolute',
      top: 0, left: 0, width: '100%', height: '100%',
      objectFit: 'cover',
      zIndex: 10,
      opacity: isFirst ? 1 : 0, // Truco: Empieza invisible y se anima en el componente
      transform: isFirst ? 'translateY(0)' : 'translateY(100%)', // Entra desde abajo
      transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
    }

    const newVideo: VideoItem = {
      id: newId,
      src,
      style: entryStyle,
      isMain: true
    }

    setVideos(prev => {
      // LOGICA DE LIMPIEZA:
      // 1. El video que ERA principal ahora se va para arriba y se apaga
      const oldVideos = prev.map(v => ({
        ...v,
        isMain: false,
        style: {
          ...v.style,
          transform: 'translateY(-100%) scale(0.9)', // Se va para arriba y se encoge un poco
          opacity: 0.5,
          zIndex: 0,
          transition: 'all 0.5s ease-out'
        }
      }))

      // 2. Mantenemos solo los últimos 2 videos (El nuevo y el que se acaba de ir)
      // Así no se llena la memoria ni la pantalla de basura visual.
      const cleanList = [...oldVideos, newVideo].slice(-2);
      
      return cleanList;
    })

    indexRef.current++
  }

  const clearVideos = () => {
    setVideos([])
    indexRef.current = 0
  }

  return { videos, addNextVideo, clearVideos }
}