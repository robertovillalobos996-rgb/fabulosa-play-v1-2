import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, PartyPopper, Sun, Sparkles, MonitorPlay } from 'lucide-react';

// === FONDO DE FIESTA Y VERANO ===
import fondoVerano from '../assets/verano-fondo.png';
import logoImage from '../assets/logo_fabulosa.png'; 

const STREAM_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8";

// 📣 PUBLICIDAD COMPARTIDA CON CÁMARAS
const ADS = [
  { type: 'image', url: '/publicidad_banner/1.png' }, 
  { type: 'video', url: '/publicidad_banner/video_1.mp4' }
];

const VERTICAL_ADS = [
  "/publicidad_vertical/anunciete_1.png",
  "/publicidad_vertical/chinito_express.png",
  "/publicidad_vertical/mexicana_1.png",
  "/publicidad_vertical/mexicana_2.png",
  "/publicidad_vertical/uñas_yendry.png"
];

const FabulosaVerano = () => {
  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isHovering, setIsHovering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Estados de Publicidad
  const [adIndex, setAdIndex] = useState(0);
  const [vAdIndex, setVAdIndex] = useState(0);

  // 🔄 ROTACIÓN DE PUBLICIDAD (15 Segundos)
  useEffect(() => {
    const adInterval = setInterval(() => {
        setAdIndex((prev) => (prev + 1) % ADS.length);
        setVAdIndex((prev) => (prev + 1) % VERTICAL_ADS.length);
    }, 15000); // 15 seg exactos
    return () => clearInterval(adInterval);
  }, []);

  // INICIALIZADOR DEL STREAM M3U8
  useEffect(() => {
    let hls;
    const initPlayer = () => {
      const video = videoRef.current;
      if (!video) return;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = STREAM_URL;
        video.play().catch(e => console.log("Auto-play prevenido", e));
      } 
      else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ capLevelToPlayerSize: true, maxBufferLength: 30 });
        hls.loadSource(STREAM_URL);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(e => console.log("Auto-play prevenido", e));
        });
      }
    };
    if (!window.Hls) {
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
      script.onload = initPlayer;
      document.body.appendChild(script);
    } else {
      initPlayer();
    }
    return () => { if (hls) hls.destroy(); };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) { videoRef.current.pause(); setIsPlaying(false); }
      else { videoRef.current.play(); setIsPlaying(true); }
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) { videoRef.current.volume = val; setIsMuted(val === 0); }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      setVolume(newMutedState ? 0 : 1);
      if (!newMutedState) videoRef.current.volume = 1;
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen().catch(err => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      className="relative min-h-screen w-full bg-black font-sans flex flex-col selection:bg-pink-500 overflow-x-hidden"
      style={{ backgroundImage: `url(${fondoVerano})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="fixed inset-0 bg-gradient-to-br from-pink-600/30 via-transparent to-cyan-500/30 mix-blend-overlay"></div>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* HEADER */}
      <div className="relative z-50 flex justify-between items-center p-6 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-6 flex-1">
            <Link to="/" className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-pink-500 rounded-full text-white font-bold border border-white/10 transition-all hover:scale-105 shadow-lg">
                <ArrowLeft size={18} /> SALIR
            </Link>
            <div className="flex items-center gap-3">
                <Sun className="text-yellow-400 animate-[spin_10s_linear_infinite]" size={32} />
                <h1 className="text-xl md:text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 uppercase tracking-tighter">
                    Fabulosa Verano
                </h1>
            </div>
        </div>
        <div className="hidden md:flex gap-4 ml-4">
            <div className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full text-white font-black tracking-widest shadow-lg animate-pulse">
                <PartyPopper size={18} /> Pura Fiesta
            </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center p-4 lg:p-6 relative z-40 overflow-y-auto">
        
        {/* 📦 CONTENEDOR INTELIGENTE (Igual que Camaras.jsx) */}
        <div className="flex flex-col 2xl:flex-row items-center justify-center gap-6 w-full max-w-[1750px]">
            
            {/* 📺 REPRODUCTOR PRINCIPAL */}
            <div 
                ref={playerContainerRef} 
                className={`relative group bg-black overflow-hidden transition-all duration-700 shadow-[0_0_50px_rgba(236,72,153,0.4)] border border-pink-500/30 ${isFullscreen ? 'w-screen h-screen rounded-0' : 'w-full 2xl:flex-1 aspect-video rounded-[2.5rem]'}`}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <div className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-1.5 bg-red-600/90 backdrop-blur-md rounded-full border border-red-400/50 shadow-lg">
                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
                    <span className="text-[11px] font-black text-white uppercase tracking-widest">En Vivo</span>
                </div>

                <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline onClick={togglePlay} />

                {/* CONTROLES */}
                <div className={`absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent px-8 py-8 transition-opacity duration-300 flex items-center justify-between z-50 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex items-center gap-6">
                        <button onClick={togglePlay} className="w-12 h-12 md:w-14 md:h-14 bg-pink-500 hover:bg-pink-400 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110">
                            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                        </button>
                        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                            <button onClick={toggleMute} className="text-white hover:text-cyan-400 transition-colors">
                                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                            </button>
                            <input type="range" min="0" max="1" step="0.05" value={volume} onChange={handleVolumeChange} className="w-16 md:w-24 h-1.5 accent-cyan-400 cursor-pointer"/>
                        </div>
                    </div>
                    <button onClick={toggleFullScreen} className="p-3 bg-black/40 hover:bg-cyan-500 backdrop-blur-md text-white rounded-full border border-white/10 transition-all shadow-lg">
                        <Maximize size={20} />
                    </button>
                </div>
            </div>

            {/* 🚀 BANNER VERTICAL (15 Segundos) */}
            {!isFullscreen && (
                <div className="flex w-full 2xl:w-[400px] h-[300px] md:h-[550px] flex-col animate-fade-in-long">
                    <div className="flex-1 bg-black/40 backdrop-blur-3xl rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl relative">
                        <img 
                            src={VERTICAL_ADS[vAdIndex]} 
                            className="w-full h-full object-contain transition-all duration-700" 
                            alt="Publicidad Vertical" 
                        />
                    </div>
                </div>
            )}
        </div>

        {/* 📣 PUBLICIDAD HORIZONTAL (Responsive) */}
        <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6 mt-8 animate-fade-in-long pb-10">
            <div className="flex-1 bg-black/50 backdrop-blur-2xl rounded-[2rem] p-5 border border-white/10 flex flex-col justify-center shadow-xl min-h-[120px]">
                <span className="text-cyan-400 font-bold text-[8px] uppercase tracking-[0.3em] mb-1 text-center md:text-left">ESPACIO PUBLICITARIO</span>
                <h3 className="text-white font-black text-lg md:text-2xl uppercase tracking-tighter leading-tight text-center md:text-left">ANUNCIA CON NOSOTROS</h3>
                <a href="tel:64035313" className="text-cyan-400 font-black text-xl md:text-3xl mt-1 block text-center md:text-left">6403-5313</a>
            </div>

            <div className="w-full md:w-2/5 h-[150px] md:h-[160px] rounded-[2rem] overflow-hidden border border-white/10 bg-black flex items-center justify-center shadow-xl">
                {ADS[adIndex].type === 'image' ? (
                    <img src={ADS[adIndex].url} className="w-full h-full object-contain" alt="Anuncio" />
                ) : (
                    <video src={ADS[adIndex].url} autoPlay muted loop className="w-full h-full object-contain" />
                )}
            </div>
        </div>
      </div>

      {/* FOOTER MARQUESINA */}
      <div className="w-full bg-black/95 border-t border-white/10 py-4 z-50">
          <div className="whitespace-nowrap flex gap-12 text-white/70 font-bold uppercase text-[10px] tracking-[0.3em] animate-marquee">
              <span className="flex items-center gap-2"><Sparkles size={14} className="text-pink-500" /> Fabulosa Verano: Pura Fiesta</span>
              <span className="flex items-center gap-2 text-cyan-400"><MonitorPlay size={14} /> Transmisión Oficial de Fabulosa Play</span>
          </div>
      </div>

      <style>{`
        .animate-marquee { animation: marquee 40s linear infinite; }
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-fade-in-long { animation: fadeIn 1.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default FabulosaVerano;