import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Play, Pause, Volume2, VolumeX, Radio, 
  Music, Signal, Activity 
} from 'lucide-react';
import Hls from 'hls.js';
import { radiosCR } from '../data/radios-cr';
import './RadioPremium.css';

// IMAGEN DE FONDO (Usa una genérica o importa la tuya)
import bgRadio from '../assets/radio-bg.png'; 

const RadioPremium = () => {
  const [currentStation, setCurrentStation] = useState(radiosCR[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  
  // Referencias de Audio
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationRef = useRef(null);

  // --- REPRODUCTOR ---
  useEffect(() => {
    const audio = audioRef.current;
    
    const playStream = async () => {
      if (Hls.isSupported() && currentStation.isHls) {
        const hls = new Hls();
        hls.loadSource(currentStation.url);
        hls.attachMedia(audio);
      } else {
        audio.src = currentStation.url;
      }
      
      if(isPlaying) {
        try {
            await audio.play();
        } catch (error) {
            console.log("Esperando interacción del usuario...");
            setIsPlaying(false);
        }
      }
    };

    playStream();
  }, [currentStation]);

  useEffect(() => {
    if(isPlaying) audioRef.current.play().catch(() => setIsPlaying(false));
    else audioRef.current.pause();
  }, [isPlaying]);

  useEffect(() => {
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // --- VISUALIZADOR (ECUALIZADOR) ---
  const initVisualizer = () => {
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
    }
    drawVisualizer();
  };

  const drawVisualizer = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current) return;
    
    const ctx = canvas.getContext('2d');
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const renderFrame = () => {
        animationRef.current = requestAnimationFrame(renderFrame);
        analyserRef.current.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 1.5;
            
            // Gradiente Neón
            const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
            gradient.addColorStop(0, '#ff0033'); // Rojo Fabulosa
            gradient.addColorStop(1, '#ffcc00'); // Amarillo

            ctx.fillStyle = gradient;
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#ff0033";
            
            // Barras redondeadas
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 2;
        }
    };
    renderFrame();
  };

  const handlePlayToggle = () => {
    if (!audioContextRef.current) initVisualizer();
    if (audioContextRef.current?.state === 'suspended') audioContextRef.current.resume();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="radio-premium-container" style={{backgroundImage: `url(${bgRadio})`}}>
      <div className="radio-backdrop"></div>

      {/* HEADER */}
      <header className="rp-header">
        <Link to="/" className="rp-back-btn">
          <ArrowLeft size={20} /> <span className="hidden md:inline">REGRESAR AL MENÚ</span>
        </Link>
        <div className="rp-brand">
            <Radio size={24} className="text-red-500 animate-pulse" />
            <h1 className="text-2xl font-black tracking-widest text-white">
                CR<span className="text-red-600">TUNER</span>
            </h1>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="rp-main">
        
        {/* LISTA LATERAL */}
        <aside className="rp-sidebar custom-scrollbar">
            <h3 className="rp-section-title">Emisoras FM / AM</h3>
            <div className="rp-list">
                {radiosCR.map((radio) => (
                    <div 
                        key={radio.id}
                        onClick={() => { setCurrentStation(radio); setIsPlaying(true); }}
                        className={`rp-item ${currentStation.id === radio.id ? 'active' : ''}`}
                    >
                        <div className="rp-item-icon">
                            {radio.logo ? <img src={radio.logo} alt={radio.title} /> : <Music size={18} />}
                        </div>
                        <div className="rp-item-info">
                            <h4 className="font-bold text-sm truncate">{radio.title}</h4>
                            <div className="flex justify-between text-[10px] text-gray-400">
                                <span>{radio.frequency}</span>
                                <span className="uppercase text-red-400">{radio.genre}</span>
                            </div>
                        </div>
                        {currentStation.id === radio.id && isPlaying && (
                            <div className="rp-playing-indicator">
                                <span className="bar n1"></span>
                                <span className="bar n2"></span>
                                <span className="bar n3"></span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </aside>

        {/* REPRODUCTOR CENTRAL */}
        <section className="rp-player-area">
            
            {/* VISUALIZADOR */}
            <div className="rp-visualizer-box">
                <canvas ref={canvasRef} width={600} height={200} className="rp-canvas"></canvas>
                
                {/* Info de la Estación Actual */}
                <div className="rp-now-playing">
                    <div className="rp-np-badge">EN VIVO</div>
                    <h2 className="rp-np-title">{currentStation.title}</h2>
                    <p className="rp-np-freq">{currentStation.frequency} — {currentStation.genre}</p>
                </div>
            </div>

            {/* CONTROLES */}
            <div className="rp-controls-glass">
                {/* Volumen */}
                <div className="flex items-center gap-2 w-1/4">
                    <button onClick={() => setIsMuted(!isMuted)} className="text-gray-300 hover:text-white">
                        {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <input 
                        type="range" min="0" max="1" step="0.05" 
                        value={volume} onChange={(e) => setVolume(e.target.value)}
                        className="rp-vol-slider"
                    />
                </div>

                {/* Play / Pause Gigante */}
                <button className="rp-play-btn" onClick={handlePlayToggle}>
                    {isPlaying ? <Pause size={40} fill="white" /> : <Play size={40} fill="white" className="ml-2"/>}
                </button>

                {/* Indicador de Señal */}
                <div className="flex items-center gap-2 w-1/4 justify-end text-green-400 text-xs font-bold tracking-widest">
                    <Signal size={16} /> SEÑAL DIGITAL
                </div>
            </div>

        </section>

      </main>

      {/* AUDIO OCULTO */}
      <audio ref={audioRef} crossOrigin="anonymous" hidden></audio>
    </div>
  );
};

export default RadioPremium;