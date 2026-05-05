import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, Play, Pause, Volume2, Loader2, Maximize, VolumeX, ArrowLeft
} from "lucide-react";
import Hls from "hls.js";

import logoFabulosa from "../assets/logo_fabulosa.png";
import { canalesTV as initialCanales } from "../data/canales_finales.js";

const Channels = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [channels, setChannels] = useState(initialCanales || []);
  const [currentChannel, setCurrentChannel] = useState(initialCanales[0]);
  
  // ESTADOS DE NAVEGACIÓN PRO
  const [focusedSection, setFocusedSection] = useState("grid"); // "sidebar", "grid", "player"
  const [focusedIndex, setFocusedIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const containerRef = useRef(null);
  const gridRef = useRef(null);

  const categories = useMemo(() => {
    return ["Todos", ...new Set(channels.map((c) => c.genre || "Varios"))];
  }, [channels]);

  const filteredChannels = useMemo(() => {
    return channels.filter((c) => {
      const matchCat = activeCategory === "Todos" || c.genre === activeCategory;
      const nombre = c.name || c.title || ""; 
      return matchCat && nombre.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [channels, activeCategory, searchTerm]);

  // CIRUGÍA: MOTOR DE CONTROL REMOTO PARA CANALES
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (focusedSection === "grid") {
        const columns = 8; // Basado en tu grid xl:grid-cols-8
        if (e.key === "ArrowRight") setFocusedIndex(prev => Math.min(prev + 1, filteredChannels.length - 1));
        if (e.key === "ArrowLeft") {
          if (focusedIndex % columns === 0) setFocusedSection("sidebar");
          else setFocusedIndex(prev => Math.max(prev - 1, 0));
        }
        if (e.key === "ArrowDown") setFocusedIndex(prev => Math.min(prev + columns, filteredChannels.length - 1));
        if (e.key === "ArrowUp") {
          if (focusedIndex < columns) setFocusedSection("player");
          else setFocusedIndex(prev => Math.max(prev - columns, 0));
        }
        if (e.key === "Enter") handleChannelSelect(filteredChannels[focusedIndex]);
      } 
      else if (focusedSection === "sidebar") {
        if (e.key === "ArrowDown") setFocusedIndex(prev => Math.min(prev + 1, categories.length - 1));
        if (e.key === "ArrowUp") setFocusedIndex(prev => Math.max(prev - 1, 0));
        if (e.key === "ArrowRight") setFocusedSection("grid");
        if (e.key === "Enter") setActiveCategory(categories[focusedIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedSection, focusedIndex, filteredChannels, categories]);

  const handleChannelSelect = (channel) => {
    setCurrentChannel(channel);
    setIsLoading(true);
  };

  useEffect(() => {
    if (!currentChannel?.url && !currentChannel?.iframe_url) return;
    if (hlsRef.current) hlsRef.current.destroy();
    
    if(!currentChannel.iframe_url && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(currentChannel.url);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current.play();
        setIsLoading(false);
      });
      hlsRef.current = hls;
    } else {
        setIsLoading(false);
    }
  }, [currentChannel]);

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-black text-white font-sans overflow-hidden">
      
      {/* BOTÓN DE VOLVER PROFESIONAL CON GIRO */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-[1000] bg-red-600 p-3 rounded-full shadow-2xl hover:rotate-[360ms] transition-transform duration-700 group focus:ring-4 focus:ring-white outline-none"
      >
        <ArrowLeft className="group-hover:rotate-[-360deg] transition-transform duration-700" size={24} />
      </button>

      <aside className="w-full lg:w-64 bg-[#0a0a0a] border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col shrink-0 z-50">
        <div className="p-4 pt-20 flex items-center justify-between lg:block">
          <img src={logoFabulosa} className="h-8 lg:h-10 object-contain lg:mb-8" />
          <div className="relative lg:w-full w-48">
            <input 
              type="text" placeholder="BUSCAR..." 
              className="w-full bg-white/5 border border-white/10 p-2 lg:p-3 rounded-xl text-xs outline-none focus:border-red-600"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex lg:flex-col overflow-x-auto lg:overflow-y-auto no-scrollbar p-2 lg:p-4 gap-2">
          {categories.map((cat, idx) => (
            <button
              key={cat}
              className={`px-4 lg:px-6 py-2 lg:py-4 rounded-xl flex items-center gap-3 transition-all shrink-0 lg:shrink outline-none ${activeCategory === cat ? 'bg-red-600 text-white' : 'bg-white/5 text-white/40'} ${(focusedSection === "sidebar" && focusedIndex === idx) ? 'ring-4 ring-white scale-105 bg-red-500' : ''}`}
            >
              <span className="text-[10px] lg:text-xs uppercase truncate tracking-tighter">{cat}</span>
            </button>
          ))}
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-[#050505]">
        
        <div ref={containerRef} className="relative w-full aspect-video lg:h-[50%] bg-black group shrink-0">
          {isLoading && <div className="absolute inset-0 flex items-center justify-center z-50 bg-black"><Loader2 className="animate-spin text-red-600" size={50} /></div>}
          
          {currentChannel?.iframe_url ? (
            <iframe src={currentChannel.iframe_url} className="w-full h-full border-none" allow="autoplay" title="Canal" />
          ) : (
            <video ref={videoRef} className="w-full h-full object-contain" />
          )}
        </div>

        <div ref={gridRef} className="flex-1 overflow-y-auto p-4 md:p-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 no-scrollbar pb-20">
          {filteredChannels.map((channel, idx) => (
            <div
              key={channel.id}
              className={`relative group cursor-pointer aspect-square rounded-[2rem] transition-all flex flex-col items-center justify-center p-4 bg-[#121212] border-4 outline-none ${currentChannel?.id === channel.id ? 'border-red-600' : 'border-transparent'} ${(focusedSection === "grid" && focusedIndex === idx) ? 'scale-110 border-white ring-4 ring-red-600 z-10' : ''}`}
            >
              <img src={channel.logo} loading="lazy" className="max-w-full max-h-full object-contain" alt="Logo" />
              <div className="absolute -bottom-2 bg-red-600 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase shadow-xl truncate max-w-[90%]">
                {channel.name || channel.title}
              </div>
            </div>
          ))}
        </div>
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #dc2626; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Channels;