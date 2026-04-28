import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Maximize, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Hls from 'hls.js'; 
import logoImage from '../assets/logo_fabulosa.png';

// 📡 CONFIGURACIÓN DE SEÑAL BROADCAST (RADIO DIRECTA)
const AUDIO_RADIO_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8";

// 📹 LISTA DE 9 CÁMARAS (INCLUYENDO LAS NUEVAS)
const YOUTUBE_CAMS = [
    "rnXIjl_Rzy4", "EO_1LWqsCNE", "gFRtAAmiFbE", "loHbMM9JfCs", "uV3wWHSvkfs",
    "nFozEhYTEMo", "8Rw-tZTeBjU", "kkVrj2cr9Ko", "rqBfiegG5qU"
];

const YOUTUBE_API_KEYS = ["AIzaSyDxLD8PviKQwlHBs7rmRm3GoyIKk-aQpww", "AIzaSyACeTldeUs5tbn2Lwr6o_6Lc48rF1nINY0"];

const VERTICAL_ADS = [
    "/publicidad_vertical/anunciete_1.png", "/publicidad_vertical/chinito_express.png",
    "/publicidad_vertical/mexicana_1.png", "/publicidad_vertical/mexicana_2.png", "/publicidad_vertical/unas_yendry.png"
];

const Camaras = () => {
    const navigate = useNavigate();
    const audioRef = useRef(null);
    const containerRef = useRef(null);
    const hlsRef = useRef(null);
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [isAdMode, setIsAdMode] = useState(false);
    const [camIndex, setCamIndex] = useState(0);
    const [adIndex, setAdIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(false);

    // --- 🔊 MOTOR DE AUDIO INMORTAL (INYECCIÓN DIRECTA SIN LOCUTORES) ---
    const sintonizarRadioPermanente = () => {
        const audio = audioRef.current;
        if (Hls.isSupported()) {
            if (hlsRef.current) hlsRef.current.destroy();
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                manifestLoadingMaxRetry: 50,
                levelLoadingMaxRetry: 50
            });
            
            hls.loadSource(AUDIO_RADIO_URL);
            hls.attachMedia(audio);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                audio.play().catch(e => console.log("Audio en espera de señal..."));
            });

            // Auto-Recuperación de señal para que NUNCA se apague
            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    hls.startLoad();
                }
            });
            hlsRef.current = hls;
        } else {
            audio.src = AUDIO_RADIO_URL;
            audio.play();
        }
    };

    const handleMasterStart = () => {
        setIsPlaying(true);
        sintonizarRadioPermanente();
    };

    // --- 📺 LÓGICA DE MONITOREO (ROTACIÓN CADA 2 MIN) ---
    useEffect(() => {
        if (!isPlaying) return;

        const camTimer = setInterval(() => {
            setCamIndex(prev => (prev + 1) % YOUTUBE_CAMS.length);
        }, 120000);

        // Ciclo de Publicidad cada 6 min (Split-Screen)
        const adTimer = setInterval(() => {
            setIsAdMode(true);
            setAdIndex(0);
            let count = 0;
            const rotation = setInterval(() => {
                count++;
                if (count < VERTICAL_ADS.length) setAdIndex(count);
                else {
                    clearInterval(rotation);
                    setIsAdMode(false);
                }
            }, 6000); 
        }, 360000);

        return () => { clearInterval(camTimer); clearInterval(adTimer); };
    }, [isPlaying]);

    return (
        <div className="broadcast-master-screen" style={{ 
            backgroundImage: isAdMode ? "url('/camaras.jpg')" : "none",
            backgroundColor: "#000", backgroundSize: 'cover', backgroundPosition: 'center'
        }}>
            {/* AUDIO DE FONDO PERMANENTE */}
            <audio ref={audioRef} preload="auto" />

            {!isPlaying ? (
                <div className="init-fullscreen-overlay" onClick={handleMasterStart}>
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }} className="play-btn-pro">
                        <Play size={160} fill="#ff0033" stroke="none" />
                    </motion.div>
                    <h1>SISTEMA CENTRAL DE MONITOREO VIP</h1>
                    <p>TOQUE PARA ACTIVAR CONTROL MASTER Y AUDIO DIRECTO</p>
                </div>
            ) : (
                <div className="workspace-broadcast-isolated" ref={containerRef}>
                    
                    {/* 📹 CAJA 1: VIDEO (Independiente y Blindado) */}
                    <motion.div 
                        layout
                        initial={false}
                        animate={{ 
                            width: isAdMode ? "52%" : "100%", 
                            height: isAdMode ? "75%" : "100%",
                            x: isAdMode ? -30 : 0 
                        }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="isolated-viewport-box"
                    >
                        {/* 🛡️ ESCUDO TOTAL (BLOQUEA YOUTUBE) */}
                        <div className="shield-invisible-master"></div>

                        {/* 🏷️ LOGO GIGANTE ORIGINAL */}
                        <div className="broadcast-bug-logo">
                            <img src={logoImage} alt="Fabulosa TV" />
                        </div>

                        {/* 🔘 BOTONES SECRETOS (ESQUINAS) */}
                        <div className="hitbox-btn tr" onClick={() => containerRef.current.requestFullscreen()}></div>
                        <div className="hitbox-btn bl" onClick={() => {
                            setIsMuted(!isMuted);
                            audioRef.current.muted = !isMuted;
                        }}></div>
                        <div className="hitbox-btn br" onClick={() => navigate('/')}></div>

                        <iframe 
                            src={`https://www.youtube.com/embed/${YOUTUBE_CAMS[camIndex]}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&key=${YOUTUBE_API_KEYS[0]}`} 
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
                                <div className="ad-container-vip">
                                    <motion.img key={adIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={VERTICAL_ADS[adIndex]} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            <style jsx>{`
                .broadcast-master-screen { width: 100vw; height: 100vh; overflow: hidden; font-family: 'Inter', sans-serif; position: relative; }
                
                .init-fullscreen-overlay { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #000; cursor: pointer; z-index: 100; position: relative; }
                .init-fullscreen-overlay h1 { color: #fff; font-weight: 900; letter-spacing: 5px; margin-top: 30px; }
                .init-fullscreen-overlay p { color: #ff0033; font-weight: 700; letter-spacing: 2px; }

                .workspace-broadcast-isolated { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; position: relative; gap: 80px; padding: 0 60px; }
                
                .isolated-viewport-box { background: #000; position: relative; overflow: hidden; border-radius: 40px; box-shadow: 0 60px 120px rgba(0,0,0,0.9); border: 4px solid rgba(255,255,255,0.05); }
                iframe { width: 100%; height: 100%; transform: scale(1.4); pointer-events: none; }
                
                .shield-invisible-master { position: absolute; inset: 0; z-index: 50; background: transparent; cursor: default; }

                .hitbox-btn { position: absolute; width: 220px; height: 220px; z-index: 100; cursor: pointer; }
                .tr { top: 0; right: 0; }
                .bl { bottom: 0; left: 0; }
                .br { bottom: 0; right: 0; }

                .broadcast-bug-logo { position: absolute; top: 60px; left: 80px; z-index: 60; }
                .broadcast-bug-logo img { height: 190px; width: auto; object-fit: contain; filter: drop-shadow(0 0 40px rgba(0,0,0,1)); }

                .ads-viewport-isolated { width: 30%; height: 75%; background: rgba(0,0,0,0.95); border: 12px solid #ff0033; border-radius: 70px; padding: 40px; box-shadow: 0 0 100px rgba(255,0,51,0.5); }
                .ad-container-vip { width: 100%; height: 100%; border-radius: 40px; overflow: hidden; }
                .ad-container-vip img { width: 100%; height: 100%; object-fit: cover; }
            `}</style>
        </div>
    );
};

export default Camaras;