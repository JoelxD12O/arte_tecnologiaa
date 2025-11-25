// src/features/reel/videoPlaylist.ts

// Usamos una función auxiliar para importar dinámicamente si estás usando Vite
// O simplemente construimos las URLs directas.

export const videoPlaylist = [
  // Lote 1: Minúsculas (.mp4)
  new URL('../../media/video1.mp4', import.meta.url).href,
  new URL('../../media/video2.mp4', import.meta.url).href,
  new URL('../../media/video3.mp4', import.meta.url).href,
  new URL('../../media/video4.mp4', import.meta.url).href,
  new URL('../../media/video5.mp4', import.meta.url).href,
  new URL('../../media/video6.mp4', import.meta.url).href,
  new URL('../../media/video7.mp4', import.meta.url).href,

  // Lote 2: Mayúsculas (.MP4) - ¡Cuidado aquí!
  new URL('../../media/video8.MP4', import.meta.url).href,
  new URL('../../media/video9.MP4', import.meta.url).href,
  new URL('../../media/video10.MP4', import.meta.url).href,
  new URL('../../media/video11.MP4', import.meta.url).href,
  new URL('../../media/video12.MP4', import.meta.url).href,
  new URL('../../media/video13.MP4', import.meta.url).href,
  new URL('../../media/video14.MP4', import.meta.url).href,
  new URL('../../media/video15.MP4', import.meta.url).href,
  new URL('../../media/video16.MP4', import.meta.url).href,
  new URL('../../media/video17.MP4', import.meta.url).href,
  new URL('../../media/video18.MP4', import.meta.url).href,
];