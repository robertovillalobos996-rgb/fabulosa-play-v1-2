import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const FabulosaMixVIP = () => {
  // 🔑 API KEYS SOLICITADAS
  const YOUTUBE_API_KEYS = [
    "AIzaSyDxLD8PviKQwlHBs7rmRm3GoyIKk-aQpww", "AIzaSyACeTldeUs5tbn2Lwr6o_6Lc48rF1nINY0",
    "AIzaSyBUk0oq1zjA6BKx5HK8DEQc1TxQqreqGtk", "AIzaSyBys-0J3T5Ou_fdPGxqYC5LWDMgppwD0Y4",
    "AIzaSyDHdkSo4WSHjYL4nHFU9wKmXW5D9PScO4g", "AIzaSyDJqDMnZsYHyJtzahtvv1r55Z-JfgLk5TU",
    "AIzaSyCruj7UZTEmElS3ZUeUBmYPecbsAA667U8", "AIzaSyBfMNrgQESeymMQ9srVBHKjXB3_WeRfkXE",
    "AIzaSyB1e_YSB74yAelvAhapDWu11VPLz2wBkUg", "AIzaSyCsvViGGiPJxx8-FkSwQvHE2T_U8d2UO5E",
    "AIzaSyBRvdUqolryjMRustJUyqN_HtkjRCbHLfI", "AIzaSyCdmCZW6J49Onl-QAf3cTsNu0im84EBVZc",
    "AIzaSyCeref7W3di_9o6W3YnEtqgvCQyvyQ5a5Q", "AIzaSyAwtE19mD7rpv1pu5nB4R8Q0HmEX9OkgJI"
  ];

  // 📺 ROTACIÓN DE VIDEOS CADA 2 MINUTOS
  const videoIds = ["0qEOlwW3MjU", "aCXa4Iwxigo", "Uh5eZgjtv0s", "OJv49ohWsnQ"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % videoIds.length);
    }, 120000); 
    return () => clearInterval(timer);
  }, [videoIds.length]);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col">
      {/* 🎬 FONDO YOUTUBE */}
      <div className="absolute inset-0 z-0 pointer-events-none scale-150 opacity-80">
        <iframe
          key={videoIds[index]}
          className="w-full h-full"
          src={"https://www.youtube.com/embed/" + videoIds[index] + "?autoplay=1&mute=1&loop=1&playlist=" + videoIds[index] + "&controls=0&modestbranding=1&rel=0&vq=hd1080"}
          frameBorder="0" allow="autoplay; encrypted-media" title="Fondo Mix"
        ></iframe>
      </div>

      {/* 🎧 AUDIO RADIOBOSS */}
      <audio autoPlay src="http://s5.azurahosting.com:8660/radio.mp3"></audio>

      {/* CABECERA */}
      <div className="relative z-50 p-6 flex items-center gap-4 bg-gradient-to-b from-black/90 to-transparent">
        <Link to="/premium" className="p-3 bg-zinc-900/90 rounded-full hover:bg-yellow-500 transition-all border border-white/10 shadow-2xl">
          <ArrowLeft size={24} className="text-white" />
        </Link>
        <h1 className="text-white font-black uppercase text-2xl drop-shadow-lg">Fabulosa Mix</h1>
      </div>

      {/* 🟢 REPRODUCTOR GIGANTE EN PANTALLA (LOGO) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-11/12 md:w-1/2 flex justify-center items-center pointer-events-none">
        <img 
          src="/logo-fabulosamix.png" 
          alt="Fabulosa Mix Gigante" 
          className="w-full h-auto object-contain drop-shadow-[0_0_60px_rgba(255,255,255,0.4)]"
        />
      </div>
    </div>
  );
};

export default FabulosaMixVIP;