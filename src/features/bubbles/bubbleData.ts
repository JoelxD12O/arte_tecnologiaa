// src/features/bubbles/bubbleData.ts

export interface Bubble {
  x: number
  y: number
  delay: number
  size: number
}

export const bubbles: Bubble[] = Array.from({ length: 42 }).map(() => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 4,
  size: 10 + Math.random() * 80
}))
