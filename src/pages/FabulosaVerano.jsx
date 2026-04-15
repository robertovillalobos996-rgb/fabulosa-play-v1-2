import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import fondoVerano from '../assets/verano-fondo.png';

const STREAM_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8";

const SELLO_FABULOSA = "/media/voces/sello-fabulosa.mp3";
const SUBELE_VOLUMEN = "/media/voces/subele-volumen.mp3";
const LOCUTORES = [
  "/media/voces/tony-garcia-que-buena-nota.mp3",
  "/media/voces/tony-garcia-saludos-amas-de-casa.mp3",
  "/media/voces/tony-garcia-chat-en-vivo.mp3",
  "/media/voces/tony-garcia-chat-interactivo.mp3",
  "/media/voces/tony-garcia-dale-volumen.mp3",
  "/media/voces/miguel-voz-lenta.mp3",
  "/media/voces/miguel-bienvenidos.mp3",
  "/media/voces/rosalia-1.mp3",
  "/media/voces/rosalia-2.mp3",
  "/media/voces/rosalia-3.mp3",
  "/media/voces/claus-encant-bueno.mp3",
  "/media/voces/inicio.mp3"
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
  
  const [hasStarted, setHasStarted] = useState(false); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [vAdIndex, setVAdIndex] = useState(0);

  const resetControlsTimer = () => {
    setShowControls(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    if (hasStarted && isPlaying) {
      hideTimeout.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  const playOverlayAudio = (path, duckingLevel) => {
    if (!videoRef.current || !hasStarted) return;
    
    const currentVol = volume;
    videoRef.current.volume = currentVol * duckingLevel;
    
    effectAudioRef.current.src = path;
    effectAudioRef.current.load();
    
    const playPromise = effectAudioRef.current.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        videoRef.current.volume = currentVol;
      });
    }
    
    effectAudioRef.current.onended = () => {
      if (videoRef.current) videoRef.current.volume = currentVol;
    };
  };

  useEffect(() => {
    if (!hasStarted) return;

    const selloInterval = setInterval(() => playOverlayAudio(SELLO_FABULOSA, 0.8), 180000); // 3m
    const subeleInterval = setInterval(() => playOverlayAudio(SUBELE_VOLUMEN, 0.8), 240000); // 4m
    const locutorInterval = setInterval(() => {
      const randomLocutor = LOCUTORES[Math.floor(Math.random() * LOCUTORES.length)];
      playOverlayAudio(randomLocutor, 0.5); // 15m
    }, 900000); 

    return () => {
      clearInterval(selloInterval); clearInterval(subeleInterval); clearInterval(locutorInterval);
    };
  }, [hasStarted, volume]);

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
      
      <div className={`relative z-50 flex justify-between items-center p-6 transition-opacity duration-500 ${!showControls && hasStarted ? 'opacity-0' : 'opacity-100'}`}>
        <Link to="/" className="px-8 py-3 bg-white/10 hover:bg-pink-600 rounded-full text-white font-black border border-white/20 transition-all uppercase tracking-widest">Salir</Link>
        <h1 className="text-4xl md:text-6xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 uppercase">Fabulosa Verano</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-40">
        <div className="flex flex-col 2xl:flex-row items-center justify-center gap-10 w-full max-w-[1900px]">
            
            <div ref={playerContainerRef} className="relative group bg-black shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/10 w-full 2xl:flex-1 aspect-video rounded-[4rem] overflow-hidden">
                
                {!hasStarted && (
                    <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-black/95 cursor-pointer" onClick={handleStart}>
                        <div className="w-32 h-32 bg-pink-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(236,72,153,0.6)] animate-pulse">
                            <Play size={60} className="text-white ml-2" fill="white" />
                        </div>
                        <p className="text-white font-black tracking-[0.3em] text-3xl uppercase">Sintonizar en Vivo</p>
                    </div>
                )}

                <video ref={videoRef} className="w-full h-full object-cover" playsInline />
                
                <div className={`absolute bottom-0 left-0 w-full p-10 flex items-center justify-between transition-opacity duration-500 z-40 bg-gradient-to-t from-black/95 via-black/40 to-transparent ${!showControls ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <div className="flex items-center gap-8">
                        <button onClick={togglePlay} className="text-white hover:text-pink-500 transition-transform hover:scale-110">
                            {isPlaying ? <Pause size={45} fill="white" /> : <Play size={45} fill="white" />}
                        </button>
                        
                        <div className="flex items-center gap-4 group/vol">
                            <button onClick={() => { setIsMuted(!isMuted); videoRef.current.muted = !isMuted; }} className="text-white">
                                {isMuted || volume === 0 ? <VolumeX size={35} /> : <Volume2 size={35} />}
                            </button>
                            <input type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume} 
                                   onChange={(e) => { 
                                       const v = parseFloat(e.target.value);
                                       setVolume(v); 
                                       videoRef.current.volume = v;
                                       setIsMuted(v === 0);
                                   }} 
                                   className="w-0 group-hover/vol:w-40 transition-all duration-500 accent-cyan-400 h-2 rounded-lg appearance-none bg-white/20 cursor-pointer"/>
                        </div>
                    </div>

                    <button onClick={() => document.fullscreenElement ? document.exitFullscreen() : playerContainerRef.current.requestFullscreen()} className="text-white hover:text-cyan-400 transition-transform hover:scale-110">
                        <Maximize size={35} />
                    </button>
                </div>
            </div>

            <div className="w-full 2xl:w-[500px] h-[500px] md:h-[750px] bg-black/40 backdrop-blur-3xl rounded-[4rem] border border-white/10 overflow-hidden shadow-2xl">
                <img src={VERTICAL_ADS[vAdIndex]} className="w-full h-full object-contain" alt="Publicidad" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default FabulosaVerano;