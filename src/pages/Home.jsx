import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logoFabulosa from '../assets/logo_fabulosa.png';

const Home = () => {
  const [fecha, setFecha] = useState(new Date());
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const cards = [
    { id: 'premium', name: 'Mundo VIP', path: '/premium', img: '/fabulosa_premiun.webp' },
    { id: 'noticias', name: 'Noticias', isExternal: true, path: 'https://psc-informa.vercel.app', img: '/psc_imforma.webp' },
    { id: 'fabulosa', name: 'Fabulosa Tube', path: '/fabulosa-tube', img: '/fabulosa_play.webp' },
    { id: 'kids', name: 'Fabulosito Kids', path: '/tv', img: '/fabulosito_kids.webp' },
    { id: 'ranchera', name: 'Borrachos Play', path: '/ranchera', img: '/borrachos_play.webp' },
    { id: 'radioscr', name: 'Radios CR', path: '/radios-cr', img: '/card-radios.webp' },
    { id: 'movies', name: 'Cine Play', path: '/cine-play', img: '/cine_play.png' },
    { id: 'tv', name: 'Canales Play', path: '/canales-play', img: '/canales_play.png' },
    { id: 'karaoke', name: 'Fabulosa Karaoke', path: '/karaoke', img: '/card-fabulosa-karaoke.webp' },
    { id: 'alabanza', name: 'Fabulosa Alabanza', path: '/alabanza', img: '/card-alabanza.webp' },
    { id: 'camaras', name: 'Cámaras', path: '/camaras', img: '/card-camaras.webp' },
    { id: 'mercadeo', name: 'Centro de Mercadeo', path: '/centro-mercadeo', img: '/mercadeo.webp' },
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
      } else if (e.key === 'Enter' || e.key === 'OK' || e.keyCode === 13) {
        const card = cards[activeIndex];
        if (card.isExternal) window.location.href = card.path;
        else navigate(card.path);
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
        const scrollLeft = item.offsetLeft - (container.offsetWidth / 2) + (item.offsetWidth / 2);
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white font-sans">
      
      {/* FONDO SOLICITADO: fondo_fabulosa_play.webp */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: 'url(/fondo_fabulosa_play.webp)' }}
      />

      <header className="absolute top-8 left-10 z-50 flex items-center gap-6">
        <img src={logoFabulosa} alt="Logo" className="h-12 md:h-16 object-contain drop-shadow-2xl" />
        <div className="border-l-2 border-white/20 pl-6">
          <span className="text-4xl md:text-5xl font-black italic text-white drop-shadow-lg">
            {fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
          </span>
        </div>
      </header>

      {/* INDICADOR DE SECCIÓN (Para no perderse) */}
      <div className="absolute bottom-[30vh] w-full text-center z-[150] pointer-events-none">
        <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-widest text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">
          {cards[activeIndex].name}
        </h2>
      </div>

      <div className="absolute bottom-0 w-full h-[28vh] bg-gradient-to-t from-black via-black/40 to-transparent flex items-center z-[100]">
        <div 
          ref={scrollRef}
          className="flex items-center overflow-x-hidden no-scrollbar px-[40vw] gap-6 w-full h-full pb-6"
        >
          {cards.map((card, idx) => {
            const focused = idx === activeIndex;
            return (
              <div
                key={card.id}
                className={`relative flex-shrink-0 transition-all duration-300 transform outline-none
                  ${focused 
                    ? 'scale-125 z-50 border-[6px] border-white ring-8 ring-cyan-500/40 shadow-[0_0_50px_rgba(34,211,238,0.4)]' 
                    : 'scale-90 opacity-40 border-2 border-white/10'}
                `}
                style={{
                  width: '240px', // Tamaño correcto balanceado
                  aspectRatio: '16/10',
                  borderRadius: '1.2rem',
                  overflow: 'hidden',
                  backgroundColor: 'rgba(0,0,0,0.5)'
                }}
              >
                {/* CIRUGÍA: object-contain para que la imagen se vea entera sin recortes */}
                <img 
                  src={card.img} 
                  className="w-full h-full object-contain p-2" 
                  alt={card.id}
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