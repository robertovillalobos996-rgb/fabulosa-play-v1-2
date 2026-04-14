import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Radio.css';
import radioBg from '../assets/radio-bg.png';

const Radio = () => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const rainContainerRef = useRef(null);

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

  const toggleRadio = () => {
    const audio = audioRef.current;
    if (playing) {
        audio.pause();
        setPlaying(false);
    } else {
        // Reproducción directa sin bloqueos de ecualizador
        audio.play().then(() => {
            setPlaying(true);
        }).catch(error => {
            console.error("Error al reproducir:", error);
            alert("El navegador bloqueó el audio o el servidor de radio está apagado.");
        });
    }
  };

  return (
    <div className="radio-page-container" style={{ backgroundImage: `url(${radioBg})` }}>
        <Link to="/" className="back-btn">← VOLVER AL INICIO</Link>
        <div className="heart-rain-container" ref={rainContainerRef}></div>
        
        {/* ENLACE CORREGIDO: sapircast y sin crossOrigin */}
        <audio 
            ref={audioRef} 
            src="https://sapircast.caster.fm:19294/listen.mp3" 
            preload="none"
        ></audio>

        <div className="glass-player">
            <div className="eq-container">
                {/* Barras estáticas temporalmente para asegurar que el audio pase */}
                {[...Array(16)].map((_, i) => (
                    <div key={i} className="eq-bar" style={{ height: playing ? `${Math.random() * 80 + 20}%` : '5%' }}></div>
                ))}
            </div>
            <div className="play-container">
                <button className="btn-main" onClick={toggleRadio}
                    style={{ boxShadow: playing ? "0 0 80px rgba(255, 0, 50, 0.8)" : "0 10px 30px rgba(255, 0, 50, 0.5)" }}>
                    {playing ? "❚❚" : "▶"}
                </button>
            </div>
            <div className="vol-container">
                <div className="live-badge">EN VIVO</div>
                <input type="range" min="0" max="1" step="0.1" defaultValue="1" onInput={(e) => audioRef.current.volume = e.target.value} />
            </div>
        </div>
    </div>
  );
};

export default Radio;