import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

import LOGO_CANAL from "../assets/logo-fabulosa.png";

const INTRO_SRC = "/assets/intro.mp4";
const FONDO_TV_VIDEO = "/assets/fondotv.mp4";
const FABULOSITO_VIDEO = "/assets/fabulosito-video.mp4";

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
        ids: ["/media/ids/id-1.mp4", "/media/ids/id-2.mp4", "/media/ids/id-3.mp4", "/media/ids/id-4.mp4", "/media/ids/id-5.mp4"],
        comerciales: ["/media/comerciales/piÃ±a express.mp4", "/media/comerciales/comercial chinito express 1.mp4", "/media/comerciales/comercial fabulosa play 1.mp4"],
        voces: ["/media/voces/Miguel.biembenidos .mp3", "/media/voces/sello-fabulosa.mp3", "/media/voces/Tony Garcia - dale volumen.mp3", "/media/voces/rosalia 1.mp3"]
    };

    const [currentSrc, setCurrentSrc] = useState(INTRO_SRC);
    const [modo, setModo] = useState("INTRO"); 
    const [volume, setVolume] = useState(1);
    const [mute, setMute] = useState(false);
    const [quienHabla, setQuienHabla] = useState("SISTEMA"); 
    const [currentYtId, setCurrentYtId] = useState(null);
    const [chatMensaje, setChatMensaje] = useState("");
    const [chatHistory, setChatHistory] = useState([{ type: 'bot', text: "Â¡Fabulosito al aire! Â¿QuÃ© escuchamos?" }]);

    const lastLocucionTime = useRef(Date.now());
    const modoRef = useRef(modo);
    const keyIndexRef = useRef(0); 
    const videoRef = useRef(null);
    const ytPlayerRef = useRef(null);
    const audioExtraRef = useRef(new Audio());

    useEffect(() => { modoRef.current = modo; }, [modo]);

    const buscarMusicaEnYouTube = async (query = "exitos latinos 2024") => {
        try {
            let exito = false;
            let data = null;
            while (keyIndexRef.current < YOUTUBE_API_KEYS.length && !exito) {
                const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&videoEmbeddable=true&key=${YOUTUBE_API_KEYS[keyIndexRef.current]}`;
                const res = await fetch(url);
                if (res.status === 403) keyIndexRef.current++;
                else { data = await res.json(); exito = true; }
            }
            if (exito && data.items.length > 0) {
                setCurrentYtId(data.items[0].id.videoId);
                setModo("MUSICA");
            }
        } catch (e) { console.error(e); }
    };

    const handleVideoEnd = () => {
        if (modoRef.current === "INTRO" || modoRef.current === "ID") {
            buscarMusicaEnYouTube();
        } else {
            setCurrentSrc(playlist.ids[Math.floor(Math.random() * playlist.ids.length)]);
            setModo("ID");
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

    useEffect(() => {
        if (modo === "MUSICA" && currentYtId && ytPlayerRef.current?.loadVideoById) {
            ytPlayerRef.current.loadVideoById(currentYtId);
        }
    }, [currentYtId, modo]);

    return (
        <div className="relative min-h-screen w-full bg-black text-white flex flex-col overflow-hidden">
            <video src={FONDO_TV_VIDEO} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-30 z-0"/>
            <div className="relative z-10 flex flex-col h-full p-4 md:p-6 flex-1">
                <div className="flex justify-between items-center mb-4 bg-black/60 p-4 rounded-3xl border border-white/10">
                    <Link to="/" className="text-white/70 hover:text-white uppercase text-xs font-black tracking-widest">â† Volver</Link>
                    <div className="bg-red-600 px-4 py-1 rounded-full animate-pulse text-[10px] font-black uppercase">En Vivo</div>
                </div>
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 relative bg-black rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl aspect-video">
                        <video ref={videoRef} src={currentSrc} className={`absolute inset-0 w-full h-full object-contain ${modo !== "MUSICA" ? "opacity-100 z-20" : "opacity-0"}`} autoPlay playsInline onEnded={handleVideoEnd}/>
                        <div className={`absolute inset-0 w-full h-full ${modo === "MUSICA" ? "opacity-100 z-10" : "opacity-0"}`}>
                            <div id="youtube-tv-player" className="w-full h-full scale-[1.3] pointer-events-none"></div>
                        </div>
                        <div className="absolute top-8 right-8 w-32 z-50"><img src={LOGO_CANAL} alt="Logo" /></div>
                    </div>
                    <div className="lg:col-span-1 flex flex-col bg-zinc-900/80 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
                        <div className="h-48 flex justify-center items-center p-4 relative">
                            <video src={FABULOSITO_VIDEO} autoPlay loop muted playsInline className="h-full object-contain scale-150 z-10"/>
                        </div>
                        <div className="p-4 border-b border-white/10 text-center"><h2 className="font-black italic text-sm tracking-tighter uppercase">DJ FABULOSITO</h2></div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {chatHistory.map((m, i) => (<div key={i} className={`text-[10px] p-2 rounded-lg ${m.type === 'bot' ? 'bg-zinc-800' : 'bg-red-950 ml-4'}`}>{m.text}</div>))}
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); buscarMusicaEnYouTube(chatMensaje); setChatMensaje(""); }} className="p-3 flex gap-2">
                            <input value={chatMensaje} onChange={(e) => setChatMensaje(e.target.value)} className="flex-1 bg-black/40 border border-white/10 rounded-xl p-2 text-[10px]" placeholder="Pide tu canciÃ³n..."/>
                            <button type="submit" className="bg-red-600 p-2 rounded-xl text-xs font-bold uppercase italic">Enviar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FabulosaTV;