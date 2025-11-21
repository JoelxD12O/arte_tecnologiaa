import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import CameraComponent from './components/CameraComponent'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/camera" element={<CameraComponent />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
