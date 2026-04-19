// 🔥 CÓDIGO SAGRADO BLINDADO Y REPARADO: NO QUITAR NADA NI TOCAR LÓGICA 24/7 🔥

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, ListFilter, LayoutGrid, X, Tv, Crown } from 'lucide-react';

// 🔥 RUTA CORREGIDA PARA VERCEL 🔥
import canalesTV from "../canales_finales"; 

const Channels = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [viewMode, setViewMode] = useState("grid"); // grid / list

  // Generar filtros únicos basados en 'genre' (usamos la base de datos completa)
  const filters = ["Todos", ...new Set(canalesTV.map(canal => canal.genre).filter(Boolean))];

  // Lógica de filtrado y búsqueda
  const filteredChannels = canalesTV.filter(canal => {
    if (!canal) return false;
    // Buscamos por title (como está en la DB)
    const titleMatch = canal.title ? canal.title.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const filterMatch = activeFilter === "Todos" || (canal.genre === activeFilter);
    return titleMatch && filterMatch;
  });

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden relative">
      
      {/* 🎬 FONDO DE VIDEO YOUTUBE DE FONDO (Loop Infinito, Máxima Resolución) */}
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
        <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full font-black uppercase text-xs shadow-lg">
            Guía de Programación
        </button>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-12">
        {/* Barra de Búsqueda y Filtros */}
        <div className="bg-zinc-900 rounded-3xl p-6 border border-white/10 mb-8 shadow-2xl backdrop-blur-md relative z-10">
            <div className="flex items-center gap-4 border border-white/10 rounded-full px-5 py-3 bg-black/40 mb-6">
                <Search className="text-gray-500" size={20} />
                <input 
                    type="text" 
                    placeholder="Buscar canal, emisora o género..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent text-white focus:outline-none text-sm"
                />
            }
            
            <div className="flex items-center justify-between gap-4">
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
        </div>

        {/* --- 🔥 AQUÍ ESTÁ LA CIRUGÍA MAYOR REPARADA --- */}
        {/* Mantenemos el mapeo de filteredChannels, que usa la DB sagrada */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
                {filteredChannels.map((canal) => {
                    
                    // --- 🔥 CASO ESPECIAL: CANAL FABULOSA NORMAL ---
                    // Detectamos el ID normal 'fabulosa-tv' desde la DB
                    if (canal.id === 'fabulosa-tv') {
                        // Renderizamos la card especial COMPLETA, UNCOMMENTED Y CORREGIDA.
                        // Esta card se ve igual que la VIP, pero carga la señal VMix y apunta al reproductor VIP blindado.
                        return (
                            <motion.div 
                                key={canal.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                whileHover={{ scale: 1.05 }}
                                className="col-span-1 md:col-span-2 lg:col-span-3 relative group overflow-hidden rounded-[2rem]"
                            >
                                {/* --- IMPLANTACIÓN VIP SAGRADA (Uncommented y Arreglada) --- */}
                                <div className="relative w-full aspect-[21/9] rounded-[2rem] overflow-hidden bg-black/80 border border-white/10 shadow-2xl backdrop-blur-md flex group relative">
                                    {/* 🎬 FONDO DE VIDEO YOUTUBE INTERNO (Loop Infinito) */}
                                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden scale-110">
                                        <iframe className="w-full h-full object-cover" src="https://www.youtube.com/embed/JQczw3V7St8?autoplay=1&mute=1&loop=1&playlist=JQczw3V7St8&controls=0&modestbranding=1&rel=0" frameBorder="0" allow="autoplay; encrypted-media" />
                                        <div className="absolute inset-0 bg-black/70 group-hover:bg-black/50 transition-colors" />
                                    </div>

                                    {/* Logo Fabulosa Gigante (Usamos canal.logo de la DB) */}
                                    <div className="relative z-10 p-8 flex-1 flex items-center gap-6">
                                        <img src={canal.logo} alt={canal.title} className="w-32 h-32 object-contain rounded-3xl bg-black border border-white/10 p-4 drop-shadow-2xl" />
                                        <div className="flex-1">
                                            {/* Badge VIP (Mismo diseño sagrado) */}
                                            <div className="absolute top-4 right-4 bg-yellow-500/10 border border-yellow-500/30 p-2 rounded-xl flex items-center gap-2 text-yellow-500 text-[9px] font-black uppercase tracking-widest backdrop-blur-sm z-20 shadow-inner">
                                                <Crown size={12} className="text-yellow-500 animate-pulse" /> VIP
                                            </div>
                                            <h2 className="text-3xl font-black uppercase tracking-widest text-white group-hover:text-yellow-500 transition-colors drop-shadow-2xl">Fabulosa TV Directo</h2>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full mt-1.5 inline-block">{canal.genre || 'Costa Rica'}</span>
                                        </div>
                                    </div>

                                    {/* LÓGICA DE MEZCLA Y VOCES: El mixer 24/7 está blindado en PlayChannel.jsx, no aquí. */}
                                    {/* Esta card solo apunta a /canales-tv/fabulosa-tv, que activa el reproductor blindado. */}
                                    <Link to={`/canales-tv/${canal.id}`} className="absolute inset-0 z-20"></Link>
                                    
                                    <div className="p-4 border-l border-white/10 flex items-center justify-center relative z-10">
                                        <button className="p-4 bg-yellow-500 rounded-full text-black hover:scale-110 transition-transform shadow-xl group-hover:bg-yellow-400">
                                            <Tv size={24} />
                                        </button>
                                    </div>
                                </div>
                                {/* --- FIN DE LA IMPLANTACIÓN VIP SAGRADA --- */}
                            </motion.div>
                        );
                    }

                    // --- 🔥 CASO NORMAL: RESTO DE CANALES ---
                    // Usamos propiedades estandarizadas (canal.title, canal.logo, canal.id)
                    return (
                        <motion.div 
                            key={canal.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ scale: 1.05 }}
                            className="bg-gradient-to-br from-zinc-900/90 to-black p-6 rounded-[2rem] border border-white/10 shadow-2xl backdrop-blur-md flex flex-col group relative overflow-hidden"
                        >
                            <div className="flex items-center gap-5 mb-5 relative z-10">
                                {/* Usamos canal.logo (Stándar sagrado) */}
                                <img src={canal.logo} alt={canal.title} className="w-20 h-20 object-contain rounded-2xl bg-black border border-white/10 p-2 drop-shadow-xl" />
                                <div className="flex-1">
                                    {/* Usamos canal.title (Stándar sagrado) */}
                                    <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-yellow-500 transition-colors drop-shadow">{canal.title}</h3>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full mt-1.5 inline-block">{canal.genre || 'Costa Rica'}</span>
                                </div>
                            </div>

                            {/* Enlace para reproducir usando canal.id (Stándar sagrado) */}
                            <Link to={`/canales-tv/${canal.id}`} className="mt-auto w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black rounded-full font-black uppercase text-xs text-center flex items-center justify-center gap-2 group-hover:scale-105 transition-all shadow-xl shadow-yellow-500/20">
                                Ver Señal en Directo
                            </Link>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
        {/* --- 🔥 FIN DE LA CIRUGÍA MAYOR REPARADA --- */}

      </div>
    </div>
  );
};

export default Channels;