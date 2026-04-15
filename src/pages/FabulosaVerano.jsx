import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, PartyPopper, Sun, MonitorPlay } from 'lucide-react';

import fondoVerano from '../assets/verano-fondo.png';
import logoImage from '../assets/logo_fabulosa.png'; 

const STREAM_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8";

// 📂 RUTAS DE VOCES Y SELLOS (Ubicados en /public/media/voces/)
const SELLO_FABULOSA = "/media/voces/sello-fabulosa.mp3";
const SUBELE_VOLUMEN = "/media/voces/subele el volumen somos fabulosa play.mp3";

const LOCUTORES = [
  "/media/voces/Tony Garcia - que buena nota.mp3",
  "/media/voces/Tony Garcia -saludos amas de casa .mp3",
  "/media/voces/Tony Garcia - chat en vivo.mp3",
  "/media/voces/Tony Garcia - chat interactivo.mp3",
  "/media/voces/Tony Garcia - dale volumen.mp3",
  "/media/voces/Miguel -voz lenta.mp3",
  "/media/voces/Miguel.biembenidos .mp3",
  "/media/voces/rosalia 1.mp3",
  "/media/voces/rosalia 2.mp3",
  "/media/voces/rosalia 3.mp3",
  "/media/voces/Claus Encant -bueno.mp3",
  "/media/voces/inicio.mp3"
];

const VERTICAL_ADS = [
  "/public_vertical/anunciete_1.png", "/public_vertical/chinito_express.png",
  "/public_vertical/mexicana_1.png", "/public_vertical/mexicana_2.png", "/public_vertical/uñas_yendry.png"
];

const FabulosaVerano = () => {
  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  const effectAudioRef = useRef(new Audio()); // Audio auxiliar para el mixer
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [vAdIndex, setVAdIndex] = useState(0);

  // 🎚️ LÓGICA DEL MIXER (Baja música, suena efecto, sube música)
  const playOverlayAudio = (path, duckingLevel) => {
    if (!videoRef.current) return;
    
    const originalVolume = volume;
    videoRef.current.volume = originalVolume * duckingLevel; // Bajamos volumen (ej: al 60% o 80%)
    
    effectAudioRef.current.src = path;
    effectAudioRef.current.play();
    
    effectAudioRef.current.onended = () => {
      if (videoRef.current) videoRef.current.volume = originalVolume; // Restauramos volumen original
    };
  };

  // ⏱️ TEMPORIZADORES AUTOMÁTICOS
  useEffect(() => {
    if (!isPlaying) return;

    // 1. Sello Fabulosa (Cada 3 minutos) - Baja al 80%
    const selloInterval = setInterval(() => {
      playOverlayAudio(SELLO_FABULOSA, 0.8);
    }, 180000);

    // 2. Súbele el Volumen (Cada 4 minutos) - Baja al 80%
    const subeleInterval = setInterval(() => {
      playOverlayAudio(SUBELE_VOLUMEN, 0.8);
    }, 240000);

    // 3. Locutores Random (Cada 30 minutos) - Baja al 60%
    const locutorInterval = setInterval(() => {
      const randomLocutor = LOCUTORES[Math.floor(Math.random() * LOCUTORES.length)];
      playOverlayAudio(randomLocutor, 0.6);
    }, 1800000);

    // 4. Rotación Banner Vertical (15 Segundos)
    const adInterval = setInterval(() => {
      setVAdIndex((prev) => (prev + 1) % VERTICAL_ADS.length);
    }, 15000);

    return () => {
      clearInterval(selloInterval);
      clearInterval(subeleInterval);
      clearInterval(locutorInterval);
      clearInterval(adInterval);
    };
  }, [isPlaying, volume]);

  // INICIALIZADOR HLS
  useEffect(() => {
    let hls;
    const initPlayer = () => {
      const video = videoRef.current;
      if (!video) return;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = STREAM_URL;
        video.play().catch(() => {});
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls();
        hls.loadSource(STREAM_URL);
        hls.attachMedia(video);
      }
    };
    initPlayer();
    return () => { if (hls) hls.destroy(); };
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black flex flex-col overflow-hidden" style={{ backgroundImage: `url(${fondoVerano})`, backgroundSize: 'cover' }}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md"></div>

      {/* HEADER LIMPIO */}
      <div className="relative z-50 flex justify-between items-center p-6 bg-gradient-to-b from-black to-transparent">
        <div className="flex items-center gap-6">
            <Link to="/" className="px-6 py-2 bg-white/10 hover:bg-pink-500 rounded-full text-white font-bold border border-white/10 transition-all">
                SALIR
            </Link>
            <h1 className="text-2xl md:text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 uppercase tracking-tighter">
                Fabulosa Verano
            </h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-10 relative z-40">
        <div className="flex flex-col 2xl:flex-row items-center justify-center gap-8 w-full max-w-[1800px]">
            
            {/* REPRODUCTOR ÚNICA PANTALLA */}
            <div ref={playerContainerRef} className={`relative group bg-black shadow-[0_0_100px_rgba(236,72,153,0.3)] border border-pink-500/20 ${isFullscreen ? 'w-screen h-screen' : 'w-full 2xl:flex-1 aspect-video rounded-[3rem] overflow-hidden'}`}>
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline />
                
                {/* CONTROLES ESTILO YOUTUBE (Auto-ocultables por el navegador o group-hover) */}
                <div className="absolute bottom-0 left-0 w-full p-10 flex items-center justify-between bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-6">
                        <button onClick={() => isPlaying ? videoRef.current.pause() : videoRef.current.play()} className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center text-white">
                            {isPlaying ? <Pause size={30} /> : <Play size={30} />}
                        </button>
                        <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-32 accent-cyan-400 cursor-pointer"/>
                    </div>
                    <button onClick={toggleFullScreen} className="p-4 bg-white/10 rounded-full text-white"><Maximize size={24} /></button>
                </div>
            </div>

            {/* BANNER VERTICAL DERECHA (EL ÚNICO QUE QUEDA) */}
            {!isFullscreen && (
                <div className="w-full 2xl:w-[450px] h-[400px] md:h-[650px] bg-black/40 backdrop-blur-3xl rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl">
                    <img src={VERTICAL_ADS[vAdIndex]} className="w-full h-full object-contain" alt="Publicidad" />
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default FabulosaVerano;