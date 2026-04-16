import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Pause, Search, Tv, Volume2, VolumeX, Maximize, Settings, ShieldCheck, Loader2, Plus } from "lucide-react";
import Hls from "hls.js";

// IMPORTACIÃ“N DE TU BASE DE DATOS LIMPIA
import { canalesTV } from "../data/canales_finales";

const Channels = () => {
  // === ðŸ’° LOGICA DE PUBLICIDAD (ADSENSE) ===
  const ADSENSE_SLOT = "7869741603";
  const AD_INTERVAL = 30 * 60 * 1000; 
  const LONG_AD_DURATION = 12; 
  const [longAdActive, setLongAdActive] = useState(false);
  const [longAdTimer, setLongAdTimer] = useState(LONG_AD_DURATION);

  // === âš¡ ESTADOS DE RENDIMIENTO ===
  const [displayLimit, setDisplayLimit] = useState(30); 
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Costa Rica");

  // Estados principales
  const [channels] = useState(canalesTV || []);
  const [currentChannel, setCurrentChannel] = useState(
    canalesTV.find(c => c.genre === "Costa Rica") || canalesTV[0]
  );
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  // Carga del canal
  useEffect(() => {
    if (!currentChannel?.url) return;
    setIsLoading(true);

    const video = videoRef.current;

    if (Hls.isSupported()) {
      if (hlsRef.current) hlsRef.current.destroy();
      const hls = new Hls({
        capLevelToPlayerSize: true,
        startLevel: -1,
      });
      hlsRef.current = hls;
      hls.loadSource(currentChannel.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        if (isPlaying) video.play().catch(() => setIsPlaying(false));
      });
      hls.on(Hls.Events.ERROR, () => setIsLoading(false));
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = currentChannel.url;
      video.addEventListener("loadedmetadata", () => {
        setIsLoading(false);
        if (isPlaying) video.play().catch(() => setIsPlaying(false));
      });
    }
  }, [currentChannel]);

  // Filtros
  const categories = useMemo(() => ["Costa Rica", ...new Set(channels.map(c => c.genre).filter(g => g !== "Costa Rica"))], [channels]);
  
  const filteredChannels = useMemo(() => {
    return channels.filter(c => 
      c.genre === activeCategory && 
      c.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [channels, activeCategory, searchTerm]);

  const toggleFullscreen = () => {
    if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
    else if (videoRef.current.webkitRequestFullscreen) videoRef.current.webkitRequestFullscreen();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600">
      
      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="p-2 bg-white/5 rounded-full hover:bg-red-600 transition-all"><ArrowLeft size={20}/></Link>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20">
                <Tv size={24} className="text-white" />
             </div>
             <h1 className="text-xl font-black uppercase italic tracking-tighter">Canales <span className="text-red-600">Play</span></h1>
          </div>
        </div>
        <div className="relative hidden md:block w-72">
          <Search className="absolute left-4 top-3 text-gray-500" size={18} />
          <input 
            type="text" placeholder="Buscar canal..." 
            className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-4 text-xs focus:outline-none focus:border-red-600 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* REPRODUCTOR PRINCIPAL */}
      <section className="pt-24 lg:pt-28 px-4 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="relative aspect-video w-full bg-black rounded-[2rem] md:rounded-[3.5rem] overflow-hidden border border-white/5 shadow-2xl group">
            {isLoading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
                <Loader2 className="text-red-600 animate-spin mb-4" size={50} />
                <p className="text-xs font-black uppercase tracking-[0.3em]">Sintonizando seÃ±al...</p>
              </div>
            )}
            <video ref={videoRef} className="w-full h-full object-contain" playsInline />
            
            {/* Overlay de controles */}
            <div className="absolute bottom-0 w-full p-6 md:p-12 flex items-center justify-between bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
              <div className="flex items-center gap-6">
                <button onClick={() => videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause()} className="p-4 bg-red-600 rounded-full hover:scale-110 transition-all shadow-xl">
                  {isPlaying ? <Pause size={24} fill="white"/> : <Play size={24} fill="white" className="ml-1"/>}
                </button>
                <div className="flex items-center gap-4">
                   <button onClick={() => { setIsMuted(!isMuted); videoRef.current.muted = !isMuted; }} className="text-white hover:text-red-600 transition-colors">
                     {isMuted ? <VolumeX size={24}/> : <Volume2 size={24}/>}
                   </button>
                   <input type="range" min="0" max="1" step="0.1" className="w-24 accent-red-600 h-1 bg-white/20 rounded-full appearance-none cursor-pointer" onChange={(e) => videoRef.current.volume = e.target.value}/>
                </div>
              </div>
              <button onClick={toggleFullscreen} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                <Maximize size={20}/>
              </button>
            </div>
          </div>
          
          <div className="mt-8 flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <div className="px-4 py-1.5 bg-red-600 rounded-full text-[10px] font-black animate-pulse flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div> EN VIVO
              </div>
              <h2 className="text-lg md:text-2xl font-black uppercase italic tracking-tighter">{currentChannel?.title}</h2>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
               <ShieldCheck size={14} className="text-green-500" /> ConexiÃ³n Segura
            </div>
          </div>
        </div>
      </section>

      {/* LISTADO DE CANALES */}
      <div className="max-w-[1400px] mx-auto mt-12 px-4">
        <nav className="flex gap-3 overflow-x-auto pb-6 no-scrollbar mb-8 border-b border-white/5">
          {categories.map(cat => (
            <button 
              key={cat} onClick={() => { setActiveCategory(cat); setDisplayLimit(30); }}
              className={`px-8 py-3.5 rounded-2xl font-black text-[10px] md:text-xs transition-all whitespace-nowrap border ${activeCategory === cat ? 'bg-red-600 border-red-500 text-white shadow-xl scale-105' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </nav>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {filteredChannels.slice(0, displayLimit).map((channel) => (
            <div 
              key={channel.id} 
              onClick={() => { setCurrentChannel(channel); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`group relative cursor-pointer rounded-3xl p-3 border transition-all duration-500 ${currentChannel?.id === channel.id ? 'bg-red-600/10 border-red-600 shadow-2xl' : 'bg-white/5 border-white/5 hover:border-white/20 hover:-translate-y-2'}`}
            >
              {/* ðŸ†” ETIQUETA DE ID PARA MANTENIMIENTO (VISTO EN PANTALLA) */}
              <div className="absolute top-4 right-4 z-20 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow-lg border border-red-400">
                {channel.id}
              </div>

              <div className="relative aspect-video rounded-2xl overflow-hidden mb-3 bg-black">
                {channel.logo ? (
                  <img src={channel.logo} alt={channel.title} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-900 group-hover:bg-red-600/20 transition-colors">
                    <Tv size={30} className="text-white/10" />
                  </div>
                )}
                <div className={`absolute inset-0 bg-red-600/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 ${currentChannel?.id === channel.id ? 'opacity-100' : ''}`}>
                   <Play fill="white" size={30} className="text-white drop-shadow-2xl" />
                </div>
              </div>
              <div className="px-1 flex flex-col gap-1">
                <h3 className="text-[10px] font-black line-clamp-1 uppercase tracking-tight text-gray-300 group-hover:text-white">{channel.title}</h3>
                <span className="text-[8px] font-black text-red-600/20">CH-{channel.id.replace('tv-', '')}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredChannels.length > displayLimit && (
            <div className="flex justify-center py-16">
                <button 
                    onClick={() => setDisplayLimit(prev => prev + 40)}
                    className="flex items-center gap-3 bg-red-600 hover:bg-red-700 px-12 py-4 rounded-full font-black uppercase text-xs tracking-[0.2em] shadow-2xl transition-all hover:scale-110 active:scale-95"
                >
                    <Plus size={18} /> Cargar mÃ¡s canales ({filteredChannels.length - displayLimit} restantes)
                </button>
            </div>
        )}
      </div>

      <footer className="py-10 border-t border-white/5 text-center">
         <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.5em]">Fabulosa Play Premium â€¢ 2026</p>
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        video { outline: none; background: #000; }
        input[type=range] { -webkit-appearance: none; background: rgba(255,255,255,0.05); height: 4px; border-radius: 10px; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 12px; width: 12px; border-radius: 50%; background: #dc2626; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default Channels;