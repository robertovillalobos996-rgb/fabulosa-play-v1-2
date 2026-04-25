import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Hls from "hls.js";
import { Radio, Activity, ArrowLeft } from "lucide-react";

// Importamos la lista global
import { radiosMundo } from "../data/radios-mundo";
import logoFabulosa from "../assets/logo_fabulosa.png";

const RadiosPlay = () => {
  const navigate = useNavigate();
  const [fecha, setFecha] = useState(new Date());
  
  // activeIndex = -1 es el botón de VOLVER AL MENÚ
  // activeIndex >= 0 son las emisoras
  const [activeIndex, setActiveIndex] = useState(0); 
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStation, setCurrentStation] = useState(null);

  const audioRef = useRef(null);
  const hlsRef = useRef(null);
  const gridRefs = useRef([]); 

  // 1. FILTRADO: SOLO COSTA RICA
  const stations = useMemo(() => {
    return radiosMundo.filter(r => r.country === "Costa Rica");
  }, []);

  // Reloj de 12 Horas
  useEffect(() => {
    const timer = setInterval(() => setFecha(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // MOTOR DE AUDIO
  const playStation = (station) => {
    if (!station) return;
    setCurrentStation(station);
    setIsPlaying(true);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (station.url.includes(".m3u8")) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(station.url);
        hls.attachMedia(audioRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => audioRef.current.play());
        hlsRef.current = hls;
      }
    } else {
      audioRef.current.src = station.url;
      audioRef.current.play();
    }
  };

  // CONTROL REMOTO: NAVEGACIÓN 2D + BOTÓN VOLVER
  const COLUMNAS = 4; 
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ENTER: Seleccionar radio o volver
      if (e.key === "Enter") {
        if (activeIndex === -1) {
          navigate("/"); 
        } else {
          playStation(stations[activeIndex]);
        }
        return;
      }

      // BOTÓN ATRÁS NATIVO
      if (e.key === "Escape" || e.key === "Backspace") {
        navigate("/");
        return;
      }

      // MOVIMIENTO DE FLECHAS
      setActiveIndex((prev) => {
        let next = prev;
        
        if (prev === -1) {
          // Si estamos en el botón "Volver" y bajamos, vamos a la primera fila
          if (e.key === "ArrowDown") next = 0;
          if (e.key === "ArrowRight") next = 0;
        } else {
          // Movimiento dentro de la cuadrícula
          if (e.key === "ArrowRight") next = Math.min(prev + 1, stations.length - 1);
          if (e.key === "ArrowLeft") {
              if (prev % COLUMNAS === 0) next = -1; // Si está al puro borde izquierdo, salta a Volver
              else next = Math.max(prev - 1, 0);
          }
          if (e.key === "ArrowDown") next = Math.min(prev + COLUMNAS, stations.length - 1);
          if (e.key === "ArrowUp") {
              if (prev < COLUMNAS) next = -1; // Si está en la primera fila, salta a Volver
              else next = prev - COLUMNAS;
          }
        }
        return next;
      });
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, stations, navigate]);

  // Centrado automático
  useEffect(() => {
    if (activeIndex >= 0 && gridRefs.current[activeIndex]) {
      gridRefs.current[activeIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeIndex]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white font-sans flex">
      <audio ref={audioRef} />

      {/* FONDO AMBIENTAL DINÁMICO */}
      <div className="absolute inset-0 z-0">
        <img 
            src={currentStation ? currentStation.logo : '/tv_1.jpg'} 
            className="w-full h-full object-cover blur-[100px] opacity-40 scale-125 transition-all duration-1000" 
            alt="Fondo"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
      </div>

      {/* SECCIÓN IZQUIERDA: REPRODUCTOR Y CONTROL */}
      <div className="relative z-10 w-[35%] h-full flex flex-col justify-between p-12 border-r border-white/5 bg-black/40 backdrop-blur-md">
        
        <div className="flex flex-col items-start">
            {/* BOTÓN ÚNICO DE VOLVER (Seleccionable con control) */}
            <div 
              onClick={() => navigate("/")}
              className={`
                inline-flex items-center gap-3 px-6 py-3 mb-10 rounded-full border-4 transition-all duration-300 cursor-pointer
                ${activeIndex === -1 
                    ? 'bg-cyan-600 border-cyan-300 scale-110 shadow-[0_0_50px_rgba(34,211,238,0.8)]' 
                    : 'bg-white/5 border-white/10 opacity-60'}
              `}
            >
                <ArrowLeft size={28} className="text-white" />
                <span className="font-black uppercase tracking-widest text-lg text-white">
                    Volver al Menú
                </span>
            </div>

            <img src={logoFabulosa} alt="Fabulosa" className="h-16 object-contain mb-4 drop-shadow-lg" />
            <div className="bg-cyan-500/20 px-3 py-1 border border-cyan-500/30 rounded-full">
                <span className="text-cyan-400 text-xs font-bold tracking-widest uppercase">Costa Rica</span>
            </div>
        </div>

        {/* Reproductor Central */}
        <div className="flex flex-col items-center justify-center flex-grow">
            {currentStation ? (
                <div className="flex flex-col items-center animate-fade-in text-center">
                    <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-[3rem] bg-black/60 p-8 shadow-2xl border-2 border-white/10">
                        <img 
                            src={currentStation.logo} 
                            className="w-full h-full object-contain drop-shadow-2xl" 
                            alt="Logo" 
                        />
                    </div>
                    <h2 className="mt-8 text-4xl lg:text-5xl font-black italic tracking-tight drop-shadow-lg uppercase">
                        {currentStation.name}
                    </h2>
                    {isPlaying && (
                        <div className="mt-6 flex gap-2 h-10 items-end">
                            <div className="w-2 bg-cyan-400 animate-[eq_1s_infinite_0s] rounded-full"></div>
                            <div className="w-2 bg-cyan-400 animate-[eq_1s_infinite_0.2s] rounded-full"></div>
                            <div className="w-2 bg-cyan-400 animate-[eq_1s_infinite_0.4s] rounded-full"></div>
                            <div className="w-2 bg-cyan-400 animate-[eq_1s_infinite_0.1s] rounded-full"></div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center opacity-30">
                    <Radio size={100} className="mx-auto mb-4" />
                    <p className="text-xl font-bold tracking-[0.3em] uppercase">Seleccione Radio</p>
                </div>
            )}
        </div>

        {/* Reloj 12h */}
        <div>
            <p className="text-5xl font-black italic tracking-tighter">
                {fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).replace(/\s?[APM]{2}$/i, '')}
            </p>
            <p className="text-sm text-gray-400 uppercase tracking-widest font-bold">
                {fecha.toLocaleDateString('es-CR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
        </div>
      </div>

      {/* SECCIÓN DERECHA: RADIOS PLAY */}
      <div className="relative z-10 w-[65%] h-full overflow-y-auto no-scrollbar p-12">
        <h1 className="text-4xl font-black italic tracking-[0.2em] text-white mb-10 uppercase drop-shadow-xl">
            Radios Play
        </h1>

        <div className="grid grid-cols-3 xl:grid-cols-4 gap-6 pb-32">
          {stations.map((station, idx) => {
            const isFocused = idx === activeIndex;
            const isPlayingThis = currentStation?.id === station.id;

            return (
              <div
                key={station.id || idx}
                ref={(el) => (gridRefs.current[idx] = el)}
                onClick={() => {
                  setActiveIndex(idx);
                  playStation(station);
                }}
                className={`
                  relative aspect-square rounded-[2rem] p-6 transition-all duration-300
                  flex flex-col items-center justify-center bg-black/40
                  ${isFocused 
                    ? 'border-4 border-cyan-400 scale-110 shadow-[0_0_50px_rgba(34,211,238,0.6)] z-20' 
                    : 'border-2 border-white/5 scale-100 opacity-70'}
                `}
              >
                <img 
                    src={station.logo} 
                    className="w-full h-full object-contain drop-shadow-2xl"
                    alt={station.name} 
                />
                
                {isPlayingThis && isPlaying && (
                    <div className="absolute top-4 right-4 text-cyan-400 animate-pulse">
                        <Activity size={20} />
                    </div>
                )}
                
                {isFocused && (
                    <div className="absolute bottom-4 bg-black/80 px-3 py-1 rounded-lg border border-white/10">
                        <p className="text-[10px] font-black uppercase truncate max-w-[120px]">{station.name}</p>
                    </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes eq { 0%, 100% { height: 10px; } 50% { height: 35px; } }
        @keyframes fade-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default RadiosPlay;