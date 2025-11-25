// src/features/bubbles/useBubblesVisible.ts
import { useEffect, useState } from 'react'

export function useBubblesVisible(initial = true) {
  const [visible, setVisible] = useState(initial)

  useEffect(() => {
    const hide = () => setVisible(false)
    const show = () => setVisible(true)

    window.addEventListener('bubbles-hide', hide)
    window.addEventListener('bubbles-show', show)

    return () => {
      window.removeEventListener('bubbles-hide', hide)
      window.removeEventListener('bubbles-show', show)
    }
  }, [])

  return visible
}
