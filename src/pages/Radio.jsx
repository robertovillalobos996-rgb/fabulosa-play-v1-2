import React, { useEffect, useRef, useState } from 'react';
import './Radio.css';

const STREAM_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosaplay/playlist.m3u8";

const Radio = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hlsRef = useRef(null); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const timerRef = useRef(null);

  const resetTimer = () => {
    setShowControls(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000); 
  };

  const handlePlay = () => {
    const v = videoRef.current;
    if (!v) return;

    if (!isPlaying) {
      if (v.canPlayType('application/vnd.apple.mpegurl')) { 
        v.src = STREAM_URL; 
      } else if (window.Hls && window.Hls.isSupported()) {
        if (hlsRef.current) hlsRef.current.destroy();
        
        // 🚀 CONFIGURACIÓN AGRESIVA DE CARGA RÁPIDA
        hlsRef.current = new window.Hls({ 
          enableWorker: true,
          lowLatencyMode: true, // Activa el modo de baja latencia
          liveSyncDurationCount: 2, // Arranca apenas tenga 2 pedacitos listos
          maxBufferLength: 10 // No almacena basura innecesaria
        });
        
        hlsRef.current.loadSource(STREAM_URL);
        hlsRef.current.attachMedia(v);
      } else {
        v.src = STREAM_URL;
      }
    }

    v.play().catch(e => console.log("Cargando stream..."));
    setIsPlaying(true);
    resetTimer();
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    resetTimer();
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) videoRef.current.volume = newVol;
    resetTimer();
  };

  useEffect(() => {
    return () => { 
      if (hlsRef.current) hlsRef.current.destroy();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div 
      className="fullscreen-player" 
      ref={containerRef}
      onMouseMove={resetTimer}
      onTouchStart={resetTimer}
    >
      <video ref={videoRef} playsInline onClick={resetTimer} preload="none" />
      
      {!isPlaying && (
        <button className="center-play-btn" onClick={handlePlay}>
          <div className="play-icon">▶</div>
        </button>
      )}

      <div className={`bottom-controls ${(!showControls && isPlaying) ? 'hidden' : ''}`}>
        <div className="volume-group">
          <span>🔈</span>
          <input 
            type="range" 
            min="0" max="1" step="0.1" 
            value={volume} 
            onChange={handleVolumeChange} 
          />
          <span>🔊</span>
        </div>
        <button className="fs-btn" onClick={toggleFullScreen}>
          ⛶ PANTALLA COMPLETA
        </button>
      </div>
    </div>
  );
};

export default Radio;