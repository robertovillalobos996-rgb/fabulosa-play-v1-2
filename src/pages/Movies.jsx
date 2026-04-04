import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Star, Clock, Search, Film, LayoutGrid, Loader2 } from "lucide-react";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Acción");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // === 💰 ESTADOS PARA EL COMERCIAL DE 30 MINUTOS (ADSENSE) ===
  const ADSENSE_SLOT = "7869741603";
  const AD_INTERVAL = 30 * 60 * 1000; // 30 minutos
  const LONG_AD_DURATION = 12; // 12 segundos

  const [longAdActive, setLongAdActive] = useState(false);
  const [longAdTimer, setLongAdTimer] = useState(LONG_AD_DURATION);

  // 🔑 LAS 14 LLAVES MAESTRAS DE YOUTUBE (ROTACIÓN AUTOMÁTICA)
  const YOUTUBE_API_KEYS = [
    "AIzaSyDxLD8PviKQwlHBs7rmRm3GoyIKk-aQpww",
    "AIzaSyACeTldeUs5tbn2Lwr6o_6Lc48rF1nINY0",
    "AIzaSyBUk0oq1zjA6BKx5HK8DEQc1TxQqreqGtk",
    "AIzaSyBys-0J3T5Ou_fdPGxqYC5LWDMgppwD0Y4",
    "AIzaSyDHdkSo4WSHjYL4nHFU9wKmXW5D9PScO4g",
    "AIzaSyDJqDMnZsYHyJtzahtvv1r55Z-JfgLk5TU",
    "AIzaSyCruj7UZTEmElS3ZUeUBmYPecbsAA667U8",
    "AIzaSyBfMNrgQESeymMQ9srVBHKjXB3_WeRfkXE",
    "AIzaSyB1e_YSB74yAelvAhapDWu11VPLz2wBkUg",
    "AIzaSyCsvViGGiPJxx8-FkSwQvHE2T_U8d2UO5E",
    "AIzaSyBRvdUqolryjMRustJUyqN_HtkjRCbHLfI",
    "AIzaSyCdmCZW6J49Onl-QAf3cTsNu0im84EBVZc",
    "AIzaSyCeref7W3di_9o6W3YnEtqgvCQyvyQ5a5Q",
    "AIzaSyAwtE19mD7rpv1pu5nB4R8Q0HmEX9OkgJI"
  ];

  // 🔄 REFERENCIA PARA SABER QUÉ LLAVE ESTAMOS USANDO
  const keyIndexRef = useRef(0);

  // === LISTA DE CATEGORÍAS EXTENDIDA ===
  const categories = [
    "Acción", "Narcos", "Terror", "Comedia", "Documentales", 
    "Ciencia Ficción", "Infantil", "Animación", "Suspenso", "Romance",
    "Drama", "Aventura", "Crimen", "Guerra", "Clásicos"
  ];

  // 🧠 FUNCIÓN MAESTRA: Busca películas en YouTube con rotación de llaves
  const fetchMoviesFromYouTube = async (queryBusqueda) => {
    setLoading(true);
    setErrorMsg("");
    
    try {
      let exito = false;
      let data = null;

      // Bucle que intenta buscar la película cambiando de llave si hay un Error 403
      while (keyIndexRef.current < YOUTUBE_API_KEYS.length && !exito) {
        const currentKey = YOUTUBE_API_KEYS[keyIndexRef.current];
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=pelicula+completa+en+español+latino+${encodeURIComponent(queryBusqueda)}&type=video&videoDuration=long&videoDefinition=high&key=${currentKey}`;
        
        const response = await fetch(url);

        if (response.status === 403 || response.status === 429) {
            console.warn(`⚠️ API Key ${keyIndexRef.current + 1} agotada o bloqueada. Pasando a la siguiente llave...`);
            keyIndexRef.current++; // Avanzamos a la siguiente llave
        } else {
            data = await response.json();
            if (data.error) throw new Error(data.error.message);
            exito = true; // Búsqueda exitosa, rompemos el ciclo
        }
      }

      if (!exito) {
        setErrorMsg("Los servidores de películas están súper saturados en este momento. Intenta de nuevo más tarde.");
        setMovies([]);
        setLoading(false);
        return;
      }

      if (!data.items) { setMovies([]); setLoading(false); return; }

      const peliculasEncontradas = data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title.replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        category: activeCategory,
        img: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url
      }));

      setMovies(peliculasEncontradas);
    } catch (error) {
      console.error("Error API YouTube:", error);
      setErrorMsg("Error al conectar. Verifica tu conexión a internet.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoviesFromYouTube(activeCategory);
  }, [activeCategory]);

  // 💰 LÓGICA DEL COMERCIAL DE 30 MINUTOS (ADSENSE)
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentMovie) {
        setLongAdActive(true);
        setLongAdTimer(LONG_AD_DURATION);
      }
    }, AD_INTERVAL);
    return () => clearInterval(interval);
  }, [currentMovie]);

  useEffect(() => {
    let timer;
    if (longAdActive && longAdTimer > 0) {
      timer = setInterval(() => setLongAdTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [longAdActive, longAdTimer]);

  useEffect(() => {
    if (longAdActive) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense Error:", e);
      }
    }
  }, [longAdActive]);

  const handleSkipLongAd = () => {
    if (longAdTimer <= 0) {
      setLongAdActive(false);
    }
  };

  // EL BUSCADOR
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      fetchMoviesFromYouTube(searchTerm);
    }
  };

  // CUANDO EL USUARIO TOCA UNA PELÍCULA
  const selectMovie = (movie) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentMovie(movie);
    setLongAdActive(false); // Resetea el comercial de 30 mins
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600 pb-12">
      {/* BARRA SUPERIOR */}
      <nav className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 bg-white/5 rounded-full hover:bg-red-600 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            CINE PLAY
          </h1>
        </div>
      </nav>

      {/* 🔎 EL NUEVO BUSCADOR GIGANTE Y LLAMATIVO 🔎 */}
      <div className="w-full bg-gradient-to-b from-black/80 to-[#050505] py-8 px-6 flex justify-center border-b border-red-600/20">
        <form onSubmit={handleSearch} className="relative w-full max-w-3xl group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search size={28} className="text-red-600 group-focus-within:animate-pulse" />
          </div>
          <input 
            type="text" 
            placeholder="ESCRIBE AQUÍ LA PELÍCULA QUE BUSCAS (Ej: El Padrino)..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full bg-black border-2 border-white/10 hover:border-red-600/50 focus:border-red-600 rounded-full py-5 pl-16 pr-6 text-lg font-bold text-white shadow-[0_0_30px_rgba(220,38,38,0.1)] focus:shadow-[0_0_40px_rgba(220,38,38,0.4)] transition-all outline-none placeholder-gray-500 uppercase tracking-wide" 
          />
          <button type="submit" className="absolute inset-y-2 right-2 bg-red-600 hover:bg-red-500 text-white font-black px-8 rounded-full transition-colors uppercase tracking-widest text-sm shadow-lg">
            Buscar
          </button>
        </form>
      </div>

      {/* BOTONES DE CATEGORÍAS */}
      <div className="w-full border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-[73px] z-40">
        <div className="flex gap-2 overflow-x-auto px-6 py-4 custom-scrollbar">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => { setActiveCategory(cat); setSearchTerm(""); }} 
              className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeCategory === cat && searchTerm === "" ? 'bg-red-600 text-white border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.4)] scale-105' : 'bg-[#111] border-white/5 text-gray-400 hover:text-white hover:border-white/20'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pt-8 max-w-[1800px] mx-auto">
        {errorMsg && (
          <div className="bg-red-600/20 border border-red-600 text-red-400 p-4 rounded-xl text-center font-bold mb-6">
            {errorMsg}
          </div>
        )}

        {/* REPRODUCTOR & SISTEMA DE ANUNCIOS */}
        {currentMovie && (
          <div className="mb-12 animate-fade-in-down">
            <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(220,38,38,0.3)]">
              
              {/* === 💰 COMERCIAL DE 30 MINUTOS FLOTANTE === */}
              {longAdActive && (
                <div className="absolute inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-6 backdrop-blur-sm">
                  <div className="w-full max-w-4xl bg-[#181818] rounded-xl border border-red-600 shadow-2xl overflow-hidden">
                    <div className="bg-red-700 py-2 text-center text-xs font-bold uppercase tracking-widest text-white/90">
                      Espacio Publicitario
                    </div>
                    <div className="bg-black py-8 flex justify-center items-center min-h-[300px]">
                      <ins className="adsbygoogle"
                           style={{ display: 'block', width: '100%', height: '280px' }}
                           data-ad-client="ca-pub-9326186822962530"
                           data-ad-slot={ADSENSE_SLOT}
                           data-ad-format="rectangle"></ins>
                    </div>
                    <div className="p-6 flex justify-between items-center bg-zinc-900 border-t border-white/10">
                      <span className="text-white/40 text-xs font-bold">La película continuará pronto...</span>
                      {longAdTimer > 0 ? (
                        <div className="text-white font-black text-xl animate-pulse bg-zinc-800 px-6 py-2 rounded-full">{longAdTimer}s</div>
                      ) : (
                        <button onClick={handleSkipLongAd} className="bg-white text-black px-10 py-3 rounded-full font-black uppercase text-sm hover:bg-red-600 hover:text-white transition-all">
                          Omitir Anuncio ⏭️
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <iframe 
                className="w-full h-full relative z-0" 
                src={`https://www.youtube.com/embed/${currentMovie.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1&fs=1`} 
                title={currentMovie.title} 
                frameBorder="0" 
                sandbox="allow-scripts allow-same-origin allow-presentation"
                allowFullScreen>
              </iframe>
              <div className="absolute top-4 left-4 flex gap-2 pointer-events-none z-20">
                <span className="bg-red-600/90 backdrop-blur text-white text-[10px] font-black tracking-widest px-3 py-1.5 rounded-md shadow-lg">NOW PLAYING</span>
                <span className="bg-black/80 backdrop-blur text-gray-300 text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-md border border-white/10 uppercase">{activeCategory}</span>
              </div>
            </div>
            
            <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between bg-zinc-900/40 p-6 rounded-2xl border border-white/5 gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-2">{currentMovie.title}</h2>
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                        <span className="flex items-center gap-1 text-yellow-500"><Star size={14} fill="currentColor"/> HD Premium</span>
                        <span className="flex items-center gap-1"><Clock size={14}/> +1 Hora</span>
                    </div>
                </div>
                <button onClick={() => setCurrentMovie(null)} className="px-8 py-3 rounded-full border border-red-600/50 hover:bg-red-600 font-black transition-all text-sm uppercase tracking-widest text-white shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                  Cerrar Película
                </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 text-gray-200">
                <LayoutGrid className="text-red-600" size={24} /> 
                <h3 className="text-xl font-black uppercase tracking-widest">
                    {searchTerm ? `Resultados para: ${searchTerm}` : `Catálogo: ${activeCategory}`}
                </h3>
            </div>
            {loading && <div className="flex items-center gap-2 text-red-600 font-bold text-sm uppercase tracking-widest"><Loader2 className="animate-spin" size={20} /> Buscando...</div>}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {!loading && movies.map(movie => (
            <div key={movie.id} onClick={() => selectMovie(movie)} className="group cursor-pointer relative">
              <div className={`aspect-[2/3] rounded-2xl overflow-hidden bg-zinc-900 border-2 transition-all duration-300 ${currentMovie?.id === movie.id ? 'border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.6)] scale-105' : 'border-transparent hover:border-white/20 hover:-translate-y-2 hover:shadow-2xl'}`}>
                {movie.img ? (
                  <img src={movie.img} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" alt={movie.title} loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-800"><Film className="opacity-20 w-10 h-10" /></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                  <div className="bg-red-600 p-4 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.8)] transform scale-50 group-hover:scale-100 transition-transform duration-300"><Play fill="white" size={24} className="ml-1" /></div>
                </div>
                <div className="absolute bottom-0 left-0 p-4 w-full"><h3 className="text-xs font-black text-white drop-shadow-lg line-clamp-3 leading-tight uppercase">{movie.title}</h3></div>
              </div>
            </div>
          ))}
        </div>

        {!loading && movies.length === 0 && !errorMsg && (
          <div className="text-center mt-20 p-10 bg-zinc-900/50 rounded-3xl border border-white/5">
            <Film className="mx-auto mb-4 text-gray-600" size={48} />
            <p className="text-gray-400 font-black uppercase tracking-widest text-lg">No se encontraron películas en esta búsqueda.</p>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-15px); } to { opacity: 1; transform: translateY(0); } } 
        .animate-fade-in-down { animation: fadeInDown 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; } 
        .custom-scrollbar::-webkit-scrollbar { height: 6px; } 
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } 
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; } 
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #dc2626; }
      `}</style>
    </div>
  );
};

export default Movies;