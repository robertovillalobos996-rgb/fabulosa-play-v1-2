import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX, Play, Pause, Maximize, RotateCw } from 'lucide-react';
import logoImage from '../assets/logo_fabulosa.png';
import './Camaras.css';

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
  "/publicidad_vertical/mexicana_1.png", "/publicidad_vertical/mexicana_2.png", "/publicidad_vertical/uñas_yendry.png"
];

const Camaras = () => {
    const audioRef = useRef(null);
    const videoContainerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [camIndex, setCamIndex] = useState(0);
    const [adIndex, setAdIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [keyIndex, setKeyIndex] = useState(0);

    // Rotación de Cámaras (Cada 2 minutos)
    useEffect(() => {
        if (!isPlaying || isPaused) return;
        const camInterval = setInterval(() => {
            setCamIndex((prev) => (prev + 1) % YOUTUBE_CAMS.length);
            setKeyIndex((prev) => (prev + 1) % YOUTUBE_API_KEYS.length);
        }, 120000); 
        return () => clearInterval(camInterval);
    }, [isPlaying, isPaused]);

    // Rotación de Publicidad (Cada 15 segundos)
    useEffect(() => {
        const adInterval = setInterval(() => {
            setAdIndex((prev) => (prev + 1) % VERTICAL_ADS.length);
        }, 15000);
        return () => clearInterval(adInterval);
    }, []);

    const handleStart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        if (audioRef.current) audioRef.current.play();
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleFullscreen = () => {
        if (videoContainerRef.current.requestFullscreen) {
            videoContainerRef.current.requestFullscreen();
        }
    };

    return (
        <div className="cam-screen">
            <audio ref={audioRef} src={AUDIO_URL} loop />
            
            <header className="cam-header">
                <Link to="/" className="back-btn-cam"><ArrowLeft size={24} /></Link>
                <img src={logoImage} alt="Logo" className="tv-logo" />
            </header>

            <div className="main-layout">
                <div className="video-section" ref={videoContainerRef}>
                    {!isPlaying ? (
                        <div className="play-overlay" onClick={handleStart}>
                            <div className="play-circle"><Play size={50} fill="#00f2ff" color="#00f2ff" /></div>
                            <p>INICIAR TRANSMISIÓN PROFESIONAL</p>
                        </div>
                    ) : (
                        <div className="video-container">
                            <div className="yt-shield"></div>
                            {!isPaused && (
                                <iframe 
                                    src={`https://www.youtube.com/embed/${YOUTUBE_CAMS[camIndex]}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&key=${YOUTUBE_API_KEYS[keyIndex]}`} 
                                    frameBorder="0" allow="autoplay; encrypted-media"
                                />
                            )}
                            
                            <div className="custom-controls">
                                <button className="control-btn" onClick={() => setIsPaused(!isPaused)}>
                                    {isPaused ? <Play size={24} fill="white" /> : <Pause size={24} fill="white" />}
                                </button>
                                <button className="control-btn" onClick={toggleMute}>
                                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                                </button>
                                <button className="control-btn" onClick={handleFullscreen}>
                                    <Maximize size={24} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <aside className="ad-section">
                    <div className="ad-card">
                        <img src={VERTICAL_ADS[adIndex]} alt="Publicidad" />
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Camaras;