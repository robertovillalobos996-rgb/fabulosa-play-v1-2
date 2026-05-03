import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const MultimediaVIP = () => {
  // 🔑 LAS 14 API KEYS OFICIALES[cite: 4]
  const YOUTUBE_API_KEYS = [
    "AIzaSyDxLD8PviKQwlHBs7rmRm3GoyIKk-aQpww", "AIzaSyACeTldeUs5tbn2Lwr6o_6Lc48rF1nINY0",
    "AIzaSyBUk0oq1zjA6BKx5HK8DEQc1TxQqreqGtk", "AIzaSyBys-0J3T5Ou_fdPGxqYC5LWDMgppwD0Y4",
    "AIzaSyDHdkSo4WSHjYL4nHFU9wKmXW5D9PScO4g", "AIzaSyDJqDMnZsYHyJtzahtvv1r55Z-JfgLk5TU",
    "AIzaSyCruj7UZTEmElS3ZUeUBmYPecbsAA667U8", "AIzaSyBfMNrgQESeymMQ9srVBHKjXB3_WeRfkXE",
    "AIzaSyB1e_YSB74yAelvAhapDWu11VPLz2wBkUg", "AIzaSyCsvViGGiPJxx8-FkSwQvHE2T_U8d2UO5E",
    "AIzaSyBRvdUqolryjMRustJUyqN_HtkjRCbHLfI", "AIzaSyCdmCZW6J49Onl-QAf3cTsNu0im84EBVZc",
    "AIzaSyCeref7W3di_9o6W3YnEtqgvCQyvyQ5a5Q", "AIzaSyAwtE19mD7rpv1pu5nB4R8Q0HmEX9OkgJI"
  ];

  // 📺 LISTA DE VIDEOS HD[cite: 4]
  const videoIds = ["0qEOlwW3MjU", "aCXa4Iwxigo", "Uh5eZgjtv0s", "OJv49ohWsnQ"];
  const [index, setIndex] = useState(0);

  // 🔄 ROTACIÓN CADA 2 MINUTOS[cite: 2]
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % videoIds.length);
    }, 120000);
    return () => clearInterval(timer);
  }, [videoIds.length]);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col">
      
      {/* 🎬 FONDO YOUTUBE (Máxima Calidad)[cite: 2, 4] */}
      <div className="absolute inset-0 z-0 pointer-events-none scale-150">
        <iframe
          key={videoIds[index]}
          className="w-full h-full"
          src={"https://www.youtube.com/embed/" + videoIds[index] + "?autoplay=1&mute=1&loop=1&playlist=" + videoIds[index] + "&controls=0&modestbranding=1&rel=0&vq=hd1080"}
          frameBorder="0" 
          allow="autoplay; encrypted-media"
        ></iframe>
      </div>

      {/* 🎧 AUDIO RADIOBOSS[cite: 2] */}
      <audio autoPlay src="http://s5.azurahosting.com:8660/radio.mp3"></audio>

      {/* HEADER SUPERIOR[cite: 1] */}
      <div className="relative z-50 p-6 flex items-center gap-4 bg-gradient-to-b from-black/90 to-transparent">
        <Link to="/premium" className="p-3 bg-zinc-900/90 rounded-full hover:bg-yellow-500 transition-all shadow-2xl">
          <ArrowLeft size={24} className="text-white" />
        </Link>
        <h1 className="text-white font-black uppercase tracking-tighter text-2xl drop-shadow-2xl">Multimedia VIP</h1>
      </div>

      {/* 🟢 LOGO CON FILTRO CHROMA KEY[cite: 2, 4] */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[100] w-72 md:w-96 pointer-events-none">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-auto drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]"
          style={{ filter: 'brightness(1.1) contrast(1.1)' }}
        >
          <source src="/Crea_un_video_animado_de_EXACT.mp4" type="video/mp4" />
        </video>
      </div>

    </div>
  );
};

export default MultimediaVIP;