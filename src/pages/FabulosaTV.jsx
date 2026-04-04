import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Volume2, VolumeX, Maximize, Minimize, Cast, Dices, Search } from 'lucide-react';

// === 🚀 ASSETS DE IMAGEN (Se mantienen como import) ===
import LOGO_CANAL from "../assets/logo-fabulosa.png";
import imgReproductor from '../assets/fabulosatvreproductor.png';

// === 🎬 VIDEOS (Rutas directas para que Vercel no de error) ===
const INTRO_SRC = "/assets/intro.mp4";
const FONDO_TV_VIDEO = "/assets/fondotv.mp4";
const FABULOSITO_VIDEO = "/assets/fabulosito-video.mp4";

// 🔑 TUS 14 LLAVES MAESTRAS DE YOUTUBE
const YOUTUBE_API_KEYS = [
    "AIzaSyDxLD8PviKQwlHBs7rmRm3GoyIKk-aQpww", "AIzaSyACeTldeUs5tbn2Lwr6o_6Lc48rF1nINY0",
    "AIzaSyBUk0oq1zjA6BKx5HK8DEQc1TxQqreqGtk", "AIzaSyBys-0J3T5Ou_fdPGxqYC5LWDMgppwD0Y4",
    "AIzaSyDHdkSo4WSHjYL4nHFU9wKmXW5D9PScO4g", "AIzaSyDJqDMnZsYHyJtzahtvv1r55Z-JfgLk5TU",
    "AIzaSyCruj7UZTEmElS3ZUeUBmYPecbsAA667U8", "AIzaSyBfMNrgQESeymMQ9srVBHKjXB3_WeRfkXE",
    "AIzaSyB1e_YSB74yAelvAhapDWu11VPLz2wBkUg", "AIzaSyCsvViGGiPJxx8-FkSwQvHE2T_U8d2UO5E",
    "AIzaSyBRvdUqolryjMRustJUyqN_HtkjRCbHLfI", "AIzaSyCdmCZW6J49Onl-QAf3cTsNu0im84EBVZc",
    "AIzaSyCeref7W3di_9o6W3YnEtqgvCQyvyQ5a5Q", "AIzaSyAwtE19mD7rpv1pu5nB4R8Q0HmEX9OkgJI"
];

const FabulosaTV = () => {
    const playlist = {
        ids: [
            "/media/ids/id-1.mp4", "/media/ids/id-2.mp4", "/media/ids/id-3.mp4",
            "/media/ids/id-4.mp4", "/media/ids/id-5.mp4", "/media/ids/id-6.mp4",
            "/media/ids/id-7.mp4", "/media/ids/id-8.mp4", "/media/ids/id-9.mp4",
            "/media/ids/id-10.mp4", "/media/ids/id-11.mp4"
        ],
        comerciales: [
            "/media/comerciales/comercial fabulosa play 1.mp4",
            "/media/comerciales/piña express.mp4",
            "/media/comerciales/comercial chinito express 1.mp4"
        ],
        voces: [
            "/media/voces/Miguel -voz lenta.mp3", "/media/voces/Miguel.biembenidos .mp3",
            "/media/voces/rosalia 1.mp3", "/media/voces/rosalia 2.mp3", "/media/voces/rosalia 3.mp3",
            "/media/voces/sello-fabulosa.mp3", "/media/voces/subele el volumen somos fabulosa play.mp3",
            "/media/voces/Tony Garcia - chat en vivo.mp3", "/media/voces/Tony Garcia - chat interactivo.mp3",
            "/media/voces/Tony Garcia - dale volumen.mp3", "/media/voces/Tony Garcia - que buena nota.mp3",
            "/media/voces/Tony Garcia -saludos amas de casa .mp3", "/media/voces/Claus Encant -bueno.mp3",
            "/media/voces/inicio.mp3"
        ]
    };

    const [currentSrc, setCurrentSrc] = useState(INTRO_SRC);
    const [modo, setModo] = useState("INTRO"); 
    const [volume, setVolume] = useState(1);
    const [mute, setMute] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [quienHabla, setQuienHabla] = useState("SISTEMA"); 
    const [chatMensaje, setChatMensaje] = useState("");
    const [chatHistory, setChatHistory] = useState([{ type: 'bot', text: "¡Bienvenidos a Fabulosa TV!" }]);
    const [busqueda, setBusqueda] = useState("");
    const [currentYtId, setCurrentYtId] = useState(null);
    const [ytPlaylist, setYtPlaylist] = useState([]); 

    const commercialQueue = useRef([]); 
    const lastMarcaTime = useRef(Date.now());
    const lastLocucionTime = useRef(Date.now());
    const contadorVideos = useRef(0);
    const modoRef = useRef(modo);
    const lastLoadedYtId = useRef(null); 
    const colaVIP = useRef([]);
    const keyIndexRef = useRef(0); 
    
    const playerContainerRef = useRef(null);
    const videoRef = useRef(null);
    const ytPlayerRef = useRef(null);
    const audioExtraRef = useRef(new Audio());
    const chatEndRef = useRef(null);

    useEffect(() => { modoRef.current = modo; }, [modo]);

    useEffect(() => {
        if (videoRef.current) videoRef.current.volume = mute ? 0 : volume;
        if (ytPlayerRef.current && typeof ytPlayerRef.current.setVolume === 'function') {
            ytPlayerRef.current.setVolume(mute ? 0 : volume * 100);
        }
    }, [volume, mute]);

    const buscarMusicaEnYouTube = async (queryCustom = null, isUserRequest = false) => {
        try {
            let termino = queryCustom || "exitos latinos mas sonados";
            let exito = false;
            let data = null;

            while (keyIndexRef.current < YOUTUBE_API_KEYS.length && !exito) {
                const key = YOUTUBE_API_KEYS[keyIndexRef.current];
                const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(termino)}&type=video&videoCategoryId=10&videoEmbeddable=true&key=${key}`;
                const res = await fetch(url);
                if (res.status === 403 || res.status === 429) keyIndexRef.current++;
                else { data = await res.json(); exito = true; }
            }

            if (exito && data.items.length > 0) {
                const primerId = data.items[0].id.videoId;
                if (isUserRequest) {
                    setCurrentYtId(primerId);
                    setModo("MUSICA");
                } else {
                    setYtPlaylist(data.items.slice(1).map(i => i.id.videoId));
                    setCurrentYtId(primerId);
                    setModo("MUSICA");
                }
            }
        } catch (e) { console.error(e); }
    };

    const handleVideoEnd = () => {
        if (modoRef.current === "INTRO" || modoRef.current === "ID") {
            buscarMusicaEnYouTube();
        } else {
            setModo("ID");
            setCurrentSrc(playlist.ids[Math.floor(Math.random() * playlist.ids.length)]);
        }
    };

    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(tag);
            window.onYouTubeIframeAPIReady = () => {
                ytPlayerRef.current = new window.YT.Player('youtube-tv-player', {
                    events: { 'onStateChange': (e) => { if (e.data === 0) handleVideoEnd(); } }
                });
            };
        }
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) playerContainerRef.current.requestFullscreen();
        else document.exitFullscreen();
    };

    return (
        <div className="relative min-h-screen w-full bg-black text-white flex flex-col">
            <video src={FONDO_TV_VIDEO} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-40 z-0"/>
            <div className="relative z-10 flex flex-col h-full p-4 flex-1">
                <div className="flex justify-between items-center mb-4 bg-black/60 p-4 rounded-3xl border border-white/10">
                    <Link to="/" className="text-white/70 hover:text-white uppercase text-xs font-black tracking-widest">← Volver</Link>
                    <div className="bg-red-600 px-4 py-1 rounded-full animate-pulse text-[10px] font-black uppercase">En Vivo</div>
                </div>
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div ref={playerContainerRef} className="lg:col-span-3 relative bg-black rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group aspect-video">
                        <video ref={videoRef} src={currentSrc} className={`absolute inset-0 w-full h-full object-contain ${modo !== "MUSICA" ? "opacity-100 z-20" : "opacity-0"}`} autoPlay playsInline muted={mute} onEnded={handleVideoEnd}/>
                        <div className={`absolute inset-0 w-full h-full ${modo === "MUSICA" ? "opacity-100 z-10" : "opacity-0"}`}>
                            <div id="youtube-tv-player" className="w-full h-full scale-[1.3]"></div>
                        </div>
                        <div className="absolute top-8 right-8 w-40 z-50"><img src={LOGO_CANAL} alt="Logo" /></div>
                        <div className="absolute bottom-8 left-8 right-8 flex justify-between opacity-0 group-hover:opacity-100 transition-all z-50">
                            <button onClick={() => setMute(!mute)} className="bg-black/60 p-4 rounded-full border border-white/20">{mute ? <VolumeX /> : <Volume2 />}</button>
                            <button onClick={toggleFullscreen} className="bg-black/60 p-4 rounded-full border border-white/20"><Maximize /></button>
                        </div>
                    </div>
                    <div className="lg:col-span-1 flex flex-col bg-black rounded-[2.5rem] border border-white/20 overflow-hidden shadow-2xl">
                        <div className="h-48 flex justify-center items-center bg-black"><video src={FABULOSITO_VIDEO} autoPlay loop muted className="h-full object-contain"/></div>
                        <div className="p-4 border-b border-white/10 text-center"><h2 className="font-black italic tracking-tighter">DJ FABULOSITO</h2></div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">{chatHistory.map((msg, i) => (<div key={i} className={`text-[11px] p-3 rounded-xl ${msg.type === 'user' ? 'bg-red-900 ml-4' : 'bg-zinc-900 mr-4'}`}>{msg.text}</div>))}</div>
                        <form onSubmit={(e) => { e.preventDefault(); buscarMusicaEnYouTube(chatMensaje, true); setChatMensaje(""); }} className="p-3 flex gap-2"><input value={chatMensaje} onChange={(e) => setChatMensaje(e.target.value)} className="flex-1 bg-zinc-900 border border-white/20 rounded-xl p-3 text-xs" placeholder="Pide tu canción..."/><button type="submit" className="bg-red-600 p-3 rounded-xl"><Send size={18}/></button></form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FabulosaTV;