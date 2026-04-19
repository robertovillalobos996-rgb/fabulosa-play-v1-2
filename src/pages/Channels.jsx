// 🔥 CÓDIGO SAGRADO REPARADO PARA VERCEL 🔥

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, ListFilter, LayoutGrid, X, Tv, Crown } from 'lucide-react';

// 🔥 LA SOLUCIÓN AL ERROR: Ruta corregida incluyendo la carpeta /data/ 🔥
import { canalesTV } from "../data/canales_finales.js"; 

const Channels = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");

  // Generar filtros únicos basados en 'genre'
  const filters = ["Todos", ...new Set(canalesTV.map(canal => canal.genre).filter(Boolean))];

  // Lógica de filtrado y búsqueda
  const filteredChannels = canalesTV.filter(canal => {
    if (!canal) return false;
    const titleMatch = canal.title ? canal.title.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    // Si no tiene title, buscamos por name (por si acaso)
    const nameMatch = canal.name ? canal.name.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const filterMatch = activeFilter === "Todos" || (canal.genre === activeFilter);
    return (titleMatch || nameMatch) && filterMatch;
  });

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden relative">
      
      {/* 🎬 FONDO DE VIDEO YOUTUBE */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden scale-110">
        <iframe 
          className="w-full h-full object-cover"
          src="https://www.youtube.com/embed/JQczw3V7St8?autoplay=1&mute=1&loop=1&playlist=JQczw3V7St8&controls=0&modestbranding=1&rel=0"
          frameBorder="0" allow="autoplay; encrypted-media"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <nav className="relative z-50 p-6 flex items-center justify-between border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0">
        <div className="flex items-center gap-3">
            <Tv className="text-yellow-500" size={28} />
            <h1 className="text-2xl font-black uppercase tracking-widest text-white drop-shadow-lg">Fabulosa TV Directo</h1>
        </div>
        <div className="px-4 py-1 bg-yellow-500 text-black text-[10px] font-black rounded-full animate-pulse">
            LIVE 24/7
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-12">
        {/* Barra de Búsqueda */}
        <div className="bg-zinc-900 rounded-3xl p-6 border border-white/10 mb-8 shadow-2xl backdrop-blur-md relative z-10">
            <div className="flex items-center gap-4 border border-white/10 rounded-full px-5 py-3 bg-black/40 mb-6">
                <Search className="text-gray-500" size={20} />
                <input 
                    type="text" 
                    placeholder="Buscar entre los 900+ canales..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent text-white focus:outline-none text-sm"
                />
            </div>
            
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {filters.map(filter => (
                    <button 
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-5 py-2 rounded-full font-bold text-xs uppercase transition-colors whitespace-nowrap ${
                            activeFilter === filter ? 'bg-yellow-500 text-black shadow-lg' : 'bg-white/5 hover:bg-white/10'
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>
        </div>

        {/* GRID DE CANALES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
                {filteredChannels.map((canal) => {
                    // Si es el VIP o el principal de Fabulosa
                    const isVip = canal.id === 'fabulosa-tv-vip' || canal.id === 'fabulosa-tv';

                    return (
                        <motion.div 
                            key={canal.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            whileHover={{ scale: 1.05 }}
                            className={`p-6 rounded-[2rem] border border-white/10 shadow-2xl backdrop-blur-md flex flex-col group relative overflow-hidden ${isVip ? 'bg-gradient-to-br from-yellow-600/20 to-black' : 'bg-zinc-900/90'}`}
                        >
                            {isVip && (
                                <div className="absolute top-4 right-4 bg-yellow-500 text-black p-1 px-2 rounded-lg flex items-center gap-1 text-[9px] font-black uppercase z-20">
                                    <Crown size={12} /> VIP
                                </div>
                            )}

                            <div className="flex items-center gap-5 mb-5 relative z-10">
                                <img 
                                    src={canal.logo || canal.image || '/img/fabulosa.jpg'} 
                                    alt={canal.title} 
                                    className="w-20 h-20 object-contain rounded-2xl bg-black border border-white/10 p-2 shadow-xl" 
                                />
                                <div className="flex-1">
                                    <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-yellow-500 transition-colors">
                                        {canal.title || canal.name}
                                    </h3>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full mt-1.5 inline-block">
                                        {canal.genre || 'Costa Rica'}
                                    </span>
                                </div>
                            </div>

                            <Link 
                                to={`/canales-tv/${canal.id}`} 
                                className="mt-auto w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black rounded-full font-black uppercase text-xs text-center flex items-center justify-center gap-2 transition-all shadow-xl shadow-yellow-500/20"
                            >
                                <Play size={16} fill="black" /> Ver Señal
                            </Link>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Channels;