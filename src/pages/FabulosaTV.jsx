import React, { useState, useEffect, useRef } from 'react';
import { Play, Volume2, Heart, BookOpen, GraduationCap, Sparkles, Lock, Unlock, X, Tv, Star, Music, Palette, Pencil, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ✅ ASSETS MANTENIDOS
const LOGO_KIDS_HEADER = "/fabulosito_kids.png"; 

// 🔑 LAS 14 LLAVES MAESTRAS CON ROTACIÓN
const YOUTUBE_API_KEYS = [
  "AIzaSyDxLD8PviKQwlHBs7rmRm3GoyIKk-aQpww", "AIzaSyACeTldeUs5tbn2Lwr6o_6Lc48rF1nINY0",
  "AIzaSyBUk0oq1zjA6BKx5HK8DEQc1TxQqreqGtk", "AIzaSyBys-0J3T5Ou_fdPGxqYC5LWDMgppwD0Y4",
  "AIzaSyDHdkSo4WSHjYL4nHFU9wKmXW5D9PScO4g", "AIzaSyDJqDMnZsYHyJtzahtvv1r55Z-JfgLk5TU",
  "AIzaSyCruj7UZTEmElS3ZUeUBmYPecbsAA667U8", "AIzaSyBfMNrgQESeymMQ9srVBHKjXB3_WeRfkXE",
  "AIzaSyB1e_YSB74yAelvAhapDWu11VPLz2wBkUg", "AIzaSyCsvViGGiPJxx8-FkSwQvHE2T_U8d2UO5E",
  "AIzaSyBRvdUqolryjMRustJUyqN_HtkjRCbHLfI", "AIzaSyCdmCZW6J49Onl-QAf3cTsNu0im84EBVZc",
  "AIzaSyCeref7W3di_9o6W3YnEtqgvCQyvyQ5a5Q", "AIzaSyAwtE19mD7rpv1pu5nB4R8Q0HmEX9OkgJI"
];

const FabulosaKids = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [category, setCategory] = useState('Escuelita'); // Inicia en la nueva categoría
  const [isLoading, setIsLoading] = useState(false);
  const keyIndex = useRef(0);

  // 📝 CATEGORÍAS AMPLIADAS
  const categories = [
    { id: 'Escuelita', name: 'Escuelita', icon: <GraduationCap />, query: 'aprender a leer escribir vocales pintar niños completo' },
    { id: 'Musical', name: 'Musical', icon: <Music />, query: 'canciones infantiles populares musica niños pegajosa' },
    { id: 'Niñas', name: 'Solo Niñas', icon: <Heart />, query: 'barbie frozen princesas disney lulu99 completa español' },
    { id: 'Warner', name: 'Warner Kids', icon: <Tv />, query: 'looney tunes tom y jerry scooby doo español completo' },
    { id: 'Peliculas', name: 'Películas', icon: <Star />, query: 'peliculas infantiles completas español latino 1080p' },
    { id: 'Juegos', name: 'Juegos', icon: <Sparkles />, query: 'juegos infantiles educativos para bebes interactivos' }
  ];

  const fetchVideos = async () => {
    setIsLoading(true);
    const activeCat = categories.find(c => c.id === category);
    let success = false;

    while (keyIndex.current < YOUTUBE_API_KEYS.length && !success) {
      try {
        // Forzamos video completo (long) y alta definición
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(activeCat.query)}&type=video&videoDuration=long&videoDefinition=high&key=${YOUTUBE_API_KEYS[keyIndex.current]}`
        );

        if (response.status === 403 || response.status === 429) {
          keyIndex.current++;
          continue;
        }

        const data = await response.json();
        setVideos(data.items || []);
        success = true;
      } catch (error) {
        keyIndex.current++;
      }
    }
    setIsLoading(false);
  };

  useEffect(() => { fetchVideos(); }, [category]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
      
      {/* 🚀 LOGO MÁS GRANDE CON MOVIMIENTO (MANTENIDO ENCIMA) */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[500] pointer-events-none">
        <motion.img 
          src={LOGO_KIDS_HEADER} 
          animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="h-28 md:h-40 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        />
      </div>

      {/* NAVEGACIÓN */}
      <nav className="fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-2xl border-t border-white/10 p-4 z-[400] flex justify-center gap-4 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-black uppercase tracking-tighter transition-all ${category === cat.id ? 'bg-yellow-400 text-black scale-110 shadow-[0_0_20px_rgba(252,211,77,0.5)]' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
          >
            {cat.icon} <span className="text-xs">{cat.name}</span>
          </button>
        ))}
      </nav>

      <main className="pt-40 pb-32 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {isLoading ? (
            <div className="col-span-full flex justify-center p-20"><Loader2 className="animate-spin text-yellow-400" size={50} /></div>
          ) : (
            videos.map((vid) => (
              <motion.div 
                key={vid.id.videoId}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedVideo(vid)}
                className="bg-zinc-900/50 rounded-[2.5rem] overflow-hidden border border-white/5 cursor-pointer group"
              >
                <div className="relative aspect-video">
                  <img src={vid.snippet.thumbnails.high.url} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play fill="white" size={48} />
                  </div>
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-black text-xs uppercase tracking-tighter line-clamp-2 italic">{vid.snippet.title}</h3>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>

      {/* 🎬 REPRODUCTOR CON CANDADO (BLINDAJE TOTAL) */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[600] bg-black flex flex-col"
          >
            <div className="p-4 flex justify-between items-center bg-black">
                <button onClick={() => setSelectedVideo(null)} className="bg-red-600 text-white px-10 py-3 rounded-full font-black uppercase border-4 border-white active:scale-95 transition-all">
                  SALIR
                </button>
                <div className="flex items-center gap-2 text-yellow-400 font-black animate-pulse text-[10px] uppercase">
                    <Lock size={16}/> MODO SEGURO ACTIVADO
                </div>
            </div>

            <div className="flex-1 relative">
                {/* 🛡️ ESCUDO DE CRISTAL (CANDADO ANTI-YOUTUBE) */}
                <div className="absolute top-0 left-0 w-full h-[100px] z-[700]" /> {/* Tapa título */}
                <div className="absolute bottom-0 left-0 w-full h-[100px] z-[700]" /> {/* Tapa controles bajos */}
                <div className="absolute inset-0 z-[650]" /> {/* Tapa centro */}

                <iframe 
                  width="100%" height="100%" 
                  src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}?autoplay=1&rel=0&modestbranding=1&controls=0&disablekb=1&vq=hd1080`} 
                  frameBorder="0" allow="autoplay" className="relative z-10"
                />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default FabulosaKids;