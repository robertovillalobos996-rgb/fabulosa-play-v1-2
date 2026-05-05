import { useTVMode } from '../hooks/useTVMode';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logoFabulosa from '../assets/logo_fabulosa.png';

const Home = () => {
  useTVMode(); // 👈 ACTIVA MODO TV (cursor oculto, etc.)

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

  // ⏰ RELOJ EN TIEMPO REAL
  useEffect(() => {
    const timer = setInterval(() => setFecha(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 🎮 CONTROL REMOTO (MEJORADO)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      const keyCode = e.keyCode;

      if (['ArrowRight', 'ArrowLeft', 'Enter'].includes(key) || keyCode === 13) {
        e.preventDefault();
      }

      if (key === 'ArrowRight' || keyCode === 39) {
        setActiveIndex((prev) => {
          const next = (prev + 1) % cards.length;
          scrollToCard(next);
          return next;
        });
      }

      if (key === 'ArrowLeft' || keyCode === 37) {
        setActiveIndex((prev) => {
          const next = (prev - 1 + cards.length) % cards.length;
          scrollToCard(next);
          return next;
        });
      }

      if (key === 'Enter' || keyCode === 13) {
        const card = cards[activeIndex];

        // 🔊 Sonido suave (opcional si ya tiene sounds.js)
        try {
          const audio = new Audio();
          audio.src = '';
          audio.play().catch(() => {});
        } catch {}

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

  // 🎯 SCROLL CENTRADO PRO
  const scrollToCard = (index) => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const item = container.children[index];

    if (!item) return;

    const offset =
      item.offsetLeft -
      container.offsetWidth / 2 +
      item.offsetWidth / 2;

    container.scrollTo({
      left: offset,
      behavior: 'smooth',
    });
  };

  // 📺 AUTO-CENTER AL INICIAR
  useEffect(() => {
    scrollToCard(activeIndex);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white font-sans">

      {/* 🌌 FONDO */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: 'url(/fondo_fabulosa_play.webp)' }}
      />

      {/* 🧭 HEADER */}
      <header className="absolute top-8 left-10 z-50 flex items-center gap-6">
        <img
          src={logoFabulosa}
          alt="Logo"
          className="h-12 md:h-16 object-contain drop-shadow-2xl"
        />

        <div className="border-l-2 border-white/20 pl-6">
          <span className="text-4xl md:text-5xl font-black italic text-white drop-shadow-lg">
            {fecha.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </span>
        </div>
      </header>

      {/* 🔥 NOMBRE ACTIVO */}
      <div className="absolute bottom-[30vh] w-full text-center z-[150] pointer-events-none">
        <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-widest text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">
          {cards[activeIndex].name}
        </h2>
      </div>

      {/* 🎬 CARRUSEL */}
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
                className={`relative flex-shrink-0 transition-all duration-300 transform
                ${
                  focused
                    ? 'scale-125 z-50 border-[6px] border-white ring-8 ring-cyan-500/40 shadow-[0_0_50px_rgba(34,211,238,0.4)]'
                    : 'scale-90 opacity-40 border-2 border-white/10'
                }`}
                style={{
                  width: '240px',
                  aspectRatio: '16/10',
                  borderRadius: '1.2rem',
                  overflow: 'hidden',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                }}
              >
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

      {/* 🧼 FIX GLOBAL */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        body {
          background-color: black;
          margin: 0;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Home;