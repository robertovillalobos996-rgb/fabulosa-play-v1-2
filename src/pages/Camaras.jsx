import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX, Play, Pause, Maximize, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImage from '../assets/logo_fabulosa.png';

// 📡 CONFIGURACIÓN BROADCAST VIP
const AUDIO_LOCUTORES = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8";
const SELLO_ID_URL = "/audio/sello_fabulosa.mp3"; // Asegúrese de que el archivo esté en public/audio/

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

const AD_CYCLE = 360000; // 6 Minutos
const BANNER_TIME = 6000;  // 6 Segundos

const Camaras = () => {
    const audioRef = useRef(null);
    const selloRef = useRef(null);
    const containerRef = useRef(null);
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSelloPlaying, setIsSelloPlaying] = useState(false);
    const [camIndex, setCamIndex] = useState(0);
    const [adIndex, setAdIndex] = useState(0);
    const [isAdMode, setIsAdMode] = useState(false);
    const [keyIndex, setKeyIndex] = useState(0);

    // --- 🎵 LÓGICA DE AUDIO PROFESIONAL (Sello -> Radio) ---
    const startMonitoring = () => {
        setIsPlaying(true);
        setIsSelloPlaying(true);
        if (selloRef.current) {
            selloRef.current.play().catch(e => console.log("Interacción requerida"));
        }
    };

    const handleSelloEnd = () => {
        setIsSelloPlaying(false);
        if (audioRef.current) {
            audioRef.current.play(); // Entran los locutores
        }
    };

    // --- 🔄 ROTACIÓN DE CÁMARAS Y PUBLICIDAD ---
    useEffect(() => {
        if (!isPlaying) return;
        const camTimer = setInterval(() => {
            setCamIndex(prev => (prev + 1) % YOUTUBE_CAMS.length);
            setKeyIndex(prev => (prev + 1) % YOUTUBE_API_KEYS.length);
        }, 120000);

        const adTimer = setInterval(() => {
            setIsAdMode(true);
            let count = 0;
            const bannerInterval = setInterval(() => {
                count++;
                if (count < VERTICAL_ADS.length) setAdIndex(count);
                else {
                    clearInterval(bannerInterval);
                    setIsAdMode(false);
                    setAdIndex(0);
                }
            }, BANNER_TIME);
        }, AD_CYCLE);

        return () => { clearInterval(camTimer); clearInterval(adTimer); };
    }, [isPlaying]);

    return (
        <div className="broadcast-pro-main" style={{ 
            backgroundImage: isAdMode ? "url('/camaras.jpg')" : "none",
            backgroundColor: "#000", backgroundSize: 'cover', backgroundPosition: 'center'
        }}>
            {/* ELEMENTOS DE AUDIO */}
            <audio ref={selloRef} src={SELLO_ID_URL} onEnded={handleSelloEnd} />
            <audio ref={audioRef} src={AUDIO_LOCUTORES} loop />

            {!isPlaying ? (
                <div className="master-power-on" onClick={startMonitoring}>
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity }} className="power-icon">
                        <Play size={100} fill="#ff0033" stroke="none" />
                    </motion.div>
                    <h1>SISTEMA DE MONITOREO VIP</h1>
                    <p>TOQUE PARA ACTIVAR CONTROL MASTER</p>
                </div>
            ) : (
                <div className="broadcast-layout-full" ref={containerRef}>
                    
                    {/* 📺 REPRODUCTOR BLINDADO */}
                    <motion.div 
                        animate={{ 
                            width: isAdMode ? "60%" : "100%", 
                            height: isAdMode ? "75%" : "100%",
                            x: isAdMode ? -20 : 0 
                        }}
                        className="player-viewport"
                    >
                        {/* 🛡️ ESCUDO INVISIBLE (Bloquea YouTube) */}
                        <div className="yt-shield-blindaje"></div>

                        {/* 🏷️ LOGO TV PROFESIONAL (Flotante Arriba-Izquierda) */}
                        <div className="tv-logo-bug">
                            <img src={logoImage} alt="Fabulosa Logo" />
                            {isSelloPlaying && <div className="id-tag">IDENTIFICANDO SEÑAL...</div>}
                        </div>

                        <iframe 
                            src={`https://www.youtube.com/embed/${YOUTUBE_CAMS[camIndex]}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&key=${YOUTUBE_API_KEYS[keyIndex]}`} 
                            frameBorder="0" allow="autoplay; encrypted-media"
                        />

                        {/* BOTONES INVISIBLES DE CONTROL (Esquinas) */}
                        <button className="hidden-fs-btn" onClick={() => containerRef.current.requestFullscreen()} />
                    </motion.div>

                    {/* 💰 CAJA DE PUBLICIDAD (SPLIT SCREEN) */}
                    <AnimatePresence>
                        {isAdMode && (
                            <motion.div 
                                initial={{ x: 800, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 800, opacity: 0 }}
                                className="ad-split-box"
                            >
                                <div className="ad-wrapper-vip">
                                    <motion.img key={adIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={VERTICAL_ADS[adIndex]} />
                                    <div className="ad-progress">
                                        <motion.div 
                                            key={`bar-${adIndex}`} initial={{ width: 0 }} animate={{ width: "100%" }}
                                            transition={{ duration: BANNER_TIME/1000, ease: "linear" }}
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
                .broadcast-pro-main { width: 100vw; height: 100vh; overflow: hidden; font-family: 'Inter', sans-serif; }
                
                .master-power-on { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #000; cursor: pointer; }
                .master-power-on h1 { font-size: 1.5rem; font-weight: 900; letter-spacing: 4px; color: #fff; margin-top: 20px; }
                .master-power-on p { color: #ff0033; font-weight: 700; font-size: 0.7rem; letter-spacing: 2px; }

                .broadcast-layout-full { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; position: relative; }
                
                .player-viewport { background: #000; position: relative; overflow: hidden; box-shadow: 0 0 100px rgba(0,0,0,0.9); }
                iframe { width: 100%; height: 100%; transform: scale(1.15); pointer-events: none; }
                
                /* Blindaje */
                .yt-shield-blindaje { position: absolute; inset: 0; z-index: 10; background: transparent; cursor: default; }

                /* Logo Bug */
                .tv-logo-bug { position: absolute; top: 40px; left: 40px; z-index: 20; display: flex; flex-direction: column; gap: 8px; }
                .tv-logo-bug img { height: 50px; filter: drop-shadow(0 0 20px rgba(0,0,0,0.8)); }
                .id-tag { background: #ff0033; color: white; padding: 3px 10px; font-size: 9px; font-weight: 900; border-radius: 2px; text-transform: uppercase; }

                .hidden-fs-btn { position: absolute; top: 0; right: 0; width: 100px; height: 100px; background: transparent; border: none; z-index: 30; cursor: pointer; }

                .ad-split-box { width: 30%; height: 75%; background: rgba(0,0,0,0.85); border: 3px solid #ff0033; border-radius: 40px; padding: 15px; }
                .ad-wrapper-vip { width: 100%; height: 100%; position: relative; border-radius: 25px; overflow: hidden; }
                .ad-wrapper-vip img { width: 100%; height: 100%; object-fit: cover; }
                .ad-progress { position: absolute; bottom: 0; width: 100%; height: 6px; background: rgba(255,255,255,0.1); }
                .ad-progress .fill { height: 100%; background: #ff0033; }
            `}</style>
        </div>
    );
};

export default Camaras;