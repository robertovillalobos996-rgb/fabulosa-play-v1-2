import React, { useEffect, useRef, useState } from 'react';
import './Radio.css';

const STREAM_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosaplay/playlist.m3u8";

const Radio = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

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
          maxBufferLength: 45,
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
    <div className="fullscreen-player">
      <video 
        ref={videoRef} 
        playsInline 
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      {!isPlaying && (
        <button className="center-play-btn" onClick={handlePlay}>
          <div className="play-icon">▶</div>
          <span className="play-text">TAP O PLAY CON CONTROL</span>
        </button>
      )}

      <div className="overlay-info">
        <h1 className="mini-name">Fabulosa Stereo</h1>
        <div className="live-tag">● EN VIVO</div>
      </div>
    </div>
  );
};

export default Radio;