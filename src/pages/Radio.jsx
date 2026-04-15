import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';
import './Radio.css';

const Radio = () => {
  const [playing, setPlaying] = useState(false);
  const rainContainerRef = useRef(null);

  // Recuperamos tus corazones originales "heart-gem"
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
    <div className="love-universe">
      {/* CAPA DE FONDO: Tus corazones fluyendo detrás del video */}
      <div className="heart-rain-container background-hearts" ref={rainContainerRef}></div>

      <div className="multimedia-center">
        <Link to="/" className="back-btn-top">← VOLVER AL INICIO</Link>
        
        <div className="main-video-frame">
          {!playing ? (
            <div className="start-prompt" onClick={() => setPlaying(true)}>
              <div className="heart-icon-pulse">❤️</div>
              <h2>ENTRAR AL ENCUENTRO CON EL AMOR</h2>
              <p>Haz clic para conectar la señal en vivo</p>
            </div>
          ) : (
            <ReactPlayer 
              // ENLACE DIRECTO DE TU SEÑAL DE VIDEO
              url="https://live20.bozztv.com/akamaissh101/ssh101/fabulosaplay/playlist.m3u8"
              playing={playing}
              controls={true}
              width="100%"
              height="100%"
              config={{ file: { forceHLS: true } }}
            />
          )}
        </div>

        <div className="branding-section">
          <h1 className="main-title">Fabulosa Stereo</h1>
          <p className="sub-title">LA RADIO QUE ENAMORA TU VIDA</p>
        </div>
      </div>
    </div>
  );
};

export default Radio;