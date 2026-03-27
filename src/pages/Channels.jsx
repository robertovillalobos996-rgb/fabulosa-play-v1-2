import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { ArrowLeft, Tv, AlertTriangle, RefreshCw, Loader2, Signal, Play, Search, CheckCircle2 } from "lucide-react";
import Hls from "hls.js";

// ✅ Tu Logo Gigante
import logoFabulosa from "../assets/logo_fabulosa.png";

const Channels = () => {
  const [channels, setChannels] = useState([]);
  const [current, setCurrent] = useState(null);
  const [activeCat, setActiveCat] = useState("TODOS");
  const [searchQuery, setSearchQuery] = useState(""); // Agregué el buscador
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(50); // Para que 1400 canales no den lag

  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  const PROXY_URL = "http://localhost:3001/video-proxy?url=";

  // 1. CARGAR CANALES DE FIREBASE (Intacto)
  useEffect(() => {
    const q = query(collection(db, "peliculas"), where("category", "==", "TV En Vivo"));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChannels(list);
    });
    return () => unsub();
  }, []);

  // 2. FILTRO INTELIGENTE + BUSCADOR (Combinado para máxima velocidad)
  const displayedChannels = useMemo(() => {
    const palabrasEspanol = /latino|español|es|ar|mx|cr|cl|pe|co|tv|canal|deportes|noticias|cine|mexico|argentina|colombia|chile|peru|costa rica/i;

    let filtrados = channels;

    // Filtro por idioma
    if (activeCat === "ESPAÑOL") {
      filtrados = filtrados.filter(ch => palabrasEspanol.test(ch.title));
    } else if (activeCat === "INTERNACIONAL") {
      filtrados = filtrados.filter(ch => !palabrasEspanol.test(ch.title));
    }

    // Filtro por el buscador
    if (searchQuery) {
      filtrados = filtrados.filter(ch => ch.title?.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return filtrados;
  }, [channels, activeCat, searchQuery]);

  // Cortamos para mostrar de 50 en 50
  const visibleChannelsList = displayedChannels.slice(0, visibleCount);

  // 3. REPRODUCTOR HLS DE ALTA FIDELIDAD (Intacto)
  const selectChannel = (channel) => {
    setCurrent(channel);
    setError(false);
    setLoading(true);

    if (hlsRef.current) {
      hlsRef.current.destroy();
    }

    const video = videoRef.current;
    if (!video) return;

    const finalUrl = `${PROXY_URL}${encodeURIComponent(channel.url)}`;

    if (Hls.isSupported()) {
      const hls = new Hls({ debug: false, enableWorker: true, lowLatencyMode: true });
      hlsRef.current = hls;
      hls.loadSource(finalUrl);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
        video.play().catch(e => console.log("Auto-play prevented", e));
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          setError(true);
          setLoading(false);
          hls.destroy();
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = finalUrl;
      video.addEventListener("loadedmetadata", () => {
        setLoading(false);
        video.play().catch(e => console.log("Auto-play prevented", e));
      });
      video.addEventListener("error", () => { setError(true); setLoading(false); });
    }
  };

  return (
    // ESTRUCTURA MAESTRA: h-screen y overflow-hidden para parecer una App nativa
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-hidden selection:bg-rose-700">
      
      {/* 🍷 1. HEADER FIJO (Estilo Netflix/Vino Vidrio) */}
      <div className="flex-none flex items-center justify-between px-6 py-4 bg-gradient-to-b from-[#0a0202] to-black border-b border-rose-900/30 shadow-lg shadow-rose-950/20 z-20">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 bg-white/5 rounded-full hover:bg-rose-900/50 hover:text-rose-400 transition-colors border border-white/5">
            <ArrowLeft size={20} />
          </Link>
          <img src={logoFabulosa} alt="Fabulosa Play" className="h-14 md:h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(159,18,57,0.6)]" />
        </div>

        {/* Buscador Integrado */}
        <div className="relative w-full max-w-sm hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar canal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-rose-900/40 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-700/50 transition-all placeholder:text-white/20"
          />
        </div>
      </div>

      {/* ÁREA DE CONTENIDO (Se divide entre Reproductor Fijo y Lista Scrolleable) */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#050505]">
        
        {/* 📺 2. REPRODUCTOR FIJO */}
        <div className="flex-none w-full max-w-5xl mx-auto px-4 pt-4 pb-2 z-10">
          <div className="relative aspect-video bg-[#0a0202] rounded-2xl overflow-hidden border border-rose-950/60 shadow-[0_15px_50px_rgba(159,18,57,0.15)] group">
            {current ? (
              <>
                <video ref={videoRef} className="w-full h-full object-contain bg-black" controls autoPlay crossOrigin="anonymous" />
                
                {/* Info Overlay Premium */}
                <div className="absolute top-4 right-4 bg-rose-700/90 backdrop-blur-sm text-white text-[10px] font-black tracking-widest px-3 py-1.5 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(225,29,72,0.5)]">
                  <Signal size={12} className="animate-pulse" /> SEÑAL MASTER
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                   <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter drop-shadow-lg">{current.title}</h1>
                </div>

                {loading && (
                  <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
                    <Loader2 className="animate-spin text-rose-600 mb-4" size={40} />
                    <p className="text-white font-black tracking-[0.4em] uppercase text-xs animate-pulse">Desencriptando...</p>
                  </div>
                )}
                {error && (
                  <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center z-10">
                    <AlertTriangle className="text-yellow-500 mb-4 drop-shadow-lg" size={48} />
                    <p className="text-white font-black text-lg tracking-widest uppercase mb-6">Señal Interrumpida</p>
                    <button onClick={() => selectChannel(current)} className="flex items-center gap-2 bg-rose-700 hover:bg-rose-600 px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(159,18,57,0.4)]">
                      <RefreshCw size={16} /> Forzar Conexión
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0202]">
                <div className="w-24 h-24 rounded-full bg-rose-950/30 flex items-center justify-center mb-6 border border-rose-900/50 shadow-inner">
                  <Tv size={40} className="text-rose-700/50" />
                </div>
                <p className="text-rose-700/50 font-black tracking-[0.5em] uppercase text-sm">Sistema en Espera</p>
              </div>
            )}
          </div>
        </div>

        {/* 🏷️ 3. CATEGORÍAS FIJAS */}
        <div className="flex-none px-4 py-2 z-10 max-w-5xl mx-auto w-full">
          <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
            {["TODOS", "ESPAÑOL", "INTERNACIONAL"].map(cat => (
              <button 
                key={cat}
                onClick={() => { setActiveCat(cat); setVisibleCount(50); }}
                className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${
                  activeCat === cat 
                  ? 'bg-rose-700 text-white border-rose-500 shadow-[0_0_20px_rgba(159,18,57,0.5)] scale-105' 
                  : 'bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 📜 4. LISTA DE CANALES MAGIS/NETFLIX STYLE */}
        <div className="flex-1 overflow-y-auto px-4 pb-10 custom-scrollbar max-w-5xl mx-auto w-full mt-2">
          
          {/* Formato de LISTA (1 a 3 columnas anchas según la pantalla) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {visibleChannelsList.map((ch, index) => (
              <div 
                key={ch.id} 
                onClick={() => selectChannel(ch)} 
                className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-300 border group ${
                  current?.id === ch.id 
                  ? 'bg-rose-950/40 border-rose-600 shadow-[0_0_15px_rgba(159,18,57,0.3)]' 
                  : 'bg-[#0a0a0a] border-white/5 hover:bg-[#111] hover:border-white/20'
                }`}
              >
                {/* Logo Pequeño Estilo Guía */}
                <div className="w-16 h-12 flex-shrink-0 bg-black rounded-xl overflow-hidden flex items-center justify-center border border-white/5 group-hover:border-rose-900/50 transition-colors relative">
                  {ch.img ? (
                    <img src={ch.img} className="w-full h-full object-contain p-1 filter brightness-90 group-hover:brightness-110" alt={ch.title} />
                  ) : (
                    <Tv className="opacity-20 w-5 h-5 text-white" />
                  )}
                  {/* Icono de Play Oculto que aparece en Hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Play className="w-5 h-5 text-white fill-current drop-shadow-lg" />
                  </div>
                </div>
                
                {/* Nombre del Canal */}
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-black uppercase truncate tracking-tighter transition-colors ${
                    current?.id === ch.id ? 'text-rose-400' : 'text-white/90 group-hover:text-white'
                  }`}>
                    {ch.title}
                  </h3>
                  <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest mt-0.5">CH {index + 1}</p>
                </div>

                {/* Status Activo */}
                {current?.id === ch.id && (
                  <div className="pr-2 text-rose-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
                    <span className="text-[8px] font-black uppercase tracking-widest">ON</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Botón Cargar Más (Previene el lag de los 1400 canales) */}
          {displayedChannels.length > visibleCount && (
            <button 
              onClick={() => setVisibleCount(prev => prev + 50)}
              className="w-full mt-8 py-4 bg-gradient-to-r from-transparent via-white/5 to-transparent border-y border-white/10 text-rose-700/70 font-black tracking-widest text-[10px] uppercase hover:text-rose-500 hover:border-rose-900/50 transition-all"
            >
              ⏬ Revelar más canales ⏬
            </button>
          )}

          {displayedChannels.length === 0 && (
             <div className="text-center mt-20 p-10 border border-white/5 bg-white/5 rounded-3xl">
               <Tv className="w-16 h-16 text-white/10 mx-auto mb-4" />
               <p className="text-white/40 text-xs font-black tracking-widest uppercase">Sin resultados</p>
             </div>
          )}
        </div>
      </div>

      {/* ESTILOS DEL SCROLLBAR (Modificados a Vino) */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(159, 18, 57, 0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(159, 18, 57, 0.8); }
      `}</style>
    </div>
  );
};

export default Channels;