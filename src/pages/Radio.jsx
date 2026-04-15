import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';
import './Radio.css';

const Radio = () => {
  const [playing, setPlaying] = useState(false);
  const rainContainerRef = useRef(null);

  // Tus corazones originales (heart-gem)
  useEffect(() => {
    const createHeart = () => {
      if (!rainContainerRef.current) return;
      const h = document.createElement('div');
      h.classList.add('heart-gem');
      h.style.left = Math.random() * 100 + "vw";
      h.style.animationDuration = Math.random() * 4 + 6 + "s";
      let size = Math.random() * 20 + 20; 
      h.style.width = size + "px"; h.style.height = size + "px";
      rainContainerRef.current.appendChild(h);
      setTimeout(() => h.remove(), 10000);
    };
    const interval = setInterval(createHeart, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="radio-main-layout">
      {/* Fondo de corazones detrás de todo */}
      <div className="heart-rain-container bg-layer" ref={rainContainerRef}></div>

      <div className="content-frame">
        <Link to="/" className="exit-link">← SALIR</Link>
        
        <div className="video-card-professional">
          {!playing ? (
            <div className="play-overlay" onClick={() => setPlaying(true)}>
              <div className="giant-heart-pulse">❤️</div>
              <h2>ENCUENTRO CON EL AMOR</h2>
              <p>Haz clic para ver la transmisión en vivo</p>
            </div>
          ) : (
            <div className="player-wrapper">
              <ReactPlayer 
                url="https://live20.bozztv.com/akamaissh101/ssh101/fabulosaplay/playlist.m3u8"
                playing={playing}
                controls={true}
                width="100%"
                height="100%"
                config={{ file: { forceHLS: true } }}
              />
            </div>
          )}
        </div>

        <div className="station-info">
          <h1 className="main-title">Fabulosa Stereo</h1>
          <p className="slogan-text">EL ENCUENTRO CON EL AMOR</p>
        </div>
      </div>
    </div>
  );
};

export default Radio;