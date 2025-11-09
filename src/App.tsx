import './App.css'
import BackgroundBubbles from './components/BackgroundBubbles'
import PlayButton from './components/PlayButton'
import AudioControl from './components/AudioControl'

function App() {
  return (
    <>
      <BackgroundBubbles />
      {/* content above background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <PlayButton onClick={() => console.log('Jugar presionado')} />
      </div>
      <AudioControl />
    </>
  )
}

export default App
