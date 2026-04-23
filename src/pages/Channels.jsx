import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Pause, Search, Tv, Volume2, VolumeX, Maximize, Settings, ShieldCheck, Loader2, Plus } from "lucide-react";
import Hls from "hls.js";

// IMPORTACIÓN DE TU BASE DE DATOS
import { canalesTV } from "../data/canales_finales.js";

const Channels = () => {
  // === 💰 LOGICA DE PUBLICIDAD ===
  const ADSENSE_SLOT = "7869741603";
  const [displayLimit, setDisplayLimit] = useState(30); 
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Costa Rica");

  const [channels] = useState(canalesTV || []);
  const [currentChannel, setCurrentChannel] = useState(
    canalesTV.find(c => c.genre === "Costa Rica") || canalesTV[0]
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  // === 🖥️ REPRODUCTOR HLS ENGINE CON TÚNEL ANTI-BLOQUEO ===
  useEffect(() => {
    if (!currentChannel?.url || !videoRef.current) return;

    setIsLoading(true);

    if (hlsRef.current) {
      hlsRef.current.destroy();
    }

    // --- CIRUGÍA DE ENGAÑO (CORS PROXY) ---
    // Si el canal tiene la etiqueta 'headers', usamos el túnel para que abra sí o sí
    let finalUrl = currentChannel.url;
    if (currentChannel.headers) {
      finalUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(currentChannel.url)}`;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        manifestLoadingTimeOut: 20000,
        manifestLoadingMaxRetry: 5,
        enableWorker: true,
        xhrSetup: (xhr, url) => {
          // Desactivamos credenciales para que el proxy pase limpio
          xhr.withCredentials = false;
          // Inyectamos X-Requested-With como blindaje extra
          if (currentChannel.headers) {
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
          }
        }
      });

      hls.loadSource(finalUrl);
      hls.attachMedia(videoRef.current);
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        if (isPlaying) {
          videoRef.current.play().catch(() => setIsPlaying(false));
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log("Error de red, reintentando señal...");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      // Soporte para Safari/iPhone
      videoRef.current.src = finalUrl;
      videoRef.current.addEventListener("loadedmetadata", () => {
        setIsLoading(false);
        if (isPlaying) videoRef.current.play().catch(() => setIsPlaying(false));
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [currentChannel]);

  // Manejo de Play/Pause
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => setIsPlaying(false));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleChannelSelect = (channel) => {
    setCurrentChannel(channel);
    setIsPlaying(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredChannels = useMemo(() => {
    return channels.filter(channel => {
      const matchesSearch = (channel.title || channel.name || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = channel.genre === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [channels, searchTerm, activeCategory]);

  const categories = useMemo(() => {
    const genres = channels.map(c => c.genre).filter(Boolean);
    return ["Costa Rica", ...new Set(genres.filter(g => g !== "Costa Rica"))];
  }, [channels]);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* HEADER */}
      <div className="bg-zinc-900/50 border-b border-white/5 p-4 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
            <span className="font-black uppercase text-xs tracking-widest italic">Volver</span>
          </Link>
          <div className="flex items-center gap-2">
            <Tv className="text-red-600" size={20} />
            <h1 className="font-black uppercase italic tracking-tighter text-xl">
              <span className="text-red-600">Fabulosa</span> Play
            </h1>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-4 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* REPRODUCTOR PRINCIPAL */}
          <div className="flex-1">
            <div className="relative aspect-video bg-zinc-950 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl group">
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
                  <Loader2 className="text-red-600 animate-spin mb-4" size={48} />
                  <p className="font-black uppercase italic text-xs tracking-[0.3em] animate-pulse">Sintonizando Señal...</p>
                </div>
              )}
              
              <video
                ref={videoRef}
                className="w-full h-full object-contain"
                playsInline
                onClick={togglePlay}
              />

              {/* CONTROLES OVERLAY */}
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <button onClick={togglePlay} className="bg-white text-black p-3 rounded-2xl hover:scale-110 transition-transform">
                      {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                    </button>
                    <button onClick={toggleMute} className="text-white p-2 hover:bg-white/10 rounded-xl transition-colors">
                      {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </button>
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-black uppercase italic text-sm tracking-tight truncate">{currentChannel?.title || currentChannel?.name}</p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      <ShieldCheck size={12} className="text-green-500" />
                      <span>Conexión Segura</span>
                    </div>
                  </div>

                  <button onClick={() => videoRef.current.requestFullscreen()} className="text-white p-2 hover:bg-white/10 rounded-xl">
                    <Maximize size={24} />
                  </button>
                </div>
              </div>
            </div>

            {/* INFO CANAL */}
            <div className="mt-8 flex items-center gap-6 p-6 bg-zinc-900/30 rounded-[2.5rem] border border-white/5">
              <div className="w-20 h-20 bg-black rounded-3xl p-4 flex items-center justify-center border border-white/10 overflow-hidden">
                <img src={currentChannel?.logo || "/img/fabulosa.jpg"} className="max-h-full object-contain" alt="logo" />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase italic leading-none">{currentChannel?.title || currentChannel?.name}</h2>
                <p className="text-zinc-500 text-xs font-black uppercase mt-2 tracking-widest italic">{currentChannel?.genre} • Señal Digital</p>
              </div>
            </div>
          </div>

          {/* SIDEBAR: BUSQUEDA Y CATEGORIAS */}
          <div className="w-full lg:w-[400px] space-y-6">
            <div className="bg-zinc-900/50 p-6 rounded-[2.5rem] border border-white/5">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="text"
                  placeholder="BUSCAR CANAL..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-black uppercase tracking-widest focus:border-red-600 outline-none transition-all"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setDisplayLimit(30); }}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase whitespace-nowrap transition-all ${
                      activeCategory === cat ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* LISTA DE CANALES FILTRADA */}
            <div className="grid grid-cols-2 gap-4">
              {filteredChannels.slice(0, displayLimit).map((channel) => (
                <div
                  key={channel.id}
                  onClick={() => handleChannelSelect(channel)}
                  className={`group bg-white/5 rounded-3xl p-4 border transition-all cursor-pointer hover:bg-white/10 ${
                    currentChannel?.id === channel.id ? 'border-red-600 bg-red-600/5' : 'border-white/10'
                  }`}
                >
                  <div className="aspect-square bg-black rounded-2xl p-4 mb-4 flex items-center justify-center relative overflow-hidden">
                    <img src={channel.logo || "/img/fabulosa.jpg"} className="max-h-full object-contain z-10 group-hover:scale-110 transition-transform" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="font-black text-[10px] uppercase truncate text-center italic">
                    {(channel.title || channel.name || "Sin Nombre").toUpperCase()}
                  </h4>
                </div>
              ))}
            </div>

            {filteredChannels.length > displayLimit && (
              <div className="flex justify-center py-4">
                <button onClick={() => setDisplayLimit(prev => prev + 40)} className="bg-red-600 px-10 py-3 rounded-full font-black uppercase text-xs hover:bg-red-500 transition-colors flex items-center gap-2">
                  <Plus size={16} /> Cargar Más Canales
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Channels;