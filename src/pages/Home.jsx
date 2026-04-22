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
// 🔴 NUEVO: Importamos la imagen de PSC Informa (Asegúrese que la imagen esté en la carpeta 'public')
const cardNoticias = '/psc_imforma.png'; 

const Home = () => {
  const [fecha, setFecha] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setFecha(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const cards = [
    { id: 'premium', path: '/premium', img: '/fabulosa_premiun.png' },
    // 🔴 NUEVO: La Card de PSC Informa de segunda, para que destaque
    { id: 'noticias', isExternal: true, path: 'http://localhost:3000', img: cardNoticias }, 
    { id: 'kids', path: '/tv-1', img: cardKids },
    { id: 'romantica', path: '/radio', img: cardRadio }, 
    { id: 'radios-cr', path: '/radios-cr', img: cardRadiosCR }, 
    { id: 'ranchera', path: '/ranchera', img: cardTv }, // Ajusta si tienes una img específica para ranchera
    { id: 'karaoke', path: '/karaoke', img: cardKaraoke },
    { id: 'cine', path: '/cine-play', img: cardMovies },
    { id: 'canales', path: '/canales-play', img: cardTv },
    { id: 'alabanza', path: '/alabanza', img: cardAlabanza },
    { id: 'mercadeo', path: '/centro-mercadeo', img: cardMercadeo },
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
            // 🔴 CIRUGÍA: Si es externo (PSC Informa), usa <a>, si es interno, usa <Link> de React
            card.isExternal ? (
              <a 
                key={card.id} 
                href={card.path} 
                target="_blank" // Esto abre PSC Informa en una pestaña nueva para que no pierdan Fabulosa Play
                rel="noopener noreferrer"
                className="group relative flex-shrink-0 w-[85vw] md:w-[420px] aspect-[9/16] rounded-[3.5rem] overflow-hidden snap-center shadow-2xl transition-all duration-300 hover:scale-105 border border-white/5"
              >
                <img src={card.img} alt={card.id} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </a>
            ) : (
              <Link 
                key={card.id} 
                to={card.path} 
                className="group relative flex-shrink-0 w-[85vw] md:w-[420px] aspect-[9/16] rounded-[3.5rem] overflow-hidden snap-center shadow-2xl transition-all duration-300 hover:scale-105 border border-white/5"
              >
                <img src={card.img} alt={card.id} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </Link>
            )
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;