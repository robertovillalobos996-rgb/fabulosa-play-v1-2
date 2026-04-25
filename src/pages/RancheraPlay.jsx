import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Wine, Play, Pause, Maximize, Volume2, VolumeX, X, HeartCrack, Flame, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';

// Assets
import logoImage from '../assets/logo_fabulosa.png'; 

// 🔑 TUS 14 LLAVES MAESTRAS 
const YOUTUBE_API_KEYS = [
    "AIzaSyDxLD8PviKQwlHBs7rmRm3GoyIKk-aQpww", "AIzaSyACeTldeUs5tbn2Lwr6o_6Lc48rF1nINY0",
    "AIzaSyBUk0oq1zjA6BKx5HK8DEQc1TxQqreqGtk", "AIzaSyBys-0J3T5Ou_fdPGxqYC5LWDMgppwD0Y4",
    "AIzaSyDHdkSo4WSHjYL4nHFU9wKmXW5D9PScO4g", "AIzaSyDJqDMnZsYHyJtzahtvv1r55Z-JfgLk5TU",
    "AIzaSyCruj7UZTEmElS3ZUeUBmYPecbsAA667U8", "AIzaSyBfMNrgQESeymMQ9srVBHKjXB3_WeRfkXE",
    "AIzaSyB1e_YSB74yAelvAhapDWu11VPLz2wBkUg", "AIzaSyCsvViGGiPJxx8-FkSwQvHE2T_U8d2UO5E",
    "AIzaSyBRvdUqolryjMRustJUyqN_HtkjRCbHLfI", "AIzaSyCdmCZW6J49Onl-QAf3cTsNu0im84EBVZc",
    "AIzaSyCeref7W3di_9o6W3YnEtqgvCQyvyQ5a5Q", "AIzaSyAwtE19mD7rpv1pu5nB4R8Q0HmEX9OkgJI"
];

const VERTICAL_ADS = [
    "/publicidad_vertical/anunciete_1.png", "/publicidad_vertical/chinito_express.png", 
    "/publicidad_vertical/mexicana_1.png", "/publicidad_vertical/mexicana_2.png", 
    "/publicidad_vertical/unas_yendry.png"
];

const RancheraPlay = () => {
    const navigate = useNavigate();
    const [videos, setVideos] = useState([]);
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [searchQuery, setSearchQuery] = useState("Mix popular colombiana despecho Alzate audio -vevo -oficial");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [vAdIndex, setVAdIndex] = useState(0);

    // 🎮 ESTADOS CONTROL REMOTO
    const [activeIndex, setActiveIndex] = useState(0);
    const gridRefs = useRef([]);

    const [isPlaying, setIsPlaying] = useState(true);
    const [volume, setVolume] = useState(100);
    const iframeRef = useRef(null);
    const playerWrapperRef = useRef(null);
    const keyIndexRef = useRef(0);

    // Rotación de Anuncios cada 15s
    useEffect(() => {
        const adInterval = setInterval(() => setVAdIndex((p) => (p + 1) % VERTICAL_ADS.length), 15000);
        return () => clearInterval(adInterval);
    }, []);

    // Inicializador AdSense
    useEffect(() => {
        try { if (window.adsbygoogle) window.adsbygoogle.push({}); } 
        catch (e) { console.error("AdSense Error", e); }
    }, [vAdIndex]);

    const fetchVideosFromYouTube = async (queryBusqueda, isRelated = false) => {
        if (!isRelated) { setLoading(true); setErrorMsg(""); }
        try {
            let exito = false;
            let data = null;
            while (keyIndexRef.current < YOUTUBE_API_KEYS.length && !exito) {
                const currentKey = YOUTUBE_API_KEYS[keyIndexRef.current];
                const maxRes = isRelated ? 20 : 30;
                const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxRes}&q=${encodeURIComponent(queryBusqueda)}&type=video&videoEmbeddable=true&videoSyndicated=true&key=${currentKey}`;
                const response = await fetch(url);
                if (response.status === 403 || response.status === 429) { keyIndexRef.current++; } 
                else {
                    data = await response.json();
                    if (data.error) throw new Error(data.error.message);
                    exito = true; 
                }
            }
            if (!exito) {
                if (!isRelated) { setErrorMsg("Servidores saturados."); setVideos([]); }
                setLoading(false); return;
            }
            if (!data.items) { if (!isRelated) setVideos([]); setLoading(false); return; }
            if (isRelated) setRelatedVideos(data.items);
            else setVideos(data.items);
        } catch (error) { if (!isRelated) setErrorMsg("Error de conexión."); } finally { if (!isRelated) setLoading(false); }
    };

    const handleSelectVideo = (video) => {
        setSelectedVideo(video);
        setIsPlaying(true);
        setVolume(100);
        window.scrollTo({top: 0, behavior: 'smooth'});
        fetchVideosFromYouTube(`Mix popular colombiana despecho ${video.snippet.channelTitle} audio -vevo -oficial`, true);
    };

    const handleSearch = (e) => {
        if(e) e.preventDefault();
        if (searchQuery.trim() !== "") fetchVideosFromYouTube(searchQuery + " audio -vevo -oficial", false);
    };

    useEffect(() => { fetchVideosFromYouTube(searchQuery, false); }, []);

    // 🕹️ MOTOR CONTROL REMOTO (Perfectamente calibrado)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (document.activeElement.tagName === 'INPUT') return;
            const cols = 3; 
            const totalContent = (selectedVideo ? relatedVideos.length : videos.length);

            if (e.key === 'ArrowRight') setActiveIndex(p => Math.min(p + 1, totalContent - 1));
            if (e.key === 'ArrowLeft') setActiveIndex(p => {
                if (p === 0 || p % cols === 0) return -1;
                return Math.max(p - 1, -1);
            });
            if (e.key === 'ArrowDown') {
                if (activeIndex === -1) setActiveIndex(0);
                else setActiveIndex(p => Math.min(p + cols, totalContent - 1));
            }
            if (e.key === 'ArrowUp') {
                if (activeIndex < cols) setActiveIndex(-1);
                else setActiveIndex(p => p - cols);
            }
            if (e.key === 'Enter') {
                if (activeIndex === -1) navigate("/");
                else handleSelectVideo(selectedVideo ? relatedVideos[activeIndex] : videos[activeIndex]);
            }
            if (e.key === 'Escape' || e.key === 'Backspace') {
                if (selectedVideo) setSelectedVideo(null);
                else navigate("/");
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeIndex, videos, relatedVideos, selectedVideo, navigate]);

    useEffect(() => {
        if (activeIndex >= 0 && gridRefs.current[activeIndex]) {
            gridRefs.current[activeIndex].scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [activeIndex]);

    const sendCommand = (func, args = "") => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: func, args: [args] }), '*');
        }
    };

    const togglePlay = () => {
        if (isPlaying) sendCommand('pauseVideo'); else sendCommand('playVideo');
        setIsPlaying(!isPlaying);
    };

    const handleVolumeChange = (e) => {
        const newVol = parseInt(e.target.value);
        setVolume(newVol);
        sendCommand('setVolume', newVol);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) playerWrapperRef.current.requestFullscreen();
        else document.exitFullscreen();
    };

    return (
        <div className="min-h-screen w-full bg-[#020202] text-white flex flex-col font-sans selection:bg-amber-600">
            
            <header className="sticky top-0 z-[100] bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between gap-6 shadow-2xl">
                <div className="flex items-center gap-4">
                    {/* BOTÓN VOLVER NEÓN (ÚNICO Y FUNCIONAL) */}
                    <div 
                        onClick={() => navigate("/")}
                        className={`flex items-center gap-2 px-5 py-2 rounded-full border-2 transition-all duration-300 cursor-pointer ${activeIndex === -1 ? 'bg-amber-600 border-amber-300 scale-105 shadow-[0_0_20px_rgba(217,119,6,0.6)]' : 'bg-white/5 border-white/10 opacity-70'}`}
                    >
                        <ArrowLeft size={24} className={activeIndex === -1 ? 'text-white' : 'text-amber-500'} />
                        <span className={`font-black uppercase tracking-widest text-xs ${activeIndex === -1 ? 'text-white' : 'text-amber-500'}`}>Menú</span>
                    </div>
                    <img src={logoImage} alt="Logo" className="h-10 hidden sm:block opacity-80" />
                </div>
                <form onSubmit={handleSearch} className="flex-1 max-w-xl flex relative">
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-2.5 text-sm outline-none focus:border-amber-600 transition-all italic" placeholder="Busca tu artista..." />
                    <button type="submit" className="absolute right-2 top-1 bg-transparent text-white/30 hover:text-amber-500 p-2"><Search size={22} /></button>
                </form>
                <div className="hidden lg:flex items-center gap-2 text-amber-600 uppercase text-[10px] font-black tracking-[0.5em] italic"><Wine size={16} /> LA CANTINA</div>
            </header>

            <div className="flex-1 flex flex-col xl:flex-row gap-8 p-6 z-40 relative mt-2">
                
                {/* 🎶 LISTA DE MÚSICA (Scrollable) */}
                <div className="flex-1">
                    {selectedVideo && (
                        <div ref={playerWrapperRef} className="relative group w-full aspect-video rounded-[2rem] overflow-hidden bg-black shadow-2xl border border-white/10 animate-fade-in mb-14">
                            <div className="absolute inset-0 z-40 bg-transparent cursor-default"></div>
                            <button onClick={() => setSelectedVideo(null)} className="absolute top-4 right-4 z-[60] text-white/50 hover:text-red-500 p-2 bg-black/50 rounded-full"><X size={30} /></button>
                            <div className="absolute bottom-4 left-4 right-4 z-[50] flex items-center justify-between px-6 py-3 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={togglePlay} className="text-white hover:text-amber-500">{isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}</button>
                                <button onClick={toggleFullscreen} className="text-white/70 hover:text-amber-500"><Maximize size={24} /></button>
                            </div>
                            <iframe ref={iframeRef} className="w-full h-full pointer-events-none scale-[1.05]" src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}?autoplay=1&controls=0&disablekb=1&modestbranding=1&rel=0&enablejsapi=1`} frameBorder="0" />
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                        {(selectedVideo ? relatedVideos : videos).map((item, idx) => (
                            <div 
                                key={idx} ref={el => gridRefs.current[idx] = el}
                                onClick={() => handleSelectVideo(item)} 
                                className={`group cursor-pointer p-2 rounded-3xl transition-all ${activeIndex === idx ? 'bg-amber-600/20 ring-4 ring-amber-600 shadow-[0_0_30px_rgba(217,119,6,0.2)]' : ''}`}
                            >
                                <div className="relative aspect-video rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
                                    <img src={item.snippet.thumbnails.high.url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
                                </div>
                                <h3 className="mt-4 text-[13px] font-black text-stone-300 uppercase italic line-clamp-2 group-hover:text-amber-500">{item.snippet.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 📢 PUBLICIDAD FIJA (Sticky top-24) */}
                <div className="w-full xl:w-[420px]">
                    <div className="sticky top-24 flex flex-col gap-8 self-start">
                        <div className="h-[650px] bg-white/5 backdrop-blur-3xl rounded-[3.5rem] border border-white/10 overflow-hidden relative shadow-2xl">
                            <img src={VERTICAL_ADS[vAdIndex]} className="w-full h-full object-contain transition-all duration-1000" alt="Ad" />
                        </div>
                        <div className="w-full bg-white/5 rounded-[2.5rem] border border-white/10 p-4 min-h-[300px] flex flex-col items-center justify-center shadow-xl">
                            <ins className="adsbygoogle" style={{ display: 'block', width: '100%', height: '100%' }} data-ad-client="ca-pub-1260009754001434" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins>
                        </div>
                    </div>
                </div>

            </div>

            <footer className="bg-black py-8 border-t border-white/5 z-50 overflow-hidden">
                <div className="whitespace-nowrap flex gap-16 text-white/5 font-bold uppercase text-[9px] tracking-[0.6em] animate-marquee">
                    <span><Flame size={12}/> FABULOSA PLAY LA CANTINA</span>
                    <span><HeartCrack size={12}/> POPULAR Y DESPECHO</span>
                </div>
            </footer>

            <style>{`
                .animate-marquee { animation: marquee 60s linear infinite; }
                @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
                .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
};

export default RancheraPlay;