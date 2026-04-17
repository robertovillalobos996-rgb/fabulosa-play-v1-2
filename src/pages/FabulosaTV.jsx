import React, { useState, useEffect, useRef } from 'react';
import { Play, Volume2, VolumeX, Heart, BookOpen, GraduationCap, Sparkles, Lock, Unlock, X, Tv, Star, Music, Maximize, Minimize, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ✅ LOGO (Ruta directa a public)
const LOGO_KIDS_HEADER = "/fabulosito_kids.png"; 

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

const CATEGORIAS = [
    { id: 'mickey', label: 'MICKEY MOUSE', icon: <Star size={30}/>, color: 'bg-red-600', query: 'mickey mouse episodios completos español' },
    { id: 'warner', label: 'WARNER BROS', icon: <Tv size={30}/>, color: 'bg-sky-600', query: 'looney tunes tom y jerry scooby doo español completo' },
    { id: 'escuelita', label: 'ESCUELITA', icon: <GraduationCap size={30}/>, color: 'bg-green-600', query: 'aprender a leer escribir vocales pintar para niños completo' },
    { id: 'musical', label: 'MUSICAL', icon: <Music size={30}/>, color: 'bg-indigo-600', query: 'canciones infantiles famosas musica para niños completa' },
    { id: 'cine', label: 'PELÍCULAS', icon: <Play size={30}/>, color: 'bg-yellow-400', query: 'peliculas infantiles completas español latino hd 1080p' },
    { id: 'niñas', label: 'SOLO NIÑAS', icon: <Heart size={30}/>, color: 'bg-purple-500', query: 'series para niñas princesas barbie lulu99 episodios completos español' },
    { id: 'juegos', label: 'JUEGOS', icon: <Sparkles size={30}/>, color: 'bg-orange-500', query: 'juegos infantiles educativos para bebes interactivos' }
];

const EMOJIS = ["🐶", "🦁", "🦄", "🐼", "🦊", "🐯", "🐧", "⭐"];

const FabulositoKids = () => {
    const [view, setView] = useState("HOME"); 
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [activeCat, setActiveCat] = useState('mickey');
    const [userEmoji, setUserEmoji] = useState("🐶");
    const [isLocked, setIsLocked] = useState(false);
    const [volume, setVolume] = useState(1);
    const [lockTimer, setLockTimer] = useState(null);

    const keyIndex = useRef(0);
    const playerContainerRef = useRef(null);

    const fetchVideos = async (query) => {
        let success = false;
        while (keyIndex.current < YOUTUBE_API_KEYS.length && !success) {
            try {
                const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(query)}&type=video&videoDefinition=high&videoDuration=long&key=${YOUTUBE_API_KEYS[keyIndex.current]}`);
                if (res.status === 403 || res.status === 429) { keyIndex.current++; continue; }
                const data = await res.json();
                setVideos(data.items || []);
                success = true;
            } catch (e) { keyIndex.current++; }
        }
    };

    useEffect(() => { if (view === "HOME") fetchVideos(CATEGORIAS.find(c => c.id === activeCat).query); }, [activeCat, view]);

    const handleLockDown = () => {
        if (!isLocked) { setIsLocked(true); return; }
        const timer = setTimeout(() => setIsLocked(false), 3000);
        setLockTimer(timer);
    };

    return (
        <div className="min-h-screen w-full bg-black font-sans overflow-hidden text-white relative">
            
            {/* 📺 VIDEO DE FONDO */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <iframe className="w-[100vw] h-[100vh] absolute top-0 left-0 scale-[1.5]" src="https://www.youtube.com/embed/yveCKWxSmlY?autoplay=1&mute=1&loop=1&playlist=yveCKWxSmlY&controls=0&showinfo=0&rel=0&iv_load_policy=3&vq=hd1080" allow="autoplay" frameBorder="0" />
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 p-4 md:p-8 flex flex-col h-screen bg-black/40">
                
                {/* 🚀 LOGO GIGANTE CENTRAL */}
                <div className="flex flex-col items-center mb-6">
                    <motion.img 
                        src={LOGO_KIDS_HEADER} 
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="h-32 md:h-52 drop-shadow-[0_0_30px_rgba(255,255,255,0.6)] object-contain"
                    />
                </div>

                {/* BOTONES SUPERIORES */}
                <div className="flex justify-between items-center mb-6 px-4">
                    <button 
                        onMouseDown={handleLockDown} onMouseUp={() => clearTimeout(lockTimer)}
                        onTouchStart={handleLockDown} onTouchEnd={() => clearTimeout(lockTimer)}
                        className={`p-4 rounded-full transition-all ${isLocked ? 'bg-red-600 animate-pulse' : 'bg-green-500 shadow-xl'}`}
                    >
                        {isLocked ? <Lock size={30} /> : <Unlock size={30} />}
                    </button>

                    {/* AVATARES CON ANIMACIÓN */}
                    <div className="flex gap-4 items-center bg-black/60 p-2 rounded-full backdrop-blur-xl border border-white/20">
                        <motion.span whileTap={{ scale: 2, rotate: 360 }} className="text-3xl ml-4 cursor-pointer">{userEmoji}</motion.span>
                        <div className="flex gap-3 pr-4">
                            {EMOJIS.map(e => (
                                <motion.button 
                                    key={e} 
                                    whileTap={{ y: -20, scale: 1.5 }}
                                    onClick={() => setUserEmoji(e)} 
                                    className="text-2xl hover:scale-125 transition-transform"
                                >
                                    {e}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CATEGORÍAS */}
                <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar items-center justify-center">
                    {CATEGORIAS.map(cat => (
                        <motion.button
                            key={cat.id} whileHover={{ scale: 1.05 }}
                            onClick={() => setActiveCat(cat.id)}
                            className={`${cat.color} ${activeCat === cat.id ? 'ring-8 ring-white shadow-2xl' : 'opacity-80'} min-w-[140px] md:min-w-[200px] h-20 md:h-28 rounded-[2rem] flex flex-col items-center justify-center font-black border-4 border-white text-black flex-shrink-0 uppercase`}
                        >
                            {cat.icon} <span className="text-xs md:text-sm mt-1">{cat.label}</span>
                        </motion.button>
                    ))}
                </div>

                {/* VIDEOS */}
                <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-4 gap-6 pr-2 mt-4 custom-scrollbar">
                    {videos.map((vid) => (
                        <motion.div key={vid.id.videoId} whileHover={{ scale: 1.03 }} onClick={() => setSelectedVideo(vid)} className="cursor-pointer group">
                            <div className="aspect-video rounded-[2.5rem] overflow-hidden border-4 border-white group-hover:border-yellow-400 shadow-2xl relative bg-zinc-900">
                                <img src={vid.snippet.thumbnails.high.url} className="w-full h-full object-cover" />
                                <div className="absolute bottom-2 right-2 bg-yellow-400 text-black p-2 rounded-full shadow-lg"><Sparkles size={16}/></div>
                            </div>
                            <p className="mt-2 font-black text-[10px] md:text-xs text-center uppercase bg-black/80 p-2 rounded-xl border border-white/5 line-clamp-2 italic">{vid.snippet.title}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* 📺 REPRODUCTOR BÚNKER PROFESIONAL */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div 
                        ref={playerContainerRef}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                        className="fixed inset-0 z-[600] bg-black flex flex-col"
                    >
                        {/* HEADER DEL REPRODUCTOR */}
                        <div className="p-4 flex items-center justify-between bg-black/90 border-b border-white/10 z-[700]">
                            <button 
                                onClick={() => setSelectedVideo(null)} 
                                className="bg-red-600 text-white px-8 py-3 rounded-full font-black uppercase flex items-center gap-2 border-4 border-white shadow-xl hover:bg-red-700 transition-all"
                            >
                                <ArrowLeft size={24}/> VOLVER
                            </button>
                            
                            <div className="flex items-center gap-4 bg-white/10 px-6 py-2 rounded-full border border-white/20">
                                <Volume2 size={20} className="text-white/60" />
                                <input 
                                    type="range" min="0" max="1" step="0.1" 
                                    value={volume} 
                                    onChange={(e) => setVolume(parseFloat(e.target.value))} 
                                    className="w-24 md:w-40 accent-red-600 cursor-pointer" 
                                />
                            </div>
                        </div>
                        
                        <div className="flex-1 relative bg-black overflow-hidden">
                            {/* 🛡️ BLINDAJE ANTI-YOUTUBE (Capas invisibles) */}
                            <div className="absolute top-0 left-0 w-full h-[15%] z-30" /> 
                            <div className="absolute bottom-0 left-0 w-full h-[15%] z-30" />
                            <div className="absolute inset-0 z-20" /> 

                            <iframe 
                                width="100%" height="100%" 
                                src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}?autoplay=1&rel=0&modestbranding=1&controls=0&disablekb=1&iv_load_policy=3&vq=hd1080`}
                                frameBorder="0" allow="autoplay; encrypted-media" className="z-10"
                            />

                            {/* 🏷️ MARCA DE AGUA (Logo Superior Derecha) */}
                            <div className="absolute top-6 right-6 z-40">
                                <img src={LOGO_KIDS_HEADER} className="h-16 md:h-28 opacity-70 drop-shadow-2xl object-contain" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FabulositoKids;