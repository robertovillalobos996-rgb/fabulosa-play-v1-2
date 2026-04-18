import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Pause, Search, Maximize, Loader2, Sparkles, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Acción");
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  // 💰 PUBLICIDAD MID-ROLL (REVISAR QUE EL ID SEA 8987154)
  const [showAd, setShowAd] = useState(false);
  const [adTimer, setAdTimer] = useState(5);
  const [secondsWatched, setSecondsWatched] = useState(0);
  const [adTriggered, setAdTriggered] = useState(false);

  const YOUTUBE_API_KEYS = ["AIzaSyDxLD8PviKQwlHBs7rmRm3GoyIKk-aQpww", "AIzaSyACeTldeUs5tbn2Lwr6o_6Lc48rF1nINY0", "AIzaSyBUk0oq1zjA6BKx5HK8DEQc1TxQqreqGtk", "AIzaSyBys-0J3T5Ou_fdPGxqYC5LWDMgppwD0Y4", "AIzaSyDHdkSo4WSHjYL4nHFU9wKmXW5D9PScO4g", "AIzaSyDJqDMnZsYHyJtzahtvv1r55Z-JfgLk5TU", "AIzaSyCruj7UZTEmElS3ZUeUBmYPecbsAA667U8", "AIzaSyBfMNrgQESeymMQ9srVBHKjXB3_WeRfkXE", "AIzaSyB1e_YSB74yAelvAhapDWu11VPLz2wBkUg", "AIzaSyCsvViGGiPJxx8-FkSwQvHE2T_U8d2UO5E", "AIzaSyBRvdUqolryjMRustJUyqN_HtkjRCbHLfI", "AIzaSyCdmCZW6J49Onl-QAf3cTsNu0im84EBVZc", "AIzaSyCeref7W3di_9o6W3YnEtqgvCQyvyQ5a5Q", "AIzaSyAwtE19mD7rpv1pu5nB4R8Q0HmEX9OkgJI"];

  const iframeRef = useRef(null);
  const controlsTimeout = useRef(null);

  // 🕵️ MONITOR DE TIEMPO (7 MINUTOS = 420 SEGUNDOS)
  useEffect(() => {
    let interval;
    if (currentMovie && !showAd && isPlaying) {
      interval = setInterval(() => {
        setSecondsWatched(prev => {
          const newTime = prev + 1;
          if (newTime === 420 && !adTriggered) triggerCommercial();
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentMovie, showAd, adTriggered, isPlaying]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => isPlaying && setShowControls(false), 3000);
  };

  const triggerCommercial = () => {
    setShowAd(true);
    setIsPlaying(false);
    setAdTimer(5);
    setAdTriggered(true);

    // LLAMADA AGRESIVA A MONETAG
    if (typeof window.show_8987154 === 'function') {
        window.show_8987154();
    } else {
        console.warn("Monetag no cargado aún. Verifique que no tenga AdBlock.");
    }
    
    const count = setInterval(() => {
      setAdTimer(prev => {
        if (prev <= 1) { clearInterval(count); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const sendCommand = (func, args = "") => {
    iframeRef.current?.contentWindow.postMessage(JSON.stringify({ event: "command", func, args }), "*");
  };

  const togglePlay = () => {
    isPlaying ? sendCommand("pauseVideo") : sendCommand("playVideo");
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const val = e.target.value;
    setVolume(val);
    sendCommand("setVolume", [val]);
    setIsMuted(val === "0");
  };

  const fetchMovies = async (query) => {
    setLoading(true);
    try {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(query + " película completa español latino")}&type=video&videoDuration=long&key=${YOUTUBE_API_KEYS[0]}`);
      const data = await res.json();
      setMovies(data.items || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchMovies(activeCategory); }, [activeCategory]);

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden" onMouseMove={handleMouseMove}>
      {/* HEADER BUSCADOR */}
      <div className="p-4 md:p-6 flex items-center justify-between border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="p-2 bg-zinc-900 rounded-full hover:bg-yellow-400 hover:text-black transition-all">
          <ArrowLeft size={24} />
        </Link>
        <div className="flex-1 max-w-xl mx-4 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" placeholder="Buscar película..." 
            className="w-full bg-zinc-800 border-none rounded-full py-2 pl-10 pr-6 focus:ring-2 focus:ring-yellow-400 outline-none text-xs"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* CATEGORÍAS */}
      <div className="flex gap-3 p-4 overflow-x-auto no-scrollbar">
        {["Acción", "Terror", "Comedia", "Animación", "Drama", "Cristiano"].map(cat => (
          <button 
            key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-6 py-1.5 rounded-full font-bold uppercase text-[10px] border transition-all ${activeCategory === cat ? 'bg-yellow-400 border-yellow-400 text-black shadow-lg' : 'border-white/10 text-gray-400 hover:border-white/20'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {loading ? (
            <div className="col-span-full flex justify-center py-20"><Loader2 className="animate-spin text-yellow-400" size={40} /></div>
        ) : (
          movies.map(movie => (
            <motion.div 
              key={movie.id.videoId} whileHover={{ scale: 1.05 }} 
              onClick={() => { setCurrentMovie(movie); setSecondsWatched(0); setAdTriggered(false); setIsPlaying(true); }}
              className="cursor-pointer group"
            >
              <div className="aspect-[2/3] rounded-xl overflow-hidden border-2 border-transparent group-hover:border-yellow-400 relative bg-zinc-900">
                <img src={movie.snippet.thumbnails.high.url} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <Play fill="yellow" size={30} className="text-yellow-400" />
                </div>
              </div>
              <h3 className="mt-2 text-[10px] font-bold uppercase text-center line-clamp-1 text-gray-500">{movie.snippet.title}</h3>
            </motion.div>
          ))
        )}
      </div>

      {/* REPRODUCTOR CON VIDRIO PROTECTOR */}
      <AnimatePresence>
        {currentMovie && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black">
            <div className="w-full h-full relative overflow-hidden bg-black">
              
              {/* 🛡️ EL "VIDRIO": CAPA INVISIBLE QUE BLOQUEA CLICS A YOUTUBE */}
              <div className="absolute inset-0 z-30 pointer-events-auto bg-transparent" onClick={handleMouseMove} />

              <iframe 
                ref={iframeRef}
                width="100%" height="100%" 
                src={`https://www.youtube.com/embed/${currentMovie.id.videoId}?autoplay=1&controls=0&rel=0&modestbranding=1&enablejsapi=1&iv_load_policy=3&disablekb=1&origin=${window.location.origin}`}
                frameBorder="0" allow="autoplay; encrypted-media; fullscreen"
                className="z-10"
              />

              {/* CONTROLES ELEGANTES (AUTO-HIDE) */}
              <motion.div animate={{ opacity: showControls ? 1 : 0 }} className="absolute inset-0 z-40 bg-gradient-to-t from-black/100 via-transparent to-black/80 flex flex-col justify-between p-6">
                <div className="flex justify-between items-start">
                  <button onClick={() => setCurrentMovie(null)} className="p-3 bg-red-600/20 hover:bg-red-600 rounded-full transition-all"><ArrowLeft size={24} /></button>
                  <h2 className="text-sm font-black uppercase text-yellow-400 truncate max-w-[60%]">{currentMovie.snippet.title}</h2>
                </div>

                <div className="flex justify-center">
                  <button onClick={togglePlay} className="p-8 bg-yellow-400/10 hover:bg-yellow-400 hover:text-black rounded-full backdrop-blur-sm transition-all">
                    {isPlaying ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" className="ml-1" />}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4 bg-zinc-900/80 p-3 px-6 rounded-full border border-white/10 backdrop-blur-md">
                      <button onClick={() => setIsMuted(!isMuted)} className="text-white">
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </button>
                      <input type="range" min="0" max="100" value={volume} onChange={handleVolumeChange} className="w-24 md:w-40 accent-yellow-400 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer" />
                   </div>
                   <button onClick={() => document.documentElement.requestFullscreen()} className="p-3 bg-zinc-900/80 hover:bg-yellow-400 hover:text-black rounded-full transition-all"><Maximize size={20} /></button>
                </div>
              </motion.div>

              {/* PANTALLA DE PUBLICIDAD (7 MIN) */}
              {showAd && (
                <div className="fixed inset-0 z-[500] bg-black flex flex-col items-center justify-center text-center p-10">
                   <Sparkles className="text-yellow-400 mb-6 animate-pulse" size={80} />
                   <h2 className="text-4xl md:text-6xl font-black uppercase mb-4 tracking-tighter">Espacio<br/><span className="text-yellow-400">Publicitario</span></h2>
                   <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Contenido exclusivo de Fabulosa Play</p>
                   <div className="mt-12">
                      <button 
                        disabled={adTimer > 0}
                        onClick={() => { setShowAd(false); setIsPlaying(true); }}
                        className={`px-12 py-5 rounded-full font-black uppercase text-xl md:text-3xl transition-all ${adTimer > 0 ? 'bg-zinc-900 text-zinc-700' : 'bg-yellow-400 text-black scale-110 shadow-2xl shadow-yellow-400/40'}`}
                      >
                        {adTimer > 0 ? `Esperar ${adTimer}s` : "Cerrar Publicidad ❱"}
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