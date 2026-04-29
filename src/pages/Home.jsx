import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import logoFabulosa from '../assets/logo_fabulosa.png';

const Home = () => {
  const [fecha, setFecha] = useState(new Date());
  const [bgIndex, setBgIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  // Nuevo: Referencia para el amortiguador del scroll
  const scrollTimeoutRef = useRef(null); 

  const backgrounds = [
    '/tv_1.webp', '/tv_2.webp', '/tv_3.webp', '/tv_4.webp', 
    '/tv_5.webp', '/tv_6.webp', '/tv_7.webp', '/tv_8.webp', 
    '/tv_9.webp', '/tv_10.webp', '/tv_11.webp', '/tv_12.webp', '/tv_13.webp'
  ];

  const originalCards = [
    { id: 'premium', path: '/premium', img: '/fabulosa_premiun.webp' },
    { id: 'noticias', isExternal: true, path: 'https://psc-informa.vercel.app', img: '/psc_imforma.webp' },
    { id: 'fabulosa', path: '/fabulosa-tube', img: '/fabulosa_play.webp' },
    { id: 'kids', path: '/tv-1', img: '/fabulosito_kids.webp' },
    { id: 'ranchera', path: '/ranchera', img: '/borrachos_play.webp' },
    { id: 'radioscr', path: '/radios-cr', img: '/card-radios.webp' },
    { id: 'movies', path: '/cine-play', img: '/cine_play.png' },
    { id: 'tv', path: '/canales-play', img: '/canales_play.png' },
    { id: 'karaoke', path: '/karaoke', img: '/card-fabulosa-karaoke.webp' },
    { id: 'alabanza', path: '/alabanza', img: '/card-alabanza.webp' },
    { id: 'camaras', path: '/camaras', img: '/card-camaras.webp' },
    { id: 'mercadeo', path: '/centro-mercadeo', img: '/mercadeo.webp' },
  ];

  // Triplicamos para el loop sin fin
  const cards = [...originalCards, ...originalCards, ...originalCards];

  useEffect(() => {
    const timer = setInterval(() => setFecha(new Date()), 1000);
    const bgTimer = setInterval(() => setBgIndex((prev) => (prev + 1) % backgrounds.length), 15000);
    
    // Posicionamiento inicial en el bloque central
    if (scrollRef.current) {
      const mid = originalCards.length;
      setActiveIndex(mid);
      setTimeout(() => {
        const container = scrollRef.current;
        const activeItem = container.childNodes[mid];
        container.scrollLeft = activeItem.offsetLeft - (container.offsetWidth / 2) + (activeItem.offsetWidth / 2);
      }, 50);
    }
    return () => { clearInterval(timer); clearInterval(bgTimer); };
  }, []);

  // 🚀 DETECTOR DE CENTRO ULTRA-FLUIDO (Sin brincos)
  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

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

    // EL SECRETO: Esperamos a que el usuario deje de mover el dedo para hacer el loop infinito
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    
    scrollTimeoutRef.current = setTimeout(() => {
      if (!container) return;
      const scrollWidth = container.scrollWidth / 3;
      
      if (container.scrollLeft < 50) {
        container.scrollLeft = scrollWidth + container.scrollLeft;
      } else if (container.scrollLeft > scrollWidth * 2) {
        container.scrollLeft = container.scrollLeft - scrollWidth;
      }
    }, 150); // 150ms de amortiguador
  };

  const onCardClick = (idx, card) => {
    if (idx === activeIndex) {
      if (card.isExternal) window.location.href = card.path;
      else navigate(card.path);
    } else {
      setActiveIndex(idx);
      const container = scrollRef.current;
      const activeItem = container.childNodes[idx];
      const scrollLeft = activeItem.offsetLeft - (container.offsetWidth / 2) + (activeItem.offsetWidth / 2);
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  };

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

      {/* HEADER: LOGO, HORA, FECHA */}
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

      {/* CARRUSEL INFINITO Y AL FRENTE */}
      <div className="absolute bottom-0 w-full z-[999] pb-4 md:pb-8">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          // AQUÍ SE PUSIERON LOS FRENOS: snap-mandatory
          className="flex items-end overflow-x-auto no-scrollbar px-[40vw] h-[55vh] gap-4 md:gap-10 snap-x snap-mandatory pointer-events-auto"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {cards.map((card, idx) => {
            const focused = idx === activeIndex;
            return (
              <div
                key={`${card.id}-${idx}`}
                onClick={() => onCardClick(idx, card)}
                className={`
                  snap-center snap-always relative flex-shrink-0 cursor-pointer transition-all duration-500 ease-out will-change-transform
                  ${focused 
                    ? 'w-[75vw] sm:w-[320px] lg:w-[450px] z-[1000] opacity-100' 
                    : 'w-[28vw] sm:w-[160px] lg:w-[240px] z-10 opacity-30 blur-[0.5px]'}
                `}
                style={{
                  transform: focused 
                    ? 'scale(1.2) translateY(-70px)' 
                    : 'scale(0.95) translateY(0px)'
                }}
              >
                <div className="relative w-full aspect-[16/10] flex items-center justify-center p-2 pointer-events-none">
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
        body { background-color: black; margin: 0; overflow: hidden; touch-action: pan-y; }
      `}</style>
    </div>
  );
};

export default Home;