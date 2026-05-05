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

  // MOTOR DE NAVEGACIÓN Y ACCIÓN DE "ENTRAR"
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Capturamos flechas y botones de selección de diversos controles remotos
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
      } else if (e.key === 'Enter' || e.key === 'OK' || e.keyCode === 13) {
        // CIRUGÍA: Forzamos la navegación inmediata
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

  const scrollToCard = (index) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const item = container.childNodes[index];
      if (item) {
        // Centrado exacto en pantalla
        const scrollLeft = item.offsetLeft - (container.offsetWidth / 2) + (item.offsetWidth / 2);
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white font-sans">
      
      {/* FONDO PRINCIPAL FABULOSA */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/fondo_fabulosa_play.png)' }}
      />

      <header className="absolute top-8 left-10 z-50 flex items-center gap-6">
        <img src={logoFabulosa} alt="Logo" className="h-12 md:h-16 object-contain" />
        <div className="border-l-2 border-white/20 pl-6">
          <span className="text-4xl md:text-5xl font-black italic">
            {fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
          </span>
        </div>
      </header>

      {/* 🎬 LA BARRA ESTILO TV (Igual a tu foto de referencia) */}
      <div className="absolute bottom-0 w-full h-[25vh] bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-center z-[100]">
        
        {/* Contenedor con scroll centrado */}
        <div 
          ref={scrollRef}
          className="flex items-center overflow-x-hidden no-scrollbar px-[40vw] gap-4 w-full h-full"
        >
          {cards.map((card, idx) => {
            const focused = idx === activeIndex;
            return (
              <div
                key={card.id}
                onClick={() => { setActiveIndex(idx); scrollToCard(idx); }}
                className={`relative flex-shrink-0 transition-all duration-300 transform outline-none
                  ${focused 
                    ? 'scale-125 z-50 border-[6px] border-white ring-8 ring-cyan-500/30' 
                    : 'scale-90 opacity-50 border-2 border-white/10'}
                `}
                style={{
                  width: '200px', // Tamaño balanceado para TV
                  aspectRatio: '16/10',
                  borderRadius: '1.5rem',
                  overflow: 'hidden'
                }}
              >
                <img 
                  src={card.img} 
                  className="w-full h-full object-cover" 
                  alt={card.id}
                />
                
                {/* Indicador de foco inferior (Solo cuando está seleccionado) */}
                {focused && (
                  <div className="absolute bottom-0 w-full h-2 bg-cyan-400 animate-pulse" />
                )}
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