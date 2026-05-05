import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logoFabulosa from '../assets/logo_fabulosa.png';

import TopNav from '../components/hbo/TopNav';
import HeroSlider from '../components/hbo/HeroSlider';

const Home = () => {

  const navigate = useNavigate();

  const [fecha, setFecha] = useState(new Date());
  const [activeIndex, setActiveIndex] = useState(0);
  const [focusZone, setFocusZone] = useState('hero');
  const [scrolled, setScrolled] = useState(false);

  const scrollRef = useRef(null);
  const containerRef = useRef(null);

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

  // reloj
  useEffect(() => {
    const timer = setInterval(() => setFecha(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // scroll nav
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const fn = () => setScrolled(el.scrollTop > 30);
    el.addEventListener("scroll", fn);
    return () => el.removeEventListener("scroll", fn);
  }, []);

  // scroll horizontal
  const scrollToCard = (index) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const item = container.children[index];
    if (!item) return;

    const scrollLeft = item.offsetLeft - (container.offsetWidth / 2) + (item.offsetWidth / 2);
    container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
  };

  // CONTROL REMOTO + TECLADO
  useEffect(() => {
    const handleKey = (e) => {

      if (e.key === 'ArrowDown') setFocusZone('cards');
      if (e.key === 'ArrowUp') setFocusZone('hero');

      if (focusZone === 'cards') {

        if (e.key === 'ArrowRight') {
          setActiveIndex((prev) => {
            const next = (prev + 1) % cards.length;
            scrollToCard(next);
            return next;
          });
        }

        if (e.key === 'ArrowLeft') {
          setActiveIndex((prev) => {
            const next = (prev - 1 + cards.length) % cards.length;
            scrollToCard(next);
            return next;
          });
        }

        if (e.key === 'Enter') {
          const card = cards[activeIndex];
          if (card.isExternal) window.location.href = card.path;
          else navigate(card.path);
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);

  }, [focusZone, activeIndex]);

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden">

      <TopNav scrolled={scrolled} />

      <div ref={containerRef} className="h-full overflow-y-auto">

        <HeroSlider />

        {/* CARDS */}
        <div className="relative min-h-[40vh] bg-gradient-to-t from-black via-black/90 to-transparent">

          {/* HEADER */}
          <div className="absolute top-4 left-4 md:left-10 z-50 flex items-center gap-4">
            <img src={logoFabulosa} className="h-8 md:h-10 opacity-80" />
            <span className="text-lg md:text-2xl font-bold text-white/80">
              {fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* TITULO */}
          <div className="absolute top-[30%] w-full text-center">
            <h2 className={`text-2xl md:text-4xl font-black tracking-widest transition-all
              ${focusZone === 'cards' ? 'text-cyan-400 scale-110' : 'text-white/40'}`}>
              {cards[activeIndex].name}
            </h2>
          </div>

          {/* CARRUSEL */}
          <div className="absolute bottom-0 w-full h-[26vh] flex items-center">

            <div
              ref={scrollRef}
              className="flex items-center gap-4 md:gap-8 px-[20vw] md:px-[35vw] w-full overflow-hidden"
            >
              {cards.map((card, idx) => {
                const focused = idx === activeIndex && focusZone === 'cards';

                return (
                  <div
                    key={card.id}
                    onClick={() => {
                      if (card.isExternal) window.location.href = card.path;
                      else navigate(card.path);
                    }}
                    className={`relative flex-shrink-0 transition-all duration-300 cursor-pointer
                      ${focused ? 'scale-125 z-50' : 'scale-90 opacity-40'}`}
                    style={{
                      width: 'clamp(140px, 20vw, 260px)',
                      height: 'clamp(80px, 12vw, 150px)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      background: 'rgba(0,0,0,0.6)'
                    }}
                  >

                    {focused && (
                      <div className="absolute inset-0 border-[3px] border-white rounded-[16px]
                        shadow-[0_0_40px_rgba(34,211,238,0.8)] z-10" />
                    )}

                    <img
                      src={card.img}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;