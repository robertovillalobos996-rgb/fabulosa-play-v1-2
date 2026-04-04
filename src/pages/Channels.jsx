import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Pause, Search, Tv, Volume2, VolumeX, Maximize, Settings, ShieldCheck, Loader2, Plus } from "lucide-react";
import Hls from "hls.js";

// IMPORTACIÓN DE TU BASE DE DATOS LIMPIA
import { canalesTV } from "../data/canales_finales";

const Channels = () => {
  // === 💰 LOGICA DE PUBLICIDAD (ADSENSE) ===
  const ADSENSE_SLOT = "7869741603";
  const AD_INTERVAL = 30 * 60 * 1000; 
  const LONG_AD_DURATION = 12; 
  const [longAdActive, setLongAdActive] = useState(false);
  const [longAdTimer, setLongAdTimer] = useState(LONG_AD_DURATION);

  // === ⚡ ESTADOS DE RENDIMIENTO (PARA QUE LA PAGINA VUELE) ===
  const [displayLimit, setDisplayLimit] = useState(30); 
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Costa Rica");

  // Estados principales
  const [channels] = useState(canalesTV || []);
  const [currentChannel, setCurrentChannel] = useState(
    canalesTV.find(c => c.genre === "Costa Rica") || canalesTV[0]
  );
  
  // Estados del reproductor
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  const controlsTimeout = useRef(null);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    setDisplayLimit(30);
  }, [activeCategory, searchTerm]);

  // 1. 🕒 TEMPORIZADOR DE PUBLICIDAD
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentChannel) {
        setLongAdActive(true);
        setLongAdTimer(LONG_AD_DURATION);
      }
    }, AD_INTERVAL);
    return () => clearInterval(interval);
  }, [currentChannel]);

  useEffect(() => {
    let timer;
    if (longAdActive && longAdTimer > 0) {
      timer = setInterval(() => setLongAdTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [longAdActive, longAdTimer]);

  // 2. 🚀 MOTOR NASA (HLS Ultra-Potente)
  useEffect(() => {
    if (!currentChannel || !videoRef.current) return;
    const video = videoRef.current;
    setIsLoading(true);

    if (hlsRef.current) hlsRef.current.destroy();

    const configNASA = {
      enableWorker: true,
      lowLatencyMode: false,
      backBufferLength: 90,
      manifestLoadingMaxRetry: 25, 
      manifestLoadingRetryDelay: 500,
      levelLoadingMaxRetry: 20,
      fragLoadingMaxRetry: 20,
      maxBufferLength: 60,
      maxMaxBufferLength: 120,
      maxBufferSize: 80 * 1000 * 1000, 
      xhrSetup: (xhr) => { xhr.withCredentials = false; }
    };

    if (Hls.isSupported()) {
      const hls = new Hls(configNASA);
      hlsRef.current = hls;
      hls.loadSource(currentChannel.url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        if (isPlaying) video.play().catch(() => setIsPlaying(false));
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR: hls.startLoad(); break;
            case Hls.ErrorTypes.MEDIA_ERROR: hls.recoverMediaError(); break;
            default: 
                hls.destroy();
                setTimeout(() => setCurrentChannel({...currentChannel}), 2000);
                break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = currentChannel.url;
      video.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
        video.play();
      });
    }
  }, [currentChannel]);

  // 3. ⌨️ LÓGICA DE CONTROLES
  useEffect(() => {
    if(!videoRef.current) return;
    if (isPlaying) videoRef.current.play().catch(() => setIsPlaying(false));
    else videoRef.current.pause();
    videoRef.current.volume = isMuted ? 0 : volume / 100;
  }, [isPlaying, volume, isMuted]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
  };

  const filteredChannels = useMemo(() => {
    return channels.filter(c => 
      (activeCategory === "Todos" || c.genre === activeCategory) &&
      c.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [channels, activeCategory, searchTerm]);

  const visibleChannels = useMemo(() => {
    return filteredChannels.slice(0, displayLimit);
  }, [filteredChannels, displayLimit]);

  const categories = useMemo(() => ["Todos", ...new Set(channels.map(c => c.genre))].sort(), [channels]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full z-[100] bg-black/80 backdrop-blur-xl px-4 md:px-8 py-3 flex items-center justify-between border-b border-white/5 transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-red-600 rounded-full transition-all text-white"><ArrowLeft size={22} /></Link>
          <div className="flex items-center gap-1 font-black text-2xl tracking-tighter italic">
             <Tv className="text-red-600" size={30} fill="currentColor"/>
             <span className="text-white">CANALES<span className="text-red-600 font-light">PLAY</span></span>
          </div>
        </div>
        <div className="relative flex-1 max-w-xl mx-10 hidden md:block">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="text" placeholder="¿Qué canal quieres ver?" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-6 focus:border-red-600 focus:bg-black transition-all outline-none text-sm" />
        </div>
      </nav>

      {/* REPRODUCTOR NASA */}
      <div 
        className="relative group w-full aspect-video md:h-[82vh] bg-black mt-[68px] overflow-hidden flex items-center justify-center border-b border-white/5"
        onMouseMove={handleMouseMove}
        style={{ cursor: showControls ? 'default' : 'none' }}
      >
        {isLoading && !longAdActive && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black">
                <Loader2 className="text-red-600 animate-spin mb-4" size={50} />
                <p className="text-[10px] font-black tracking-[0.5em] uppercase text-white/50 animate-pulse">Sintonizando Satélite NASA...</p>
            </div>
        )}

        <video ref={videoRef} className="w-full h-full object-contain" playsInline autoPlay />

        {longAdActive && (
            <div className="absolute inset-0 z-[110] bg-black/98 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-zinc-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                    <div className="bg-red-600 py-1.5 text-center text-[10px] font-black uppercase tracking-widest">Publicidad de mantenimiento</div>
                    <div className="aspect-video bg-black flex items-center justify-center">
                        <ins className="adsbygoogle" 
                             style={{ display: 'block', width: '100%', height: '100%' }} 
                             data-ad-client="ca-pub-9326186822962530" 
                             data-ad-slot={ADSENSE_SLOT} 
                             data-ad-format="rectangle"></ins>
                    </div>
                    <div className="p-4 flex justify-between items-center bg-zinc-950">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">La señal vuelve en breve...</span>
                        {longAdTimer > 0 ? (
                            <div className="text-white font-black px-5 py-1 bg-zinc-800 rounded-full border border-white/5">{longAdTimer}s</div>
                        ) : (
                            <button onClick={() => setLongAdActive(false)} className="bg-white text-black px-6 py-2 rounded-full font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all">Omitir Anuncio ⏭️</button>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* CONTROLES TRASPARENTES (Corregido: ahora cierra con div) */}
        <div className={`absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent transition-all duration-500 z-30 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center justify-between max-w-[1800px] mx-auto">
            <div className="flex items-center gap-6">
              <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-red-600 transition-transform active:scale-90 text-white">
                {isPlaying ? <Pause fill="currentColor" size={28}/> : <Play fill="currentColor" size={28}/>}
              </button>
              
              <div className="flex items-center gap-3 group/vol bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/5 transition-all">
                <button onClick={() => setIsMuted(!isMuted)}>
                    {isMuted || volume === 0 ? <VolumeX size={18}/> : <Volume2 size={18}/>}
                </button>
                <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(e.target.value)} 
                className="w-0 group-hover/vol:w-20 transition-all accent-red-600 h-1 cursor-pointer" />
              </div>

              <div className="px-3 py-1 bg-red-600/10 border border-red-600/20 rounded text-[9px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div> En Vivo
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-white/30">
              <span className="text-[9px] font-bold tracking-tighter hidden sm:block">ENGINE: NASA 2.0_STABLE</span>
              <Maximize size={20} className="hover:scale-110 cursor-pointer hover:text-white" onClick={() => videoRef.current.requestFullscreen()} />
            </div>
          </div>
        </div>
      </div> {/* <--- Aquí estaba el error, ahora es un div correctamente cerrado */}

      {/* CATEGORIAS */}
      <div className="px-6 md:px-16 pt-10 pb-6 overflow-x-auto no-scrollbar flex gap-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => { setActiveCategory(cat); setSearchTerm(""); }}
              className={`px-6 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap border ${activeCategory === cat && !searchTerm ? 'bg-red-600 border-red-600 text-white shadow-lg' : 'bg-zinc-900 border-white/5 text-gray-500 hover:text-white'}`}>
              {cat}
            </button>
          ))}
      </div>

      {/* GRILLA DE CANALES OPTIMIZADA */}
      <div className="px-6 md:px-16 py-6 max-w-[2200px] mx-auto min-h-screen">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {visibleChannels.map(channel => (
            <div key={channel.id} onClick={() => { setCurrentChannel(channel); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
                 className="cursor-pointer group">
              <div className={`aspect-video rounded-2xl overflow-hidden mb-3 relative border-2 transition-all duration-300 ${currentChannel?.id === channel.id ? 'border-red-600 bg-black scale-[1.02]' : 'border-white/5 bg-zinc-900/50 group-hover:border-red-600/30'}`}>
                <img 
                  src={channel.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(channel.title)}&background=111&color=fff&size=512&bold=true`} 
                  loading="lazy"
                  className="w-full h-full object-contain p-6 opacity-60 group-hover:opacity-100 transition-all duration-500" 
                  alt={channel.title} 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play fill="white" size={20} className="text-white" />
                </div>
              </div>
              <h3 className="font-black text-xs truncate group-hover:text-red-500 transition-colors uppercase italic px-1">{channel.title}</h3>
              <div className="flex justify-between items-center px-1 mt-0.5">
                  <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">{channel.genre}</span>
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
                    <Plus size={18} /> Cargar más canales ({filteredChannels.length - displayLimit} restantes)
                </button>
            </div>
        )}
      </div>

      <footer className="py-10 border-t border-white/5 text-center">
         <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.5em]">Fabulosa Play Premium • 2026</p>
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        video { outline: none; background: #000; }
        input[type=range] { -webkit-appearance: none; background: rgba(255,255,255,0.05); border-radius: 10px; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 12px; width: 12px; border-radius: 50%; background: #dc2626; cursor: pointer; border: 1px solid white; }
      `}</style>
    </div>
  );
};

export default Channels;