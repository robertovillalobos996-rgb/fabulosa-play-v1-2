import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Logo oficial
import logoFabulosa from '../assets/logo_fabulosa.png';

const Home = () => {
  const [fecha, setFecha] = useState(new Date());
  const [bgIndex, setBgIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  // 1. COLECCIÓN COMPLETA DE 13 FONDOS (Brillo al 100%)
  const backgrounds = [
    '/tv_1.jpg', '/tv_2.jpg', '/tv_3.jpg', '/tv_4.jpg', 
    '/tv_5.jpg', '/tv_6.jpg', '/tv_7.jpg', '/tv_8.jpg', 
    '/tv_9.jpg', '/tv_10.jpg', '/tv_11.jpg', '/tv_12.jpg', '/tv_13.jpg'
  ];

  const cards = [
    { id: 'premium', path: '/premium', img: '/fabulosa_premiun.png' },
    { id: 'noticias', isExternal: true, path: 'https://psc-informa.vercel.app', img: '/psc_imforma.png' },
    { id: 'fabulosa', path: '/fabulosa-tube', img: '/fabulosa_play.png' },
    { id: 'kids', path: '/tv-1', img: '/fabulosito_kids.png' },
    { id: 'ranchera', path: '/ranchera', img: '/borrachos_play.png' },
    { id: 'radioscr', path: '/radios-cr', img: '/card-radios.webp' },
    { id: 'movies', path: '/cine-play', img: '/card-movies.webp' },
    { id: 'tv', path: '/canales-play', img: '/card-tv.webp' },
    { id: 'karaoke', path: '/karaoke', img: '/card-fabulosa-karaoke.webp' },
    { id: 'alabanza', path: '/alabanza', img: '/card-alabanza.webp' },
    { id: 'camaras', path: '/camaras', img: '/card-camaras.webp' },
    { id: 'mercadeo', path: '/centro-mercadeo', img: '/mercadeo.webp' },
  ];

  useEffect(() => {
    const timer = setInterval(() => setFecha(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const bgTimer = setInterval(() => setBgIndex((p) => (p + 1) % backgrounds.length), 15000);
    return () => clearInterval(bgTimer);
  }, []);

  // CONTROL REMOTO
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') setActiveIndex((p) => Math.min(p + 1, cards.length - 1));
      if (e.key === 'ArrowLeft') setActiveIndex((p) => Math.max(p - 1, 0));
      if (e.key === 'Enter') {
        const c = cards[activeIndex];
        if (c.isExternal) window.open(c.path, '_blank'); else navigate(c.path);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, navigate]);

  useEffect(() => {
    if (scrollRef.current) {
      const el = scrollRef.current.children[activeIndex];
      if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeIndex]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white font-sans">
      
      {/* 1. FONDOS DINÁMICOS (13 IMÁGENES HDR) */}
      {backgrounds.map((bg, i) => (
        <div key={bg} className={`absolute inset-0 transition-opacity duration-[3000ms] ${bgIndex === i ? 'opacity-100' : 'opacity-0'}`}>
          <img src={bg} className="w-full h-full object-cover" alt="Background" />
        </div>
      ))}

      {/* 2. HEADER: LOGO Y RELOJ (12H) */}
      <header className="absolute top-0 left-0 w-full p-6 sm:p-10 flex justify-between items-start z-50 pointer-events-none">
        <img src={logoFabulosa} alt="Logo" className="h-16 sm:h-24 md:h-28 lg:h-32 object-contain drop-shadow-2xl" />
        <div className="flex flex-col items-end pr-4 sm:pr-8">
          <span className="text-5xl sm:text-7xl md:text-8xl lg:text-[6rem] font-black italic tracking-tighter drop-shadow-[0_10px_20px_rgba(0,0,0,1)] leading-none">
            {fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).replace(/\s?[APM]{2}$/i, '')}
          </span>
          <span className="text-sm sm:text-lg md:text-2xl lg:text-3xl font-black italic tracking-tighter drop-shadow-[0_5px_10px_rgba(0,0,0,1)] mt-1 uppercase">
            {fecha.toLocaleDateString('es-CR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>
      </header>

      {/* 3. CINTA DE IMÁGENES (MÁS GRANDES, MÁS LARGAS Y PEGADAS) */}
      <div className="absolute bottom-0 w-full z-40">
        <div 
          ref={scrollRef}
          className="flex items-end gap-1 lg:gap-2 px-[40vw] pb-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {cards.map((card, idx) => {
            const focused = idx === activeIndex;
            return (
              <div
                key={card.id}
                onClick={() => setActiveIndex(idx)}
                className={`
                  snap-center relative flex-shrink-0 cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                  /* TAMAÑO EXTRA GRANDE Y LARGO */
                  ${focused 
                    ? 'w-[240px] sm:w-[380px] lg:w-[480px] z-50 scale-110 -translate-y-10' 
                    : 'w-[140px] sm:w-[220px] lg:w-[280px] z-10 scale-100 translate-y-0 opacity-80'}
                `}
              >
                {/* CONTENEDOR AJUSTADO (Un poco más alto para logos grandes) */}
                <div className="relative w-full aspect-[16/10] flex items-center justify-center p-2">
                  <img 
                    src={card.img} 
                    className={`
                      max-w-full max-h-full object-contain transition-all duration-500
                      ${focused 
                        ? 'drop-shadow-[0_0_45px_rgba(34,211,238,1)]' 
                        : 'drop-shadow-[0_10px_20px_rgba(0,0,0,1)]'}
                    `} 
                    alt="Logo Full" 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        body { background-color: black; margin: 0; overflow: hidden; touch-action: pan-x; }
      `}</style>
    </div>
  );
};

export default Home;