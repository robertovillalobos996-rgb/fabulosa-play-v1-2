import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Pause, Search, Tv, Volume2, VolumeX, Maximize, Loader2 } from "lucide-react";
import Hls from "hls.js";

// IMPORTACIÓN DE TU LOGO Y BASE DE DATOS
import logoFabulosa from "../assets/logo_fabulosa.png";
import { canalesTV } from "../data/canales_finales.js";

const Channels = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Costa Rica");
  const [channels] = useState(canalesTV || []);
  const [currentChannel, setCurrentChannel] = useState(
    canalesTV.find(c => c.genre === "Costa Rica") || canalesTV[0]
  );
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  // === MOTOR DE VIDEO CON TÚNEL Y LÓGICA DE CARGA ===
  useEffect(() => {
    if (!currentChannel?.url || !videoRef.current) return;
    setIsLoading(true);

    if (hlsRef.current) { hlsRef.current.destroy(); }

    // Puente para canales bloqueados (Repretel/Trivision)
    let finalUrl = currentChannel.url;
    if (currentChannel.headers) {
      finalUrl = `https://corsproxy.io/?${encodeURIComponent(currentChannel.url)}`;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({ manifestLoadingTimeOut: 15000, enableWorker: true });
      hls.loadSource(finalUrl);
      hls.attachMedia(videoRef.current);
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // Un pequeño delay para que el video ya tenga imagen antes de quitar el logo
        setTimeout(() => setIsLoading(false), 1000);
        videoRef.current.play().catch(() => setIsPlaying(false));
      });

      hls.on(Hls.Events.ERROR, (e, data) => {
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
          else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
        }
      });
    }
  }, [currentChannel]);

  // Pantalla completa con doble clic
  const handleDoubleClick = () => {
    if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
  };

  const filteredChannels = useMemo(() => {
    return channels.filter(c => 
      (c.title || c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) &&
      c.genre === activeCategory
    );
  }, [channels, searchTerm, activeCategory]);

  const categories = useMemo(() => {
    return ["Costa Rica", ...new Set(channels.map(c => c.genre).filter(g => g && g !== "Costa Rica"))];
  }, [channels]);

  return (
    <div className="h-screen bg-[#0a0a0a] text-white flex flex-col overflow-hidden font-sans">
      
      {/* BARRA SUPERIOR ESTILO PLUTO */}
      <header className="h-16 bg-black border-b border-white/10 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-zinc-500 hover:text-white"><ArrowLeft size={24} /></Link>
          <img src={logoFabulosa} alt="Fabulosa Logo" className="h-10 object-contain" />
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input 
            type="text" placeholder="Buscar canal..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-red-600 outline-none"
          />
        </div>
      </header>

      {/* ÁREA DEL REPRODUCTOR (SIEMPRE ARRIBA) */}
      <section className="relative w-full bg-black flex items-center justify-center border-b border-white/5" style={{ height: '45vh' }}>
        <video 
          ref={videoRef} 
          className="h-full w-full object-contain cursor-pointer"
          onDoubleClick={handleDoubleClick}
          onClick={() => setIsPlaying(!isPlaying)}
          autoPlay muted={isMuted}
        />

        {/* OVERLAY DE CARGA: Muestra el logo mientras el canal entra */}
        {isLoading && (
          <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-20">
            <img 
              src={currentChannel?.logo || "/fabulosa.jpg"} 
              className="h-32 w-32 object-contain animate-pulse mb-4" 
              alt="Cargando..."
            />
            <Loader2 className="animate-spin text-red-600" size={32} />
          </div>
        )}

        {/* CONTROLES ESTILO OVERLAY */}
        <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between bg-black/40 backdrop-blur-md p-4 rounded-2xl opacity-0 hover:opacity-100 transition-opacity">
           <div className="flex items-center gap-4">
              <button onClick={() => setIsPlaying(!isPlaying)} className="text-white">
                {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
              </button>
              <button onClick={() => setIsMuted(!isMuted)}>{isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}</button>
              <span className="font-black uppercase italic text-sm">{currentChannel?.title || currentChannel?.name}</span>
           </div>
           <button onClick={handleDoubleClick}><Maximize size={24} /></button>
        </div>
      </section>

      {/* CONTENIDO INFERIOR: CATEGORÍAS Y CANALES */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* COLUMNA IZQUIERDA: CATEGORÍAS (Desplazamiento suave) */}
        <aside className="w-64 bg-black border-r border-white/5 overflow-y-auto custom-scrollbar shrink-0">
          <div className="p-4 space-y-2">
            <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4 ml-2">Categorías</h3>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeCategory === cat ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-zinc-500 hover:bg-white/5 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        {/* COLUMNA DERECHA: GRILLA DE CANALES */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#080808] custom-scrollbar">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredChannels.map(channel => (
              <div
                key={channel.id}
                onClick={() => { setCurrentChannel(channel); setIsPlaying(true); }}
                className={`group relative aspect-square bg-zinc-900 rounded-3xl p-4 cursor-pointer transition-all border-2 ${
                  currentChannel.id === channel.id ? 'border-red-600 ring-4 ring-red-600/20' : 'border-transparent hover:border-white/20'
                }`}
              >
                <div className="h-full w-full flex flex-col items-center justify-center">
                  <img 
                    src={channel.logo || "/fabulosa.jpg"} 
                    alt={channel.title} 
                    className="max-h-[60%] object-contain mb-3 group-hover:scale-110 transition-transform"
                    onError={(e) => e.target.src = "/fabulosa.jpg"}
                  />
                  <p className="text-[10px] font-black uppercase text-center truncate w-full italic text-zinc-400 group-hover:text-white">
                    {channel.title || channel.name}
                  </p>
                </div>
                {/* Indicador de "En vivo" si es el seleccionado */}
                {currentChannel.id === channel.id && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-red-600 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                    <span className="text-[8px] font-black">VIVO</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #333; }
      `}</style>
    </div>
  );
};

export default Channels;