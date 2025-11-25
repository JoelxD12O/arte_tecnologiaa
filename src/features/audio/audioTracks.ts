export interface AudioTrack {
  file: string
  text: string
}

// Lista con un elemento vacío para evitar errores de "undefined"
export const audioTracks: AudioTrack[] = [
  { 
    file: '', 
    text: '' 
  }
]