import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Importar imágenes de las tarjetas
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

  // 🗂️ ORDEN DE LAS TARJETAS
  const cards = [
    { id: 'kids', path: '/tv-1', img: cardKids }, // 1. Fabulosito Kids (OK)
    { id: 'romantica', path: '/radio', img: cardRadio }, 
    { id: 'radios-cr', path: '/radios-cr', img: cardRadiosCR }, 
    { id: 'canales', path: '/canales-play', img: cardTv },
    { id: 'cine', path: '/cine-play', img: cardMovies },
    { id: 'karaoke', path: '/karaoke', img: cardKaraoke },
    { id: 'camaras', path: '/camaras', img: cardCamaras },
    { id: 'alabanza', path: '/alabanza', img: cardAlabanza },
    { id: 'verano', path: '/fabulosa-verano', img: cardVerano },
    { id: 'ranchera', path: '/ranchera', img: "/borrachos_play.png" }, // Penúltima con nuevo logo
    { id: 'mercadeo', path: '/centro-mercadeo', img: cardMercadeo }, // Última
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans overflow-hidden text-white relative">
      <header className="p-6 md:p-10 flex justify-between items-center z-10">
        <div className="flex items-center gap-6">
          <img src={logoFabulosa} alt="Fabulosa Play" className="h-10 md:h-16 object-contain" />
          <div className="hidden md:block">
            <p className="text-white/40 text-[10px] font-black tracking-[0.3em] uppercase mb-1">Transmisión en Vivo</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              <p className="text-white font-bold text-sm tracking-tighter italic uppercase">Señal Digital 2026</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <p className="text-white text-4xl md:text-6xl font-black tracking-tighter italic leading-none">
            {fecha.toLocaleTimeString('es-ES', { hour12: false, hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-white/30 text-[10px] font-bold tracking-[0.5em] uppercase mt-2">
            {fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </header>

      <main className="flex-1 flex items-center relative z-10">
        <div className="flex overflow-x-auto gap-8 px-8 md:px-20 pb-12 no-scrollbar snap-x scroll-smooth">
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
          Desliza para explorar • Fabulosa Play 2026
        </div>
      </footer>

      {/* EFECTO DE LUZ DE FONDO */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-500/10 blur-[150px] rounded-full" />
      </div>
    </div>
  );
};

export default Home;