import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Maximize } from 'lucide-react';
import fondoVerano from '../assets/verano-fondo.png';

const STREAM_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8";

const SELLO_FABULOSA = "/media/voces/sello-fabulosa.mp3";
const SUBELE_VOLUMEN = "/media/voces/subele-volumen.mp3";
const LOCUTORES = [
  "/media/voces/tony-garcia-que-buena-nota.mp3",
  "/media/voces/tony-garcia-saludos-amas-de-casa.mp3",
  "/media/voces/tony-garcia-chat-en-vivo.mp3",
  "/media/voces/tony-garcia-chat-interactivo.mp3",
  "/media/voces/tony-garcia-dale-volumen.mp3",
  "/media/voces/miguel-voz-lenta.mp3",
  "/media/voces/miguel-bienvenidos.mp3",
  "/media/voces/rosalia-1.mp3",
  "/media/voces/rosalia-2.mp3",
  "/media/voces/rosalia-3.mp3",
  "/media/voces/claus-encant-bueno.mp3",
  "/media/voces/inicio.mp3"
];

// RUTAS DE BANNER CORREGIDAS (SIN LA Ñ)
const VERTICAL_ADS = [
  "/publicidad_vertical/anunciete_1.png", 
  "/publicidad_vertical/chinito_express.png",
  "/publicidad_vertical/mexicana_1.png", 
  "/publicidad_vertical/mexicana_2.png", 
  "/publicidad_vertical/unas_yendry.png"
];

const FabulosaVerano = () => {
  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  const effectAudioRef = useRef(new Audio());
  
  // ESTADO NUEVO PARA DESBLOQUEAR EL AUDIO
  const [hasStarted, setHasStarted] = useState(false); 
  const [volume, setVolume] = useState(1);
  const [vAdIndex, setVAdIndex] = useState(0);

  const playOverlayAudio = (path, duckingLevel) => {
    if (!videoRef.current) return;
    const originalVolume = videoRef.current.volume;
    videoRef.current.volume = originalVolume * duckingLevel;
    
    effectAudioRef.current.src = path;
    effectAudioRef.current.play().catch(e => console.log("Error al reproducir voz:", path));
    
    effectAudioRef.current.onended = () => {
      if (videoRef.current) videoRef.current.volume = originalVolume;
    };
  };

  // LOS TIEMPOS DE AUDIO SOLO INICIAN SI YA LE DIO PLAY
  useEffect(() => {
    if (!hasStarted) return;

    const selloInterval = setInterval(() => playOverlayAudio(SELLO_FABULOSA, 0.8), 180000);
    const subeleInterval = setInterval(() => playOverlayAudio(SUBELE_VOLUMEN, 0.8), 240000);
    const locutorInterval = setInterval(() => {
      const randomLocutor = LOCUTORES[Math.floor(Math.random() * LOCUTORES.length)];
      playOverlayAudio(randomLocutor, 0.6);
    }, 1800000);

    return () => {
      clearInterval(selloInterval); clearInterval(subeleInterval); clearInterval(locutorInterval);
    };
  }, [hasStarted]);

  // EL BANNER ROTA DESDE EL PRINCIPIO (Cada 15 Seg)
  useEffect(() => {
    const adInterval = setInterval(() => setVAdIndex((prev) => (prev + 1) % VERTICAL_ADS.length), 15000);
    return () => clearInterval(adInterval);
  }, []);

  useEffect(() => {
    if (videoRef.current) videoRef.current.src = STREAM_URL;
  }, []);

  // FUNCIÓN PARA DESBLOQUEAR REPRODUCTOR
  const handleStart = () => {
    setHasStarted(true);
    if (videoRef.current) {
        videoRef.current.play().catch(e => console.log("Error de video", e));
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black flex flex-col overflow-hidden" style={{ backgroundImage: `url(${fondoVerano})`, backgroundSize: 'cover' }}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md"></div>
      
      <div className="relative z-50 flex justify-between items-center p-6 bg-gradient-to-b from-black to-transparent">
        <Link to="/" className="px-6 py-2 bg-white/10 hover:bg-pink-500 rounded-full text-white font-bold border border-white/10 transition-all">SALIR</Link>
        <h1 className="text-3xl md:text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 uppercase tracking-tighter">Fabulosa Verano</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-40">
        <div className="flex flex-col 2xl:flex-row items-center justify-center gap-10 w-full max-w-[1850px]">
            
            <div ref={playerContainerRef} className="relative group bg-black shadow-2xl border border-pink-500/20 w-full 2xl:flex-1 aspect-video rounded-[3.5rem] overflow-hidden">
                
                {/* BOTÓN GIGANTE PARA DESBLOQUEAR NAVEGADOR */}
                {!hasStarted && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 cursor-pointer" onClick={handleStart}>
                        <div className="w-24 h-24 bg-pink-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(236,72,153,0.5)]">
                            <Play size={50} className="text-white ml-2" />
                        </div>
                        <p className="text-white font-bold tracking-widest text-xl">INICIAR FIESTA</p>
                        <p className="text-white/50 text-sm mt-2">(Requerido para activar las voces de los locutores)</p>
                    </div>
                )}

                <video ref={videoRef} className="w-full h-full object-cover" playsInline />
                
                <div className="absolute bottom-0 left-0 w-full p-12 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black to-transparent z-40">
                    <button onClick={() => videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause()} className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center text-white"><Play size={40} /></button>
                    <input type="range" min="0" max="1" step="0.1" onChange={(e) => {videoRef.current.volume = e.target.value; setVolume(e.target.value);}} className="w-40 accent-cyan-400"/>
                </div>
            </div>

            <div className="w-full 2xl:w-[480px] h-[450px] md:h-[700px] bg-black/30 backdrop-blur-3xl rounded-[3.5rem] border border-white/10 overflow-hidden shadow-2xl">
                <img src={VERTICAL_ADS[vAdIndex]} className="w-full h-full object-contain" alt="Publicidad" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default FabulosaVerano;