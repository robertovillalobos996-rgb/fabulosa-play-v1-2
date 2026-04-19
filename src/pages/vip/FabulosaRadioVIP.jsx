import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Radio, Tv, Instagram, Globe, Mail, Download, Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';

const FabulosaRadioVIP = () => {
  const videoRef = useRef(null);
  const audioPoolRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // 📡 SU SEÑAL REAL (FABULOSA)
  const STREAM_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8";

  // 🎙️ SU LÓGICA DE VOCES Y SELLOS
  const AUDIO_POOL = [
    { path: "/media/voces/subele-volumen.mp3", duck: 0.7 },
    { path: "/media/voces/sello-fabulosa.mp3", duck: 0.7 },
    { path: "/media/voces/tony-garcia-dale-volumen.mp3", duck: 0.15 },
    { path: "/media/voces/tony-garcia-que-buena-nota.mp3", duck: 0.15 },
    { path: "/media/voces/tony-garcia-saludos-amas-de-casa.mp3", duck: 0.15 },
    { path: "/media/voces/tony-garcia-chat-en-vivo.mp3", duck: 0.15 }
  ];

  // 📺 CARGA DE SEÑAL HLS (PARA TV Y RADIO)
  useEffect(() => {
    const loadVideo = () => {
      if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls();
        hls.loadSource(STREAM_URL);
        hls.attachMedia(videoRef.current);
        hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
            if (isPlaying) videoRef.current.play().catch(e => {});
        });
      } else if (videoRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = STREAM_URL;
      }
    };
    if (!window.Hls) {
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
      script.onload = loadVideo;
      document.body.appendChild(script);
    } else { loadVideo(); }
  }, []);

  // 🎙️ LÓGICA DE LOCUTORES AUTOMÁTICOS (DUCKING)
  useEffect(() => {
    const playRandomAudio = () => {
      if (!isPlaying || isMuted) return;
      const track = AUDIO_POOL[Math.floor(Math.random() * AUDIO_POOL.length)];
      playSpecificAudio(track);
    };

    const interval = setInterval(playRandomAudio, 300000); // Cada 5 minutos
    return () => clearInterval(interval);
  }, [isPlaying, isMuted]);

  // Función para procesar cualquier audio con ducking
  const playSpecificAudio = (track) => {
    if (audioPoolRef.current && videoRef.current) {
      audioPoolRef.current.src = track.path;
      videoRef.current.volume = track.duck; // Baja música
      audioPoolRef.current.play();
      audioPoolRef.current.onended = () => {
        if (videoRef.current) videoRef.current.volume = 1; // Sube música
      };
    }
  };

  // 💥 FUNCIÓN DEL BOTÓN "SELLO ID"
  const triggerManualSello = () => {
    const selloTrack = { path: "/media/voces/sello-fabulosa.mp3", duck: 0.6 };
    playSpecificAudio(selloTrack);
  };

  const togglePlay = () => {
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden font-sans">
      <nav className="p-6 flex items-center justify-between border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <Link to="/premium" className="p-3 bg-white/5 rounded-full hover:bg-yellow-500 hover:text-black transition-all">
          <ArrowLeft size={24} />
        </Link>
        {/* BOTÓN DE SELLO ID CONECTADO A LA LÓGICA */}
        <button onClick={triggerManualSello} className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full font-black uppercase text-xs transition-colors shadow-lg">
          <Megaphone size={16} /> Sonar Sello ID
        </button>
      </nav>

      <div className="max-w-7xl mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-zinc-900/50 p-10 rounded-[3rem] border border-white/5 shadow-2xl flex justify-center items-center">
            <img src="/logo-fabulosa.png" alt="Fabulosa" className="w-full max-w-[250px] object-contain" />
          </div>

          <div className="bg-gradient-to-br from-zinc-900 to-black p-8 rounded-[2rem] border border-white/10 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <Radio className="text-yellow-500" size={30} />
              <h2 className="text-xl font-black uppercase tracking-widest text-yellow-500">Radio VIP</h2>
            </div>
            
            <audio ref={audioPoolRef} className="hidden" />

            <button onClick={togglePlay} className="w-full py-4 rounded-full font-black uppercase bg-yellow-500 text-black shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-3">
              {isPlaying ? <Pause fill="black" /> : <Play fill="black" />}
              {isPlaying ? "PAUSAR SEÑAL" : "ENCENDER RADIO"}
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="flex-1 bg-white/5 p-3 rounded-xl flex items-center justify-center hover:bg-pink-600 transition-colors"><Instagram size={20} /></button>
            <button className="flex-1 bg-white/5 p-3 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors"><Globe size={20} /></button>
            <button className="flex-1 bg-white/5 p-3 rounded-xl flex items-center justify-center hover:bg-green-600 transition-colors"><Mail size={20} /></button>
            <button className="flex-1 bg-white/5 p-3 rounded-xl flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-colors"><Download size={20} /></button>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col">
          <div className="flex items-center gap-3 mb-6 px-4">
            <Tv className="text-blue-500" size={28} />
            <h2 className="text-2xl font-black uppercase tracking-widest">Fabulosa TV VIP</h2>
          </div>
          <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden border border-white/10 bg-black shadow-2xl">
            <video ref={videoRef} controls className="w-full h-full object-cover" poster="/logo-fabulosa.png" />
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4">
             <div className="bg-zinc-900/50 aspect-video rounded-2xl border border-white/5 flex items-center justify-center text-gray-500 font-bold uppercase text-[10px]">Cámara en Vivo</div>
             <div className="bg-zinc-900/50 aspect-video rounded-2xl border border-white/5 flex items-center justify-center text-gray-500 font-bold uppercase text-[10px]">Galería VIP</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FabulosaRadioVIP;