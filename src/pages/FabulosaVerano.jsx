import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import fondoVerano from '../assets/verano-fondo.png';

const STREAM_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8";

// Bolsa de audios con su configuración de volumen individual
const AUDIO_POOL = [
  // SELLOS (Bajan la música al 70% / 0.7)
  { path: "/media/voces/subele-volumen.mp3", duck: 0.7 },
  { path: "/media/voces/sello-fabulosa.mp3", duck: 0.7 },
  
  // LOCUTORES Y VOCES (Bajan la música al 15% / 0.15)
  { path: "/media/voces/tony-garcia-dale-volumen.mp3", duck: 0.15 },
  { path: "/media/voces/tony-garcia-que-buena-nota.mp3", duck: 0.15 },
  { path: "/media/voces/tony-garcia-saludos-amas-de-casa.mp3", duck: 0.15 },
  { path: "/media/voces/tony-garcia-chat-en-vivo.mp3", duck: 0.15 },
  { path: "/media/voces/tony-garcia-chat-interactivo.mp3", duck: 0.15 },
  { path: "/media/voces/rosalia-1.mp3", duck: 0.15 },
  { path: "/media/voces/rosalia-2.mp3", duck: 0.15 },
  { path: "/media/voces/rosalia-3.mp3", duck: 0.15 },
  { path: "/media/voces/claus-encant-bueno.mp3", duck: 0.15 },
  { path: "/media/voces/inicio.mp3", duck: 0.15 },
  { path: "/media/voces/miguel-bienvenidos.mp3", duck: 0.15 },
  { path: "/media/voces/miguel-voz-lenta.mp3", duck: 0.15 }
];

const VERTICAL_ADS = [
  "/publicidad_vertical/anunciete_1.png", "/publicidad_vertical/chinito_express.png",
  "/publicidad_vertical/mexicana_1.png", "/publicidad_vertical/mexicana_2.png", "/publicidad_vertical/unas_yendry.png"
];

const FabulosaVerano = () => {
  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  const effectAudioRef = useRef(new Audio());
  const hideTimeout = useRef(null);
  const volumeRef = useRef(1); 
  
  const [hasStarted, setHasStarted] = useState(false); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [vAdIndex, setVAdIndex] = useState(0);

  const resetControlsTimer = () => {
    setShowControls(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    if (hasStarted && isPlaying) {
      hideTimeout.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  // 🎚️ MIXER INTELIGENTE: Recibe el objeto del audio y aplica su volumen específico
  const playOverlayAudio = (audioItem) => {
    const video = videoRef.current; // vMix
    const effect = effectAudioRef.current; // Voz MP3

    if (!video || !hasStarted) return;
    
    const masterVol = volumeRef.current;
    
    // 1. Bajamos la música al nivel que pide el audio (0.7 o 0.15)
    video.volume = masterVol * audioItem.duck;
    
    // 2. Disparamos la voz del locutor siempre al 100%
    effect.src = audioItem.path;
    effect.volume = 1.0; 
    effect.load();
    
    effect.play().catch(err => {
        console.error("Error:", err);
        video.volume = masterVol; 
    });
    
    // 3. Al terminar, devolvemos el vMix a la normalidad
    effect.onended = () => {
      if (video) video.volume = volumeRef.current;
    };
  };

  useEffect(() => {
    if (!hasStarted) return;

    // SISTEMA RANDOM: Cada 5 minutos (300,000 ms) elige cualquier audio de la bolsa
    const randomInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * AUDIO_POOL.length);
      const selectedAudio = AUDIO_POOL[randomIndex];
      playOverlayAudio(selectedAudio);
    }, 300000); 

    return () => clearInterval(randomInterval);
  }, [hasStarted]);

  useEffect(() => {
    const adInterval = setInterval(() => setVAdIndex((prev) => (prev + 1) % VERTICAL_ADS.length), 15000);
    return () => clearInterval(adInterval);
  }, []);

  const handleStart = () => {
    setHasStarted(true);
    setIsPlaying(true);
    if (videoRef.current) {
        videoRef.current.src = STREAM_URL;
        videoRef.current.play();
        videoRef.current.volume = volumeRef.current;
    }
    resetControlsTimer();
  };

  const togglePlay = (e) => {
    e.stopPropagation();
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowControls(true);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black flex flex-col overflow-hidden font-sans" 
         style={{ backgroundImage: `url(${fondoVerano})`, backgroundSize: 'cover' }}
         onMouseMove={resetControlsTimer}>
      
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md"></div>
      
      <div className={`relative z-50 flex justify-between items-center p-4 md:p-6 transition-opacity duration-500 ${!showControls && hasStarted ? 'opacity-0' : 'opacity-100'}`}>
        <Link to="/" className="px-4 py-2 md:px-8 md:py-3 bg-white/10 hover:bg-pink-600 rounded-full text-white font-black border border-white/20 transition-all uppercase text-xs md:text-base">Salir</Link>
        <h1 className="text-xl md:text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 uppercase">Fabulosa Verano</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-2 md:p-4 relative z-40">
        <div className="flex flex-col 2xl:flex-row items-center justify-center gap-4 md:gap-10 w-full max-w-[1900px]">
            
            <div ref={playerContainerRef} className="relative group bg-black shadow-2xl border border-white/10 w-full 2xl:flex-1 aspect-video rounded-[2rem] md:rounded-[4rem] overflow-hidden">
                
                {!hasStarted && (
                    <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-black/95 cursor-pointer" onClick={handleStart}>
                        <div className="w-20 h-20 md:w-32 md:h-32 bg-pink-500 rounded-full flex items-center justify-center mb-4 md:mb-8 shadow-lg animate-pulse">
                            <Play size={40} className="text-white ml-1 md:ml-2" fill="white" />
                        </div>
                        <p className="text-white font-black tracking-widest text-lg md:text-3xl uppercase">Sintonizar en Vivo</p>
                    </div>
                )}

                <video ref={videoRef} className="w-full h-full object-cover" playsInline />
                
                <div className={`absolute bottom-0 left-0 w-full p-4 md:p-10 flex items-center justify-between transition-opacity duration-500 z-40 bg-gradient-to-t from-black via-black/20 to-transparent ${!showControls ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <div className="flex items-center gap-4 md:gap-8">
                        <button onClick={togglePlay} className="text-white">
                            {isPlaying ? <Pause size={30} fill="white" /> : <Play size={30} fill="white" />}
                        </button>
                        
                        <div className="hidden md:flex items-center gap-4 group/vol">
                            <button onClick={() => { 
                                setIsMuted(!isMuted); 
                                if (videoRef.current) videoRef.current.muted = !isMuted; 
                            }} className="text-white">
                                {isMuted ? <VolumeX size={30} /> : <Volume2 size={30} />}
                            </button>
                            <input type="range" min="0" max="1" step="0.05" 
                                   defaultValue="1"
                                   onChange={(e) => { 
                                       const v = parseFloat(e.target.value);
                                       volumeRef.current = v; 
                                       if (videoRef.current) videoRef.current.volume = v;
                                   }} 
                                   className="w-24 md:w-40 accent-cyan-400 h-1.5 rounded-lg appearance-none bg-white/20 cursor-pointer"/>
                        </div>
                    </div>

                    <button onClick={() => document.fullscreenElement ? document.exitFullscreen() : playerContainerRef.current.requestFullscreen()} className="text-white">
                        <Maximize size={28} />
                    </button>
                </div>
            </div>

            <div className="w-full 2xl:w-[500px] h-[300px] md:h-[750px] bg-black/40 backdrop-blur-3xl rounded-[2rem] md:rounded-[4rem] border border-white/10 overflow-hidden shadow-2xl">
                <img src={VERTICAL_ADS[vAdIndex]} className="w-full h-full object-contain" alt="Publicidad" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default FabulosaVerano;