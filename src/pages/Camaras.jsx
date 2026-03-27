import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX, Maximize, Minimize, Sparkles } from 'lucide-react';
import Hls from 'hls.js';

import backgroundImage from '../assets/5d9d5b49-4a20-4648-ad07-873961815913.png';
import logoImage from '../assets/logo_fabulosa.png'; 

// ✅ NUEVO ENLACE DE VIDEO (BozzTV)
const VIDEO_STREAM_URL = "https://usb.bozztv.com/robertovm/index.m3u8";

// 📻 ENLACE DE AUDIO INTACTO (MyRadioStream)
const AUDIO_STREAM_URL = "http://s14.myradiostream.com:32364/;";

const Camaras = () => {
    const videoRef = useRef(null);
    const audioRef = useRef(null);
    const playerContainerRef = useRef(null);
    
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [volume, setVolume] = useState(70); 
    const [currentTime, setCurrentTime] = useState('');

    // 💰 LÓGICA DE PUBLICIDAD: BANNERS CADA 10 SEGUNDOS
    const [adIndex, setAdIndex] = useState(1);
    const totalBanners = 5; // Cambiá este número a la cantidad de banners que tengas

    useEffect(() => {
        const interval = setInterval(() => {
            setAdIndex((prev) => (prev >= totalBanners ? 1 : prev + 1));
        }, 10000); 
        return () => clearInterval(interval);
    }, []);

    const adSource = `/publicidad_banner/${adIndex}.png`;

    // ⏰ RELOJ ACTUALIZADO AL SEGUNDO
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

    // 📺 VIDEO STREAM (HLS)
    useEffect(() => {
        const video = videoRef.current;
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(VIDEO_STREAM_URL);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
            return () => hls.destroy();
        }
    }, []);

    // 🔊 CONTROL DE VOLUMEN Y MUTE PARA LA RADIO
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
            audioRef.current.muted = isMuted;
        }
    }, [volume, isMuted]);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            playerContainerRef.current.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-black flex flex-col font-sans">
            <img src={backgroundImage} alt="Fondo" className="absolute inset-0 z-0 w-full h-full object-cover" />

            {!isFullscreen && (
                <div className="relative z-50 mt-8 ml-8 flex-none">
                    <Link to="/" className="inline-flex items-center gap-2 px-6 py-2.5 bg-black/60 hover:bg-black/80 backdrop-blur-xl rounded-full text-white font-bold border border-white/20 transition-all text-xs uppercase tracking-widest">
                        <ArrowLeft size={18} /> Volver al Inicio
                    </Link>
                </div>
            )}

            {/* ÁREA DEL REPRODUCTOR */}
            <div className="flex-1 flex items-center justify-center p-6 relative z-40">
                <div 
                    ref={playerContainerRef} 
                    className={`relative group bg-black overflow-hidden transition-all duration-500 ${isFullscreen ? 'w-screen h-screen rounded-0' : 'w-full max-w-7xl aspect-video rounded-[2.5rem] shadow-2xl border border-white/5'}`}
                >
                    {/* VIDEO DE LA CÁMARA */}
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                    
                    {/* 📻 AUDIO DE LA RADIO (MyRadioStream) */}
                    <audio ref={audioRef} src={AUDIO_STREAM_URL} autoPlay />

                    {/* LOGO Y HORA (DISEÑO WEB PARA NO SATURAR VMIX) */}
                    <div className="absolute top-10 right-10 z-50 flex flex-col items-center gap-1 pointer-events-none">
                        <img src={logoImage} alt="Logo" className="w-48 md:w-64 drop-shadow-2xl" />
                        <div className="px-5 py-1.5 bg-black/40 backdrop-blur-md rounded-xl border border-white/5">
                            <span className="text-white font-black text-xl md:text-3xl tracking-widest tabular-nums">{currentTime}</span>
                        </div>
                    </div>

                    {/* CONTROLES DE LA INTERFAZ */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/95 to-transparent p-10 flex items-center justify-end gap-8 z-50">
                            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 pointer-events-auto">
                                <button onClick={() => setIsMuted(!isMuted)} className="text-white hover:text-cyan-400">
                                    {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
                                </button>
                                <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(e.target.value)} className="w-24 md:w-40 h-1.5 accent-cyan-400 cursor-pointer appearance-none bg-white/20 rounded-full" />
                            </div>
                            <button onClick={toggleFullscreen} className="text-white hover:text-cyan-400 p-2 bg-white/10 rounded-full border border-white/10">
                                {isFullscreen ? <Minimize size={32} /> : <Maximize size={32} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ BANNER DE PUBLICIDAD EXACTO 1400x300 (Pegado a la marquesina) */}
            <div className="w-full flex-none bg-black border-t border-white/10 relative z-50 flex justify-center items-center overflow-hidden h-24 sm:h-32 md:h-40">
                <img
                    key={adSource}
                    src={adSource}
                    alt="Publicidad"
                    className="w-full h-full object-contain animate-fade-in"
                    onError={(e) => { e.target.style.display = 'none'; }} 
                />
                <div className="absolute bottom-1 right-2 bg-black/80 px-2 py-0.5 rounded text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">
                    Espacio Publicitario
                </div>
            </div>

            {/* MARQUESINA INFORMATIVA */}
            <div className="w-full flex-none bg-black/80 backdrop-blur-2xl border-t border-white/10 py-5 relative z-50">
                <div className="whitespace-nowrap flex gap-12 text-white/80 font-bold uppercase text-[12px] tracking-[0.4em] animate-marquee">
                    <span><Sparkles size={14} className="text-yellow-500 mr-2 inline" /> pida tu saludo Fabulosa Play</span>
                    <span><Sparkles size={14} className="text-yellow-500 mr-2 inline" /> CAMARAS, todo Costa Rica,PANAMA</span>
                    <span><Sparkles size={14} className="text-yellow-500 mr-2 inline" /> Publicidad efectiva: 6403-5313</span>
                </div>
            </div>

            <style>{`
                .animate-marquee { animation: marquee 35s linear infinite; }
                @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
                .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
                @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
            `}</style>
        </div>
    );
};

export default Camaras;