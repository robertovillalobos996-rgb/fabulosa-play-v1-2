import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TVNavigationProvider } from "../lib/tv-navigation-context";
import logoFabulosa from "../assets/logo_fabulosa.png";

const HomeContent = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [fecha, setFecha] = useState(new Date());
  const [activeIndex, setActiveIndex] = useState(0);

  // 🔥 TUS CARDS REALES (SIN DEPENDER DE OTROS COMPONENTES)
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

  // ⏱ RELOJ
  useEffect(() => {
    const timer = setInterval(() => setFecha(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 🎮 CONTROL REMOTO (DIRECTO Y SEGURO)
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev + 1) % cards.length);
      }
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
      }
      if (e.key === "Enter") {
        const item = cards[activeIndex];
        if (item.isExternal) window.location.href = item.path;
        else navigate(item.path);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, navigate]);

  // 📜 SCROLL AUTO
  useEffect(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const item = container.children[activeIndex];
    if (item) {
      const scrollLeft =
        item.offsetLeft - container.offsetWidth / 2 + item.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [activeIndex]);

  return (
    <div className="h-screen w-screen bg-black text-white overflow-hidden">

      {/* FONDO */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/fondo_fabulosa_play.webp)" }}
      />

      {/* HEADER */}
      <div className="absolute top-8 left-10 flex items-center gap-6 z-50">
        <img src={logoFabulosa} className="h-16" />
        <span className="text-4xl font-bold">
          {fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      {/* NOMBRE */}
      <div className="absolute bottom-[30vh] w-full text-center z-50">
        <h2 className="text-4xl font-black text-cyan-400">
          {cards[activeIndex].name}
        </h2>
      </div>

      {/* CARDS */}
      <div className="absolute bottom-0 w-full h-[28vh] flex items-center">
        <div
          ref={scrollRef}
          className="flex gap-6 px-[40vw] overflow-x-hidden w-full"
        >
          {cards.map((card, i) => {
            const active = i === activeIndex;
            return (
              <div
                key={card.id}
                className={`transition-all duration-300 ${
                  active ? "scale-125 border-4 border-white" : "scale-90 opacity-40"
                }`}
                style={{ width: 240 }}
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
  );
};

export default function Home() {
  return (
    <TVNavigationProvider>
      <HomeContent />
    </TVNavigationProvider>
  );
}