import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Play, Pause, Volume2, VolumeX, Maximize, Loader2, Trash2, ArrowUp, ArrowDown, Save, Edit3, UploadCloud, ChevronDown } from "lucide-react";
import Hls from "hls.js";

import logoFabulosa from "../assets/logo_fabulosa.png";
import { canalesTV as initialCanales } from "../data/canales_finales.js";

const Channels = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Costa Rica");
  const [channels, setChannels] = useState(initialCanales || []);
  const [currentChannel, setCurrentChannel] = useState(initialCanales[0]);
  const [editMode, setEditMode] = useState(false);
  
  // Estados del Reproductor
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const fileInputRef = useRef(null);
  const [uploadingFor, setUploadingFor] = useState(null);

  const isAdmin = new URLSearchParams(window.location.search).get("admin") === "fabulosa";

  // --- CONTROLES DE VIDEO ---
  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleFullScreen = () => {
    if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
    else if (videoRef.current.webkitRequestFullscreen) videoRef.current.webkitRequestFullscreen();
  };

  // --- GESTIÓN DE DATOS ---
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !uploadingFor) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Data = reader.result.split(',')[1];
      try {
        const res = await fetch('http://localhost:3001/upload-logo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file.name, base64Data })
        });
        const result = await res.json();
        if (res.ok) setChannels(channels.map(c => c.id === uploadingFor ? { ...c, logo: result.path } : c));
      } catch (err) { alert("Error al conectar con bridge.js"); }
    };
  };

  const saveToDisk = async () => {
    try {
      const res = await fetch('http://localhost:3001/save-channels', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(channels)
      });
      if (res.ok) alert("✅ ¡DATOS GUARDADOS!");
    } catch (err) { alert("❌ El puente no está encendido."); }
  };

  // --- REPRODUCTOR ---
  useEffect(() => {
    if (!currentChannel?.url || !videoRef.current) return;
    setIsLoading(true);
    if (hlsRef.current) hlsRef.current.destroy();
    
    let finalUrl = currentChannel.url;
    if ((finalUrl.includes("repretel") || finalUrl.includes("cdnmedia") || currentChannel.headers) && !finalUrl.includes("/api/proxy")) {
      finalUrl = `/api/proxy?url=${encodeURIComponent(currentChannel.url)}&referer=${encodeURIComponent(currentChannel.headers?.Referer || 'https://www.repretel.com/')}`;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({ manifestLoadingTimeOut: 20000 });
      hls.loadSource(finalUrl);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => { 
        setIsLoading(false); 
        videoRef.current.play().catch(()=>{}); 
        setIsPlaying(true);
      });
      hlsRef.current = hls;
    }
  }, [currentChannel]);

  const categories = useMemo(() => [...new Set(channels.map(c => c.genre).filter(Boolean))], [channels]);
  const filteredChannels = useMemo(() => {
    return channels.filter(c => (c.title || "").toLowerCase().includes(searchTerm.toLowerCase()) && (searchTerm ? true : c.genre === activeCategory));
  }, [channels, searchTerm, activeCategory]);

  return (
    <div className="h-screen bg-[#050505] text-white flex flex-col overflow-hidden font-sans">
      <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />

      {/* HEADER ADAPTABLE */}
      <header className="h-16 md:h-20 bg-black border-b border-white/10 flex items-center justify-between px-4 md:px-8 shrink-0 z-50">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-zinc-600"><ArrowLeft size={24} /></Link>
          <img src={logoFabulosa} alt="Logo" className="h-7 md:h-10 object-contain" />
          {isAdmin && (
            <button onClick={() => setEditMode(!editMode)} className={`hidden sm:block px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${editMode ? 'bg-red-600' : 'bg-zinc-800'}`}>
              {editMode ? 'SALIR' : 'EDITOR'}
            </button>
          )}
        </div>

        {editMode && <button onClick={saveToDisk} className="bg-green-600 px-4 py-2 rounded-full text-[10px] font-black uppercase">GUARDAR</button>}

        <div className="relative w-40 sm:w-64">
          <input 
            type="text" placeholder="BUSCAR..." value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full bg-zinc-900 rounded-full py-2 px-4 pl-10 text-[10px] outline-none focus:ring-1 focus:ring-red-600" 
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
        </div>
      </header>

      {/* REPRODUCTOR CON BOTONES */}
      <section className="relative w-full bg-black group" style={{ height: '30vh', minHeight: '220px' }}>
        <video ref={videoRef} className="h-full w-full object-contain" autoPlay muted={isMuted} playsInline />
        
        {/* Capa de controles sobre el video */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={togglePlay}>{isPlaying ? <Pause size={24}/> : <Play size={24}/>}</button>
              <button onClick={() => setIsMuted(!isMuted)}>{isMuted ? <VolumeX size={24} className="text-red-600"/> : <Volume2 size={24}/>}</button>
            </div>
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-black uppercase italic tracking-widest hidden sm:block">{currentChannel?.title}</span>
               <button onClick={toggleFullScreen}><Maximize size={24}/></button>
            </div>
          </div>
        </div>

        {isLoading && <div className="absolute inset-0 bg-black flex items-center justify-center"><Loader2 className="animate-spin text-red-600" size={40} /></div>}
        
        {/* Aviso de audio para móvil */}
        {isMuted && !isLoading && (
          <div className="absolute top-4 right-4 bg-red-600 px-3 py-1 rounded-full text-[8px] font-black animate-pulse sm:hidden">
            TOCA PARA AUDIO 🔊
          </div>
        )}
      </section>

      {/* CUERPO PRINCIPAL: Sidebar en PC / Topbar en Móvil */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        
        {/* CATEGORÍAS: Ahora se adaptan al móvil */}
        <aside className="w-full md:w-64 bg-zinc-950 border-b md:border-b-0 md:border-r border-white/5 overflow-x-auto md:overflow-y-auto flex md:flex-col shrink-0 no-scrollbar">
          <p className="hidden md:block px-8 pt-6 text-[9px] font-black text-zinc-700 uppercase tracking-widest mb-4">Categorías</p>
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => { setActiveCategory(cat); setSearchTerm(""); }} 
              className={`whitespace-nowrap md:whitespace-normal px-6 py-4 text-[10px] md:text-[11px] font-black uppercase transition-all ${activeCategory === cat ? 'bg-red-600 text-white' : 'text-zinc-600 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </aside>

        {/* GRILLA DE CANALES: Ajustada para móviles (2 columnas) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-6">
            {filteredChannels.map((channel) => (
              <div 
                key={channel.id} 
                onClick={() => setCurrentChannel(channel)}
                className={`group relative aspect-video bg-zinc-900 rounded-xl md:rounded-[2rem] overflow-hidden cursor-pointer border-2 transition-all ${currentChannel.id === channel.id ? 'border-red-600' : 'border-transparent'}`}
              >
                <img 
                  src={channel.logo || "/fabulosa.jpg"} 
                  className="w-full h-full object-cover" 
                  onError={(e)=>e.target.src="/fabulosa.jpg"} 
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black p-2 md:p-4">
                  <p className="text-[8px] md:text-[10px] font-black uppercase italic truncate">{channel.title}</p>
                </div>

                {editMode && (
                  <div className="absolute inset-0 bg-black/90 flex flex-col p-2 justify-center gap-2 opacity-0 group-hover:opacity-100 z-10">
                    <button onClick={(e) => { e.stopPropagation(); setUploadingFor(channel.id); fileInputRef.current.click(); }} className="bg-blue-600 py-1 rounded text-[8px] font-black">LOGO</button>
                    <select 
                      value={channel.genre}
                      onClick={(e)=>e.stopPropagation()}
                      onChange={(e) => { e.stopPropagation(); setChannels(channels.map(c => c.id === channel.id ? {...c, genre: e.target.value} : c)); }}
                      className="bg-zinc-800 text-[8px] font-black p-1 rounded uppercase"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="flex gap-1">
                       <button onClick={(e) => { e.stopPropagation(); setChannels(channels.filter(c => c.id !== channel.id)); }} className="flex-1 bg-red-600 py-1 rounded text-[8px]">X</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Channels;