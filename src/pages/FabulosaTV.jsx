import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Volume2, VolumeX, Maximize, Minimize, Cast, Dices, Search } from 'lucide-react';

// === 🚀 ASSETS DE IMAGEN (Se mantienen como import) ===
import LOGO_CANAL from "../assets/logo-fabulosa.png";
import imgReproductor from '../assets/fabulosatvreproductor.png';

// === 🎬 VIDEOS (Cambiados a ruta directa para evitar errores en Vercel) ===
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
    // --- 🎙️ TU BASE DE DATOS EXACTA EN LA NUBE ---
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
            "/media/voces/Miguel -voz lenta.mp3",
            "/media/voces/Miguel.biembenidos .mp3",
            "/media/voces/rosalia 1.mp3",
            "/media/voces/rosalia 2.mp3",
            "/media/voces/rosalia 3.mp3",
            "/media/voces/sello-fabulosa.mp3",
            "/media/voces/subele el volumen somos fabulosa play.mp3",
            "/media/voces/Tony Garcia - chat en vivo.mp3",
            "/media/voces/Tony Garcia - chat interactivo.mp3",
            "/media/voces/Tony Garcia - dale volumen.mp3",
            "/media/voces/Tony Garcia - que buena nota.mp3",
            "/media/voces/Tony Garcia -saludos amas de casa .mp3",
            "/media/voces/Claus Encant -bueno.mp3",
            "/media/voces/inicio.mp3"
        ]
    };

    // --- ESTADOS PRINCIPALES ---
    const [currentSrc, setCurrentSrc] = useState(INTRO_SRC);
    const [modo, setModo] = useState("INTRO"); 
    const [volume, setVolume] = useState(1);
    const [mute, setMute] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [quienHabla, setQuienHabla] = useState("SISTEMA"); 
    
    // Chat y Buscador
    const [chatMensaje, setChatMensaje] = useState("");
    const [chatHistory, setChatHistory] = useState([
        { type: 'bot', text: "¡Bienvenidos a Fabulosa TV! El reproductor está listo. ¿Qué éxito te gustaría escuchar hoy?" }
    ]);
    const [busqueda, setBusqueda] = useState("");

    // --- ESTADOS YOUTUBE ---
    const [currentYtId, setCurrentYtId] = useState(null);
    const [ytPlaylist, setYtPlaylist] = useState([]); 
    const [historialGlobal, setHistorialGlobal] = useState([]); 

    // --- COLAS Y REFERENCIAS ---
    const commercialQueue = useRef([]); 
    const lastMarcaTime = useRef(Date.now());
    const lastLocucionTime = useRef(Date.now());
    const contadorVideos = useRef(0);
    const modoRef = useRef(modo);
    const lastLoadedYtId = useRef(null); 
    const colaVIP = useRef([]);
    const keyIndexRef = useRef(0); 
    const primerVideoLanzado = useRef(false);
    
    // --- REFERENCIAS DOM ---
    const playerContainerRef = useRef(null);
    const videoRef = useRef(null);
    const ytPlayerRef = useRef(null);
    const audioExtraRef = useRef(new Audio());
    const chatEndRef = useRef(null);

    useEffect(() => { modoRef.current = modo; }, [modo]);
    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory]);

    // SINCRONIZADOR DE VOLUMEN
    useEffect(() => {
        if (videoRef.current) videoRef.current.volume = mute ? 0 : volume;
        if (ytPlayerRef.current && typeof ytPlayerRef.current.setVolume === 'function') {
            ytPlayerRef.current.setVolume(mute ? 0 : volume * 100);
        }
    }, [volume, mute]);

    // 🎙️ REGLA: "Dale Volumen" al inicio
    useEffect(() => {
        if (modo === "MUSICA" && !primerVideoLanzado.current) {
            const timer = setTimeout(() => {
                reproducirAudioExtra("/media/voces/Tony Garcia - dale volumen.mp3", "MP3", true);
                primerVideoLanzado.current = true;
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [modo]);

    // 🤖 BUSCADOR YOUTUBE
    const limpiarPeticion = (texto) => {
        let limpio = texto.toLowerCase();
        const palabrasBasura = ["ponme", "quiero escuchar", "busca", "reproduce", "pon", "toca"];
        palabrasBasura.forEach(palabra => limpio = limpio.replace(new RegExp(`\\b${palabra}\\b`, 'g'), '').trim());
        return limpio;
    };

    const buscarMusicaEnYouTube = async (queryCustom = null, isUserRequest = false) => {
        try {
            let terminoBusqueda = queryCustom ? limpiarPeticion(queryCustom) : "exitos latinos mas sonados salsa merengue bachata cumbia";
            let exito = false;
            let respuestaJson = null;

            while (keyIndexRef.current < YOUTUBE_API_KEYS.length && !exito) {
                const currentKey = YOUTUBE_API_KEYS[keyIndexRef.current];
                const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(terminoBusqueda + " video oficial -karaoke -live")}&type=video&videoEmbeddable=true&key=${currentKey}`;
                
                const response = await fetch(url);
                if (response.status === 403 || response.status === 429) {
                    keyIndexRef.current++; 
                } else {
                    respuestaJson = await response.json();
                    exito = true;
                }
            }

            if (exito && respuestaJson.items && respuestaJson.items.length > 0) {
                let nuevosIds = respuestaJson.items.map(item => item.id.videoId);
                const primerId = nuevosIds[0];
                const restoIds = nuevosIds.slice(1);

                if (isUserRequest) {
                    if (modoRef.current === "MUSICA") {
                        setCurrentYtId(primerId);
                        setYtPlaylist(restoIds);
                        setModo("MUSICA");
                        if (ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === 'function') {
                            ytPlayerRef.current.loadVideoById(primerId);
                            lastLoadedYtId.current = primerId;
                        }
                    } else {
                        colaVIP.current.push(primerId);
                    }
                } else {
                    setYtPlaylist(restoIds);
                    setCurrentYtId(primerId);
                    setModo("MUSICA");
                }
            } else {
                if (!queryCustom) setTimeout(() => buscarMusicaEnYouTube(), 5000);
            }
        } catch (error) {
            console.error("Error API:", error);
        }
    };

    // 🌉 PUENTE NEURONAL (Cambio de videos)
    const handleVideoEndRef = useRef();
    handleVideoEndRef.current = () => {
        switch (modoRef.current) {
            case "INTRO":
                reproducirSiguiente("MUSICA"); break;
            case "MUSICA":
                contadorVideos.current++;
                reproducirSiguiente(contadorVideos.current >= 3 ? "ID" : "MUSICA");
                break;
            case "ID":
                contadorVideos.current = 0;
                reproducirSiguiente("MUSICA"); break;
            case "ID_ENTRADA":
                if (commercialQueue.current.length > 0) {
                    setCurrentSrc(commercialQueue.current.shift());
                    setModo("COMERCIALES");
                } else {
                    setModo("ID_SALIDA"); handleVideoEndRef.current(); 
                }
                break;
            case "COMERCIALES":
                if (commercialQueue.current.length > 0) {
                    setCurrentSrc(commercialQueue.current.shift());
                } else {
                    setCurrentSrc(playlist.ids[Math.floor(Math.random() * playlist.ids.length)]);
                    setModo("ID_SALIDA");
                }
                break;
            case "ID_SALIDA":
                reproducirSiguiente("MUSICA"); break;
            default:
                reproducirSiguiente("MUSICA");
        }
    };

    // 4. REPRODUCTOR YOUTUBE
    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(tag);
            window.onYouTubeIframeAPIReady = initYTPlayer;
        } else if (!ytPlayerRef.current) initYTPlayer();

        function initYTPlayer() {
            ytPlayerRef.current = new window.YT.Player('youtube-tv-player', {
                playerVars: { autoplay: 1, controls: 0, disablekb: 1, fs: 0, rel: 0, modestbranding: 1 },
                events: {
                    'onReady': (event) => {
                        event.target.setVolume(volume * 100);
                        if (currentYtId && modoRef.current === "MUSICA") {
                            event.target.loadVideoById(currentYtId);
                            lastLoadedYtId.current = currentYtId;
                        }
                    },
                    'onStateChange': (event) => {
                        if (event.data === window.YT.PlayerState.ENDED) if (handleVideoEndRef.current) handleVideoEndRef.current();
                    },
                    'onError': () => { if (handleVideoEndRef.current) handleVideoEndRef.current(); }
                }
            });
        }
    }, []);

    useEffect(() => {
        if (modo === "MUSICA" && currentYtId && ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === 'function') {
            if (lastLoadedYtId.current !== currentYtId) {
                ytPlayerRef.current.loadVideoById(currentYtId);
                lastLoadedYtId.current = currentYtId;
            } else ytPlayerRef.current.playVideo();
        } else if (modo !== "MUSICA" && ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
            ytPlayerRef.current.pauseVideo();
        }
    }, [currentYtId, modo]);

    // 🤖 CEREBRO DE LOCUTORES Y COMERCIALES
    useEffect(() => {
        const reloj = setInterval(() => {
            const ahora = Date.now();
            const nowObj = new Date();

            if (modo === "MUSICA" && quienHabla === "SISTEMA") {
                if (nowObj.getMinutes() === 0 && nowObj.getSeconds() === 0) iniciarBloqueComercial();
                if (ahora - lastMarcaTime.current > 300000) { 
                    reproducirAudioExtra("/media/voces/sello-fabulosa.mp3", "MP3", true); 
                    lastMarcaTime.current = ahora;
                }
                if (ahora - lastLocucionTime.current > 480000 && playlist.voces.length > 0) { 
                    reproducirAudioExtra(playlist.voces[Math.floor(Math.random() * playlist.voces.length)], "MP3", true, true);
                    lastLocucionTime.current = ahora;
                }
            }
        }, 1000);
        return () => clearInterval(reloj);
    }, [modo, quienHabla]);

    const iniciarBloqueComercial = () => {
        if (playlist.ids.length > 0 && playlist.comerciales.length > 0) {
            commercialQueue.current = [...playlist.comerciales]; 
            setCurrentSrc(playlist.ids[Math.floor(Math.random() * playlist.ids.length)]);
            setModo("ID_ENTRADA");
        }
    };

    const reproducirSiguiente = (tipo) => {
        if (tipo === "MUSICA") {
            if (colaVIP.current.length > 0) {
                setCurrentYtId(colaVIP.current.shift());
                setModo("MUSICA");
            } else if (ytPlaylist.length > 0) {
                setCurrentYtId(ytPlaylist.shift());
                setModo("MUSICA");
            } else buscarMusicaEnYouTube();
        } else {
            if (playlist.ids.length > 0) {
                setCurrentSrc(playlist.ids[Math.floor(Math.random() * playlist.ids.length)]);
                setModo(tipo);
            } else reproducirSiguiente("MUSICA");
        }
    };

    // 🎙️ GESTOR DE AUDIO EXTRA (Voces Locutor)
    const reproducirAudioExtra = (url, tipo = "MP3", bajarVolumen = true, conSelloCierre = false) => {
        if (quienHabla !== "SISTEMA") return; 

        setQuienHabla("LOCUTOR");
        audioExtraRef.current.src = url;
        
        if (bajarVolumen) {
            if (videoRef.current) videoRef.current.volume = 0.2 * volume;
            if (ytPlayerRef.current && typeof ytPlayerRef.current.setVolume === 'function') ytPlayerRef.current.setVolume(20 * volume); 
        }
        
        audioExtraRef.current.play().catch(e => console.error("Error audio:", e));

        audioExtraRef.current.onended = () => {
            if (conSelloCierre) {
                audioExtraRef.current.src = "/media/voces/subele el volumen somos fabulosa play.mp3";
                audioExtraRef.current.play().catch(e => console.error(e));
                audioExtraRef.current.onended = () => finalizarAudio();
            } else finalizarAudio();
        };
    };

    const finalizarAudio = () => {
        if (videoRef.current) videoRef.current.volume = mute ? 0 : volume;
        if (ytPlayerRef.current && typeof ytPlayerRef.current.setVolume === 'function') ytPlayerRef.current.setVolume(mute ? 0 : volume * 100);
        setQuienHabla("SISTEMA");
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            playerContainerRef.current.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // --- CHAT DJ ---
    const pedirCancion = (e, peticionAleatoria = null) => {
        if (e) e.preventDefault();
        let peticion = peticionAleatoria || chatMensaje.trim();
        if (!peticion) return;

        setChatHistory(prev => [...prev, { type: 'user', text: peticion }]);
        setChatMensaje("");
        buscarMusicaEnYouTube(peticion, true);

        setTimeout(() => {
            let respuestaDJ = peticionAleatoria ? "¡Te voy a sorprender con lo más pegado! ¡Súbele!" :
                (modoRef.current !== "MUSICA" ? `¡Estamos en corte! Apenas termine suelto "${peticion}".` : 
                `¡Temazo! Ya puse "${peticion}" en pantalla. ¿Qué más escuchamos?`);
            setChatHistory(prev => [...prev, { type: 'bot', text: respuestaDJ }]);
        }, 1500);
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black text-white font-sans flex flex-col">
            <video src={FONDO_TV_VIDEO} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60 z-0"/>

            <div className="relative z-10 flex flex-col h-full p-4 md:p-6 flex-1">
                
                {/* BARRA SUPERIOR */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 bg-black/80 backdrop-blur-md p-4 rounded-3xl border border-white/10 gap-4 flex-none">
                    <div className="flex items-center gap-6 w-full md:w-auto">
                        <Link to="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-all font-black text-xs uppercase tracking-widest">
                            <ArrowLeft size={18} /> Volver
                        </Link>
                        <div className="bg-red-600 px-4 py-1 rounded-full animate-pulse flex items-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                            <span className="text-[10px] font-black uppercase tracking-tighter">En Vivo</span>
                        </div>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); if (busqueda) { pedirCancion(null, busqueda); setBusqueda(""); } }} className="w-full md:w-96 relative">
                        <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Pide tu canción o género aquí..." className="w-full bg-white/10 border border-white/20 rounded-full py-2 pl-4 pr-10 text-white placeholder-white/50 text-sm focus:border-red-500 transition-all outline-none"/>
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"><Search size={18} /></button>
                    </form>
                </div>

                {/* CONTENEDOR PRINCIPAL */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden h-full">
                    
                    {/* 📺 REPRODUCTOR DE VIDEO */}
                    <div ref={playerContainerRef} className="lg:col-span-3 relative bg-black rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group flex justify-center items-center aspect-video md:aspect-auto md:h-full">
                        
                        <video ref={videoRef} src={currentSrc} className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${modo !== "MUSICA" ? "opacity-100 z-20 pointer-events-auto" : "opacity-0 -z-10 pointer-events-none"}`} autoPlay playsInline muted={mute} onEnded={() => { if(handleVideoEndRef.current) handleVideoEndRef.current() }} onError={() => { if(handleVideoEndRef.current) handleVideoEndRef.current() }}/>
                        
                        <img src={imgReproductor} alt="Reproductor" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${modo === "MUSICA" && !currentYtId ? "opacity-100 z-15 pointer-events-auto" : "opacity-0 -z-10 pointer-events-none"}`} />
                        
                        <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${modo === "MUSICA" && currentYtId ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 -z-10 pointer-events-none"}`}>
                            <div className="absolute inset-0 z-20 w-full h-full bg-transparent pointer-events-auto" onContextMenu={(e) => e.preventDefault()}></div>
                            <div id="youtube-tv-player" className="w-full h-full scale-[1.3] pointer-events-none"></div>
                        </div>

                        <div className="absolute top-4 right-4 md:top-8 md:right-8 w-24 md:w-40 opacity-90 pointer-events-none z-50">
                            <img src={LOGO_CANAL} alt="Logo" className="w-full drop-shadow-lg" />
                        </div>

                        {/* CONTROLES OVERLAY */}
                        <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-50">
                            <div className="flex items-center gap-2 md:gap-4 bg-black/60 backdrop-blur-xl rounded-full p-2 border border-white/20 pointer-events-auto">
                                <button onClick={() => setMute(!mute)} className="p-2 hover:scale-110 transition-transform">
                                    {mute || volume === 0 ? <VolumeX size={20}/> : <Volume2 size={20}/>}
                                </button>
                                <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-16 md:w-24 h-1 bg-gray-500 rounded-lg appearance-none cursor-pointer accent-red-600"/>
                            </div>
                            <div className="flex gap-2 md:gap-4 pointer-events-auto">
                                <button className="p-3 bg-black/60 backdrop-blur-xl rounded-full border border-white/20"><Cast size={20}/></button>
                                <button onClick={toggleFullscreen} className="p-3 bg-black/60 backdrop-blur-xl rounded-full border border-white/20">
                                    {isFullscreen ? <Minimize size={20}/> : <Maximize size={20}/>}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 🤖 CABINA DJ Y FABULOSITO */}
                    <div className="lg:col-span-1 flex flex-col bg-black rounded-[1.5rem] md:rounded-[2.5rem] border border-white/20 overflow-hidden shadow-2xl h-[50vh] md:h-full relative">
                        
                        <div className="relative w-full h-32 md:h-56 flex justify-center items-center mt-2 bg-black z-20 overflow-hidden flex-none">
                             <video src={FABULOSITO_VIDEO} autoPlay loop muted playsInline className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] scale-[1.2] md:scale-125"/>
                        </div>
                        
                        <div className="relative z-10 text-center pb-2 pt-4 bg-black border-b border-white/10 -mt-4 flex-none">
                            <h2 className="text-lg md:text-xl font-black text-white italic tracking-tighter">DJ FABULOSITO</h2>
                            <div className="flex justify-center items-center gap-2 mt-1">
                                <div className={`w-2 h-2 rounded-full ${quienHabla !== 'SISTEMA' ? 'bg-green-500 animate-ping' : 'bg-gray-600'}`}></div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    {quienHabla !== 'SISTEMA' ? 'HABLANDO AL AIRE...' : 'EN ESPERA'}
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-black z-10">
                            {chatHistory.map((msg, i) => (
                                <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[90%] p-3 rounded-2xl text-[11px] font-bold tracking-tight leading-snug ${msg.type === 'user' ? 'bg-[#b00000] text-white rounded-tr-none' : 'bg-[#222] text-gray-300 border border-white/10 rounded-tl-none'}`}>{msg.text}</div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        <form onSubmit={(e) => pedirCancion(e)} className="p-3 bg-black border-t border-white/10 z-10 flex gap-2 flex-none">
                            <button type="button" onClick={() => pedirCancion(null, "Cumbias")} className="p-3 bg-white/10 rounded-xl hover:bg-white/20 text-yellow-500 transition-colors"><Dices size={18} /></button>
                            <div className="relative group flex-1">
                                <input type="text" value={chatMensaje} onChange={(e) => setChatMensaje(e.target.value)} placeholder="Salsa, Marc Anthony..." className="w-full bg-[#111] border border-white/20 rounded-xl py-3 pl-4 pr-10 text-white placeholder-gray-600 text-[12px] font-bold focus:border-[#b00000] transition-all outline-none"/>
                                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-[#b00000] hover:scale-125 transition-all"><Send size={18} /></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: #000; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }`}</style>
        </div>
    );
};

export default FabulosaTV;