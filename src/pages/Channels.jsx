import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Pause, Search, Tv, Volume2, VolumeX, Maximize, Loader2, ShieldAlert } from "lucide-react";
import Hls from "hls.js";

// IMPORTACIÓN DE TU LOGO Y BASE DE DATOS
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

  // === MOTOR DE FUERZA BRUTA ESTILO HACKER ===
  useEffect(() => {
    if (!currentChannel?.url || !videoRef.current) return;
    setIsLoading(true);
    setHasError(false);

    if (hlsRef.current) { hlsRef.current.destroy(); }

    // LÓGICA DE INYECCIÓN: Si el canal es rebelde, forzamos el túnel de Vercel
    let finalUrl = currentChannel.url;
    const isProtected = finalUrl.includes("repretel") || 
                        finalUrl.includes("cdnmedia") || 
                        currentChannel.headers;

    if (isProtected && !finalUrl.includes("/api/proxy")) {
      finalUrl = `/api/proxy?url=${encodeURIComponent(currentChannel.url)}&referer=${encodeURIComponent(currentChannel.headers?.Referer || 'https://www.repretel.com/')}`;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({ 
        manifestLoadingTimeOut: 20000,
        xhrSetup: (xhr) => { xhr.withCredentials = false; }
      });

      hls.loadSource(finalUrl);
      hls.attachMedia(videoRef.current);
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setTimeout(() => setIsLoading(false), 1200);
        videoRef.current.play().catch(() => setIsPlaying(false));
      });

      hls.on(Hls.Events.ERROR, (e, data) => {
        if (data.fatal) {
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

  // Pantalla completa
  const handleFullScreen = () => {
    if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
  };

  const filteredChannels = useMemo(() => {
    return channels.filter(c => {
      const matchesSearch = (c.title || c.name || "").toLowerCase().includes(searchTerm.toLowerCase());
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
      {/* HEADER TIPO PLUTO TV */}
      <header className="h-16 bg-zinc-950 border-b border-white/10 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-zinc-500 hover:text-white"><ArrowLeft size={24} /></Link>
          <img src={logoFabulosa} alt="Fabulosa Logo" className="h-10 object-contain" />
        </div>
        <div className="relative w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
          <input 
            type="text" placeholder="BUSCAR CANAL..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border-none rounded-full py-2.5 pl-12 pr-4 text-[10px] font-black uppercase outline-none focus:ring-1 focus:ring-red-600 transition-all"
          />
        </div>
      </header>

      {/* REPRODUCTOR FIJO ARRIBA */}
      <section className="relative w-full bg-black flex items-center justify-center border-b border-white/5" style={{ height: '42vh' }}>
        <video 
          ref={videoRef} 
          className="h-full w-full object-contain cursor-pointer"
          onDoubleClick={handleFullScreen}
          onClick={() => setIsPlaying(!isPlaying)}
          autoPlay muted={isMuted}
        />
        
        {/* OVERLAY DE CARGA / LOGO */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-20">
            <img src={currentChannel?.logo || "/fabulosa.jpg"} className="h-28 w-28 object-contain animate-pulse mb-4" alt="" />
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin text-red-600" size={24} />
              <span className="text-[10px] font-black tracking-widest uppercase italic">Sintonizando...</span>
            </div>
          </div>
        )}

        {/* ERROR DE BLOQUEO */}
        {hasError && (
          <div className="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center z-30 text-center p-8">
            <ShieldAlert className="text-red-600 mb-4" size={48} />
            <h3 className="font-black uppercase italic text-sm">Señal Bloqueada por el Servidor</h3>
            <p className="text-zinc-500 text-[9px] uppercase mt-2 tracking-widest">El canal detectó la conexión web y cerró el paso.</p>
            <button onClick={() => window.location.reload()} className="mt-6 bg-red-600 px-10 py-2 rounded-full text-[10px] font-black uppercase">Refrescar App</button>
          </div>
        )}
      </section>

      {/* CUERPO INFERIOR */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* ASIDE: CATEGORÍAS */}
        <aside className="w-64 bg-zinc-950 border-r border-white/5 overflow-y-auto custom-scrollbar shrink-0">
          <div className="p-4 space-y-1">
            <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest mb-4 ml-4 italic">Categorías</p>
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

        {/* MAIN: GRILLA DE CANALES */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#050505] custom-scrollbar">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredChannels.map(channel => (
              <div
                key={channel.id} onClick={() => { setCurrentChannel(channel); setIsPlaying(true); }}
                className={`group relative aspect-video bg-zinc-900 rounded-[2rem] p-4 cursor-pointer transition-all border-2 ${
                  currentChannel.id === channel.id ? 'border-red-600 bg-red-600/10 scale-95 shadow-2xl' : 'border-transparent hover:border-white/10'
                }`}
              >
                <div className="h-full w-full flex flex-col items-center justify-center">
                  <img 
                    src={channel.logo || "/fabulosa.jpg"} 
                    className="max-h-[60%] object-contain mb-2 group-hover:scale-110 transition-transform" 
                    onError={(e) => { e.target.src = "/fabulosa.jpg" }}
                    alt="" 
                  />
                  <p className="text-[9px] font-black uppercase text-center truncate w-full italic text-zinc-500 group-hover:text-white">
                    {channel.title || channel.name}
                  </p>
                </div>
              </div>
            ))}
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