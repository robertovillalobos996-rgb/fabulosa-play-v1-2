import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';
import './Radio.css';

const Radio = () => {
  const [playing, setPlaying] = useState(false);
  const rainContainerRef = useRef(null);

  // Lógica de tus corazones originales (heart-gem)
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
    <div className="love-main-screen">
      {/* CAPA 1: Corazones por toda la pantalla al fondo */}
      <div className="heart-rain-container background-layer" ref={rainContainerRef}></div>

      {/* CAPA 2: Contenido Central Profesional */}
      <div className="center-content">
        <Link to="/" className="nav-back">← VOLVER AL INICIO</Link>
        
        <div className="player-professional-frame">
          {!playing ? (
            <div className="start-experience" onClick={() => setPlaying(true)}>
              <div className="main-heart-beat">❤️</div>
              <h2>CONECTAR CON EL AMOR</h2>
              <p>Haz clic para abrir la señal en vivo</p>
            </div>
          ) : (
            <ReactPlayer 
              url="https://live20.bozztv.com/akamaissh101/ssh101/fabulosaplay/playlist.m3u8"
              playing={playing}
              controls={true}
              width="100%"
              height="100%"
              config={{ file: { forceHLS: true } }}
            />
          )}
        </div>

        <div className="branding-footer">
          <h1 className="title-fabulosa">Fabulosa Stereo</h1>
          <p className="subtitle-fabulosa">EL ENCUENTRO CON EL AMOR</p>
        </div>
      </div>
    </div>
  );
};

export default Radio;