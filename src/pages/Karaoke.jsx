import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Mic2, Play, Pause, Volume2, VolumeX, Loader2, Sparkles } from 'lucide-react';

// ✅ ASSETS
const IMAGEN_ESPERA_URL = "/karaoke_play.png";

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

const Karaoke = () => {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const keyIndex = useRef(0); // Usamos useRef para que persista el índice de la llave

  const buscarVideo = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    let exito = false;

    // 🔄 CICLO DE BÚSQUEDA ENTRE LAS 14 LLAVES
    while (keyIndex.current < YOUTUBE_API_KEYS.length && !exito) {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(query + " karaoke")}&type=video&key=${YOUTUBE_API_KEYS[keyIndex.current]}`
        );

        // Si la llave actual está agotada (Error 403 o 429)
        if (response.status === 403 || response.status === 429) {
          console.warn(`Llave ${keyIndex.current + 1} agotada. Probando la siguiente...`);
          keyIndex.current++;
          continue; 
        }

        const data = await response.json();
        if (data.items && data.items.length > 0) {
          setVideo(data.items[0]);
          exito = true;
        } else {
          // Si no hay resultados, salimos del ciclo para no gastar llaves
          exito = true; 
        }
      } catch (error) {
        keyIndex.current++;
      }
    }

    // Si recorrimos todas y ninguna sirvió, reiniciamos el índice para la próxima vez
    if (keyIndex.current >= YOUTUBE_API_KEYS.length) {
        keyIndex.current = 0;
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col overflow-hidden">
      {/* HEADER */}
      <header className="p-4 flex items-center justify-between bg-black/40 backdrop-blur-md border-b border-white/5 z-50">
        <Link to="/" className="p-3 hover:bg-white/10 rounded-full transition-all text-gray-400 hover:text-white">
          <ArrowLeft size={24} />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20">
            <Mic2 size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tighter italic uppercase">Karaoke <span className="text-red-600">Play</span></h1>
        </div>
        <div className="w-12" />
      </header>

      <main className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
        {/* REPRODUCTOR */}
        <div className="flex-1 bg-black rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl relative">
          {video ? (
            <iframe
              src={`https://www.youtube.com/embed/${video.id.videoId}?autoplay=1&modestbranding=1&rel=0`}
              className="w-full h-full"
              allow="autoplay; encrypted-media; fullscreen"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/20">
              <img src={IMAGEN_ESPERA_URL} alt="Espera" className="w-48 h-48 object-contain opacity-20 mb-6" />
              <p className="text-white/20 font-black uppercase tracking-[0.3em] text-sm italic text-center">Busca una canción<br/>y que empiece el show</p>
            </div>
          )}
        </div>

        {/* BUSCADOR */}
        <aside className="w-full lg:w-[400px] flex flex-col gap-4">
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6">
            <form onSubmit={buscarVideo} className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="¿Qué quieres cantar?"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 pr-14 text-sm focus:outline-none focus:border-red-500/50 transition-all font-medium"
              />
              <button type="submit" className="absolute right-3 top-3 p-2 bg-white/5 rounded-xl text-gray-400 hover:bg-red-600/20 hover:text-red-500 transition-all">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18}/>}
              </button>
            </form>
            <div className="mt-6 flex flex-wrap gap-2">
                {["Vicente Fernández", "Karol G", "Christian Nodal", "Luis Miguel"].map(artist => (
                    <button key={artist} onClick={() => { setQuery(artist); }} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all">
                        {artist}
                    </button>
                ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Karaoke;