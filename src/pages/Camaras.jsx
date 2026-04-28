import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Maximize, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Hls from 'hls.js'; 
import logoImage from '../assets/logo_fabulosa.png';

// 📡 CONFIGURACIÓN TÉCNICA BROADCAST
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

    // --- 🔊 LÓGICA DE AUDIO (Sello -> Radio HLS) ---
    const startRadioHLS = () => {
        const audio = audioRef.current;
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(AUDIO_RADIO_URL);
            hls.attachMedia(audio);
            hls.on(Hls.Events.MANIFEST_PARSED, () => audio.play());
            hlsRef.current = hls;
        } else {
            audio.src = AUDIO_RADIO_URL;
            audio.play();
        }
    };

    const handleStartFull = () => {
        setIsPlaying(true);
        if (selloRef.current) {
            selloRef.current.play().catch(e => console.log("Gesto requerido"));
        }
    };

    const onSelloFinished = () => {
        startRadioHLS(); // Termina el sello, entran los locutores
    };

    // --- 📺 LÓGICA DE CÁMARAS Y PUBLICIDAD ---
    useEffect(() => {
        if (!isPlaying) return;

        // Rotación de Cámaras cada 2 min
        const camTimer = setInterval(() => {
            setCamIndex(prev => (prev + 1) % YOUTUBE_CAMS.length);
            setKeyIndex(prev => (prev + 1) % YOUTUBE_API_KEYS.length);
        }, 120000);

        // Ciclo de Publicidad cada 6 min
        const masterAdTimer = setInterval(() => {
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
            clearInterval(masterAdTimer);
            if (hlsRef.current) hlsRef.current.destroy();
        };
    }, [isPlaying]);

    return (
        <div className="broadcast-master-pro" style={{ 
            backgroundImage: isAdMode ? "url('/camaras.jpg')" : "none",
            backgroundColor: "#000", backgroundSize: 'cover', backgroundPosition: 'center'
        }}>
            <audio ref={selloRef} src={SELLO_ID_URL} onEnded={onSelloFinished} />
            <audio ref={audioRef} />

            {!isPlaying ? (
                <div className="init-fullscreen-screen" onClick={handleStartFull}>
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity }} className="play-icon-master">
                        <Play size={120} fill="#ff0033" stroke="none" />
                    </motion.div>
                    <h1>SISTEMA CENTRAL DE MONITOREO</h1>
                    <p>TOQUE PARA SINTONIZAR CONTROL MASTER</p>
                </div>
            ) : (
                <div className="workspace-broadcast" ref={containerRef}>
                    
                    {/* 📹 REPRODUCTOR BLINDADO */}
                    <motion.div 
                        animate={{ 
                            width: isAdMode ? "60%" : "100%", 
                            height: isAdMode ? "85%" : "100%",
                            x: isAdMode ? -30 : 0 
                        }}
                        transition={{ duration: 1, ease: "circOut" }}
                        className="viewport-main"
                    >
                        {/* 🛡️ ESCUDO CONTRA YOUTUBE (Invisible) */}
                        <div className="shield-invisible-total"></div>

                        {/* 🏷️ LOGO GIGANTE ORIGINAL */}
                        <div className="tv-logo-bug-large">
                            <img src={logoImage} alt="Fabulosa TV" />
                        </div>

                        {/* 🔘 BOTONES DE CONTROL INVISIBLES */}
                        <div className="secret-btn top-right" onClick={() => containerRef.current.requestFullscreen()}></div>
                        <div className="secret-btn bottom-left" onClick={() => {
                            setIsMuted(!isMuted);
                            audioRef.current.muted = !isMuted;
                        }}></div>

                        <iframe 
                            src={`https://www.youtube.com/embed/${YOUTUBE_CAMS[camIndex]}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&key=${YOUTUBE_API_KEYS[keyIndex]}`} 
                            frameBorder="0" allow="autoplay; encrypted-media"
                        />
                    </motion.div>

                    {/* 💰 PUBLICIDAD SPLIT-SCREEN */}
                    <AnimatePresence>
                        {isAdMode && (
                            <motion.div 
                                initial={{ x: 800, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 800, opacity: 0 }}
                                className="ads-panel-right"
                            >
                                <div className="ad-container-vip">
                                    <motion.img key={adIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={VERTICAL_ADS[adIndex]} />
                                    <div className="ad-timer-bar">
                                        <motion.div 
                                            key={`t-${adIndex}`} initial={{ width: 0 }} animate={{ width: "100%" }}
                                            transition={{ duration: DURACION_BANNER/1000, ease: "linear" }}
                                            className="fill" 
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            <style jsx>{`
                .broadcast-master-pro { width: 100vw; height: 100vh; overflow: hidden; font-family: 'Inter', sans-serif; }
                
                .init-fullscreen-screen { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #000; cursor: pointer; }
                .init-fullscreen-screen h1 { color: #fff; font-weight: 900; letter-spacing: 5px; margin-top: 30px; }
                .init-fullscreen-screen p { color: #ff0033; font-weight: 700; font-size: 0.8rem; letter-spacing: 2px; }

                .workspace-broadcast { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; position: relative; }
                
                .viewport-main { background: #000; position: relative; overflow: hidden; box-shadow: 0 0 100px rgba(0,0,0,0.8); }
                iframe { width: 100%; height: 100%; transform: scale(1.3); pointer-events: none; }
                
                /* Blindaje */
                .shield-invisible-total { position: absolute; inset: 0; z-index: 50; background: transparent; }

                /* Botones Secretos */
                .secret-btn { position: absolute; width: 120px; height: 120px; z-index: 100; cursor: crosshair; }
                .top-right { top: 0; right: 0; }
                .bottom-left { bottom: 0; left: 0; }

                /* Logo Bug Large */
                .tv-logo-bug-large { position: absolute; top: 50px; left: 50px; z-index: 60; }
                .tv-logo-bug-large img { height: 110px; width: auto; object-fit: contain; filter: drop-shadow(0 0 25px rgba(0,0,0,0.9)); }

                /* Panel Publicitario */
                .ads-panel-right { width: 35%; height: 85%; background: rgba(0,0,0,0.85); border: 5px solid #ff0033; border-radius: 50px; padding: 25px; box-shadow: 0 0 50px rgba(255,0,51,0.3); }
                .ad-container-vip { width: 100%; height: 100%; position: relative; border-radius: 30px; overflow: hidden; }
                .ad-container-vip img { width: 100%; height: 100%; object-fit: cover; }
                .ad-timer-bar { position: absolute; bottom: 0; left: 0; width: 100%; height: 10px; background: rgba(255,255,255,0.1); }
                .ad-timer-bar .fill { height: 100%; background: #ff0033; }
            `}</style>
        </div>
    );
};

export default Camaras;