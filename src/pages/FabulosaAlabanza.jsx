import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Heart, Sparkles, Volume2, VolumeX, Play, Pause, 
  Gift, Mic2, Tv, BookOpen, Film, Music, LayoutGrid, Loader2, Maximize, SkipForward 
} from 'lucide-react';

// ✅ ASSETS (Solo la imagen)
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

const VERSICULOS = [
  "Todo lo puedo en Cristo que me fortalece. (Filipenses 4:13)",
  "Jehová es mi pastor; nada me faltará. (Salmos 23:1)",
  "La paz os dejo, mi paz os doy. (Juan 14:27)",
  "Esfuérzate y sé valiente; no temas ni desmayes. (Josué 1:9)",
  "Clama a mí, y yo te responderé. (Jeremías 33:3)"
];

const FabulosaAlabanza = () => {
  const playCountRef = useRef(0);
  const keyIndexRef = useRef(0);
  const lastMovieTimeRef = useRef(Date.now()); 
  const ytPlayerRef = useRef(null);
  const playerWrapperRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState('tv'); 
  const [libraryContent, setLibraryContent] = useState([]);
  const [currentYtId, setCurrentYtId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true); 
  const [mensajeDJ, setMensajeDJ] = useState("Conectando con la señal del Reino...");
  const [isLoading, setIsLoading] = useState(true);

  const [oracionModal, setOracionModal] = useState(false);
  const [donacionModal, setDonacionModal] = useState(false);

  useEffect(() => {
    continuarProgramacion();
    cargarBiblioteca('movies', 'Jesus de Nazareth Moises Los Diez Mandamientos peliculas completas español');
  }, []);

  const continuarProgramacion = () => {
    const ahora = Date.now();
    if (ahora - lastMovieTimeRef.current >= 9000000) { 
      setMensajeDJ("🎬 Cine de Gala: Moisés y los grandes clásicos de la fe...");
      buscarEnYouTube("Jesus de Nazareth Moses Los Diez Mandamientos pelicula completa", 'tv');
      lastMovieTimeRef.current = ahora;
    } else if (playCountRef.current % 5 === 0 && playCountRef.current !== 0) {
      setMensajeDJ("📖 Tiempo de Palabra: Edificando tu espíritu hoy...");
      buscarEnYouTube("predica cristiana poderosa dante gebel armando alducin itiel arroyo chuy olivares", 'tv');
    } else {
      setMensajeDJ("🎵 Alabanza y Adoración: Elevando incienso al Trono...");
      buscarEnYouTube("alabanzas de adoracion 2026 grandes exitos", 'tv', true);
    }
  };

  const manejarFinDeVideo = () => {
    playCountRef.current += 1;
    continuarProgramacion();
  };

  const buscarEnYouTube = async (query, target, isMusic = false) => {
    if (target === 'tv') setIsLoading(true);
    try {
      let exito = false;
      let data = null;
      while (keyIndexRef.current < YOUTUBE_API_KEYS.length && !exito) {
        const key = YOUTUBE_API_KEYS[keyIndexRef.current];
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(query)}&type=video&videoEmbeddable=true&key=${key}${isMusic ? '&videoCategoryId=10' : ''}`;
        const res = await fetch(url);
        if (res.status === 403 || res.status === 429) keyIndexRef.current++;
        else { data = await res.json(); exito = true; }
      }

      if (exito && data?.items?.length > 0) {
        if (target === 'tv') {
          setCurrentYtId(data.items[0].id.videoId);
          setIsLoading(false);
        } else {
          const mixedContent = [];
          data.items.forEach((item, index) => {
            mixedContent.push({ type: 'video', data: item });
            if ((index + 1) % 4 === 0) mixedContent.push({ type: 'google-ad' }); 
            if ((index + 1) % 7 === 0) mixedContent.push({ type: 'ministry-card' }); 
          });
          setLibraryContent(mixedContent);
        }
      }
    } catch (e) { setIsLoading(false); }
  };

  const cargarBiblioteca = (tab, query) => {
    setActiveTab(tab);
    buscarEnYouTube(query, 'library', tab === 'music');
  };

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = () => initYTPlayer();
    } else { initYTPlayer(); }

    function initYTPlayer() {
      if (ytPlayerRef.current) return;
      ytPlayerRef.current = new window.YT.Player('youtube-player', {
        playerVars: { autoplay: 1, controls: 0, modestbranding: 1, rel: 0, showinfo: 0 },
        events: {
          'onReady': (e) => { if (isMuted) e.target.mute(); },
          'onStateChange': (e) => { if (e.data === 0) manejarFinDeVideo(); }
        }
      });
    }
  }, []);

  useEffect(() => {
    if (currentYtId && ytPlayerRef.current?.loadVideoById) {
      ytPlayerRef.current.loadVideoById(currentYtId);
    }
  }, [currentYtId]);

  const toggleFullscreen = () => {
    const el = playerWrapperRef.current;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  };

  return (
    <div className="w-full min-h-screen bg-[#020617] text-white overflow-x-hidden font-sans">
      <header className="fixed top-0 w-full z-[100] bg-slate-950/90 backdrop-blur-xl border-b border-amber-500/20 px-4 md:px-8 py-3 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 bg-white/5 hover:bg-amber-600/20 rounded-full border border-white/10 transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex flex-col leading-none">
            <h1 className="text-lg md:text-xl font-black text-amber-500 uppercase tracking-tighter italic">Centro Cristiano</h1>
            <span className="text-[8px] md:text-[10px] tracking-[0.2em] font-bold text-slate-400 uppercase italic">Fabulosa Alabanza</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setOracionModal(true)} className="px-4 py-2 bg-amber-600 rounded-full font-black text-[10px] shadow-lg active:scale-95 transition-all flex items-center gap-2">
            <Heart size={14} fill="white"/> ORACIÓN
          </button>
          <button onClick={() => setDonacionModal(true)} className="hidden sm:flex px-4 py-2 bg-white/5 border border-white/10 rounded-full font-black text-[10px] hover:bg-white/10 transition-all items-center gap-2 italic">
            <Gift size={14} className="text-amber-500"/> APOYAR EL CANAL
          </button>
        </div>
      </header>

      <main className="pt-20 pb-20 px-4 md:px-12 max-w-[1600px] mx-auto">
        <section className="mb-10">
            <div className="w-full bg-slate-900/60 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-4 mb-5 shadow-xl">
                <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500">
                    <Mic2 size={20} className="animate-pulse" />
                </div>
                <p className="text-xs md:text-sm font-bold italic text-amber-100/80">{mensajeDJ}</p>
            </div>

            <div ref={playerWrapperRef} className="relative aspect-video w-full bg-black rounded-[2.5rem] overflow-hidden border-2 border-slate-800 shadow-2xl group">
                {isLoading && (
                    <div className="absolute inset-0 z-30 bg-slate-950 flex flex-col items-center justify-center">
                        <Loader2 className="text-amber-500 animate-spin mb-4" size={50} />
                        <p className="text-amber-200 font-black text-xs tracking-widest uppercase">CONECTANDO AL TRONO...</p>
                    </div>
                )}

                <div className="absolute inset-0 z-10">
                    <div className="absolute inset-0 z-20 bg-transparent"></div>
                    <div id="youtube-player" className="w-full h-full scale-[1.4] md:scale-[1.25]"></div>
                </div>

                <div className="absolute top-6 right-6 z-50 w-28 md:w-52 opacity-70 pointer-events-none drop-shadow-2xl">
                    <img src={logoAlabanza} className="w-full" style={{ mixBlendMode: 'screen' }} />
                </div>

                <div className="absolute bottom-0 w-full p-6 md:p-10 flex justify-between items-end bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-50 translate-y-4 group-hover:translate-y-0">
                    <div className="flex gap-4">
                        <button onClick={() => { setIsPlaying(!isPlaying); isPlaying ? ytPlayerRef.current.pauseVideo() : ytPlayerRef.current.playVideo(); }} className="p-4 bg-amber-600 rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all">
                            {isPlaying ? <Pause size={24} fill="white"/> : <Play size={24} fill="white" className="ml-1"/>}
                        </button>
                        <button onClick={() => { setIsMuted(!isMuted); isMuted ? ytPlayerRef.current.unMute() : ytPlayerRef.current.mute(); }} className="p-4 bg-white/10 backdrop-blur-2xl border border-white/10 rounded-full hover:bg-white/20 transition-all">
                            {isMuted ? <VolumeX size={24}/> : <Volume2 size={24}/>}
                        </button>
                        <button onClick={continuarProgramacion} className="p-4 bg-white/5 backdrop-blur-2xl border border-white/5 rounded-full hover:text-amber-500 transition-all">
                            <SkipForward size={24}/>
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-1.5 bg-red-600 rounded-full text-[10px] font-black animate-pulse border border-white/20 uppercase tracking-widest flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div> EN VIVO
                        </div>
                        <button onClick={toggleFullscreen} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-all text-slate-400">
                            <Maximize size={20}/>
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-amber-500 mb-8 flex items-center gap-3">
            <LayoutGrid size={28}/> Manantial de Bendición
        </h2>

        <nav className="flex gap-3 overflow-x-auto pb-6 no-scrollbar mb-10 border-b border-white/5">
            {[
                { id: 'tv', icon: Tv, label: 'EN VIVO 24/7', q: '' },
                { id: 'movies', icon: Film, label: 'CINE SEMANA SANTA', q: 'Jesus de Nazareth Moises Los Diez Mandamientos peliculas cristianas' },
                { id: 'sermons', icon: BookOpen, label: 'PRÉDICAS VARIADAS', q: 'predicas cristianas dante gebel armando alducin itiel arroyo chuy olivares' },
                { id: 'music', icon: Music, label: 'ALABANZA Y ADORACIÓN', q: 'musica cristiana adoracion 2026 grandes exitos' }
            ].map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => cargarBiblioteca(tab.id, tab.q)}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[11px] md:text-xs transition-all whitespace-nowrap border ${activeTab === tab.id ? 'bg-amber-600 border-amber-400 text-white shadow-2xl scale-105' : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'}`}
                >
                    <tab.icon size={18} /> {tab.label}
                </button>
            ))}
        </nav>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {libraryContent.map((item, idx) => (
                item.type === 'video' ? (
                    <div key={idx} onClick={() => { setCurrentYtId(item.data.id.videoId); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="group cursor-pointer bg-slate-900/40 rounded-3xl p-3 border border-white/5 hover:border-amber-500/40 transition-all shadow-xl hover:-translate-y-2 duration-500">
                        <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 shadow-lg">
                            <img src={item.data.snippet.thumbnails.high.url} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 opacity-80 group-hover:opacity-100" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                                <Play fill="white" size={30} className="text-white" />
                            </div>
                        </div>
                        <h3 className="text-[11px] font-black line-clamp-2 text-slate-200 px-1 uppercase tracking-tight italic group-hover:text-amber-500 transition-colors leading-relaxed">{item.data.snippet.title}</h3>
                    </div>
                ) : null
            ))}
        </section>
      </main>

      <footer className="fixed bottom-0 w-full bg-slate-950 border-t border-amber-500/30 py-3 overflow-hidden z-[100] backdrop-blur-md">
          <div className="whitespace-nowrap animate-marquee flex gap-12 text-amber-500/90 font-black italic text-[10px] uppercase tracking-[0.3em]">
              {VERSICULOS.map((v, i) => (<span key={i} className="flex items-center gap-2"><Sparkles size={12} className="text-amber-400" /> {v}</span>))}
          </div>
      </footer>

      {oracionModal && (
        <div className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-amber-500/30 p-10 rounded-[3rem] max-w-lg w-full text-center shadow-2xl">
                <Heart className="w-16 h-16 text-amber-500 mx-auto mb-6 animate-pulse" fill="currentColor" />
                <h2 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">Buzón de Oración</h2>
                <textarea placeholder="Cuéntanos tu motivo de oración..." className="w-full bg-black/60 border border-white/10 rounded-[2rem] p-6 text-white text-sm h-48 focus:border-amber-500 outline-none transition-all mb-8 placeholder:text-slate-700 italic" />
                <div className="flex gap-4">
                    <button onClick={() => setOracionModal(false)} className="flex-1 py-5 bg-white/5 rounded-2xl font-black text-xs hover:bg-red-500/20 transition-all uppercase tracking-widest text-slate-400 italic">Cancelar</button>
                    <button className="flex-1 py-5 bg-amber-600 rounded-2xl font-black text-xs shadow-2xl shadow-amber-900/50 uppercase tracking-widest italic">Enviar Clamor</button>
                </div>
            </div>
        </div>
      )}

      {donacionModal && (
        <div className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-amber-500/40 p-10 md:p-14 rounded-[4rem] max-w-md w-full text-center shadow-2xl relative overflow-hidden">
                <Gift className="w-20 h-20 text-amber-500 mx-auto mb-8" />
                <h2 className="text-2xl font-black text-white mb-3 uppercase tracking-tighter italic">Sembrar en este Canal</h2>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-[2.5rem] p-10 mb-10 group hover:bg-amber-500/20 transition-all cursor-pointer">
                    <p className="text-[10px] text-amber-500 font-black uppercase tracking-[0.3em] mb-4 italic">Sinpe Móvil (Costa Rica)</p>
                    <p className="text-4xl font-black text-white tracking-[0.2em] group-hover:scale-110 transition-transform italic">6403-5313</p>
                </div>
                <button onClick={() => setDonacionModal(false)} className="w-full py-5 bg-amber-600 rounded-[2rem] font-black text-xs shadow-2xl shadow-amber-900/60 active:scale-95 transition-all tracking-[0.3em] italic uppercase">Amén, Dios te bendiga</button>
            </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .animate-marquee { animation: marquee 60s linear infinite; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        #youtube-player { pointer-events: none; }
      `}</style>
    </div>
  );
};

export default FabulosaAlabanza;
