import React, { useState, useEffect, useRef } from 'react';
import { Play, Volume2, Heart, BookOpen, GraduationCap, Sparkles, Lock, Unlock, X, Tv, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LOGO_KIDS_HEADER = "/src/assets/fabulosito_kids.png"; 

const YOUTUBE_API_KEYS = ["AIzaSyDxLD8PviKQwlHBs7rmRm3GoyIKk-aQpww", "AIzaSyACeTldeUs5tbn2Lwr6o_6Lc48rF1nINY0", "AIzaSyBUk0oq1zjA6BKx5HK8DEQc1TxQqreqGtk", "AIzaSyBys-0J3T5Ou_fdPGxqYC5LWDMgppwD0Y4", "AIzaSyDHdkSo4WSHjYL4nHFU9wKmXW5D9PScO4g", "AIzaSyDJqDMnZsYHyJtzahtvv1r55Z-JfgLk5TU", "AIzaSyCruj7UZTEmElS3ZUeUBmYPecbsAA667U8", "AIzaSyBfMNrgQESeymMQ9srVBHKjXB3_WeRfkXE", "AIzaSyB1e_YSB74yAelvAhapDWu11VPLz2wBkUg", "AIzaSyCsvViGGiPJxx8-FkSwQvHE2T_U8d2UO5E", "AIzaSyBRvdUqolryjMRustJUyqN_HtkjRCbHLfI", "AIzaSyCdmCZW6J49Onl-QAf3cTsNu0im84EBVZc", "AIzaSyCeref7W3di_9o6W3YnEtqgvCQyvyQ5a5Q", "AIzaSyAwtE19mD7rpv1pu5nB4R8Q0HmEX9OkgJI"];

const CATEGORIAS = [
    { id: 'mickey', label: 'MICKEY MOUSE', icon: <Star size={30}/>, color: 'bg-red-600', query: 'mickey mouse episodios completos español' },
    { id: 'warner', label: 'WARNER BROS', icon: <Tv size={30}/>, color: 'bg-sky-600', query: 'looney tunes bugs bunny correcaminos español' },
    { id: 'cine', label: 'PELÍCULAS', icon: <Play size={30}/>, color: 'bg-yellow-400', query: 'peliculas infantiles completas español' },
    { id: 'niñas', label: 'SOLO NIÑAS', icon: <Heart size={30}/>, color: 'bg-purple-500', query: 'series para niñas princesas' }
];

const FabulositoKids = () => {
    const [view, setView] = useState("HOME"); 
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [activeCat, setActiveCat] = useState('mickey');
    const [isLocked, setIsLocked] = useState(false);
    const [lockTimer, setLockTimer] = useState(null);

    const fetchVideos = async (query) => {
        let index = 0;
        let exito = false;
        while (index < YOUTUBE_API_KEYS.length && !exito) {
            try {
                const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_API_KEYS[index]}`);
                const data = await res.json();
                if (data.items) { setVideos(data.items); exito = true; }
                else { index++; }
            } catch { index++; }
        }
    };

    useEffect(() => { fetchVideos(CATEGORIAS.find(c => c.id === activeCat).query); }, [activeCat]);

    const handleLockDown = () => {
        if (!isLocked) { setIsLocked(true); return; }
        const timer = setTimeout(() => setIsLocked(false), 3000);
        setLockTimer(timer);
    };

    return (
        <div className="min-h-screen w-full bg-black relative text-white overflow-hidden">
            {/* FONDO HD */}
            <div className="absolute inset-0 pointer-events-none scale-[1.2]">
                <iframe className="w-full h-full" src="https://www.youtube.com/embed/yveCKWxSmlY?autoplay=1&mute=1&loop=1&playlist=yveCKWxSmlY&controls=0&vq=hd1080" frameBorder="0" />
            </div>

            {/* MÚSICA INTELIGENTE */}
            {!selectedVideo && (
                <div className="hidden">
                    <iframe src="https://www.youtube.com/embed/iwKS4b9aUeI?autoplay=1&loop=1&playlist=iwKS4b9aUeI" allow="autoplay" />
                </div>
            )}

            <div className="relative z-10 p-4 flex flex-col h-screen bg-black/40">
                <header className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <img src={LOGO_KIDS_HEADER} className="h-16" />
                        <button onMouseDown={handleLockDown} onMouseUp={() => clearTimeout(lockTimer)} onTouchStart={handleLockDown} onTouchEnd={() => clearTimeout(lockTimer)} className={`p-4 rounded-full ${isLocked ? 'bg-red-600 animate-pulse' : 'bg-green-500'}`}>
                            {isLocked ? <Lock size={30} /> : <Unlock size={30} />}
                        </button>
                    </div>
                </header>

                <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar">
                    {CATEGORIAS.map(cat => (
                        <button key={cat.id} onClick={() => setActiveCat(cat.id)} className={`${cat.color} ${activeCat === cat.id ? 'ring-8 ring-white' : 'opacity-90'} min-w-[200px] h-24 rounded-[2rem] flex flex-col items-center justify-center font-black italic border-4 border-white text-black flex-shrink-0 uppercase`}>
                            {cat.icon} <span>{cat.label}</span>
                        </button>
                    ))}
                    <img src="/logo_fabulosito_kids.png" className="h-32 ml-4" />
                </div>

                <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
                    {videos.map((vid) => (
                        <div key={vid.id.videoId} onClick={() => setSelectedVideo(vid)} className="cursor-pointer">
                            <div className="aspect-video rounded-[2rem] overflow-hidden border-4 border-white relative">
                                <img src={vid.snippet.thumbnails.high.url} className="w-full h-full object-cover" />
                                <div className="absolute bottom-2 right-2 bg-yellow-400 text-black p-2 rounded-full"><Sparkles size={16}/></div>
                            </div>
                            <p className="mt-2 font-black text-[10px] text-center uppercase bg-black/80 p-2 rounded-xl line-clamp-2">{vid.snippet.title}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* REPRODUCTOR BLINDADO */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] bg-black flex flex-col">
                        <div className="p-4 flex justify-between items-center bg-black border-b border-white/10">
                            {!isLocked ? (<button onClick={() => setSelectedVideo(null)} className="bg-red-600 text-white px-8 py-3 rounded-full font-black uppercase border-4 border-white">CERRAR</button>) : (<div className="text-red-500 font-black animate-pulse flex items-center gap-2 uppercase"><Lock size={20}/> Modo Seguro</div>)}
                            <h2 className="font-black text-white italic truncate max-w-md uppercase text-xs">{selectedVideo.snippet.title}</h2>
                        </div>
                        <div className="flex-1 relative">
                            {/* ESCUDO ANTI-YOUTUBE */}
                            <div className="absolute top-0 left-0 w-full h-[80px] z-30" /> 
                            <div className="absolute bottom-0 right-0 w-[140px] h-[80px] z-30" />
                            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}?autoplay=1&rel=0&modestbranding=1&controls=1&showinfo=0&disablekb=1&vq=hd1080`} frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen className="z-10" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FabulositoKids;