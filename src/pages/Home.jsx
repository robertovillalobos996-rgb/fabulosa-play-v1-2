import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Assets
import logoFabulosa from '../assets/logo-fabulosa-play.png';
import cardRadio from '../assets/card-radio.webp'; 
import cardRadiosCR from '../assets/card-radios.webp'; 
import cardMovies from '../assets/card-movies.webp';
import cardTv from '../assets/card-tv.webp';
import cardKaraoke from '../assets/card-fabulosa-karaoke.webp';
import cardAlabanza from '../assets/card-alabanza.webp';
import cardCamaras from '../assets/card-camaras.webp'; 
import cardVerano from '../assets/verano-fabulosa.webp'; 
import cardMercadeo from '../assets/mercadeo.webp'; 
import cardKids from '../assets/fabulosito_kids.png'; 

const Home = () => {
  const [fecha, setFecha] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setFecha(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 🗂️ EL ORDEN SAGRADO DE LAS CARDS
  const cards = [
    { id: 'kids', path: '/tv-1', img: cardKids }, // 1. Fabulosito Kids
    { id: 'romantica', path: '/radio', img: cardRadio }, // 2. Radio Romántica (Aquí se queda)
    { id: 'radios-cr', path: '/radios-cr', img: cardRadiosCR }, 
    { id: 'canales', path: '/canales-play', img: cardTv },
    { id: 'cine', path: '/cine-play', img: cardMovies },
    { id: 'karaoke', path: '/karaoke', img: cardKaraoke },
    { id: 'camaras', path: '/camaras', img: cardCamaras },
    { id: 'alabanza', path: '/alabanza', img: cardAlabanza },
    { id: 'verano', path: '/fabulosa-verano', img: cardVerano },
    { id: 'ranchera', path: '/ranchera', img: "/borrachos_play.png" }, // Penúltima
    { id: 'mercadeo', path: '/centro-mercadeo', img: cardMercadeo }, // Última
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans overflow-hidden text-white relative">
      <header className="p-6 md:p-10 flex justify-between items-center z-10">
        <img src={logoFabulosa} alt="Fabulosa Play" className="h-10 md:h-16 object-contain" />
        <p className="text-4xl md:text-6xl font-black italic tracking-tighter">
          {fecha.toLocaleTimeString('es-ES', { hour12: false, hour: '2-digit', minute: '2-digit' })}
        </p>
      </header>

      <main className="flex-1 flex items-center relative z-10">
        <div className="flex overflow-x-auto gap-8 px-8 md:px-20 pb-12 no-scrollbar snap-x scroll-smooth">
          {cards.map((card) => (
            <Link 
              key={card.id} 
              to={card.path} 
              className="group relative flex-shrink-0 w-[85vw] md:w-[420px] aspect-[9/16] rounded-[3.5rem] overflow-hidden snap-center shadow-2xl transition-all duration-300 hover:scale-105 border border-white/5"
            >
              <img src={card.img} alt={card.id} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </Link>
          ))}
        </div>
      </main>
      
      <footer className="p-8 flex justify-center z-10">
        <div className="px-6 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold tracking-[0.5em] text-white/30 uppercase">
          Explora el Mundo Fabulosa • 2026
        </div>
      </footer>
    </div>
  );
};

export default Home;