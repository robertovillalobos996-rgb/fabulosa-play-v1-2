import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Radio.css';

const STREAM_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosaplay/playlist.m3u8";

const Radio = () => {
  const videoRef = useRef(null);
  const rainRef = useRef(null);
  const [oyentes, setOyentes] = useState(150);

  useEffect(() => {
    const interval = setInterval(() => setOyentes(150 + Math.floor(Math.random() * 20)), 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const createHeart = () => {
      if (!rainRef.current) return;
      const h = document.createElement('div');
      h.className = 'heart-gem';
      h.style.left = Math.random() * 100 + "vw";
      h.style.animationDuration = Math.random() * 3 + 6 + "s";
      rainRef.current.appendChild(h);
      setTimeout(() => h.remove(), 9000);
    };
    const interval = setInterval(createHeart, 400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let hls;
    const init = () => {
      const v = videoRef.current;
      if (!v) return;
      if (v.canPlayType('application/vnd.apple.mpegurl')) { 
        v.src = STREAM_URL; 
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          // CONFIGURACIÓN DE FLUIDEZ EXTREMA
          enableWorker: true,
          maxBufferLength: 45,      // Guarda 45 segundos de colchón
          maxMaxBufferLength: 90,   // Permite hasta minuto y medio si internet es lento
          maxBufferSize: 80 * 1000 * 1000, // 80MB de memoria para video
          liveSyncDurationCount: 5,  // Evita que el video salte al "ahora" si hay lag
          nudgeMaxRetry: 10
        });
        hls.loadSource(STREAM_URL);
        hls.attachMedia(v);
      }
    };

    if (!window.Hls) {
      const s = document.createElement('script');
      s.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
      s.onload = init;
      document.body.appendChild(s);
    } else { init(); }
    return () => { if (hls) hls.destroy(); };
  }, []);

  return (
    <div className="radio-app-container">
      <div className="heart-layer" ref={rainRef}></div>
      
      <div className="smart-layout">
        <nav className="nav-header">
          <Link to="/" className="btn-exit">✕</Link>
          <div className="badge-live">
            <span className="red-dot"></span> {oyentes} CONECTADOS
          </div>
        </nav>

        <section className="player-section">
          <div className="video-card">
            <div className="ratio-keeper">
              <video ref={videoRef} autoPlay controls playsInline />
            </div>
          </div>
          
          <div className="info-card">
            <span className="live-tag">RADIO EN VIVO</span>
            <h1 className="main-title">Fabulosa Stereo</h1>
            <p className="sub-title">El Encuentro con el Amor</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Radio;