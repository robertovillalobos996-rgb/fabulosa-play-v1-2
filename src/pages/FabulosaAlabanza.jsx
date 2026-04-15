import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Heart, Sparkles, Volume2, VolumeX, Play, Pause, 
  Gift, Mic2, Tv, BookOpen, Film, Music, LayoutGrid, Loader2, Maximize
} from 'lucide-react';

import logoAlabanza from '../assets/fabulosa-alabanza-logo.jpeg';

const YOUTUBE_API_KEYS = [
    "AIzaSyDxLD8PviKQwlHBs7rmRm3GoyIKk-aQpww", "AIzaSyACeTldeUs5tbn2Lwr6o_6Lc48rF1nINY0",
    "AIzaSyBUk0oq1zjA6BKx5HK8DEQc1TxQqreqGtk", "AIzaSyBys-0J3T5Ou_fdPGxqYC5LWDMgppwD0Y4",
    "AIzaSyDHdkSo4WSHjYL4nHFU9wKmXW5D9PScO4g", "AIzaSyDJqDMnZsYHyJtzahtvv1r55Z-JfgLk5TU",
    "AIzaSyCruj7UZTEmElS3ZUeUBmYPecbsAA667U8", "AIzaSyBfMNrgQESeymMQ9srVBHKjXB3_WeRfkXE",
    "AIzaSyB1e_YSB74yAelvAhapDWu11VPLz2wBkUg", "AIzaSyCsvViGGiPJxx8-FkSwQvHE2T_U8d2UO5E",
    "AIzaSyBRvdUqolryjMRustJUyqN_HtkjRCbHLfI", "AIzaSyCdmCZW6J49Onl-QAf3cTsNu0im84EBVZc",
    "AIzaSyCeref7W3di_9o6W3YnEtqgvCQyvyQ5a5Q", "AIzaSyAwtE19mD7rpv1pu5nB4R8Q0HmEX9OkgJI"
];

// === TU CONTENIDO ORIGINAL ===
const CATEGORIES = {
  MUSICA: [
    { id: "WujOmsOSY6w", title: "Miel San Marcos - Pentecostés" },
    { id: "h92_oatv7-Y", title: "Barak - Fuego y Poder" },
    { id: "XzNfF8f1L_I", title: "Christine D'Clario - Eterno Live" },
    { id: "uYqS_z-x05U", title: "Redimi2 - Pura Sal" },
    { id: "mAnB76K_t3o", title: "Marcos Witt - Sigues siendo Dios" },
    { id: "BOfm_nQ9m48", title: "Way Maker - Spanish Version" },
    { id: "S0WInA_56bI", title: "Grupo Grace - Los de Sión" },
    { id: "5pGvj5B_4XQ", title: "New Wine - Espíritu Santo" }
  ],
  PREDICAS: [
    { id: "f20jV97t2bU", title: "Dante Gebel - El código del honor" },
    { id: "G9_r7Y_K7P0", title: "Itiel Arroyo - El poder de la disciplina" },
    { id: "P2l6pWn6jZk", title: "Armando Alducin - Las Señales del Fin" },
    { id: "m_V_D8P8X6c", title: "Andrés Spyker - Fe Inquebrantable" },
    { id: "B7Z_pXnS-z0", title: "Cash Luna - En honor al Espíritu Santo" },
    { id: "R_p8X_Z-m90", title: "Ruddy Gracia - Fe vs Miedo" },
    { id: "T_p7X_L-v8k", title: "Pr. Juan Carlos Harrigan - Poder de Dios" }
  ],
  PELICULAS: [
    { id: "V7p8X_S-z88", title: "Cuarto de Guerra (War Room)" },
    { id: "B_p9X_R-q90", title: "Dios no está muerto" },
    { id: "S_p1X_Y-z77", title: "A prueba de fuego" },
    { id: "T_p5X_K-m33", title: "Reto de Valientes" },
    { id: "M_p2X_N-v44", title: "Vencedor (Overcomer)" },
    { id: "L_p4X_Q-j11", title: "Milagros del Cielo" },
    { id: "K_p3X_H-g55", title: "El Progreso del Peregrino" }
  ],
  DOCUMENTALES: [
    { id: "A_p6X_T-u22", title: "La Historia de la Biblia" },
    { id: "F_p8X_O-k88", title: "Tierra Santa en 4K" },
    { id: "H_p1X_I-w99", title: "Misiones en el África" }
  ]
};

const FabulosaAlabanza = () => {
  const [activeTab, setActiveTab] = useState('MUSICA');
  const [currentVideoId, setCurrentVideoId] = useState(CATEGORIES.MUSICA[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [donacionModal, setDonacionModal] = useState(false);
  
  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const hideTimeout = useRef(null);

  const handleActivity = () => {
    setShowControls(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    if (isPlaying) {
      hideTimeout.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  useEffect(() => {
    if (window.YT && currentVideoId) {
      if (playerRef.current?.destroy) playerRef.current.destroy();
      playerRef.current = new window.YT.Player('alabanza-player', {
        videoId: currentVideoId,
        playerVars: { 
            autoplay: 1, 
            controls: 0, 
            modestbranding: 1, 
            rel: 0, 
            iv_load_policy: 3,
            origin: window.location.origin // ✅ EL FIX DE LA PANTALLA NEGRA
        },
        events: {
          'onReady': () => { setIsLoading(false); setIsPlaying(true); },
          'onStateChange': (e) => {
            if (e.data === 1) setIsPlaying(true);
            if (e.data === 2) setIsPlaying(false);
          }
        }
      });
    }
  }, [currentVideoId]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) playerContainerRef.current.requestFullscreen();
    else document.exitFullscreen();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-amber-500/30" onMouseMove={handleActivity}>
      
      <header className="p-6 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between sticky top-0 z-[100]">
        <div className="flex items-center gap-6">
          <Link to="/" className="p-3 bg-white/5 hover:bg-amber-500 rounded-2xl transition-all border border-white/10 group">
            <ArrowLeft className="group-hover:scale-110 transition-transform" />
          </Link>
          <div className="flex items-center gap-4">
             {/* ✅ LOGO TRANSPARENTE: mix-blend-screen elimina el fondo negro del jpeg */}
            <div className="w-14 h-14 overflow-hidden">
              <img src={logoAlabanza} alt="Logo" className="w-full h-full object-contain mix-blend-screen" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter italic uppercase bg-gradient-to-r from-amber-400 to-yellow-600 bg-clip-text text-transparent">Fabulosa Alabanza</h1>
              <p className="text-[10px] font-bold text-amber-500/60 tracking-[0.3em] uppercase">Señal de Bendición</p>
            </div>
          </div>
        </div>
        <button onClick={() => setDonacionModal(true)} className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-2xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex items-center gap-2">
          <Gift size={16} /> Sembrar
        </button>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        <section className="flex-1 flex flex-col bg-black relative group" ref={playerContainerRef}>
          <div className="flex-1 relative overflow-hidden">
            <div className="absolute inset-0 z-10"></div> 
            <div id="alabanza-player" className="w-full h-full"></div>
            
            {isLoading && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black backdrop-blur-md">
                <Loader2 className="animate-spin text-amber-500 mb-4" size={50} />
                <p className="text-amber-500 font-black tracking-widest uppercase animate-pulse">Cargando Unción...</p>
              </div>
            )}

            <div className={`absolute bottom-0 left-0 w-full p-8 flex items-center justify-between z-40 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-500 ${!showControls ? 'opacity-0' : 'opacity-100'}`}>
              <div className="flex items-center gap-8">
                <button onClick={() => isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo()} className="text-white hover:text-amber-500 transition-colors">
                  {isPlaying ? <Pause size={35} fill="white" /> : <Play size={35} fill="white" />}
                </button>
                <button onClick={() => { setIsMuted(!isMuted); playerRef.current?.[isMuted ? 'unMute' : 'mute'](); }} className="text-white hover:text-amber-500 transition-colors">
                  {isMuted ? <VolumeX size={30} /> : <Volume2 size={30} />}
                </button>
              </div>
              <button onClick={toggleFullscreen} className="text-white hover:text-amber-500 transition-colors">
                <Maximize size={30} />
              </button>
            </div>
          </div>
        </section>

        <aside className="w-full lg:w-[450px] bg-[#0a0a0a] border-l border-white/5 flex flex-col shadow-2xl">
          <div className="p-4 grid grid-cols-4 gap-2 border-b border-white/5 bg-black/20">
            {Object.keys(CATEGORIES).map(cat => (
              <button key={cat} onClick={() => setActiveTab(cat)} className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${activeTab === cat ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}>
                {cat === 'MUSICA' ? <Music className="mx-auto mb-1" size={16}/> : cat === 'PREDICAS' ? <Mic2 className="mx-auto mb-1" size={16}/> : cat === 'PELICULAS' ? <Film className="mx-auto mb-1" size={16}/> : <Tv className="mx-auto mb-1" size={16}/>}
                {cat}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {CATEGORIES[activeTab].map((item, idx) => (
              <button key={idx} onClick={() => { setIsLoading(true); setCurrentVideoId(item.id); }} className={`w-full flex items-center gap-4 p-4 rounded-[1.5rem] transition-all border ${currentVideoId === item.id ? 'bg-amber-500/10 border-amber-500 shadow-lg' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'}`}>
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 font-black italic">
                   {idx + 1}
                </div>
                <div className="flex-1 text-left">
                  <p className={`text-xs font-black uppercase tracking-tighter ${currentVideoId === item.id ? 'text-amber-500' : 'text-gray-300'}`}>{item.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Sparkles size={10} className="text-amber-500/50" />
                    <span className="text-[9px] font-bold text-gray-500 uppercase">Señal HD</span>
                  </div>
                </div>
                <Play size={14} className={currentVideoId === item.id ? 'text-amber-500' : 'text-gray-700'} />
              </button>
            ))}
          </div>
        </aside>
      </main>

      {donacionModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl">
            <div className="bg-zinc-900 border border-amber-500/40 p-10 rounded-[3rem] max-w-md w-full text-center shadow-2xl relative overflow-hidden">
                <Gift className="w-20 h-20 text-amber-500 mx-auto mb-8" />
                <h2 className="text-2xl font-black text-white mb-3 uppercase tracking-tighter italic">Sembrar en este Canal</h2>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-[2.5rem] p-10 mb-10 group hover:bg-amber-500/20 transition-all cursor-pointer">
                    <p className="text-[10px] text-amber-500 font-black uppercase tracking-[0.3em] mb-4 italic">Sinpe Móvil (Costa Rica)</p>
                    <p className="text-4xl font-black text-white tracking-[0.2em] group-hover:scale-110 transition-transform italic">6403-5313</p>
                </div>
                <button onClick={() => setDonacionModal(false)} className="w-full py-5 bg-amber-600 rounded-[2rem] font-black text-xs shadow-2xl active:scale-95 transition-all tracking-[0.3em] italic uppercase">Amén, Dios te bendiga</button>
            </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f59e0b; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default FabulosaAlabanza;