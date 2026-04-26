import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Logo oficial (Asumiendo que también lo convirtió a webp para consistencia)
import logoFabulosa from '../assets/logo_fabulosa.png';

const Home = () => {
  const [fecha, setFecha] = useState(new Date());
  const [bgIndex, setBgIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  // 1. COLECCIÓN DE 13 FONDOS EN WEBP (Carga ultra rápida)
  const backgrounds = [
    '/tv_1.webp', '/tv_2.webp', '/tv_3.webp', '/tv_4.webp', 
    '/tv_5.webp', '/tv_6.webp', '/tv_7.webp', '/tv_8.webp', 
    '/tv_9.webp', '/tv_10.webp', '/tv_11.webp', '/tv_12.webp', '/tv_13.webp'
  ];

  // 2. CARDS ACTUALIZADAS A WEBP
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

  // Reloj y rotación de fondos cada 15 segundos
  useEffect(() => {
    const timer = setInterval(() => setFecha(new Date()), 1000);
    const bgTimer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 15000);
    return () => { clearInterval(timer); clearInterval(bgTimer); };
  }, [backgrounds.length]);

  // MOTOR DE CONTROL REMOTO (Navegación Horizontal)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => Math.min(prev + 1, cards.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        const card = cards[activeIndex];
        if (card.isExternal) {
          window.location.href = card.path;
        } else {
          navigate(card.path);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, navigate]);

  // Centrado automático de la card seleccionada
  useEffect(() => {
    if (scrollRef.current) {
      const element = scrollRef.current.children[activeIndex];
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
    }
  }, [activeIndex]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white font-sans">
      
      {/* CAPA DE FONDOS WEBP */}
      {backgrounds.map((bg, i) => (
        <div
          key={bg}
          className={`absolute inset-0 transition-opacity duration-[3000ms] ease-in-out ${bgIndex === i ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={bg} className="w-full h-full object-cover brightness-[0.7]" alt="Background" />
        </div>
      ))}

      {/* HEADER: LOGO Y RELOJ */}
      <header className="absolute top-0 left-0 w-full p-8 md:p-12 flex justify-between items-start z-50 pointer-events-none">
        <img src={logoFabulosa} alt="Logo Fabulosa" className="h-16 md:h-24 object-contain drop-shadow-2xl" />
        
        <div className="flex flex-col items-end">
          <span className="text-6xl md:text-8xl lg:text-[7rem] font-black italic tracking-tighter drop-shadow-[0_10px_20px_rgba(0,0,0,1)] leading-none">
            {fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).replace(/\s?[APM]{2}$/i, '')}
          </span>
          <span className="text-xl md:text-3xl font-black italic tracking-tighter drop-shadow-[0_5px_10px_rgba(0,0,0,1)] mt-2 uppercase">
            {fecha.toLocaleDateString('es-CR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>
      </header>

      {/* CINTA DE SELECCIÓN (CARDS) */}
      <div className="absolute bottom-0 w-full z-40 bg-gradient-to-t from-black via-black/40 to-transparent pt-32">
        <div 
          ref={scrollRef}
          className="flex items-end gap-2 lg:gap-4 px-[40vw] pb-12 overflow-x-auto no-scrollbar scroll-smooth"
        >
          {cards.map((card, idx) => {
            const focused = idx === activeIndex;
            return (
              <div
                key={card.id}
                onClick={() => {
                  setActiveIndex(idx);
                  if (card.isExternal) window.location.href = card.path;
                  else navigate(card.path);
                }}
                className={`
                  snap-center relative flex-shrink-0 cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                  ${focused 
                    ? 'w-[240px] sm:w-[380px] lg:w-[480px] z-50 scale-110 -translate-y-10' 
                    : 'w-[140px] sm:w-[220px] lg:w-[280px] z-10 scale-100 translate-y-0 opacity-60'}
                `}
              >
                <div className="relative w-full aspect-[16/10] flex items-center justify-center p-2">
                  <img 
                    src={card.img} 
                    className={`
                      max-w-full max-h-full object-contain transition-all duration-500
                      ${focused 
                        ? 'drop-shadow-[0_0_45px_rgba(34,211,238,1)]' 
                        : 'drop-shadow-[0_10px_20px_rgba(0,0,0,1)]'}
                    `} 
                    alt="Card Logo" 
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