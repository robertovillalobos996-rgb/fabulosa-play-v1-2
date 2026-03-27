import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Send, Sparkles, Volume2, VolumeX, Play, Pause, Maximize, Minimize, Cast, Gift, Mic2 } from 'lucide-react';

// ✅ RUTAS DE ASSETS
import logoAlabanza from '../assets/fabulosa-alabanza-logo.jpeg';
import idAlabanza from '../assets/fabulosa-alabanza-id.mp4';

// =============================================================================
// 🎵 CONFIGURACIÓN Y LLAVES 
// =============================================================================
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

const VERSICULOS = [
  "Todo lo puedo en Cristo que me fortalece. (Filipenses 4:13)",
  "Jehová es mi pastor; nada me faltará. (Salmos 23:1)",
  "Porque yo sé los pensamientos que tengo acerca de vosotros. (Jeremías 29:11)",
  "Confía en Jehová con todo tu corazón. (Proverbios 3:5)",
  "La paz os dejo, mi paz os doy. (Juan 14:27)",
  "Esfuérzate y sé valiente; no temas ni desmayes. (Josué 1:9)",
  "Clama a mí, y yo te responderé. (Jeremías 33:3)"
];

const FabulosaAlabanza = () => {
  const playCountRef = useRef(0);
  const keyIndexRef = useRef(0);
  const lastMovieTimeRef = useRef(Date.now()); 
  
  const [historialVideos, setHistorialVideos] = useState([]); 
  const [oracionModal, setOracionModal] = useState(false);
  const [donacionModal, setDonacionModal] = useState(false);
  const [peticion, setPeticion] = useState("");
  const [busqueda, setBusqueda] = useState("");
  
  const [mensajeDJ, setMensajeDJ] = useState("¡Bendiciones familia! El canal está al aire. ¿Qué alabanza te gustaría escuchar hoy?");
  
  const [currentYtId, setCurrentYtId] = useState(null);
  const [isPlayingLocalId, setIsPlayingLocalId] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true); 
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const localVideoRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const playerContainerRef = useRef(null);

  useEffect(() => {
    continuarProgramacion();
  }, []);

  // 🧠 LÓGICA MAESTRA DEL DJ (Basada en conteo, no falla nunca)
  const continuarProgramacion = () => {
    setIsPlayingLocalId(false);
    const ahora = Date.now();
    
    // 1. PELÍCULA: 1 cada hora (3,600,000 milisegundos)
    if (ahora - lastMovieTimeRef.current >= 3600000) {
      setMensajeDJ("🎬 ¡Hora de cine en familia! Toma asiento, estamos preparando una hermosa película cristiana...");
      buscarEnYouTube("pelicula cristiana completa en español", false);
      lastMovieTimeRef.current = ahora;
    } 
    // 2. PRÉDICA: 1 cada 5 videos
    else if (playCountRef.current > 0 && playCountRef.current % 5 === 0) {
      setMensajeDJ("📖 Es momento de llenarnos de Su Palabra. Escuchemos esta poderosa reflexión...");
      buscarEnYouTube("predica cristiana corta mensaje poderoso", false);
    } 
    // 3. MÚSICA: Todo lo demás
    else {
      setMensajeDJ("🎵 ¡Levantemos Su nombre en alto! Programando las mejores alabanzas en video oficial...");
      buscarEnYouTube("mejores alabanzas adoracion cristianas exitos video oficial", true);
    }
  };

  const manejarFinDeVideo = () => {
    playCountRef.current += 1;
    // SELLO DEL CANAL: Cada 4 videos
    if (playCountRef.current % 4 === 0) {
      setMensajeDJ("🎙️ Estás sintonizando Fabulosa Alabanza. No te separes, venimos con más bendición...");
      setIsPlayingLocalId(true);
    } else {
      continuarProgramacion();
    }
  };

  const handleLocalIdEnd = () => {
    continuarProgramacion();
  };

  const buscarEnYouTube = async (query, isMusicVideo = false) => {
    setIsLoading(true);
    try {
      const q = encodeURIComponent(query);
      let exito = false;
      let data = null;

      while (keyIndexRef.current < YOUTUBE_API_KEYS.length && !exito) {
        const currentKey = YOUTUBE_API_KEYS[keyIndexRef.current];
        let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${q}&type=video&videoEmbeddable=true&key=${currentKey}`;
        if (isMusicVideo) url += "&videoCategoryId=10"; 

        const response = await fetch(url);
        if (response.status === 403 || response.status === 429) {
            keyIndexRef.current++; 
        } else {
            data = await response.json();
            exito = true;
        }
      }

      // 🚨 SISTEMA ANTI-FALLAS: Si no encuentra nada, busca algo genérico de inmediato
      if (!exito || !data || !data.items || data.items.length === 0) {
        if (query !== "musica cristiana alabanza") {
            buscarEnYouTube("musica cristiana alabanza", true);
            return;
        }
        setTimeout(() => manejarFinDeVideo(), 3000);
        return;
      }

      const shuffledItems = data.items.sort(() => Math.random() - 0.5);
      let videoIdEncontrado = null;
      for (let item of shuffledItems) {
          if (!historialVideos.includes(item.id.videoId)) {
              videoIdEncontrado = item.id.videoId; break;
          }
      }
      if (!videoIdEncontrado) {
          videoIdEncontrado = shuffledItems[0].id.videoId;
          setHistorialVideos([]); 
      }

      setHistorialVideos(prev => [...prev, videoIdEncontrado]);
      setCurrentYtId(videoIdEncontrado);
      setIsLoading(false);
      
    } catch (error) {
      setTimeout(() => manejarFinDeVideo(), 3000);
    }
  };

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = initYTPlayer;
    } else if (!ytPlayerRef.current) {
      initYTPlayer();
    }

    function initYTPlayer() {
      ytPlayerRef.current = new window.YT.Player('youtube-player', {
        playerVars: { autoplay: 1, mute: isMuted ? 1 : 0, controls: 0, disablekb: 1, fs: 0, rel: 0, modestbranding: 1, origin: window.location.origin },
        events: {
          'onReady': () => { 
              setIsPlaying(true); 
              if (isMuted) ytPlayerRef.current.mute(); 
              if (currentYtId && !isPlayingLocalId) ytPlayerRef.current.loadVideoById(currentYtId);
          },
          'onStateChange': (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) setIsPlaying(true);
            if (event.data === window.YT.PlayerState.PAUSED) setIsPlaying(false);
            if (event.data === window.YT.PlayerState.ENDED) manejarFinDeVideo(); 
          },
          'onError': () => manejarFinDeVideo() 
        }
      });
    }
  }, []);

  useEffect(() => {
    if (isPlayingLocalId) {
        if (ytPlayerRef.current?.pauseVideo) ytPlayerRef.current.pauseVideo();
        if (localVideoRef.current) {
            localVideoRef.current.currentTime = 0;
            localVideoRef.current.play().catch(e => console.log(e));
        }
    } else {
        if (localVideoRef.current) localVideoRef.current.pause();
        if (currentYtId && ytPlayerRef.current?.loadVideoById) ytPlayerRef.current.loadVideoById(currentYtId);
    }
  }, [isPlayingLocalId, currentYtId]);

  // 🔒 CANDADO DE BÚSQUEDA CRISTIANA
  const realizarBusquedaManual = (e) => {
    e.preventDefault();
    if (busqueda.trim() !== "") {
      playCountRef.current = 1; 
      setMensajeDJ(`¡Amén! Buscando "${busqueda}" para bendecir tu día. ¡Ya casi la ponemos! 🙏`);
      // FUERZA PALABRAS CRISTIANAS EN LA BÚSQUEDA
      const busquedaEstricta = `${busqueda} cristiana alabanza adoracion`;
      buscarEnYouTube(busquedaEstricta, false);
      setBusqueda("");
    }
  };

  const togglePlay = () => {
    if (isPlayingLocalId && localVideoRef.current) {
      isPlaying ? localVideoRef.current.pause() : localVideoRef.current.play();
      setIsPlaying(!isPlaying);
    } else if (ytPlayerRef.current?.getPlayerState) {
      const state = ytPlayerRef.current.getPlayerState();
      if (state === window.YT.PlayerState.PLAYING) { ytPlayerRef.current.pauseVideo(); setIsPlaying(false); }
      else { ytPlayerRef.current.playVideo(); setIsPlaying(true); }
    }
  };

  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    if (isPlayingLocalId && localVideoRef.current) localVideoRef.current.muted = newState;
    else if (ytPlayerRef.current?.isMuted) newState ? ytPlayerRef.current.mute() : ytPlayerRef.current.unMute();
  };

  const toggleFullscreen = () => { 
      if(!document.fullscreenElement) { playerContainerRef.current.requestFullscreen().catch(e=>console.log(e)); setIsFullscreen(true); } 
      else { document.exitFullscreen(); setIsFullscreen(false); }
  };
  
  const handleCast = () => { 
      if (localVideoRef.current?.webkitEnterFullscreen) localVideoRef.current.webkitEnterFullscreen(); 
      else alert("Usa la opción Transmitir de tu navegador."); 
  };

  const enviarPeticion = (e) => {
    e.preventDefault();
    window.location.href = `mailto:robertovillalobos996@gmail.com?subject=Peticion de Oracion&body=${peticion}`;
    setOracionModal(false);
    setPeticion("");
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans bg-black flex flex-col">
      <svg className="hidden">
        <filter id="remove-black-bg" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 1 1 1 0 -0.5" />
        </filter>
      </svg>

      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]"></div>
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse"></div>

      {/* HEADER Y BÚSQUEDA */}
      <div className="relative z-50 flex justify-between items-center p-6 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-6 flex-1 max-w-2xl">
            <Link to="/" className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white font-bold border border-white/10 transition-all hover:scale-105">
                <ArrowLeft size={18} /> SALIR
            </Link>

            <form onSubmit={realizarBusquedaManual} className="hidden md:flex flex-1 relative group">
                <input 
                    type="text" 
                    value={busqueda} 
                    onChange={(e) => setBusqueda(e.target.value)} 
                    placeholder="Pide tu alabanza aquí..." 
                    className="w-full bg-black/40 text-white border border-white/20 rounded-full py-2 pl-4 pr-12 focus:outline-none focus:border-sky-500 backdrop-blur-md transition-all"
                />
                <button type="submit" className="absolute right-2 top-1.5 w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-sky-600 rounded-full text-white transition-all">
                    <Send size={14} />
                </button>
            </form>
        </div>

        <div className="flex gap-4 ml-4">
            <button onClick={() => setDonacionModal(true)} className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white font-bold border border-white/20 transition-all hover:scale-105">
                <Gift size={18} className="text-yellow-400"/> Sembrar
            </button>
            <button onClick={() => setOracionModal(true)} className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full text-white font-bold shadow-[0_0_15px_rgba(255,193,7,0.4)] hover:scale-105 transition-transform animate-pulse">
                <Heart fill="white" size={18} /> Oración
            </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 md:px-8 relative z-40">
        
        {/* 🎙️ PANEL DEL DJ VIRTUAL CRISTIANO */}
        <div className="w-full max-w-6xl mb-4 bg-sky-900/40 backdrop-blur-md border border-sky-400/30 rounded-2xl p-4 flex items-center gap-4 shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all">
            <div className="w-12 h-12 rounded-full bg-sky-500/20 flex flex-shrink-0 items-center justify-center text-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]">
                <Mic2 size={24} className="animate-pulse" />
            </div>
            <div>
                <p className="text-[10px] text-sky-400 font-black uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span> Locutor DJ
                </p>
                <p className="text-white text-sm md:text-base font-bold italic tracking-wide mt-0.5">{mensajeDJ}</p>
            </div>
        </div>

        {/* REPRODUCTOR */}
        <div ref={playerContainerRef} className="relative w-full max-w-6xl aspect-video bg-black rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-gray-800 group">
            
            {isLoading && !isPlayingLocalId && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 pointer-events-none">
                <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-sky-400 font-bold uppercase tracking-widest text-sm">Conectando con el Cielo...</p>
              </div>
            )}

            <video
                ref={localVideoRef}
                src={idAlabanza} 
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${isPlayingLocalId ? "opacity-100 z-20 pointer-events-auto" : "opacity-0 -z-10 pointer-events-none"}`}
                muted={isMuted} playsInline onEnded={handleLocalIdEnd}
            />

            <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${!isPlayingLocalId ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 -z-10 pointer-events-none"}`}>
                <div className="absolute inset-0 z-20 w-full h-full bg-transparent cursor-default pointer-events-auto" onContextMenu={(e) => e.preventDefault()}></div>
                <div id="youtube-player" className="w-full h-full scale-[1.3] pointer-events-none"></div>
            </div>

            <div className="absolute top-6 right-6 z-50 pointer-events-none w-40 md:w-52">
                <img src={logoAlabanza} alt="Logo Canal" className="w-full h-auto" style={{ filter: 'url(#remove-black-bg) brightness(1.4) contrast(1.2)', mixBlendMode: 'screen' }} />
            </div>

            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent px-8 py-6 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between z-50">
                <div className="flex items-center gap-8 pointer-events-auto">
                    <button onClick={togglePlay} className="text-white hover:text-sky-400 transition-transform transform hover:scale-110">
                        {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                    </button>
                    <button onClick={handleCast} className="text-white hover:text-sky-400 transition-transform transform hover:scale-110">
                        <Cast size={28} />
                    </button>
                    <button onClick={toggleMute} className="text-white hover:text-sky-400">
                        {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
                    </button>
                </div>
                <div className="flex items-center gap-6 pointer-events-auto">
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-500/50 rounded-full">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold uppercase tracking-widest text-red-100">
                            {isPlayingLocalId ? "IDENTIFICACIÓN" : "EN VIVO"}
                        </span>
                    </div>
                    <button onClick={toggleFullscreen} className="text-white hover:text-sky-400 transform hover:scale-110">
                        {isFullscreen ? <Minimize size={28} /> : <Maximize size={28} />}
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* FOOTER VERSÍCULOS */}
      <div className="w-full bg-blue-950/90 backdrop-blur-md border-t border-white/10 py-3 overflow-hidden relative z-50">
          <div className="whitespace-nowrap animate-marquee flex gap-16 text-white/90 font-medium tracking-wide">
              {VERSICULOS.map((v, i) => (<span key={i} className="flex items-center gap-2"><Sparkles size={16} className="text-yellow-400" /> {v}</span>))}
              {VERSICULOS.map((v, i) => (<span key={`dup-${i}`} className="flex items-center gap-2"><Sparkles size={16} className="text-yellow-400" /> {v}</span>))}
          </div>
      </div>

      {/* ✅ MODALES RESTAURADOS */}
      {oracionModal && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#1a1c2e] border border-white/10 p-8 rounded-[1.5rem] max-w-lg w-full relative text-center">
                <button onClick={() => setOracionModal(false)} className="absolute top-4 right-4 text-white/50 hover:text-white">✕</button>
                <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4 animate-bounce" fill="currentColor" />
                <h3 className="text-2xl font-bold text-white mb-4">Buzón de Peticiones</h3>
                <form onSubmit={enviarPeticion} className="space-y-4">
                    <textarea value={peticion} onChange={(e) => setPeticion(e.target.value)} placeholder="Escribe tu petición aquí..." className="w-full bg-black/40 text-white border border-white/10 rounded-xl p-4 h-32"></textarea>
                    <button className="w-full py-3 bg-sky-600 text-white font-bold rounded-xl flex justify-center items-center gap-2"><Send size={18} /> ENVIAR</button>
                </form>
            </div>
        </div>
      )}

      {donacionModal && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#1a1c2e] border border-yellow-500/30 p-8 rounded-[1.5rem] max-w-md w-full relative text-center">
                <button onClick={() => setDonacionModal(false)} className="absolute top-4 right-4 text-white/50 hover:text-white">✕</button>
                <Gift className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Apoya este canal</h3>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6 mt-4">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Sinpe Móvil</p>
                    <p className="text-4xl font-black text-white tracking-widest">64035313</p>
                    <p className="text-xs text-sky-400 mt-2">Costa Rica 🇨🇷</p>
                </div>
            </div>
        </div>
      )}

      <style>{`
        .animate-marquee { animation: marquee 120s linear infinite; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-down { animation: fadeInDown 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default FabulosaAlabanza;