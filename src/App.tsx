// src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CameraComponent from './features/camera/CameraComponent'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        {/* CORRECCIÓN AQUÍ: */}
        {/* Le pasamos chaosLevel={0} para que la cámara se vea limpia por defecto */}
        <Route path="/camera" element={<CameraComponent chaosLevel={0} />} />
      </Routes>
    </BrowserRouter>
  )
}