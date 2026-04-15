import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
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
    const [videos, setVideos] = useState([]);
    const [relatedVideos, setRelatedVideos] = useState([]);
    
    // 🧠 EL SECRETO COLOMBIANO: Apuntamos a Alzate, Despecho y Popular Colombiana. Cero bloqueos.
    const [searchQuery, setSearchQuery] = useState("Mix popular colombiana despecho Alzate audio -vevo -oficial");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [vAdIndex, setVAdIndex] = useState(0);

    // 🎛️ ESTADOS DEL REPRODUCTOR PROPIO
    const [isPlaying, setIsPlaying] = useState(true);
    const [volume, setVolume] = useState(100);
    const iframeRef = useRef(null);
    const playerWrapperRef = useRef(null);

    // 🔄 LA REFERENCIA DE LA LLAVE 
    const keyIndexRef = useRef(0);

    // Rotación de Anuncios
    useEffect(() => {
        const adInterval = setInterval(() => setVAdIndex((p) => (p + 1) % VERTICAL_ADS.length), 15000);
        return () => clearInterval(adInterval);
    }, []);

    // 💰 Inicializador AdSense
    useEffect(() => {
        try { if (window.adsbygoogle) window.adsbygoogle.push({}); } 
        catch (e) { console.error("AdSense Error", e); }
    }, [vAdIndex]);

    // 🧠 FUNCIÓN MAESTRA DE BÚSQUEDA 
    const fetchVideosFromYouTube = async (queryBusqueda, isRelated = false) => {
        if (!isRelated) {
            setLoading(true);
            setErrorMsg("");
        }
        
        try {
            let exito = false;
            let data = null;

            while (keyIndexRef.current < YOUTUBE_API_KEYS.length && !exito) {
                const currentKey = YOUTUBE_API_KEYS[keyIndexRef.current];
                const maxRes = isRelated ? 20 : 30;
                
                const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxRes}&q=${encodeURIComponent(queryBusqueda)}&type=video&videoEmbeddable=true&videoSyndicated=true&key=${currentKey}`;
                
                const response = await fetch(url);

                if (response.status === 403 || response.status === 429) {
                    keyIndexRef.current++; 
                } else {
                    data = await response.json();
                    if (data.error) throw new Error(data.error.message);
                    exito = true; 
                }
            }

            if (!exito) {
                if (!isRelated) {
                    setErrorMsg("Los servidores de música están saturados. Intenta de nuevo.");
                    setVideos([]);
                }
                setLoading(false);
                return;
            }

            if (!data.items) { 
                if (!isRelated) setVideos([]); 
                setLoading(false); 
                return; 
            }

            if (isRelated) {
                setRelatedVideos(data.items);
            } else {
                setVideos(data.items);
            }

        } catch (error) {
            console.error("Error API YouTube:", error);
            if (!isRelated) setErrorMsg("Error al conectar. Verifica tu internet.");
        } finally {
            if (!isRelated) setLoading(false);
        }
    };

    const handleSelectVideo = (video) => {
        setSelectedVideo(video);
        setIsPlaying(true);
        setVolume(100);
        window.scrollTo({top: 0, behavior: 'smooth'});
        // Busca videos relacionados asegurando que sean del mismo género colombiano
        fetchVideosFromYouTube(`Mix popular colombiana despecho ${video.snippet.channelTitle} audio -vevo -oficial`, true);
    };

    // Búsqueda del form
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim() !== "") {
            // Le inyectamos los filtros anti-bloqueo para que cualquier búsqueda salga buena
            fetchVideosFromYouTube(searchQuery + " audio -vevo -oficial", false);
        }
    };

    // Carga inicial
    useEffect(() => { 
        fetchVideosFromYouTube(searchQuery, false); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 🎮 CONTROLES PERSONALIZADOS (El Reproductor Blindado)
    const sendCommand = (func, args = "") => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: func, args: [args] }), '*');
        }
    };

    const togglePlay = () => {
        if (isPlaying) sendCommand('pauseVideo');
        else sendCommand('playVideo');
        setIsPlaying(!isPlaying);
    };

    const handleVolumeChange = (e) => {
        const newVol = parseInt(e.target.value);
        setVolume(newVol);
        sendCommand('setVolume', newVol);
        if (newVol === 0) sendCommand('mute');
        else sendCommand('unMute');
    };

    const toggleMute = () => {
        if (volume > 0) {
            sendCommand('mute');
            setVolume(0);
        } else {
            sendCommand('unMute');
            sendCommand('setVolume', 100);
            setVolume(100);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            playerWrapperRef.current.requestFullscreen().catch(err => console.error(err));
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#020202] text-white flex flex-col font-sans selection:bg-amber-600">
            
            <header className="sticky top-0 z-[100] bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between gap-6 shadow-2xl">
                <div className="flex items-center gap-4">
                    <Link to="/" className="text-white/40 hover:text-amber-500 transition-all p-2 bg-transparent"><ArrowLeft size={35} strokeWidth={1.2} /></Link>
                    <img src={logoImage} alt="Logo" className="h-10 hidden sm:block opacity-80" />
                </div>
                <form onSubmit={handleSearch} className="flex-1 max-w-xl flex relative">
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-2.5 text-sm outline-none focus:border-amber-600 transition-all italic" placeholder="Busca tu artista (Ej. Alzate, Yeison Jimenez)..." />
                    <button type="submit" className="absolute right-2 top-1 bg-transparent text-white/30 hover:text-amber-500 p-2"><Search size={22} /></button>
                </form>
                <div className="hidden lg:flex items-center gap-2 text-amber-600 uppercase text-[10px] font-black tracking-[0.5em] italic"><Wine size={16} /> LA CANTINA</div>
            </header>

            <div className="flex-1 flex flex-col xl:flex-row gap-8 p-6 z-40 relative mt-2">
                <div className="flex-1">
                    
                    {errorMsg && (
                        <div className="bg-red-600/20 border border-red-600 text-red-400 p-4 rounded-xl text-center font-bold mb-6">
                            {errorMsg}
                        </div>
                    )}

                    {/* 📺 REPRODUCTOR PROPIO: Cero controles de YouTube */}
                    {selectedVideo && (
                        <div ref={playerWrapperRef} className="relative group w-full aspect-video rounded-[2rem] overflow-hidden bg-black shadow-[0_0_80px_rgba(217,119,6,0.1)] border border-white/10 animate-fade-in mb-14">
                            
                            {/* 🛡️ EL CRISTAL (Bloquea todo toque al Iframe) */}
                            <div className="absolute inset-0 z-40 bg-transparent cursor-default"></div>

                            {/* Botón Cerrar */}
                            <button onClick={() => setSelectedVideo(null)} className="absolute top-4 right-4 z-[60] text-white/50 hover:text-red-500 transition-all p-2 bg-black/50 rounded-full backdrop-blur-md">
                                <X size={30} strokeWidth={2} />
                            </button>

                            {/* 🎛️ NUESTROS CONTROLES PROPIOS (Z-50) */}
                            <div className="absolute bottom-4 left-4 right-4 z-[50] flex items-center justify-between px-6 py-3 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                
                                <div className="flex items-center gap-6">
                                    <button onClick={togglePlay} className="text-white hover:text-amber-500 transition-colors">
                                        {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
                                    </button>

                                    <div className="flex items-center gap-3 hidden sm:flex">
                                        <button onClick={toggleMute} className="text-white/70 hover:text-amber-500 transition-colors">
                                            {volume === 0 ? <VolumeX size={22} /> : <Volume2 size={22} />}
                                        </button>
                                        <input 
                                            type="range" min="0" max="100" value={volume} onChange={handleVolumeChange}
                                            className="w-24 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                        />
                                    </div>
                                </div>

                                <button onClick={toggleFullscreen} className="text-white/70 hover:text-amber-500 transition-colors">
                                    <Maximize size={24} />
                                </button>
                            </div>

                            {/* IFRAME TOTALMENTE CONTROLADO */}
                            <iframe 
                                ref={iframeRef}
                                className="w-full h-full pointer-events-none scale-[1.05]"
                                src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}?autoplay=1&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0&enablejsapi=1`}
                                frameBorder="0"
                                allow="autoplay; encrypted-media; picture-in-picture"
                            />
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center p-32"><Loader2 className="animate-spin text-amber-600" size={60} /></div>
                    ) : (
                        <div className="flex flex-col gap-12">
                            {/* 🎶 20 VIDEOS RELACIONADOS */}
                            {selectedVideo && relatedVideos.length > 0 && (
                                <div className="animate-fade-in">
                                    <h2 className="text-amber-500 font-black text-[10px] uppercase tracking-[0.4em] mb-6 flex items-center gap-2"><Play size={14} fill="currentColor"/> SIGUE LA FIESTA</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {relatedVideos.map((item, idx) => (
                                            <div key={idx} onClick={() => handleSelectVideo(item)} className="group cursor-pointer">
                                                <div className="relative aspect-video rounded-[2rem] overflow-hidden border border-white/5 group-hover:border-amber-600/40 transition-all shadow-xl">
                                                    <img src={item.snippet.thumbnails.high.url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" alt="thumb" />
                                                </div>
                                                <h4 className="mt-3 text-[11px] font-bold text-stone-400 line-clamp-2 uppercase italic group-hover:text-amber-500 transition-all">{item.snippet.title}</h4>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="h-[1px] w-full bg-white/5 mt-12"></div>
                                </div>
                            )}

                            {/* GRILLA PRINCIPAL */}
                            {!loading && videos.length === 0 && !errorMsg ? (
                                <div className="text-center mt-10 p-10 bg-zinc-900/50 rounded-3xl border border-white/5">
                                    <p className="text-gray-400 font-black uppercase tracking-widest text-lg">No encontramos música para esa búsqueda.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                                    {videos.map((item, idx) => (
                                        <div key={idx} onClick={() => handleSelectVideo(item)} className="group cursor-pointer">
                                            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/5 group-hover:border-amber-600/40 transition-all duration-700 shadow-2xl">
                                                <img src={item.snippet.thumbnails.high.url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" alt="thumb" />
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 backdrop-blur-[2px] transition-all"><Play size={50} fill="white" className="text-white transform scale-50 group-hover:scale-100 transition-all duration-500" /></div>
                                            </div>
                                            <h3 className="mt-4 text-[13px] font-black text-stone-300 uppercase italic line-clamp-2 leading-tight group-hover:text-amber-500 transition-all tracking-tighter">{item.snippet.title}</h3>
                                            <p className="text-[10px] text-white/30 font-bold uppercase mt-2 tracking-widest">{item.snippet.channelTitle}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 📢 BARRA LATERAL */}
                <div className="w-full xl:w-[420px] flex flex-col gap-8">
                    <div className="h-[650px] bg-white/5 backdrop-blur-3xl rounded-[3.5rem] border border-white/10 overflow-hidden shadow-2xl relative">
                        <img src={VERTICAL_ADS[vAdIndex]} className="w-full h-full object-contain transition-all duration-1000" alt="Ad" />
                    </div>

                    {/* 💰 GOOGLE ADSENSE (Tuyo) */}
                    <div className="w-full bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 p-4 shadow-2xl overflow-hidden min-h-[300px] flex flex-col items-center justify-center relative">
                        <ShieldCheck size={16} className="absolute top-4 right-4 text-amber-600/40" />
                        <span className="text-amber-600/40 font-black text-[8px] uppercase tracking-[0.5em] mb-2">PUBLICIDAD PATROCINADA</span>
                        <ins className="adsbygoogle" style={{ display: 'block', width: '100%', height: '100%' }} data-ad-client="ca-pub-1260009754001434" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins>
                    </div>
                </div>
            </div>

            <footer className="bg-black py-8 border-t border-white/5 z-50">
                <div className="whitespace-nowrap flex gap-16 text-white/5 font-bold uppercase text-[9px] tracking-[0.6em] animate-marquee">
                    <span className="flex items-center gap-2"><Flame size={12} className="text-amber-900" /> FABULOSA PLAY LA CANTINA</span>
                    <span className="flex items-center gap-2"><HeartCrack size={12} className="text-red-950" /> PURA MÚSICA POPULAR COLOMBIANA Y DESPECHO</span>
                </div>
            </footer>

            <style>{`
                .animate-marquee { animation: marquee 60s linear infinite; }
                @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
                .animate-fade-in { animation: fadeIn 1.2s ease-out; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-thumb { background: #111; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default RancheraPlay;