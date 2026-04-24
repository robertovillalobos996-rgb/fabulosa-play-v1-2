import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Pause, Search, Tv, Volume2, VolumeX, Maximize, Loader2, Trash2, ArrowUp, ArrowDown, Save, Edit3, UploadCloud, ChevronDown } from "lucide-react";
import Hls from "hls.js";

import logoFabulosa from "../assets/logo_fabulosa.png";
import { canalesTV as initialCanales } from "../data/canales_finales.js";

const Channels = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Costa Rica");
  const [channels, setChannels] = useState(initialCanales || []);
  const [currentChannel, setCurrentChannel] = useState(initialCanales[0]);
  const [editMode, setEditMode] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Arranca mudo por regla de Chrome
  const [isLoading, setIsLoading] = useState(true);
  
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const fileInputRef = useRef(null);
  const [uploadingFor, setUploadingFor] = useState(null);

  // --- GESTIÓN DE LOGOS Y CATEGORÍAS ---
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
      } catch (err) { alert("Error al subir"); }
    };
  };

  const saveToDisk = async () => {
    try {
      const res = await fetch('http://localhost:3001/save-channels', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(channels)
      });
      if (res.ok) alert("✅ ¡DATOS GUARDADOS FÍSICAMENTE!");
    } catch (err) { alert("❌ Puente inactivo."); }
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
      });
      hlsRef.current = hls;
    }
  }, [currentChannel]);

  const categories = useMemo(() => [...new Set(channels.map(c => c.genre).filter(Boolean))], [channels]);
  const filteredChannels = useMemo(() => {
    return channels.filter(c => (c.title || "").toLowerCase().includes(searchTerm.toLowerCase()) && (searchTerm ? true : c.genre === activeCategory));
  }, [channels, searchTerm, activeCategory]);

  return (
    <div className="h-screen bg-[#050505] text-white flex flex-col overflow-hidden">
      <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />

      <header className="h-20 bg-black border-b border-white/10 flex items-center justify-between px-8 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-zinc-600"><ArrowLeft size={24} /></Link>
          <img src={logoFabulosa} alt="Logo" className="h-10 object-contain" />
          <button onClick={() => setEditMode(!editMode)} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase ${editMode ? 'bg-red-600' : 'bg-zinc-800'}`}>
            {editMode ? 'SALIR DEL EDITOR' : 'MODO EDITOR'}
          </button>
        </div>
        {editMode && <button onClick={saveToDisk} className="bg-green-600 px-10 py-3 rounded-full text-xs font-black uppercase shadow-lg shadow-green-900/20">GUARDAR TODO</button>}
        <div className="relative w-64">
          <input type="text" placeholder="BUSCAR..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-zinc-900 rounded-full py-2.5 px-6 text-xs outline-none" />
        </div>
      </header>

      {/* ÁREA DE VIDEO - CON CONTROL DE AUDIO */}
      <section className="relative w-full bg-black flex items-center justify-center border-b border-white/5" style={{ height: '40vh' }}>
        <video 
          ref={videoRef} 
          className="h-full w-full object-contain cursor-pointer" 
          autoPlay 
          muted={isMuted}
          onClick={() => setIsMuted(!isMuted)} 
        />
        {isMuted && (
          <div className="absolute top-4 right-4 bg-red-600 px-3 py-1 rounded-full text-[10px] font-black animate-pulse">
            TOQUE EL VIDEO PARA ACTIVAR AUDIO 🔊
          </div>
        )}
        {isLoading && <div className="absolute inset-0 bg-black flex items-center justify-center"><Loader2 className="animate-spin text-red-600" size={40} /></div>}
      </section>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-black border-r border-white/5 overflow-y-auto shrink-0 py-6">
          {categories.map(cat => (
            <button key={cat} onClick={() => { setActiveCategory(cat); setSearchTerm(""); }} className={`w-full text-left px-8 py-4 text-[11px] font-black uppercase transition-all ${activeCategory === cat ? 'bg-red-600 text-white' : 'text-zinc-600 hover:bg-zinc-900'}`}>{cat}</button>
          ))}
        </aside>

        <main className="flex-1 overflow-y-auto p-6 bg-zinc-900/5 custom-scrollbar">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredChannels.map((channel) => (
              <div 
                key={channel.id} 
                onClick={() => setCurrentChannel(channel)}
                className={`group relative aspect-video bg-zinc-900 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${currentChannel.id === channel.id ? 'border-red-600 scale-95 shadow-[0_0_20px_rgba(220,38,38,0.3)]' : 'border-transparent hover:border-white/20'}`}
              >
                {/* IMAGEN TOTAL: Cubre cada centímetro */}
                <img 
                  src={channel.logo || "/fabulosa.jpg"} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  onError={(e)=>e.target.src="/fabulosa.jpg"} 
                />
                
                {/* Degradado inferior para que el texto se lea */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4">
                  <p className="text-[10px] font-black uppercase italic tracking-wider truncate">{channel.title}</p>
                </div>

                {/* MENÚ DE EDICIÓN FLOTANTE */}
                {editMode && (
                  <div className="absolute inset-0 bg-black/90 flex flex-col p-4 justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
                    <button onClick={(e) => { e.stopPropagation(); setUploadingFor(channel.id); fileInputRef.current.click(); }} className="bg-blue-600 p-2 rounded-lg text-[9px] font-black uppercase">CAMBIAR LOGO</button>
                    <select 
                      value={channel.genre}
                      onClick={(e)=>e.stopPropagation()}
                      onChange={(e) => { e.stopPropagation(); setChannels(channels.map(c => c.id === channel.id ? {...c, genre: e.target.value} : c)); }}
                      className="bg-zinc-800 text-[9px] font-black p-2 rounded-lg outline-none border border-white/10 uppercase"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="flex gap-1 mt-1">
                      <button onClick={(e) => { e.stopPropagation(); setChannels(channels.filter(c => c.id !== channel.id)); }} className="flex-1 bg-red-600 p-2 rounded-lg"><Trash2 size={14} className="mx-auto"/></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Channels;