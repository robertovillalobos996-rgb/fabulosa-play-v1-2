import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // 🔥 NUEVO: FONDOS
  const backgrounds = [
    "/centro-de-publicidad.png",
    "/canales_play.png",
    "/tv_7.webp",
    "/fondo_fabulosa_play.webp",
    "/movie-peter-pan.jpg"
  ];

  const [bgIndex, setBgIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const categories = [
    { name: "CANALES PLAY", path: "/canales-play" },
    { name: "RADIOS PLAY", path: "/radios-cr" },
    { name: "RANCHERA PLAY", path: "/ranchera" },
    { name: "KARAOKE PLAY", path: "/karaoke" },
    { name: "CINE PLAY", path: "/cine-play" },
    { name: "KIDS PLAY", path: "/tv" },
    { name: "PSC INFORMA PLAY", path: "/noticias" },
    { name: "CÁMARAS PLAY", path: "/camaras" },
    { name: "ALABANZA PLAY", path: "/alabanza" },
    { name: "CONTACTO PLAY", path: "/centro-mercadeo" },
    { name: "FABULOSA PLAY", path: "/fabulosa-tube" },
    { name: "VIP PLAY", path: "/premium" },
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

  // 🔁 NUEVO: CAMBIO DE FONDO
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setBgIndex((prev) => (prev + 1) % backgrounds.length);
        setFade(true);
      }, 300);

    }, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      
      {/* 🎬 FONDO */}
      <div
        style={{
          ...styles.background,
          backgroundImage: `url(${backgrounds[bgIndex]})`,
          transition: "opacity 0.8s ease-in-out",
          opacity: fade ? 1 : 0.6,
        }}
      />
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

      {/* 🔥 LOGO (NO TOCADO) */}
      <img
        src="/icon-512x512.png"
        style={{
          ...styles.logo,
          ...(isMobile ? styles.logoMobile : {})
        }}
        alt="logo"
      />

      {/* 📱 NUEVO: QR */}
      <img
        src="/qr.jpeg"
        alt="Descargar App"
        style={{
          position: "absolute",
          top: "25px",
          right: "25px",
          width: isMobile ? "80px" : "110px",
          borderRadius: "12px",
          boxShadow: "0 0 15px rgba(0,0,0,0.5)",
          zIndex: 5
        }}
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