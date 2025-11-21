import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

// Componente de cámara con acceso a getUserMedia
export default function CameraComponent() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string>('')
  const [photoTaken, setPhotoTaken] = useState<string>('')
  const [cameraActive, setCameraActive] = useState(false)

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
      }
      
      setStream(mediaStream)
      setCameraActive(true)
      setError('')
    } catch (err) {
      setError('No se pudo acceder a la cámara. Verifica los permisos.')
      console.error('Error accessing camera:', err)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
      setCameraActive(false)
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    const photoData = canvas.toDataURL('image/png')
    setPhotoTaken(photoData)
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-linear-to-br from-purple-900 via-blue-900 to-black flex flex-col items-center justify-center p-4 sm:p-8 overflow-y-auto">
      <div className="max-w-4xl w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Cámara</h1>
          <Link 
            to="/" 
            className="px-4 sm:px-6 py-2 sm:py-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-sm border border-white/20 text-sm sm:text-base"
          >
            ← Volver
          </Link>
        </div>

        <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
              {error}
            </div>
          )}

          <div className="relative mb-6">
            <video
              ref={videoRef}
              className="w-full rounded-2xl bg-black/50"
              autoPlay
              playsInline
              muted
              style={{ display: cameraActive ? 'block' : 'none' }}
            />
            
            {!cameraActive && !photoTaken && (
              <div className="w-full aspect-video bg-linear-to-br from-gray-800 to-gray-900 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <div className="text-center text-gray-400 px-4">
                  <svg className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-base sm:text-lg">La cámara no está activa</p>
                </div>
              </div>
            )}

            {photoTaken && !cameraActive && (
              <div className="relative">
                <img src={photoTaken} alt="Foto capturada" className="w-full rounded-xl sm:rounded-2xl" />
                <button
                  onClick={() => setPhotoTaken('')}
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all text-sm sm:text-base"
                >
                  ✕ Eliminar
                </button>
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          <div className="flex gap-3 sm:gap-4 justify-center flex-wrap">
            {!cameraActive ? (
              <button
                onClick={startCamera}
                className="px-6 py-3 sm:px-8 sm:py-4 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full font-semibold transition-all shadow-lg transform hover:scale-105 text-sm sm:text-base"
              >
                📸 Activar Cámara
              </button>
            ) : (
              <>
                <button
                  onClick={takePhoto}
                  className="px-6 py-3 sm:px-8 sm:py-4 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full font-semibold transition-all shadow-lg transform hover:scale-105 text-sm sm:text-base"
                >
                  📷 Tomar Foto
                </button>
                <button
                  onClick={stopCamera}
                  className="px-6 py-3 sm:px-8 sm:py-4 bg-linear-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-full font-semibold transition-all shadow-lg transform hover:scale-105 text-sm sm:text-base"
                >
                  ⏹ Detener Cámara
                </button>
              </>
            )}
          </div>

          {photoTaken && (
            <div className="mt-4 sm:mt-6 flex gap-3 sm:gap-4 justify-center">
              <a
                href={photoTaken}
                download="foto-capturada.png"
                className="px-5 py-2.5 sm:px-6 sm:py-3 bg-linear-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white rounded-full font-semibold transition-all text-sm sm:text-base"
              >
                💾 Descargar Foto
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
