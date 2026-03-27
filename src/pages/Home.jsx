import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import logoFabulosa from '../assets/logo-fabulosa-play.png';
import ambientMusic from '../assets/ambient-loop.mp3'; 

// === IMPORTACIÓN DE IMÁGENES DE LAS CARDS ===
import cardVerano from '../assets/verano-fabulosa.png'; 
import cardFabulosaTv from '../assets/card-fabulosa-tv.jpg';
import cardRadio from '../assets/card-radio.png';
import cardRadiosCR from '../assets/card-radios.jpg';
import cardMovies from '../assets/card-movies.png';
import cardTv from '../assets/card-tv.jpg';
import cardKaraoke from '../assets/card-fabulosa-karaoke.jpg';
import cardAlabanza from '../assets/card.fabulosa-alabanza.jpg';
import cardCamaras from '../assets/card de camaras.png'; 

// 👇 AQUÍ ESTÁ EL CAMBIO: IMPORTAMOS MERCADEO.PNG PARA LA CARD
import cardPublicidad from '../assets/mercadeo.png'; 

const Home = () => {
  const [fecha, setFecha] = useState(new Date());
  const audioRef = useRef(new Audio(ambientMusic));

  useEffect(() => {
    const timer = setInterval(() => setFecha(new Date()), 1000);
    
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = 0.2;
    
    const playAudio = () => {
      audio.play().catch(() => {});
    };
    
    window.addEventListener('click', playAudio);
    playAudio();

    return () => {
      clearInterval(timer);
      audio.pause();
      window.removeEventListener('click', playAudio);
    };
  }, []);

  const cards = [
    { id: 'verano', path: '/verano', img: cardVerano },
    { id: 'fabulosa-tv', path: '/fabulosa-tv', img: cardFabulosaTv },
    { id: 'radio', path: '/radio', img: cardRadio },
    { id: 'radios-cr', path: '/radios-cr', img: cardRadiosCR },
    { id: 'movies', path: '/movies', img: cardMovies },
    { id: 'tv', path: '/channels', img: cardTv },
    { id: 'karaoke', path: '/karaoke', img: cardKaraoke },
    { id: 'alabanza', path: '/alabanza', img: cardAlabanza },
    { id: 'camaras', path: '/camaras', img: cardCamaras }, 
    
    // 👇 ESTA ES LA CARD QUE VA A MOSTRAR LA IMAGEN DE MERCADEO.PNG
    { id: 'publicidad', path: '/mercadeo', img: cardPublicidad }, // Cambiamos path a /mercadeo
  ];

  return (
    <div className="h-screen w-screen bg-[#050505] text-white flex flex-col font-sans overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#300,transparent_50%)] opacity-40 pointer-events-none"></div>

      {/* HEADER: Logo y Reloj */}
      <header className="relative z-10 px-8 pt-10 flex justify-between items-start flex-shrink-0">
        <img src={logoFabulosa} alt="Logo" className="w-64 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
        
        <div className="text-right">
          <div className="text-6xl font-black italic tracking-tighter leading-none mb-1">
            {fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()}
          </div>
          <div className="text-lg font-bold uppercase tracking-[0.2em] text-white">
            {fecha.toLocaleDateString('es-CR', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}
          </div>
        </div>
      </header>

      {/* CONTENEDOR DE CARDS */}
      <main className="relative z-10 flex-1 flex flex-col justify-center overflow-hidden">
        <div className="flex overflow-x-auto pb-8 pt-4 px-8 gap-8 scroll-smooth scrollbar-hide snap-x snap-mandatory">
          {cards.map((card) => (
            <Link 
              key={card.id} 
              to={card.path} 
              className="group relative flex-shrink-0 w-[420px] aspect-[9/16] rounded-[3.5rem] overflow-hidden snap-center shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <img 
                src={card.img} 
                alt="Card" 
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
              />
              <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 rounded-[3.5rem] transition-all pointer-events-none" />
            </Link>
          ))}
          <div className="w-40 flex-shrink-0"></div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 px-8 pb-8 flex items-center justify-center text-[14px] font-black tracking-[0.2em] text-white/40 uppercase">
        <span>DERECHOS RESERVADOS @ 2026 FABULOSA PLAY</span>
      </footer>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        main div { scroll-behavior: smooth; -webkit-overflow-scrolling: touch; }
      `}</style>
    </div>
  );
};

export default Home;