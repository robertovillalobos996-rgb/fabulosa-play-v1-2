import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ⚠️ SIN @ (para que Vercel no falle)
import TopNav from "../components/hbo/TopNav";
import HeroSlider from "../components/hbo/HeroSlider";

export default function Home() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  const ITEMS = [
    { id: 1, path: "/karaoke", image: "/card-fabulosa-karaoke.webp" },
    { id: 2, path: "/centro-mercadeo", image: "/mercadeo.webp" },
    { id: 3, path: "/canales-play", image: "/canales_play.png" },
    { id: 4, path: "/cine-play", image: "/cine_play.png" },
    { id: 5, path: "/", image: "/fabulosa_play.png" },
    { id: 6, path: "/premium", image: "/fabulosa_premiun.png" },
    { id: 7, path: "/tv", image: "/fabulosito_kids.png" },
    { id: 8, path: "/noticias", image: "/psc_imforma.png" },
    { id: 9, path: "/alabanza", image: "/card-alabanza.webp" },
    { id: 10, path: "/camaras", image: "/card-camaras.webp" },
    { id: 11, path: "/fabulosa-tube", image: "/borrachos_play.png" },
    { id: 12, path: "/radios-cr", image: "/borrachos_play.webp" },
  ];

  // 🎮 CONTROL REMOTO
  useEffect(() => {
    const handle = (e) => {
      if (e.key === "ArrowRight") {
        setActive((prev) => Math.min(prev + 1, ITEMS.length - 1));
      }
      if (e.key === "ArrowLeft") {
        setActive((prev) => Math.max(prev - 1, 0));
      }
      if (e.key === "Enter") {
        navigate(ITEMS[active].path);
      }
    };

    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [active, navigate]);

  return (
    <div className="bg-black min-h-screen text-white overflow-x-hidden">

      {/* NAV */}
      <TopNav />

      {/* HERO */}
      <HeroSlider />

      {/* GRID HBO */}
      <div className="px-4 md:px-10 lg:px-16 mt-[-120px] relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">

          {ITEMS.map((item, i) => (
            <div
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300
                ${i === active
                  ? "scale-110 z-20 ring-2 ring-purple-500"
                  : "scale-95 opacity-90"}
              `}
              style={{ aspectRatio: "2/3" }}
            >
              <img
                src={item.image}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}