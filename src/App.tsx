import './App.css';
import { useState } from 'react';
import BackgroundBubbles from './components/BackgroundBubbles';
import AudioControl from './components/AudioControl';
import ReelComponent from './components/ReelComponent';
import PlayButton from './components/PlayButton';

function App() {
  const [isBlackBackground, setIsBlackBackground] = useState(false);

  return (
    <div className={`min-h-screen ${isBlackBackground ? 'bg-black' : 'bg-transparent'}`}>
      {!isBlackBackground && <BackgroundBubbles />}
      <AudioControl />
      <div className="relative top-10">
          <ReelComponent />
      </div>


      <div className="mt-[250px] text-center">
        <PlayButton onClick={() => setIsBlackBackground(!isBlackBackground)} />
      </div>
          
    </div>
  );
}

export default App;
