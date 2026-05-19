import { useEffect, useState, useRef } from "react";
import logoFabulosa from "../assets/logo_fabulosa.png";

export default function Camaras() {
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(new Date());
  
  const [cameraIndex, setCameraIndex] = useState(0);
  const [cameras, setCameras] = useState([]);
  
  const [adIndex, setAdIndex] = useState(0);
  const [ads, setAds] = useState([]);

  // Controladores de volumen, fullscreen y mouse fantasma
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const timeoutRef = useRef(null);

  // CIRUGÍA: Estado para evento especial en vivo
  const [liveEvent, setLiveEvent] = useState({ active: false, name: "", tipo: "youtube", src: "" });

  // =========================================
  // AUTO-OCULTAR CONTROLES Y MOUSE (Modo Fantasma)
  // =========================================
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // =========================================
  // CARGA DE DATOS SINCRONIZADA Y REALTIME
  // =========================================
  const cargarTodoInstante = () => {
    const guardadas = localStorage.getItem("camaras-play");
    if (guardadas) setCameras(JSON.parse(guardadas).filter(cam => cam.activa));
    
    const savedAds = localStorage.getItem("ads-camaras");
    if (savedAds) setAds(JSON.parse(savedAds));

    const savedLive = localStorage.getItem("envivo-play");
    if (savedLive) setLiveEvent(JSON.parse(savedLive));
  };

  useEffect(() => {
    cargarTodoInstante();
    // Escucha cambios instantáneos si usas el panel en otra pestaña/pantalla
    window.addEventListener("storage", cargarTodoInstante);
    return () => window.removeEventListener("storage", cargarTodoInstante);
  }, []);

  // =========================================
  // GESTOR DE AUDIO INTELIGENTE (AzuraCast vs Evento)
  // =========================================
  useEffect(() => {
    const radio = document.getElementById("radio-fabulosa");
    if (!radio || !started) return;

    if (liveEvent?.active) {
      // Si hay un partido o concierto, apagamos la radio por completo
      radio.pause();
    } else {
      // Si se apaga el partido, vuelve la radio a sonar en su volumen establecido
      radio.volume = volume;
      radio.play().catch(e => console.error("Error al reanudar radio:", e));
    }
  }, [liveEvent?.active, started, volume]);

  // =========================================
  // TIMERS (Reloj, Cámaras y Publicidad)
  // =========================================
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (cameras.length <= 1 || liveEvent?.active) return;
    const interval = setInterval(() => {
      setCameraIndex(prev => (prev + 1) % cameras.length);
    }, 120000); // 2 minutos exactos
    return () => clearInterval(interval);
  }, [cameras.length, liveEvent?.active]);

  const nextAd = () => {
    if (ads.length > 1) setAdIndex(prev => (prev + 1) % ads.length);
  };

  useEffect(() => {
    if (ads.length <= 1 || !started) return; 
    const currentAd = ads[adIndex];
    if (currentAd && currentAd.type === "image") {
      const timer = setTimeout(nextAd, 15000);
      return () => clearTimeout(timer);
    }
  }, [adIndex, ads.length, started]);

  const formatTime12hNoAmpm = (date) => {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    hours = hours % 12;
    hours = hours ? hours : 12; 
    return `${String(hours).padStart(2, '0')}:${minutes}:${seconds}`;
  };

  const getYoutubeId = (url) => {
    try {
      const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
      return (match && match[2].length === 11) ? match[2] : null;
    } catch { return null; }
  };

  const encenderTodo = () => {
    const radio = document.getElementById("radio-fabulosa");
    if (radio && !liveEvent?.active) {
      radio.volume = volume;
      radio.play().catch(e => console.error(e));
    }
    setStarted(true);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleVolume = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    const radio = document.getElementById("radio-fabulosa");
    if (radio && !liveEvent?.active) radio.volume = newVol;
  };

  const currentCam = cameras[cameraIndex];
  const currentAd = ads[adIndex];
  const nextCameraIndex = cameras.length > 1 ? (cameraIndex + 1) % cameras.length : -1;

  return (
    <div className={`relative h-screen w-screen overflow-hidden bg-black text-white font-sans ${showControls ? '' : 'cursor-none'}`}>
      
      {/* SEÑAL DE AUDIO PURA DE AZURACAST */}
      <audio id="radio-fabulosa" src="https://a5.asurahosting.com/listen/fabulosa_play/radio.mp3" preload="none" loop></audio>

      {/* BOTÓN INICIAL DE ARRANQUE */}
      {!started && (
        <div className="absolute inset-0 z-[200] bg-black/95 flex flex-col justify-center items-center backdrop-blur-md pointer-events-auto">
          <button onClick={encenderTodo} className="bg-pink-600 hover:bg-pink-500 text-white font-black text-4xl md:text-5xl px-16 py-8 rounded-3xl shadow-[0_0_50px_rgba(219,39,119,0.8)] border-4 border-white uppercase cursor-pointer">
            ▶ INICIAR TRANSMISIÓN
          </button>
        </div>
      )}

      {/* =========================================
      REPRODUCTOR DE VIDEO: CÁMARAS O EVENTO EN VIVO
      ========================================= */}
      <div className="absolute inset-0 z-10 bg-black pb-[150px] overflow-hidden">
        {liveEvent?.active ? (
          /* CIRUGÍA: MODO EVENTO ESPECIAL CON AUDIO ORIGINAL ACTIVADO */
          <div key="live-event-container" className="w-full h-full fade-transition">
            {liveEvent.tipo === "youtube" ? (
              <iframe
                src={`https://www.youtube.com/embed/${getYoutubeId(liveEvent.src)}?autoplay=1&controls=1&showinfo=0&rel=0&playsinline=1`}
                className="w-full h-full scale-[1.02] border-0"
                allow="autoplay; encrypted-media"
              />
            ) : (
              <video src={liveEvent.src} autoPlay controls playsInline className="w-full h-full object-cover" />
            )}
          </div>
        ) : (
          /* MODO CÁMARAS ROTATIVAS TRADICIONAL */
          cameras.map((cam, idx) => {
            const isCurrent = idx === cameraIndex;
            const isNext = idx === nextCameraIndex;
            if (!isCurrent && !isNext) return null;
            return (
              <div key={cam.id} className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${isCurrent ? 'opacity-100 z-20' : 'opacity-0 z-10'}`}>
                {cam.tipo === "youtube" ? (
                  <iframe src={`https://www.youtube.com/embed/${getYoutubeId(cam.src)}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${getYoutubeId(cam.src)}&playsinline=1&modestbranding=1&iv_load_policy=3`} className="w-full h-full pointer-events-none scale-[1.15] border-0" allow="autoplay; encrypted-media" />
                ) : (
                  <video src={cam.src} autoPlay muted loop playsInline className="w-full h-full object-cover scale-105" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* =========================================
      BLOQUE VISUAL DERECHO (SIMÉTRICO Y CENTRADO)
      ========================================= */}
      <div className="absolute top-8 right-8 z-30 flex flex-col items-center gap-3 pointer-events-none text-center">
        <div className="bg-black/60 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/10 shadow-2xl flex items-center gap-6">
          <img src={logoFabulosa} alt="Logo" className="h-20 md:h-24 object-contain animate-float" />
          <div className="flex flex-col items-center border-l-2 border-white/15 pl-6">
            <span className="text-5xl md:text-7xl font-black text-white tracking-widest drop-shadow-lg">{formatTime12hNoAmpm(time)}</span>
            <span className="text-2xl md:text-3xl font-black text-pink-500 mt-1 uppercase tracking-widest drop-shadow-md">{time.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </div>
        </div>

        {/* NOMBRE DE CÁMARA O EVENTO ADAPTADO */}
        {(liveEvent?.active ? liveEvent : currentCam) && (
          <div className="bg-black/60 backdrop-blur-md w-full py-4 rounded-2xl border border-white/10 shadow-xl transition-all duration-1000 flex flex-col items-center justify-center">
            <span className={`text-sm font-black tracking-widest uppercase block mb-1 ${liveEvent?.active ? 'text-amber-400 animate-pulse' : 'text-cyan-400'}`}>
              {liveEvent?.active ? "TRANSMISIÓN ESPECIAL EN VIVO" : "TRANSMITIENDO EN VIVO"}
            </span>
            <span className="text-3xl md:text-4xl font-black italic text-white uppercase drop-shadow-lg">
              {liveEvent?.active ? liveEvent.name : currentCam.name}
            </span>
          </div>
        )}
      </div>

      {/* CONTROLES FANTASMA */}
      <div className={`absolute bottom-[170px] right-8 z-50 flex items-center gap-4 bg-black/70 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shadow-2xl transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex items-center gap-3">
          <span className="text-xl">{volume === 0 ? "🔇" : "🔊"}</span>
          <input type="range" min="0" max="1" step="0.05" value={volume} onChange={handleVolume} className="w-32 accent-pink-500 cursor-pointer" />
        </div>
        <div className="w-px h-8 bg-white/20 mx-2"></div>
        <button onClick={toggleFullscreen} className="text-white hover:text-cyan-400 font-bold text-lg flex items-center gap-2 transition-colors cursor-pointer">
          {isFullscreen ? "🗗 SALIR" : "🔲 PANTALLA COMPLETA"}
        </button>
      </div>

      {/* BANNER PUBLICIDAD CINTILLO ABAJO */}
      {currentAd && (
        <div className="absolute bottom-0 left-0 w-full h-[150px] bg-black z-40 border-t-4 border-zinc-900 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] overflow-hidden">
          <div key={currentAd.id} className="w-full h-full fade-transition">
            {currentAd.type === "image" ? (
              <img src={currentAd.src} className="w-full h-full object-cover" />
            ) : (
              <video src={currentAd.src} autoPlay muted playsInline onEnded={nextAd} onError={nextAd} className="w-full h-full object-cover" />
            )}
          </div>
        </div>
      )}

      <style>{`
        .animate-float { animation: floatLogo 4s ease-in-out infinite; }
        @keyframes floatLogo { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        .fade-transition { animation: smoothFade 1s ease-in-out; }
        @keyframes smoothFade { 0% { opacity: 0; filter: blur(3px); } 100% { opacity: 1; filter: blur(0); } }
      `}</style>
    </div>
  );
}