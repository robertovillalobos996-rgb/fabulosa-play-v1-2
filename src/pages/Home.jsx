import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ RUTAS RELATIVAS (SIN @)
import { TVNavigationProvider } from "../lib/tv-navigation-context";
import TopNav from "../components/streaming/TopNav";
import HeroSlider from "../components/streaming/HeroSlider";
import ContentRow from "../components/streaming/ContentRow";
import FocusIndicator from "../components/streaming/FocusIndicator";

import logoFabulosa from "../assets/logo_fabulosa.png";

const HomeContent = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [fecha, setFecha] = useState(new Date());

  // 🔥 CARDS REALES
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

  // 🔥 MAPEO PARA FILAS HBO
  const mappedCards = cards.map((c, i) => ({
    id: i + 1,
    title: c.name,
    image: c.img,
    badge: null,
    path: c.path,
    isExternal: c.isExternal
  }));

  // ⏱ RELOJ
  useEffect(() => {
    const timer = setInterval(() => setFecha(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 📜 SCROLL NAV
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const fn = () => setScrolled(el.scrollTop > 30);
    el.addEventListener("scroll", fn);
    return () => el.removeEventListener("scroll", fn);
  }, []);

  // 🎬 CLICK
  const handleItemClick = (item) => {
    if (item.isExternal) window.location.href = item.path;
    else navigate(item.path);
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#0D0D0D] text-white">

      {/* NAV */}
      <TopNav scrolled={scrolled} />

      {/* SCROLL PRINCIPAL */}
      <div ref={containerRef} className="h-full overflow-y-auto">

        {/* HERO */}
        <HeroSlider />

        {/* LOGO + HORA */}
        <div className="absolute top-6 left-10 z-50 flex items-center gap-6">
          <img src={logoFabulosa} className="h-12 md:h-16" alt="logo" />
          <span className="text-3xl font-bold">
            {fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* CONTENIDO */}
        <div className="pb-20">

          {/* MENÚ PRINCIPAL */}
          <ContentRow
            title="🔥 Fabulosa Play"
            items={mappedCards}
            rowIndex={1}
            onItemClick={handleItemClick}
          />

          {/* EN VIVO */}
          <ContentRow
            title="🔴 En Vivo"
            items={mappedCards.slice(0, 6)}
            rowIndex={2}
            onItemClick={handleItemClick}
          />

          {/* DESTACADOS */}
          <ContentRow
            title="⭐ Destacados"
            items={mappedCards.slice(6, 12)}
            rowIndex={3}
            onItemClick={handleItemClick}
          />

          {/* FOOTER */}
          <div className="mt-10 px-10 text-center text-white/30 text-xs">
            © 2026 Fabulosa Play · Smart TV · Web · Mobile
          </div>

        </div>
      </div>

      {/* FOCO */}
      <FocusIndicator />
    </div>
  );
};

export default function Home() {
  return (
    <TVNavigationProvider>
      <HomeContent />
    </TVNavigationProvider>
  );
}