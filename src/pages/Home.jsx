import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import logoFabulosa from '../assets/logo-fabulosa-play.png';
import cardRadio from '../assets/card-radio.webp';
import cardRadiosCR from '../assets/card-radios.webp';
import cardMovies from '../assets/card-movies.webp';
import cardTv from '../assets/card-tv.webp';
import cardKaraoke from '../assets/card-fabulosa-karaoke.webp';
import cardFabulosaTv from '../assets/card-fabulosa-tv.webp';
import cardAlabanza from '../assets/card-alabanza.webp';
import cardCamaras from '../assets/card-camaras.webp'; 
import cardVerano from '../assets/verano-fabulosa.webp'; 
import cardCentroMercadeo from '../assets/mercadeo.webp'; 
import cardKids from '../assets/fabulosito_kids.png'; 

const Home = () => {
  const [fecha, setFecha] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setFecha(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const cards = [
    { id: 'fabulosito-kids', path: '/tv-1', img: cardKids },
    { id: 'radio', path: '/radio', img: cardRadio },
    { id: 'camaras', path: '/camaras', img: cardCamaras },
    { id: 'karaoke', path: '/karaoke', img: cardKaraoke },
    { id: 'cine-play', path: '/cine-play', img: cardMovies },
    { id: 'canales-play', path: '/canales-play', img: cardTv },
    { id: 'fabulosa-tv', path: '/tv-fabulosa', img: cardFabulosaTv },
    { id: 'radios-cr', path: '/radios-cr', img: cardRadiosCR },
    { id: 'verano', path: '/fabulosa-verano', img: cardVerano },
    { id: 'alabanza', path: '/alabanza', img: cardAlabanza },
    { id: 'mercadeo', path: '/centro-mercadeo', img: cardCentroMercadeo },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans relative overflow-hidden">
      <header className="p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6 z-10">
        <div className="flex items-center gap-6">
          <img src={logoFabulosa} alt="Fabulosa Play" className="h-10 md:h-16 object-contain" />
          <div className="hidden md:block text-white">
            <p className="text-[10px] font-black tracking-[0.3em] uppercase mb-1">Transmisión en Vivo</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              <p className="font-bold text-sm italic uppercase">Señal Digital 2026</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <p className="text-white text-4xl md:text-6xl font-black italic tracking-tighter">
            {fecha.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </header>

      <main className="flex-1 flex items-center relative z-10">
        <div className="flex overflow-x-auto gap-8 px-8 md:px-20 pb-12 no-scrollbar snap-x">
          {cards.map((card) => (
            <Link key={card.id} to={card.path} className="group relative flex-shrink-0 w-[85vw] md:w-[420px] aspect-[9/16] rounded-[3.5rem] overflow-hidden snap-center hover:scale-105 transition-all">
              <img src={card.img} alt={card.id} className="w-full h-full object-cover" />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;