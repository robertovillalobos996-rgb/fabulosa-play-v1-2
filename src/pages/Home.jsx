import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/hbo/TopNav";
import HeroSlider from "../components/hbo/HeroSlider";
import ContentRow from "../components/hbo/ContentRow";

/* 🔥 TUS CARDS REALES convertidas a formato HBO */
const sections = [
  { id: 1, title: "Mundo VIP", path: "/premium", image: "/fabulosa_premiun.webp" },
  { id: 2, title: "Noticias", path: "https://psc-informa.vercel.app", image: "/psc_imforma.webp", external: true },
  { id: 3, title: "Fabulosa Tube", path: "/fabulosa-tube", image: "/fabulosa_play.webp" },
  { id: 4, title: "Fabulosito Kids", path: "/tv", image: "/fabulosito_kids.webp" },
  { id: 5, title: "Borrachos Play", path: "/ranchera", image: "/borrachos_play.webp" },
  { id: 6, title: "Radios CR", path: "/radios-cr", image: "/card-radios.webp" },
  { id: 7, title: "Cine Play", path: "/cine-play", image: "/cine_play.png" },
  { id: 8, title: "Canales Play", path: "/canales-play", image: "/canales_play.png" },
  { id: 9, title: "Karaoke", path: "/karaoke", image: "/card-fabulosa-karaoke.webp" },
  { id: 10, title: "Alabanza", path: "/alabanza", image: "/card-alabanza.webp" },
  { id: 11, title: "Cámaras", path: "/camaras", image: "/card-camaras.webp" },
  { id: 12, title: "Mercadeo", path: "/centro-mercadeo", image: "/mercadeo.webp" },
];

export default function Home() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  /* 🔥 CONTROL REMOTO */
  const [rowIndex, setRowIndex] = useState(0);
  const [colIndex, setColIndex] = useState(0);

  const rows = [
    { title: "🔥 Destacados", items: sections.slice(0, 6) },
    { title: "📺 Explorar", items: sections },
  ];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") {
        setColIndex((p) => Math.min(p + 1, rows[rowIndex].items.length - 1));
      }

      if (e.key === "ArrowLeft") {
        setColIndex((p) => Math.max(p - 1, 0));
      }

      if (e.key === "ArrowDown") {
        setRowIndex((p) => Math.min(p + 1, rows.length - 1));
        setColIndex(0);
      }

      if (e.key === "ArrowUp") {
        setRowIndex((p) => Math.max(p - 1, 0));
        setColIndex(0);
      }

      if (e.key === "Enter") {
        const item = rows[rowIndex].items[colIndex];
        if (item.external) window.open(item.path, "_blank");
        else navigate(item.path);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [rowIndex, colIndex, rows, navigate]);

  return (
    <div className="fixed inset-0 bg-[#0D0D0D]">

      {/* NAV HBO */}
      <TopNav />

      {/* HERO REAL HBO */}
      <HeroSlider />

      {/* FILAS HBO */}
      <div
        ref={containerRef}
        className="pb-20"
        style={{ background: "#0D0D0D" }}
      >
        {rows.map((row, rIndex) => (
          <ContentRow
            key={rIndex}
            title={row.title}
            items={row.items}
            size="wide"
            onItemClick={(item) =>
              item.external
                ? window.open(item.path, "_blank")
                : navigate(item.path)
            }
            focusedRow={rowIndex === rIndex}
            focusedCol={colIndex}
          />
        ))}
      </div>
    </div>
  );
}