import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, Volume2, Maximize } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const FabulosaMixVIP = () => {
  // 📺 ROTACIÓN DE VIDEOS
  const videoIds = ["0qEOlwW3MjU", "aCXa4Iwxigo", "Uh5eZgjtv0s", "OJv49ohWsnQ"];
  const [index, setIndex] = useState(0);

  // 🎛️ ESTADOS DEL REPRODUCTOR
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  
  const audioRef = useRef(null);
  const containerRef = useRef(null);
  const timeoutRef = useRef(null);

  // 🔄 ROTACIÓN DE FONDO CADA 2 MINUTOS
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % videoIds.length);
    }, 120000); 
    return () => clearInterval(timer);
  }, [videoIds.length]);

  // 🖱️ LÓGICA PARA OCULTAR CONTROLES (Modo Cine)
  const handleUserActivity = () => {
    setShowControls(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // Ocultar después de 3 segundos de inactividad
    timeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    handleUserActivity(); // Iniciar el temporizador al cargar
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // ▶️ CONTROL DE PLAY/PAUSE
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // 🔊 CONTROL DE VOLUMEN
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // 🖥️ CONTROL DE PANTALLA COMPLETA
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error("Error intentando pantalla completa:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="relative min-h-screen bg-black overflow-hidden flex flex-col"
      onMouseMove={handleUserActivity}
      onTouchStart={handleUserActivity}
      onClick={handleUserActivity}
    >
      
      {/* 🎬 FONDO YOUTUBE CON TRANSICIÓN "PRO" (Fade In/Out) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={videoIds[index]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }} // Efecto de difuminado suave
          className="absolute inset-0 z-0 pointer-events-none scale-150"
        >
          <iframe
            className="w-full h-full"
            src={"https://www.youtube.com/embed/" + videoIds[index] + "?autoplay=1&mute=1&loop=1&playlist=" + videoIds[index] + "&controls=0&modestbranding=1&rel=0&vq=hd1080"}
            frameBorder="0" allow="autoplay; encrypted-media" title="Fondo Mix"
          ></iframe>
        </motion.div>
      </AnimatePresence>

      {/* 🎧 AUDIO OCULTO (Con la 's' de HTTPS para Vercel) */}
      <audio 
        ref={audioRef} 
        src="https://s5.azurahosting.com:8660/radio.mp3" 
        preload="none"
      ></audio>

      {/* CABECERA (Se oculta con inactividad) */}
      <div className={`relative z-50 p-6 flex items-center gap-4 bg-gradient-to-b from-black/90 to-transparent transition-opacity duration-700 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <Link to="/premium" className="p-3 bg-zinc-900/90 rounded-full hover:bg-yellow-500 transition-all border border-white/10 shadow-2xl">
          <ArrowLeft size={24} className="text-white" />
        </Link>
        <h1 className="text-white font-black uppercase tracking-widest text-2xl drop-shadow-lg">Fabulosa Mix</h1>
      </div>

      {/* 🟢 REPRODUCTOR GIGANTE EN PANTALLA (LOGO ANIMADO SUBWOOFER) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-10/12 md:w-5/12 flex justify-center items-center pointer-events-none">
        <motion.img 
          src="/logo-fabulosamix.png" 
          alt="Fabulosa Mix Gigante" 
          className="w-full h-auto object-contain drop-shadow-[0_0_80px_rgba(234,179,8,0.3)]"
          animate={isPlaying ? { scale: [1, 1.08, 1] } : { scale: 1 }}
          transition={{ repeat: Infinity, duration: 0.45, ease: "easeInOut" }}
        />
      </div>

      {/* 🎛️ BARRA DE CONTROLES INFERIOR (Se oculta deslizando hacia abajo) */}
      <div 
        className={`absolute bottom-12 left-1/2 -translate-x-1/2 z-[150] flex items-center gap-4 md:gap-8 bg-black/80 backdrop-blur-xl px-8 py-4 rounded-full border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] transition-all duration-700 ease-in-out ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        {/* Botón Play / Pause */}
        <button 
          onClick={(e) => { e.stopPropagation(); togglePlay(); }} 
          className="w-14 h-14 flex items-center justify-center bg-yellow-500 text-black rounded-full hover:bg-yellow-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(234,179,8,0.4)]"
        >
          {isPlaying ? <Pause size={28} className="fill-black" /> : <Play size={28} className="fill-black ml-1" />}
        </button>

        {/* Control de Volumen */}
        <div 
          className="flex items-center gap-3 border-l border-white/20 pl-4 md:pl-8"
          onClick={(e) => e.stopPropagation()} // Evita que un click aquí cierre algo
        >
          <Volume2 size={24} className="text-gray-400" />
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume} 
            onChange={handleVolumeChange} 
            className="w-24 md:w-32 accent-yellow-500 cursor-pointer"
          />
        </div>

        {/* Pantalla Completa */}
        <button 
          onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }} 
          className="text-gray-400 hover:text-white hover:scale-110 transition-all border-l border-white/20 pl-4 md:pl-8"
        >
          <Maximize size={24} />
        </button>
      </div>

    </div>
  );
};

export default FabulosaMixVIP;