import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Send, Mic2, Play, Pause, Volume2, VolumeX, 
  Loader2, Star, Maximize, SkipBack, Layout, PartyPopper 
} from 'lucide-react';

// ✅ ASSETS
// Asegúrate de que este archivo esté en la carpeta public de tu proyecto
const IMAGEN_ESPERA_URL = "/karaoke_play.png";

// 🔑 LAS 14 LLAVES MAESTRAS DE YOUTUBE (MANTENIDAS)
const YOUTUBE_API_KEYS = [
  "AIzaSyDxLD8PviKQwlHBs7rmRm3GoyIKk-aQpww", "AIzaSyACeTldeUs5tbn2Lwr6o_6Lc48rF1nINY0",
  "AIzaSyBUk0oq1zjA6BKx5HK8DEQc1TxQqreqGtk", "AIzaSyBys-0J3T5Ou_fdPGxqYC5LWDMgppwD0Y4",
  "AIzaSyDHdkSo4WSHjYL4nHFU9wKmXW5D9PScO4g", "AIzaSyDJqDMnZsYHyJtzahtvv1r55Z-JfgLk5TU",
  "AIzaSyCruj7UZTEmElS3ZUeUBmYPecbsAA667U8", "AIzaSyBfMNrgQESeymMQ9srVBHKjXB3_WeRfkXE",
  "AIzaSyB1e_YSB74yAelvAhapDWu11VPLz2wBkUg", "AIzaSyCsvViGGiPJxx8-FkSwQvHE2T_U8d2UO5E",
  "AIzaSyBRvdUqolryjMRustJUyqN_HtkjRCbHLfI", "AIzaSyCdmCZW6J49Onl-QAf3cTsNu0im84EBVZc",
  "AIzaSyCeref7W3di_9o6W3YnEtqgvCQyvyQ5a5Q", "AIzaSyAwtE19mD7rpv1pu5nB4R8Q0HmEX9OkgJI"
];

const VIDEO_CELEBRACION_URL = "https://assets.mixkit.co/videos/preview/mixkit-confetti-falling-on-yellow-background-33346-large.mp4";

const KaraokePlay = () => {
  const [inputText, setInputText] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { type: 'bot', text: "¡Bienvenidos a Karaoke Play! 🎤 La fiesta profesional empieza ahora. Pide tu canción en español y prepárate..." }
  ]);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [score, setScore] = useState(0);
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const chatEndRef = useRef(null);
  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const keyIndexRef = useRef(0);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // INICIALIZADOR YOUTUBE API
  useEffect(() => {
    if (window.YT && currentVideoId) {
      setTimeout(() => {
        if (playerRef.current?.destroy) playerRef.current.destroy();
        playerRef.current = new window.YT.Player('youtube-player', {
          videoId: currentVideoId,
          // 🛡️ PARÁMETROS DE SEGURIDAD MÁXIMA PARA BLOQUEAR YOUTUBE
          playerVars: { autoplay: 1, controls: 0, modestbranding: 1, rel: 0, iv_load_policy: 3, disablekb: 1, showinfo: 0, origin: window.location.origin },
          events: {
            'onReady': (e) => { 
              setIsPlaying(true); 
              setIsLoading(false);
              setDuration(e.target.getDuration());
            },
            'onStateChange': (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) setIsPlaying(true);
              if (event.data === window.YT.PlayerState.PAUSED) setIsPlaying(false);
            }
          }
        });
      }, 100);
    } else if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }
  }, [currentVideoId]);

  // 🔄 LOOP DE TIEMPO Y SEGURIDAD (CANDADO DE 4 SEGUNDOS)
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current?.getCurrentTime && isPlaying) {
        const time = playerRef.current.getCurrentTime();
        const total = playerRef.current.getDuration();
        setCurrentTime(time);
        
        // 🛡️ LÓGICA DE SEGURIDAD PROFESIONAL: CORTE 4 SEGUNDOS ANTES
        if (total > 0 && (total - time <= 4)) {
          clearInterval(interval);
          if (playerRef.current?.destroy) playerRef.current.destroy(); // Destrucción inmediata
          triggerCelebration(); 
        }
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying, currentVideoId]);

  const triggerCelebration = () => {
    const finalScore = Math.floor(Math.random() * (100 - 85 + 1)) + 85;
    setScore(finalScore);
    setShowCelebration(true);
    setChatHistory(prev => [...prev, { type: 'bot', text: `¡ESPECTACULAR! 🌟 Sacaste un ${finalScore}/100. ¡Pide otra!` }]);
    setIsPlaying(false);
    setTimeout(() => { 
        setShowCelebration(false); 
        setCurrentVideoId(null); 
        setCurrentTime(0);
    }, 8000);
  };

  // 🧠 BÚSQUEDA CON ROTACIÓN DE 14 KEYS (MANTENIDA)
  const handleSearch = async (query) => {
    setIsLoading(true);
    try {
      const q = encodeURIComponent(`${query} karaoke español`);
      let exito = false;
      let data = null;

      while (keyIndexRef.current < YOUTUBE_API_KEYS.length && !exito) {
        const key = YOUTUBE_API_KEYS[keyIndexRef.current];
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${q}&type=video&key=${key}`;
        const response = await fetch(url);
        if (response.status === 403 || response.status === 429) {
            keyIndexRef.current++; // Salto a la siguiente llave
        } else {
            data = await response.json();
            exito = true;
        }
      }

      if (data?.items?.length > 0) {
        setCurrentVideoId(data.items[0].id.videoId);
        setChatHistory(prev => [...prev, { type: 'bot', text: `🎶 ¡Pista lista! A cantar: ${data.items[0].snippet.title}` }]);
      } else {
        setChatHistory(prev => [...prev, { type: 'bot', text: "No encontré esa canción. ¿Qué tal un clásico?" }]);
        setIsLoading(false);
      }
    } catch (e) { setIsLoading(false); }
  };

  const onSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    playerRef.current?.seekTo(newTime, true);
  };

  const formatTime = (s) => {
    const min = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const toggleFullscreen = () => {
    const el = playerContainerRef.current;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  };

  // Clases comunes para botones trasparentes (glassmorphism)
  const transparentButtonClass = "p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-red-500/50 transition-all text-gray-300 active:scale-95 shadow-lg backdrop-blur-sm";

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden flex flex-col font-sans select-none">
      
      {/* 📺 AD SLOT SUPERIOR (GOOGLE ADSENSE READY) */}
      <div className="w-full h-16 bg-black border-b border-white/5 flex items-center justify-center p-2">
         <div className="w-[320px] md:w-[728px] h-full bg-white/5 animate-pulse rounded border border-white/10 flex items-center justify-center text-[9px] text-gray-700 uppercase">Publicidad Espacio</div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* 🔙 BOTÓN VOLVER (ESTILO TRANSPARENTE) */}
        <Link to="/" className="absolute top-4 left-4 z-[100] p-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl transition-all hover:bg-red-600/20 hover:border-red-500">
          <ArrowLeft size={18} className="text-gray-300" />
        </Link>

        {/* 🎤 ÁREA DEL REPRODUCTOR (PC: IZQUIERDA / MOBILE: ARRIBA) */}
        <div ref={playerContainerRef} className="flex-1 flex flex-col relative bg-black shadow-inner">
          
          <div className="flex-1 relative bg-black"> {/* Fondo negro base para el reproductor */}
            
            {/* 🛡️ EL CANDADO: Capa invisible para bloquear clics en YouTube */}
            <div className={`absolute inset-0 z-30 ${showCelebration || !currentVideoId ? 'hidden' : 'block'}`}></div>

            {/* PANTALLA ESPERA: Imagen Adaptada Full Screen */}
            {!currentVideoId && !isLoading && !showCelebration && (
               <div className="absolute inset-0 z-10 bg-black">
                 <img
                   src={IMAGEN_ESPERA_URL}
                   alt="Karaoke Play Portada"
                   className="w-full h-full object-cover" // Ocupa todo el espacio adaptándose
                 />
               </div>
            )}

            {/* LOADER */}
            {isLoading && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
                <Loader2 className="animate-spin text-red-500 mb-6" size={60} />
                <p className="text-red-500 font-black uppercase tracking-widest animate-pulse">Cargando la pista profesional...</p>
              </div>
            )}

            {/* CELEBRACIÓN DE ESTRELLA */}
            {showCelebration && (
               <div className="absolute inset-0 z-[60] bg-black flex flex-col items-center justify-center">
                  <video src={VIDEO_CELEBRACION_URL} autoPlay muted loop className="absolute inset-0 w-full h-full object-cover opacity-60" />
                  <div className="relative z-10 text-center animate-bounce">
                      <Star className="text-yellow-400 mx-auto drop-shadow-[0_0_50px_yellow]" size={120} fill="currentColor" />
                      <h2 className="text-8xl font-black italic mt-6">{score}/100</h2>
                      <p className="text-yellow-400 font-black tracking-widest uppercase">¡ERES UNA ESTRELLA!</p>
                  </div>
               </div>
            )}

            {/* VIDEO YOUTUBE (Sin controles nativos) */}
            <div className={`w-full h-full ${(!currentVideoId || showCelebration) ? 'hidden' : 'block'}`}>
              <div id="youtube-player" className="w-full h-full"></div>
            </div>
          </div>

          {/* 🎮 BARRA DE CONTROLES PROFESIONAL (BOTONES TRANSPARENTES) */}
          <div className="bg-[#0a0a0a] border-t border-white/5 px-4 lg:px-10 py-3 shadow-2xl">
            {/* BARRA DE PROGRESO CON SCRUBBER */}
            <div className="flex items-center gap-4 mb-2 group">
               <span className="text-[10px] font-mono text-gray-500 w-12 text-right">{formatTime(currentTime)}</span>
               <input 
                 type="range" min="0" max={duration} value={currentTime} onChange={onSeek}
                 className="flex-1 accent-red-600 h-1.5 hover:h-2 transition-all cursor-pointer bg-white/5 rounded-full appearance-none overflow-hidden scrubber"
               />
               <span className="text-[10px] font-mono text-gray-500 w-12">{formatTime(duration)}</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-6">
                <button onClick={() => { setIsPlaying(!isPlaying); isPlaying ? playerRef.current?.pauseVideo() : playerRef.current?.playVideo(); }} className={transparentButtonClass}>
                   {isPlaying ? <Pause size={18}/> : <Play size={18} className="ml-0.5"/>}
                </button>
                <div className="flex items-center gap-3">
                  <button onClick={() => { playerRef.current?.[isMuted ? 'unMute' : 'mute'](); setIsMuted(!isMuted); }} className="text-gray-600 hover:text-white transition-colors">
                    {isMuted ? <VolumeX size={20}/> : <Volume2 size={20}/>}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="px-4 py-1 bg-red-600/10 border border-red-600/30 rounded-full items-center gap-2 flex">
                   <PartyPopper size={14} className="text-red-500"/>
                   <span className="text-[10px] font-black text-red-500 uppercase tracking-widest italic">Modo Fiesta</span>
                </div>
                <button onClick={toggleFullscreen} className="p-2.5 text-gray-600 hover:text-white transition-colors">
                  <Maximize size={18}/>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 💬 CHAT LOCUTOR AI PROFESIONAL (RESPONSIVO) */}
        <div className="w-full lg:w-[420px] h-[350px] lg:h-full bg-[#0a0a0a] border-l border-white/5 flex flex-col shadow-inner">
          <div className="p-5 border-b border-white/5 bg-red-600/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-600 rounded-xl shadow-md"><Mic2 size={20} /></div>
              <h3 className="text-sm font-black uppercase tracking-tighter italic text-red-500">Locutor AI Play</h3>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-950 rounded-full border border-green-700">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[9px] font-bold text-green-500 uppercase">Live Party</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
             {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3`}>
                   <div className={`max-w-[85%] px-5 py-3 rounded-3xl text-[12px] font-medium leading-relaxed ${
                     msg.type === 'user' ? 'bg-red-600 text-white rounded-tr-none shadow-xl' : 'bg-white/5 border border-white/10 text-gray-300 rounded-tl-none shadow-inner'
                   }`}>
                      {msg.text}
                   </div>
                </div>
             ))}
             <div ref={chatEndRef} />
          </div>

          {/* FORMULARIO TRANSPARENTE */}
          <form onSubmit={(e) => { e.preventDefault(); if(inputText.trim()){ setChatHistory(p => [...p, {type:'user', text:inputText}]); handleSearch(inputText); setInputText(""); } }} className="p-5 bg-black border-t border-white/5">
            <div className="relative group">
              <input 
                type="text" value={inputText} onChange={(e) => setInputText(e.target.value)}
                placeholder="Pide tu canción en español aquí..."
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl py-4 px-5 pr-14 text-sm focus:outline-none focus:border-red-500/50 transition-all placeholder:text-gray-700 font-medium"
              />
              <button className="absolute right-3 top-3 p-2 bg-white/5 rounded-xl text-gray-400 hover:bg-red-600/20 hover:text-red-500 transition-all active:scale-95 shadow-lg">
                <Send size={18}/>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 💰 AD SLOT INFERIOR (GOOGLE ADSENSE READY) */}
      <div className="w-full h-18 bg-black border-t border-white/5 flex items-center justify-center p-2">
         <div className="w-[320px] md:w-[728px] h-full bg-white/5 animate-pulse rounded border border-white/10 Flex items-center justify-center text-[9px] text-gray-700 uppercase">Publicidad Banner</div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(220,38,38,0.3); border-radius: 10px; }
        .scrubber::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px; height: 14px;
          background: #dc2626;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 15px rgba(220,38,38,0.6);
        }
        .scrubber:hover::-webkit-slider-thumb {
            width: 16px; height: 16px;
        }
      `}</style>
    </div>
  );
};

export default KaraokePlay;