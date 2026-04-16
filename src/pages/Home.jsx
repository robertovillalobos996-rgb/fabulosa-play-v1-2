import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Importar imágenes (Asegúrate de tener card-ranchera.webp en assets)
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
import cardRanchera from '../assets/card-radio.webp'; // Usar la de ranchera aquí

const Home = () => {
  const [fecha, setFecha] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setFecha(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const cards = [
    { id: 'kids', path: '/tv-1', img: cardKids },
    { id: 'ranchera', path: '/ranchera', img: cardRanchera }, // LA CARTA VOLVIÓ
    { id: 'radio-romantica', path: '/radio', img: cardRadio },
    { id: 'radios-cr', path: '/radios-cr', img: cardRadiosCR },
    { id: 'canales', path: '/canales-play', img: cardTv },
    { id: 'cine', path: '/cine-play', img: cardMovies },
    { id: 'karaoke', path: '/karaoke', img: cardKaraoke },
    { id: 'camaras', path: '/camaras', img: cardCamaras },
    { id: 'alabanza', path: '/alabanza', img: cardAlabanza },
    { id: 'verano', path: '/fabulosa-verano', img: cardVerano },
    { id: 'mercadeo', path: '/centro-mercadeo', img: cardMercadeo },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans overflow-hidden text-white">
      <header className="p-6 md:p-10 flex justify-between items-center z-10">
        <img src={logoFabulosa} alt="Fabulosa Play" className="h-10 md:h-16" />
        <p className="text-4xl md:text-6xl font-black italic tracking-tighter">
          {fecha.toLocaleTimeString('es-ES', { hour12: false, hour: '2-digit', minute: '2-digit' })}
        </p>
      </header>
      <main className="flex-1 flex items-center z-10">
        <div className="flex overflow-x-auto gap-8 px-8 md:px-20 pb-12 no-scrollbar snap-x">
          {cards.map((card) => (
            <Link key={card.id} to={card.path} className="group relative flex-shrink-0 w-[85vw] md:w-[420px] aspect-[9/16] rounded-[3.5rem] overflow-hidden snap-center hover:scale-105 transition-all shadow-2xl border border-white/5">
              <img src={card.img} alt={card.id} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </main>
      <footer className="p-6 text-center text-white/20 text-[10px] font-bold tracking-[0.5em] uppercase">
        Desliza para explorar el mundo Fabulosa • 2026
      </footer>
    </div>
  );
};

export default Home;