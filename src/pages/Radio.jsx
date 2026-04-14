import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Radio.css';
import radioBg from '../assets/radio-bg.png';

const Radio = () => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const rainContainerRef = useRef(null);
  const barsRef = useRef([]);

  const contextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationIdRef = useRef(null);

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
  },);

  const animateEq = () => {
    if (!analyserRef.current) return;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);
    barsRef.current.forEach((bar, i) => {
        if (!bar) return;
        const value = dataArray[i + 2] || 0;
        const percent = (value / 255) * 100;
        bar.style.height = Math.max(percent, 5) + '%';
    });
    animationIdRef.current = requestAnimationFrame(animateEq);
  };

  const toggleRadio = async () => {
    const audio = audioRef.current;
    if (playing) {
        audio.pause();
        setPlaying(false);
        if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
        barsRef.current.forEach(bar => { if(bar) bar.style.height = '5%'; });
    } else {
        try {
            if (!contextRef.current) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                contextRef.current = new AudioContext();
                analyserRef.current = contextRef.current.createAnalyser();
                analyserRef.current.fftSize = 64;
                sourceRef.current = contextRef.current.createMediaElementSource(audio);
                sourceRef.current.connect(analyserRef.current);
                analyserRef.current.connect(contextRef.current.destination);
            }
            if (contextRef.current.state === 'suspended') await contextRef.current.resume();
            await audio.play();
            setPlaying(true);
            animateEq();
        } catch (error) {
            console.error("Error:", error);
            audio.play();
            setPlaying(true);
        }
    }
  };

  return (
    <div className="radio-page-container" style={{ backgroundImage: `url(${radioBg})` }}>
        <Link to="/" className="back-btn">← VOLVER AL INICIO</Link>
        <div className="heart-rain-container" ref={rainContainerRef}></div>
        {/* Enlace corregido para mayor compatibilidad con HTTPS */}
        <audio 
            ref={audioRef} 
            src="https://shoutcast.caster.fm:19294/listen.mp3" 
            crossOrigin="anonymous" 
            preload="none"
        ></audio>
        <div className="glass-player">
            <div className="eq-container">
                {[...Array(16)].map((_, i) => (
                    <div key={i} className="eq-bar" ref={el => barsRef.current[i] = el}></div>
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