import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX, Maximize, Minimize, Sparkles, Play, MonitorPlay, ShieldCheck } from 'lucide-react';

// Assets
import backgroundImage from '../assets/5d9d5b49-4a20-4648-ad07-873961815913.png';
import logoImage from '../assets/logo_fabulosa.png'; 

const AUDIO_STREAM_URL = "https://solo-cooling-zen-spot.trycloudflare.com/;"; 

// 🔑 TUS 14 API KEYS (ROTACIÓN ACTIVA)
const YOUTUBE_API_KEYS = [
    "AIzaSyDxLD8PviKQwlHBs7rmRm3GoyIKk-aQpww",
    "AIzaSyACeTldeUs5tbn2Lwr6o_6Lc48rF1nINY0",
    "AIzaSyBUk0oq1zjA6BKx5HK8DEQc1TxQqreqGtk",
    "AIzaSyBys-0J3T5Ou_fdPGxqYC5LWDMgppwD0Y4",
    "AIzaSyDHdkSo4WSHjYL4nHFU9wKmXW5D9PScO4g",
    "AIzaSyDJqDMnZsYHyJtzahtvv1r55Z-JfgLk5TU",
    "AIzaSyCruj7UZTEmElS3ZUeUBmYPecbsAA667U8",
    "AIzaSyBfMNrgQESeymMQ9srVBHKjXB3_WeRfkXE",
    "AIzaSyB1e_YSB74yAelvAhapDWu11VPLz2wBkUg",
    "AIzaSyCsvViGGiPJxx8-FkSwQvHE2T_U8d2UO5E",
    "AIzaSyBRvdUqolryjMRustJUyqN_HtkjRCbHLfI",
    "AIzaSyCdmCZW6J49Onl-QAf3cTsNu0im84EBVZc",
    "AIzaSyCeref7W3di_9o6W3YnEtqgvCQyvyQ5a5Q",
    "AIzaSyAwtE19mD7rpv1pu5nB4R8Q0HmEX9OkgJI"
];

// 🎥 TUS 5 CÁMARAS OFICIALES
const YOUTUBE_CAMS = [
    "rnXIjl_Rzy4",
    "EO_1LWqsCNE",
    "gFRtAAmiFbE",
    "loHbMM9JfCs",
    "uV3wWHSvkfs"
];

const ADS = [
  { type: 'image', url: '/publicidad_banner/1.png' }, 
  { type: 'video', url: '/publicidad_banner/video_1.mp4' }
];

// 🚀 LISTA DE PUBLICIDAD VERTICAL COMPLETA
const VERTICAL_ADS = [
  "/publicidad_vertical/anunciete_1.png",
  "/publicidad_vertical/chinito_express.png",
  "/publicidad_vertical/mexicana_1.png",
  "/publicidad_vertical/mexicana_2.png",
  "/publicidad_vertical/uñas_yendry.png"
];

const Camaras = () => {
    const audioRef = useRef(null);
    const playerContainerRef = useRef(null);
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(80); 
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentTime, setCurrentTime] = useState('');
    const [camIndex, setCamIndex] = useState(0);
    const [adIndex, setAdIndex] = useState(0);
    const [vAdIndex, setVAdIndex] = useState(0);
    const [keyIndex, setKeyIndex] = useState(0);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            let hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12; 
            setCurrentTime(`${hours}:${minutes} ${ampm}`);
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    // 🔄 ROTACIÓN DE CÁMARAS (3 Minutos)
    useEffect(() => {
        if (!isPlaying) return;
        const camInterval = setInterval(() => {
            setCamIndex((prev) => (prev + 1) % YOUTUBE_CAMS.length);
            setKeyIndex((prev) => (prev + 1) % YOUTUBE_API_KEYS.length);
        }, 180000); // 180000ms = 3 min
        return () => clearInterval(camInterval);
    }, [isPlaying]);

    // 🔄 ROTACIÓN DE PUBLICIDAD (15 Segundos)
    useEffect(() => {
        if (!isPlaying) return;
        const adInterval = setInterval(() => {
            setAdIndex((prev) => (prev + 1) % ADS.length);
            setVAdIndex((prev) => (prev + 1) % VERTICAL_ADS.length);
        }, 15000); // 15000ms = 15 seg
        return () => clearInterval(adInterval);
    }, [isPlaying]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
            audioRef.current.muted = isMuted;
        }
    }, [volume, isMuted]);

    const handleStartLive = () => {
        setIsPlaying(true);
        if (audioRef.current) {
            audioRef.current.src = AUDIO_STREAM_URL;
            audioRef.current.play().catch(e => console.error("Error Audio:", e));
        }
    };

    const toggleFullscreen = () => {
        if (!playerContainerRef.current) return;
        if (!document.fullscreenElement) {
            playerContainerRef.current.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    return (
        <div className="relative w-screen min-h-screen overflow-x-hidden bg-black flex flex-col font-sans">
            <img src={backgroundImage} alt="Fondo" className="fixed inset-0 z-0 w-full h-full object-cover opacity-60 scale-105" />
            <div className="fixed inset-0 bg-gradient-to-b from-black/40 to-black/70 z-10"></div>

            <Link to="/" className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white hover:bg-cyan-500 transition-all shadow-xl">
                <ArrowLeft size={18} /> <span className="font-bold text-[10px] uppercase tracking-widest text-white">Volver al Panel</span>
            </Link>

            <div className="flex-1 flex flex-col items-center p-4 lg:p-6 mt-16 relative z-40 overflow-y-auto">
                
                {/* 📦 CONTENEDOR INTELIGENTE: Column en celular, Row en 2XL */}
                <div className="flex flex-col 2xl:flex-row items-center justify-center gap-6 w-full max-w-[1750px]">
                    
                    {/* 📺 VIDEO PRINCIPAL (3 Minutos) */}
                    <div 
                        ref={playerContainerRef} 
                        className={`relative group bg-black overflow-hidden transition-all duration-700 shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 ${isFullscreen ? 'w-screen h-screen rounded-0' : 'w-full 2xl:flex-1 aspect-video rounded-[2.5rem]'}`}
                    >
                        <audio ref={audioRef} />

                        {!isPlaying ? (
                            <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-black/95 cursor-pointer" onClick={handleStartLive}>
                                <div className="p-12 rounded-full bg-cyan-500/10 border-2 border-cyan-500 text-cyan-500 animate-pulse shadow-[0_0_80px_rgba(6,182,212,0.3)]">
                                    <Play size={80} fill="currentColor" className="ml-4" />
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="absolute inset-0 z-30 bg-transparent"></div>
                                <iframe 
                                    className="w-full h-full pointer-events-none" 
                                    src={`https://www.youtube.com/embed/${YOUTUBE_CAMS[camIndex]}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&key=${YOUTUBE_API_KEYS[keyIndex]}`} 
                                    frameBorder="0" 
                                    allow="autoplay; encrypted-media"
                                    sandbox="allow-scripts allow-same-origin"
                                ></iframe>
                            </>
                        )}

                        <div className="absolute top-6 right-6 z-50 flex flex-col items-end gap-2">
                            <img src={logoImage} alt="Logo" className="w-28 md:w-56 drop-shadow-2xl" />
                            <div className="px-3 py-1 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl">
                                <span className="text-white font-black text-sm md:text-3xl tabular-nums drop-shadow-md">{currentTime}</span>
                            </div>
                        </div>

                        {isPlaying && (
                            <div className="absolute bottom-0 left-0 w-full p-8 flex items-center justify-between z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black/90 to-transparent">
                                <div className="flex items-center gap-4 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 shadow-2xl">
                                    <button onClick={() => setIsMuted(!isMuted)} className="text-white hover:text-cyan-400">
                                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                    </button>
                                    <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(e.target.value)} className="w-16 md:w-32 accent-cyan-500 cursor-pointer" />
                                </div>
                                <button onClick={toggleFullscreen} className="text-white hover:text-cyan-400 p-2 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 transition-all hover:scale-110 shadow-2xl">
                                    {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 🚀 BANNER VERTICAL (Visible en todo dispositivo, se apila en celular) */}
                    {!isFullscreen && (
                        <div className="flex w-full 2xl:w-[400px] h-[300px] md:h-[550px] flex-col animate-fade-in-long">
                            <div className="flex-1 bg-black/40 backdrop-blur-3xl rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl relative">
                                <img 
                                    src={VERTICAL_ADS[vAdIndex]} 
                                    className="w-full h-full object-contain opacity-100 transition-all duration-700" 
                                    alt="Publicidad Vertical" 
                                    onError={(e) => e.target.src = 'https://via.placeholder.com/400x800?text=Espacio+Disponible'}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* 📣 PUBLICIDAD HORIZONTAL (Responsive: Stack en celular) */}
                <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6 mt-8 animate-fade-in-long">
                    <div className="flex-1 bg-black/50 backdrop-blur-2xl rounded-[2rem] p-5 border border-white/10 flex flex-col justify-center shadow-xl overflow-hidden min-h-[120px]">
                      <span className="text-cyan-400 font-bold text-[8px] uppercase tracking-[0.3em] mb-1 text-center md:text-left">ESPACIO PUBLICITARIO</span>
                      <h3 className="text-white font-black text-lg md:text-2xl uppercase tracking-tighter leading-tight text-center md:text-left">ANUNCIA CON NOSOTROS</h3>
                      <a href="tel:64035313" className="text-cyan-400 font-black text-xl md:text-3xl mt-1 block text-center md:text-left">6403-5313</a>
                    </div>

                    <div className="w-full md:w-2/5 h-[150px] md:h-[160px] rounded-[2rem] overflow-hidden border border-white/10 bg-black flex items-center justify-center relative shadow-xl">
                        {ADS[adIndex].type === 'image' ? (
                            <img src={ADS[adIndex].url} className="w-full h-full object-contain" alt="Anuncio" />
                        ) : (
                            <video src={ADS[adIndex].url} autoPlay muted loop className="w-full h-full object-contain" />
                        )}
                    </div>
                </div>
            </div>

            {/* MARQUESINA (Pie de página) */}
            <div className="w-full bg-black/95 border-t border-white/10 py-4 z-50">
                <div className="whitespace-nowrap flex gap-12 text-white/70 font-bold uppercase text-[10px] tracking-[0.3em] animate-marquee">
                    <span className="flex items-center gap-2"><Sparkles size={14} className="text-cyan-400" /> Fabulosa Play: Cámaras en Vivo</span>
                    <span className="flex items-center gap-2 text-cyan-400"><Sparkles size={14} /> Transmisión Oficial de Fabulosa Play</span>
                </div>
            </div>

            <style>{`
                .animate-marquee { animation: marquee 40s linear infinite; }
                @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
                .animate-fade-in-long { animation: fadeIn 1s ease-out; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </div>
    );
};

export default Camaras;