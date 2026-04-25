import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Play, Pause, Volume2, VolumeX, Maximize, Loader2, Edit3, Rocket, X } from "lucide-react";
import Hls from "hls.js";

import logoFabulosa from "../assets/logo_fabulosa.png";
import { canalesTV as initialCanales } from "../data/canales_finales.js";

const Channels = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos"); // Cambiado a Todos por defecto
  const [channels, setChannels] = useState(initialCanales || []);
  const [currentChannel, setCurrentChannel] = useState(initialCanales[0]);
  const [editMode, setEditMode] = useState(false);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  
  const [activeIndex, setActiveIndex] = useState(0); 
  const gridRefs = useRef([]);
  const categoryRefs = useRef([]);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const controlsTimer = useRef(null);

  const isAdmin = new URLSearchParams(window.location.search).get("admin") === "fabulosa";

  // Desaparecer controles tras 3 segundos
  const resetTimer = () => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
  };

  const categories = useMemo(() => {
    const unique = ["Todos", ...new Set(channels.map((c) => c.genre || "Varios"))];
    return unique;
  }, [channels]);

  const filteredChannels = useMemo(() => {
    return channels.filter((c) => {
      const matchCat = activeCategory === "Todos" || c.genre === activeCategory;
      const nombreCanal = c.name || ""; 
      const matchSearch = nombreCanal.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [channels, activeCategory, searchTerm]);

  // REPRODUCTOR HLS
  useEffect(() => {
    if (!currentChannel?.url) return;
    setIsLoading(true);
    if (hlsRef.current) hlsRef.current.destroy();
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({ capLevelToPlayerSize: true });
      hls.loadSource(currentChannel.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.muted = isMuted;
        if (isPlaying) video.play().catch(() => setIsPlaying(false));
        setIsLoading(false);
      });
      hlsRef.current = hls;
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = currentChannel.url;
      video.addEventListener("loadedmetadata", () => {
        video.muted = isMuted;
        if (isPlaying) video.play();
        setIsLoading(false);
      });
    }
  }, [currentChannel]);

  // NAVEGACIÓN CONTROL REMOTO
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (editMode || document.activeElement.tagName === 'INPUT') return;
      const cols = 8; 
      const totalCats = categories.length;
      const totalChans = filteredChannels.length;

      if (e.key === "ArrowRight") setActiveIndex(p => Math.min(p + 1, (p < 100 ? totalCats - 1 : 100 + totalChans - 1)));
      if (e.key === "ArrowLeft") setActiveIndex(p => (p === 0 || p === 100) ? -1 : Math.max(p - 1, -1));
      if (e.key === "ArrowDown") {
        if (activeIndex === -1) setActiveIndex(0);
        else if (activeIndex < 100) setActiveIndex(100);
        else setActiveIndex(p => Math.min(p + cols, 100 + totalChans - 1));
      }
      if (e.key === "ArrowUp") {
        if (activeIndex === -1) return;
        if (activeIndex < 100) setActiveIndex(-1);
        else if (activeIndex < 100 + cols) setActiveIndex(0);
        else setActiveIndex(p => p - cols);
      }
      if (e.key === "Enter") {
        if (activeIndex === -1) navigate("/");
        else if (activeIndex < 100) setActiveCategory(categories[activeIndex]);
        else setCurrentChannel(filteredChannels[activeIndex - 100]);
      }
      if (e.key === "Escape" || e.key === "Backspace") navigate("/");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, categories, filteredChannels, editMode, navigate]);

  useEffect(() => {
    if (activeIndex === -1) return;
    const target = activeIndex < 100 ? categoryRefs.current[activeIndex] : gridRefs.current[activeIndex - 100];
    if (target) target.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
  }, [activeIndex]);

  const togglePlay = () => {
    if (videoRef.current.paused) { videoRef.current.play(); setIsPlaying(true); } 
    else { videoRef.current.pause(); setIsPlaying(false); }
  };

  const toggleMute = () => {
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#050505] text-white font-sans overflow-hidden" onMouseMove={resetTimer}>
      
      {/* CABECERA */}
      <header className="h-16 md:h-20 flex items-center justify-between px-4 md:px-10 bg-black/60 border-b border-white/5 backdrop-blur-xl z-50 shrink-0">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate("/")}
            className={`flex items-center gap-2 px-6 py-2 rounded-full border-2 transition-all duration-300 ${activeIndex === -1 ? 'bg-red-600 border-white scale-110 shadow-[0_0_20px_white]' : 'bg-white/5 border-white/10 opacity-70'}`}
          >
            <Rocket size={20} className={activeIndex === -1 ? 'animate-bounce text-white' : 'text-red-600'} />
            <span className="font-black uppercase tracking-widest text-xs">Menú</span>
          </button>
          <img src={logoFabulosa} alt="Logo" className="h-8 md:h-10 object-contain" />
        </div>

        <div className="flex-1 max-w-md mx-6 relative hidden lg:block">
          <input type="text" placeholder="Buscar canal..." className="w-full bg-[#121212] border border-[#303030] rounded-full py-2 px-10 text-xs focus:border-red-600 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <Search className="absolute left-4 top-2.5 text-white/30" size={16} />
        </div>

        <div className="flex items-center gap-4">
           {isAdmin && <button onClick={() => setEditMode(!editMode)} className={`p-2 rounded-full ${editMode ? 'bg-red-600' : 'bg-white/10'}`}><Edit3 size={18} /></button>}
           <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-black border border-white/20"></div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* CATEGORÍAS (Nombres Arreglados) */}
        <aside className="w-20 md:w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col py-6 overflow-y-auto no-scrollbar shrink-0">
          {categories.map((cat, i) => (
            <button
              key={cat}
              ref={el => categoryRefs.current[i] = el}
              onClick={() => { setActiveCategory(cat); setActiveIndex(i); }}
              className={`px-4 md:px-8 py-4 flex items-center gap-4 border-l-4 transition-all ${activeCategory === cat ? 'border-red-600 text-red-600 bg-red-600/5' : 'border-transparent text-white/40'} ${activeIndex === i ? 'border-white bg-red-600/20 text-white scale-105' : ''}`}
            >
              <div className={`w-2 h-2 rounded-full ${activeCategory === cat ? 'bg-red-600' : 'bg-white/20'}`}></div>
              {/* ✅ Texto Siempre Visible */}
              <span className="text-[10px] md:text-sm font-black uppercase tracking-tighter block whitespace-nowrap overflow-hidden text-ellipsis">{cat}</span>
            </button>
          ))}
        </aside>

        {/* REPRODUCTOR ESTILO YOUTUBE */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <section className="relative w-full aspect-video md:h-[60%] bg-black shadow-2xl overflow-hidden group">
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black">
                <Loader2 className="animate-spin text-red-600 mb-4" size={50} />
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-red-600">Cargando Señal...</p>
              </div>
            )}
            
            <video ref={videoRef} className="w-full h-full object-contain" onClick={togglePlay} />

            {/* ✅ BOTONES ESTILO YOUTUBE */}
            <div className={`absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-40 transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button onClick={togglePlay} className="text-white hover:scale-110 transition-transform">
                        {isPlaying ? <Pause size={30} fill="white" /> : <Play size={30} fill="white" />}
                    </button>
                    <div className="flex items-center gap-2 group/vol">
                        <button onClick={toggleMute} className="text-white">
                            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                        </button>
                        <input type="range" min="0" max="100" value={isMuted ? 0 : volume} onChange={(e) => {setVolume(e.target.value); videoRef.current.volume = e.target.value / 100;}} className="w-0 group-hover/vol:w-24 transition-all accent-red-600 h-1" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-sm md:text-xl font-black uppercase truncate max-w-[200px] md:max-w-md">{currentChannel?.name}</h2>
                        <span className="text-[10px] text-red-600 font-bold uppercase tracking-widest">En Vivo • Fabulosa Play</span>
                    </div>
                  </div>
                  <button onClick={() => videoRef.current.requestFullscreen()} className="text-white hover:scale-110 transition-transform">
                    <Maximize size={24} />
                  </button>
               </div>
               {/* Barra de progreso decorativa estilo YT */}
               <div className="w-full h-1 bg-white/20 mt-4 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-red-600"></div>
               </div>
            </div>
          </section>

          {/* GRILLA DE CANALES */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 custom-scrollbar pb-24">
            {filteredChannels.map((channel, idx) => {
              const isFocused = activeIndex === (idx + 100);
              return (
                <div
                  key={channel.id}
                  ref={el => gridRefs.current[idx] = el}
                  onClick={() => { setCurrentChannel(channel); setActiveIndex(idx + 100); }}
                  className={`relative group cursor-pointer aspect-square rounded-[1.5rem] md:rounded-[2rem] transition-all flex items-center justify-center p-4 bg-[#121212] ${currentChannel?.id === channel.id ? 'ring-2 ring-red-600' : 'border border-white/5'} ${isFocused ? 'ring-4 ring-white scale-110 shadow-2xl z-50' : ''}`}
                >
                  <img src={channel.logo} className="max-w-full max-h-full object-contain drop-shadow-lg" alt="Logo" />
                  {isFocused && (
                    <div className="absolute -bottom-2 bg-red-600 text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase truncate max-w-[90%] shadow-lg">
                      {channel.name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #dc2626; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Channels;