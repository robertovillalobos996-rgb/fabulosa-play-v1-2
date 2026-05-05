import { useEffect, useRef, useState } from "react";
import TopNav from "@/components/hbo/TopNav";
import HeroSlider from "@/components/hbo/HeroSlider";
import { useNavigate } from "react-router-dom";

// 👇 TUS COMPONENTES REALES (NO SE TOCAN)
import CardNoticias from "@/components/CardNoticias";
import FabulosaVipPlayer from "@/components/FabulosaVipPlayer";
import SecurityLock from "@/components/SecurityLock";

// 👇 AQUÍ VAN TUS CARDS REALES
import { sections } from "@/lib/sections";

export default function Home() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // 🔥 CONTROL REMOTO / TECLADO
  const [focusedIndex, setFocusedIndex] = useState(0);
  const rowRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (!sections || sections.length === 0) return;

      if (e.key === "ArrowRight") {
        setFocusedIndex((prev) =>
          Math.min(prev + 1, sections.length - 1)
        );
      }

      if (e.key === "ArrowLeft") {
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
      }

      if (e.key === "Enter") {
        const item = sections[focusedIndex];
        if (!item) return;

        if (item.external) window.open(item.path, "_blank");
        else navigate(item.path);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [focusedIndex, navigate]);

  // 🔥 CENTRAR CARD ACTIVA AUTOMÁTICAMENTE
  useEffect(() => {
    if (!rowRef.current) return;

    const el = rowRef.current.children[focusedIndex];
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [focusedIndex]);

  return (
    <div className="bg-black text-white min-h-screen overflow-hidden">

      {/* NAV HBO */}
      <TopNav scrolled={true} />

      <div
        ref={containerRef}
        className="overflow-y-auto h-screen pt-14"
      >

        {/* 🎬 HERO GRANDE HBO */}
        <HeroSlider />

        {/* 🔥 CONTENIDO PRINCIPAL */}
        <div className="px-4 md:px-10 lg:px-16 mt-6">

          {/* 🎯 FILA PRINCIPAL GRANDE (SIN DESTACADOS) */}
          <div className="mb-10">

            <h2 className="text-lg md:text-xl font-bold mb-4">
              Explorar
            </h2>

            <div
              ref={rowRef}
              className="flex gap-3 overflow-x-auto scroll-smooth pb-4"
            >
              {sections.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() =>
                    item.external
                      ? window.open(item.path, "_blank")
                      : navigate(item.path)
                  }
                  className={`
                    relative cursor-pointer flex-shrink-0
                    transition-all duration-300
                  `}
                  style={{
                    width: "clamp(180px, 20vw, 260px)",
                    height: "clamp(110px, 12vw, 160px)",
                    transform:
                      index === focusedIndex
                        ? "scale(1.25)"
                        : "scale(1)",
                    zIndex: index === focusedIndex ? 20 : 1,
                  }}
                >
                  {/* IMAGEN REAL */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-lg"
                  />

                  {/* 🔥 EFECTO FOCO */}
                  {index === focusedIndex && (
                    <div
                      className="absolute inset-0 rounded-lg"
                      style={{
                        boxShadow:
                          "0 0 25px rgba(255,255,255,0.4)",
                        border: "2px solid rgba(255,255,255,0.6)",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 🔥 PLAYER VIP (SI EXISTE) */}
          <FabulosaVipPlayer />

          {/* 🔒 SEGURIDAD */}
          <SecurityLock />

          {/* 📰 NOTICIAS */}
          <CardNoticias />

        </div>
      </div>
    </div>
  );
}