import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Radio.css';

const STREAM_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosaplay/playlist.m3u8";

const Radio = () => {
  const videoRef = useRef(null);
  const rainRef = useRef(null);
  const [oyentes, setOyentes] = useState(150);

  useEffect(() => {
    const interval = setInterval(() => setOyentes(150 + Math.floor(Math.random() * 25)), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const createHeart = () => {
      if (!rainRef.current) return;
      const h = document.createElement('div');
      h.className = 'heart-gem';
      h.style.left = Math.random() * 100 + "vw";
      h.style.animationDuration = Math.random() * 3 + 7 + "s";
      rainRef.current.appendChild(h);
      setTimeout(() => h.remove(), 10000);
    };
    const interval = setInterval(createHeart, 350);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let hls;
    const init = () => {
      const v = videoRef.current;
      if (!v) return;
      if (v.canPlayType('application/vnd.apple.mpegurl')) { v.src = STREAM_URL; }
      else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, maxBufferLength: 30, lowLatencyMode: false });
        hls.loadSource(STREAM_URL); hls.attachMedia(v);
      }
    };
    if (!window.Hls) {
      const s = document.createElement('script');
      s.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
      s.onload = init; document.body.appendChild(s);
    } else { init(); }
    return () => { if (hls) hls.destroy(); };
  }, []);

  return (
    <div className="radio-premium-page">
      <div className="heart-rain" ref={rainRef}></div>
      
      <div className="main-interface">
        <header className="top-bar">
          <Link to="/" className="exit-button">✕ SALIR</Link>
          <div className="live-status">
            <span className="pulse-dot"></span> EN VIVO: {oyentes} OYENTES
          </div>
        </header>

        <div className="player-showcase">
          <div className="glass-card">
            <div className="video-viewport">
              <video ref={videoRef} autoPlay controls playsInline />
            </div>
            
            <div className="station-meta">
              <div className="playing-now">
                <span className="label">TRANSMITIENDO</span>
                <h1 className="station-name">Fabulosa Stereo</h1>
                <p className="slogan">El Encuentro con el Amor</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Radio;