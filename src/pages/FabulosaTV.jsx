import React, { useState, useEffect, useRef } from 'react';
import { Play, Volume2, VolumeX, Heart, BookOpen, GraduationCap, Sparkles, Lock, Unlock, X, Tv, Star, Music, Maximize, Minimize, ArrowLeft, Gamepad2, Rocket, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ✅ ASSETS
const LOGO_KIDS_HEADER = "/logo_fabulosito_kids.png"; 

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

// 💉 CATEGORÍAS (Prioridad Máxima)
const CATEGORIAS = [
    { id: 'mickey', label: 'MICKEY MOUSE', icon: <Star size={30}/>, color: 'bg-red-600', query: 'mickey mouse episodios completos español' },
    { id: 'warner', label: 'WARNER BROS', icon: <Tv size={30}/>, color: 'bg-sky-600', query: 'looney tunes tom y jerry scooby doo español completo' },
    { id: 'escuelita', label: 'ESCUELITA', icon: <GraduationCap size={30}/>, color: 'bg-green-600', query: 'aprender a leer escribir vocales pintar para niños completo' },
    { id: 'musical', label: 'MUSICAL', icon: <Music size={30}/>, color: 'bg-indigo-600', query: 'canciones infantiles famosas musica para niños completa' },
    { id: 'cine', label: 'PELÍCULAS', icon: <Play size={30}/>, color: 'bg-yellow-400', query: 'peliculas infantiles completas español latino hd 1080p' },
    { id: 'niñas', label: 'SOLO NIÑAS', icon: <Heart size={30}/>, color: 'bg-purple-500', query: 'series para niñas princesas barbie lulu99 episodios completos español' },
    { id: 'juegos_videos', label: 'DIVER-VIDEOS', icon: <Sparkles size={30}/>, color: 'bg-orange-500', query: 'juegos infantiles educativos para bebes interactivos' },
    { id: 'juegos_arcade', label: 'JUEGOS HD', icon: <Gamepad2 size={30}/>, color: 'bg-pink-600', query: null }
];

// 🎮 JUEGOS PREMIUM HD (Sin publicidad y táctiles)
const LISTA_JUEGOS = [
  { id: 'subway', title: 'Subway Surfers', url: 'https://gamesnacks.com/embed/games/subwaysurfers', icon: '🏃', color: 'bg-yellow-500', thumb: 'https://static.gamesnacks.com/img/games/subwaysurfers/icon_512.png' },
  { id: 'nom-run', title: 'Om Nom Run', url: 'https://gamesnacks.com/embed/games/omnomrun', icon: '🦖', color: 'bg-green-500', thumb: 'https://static.gamesnacks.com/img/games/omnomrun/icon_512.png' },
  { id: 'cut-rope', title: 'Cut the Rope', url: 'https://gamesnacks.com/embed/games/cuttherope', icon: '🍬', color: 'bg-emerald-600', thumb: 'https://static.gamesnacks.com/img/games/cuttherope/icon_512.png' },
  { id: 'fruit', title: 'Fruit Slash', url: 'https://gamesnacks.com/embed/games/fruitslasher', icon: '🍉', color: 'bg-red-500', thumb: 'https://static.gamesnacks.com/img/games/fruitslasher/icon_512.png' },
  { id: 'blocks', title: 'Color Blocks', url: 'https://gamesnacks.com/embed/games/elementblocks', icon: '💎', color: 'bg-blue-500', thumb: 'https://static.gamesnacks.com/img/games/elementblocks/icon_512.png' },
  { id: 'jump', title: 'Tiger Jump', url: 'https://gamesnacks.com/embed/games/tigerrun', icon: '🐯', color: 'bg-orange-600', thumb: 'https://static.gamesnacks.com/img/games/tigerrun/icon_512.png' }
];

const EMOJIS = ["🐶", "🦁", "🦄", "🐼", "🦊", "🐯", "🐧", "⭐"];

const FabulositoKids = () => {
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedGame, setSelectedGame] = useState(null);
    const [activeCat, setActiveCat] = useState('mickey');
    const [userEmoji, setUserEmoji] = useState("🐶");
    const [isLocked, setIsLocked] = useState(false);
    const [volume, setVolume] = useState(100);
    const [showControls, setShowControls] = useState(true);
    const [isFullScreen, setIsFullScreen] = useState(false);
    
    const keyIndex = useRef(0);
    const controlsTimer = useRef(null);
    const playerContainerRef = useRef(null);

    const resetTimer = () => {
        setShowControls(true);
        if (controlsTimer.current) clearTimeout(controlsTimer.current);
        controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
    };

    const fetchVideos = async (query) => {
        if (!query) return;
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

    useEffect(() => { 
        if (activeCat !== 'juegos_arcade') fetchVideos(CATEGORIAS.find(c => c.id === activeCat).query); 
    }, [activeCat]);

    useEffect(() => {
        if (selectedVideo) {
            const iframe = document.getElementById('kids-player');
            if (iframe) {
                iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [volume] }), '*');
            }
        }
    }, [volume, selectedVideo]);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            playerContainerRef.current.requestFullscreen();
            setIsFullScreen(true);
        } else {
            document.exitFullscreen();
            setIsFullScreen(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-black font-sans overflow-hidden text-white relative" onMouseMove={resetTimer}>
            
            {/* FONDO ANIMADO */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <iframe className="w-full h-full object-cover scale-[1.2] md:scale-[1.5]" src="https://www.youtube.com/embed/yveCKWxSmlY?autoplay=1&mute=1&loop=1&playlist=yveCKWxSmlY&controls=0&vq=hd1080" frameBorder="0" />
            </div>

            {/* MÚSICA DE FONDO */}
            {!selectedVideo && !selectedGame && (
                <div className="hidden">
                    <iframe src="https://www.youtube.com/embed/iwKS4b9aUeI?autoplay=1&loop=1&playlist=iwKS4b9aUeI" allow="autoplay" />
                </div>
            )}

            <motion.div className="relative z-10 p-2 sm:p-4 md:p-8 flex flex-col h-screen bg-black/40">
                
                {/* LOGO GIGANTE */}
                <div className="flex flex-col items-center mb-4 sm:mb-6">
                    <motion.img 
                        src={LOGO_KIDS_HEADER} 
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="h-28 sm:h-44 md:h-56 lg:h-64 drop-shadow-[0_0_50px_rgba(255,255,255,0.8)] z-50 object-contain max-w-[90vw]"
                    />
                </div>

                {/* CONTROLES SUPERIORES */}
                <div className="flex justify-between items-center mb-4 sm:mb-6 px-2 sm:px-10">
                    <button onClick={() => setIsLocked(!isLocked)} className={`p-3 sm:p-4 rounded-full transition-all ${isLocked ? 'bg-red-600 animate-pulse' : 'bg-green-500 shadow-xl'}`}>
                        {isLocked ? <Lock size={20} className="sm:w-[30px] sm:h-[30px]" /> : <Unlock size={20} className="sm:w-[30px] sm:h-[30px]" />}
                    </button>

                    <div className="flex gap-2 sm:gap-4 items-center bg-black/60 p-1.5 sm:p-2 rounded-full backdrop-blur-xl border border-white/20">
                        <motion.span whileTap={{ scale: 2 }} className="text-2xl sm:text-4xl ml-2 sm:ml-4 cursor-pointer">{userEmoji}</motion.span>
                        <div className="flex gap-1.5 sm:gap-3 pr-2 sm:pr-4">
                            {EMOJIS.map(e => (
                                <motion.button key={e} whileTap={{ y: -10 }} onClick={() => setUserEmoji(e)} className="text-xl sm:text-2xl hover:scale-125 transition-transform">{e}</motion.button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CATEGORÍAS (Prioridad Máxima z-[100] y Fluidez) */}
                <div className="relative z-[100] flex gap-2 sm:gap-4 overflow-x-auto pb-4 sm:pb-6 no-scrollbar items-center justify-start md:justify-center scroll-smooth px-2 touch-pan-x">
                    {CATEGORIAS.map(cat => (
                        <motion.button
                            key={cat.id} whileHover={{ scale: 1.05 }}
                            onClick={() => setActiveCat(cat.id)}
                            className={`${cat.color} ${activeCat === cat.id ? 'ring-4 sm:ring-8 ring-white shadow-2xl scale-105' : 'opacity-80'} min-w-[120px] sm:min-w-[160px] md:min-w-[200px] h-16 sm:h-24 md:h-28 rounded-[1.5rem] sm:rounded-[2rem] flex flex-col items-center justify-center font-black border-2 sm:border-4 border-white text-black flex-shrink-0 uppercase transition-all duration-300`}
                        >
                            <div className="scale-75 sm:scale-100">{cat.icon}</div>
                            <span className="text-[10px] sm:text-xs md:text-sm mt-0.5 sm:mt-1 px-1 text-center">{cat.label}</span>
                        </motion.button>
                    ))}
                </div>

                {/* GRID DE CONTENIDO */}
                <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 pr-2 mt-2 sm:mt-4 custom-scrollbar">
                    {activeCat === 'juegos_arcade' ? (
                        LISTA_JUEGOS.map((juego) => (
                            <motion.div key={juego.id} whileHover={{ scale: 1.05 }} onClick={() => setSelectedGame(juego)} className="cursor-pointer group">
                                <div className={`aspect-square ${juego.color} rounded-[2rem] sm:rounded-[3rem] border-4 border-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-center`}>
                                    <img src={juego.thumb} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" />
                                    <span className="text-5xl sm:text-7xl z-10 drop-shadow-lg group-hover:scale-110 transition-transform">{juego.icon}</span>
                                    <div className="absolute bottom-0 w-full bg-black/60 py-2 text-center z-10 backdrop-blur-sm">
                                        <h3 className="font-black uppercase text-[10px] sm:text-sm">{juego.title}</h3>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        videos.map((vid) => (
                            <motion.div key={vid.id.videoId} whileHover={{ scale: 1.03 }} onClick={() => setSelectedVideo(vid)} className="cursor-pointer group">
                                <div className="aspect-video rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden border-2 sm:border-4 border-white group-hover:border-yellow-400 shadow-2xl relative bg-zinc-900">
                                    <img src={vid.snippet.thumbnails.high.url} className="w-full h-full object-cover" />
                                    <div className="absolute bottom-1.5 right-1.5 bg-yellow-400 text-black p-1 rounded-full shadow-lg"><Sparkles size={16}/></div>
                                </div>
                                <p className="mt-1.5 font-black text-[9px] sm:text-xs text-center uppercase bg-black/80 p-1.5 rounded-xl border border-white/5 line-clamp-2 italic">{vid.snippet.title}</p>
                            </motion.div>
                        ))
                    )}
                </div>
            </motion.div>

            {/* REPRODUCTOR ARCADE / VIDEO */}
            <AnimatePresence>
                {(selectedVideo || selectedGame) && (
                    <motion.div 
                        ref={playerContainerRef}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                        className="fixed inset-0 z-[600] bg-black flex flex-col"
                        onMouseMove={resetTimer}
                    >
                        <div className={`absolute top-0 left-0 w-full p-3 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 z-[700] transition-opacity duration-700 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                            {!isLocked && (
                                <button onClick={() => { setSelectedVideo(null); setSelectedGame(null); }} className="bg-red-600 text-white px-8 py-2.5 rounded-full font-black uppercase flex items-center justify-center gap-2 border-2 sm:border-4 border-white shadow-xl">
                                    <ArrowLeft size={20}/> SALIR
                                </button>
                            )}
                            
                            <div className="flex items-center gap-4 sm:gap-6">
                                {selectedVideo && (
                                    <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20">
                                        <Volume2 size={20} className="text-white" />
                                        <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(e.target.value)} className="w-24 sm:w-48 accent-red-600 cursor-pointer" />
                                    </div>
                                )}
                                <button onClick={toggleFullScreen} className="bg-black/60 backdrop-blur-xl p-3 rounded-full border border-white/20 text-white hover:bg-red-600 transition-all">
                                    {isFullScreen ? <Minimize size={24} /> : <Maximize size={24} />}
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex-1 relative bg-black overflow-hidden">
                            <iframe 
                                id="kids-player"
                                width="100%" height="100%" 
                                src={selectedVideo ? `https://www.youtube.com/embed/${selectedVideo.id.videoId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=0&disablekb=1&iv_load_policy=3&vq=hd1080` : selectedGame.url}
                                frameBorder="0" allow="autoplay; encrypted-media" className="z-10"
                            />
                            <div className="absolute top-4 right-4 sm:top-10 sm:right-10 z-50 pointer-events-none">
                                <img src={LOGO_KIDS_HEADER} className="h-12 sm:h-20 md:h-36 opacity-80 drop-shadow-2xl object-contain" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FabulositoKids;