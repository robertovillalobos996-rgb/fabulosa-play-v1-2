import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Loader2, Music, X, Play, Clock, Star, Mic2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import logoFabulosa from "../assets/logo_fabulosa.png";

// 🔑 LAS 14 LLAVES MAESTRAS (Respaldo total)
const YOUTUBE_API_KEYS = [
  "AIzaSyDxLD8PviKQwlHBs7rmRm3GoyIKk-aQpww", "AIzaSyACeTldeUs5tbn2Lwr6o_6Lc48rF1nINY0",
  "AIzaSyBUk0oq1zjA6BKx5HK8DEQc1TxQqreqGtk", "AIzaSyBys-0J3T5Ou_fdPGxqYC5LWDMgppwD0Y4",
  "AIzaSyDHdkSo4WSHjYL4nHFU9wKmXW5D9PScO4g", "AIzaSyDJqDMnZsYHyJtzahtvv1r55Z-JfgLk5TU",
  "AIzaSyCruj7UZTEmElS3ZUeUBmYPecbsAA667U8", "AIzaSyBfMNrgQESeymMQ9srVBHKjXB3_WeRfkXE",
  "AIzaSyB1e_YSB74yAelvAhapDWu11VPLz2wBkUg", "AIzaSyCsvViGGiPJxx8-FkSwQvHE2T_U8d2UO5E",
  "AIzaSyBRvdUqolryjMRustJUyqN_HtkjRCbHLfI", "AIzaSyCdmCZW6J49Onl-QAf3cTsNu0im84EBVZc",
  "AIzaSyCeref7W3di_9o6W3YnEtqgvCQyvyQ5a5Q", "AIzaSyAwtE19mD7rpv1pu5nB4R8Q0HmEX9OkgJI"
];

const Karaoke = () => {
  const navigate = useNavigate();
  const [fecha, setFecha] = useState(new Date());
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [keyIndex, setKeyIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setFecha(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 🧹 LIMPIADOR DE TÍTULOS (Solo nombre y artista)
  const cleanTitle = (title) => {
    return title
      .replace(/\[.*?\]/g, "") 
      .replace(/\(.*?\)/g, "") 
      .replace(/karaoke|instrumental|con guia|version|lyrics|letra|pista|pistas|oficial|original|hd|4k/gi, "")
      .replace(/[|:\-–—]/g, " ")
      .trim();
  };

  const searchSongs = async (searchQuery) => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=30&q=${searchQuery}+karaoke+espanol&type=video&key=${YOUTUBE_API_KEYS[keyIndex]}`
      );
      const data = await response.json();

      if (data.error && (data.error.code === 403 || data.error.code === 429)) {
        setKeyIndex((prev) => (prev + 1) % YOUTUBE_API_KEYS.length);
        return;
      }

      if (data.items) setSongs(data.items);
    } catch (error) {
      console.error("Error Karaoke API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchSongs("exitos actuales");
  }, [keyIndex]);

  return (
    <div className="min-h-screen w-full bg-[#080008] text-white font-sans overflow-x-hidden selection:bg-fuchsia-600">
      
      {/* FONDO ANIMADO NEÓN */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full animate-pulse delay-1000" />
      </div>

      {/* HEADER PRO */}
      <header className="relative z-50 p-6 md:p-10 flex justify-between items-center bg-gradient-to-b from-black to-transparent">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/")} className="bg-white/5 p-3 rounded-full hover:bg-fuchsia-600 transition-all active:scale-90 border border-white/10">
            <ArrowLeft size={24} />
          </button>
          <img src={logoFabulosa} className="h-8 md:h-12 object-contain" alt="Logo" />
        </div>

        <div className="flex flex-col items-end bg-black/40 px-6 py-2 rounded-2xl border border-fuchsia-500/20 backdrop-blur-md">
          <span className="text-xl md:text-3xl font-black italic text-fuchsia-500 leading-none shadow-fuchsia-500/50 drop-shadow-md">
            {fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
          </span>
          <div className="flex items-center gap-2 mt-1">
             <Mic2 size={12} className="text-cyan-400" />
             <span className="text-[10px] uppercase font-black opacity-50 tracking-[0.2em]">Karaoke Play</span>
          </div>
        </div>
      </header>

      {/* BUSCADOR INTELIGENTE */}
      <div className="relative z-50 px-6 md:px-10 mb-10">
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="BUSCAR ARTISTA O CANCIÓN..." 
              className="w-full bg-white/5 border-2 border-white/10 p-5 rounded-[2rem] outline-none focus:border-fuchsia-600 pl-14 font-black uppercase text-sm tracking-widest transition-all placeholder:text-white/20 group-hover:bg-white/10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchSongs(query)}
            />
            <Search className="absolute left-6 top-6 text-fuchsia-500" size={24} />
            <button 
                onClick={() => searchSongs(query)}
                className="absolute right-3 top-2.5 bg-fuchsia-600 px-6 py-3 rounded-[1.5rem] font-black text-xs hover:bg-fuchsia-500 active:scale-95 transition-all shadow-lg shadow-fuchsia-600/30"
            >
                BUSCAR
            </button>
          </div>

          {/* Sugerencias Rápidas */}
          <div className="flex gap-3 mt-6 overflow-x-auto no-scrollbar pb-2">
            {["José José", "Christian Nodal", "Karol G", "Selena", "Rancheras", "Baladas"].map(tag => (
              <button 
                key={tag}
                onClick={() => { setQuery(tag); searchSongs(tag); }}
                className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-fuchsia-500 hover:text-fuchsia-500 transition-all whitespace-nowrap"
              >
                🔥 {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GRILLA DE CANCIONES (2 columnas en celular) */}
      <div className="relative z-50 px-4 md:px-10 pb-32">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-fuchsia-500 mb-4" size={60} />
            <span className="font-black text-xs uppercase tracking-[0.5em] text-fuchsia-500/50">Afinando Voz...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-8">
            {songs.map((song) => (
              <motion.div
                key={song.id.videoId}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentSong(song)}
                className="relative cursor-pointer group"
              >
                <div className="aspect-square rounded-[2rem] overflow-hidden shadow-2xl relative border-2 border-white/5 group-hover:border-fuchsia-500/50 transition-all">
                  <img src={song.snippet.thumbnails.high.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Song" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080008] via-transparent to-transparent opacity-90" />
                  
                  {/* Botón Play Central */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-fuchsia-600 p-4 rounded-full shadow-fuchsia-600/50 shadow-xl">
                      <Play size={30} fill="white" />
                    </div>
                  </div>

                  {/* Info Canción */}
                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <h3 className="text-[11px] md:text-sm font-black uppercase leading-tight drop-shadow-lg italic">
                      {cleanTitle(song.snippet.title)}
                    </h3>
                    <div className="flex items-center gap-1 text-cyan-400 mt-1">
                      <Star size={10} fill="currentColor" />
                      <span className="text-[8px] font-black tracking-widest uppercase">HD Karaoke</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 📺 REPRODUCTOR FULLSCREEN CON "VIDRIO" (CANDADO) */}
      <AnimatePresence>
        {currentSong && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2000] bg-black">
            
            {/* 🛡️ EL VIDRIO (Protección invisible) */}
            <div className="absolute inset-0 z-[2500] pointer-events-none">
              {/* Bloquea cabecera (Título de YouTube) */}
              <div className="absolute top-0 w-full h-[20%] pointer-events-auto bg-transparent cursor-default" />
              {/* Bloquea logo de YouTube y botones de compartir abajo */}
              <div className="absolute bottom-0 right-0 w-[30%] h-[15%] pointer-events-auto bg-transparent cursor-default" />
              <div className="absolute bottom-0 left-0 w-full h-[10%] pointer-events-auto bg-transparent cursor-default" />
            </div>

            {/* CONTROLES SUPERIORES */}
            <div className="absolute top-6 left-0 w-full px-6 flex justify-between items-center z-[3000]">
               <div className="bg-black/60 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 max-w-[70%]">
                  <h2 className="text-lg md:text-2xl font-black uppercase italic text-fuchsia-500 truncate">
                    {cleanTitle(currentSong.snippet.title)}
                  </h2>
               </div>
               <button 
                onClick={() => setCurrentSong(null)}
                className="bg-red-600 text-white p-4 rounded-full shadow-2xl active:scale-90 transition-all border-2 border-white/20"
               >
                <X size={30} />
               </button>
            </div>
            
            {/* VIDEO PLAYER */}
            <iframe 
              width="100%" height="100%" 
              src={`https://www.youtube.com/embed/${currentSong.id.videoId}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&controls=1&disablekb=1`}
              title="Karaoke Player" frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="relative z-[2100]"
            />

            {/* BOTÓN REPETIR (Para el usuario) */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[3000]">
               <button 
                onClick={() => {
                   const vid = currentSong;
                   setCurrentSong(null);
                   setTimeout(() => setCurrentSong(vid), 100);
                }}
                className="bg-cyan-600/80 backdrop-blur-md px-8 py-4 rounded-full flex items-center gap-3 font-black uppercase text-xs tracking-widest border border-white/20 shadow-2xl active:scale-95"
               >
                <RotateCcw size={20} /> REPETIR CANCIÓN
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        body { background-color: #080008; margin: 0; overflow-x: hidden; }
      `}</style>
    </div>
  );
};

export default Karaoke;