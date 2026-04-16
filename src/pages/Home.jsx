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

const Home = () => {
  const [fecha, setFecha] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setFecha(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const cards = [
    { id: 'radio', path: '/radio', img: cardRadio },
    { id: 'camaras', path: '/camaras', img: cardCamaras },
    { id: 'karaoke', path: '/karaoke', img: cardKaraoke },
    { id: 'cine-play', path: '/cine-play', img: cardMovies },
    { id: 'canales-play', path: '/canales-play', img: cardTv },
    { id: 'fabulosa-tv', path: '/fabulosa-tv', img: cardFabulosaTv },
    { id: 'alabanza', path: '/alabanza', img: cardAlabanza },
    { id: 'verano', path: '/verano', img: cardVerano },
    { id: 'radios-cr', path: '/radios-cr', img: cardRadiosCR },
    { id: 'centro-mercadeo', path: '/centro-mercadeo', img: cardCentroMercadeo } 
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col text-white font-sans overflow-hidden">
      <header className="px-8 py-6 flex justify-between items-center z-10">
        <img src={logoFabulosa} alt="Fabulosa Play" className="h-12 md:h-16" />
        <div className="text-right">
          <div className="text-4xl md:text-6xl font-black italic tracking-tighter">
            {fecha.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }).toUpperCase()}
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col justify-center overflow-hidden z-10">
        <div className="flex overflow-x-auto pb-12 pt-4 px-8 gap-8 snap-x snap-mandatory no-scrollbar scroll-smooth">
          {cards.map((card) => (
            <Link 
              key={card.id} 
              to={card.path} 
              className="group relative flex-shrink-0 w-[85vw] md:w-[420px] aspect-[9/16] rounded-[3.5rem] overflow-hidden snap-center shadow-2xl transition-all duration-300 hover:scale-105 border border-white/5"
            >
              <img 
                src={card.img} 
                alt={card.id} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          ))}
        </div>
      </main>

      <footer className="p-8 flex justify-center items-center z-10">
        <div className="px-6 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold tracking-[0.5em] text-white/30 uppercase">
          Desliza para explorar â€¢ Fabulosa Play 2026
        </div>
      </footer>

      {/* EFECTO DE LUZ DE FONDO */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
};

export default Home;