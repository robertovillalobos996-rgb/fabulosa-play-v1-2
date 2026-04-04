import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import logoFabulosa from '../assets/logo-fabulosa-play.png';
import cardRadio from '../assets/card-radio.png';
import cardRadiosCR from '../assets/card-radios.jpg';
import cardMovies from '../assets/card-movies.png';
import cardTv from '../assets/card-tv.jpg';
import cardKaraoke from '../assets/card-fabulosa-karaoke.jpg';
import cardFabulosaTv from '../assets/card-fabulosa-tv.jpg';
import cardAlabanza from '../assets/card.fabulosa-alabanza.jpg';
import cardCamaras from '../assets/card de camaras.png'; 
import cardVerano from '../assets/verano-fabulosa.png'; 
import cardCentroMercadeo from '../assets/mercadeo.png'; 
import logoPSC from '../assets/logo-psc.png'; 

const Home = () => {
  const [fecha, setFecha] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setFecha(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const cards = [
    { id: 'noticias', path: '/noticias', img: logoPSC }, // 👈 ESTA ES LA QUE FALTA
    { id: 'radio', path: '/radio', img: cardRadio },
    { id: 'camaras', path: '/camaras', img: cardCamaras }, 
    { id: 'cantina', path: '/cantina', img: '/borrachos_play.png' }, 
    { id: 'tv', path: '/channels', img: cardTv },
    { id: 'movies', path: '/movies', img: cardMovies },
    { id: 'fabulosa-tv', path: '/fabulosa-tv', img: cardFabulosaTv },
    { id: 'radios-cr', path: '/radios-cr', img: cardRadiosCR },
    { id: 'verano', path: '/verano', img: cardVerano }, 
    { id: 'karaoke', path: '/karaoke', img: cardKaraoke },
    { id: 'alabanza', path: '/alabanza', img: cardAlabanza },
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
              <img src={card.img} alt={card.id} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500" />
            </Link>
          ))}
          <div className="w-40 flex-shrink-0"></div>
        </div>
      </main>
    </div>
  );
};

export default Home;