import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Play, Pause, Volume2, Loader2, Trash2, UploadCloud, Save, Rocket, X, Edit3, CheckCircle } from "lucide-react";
import Hls from "hls.js";

import logoFabulosa from "../assets/logo_fabulosa.png";
import { canalesTV as initialCanales } from "../data/canales_finales.js";

const Channels = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  
  // 🛡️ ÚNICA FUENTE DE VERDAD
  const [channels, setChannels] = useState(initialCanales);
  const [currentChannel, setCurrentChannel] = useState(initialCanales[0]);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  const isAdmin = new URLSearchParams(window.location.search).get("admin") === "fabulosa";

  // Categorías basadas en la lista actual en memoria
  const categories = useMemo(() => {
    return ["Todos", ...new Set(channels.map((c) => c.genre || "Varios"))];
  }, [channels]);

  // Canales filtrados para la grilla
  const filteredChannels = useMemo(() => {
    return channels.filter((c) => {
      const matchCat = activeCategory === "Todos" || c.genre === activeCategory;
      const nombre = c.name || ""; 
      return matchCat && nombre.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [channels, activeCategory, searchTerm]);

  // --- 🛠️ MOTOR DE ADMINISTRACIÓN (BLINDADO) ---

  // Función maestra para actualizar sin perder datos
  const patchChannel = (fields) => {
    setChannels(prev => {
      const updated = prev.map(c => 
        c.id === currentChannel.id ? { ...c, ...fields } : c
      );
      // Actualizamos el canal activo para que el panel refleje el cambio
      setCurrentChannel(updated.find(c => c.id === currentChannel.id));
      return updated;
    });
  };

  const deleteChannel = () => {
    if (!window.confirm(`¿BORRAR DEFINITIVAMENTE: ${currentChannel.name}?`)) return;
    
    const idToDelete = currentChannel.id;
    setChannels(prev => {
      const remaining = prev.filter(c => c.id !== idToDelete);
      // Cambiamos al primer canal de la lista para no quedar en el vacío
      if (remaining.length > 0) setCurrentChannel(remaining[0]);
      return remaining;
    });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Data = reader.result.split(',')[1];
      const fileName = file.name.replace(/\s/g, '_'); 
      try {
        const res = await fetch('http://localhost:3001/upload-logo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName, base64Data })
        });
        if (res.ok) {
          // ESTAMPADO INMEDIATO
          patchChannel({ logo: `/logos_canales/${fileName}` });
        }
      } catch (err) { alert("ERROR: ¿Inició bridge.js?"); }
    };
  };

  const saveToDisk = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('http://localhost:3001/save-channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(channels)
      });
      if (res.ok) {
        alert("✅ LISTA DEFINITIVA GUARDADA. Ya puede cerrar o refrescar.");
      }
    } catch (e) { alert("Error al conectar con bridge.js"); }
    setIsSaving(false);
  };

  // MOTOR HLS
  useEffect(() => {
    if (!currentChannel?.url) return;
    setIsLoading(true);
    if (hlsRef.current) hlsRef.current.destroy();
    const video = videoRef.current;
    if (Hls.isSupported()) {
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
    <div className="flex h-screen w-full bg-black text-white font-sans overflow-hidden">
      
      {/* 1. SIDEBAR CATEGORÍAS */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col py-6 shrink-0 overflow-y-auto no-scrollbar">
        <div className="px-8 mb-8"><img src={logoFabulosa} className="h-10 object-contain" /></div>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-8 py-4 flex items-center gap-4 border-l-4 transition-all ${activeCategory === cat ? 'border-red-600 text-red-600 bg-red-600/5' : 'border-transparent text-white/40'}`}
          >
            <span className="text-xs font-black uppercase truncate">{cat}</span>
          </button>
        ))}
      </aside>

      {/* 2. ÁREA DE TRABAJO */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#080808]">
        
        {/* REPRODUCTOR (Arriba) */}
        <section className="h-[40%] bg-black relative shrink-0">
          {isLoading && <div className="absolute inset-0 flex items-center justify-center z-50 bg-black"><Loader2 className="animate-spin text-red-600" size={50} /></div>}
          <video ref={videoRef} className="w-full h-full object-contain" />
          <div className="absolute bottom-4 left-6 bg-black/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
            <h2 className="text-2xl font-black uppercase text-red-600">{currentChannel?.name}</h2>
          </div>
        </section>

        {/* GRILLA DE CANALES (Centro) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 no-scrollbar">
          {filteredChannels.map((channel) => (
            <div
              key={channel.id}
              className={`relative cursor-pointer aspect-square rounded-[2rem] transition-all flex flex-col items-center justify-center p-4 bg-[#121212] border-4 ${currentChannel?.id === channel.id ? 'border-red-600' : 'border-transparent'}`}
              onClick={() => setCurrentChannel(channel)}
            >
              <img src={channel.logo} className="max-w-full max-h-full object-contain" alt="Logo" />
              <div className="absolute -bottom-2 bg-red-600 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase truncate max-w-[90%]">
                {channel.name}
              </div>
            </div>
          ))}
        </div>

        {/* 3. PANEL DE ADMINISTRACIÓN (ABAJO - Fijo) */}
        {isAdmin && (
          <div className="h-44 bg-[#111111] border-t-4 border-red-600 p-6 flex items-center justify-between gap-6 shrink-0 z-[100] shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
            
            {/* Editar Nombre */}
            <div className="flex-1">
              <label className="text-[10px] font-black text-red-600 mb-2 block uppercase italic">Nombre Canal</label>
              <input 
                type="text" value={currentChannel?.name || ""} 
                onChange={e => patchChannel({ name: e.target.value })}
                className="w-full bg-black border border-white/10 p-4 rounded-2xl text-sm font-black uppercase outline-none focus:border-blue-600"
              />
            </div>

            {/* Cambiar Categoría */}
            <div className="w-64">
              <label className="text-[10px] font-black text-red-600 mb-2 block uppercase italic">Categoría</label>
              <select 
                value={currentChannel?.genre || ""} 
                onChange={e => patchChannel({ genre: e.target.value })}
                className="w-full bg-black border border-white/10 p-4 rounded-2xl text-xs font-black uppercase outline-none"
              >
                {categories.map(c => c !== "Todos" && <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Botón Logo */}
            <label className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-5 rounded-2xl font-black text-[11px] uppercase flex items-center gap-3 cursor-pointer transition-all shadow-xl">
              <UploadCloud size={24}/> ACTUALIZAR LOGO
              <input type="file" className="hidden" onChange={handleLogoUpload} />
            </label>

            {/* Botón Borrar */}
            <button onClick={deleteChannel} className="bg-white/5 border border-red-600/30 text-red-600 p-5 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-xl">
              <Trash2 size={28}/>
            </button>

            {/* GUARDADO FINAL */}
            <button 
              onClick={saveToDisk}
              className={`px-12 py-7 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center gap-3 ${isSaving ? 'bg-green-600' : 'bg-red-600 hover:scale-105 active:scale-95'}`}
            >
              <Save size={28}/> {isSaving ? "GUARDANDO..." : "GUARDAR TODO"}
            </button>
          </div>
        )}
      </main>

      {/* SALIR */}
      <button onClick={() => navigate("/")} className="fixed top-6 right-6 z-[200] bg-white/10 p-3 rounded-full hover:bg-red-600 transition-all shadow-2xl">
        <X size={24}/>
      </button>

    </div>
  );
};

export default Channels;