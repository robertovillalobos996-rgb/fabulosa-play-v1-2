import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
// ✅ IMPORTACIÓN CORREGIDA: Se agregó 'Star'
import { ArrowLeft, Play, Pause, Search, Maximize, Loader2, Volume2, VolumeX, Clapperboard, Film, Star, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ["Acción", "Terror", "Comedia", "Drama", "Sci-Fi", "Documentales"];

const Movies = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Acción");
  const [loading, setLoading] = useState(false);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  
  // === 🎮 ESTADOS CONTROL REMOTO ===
  const [activeIndex, setActiveIndex] = useState(0); 
  const gridRefs = useRef([]);

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

  const fetchMovies = async (query) => {
    setLoading(true);
    let success = false;
    while (keyIndex.current < YOUTUBE_API_KEYS.length && !success) {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(
            query + " pelicula completa español latino"
          )}&type=video&videoDuration=long&key=${YOUTUBE_API_KEYS[keyIndex.current]}`
        );
        if (res.status === 403 || res.status === 429) {
          keyIndex.current++;
          continue;
        }
        const data = await res.json();
        setMovies(data.items || []);
        success = true;
      } catch (e) {
        keyIndex.current++;
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies(activeCategory);
  }, [activeCategory]);

  const handleSearch = (e) => {
    if(e) e.preventDefault();
    if (searchTerm) fetchMovies(searchTerm);
  };

  // 🕹️ MOTOR DE NAVEGACIÓN CONTROL REMOTO
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentMovie) return; 
      
      const cols = 5; 
      const totalCats = CATEGORIES.length;
      const totalMovies = movies.length;

      if (e.key === "ArrowRight") setActiveIndex(p => Math.min(p + 1, totalCats + totalMovies - 1));
      if (e.key === "ArrowLeft") setActiveIndex(p => (p === 0 || p === totalCats) ? -1 : Math.max(p - 1, -1));
      
      if (e.key === "ArrowDown") {
        if (activeIndex === -1) setActiveIndex(0);
        else if (activeIndex < totalCats) setActiveIndex(totalCats);
        else setActiveIndex(p => Math.min(p + cols, totalCats + totalMovies - 1));
      }
      
      if (e.key === "ArrowUp") {
        if (activeIndex < totalCats) setActiveIndex(-1);
        else if (activeIndex < totalCats + cols) setActiveIndex(0);
        else setActiveIndex(p => p - cols);
      }

      if (e.key === "Enter") {
        if (activeIndex === -1) navigate("/");
        else if (activeIndex < totalCats) {
          setActiveCategory(CATEGORIES[activeIndex]);
        } else {
          setCurrentMovie(movies[activeIndex - totalCats]);
        }
      }

      if (e.key === "Escape" || e.key === "Backspace") {
        if (currentMovie) setCurrentMovie(null);
        else navigate("/");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, movies, currentMovie, navigate]);

  useEffect(() => {
    if (activeIndex >= 0 && gridRefs.current[activeIndex]) {
      gridRefs.current[activeIndex].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeIndex]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden">
      
      {/* 🚀 BOTÓN VOLVER NEÓN */}
      <div className="fixed top-6 left-6 z-[100]">
        <button 
          onClick={() => navigate("/")}
          className={`
            flex items-center gap-3 px-6 py-2.5 rounded-full border-4 transition-all duration-300
            ${activeIndex === -1 
              ? 'bg-yellow-600 border-white scale-110 shadow-[0_0_40px_rgba(255,255,255,0.5)]' 
              : 'bg-black/50 border-white/10 opacity-70'}
          `}
        >
          <ArrowLeft size={24} className="text-white" />
          <span className="font-black uppercase tracking-widest text-sm">Menú</span>
        </button>
      </div>

      <div className="max-w-[1800px] mx-auto p-6 md:p-12">
        <header className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 pt-10">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-400 p-3 rounded-2xl text-black">
              <Film size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase">Cine<span className="text-yellow-400">Play</span></h1>
          </div>

          <form onSubmit={handleSearch} className="w-full md:w-[500px] relative">
            <input
              type="text"
              placeholder="Busca tu película favorita..."
              className="w-full bg-zinc-900 border-2 border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-yellow-400 transition-all italic"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute right-4 top-4 text-white/40 hover:text-yellow-400">
              <Search size={24} />
            </button>
          </form>
        </header>

        {/* CATEGORÍAS */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat}
              ref={el => gridRefs.current[i] = el}
              onClick={() => { setActiveCategory(cat); setActiveIndex(i); }}
              className={`
                px-8 py-3 rounded-full font-black uppercase text-xs tracking-widest transition-all border-2
                ${activeCategory === cat ? "bg-white text-black border-white" : "bg-transparent border-white/10"}
                ${activeIndex === i ? "ring-4 ring-yellow-400 scale-105" : ""}
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <Loader2 className="animate-spin text-yellow-400 mb-4" size={60} />
            <p className="font-black uppercase tracking-[0.3em] text-yellow-400">Cargando...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie, idx) => {
              const globalIdx = idx + CATEGORIES.length;
              const isFocused = activeIndex === globalIdx;
              return (
                <motion.div
                  key={movie.id.videoId}
                  ref={el => gridRefs.current[globalIdx] = el}
                  onClick={() => setCurrentMovie(movie)}
                  className={`
                    relative group cursor-pointer aspect-[2/3] rounded-[2rem] overflow-hidden border-4 transition-all
                    ${isFocused ? 'border-yellow-400 scale-105 shadow-[0_0_50px_rgba(250,204,21,0.3)] z-50' : 'border-white/5'}
                  `}
                >
                  <img src={movie.snippet.thumbnails.high.url} className="w-full h-full object-cover" alt="Poster" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-6">
                    <h3 className="font-black text-sm uppercase leading-tight mb-2">{movie.snippet.title}</h3>
                    {/* ✅ AQUÍ ESTÁ LA ESTRELLA CORREGIDA */}
                    <div className="flex items-center gap-2 text-yellow-400 font-bold text-[10px]">
                      <Star size={12} fill="currentColor" /> 4K ULTRA HD
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* REPRODUCTOR */}
      <AnimatePresence>
        {currentMovie && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] bg-black">
             <div className="absolute top-8 left-8 z-[1100]">
                <button onClick={() => setCurrentMovie(null)} className="bg-white/10 hover:bg-yellow-400 hover:text-black p-4 rounded-full backdrop-blur-xl transition-all">
                  <X size={32} />
                </button>
             </div>
             <iframe 
                width="100%" height="100%" frameBorder="0" allow="autoplay; fullscreen"
                src={`https://www.youtube.com/embed/${currentMovie.id.videoId}?autoplay=1&rel=0&modestbranding=1`}
             />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Movies;