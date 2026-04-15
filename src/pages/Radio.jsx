import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Radio.css';

const STREAM_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosaplay/playlist.m3u8";

const Radio = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const rainContainerRef = useRef(null);

  // EFECTO DE CORAZONES (Tu diseño original)
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

  // LÓGICA DE VIDEO (Copiada de FabulosaVerano.jsx)
  useEffect(() => {
    let hls;
    const initPlayer = () => {
      const video = videoRef.current;
      if (!video) return;
      
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = STREAM_URL;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ capLevelToPlayerSize: true, maxBufferLength: 30 });
        hls.loadSource(STREAM_URL);
        hls.attachMedia(video);
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

  const handleStart = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="love-universe">
      <div className="heart-rain-container bg-hearts" ref={rainContainerRef}></div>

      <div className="multimedia-card">
        <Link to="/" className="back-link">← SALIR</Link>
        
        <div className="video-container-prof">
          {!isPlaying ? (
            <div className="tap-to-start" onClick={handleStart}>
              <div className="pulse-heart-icon">❤️</div>
              <h2>ENCUENTRO CON EL AMOR</h2>
              <p>Toca para conectar la señal de OBS</p>
            </div>
          ) : null}
          
          <video 
            ref={videoRef} 
            className={`w-full h-full object-cover ${!isPlaying ? 'hidden' : 'block'}`}
            controls 
            playsInline
          />
        </div>

        <div className="branding-area">
          <h1 className="radio-title">Fabulosa Stereo</h1>
          <p className="radio-slogan">EL ENCUENTRO CON EL AMOR</p>
        </div>
      </div>
    </div>
  );
};

export default Radio;