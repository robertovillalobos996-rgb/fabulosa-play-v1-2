import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player'; // Mantenemos esta librería, es la que "trae" el video de OBS
import './Radio.css'; // Aquí haremos la magia visual
import logoFabulosa from '../assets/logo-fabulosa.png'; // Asegúrate de tener tu logo limpio aquí

const Radio = () => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1); // Control de volumen suave
  const heartsRef = useRef(null);

  // EFECTO: Lluvia de Corazones de Cristal (Solo a los lados)
  useEffect(() => {
    const createHeart = () => {
      if (!heartsRef.current) return;
      const h = document.createElement('div');
      h.classList.add('heart-crystal');
      
      // Solo aparecen en el 15% izquierdo o derecho de la pantalla
      const side = Math.random() > 0.5 ? 'left' : 'right';
      h.style.left = side === 'left' 
        ? `${Math.random() * 15}vw` 
        : `${85 + Math.random() * 15}vw`;
      
      h.style.animationDuration = `${Math.random() * 3 + 5}s`;
      const size = Math.random() * 20 + 20; // Corazones más grandes y visibles
      h.style.width = `${size}px`; 
      h.style.height = `${size}px`;
      
      heartsRef.current.appendChild(h);
      setTimeout(() => h.remove(), 8000); // Se desvanecen antes
    };
    const interval = setInterval(createHeart, 600); // Flujo constante pero suave
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="romantic-channel-container">
        {/* FONTO: Degradado de pasión Profundo (Reemplaza la imagen antigua) */}
        <div className="deep-passion-bg"></div>
        
        {/* CAPA: Lluvia de Corazones (Solo laterales) */}
        <div className="hearts-sidebar-container" ref={heartsRef}></div>

        {/* LOGO: Flotando elegantemente arriba a la izquierda */}
        <img src={logoFabulosa} alt="Fabulosa Stereo Logo" className="main-logo-fabulosa" />

        {/* EL REPRODUCTOR: Grande, Central y Protagonista */}
        <div className="multimedia-player-wrapper">
            <div className="player-screen-shadow">
                <ReactPlayer 
                    // Tu señal RTMP convertida a HLS para la web
                    url="https://live20.bozztv.com/akamaissh101/ssh101/fabulosaplay/playlist.m3u8"
                    playing={playing}
                    volume={volume}
                    width="100%"
                    height="100%"
                    controls={true} // Volumen, Pantalla Completa y Cast (Bluetooth/TV) automáticos
                    config={{ file: { forceHLS: true } }}
                />
                
                {/* Overlay de carga con mensaje romántico */}
                {!playing && (
                    <div className="player-overlay" onClick={() => setPlaying(true)}>
                        <div className="play-pulse-icon">▶</div>
                        <div className="overlay-text">Conectando con el Amor...</div>
                    </div>
                )}
            </div>
        </div>

        {/* CONTROLES DE ESENCIA: Solo Volumen Romántico */}
        <div className="romantic-controls">
            <div className="volume-slider-group">
                <span className="vol-icon">♡</span>
                <input 
                    type="range" min="0" max="1" step="0.05" 
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))} 
                />
                <span className="vol-icon">♥️</span>
            </div>
            <div className="live-indicator-romantic">
                <span className="dot-pulse"></span> TRANSMITIENDO PASIÓN EN VIVO
            </div>
        </div>
    </div>
  );
};

export default Radio;