import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logoFabulosa from '../assets/logo_fabulosa.png';

const Home = () => {
  const [fecha, setFecha] = useState(new Date());
  const [bgIndex, setBgIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isIPhone, setIsIPhone] = useState(false);

  const navigate = useNavigate();
  const scrollRef = useRef(null);
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
    { id: 'kids', path: '/tv', img: '/fabulosito_kids.webp' },
    { id: 'ranchera', path: '/ranchera', img: '/borrachos_play.webp' },
    { id: 'radioscr', path: '/radios-cr', img: '/card-radios.webp' },
    { id: 'movies', path: '/cine-play', img: '/cine_play.png' },
    { id: 'tv', path: '/canales-play', img: '/canales_play.png' },
    { id: 'karaoke', path: '/karaoke', img: '/card-fabulosa-karaoke.webp' },
    { id: 'alabanza', path: '/alabanza', img: '/card-alabanza.webp' },
    { id: 'camaras', path: '/camaras', img: '/card-camaras.webp' },
    { id: 'mercadeo', path: '/centro-mercadeo', img: '/mercadeo.webp' },
  ];

  const cards = [...originalCards, ...originalCards, ...originalCards];

  // Función de desplazamiento suave controlada
  const scrollToIndex = (index, behavior = 'smooth') => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const item = container.childNodes[index];
    if (item) {
      const scrollLeft = item.offsetLeft - (container.offsetWidth / 2) + (item.offsetWidth / 2);
      container.scrollTo({ left: scrollLeft, behavior });
    }
  };

  useEffect(() => {
    setIsIPhone(/iPhone/i.test(navigator.userAgent));
    const timer = setInterval(() => setFecha(new Date()), 1000);
    const bgTimer = setInterval(() => setBgIndex((prev) => (prev + 1) % backgrounds.length), 15000);
    
    // Posición inicial: bloque central para permitir loop infinito
    const mid = originalCards.length;
    setActiveIndex(mid);
    setTimeout(() => scrollToIndex(mid, 'auto'), 100);

    return () => { clearInterval(timer); clearInterval(bgTimer); };
  }, []);

  // MOTOR DE CONTROL REMOTO (Keydown Management)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => {
          const next = prev + 1;
          // Salto infinito invisible al llegar al bloque final
          if (next >= cards.length - 2) {
            const reset = originalCards.length + (next % originalCards.length);
            scrollToIndex(reset, 'auto');
            return reset;
          }
          scrollToIndex(next);
          return next;
        });
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => {
          const next = prev - 1;
          // Salto infinito invisible al llegar al bloque inicial
          if (next <= 2) {
            const reset = originalCards.length + (next % originalCards.length);
            scrollToIndex(reset, 'auto');
            return reset;
          }
          scrollToIndex(next);
          return next;
        });
      } else if (e.key === 'Enter' || e.key === 'OK') {
        const card = cards[activeIndex];
        if (card.isExternal) window.location.href = card.path;
        else navigate(card.path);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, cards, navigate]);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    // Mantiene compatibilidad con Touch/Mouse para celulares
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
    if (closestIndex !== activeIndex) setActiveIndex(closestIndex);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white font-sans app-container-4k">
      
      {backgrounds.map((bg, i) => (
        <div
          key={bg}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${bgIndex === i ? 'opacity-40 scale-105' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 z-0 bg-film-grain" />

      <header className="absolute top-8 left-10 md:left-16 z-10 flex items-center gap-8 pointer-events-none">
        <img src={logoFabulosa} alt="Logo" className="h-12 md:h-20 object-contain drop-shadow-2xl" />
        <div className="flex flex-col border-l-2 border-cyan-400/30 pl-6">
          <span className="text-4xl md:text-6xl font-black italic text-cyan-400 drop-shadow-lg leading-none text-hdr-4k">
            {fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
          </span>
          <span className="text-sm md:text-lg font-bold uppercase tracking-widest opacity-70">
            {fecha.toLocaleDateString('es-CR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>
      </header>

      <div className="absolute bottom-0 w-full z-[999] pb-4 md:pb-8">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex items-end overflow-x-auto no-scrollbar px-[40vw] h-[55vh] gap-4 md:gap-10 snap-x snap-mandatory pointer-events-auto"
        >
          {cards.map((card, idx) => {
            const focused = idx === activeIndex;
            return (
              <div
                key={`${card.id}-${idx}`}
                onClick={() => { setActiveIndex(idx); scrollToIndex(idx); }}
                tabIndex={0}
                className={`
                  snap-center snap-always relative flex-shrink-0 cursor-pointer transition-all duration-500 ease-out will-change-transform outline-none
                  ${focused 
                    ? `${isIPhone ? 'w-[55vw]' : 'w-[75vw]'} sm:w-[320px] lg:w-[450px] z-[1000] opacity-100` 
                    : `${isIPhone ? 'w-[20vw]' : 'w-[28vw]'} sm:w-[160px] lg:w-[240px] z-10 opacity-30 blur-[0.5px]`}
                `}
                style={{
                  transform: focused 
                    ? (isIPhone ? 'scale(1.05) translateY(-50px)' : 'scale(1.2) translateY(-70px)')
                    : 'scale(0.95) translateY(0px)'
                }}
              >
                <div className="relative w-full aspect-[16/10] flex items-center justify-center p-2 pointer-events-none lens-flare-effect">
                  <img 
                    src={card.img} 
                    loading="lazy"
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