import React, { useState, useEffect } from 'react';

const Timer: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const startHandler = () => {
      setIsRunning(true);
      setTime(0);
    };

    const stopHandler = () => {
      setIsRunning(false);
      setTime(0);
    };

    const bonusHandler = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail.seconds === 'number') {
        setTime((prev) => prev + customEvent.detail.seconds);
      }
    };

    window.addEventListener('reel-play', startHandler);
    window.addEventListener('reel-stop', stopHandler);
    window.addEventListener('timer-bonus', bonusHandler);

    return () => {
      window.removeEventListener('reel-play', startHandler);
      window.removeEventListener('reel-stop', stopHandler);
      window.removeEventListener('timer-bonus', bonusHandler);
    };
  }, []);

  useEffect(() => {
    let interval: number | undefined;
    if (isRunning) {
      interval = window.setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  if (!isRunning) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="fixed top-4 left-4 z-[9999] px-4 py-2 rounded-full backdrop-blur-md bg-black/30 border border-white/10 text-white font-mono text-xl shadow-lg transition-all duration-300 animate-fade-in"
      style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
    >
      {formatTime(time)}
    </div>
  );
};

export default Timer;
