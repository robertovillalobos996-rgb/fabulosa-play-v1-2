import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoFabulosa from '../assets/logo_fabulosa.png';

const Home = () => {
  const [fecha, setFecha] = useState(new Date());
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

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

  // NAVEGACIÓN SIMPLE ENTRE CARTAS (SIN SCROLL)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev + 1) % cards.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
      } else if (e.key === 'Enter' || e.key === 'OK') {
        const card = cards[activeIndex];
        if (card.isExternal) window.location.href = card.path;
        else navigate(card.path);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white font-sans">
      
      {/* FONDO ÚNICO Y ESTÁTICO (SOLO UNA IMAGEN) */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{ 
          backgroundImage: 'url(/fondo_fabulosa_play.png)', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }}
      />

      {/* CABECERA LIMPIA: SIN RALLA ROJA NI BOTONES EXTRA */}
      <header className="absolute top-10 left-10 md:left-16 z-50 flex items-center gap-6">
        <img src={logoFabulosa} alt="Logo" className="h-12 md:h-16 object-contain" />
        <div className="border-l-2 border-white/30 pl-6">
          <span className="text-4xl md:text-5xl font-black italic text-white drop-shadow-lg">
            {fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
          </span>
        </div>
      </header>

      {/* CONTENEDOR DE TODAS LAS CARTAS EN UNA SOLA PANTALLA */}
      <div className="absolute bottom-0 w-full flex justify-center items-end px-4 pb-4">
        <div className="flex flex-wrap justify-center gap-2 max-w-full">
          {cards.map((card, idx) => {
            const focused = idx === activeIndex;
            return (
              <div
                key={card.id}
                onClick={() => setActiveIndex(idx)}
                className={`relative transition-all duration-200 cursor-pointer ${focused ? 'z-50 scale-125' : 'z-10 opacity-60 scale-100'}`}
                style={{
                  width: 'calc(100vw / 13)', // Ajuste para que entren las 12 en una fila
                  maxWidth: '120px',
                  aspectRatio: '10/16'
                }}
              >
                {/* SOLAMENTE LA IMAGEN, SIN FONDOS NI BORDES */}
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
        body { background-color: black; margin: 0; overflow: hidden; }
      `}</style>
    </div>
  );
};

export default Home;