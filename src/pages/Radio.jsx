import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';
import './Radio.css';

const Radio = () => {
  const [playing, setPlaying] = useState(false);
  const rainContainerRef = useRef(null);

  useEffect(() => {
    const createHeart = () => {
      if (!rainContainerRef.current) return;
      const h = document.createElement('div');
      h.classList.add('heart-gem'); // Tus corazones originales
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
    <div className="love-universe">
      {/* Fondo de corazones gemas */}
      <div className="heart-rain-container bg-hearts" ref={rainContainerRef}></div>

      <div className="multimedia-card">
        <Link to="/" className="back-link">← SALIR</Link>
        
        <div className="video-container-prof">
          {!playing ? (
            <div className="tap-to-start" onClick={() => setPlaying(true)}>
              <div className="pulse-heart-icon">❤️</div>
              <h2>ENCUENTRO CON EL AMOR</h2>
              <p>Toca para conectar la señal de OBS</p>
            </div>
          ) : (
            <div className="player-wrapper">
              <ReactPlayer 
                // ENLACE HLS DE TU PANEL DE BOZZTV
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

        <div className="branding-area">
          <h1 className="radio-title">Fabulosa Stereo</h1>
          <p className="radio-slogan">EL ENCUENTRO CON EL AMOR</p>
        </div>
      </div>
    </div>
  );
};

export default Radio;