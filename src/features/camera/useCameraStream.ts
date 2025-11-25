// src/features/camera/useCameraStream.ts
import { useEffect, useState } from 'react'

export function useCameraStream(videoId: string) {
  const [available, setAvailable] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        console.log("Intentando acceder a la cámara...");
        
        // Pedimos acceso a la cámara
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'user',
            width: { ideal: 640 }, // Usamos ideal para ser más flexibles
            height: { ideal: 480 } 
          },
          audio: false
        })

        console.log("Cámara accedida, buscando elemento de video:", videoId);
        
        const videoElement = document.getElementById(videoId) as HTMLVideoElement
        
        if (videoElement) {
          videoElement.srcObject = stream
          // IMPORTANTE: play() es una promesa, hay que esperar a que no falle
          await videoElement.play().catch(e => console.error("Error al reproducir:", e));
          setAvailable(true)
        } else {
          console.error(`No se encontró el elemento <video id="${videoId}">`);
        }

      } catch (err) {
        console.error('Error de acceso a la cámara:', err)
        setAvailable(false)
        setError(String(err))
      }
    }

    // Un pequeño timeout ayuda a asegurar que el DOM ya pintó el <video>
    const timer = setTimeout(startCamera, 100);

    return () => {
      clearTimeout(timer);
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [videoId])

  return { available, error }
}