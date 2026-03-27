import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, PartyPopper, Sun } from 'lucide-react';

// === FONDO DE FIESTA Y VERANO ===
import fondoVerano from '../assets/verano-fondo.png';

const STREAM_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8";

const FabulosaVerano = () => {
  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isHovering, setIsHovering] = useState(false);

  // INICIALIZADOR DEL STREAM M3U8 (Usa HLS.js para fluidez total)
  useEffect(() => {
    let hls;
    
    const initPlayer = () => {
      const video = videoRef.current;
      if (!video) return;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = STREAM_URL;
        video.play().catch(e => console.log("Auto-play prevenido", e));
      } 
      else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          capLevelToPlayerSize: true,
          maxBufferLength: 30, 
        });
        hls.loadSource(STREAM_URL);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(e => console.log("Auto-play prevenido", e));
        });
      }
    };

    if (!window.Hls) {
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
      script.onload = initPlayer;
      document.body.appendChild(script);
    } else {
      initPlayer();
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      if (newMutedState) {
        setVolume(0);
      } else {
        setVolume(1);
        videoRef.current.volume = 1;
      }
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen().catch(err => console.log(err));
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div 
      className="relative min-h-screen w-full bg-black font-sans flex flex-col selection:bg-pink-500 overflow-hidden"
      style={{ backgroundImage: `url(${fondoVerano})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-pink-600/30 via-transparent to-cyan-500/30 mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* HEADER DE VERANO */}
      <div className="relative z-50 flex justify-between items-center p-6 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-6 flex-1">
            <Link to="/" className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-pink-500 rounded-full text-white font-bold border border-white/10 transition-all hover:scale-105 shadow-lg shadow-pink-500/20">
                <ArrowLeft size={18} /> SALIR
            </Link>
            <div className="flex items-center gap-3">
                <Sun className="text-yellow-400 animate-[spin_10s_linear_infinite]" size={32} />
                <h1 className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)] tracking-tighter uppercase">
                    Fabulosa Verano
                </h1>
            </div>
        </div>
        <div className="hidden md:flex gap-4 ml-4">
            <div className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full text-white font-black tracking-widest shadow-[0_0_20px_rgba(219,39,119,0.6)] animate-pulse">
                <PartyPopper size={18} /> Pura Fiesta
            </div>
        </div>
      </div>

      {/* REPRODUCTOR */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-40">
        <div 
            ref={playerContainerRef} 
            className="relative w-full max-w-6xl aspect-video bg-black/50 backdrop-blur-xl rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(236,72,153,0.4)] border border-pink-500/30 group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-1.5 bg-red-600/90 backdrop-blur-md rounded-full border border-red-400/50 shadow-lg">
                <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
                <span className="text-[11px] font-black text-white uppercase tracking-widest">En Vivo</span>
            </div>

            <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline onClick={togglePlay} />

            <div className={`absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent px-8 py-8 transition-opacity duration-300 flex items-center justify-between z-50 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex items-center gap-6">
                    <button onClick={togglePlay} className="w-14 h-14 bg-pink-500 hover:bg-pink-400 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110 shadow-[0_0_20px_rgba(236,72,153,0.6)]">
                        {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                    </button>

                    <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                        <button onClick={toggleMute} className="text-white hover:text-cyan-400 transition-colors">
                            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                        <input type="range" min="0" max="1" step="0.05" value={volume} onChange={handleVolumeChange} className="w-24 h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-400"/>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={toggleFullScreen} className="p-3 bg-black/40 hover:bg-cyan-500 backdrop-blur-md text-white rounded-full border border-white/10 transition-all transform hover:scale-110 shadow-lg">
                        <Maximize size={20} />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FabulosaVerano;