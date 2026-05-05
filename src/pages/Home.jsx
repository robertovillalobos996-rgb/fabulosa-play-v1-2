import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logoFabulosa from '../assets/logo_fabulosa.png';

const Home = () => {
  const [fecha, setFecha] = useState(new Date());
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const cards = [
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

  useEffect(() => {
    const timer = setInterval(() => setFecha(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setActiveIndex((p) => {
          const next = (p + 1) % cards.length;
          scrollToCard(next);
          return next;
        });
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex((p) => {
          const next = (p - 1 + cards.length) % cards.length;
          scrollToCard(next);
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
  }, [activeIndex]);

  const scrollToCard = (index) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.scrollWidth / cards.length;
      scrollRef.current.scrollTo({
        left: index * cardWidth - (scrollRef.current.offsetWidth / 2) + (cardWidth / 2),
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white font-sans">
      
      {/* FONDO ÚNICO: No se recorta y llena la pantalla perfectamente */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/fondo_fabulosa_play.png)' }}
      />

      {/* CABECERA LIMPIA: Sin rayas ni botones innecesarios */}
      <header className="absolute top-6 left-6 md:top-10 md:left-12 z-50 flex items-center gap-4">
        <img src={logoFabulosa} alt="Logo" className="h-10 md:h-20 object-contain drop-shadow-2xl" />
        <div className="border-l-2 border-white/20 pl-4 md:pl-6">
          <span className="text-2xl md:text-5xl font-black italic text-white drop-shadow-lg">
            {fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
          </span>
        </div>
      </header>

      {/* CONTENEDOR DE CARTAS: Fila única que no se rompe */}
      <div className="absolute bottom-0 w-full z-[100] pb-4 md:pb-8">
        <div 
          ref={scrollRef}
          className="flex items-end overflow-x-auto no-scrollbar px-[10vw] md:px-[40vw] gap-2 md:gap-4 flex-nowrap"
        >
          {cards.map((card, idx) => {
            const focused = idx === activeIndex;
            return (
              <div
                key={card.id}
                onClick={() => { setActiveIndex(idx); scrollToCard(idx); }}
                className={`relative flex-shrink-0 transition-all duration-200 cursor-pointer ${focused ? 'z-50 scale-125 opacity-100' : 'z-10 opacity-60 scale-100'}`}
                style={{
                  // En celular (ancho < 768px) las cartas son grandes y se deslizan. 
                  // En TV/PC se ajustan para caber mejor.
                  width: window.innerWidth < 768 ? '120px' : 'calc(100vw / 14)',
                  maxWidth: '180px',
                  aspectRatio: '10/16'
                }}
              >
                <img 
                  src={card.img} 
                  className="w-full h-full object-contain" 
                  alt={card.id}
                />
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