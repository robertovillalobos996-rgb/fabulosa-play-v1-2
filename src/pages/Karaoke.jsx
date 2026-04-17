import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Mic2, Loader2, Sparkles, Music, Star, Trophy, Ghost } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ✅ ASSETS
const LOGO_KARAOKE = "/karaoke_play.png";

// 🔑 LAS 14 LLAVES MAESTRAS
const YOUTUBE_API_KEYS = [
  "AIzaSyDxLD8PviKQwlHBs7rmRm3GoyIKk-aQpww", "AIzaSyACeTldeUs5tbn2Lwr6o_6Lc48rF1nINY0",
  "AIzaSyBUk0oq1zjA6BKx5HK8DEQc1TxQqreqGtk", "AIzaSyBys-0J3T5Ou_fdPGxqYC5LWDMgppwD0Y4",
  "AIzaSyDHdkSo4WSHjYL4nHFU9wKmXW5D9PScO4g", "AIzaSyDJqDMnZsYHyJtzahtvv1r55Z-JfgLk5TU",
  "AIzaSyCruj7UZTEmElS3ZUeUBmYPecbsAA667U8", "AIzaSyBfMNrgQESeymMQ9srVBHKjXB3_WeRfkXE",
  "AIzaSyB1e_YSB74yAelvAhapDWu11VPLz2wBkUg", "AIzaSyCsvViGGiPJxx8-FkSwQvHE2T_U8d2UO5E",
  "AIzaSyBRvdUqolryjMRustJUyqN_HtkjRCbHLfI", "AIzaSyCdmCZW6J49Onl-QAf3cTsNu0im84EBVZc",
  "AIzaSyCeref7W3di_9o6W3YnEtqgvCQyvyQ5a5Q", "AIzaSyAwtE19mD7rpv1pu5nB4R8Q0HmEX9OkgJI"
];

const FRASES_BOT = {
  buscando: [
    "¡Oído cocina! Buscando ese temazo en los archivos de Las Vegas... ✨",
    "¡Uff, qué buen gusto! Preparando el escenario para una estrella... 🎤",
    "¡Esa es de las mías! Ya casi te pongo a brillar... 📁",
    "¡Atención público! Se viene un momento épico... 🌟"
  ],
  exito: [
    "¡LISTO! Dale con todo, ¡hoy te conviertes en leyenda! 🔥",
    "¡Pista cargada! Micrófono abierto, el escenario es tuyo... 🎸",
    "¡Qué voz se ocupa para esto! ¡A romperla! 🚀"
  ],
  error: [
    "¡Uy! Esa canción está muy exclusiva y no la encontré. ¿Probamos con otra? 😅",
    "Parece que el DJ se tomó un descanso. ¡Intenta con otro nombre! 🍺"
  ]
};

const KaraokeLasVegas = () => {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [botMessage, setBotMessage] = useState("¡Bienvenido al Centro Nocturno Fabulosa! ¿Qué vas a cantar hoy, estrella?");
  const keyIndex = useRef(0);

  const getFrase = (tipo) => {
    const frases = FRASES_BOT[tipo];
    return frases[Math.floor(Math.random() * frases.length)];
  };

  const buscarVideo = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setBotMessage(getFrase('buscando'));
    let exito = false;

    while (keyIndex.current < YOUTUBE_API_KEYS.length && !exito) {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(query + " karaoke español")}&type=video&key=${YOUTUBE_API_KEYS[keyIndex.current]}`
        );

        if (response.status === 403 || response.status === 429) {
          keyIndex.current++;
          continue; 
        }

        const data = await response.json();
        if (data.items && data.items.length > 0) {
          setVideo(data.items[0]);
          setBotMessage(getFrase('exito'));
          exito = true;
        } else {
          setBotMessage(getFrase('error'));
          exito = true; 
        }
      } catch (error) {
        keyIndex.current++;
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col overflow-hidden selection:bg-red-500">
      
      {/* 🌆 FONDO ESTILO LAS VEGAS (Animado) */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.15),transparent_70%)]" />
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      {/* HEADER PREMIUM */}
      <header className="relative z-50 p-6 flex items-center justify-between bg-black/60 backdrop-blur-2xl border-b border-red-900/30">
        <Link to="/" className="flex items-center gap-2 text-white/40 hover:text-red-500 transition-all uppercase font-black text-xs tracking-widest group">
          <div className="p-2 rounded-full group-hover:bg-red-500/10 transition-colors"><ArrowLeft size={20} /></div>
          Salir del Club
        </Link>
        
        <div className="flex flex-col items-center">
            <img src={LOGO_KARAOKE} className="h-16 md:h-20 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
        </div>

        <div className="hidden md:flex items-center gap-4 bg-red-950/20 px-6 py-2 rounded-full border border-red-500/20">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            <span className="text-[10px] font-black tracking-[0.4em] text-red-500 uppercase">Live Show Vegas</span>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col lg:flex-row p-4 md:p-8 gap-8 overflow-hidden">
        
        {/* REPRODUCTOR BLINDADO */}
        <div className="flex-1 flex flex-col gap-4">
            <div className="relative flex-1 bg-black rounded-[3rem] overflow-hidden border-4 border-red-900/20 shadow-[0_0_50px_rgba(220,38,38,0.2)]">
                {video ? (
                    <>
                        {/* 🛡️ EL CANDADO TRANSPARENTE (Escudo Total) */}
                        <div className="absolute top-0 left-0 w-full h-[100px] z-30" /> 
                        <div className="absolute bottom-0 left-0 w-full h-[100px] z-30" />
                        <div className="absolute inset-0 z-20" /> {/* Capa central para evitar clics en el video */}

                        <iframe
                            src={`https://www.youtube.com/embed/${video.id.videoId}?autoplay=1&modestbranding=1&rel=0&controls=0&disablekb=1&iv_load_policy=3&vq=hd1080`}
                            className="w-full h-full pointer-events-none"
                            allow="autoplay"
                        />
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/10">
                        <Music size={80} className="text-red-900/20 animate-pulse mb-4" />
                        <p className="text-red-900/40 font-black uppercase tracking-[0.5em] text-xs">Esperando a la estrella...</p>
                    </div>
                )}
            </div>

            {/* BOTÓN DE CONTROL VISUAL */}
            <div className="flex justify-center gap-6 p-4">
                <div className="flex items-center gap-2 text-yellow-500"><Trophy size={20}/> <span className="text-[10px] font-bold uppercase tracking-widest">Show de Calidad</span></div>
                <div className="flex items-center gap-2 text-cyan-500"><Star size={20}/> <span className="text-[10px] font-bold uppercase tracking-widest">Voz Fabulosa</span></div>
            </div>
        </div>

        {/* PANEL DEL BOT INTERACTIVO */}
        <aside className="w-full lg:w-[450px] flex flex-col gap-6">
          
          {/* CHAT DEL BOT */}
          <div className="flex-1 bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-8 flex flex-col shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5"><Ghost size={100}/></div>
            
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/40">
                    <Mic2 size={24} className="text-white animate-bounce" />
                </div>
                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-red-500 italic">Host Virtual</h3>
                    <p className="text-[10px] text-white/40 font-bold uppercase">Club Fabulosa 24/7</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    <motion.p 
                        key={botMessage}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-2xl md:text-3xl font-black italic leading-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40 mb-8"
                    >
                        "{botMessage}"
                    </motion.p>
                </AnimatePresence>
            </div>

            {/* BUSCADOR LAS VEGAS */}
            <form onSubmit={buscarVideo} className="relative mt-auto">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Busca artista o canción..."
                className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-5 px-6 pr-16 text-sm focus:outline-none focus:border-red-600/50 transition-all font-bold placeholder:text-gray-700 shadow-inner"
              />
              <button type="submit" className="absolute right-3 top-2.5 p-3 bg-red-600 rounded-xl text-white hover:bg-red-500 transition-all shadow-lg shadow-red-600/40 active:scale-95">
                {loading ? <Loader2 size={22} className="animate-spin" /> : <Send size={22}/>}
              </button>
            </form>
          </div>

          {/* PLAYLIST RECOMENDADA */}
          <div className="p-4 flex gap-4 overflow-x-auto no-scrollbar">
            {["José José", "Selena", "Luis Miguel", "Karol G"].map(exito => (
                <button 
                    key={exito} 
                    onClick={() => { setQuery(exito); }}
                    className="px-6 py-3 bg-red-950/30 border border-red-500/20 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all whitespace-nowrap"
                >
                    🔥 {exito}
                </button>
            ))}
          </div>
        </aside>
      </main>

      {/* FOOTER NEÓN */}
      <footer className="p-4 bg-black/80 border-t border-red-900/20 text-center relative z-50">
        <p className="text-[9px] font-black tracking-[1em] text-white/20 uppercase">The Las Vegas Experience • Fabulosa Play 2026</p>
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default KaraokeLasVegas;