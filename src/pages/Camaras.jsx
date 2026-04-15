import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX, Maximize, Minimize, Play } from 'lucide-react';

const AUDIO_AMBIENTE = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosaplay/playlist.m3u8"; // Audio de Fabulosa Verano

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
    const [isPlaying, setIsPlaying] = useState(false);
    const [camIndex, setCamIndex] = useState(0);
    const [adIndex, setAdIndex] = useState(0);
    const [showControls, setShowControls] = useState(true);

    useEffect(() => {
        if (!isPlaying) return;
        const interval = setInterval(() => {
            setCamIndex((prev) => (prev + 1) % YOUTUBE_CAMS.length);
            setAdIndex((prev) => (prev + 1) % VERTICAL_ADS.length);
        }, 180000); // 3 minutos
        return () => clearInterval(interval);
    }, [isPlaying]);

    const handleStart = () => {
        setIsPlaying(true);
        if (audioRef.current) audioRef.current.play();
    };

    return (
        <div className="cam-screen">
            <audio ref={audioRef} src={AUDIO_AMBIENTE} loop />
            
            <Link to="/" className="back-btn"> <ArrowLeft size={20} /> </Link>

            <main className="main-layout">
                {/* REPRODUCTOR IZQUIERDA */}
                <div className="video-section">
                    {!isPlaying ? (
                        <div className="play-overlay" onClick={handleStart}>
                            <Play size={80} fill="white" />
                            <p>ACTIVAR CÁMARAS Y AMBIENTE</p>
                        </div>
                    ) : (
                        <iframe 
                            src={`https://www.youtube.com/embed/${YOUTUBE_CAMS[camIndex]}?autoplay=1&mute=1&controls=0&modestbranding=1&key=${YOUTUBE_API_KEYS[camIndex % YOUTUBE_API_KEYS.length]}`} 
                            frameBorder="0" allow="autoplay; encrypted-media" 
                        />
                    )}
                </div>

                {/* PUBLICIDAD DERECHA */}
                <aside className="ad-section">
                    <div className="ad-card">
                        <img src={VERTICAL_ADS[adIndex]} alt="Publicidad" />
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default Camaras;