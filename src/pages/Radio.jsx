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
          enableWorker: true,
          maxBufferLength: 45, // Buffer de 45 segundos para que no se pegue
          liveSyncDurationCount: 5,
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
    <div className="radio-smart-container">
      <div className="heart-layer" ref={rainRef}></div>
      
      <div className="content-wrapper">
        <div className="top-nav">
          <Link to="/" className="btn-close">✕</Link>
          <div className="status-pill">
            <span className="live-dot"></span> {oyentes} CONECTADOS
          </div>
        </div>

        <main className="player-grid">
          <div className="video-card-premium">
            <div className="aspect-ratio-box">
              <video ref={videoRef} autoPlay controls playsInline />
            </div>
          </div>
          
          <div className="station-info">
            <span className="streaming-label">ESTÁS ESCUCHANDO</span>
            <h1 className="main-name">Fabulosa Stereo</h1>
            <p className="main-slogan">El Encuentro con el Amor</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Radio;