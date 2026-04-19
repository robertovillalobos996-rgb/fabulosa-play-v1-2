import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Pause, Search, Tv, Volume2, VolumeX, Maximize, Settings, ShieldCheck, Loader2, Plus } from "lucide-react";
import Hls from "hls.js";

// IMPORTACIÓN DE TU BASE DE DATOS
import { canalesTV } from "../data/canales_finales.js";

const Channels = () => {
  // === 💰 LOGICA DE PUBLICIDAD ===
  const ADSENSE_SLOT = "7869741603";
  const [displayLimit, setDisplayLimit] = useState(30); 
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Costa Rica");

  const [channels] = useState(canalesTV || []);
  const [currentChannel, setCurrentChannel] = useState(
    canalesTV.find(c => c.genre === "Costa Rica") || canalesTV[0]
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  // === 🖥️ REPRODUCTOR HLS ENGINE ===
  useEffect(() => {
    if (!currentChannel?.url || !videoRef.current) return;
    setIsLoading(true);
    if (hlsRef.current) hlsRef.current.destroy();

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(currentChannel.url);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        if (isPlaying) videoRef.current.play().catch(() => {});
      });
      hlsRef.current = hls;
    }
  }, [currentChannel]);

  // === 🔍 FILTRADO BLINDADO (Aquí arreglamos el toUpperCase) ===
  const categories = useMemo(() => {
    const caps = new Set(channels.map(c => c.genre).filter(Boolean));
    return ["Todos", ...caps];
  }, [channels]);

  const filteredChannels = useMemo(() => {
    return channels.filter(c => {
      // Usamos optional chaining (?.) y valores por defecto para que no explote
      const title = (c.title || c.name || "").toLowerCase();
      const search = searchTerm.toLowerCase();
      const matchesSearch = title.includes(search);
      const matchesCategory = activeCategory === "Todos" || c.genre === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [channels, searchTerm, activeCategory]);

  const handleChannelSelect = (channel) => {
    setCurrentChannel(channel);
    setIsPlaying(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-white/10 rounded-full"><ArrowLeft size={24} /></Link>
          <h1 className="text-xl font-black uppercase italic">Fabulosa<span className="text-red-600">Play</span></h1>
        </div>
        <div className="flex-1 max-w-xl mx-12 hidden md:block">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar canal..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-red-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-4 lg:p-8">
        {/* REPRODUCTOR */}
        <div className="aspect-video bg-black rounded-[2.5rem] overflow-hidden border border-white/5 relative mb-8">
          {isLoading && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="animate-spin text-red-600" size={40} /></div>}
          <video ref={videoRef} className="w-full h-full object-contain" onClick={() => setIsPlaying(!isPlaying)} />
        </div>

        {/* CATEGORIAS */}
        <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => { setActiveCategory(cat); setDisplayLimit(30); }}
              className={`px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest transition-all border ${
                activeCategory === cat ? 'bg-red-600 border-red-600' : 'bg-white/5 border-white/10 text-gray-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* GRID DE CANALES (Diseño de tu imagen) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredChannels.slice(0, displayLimit).map((channel) => (
            <div 
              key={channel.id}
              onClick={() => handleChannelSelect(channel)}
              className={`group bg-white/5 rounded-3xl p-4 border transition-all cursor-pointer hover:bg-white/10 ${
                currentChannel?.id === channel.id ? 'border-red-600 bg-red-600/5' : 'border-white/10'
              }`}
            >
              <div className="aspect-square bg-black rounded-2xl p-4 mb-4 flex items-center justify-center relative overflow-hidden">
                <img src={channel.logo || "/img/fabulosa.jpg"} className="max-h-full object-contain z-10 group-hover:scale-110 transition-transform" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {/* Blindaje para el texto: si no hay title, no falla */}
              <h4 className="font-black text-[10px] uppercase truncate text-center italic">
                {(channel.title || channel.name || "Sin Nombre").toUpperCase()}
              </h4>
            </div>
          ))}
        </div>

        {filteredChannels.length > displayLimit && (
          <div className="flex justify-center py-12">
            <button onClick={() => setDisplayLimit(prev => prev + 40)} className="bg-red-600 px-10 py-4 rounded-full font-black uppercase text-xs">
              <Plus size={18} className="inline mr-2" /> Cargar más
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Channels;