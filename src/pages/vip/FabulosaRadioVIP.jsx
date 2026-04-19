import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Radio, Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';

const STREAM_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8";

const AUDIO_POOL = [
  { path: "/media/voces/subele-volumen.mp3", duck: 0.7 },
  { path: "/media/voces/sello-fabulosa.mp3", duck: 0.7 },
  { path: "/media/voces/tony-garcia-dale-volumen.mp3", duck: 0.15 },
  { path: "/media/voces/tony-garcia-que-buena-nota.mp3", duck: 0.15 },
  { path: "/media/voces/tony-garcia-saludos-amas-de-casa.mp3", duck: 0.15 },
  { path: "/media/voces/tony-garcia-chat-en-vivo.mp3", duck: 0.15 }
];

const FabulosaRadioVIP = () => {
  const videoRef = useRef(null);
  const audioPoolRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Inyección de anuncio Push para monetizar esta página VIP también
    const s = document.createElement('script');
    s.dataset.zone = '10894955';
    s.src = 'https://nap5k.com/tag.min.js';
    document.body.appendChild(s);
    
    // Lógica de Locutores Automáticos
    const playRandomAudio = () => {
      if (!isPlaying || isMuted) return;
      const track = AUDIO_POOL[Math.floor(Math.random() * AUDIO_POOL.length)];
      audioPoolRef.current.src = track.path;
      
      if (videoRef.current) videoRef.current.volume = track.duck;
      audioPoolRef.current.play();
      
      audioPoolRef.current.onended = () => {
        if (videoRef.current) videoRef.current.volume = 1;
      };
    };

    const interval = setInterval(playRandomAudio, 300000); // Cada 5 minutos
    return () => {
        clearInterval(interval);
        if (document.body.contains(s)) document.body.removeChild(s);
    };
  }, [isPlaying, isMuted]);

  const togglePlay = () => {
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans overflow-x-hidden">
      <nav className="p-6 flex items-center justify-between border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <Link to="/premium" className="p-3 bg-white/5 rounded-full hover:bg-yellow-500 hover:text-black transition-all">
          <ArrowLeft size={24} />
        </Link>
        <div className="flex items-center gap-3">
            <Radio className="text-yellow-500 animate-pulse" />
            <span className="font-black uppercase tracking-widest text-sm">Fabulosa Radio VIP</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-8 flex flex-col items-center">
        {/* LOGO GIGANTE VIP */}
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-12">
            <img src="/logo-fabulosa.png" className="h-48 md:h-64 object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]" alt="Logo" />
        </motion.div>

        {/* REPRODUCTOR ELEGANTE */}
        <div className="w-full max-w-2xl bg-zinc-900/80 p-8 rounded-[3rem] border border-white/10 backdrop-blur-md shadow-2xl flex flex-col items-center gap-8">
            <video ref={videoRef} src={STREAM_URL} className="hidden" />
            <audio ref={audioPoolRef} className="hidden" />

            <div className="text-center">
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 text-yellow-500">Señal en Vivo</h2>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Streaming de Alta Definición</p>
            </div>

            <button onClick={togglePlay} className="w-32 h-32 bg-yellow-500 rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform shadow-[0_0_50px_rgba(234,179,8,0.4)]">
                {isPlaying ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" className="ml-2" />}
            </button>

            <div className="flex gap-4 w-full">
                <button onClick={() => setIsMuted(!isMuted)} className="flex-1 py-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                    {isMuted ? <VolumeX /> : <Volume2 />} <span>{isMuted ? "Silenciado" : "Audio ON"}</span>
                </button>
                <button className="flex-1 py-4 bg-blue-600 rounded-2xl hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 font-bold uppercase text-xs">
                    <Megaphone size={18} /> Sello ID
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FabulosaRadioVIP;