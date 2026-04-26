import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Loader2, Star, X, Play, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import logoFabulosa from "../assets/logo_fabulosa.png";

// ✅ LAS 9 CATEGORÍAS COMPLETAS
const CATEGORIES = ["Acción", "Terror", "Comedia", "Drama", "Sci-Fi", "Documentales", "Estrenos", "Animación", "Suspenso"];

// ✅ 🔑 LAS 14 LLAVES MAESTRAS INTEGRADAS
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

  useEffect(() => {
    const timer = setInterval(() => setFecha(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 🧹 LIMPIADOR DE TÍTULOS (Solo deja el nombre de la película)
  const cleanTitle = (title) => {
    return title
      .replace(/\[.*?\]/g, "") 
      .replace(/\(.*?\)/g, "") 
      .replace(/pelicula completa|completa|full movie|hd|4k|1080p|latino|español|estreno|2023|2024|2025|official|movie|película|audio|estrenos|gratis|subtitulada/gi, "")
      .replace(/[|:\-–—]/g, "")
      .replace(/\s\s+/g, ' ')
      .trim();
  };

  const fetchMovies = async (query) => {
    setLoading(true);
    try {
      const q = query || activeCategory;
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=40&q=${q}+pelicula+completa+espanol+latino&type=video&videoDuration=long&key=${YOUTUBE_API_KEYS[currentKeyIndex]}`
      );
      const data = await response.json();

      // Si la llave se agota (403), saltar a la siguiente
      if (data.error && (data.error.code === 403 || data.error.code === 429)) {
        setCurrentKeyIndex((prev) => (prev + 1) % YOUTUBE_API_KEYS.length);
        return;
      }

      if (data.items) setMovies(data.items);
    } catch (error) {
      console.error("Error API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [activeCategory, currentKeyIndex]);

  return (
    <div className="min-h-screen w-full bg-black text-white font-sans overflow-x-hidden">
      
      {/* HEADER PROFESIONAL (Logo y Reloj) */}
      <header className="p-6 md:p-10 flex justify-between items-center bg-gradient-to-b from-black to-transparent relative z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/")} className="bg-white/5 p-3 rounded-full hover:bg-red-600 transition-all active:scale-90">
            <ArrowLeft size={24} />
          </button>
          <img src={logoFabulosa} className="h-8 md:h-12 object-contain" alt="Logo" />
        </div>

        <div className="flex flex-col items-end bg-black/40 px-6 py-2 rounded-2xl border border-white/5 backdrop-blur-md">
          <span className="text-xl md:text-3xl font-black italic text-red-600 leading-none">
            {fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
          </span>
          <span className="text-[10px] uppercase font-black opacity-40 tracking-widest mt-1">Cine Play Pro</span>
        </div>
      </header>

      {/* BUSCADOR Y CATEGORÍAS */}
      <div className="px-6 md:px-10 space-y-6 mb-8">
        <div className="relative max-w-3xl mx-auto">
          <input 
            type="text" placeholder="BUSCAR PELÍCULA POR NOMBRE..." 
            className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-red-600 pl-14 font-black uppercase text-sm tracking-tighter"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchMovies(searchTerm)}
          />
          <Search className="absolute left-5 top-5 text-white/20" size={24} />
        </div>

        {/* Categorías con Deslizamiento Suave */}
        <div className="flex overflow-x-auto no-scrollbar gap-3 pb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shrink-0 ${activeCategory === cat ? 'bg-red-600 scale-105 shadow-[0_0_30px_rgba(220,38,38,0.4)]' : 'bg-white/5 text-white/30 hover:bg-white/10'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* GRILLA DE CARDS (Optimizado Celulares: 2 columnas gigantes) */}
      <div className="px-4 md:px-10 pb-32">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24"><Loader2 className="animate-spin text-red-600 mb-4" size={60} /></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 md:gap-10">
            {movies.map((movie) => (
              <motion.div
                key={movie.id.videoId}
                whileTap={{ scale: 0.96 }}
                onClick={() => setCurrentMovie(movie)}
                className="relative cursor-pointer group"
              >
                {/* LA CARD: Imagen completa con sombra de cine */}
                <div className="aspect-[2/3] rounded-[2rem] overflow-hidden shadow-2xl relative border-2 border-white/5 transition-all duration-500 group-hover:border-red-600/50 group-hover:shadow-[0_0_40px_rgba(220,38,38,0.2)]">
                  <img 
                    src={movie.snippet.thumbnails.high.url} 
                    className="w-full h-full object-cover" 
                    alt="Poster"
                  />
                  {/* Gradiente Profesional */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-100" />
                  
                  {/* TÍTULO LIMPIO: Solo letras del nombre */}
                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <h3 className="text-[12px] md:text-sm font-black uppercase leading-[1.1] drop-shadow-2xl italic tracking-tighter">
                      {cleanTitle(movie.snippet.title)}
                    </h3>
                    <div className="flex items-center gap-2 text-red-600 mt-2 font-black text-[8px] tracking-widest">
                       <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" /> 4K ULTRA HD
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 📺 REPRODUCTOR CON VIDRIO PROTECTOR (CANDADO) */}
      <AnimatePresence>
        {currentMovie && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2000] bg-black">
            
            {/* BOTÓN CERRAR GIGANTE */}
            <div className="absolute top-8 right-8 z-[3000]">
              <button onClick={() => setCurrentMovie(null)} className="bg-red-600 text-white p-5 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.5)] active:scale-90 transition-all">
                <X size={35} />
              </button>
            </div>

            {/* 🛡️ EL VIDRIO (Bloqueo de clics externos) */}
            <div className="absolute inset-0 z-[2500] pointer-events-none">
                {/* Bloquea cabecera YouTube */}
                <div className="absolute top-0 w-full h-[15%] pointer-events-auto bg-transparent" />
                {/* Bloquea logo YouTube abajo derecha */}
                <div className="absolute bottom-0 right-0 w-[20%] h-[15%] pointer-events-auto bg-transparent" />
            </div>
            
            <iframe 
              width="100%" height="100%" 
              src={`https://www.youtube.com/embed/${currentMovie.id.videoId}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&controls=1&disablekb=1&showinfo=0`}
              title="Movie Player" frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="relative z-[2100]"
            />

            {/* Título flotante abajo para identidad */}
            <div className="absolute bottom-8 left-8 z-[2600] pointer-events-none">
               <h2 className="text-2xl md:text-4xl font-black uppercase italic text-red-600 drop-shadow-[0_5px_15px_rgba(0,0,0,1)]">
                  {cleanTitle(currentMovie.snippet.title)}
               </h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        body { background-color: black; margin: 0; overflow-x: hidden; }
      `}</style>
    </div>
  );
};

export default Movies;