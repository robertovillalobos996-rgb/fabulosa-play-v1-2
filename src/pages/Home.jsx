import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import logoFabulosa from '../assets/logo_fabulosa.png';

const Home = () => {
  const [fecha, setFecha] = useState(new Date());
  const [bgIndex, setBgIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const backgrounds = [
    '/tv_1.webp', '/tv_2.webp', '/tv_3.webp', '/tv_4.webp', 
    '/tv_5.webp', '/tv_6.webp', '/tv_7.webp', '/tv_8.webp', 
    '/tv_9.webp', '/tv_10.webp', '/tv_11.webp', '/tv_12.webp', '/tv_13.webp'
  ];

  const cards = [
    { id: 'premium', path: '/premium', img: '/fabulosa_premiun.webp' },
    { id: 'noticias', isExternal: true, path: 'https://psc-informa.vercel.app', img: '/psc_imforma.webp' },
    { id: 'fabulosa', path: '/fabulosa-tube', img: '/fabulosa_play.webp' },
    { id: 'kids', path: '/tv-1', img: '/fabulosito_kids.webp' },
    { id: 'ranchera', path: '/ranchera', img: '/borrachos_play.webp' },
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
    const bgTimer = setInterval(() => setBgIndex((prev) => (prev + 1) % backgrounds.length), 15000);
    return () => { clearInterval(timer); clearInterval(bgTimer); };
  }, [backgrounds.length]);

  // 📱 DETECTOR DE CENTRO PARA CELULARES
  const handleScroll = () => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const center = container.scrollLeft + container.offsetWidth / 2;
      
      let closestIndex = 0;
      let minDistance = Infinity;

      container.childNodes.forEach((child, index) => {
        const childCenter = child.offsetLeft + child.offsetWidth / 2;
        const distance = Math.abs(center - childCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      if (closestIndex !== activeIndex) {
        setActiveIndex(closestIndex);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev + 1) % cards.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
      } else if (e.key === 'Enter') {
        const card = cards[activeIndex];
        if (card.isExternal) window.location.href = card.path;
        else navigate(card.path);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, navigate, cards]);

  // Centrado cuando se usa teclado/control
  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const activeItem = container.childNodes[activeIndex];
      if (activeItem) {
        const scrollLeft = activeItem.offsetLeft - (container.offsetWidth / 2) + (activeItem.offsetWidth / 2);
        // Solo centramos por código si no se está haciendo scroll manual (para no pelear con el dedo)
        if (Math.abs(container.scrollLeft - scrollLeft) > 10) {
           container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
      }
    }
  }, [activeIndex]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white font-sans">
      
      {backgrounds.map((bg, i) => (
        <div
          key={bg}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${bgIndex === i ? 'opacity-40 scale-105' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 z-0" />

      <header className="absolute top-8 left-10 md:left-16 z-10 flex items-center gap-8 pointer-events-none">
        <img src={logoFabulosa} alt="Logo" className="h-12 md:h-20 object-contain drop-shadow-2xl" />
        <div className="flex flex-col border-l-2 border-cyan-400/30 pl-6">
          <span className="text-4xl md:text-6xl font-black italic text-cyan-400 drop-shadow-lg leading-none">
            {fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
          </span>
          <span className="text-sm md:text-lg font-bold uppercase tracking-widest opacity-70">
            {fecha.toLocaleDateString('es-CR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>
      </header>

      {/* 🏁 CINTA DE CARDS: DETECTA EL DEDO */}
      <div className="absolute bottom-0 w-full z-[999] bg-gradient-to-t from-black via-transparent to-transparent pb-4 md:pb-8">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex items-end overflow-x-auto no-scrollbar px-[45vw] h-[55vh] gap-3 md:gap-8 scroll-smooth snap-x snap-mandatory"
        >
          {cards.map((card, idx) => {
            const focused = idx === activeIndex;
            return (
              <div
                key={card.id}
                onClick={() => {
                  setActiveIndex(idx);
                  if (focused) {
                    if (card.isExternal) window.location.href = card.path;
                    else navigate(card.path);
                  }
                }}
                className={`
                  snap-center relative flex-shrink-0 cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
                  ${focused 
                    ? 'w-[75vw] sm:w-[350px] lg:w-[460px] z-[1000] scale-125 -translate-y-24' 
                    : 'w-[28vw] sm:w-[170px] lg:w-[240px] z-10 scale-90 translate-y-0 opacity-30 blur-[1px]'}
                `}
              >
                <div className="relative w-full aspect-[16/10] flex items-center justify-center p-2">
                  <img 
                    src={card.img} 
                    className={`
                      max-w-full max-h-full object-contain transition-all duration-500
                      ${focused 
                        ? 'drop-shadow-[0_0_50px_rgba(34,211,238,1)] brightness-110' 
                        : 'drop-shadow-[0_10px_20px_rgba(0,0,0,1)]'}
                    `} 
                    alt={card.id} 
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
        body { background-color: black; margin: 0; overflow: hidden; }
      `}</style>
    </div>
  );
};

export default Home;