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

    if (Hls.isSupported()) {
      const hls = new Hls({ 
        manifestLoadingTimeOut: 20000,
        xhrSetup: (xhr) => { xhr.withCredentials = false; }
      });
      hls.loadSource(currentChannel.url);
      hls.attachMedia(videoRef.current);
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
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

  const handleDoubleClick = () => {
    if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
  };

  const filteredChannels = useMemo(() => {
    // Filtro para que Trivisión solo salga en su categoría
    return channels.filter(c => 
      (c.title || c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) &&
      c.genre === activeCategory
    );
  }, [channels, searchTerm, activeCategory]);

  const categories = useMemo(() => {
    const genres = channels.map(c => c.genre).filter(Boolean);
    return ["Costa Rica", ...new Set(genres.filter(g => g !== "Costa Rica"))];
  }, [channels]);

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden font-sans">
      <header className="h-16 bg-zinc-950 border-b border-white/10 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-zinc-500 hover:text-white"><ArrowLeft size={24} /></Link>
          <img src={logoFabulosa} alt="Fabulosa" className="h-10 object-contain" />
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
          <input 
            type="text" placeholder="BUSCAR CANAL..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border-none rounded-full py-2 pl-10 pr-4 text-[10px] font-black uppercase outline-none focus:ring-1 focus:ring-red-600"
          />
        </div>
      </header>

      {/* REPRODUCTOR FIJO (PLUTO) */}
      <section className="relative w-full bg-black flex items-center justify-center border-b border-white/5" style={{ height: '42vh' }}>
        <video 
          ref={videoRef} className="h-full w-full object-contain cursor-pointer"
          onDoubleClick={handleDoubleClick} onClick={() => setIsPlaying(!isPlaying)}
          autoPlay muted={isMuted}
        />
        {isLoading && (
          <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-20">
            <img src={currentChannel?.logo || "/fabulosa.jpg"} className="h-28 w-28 object-contain animate-pulse mb-4" />
            <Loader2 className="animate-spin text-red-600" size={32} />
          </div>
        )}
      </section>

      {/* CUERPO: CATEGORÍAS IZQ / CANALES DER */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-zinc-950 border-r border-white/5 overflow-y-auto custom-scrollbar shrink-0">
          <div className="p-4 space-y-1">
            <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-4 ml-2 italic">Categorías</p>
            {categories.map(cat => (
              <button
                key={cat} onClick={() => setActiveCategory(cat)}
                className={`w-full text-left px-5 py-3 rounded-xl text-[11px] font-black uppercase transition-all ${
                  activeCategory === cat ? 'bg-red-600 text-white' : 'text-zinc-500 hover:bg-white/5 hover:text-white'
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
                key={channel.id} onClick={() => { setCurrentChannel(channel); setIsPlaying(true); }}
                className={`group relative aspect-video bg-zinc-900 rounded-[2rem] p-4 cursor-pointer transition-all border-2 ${
                  currentChannel.id === channel.id ? 'border-red-600 bg-red-600/10 scale-95 shadow-[0_0_25px_rgba(220,38,38,0.4)]' : 'border-transparent hover:border-white/20'
                }`}
              >
                <div className="h-full w-full flex flex-col items-center justify-center">
                  <img 
                    src={channel.logo || "/fabulosa.jpg"} 
                    className="max-h-[65%] object-contain mb-2 group-hover:scale-110 transition-transform"
                    onError={(e) => { e.target.src = "/fabulosa.jpg" }}
                  />
                  <p className="text-[9px] font-black uppercase text-center truncate w-full italic text-zinc-500 group-hover:text-white">{channel.title || channel.name}</p>
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