import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const MultimediaVIP = () => {
  const [videoIndex, setVideoIndex] = useState(0);
  const videoIds = ["0qEOlwW3MjU", "aCXa4Iwxigo", "Uh5eZgjtv0s", "OJv49ohWsnQ"];
  
  // Rotación cada 2 minutos (120000ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setVideoIndex((prev) => (prev + 1) % videoIds.length);
    }, 120000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* 📺 FONDO YOUTUBE DINÁMICO (Máxima Calidad) */}
      <div className="absolute inset-0 z-0">
        <iframe
          key={videoIds[videoIndex]}
          className="w-full h-full scale-150"
          src={`https://www.youtube.com/embed/${videoIds[videoIndex]}?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&vq=hd1080`}
          allow="autoplay; encrypted-media"
          frameBorder="0"
        />
      </div>

      {/* 🎧 AUDIO STREAMING (RadioBOSS) */}
      <audio autoPlay src="http://s5.azurahosting.com:8660/radio.mp3" />

      {/* 🟢 LOGO CON CHROMA KEY (Fondo Verde Removido) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 w-64 md:w-96">
        <video 
          autoPlay loop muted playsInline
          className="w-full drop-shadow-[0_0_15px_rgba(0,255,0,0.5)]"
          style={{ filter: 'chroma(color=#00ff00) contrast(1.2)' }} // Filtro conceptual para el equipo
        >
          <source src="/Crea_un_video_animado_de_EXACT.mp4" type="video/mp4" />
        </video>
      </div>

      {/* INTERFAZ SUPERIOR */}
      <div className="relative z-[60] p-6 flex items-center gap-4">
        <Link to="/premium" className="p-3 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-yellow-500 transition-all">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-white font-black uppercase tracking-tighter bg-black/40 px-4 py-1 rounded-lg backdrop-blur-sm">Radio Multimedia VIP</h1>
      </div>
    </div>
  );
};

export default MultimediaVIP;