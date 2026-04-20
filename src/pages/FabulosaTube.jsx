import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Mic, Bell, Home as HomeIcon, Flame, PlaySquare, Clock, ThumbsUp, ArrowLeft, Tv, MoreVertical } from 'lucide-react';

// === 🔑 LAS 14 LLAVES MAESTRAS ROTATIVAS ===
const YOUTUBE_API_KEYS = [
    "AIzaSyDxLD8PviKQwlHBs7rmRm3GoyIKk-aQpww", "AIzaSyACeTldeUs5tbn2Lwr6o_6Lc48rF1nINY0",
    "AIzaSyBUk0oq1zjA6BKx5HK8DEQc1TxQqreqGtk", "AIzaSyBys-0J3T5Ou_fdPGxqYC5LWDMgppwD0Y4",
    "AIzaSyDHdkSo4WSHjYL4nHFU9wKmXW5D9PScO4g", "AIzaSyDJqDMnZsYHyJtzahtvv1r55Z-JfgLk5TU",
    "AIzaSyCruj7UZTEmElS3ZUeUBmYPecbsAA667U8", "AIzaSyBfMNrgQESeymMQ9srVBHKjXB3_WeRfkXE",
    "AIzaSyB1e_YSB74yAelvAhapDWu11VPLz2wBkUg", "AIzaSyCsvViGGiPJxx8-FkSwQvHE2T_U8d2UO5E",
    "AIzaSyBRvdUqolryjMRustJUyqN_HtkjRCbHLfI", "AIzaSyCdmCZW6J49Onl-QAf3cTsNu0im84EBVZc",
    "AIzaSyCeref7W3di_9o6W3YnEtqgvCQyvyQ5a5Q", "AIzaSyAwtE19mD7rpv1pu5nB4R8Q0HmEX9OkgJI"
];

let currentKeyIndex = 0;

// === BURBUJAS DE CATEGORÍA INFINITAS ===
const BUBBLE_TAGS = [
    'Todos', 'Películas Completas', 'Música', 'Documentales', 'Noticias en Vivo', 
    'Deportes', 'Comedia', 'Terror', 'Tecnología', 'Videojuegos', 'Naturaleza', 
    'Recetas', 'Viajes', 'Misterio', 'Historia', 'Podcast', 'Automovilismo'
];

const FabulosaTube = () => {
    const [videos, setVideos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const searchInputRef = useRef(null);

    // === 🔄 MOTOR DE BÚSQUEDA BLINDADO CON ROTACIÓN DE API ===
    const fetchYouTubeData = async (urlParams) => {
        setIsLoading(true);
        let attempts = 0;
        
        while (attempts < YOUTUBE_API_KEYS.length) {
            try {
                const response = await fetch(`https://www.googleapis.com/youtube/v3/${urlParams}&key=${YOUTUBE_API_KEYS[currentKeyIndex]}`);
                if (response.status === 403 || response.status === 429) {
                    currentKeyIndex = (currentKeyIndex + 1) % YOUTUBE_API_KEYS.length;
                    attempts++;
                    continue;
                }
                const data = await response.json();
                setIsLoading(false);
                return data.items || [];
            } catch (error) {
                attempts++;
            }
        }
        setIsLoading(false);
        return [];
    };

    // ALGORITMO: NUNCA SE VE LO MISMO
    useEffect(() => {
        const loadInitial = async () => {
            const randomSeeds = ['tendencias 2026', 'peliculas de accion', 'documentales', 'exitos musicales hd', 'comedia stand up', 'deportes extremos'];
            const seed = randomSeeds[Math.floor(Math.random() * randomSeeds.length)];
            const items = await fetchYouTubeData(`search?part=snippet&maxResults=48&q=${encodeURIComponent(seed)}&type=video`);
            setVideos(items);
        };
        loadInitial();
    }, []);

    const handleSearch = async (e) => {
        if(e) e.preventDefault();
        if (!searchTerm) return;
        setSelectedVideo(null); 
        const items = await fetchYouTubeData(`search?part=snippet&maxResults=48&q=${encodeURIComponent(searchTerm)}&type=video`);
        setVideos(items);
    };

    // ALGORITMO NIVEL DIOS PARA RELACIONADOS (BUSCA 50 OPCIONES)
    const handleVideoSelect = async (video) => {
        setSelectedVideo(video);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // En lugar de usar el related (que a veces falla), hacemos una búsqueda inteligente basada en el título del video
        const smartQuery = `${video.snippet.channelTitle} ${video.snippet.title.substring(0, 30)}`;
        const related = await fetchYouTubeData(`search?part=snippet&maxResults=50&q=${encodeURIComponent(smartQuery)}&type=video`);
        
        // Filtramos para que no salga el mismo video exacto
        const filteredRelated = related.filter(v => v.id.videoId !== video.id.videoId);
        setRelatedVideos(filteredRelated);
    };

    // =========================================================
    // 🖥️ VISTA 1: REPRODUCTOR CON BARRA LATERAL INFINITA
    // =========================================================
    if (selectedVideo) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col font-sans">
                {/* TOP NAVBAR (YOUTUBE EXACTO) */}
                <nav className="h-14 px-4 flex items-center justify-between bg-[#0f0f0f] sticky top-0 z-50 border-b border-[#272727]">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSelectedVideo(null)} className="p-2 hover:bg-[#272727] rounded-full focus:ring-2 focus:ring-[#00b4d8] outline-none" tabIndex={0}>
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-xl font-black italic tracking-tighter hidden sm:block">FABULOSA<span className="text-[#00b4d8]">PLAY</span></h1>
                    </div>
                    
                    {/* BUSCADOR CLON YOUTUBE EN EL REPRODUCTOR */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4 sm:mx-10 flex items-center">
                        <div className="flex w-full">
                            <input 
                                type="text" 
                                placeholder="Buscar en Fabulosa Play..."
                                className="w-full bg-[#121212] border border-[#303030] rounded-l-full py-2 px-4 sm:px-6 text-white focus:outline-none focus:border-[#00b4d8] focus:bg-[#0f0f0f] transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit" className="px-4 sm:px-6 bg-[#222222] border border-l-0 border-[#303030] rounded-r-full hover:bg-[#303030] transition-colors">
                                <Search size={20} />
                            </button>
                        </div>
                        <button type="button" className="ml-4 p-2 bg-[#181818] rounded-full hover:bg-[#303030] hidden sm:block">
                            <Mic size={20} />
                        </button>
                    </form>
                    
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00b4d8] to-rose-900 shrink-0"></div>
                </nav>

                <div className="flex flex-col lg:flex-row max-w-[1800px] mx-auto w-full gap-6 p-4 md:p-6">
                    {/* VIDEO PRINCIPAL BLINDADO */}
                    <div className="flex-1">
                        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl focus:ring-4 focus:ring-[#00b4d8] outline-none" tabIndex={0}>
                            {/* 🔒 CANDADO FABULOSA PLAY */}
                            <iframe 
                                className="absolute top-0 left-0 w-full h-full"
                                src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}?autoplay=1&modestbranding=1&rel=0&controls=1`}
                                title="Fabulosa Player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                sandbox="allow-scripts allow-same-origin allow-presentation" 
                            ></iframe>
                        </div>
                        <h2 className="text-xl font-bold mt-4">{selectedVideo.snippet.title}</h2>
                        <div className="flex items-center justify-between mt-3 border-b border-[#3f3f3f] pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00b4d8] to-black"></div>
                                <span className="text-zinc-100 text-base font-bold">{selectedVideo.snippet.channelTitle}</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-[#272727] hover:bg-[#3f3f3f] rounded-full text-sm font-bold flex items-center gap-2">
                                    <ThumbsUp size={18} /> Me Gusta
                                </button>
                                <button className="p-2 bg-[#272727] hover:bg-[#3f3f3f] rounded-full"><MoreVertical size={20}/></button>
                            </div>
                        </div>
                    </div>

                    {/* BARRA DERECHA: RELACIONADOS Y PUBLICIDAD (SCROLL INFINITO) */}
                    <div className="w-full lg:w-[400px] flex flex-col gap-4 h-auto lg:h-[calc(100vh-100px)] lg:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        
                        {/* 💰 CAJA DE PUBLICIDAD LATERAL FIJA */}
                        <div className="w-full aspect-video bg-[#121212] border border-[#303030] rounded-xl overflow-hidden relative shrink-0">
                            <div className="absolute top-1 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold z-10 text-zinc-300">Patrocinado</div>
                            <img src="/centro-de-publicidad.png" alt="Publicidad Fabulosa" className="w-full h-full object-contain" />
                        </div>

                        {/* LISTA DE 50 VIDEOS OPCIONES */}
                        <div className="flex flex-col gap-3 pb-10">
                            {relatedVideos.map((v, i) => (
                                <div key={i} onClick={() => handleVideoSelect(v)} className="flex gap-2 cursor-pointer group focus:bg-[#272727] rounded-lg p-1 outline-none" tabIndex={0}>
                                    <div className="relative w-40 aspect-video rounded-lg overflow-hidden shrink-0 bg-[#222]">
                                        <img src={v.snippet.thumbnails.medium?.url || v.snippet.thumbnails.high?.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="thumbnail" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-sm font-bold text-zinc-100 line-clamp-2 leading-tight group-hover:text-[#00b4d8]">{v.snippet.title}</h3>
                                        <span className="text-xs text-zinc-400 mt-1">{v.snippet.channelTitle}</span>
                                        <span className="text-[10px] text-zinc-500 mt-1">Recomendado</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // =========================================================
    // 🏠 VISTA 2: HOME TIPO YOUTUBE (GRILLA INFINITA)
    // =========================================================
    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white font-sans flex flex-col overflow-hidden">
            
            {/* TOP NAVBAR YOUTUBE EXACTO */}
            <header className="h-14 px-4 flex items-center justify-between sticky top-0 bg-[#0f0f0f] z-50">
                <div className="flex items-center gap-4">
                    <Link to="/" className="p-2 hover:bg-[#272727] rounded-full focus:ring-2 focus:ring-[#00b4d8] outline-none" tabIndex={0}>
                        <ArrowLeft size={24} />
                    </Link>
                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => window.location.reload()}>
                        <div className="bg-[#00b4d8] text-black p-1 rounded-lg"><Tv size={20} /></div>
                        <h1 className="text-xl font-black italic tracking-tighter ml-1 hidden sm:block">FABULOSA<span className="text-[#00b4d8]">PLAY</span></h1>
                    </div>
                </div>

                {/* BUSCADOR CLON YOUTUBE */}
                <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4 sm:mx-10 flex items-center">
                    <div className="flex w-full">
                        <input 
                            ref={searchInputRef}
                            type="text" 
                            placeholder="Buscar películas, música, directos..."
                            className="w-full bg-[#121212] border border-[#303030] rounded-l-full py-2 px-4 sm:px-6 text-white focus:outline-none focus:border-[#00b4d8] focus:bg-[#0f0f0f] transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            tabIndex={0}
                        />
                        <button type="submit" className="px-4 sm:px-6 bg-[#222222] border border-l-0 border-[#303030] rounded-r-full hover:bg-[#303030] transition-colors focus:ring-2 focus:ring-[#00b4d8] outline-none" tabIndex={0}>
                            <Search size={20} />
                        </button>
                    </div>
                    <button type="button" className="ml-4 p-2 bg-[#181818] rounded-full hover:bg-[#303030] hidden sm:block">
                        <Mic size={20} />
                    </button>
                </form>

                <div className="flex items-center gap-2 sm:gap-4">
                    <button className="p-2 hover:bg-[#272727] rounded-full hidden sm:block"><Bell size={20} /></button>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00b4d8] to-rose-900 border border-white/20 shrink-0"></div>
                </div>
            </header>

            <div className="flex flex-1 h-[calc(100vh-56px)]">
                {/* SIDEBAR IZQUIERDO */}
                <aside className="w-[72px] xl:w-[240px] hidden md:flex flex-col gap-2 p-3 overflow-y-auto bg-[#0f0f0f] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="flex flex-col xl:flex-row items-center xl:justify-start gap-1 xl:gap-5 p-3 rounded-xl hover:bg-[#272727] cursor-pointer bg-[#272727]" onClick={() => window.location.reload()}>
                        <HomeIcon size={24} /> <span className="text-[10px] xl:text-sm font-bold">Inicio</span>
                    </div>
                    <div className="flex flex-col xl:flex-row items-center xl:justify-start gap-1 xl:gap-5 p-3 rounded-xl hover:bg-[#272727] cursor-pointer" onClick={() => { setSearchTerm('Tendencias 2026'); handleSearch(); }}>
                        <Flame size={24} /> <span className="text-[10px] xl:text-sm font-bold">Tendencias</span>
                    </div>
                    <div className="flex flex-col xl:flex-row items-center xl:justify-start gap-1 xl:gap-5 p-3 rounded-xl hover:bg-[#272727] cursor-pointer">
                        <PlaySquare size={24} /> <span className="text-[10px] xl:text-sm font-bold">Suscripciones</span>
                    </div>
                    <div className="my-3 border-b border-[#3f3f3f] hidden xl:block"></div>
                    
                    {/* 💰 PUBLICIDAD SIDEBAR */}
                    <div className="mt-auto hidden xl:block w-full rounded-xl overflow-hidden border border-[#303030]">
                        <img src="/centro-de-publicidad.png" alt="Publicidad" className="w-full h-auto" />
                    </div>
                </aside>

                <main className="flex-1 overflow-y-auto bg-[#0f0f0f] p-4 sm:p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    
                    {/* BURBUJAS DE CATEGORÍAS INFINITAS */}
                    <div className="flex gap-3 overflow-x-auto pb-4 sticky top-0 bg-[#0f0f0f] z-40 py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {BUBBLE_TAGS.map((tag, i) => (
                            <button 
                                key={i} 
                                onClick={() => { setSearchTerm(tag); document.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })); }}
                                className={`px-4 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors outline-none focus:ring-2 focus:ring-[#00b4d8] tabIndex={0} ${i === 0 ? 'bg-white text-black' : 'bg-[#272727] hover:bg-[#3f3f3f] text-white'}`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64"><div className="w-12 h-12 border-4 border-[#00b4d8] border-t-transparent rounded-full animate-spin"></div></div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-10 pb-20 pt-4">
                            
                            {/* 💰 CAJA DE PUBLICIDAD EN EL GRID */}
                            <div className="flex flex-col cursor-pointer focus:ring-4 focus:ring-[#00b4d8] outline-none rounded-xl tabIndex={0}">
                                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#303030] bg-[#121212] mb-3">
                                    <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-xs font-bold text-white">Anuncio</div>
                                    <img src="/centro-de-publicidad.png" className="w-full h-full object-contain" alt="Ad" />
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-9 h-9 rounded-full bg-[#00b4d8] shrink-0 flex items-center justify-center text-black font-black">F</div>
                                    <div>
                                        <h3 className="text-white font-bold text-sm line-clamp-2">Contenido Patrocinado Fabulosa Play</h3>
                                        <p className="text-[#aaa] text-xs mt-1">Navegación ilimitada 24/7</p>
                                    </div>
                                </div>
                            </div>

                            {/* VIDEOS FETCHED */}
                            {videos.map((video, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => handleVideoSelect(video)} 
                                    className="flex flex-col cursor-pointer group focus:ring-4 focus:ring-[#00b4d8] outline-none rounded-xl p-1 tabIndex={0}"
                                >
                                    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#222] mb-3">
                                        <img 
                                            src={video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url} 
                                            alt={video.snippet.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-9 h-9 rounded-full bg-[#272727] shrink-0 overflow-hidden">
                                            <div className="w-full h-full bg-gradient-to-br from-[#00b4d8] to-black"></div>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold text-sm line-clamp-2 leading-snug group-hover:text-[#00b4d8] transition-colors">
                                                {video.snippet.title}
                                            </h3>
                                            <p className="text-[#aaa] text-xs mt-1 hover:text-white">{video.snippet.channelTitle}</p>
                                            <p className="text-[#aaa] text-[11px] mt-0.5">Hace un momento</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default FabulosaTube;