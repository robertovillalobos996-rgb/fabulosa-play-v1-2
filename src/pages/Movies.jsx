import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Search, Film, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Acción");
  const [loading, setLoading] = useState(false);
  
  // 💰 LÓGICA DE PUBLICIDAD MID-ROLL (MONETAG)
  const [showAd, setShowAd] = useState(false);
  const [adTimer, setAdTimer] = useState(5);
  const [secondsWatched, setSecondsWatched] = useState(0);
  const [adTriggered, setAdTriggered] = useState(false);

  const YOUTUBE_API_KEYS = [
    "AIzaSyDxLD8PviKQwlHBs7rmRm3GoyIKk-aQpww", "AIzaSyACeTldeUs5tbn2Lwr6o_6Lc48rF1nINY0",
    "AIzaSyBUk0oq1zjA6BKx5HK8DEQc1TxQqreqGtk", "AIzaSyBys-0J3T5Ou_fdPGxqYC5LWDMgppwD0Y4",
    "AIzaSyDHdkSo4WSHjYL4nHFU9wKmXW5D9PScO4g", "AIzaSyDJqDMnZsYHyJtzahtvv1r55Z-JfgLk5TU",
    "AIzaSyCruj7UZTEmElS3ZUeUBmYPecbsAA667U8", "AIzaSyBfMNrgQESeymMQ9srVBHKjXB3_WeRfkXE",
    "AIzaSyB1e_YSB74yAelvAhapDWu11VPLz2wBkUg", "AIzaSyCsvViGGiPJxx8-FkSwQvHE2T_U8d2UO5E",
    "AIzaSyBRvdUqolryjMRustJUyqN_HtkjRCbHLfI", "AIzaSyCdmCZW6J49Onl-QAf3cTsNu0im84EBVZc",
    "AIzaSyCeref7W3di_9o6W3YnEtqgvCQyvyQ5a5Q", "AIzaSyAwtE19mD7rpv1pu5nB4R8Q0HmEX9OkgJI"
  ];

  const keyIndex = useRef(0);

  // 🕵️ MONITOR DE TIEMPO (7 MINUTOS = 420 SEGUNDOS)
  useEffect(() => {
    let interval;
    if (currentMovie && !showAd) {
      interval = setInterval(() => {
        setSecondsWatched(prev => {
          const newTime = prev + 1;
          // Dispara el comercial a los 7 minutos (420 segundos)
          if (newTime === 420 && !adTriggered) {
            triggerCommercial();
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentMovie, showAd, adTriggered]);

  const triggerCommercial = () => {
    setShowAd(true);
    setAdTimer(5);
    setAdTriggered(true);

    // 💉 INYECCIÓN GLOBAL DE MONETAG (ID: 8987154)
    try {
      if (typeof window.show_8987154 === 'function') {
        window.show_8987154();
      }
    } catch (e) {
      console.error("Error al cargar anuncio:", e);
    }
    
    const count = setInterval(() => {
      setAdTimer(prev => {
        if (prev <= 1) {
          clearInterval(count);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const fetchMovies = async (query) => {
    setLoading(true);
    let success = false;
    while (keyIndex.current < YOUTUBE_API_KEYS.length && !success) {
      try {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(query + " película completa español latino")}&type=video&videoDuration=long&key=${YOUTUBE_API_KEYS[keyIndex.current]}`);
        if (res.status === 403) { keyIndex.current++; continue; }
        const data = await res.json();
        setMovies(data.items || []);
        success = true;
      } catch (e) { keyIndex.current++; }
    }
    setLoading(false);
  };

  useEffect(() => { fetchMovies(activeCategory); }, [activeCategory]);

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      {/* HEADER BUSCADOR */}
      <div className="p-4 md:p-6 flex items-center justify-between border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="p-3 bg-zinc-900 rounded-full hover:bg-yellow-400 hover:text-black transition-all">
          <ArrowLeft size={24} />
        </Link>
        <div className="flex-1 max-w-xl mx-4 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text" placeholder="Buscar película..." 
            className="w-full bg-zinc-900 border-none rounded-full py-3 pl-12 pr-6 focus:ring-2 focus:ring-yellow-400 outline-none text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* CATEGORÍAS */}
      <div className="flex gap-3 p-4 md:p-6 overflow-x-auto no-scrollbar">
        {["Acción", "Terror", "Comedia", "Animación", "Drama", "Cristiano"].map(cat => (
          <button 
            key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full font-black uppercase text-xs border-2 whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-yellow-400 border-yellow-400 text-black' : 'border-white/10 text-gray-400'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID DE PELÍCULAS */}
      <div className="p-4 md:p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
        {loading ? (
            <div className="col-span-full flex justify-center py-20"><Loader2 className="animate-spin text-yellow-400" size={48} /></div>
        ) : (
          movies.map(movie => (
            <motion.div 
              key={movie.id.videoId} whileHover={{ scale: 1.05 }} 
              onClick={() => { setCurrentMovie(movie); setSecondsWatched(0); setAdTriggered(false); }}
              className="cursor-pointer group"
            >
              <div className="aspect-[2/3] rounded-[2rem] overflow-hidden border-4 border-transparent group-hover:border-yellow-400 shadow-2xl relative bg-zinc-900">
                <img src={movie.snippet.thumbnails.high.url} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play fill="white" size={48} />
                </div>
              </div>
              <h3 className="mt-3 text-[10px] md:text-xs font-black uppercase text-center line-clamp-2 px-2">{movie.snippet.title}</h3>
            </motion.div>
          ))
        )}
      </div>

      {/* REPRODUCTOR Y MODAL DE ANUNCIO */}
      <AnimatePresence>
        {currentMovie && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black flex flex-col">
            
            <div className="p-4 flex justify-between items-center bg-zinc-900 border-b border-white/10">
              <button onClick={() => setCurrentMovie(null)} className="bg-red-600 px-6 py-2 rounded-full font-black text-xs uppercase hover:scale-105 transition-transform">Salir</button>
              <h2 className="text-xs font-black truncate max-w-[50%] md:max-w-md px-4 uppercase">{currentMovie.snippet.title}</h2>
              <div className="w-10"></div>
            </div>

            <div className="flex-1 relative">
              <iframe 
                width="100%" height="100%" 
                src={`https://www.youtube.com/embed/${currentMovie.id.videoId}?autoplay=1&controls=1&rel=0&modestbranding=1`}
                frameBorder="0" allow="autoplay; encrypted-media; fullscreen"
              />

              {/* 📺 EL COMERCIAL (A LOS 7 MIN) */}
              {showAd && (
                <div className="absolute inset-0 z-[200] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-full max-w-4xl aspect-video bg-zinc-900 rounded-[3rem] overflow-hidden border-4 border-yellow-400 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(250,204,21,0.3)]">
                    <Sparkles className="text-yellow-400 mb-4 animate-bounce" size={64} />
                    <h2 className="text-2xl md:text-4xl font-black uppercase mb-2">Publicidad Premium</h2>
                    <p className="text-gray-400 text-sm md:text-lg">Gracias por tu espera, la película continuará en breve.</p>
                  </div>

                  <div className="mt-10">
                    <button 
                      disabled={adTimer > 0}
                      onClick={() => setShowAd(false)}
                      className={`px-12 py-4 rounded-full font-black uppercase text-xl transition-all shadow-2xl ${
                        adTimer > 0 ? 'bg-zinc-800 text-gray-600' : 'bg-yellow-400 text-black scale-110 active:scale-95'
                      }`}
                    >
                      {adTimer > 0 ? `Saltar en ${adTimer}...` : "Saltar Anuncio ❱"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Movies;