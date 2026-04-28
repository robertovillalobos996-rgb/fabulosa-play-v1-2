import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Maximize, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Hls from 'hls.js'; 
import logoImage from '../assets/logo_fabulosa.png';

// 📡 CONFIGURACIÓN TÉCNICA (PROTEGIENDO SUS LLAVES)
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

    // --- 🔊 MOTOR DE AUDIO (CIRUGÍA HLS CON LOCUTORES) ---
    const startRadioHLS = () => {
        const audio = audioRef.current;
        if (Hls.isSupported()) {
            if (hlsRef.current) hlsRef.current.destroy();
            const hls = new Hls();
            hls.loadSource(AUDIO_RADIO_URL);
            hls.attachMedia(audio);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                audio.play().catch(e => console.log("Reinicio de señal..."));
            });
            hlsRef.current = hls;
        } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
            audio.src = AUDIO_RADIO_URL;
            audio.play();
        }
    };

    const handleStartFull = () => {
        setIsPlaying(true);
        // Disparar el sello primero (ID)
        if (selloRef.current) {
            selloRef.current.play().catch(e => console.log("Interacción requerida"));
        }
    };

    const onSelloFinished = () => {
        startRadioHLS(); // El sello terminó, entran los locutores (Radio HLS)
    };

    // --- 📺 LÓGICA DE ROTACIÓN Y PUBLICIDAD ---
    useEffect(() => {
        if (!isPlaying) return;

        const camTimer = setInterval(() => {
            setCamIndex(prev => (prev + 1) % YOUTUBE_CAMS.length);
            setKeyIndex(prev => (prev + 1) % YOUTUBE_API_KEYS.length);
        }, 120000);

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
            {/* AUDIOS INDEPENDIENTES */}
            <audio ref={selloRef} src={SELLO_ID_URL} onEnded={onSelloFinished} />
            <audio ref={audioRef} />

            {!isPlaying ? (
                <div className="init-fullscreen-screen" onClick={handleStartFull}>
                    <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity }} className="play-icon-giant">
                        <Play size={140} fill="#ff0033" stroke="none" />
                    </motion.div>
                    <h1>SISTEMA CENTRAL DE MONITOREO</h1>
                    <p>TOQUE PARA INICIAR SEÑAL VIP CON AUDIO EN VIVO</p>
                </div>
            ) : (
                <div className="workspace-separated" ref={containerRef}>
                    
                    {/* 📹 CAJA 1: VIDEO (Individual y Fluida) */}
                    <motion.div 
                        animate={{ 
                            width: isAdMode ? "55%" : "100%", 
                            height: isAdMode ? "80%" : "100%",
                            x: isAdMode ? -30 : 0 
                        }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="viewport-video-box"
                    >
                        {/* 🛡️ ESCUDO TOTAL (BLOQUEA YOUTUBE) */}
                        <div className="yt-shield-blindado"></div>

                        {/* 🏷️ LOGO GIGANTE ORIGINAL */}
                        <div className="tv-logo-bug-large">
                            <img src={logoImage} alt="Fabulosa TV" />
                        </div>

                        {/* 🔘 BOTONES INVISIBLES DE CONTROL */}
                        <div className="secret-btn top-right" onClick={() => containerRef.current.requestFullscreen()}></div>
                        <div className="secret-btn bottom-left" onClick={() => {
                            setIsMuted(!isMuted);
                            audioRef.current.muted = !isMuted;
                        }}></div>
                        <div className="secret-btn bottom-right" onClick={() => navigate('/')}></div>

                        <iframe 
                            src={`https://www.youtube.com/embed/${YOUTUBE_CAMS[camIndex]}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&key=${YOUTUBE_API_KEYS[keyIndex]}`} 
                            frameBorder="0" allow="autoplay; encrypted-media"
                        />
                    </motion.div>

                    {/* 💰 CAJA 2: PUBLICIDAD (Individual y Separada) */}
                    <AnimatePresence>
                        {isAdMode && (
                            <motion.div 
                                initial={{ x: 800, opacity: 0 }} 
                                animate={{ x: 0, opacity: 1 }} 
                                exit={{ x: 800, opacity: 0 }}
                                className="viewport-ads-box"
                            >
                                <div className="ad-frame-clean">
                                    <motion.img 
                                        key={adIndex} 
                                        initial={{ opacity: 0, scale: 0.95 }} 
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
                
                .init-fullscreen-screen { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #000; cursor: pointer; }
                .init-fullscreen-screen h1 { color: #fff; font-weight: 900; letter-spacing: 5px; margin-top: 30px; }
                .init-fullscreen-screen p { color: #ff0033; font-weight: 700; font-size: 0.8rem; letter-spacing: 2px; }

                .workspace-separated { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; position: relative; gap: 60px; padding: 0 50px; }
                
                .viewport-video-box { background: #000; position: relative; overflow: hidden; box-shadow: 0 50px 100px rgba(0,0,0,0.9); border: 2px solid rgba(255,255,255,0.05); border-radius: 30px; }
                iframe { width: 100%; height: 100%; transform: scale(1.35); pointer-events: none; }
                
                /* Blindaje */
                .yt-shield-blindado { position: absolute; inset: 0; z-index: 50; background: transparent; cursor: default; }

                /* Botones Secretos */
                .secret-btn { position: absolute; width: 160px; height: 160px; z-index: 100; cursor: pointer; }
                .top-right { top: 0; right: 0; }
                .bottom-left { bottom: 0; left: 0; }
                .bottom-right { bottom: 0; right: 0; }

                /* Logo Bug Large */
                .tv-logo-bug-large { position: absolute; top: 60px; left: 70px; z-index: 60; }
                .tv-logo-bug-large img { height: 150px; width: auto; object-fit: contain; filter: drop-shadow(0 0 35px rgba(0,0,0,1)); }

                /* Caja Publicidad Individual */
                .viewport-ads-box { width: 32%; height: 80%; background: rgba(0,0,0,0.9); border: 10px solid #ff0033; border-radius: 60px; padding: 30px; box-shadow: 0 0 80px rgba(255,0,51,0.5); }
                .ad-frame-clean { width: 100%; height: 100%; position: relative; border-radius: 40px; overflow: hidden; }
                .ad-frame-clean img { width: 100%; height: 100%; object-fit: cover; }
            `}</style>
        </div>
    );
};

export default Camaras;