import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Hls from "hls.js";
import { Radio, Activity, ArrowLeft, Clock } from "lucide-react";

import { radiosMundo } from "../data/radios-mundo";
import logoFabulosa from "../assets/logo_fabulosa.png";

const RadiosPlay = () => {
  const navigate = useNavigate();
  const [fecha, setFecha] = useState(new Date());
  const [activeIndex, setActiveIndex] = useState(0); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStation, setCurrentStation] = useState(null);

  const audioRef = useRef(null);
  const hlsRef = useRef(null);
  const scrollRef = useRef(null);

  // 1. Filtrado: Solo Costa Rica (Manteniendo su base de datos)
  const stations = useMemo(() => {
    return radiosMundo.filter(r => r.country === "Costa Rica");
  }, []);

  // Reloj
  useEffect(() => {
    const timer = setInterval(() => setFecha(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Motor de Audio HLS / Standard
  useEffect(() => {
    if (!currentStation) return;
    const audio = audioRef.current;
    setIsPlaying(false);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (currentStation.url.includes(".m3u8") || currentStation.isHls) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(currentStation.url);
        hls.attachMedia(audio);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          audio.play();
          setIsPlaying(true);
        });
        hlsRef.current = hls;
      }
    } else {
      audio.src = currentStation.url;
      audio.play();
      setIsPlaying(true);
    }
  }, [currentStation]);

  // Control Remoto y Teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      const cols = window.innerWidth < 640 ? 2 : window.innerWidth < 1024 ? 4 : 6;
      
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev + 1) % (stations.length + 1));
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev - 1 + (stations.length + 1)) % (stations.length + 1));
      } else if (e.key === 'ArrowDown') {
        setActiveIndex((prev) => Math.min(prev + cols, stations.length));
      } else if (e.key === 'ArrowUp') {
        setActiveIndex((prev) => Math.max(prev - cols, -1));
      } else if (e.key === 'Enter') {
        if (activeIndex === -1) navigate('/');
        else setCurrentStation(stations[activeIndex]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, stations, navigate]);

  return (
    <div className="relative w-full h-screen bg-[#050505] text-white font-sans overflow-hidden">
      
      {/* Fondo con Blur dinámico basado en la radio actual */}
      <div 
        className="absolute inset-0 transition-all duration-1000 opacity-20 scale-110"
        style={{ 
          backgroundImage: `url(${currentStation?.logo || '/bg_default.webp'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(80px)'
        }}
      />

      <audio ref={audioRef} />

      {/* Header Info (Igual al Home) */}
      <header className="relative z-50 p-6 md:p-10 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-4 md:gap-8">
            <button 
                onClick={() => navigate('/')}
                className={`p-3 rounded-full transition-all ${activeIndex === -1 ? 'bg-cyan-400 text-black scale-110' : 'bg-white/5 text-white'}`}
            >
                <ArrowLeft size={24} />
            </button>
            <img src={logoFabulosa} className="h-8 md:h-12 object-contain" alt="Logo" />
        </div>

        <div className="flex items-center gap-4 bg-black/40 px-6 py-2 rounded-2xl border border-white/5 backdrop-blur-md">
            <Clock size={20} className="text-cyan-400" />
            <span className="text-lg md:text-2xl font-black italic tracking-tighter">
                {fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
            </span>
        </div>
      </header>

      {/* Reproductor en Vivo (Barra Superior) */}
      <div className="relative z-50 px-6 md:px-10 mb-6">
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-4 md:p-6 backdrop-blur-xl flex items-center justify-between shadow-2xl">
           <div className="flex items-center gap-4 md:gap-6">
              <div className={`w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl p-2 transition-transform duration-500 ${isPlaying ? 'scale-105 shadow-[0_0_30px_rgba(34,211,238,0.4)]' : 'opacity-50'}`}>
                <img src={currentStation?.logo || logoFabulosa} className="w-full h-full object-contain" alt="Logo Station" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs font-black text-cyan-400 uppercase tracking-[0.2em] mb-1">
                    {isPlaying ? 'Escuchando en Vivo' : 'Seleccione una Emisora'}
                </p>
                <h1 className="text-xl md:text-3xl font-black uppercase truncate max-w-[200px] md:max-w-md italic">
                    {currentStation?.title || 'Fabulosa Radios'}
                </h1>
              </div>
           </div>
           {isPlaying && (
              <div className="flex items-center gap-1 h-8 px-4">
                {[1,2,3,4].map(i => (
                    <div key={i} className="w-1.5 bg-cyan-400 rounded-full animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
           )}
        </div>
      </div>

      {/* Grilla de Emisoras (Scrollable y Adaptable) */}
      <div className="relative z-40 h-full pb-64 overflow-y-auto no-scrollbar px-6 md:px-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-8 pb-32">
          {stations.map((station, idx) => {
            const isFocused = activeIndex === idx;
            const isPlayingThis = currentStation?.id === station.id;

            return (
              <div
                key={station.id}
                onClick={() => {
                    setActiveIndex(idx);
                    setCurrentStation(station);
                }}
                className={`
                  relative aspect-square flex flex-col items-center justify-center transition-all duration-500 cursor-pointer
                  ${isFocused 
                    ? 'z-50 scale-105' 
                    : 'scale-100 opacity-60'
                  }
                `}
              >
                {/* Logo de Radio - Sin Caja */}
                <div className="w-full h-full p-4 flex items-center justify-center">
                    <img 
                        src={station.logo} 
                        className={`
                            w-full h-full object-contain transition-all duration-500
                            ${isFocused 
                                ? 'drop-shadow-[0_0_30px_rgba(34,211,238,0.8)] brightness-110' 
                                : 'drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]'
                            }
                        `}
                        alt={station.title} 
                    />
                </div>

                {/* Sello de Reproducción */}
                {isPlayingThis && (
                    <div className="absolute top-2 right-2 bg-cyan-400 text-black p-1.5 rounded-full shadow-lg">
                        <Activity size={14} />
                    </div>
                )}

                {/* Nombre al hacer Focus */}
                <div className={`
                    absolute -bottom-2 px-4 py-1.5 bg-black/90 border border-white/10 rounded-full transition-opacity duration-300
                    ${isFocused ? 'opacity-100' : 'opacity-0'}
                `}>
                    <p className="text-[9px] font-black uppercase tracking-tighter truncate max-w-[100px]">
                        {station.title}
                    </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default RadiosPlay;