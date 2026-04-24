import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Tv, Volume2, VolumeX, Maximize, Loader2, Trash2, ArrowUp, ArrowDown, Save, Edit3, UploadCloud, ChevronDown } from "lucide-react";
import Hls from "hls.js";

// IMPORTACIÓN DE TU LOGO Y BASE DE DATOS
import logoFabulosa from "../assets/logo_fabulosa.png";
import { canalesTV as initialCanales } from "../data/canales_finales.js";

const Channels = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Costa Rica");
  const [channels, setChannels] = useState(initialCanales || []);
  const [currentChannel, setCurrentChannel] = useState(initialCanales[0]);
  const [editMode, setEditMode] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Arranca mudo por seguridad del navegador
  const [isLoading, setIsLoading] = useState(true);
  
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const fileInputRef = useRef(null);
  const [uploadingFor, setUploadingFor] = useState(null);

  // --- CANDADO SECRETO PARA ADMIN ---
  const isAdmin = new URLSearchParams(window.location.search).get("admin") === "fabulosa";

  // --- LÓGICA DE GESTIÓN (Logos y Categorías) ---
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
      } catch (err) { alert("Error al conectar con el puente bridge.js"); }
    };
  };

  const saveToDisk = async () => {
    try {
      const res = await fetch('http://localhost:3001/save-channels', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(channels)
      });
      if (res.ok) alert("✅ ¡ARCHIVO ACTUALIZADO CORRECTAMENTE!");
    } catch (err) { alert("❌ El puente bridge.js no está encendido."); }
  };

  const moveChannel = (index, direction) => {
    const newChannels = [...channels];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newChannels.length) return;
    [newChannels[index], newChannels[targetIndex]] = [newChannels[targetIndex], newChannels[index]];
    setChannels(newChannels);
  };

  // --- REPRODUCTOR CON BYPASS ---
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
    return channels.filter(c => 
      (c.title || "").toLowerCase().includes(searchTerm.toLowerCase()) && 
      (searchTerm ? true : c.genre === activeCategory)
    );
  }, [channels, searchTerm, activeCategory]);

  return (
    <div className="h-screen bg-[#050505] text-white flex flex-col overflow-hidden font-sans">
      <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />

      {/* HEADER */}
      <header className="h-20 bg-black border-b border-white/10 flex items-center justify-between px-8 shrink-0 z-50">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-zinc-600 hover:text-white transition-colors"><ArrowLeft size={28} /></Link>
          <img src={logoFabulosa} alt="Logo" className="h-10 object-contain" />
          
          {isAdmin && (
            <button onClick={() => setEditMode(!editMode)} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all ${editMode ? 'bg-red-600 shadow-lg shadow-red-900/40' : 'bg-zinc-800'}`}>
              {editMode ? 'CERRAR EDITOR' : 'MODO EDITOR'}
            </button>
          )}
        </div>

        {editMode && (
          <button onClick={saveToDisk} className="bg-green-600 hover:bg-green-500 px-10 py-3 rounded-full text-xs font-black uppercase shadow-xl active:scale-95 transition-all">
            <Save size={18} className="inline mr-2"/> GUARDAR TODO
          </button>
        )}

        <div className="relative w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
          <input 
            type="text" placeholder="BUSCAR CANAL..." value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full bg-zinc-900 rounded-full py-2.5 pl-12 pr-6 text-xs font-bold outline-none border border-transparent focus:border-red-600 transition-all" 
          />
        </div>
      </header>

      {/* REPRODUCTOR */}
      <section className="relative w-full bg-black flex items-center justify-center border-b border-white/5 shadow-2xl" style={{ height: '40vh' }}>
        <video 
          ref={videoRef} 
          className="h-full w-full object-contain cursor-pointer" 
          autoPlay 
          muted={isMuted}
          onClick={() => setIsMuted(!isMuted)} 
        />
        {isMuted && (
          <div className="absolute top-6 right-6 bg-red-600 px-4 py-2 rounded-full text-[10px] font-black animate-pulse shadow-lg">
            TOQUE EL VIDEO PARA ACTIVAR AUDIO 🔊
          </div>
        )}
        {isLoading && (
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            <Loader2 className="animate-spin text-red-600" size={48} />
          </div>
        )}
      </section>

      {/* CUERPO INFERIOR */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-black border-r border-white/5 overflow-y-auto shrink-0 py-6">
          <p className="px-8 text-[9px] font-black text-zinc-700 uppercase tracking-widest mb-4">Menú de Señales</p>
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => { setActiveCategory(cat); setSearchTerm(""); }} 
              className={`w-full text-left px-8 py-4 text-[11px] font-black uppercase transition-all ${activeCategory === cat ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-600 hover:bg-zinc-900'}`}
            >
              {cat}
            </button>
          ))}
        </aside>

        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {filteredChannels.map((channel) => (
              <div 
                key={channel.id} 
                onClick={() => setCurrentChannel(channel)}
                className={`group relative aspect-video bg-zinc-900 rounded-[2rem] overflow-hidden cursor-pointer border-2 transition-all duration-300 ${currentChannel.id === channel.id ? 'border-red-600 scale-95 shadow-2xl shadow-red-900/20' : 'border-transparent hover:border-white/10'}`}
              >
                {/* IMAGEN TOTAL: Sin bordes, cubre todo el card */}
                <img 
                  src={channel.logo || "/fabulosa.jpg"} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  onError={(e)=>e.target.src="/fabulosa.jpg"} 
                />
                
                {/* Sombra para el texto */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/100 via-black/40 to-transparent p-5">
                  <p className="text-[10px] font-black uppercase italic tracking-widest truncate">{channel.title}</p>
                </div>

                {/* HERRAMIENTAS ADMINISTRADOR */}
                {editMode && (
                  <div className="absolute inset-0 bg-black/95 flex flex-col p-5 justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all z-10 border border-red-600/20">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setUploadingFor(channel.id); fileInputRef.current.click(); }} 
                      className="bg-blue-600 hover:bg-blue-500 p-3 rounded-xl text-[9px] font-black uppercase shadow-lg"
                    >
                      SUBIR LOGO
                    </button>
                    
                    <div className="relative">
                      <select 
                        value={channel.genre}
                        onClick={(e)=>e.stopPropagation()}
                        onChange={(e) => { e.stopPropagation(); setChannels(channels.map(c => c.id === channel.id ? {...c, genre: e.target.value} : c)); }}
                        className="w-full bg-zinc-800 text-[9px] font-black p-3 rounded-xl appearance-none outline-none border border-white/5 uppercase cursor-pointer"
                      >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500" />
                    </div>

                    <div className="flex gap-2 mt-2">
                      <button onClick={(e) => { e.stopPropagation(); moveChannel(channels.indexOf(channel), 'up'); }} className="flex-1 bg-zinc-800 p-2 rounded-xl hover:bg-white hover:text-black"><ArrowUp size={16} className="mx-auto"/></button>
                      <button onClick={(e) => { e.stopPropagation(); moveChannel(channels.indexOf(channel), 'down'); }} className="flex-1 bg-zinc-800 p-2 rounded-xl hover:bg-white hover:text-black"><ArrowDown size={16} className="mx-auto"/></button>
                      <button onClick={(e) => { e.stopPropagation(); setChannels(channels.filter(c => c.id !== channel.id)); }} className="flex-1 bg-red-600 p-2 rounded-xl hover:bg-red-500"><Trash2 size={16} className="mx-auto"/></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
};

export default Channels;