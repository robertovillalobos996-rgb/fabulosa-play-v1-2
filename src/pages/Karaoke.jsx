import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Mic2, Play, Pause, Volume2, VolumeX, Loader2, Star, Cast, Maximize } from 'lucide-react';
import bgCinematic from '../assets/card-fondo-plataforma.png';
import imgEspera from '../assets/karaoke-tv.png';

// 🔑 LAS 14 LLAVES MAESTRAS DE YOUTUBE (ROTACIÓN AUTOMÁTICA)
const YOUTUBE_API_KEYS = [
  "AIzaSyDxLD8PviKQwlHBs7rmRm3GoyIKk-aQpww",
  "AIzaSyACeTldeUs5tbn2Lwr6o_6Lc48rF1nINY0",
  "AIzaSyBUk0oq1zjA6BKx5HK8DEQc1TxQqreqGtk",
  "AIzaSyBys-0J3T5Ou_fdPGxqYC5LWDMgppwD0Y4",
  "AIzaSyDHdkSo4WSHjYL4nHFU9wKmXW5D9PScO4g",
  "AIzaSyDJqDMnZsYHyJtzahtvv1r55Z-JfgLk5TU",
  "AIzaSyCruj7UZTEmElS3ZUeUBmYPecbsAA667U8",
  "AIzaSyBfMNrgQESeymMQ9srVBHKjXB3_WeRfkXE",
  "AIzaSyB1e_YSB74yAelvAhapDWu11VPLz2wBkUg",
  "AIzaSyCsvViGGiPJxx8-FkSwQvHE2T_U8d2UO5E",
  "AIzaSyBRvdUqolryjMRustJUyqN_HtkjRCbHLfI",
  "AIzaSyCdmCZW6J49Onl-QAf3cTsNu0im84EBVZc",
  "AIzaSyCeref7W3di_9o6W3YnEtqgvCQyvyQ5a5Q",
  "AIzaSyAwtE19mD7rpv1pu5nB4R8Q0HmEX9OkgJI"
];

const VIDEO_CELEBRACION_URL = "https://assets.mixkit.co/videos/preview/mixkit-confetti-falling-on-yellow-background-33346-large.mp4";

const FRASES_BUSQUEDA = [
  "¡Oído cocina! 🔥 Buscando ese temazo...", "¡Uff, qué buen gusto! Preparando el escenario... 🎸",
  "¡Esa es de las mías! Ya casi la tengo lista... 🎤", "¡Marchando una de buena música! 📁",
  "¡Prepárate! Alguien pidió un clásico de alto voltaje... ⚡", "¡Eso! Poniendo a calentar los motores... 🚀",
  "¡Buena elección! El DJ ya está montando el disco... 💿", "¡Atención público! Se viene un momento épico... 🌟",
  "¡Agárrate que vienen curvas! Cargando pista... 🎶", "¡Temazo a la vista! Ajustando luces y sonido... 🔦",
];

const Karaoke = () => {
  const [inputText, setInputText] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { type: 'bot', text: "¡Hola! Soy tu Locutor AI. 🎤 Escribe el nombre de la canción que quieres cantar y yo me encargo del resto. ¿Con qué empezamos?" }
  ]);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationVideoUrl, setCelebrationVideoUrl] = useState(null);
  const [score, setScore] = useState(0);

  const chatEndRef = useRef(null);
  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);

  // 🔄 REFERENCIA PARA SABER QUÉ LLAVE ESTAMOS USANDO
  const keyIndexRef = useRef(0);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, showCelebration]);

  // INICIALIZADOR DE YOUTUBE (SEGURO CONTRA CRASHEOS)
  useEffect(() => {
    if (window.YT && currentVideoId) {
      // Le damos 100ms a React para que dibuje el DIV antes de que YouTube lo secuestre
      setTimeout(() => {
        if (playerRef.current && typeof playerRef.current.destroy === 'function') {
           try { playerRef.current.destroy(); } catch(e){}
        }
        playerRef.current = new window.YT.Player('youtube-player', {
          videoId: currentVideoId,
          playerVars: { autoplay: 1, controls: 0, disablekb: 1, fs: 0, rel: 0, modestbranding: 1, iv_load_policy: 3 },
          events: {
            'onReady': () => { setIsPlaying(true); setIsLoading(false); },
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
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, [currentVideoId]);

  // === SISTEMA ANTI-RECOMENDACIONES (CORTE 4 SEGUNDOS ANTES) ===
  useEffect(() => {
    let interval;
    if (isPlaying && currentVideoId && playerRef.current?.getCurrentTime) {
      interval = setInterval(() => {
        try {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = playerRef.current.getDuration();
          
          if (duration > 0 && (duration - currentTime <= 4)) {
            clearInterval(interval);
            // Destruimos el reproductor para evitar que salgan los videos sugeridos
            if (playerRef.current && typeof playerRef.current.destroy === 'function') {
               playerRef.current.destroy();
            }
            triggerCelebration(); 
          }
        } catch (error) {
          // Ignorar errores menores de sincronización
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentVideoId]);

  const triggerCelebration = () => {
    const finalScore = Math.floor(Math.random() * (100 - 85 + 1)) + 85;
    setScore(finalScore);
    
    let fraseIA = "";
    if (finalScore >= 98) fraseIA = `¡PERFECCIÓN ABSOLUTA! 🤯 Lograste ${finalScore}/100. ¡Qué voz, los productores ya te están buscando! 👏👏👏 ¿Qué cantamos ahora?`;
    else if (finalScore >= 90) fraseIA = `¡BRUTAL! 🤩 Un súper puntaje de ${finalScore}/100. Cantaste con un sentimiento increíble. ¡Otra, otra, otra! 🎤`;
    else fraseIA = `¡Muy buen esfuerzo! 👍 Te llevas un ${finalScore}/100. Ya calentamos los motores. ¡Pide la siguiente para romperla! 🔥`;

    setCelebrationVideoUrl(VIDEO_CELEBRACION_URL);
    setShowCelebration(true);
    setChatHistory(prev => [...prev, { type: 'bot', text: fraseIA }]);
    setIsPlaying(false);

    // DEVOLVER A LA PANTALLA PRINCIPAL TRAS 8 SEGUNDOS
    setTimeout(() => { 
        setShowCelebration(false); 
        setCelebrationVideoUrl(null); 
        setCurrentVideoId(null); 
    }, 8000);
  };

  // 🧠 MOTOR DE BÚSQUEDA YOUTUBE (CON ROTADOR DE LLAVES)
  const handleSearch = async (query) => {
    setIsLoading(true);
    setShowCelebration(false); 
    const randomPhrase = FRASES_BUSQUEDA[Math.floor(Math.random() * FRASES_BUSQUEDA.length)];
    setChatHistory(prev => [...prev, { type: 'bot', text: randomPhrase }]);

    try {
      const q = encodeURIComponent(`${query} karaoke español`);
      let exito = false;
      let data = null;

      // Bucle que intenta buscar la pista cambiando de llave si hay un Error 403
      while (keyIndexRef.current < YOUTUBE_API_KEYS.length && !exito) {
        const currentKey = YOUTUBE_API_KEYS[keyIndexRef.current];
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${q}&type=video&key=${currentKey}`;
        
        const response = await fetch(url);

        if (response.status === 403 || response.status === 429) {
            console.warn(`⚠️ API Key ${keyIndexRef.current + 1} agotada. Pasando a la siguiente llave...`);
            keyIndexRef.current++; // Avanzamos a la siguiente llave
        } else {
            data = await response.json();
            exito = true; // Búsqueda exitosa, rompemos el ciclo
        }
      }

      // Si nos gastamos las 14 llaves
      if (!exito) {
        setChatHistory(prev => [...prev, { type: 'bot', text: "¡Uy! Parece que el DJ se quedó sin discos por hoy. Intenta de nuevo más tarde." }]);
        setIsLoading(false);
        return;
      }

      if (data.items && data.items.length > 0) {
        const videoId = data.items[0].id.videoId;
        setTimeout(() => {
          setCurrentVideoId(videoId);
          setChatHistory(prev => [...prev, { type: 'bot', text: `¡Pista lista! 🎶 A cantar: ${data.items[0].snippet.title}` }]);
        }, 1500);
      } else {
        setChatHistory(prev => [...prev, { type: 'bot', text: "Uy, no encontré esa. ¿Probamos con otro éxito?" }]);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error en YouTube API:", error);
      setChatHistory(prev => [...prev, { type: 'bot', text: "Error de conexión con el DJ. Intenta de nuevo." }]);
      setIsLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setChatHistory(prev => [...prev, { type: 'user', text: inputText }]);
    handleSearch(inputText);
    setInputText("");
  };

  const togglePlay = () => {
    if (playerRef.current && playerRef.current.getPlayerState) {
      const state = playerRef.current.getPlayerState();
      if (state === window.YT.PlayerState.PLAYING) { playerRef.current.pauseVideo(); setIsPlaying(false); }
      else { playerRef.current.playVideo(); setIsPlaying(true); }
    }
  };

  const toggleMute = () => {
    if (playerRef.current && playerRef.current.isMuted) {
      if (isMuted) { playerRef.current.unMute(); setIsMuted(false); }
      else { playerRef.current.mute(); setIsMuted(true); }
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
        playerContainerRef.current?.requestFullscreen().catch(err => {
            console.error(`Error al intentar pantalla completa: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 lg:p-8 font-sans bg-black relative selection:bg-red-600"
      style={{ backgroundImage: `url(${bgCinematic})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-0"></div>

      <Link to="/" className="absolute top-6 left-6 p-3 bg-white/10 hover:bg-red-600 text-white rounded-full transition-all backdrop-blur-md z-20 shadow-lg">
        <ArrowLeft size={24} />
      </Link>

      <div className="relative z-10 w-full max-w-7xl h-[85vh] bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(220,38,38,0.15)] flex flex-col md:flex-row overflow-hidden animate-fade-in-down">
        
        {/* LADO IZQUIERDO: REPRODUCTOR DE KARAOKE */}
        <div ref={playerContainerRef} className="flex-1 flex flex-col relative border-r border-white/5 bg-black">
          
          <div className="absolute top-0 w-full p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
            <h2 className="text-2xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 drop-shadow-md tracking-tighter uppercase flex items-center gap-2">
              <Mic2 size={24} className="text-red-500" /> KARAOKE AI PLAY
            </h2>
            <div className="flex gap-2">
               <span className="bg-red-600/90 text-[10px] text-white font-black px-3 py-1.5 rounded-md uppercase tracking-widest shadow-lg flex items-center gap-2">
                 <Cast size={14}/> On Air
               </span>
            </div>
          </div>

          <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
            
            {/* PANTALLA PRINCIPAL DE ESPERA */}
            {!currentVideoId && !isLoading && !showCelebration && (
               <>
                 <div className="absolute inset-0 z-0">
                    <img src={imgEspera} alt="Fondo Karaoke" className="w-full h-full object-cover opacity-20 filter blur-[2px]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                 </div>
                 <div className="relative z-10 flex flex-col items-center justify-center text-center">
                    <Mic2 size={64} className="text-white/20 mb-6 drop-shadow-[0_0_30px_rgba(220,38,38,0.3)] animate-pulse" />
                    <h3 className="text-2xl font-black text-white/80 uppercase tracking-widest mb-2 drop-shadow-lg">El Escenario es Tuyo</h3>
                    <p className="text-red-400 font-bold tracking-widest uppercase text-xs">Pide tu canción en el chat 👉</p>
                 </div>
               </>
            )}

            {/* PANTALLA DE CARGA */}
            {isLoading && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
                <Loader2 className="animate-spin text-red-500 mb-4" size={50} />
                <p className="text-red-400 font-bold uppercase tracking-widest text-sm animate-pulse">Preparando Pista...</p>
              </div>
            )}
            
            {/* PANTALLA DE CELEBRACIÓN Y PUNTAJE */}
            {showCelebration && celebrationVideoUrl && (
               <div className="absolute inset-0 z-30 bg-black flex flex-col items-center justify-center animate-in fade-in duration-500">
                  <video src={celebrationVideoUrl} autoPlay muted className="absolute inset-0 w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80"></div>
                  
                  <div className="relative z-40 text-center scale-125 animate-bounce">
                      <Star className="text-yellow-400 mx-auto drop-shadow-[0_0_20px_rgba(250,204,21,1)]" size={80} fill="currentColor" />
                      <h2 className="text-5xl font-black text-white mt-4 drop-shadow-[0_5px_15px_rgba(0,0,0,1)] uppercase italic tracking-tighter">
                        {score}/100
                      </h2>
                      <p className="text-yellow-400 font-bold tracking-widest mt-2 uppercase text-sm drop-shadow-md">¡Puntaje Final!</p>
                  </div>
               </div>
            )}

            {/* LA CAJA FUERTE DE REACT: Aquí vive YouTube */}
            <div className={`w-full h-full absolute inset-0 pointer-events-none ${(!currentVideoId || showCelebration) ? 'hidden' : 'block'}`}>
              {/* React renderizará el div y YouTube lo reemplazará sin causar errores */}
              {currentVideoId && <div id="youtube-player" className="w-full h-full"></div>}
            </div>
          </div>

          <div className="h-20 bg-gradient-to-t from-black to-black/80 border-t border-white/5 flex items-center justify-between px-8 z-20">
             <div className="flex items-center gap-4">
                <button onClick={togglePlay} disabled={!currentVideoId} className="w-12 h-12 bg-white/10 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-all disabled:opacity-30 disabled:hover:bg-white/10">
                  {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                </button>
                <button onClick={toggleMute} disabled={!currentVideoId} className="w-10 h-10 bg-transparent hover:bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all disabled:opacity-30">
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
             </div>
             <div className="flex gap-2">
                <button onClick={toggleFullScreen} className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                    <Maximize size={18}/>
                </button>
             </div>
          </div>
        </div>

        {/* LADO DERECHO: LOCUTOR AI CHAT */}
        <div className="w-full md:w-[380px] lg:w-[450px] bg-black/40 flex flex-col">
          <div className="p-6 border-b border-white/5 bg-black/20 flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                <Mic2 size={20} className="text-white" />
             </div>
             <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Locutor AI</h3>
                <p className="text-[10px] text-green-400 font-bold uppercase tracking-wider flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> En Línea</p>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] font-medium leading-relaxed ${msg.type === 'user' ? 'bg-gradient-to-br from-red-600 to-red-800 text-white rounded-tr-sm shadow-lg' : 'bg-white/5 text-gray-200 rounded-tl-sm border border-white/10 shadow-inner'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-4 bg-black/60 border-t border-white/5 backdrop-blur-md">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={inputText} 
                onChange={(e) => setInputText(e.target.value)} 
                placeholder="Ej. Luis Miguel La Incondicional..." 
                className="w-full bg-white/5 border border-white/10 rounded-full py-3.5 pl-5 pr-12 text-sm text-white focus:outline-none focus:border-red-500 focus:bg-white/10 transition-all placeholder-gray-500" 
              />
              <button 
                type="submit" 
                disabled={!inputText.trim() || isLoading}
                className="absolute right-1.5 w-10 h-10 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-all disabled:opacity-50 disabled:hover:bg-red-600"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="-ml-0.5" />}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-down { animation: fadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(220,38,38,0.5); }
      `}</style>
    </div>
  );
};

export default Karaoke;