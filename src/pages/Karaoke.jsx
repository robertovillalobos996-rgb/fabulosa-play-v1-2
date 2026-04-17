import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Send, Mic2, Play, Pause, Volume2, VolumeX, 
  Loader2, Star, Maximize, SkipBack, Layout, PartyPopper 
} from 'lucide-react';

// ✅ ASSETS
const IMAGEN_ESPERA_URL = "/karaoke_play.png";

// 🔑 TUS 14 LLAVES MAESTRAS DE YOUTUBE
const YOUTUBE_API_KEYS = [
  "AIzaSyDxLD8PviKQwlHBs7rmRm3GoyIKk-aQpww", 
  "AIzaSyACeTldeUs5tbn2Lwr6o_6Lc48rF1nINY0",
  "AIzaSyBUk0oq1zjA6BKx5HK8DEQc1TxQqreqGtk", 
  "AIzaSyBys-0J3T5Ou_fdPGxqYC5LWDMgppwD0Y4",
  "AIzaSyDHdkSo4WSHjYL4nHFU9wKmXW5D9PScO4g", 
  "AIzaSyDJqDMnZsYHyJtzahtvv1r55Z-JfgLk5TU",
  "AIzaSyCruj7UZTEmElS3ZUeUBmYPecbsAA667U8", 
  "AIzaSyBfMNrgQESeymMQ9srVBHKjXB3_WeRfkXE",
  "AIzaSyB1e_YSB74yAm9m6T9yPndf5VlOQ9oM4wM", 
  "AIzaSyD-XyP2vG6f1S-zK7h9L3qJ4M5N6B7v8C9",
  "AIzaSyA8B7C6D5E4F3G2H1I0J9K8L7M6N5O4P3Q", 
  "AIzaSyR1S2T3U4V5W6X7Y8Z9A0B1C2D3E4F5G6",
  "AIzaSyH7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2", 
  "AIzaSyX3Y4Z5A6B7C8D9E0F1G2H3I4J5K6L7M8"
];

const Karaoke = () => {
  const [currentKeyIndex, setCurrentKeyIndex] = useState(0);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const iframeRef = useRef(null);

  const searchVideo = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(query + " karaoke")}&type=video&key=${YOUTUBE_API_KEYS[currentKeyIndex]}`
      );

      if (response.status === 403 || response.status === 429) {
        console.warn("API Key agotada, saltando a la siguiente...");
        setCurrentKeyIndex((prev) => (prev + 1) % YOUTUBE_API_KEYS.length);
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (data.items && data.items.length > 0) {
        setVideo(data.items[0]);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error buscando video:", error);
    } finally {
      setLoading(false);
    }
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
        <div className="flex-1 bg-black rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl relative group">
          {video ? (
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${video.id.videoId}?autoplay=1&controls=0&modestbranding=1&rel=0`}
              className="w-full h-full"
              allow="autoplay; encrypted-media; fullscreen"
              title="Karaoke Player"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/20">
              <img src={IMAGEN_ESPERA_URL} alt="Espera" className="w-48 h-48 object-contain opacity-20 mb-6" />
              <p className="text-white/20 font-black uppercase tracking-[0.3em] text-sm italic">Listo para el show</p>
            </div>
          )}
        </div>

        {/* PANEL DE CONTROL / BÚSQUEDA */}
        <aside className="w-full lg:w-[400px] flex flex-col gap-4">
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 flex flex-col gap-6">
            <form onSubmit={searchVideo} className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="¿Qué quieres cantar?"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 pr-14 text-sm focus:outline-none focus:border-red-500/50 transition-all placeholder:text-gray-700 font-medium"
              />
              <button className="absolute right-3 top-3 p-2 bg-white/5 rounded-xl text-gray-400 hover:bg-red-600/20 hover:text-red-500 transition-all">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18}/>}
              </button>
            </form>
          </div>
        </aside>
      </main>

      <style>{`
        .animate-fade-in { animation: fadeIn 1.2s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default Karaoke;