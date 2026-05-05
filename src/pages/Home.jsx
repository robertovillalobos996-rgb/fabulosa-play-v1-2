import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logoFabulosa from '../assets/logo_fabulosa.png';

// HBO UI
import TopNav from '../components/hbo/TopNav';
import HeroSlider from '../components/hbo/HeroSlider';

const Home = () => {
  const [fecha, setFecha] = useState(new Date());
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
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

  // scroll nav HBO
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const fn = () => setScrolled(el.scrollTop > 30);
    el.addEventListener("scroll", fn);
    return () => el.removeEventListener("scroll", fn);
  }, []);

  // CONTROL REMOTO (TUYO)
  useEffect(() => {
    const handleKeyDown = (e) => {

      if (e.key === 'ArrowRight') {
        setActiveIndex((p) => {
          const next = (p + 1) % cards.length;
          scrollToCard(next);
          return next;
        });
      }

      if (e.key === 'ArrowLeft') {
        setActiveIndex((p) => {
          const next = (p - 1 + cards.length) % cards.length;
          scrollToCard(next);
          return next;
        });
      }

      if (e.key === 'Enter' || e.keyCode === 13) {
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
    <div className="fixed inset-0 bg-black text-white overflow-hidden">

      {/* NAV HBO */}
      <TopNav scrolled={scrolled} />

      <div ref={containerRef} className="h-full overflow-y-auto">

        {/* HERO HBO */}
        <HeroSlider />

        {/* TU HOME ORIGINAL */}
        <div className="relative h-[40vh]">

          {/* reloj */}
          <div className="absolute top-6 left-10 z-50 flex items-center gap-6">
            <img src={logoFabulosa} className="h-10" />
            <span className="text-3xl font-bold">
              {fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* nombre de card */}
          <div className="absolute bottom-[20vh] w-full text-center">
            <h2 className="text-3xl font-bold text-cyan-400">
              {cards[activeIndex].name}
            </h2>
          </div>

          {/* carrusel */}
          <div className="absolute bottom-0 w-full h-[22vh] flex items-center">
            <div
              ref={scrollRef}
              className="flex gap-6 px-[40vw] w-full"
            >
              {cards.map((card, idx) => {
                const focused = idx === activeIndex;

                return (
                  <div
                    key={card.id}
                    className={`transition-all duration-300 ${
                      focused
                        ? 'scale-125 border-4 border-white'
                        : 'scale-90 opacity-40'
                    }`}
                    style={{
                      width: '220px',
                      height: '130px',
                      borderRadius: '12px',
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src={card.img}
                      className="w-full h-full object-contain"
                    />
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