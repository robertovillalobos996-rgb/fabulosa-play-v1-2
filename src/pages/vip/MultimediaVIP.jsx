import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const MultimediaVIP = () => {
  // 🔑 LAS 14 API KEYS
  const YOUTUBE_API_KEYS = [
    "AIzaSyDxLD8PviKQwlHBs7rmRm3GoyIKk-aQpww", "AIzaSyACeTldeUs5tbn2Lwr6o_6Lc48rF1nINY0",
    "AIzaSyBUk0oq1zjA6BKx5HK8DEQc1TxQqreqGtk", "AIzaSyBys-0J3T5Ou_fdPGxqYC5LWDMgppwD0Y4",
    "AIzaSyDHdkSo4WSHjYL4nHFU9wKmXW5D9PScO4g", "AIzaSyDJqDMnZsYHyJtzahtvv1r55Z-JfgLk5TU",
    "AIzaSyCruj7UZTEmElS3ZUeUBmYPecbsAA667U8", "AIzaSyBfMNrgQESeymMQ9srVBHKjXB3_WeRfkXE",
    "AIzaSyB1e_YSB74yAelvAhapDWu11VPLz2wBkUg", "AIzaSyCsvViGGiPJxx8-FkSwQvHE2T_U8d2UO5E",
    "AIzaSyBRvdUqolryjMRustJUyqN_HtkjRCbHLfI", "AIzaSyCdmCZW6J49Onl-QAf3cTsNu0im84EBVZc",
    "AIzaSyCeref7W3di_9o6W3YnEtqgvCQyvyQ5a5Q", "AIzaSyAwtE19mD7rpv1pu5nB4R8Q0HmEX9OkgJI"
  ];

  // 📺 VIDEOS DE FONDO
  const videoList = ["0qEOlwW3MjU", "aCXa4Iwxigo", "Uh5eZgjtv0s", "OJv49ohWsnQ"];
  const [currentVideo, setCurrentVideo] = useState(0);

  // ⏰ ROTACIÓN CADA 2 MINUTOS
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videoList.length);
    }, 120000); 
    return () => clearInterval(interval);
  }, [videoList.length]);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* 🎬 VIDEO DE YOUTUBE (Fondo Dinámico) */}
      <div className="absolute inset-0 z-0 pointer-events-none scale-150">
        <iframe
          key={videoList[currentVideo]}
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoList[currentVideo]}?autoplay=1&mute=1&loop=1&playlist=${videoList[currentVideo]}&controls=0&modestbranding=1&rel=0&vq=hd1080`}
          frameBorder="0"
          allow="autoplay; encrypted-media"
        />
      </div>

      {/* 🎧 AUDIO STREAMING (RadioBOSS) */}
      <audio autoPlay src="http://s5.azurahosting.com:8660/radio.mp3" />

      {/* 🟢 LOGO CON CHROMA KEY (Quitando el verde) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-6">
        <video 
          autoPlay loop muted playsInline
          className="w-full drop-shadow-2xl"
          style={{ mixBlendMode: 'screen', filter: 'brightness(1.1) contrast(1.1)' }}
        >
          <source src="/Crea_un_video_animado_de_EXACT.mp4" type="video/mp4" />
        </video>
      </div>

      {/* BOTÓN REGRESAR E INTERFAZ */}
      <div className="relative z-[60] p-6 flex items-center gap-4">
        <Link to="/premium" className="p-3 bg-black/60 backdrop-blur-xl rounded-full text-white hover:bg-yellow-500 transition-all border border-white/10">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-white font-black uppercase text-xl bg-black/40 px-6 py-2 rounded-2xl backdrop-blur-md border border-white/5">Radio Multimedia VIP</h1>
      </div>
    </div>
  );
};

export default MultimediaVIP;