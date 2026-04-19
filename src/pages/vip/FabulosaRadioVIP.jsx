import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Radio, Tv, Globe, Megaphone } from 'lucide-react';

const FabulosaRadioVIP = () => {
  const videoRef = useRef(null);
  const audioPoolRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // 📡 SEÑAL DE FABULOSA (HLS)
  const STREAM_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8";

  // 🎙️ LA ARTILLERÍA COMPLETA: LOS 12 LOCUTORES SAGRADOS (No tocar)
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

  // 📱 DATOS DE CONTACTO (Rellenados por solicitud, sagrados también)
  const CONTACTO = {
    whatsapp: "https://wa.me/50664035313",
    email: "mailto:fabulosaplay@gmail.com",
    web: "https://www.fabulosaplay.online"
  };

  // 🎚️ LÓGICA COMPLETA DEL MIXER (DUCKING)
  const playMixerAudio = (path, duckVolume) => {
    // Si la radio no está encendida o ya hay una voz sonando, esperamos
    if (!isPlaying || !audioPoolRef.current || !videoRef.current) return;
    
    // Evita montajes de voces
    if (!audioPoolRef.current.paused) return; 

    audioPoolRef.current.src = path;
    
    // 1. BAJA LA MÚSICA AL NIVEL SOLICITADO (Efecto Mixer)
    videoRef.current.volume = duckVolume;
    
    // 2. DISPARA EL AUDIO DE LA VOZ
    audioPoolRef.current.play().catch(e => {
        console.error("Error de audio:", e);
        videoRef.current.volume = 1; // Si falla el audio, sube la música de una vez
    });

    // 3. CUANDO TERMINA EL LOCUTOR, SUBE LA MÚSICA AL 100% (Efecto Mixer)
    audioPoolRef.current.onended = () => {
      if (videoRef.current) videoRef.current.volume = 1;
    };
  };

  // 🕒 LÓGICA COMPLETA DE TEMPORIZADORES AUTOMÁTICOS (24/7 sin parar)
  useEffect(() => {
    if (!isPlaying) return;

    // Sello de confirmación inicial a los 2 segundos
    setTimeout(() => playMixerAudio("/media/voces/sello-fabulosa.mp3", 0.8), 2000);

    // 1. TEMPORIZADOR LOCUTORES (15 min / 900,000 ms) -> Música al 20%
    const timerLocutores = setInterval(() => {
      const track = LOCUTORES_POOL[Math.floor(Math.random() * LOCUTORES_POOL.length)];
      playMixerAudio(track, 0.2);
    }, 900000);

    // 2. TEMPORIZADOR SELLO FABULOSA (4 min / 240,000 ms) -> Música al 80%
    const timerSello = setInterval(() => {
      playMixerAudio("/media/voces/sello-fabulosa.mp3", 0.8);
    }, 240000);

    // 3. TEMPORIZADOR SUBELE VOLUMEN (7 min / 420,000 ms) -> Música al 75%
    const timerSubele = setInterval(() => {
      playMixerAudio("/media/voces/subele-volumen.mp3", 0.75);
    }, 420000);

    // Cleanup de temporizadores al apagar o salir
    return () => {
      clearInterval(timerLocutores);
      clearInterval(timerSello);
      clearInterval(timerSubele);
    };
  }, [isPlaying]);

  // 📺 LÓGICA COMPLETA DE CARGA TV HLS (Usando hls.js)
  useEffect(() => {
    const loadHLS = () => {
      if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls();
        hls.loadSource(STREAM_URL);
        hls.attachMedia(videoRef.current);
        hls.on(window.Hls.Events.MANIFEST_PARSED, () => { if(isPlaying) videoRef.current.play(); });
      }
    };
    if (window.Hls) loadHLS();
    else {
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
      script.onload = loadHLS;
      document.body.appendChild(script);
    }
  }, [isPlaying]);

  const togglePlay = () => {
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans relative">
      
      {/* 🎬 FONDO DE VIDEO YOUTUBE (Loop Infinito, Máxima Resolución) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <iframe 
          className="w-[300%] h-[300%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          src="https://www.youtube.com/embed/JQczw3V7St8?autoplay=1&mute=1&loop=1&playlist=JQczw3V7St8&controls=0&modestbranding=1&rel=0"
          frameBorder="0" allow="autoplay; encrypted-media"
        />
        {/* Capa de oscuridad leve para contraste */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <nav className="relative z-50 p-6 flex items-center justify-between border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0">
        <Link to="/premium" className="p-3 bg-white/5 rounded-full hover:bg-yellow-500 hover:text-black transition-all">
          <ArrowLeft size={24} />
        </Link>
        {/* Botón Manual de Sello */}
        <button onClick={() => playMixerAudio("/media/voces/sello-fabulosa.mp3", 0.7)} className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full font-black uppercase text-xs shadow-lg">
          <Megaphone size={16} /> Sonar Sello ID
        </button>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LADO IZQUIERDO: LOGO Y CONTROLES */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* Logo Fabulosa Gigante (max-w-[400px]) */}
          <div className="bg-zinc-900/80 p-6 rounded-[3rem] border border-white/10 shadow-2xl flex justify-center items-center backdrop-blur-md">
            <img src="/logo-fabulosa.png" alt="Fabulosa" className="w-full max-w-[400px] object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform duration-500" />
          </div>

          {/* Controles de Radio */}
          <div className="bg-gradient-to-br from-zinc-900/90 to-black/90 p-8 rounded-[2rem] border border-white/10 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-4 mb-6">
              <Radio className="text-yellow-500" size={30} />
              <h2 className="text-xl font-black uppercase tracking-widest text-yellow-500">Radio VIP</h2>
            </div>
            
            {/* Elemento de Audio Oculto para el Mixer */}
            <audio ref={audioPoolRef} className="hidden" />

            <button onClick={togglePlay} className="w-full py-4 rounded-full font-black uppercase bg-yellow-500 text-black shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-3">
              {isPlaying ? <Pause fill="black" /> : <Play fill="black" />}
              {isPlaying ? "PAUSAR SEÑAL" : "ENCENDER RADIO"}
            </button>
          </div>

          {/* ICONOS SOCIALES ANIMADOS ORIGINALES RELLENADOS (Mantenemos colores y movimiento) */}
          <div className="flex gap-4 justify-center">
            
            {/* WhatsApp - +506 64035313 */}
            <a href={CONTACTO.whatsapp} target="_blank" rel="noopener noreferrer" 
               className="flex-1 bg-zinc-900/80 p-4 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors shadow-lg border border-white/5 text-center group">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="#25D366" className="animate-bounce group-hover:scale-110 transition-transform">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>

            {/* Gmail - fabulosaplay@gmail.com */}
            <a href={CONTACTO.email} target="_blank" rel="noopener noreferrer"
               className="flex-1 bg-zinc-900/80 p-4 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors shadow-lg border border-white/5 text-center group">
              <svg viewBox="0 0 24 24" width="32" height="32" className="animate-bounce group-hover:scale-110 transition-transform" style={{animationDelay: "100ms"}}>
                <path fill="#EA4335" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 8.414l8.073-4.921c1.618-1.214 3.927-.059 3.927 1.964Z"/><path fill="#34A853" d="M18.545 21h3.819C23.268 21 24 20.268 24 19.366V11.73l-5.455 4.091v5.18Z"/><path fill="#FBBC05" d="M24 5.457v6.273L18.545 15.82v-5.18l5.455-4.091Z"/><path fill="#4285F4" d="M0 5.457v6.273L5.455 15.82v-5.18L0 11.73Z"/><path fill="#C5221F" d="M0 11.73v7.636C0 20.268.732 21 1.636 21h3.819v-5.18L0 15.82Z"/>
              </svg>
            </a>

            {/* Web - www.fabulosaplay.online */}
            <a href={CONTACTO.web} target="_blank" rel="noopener noreferrer"
               className="flex-1 bg-zinc-900/80 p-4 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors shadow-lg border border-white/5 text-center group">
              <Globe size={32} color="#4285F4" className="animate-bounce group-hover:scale-110 transition-transform" style={{animationDelay: "200ms"}} />
            </a>

          </div>
        </div>

        {/* LADO DERECHO: TELEVISOR TV VIP */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="flex items-center gap-3 mb-6 px-4"><Tv className="text-blue-500" size={28} /><h2 className="text-2xl font-black uppercase tracking-widest text-white">Fabulosa TV VIP</h2></div>
          {/* Reproductor de Video (Señal de TV/Radio) */}
          <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden border border-white/10 bg-black/80 shadow-2xl backdrop-blur-sm">
            <video ref={videoRef} controls className="w-full h-full object-cover" poster="/logo-fabulosa.png" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default FabulosaRadioVIP;