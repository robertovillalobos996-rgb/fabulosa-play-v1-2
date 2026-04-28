import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Maximize, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Hls from 'hls.js'; 
import logoImage from '../assets/logo_fabulosa.png';

// 📡 CONFIGURACIÓN DE SEÑAL BROADCAST
const AUDIO_RADIO_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8";
const SELLO_ID_URL = "/audio/sello_fabulosa.mp3"; 

const YOUTUBE_API_KEYS = [
    "AIzaSyDxLD8PviKQwlHBs7rmRm3GoyIKk-aQpww", "AIzaSyACeTldeUs5tbn2Lwr6o_6Lc48rF1nINY0",
    "AIzaSyBUk0oq1zjA6BKx5HK8DEQc1TxQqreqGtk", "AIzaSyBys-0J3T5Ou_fdPGxqYC5LWDMgppwD0Y4",
    "AIzaSyDHdkSo4WSHjYL4nHFU9wKmXW5D9PScO4g", "AIzaSyDJqDMnZsYHyJtzahtvv1r55Z-JfgLk5TU",
    "AIzaSyCruj7UZTEmElS3ZUeUBmYPecbsAA667U8", "AIzaSyBfMNrgQESeymMQ9srVBHKjXB3_WeRfkXE",
    "AIzaSyB1e_YSB74yAelvAhapDWu11VPLz2wBkUg", "AIzaSyCsvViGGiPJxx8-FkSwQvHE2T_U8d2UO5E",
    "AIzaSyBRvdUqolryjMRustJUyqN_HtkjRCbHLfI", "AIzaSyCdmCZW6J49Onl-QAf3cTsNu0im84EBVZc",
    "AIzaSyCeref7W3di_9o6W3YnEtqgvCQyvyQ5a5Q", "AIzaSyAwtE19mD7rpv1pu5nB4R8Q0HmEX9OkgJI"
];

const YOUTUBE_CAMS = ["rnXIjl_Rzy4", "EO_1LWqsCNE", "gFRtAAmiFbE", "loHbMM9JfCs", "uV3wWHSvkfs"];
const VERTICAL_ADS = [
    "/publicidad_vertical/anunciete_1.png", "/publicidad_vertical/chinito_express.png",
    "/publicidad_vertical/mexicana_1.png", "/publicidad_vertical/mexicana_2.png", "/publicidad_vertical/unas_yendry.png"
];

const CICLO_PUBLICIDAD = 360000; // 6 Minutos
const DURACION_BANNER = 6000;    // 6 Segundos

const Camaras = () => {
    const navigate = useNavigate();
    const audioRef = useRef(null);
    const selloRef = useRef(null);
    const hlsRef = useRef(null);
    const containerRef = useRef(null);
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [isAdMode, setIsAdMode] = useState(false);
    const [camIndex, setCamIndex] = useState(0);
    const [adIndex, setAdIndex] = useState(0);
    const [keyIndex, setKeyIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(false);

    // --- 🔊 MOTOR HLS PROFESIONAL (Igual que RadioPremium) ---
    const startRadioAnnouncers = () => {
        const audio = audioRef.current;
        if (Hls.isSupported()) {
            if (hlsRef.current) hlsRef.current.destroy();
            const hls = new Hls();
            hls.loadSource(AUDIO_RADIO_URL);
            hls.attachMedia(audio);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                audio.play();
            });
            hlsRef.current = hls;
        } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
            audio.src = AUDIO_RADIO_URL;
            audio.play();
        }
    };

    const handleStartMonitoring = () => {
        setIsPlaying(true);
        if (selloRef.current) {
            selloRef.current.play().catch(e => console.log("Permiso audio..."));
        }
    };

    // --- 📺 LÓGICA DE CICLOS ---
    useEffect(() => {
        if (!isPlaying) return;

        // Rotación de Cámaras (2 min)
        const camTimer = setInterval(() => {
            setCamIndex(prev => (prev + 1) % YOUTUBE_CAMS.length);
            setKeyIndex(prev => (prev + 1) % YOUTUBE_API_KEYS.length);
        }, 120000);

        // Ciclo de Publicidad (6 min)
        const adTimer = setInterval(() => {
            setIsAdMode(true);
            setAdIndex(0);
            let count = 0;
            const bannerRotation = setInterval(() => {
                count++;
                if (count < VERTICAL_ADS.length) {
                    setAdIndex(count);
                } else {
                    clearInterval(bannerRotation);
                    setIsAdMode(false);
                }
            }, DURACION_BANNER);
        }, CICLO_PUBLICIDAD);

        return () => { 
            clearInterval(camTimer); 
            clearInterval(adTimer);
            if (hlsRef.current) hlsRef.current.destroy();
        };
    }, [isPlaying]);

    return (
        <div className="broadcast-pro-main" style={{ 
            backgroundImage: isAdMode ? "url('/camaras.jpg')" : "none",
            backgroundColor: "#000", backgroundSize: 'cover', backgroundPosition: 'center'
        }}>
            {/* AUDIOS: Sello y Radio con Locutores */}
            <audio ref={selloRef} src={SELLO_ID_URL} onEnded={startRadioAnnouncers} />
            <audio ref={audioRef} />

            {!isPlaying ? (
                <div className="power-on-overlay" onClick={handleStartMonitoring}>
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity }} className="play-icon-giant">
                        <Play size={130} fill="#ff0033" stroke="none" />
                    </motion.div>
                    <h1>CONTROL MASTER DE MONITOREO</h1>
                    <p>TOQUE PARA ACTIVAR SEÑAL VIP</p>
                </div>
            ) : (
                <div className="workspace-dynamic" ref={containerRef}>
                    
                    {/* 📹 CAJA 1: VIDEO (Independiente) */}
                    <motion.div 
                        animate={{ 
                            width: isAdMode ? "55%" : "100%", 
                            height: isAdMode ? "75%" : "100%",
                            x: isAdMode ? -20 : 0 
                        }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="player-viewport-isolated"
                    >
                        {/* 🛡️ ESCUDO TOTAL */}
                        <div className="shield-yt-blindado"></div>

                        {/* 🏷️ LOGO GIGANTE ORIGINAL */}
                        <div className="broadcast-bug-logo">
                            <img src={logoImage} alt="Fabulosa" />
                        </div>

                        {/* 🔘 BOTONES SECRETOS */}
                        <div className="secret-spot tr" onClick={() => containerRef.current.requestFullscreen()}></div>
                        <div className="secret-spot bl" onClick={() => {
                            setIsMuted(!isMuted);
                            audioRef.current.muted = !isMuted;
                        }}></div>
                        <div className="secret-spot br" onClick={() => navigate('/')}></div>

                        <iframe 
                            src={`https://www.youtube.com/embed/${YOUTUBE_CAMS[camIndex]}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&key=${YOUTUBE_API_KEYS[keyIndex]}`} 
                            frameBorder="0" allow="autoplay; encrypted-media"
                        />
                    </motion.div>

                    {/* 💰 CAJA 2: PUBLICIDAD (Independiente y Separada) */}
                    <AnimatePresence>
                        {isAdMode && (
                            <motion.div 
                                initial={{ x: 800, opacity: 0 }} 
                                animate={{ x: 0, opacity: 1 }} 
                                exit={{ x: 800, opacity: 0 }}
                                className="ads-viewport-isolated"
                            >
                                <div className="ad-container-clean">
                                    <motion.img 
                                        key={adIndex} 
                                        initial={{ opacity: 0, scale: 0.9 }} 
                                        animate={{ opacity: 1, scale: 1 }} 
                                        src={VERTICAL_ADS[adIndex]} 
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            <style jsx>{`
                .broadcast-pro-main { width: 100vw; height: 100vh; overflow: hidden; font-family: 'Inter', sans-serif; }
                
                .power-on-overlay { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #000; cursor: pointer; }
                .power-on-overlay h1 { color: #fff; font-weight: 900; letter-spacing: 5px; margin-top: 30px; }
                .power-on-overlay p { color: #ff0033; font-weight: 700; font-size: 0.8rem; letter-spacing: 2px; }

                .workspace-dynamic { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; position: relative; gap: 60px; padding: 0 40px; }
                
                .player-viewport-isolated { background: #000; position: relative; overflow: hidden; box-shadow: 0 50px 100px rgba(0,0,0,0.9); border: 2px solid rgba(255,255,255,0.05); border-radius: 30px; }
                iframe { width: 100%; height: 100%; transform: scale(1.3); pointer-events: none; }
                
                .shield-yt-blindado { position: absolute; inset: 0; z-index: 50; background: transparent; cursor: default; }

                .secret-spot { position: absolute; width: 160px; height: 160px; z-index: 100; cursor: pointer; }
                .tr { top: 0; right: 0; }
                .bl { bottom: 0; left: 0; }
                .br { bottom: 0; right: 0; }

                .broadcast-bug-logo { position: absolute; top: 60px; left: 70px; z-index: 60; }
                .broadcast-bug-logo img { height: 140px; width: auto; object-fit: contain; filter: drop-shadow(0 0 35px rgba(0,0,0,1)); }

                .ads-viewport-isolated { width: 32%; height: 75%; background: rgba(0,0,0,0.9); border: 10px solid #ff0033; border-radius: 60px; padding: 30px; box-shadow: 0 0 80px rgba(255,0,51,0.5); }
                .ad-container-clean { width: 100%; height: 100%; position: relative; border-radius: 35px; overflow: hidden; }
                .ad-container-clean img { width: 100%; height: 100%; object-fit: cover; }
            `}</style>
        </div>
    );
};

export default Camaras;