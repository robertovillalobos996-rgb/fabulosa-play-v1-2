import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Volume2, VolumeX, Maximize, Star, Heart, BookOpen, GraduationCap, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPlayer from 'react-player/youtube';

// 📂 ACTIVOS LOCALES
import LOGO_KIDS from "../assets/fabulosito_kids.png";
const VIDEO_INTRO = "/media/Video_de_Entrada_para_Canal_Infantil.mp4";

// 🔑 LAS 14 LLAVES MAESTRAS (ROTACIÓN AUTOMÁTICA)
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
    { id: 'cine', label: 'PELÍCULAS', icon: <Play size={30}/>, color: 'bg-yellow-400', query: 'peliculas infantiles completas español' },
    { id: 'cuentos', label: 'CUENTOS', icon: <BookOpen size={30}/>, color: 'bg-pink-500', query: 'cuentos infantiles animados' },
    { id: 'aprender', label: 'APRENDER', icon: <GraduationCap size={30}/>, color: 'bg-cyan-400', query: 'aprender a leer y contar niños' },
    { id: 'niñas', label: 'SOLO NIÑAS', icon: <Heart size={30}/>, color: 'bg-purple-500', query: 'series para niñas barbie princesas' }
];

const EMOJIS = ["🐶", "🦁", "🦄", "🐼", "🦊", "🦖", "🐧", "⭐"];

const FabulositoKids = () => {
    const [view, setView] = useState("INTRO"); 
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [activeCat, setActiveCat] = useState('cine');
    const [bgMusicPlaying, setBgMusicPlaying] = useState(false);
    const [userEmoji, setUserEmoji] = useState("🐶");
    
    const keyIndex = useRef(0);
    const hoverSound = new Audio("https://www.myinstants.com/media/sounds/pop-94319.mp3");

    const fetchVideos = async (query) => {
        let success = false;
        while (keyIndex.current < YOUTUBE_API_KEYS.length && !success) {
            try {
                const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_API_KEYS[keyIndex.current]}`);
                if (res.status === 403) { keyIndex.current++; continue; }
                const data = await res.json();
                setVideos(data.items || []);
                success = true;
            } catch (e) { keyIndex.current++; }
        }
    };

    useEffect(() => { if (view === "HOME") fetchVideos(CATEGORIAS.find(c => c.id === activeCat).query); }, [activeCat, view]);

    const playSound = () => { hoverSound.volume = 0.2; hoverSound.play(); };

    return (
        <div className="min-h-screen w-full bg-[#0014CC] font-sans overflow-hidden text-white">
            <div className="hidden">
                <ReactPlayer 
                    url="https://www.youtube.com/watch?v=iwKS4b9aUeI"
                    playing={bgMusicPlaying && view === "HOME"}
                    loop={true}
                    volume={0.3}
                />
            </div>

            <AnimatePresence mode="wait">
                {view === "INTRO" && (
                    <motion.div key="intro" exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black">
                        <video src={VIDEO_INTRO} autoPlay playsInline onEnded={() => { setView("HOME"); setBgMusicPlaying(true); }} className="w-full h-full object-contain" />
                        <button onClick={() => { setView("HOME"); setBgMusicPlaying(true); }} className="absolute bottom-10 right-10 bg-white/20 px-8 py-3 rounded-full font-black backdrop-blur-md">OMITIR ➔</button>
                    </motion.div>
                )}

                {view === "HOME" && (
                    <motion.div key="home" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-8 flex flex-col h-screen">
                        <div className="flex justify-between items-center mb-6">
                            <motion.img whileHover={{ scale: 1.1, rotate: 5 }} src={LOGO_KIDS} className="h-16 md:h-24" />
                            <div className="flex gap-4 items-center bg-white/10 p-2 rounded-full backdrop-blur-xl border border-white/20">
                                <span className="text-2xl ml-4">{userEmoji}</span>
                                <div className="flex gap-2 pr-4">
                                    {EMOJIS.map(e => (
                                        <button key={e} onClick={() => { setUserEmoji(e); playSound(); }} className="hover:scale-150 transition-transform">{e}</button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 md:gap-8 overflow-x-auto pb-6 no-scrollbar">
                            {CATEGORIAS.map(cat => (
                                <motion.button
                                    key={cat.id}
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => setActiveCat(cat.id)}
                                    className={`${cat.color} ${activeCat === cat.id ? 'ring-8 ring-white' : 'opacity-80'} min-w-[150px] md:min-w-[250px] h-20 md:h-32 rounded-[2rem] flex flex-col items-center justify-center font-black italic border-4 border-white transition-all`}
                                >
                                    {cat.icon}
                                    <span className="text-sm md:text-xl">{cat.label}</span>
                                </motion.button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-4 gap-6 pr-2">
                            {videos.map((vid, index) => (
                                <motion.div
                                    key={vid.id.videoId}
                                    whileHover={{ y: -10 }}
                                    onClick={() => { setSelectedVideo(vid); setView("WATCH"); setBgMusicPlaying(false); }}
                                    className="cursor-pointer group"
                                >
                                    <div className="aspect-video rounded-[2rem] overflow-hidden border-4 border-white group-hover:border-yellow-400 transition-colors shadow-xl relative">
                                        <img src={vid.snippet.thumbnails.high.url} className="w-full h-full object-cover" />
                                        <div className="absolute bottom-2 right-2 bg-yellow-400 text-black p-2 rounded-full"><Sparkles size={16}/></div>
                                    </div>
                                    <p className="mt-3 font-bold text-xs md:text-sm line-clamp-2 text-center uppercase">{vid.snippet.title}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {view === "WATCH" && selectedVideo && (
                    <motion.div key="watch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 bg-black flex flex-col">
                        <div className="p-4 flex items-center justify-between bg-black">
                            <button onClick={() => { setView("HOME"); setBgMusicPlaying(true); }} className="bg-yellow-400 text-black px-8 py-3 rounded-full font-black uppercase italic border-4 border-white">🏠 VOLVER</button>
                            <h2 className="font-black text-white italic truncate max-w-md uppercase">{selectedVideo.snippet.title}</h2>
                        </div>
                        <div className="flex-1">
                            <ReactPlayer url={`https://www.youtube.com/watch?v=${selectedVideo.id.videoId}`} width="100%" height="100%" playing={true} controls={true} onEnded={() => { setView("HOME"); setBgMusicPlaying(true); }} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FabulositoKids;