import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Maximize, Play, Pause, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Hls from 'hls.js'; 
import logoImage from '../assets/logo_fabulosa.png';

const AUDIO_RADIO_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8";

const YOUTUBE_CAMS = [
    "rnXIjl_Rzy4", "EO_1LWqsCNE", "gFRtAAmiFbE", "loHbMM9JfCs", 
    "uV3wWHSvkfs", "nFozEhYTEMo", "8Rw-tZTeBjU", "rqBfiegG5qU"
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
                }

                .pan-view-strip { 
                    display: flex; 
                    align-items: center; 
                    gap: 80px; 
                    padding: 0 100px; 
                    flex-shrink: 0;
                }

                .isolated-viewport-box { 
                    background: #000; 
                    position: relative; 
                    overflow: hidden; 
                    border-radius: 40px; 
                    box-shadow: 0 60px 120px rgba(0,0,0,0.9); 
                    border: 2px solid rgba(255,255,255,0.05);
                    width: 80vw;
                    max-width: 1200px;
                    aspect-ratio: 16/9;
                }

                iframe { width: 100%; height: 100%; transform: scale(1.1); pointer-events: none; }
                
                .shield-invisible-master { position: absolute; inset: 0; z-index: 50; background: transparent; }

                .broadcast-bug-logo { 
                    position: fixed; 
                    top: 40px; 
                    left: 40px; 
                    z-index: 100; 
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

                /* 📱 RESPONSIVO PARA CELULARES */
                @media (max-width: 768px) {
                    .broadcast-bug-logo { top: 20px; left: 20px; }
                    .broadcast-bug-logo img { height: 60px; }
                    
                    .pan-view-strip { gap: 30px; padding: 0 40px; }
                    .isolated-viewport-box { width: 85vw; border-radius: 20px; }
                    
                    .control-center-deck { 
                        bottom: 20px; 
                        padding: 10px 20px; 
                        gap: 15px; 
                    }
                    .hide-mobile { display: none; }
                    .btn-premium-action span { font-size: 10px; }
                    .live-status-pill { padding: 6px 12px; font-size: 9px; }
                }
            `}</style>
        </div>
    );
};

export default Camaras;