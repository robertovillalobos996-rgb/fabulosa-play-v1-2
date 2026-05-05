import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logoFabulosa from '../assets/logo_fabulosa.png';

const Home = () => {
  const [fecha, setFecha] = useState(new Date());
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  // LISTA ÚNICA (Sin duplicados para no saturar la RAM del TV)
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
    // Posicionar al inicio al cargar
    setTimeout(() => scrollToIndex(0, 'auto'), 100);
    return () => clearInterval(timer);
  }, []);

  // NAVEGACIÓN ESPACIAL PURA (Como Disney+)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => {
          const next = Math.min(prev + 1, cards.length - 1);
          scrollToIndex(next);
          return next;
        });
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => {
          const next = Math.max(prev - 1, 0);
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
  }, [activeIndex]);

  const scrollToIndex = (index, behavior = 'smooth') => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const item = container.childNodes[index];
    if (item) {
      // CÁLCULO DE CENTRADO EXACTO: Evita que la carta se vaya al final o se corte
      const scrollLeft = item.offsetLeft - (container.offsetWidth / 2) + (item.offsetWidth / 2);
      container.scrollTo({ left: scrollLeft, behavior });
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white font-sans">
      
      {/* FONDO ESTÁTICO (Elimina la rotación que causa la pegazón y el color rosado) */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'url(/tv_1.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      <header className="absolute top-6 left-10 md:left-16 z-50 flex items-center gap-6">
        <img src={logoFabulosa} alt="Logo" className="h-10 md:h-16 object-contain" />
        <div className="border-l-2 border-red-600 pl-6">
          <span className="text-3xl md:text-5xl font-black italic text-white drop-shadow-md">
            {fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
          </span>
        </div>
      </header>

      <div className="absolute bottom-10 w-full z-[100]">
        <div 
          ref={scrollRef} 
          className="flex items-center overflow-x-hidden no-scrollbar px-[40vw] h-[50vh] gap-4"
        >
          {cards.map((card, idx) => {
            const focused = idx === activeIndex;
            return (
              <div
                key={card.id}
                className={`relative flex-shrink-0 transition-all duration-300 ease-out border-4 ${focused ? 'border-red-600 z-50 scale-110 shadow-[0_0_40px_rgba(220,38,38,0.5)]' : 'border-transparent opacity-40 scale-90'}`}
                style={{
                  width: '280px', // Tamaño fijo para que no se corte en teles de 32"
                  aspectRatio: '16/10',
                  transform: focused ? 'translateY(-20px)' : 'translateY(0)'
                }}
              >
                <img 
                  src={card.img} 
                  loading="eager" 
                  className="w-full h-full object-contain rounded-xl bg-[#111]" 
                />
              </div>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        body { background-color: black; margin: 0; overflow: hidden; }
      `}</style>
    </div>
  );
};

export default Home;