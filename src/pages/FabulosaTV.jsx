import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Volume2, VolumeX, Maximize, Minimize, Cast, Dices, Search } from 'lucide-react';

// === CONFIGURACIÓN Y LLAVES ===
const API_URL = "http://localhost:3001"; 

// 🔑 TUS 14 LLAVES MAESTRAS DE YOUTUBE
const YOUTUBE_API_KEYS = [
    "AIzaSyDxLD8PviKQwlHBs7rmRm3GoyIKk-aQpww",
    "AIzaSyACeTldeUs5tbn2Lwr6o_6Lc48rF1nINY0",
    "AIzaSyBUk0oq1zjA6BKx5HK8DEQc1TxQqreqGtk",
    "AIzaSyBys-0J3T5Ou_fdPGxqYC5LWDMgppwD0Y4",
    "AIzaSyDHdkSo4WSHjYL4nHFU9wKmXW5D9PScO4g",
    "AIzaSyDJqDMnZsYHyJtzahtvv1r55Z-JfgLk5TU",
    "AIzaSyCruj7UZTEmElS3ZUeUBmYPecbsAA667U8",
    "AIzaSyBfMNrgQESeymMQ9srVBHKjXB3_WeRfkXE",
    "AIzaSyB1e_YSB74yAelvAhapDWu11VPLz2wBkUg",
    "AIzaSyCsvViGGiPJxx8-FkSwQvHE2T_U8d2UO5E",
    "AIzaSyBRvdUqolryjMRustJUyqN_HtkjRCbHLfI",
    "AIzaSyCdmCZW6J49Onl-QAf3cTsNu0im84EBVZc",
    "AIzaSyCeref7W3di_9o6W3YnEtqgvCQyvyQ5a5Q",
    "AIzaSyAwtE19mD7rpv1pu5nB4R8Q0HmEX9OkgJI"
];

const INTRO_SRC = "/src/assets/intro.mp4";
const FONDO_TV_VIDEO = "/src/assets/fondotv.mp4";
const FABULOSITO_VIDEO = "/src/assets/fabulosito-video.mp4";
const LOGO_CANAL = "/src/assets/logo-fabulosa.png";
import imgReproductor from '../assets/fabulosatvreproductor.png';

const FRASES_RADIO = [
    "¡Estás en Fabulosa Play!", "¡Pura vida Costa Rica!", "¡La mejor energía!",
    "¡Súbele volumen!", "¡Qué tal familia! Bienvenidos a Fabulosa TV.",
    "¡Arriba ese ánimo Costa Rica! Estamos en vivo."
];

const FabulosaTV = () => {
    // --- ESTADOS PRINCIPALES ---
    const [playlist, setPlaylist] = useState({ ids: [], comerciales: [], voces: [] });
    const [currentSrc, setCurrentSrc] = useState(INTRO_SRC);
    const [modo, setModo] = useState("INTRO"); 
    const [volume, setVolume] = useState(1);
    const [mute, setMute] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    
    // ✅ RESTAURADO: ESTADO ORIGINAL DE QUIEN HABLA
    const [quienHabla, setQuienHabla] = useState("SISTEMA"); 
    
    // Chat y Buscador
    const [chatMensaje, setChatMensaje] = useState("");
    const [chatHistory, setChatHistory] = useState([
        { type: 'bot', text: "¡Bienvenidos a Fabulosa TV! El reproductor está listo. ¿Qué éxito o género te gustaría escuchar hoy?" }
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
    
    // ✅ RESTAURADO: REFERENCIA PARA EL PRIMER VIDEO ("Dale Volumen")
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

    // 1. CARGAR MEDIOS LOCALES
    useEffect(() => {
        fetch(`${API_URL}/api/get-media-files`)
            .then(res => res.json())
            .then(data => {
                setPlaylist({ ids: data.ids || [], comerciales: data.comerciales || [], voces: data.voces || [] });
            })
            .catch(err => console.error("Error cargando medios:", err));
    }, []);

    // ✅ 2. REGLA RESTAURADA: "Dale Volumen" (4 seg al inicio de la música)
    useEffect(() => {
        if (modo === "MUSICA" && !primerVideoLanzado.current) {
            const timer = setTimeout(() => {
                reproducirAudioExtra(`${API_URL}/media/voces/Tony Garcia - dale volumen.mp3`, "MP3", true);
                primerVideoLanzado.current = true;
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [modo]);

    // 3. MOTOR DE BÚSQUEDA YOUTUBE (INTELIGENTE)
    const limpiarPeticion = (texto) => {
        let limpio = texto.toLowerCase();
        const palabrasBasura = ["ponme", "quiero escuchar", "buscame", "busca", "reproduce", "una de", "algo de", "un tema de", "pon", "toca", "por favor"];
        palabrasBasura.forEach(palabra => {
            limpio = limpio.replace(new RegExp(`\\b${palabra}\\b`, 'g'), '').trim();
        });
        return limpio;
    };

    const buscarMusicaEnYouTube = async (queryCustom = null, isUserRequest = false) => {
        try {
            let terminoBusqueda = "";
            let isGenre = false;

            if (queryCustom) {
                terminoBusqueda = limpiarPeticion(queryCustom);
                const generos = ["cumbia", "cumbias", "salsa", "merengue", "bachata", "reggaeton", "romanticas", "vallenato", "pop", "banda", "ranchera", "rancheras"];
                isGenre = generos.some(g => terminoBusqueda.includes(g));
                if (isGenre && terminoBusqueda.split(" ").length <= 3) {
                    terminoBusqueda += " exitos mas sonados del momento";
                }
            } else {
                terminoBusqueda = "exitos latinos mas sonados salsa merengue bachata cumbia romanticas reggaeton";
            }

            const fetchConFiltros = async (strict) => {
                const negativeFilters = strict ? "-letra -lyrics -karaoke -cover -audio -live -vivo -concierto -parodia" : "-karaoke -letra -lyrics";
                const q = encodeURIComponent(`${terminoBusqueda} video oficial ${negativeFilters}`);
                
                let respuestaJson = null;
                let exito = false;

                while (keyIndexRef.current < YOUTUBE_API_KEYS.length && !exito) {
                    const currentKey = YOUTUBE_API_KEYS[keyIndexRef.current];
                    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${isGenre || !queryCustom ? 30 : 15}&q=${q}&type=video&videoCategoryId=10&videoEmbeddable=true&key=${currentKey}`;
                    if (strict) url += "&videoDefinition=high";
                    
                    const response = await fetch(url);
                    if (response.status === 403 || response.status === 429) {
                        keyIndexRef.current++; 
                    } else {
                        respuestaJson = await response.json();
                        exito = true;
                    }
                }
                return exito ? respuestaJson : { error403: true };
            };

            let data = await fetchConFiltros(true);

            if (data.error403) return; 

            if (!data.items || data.items.length === 0) data = await fetchConFiltros(false);

            if (data.items && data.items.length > 0) {
                let nuevosIds = data.items.map(item => item.id.videoId);
                nuevosIds = nuevosIds.filter(id => !historialGlobal.includes(id));
                
                if (nuevosIds.length === 0) {
                    nuevosIds = data.items.map(item => item.id.videoId);
                    setHistorialGlobal([]);
                }

                if (!queryCustom || isGenre) nuevosIds = nuevosIds.sort(() => Math.random() - 0.5);

                const primerId = nuevosIds[0];
                const restoIds = nuevosIds.slice(1);
                setHistorialGlobal(prev => [...prev, primerId]);

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
                    if (ytPlaylist.length === 0) {
                        setCurrentYtId(primerId);
                        setYtPlaylist(restoIds);
                        setModo("MUSICA");
                    } else {
                        setYtPlaylist(prev => [...prev, ...nuevosIds]);
                    }
                }
            } else {
                if (!queryCustom) setTimeout(() => buscarMusicaEnYouTube(), 10000); 
            }
        } catch (error) {
            console.error("Error API:", error);
        }
    };

    // 🌉 PUENTE NEURONAL
    const handleVideoEndRef = useRef();
    handleVideoEndRef.current = () => {
        switch (modoRef.current) {
            case "INTRO":
                reproducirSiguiente("MUSICA");
                break;
            case "MUSICA":
                contadorVideos.current++;
                if (contadorVideos.current >= 3) {
                    reproducirSiguiente("ID");
                } else {
                    reproducirSiguiente("MUSICA");
                }
                break;
            case "ID":
                contadorVideos.current = 0;
                reproducirSiguiente("MUSICA");
                break;
            case "ID_ENTRADA":
                if (commercialQueue.current.length > 0) {
                    const nextComercial = commercialQueue.current.shift();
                    setCurrentSrc(`${API_URL}${nextComercial}`);
                    setModo("COMERCIALES");
                } else {
                    setModo("ID_SALIDA"); 
                    handleVideoEndRef.current(); 
                }
                break;
            case "COMERCIALES":
                if (commercialQueue.current.length > 0) {
                    const nextComercial = commercialQueue.current.shift();
                    setCurrentSrc(`${API_URL}${nextComercial}`);
                } else {
                    const idSalida = playlist.ids[Math.floor(Math.random() * playlist.ids.length)];
                    setCurrentSrc(`${API_URL}${idSalida}`);
                    setModo("ID_SALIDA");
                }
                break;
            case "ID_SALIDA":
                reproducirSiguiente("MUSICA");
                break;
            default:
                reproducirSiguiente("MUSICA");
        }
    };

    // 4. REPRODUCTOR DE YOUTUBE
    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            window.onYouTubeIframeAPIReady = initYTPlayer;
        } else if (!ytPlayerRef.current) {
            initYTPlayer();
        }

        function initYTPlayer() {
            ytPlayerRef.current = new window.YT.Player('youtube-tv-player', {
                playerVars: { autoplay: 1, controls: 0, disablekb: 1, fs: 0, rel: 0, modestbranding: 1, origin: window.location.origin },
                events: {
                    'onReady': (event) => {
                        event.target.setVolume(volume * 100);
                        if (currentYtId && modoRef.current === "MUSICA") {
                            event.target.loadVideoById(currentYtId);
                            lastLoadedYtId.current = currentYtId;
                        }
                    },
                    'onStateChange': (event) => {
                        if (event.data === window.YT.PlayerState.ENDED) {
                            if (handleVideoEndRef.current) handleVideoEndRef.current(); 
                        }
                    },
                    'onError': (event) => {
                        if (handleVideoEndRef.current) handleVideoEndRef.current();
                    }
                }
            });
        }
    }, []);

    useEffect(() => {
        if (modo === "MUSICA" && currentYtId && ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === 'function') {
            if (lastLoadedYtId.current !== currentYtId) {
                ytPlayerRef.current.loadVideoById(currentYtId);
                lastLoadedYtId.current = currentYtId;
            } else {
                ytPlayerRef.current.playVideo();
            }
        } else if (modo !== "MUSICA" && ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
            ytPlayerRef.current.pauseVideo();
        }
    }, [currentYtId, modo]);

    // ✅ 5. CEREBRO DE AUTOMATIZACIÓN RESTAURADO (Depende de quienHabla === "SISTEMA")
    useEffect(() => {
        const reloj = setInterval(() => {
            const ahora = Date.now();
            const nowObj = new Date();

            // Solo ejecuta automatizaciones de voz si el sistema está libre
            if (modo === "MUSICA" && quienHabla === "SISTEMA") {
                if (nowObj.getMinutes() === 0 && nowObj.getSeconds() === 0) {
                    iniciarBloqueComercial();
                }
                
                // --- SELLO ---
                if (ahora - lastMarcaTime.current > 300000) { 
                    reproducirAudioExtra(`${API_URL}/media/voces/sello-fabulosa.mp3`, "MP3", true); 
                    lastMarcaTime.current = ahora;
                }
                
                // --- LOCUCIÓN ---
                if (ahora - lastLocucionTime.current > 480000) { 
                    if (playlist.voces.length > 0) {
                        const vozRandom = playlist.voces[Math.floor(Math.random() * playlist.voces.length)];
                        // Aquí usa la concatenación original "conSelloCierre" = true
                        reproducirAudioExtra(`${API_URL}${vozRandom}`, "MP3", true, true);
                        lastLocucionTime.current = ahora;
                    }
                }
            }
        }, 1000);
        return () => clearInterval(reloj);
    }, [modo, quienHabla, playlist]);

    const iniciarBloqueComercial = () => {
        if (playlist.ids.length > 0 && playlist.comerciales.length > 0) {
            const idEntrada = playlist.ids[Math.floor(Math.random() * playlist.ids.length)];
            commercialQueue.current = [...playlist.comerciales]; 
            setCurrentSrc(`${API_URL}${idEntrada}`);
            setModo("ID_ENTRADA");
        }
    };

    const reproducirSiguiente = (tipo) => {
        if (tipo === "MUSICA") {
            if (colaVIP.current.length > 0) {
                const nextId = colaVIP.current.shift(); 
                setHistorialGlobal(prev => [...prev, nextId]);
                setCurrentYtId(nextId);
                setModo("MUSICA");
            } 
            else if (ytPlaylist.length > 0) {
                const nextId = ytPlaylist[0];
                setYtPlaylist(prev => prev.slice(1));
                setHistorialGlobal(prev => [...prev, nextId]);
                setCurrentYtId(nextId);
                setModo("MUSICA");
            } 
            else {
                setCurrentYtId(null);
                setModo("MUSICA");
            }
        } else {
            const lista = playlist.ids; 
            if (lista && lista.length > 0) {
                const randomIdx = Math.floor(Math.random() * lista.length);
                setCurrentSrc(`${API_URL}${lista[randomIdx]}`);
                setModo(tipo);
            } else {
                reproducirSiguiente("MUSICA");
            }
        }
    };

    // ✅ GESTOR DE AUDIO EXTRA RESTAURADO AL 100%
    const reproducirAudioExtra = (url, tipo = "MP3", bajarVolumen = true, conSelloCierre = false) => {
        if (quienHabla !== "SISTEMA") return; 

        setQuienHabla(tipo);
        audioExtraRef.current.src = url;
        
        // Baja el volumen a ambas fuentes
        if (bajarVolumen) {
            if (videoRef.current) videoRef.current.volume = 0.2 * volume;
            if (ytPlayerRef.current && typeof ytPlayerRef.current.setVolume === 'function') {
                ytPlayerRef.current.setVolume(20 * volume); 
            }
        }
        
        audioExtraRef.current.play().catch(e => console.error("Error audio:", e));

        audioExtraRef.current.onended = () => {
            if (conSelloCierre) {
                audioExtraRef.current.src = `${API_URL}/media/voces/subele el volumen somos fabulosa play.mp3`;
                audioExtraRef.current.play().catch(e => console.error(e));
                audioExtraRef.current.onended = () => finalizarAudio();
            } else {
                finalizarAudio();
            }
        };
    };

    // ✅ FINALIZAR AUDIO (Restaura volúmenes originales y el estado)
    const finalizarAudio = () => {
        if (videoRef.current) videoRef.current.volume = mute ? 0 : volume;
        if (ytPlayerRef.current && typeof ytPlayerRef.current.setVolume === 'function') {
            ytPlayerRef.current.setVolume(mute ? 0 : volume * 100);
        }
        setQuienHabla("SISTEMA");
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            playerContainerRef.current.requestFullscreen().catch(err => console.log(err));
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
            let respuestaDJ = "";
            
            if (peticionAleatoria) {
                respuestaDJ = "¡Dejámelo a mí! Te voy a sorprender con lo más pegado de la radio. ¡Súbele!";
            } else {
                if (modoRef.current !== "MUSICA") {
                    respuestaDJ = `¡Lo tengo! Estamos en un pequeño corte comercial, pero apenas termine arranco de una con "${peticion}". ¡No te despegues, ya está en fila!`;
                } else {
                    const terminoLimpio = limpiarPeticion(peticion);
                    const generos = ["cumbia", "salsa", "merengue", "bachata", "reggaeton", "romanticas", "pop", "banda", "ranchera"];
                    const isGenre = generos.some(g => terminoLimpio.includes(g));

                    if (isGenre) {
                        respuestaDJ = `¡Claro que sí! Aquí te va un bloque especial con lo mejor en ${peticion}. ¡A disfrutar en Fabulosa Play!`;
                    } else {
                        const plantillas = [
                            "¡Uff, temazo! Ya te puse en pantalla '{song}'. ¿Con qué más seguimos?",
                            "¡Complaciendo a nuestra audiencia! Sonando '{song}'. ¡Fabulosa Play no falla!",
                            "¡Esa suena durísimo! Aquí tienes '{song}'. ¡Súbele al volumen!",
                            "¡Excelente elección! Disfruta '{song}'. ¿Algún otro saludo o canción?"
                        ];
                        respuestaDJ = plantillas[Math.floor(Math.random() * plantillas.length)].replace('{song}', peticion);
                    }
                }
            }

            setChatHistory(prev => [...prev, { type: 'bot', text: respuestaDJ }]);
        }, 1500);
    };

    const programarCancionBuscador = (e) => {
        e.preventDefault();
        if (busqueda.trim() !== "") {
            pedirCancion(null, busqueda);
            setBusqueda("");
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black text-white font-sans">
            <video src={FONDO_TV_VIDEO} autoPlay loop muted className="absolute inset-0 w-full h-full object-cover opacity-60 z-0"/>

            <div className="relative z-10 flex flex-col h-screen p-4 md:p-6">
                
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 bg-black/80 backdrop-blur-md p-4 rounded-3xl border border-white/10 gap-4">
                    <div className="flex items-center gap-6 w-full md:w-auto">
                        <Link to="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-all font-black text-xs uppercase tracking-widest">
                            <ArrowLeft size={18} /> Volver
                        </Link>
                        <div className="bg-red-600 px-4 py-1 rounded-full animate-pulse flex items-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                            <span className="text-[10px] font-black uppercase tracking-tighter">En Vivo</span>
                        </div>
                    </div>

                    <form onSubmit={programarCancionBuscador} className="w-full md:w-96 relative">
                        <input 
                            type="text" 
                            value={busqueda} 
                            onChange={(e) => setBusqueda(e.target.value)} 
                            placeholder="Pide tu canción o género aquí..." 
                            className="w-full bg-white/10 border border-white/20 rounded-full py-2 pl-4 pr-10 text-white placeholder-white/50 text-sm focus:border-red-500 transition-all outline-none"
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors">
                            <Search size={18} />
                        </button>
                    </form>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden mb-2">
                    
                    <div ref={playerContainerRef} className="lg:col-span-3 relative bg-black rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group flex justify-center items-center">
                        
                        <video 
                            ref={videoRef} 
                            src={currentSrc} 
                            className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${modo !== "MUSICA" ? "opacity-100 z-20 pointer-events-auto" : "opacity-0 -z-10 pointer-events-none"}`} 
                            autoPlay 
                            muted={mute} 
                            onEnded={() => { if(handleVideoEndRef.current) handleVideoEndRef.current() }}
                            onError={() => { if(handleVideoEndRef.current) handleVideoEndRef.current() }}
                        />

                        <img 
                            src={imgReproductor} 
                            alt="Reproductor Fabulosa" 
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${modo === "MUSICA" && !currentYtId ? "opacity-100 z-15 pointer-events-auto" : "opacity-0 -z-10 pointer-events-none"}`} 
                        />
                        
                        <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${modo === "MUSICA" && currentYtId ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 -z-10 pointer-events-none"}`}>
                            <div 
                                className="absolute inset-0 z-20 w-full h-full bg-transparent cursor-default pointer-events-auto"
                                onContextMenu={(e) => e.preventDefault()}
                            ></div>
                            <div id="youtube-tv-player" className="w-full h-full scale-[1.3] pointer-events-none"></div>
                        </div>

                        <div className="absolute top-8 right-8 w-32 md:w-40 opacity-90 pointer-events-none z-50">
                            <img src={LOGO_CANAL} alt="Logo" className="w-full drop-shadow-lg" />
                        </div>

                        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-50">
                            <div className="flex items-center gap-4 bg-black/60 backdrop-blur-xl rounded-full p-2 border border-white/20 pointer-events-auto">
                                <button onClick={() => setMute(!mute)} className="p-2 hover:scale-110 transition-transform">
                                    {mute || volume === 0 ? <VolumeX size={24}/> : <Volume2 size={24}/>}
                                </button>
                                <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-24 h-1 bg-gray-500 rounded-lg appearance-none cursor-pointer accent-red-600"/>
                            </div>
                            <div className="flex gap-4 pointer-events-auto">
                                <button className="p-4 bg-black/60 backdrop-blur-xl rounded-full border border-white/20"><Cast size={24}/></button>
                                <button onClick={toggleFullscreen} className="p-4 bg-black/60 backdrop-blur-xl rounded-full border border-white/20">
                                    {isFullscreen ? <Minimize size={24}/> : <Maximize size={24}/>}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 flex flex-col bg-black rounded-[2.5rem] border border-white/20 overflow-hidden shadow-2xl h-full relative">
                        <div className="relative w-full h-64 flex justify-center items-center mt-4 bg-black z-20">
                             <video src={FABULOSITO_VIDEO} autoPlay loop muted className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] scale-125"/>
                        </div>
                        
                        {/* ✅ RESTAURADO: INTERFAZ ORIGINAL DINÁMICA (EN LA CABINA / EN ESPERA) */}
                        <div className="relative z-10 text-center pb-3 pt-6 bg-black border-b border-white/10 -mt-6">
                            <h2 className="text-xl font-black text-white italic tracking-tighter">DJ FABULOSA</h2>
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
                                    <div className={`max-w-[90%] p-3 rounded-2xl text-[11px] font-bold tracking-tight leading-snug ${
                                        msg.type === 'user' ? 'bg-[#b00000] text-white rounded-tr-none' : 'bg-[#222] text-gray-300 border border-white/10 rounded-tl-none'
                                    }`}>{msg.text}</div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>
                        <form onSubmit={(e) => pedirCancion(e)} className="p-4 bg-black border-t border-white/10 z-10 flex gap-2">
                            <button type="button" onClick={() => pedirCancion(null, "Cumbias")} className="p-4 bg-white/10 rounded-xl hover:bg-white/20 text-yellow-500 transition-colors" title="¡Ponme lo más sonado!">
                                <Dices size={20} />
                            </button>
                            <div className="relative group flex-1">
                                <input type="text" value={chatMensaje} onChange={(e) => setChatMensaje(e.target.value)} placeholder="Ej: Salsa, Marc Anthony..." className="w-full bg-[#111] border border-white/20 rounded-xl py-4 pl-4 pr-12 text-white placeholder-gray-600 text-[12px] font-bold focus:border-[#b00000] transition-all outline-none"/>
                                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b00000] hover:scale-125 transition-all">
                                    <Send size={20} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #000; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default FabulosaTV;