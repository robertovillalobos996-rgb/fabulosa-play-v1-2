import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import logoFabulosa from "../assets/logo_fabulosa.png";

const CATEGORIES = ["Acción", "Terror", "Comedia", "Drama", "Sci-Fi", "Documentales", "Estrenos", "Animación", "Suspenso"];

const YOUTUBE_API_KEYS = [
  "AIzaSyDxLD8PviKQwlHBs7rmRm3GoyIKk-aQpww", "AIzaSyACeTldeUs5tbn2Lwr6o_6Lc48rF1nINY0",
  "AIzaSyBUk0oq1zjA6BKx5HK8DEQc1TxQqreqGtk", "AIzaSyBys-0J3T5Ou_fdPGxqYC5LWDMgppwD0Y4",
  "AIzaSyDHdkSo4WSHjYL4nHFU9wKmXW5D9PScO4g", "AIzaSyDJqDMnZsYHyJtzahtvv1r55Z-JfgLk5TU",
  "AIzaSyCruj7UZTEmElS3ZUeUBmYPecbsAA667U8", "AIzaSyBfMNrgQESeymMQ9srVBHKjXB3_WeRfkXE",
  "AIzaSyB1e_YSB74yAelvAhapDWu11VPLz2wBkUg", "AIzaSyCsvViGGiPJxx8-FkSwQvHE2T_U8d2UO5E",
  "AIzaSyBRvdUqolryjMRustJUyqN_HtkjRCbHLfI", "AIzaSyCdmCZW6J49Onl-QAf3cTsNu0im84EBVZc",
  "AIzaSyCeref7W3di_9o6W3YnEtqgvCQyvyQ5a5Q", "AIzaSyAwtE19mD7rpv1pu5nB4R8Q0HmEX9OkgJI"
];

const Movies = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Acción");
  const [loading, setLoading] = useState(false);
  const [fecha, setFecha] = useState(new Date());
  const [currentKeyIndex, setCurrentKeyIndex] = useState(0);

  // ESTADOS DE NAVEGACIÓN PARA TV
  const [focusedSection, setFocusedSection] = useState("grid"); // "back", "search", "categories", "grid"
  const [focusedIndex, setFocusedIndex] = useState(0);

  const gridRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setFecha(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const cleanTitle = (title) => {
    return title.replace(/\[.*?\]/g, "").replace(/\(.*?\)/g, "").replace(/pelicula completa|completa|full movie|hd|4k|latino|español|estreno/gi, "").replace(/[|:\-–—]/g, "").trim();
  };

  const fetchMovies = async (query) => {
    setLoading(true);
    try {
      const q = query || activeCategory;
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=40&q=${q}+pelicula+completa+espanol+latino&type=video&videoDuration=long&key=${YOUTUBE_API_KEYS[currentKeyIndex]}`);
      const data = await response.json();
      if (data.error && (data.error.code === 403 || data.error.code === 429)) {
        setCurrentKeyIndex((prev) => (prev + 1) % YOUTUBE_API_KEYS.length);
        return;
      }
      if (data.items) setMovies(data.items);
    } catch (error) { console.error("Error API:", error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchMovies(); }, [activeCategory, currentKeyIndex]);

  // MOTOR DE NAVEGACIÓN ESPACIAL PARA CINE
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentMovie) {
        if (e.key === "Escape" || e.key === "Back" || e.key === "X") setCurrentMovie(null);
        return;
      }

      if (focusedSection === "grid") {
        const cols = window.innerWidth >= 1280 ? 6 : window.innerWidth >= 1024 ? 5 : 2;
        if (e.key === "ArrowRight") setFocusedIndex(p => Math.min(p + 1, movies.length - 1));
        if (e.key === "ArrowLeft") {
          if (focusedIndex % cols === 0) setFocusedSection("categories");
          else setFocusedIndex(p => Math.max(p - 1, 0));
        }
        if (e.key === "ArrowDown") setFocusedIndex(p => Math.min(p + cols, movies.length - 1));
        if (e.key === "ArrowUp") {
          if (focusedIndex < cols) setFocusedSection("categories");
          else setFocusedIndex(p => Math.max(p - cols, 0));
        }
        if (e.key === "Enter") setCurrentMovie(movies[focusedIndex]);
      } 
      else if (focusedSection === "categories") {
        if (e.key === "ArrowRight") setFocusedIndex(p => Math.min(p + 1, CATEGORIES.length - 1));
        if (e.key === "ArrowLeft") setFocusedIndex(p => Math.max(p - 1, 0));
        if (e.key === "ArrowDown") { setFocusedSection("grid"); setFocusedIndex(0); }
        if (e.key === "ArrowUp") setFocusedSection("search");
        if (e.key === "Enter") setActiveCategory(CATEGORIES[focusedIndex]);
      }
      else if (focusedSection === "search") {
        if (e.key === "ArrowDown") setFocusedSection("categories");
        if (e.key === "ArrowUp") setFocusedSection("back");
      }
      else if (focusedSection === "back") {
        if (e.key === "ArrowDown") setFocusedSection("search");
        if (e.key === "Enter") navigate("/");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedSection, focusedIndex, movies, currentMovie]);

  return (
    <div className="min-h-screen w-full bg-black text-white font-sans overflow-x-hidden app-container-4k">
      <div className="bg-film-grain absolute inset-0 pointer-events-none" />
      
      <header className="p-6 md:p-10 flex justify-between items-center relative z-50">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate("/")} 
            className={`bg-red-600 p-4 rounded-full shadow-2xl transition-all duration-700 group outline-none ${focusedSection === "back" ? 'ring-4 ring-white scale-110' : ''}`}
          >
            <ArrowLeft className="group-hover:rotate-[-360deg] transition-transform duration-700" size={28} />
          </button>
          <img src={logoFabulosa} className="h-10 md:h-16 object-contain drop-shadow-2xl" alt="Logo" />
        </div>

        <div className="flex flex-col items-end bg-black/60 px-8 py-3 rounded-2xl border border-white/10 backdrop-blur-xl">
          <span className="text-2xl md:text-4xl font-black italic text-red-600 leading-none text-hdr-4k">
            {fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
          </span>
          <span className="text-[10px] uppercase font-black opacity-60 tracking-[0.3em] mt-2">Cine Play VIP</span>
        </div>
      </header>

      <div className="px-6 md:px-10 space-y-8 mb-12 relative z-10">
        <div className={`relative max-w-4xl mx-auto transition-all ${focusedSection === "search" ? 'scale-105' : ''}`}>
          <input 
            type="text" placeholder="BUSCAR PELÍCULA..." 
            className={`w-full bg-white/5 border p-6 rounded-[2rem] outline-none pl-16 font-black uppercase text-lg transition-all ${focusedSection === "search" ? 'border-red-600 ring-4 ring-red-600/20 bg-white/10' : 'border-white/10'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-6 top-6 text-red-600" size={28} />
        </div>

        <div className="flex overflow-x-auto no-scrollbar gap-4 pb-6 px-2">
          {CATEGORIES.map((cat, idx) => (
            <button
              key={cat}
              className={`px-10 py-5 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all shrink-0 outline-none ${activeCategory === cat ? 'bg-red-600' : 'bg-white/5'} ${(focusedSection === "categories" && focusedIndex === idx) ? 'ring-4 ring-white scale-110 bg-red-500 shadow-[0_0_40px_rgba(255,255,255,0.2)]' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 md:px-10 pb-40 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32"><Loader2 className="animate-spin text-red-600" size={80} /></div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-12">
            {movies.map((movie, idx) => (
              <div
                key={movie.id.videoId}
                onClick={() => setCurrentMovie(movie)}
                className={`relative cursor-pointer transition-all duration-500 group rounded-[2.5rem] overflow-hidden border-4 outline-none ${(focusedSection === "grid" && focusedIndex === idx) ? 'scale-110 border-white ring-4 ring-red-600 z-20 shadow-[0_0_60px_rgba(220,38,38,0.4)]' : 'border-white/5'}`}
              >
                <div className="aspect-[2/3] relative">
                  <img src={movie.snippet.thumbnails.high.url} loading="lazy" className="w-full h-full object-cover" alt="Poster" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute bottom-0 p-5 w-full">
                    <h3 className="text-sm font-black uppercase leading-tight italic drop-shadow-2xl">{cleanTitle(movie.snippet.title)}</h3>
                    <div className="flex items-center gap-2 text-red-600 mt-2 font-bold text-[9px] tracking-widest">
                       <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" /> 4K HDR
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {currentMovie && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2000] bg-black">
            <button onClick={() => setCurrentMovie(null)} className="absolute top-10 right-10 z-[3000] bg-red-600 p-6 rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all">
              <X size={40} />
            </button>
            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${currentMovie.id.videoId}?autoplay=1&rel=0&modestbranding=1&controls=1`} className="relative z-[2100]" allowFullScreen />
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        body { background-color: black; margin: 0; overflow-x: hidden; }
      `}</style>
    </div>
  );
};

export default Movies;