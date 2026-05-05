import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* 🎬 SLIDER */
const heroSlides = [
  {
    image: "/movie-peter-pan.jpg",
    title: "Películas Premium",
    desc: "Disfruta estrenos y clásicos en alta calidad sin interrupciones.",
    route: "/cine-play",
  },
  {
    image: "/canales_play.png",
    title: "TV en Vivo",
    desc: "Más de 800 canales en vivo en HD, Full HD y 4K.",
    route: "/canales-play",
  },
  {
    image: "/tv_7.jpg",
    title: "Entretenimiento Total",
    desc: "Contenido variado para toda la familia.",
    route: "/tv",
  },
  {
    image: "/tv_11.webp",
    title: "Experiencia Smart",
    desc: "Optimizado para TV, celular, tablet y PC.",
    route: "/",
  },
];

/* 📚 MENÚ */
const categories = [
  { name: "TV EN VIVO", route: "/canales-play" },
  { name: "RADIOS", route: "/radios-cr" },
  { name: "KARAOKE", route: "/karaoke" },
  { name: "PELÍCULAS", route: "/cine-play" },
  { name: "KIDS", route: "/tv" },
  { name: "NOTICIAS", route: "/noticias" },
  { name: "CÁMARAS", route: "/camaras" },
  { name: "ALABANZA", route: "/alabanza" },
  { name: "PREMIUM", route: "/premium" },
];

export default function Home() {
  const navigate = useNavigate();

  const [heroIndex, setHeroIndex] = useState(0);
  const [menuIndex, setMenuIndex] = useState(0);
  const [focus, setFocus] = useState("hero");

  const currentHero = heroSlides[heroIndex];

  /* AUTO SLIDER */
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  /* 🎮 CONTROL REMOTO */
  useEffect(() => {
    const handleKey = (e) => {
      if (focus === "hero") {
        if (e.key === "ArrowRight") {
          setHeroIndex((p) => (p + 1) % heroSlides.length);
        }
        if (e.key === "ArrowLeft") {
          setHeroIndex((p) =>
            p === 0 ? heroSlides.length - 1 : p - 1
          );
        }
        if (e.key === "ArrowDown") setFocus("menu");
        if (e.key === "Enter") navigate(currentHero.route);
      } else {
        if (e.key === "ArrowDown") {
          setMenuIndex((p) => (p + 1) % categories.length);
        }
        if (e.key === "ArrowUp") {
          if (menuIndex === 0) setFocus("hero");
          else setMenuIndex((p) => p - 1);
        }
        if (e.key === "Enter") {
          navigate(categories[menuIndex].route);
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [focus, heroIndex, menuIndex]);

  return (
    <div style={styles.container}>
      
      {/* 🎬 FONDO */}
      <div
        style={{
          ...styles.hero,
          backgroundImage: `url(${currentHero.image})`,
        }}
      />

      <div style={styles.overlay} />

      {/* 📚 SIDEBAR */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarBg}>
          
          {/* 🔥 INDICADOR ANIMADO */}
          <div
            style={{
              ...styles.indicator,
              transform: `translateY(${menuIndex * 54}px)`,
            }}
          />

          {categories.map((cat, i) => {
            const active = focus === "menu" && i === menuIndex;

            return (
              <div
                key={i}
                onClick={() => navigate(cat.route)}
                onMouseEnter={() => {
                  setFocus("menu");
                  setMenuIndex(i);
                }}
                onTouchStart={() => {
                  setFocus("menu");
                  setMenuIndex(i);
                }}
                style={{
                  ...styles.menuItem,

                  color: active ? "#111" : "rgba(255,255,255,0.7)",

                  background: active
                    ? "linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))"
                    : "transparent",

                  transform: active ? "scale(1.05)" : "scale(1)",

                  boxShadow: active
                    ? "0 8px 25px rgba(0,0,0,0.25)"
                    : "none",
                }}
              >
                {cat.name}
              </div>
            );
          })}
        </div>
      </div>

      {/* 🎞 CONTENIDO */}
      <div style={styles.content}>
        <h1 style={styles.title}>{currentHero.title}</h1>
        <p style={styles.desc}>{currentHero.desc}</p>

        <button
          style={{
            ...styles.button,
            boxShadow:
              focus === "hero"
                ? "0 0 10px rgba(255,255,255,0.4)"
                : "none",
          }}
          onClick={() => navigate(currentHero.route)}
        >
          ▶ VER AHORA
        </button>
      </div>

      {/* LOGO */}
      <img src="/icon-512x512.png" style={styles.logo} />
    </div>
  );
}

/* 🎨 ESTILOS */
const styles = {
  container: {
    width: "100%",
    height: "100vh",
    position: "relative",
    overflow: "hidden",
    color: "white",
    fontFamily: "inherit",
  },

  hero: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    transition: "0.6s",
  },

  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(to right, rgba(0,0,0,0.65), transparent)",
  },

  sidebar: {
    position: "absolute",
    left: "30px",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 2,
  },

  sidebarBg: {
    position: "relative",
    background: "rgba(0,0,0,0.25)",
    padding: "20px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  /* 🔥 BARRA PLEX */
  indicator: {
    position: "absolute",
    left: "-6px",
    width: "4px",
    height: "38px",
    background: "rgba(255,255,255,0.8)",
    borderRadius: "4px",
    transition: "0.3s ease",
  },

  menuItem: {
    fontSize: "20px",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.25s ease",
  },

  content: {
    position: "absolute",
    left: "250px",
    top: "50%",
    transform: "translateY(-50%)",
    maxWidth: "520px",
    zIndex: 2,
  },

  title: {
    fontSize: "58px",
    marginBottom: "15px",
  },

  desc: {
    fontSize: "18px",
    marginBottom: "25px",
    color: "rgba(255,255,255,0.75)",
  },

  button: {
    padding: "12px 26px",
    fontSize: "16px",
    background: "#fff",
    color: "#000",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.3s",
  },

  logo: {
    position: "absolute",
    right: "40px",
    bottom: "30px",
    width: "160px",
    opacity: 0.9,
  },
};