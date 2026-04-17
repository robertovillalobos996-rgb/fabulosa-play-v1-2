import React, { useState, useEffect, useRef } from 'react';
import { Play, Volume2, Heart, BookOpen, GraduationCap, Sparkles, Lock, Unlock, X, Tv, Star, Music, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ✅ ACTIVOS (Mantenemos rutas y logo)
const LOGO_KIDS_HEADER = "/fabulosito_kids.png"; 

// 🔑 LAS 14 LLAVES MAESTRAS CON ROTACIÓN AUTOMÁTICA
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

const EMOJIS = ["🐶", "🦁", "🦄", "🐼", "🦊", "Rex", "🐧", "⭐"];

const FabulositoKids = () => {
    const [view, setView] = useState("HOME"); 
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [activeCat, setActiveCat] = useState('mickey');
    const [userEmoji, setUserEmoji] = useState("🐶");
    const [isLocked, setIsLocked] = useState(false);
    const [lockTimer, setLockTimer] = useState(null);

    const keyIndex = useRef(0);
    const hoverSound = new Audio("https://www.myinstants.com/media/sounds/pop-94319.mp3");

    const fetchVideos = async (query) => {
        let success = false;
        while (keyIndex.current < YOUTUBE_API_KEYS.length && !success) {
            try {
                // Forzamos videoDefinition=high para 1080p y videoDuration=long para películas completas
                const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(query)}&type=video&videoDefinition=high&videoDuration=long&key=${YOUTUBE_API_KEYS[keyIndex.current]}`);
                if (res.status === 403 || res.status === 429) { 
                    keyIndex.current++; 
                    continue; 
                }
                const data = await res.json();
                setVideos(data.items || []);
                success = true;
            } catch (e) { keyIndex.current++; }
        }
    };

    useEffect(() => { if (view === "HOME") fetchVideos(CATEGORIAS.find(c => c.id === activeCat).query); }, [activeCat, view]);

    const playSound = () => { hoverSound.volume = 0.2; hoverSound.play(); };

    const handleLockDown = () => {
        if (!isLocked) { setIsLocked(true); return; }
        const timer = setTimeout(() => setIsLocked(false), 3000);
        setLockTimer(timer);
    };

    return (
        <div className="min-h-screen w-full bg-black font-sans overflow-hidden text-white relative">
            
            {/* 📺 VIDEO DE FONDO Y MÚSICA (Mantenidos) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <iframe 
                    className="w-[100vw] h-[100vh] absolute top-0 left-0 scale-[1.5]"
                    src="https://www.youtube.com/embed/yveCKWxSmlY?autoplay=1&mute=1&loop=1&playlist=yveCKWxSmlY&controls=0&showinfo=0&rel=0&iv_load_policy=3&vq=hd1080" 
                    allow="autoplay" frameBorder="0"
                />
            </div>

            {!selectedVideo && (
                <div className="hidden">
                    <iframe src="https://www.youtube.com/embed/iwKS4b9aUeI?autoplay=1&loop=1&playlist=iwKS4b9aUeI" allow="autoplay" />
                </div>
            )}

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 p-4 md:p-8 flex flex-col h-screen bg-black/40">
                
                {/* HEADER CON LOGO MÁS GRANDE Y MOVIMIENTO */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-6">
                        <motion.img 
                            src={LOGO_KIDS_HEADER} 
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="h-24 md:h-36 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]" 
                        />
                        <button 
                            onMouseDown={handleLockDown} onMouseUp={() => clearTimeout(lockTimer)}
                            onTouchStart={handleLockDown} onTouchEnd={() => clearTimeout(lockTimer)}
                            className={`p-4 rounded-full transition-all ${isLocked ? 'bg-red-600 animate-pulse' : 'bg-green-500 shadow-xl'}`}
                        >
                            {isLocked ? <Lock size={30} /> : <Unlock size={30} />}
                        </button>
                    </div>

                    <div className="flex gap-4 items-center bg-black/60 p-2 rounded-full backdrop-blur-xl border border-white/20">
                        <span className="text-2xl ml-4">{userEmoji}</span>
                        <div className="flex gap-2 pr-4">
                            {EMOJIS.map(e => (
                                <button key={e} onClick={() => { setUserEmoji(e); playSound(); }} className="hover:scale-150 transition-transform">{e}</button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CATEGORÍAS */}
                <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar items-center">
                    {CATEGORIAS.map(cat => (
                        <motion.button
                            key={cat.id} whileHover={{ scale: 1.1 }}
                            onClick={() => { setActiveCat(cat.id); playSound(); }}
                            className={`${cat.color} ${activeCat === cat.id ? 'ring-8 ring-white' : 'opacity-90'} min-w-[150px] md:min-w-[250px] h-20 md:h-32 rounded-[2rem] flex flex-col items-center justify-center font-black italic border-4 border-white text-black shadow-2xl flex-shrink-0`}
                        >
                            {cat.icon} <span className="text-sm md:text-xl">{cat.label}</span>
                        </motion.button>
                    ))}
                </div>

                {/* VIDEOS */}
                <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-4 gap-6 pr-2 mt-4 custom-scrollbar">
                    {videos.map((vid) => (
                        <motion.div key={vid.id.videoId} whileHover={{ scale: 1.05 }} onClick={() => { setSelectedVideo(vid); playSound(); }} className="cursor-pointer group">
                            <div className="aspect-video rounded-[2rem] overflow-hidden border-4 border-white group-hover:border-yellow-400 shadow-2xl relative bg-zinc-900">
                                <img src={vid.snippet.thumbnails.high.url} className="w-full h-full object-cover" />
                                <div className="absolute bottom-2 right-2 bg-yellow-400 text-black p-2 rounded-full shadow-lg"><Sparkles size={16}/></div>
                            </div>
                            <p className="mt-2 font-black text-[10px] md:text-xs text-center uppercase bg-black/80 p-2 rounded-xl border border-white/5 line-clamp-2 italic">{vid.snippet.title}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* 📺 REPRODUCTOR BÚNKER (BLINDAJE TOTAL ANTI-YOUTUBE) */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] bg-black flex flex-col">
                        <div className="p-4 flex items-center justify-between bg-black border-b border-white/10">
                            {!isLocked && (
                                <button onClick={() => setSelectedVideo(null)} className="bg-red-600 text-white px-8 py-3 rounded-full font-black uppercase flex items-center gap-2 border-4 border-white shadow-xl hover:scale-105 transition-transform">
                                    <X size={24}/> CERRAR PELÍCULA
                                </button>
                            )}
                            {isLocked && <div className="flex items-center gap-2 text-yellow-400 font-black animate-pulse bg-yellow-400/10 px-4 py-2 rounded-full"><Lock size={20}/> SEGURO ACTIVO</div>}
                            <h2 className="font-black text-white italic truncate max-w-md uppercase text-xs">{selectedVideo.snippet.title}</h2>
                        </div>
                        
                        <div className="flex-1 relative bg-black">
                            {/* 🛡️ EL ESCUDO DE CRISTAL: Bloquea el título y el logo de YouTube */}
                            <div className="absolute top-0 left-0 w-full h-[80px] z-30 cursor-default" /> 
                            <div className="absolute bottom-0 right-0 w-[140px] h-[80px] z-30 cursor-default" />
                            <div className="absolute inset-0 z-20" /> {/* Capa central para blindar todo el reproductor */}

                            <iframe 
                                width="100%" height="100%" 
                                src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}?autoplay=1&rel=0&modestbranding=1&controls=0&disablekb=1&iv_load_policy=3&vq=hd1080`}
                                frameBorder="0" 
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                                className="z-10"
                            ></iframe>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FabulositoKids;