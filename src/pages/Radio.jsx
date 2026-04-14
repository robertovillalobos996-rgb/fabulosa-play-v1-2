import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Radio.css';
import radioBg from '../assets/radio-bg.png';

const Radio = () => {
  const rainContainerRef = useRef(null);

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

  return (
    <div className="radio-page-container" style={{ backgroundImage: `url(${radioBg})` }}>
        <Link to="/" className="back-btn">← VOLVER AL INICIO</Link>
        <div className="heart-rain-container" ref={rainContainerRef}></div>
        
        <div className="glass-player">
            <div className="live-badge" style={{ marginBottom: '20px' }}>EN VIVO</div>
            
            {/* Reproductor Oficial de Caster.fm (Solución Directa) */}
            <div style={{ width: '100%', overflow: 'hidden', borderRadius: '15px' }}>
                <iframe 
                    src="https://www.caster.fm/widgets/tplayer.php?js=0&login=sapircast&t=1&c=FF0000&u=1" 
                    width="100%" 
                    height="100" 
                    frameBorder="0" 
                    scrolling="no"
                    title="Radio Player"
                ></iframe>
            </div>

            <p style={{ color: 'white', marginTop: '15px', fontSize: '12px', opacity: 0.8 }}>
                Si no escuchas nada, verifica que RadioBOSS esté transmitiendo.
            </p>
        </div>
    </div>
  );
};

export default Radio;