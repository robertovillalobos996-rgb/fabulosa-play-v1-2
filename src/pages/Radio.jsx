import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player'; // Necesitas instalarlo: npm install react-player
import './Radio.css';
import radioBg from '../assets/radio-bg.png';

const Radio = () => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const rainContainerRef = useRef(null);

  // Efecto de lluvia de corazones (Fuera del reproductor)
  useEffect(() => {
    const createHeart = () => {
      if (!rainContainerRef.current) return;
      const h = document.createElement('div');
      h.classList.add('heart-gem');
      h.style.left = Math.random() * 100 + "vw";
      h.style.animationDuration = Math.random() * 4 + 6 + "s";
      let size = Math.random() * 15 + 15; 
      h.style.width = size + "px"; h.style.height = size + "px";
      rainContainerRef.current.appendChild(h);
      setTimeout(() => h.remove(), 10000);
    };
    const interval = setInterval(createHeart, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="radio-page-container" style={{ backgroundImage: `url(${radioBg})` }}>
        {/* Lluvia de corazones romántica en toda la página */}
        <div className="heart-rain-container" ref={rainContainerRef}></div>
        
        <Link to="/" className="back-btn">← VOLVER AL INICIO</Link>

        <div className="glass-player multimedia-player">
            <div className="video-screen">
                {/* REPRODUCTOR MULTIMEDIA PROFESIONAL */}
                <ReactPlayer 
                    url="https://live20.bozztv.com/akamaissh101/ssh101/fabulosaplay/playlist.m3u8"
                    playing={playing}
                    volume={volume}
                    width="100%"
                    height="100%"
                    controls={true} // Activa volumen, pantalla completa y Cast (Bluetooth/AirPlay)
                    config={{
                        file: {
                            forceHLS: true,
                            attributes: {
                                controlsList: 'nodownload' // Seguridad
                            }
                        }
                    }}
                />
                {!playing && <div className="overlay-live">RADIO FABULOSA EN VIVO</div>}
            </div>

            <div className="info-radio">
                <h2 className="title-live">Fabulosa Stereo - La Romántica</h2>
                <div className="status-badge">● TRANSMITIENDO MULTIMEDIA</div>
            </div>

            <div className="custom-controls">
                <button 
                    className="btn-play-pause" 
                    onClick={() => setPlaying(!playing)}
                >
                    {playing ? "❚❚ PAUSAR" : "▶ REPRODUCIR VIVO"}
                </button>
                
                <div className="volume-group">
                    <span>🔈</span>
                    <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.1" 
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))} 
                    />
                    <span>🔊</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Radio;