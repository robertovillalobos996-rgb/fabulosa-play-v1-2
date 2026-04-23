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
    { id: 'noticias', isExternal: true, path: 'https://psc-informa.vercel.app', img: '/psc_imforma.png' },
    { id: 'fabulosatube', path: '/fabulosa-tube', img: '/fabulosa_play.png' },
    { id: 'kids', path: '/tv-1', img: cardKids },
    { id: 'romantica', path: '/radio', img: cardRadio }, 
    { id: 'radios-cr', path: '/radios-cr', img: cardRadiosCR }, 
    { id: 'ranchera', path: '/ranchera', img: cardTv },
    { id: 'karaoke', path: '/karaoke', img: cardKaraoke },
    { id: 'cine', path: '/cine-play', img: cardMovies },
    { id: 'canales', path: '/canales-play', img: cardTv },
    { id: 'alabanza', path: '/alabanza', img: cardAlabanza },
    { id: 'mercadeo', path: '/centro-mercadeo', img: cardMercadeo },
    { id: 'camaras', path: '/camaras', img: cardCamaras },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 py-6 bg-black/60 backdrop-blur-md">
        <img src={logoFabulosa} alt="Fabulosa Play" className="h-10 md:h-14 object-contain" />
        <div className="text-2xl md:text-4xl font-black italic">
          {fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
        </div>
      </header>

      <main className="pt-32 pb-20">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-6 md:px-12 pb-10 scrollbar-hide">
          {cards.map((card) => (
            card.isExternal ? (
              <a 
                key={card.id} 
                href={card.path} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative flex-shrink-0 w-[80vw] md:w-[380px] aspect-[9/16] rounded-[3rem] overflow-hidden snap-center border border-white/5 shadow-2xl transition-all hover:scale-105"
              >
                <img src={card.img} alt={card.id} className="w-full h-full object-cover" />
              </a>
            ) : (
              <Link 
                key={card.id} 
                to={card.path} 
                className="group relative flex-shrink-0 w-[80vw] md:w-[380px] aspect-[9/16] rounded-[3rem] overflow-hidden snap-center border border-white/5 shadow-2xl transition-all hover:scale-105"
              >
                <img src={card.img} alt={card.id} className="w-full h-full object-cover" />
              </Link>
            )
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;