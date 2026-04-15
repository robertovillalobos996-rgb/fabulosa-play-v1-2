import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX, Play, RotateCw } from 'lucide-react';
import './Camaras.css';

// 📡 AUDIO DE FABULOSA STEREO
const AUDIO_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8";

// 🔑 TUS 14 API KEYS (ROTACIÓN ACTIVA)
const YOUTUBE_API_KEYS = [
    "AIzaSyDxLD8PviKQwlHBs7rmRm3GoyIKk-aQpww",
    "AIzaSyACeTldeUs5tbn2Lwr6o_6Lc48rF1nINY0",
    "AIzaSyBUk0oq1zjA6BKx5HK8DEQc1TxQqreqGtk",
    "AIzaSyBys-0J3T5Ou_fdPGxqYC5LWDMgppwD0Y4",
    "AIzaSyDHdkSo4WSHjYL4nHFU9wKmXW5D9PScO4g",
    "AIzaSyDJqDMnZsYHyJtzahtvv1r55Z-JfgLk5TU",
    "AIzaSyCruj7UZTEmElS3ZUeUBmYPecbsAA667U8",
    "AIzaSyBfMNrgQESeymMQ9srVBHKjXB3_WeRfkXE",
    "AIzaSyB1e_YSB74yAelvAhapDWu11VPLz2wBkUg",
    "AIzaSyCsvViGGiPJxx8-FkSwQvHE2T_U8d2UO5E",
    "AIzaSyBRvdUqolryjMRustJUyqN_HtkjRCbHLfI",
    "AIzaSyCdmCZW6J49Onl-QAf3cTsNu0im84EBVZc",
    "AIzaSyCeref7W3di_9o6W3YnEtqgvCQyvyQ5a5Q",
    "AIzaSyAwtE19mD7rpv1pu5nB4R8Q0HmEX9OkgJI"
];

// 🎥 TUS 5 CÁMARAS OFICIALES
const YOUTUBE_CAMS = ["rnXIjl_Rzy4", "EO_1LWqsCNE", "gFRtAAmiFbE", "loHbMM9JfCs", "uV3wWHSvkfs"];

// 🚀 PUBLICIDAD VERTICAL
const VERTICAL_ADS = [
  "/publicidad_vertical/anunciete_1.png", 
  "/publicidad_vertical/chinito_express.png",
  "/publicidad_vertical/mexicana_1.png", 
  "/publicidad_vertical/mexicana_2.png", 
  "/publicidad_vertical/uñas_yendry.png"
];

const Camaras = () => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [camIndex, setCamIndex] = useState(0);
    const [adIndex, setAdIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [keyIndex, setKeyIndex] = useState(0);

    // Rotación de Cámara y Publicidad cada 3 minutos
    useEffect(() => {
        if (!isPlaying) return;
        const interval = setInterval(() => {
            setCamIndex((prev) => (prev + 1) % YOUTUBE_CAMS.length);
            setAdIndex((prev) => (prev + 1) % VERTICAL_ADS.length);
            setKeyIndex((prev) => (prev + 1) % YOUTUBE_API_KEYS.length);
        }, 180000); 
        return () => clearInterval(interval);
    }, [isPlaying]);

    const handleStart = () => {
        setIsPlaying(true);
        if (audioRef.current) audioRef.current.play();
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="cam-screen">
            <audio ref={audioRef} src={AUDIO_URL} loop />
            <Link to="/" className="back-btn"><ArrowLeft size={24} /></Link>

            <div className="main-layout">
                {/* LADO IZQUIERDO: REPRODUCTOR */}
                <div className="video-section">
                    {!isPlaying ? (
                        <div className="play-overlay" onClick={handleStart}>
                            <div className="play-circle"><Play size={50} fill="#00f2ff" color="#00f2ff" /></div>
                            <p>ACTIVAR CÁMARAS Y AUDIO</p>
                        </div>
                    ) : (
                        <div className="video-container">
                            {/* ESCUDO ANTI-YOUTUBE */}
                            <div className="yt-shield"></div>
                            <iframe 
                                src={`https://www.youtube.com/embed/${YOUTUBE_CAMS[camIndex]}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&key=${YOUTUBE_API_KEYS[keyIndex]}`} 
                                frameBorder="0" allow="autoplay; encrypted-media"
                            />
                            {/* CONTROLES PERSONALIZADOS */}
                            <div className="custom-controls">
                                <button className="control-icon" onClick={toggleMute}>
                                    {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
                                </button>
                                <button className="control-icon" onClick={() => setCamIndex((prev) => (prev + 1) % YOUTUBE_CAMS.length)}>
                                    <RotateCw size={28} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* LADO DERECHO: PUBLICIDAD */}
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