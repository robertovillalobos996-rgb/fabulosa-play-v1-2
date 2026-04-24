import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Pause, Search, Tv, Volume2, VolumeX, Maximize, Loader2 } from "lucide-react";
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
  
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    if (!currentChannel?.url || !videoRef.current) return;
    setIsLoading(true);

    if (hlsRef.current) { hlsRef.current.destroy(); }

    // === LÓGICA DE FUERZA BRUTA ESTILO MAGIS ===
    // Si falla el túnel, intentamos la URL original. 
    // A veces el navegador deja pasar la señal si el usuario ya visitó la web oficial.
    let streamUrl = currentChannel.url;
    
    // Si la URL ya viene con el proxy, la limpiamos para intentar "Directo" si falla
    if (streamUrl.includes("api/proxy")) {
        const urlParams = new URLSearchParams(streamUrl.split('?')[1]);
        streamUrl = urlParams.get('url') ? decodeURIComponent(urlParams.get('url')) : streamUrl;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({ 
        manifestLoadingTimeOut: 20000,
        // Forzamos a que el navegador ignore ciertas restricciones de origen
        xhrSetup: (xhr) => {
            xhr.withCredentials = false;
        }
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(videoRef.current);
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setTimeout(() => setIsLoading(false), 1000);
        videoRef.current.play().catch(() => setIsPlaying(false));
      });

      hls.on(Hls.Events.ERROR, (e, data) => {
        if (data.fatal) {
          console.log("Fallo total. El servidor hp nos bloqueó.");
          setIsLoading(false);
        }
      });
    }
  }, [currentChannel]);

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
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden font-sans">
      <header className="h-16 bg-zinc-950 border-b border-white/10 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-zinc-500 hover:text-white"><ArrowLeft size={24} /></Link>
          <img src={logoFabulosa} alt="Fabulosa" className="h-10 object-contain" />
        </div>
        <div className="w-72 relative">
          <input 
            type="text" placeholder="BUSCAR CANAL..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border-none rounded-full py-2 px-6 text-[10px] font-black uppercase outline-none focus:ring-1 focus:ring-red-600"
          />
        </div>
      </header>

      {/* REPRODUCTOR FIJO */}
      <section className="relative w-full bg-black flex items-center justify-center border-b border-white/5" style={{ height: '42vh' }}>
        <video ref={videoRef} className="h-full w-full object-contain" autoPlay muted={isMuted} />
        {isLoading && (
          <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-20">
            <img src={currentChannel?.logo || "/fabulosa.jpg"} className="h-28 w-28 object-contain animate-pulse mb-4" />
            <Loader2 className="animate-spin text-red-600" size={32} />
          </div>
        )}
      </section>

      {/* LISTA PLUTO STYLE */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-zinc-950 border-r border-white/5 overflow-y-auto custom-scrollbar shrink-0">
          <div className="p-4 space-y-1">
            {categories.map(cat => (
              <button
                key={cat} onClick={() => setActiveCategory(cat)}
                className={`w-full text-left px-5 py-3 rounded-xl text-[11px] font-black uppercase transition-all ${
                  activeCategory === cat ? 'bg-red-600 text-white' : 'text-zinc-500 hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-6 bg-zinc-900/10 custom-scrollbar">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredChannels.map(channel => (
              <div
                key={channel.id} onClick={() => setCurrentChannel(channel)}
                className={`group aspect-video bg-zinc-900 rounded-[2rem] p-4 cursor-pointer transition-all border-2 ${
                  currentChannel.id === channel.id ? 'border-red-600 bg-red-600/10 shadow-[0_0_20px_rgba(220,38,38,0.4)]' : 'border-transparent'
                }`}
              >
                <div className="h-full w-full flex flex-col items-center justify-center">
                  <img src={channel.logo || "/fabulosa.jpg"} className="max-h-[60%] object-contain mb-2" />
                  <p className="text-[9px] font-black uppercase text-center truncate w-full italic text-zinc-500">{channel.title}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Channels;