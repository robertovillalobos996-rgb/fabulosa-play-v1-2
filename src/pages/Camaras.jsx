import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, ArrowLeft, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Hls from 'hls.js'; 
import logoImage from '../assets/logo_fabulosa.png';

const AUDIO_RADIO_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8";

const YOUTUBE_API_KEYS = [
    "AIzaSyDxLD8PviKQwlHBs7rmRm3GoyIKk-aQpww", "AIzaSyACeTldeUs5tbn2Lwr6o_6Lc48rF1nINY0",
    "AIzaSyBUk0oq1zjA6BKx5HK8DEQc1TxQqreqGtk", "AIzaSyBys-0J3T5Ou_fdPGxqYC5LWDMgppwD0Y4",
    "AIzaSyDHdkSo4WSHjYL4nHFU9wKmXW5D9PScO4g", "AIzaSyDJqDMnZsYHyJtzahtvv1r55Z-JfgLk5TU",
    "AIzaSyCruj7UZTEmElS3ZUeUBmYPecbsAA667U8", "AIzaSyBfMNrgQESeymMQ9srVBHKjXB3_WeRfkXE",
    "AIzaSyB1e_YSB74yAelvAhapDWu11VPLz2wBkUg", "AIzaSyCsvViGGiPJxx8-FkSwQvHE2T_U8d2UO5E",
    "AIzaSyBRvdUqolryjMRustJUyqN_HtkjRCbHLfI", "AIzaSyCdmCZW6J49Onl-QAf3cTsNu0im84EBVZc",
    "AIzaSyCeref7W3di_9o6W3YnEtqgvCQyvyQ5a5Q", "AIzaSyAwtE19mD7rpv1pu5nB4R8Q0HmEX9OkgJI"
];

const YOUTUBE_CAMS = [
    "rnXIjl_Rzy4", "EO_1LWqsCNE", "gFRtAAmiFbE", "loHbMM9JfCs", 
    "uV3wWHSvkfs", "nFozEhYTEMo", "8Rw-tZTeBjU", "rqBfiegG5qU"
];

const ADS_IMAGES = [
    '/publicidad_vertical/mexicana_1.png',
    '/publicidad_vertical/mexicana_2.png',
    '/publicidad_vertical/unas_yendry.png',
    '/publicidad_vertical/anunciete_1.png',
    '/publicidad_vertical/chinito_express.png'
];

const ADS_VIDEOS = [
    '/publicidad_vertical/comercial_fabulosa.mp4',
    '/publicidad_vertical/pina_express.mp4',
    '/publicidad_vertical/repuestos_hayco.mp4',
    '/publicidad_vertical/comercial_chinito.mp4'
];

const Camaras = () => {
    const navigate = useNavigate();
    
    // ESTADOS DEL AUDIO
    const [volume, setVolume] = useState(0.5);
    const [isMuted, setIsMuted] = useState(false);
    const [showVolBar, setShowVolBar] = useState(false);
    const audioRef = useRef(null);

    // ESTADOS DE CÁMARAS Y TRANSICIÓN
    const [currentCamIndex, setCurrentCamIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    
    // ESTADOS DE PUBLICIDAD
    const [adPhase, setAdPhase] = useState('IDLE'); 
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const timerRef = useRef(null);

    const isAdMode = adPhase !== 'IDLE';

    // 1. INICIAR AUDIO RADIO HLS
    useEffect(() => {
        if (audioRef.current) {
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(AUDIO_RADIO_URL);
                hls.attachMedia(audioRef.current);
            } else if (audioRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                audioRef.current.src = AUDIO_RADIO_URL;
            }
            audioRef.current.volume = volume;
        }
    }, []);

    // 2. ACTUALIZAR VOLUMEN
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    // 3. CAMBIAR DE CÁMARA CADA 2 MINUTOS CON EL VIDEO CORTINILLA FORZADO
    useEffect(() => {
        const camTimer = setInterval(() => {
            setIsTransitioning(true);
            
            // SEGURO DE VIDA: Si el video dura más de 6 segundos o se pega, fuerza a que desaparezca
            setTimeout(() => {
                setIsTransitioning(false);
            }, 6000);

        }, 120000); 
        return () => clearInterval(camTimer);
    }, []);

    // 4. LÓGICA DE TIEMPOS DE PUBLICIDAD
    useEffect(() => {
        timerRef.current = setTimeout(() => {
            setAdPhase('IMAGES');
            setCurrentAdIndex(0);
        }, 15000); // Arranca a los 15 segundos

        return () => clearTimeout(timerRef.current);
    }, []);

    const nextAdPhase = () => {
        if (adPhase === 'IMAGES') {
            setAdPhase('IDLE');
            timerRef.current = setTimeout(() => {
                setAdPhase('VIDEOS');
                setCurrentAdIndex(0);
            }, 5 * 60 * 1000); // Espera 5 minutos
        } else if (adPhase === 'VIDEOS') {
            setAdPhase('IDLE');
            timerRef.current = setTimeout(() => {
                setAdPhase('IMAGES');
                setCurrentAdIndex(0);
            }, 6 * 60 * 1000); // Espera 6 minutos
        }
    };

    // 5. REPRODUCCIÓN AUTOMÁTICA DE IMÁGENES
    useEffect(() => {
        if (adPhase === 'IMAGES') {
            const imgTimer = setTimeout(() => {
                if (currentAdIndex + 1 < ADS_IMAGES.length) {
                    setCurrentAdIndex(prev => prev + 1);
                } else {
                    nextAdPhase();
                }
            }, 10000); 
            return () => clearTimeout(imgTimer);
        }
    }, [adPhase, currentAdIndex]);

    const handleVideoEnd = () => {
        if (currentAdIndex + 1 < ADS_VIDEOS.length) {
            setCurrentAdIndex(prev => prev + 1);
        } else {
            nextAdPhase();
        }
    };

    return (
        <>
            {/* PANTALLA DE BLOQUEO PARA CELULARES (INTACTO) */}
            <div className="landscape-lock-overlay">
                <motion.div 
                    animate={{ rotate: 90 }} 
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                >
                    <Smartphone size={80} className="text-yellow-500 mb-8" />
                </motion.div>
                <h1 className="text-3xl font-black tracking-widest uppercase mb-4 text-center text-white">Gire su teléfono</h1>
                <p className="text-gray-400 text-center text-base max-w-xs leading-relaxed">
                    Esta transmisión en vivo está diseñada para disfrutarse en pantalla completa horizontal.
                </p>
                <button onClick={() => navigate('/')} className="mt-12 px-8 py-4 bg-white/10 hover:bg-white/20 transition-colors rounded-full font-bold uppercase tracking-widest text-xs text-white">
                    Volver al Inicio
                </button>
            </div>

            {/* SISTEMA DE TRANSMISIÓN PRINCIPAL */}
            <div className="broadcast-master bg-black h-screen w-screen overflow-hidden relative flex">
                
                <audio ref={audioRef} autoPlay loop />

                <div className="absolute top-6 left-6 z-[80] pointer-events-none">
                    <img src={logoImage} alt="Fabulosa Logo" className="h-16 md:h-24 drop-shadow-[0_0_20px_rgba(0,0,0,1)]" />
                </div>

                {/* SECCIÓN 1: PANTALLA DE CÁMARAS */}
                <motion.div 
                    className="h-full relative flex items-center justify-center bg-black overflow-hidden"
                    animate={{ width: isAdMode ? '60vw' : '100vw' }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                >
                    <div className="absolute inset-0 z-40 bg-transparent cursor-default"></div>

                    {/* VIDEO CORTINILLA ARREGLADO (Z-INDEX 60 PARA ESTAR POR ENCIMA DE TODO) */}
                    <AnimatePresence>
                        {isTransitioning && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 z-[60] bg-black"
                            >
                                <video 
                                    src="/logo_fabulosa_moviento.mp4" 
                                    autoPlay 
                                    muted 
                                    playsInline
                                    className="w-full h-full object-cover"
                                    onPlay={() => {
                                        // Cambia el canal por detrás mientras el video se reproduce
                                        setCurrentCamIndex((prev) => (prev + 1) % YOUTUBE_CAMS.length);
                                    }}
                                    onEnded={() => setIsTransitioning(false)}
                                    onError={() => setIsTransitioning(false)}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* EL CANAL DE YOUTUBE */}
                    <div className="absolute w-full h-full">
                        <iframe 
                            key={currentCamIndex}
                            src={`https://www.youtube.com/embed/${YOUTUBE_CAMS[currentCamIndex]}?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0`}
                            className="w-full h-full pointer-events-none"
                            style={{ transform: 'scale(1.3)' }}
                            frameBorder="0"
                            allow="autoplay; encrypted-media"
                        ></iframe>
                    </div>
                </motion.div>

                {/* SECCIÓN 2: CAJA DE COMERCIALES (INTACTO) */}
                <motion.div 
                    className="h-full bg-neutral-900 border-l border-neutral-800 flex items-center justify-center relative overflow-hidden"
                    animate={{ width: isAdMode ? '40vw' : '0vw' }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                >
                    {isAdMode && (
                        <motion.div 
                            key={adPhase + currentAdIndex}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.8 }}
                            className="w-full h-full flex items-center justify-center p-4 bg-black"
                        >
                            {adPhase === 'IMAGES' && ADS_IMAGES[currentAdIndex] && (
                                <img 
                                    src={ADS_IMAGES[currentAdIndex]} 
                                    alt="Fabulosa Publicidad" 
                                    className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-xl"
                                />
                            )}

                            {adPhase === 'VIDEOS' && ADS_VIDEOS[currentAdIndex] && (
                                <video 
                                    src={ADS_VIDEOS[currentAdIndex]} 
                                    autoPlay 
                                    playsInline 
                                    webkit-playsinline="true"
                                    muted={false} 
                                    onEnded={handleVideoEnd}
                                    className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-xl"
                                />
                            )}
                        </motion.div>
                    )}
                </motion.div>

                {/* PANEL DE CONTROL INFERIOR */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-[100] flex items-center bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                    
                    <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition font-bold flex items-center gap-2 text-sm uppercase tracking-widest mr-6">
                        <ArrowLeft size={18} /> Salir
                    </button>

                    <div className="w-px h-6 bg-white/20 mr-6"></div>

                    <div className="flex items-center gap-2 mr-6">
                        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                        <span className="text-white text-xs font-black tracking-[0.2em]">EN VIVO</span>
                    </div>

                    <div className="w-px h-6 bg-white/20"></div>

                    {/* BOTÓN MAGICO DE VOLUMEN - AHORA CONTROLADO POR REACT (INFALIBLE) */}
                    <div 
                        className="relative flex items-center h-10 ml-4"
                        onMouseEnter={() => setShowVolBar(true)}
                        onMouseLeave={() => setShowVolBar(false)}
                    >
                        {/* Zona de protección para que el mouse no se salga por accidente */}
                        <div className="absolute -inset-y-6 -inset-x-8 z-10"></div>

                        <div className="flex items-center z-20 relative">
                            <button 
                                onClick={() => setIsMuted(!isMuted)} 
                                className={`transition ${isMuted ? 'text-red-500' : 'text-green-400'}`}
                            >
                                {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
                            </button>
                            
                            <div className={`overflow-hidden transition-all duration-500 flex items-center ${showVolBar ? 'w-24 ml-4 opacity-100' : 'w-0 ml-0 opacity-0'}`}>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="1" 
                                    step="0.01" 
                                    value={isMuted ? 0 : volume}
                                    onChange={(e) => {
                                        setVolume(parseFloat(e.target.value));
                                        setIsMuted(false);
                                    }}
                                    className="w-full accent-green-400 h-1 bg-gray-600 rounded-lg outline-none cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* CSS DEL BLOQUEO DE ROTACIÓN */}
            <style jsx global>{`
                .landscape-lock-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 9999;
                    background: #000;
                    display: none;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                @media screen and (max-width: 850px) and (orientation: portrait) {
                    .landscape-lock-overlay {
                        display: flex !important;
                    }
                    .broadcast-master {
                        display: none !important;
                    }
                }
            `}</style>
        </>
    );
};

export default Camaras;