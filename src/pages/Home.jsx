import { useEffect, useRef, useState } from "react";
import TopNav from "../components/hbo/TopNav";
import HeroSlider from "../components/hbo/HeroSlider";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const rowRef = useRef(null);

  // 🔥 TUS 12 CARDS REALES (RUTAS DE TU APP)
  const cards = [
    { name: "Radios", path: "/radios-cr", image: "/images/radios.jpg" },
    { name: "Ranchera", path: "/ranchera", image: "/images/ranchera.jpg" },
    { name: "Karaoke", path: "/karaoke", image: "/images/karaoke.jpg" },
    { name: "Cine Play", path: "/cine-play", image: "/images/cine.jpg" },
    { name: "Canales", path: "/canales-play", image: "/images/tv.jpg" },
    { name: "Alabanza", path: "/alabanza", image: "/images/alabanza.jpg" },
    { name: "Mercadeo", path: "/centro-mercadeo", image: "/images/mercadeo.jpg" },
    { name: "Cámaras", path: "/camaras", image: "/images/camaras.jpg" },
    { name: "Fabulosa Tube", path: "/fabulosa-tube", image: "/images/tube.jpg" },
    { name: "Kids", path: "/tv", image: "/images/kids.jpg" },
    { name: "Noticias", path: "/noticias", image: "/images/noticias.jpg" },
    { name: "Premium", path: "/premium", image: "/images/premium.jpg" },
  ];

  const [focus, setFocus] = useState(0);

  // 🎮 CONTROL REMOTO
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") {
        setFocus((p) => Math.min(p + 1, cards.length - 1));
      }
      if (e.key === "ArrowLeft") {
        setFocus((p) => Math.max(p - 1, 0));
      }
      if (e.key === "Enter") {
        navigate(cards[focus].path);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [focus]);

  // 🎯 CENTRAR CARD
  useEffect(() => {
    const el = rowRef.current?.children[focus];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }, [focus]);

  return (
    <div className="bg-black text-white min-h-screen">

      <TopNav />

      <div className="pt-14">
        <HeroSlider />

        {/* 🎬 FILA HBO */}
        <div className="px-4 md:px-10 mt-6">

          <h2 className="text-lg mb-4">Explorar</h2>

          <div
            ref={rowRef}
            className="flex gap-2 overflow-x-auto pb-6"
          >
            {cards.map((item, i) => (
              <div
                key={i}
                onClick={() => navigate(item.path)}
                className="cursor-pointer flex-shrink-0 transition-all duration-300"
                style={{
                  width: "240px",
                  height: "140px",
                  transform: i === focus ? "scale(1.25)" : "scale(1)",
                  zIndex: i === focus ? 10 : 1,
                }}
              >
                <img
                  src={item.image}
                  className="w-full h-full object-cover rounded-lg"
                />

                {/* 🔥 EFECTO FOCO */}
                {i === focus && (
                  <div className="absolute inset-0 border-2 border-white rounded-lg pointer-events-none" />
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}