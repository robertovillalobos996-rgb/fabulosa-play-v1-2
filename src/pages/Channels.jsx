import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, Play, Pause, Volume2, Loader2, Trash2, UploadCloud, 
  Save, Rocket, X, Maximize, ChevronRight, CheckCircle, VolumeX
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
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeout = useRef(null);

  const isAdmin = new URLSearchParams(window.location.search).get("admin") === "fabulosa";

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

  const updateData = (field, value) => {
    const updated = channels.map(c => c.id === currentChannel.id ? { ...c, [field]: value } : c);
    setChannels(updated);
    setCurrentChannel({ ...currentChannel, [field]: value });
  };

  const saveToDisk = async () => {
    setIsSaving(true);
    try {
      await fetch('http://localhost:3001/save-channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(channels)
      });
      alert("✅ LISTA GUARDADA CORRECTAMENTE");
    } catch (e) { alert("Error al guardar"); }
    setIsSaving(false);
  };

  const togglePlay = () => {
    if(!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
  };

  useEffect(() => {
    if (!currentChannel?.url && !currentChannel?.iframe_url) return;
    
    if(currentChannel.iframe_url) {
      setIsLoading(false);
      if (hlsRef.current) hlsRef.current.destroy();
      return; 
    }

    setIsLoading(true);
    if (hlsRef.current) hlsRef.current.destroy();
    const video = videoRef.current;
    
    if (video && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(currentChannel.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        setIsLoading(false);
      });
      hlsRef.current = hls;
    }
  }, [currentChannel]);

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-black text-white font-sans overflow-hidden">
      
      <aside className="w-full lg:w-64 bg-[#0a0a0a] border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col shrink-0">
        <div className="p-4 flex items-center justify-between lg:block">
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
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 lg:px-6 py-2 lg:py-4 rounded-xl flex items-center gap-3 transition-all shrink-0 lg:shrink ${activeCategory === cat ? 'bg-red-600 text-white font-black' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
            >
              <span className="text-[10px] lg:text-xs uppercase truncate tracking-tighter">{cat}</span>
            </button>
          ))}
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-[#050505]">
        
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="relative w-full aspect-video lg:h-[50%] bg-black group shrink-0"
        >
          {isLoading && <div className="absolute inset-0 flex items-center justify-center z-50 bg-black"><Loader2 className="animate-spin text-red-600" size={50} /></div>}
          
          {currentChannel?.iframe_url ? (
            <div className="w-full h-full overflow-hidden bg-black">
              <iframe 
                src={currentChannel.iframe_url} 
                className="w-full h-full border-none"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title={currentChannel.name || currentChannel.title}
              ></iframe>
            </div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                onClick={togglePlay}
                className="w-full h-full object-contain cursor-pointer" 
              />
              
              <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 transition-opacity duration-300 flex flex-col justify-between p-4 pointer-events-none ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                
                <div className="flex justify-between items-start pointer-events-auto">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg p-1.5"><img src={currentChannel?.logo} className="w-full h-full object-contain" /></div>
                    <h2 className="text-xl font-black uppercase italic drop-shadow-lg">{currentChannel?.name || currentChannel?.title}</h2>
                  </div>
                  <button onClick={() => navigate('/')} className="bg-white/10 p-2 rounded-full hover:bg-red-600"><X size={20}/></button>
                </div>

                <div className="flex justify-center items-center pointer-events-auto">
                   {!isPlaying && <button onClick={togglePlay} className="bg-red-600/80 p-6 rounded-full scale-110"><Play size={40} fill="white"/></button>}
                </div>

                <div className="space-y-3 pointer-events-auto">
                  <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                     <div className="h-full bg-red-600 w-full animate-pulse" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <button onClick={togglePlay} className="hover:text-red-600 transition-colors">
                        {isPlaying ? <Pause size={28} fill="currentColor"/> : <Play size={28} fill="currentColor"/>}
                      </button>
                      
                      <div className="flex items-center gap-2 group/vol">
                        <button onClick={() => setIsMuted(!isMuted)}>
                          {isMuted || volume === 0 ? <VolumeX size={24}/> : <Volume2 size={24}/>}
                        </button>
                        <input 
                          type="range" min="0" max="1" step="0.1" 
                          value={volume} onChange={e => {setVolume(e.target.value); if(videoRef.current) videoRef.current.volume = e.target.value;}}
                          className="w-0 group-hover/vol:w-20 transition-all accent-red-600"
                        />
                      </div>
                      
                      <span className="text-[10px] font-bold text-red-600 flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" /> EN VIVO
                      </span>
                    </div>

                    <button onClick={toggleFullscreen} className="hover:scale-110 transition-transform"><Maximize size={24}/></button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 no-scrollbar">
          {filteredChannels.map((channel) => (
            <div
              key={channel.id}
              className={`relative group cursor-pointer aspect-square rounded-[2rem] transition-all flex flex-col items-center justify-center p-4 bg-[#121212] border-4 ${currentChannel?.id === channel.id ? 'border-red-600' : 'border-transparent'} hover:scale-105`}
              onClick={() => setCurrentChannel(channel)}
            >
              <img src={channel.logo} className="max-w-full max-h-full object-contain" alt="Logo" />
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