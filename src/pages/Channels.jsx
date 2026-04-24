import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Pause, Search, Tv, Volume2, VolumeX, Maximize, Loader2, AlertTriangle } from "lucide-react";
import Hls from "hls.js";

import logoFabulosa from "../assets/logo_fabulosa.png";
import { canalesTV } from "../data/canales_finales.js";

const Channels = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Costa Rica");
  const [channels] = useState(canalesTV || []);
  const [currentChannel, setCurrentChannel] = useState(canalesTV[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  // === MOTOR DE FUERZA BRUTA ===
  useEffect(() => {
    if (!currentChannel?.url || !videoRef.current) return;
    
    setIsLoading(true);
    setHasError(false);

    if (hlsRef.current) { hlsRef.current.destroy(); }

    if (Hls.isSupported()) {
      const hls = new Hls({ 
        manifestLoadingTimeOut: 20000,
        manifestLoadingMaxRetry: 6,
        xhrSetup: (xhr) => { 
          xhr.withCredentials = false;
        }
      });

      hls.loadSource(currentChannel.url);
      hls.attachMedia(videoRef.current);
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        videoRef.current.play().catch(() => setIsPlaying(false));
      });

      hls.on(Hls.Events.ERROR, (e, data) => {
        if (data.fatal) {
          console.error("Error fatal en señal:", data.details);
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else {
            setIsLoading(false);
            setHasError(true);
            hls.destroy();
          }
        }
      });
    }
  }, [currentChannel]);

  // Lógica de búsqueda mejorada
  const filteredChannels = useMemo(() => {
    return channels.filter(c => {
      const title = (c.title || c.name || "").toLowerCase();
      const matchesSearch = title.includes(searchTerm.toLowerCase());
      // Si está buscando, ignoramos la categoría para que encuentre todo
      const matchesCategory = searchTerm ? true : c.genre === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [channels, searchTerm, activeCategory]);

  const categories = useMemo(() => {
    const genres = channels.map(c => c.genre).filter(Boolean);
    return ["Costa Rica", ...new Set(genres.filter(g => g !== "Costa Rica"))];
  }, [channels]);

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden font-sans">
      {/* HEADER PLUTO TV */}
      <header className="h-16 bg-zinc-950 border-b border-white/10 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-zinc-500 hover:text-white"><ArrowLeft size={24} /></Link>
          <img src={logoFabulosa} alt="Fabulosa" className="h-10 object-contain" />
        </div>
        <div className="relative w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
          <input 
            type="text" 
            placeholder={searchTerm ? "BUSCANDO..." : "BUSCAR CANAL..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border-none rounded-full py-2.5 pl-12 pr-4 text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-red-600 transition-all"
          />
        </div>
      </header>

      {/* REPRODUCTOR FIJO */}
      <section className="relative w-full bg-zinc-950 flex items-center justify-center border-b border-white/5 shadow-inner" style={{ height: '42vh' }}>
        <video 
          ref={videoRef} 
          className="h-full w-full object-contain cursor-pointer"
          onDoubleClick={() => videoRef.current.requestFullscreen()}
          onClick={() => setIsPlaying(!isPlaying)}
          autoPlay muted={isMuted}
        />
        
        {/* LOGO DE CARGA */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-20">
            <img src={currentChannel?.logo || "/fabulosa.jpg"} className="h-32 w-32 object-contain animate-pulse opacity-50" alt="" />
            <div className="mt-4 flex items-center gap-2">
              <Loader2 className="animate-spin text-red-600" size={24} />
              <span className="text-[10px] font-black tracking-[0.3em] uppercase italic">Sintonizando...</span>
            </div>
          </div>
        )}

        {/* ERROR DE SEÑAL */}
        {hasError && (
          <div className="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center z-30 p-6 text-center">
            <AlertTriangle className="text-red-600 mb-4" size={48} />
            <h3 className="font-black uppercase italic text-sm">Señal temporalmente caída</h3>
            <p className="text-zinc-500 text-[10px] uppercase mt-2">El servidor del canal bloqueó la conexión (CORS/Geo-block)</p>
            <button 
              onClick={() => setCurrentChannel({...currentChannel})} 
              className="mt-6 bg-red-600 px-8 py-2 rounded-full text-[10px] font-black"
            >REINTENTAR</button>
          </div>
        )}
      </section>

      {/* SIDEBAR Y GRILLA */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-zinc-950 border-r border-white/5 overflow-y-auto custom-scrollbar shrink-0">
          <div className="p-4 space-y-1">
            <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest mb-4 ml-4">Categorías</p>
            {categories.map(cat => (
              <button
                key={cat} onClick={() => { setActiveCategory(cat); setSearchTerm(""); }}
                className={`w-full text-left px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase transition-all ${
                  activeCategory === cat && !searchTerm ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-zinc-500 hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-6 bg-[#050505] custom-scrollbar">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredChannels.length > 0 ? (
              filteredChannels.map(channel => (
                <div
                  key={channel.id} 
                  onClick={() => { setCurrentChannel(channel); setIsPlaying(true); }}
                  className={`group relative aspect-video bg-zinc-900 rounded-[2rem] p-4 cursor-pointer transition-all border-2 ${
                    currentChannel.id === channel.id ? 'border-red-600 bg-red-600/10 scale-95 shadow-2xl' : 'border-transparent hover:border-white/10'
                  }`}
                >
                  <div className="h-full w-full flex flex-col items-center justify-center">
                    <img 
                      src={channel.logo || "/fabulosa.jpg"} 
                      className="max-h-[60%] object-contain mb-2 group-hover:scale-110 transition-transform duration-500" 
                      onError={(e) => { e.target.src = "/fabulosa.jpg" }}
                      alt="" 
                    />
                    <p className="text-[9px] font-black uppercase text-center truncate w-full italic text-zinc-500 group-hover:text-white">
                      {channel.title || channel.name}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-zinc-600 font-black uppercase italic tracking-widest">No se encontraron canales</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Channels;