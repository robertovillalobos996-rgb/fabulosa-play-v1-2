import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, ArrowLeft } from 'lucide-react';
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

    // ESTADOS DE CÁMARAS Y TRANSICIÓN
    const [currentCamIndex, setCurrentCamIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    
    // ESTADOS DE PUBLICIDAD
    const [isAdMode, setIsAdMode] = useState(false);
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const hasFirstAdPlayed = useRef(false);

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

    // 3. CAMBIAR DE CÁMARA CADA 2 MINUTOS (Dispara el video de transición)
    useEffect(() => {
        const camTimer = setInterval(() => {
            setIsTransitioning(true); // Arranca el video cortinilla
        }, 120000); 
        return () => clearInterval(camTimer);
    }, []);

    // 4. LÓGICA DEL RELOJ DE PUBLICIDAD (15 segs al inicio, luego cada 6 mins)
    useEffect(() => {
        if (isAdMode) return; // Si la publicidad está activa, pausa el reloj

        // Si es la primera vez, espera 15 segundos. Si ya pasó la primera vez, espera 6 minutos.
        const delay = hasFirstAdPlayed.current ? 360000 : 15000;
        
        const adTimer = setTimeout(() => {
            hasFirstAdPlayed.current = true;
            setCurrentAdIndex(0);
            setIsAdMode(true);
        }, delay);

        return () => clearTimeout(adTimer);
    }, [isAdMode]);

    // 5. REPRODUCCIÓN AUTOMÁTICA DE COMERCIALES
    useEffect(() => {
        if (!isAdMode) return;

        const currentAd = PUBLICIDAD[currentAdIndex];
        if (!currentAd) {
            setIsAdMode(false); // Cierra la caja al terminar la lista
            return;
        }

        if (currentAd.type === 'image') {
            const imgTimer = setTimeout(() => {
                setCurrentAdIndex((prev) => prev + 1);
            }, 10000); // Regla de los 10 segundos
            return () => clearTimeout(imgTimer);
        }
    }, [isAdMode, currentAdIndex]);

    return (
        <div className="broadcast-master bg-black h-screen w-screen overflow-hidden relative flex">
            
            <audio ref={audioRef} autoPlay loop />

            <div className="absolute top-6 left-6 z-[80] pointer-events-none">
                <img src={logoImage} alt="Fabulosa Logo" className="h-16 md:h-24 drop-shadow-[0_0_20px_rgba(0,0,0,1)]" />
            </div>

            {/* SECCIÓN IZQUIERDA: PANTALLA GIGANTE CON CÁMARAS Y TRANSICIONES */}
            <motion.div 
                className="h-full relative flex items-center justify-center bg-black overflow-hidden"
                animate={{ width: isAdMode ? '60vw' : '100vw' }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
            >
                {/* CANDADO / ESPEJO INVISIBLE */}
                <div className="absolute inset-0 z-40 bg-transparent cursor-default"></div>

                {/* VIDEO CORTINILLA (SE REPRODUCE AL CAMBIAR CÁMARA) */}
                <AnimatePresence>
                    {isTransitioning && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 z-50 bg-black"
                        >
                            <video 
                                src="/logo_fabulosa_moviento.mp4" 
                                autoPlay 
                                muted 
                                className="w-full h-full object-cover"
                                onPlay={() => {
                                    // Cambia la cámara en el fondo apenas empieza la cortinilla
                                    setCurrentCamIndex((prev) => (prev + 1) % YOUTUBE_CAMS.length);
                                }}
                                onEnded={() => {
                                    // Oculta el video cuando termina, revelando la nueva cámara
                                    setIsTransitioning(false);
                                }}
                                onError={() => {
                                    setCurrentCamIndex((prev) => (prev + 1) % YOUTUBE_CAMS.length);
                                    setIsTransitioning(false);
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* EL CANAL DE YOUTUBE */}
                <div className="absolute w-full h-full">
                    <iframe 
                        key={currentCamIndex} // Fuerza a recargar el iframe cuando cambia el índice
                        src={`https://www.youtube.com/embed/${YOUTUBE_CAMS[currentCamIndex]}?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0`}
                        className="w-full h-full pointer-events-none"
                        style={{ transform: 'scale(1.3)' }}
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                    ></iframe>
                </div>
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
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full flex items-center justify-center p-4 bg-black"
                    >
                        {PUBLICIDAD[currentAdIndex].type === 'image' ? (
                            <img 
                                src={PUBLICIDAD[currentAdIndex].src} 
                                alt="Anuncio Fabulosa" 
                                className="max-w-full max-h-full object-contain drop-shadow-2xl"
                            />
                        ) : (
                            <video 
                                src={PUBLICIDAD[currentAdIndex].src} 
                                autoPlay 
                                muted={false} 
                                onEnded={() => setCurrentAdIndex((prev) => prev + 1)}
                                className="max-w-full max-h-full object-contain drop-shadow-2xl"
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

                {/* CONTROL DE VOLUMEN TOTALMENTE INVISIBLE (FANTASMA) */}
                <div 
                    className="relative flex items-center group h-10 ml-2"
                    onMouseEnter={() => setShowVolBar(true)}
                    onMouseLeave={() => setShowVolBar(false)}
                >
                    {/* El escudo invisible para detectar el mouse */}
                    <div className="absolute inset-0 z-10 w-full h-full cursor-pointer min-w-[40px]"></div>

                    {/* El botón de volumen real que aparece solo al pasar el mouse */}
                    <div className={`flex items-center gap-4 transition-all duration-500 pl-4 ${showVolBar ? 'opacity-100' : 'opacity-0'}`}>
                        <button 
                            onClick={() => setIsMuted(!isMuted)} 
                            className={`transition z-20 ${isMuted ? 'text-red-500' : 'text-green-400'}`}
                        >
                            {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
                        </button>
                        
                        <div className={`overflow-hidden transition-all duration-500 flex items-center z-20 ${showVolBar ? 'w-24' : 'w-0'}`}>
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
    );
};

export default Camaras;