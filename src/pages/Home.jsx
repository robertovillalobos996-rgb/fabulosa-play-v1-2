import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/hbo/TopNav";

const Home = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const cards = [
    { id: 'premium', path: '/premium', img: '/fabulosa_premiun.webp' },
    { id: 'noticias', path: 'https://psc-informa.vercel.app', external: true, img: '/psc_imforma.webp' },
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

  /* =========================
     CONTROL REMOTO / TECLADO
  ========================= */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") {
        setActiveIndex((prev) => Math.min(prev + 1, cards.length - 1));
      }

      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      }

      if (e.key === "Enter") {
        const item = cards[activeIndex];
        if (item.external) window.open(item.path, "_blank");
        else navigate(item.path);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, navigate]);

  /* =========================
     SCROLL INTELIGENTE
  ========================= */
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const item = container.children[activeIndex];
    if (!item) return;

    const containerWidth = container.offsetWidth;
    const itemLeft = item.offsetLeft;
    const itemWidth = item.offsetWidth;

    const scrollTo =
      itemLeft - containerWidth / 2 + itemWidth / 2;

    container.scrollTo({
      left: scrollTo,
      behavior: "smooth",
    });
  }, [activeIndex]);

  return (
    <div className="fixed inset-0 bg-[#0D0D0D] text-white overflow-hidden">

      {/* NAV HBO */}
      <TopNav />

      {/* HERO SIMPLE (no rompe nada) */}
      <div
        className="w-full h-[45vh] md:h-[60vh] bg-cover bg-center"
        style={{ backgroundImage: "url(/fondo_fabulosa_play.webp)" }}
      />

      {/* CARRUSEL */}
      <div className="absolute bottom-0 w-full pb-10">

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-6 md:px-20 scrollbar-hide"
        >
          {cards.map((card, index) => {
            const active = index === activeIndex;

            return (
              <div
                key={card.id}
                onClick={() => {
                  if (card.external) window.open(card.path, "_blank");
                  else navigate(card.path);
                }}
                className={`flex-shrink-0 transition-all duration-300 cursor-pointer
                  ${active
                    ? "scale-110 z-50"
                    : "scale-95 opacity-80"
                  }
                `}
                style={{
                  width: "clamp(140px, 18vw, 240px)",
                  aspectRatio: "16/10",
                }}
              >
                <div
                  className={`w-full h-full rounded-xl overflow-hidden
                    ${active
                      ? "ring-4 ring-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.7)]"
                      : "border border-white/10"
                    }
                  `}
                >
                  <img
                    src={card.img}
                    alt=""
                    className="w-full h-full object-contain bg-black"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CSS GLOBAL */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Home;