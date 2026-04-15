import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Radio.css';

const STREAM_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosaplay/playlist.m3u8";

const Radio = () => {
  const videoRef = useRef(null);
  const rainContainerRef = useRef(null);
  const [oyentes, setOyentes] = useState(150);

  // Contador de oyentes dinámico (Base 150 + reales)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simula pequeñas variaciones reales sobre la base de 150
      setOyentes(150 + Math.floor(Math.random() * 12));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Lluvia de corazones (Tu diseño original)
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

  // Lógica de Video con BUFFER OPTIMIZADO
  useEffect(() => {
    let hls;
    const initPlayer = () => {
      const video = videoRef.current;
      if (!video) return;
      
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = STREAM_URL;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          // CONFIGURACIÓN ANTI-TRABAS (BUFFER)
          enableWorker: true,
          lowLatencyMode: false, // Desactivado para priorizar fluidez sobre retraso
          backBufferLength: 60,
          maxBufferLength: 30, // Guarda 30 segundos de video para que no se pegue
          maxMaxBufferLength: 60,
          appendErrorMaxRetry: 10
        });
        hls.loadSource(STREAM_URL);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => console.log("Autoplay bloqueado, requiere clic"));
        });
      }
    };

    if (!window.Hls) {
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
      script.onload = initPlayer;
      document.body.appendChild(script);
    } else {
      initPlayer();
    }
    return () => { if (hls) hls.destroy(); };
  }, []);

  return (
    <div className="love-universe">
      <div className="heart-rain-container bg-hearts" ref={rainContainerRef}></div>

      <div className="multimedia-card">
        <Link to="/" className="back-link">← SALIR</Link>
        
        <div className="video-container-prof">
          <video 
            ref={videoRef} 
            className="video-canvas block"
            controls 
            autoPlay
            muted={false} // Cámbialo a true si el navegador te bloquea el arranque
            playsInline
          />
        </div>

        <div className="branding-area">
          <h1 className="radio-title">Fabulosa Stereo</h1>
          <p className="radio-slogan">EL ENCUENTRO CON EL AMOR</p>
          
          {/* Contador de Conectados */}
          <div className="live-counter">
             <span className="dot"></span> EN VIVO: {oyentes} CONECTADOS
          </div>
        </div>
      </div>
    </div>
  );
};

export default Radio;