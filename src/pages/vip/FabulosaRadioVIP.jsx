import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Radio, Tv, Instagram, Globe, Mail, Download, Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';

const FabulosaRadioVIP = () => {
  const videoRef = useRef(null);
  const audioPoolRef = useRef(null);
  const [isPlayingRadio, setIsPlayingRadio] = useState(false);

  // 🔗 ENLACES DE FABULOSA
  const TV_URL = "https://tvservices.fullhd-streaming.com:3941/multi_web/play_720.m3u8"; 
  const RADIO_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8";

  // 🎙️ BOLSA DE VOCES (Lógica de Verano)
  const AUDIO_POOL = [
    { path: "/media/voces/subele-volumen.mp3", duck: 0.7 },
    { path: "/media/voces/sello-fabulosa.mp3", duck: 0.7 },
    { path: "/media/voces/tony-garcia-dale-volumen.mp3", duck: 0.15 },
    { path: "/media/voces/tony-garcia-que-buena-nota.mp3", duck: 0.15 },
    { path: "/media/voces/tony-garcia-saludos-amas-de-casa.mp3", duck: 0.15 },
    { path: "/media/voces/tony-garcia-chat-en-vivo.mp3", duck: 0.15 }
  ];

  // 📺 CARGA DE TV (HLS)
  useEffect(() => {
    const loadVideo = () => {
      if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls();
        hls.loadSource(TV_URL);
        hls.attachMedia(videoRef.current);
        hls.on(window.Hls.Events.MANIFEST_PARSED, () => videoRef.current.play().catch(e => {}));
      } else if (videoRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = TV_URL;
      }
    };
    if (!window.Hls) {
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
      script.onload = loadVideo;
      document.body.appendChild(script);
    } else { loadVideo(); }
  }, []);

  // 🎙️ LÓGICA DE LOCUTORES AUTOMÁTICOS
  useEffect(() => {
    const playRandomAudio = () => {
      if (!isPlayingRadio) return;
      const track = AUDIO_POOL[Math.floor(Math.random() * AUDIO_POOL.length)];
      if (audioPoolRef.current) {
        audioPoolRef.current.src = track.path;
        // Ducking: Baja el volumen de la radio para que hable el locutor
        const radioElement = document.getElementById('radio-hls-element');
        if (radioElement) radioElement.volume = track.duck;
        
        audioPoolRef.current.play();
        audioPoolRef.current.onended = () => {
          if (radioElement) radioElement.volume = 1;
        };
      }
    };

    const interval = setInterval(playRandomAudio, 300000); // Cada 5 minutos
    return () => clearInterval(interval);
  }, [isPlayingRadio]);

  const toggleRadio = () => {
    const radioElement = document.getElementById('radio-hls-element');
    if (isPlayingRadio) {
      radioElement.pause();
    } else {
      radioElement.play();
      if(videoRef.current) videoRef.current.muted = true;
    }
    setIsPlayingRadio(!isPlayingRadio);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden font-sans">
      <nav className="p-6 flex items-center justify-between border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <Link to="/premium" className="p-3 bg-white/5 rounded-full hover:bg-yellow-500 hover:text-black transition-all">
          <ArrowLeft size={24} />
        </Link>
        <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full font-black uppercase text-xs transition-colors">
          <Megaphone size={16} /> Sonar Sello ID
        </button>
      </nav>

      <div className="max-w-7xl mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* COLUMNA IZQUIERDA (IGUAL A VOICE OVER) */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-zinc-900/50 p-10 rounded-[3rem] border border-white/5 shadow-2xl flex justify-center items-center">
            <img src="/logo-fabulosa.png" alt="Fabulosa" className="w-full max-w-[250px] object-contain" />
          </div>

          <div className="bg-gradient-to-br from-zinc-900 to-black p-8 rounded-[2rem] border border-white/10">
            <div className="flex items-center gap-4 mb-6">
              <Radio className="text-yellow-500" size={30} />
              <h2 className="text-xl font-black uppercase tracking-widest">Radio en Vivo</h2>
            </div>
            
            <video id="radio-hls-element" src={RADIO_URL} className="hidden" />
            <audio ref={audioPoolRef} className="hidden" />

            <button onClick={toggleRadio} className="w-full py-4 rounded-full font-black uppercase bg-yellow-500 text-black shadow-lg hover:scale-105 transition-transform">
              {isPlayingRadio ? "Pausar Radio" : "Escuchar Ahora"}
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="flex-1 bg-white/5 p-3 rounded-xl flex items-center justify-center hover:bg-pink-600 transition-colors"><Instagram size={20} /></button>
            <button className="flex-1 bg-white/5 p-3 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors"><Globe size={20} /></button>
            <button className="flex-1 bg-white/5 p-3 rounded-xl flex items-center justify-center hover:bg-green-600 transition-colors"><Mail size={20} /></button>
            <button className="flex-1 bg-white/5 p-3 rounded-xl flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-colors"><Download size={20} /></button>
          </div>
        </div>

        {/* COLUMNA DERECHA (IGUAL A VOICE OVER) */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <Tv className="text-blue-500" size={28} />
            <h2 className="text-2xl font-black uppercase tracking-widest">Señal de TV</h2>
          </div>

          <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden border border-white/10 bg-black shadow-2xl">
            <video ref={videoRef} controls autoPlay muted className="w-full h-full object-cover" />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
             <div className="bg-zinc-900/50 aspect-video rounded-2xl border border-white/5 flex items-center justify-center text-gray-500 font-bold uppercase text-[10px]">Cámara en Vivo</div>
             <div className="bg-zinc-900/50 aspect-video rounded-2xl border border-white/5 flex items-center justify-center text-gray-500 font-bold uppercase text-[10px]">Galería de Fotos</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FabulosaRadioVIP;