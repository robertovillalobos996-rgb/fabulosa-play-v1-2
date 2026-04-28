import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Maximize, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Hls from 'hls.js'; 
import logoImage from '../assets/logo_fabulosa.png';

const AUDIO_RADIO_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8";
const YOUTUBE_CAMS = ["rnXIjl_Rzy4", "EO_1LWqsCNE", "gFRtAAmiFbE", "loHbMM9JfCs", "uV3wWHSvkfs"];
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

    // --- 🔊 MOTOR DE AUDIO INMORTAL (INYECCIÓN DIRECTA) ---
    const sintonizarRadioDirecta = () => {
        const audio = audioRef.current;
        if (Hls.isSupported()) {
            if (hlsRef.current) hlsRef.current.destroy();
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 0,
                manifestLoadingMaxRetry: 20,
                levelLoadingMaxRetry: 20
            });
            
            hls.loadSource(AUDIO_RADIO_URL);
            hls.attachMedia(audio);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                audio.play().catch(e => console.log("Audio en espera..."));
            });

            // Recuperación automática si la señal falla
            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            hls.recoverMediaError();
                            break;
                        default:
                            sintonizarRadioDirecta();
                            break;
                    }
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
        sintonizarRadioDirecta(); // Arranca la radio al primer toque y no se suelta más
    };

    // --- 📺 LÓGICA DE MONITOREO ---
    useEffect(() => {
        if (!isPlaying) return;

        const camTimer = setInterval(() => {
            setCamIndex(prev => (prev + 1) % YOUTUBE_CAMS.length);
        }, 120000); // 2 minutos

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
            }, 6000); // 6 seg por banner
        }, 360000); // 6 minutos

        return () => { clearInterval(camTimer); clearInterval(adTimer); };
    }, [isPlaying]);

    return (
        <div className="broadcast-pro-main" style={{ 
            backgroundImage: isAdMode ? "url('/camaras.jpg')" : "none",
            backgroundColor: "#000", backgroundSize: 'cover', backgroundPosition: 'center'
        }}>
            {/* AUDIO EN CAPA BASE (Persistente) */}
            <audio ref={audioRef} preload="auto" />

            {!isPlaying ? (
                <div className="init-fullscreen-screen" onClick={handleMasterStart}>
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }} className="play-ring-giant">
                        <Play size={140} fill="#ff0033" stroke="none" />
                    </motion.div>
                    <h1>CONTROL MASTER DE MONITOREO</h1>
                    <p>TOQUE PARA ACTIVAR SEÑAL DIRECTA (AUDIO PERMANENTE)</p>
                </div>
            ) : (
                <div className="workspace-dynamic-separated" ref={containerRef}>
                    
                    {/* 📹 CAJA 1: VIDEO (Independiente) */}
                    <motion.div 
                        layout
                        initial={false}
                        animate={{ 
                            width: isAdMode ? "55%" : "100%", 
                            height: isAdMode ? "75%" : "100%",
                            x: isAdMode ? -25 : 0 
                        }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="isolated-viewport-box"
                    >
                        {/* 🛡️ ESCUDO TOTAL */}
                        <div className="shield-invisible-total"></div>

                        {/* 🏷️ LOGO GIGANTE ORIGINAL */}
                        <div className="broadcast-brand-bug">
                            <img src={logoImage} alt="Fabulosa TV" />
                        </div>

                        {/* 🔘 BOTONES SECRETOS (ESQUINAS) */}
                        <div className="secret-hitbox tr" onClick={() => containerRef.current.requestFullscreen()}></div>
                        <div className="secret-hitbox bl" onClick={() => {
                            setIsMuted(!isMuted);
                            audioRef.current.muted = !isMuted;
                        }}></div>
                        <div className="secret-hitbox br" onClick={() => navigate('/')}></div>

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
                                className="ads-isolated-frame"
                            >
                                <div className="ad-content-pro">
                                    <motion.img key={adIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={VERTICAL_ADS[adIndex]} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            <style jsx>{`
                .broadcast-pro-main { width: 100vw; height: 100vh; overflow: hidden; font-family: 'Inter', sans-serif; position: relative; }
                
                .init-fullscreen-screen { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #000; cursor: pointer; z-index: 100; position: relative; }
                .init-fullscreen-screen h1 { color: #fff; font-weight: 900; letter-spacing: 5px; margin-top: 30px; }
                .init-fullscreen-screen p { color: #ff0033; font-weight: 700; letter-spacing: 2px; }

                .workspace-dynamic-separated { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; position: relative; gap: 60px; padding: 0 50px; }
                
                .isolated-viewport-box { background: #000; position: relative; overflow: hidden; border-radius: 40px; box-shadow: 0 60px 120px rgba(0,0,0,0.9); border: 4px solid rgba(255,255,255,0.05); }
                iframe { width: 100%; height: 100%; transform: scale(1.4); pointer-events: none; }
                
                .shield-invisible-total { position: absolute; inset: 0; z-index: 50; background: transparent; cursor: default; }

                .secret-hitbox { position: absolute; width: 200px; height: 200px; z-index: 100; cursor: pointer; }
                .tr { top: 0; right: 0; }
                .bl { bottom: 0; left: 0; }
                .br { bottom: 0; right: 0; }

                .broadcast-brand-bug { position: absolute; top: 60px; left: 80px; z-index: 60; }
                .broadcast-brand-bug img { height: 180px; width: auto; object-fit: contain; filter: drop-shadow(0 0 40px rgba(0,0,0,1)); }

                .ads-isolated-frame { width: 32%; height: 75%; background: rgba(0,0,0,0.95); border: 12px solid #ff0033; border-radius: 70px; padding: 40px; box-shadow: 0 0 100px rgba(255,0,51,0.5); }
                .ad-content-pro { width: 100%; height: 100%; border-radius: 40px; overflow: hidden; }
                .ad-content-pro img { width: 100%; height: 100%; object-fit: cover; }
            `}</style>
        </div>
    );
};

export default Camaras;