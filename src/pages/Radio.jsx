import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';
import './Radio.css';

const Radio = () => {
  const [playing, setPlaying] = useState(false);
  const rainContainerRef = useRef(null);

  // Tus corazones originales (gemas) fluyendo al fondo
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
    <div className="radio-universe">
        {/* CAPA 1: Corazones (Z-Index: 1) */}
        <div className="heart-rain-container background-hearts" ref={rainContainerRef}></div>
        
        {/* CAPA 2: Contenido (Z-Index: 10) */}
        <div className="multimedia-container">
            <Link to="/" className="back-home">← INICIO</Link>
            
            <div className="video-player-frame">
                {!playing ? (
                    <div className="overlay-start" onClick={() => setPlaying(true)}>
                        <div className="heart-pulse-main">❤️</div>
                        <h2>TOCA PARA CONECTAR CON EL AMOR</h2>
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

            <div className="text-branding">
                <h1 className="main-name">Fabulosa Stereo</h1>
                <p className="slogan">LA RADIO QUE ENAMORA TU VIDA</p>
            </div>
        </div>
    </div>
  );
};

export default Radio;