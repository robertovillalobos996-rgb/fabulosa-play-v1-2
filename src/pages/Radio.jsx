import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';
import './Radio.css';

const Radio = () => {
  const [playing, setPlaying] = useState(false);
  const heartsContainer = useRef(null);

  // Generador de corazones para TODO el fondo
  useEffect(() => {
    const addHeart = () => {
      if (!heartsContainer.current) return;
      const h = document.createElement('div');
      h.className = 'romantic-heart';
      h.innerHTML = '❤️';
      h.style.left = Math.random() * 100 + 'vw';
      h.style.animationDuration = Math.random() * 3 + 4 + 's';
      h.style.fontSize = Math.random() * 20 + 20 + 'px';
      heartsContainer.current.appendChild(h);
      setTimeout(() => h.remove(), 7000);
    };
    const timer = setInterval(addHeart, 300);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="love-center-container">
      {/* CAPA DE FONDO: Corazones por todos lados */}
      <div className="hearts-layer" ref={heartsContainer}></div>

      {/* CAPA FRONTAL: Tu Canal Multimedia */}
      <div className="main-stage">
        <Link to="/" className="back-link">← INICIO</Link>
        
        <div className="multimedia-frame">
          {!playing ? (
            <div className="click-to-love" onClick={() => setPlaying(true)}>
              <div className="big-heart-pulse">❤️</div>
              <h2>Toca para entrar al Encuentro con el Amor</h2>
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
        
        <h1 className="station-title">Fabulosa Stereo</h1>
        <p className="station-tagline">La Radio que Enamora tu Vida</p>
      </div>
    </div>
  );
};

export default Radio;