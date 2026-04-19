import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Radio, Tv, Instagram, Globe, Mail, Download, Megaphone } from 'lucide-react';

const FabulosaRadioVIP = () => {
  const videoRef = useRef(null);
  const audioPoolRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // 📡 SEÑAL DE FABULOSA
  const STREAM_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8";

  // 🎙️ LISTA COMPLETA DE LOCUTORES (15 Minutos / Música al 20%)
  const LOCUTORES_POOL = [
    "/media/voces/tony-garcia-chat-interactivo.mp3",
    "/media/voces/tony-garcia-dale-volumen.mp3",
    "/media/voces/tony-garcia-que-buena-nota.mp3",
    "/media/voces/tony-garcia-saludos-amas-de-casa.mp3",
    "/media/voces/tony-garcia-chat-en-vivo.mp3",
    "/media/voces/inicio.mp3",
    "/media/voces/miguel-bienvenidos.mp3",
    "/media/voces/miguel-voz-lenta.mp3",
    "/media/voces/rosalia-1.mp3",
    "/media/voces/rosalia-2.mp3",
    "/media/voces/rosalia-3.mp3",
    "/media/voces/claus-encant-bueno.mp3"
  ];

  // 📺 CARGA DE SEÑAL HLS
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

  // 🎚️ FUNCIÓN MIXER CON DUCKING (BAJA EL VOLUMEN)
  const playMixerAudio = (path, musicDuckVolume) => {
    if (!isPlaying || isMuted || !audioPoolRef.current || !videoRef.current) return;
    
    // Si ya está sonando algo, no interrumpimos para no hacer ruido
    if (!audioPoolRef.current.paused) return;

    audioPoolRef.current.src = path;
    // Efecto Mixer: Baja la música al nivel solicitado (0.2, 0.75 u 0.8)
    videoRef.current.volume = musicDuckVolume; 
    
    audioPoolRef.current.play().catch(e => console.error("Error al sonar audio:", e));

    audioPoolRef.current.onended = () => {
      // Efecto Mixer: Sube la música al 100% cuando termina la voz
      if (videoRef.current) videoRef.current.volume = 1;
    };
  };

  // 🕒 TEMPORIZADORES DE MÁQUINA (No se detienen)
  useEffect(() => {
    if (!isPlaying) return;

    // 1. LOCUTORES: Cada 15 minutos (900,000 ms) - Música al 20%
    const timerLocutores = setInterval(() => {
      const track = LOCUTORES_POOL[Math.floor(Math.random() * LOCUTORES_POOL.length)];
      playMixerAudio(track, 0.2);
    }, 900000);

    // 2. SELLO FABULOSA: Cada 4 minutos (240,000 ms) - Música al 80%
    const timerSello = setInterval(() => {
      playMixerAudio("/media/voces/sello-fabulosa.mp3", 0.8);
    }, 240000);

    // 3. SUBELE VOLUMEN: Cada 7 minutos (420,000 ms) - Música al 75%
    const timerSubele = setInterval(() => {
      playMixerAudio("/media/voces/subele-volumen.mp3", 0.75);
    }, 420000);

    return () => {
      clearInterval(timerLocutores);
      clearInterval(timerSello);
      clearInterval(timerSubele);
    };
  }, [isPlaying, isMuted]);

  const togglePlay = () => {
    if (isPlaying) {
        videoRef.current.pause();
    } else {
        videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans relative">
      
      {/* 🎬 FONDO YOUTUBE INFINITO (Máxima Resolución) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <iframe 
          className="w-[300%] h-[300%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          src="https://www.youtube.com/embed/sC6m9xDMfso?autoplay=1&mute=1&loop=1&playlist=sC6m9xDMfso&controls=0&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0"
          frameBorder="0"
          allow="autoplay; encrypted-media"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <nav className="relative z-50 p-6 flex items-center justify-between border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0">
        <Link to="/premium" className="p-3 bg-white/5 rounded-full hover:bg-yellow-500 hover:text-black transition-all">
          <ArrowLeft size={24} />
        </Link>
        <button onClick={() => playMixerAudio("/media/voces/sello-fabulosa.mp3", 0.7)} className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full font-black uppercase text-xs shadow-xl">
          <Megaphone size={16} /> Sonar Sello ID
        </button>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-zinc-900/80 p-10 rounded-[3rem] border border-white/10 shadow-2xl flex justify-center items-center backdrop-blur-md">
            <img src="/logo-fabulosa.png" alt="Fabulosa" className="w-full max-w-[250px] object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]" />
          </div>

          <div className="bg-gradient-to-br from-zinc-900/90 to-black/90 p-8 rounded-[2rem] border border-white/10 shadow-2xl backdrop-blur-md">
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
            <h2 className="text-2xl font-black uppercase tracking-widest text-white">Fabulosa TV VIP</h2>
          </div>
          <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden border border-white/10 bg-black/80 shadow-2xl backdrop-blur-sm">
            <video ref={videoRef} controls className="w-full h-full object-cover" poster="/logo-fabulosa.png" />
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4">
             <div className="bg-zinc-900/80 aspect-video rounded-2xl border border-white/10 flex items-center justify-center text-gray-400 font-bold uppercase text-[10px] backdrop-blur-md">Estudio en Vivo</div>
             <div className="bg-zinc-900/80 aspect-video rounded-2xl border border-white/10 flex items-center justify-center text-gray-400 font-bold uppercase text-[10px] backdrop-blur-md">Galería VIP</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FabulosaRadioVIP;