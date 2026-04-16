import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX, Play, Pause, Maximize } from 'lucide-react';
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
  "/publicidad_vertical/mexicana_1.png", "/publicidad_vertical/mexicana_2.png", "/publicidad_vertical/unas_yendry.png"
];

const Camaras = () => {
    const audioRef = useRef(null);
    const videoContainerRef = useRef(null);
    const controlsTimer = useRef(null);
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [camIndex, setCamIndex] = useState(0);
    const [adIndex, setAdIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [keyIndex, setKeyIndex] = useState(0);
    const [showControls, setShowControls] = useState(true);
    // Estado para controlar la animaciÃ³n de transiciÃ³n
    const [isTransitioning, setIsTransitioning] = useState(false);

    const resetControlsTimer = () => {
        setShowControls(true);
        if (controlsTimer.current) clearTimeout(controlsTimer.current);
        controlsTimer.current = setTimeout(() => {
            if (isPlaying && !isPaused) setShowControls(false);
        }, 3000);
    };

    // LÃ³gica combinada de rotaciÃ³n con transiciones cinemÃ¡ticas
    useEffect(() => {
        if (!isPlaying || isPaused) return;

        // FunciÃ³n para ejecutar el cambio de cÃ¡mara con efecto
        const performCamSwap = () => {
            setIsTransitioning(true); // Inicia fundido a negro
            
            // Esperamos a que la pantalla estÃ© negra (0.5s) para cambiar la fuente
            setTimeout(() => {
                setCamIndex((prev) => (prev + 1) % YOUTUBE_CAMS.length);
                setKeyIndex((prev) => (prev + 1) % YOUTUBE_API_KEYS.length);
                
                // Esperamos un momento corto y volvemos a mostrar (fade in)
                setTimeout(() => {
                    setIsTransitioning(false);
                }, 100); 
            }, 500);
        };

        // Intervalo de CÃ¡maras (Cada 2 minutos ejecuta la transiciÃ³n)
        const camInterval = setInterval(performCamSwap, 120000);

        // Intervalo de Publicidad (Cada 15 segundos sin transiciÃ³n)
        const adInterval = setInterval(() => {
            setAdIndex((prev) => (prev + 1) % VERTICAL_ADS.length);
        }, 15000);

        return () => { clearInterval(camInterval); clearInterval(adInterval); };
    }, [isPlaying, isPaused]);

    const handleStart = () => {
        setIsPlaying(true);
        if (audioRef.current) audioRef.current.play();
        resetControlsTimer();
    };

    const handleVolumeChange = (e) => {
        const val = parseFloat(e.target.value);
        setVolume(val);
        if (audioRef.current) {
            audioRef.current.volume = val;
            setIsMuted(val === 0);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            videoContainerRef.current.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div className="cam-screen" onMouseMove={resetControlsTimer} onClick={resetControlsTimer}>
            <audio ref={audioRef} src={AUDIO_URL} loop />
            
            <Link to="/" className={`back-btn-float ${!showControls && isPlaying ? 'hidden' : ''}`}>
                <ArrowLeft size={24} />
            </Link>

            <div className="main-layout">
                <div className="video-section" ref={videoContainerRef}>
                    {!isPlaying ? (
                        <div className="play-overlay" onClick={handleStart}>
                            <div className="play-circle"><Play size={50} fill="#00f2ff" /></div>
                            <p>TRANSMISIÃ“N PROFESIONAL EN VIVO</p>
                        </div>
                    ) : (
                        // AÃ±adimos la clase 'switching' cuando hay transiciÃ³n
                        <div className={`video-container ${isTransitioning ? 'switching' : ''}`}>
                            <div className="yt-shield"></div>
                            
                            {/* LOGO TV GRANDE CON PRESENCIA */}
                            <img src={logoImage} alt="Logo TV" className={`tv-bug-premium ${!showControls ? 'low-opacity' : ''}`} />

                            {!isPaused && (
                                <iframe 
                                    src={`https://www.youtube.com/embed/${YOUTUBE_CAMS[camIndex]}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&key=${YOUTUBE_API_KEYS[keyIndex]}`} 
                                    frameBorder="0" allow="autoplay; encrypted-media"
                                />
                            )}

                            {/* CONTROLES ESTILO YOUTUBE */}
                            <div className={`yt-controls-bar ${!showControls ? 'fade-out' : ''}`}>
                                <div className="controls-left">
                                    <button onClick={() => setIsPaused(!isPaused)}>
                                        {isPaused ? <Play size={22} fill="white" /> : <Pause size={22} fill="white" />}
                                    </button>
                                    <div className="volume-group">
                                        <button onClick={() => { setIsMuted(!isMuted); if (audioRef.current) audioRef.current.muted = !isMuted; }}>
                                            {isMuted || volume === 0 ? <VolumeX size={22} /> : <Volume2 size={22} />}
                                        </button>
                                        <input type="range" min="0" max="1" step="0.1" value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="vol-slider" />
                                    </div>
                                </div>
                                <div className="controls-right">
                                    <button onClick={toggleFullscreen}><Maximize size={22} /></button>
                                </div>
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