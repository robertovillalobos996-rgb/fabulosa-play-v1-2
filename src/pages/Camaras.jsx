import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX, Play, Pause, Maximize, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImage from '../assets/logo_fabulosa.png';

// 📡 CONFIGURACIÓN TÉCNICA (PROTEGIENDO SUS LLAVES)
const AUDIO_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8";

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
    const containerRef = useRef(null);
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [camIndex, setCamIndex] = useState(0);
    const [adIndex, setAdIndex] = useState(0);
    const [isAdMode, setIsAdMode] = useState(false);
    const [keyIndex, setKeyIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // --- 🔊 AUDIO DE FONDO AUTOMÁTICO ---
    const handleStart = () => {
        setIsPlaying(true);
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.log("Permiso de audio requerido"));
        }
    };

    // --- 🔄 ROTACIÓN DE CÁMARAS (2 MINUTOS) ---
    useEffect(() => {
        if (!isPlaying || isPaused) return;
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCamIndex((prev) => (prev + 1) % YOUTUBE_CAMS.length);
                setKeyIndex((prev) => (prev + 1) % YOUTUBE_API_KEYS.length);
                setIsTransitioning(false);
            }, 600);
        }, 120000);
        return () => clearInterval(interval);
    }, [isPlaying, isPaused]);

    // --- 💰 SISTEMA DE PUBLICIDAD (6 MINUTOS) ---
    useEffect(() => {
        if (!isPlaying || isPaused) return;
        const masterInterval = setInterval(() => {
            setIsAdMode(true);
            setAdIndex(0);
            let count = 0;
            const bannerRotation = setInterval(() => {
                count++;
                if (count < VERTICAL_ADS.length) setAdIndex(count);
                else {
                    clearInterval(bannerRotation);
                    setIsAdMode(false);
                }
            }, BANNER_TIME);
        }, AD_CYCLE);
        return () => clearInterval(masterInterval);
    }, [isPlaying, isPaused]);

    return (
        <div className="cam-broadcast-container" style={{ 
            backgroundImage: isAdMode ? "url('/camaras.jpg')" : "none",
            backgroundColor: "#000", backgroundSize: 'cover', backgroundPosition: 'center'
        }}>
            <audio ref={audioRef} src={AUDIO_URL} loop />

            <header className="broadcast-top-bar">
                <Link to="/" className="exit-gate">
                    <ArrowLeft size={20} /> <span>CENTRAL</span>
                </Link>
                <img src={logoImage} alt="Logo" className="master-logo-bug" />
                <div className="air-signal">
                    <div className="dot" /> MONITOREO LIVE
                </div>
            </header>

            <div className="broadcast-floor" ref={containerRef}>
                <motion.div 
                    layout
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className={`vid-frame ${isAdMode ? 'split-left' : 'fullscreen-box'} ${isTransitioning ? 'fx-fade' : ''}`}
                >
                    {!isPlaying ? (
                        <div className="init-overlay" onClick={handleStart}>
                            <Play size={80} fill="#ff0033" stroke="none" />
                            <p>INICIAR TRANSMISIÓN VIP</p>
                        </div>
                    ) : (
                        <iframe 
                            src={`https://www.youtube.com/embed/${YOUTUBE_CAMS[camIndex]}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&key=${YOUTUBE_API_KEYS[keyIndex]}`} 
                            frameBorder="0" allow="autoplay; encrypted-media"
                        />
                    )}
                </motion.div>

                <AnimatePresence>
                    {isAdMode && (
                        <motion.div 
                            initial={{ x: 800, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 800, opacity: 0 }}
                            className="ad-frame-right"
                        >
                            <div className="ad-content-box">
                                <motion.img 
                                    key={adIndex}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    src={VERTICAL_ADS[adIndex]} 
                                />
                                <div className="timer-line">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        key={`t-${adIndex}`}
                                        transition={{ duration: BANNER_TIME/1000, ease: "linear" }}
                                        className="fill"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <footer className="broadcast-base-bar">
                <div className="f-left">
                    <button onClick={() => {
                        setIsPaused(!isPaused);
                        if (!isPaused) audioRef.current.pause();
                        else audioRef.current.play();
                    }}>
                        {isPaused ? <Play size={24} fill="white" /> : <Pause size={24} fill="white" />}
                    </button>
                    <div className="volume-set">
                        <Volume2 size={20} />
                        <input type="range" min="0" max="1" step="0.1" value={audioRef.current?.volume || 1} onChange={(e) => audioRef.current.volume = e.target.value} />
                    </div>
                </div>
                <div className="f-center">
                    <span className="info-main">AUDIO: FABULOSA RADIO (BACKGROUND)</span>
                    <span className="info-sub">SISTEMA DE MONITOREO MULTI-CAM</span>
                </div>
                <button onClick={() => containerRef.current.requestFullscreen()} className="fs-toggle">
                    <Maximize size={24} />
                </button>
            </footer>

            <style jsx>{`
                .cam-broadcast-container { width: 100vw; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
                .broadcast-top-bar { padding: 15px 40px; display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.85); border-bottom: 1px solid rgba(255,255,255,0.1); }
                .master-logo-bug { height: 40px; }
                .exit-gate { display: flex; items-center; gap: 10px; color: #fff; font-weight: 800; font-size: 11px; letter-spacing: 2px; }
                .air-signal { color: #ff0033; font-weight: 900; font-size: 10px; display: flex; align-items: center; gap: 8px; }
                .dot { width: 8px; height: 8px; background: #ff0033; border-radius: 50%; animation: blink 1s infinite; }
                
                .broadcast-floor { flex: 1; display: flex; align-items: center; justify-content: center; padding: 30px; gap: 30px; position: relative; }
                .vid-frame { background: #000; border-radius: 30px; overflow: hidden; box-shadow: 0 40px 80px rgba(0,0,0,0.6); border: 2px solid rgba(255,255,255,0.1); }
                .fullscreen-box { width: 95%; height: 90%; }
                .split-left { width: 60%; height: 75%; }
                
                iframe { width: 100%; height: 100%; pointer-events: none; }
                .init-overlay { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; gap: 20px; }
                .init-overlay p { font-weight: 900; letter-spacing: 3px; font-size: 0.9rem; color: #666; }

                .ad-frame-right { width: 30%; height: 75%; background: rgba(0,0,0,0.7); backdrop-filter: blur(20px); border-radius: 30px; border: 4px solid #ff0033; padding: 20px; }
                .ad-content-box { width: 100%; height: 100%; position: relative; border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; }
                .ad-content-box img { width: 100%; height: 100%; object-fit: cover; }
                .timer-line { height: 6px; background: rgba(255,255,255,0.2); width: 100%; margin-top: 15px; border-radius: 10px; overflow: hidden; }
                .timer-line .fill { height: 100%; background: #ff0033; }

                .broadcast-base-bar { height: 90px; background: #000; display: flex; justify-content: space-between; align-items: center; padding: 0 60px; border-top: 1px solid rgba(255,255,255,0.1); }
                .f-left, .volume-set { display: flex; align-items: center; gap: 25px; }
                .f-center { display: flex; flex-direction: column; align-items: center; }
                .info-main { color: #ff0033; font-weight: 900; font-size: 10px; letter-spacing: 3px; }
                .info-sub { color: #444; font-size: 11px; margin-top: 5px; }
                
                .fx-fade { opacity: 0; }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
            `}</style>
        </div>
    );
};

export default Camaras;