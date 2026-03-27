import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Radio.css';
import radioBg from '../assets/radio-bg.png'; // Importamos tu imagen

const Radio = () => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const rainContainerRef = useRef(null);
  const barsRef = useRef([]);

  // Variables para el audio context (Referencias para persistencia)
  const contextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationIdRef = useRef(null);

  // EFECTO 1: Lluvia de Corazones (Tu código original)
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

  // --- LÓGICA DEL ECUALIZADOR REAL ---
  const animateEq = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Actualizamos las barras con los datos REALES de la música
    barsRef.current.forEach((bar, i) => {
        if (!bar) return;
        
        // Tomamos los datos del analizador (saltamos los primeros 2 que suelen ser ruido)
        const value = dataArray[i + 2] || 0;
        
        // Convertimos a porcentaje (0 a 100%)
        const percent = (value / 255) * 100;
        
        // Aplicamos altura (Mínimo 5% para que se vea la barra en silencio)
        bar.style.height = Math.max(percent, 5) + '%';
    });

    // Loop de animación
    animationIdRef.current = requestAnimationFrame(animateEq);
  };

  const toggleRadio = async () => {
    const audio = audioRef.current;

    if (playing) {
        // --- PAUSAR ---
        audio.pause();
        setPlaying(false);
        // Detener la animación inmediatamente para no consumir recursos
        if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
        // Bajar barras visualmente
        barsRef.current.forEach(bar => { if(bar) bar.style.height = '5%'; });
    } else {
        // --- REPRODUCIR ---
        try {
            // 1. Inicializar AudioContext si no existe (Solo una vez)
            if (!contextRef.current) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                contextRef.current = new AudioContext();
                
                analyserRef.current = contextRef.current.createAnalyser();
                analyserRef.current.fftSize = 64; // Calidad del análisis (32 bandas)

                sourceRef.current = contextRef.current.createMediaElementSource(audio);
                sourceRef.current.connect(analyserRef.current);
                analyserRef.current.connect(contextRef.current.destination);
            }

            // 2. Reactivar si el navegador lo suspendió
            if (contextRef.current.state === 'suspended') {
                await contextRef.current.resume();
            }

            // 3. Play al audio y a la animación
            await audio.play();
            setPlaying(true);
            animateEq(); // <--- Aquí arranca el ecualizador real

        } catch (error) {
            console.error("Error al iniciar audio:", error);
            // Si falla el contexto, al menos reproducir el audio
            audio.play();
            setPlaying(true);
        }
    }
  };

  const setVol = (e) => {
      if(audioRef.current) audioRef.current.volume = e.target.value;
  };

  return (
    <div className="radio-page-container" style={{ backgroundImage: `url(${radioBg})` }}>
        
        {/* Enlace volver */}
        <Link to="/" className="back-btn">← VOLVER AL INICIO</Link>

        {/* Lluvia */}
        <div className="heart-rain-container" ref={rainContainerRef}></div>

        {/* Audio (IMPORTANTE: crossOrigin para que el ecualizador pueda leer los datos) */}
        <audio 
            ref={audioRef} 
            src="https://dattavolt.com/8030/stream" 
            crossOrigin="anonymous" 
            preload="none"
        ></audio>

        {/* Player Glass */}
        <div className="glass-player">
            <div className="eq-container">
                {[...Array(16)].map((_, i) => (
                    <div key={i} className="eq-bar" ref={el => barsRef.current[i] = el}></div>
                ))}
            </div>

            <div className="play-container">
                <button 
                    className="btn-main" 
                    onClick={toggleRadio}
                    style={{ 
                        boxShadow: playing ? "0 0 80px rgba(255, 0, 50, 0.8)" : "0 10px 30px rgba(255, 0, 50, 0.5)"
                    }}
                >
                    {playing ? "❚❚" : "▶"}
                </button>
            </div>
            
            <div className="vol-container">
                <div className="live-badge">EN VIVO</div>
                <input type="range" min="0" max="1" step="0.1" defaultValue="1" onInput={setVol} />
                <div className="icons">
                    <div className="icon">♥</div>
                    <div className="icon">🔗</div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Radio;