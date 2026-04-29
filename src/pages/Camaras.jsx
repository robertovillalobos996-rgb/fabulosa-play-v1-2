import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Hls from 'hls.js'; 
import logoImage from '../assets/logo_fabulosa.png';

const AUDIO_RADIO_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8";

// SUS API KEYS PROTEGIDAS
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

// LISTA OFICIAL DE COMERCIALES EXACTAMENTE COMO USTED LA PIDIÓ
const PUBLICIDAD = [
    { type: 'video', src: '/publicidad_vertical/comercial_fabulosa.mp4' },
    { type: 'image', src: '/publicidad_vertical/mexicana_1.png' },
    { type: 'image', src: '/publicidad_vertical/mexicana_2.png' },
    { type: 'video', src: '/publicidad_vertical/pina_express.mp4' },
    { type: 'video', src: '/publicidad_vertical/repuestos_hayco.mp4' },
    { type: 'image', src: '/publicidad_vertical/unas_yendry.png' },
    { type: 'image', src: '/publicidad_vertical/anunciete_1.png' },
    { type: 'image', src: '/publicidad_vertical/chinito_express.png' },
    { type: 'video', src: '/publicidad_vertical/comercial_chinito.mp4' }
];

const Camaras = () => {
    const navigate = useNavigate();
    
    // ESTADOS DEL AUDIO
    const [volume, setVolume] = useState(0.5);
    const [isMuted, setIsMuted] = useState(false);
    const [showVolBar, setShowVolBar] = useState(false);
    const audioRef = useRef(null);

    // ESTADOS DE CÁMARAS Y PUBLICIDAD
    const [currentCamIndex, setCurrentCamIndex] = useState(0);
    const [isAdMode, setIsAdMode] = useState(false);
    const [currentAdIndex, setCurrentAdIndex] = useState(0);

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

    // 2. ACTUALIZAR VOLUMEN EN TIEMPO REAL
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    // 3. CAMBIAR DE CÁMARA CADA 2 MINUTOS (120,000 ms)
    useEffect(() => {
        const camTimer = setInterval(() => {
            setCurrentCamIndex((prev) => (prev + 1) % YOUTUBE_CAMS.length);
        }, 120000); 
        return () => clearInterval(camTimer);
    }, []);

    // 4. DISPARAR MODO COMERCIALES CADA 6 MINUTOS (360,000 ms)
    useEffect(() => {
        const adTrigger = setInterval(() => {
            setCurrentAdIndex(0); // Reiniciar lista de anuncios
            setIsAdMode(true);    // Partir la pantalla
        }, 360000); 
        return () => clearInterval(adTrigger);
    }, []);

    // 5. LÓGICA DE REPRODUCCIÓN DE COMERCIALES
    useEffect(() => {
        if (!isAdMode) return;

        const currentAd = PUBLICIDAD[currentAdIndex];
        
        // Si ya no hay más anuncios, volver a pantalla completa
        if (!currentAd) {
            setIsAdMode(false);
            return;
        }

        // Si es IMAGEN, esperamos 10 segundos y pasamos al siguiente
        if (currentAd.type === 'image') {
            const imgTimer = setTimeout(() => {
                setCurrentAdIndex((prev) => prev + 1);
            }, 10000);
            return () => clearTimeout(imgTimer);
        }
        // Si es VIDEO, el evento "onEnded" del tag <video> hará el cambio
    }, [isAdMode, currentAdIndex]);

    const handleVideoEnd = () => {
        setCurrentAdIndex((prev) => prev + 1);
    };

    return (
        <div className="broadcast-master bg-black h-screen w-screen overflow-hidden relative flex">
            
            {/* RADIO OCULTA DE FONDO */}
            <audio ref={audioRef} autoPlay loop />

            {/* LOGO FIJO */}
            <div className="absolute top-6 left-6 z-50 pointer-events-none">
                <img src={logoImage} alt="Fabulosa Logo" className="h-16 md:h-24 drop-shadow-[0_0_20px_rgba(0,0,0,1)]" />
            </div>

            {/* SECCIÓN IZQUIERDA: PANTALLA GIGANTE DE CÁMARAS */}
            <motion.div 
                className="h-full relative flex items-center justify-center bg-black overflow-hidden"
                animate={{ width: isAdMode ? '60vw' : '100vw' }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
            >
                {/* CANDADO / ESPEJO PARA QUE NO VAYAN A YOUTUBE */}
                <div className="absolute inset-0 z-40 bg-transparent cursor-default"></div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentCamIndex}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        className="absolute w-full h-full"
                    >
                        <iframe 
                            src={`https://www.youtube.com/embed/${YOUTUBE_CAMS[currentCamIndex]}?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0`}
                            className="w-full h-full pointer-events-none"
                            style={{ transform: 'scale(1.3)' }} // Zoom para evitar bordes negros de YouTube
                            frameBorder="0"
                            allow="autoplay; encrypted-media"
                        ></iframe>
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            {/* SECCIÓN DERECHA: CAJA DE COMERCIALES */}
            <motion.div 
                className="h-full bg-neutral-900 border-l border-neutral-800 flex items-center justify-center relative overflow-hidden"
                animate={{ width: isAdMode ? '40vw' : '0vw' }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
            >
                {isAdMode && PUBLICIDAD[currentAdIndex] && (
                    <motion.div 
                        key={currentAdIndex}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.8 }}
                        className="w-full h-full flex items-center justify-center p-4"
                    >
                        {PUBLICIDAD[currentAdIndex].type === 'image' ? (
                            <img 
                                src={PUBLICIDAD[currentAdIndex].src} 
                                alt="Anuncio" 
                                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                            />
                        ) : (
                            <video 
                                src={PUBLICIDAD[currentAdIndex].src} 
                                autoPlay 
                                muted={false} // Se reproduce con su propio audio
                                onEnded={handleVideoEnd}
                                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                            />
                        )}
                    </motion.div>
                )}
            </motion.div>

            {/* PANEL DE CONTROL: VOLUMEN Y SALIR */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-6 bg-black/60 backdrop-blur-md px-8 py-4 rounded-full border border-white/10">
                
                <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition font-bold flex items-center gap-2 text-sm uppercase tracking-widest">
                    <ArrowLeft size={18} /> Salir
                </button>

                <div className="w-px h-6 bg-white/20"></div>

                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                    <span className="text-white text-xs font-black tracking-[0.2em]">EN VIVO</span>
                </div>

                <div className="w-px h-6 bg-white/20"></div>

                {/* BOTÓN Y BARRA DE VOLUMEN INTELIGENTE */}
                <div 
                    className="relative flex items-center gap-4 group"
                    onMouseEnter={() => setShowVolBar(true)}
                    onMouseLeave={() => setShowVolBar(false)}
                >
                    <button 
                        onClick={() => setIsMuted(!isMuted)} 
                        className={`transition ${isMuted ? 'text-red-500' : 'text-green-400'}`}
                    >
                        {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </button>
                    
                    {/* La barra aparece y desaparece sola */}
                    <div className={`overflow-hidden transition-all duration-500 flex items-center ${showVolBar ? 'w-24 opacity-100' : 'w-0 opacity-0'}`}>
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
    );
};

export default Camaras;