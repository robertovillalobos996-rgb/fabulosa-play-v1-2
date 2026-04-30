import React, { useState, useEffect, useRef, useMemo } from "react";
import { Trash2, Save, UploadCloud, Plus, Search, Loader2, Play, Volume2, ChevronDown } from "lucide-react";
import Hls from "hls.js";
// Importación de la base de datos real[cite: 1, 4]
import { canalesTV as initialCanales } from "./data/canales_finales.js";

const AdminPanel = () => {
  const [channels, setChannels] = useState(initialCanales || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [currentChannel, setCurrentChannel] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  // --- REPRODUCTOR DE PRUEBA (AUDIO Y VIDEO) ---
  useEffect(() => {
    if (!currentChannel?.url) return;
    if (hlsRef.current) hlsRef.current.destroy();
    const video = videoRef.current;
    if (video && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(currentChannel.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
      hlsRef.current = hls;
    }
  }, [currentChannel]);

  // --- LÓGICA DE CATEGORÍAS (DINÁMICA) ---
  const categoriesList = useMemo(() => {
    const list = [...new Set(channels.map((c) => (c.genre || "Varios").trim()))];
    return list.sort();
  }, [channels]);

  const filtered = useMemo(() => {
    return channels.filter((c) => {
      const categoryMatch = activeCategory === "Todos" || (c.genre || "Varios").trim() === activeCategory;
      const searchMatch = (c.name || "").toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [channels, activeCategory, searchTerm]);

  // --- FUNCIONES DE EDICIÓN[cite: 1, 4] ---
  const updateChannel = (id, field, value) => {
    setChannels(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleLogoUpload = async (id, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Data = reader.result.split(',')[1];
      const fileName = `${Date.now()}_logo.png`;
      try {
        const res = await fetch('http://localhost:3001/upload-logo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName, base64Data })
        });
        const data = await res.json();
        if (res.ok) updateChannel(id, 'logo', data.path);
      } catch (err) { alert("Error: Encienda el bridge.js"); }
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
      if (res.ok) alert("✅ CAMBIOS GUARDADOS EN EL DISCO DURO");
    } catch (err) { alert("❌ Terminal 1 (bridge.js) apagada"); }
    finally { setIsSaving(false); }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col lg:flex-row overflow-hidden">
      
      {/* MONITOR FIJO (IZQUIERDA) */}
      <div className="lg:w-[380px] w-full bg-[#0a0a0a] border-r border-white/10 p-6 flex flex-col gap-6 shrink-0 h-screen overflow-y-auto">
        <h1 className="text-2xl font-black italic text-red-600 uppercase italic">Fabulosa Admin</h1>
        
        <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl">
          <video ref={videoRef} controls className="w-full h-full object-contain" />
          {!currentChannel && <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black uppercase text-gray-700 text-center p-6">Toque un canal a la derecha para probar audio</div>}
        </div>

        <div className="bg-red-600 p-4 rounded-2xl shadow-lg">
          <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">En Monitor:</p>
          <p className="font-black text-lg uppercase truncate">{currentChannel?.name || "Sin selección"}</p>
        </div>

        <button onClick={saveToDisk} disabled={isSaving} className="w-full bg-white text-black py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-red-600 hover:text-white transition-all shadow-xl">
          {isSaving ? <Loader2 className="animate-spin"/> : <Save size={24}/>} 
          GUARDAR TODO
        </button>

        <p className="text-[9px] text-gray-500 leading-tight italic">
          * Al cambiar de categoría, el canal se moverá de "pestaña". Selecciónela arriba para volver a verlo.[cite: 4]
        </p>
      </div>

      {/* ÁREA DE TRABAJO (DERECHA)[cite: 4] */}
      <div className="flex-1 p-6 lg:p-10 overflow-y-auto h-screen bg-film-grain relative">
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input type="text" placeholder="BUSCAR CANAL..." className="w-full bg-white/5 border border-white/10 p-4 pl-14 rounded-2xl outline-none focus:border-red-600 font-bold" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <button onClick={() => setChannels([{id: Date.now(), name: "NUEVO CANAL", genre: "Varios", url: "", logo: "/logos_canales/default.png"}, ...channels])} className="bg-red-600 px-8 py-4 rounded-2xl font-black shadow-lg shadow-red-600/20">+ AGREGAR</button>
        </div>

        {/* SELECTOR DE CATEGORÍAS (TABS)[cite: 4] */}
        <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar">
          <button onClick={() => setActiveCategory("Todos")} className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase transition-all shrink-0 ${activeCategory === "Todos" ? 'bg-red-600' : 'bg-white/5 text-gray-500'}`}>Todos</button>
          {categoriesList.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase transition-all shrink-0 ${activeCategory === cat ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-500'}`}>{cat}</button>
          ))}
        </div>

        {/* TARJETAS DE TRABAJO[cite: 4] */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
          {filtered.map(ch => (
            <div key={ch.id} className={`bg-[#111] p-5 rounded-[2.5rem] border-2 transition-all relative ${currentChannel?.id === ch.id ? 'border-red-600 bg-[#161616]' : 'border-white/5'}`}>
              
              <button onClick={() => setChannels(channels.filter(c => c.id !== ch.id))} className="absolute -top-2 -right-2 bg-red-600 p-2.5 rounded-full z-10 shadow-xl hover:scale-110 text-white"><Trash2 size={16}/></button>

              <div className="flex gap-4 items-start">
                <div className="relative w-28 h-28 bg-white rounded-3xl p-3 shrink-0 group cursor-pointer overflow-hidden" onClick={() => setCurrentChannel(ch)}>
                  <img src={ch.logo} className="w-full h-full object-contain" />
                  <label className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white p-2 text-center">
                    <UploadCloud size={20}/>
                    <span className="text-[8px] font-black mt-1 uppercase">Cambiar Logo</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleLogoUpload(ch.id, e.target.files[0])} />
                  </label>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black uppercase text-gray-500 ml-2">Nombre</span>
                    <input className="w-full bg-black border border-white/10 p-2.5 rounded-xl text-xs font-black uppercase outline-none focus:border-red-600" value={ch.name || ""} onChange={e => updateChannel(ch.id, 'name', e.target.value)} />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[8px] font-black uppercase text-red-900 ml-2">Categoría</span>
                    <div className="relative">
                      <select 
                        className="w-full bg-black border border-red-900/30 p-2.5 rounded-xl text-[10px] font-black uppercase text-red-500 appearance-none outline-none focus:border-red-600"
                        value={ch.genre || "Varios"}
                        onChange={e => updateChannel(ch.id, 'genre', e.target.value)}
                      >
                        {categoriesList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        <option value="Nueva">+ CREAR NUEVA</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-red-900 pointer-events-none" size={14}/>
                    </div>
                    {/* Si quiere escribir una nueva categoría manual */}
                    <input className="w-full bg-black/50 border border-white/5 mt-1 p-2 rounded-lg text-[9px] text-gray-400 placeholder:italic" placeholder="O escriba categoría nueva..." value={ch.genre || ""} onChange={e => updateChannel(ch.id, 'genre', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-1">
                <span className="text-[8px] font-black uppercase text-gray-500 ml-2">Enlace (URL)</span>
                <input className="w-full bg-black border border-white/10 p-2.5 rounded-xl text-[9px] text-blue-400 font-mono outline-none focus:border-red-600 truncate" value={ch.url || ch.iframe_url || ""} onChange={e => updateChannel(ch.id, 'url', e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx global>{` .no-scrollbar::-webkit-scrollbar { display: none; } `}</style>
    </div>
  );
};

export default AdminPanel;