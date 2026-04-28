import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Maximize, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Hls from 'hls.js'; 
import logoImage from '../assets/logo_fabulosa.png';

const AUDIO_RADIO_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8";
const YOUTUBE_CAMS = ["rnXIjl_Rzy4", "EO_1LWqsCNE", "gFRtAAmiFbE", "loHbMM9JfCs", "uV3wWHSvkfs"];
const YOUTUBE_API_KEYS = ["AIzaSyDxLD8PviKQwlHBs7rmRm3GoyIKk-aQpww", "AIzaSyACeTldeUs5tbn2Lwr6o_6Lc48rF1nINY0", "AIzaSyBUk0oq1zjA6BKx5HK8DEQc1TxQqreqGtk"];

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

    // --- 🔊 CIRUGÍA DE AUDIO DEFINITIVA ---
    const sintonizarRadio = () => {
        if (hlsRef.current) hlsRef.current.destroy();
        
        const audio = audioRef.current;
        if (Hls.isSupported()) {
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 0
            });
            hls.loadSource(AUDIO_RADIO_URL);
            hls.attachMedia(audio);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                audio.play().catch(e => console.error("Error en play:", e));
            });
            hlsRef.current = hls;
        } else {
            audio.src = AUDIO_RADIO_URL;
            audio.play();
        }
    };

    const handleMasterStart = () => {
        setIsPlaying(true);
        // Iniciamos la radio de una vez para asegurar que el navegador dé permiso
        sintonizarRadio();
    };

    // --- 📺 LÓGICA DE ROTACIÓN ---
    useEffect(() => {
        if (!isPlaying) return;

        const camTimer = setInterval(() => {
            setCamIndex(prev => (prev + 1) % YOUTUBE_CAMS.length);
        }, 120000);

        const adTimer = setInterval(() => {
            setIsAdMode(true);
            let count = 0;
            const adRotation = setInterval(() => {
                count++;
                if (count < VERTICAL_ADS.length) setAdIndex(count);
                else {
                    clearInterval(adRotation);
                    setIsAdMode(false);
                    setAdIndex(0);
                }
            }, 6000);
        }, 360000);

        return () => { clearInterval(camTimer); clearInterval(adTimer); };
    }, [isPlaying]);

    return (
        <div className="broadcast-pro-screen" style={{ 
            backgroundImage: isAdMode ? "url('/camaras.jpg')" : "none",
            backgroundColor: "#000", backgroundSize: 'cover', backgroundPosition: 'center'
        }}>
            <audio ref={audioRef} />

            {!isPlaying ? (
                <div className="start-overlay" onClick={handleMasterStart}>
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }} className="play-ring">
                        <Play size={120} fill="#ff0033" stroke="none" />
                    </motion.div>
                    <h1>CONTROL MASTER DE CÁMARAS</h1>
                    <p>TOQUE PARA ACTIVAR SEÑAL CON AUDIO EN VIVO</p>
                </div>
            ) : (
                <div className="broadcast-grid" ref={containerRef}>
                    
                    {/* 📹 CAJA DE VIDEO (Individual y Fluida) */}
                    <motion.div 
                        layout
                        initial={false}
                        animate={{ 
                            width: isAdMode ? "55%" : "100%", 
                            height: isAdMode ? "80%" : "100%",
                            x: isAdMode ? -30 : 0 
                        }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="video-isolated-box"
                    >
                        {/* 🛡️ ESCUDO TOTAL */}
                        <div className="anti-click-shield"></div>

                        {/* 🏷️ LOGO GIGANTE ORIGINAL */}
                        <div className="main-tv-logo">
                            <img src={logoImage} alt="Fabulosa TV" />
                        </div>

                        {/* 🔘 BOTONES SECRETOS */}
                        <div className="hitbox tr" onClick={() => containerRef.current.requestFullscreen()}></div>
                        <div className="hitbox bl" onClick={() => {
                            setIsMuted(!isMuted);
                            audioRef.current.muted = !isMuted;
                        }}></div>
                        <div className="hitbox br" onClick={() => navigate('/')}></div>

                        <iframe 
                            src={`https://www.youtube.com/embed/${YOUTUBE_CAMS[camIndex]}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&key=${YOUTUBE_API_KEYS[0]}`} 
                            frameBorder="0" allow="autoplay; encrypted-media"
                        />
                    </motion.div>

                    {/* 💰 CAJA DE PUBLICIDAD (Individual y Separada) */}
                    <AnimatePresence>
                        {isAdMode && (
                            <motion.div 
                                initial={{ x: 800, opacity: 0 }} 
                                animate={{ x: 0, opacity: 1 }} 
                                exit={{ x: 800, opacity: 0 }}
                                className="ads-isolated-box"
                            >
                                <div className="ad-inner">
                                    <motion.img key={adIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={VERTICAL_ADS[adIndex]} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            <style jsx>{`
                .broadcast-pro-screen { width: 100vw; height: 100vh; overflow: hidden; font-family: 'Inter', sans-serif; position: relative; }
                .start-overlay { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #000; cursor: pointer; z-index: 100; position: relative; }
                .start-overlay h1 { color: #fff; font-weight: 900; letter-spacing: 5px; margin-top: 30px; }
                .start-overlay p { color: #ff0033; font-weight: 700; letter-spacing: 2px; }

                .broadcast-grid { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; position: relative; gap: 50px; padding: 0 40px; }
                
                .video-isolated-box { background: #000; position: relative; overflow: hidden; border-radius: 30px; box-shadow: 0 40px 100px rgba(0,0,0,0.9); border: 2px solid rgba(255,255,255,0.05); }
                iframe { width: 100%; height: 100%; transform: scale(1.4); pointer-events: none; }
                
                .anti-click-shield { position: absolute; inset: 0; z-index: 50; background: transparent; }

                .hitbox { position: absolute; width: 180px; height: 180px; z-index: 100; cursor: pointer; }
                .tr { top: 0; right: 0; }
                .bl { bottom: 0; left: 0; }
                .br { bottom: 0; right: 0; }

                .main-tv-logo { position: absolute; top: 60px; left: 70px; z-index: 60; }
                .main-tv-logo img { height: 160px; width: auto; object-fit: contain; filter: drop-shadow(0 0 40px rgba(0,0,0,1)); }

                .ads-isolated-box { width: 30%; height: 75%; background: rgba(0,0,0,0.9); border: 10px solid #ff0033; border-radius: 60px; padding: 30px; box-shadow: 0 0 80px rgba(255,0,51,0.5); }
                .ad-inner { width: 100%; height: 100%; border-radius: 40px; overflow: hidden; }
                .ad-inner img { width: 100%; height: 100%; object-fit: cover; }
            `}</style>
        </div>
    );
};

export default Camaras;