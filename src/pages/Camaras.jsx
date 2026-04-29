import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Maximize, Play, Pause, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Hls from 'hls.js'; 
import logoImage from '../assets/logo_fabulosa.png';

const AUDIO_RADIO_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8";

const YOUTUBE_CAMS = [
    "rnXIjl_Rzy4", // Pantalla 1
    "EO_1LWqsCNE", // Pantalla 2 (LÓGICA DE COMERCIALES)
    "gFRtAAmiFbE", 
    "loHbMM9JfCs", 
    "uV3wWHSvkfs", 
    "nFozEhYTEMo", 
    "8Rw-tZTeBjU", 
    "rqBfiegG5qU"
];

// SUS API KEYS RESTAURADAS Y PROTEGIDAS
const YOUTUBE_API_KEYS = [
    "AIzaSyDxLD8PviKQwlHBs7rmRm3GoyIKk-aQpww", "AIzaSyACeTldeUs5tbn2Lwr6o_6Lc48rF1nINY0",
    "AIzaSyBUk0oq1zjA6BKx5HK8DEQc1TxQqreqGtk", "AIzaSyBys-0J3T5Ou_fdPGxqYC5LWDMgppwD0Y4",
    "AIzaSyDHdkSo4WSHjYL4nHFU9wKmXW5D9PScO4g", "AIzaSyDJqDMnZsYHyJtzahtvv1r55Z-JfgLk5TU",
    "AIzaSyCruj7UZTEmElS3ZUeUBmYPecbsAA667U8", "AIzaSyBfMNrgQESeymMQ9srVBHKjXB3_WeRfkXE",
    "AIzaSyB1e_YSB74yAelvAhapDWu11VPLz2wBkUg", "AIzaSyCsvViGGiPJxx8-FkSwQvHE2T_U8d2UO5E",
    "AIzaSyBRvdUqolryjMRustJUyqN_HtkjRCbHLfI", "AIzaSyCdmCZW6J49Onl-QAf3cTsNu0im84EBVZc",
    "AIzaSyCeref7W3di_9o6W3YnEtqgvCQyvyQ5a5Q", "AIzaSyAwtE19mD7rpv1pu5nB4R8Q0HmEX9OkgJI"
];

const Camaras = () => {
    const navigate = useNavigate();
    const [isMuted, setIsMuted] = useState(true);
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current) {
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(AUDIO_RADIO_URL);
                hls.attachMedia(audioRef.current);
            } else if (audioRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                audioRef.current.src = AUDIO_RADIO_URL;
            }
        }
    }, []);

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
            audioRef.current.play().catch(() => {});
        }
    };

    return (
        <div className="broadcast-master-root">
            <audio ref={audioRef} autoPlay muted={isMuted} loop />

            <div className="broadcast-bug-logo">
                <img src={logoImage} alt="Fabulosa Logo" />
            </div>

            <div className="pan-view-strip">
                {YOUTUBE_CAMS.map((id, index) => (
                    <div key={id} className="isolated-viewport-box">
                        <div className="shield-invisible-master"></div>
                        
                        {/* LÓGICA DE COMERCIALES EN LA SEGUNDA PANTALLA */}
                        {index === 1 && (
                            <a 
                                href="https://wa.me/50664035313?text=Hola!%20Me%20interesa%20anunciar%20mi%20negocio%20en%20esta%20pantalla" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hitbox-btn"
                                title="Anuncie su marca aquí"
                            ></a>
                        )}

                        <iframe 
                            src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&playlist=${id}&loop=1`}
                            frameBorder="0"
                            allow="autoplay; encrypted-media"
                        ></iframe>
                    </div>
                ))}
            </div>

            <div className="control-center-deck">
                <button onClick={() => navigate('/')} className="btn-premium-action gray">
                    <ArrowLeft size={20} /> <span className="hide-mobile">VOLVER</span>
                </button>
                
                <div className="live-status-pill">
                    <div className="blink-red"></div>
                    <span>MULTICAM EN VIVO</span>
                </div>

                <button onClick={toggleMute} className={`btn-premium-action ${isMuted ? 'red' : 'green'}`}>
                    {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
                    <span>{isMuted ? 'ACTIVAR AUDIO' : 'AUDIO ON'}</span>
                </button>
            </div>

            <style jsx>{`
                .broadcast-master-root { 
                    background: #000; 
                    height: 100vh; 
                    width: 100vw; 
                    overflow-x: auto; 
                    overflow-y: hidden; 
                    display: flex; 
                    align-items: center; 
                    position: relative;
                    scroll-snap-type: x mandatory; 
                }

                .pan-view-strip { 
                    display: flex; 
                    align-items: center; 
                    gap: 0px; 
                    padding: 0px; 
                    flex-shrink: 0;
                }

                .isolated-viewport-box { 
                    background: #000; 
                    position: relative; 
                    overflow: hidden; 
                    width: 100vw; 
                    height: 100vh; 
                    scroll-snap-align: center; 
                }

                iframe { 
                    width: 100%; 
                    height: 100%; 
                    transform: scale(1.3); 
                    pointer-events: none; 
                }
                
                .shield-invisible-master { 
                    position: absolute; 
                    inset: 0; 
                    z-index: 50; 
                    background: transparent; 
                }

                /* BOTÓN INVISIBLE DE COMERCIALES */
                .hitbox-btn {
                    position: absolute;
                    inset: 0;
                    z-index: 60; 
                    display: block;
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                    background: transparent;
                }

                .broadcast-bug-logo { 
                    position: fixed; 
                    top: 40px; 
                    left: 40px; 
                    z-index: 100; 
                    pointer-events: none;
                }
                .broadcast-bug-logo img { 
                    height: 120px; 
                    filter: drop-shadow(0 0 30px rgba(0,0,0,1)); 
                }

                .control-center-deck { 
                    position: fixed; 
                    bottom: 40px; 
                    left: 50%; 
                    transform: translateX(-50%); 
                    background: rgba(20,20,20,0.8); 
                    backdrop-filter: blur(30px); 
                    border: 1px solid rgba(255,255,255,0.1); 
                    padding: 15px 40px; 
                    border-radius: 100px; 
                    display: flex; 
                    align-items: center; 
                    gap: 30px; 
                    z-index: 200;
                    width: auto;
                    max-width: 90%;
                }

                .btn-premium-action {
                    background: transparent;
                    border: none;
                    color: #fff;
                    font-weight: 900;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    font-size: 14px;
                    text-transform: uppercase;
                }

                .btn-premium-action.red { color: #ff4444; }
                .btn-premium-action.green { color: #00ff88; }
                .btn-premium-action.gray { color: #888; }

                .live-status-pill {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: rgba(255,255,255,0.05);
                    padding: 8px 20px;
                    border-radius: 50px;
                    font-size: 12px;
                    font-weight: 900;
                    letter-spacing: 2px;
                }

                .blink-red { width: 8px; height: 8px; background: red; border-radius: 50%; animation: pulse 1s infinite; }

                @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }

                /* 📱 RESPONSIVO PERFECTO PARA CELULARES */
                @media (max-width: 768px) {
                    .broadcast-bug-logo { top: 20px; left: 20px; }
                    .broadcast-bug-logo img { height: 60px; } 
                    
                    .control-center-deck { 
                        bottom: 20px; 
                        padding: 10px 20px; 
                        gap: 15px; 
                    }
                    .hide-mobile { display: none; }
                    .btn-premium-action span { font-size: 10px; }
                    .live-status-pill { padding: 6px 12px; font-size: 9px; }
                    
                    iframe { transform: scale(1.5); } 
                }
            `}</style>
        </div>
    );
};

export default Camaras;