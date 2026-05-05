import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const categories = [
    { name: "TV EN VIVO", path: "/canales-play" },
    { name: "RADIOS", path: "/radios-cr" },
    { name: "RANCHERA", path: "/ranchera" },
    { name: "KARAOKE", path: "/karaoke" },
    { name: "PELÍCULAS", path: "/cine-play" },
    { name: "KIDS", path: "/tv" },
    { name: "NOTICIAS", path: "/noticias" },
    { name: "CÁMARAS", path: "/camaras" },
    { name: "ALABANZA", path: "/alabanza" },
    { name: "MERCADEO", path: "/centro-mercadeo" },
    { name: "FABULOSA TUBE", path: "/fabulosa-tube" },
    { name: "PREMIUM", path: "/premium" },
  ];

  // 📱 DETECTAR MOBILE
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🎮 CONTROL REMOTO / TECLADO
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowDown") {
        setSelected((prev) => (prev + 1) % categories.length);
      }
      if (e.key === "ArrowUp") {
        setSelected((prev) =>
          prev === 0 ? categories.length - 1 : prev - 1
        );
      }
      if (e.key === "Enter") {
        navigate(categories[selected].path);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selected, navigate]);

  return (
    <div style={styles.container}>
      
      {/* 🎬 FONDO */}
      <div style={styles.background} />
      <div style={styles.overlay} />

      {/* 📂 MENÚ */}
      <div style={{
        ...styles.sidebar,
        ...(isMobile ? styles.sidebarMobile : {})
      }}>
        {categories.map((cat, index) => (
          <div
            key={index}
            onClick={() => navigate(cat.path)}
            onMouseEnter={() => setSelected(index)}
            style={{
              ...styles.category,
              ...(selected === index ? styles.active : {}),
              ...(isMobile ? styles.categoryMobile : {})
            }}
          >
            {cat.name}
          </div>
        ))}
      </div>

      {/* 🎯 CONTENIDO */}
      <div style={{
        ...styles.content,
        ...(isMobile ? styles.contentMobile : {})
      }}>
        <h1 style={{
          ...styles.title,
          ...(isMobile ? styles.titleMobile : {})
        }}>
          {categories[selected].name}
        </h1>

        <p style={styles.subtitle}>
          Disfruta contenido ilimitado en HD y 4K.
        </p>

        <button
          style={styles.button}
          onClick={() => navigate(categories[selected].path)}
        >
          ▶ VER AHORA
        </button>
      </div>

      {/* 🔥 LOGO */}
      <img
        src="/icon-512x512.png"
        style={{
          ...styles.logo,
          ...(isMobile ? styles.logoMobile : {})
        }}
        alt="logo"
      />
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
    fontFamily: "sans-serif",
  },

  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundImage: "url('/movie-peter-pan.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(to right, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.3))",
  },

  sidebar: {
    position: "absolute",
    left: "40px",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    background: "rgba(0,0,0,0.35)",
    padding: "20px",
    borderRadius: "16px",
    backdropFilter: "blur(10px)",
  },

  sidebarMobile: {
    left: "10px",
    top: "auto",
    bottom: "20px",
    transform: "none",
    flexDirection: "row",
    overflowX: "auto",
    width: "95%",
  },

  category: {
    color: "#ddd",
    fontSize: "20px",
    cursor: "pointer",
    transition: "all 0.25s ease",
    whiteSpace: "nowrap",
  },

  categoryMobile: {
    fontSize: "14px",
  },

  active: {
    color: "#fff",
    transform: "scale(1.1)",
    textShadow: "0 0 12px rgba(255,255,255,0.6)",
  },

  content: {
    position: "absolute",
    left: "320px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "white",
    maxWidth: "500px",
  },

  contentMobile: {
    left: "20px",
    top: "30%",
    transform: "none",
    maxWidth: "90%",
  },

  title: {
    fontSize: "48px",
    marginBottom: "10px",
    fontWeight: "bold",
  },

  titleMobile: {
    fontSize: "28px",
  },

  subtitle: {
    fontSize: "16px",
    opacity: 0.8,
    marginBottom: "20px",
  },

  button: {
    padding: "12px 24px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "none",
    background: "#fff",
    color: "#000",
    cursor: "pointer",
  },

  logo: {
    position: "absolute",
    bottom: "30px",
    right: "40px",
    width: "140px",
  },

  logoMobile: {
    width: "90px",
    right: "10px",
    bottom: "80px",
  },
};