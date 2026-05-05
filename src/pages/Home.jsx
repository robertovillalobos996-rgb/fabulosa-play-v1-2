import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logoFabulosa from '../assets/logo_fabulosa.png';

const Home = () => {
  const [fecha, setFecha] = useState(new Date());
  const [bgIndex, setBgIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [performanceMode, setPerformanceMode] = useState('HIGH'); // HIGH o LOW

  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const backgrounds = ['/tv_1.webp', '/tv_2.webp', '/tv_3.webp', '/tv_4.webp'];
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

  // DETECTOR INTELIGENTE DE HARDWARE
  useEffect(() => {
    const cores = navigator.hardwareConcurrency || 4;
    const isLowEnd = cores < 4 || /Sankey|TV-Box|SmartTV/i.test(navigator.userAgent);
    setPerformanceMode(isLowEnd ? 'LOW' : 'HIGH');
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setFecha(new Date()), 1000);
    // Solo rotar fondos si el televisor tiene potencia (Modo HIGH)
    let bgTimer;
    if (performanceMode === 'HIGH') {
      bgTimer = setInterval(() => setBgIndex((p) => (p + 1) % backgrounds.length), 15000);
    }
    return () => { clearInterval(timer); if(bgTimer) clearInterval(bgTimer); };
  }, [performanceMode]);

  // NAVEGACIÓN POR CONTROL REMOTO OPTIMIZADA
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => {
          const next = Math.min(prev + 1, originalCards.length - 1);
          scrollToIndex(next);
          return next;
        });
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => {
          const next = Math.max(prev - 1, 0);
          scrollToIndex(next);
          return next;
        });
      } else if (e.key === 'Enter') {
        const card = originalCards[activeIndex];
        if (card.isExternal) window.location.href = card.path;
        else navigate(card.path);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  const scrollToIndex = (index) => {
    if (!scrollRef.current) return;
    const item = scrollRef.current.childNodes[index];
    if (item) {
      const scrollLeft = item.offsetLeft - (scrollRef.current.offsetWidth / 2) + (item.offsetWidth / 2);
      scrollRef.current.scrollTo({ left: scrollLeft, behavior: performanceMode === 'HIGH' ? 'smooth' : 'auto' });
    }
  };

  return (
    <div className={`relative h-screen w-screen overflow-hidden bg-black text-white ${performanceMode === 'HIGH' ? 'app-container-4k' : ''}`}>
      {/* FONDO INTELIGENTE: Si es LOW, solo carga UNA imagen estática para ahorrar procesador */}
      <div 
        className="absolute inset-0 opacity-40 transition-opacity duration-1000"
        style={{ 
          backgroundImage: `url(${performanceMode === 'HIGH' ? backgrounds[bgIndex] : backgrounds[0]})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }}
      />
      
      {performanceMode === 'HIGH' && <div className="bg-film-grain absolute inset-0 pointer-events-none" />}

      <header className="absolute top-8 left-10 z-10 flex items-center gap-8">
        <img src={logoFabulosa} alt="Logo" className="h-12 md:h-20 object-contain drop-shadow-2xl" />
        <div className="flex flex-col border-l-2 border-cyan-400/30 pl-6">
          <span className={`text-4xl md:text-6xl font-black italic text-cyan-400 ${performanceMode === 'HIGH' ? 'text-hdr-4k' : ''}`}>
            {fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
          </span>
        </div>
      </header>

      <div className="absolute bottom-0 w-full z-[999] pb-10">
        <div 
          ref={scrollRef} 
          className="flex items-end overflow-x-auto no-scrollbar px-[40vw] h-[45vh] gap-6"
        >
          {originalCards.map((card, idx) => {
            const focused = idx === activeIndex;
            return (
              <div
                key={card.id}
                className={`relative flex-shrink-0 transition-all duration-300 ${focused ? 'z-50' : 'z-10 opacity-30'}`}
                style={{
                  width: focused ? '320px' : '160px',
                  transform: focused ? 'translateY(-40px)' : 'translateY(0)',
                  // Si es LOW, quitamos los filtros pesados de sombra y brillo
                  filter: (focused && performanceMode === 'HIGH') ? 'drop-shadow(0 0 30px rgba(34,211,238,0.5))' : 'none'
                }}
              >
                <img src={card.img} loading="lazy" className="w-full h-auto rounded-2xl shadow-2xl border-2 border-white/5" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;