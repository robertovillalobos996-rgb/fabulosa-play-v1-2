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
import cardMercadeo from '../assets/mercadeo.webp'; 
import cardKids from '../assets/fabulosito_kids.png'; 

const Home = () => {
  const [fecha, setFecha] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setFecha(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const cards = [
    { id: 'premium', path: '/premium', img: '/fabulosa_premiun.png' },
    { id: 'kids', path: '/tv-1', img: cardKids },
    { id: 'romantica', path: '/radio', img: cardRadio }, 
    { id: 'radios-cr', path: '/radios-cr', img: cardRadiosCR }, 
    // 🔥 LA CARD NUEVA APUNTANDO A SU IMAGEN EN PUBLIC 🔥
    { id: 'fabulosatube', path: '/fabulosa-tube', img: '/fabulosa_play.png' }, 
    { id: 'cine-play', path: '/cine-play', img: cardMovies }, 
    { id: 'canales-play', path: '/canales-play', img: cardTv }, 
    { id: 'ranchera', path: '/ranchera', img: cardKaraoke }, 
    { id: 'karaoke', path: '/karaoke', img: cardKaraoke },
    { id: 'alabanza', path: '/alabanza', img: cardAlabanza },
    { id: 'centro-mercadeo', path: '/centro-mercadeo', img: cardMercadeo },
    { id: 'camaras', path: '/camaras', img: cardCamaras }, 
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans overflow-hidden">
      <header className="px-8 md:px-20 py-10 flex justify-between items-center z-10">
        <img src={logoFabulosa} alt="Fabulosa Play" className="h-10 md:h-16 object-contain" />
        <p className="text-4xl md:text-6xl font-black italic tracking-tighter">
          {fecha.toLocaleTimeString('es-ES', { hour12: false, hour: '2-digit', minute: '2-digit' })}
        </p>
      </header>
      <main className="flex-1 flex items-center relative z-10">
        <div className="flex overflow-x-auto gap-8 px-8 md:px-20 pb-12 no-scrollbar snap-x scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {cards.map((card) => (
            <Link key={card.id} to={card.path} className="group relative flex-shrink-0 w-[85vw] md:w-[420px] aspect-[9/16] rounded-[3.5rem] overflow-hidden snap-center shadow-2xl transition-all duration-300 hover:scale-105 border border-white/5">
              <img src={card.img} alt={card.id} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </Link>
          ))}
        </div>
      </main>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-black/80" />
      </div>
    </div>
  );
};

export default Home;