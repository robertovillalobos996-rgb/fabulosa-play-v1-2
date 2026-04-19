import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
// Importaciones de React Router y Lucide Icons (se usarán en ambos modos)
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Radio, Tv, Globe, Megaphone, Lock, Crown } from 'lucide-react';

// --- 🔥 EL ARREGLO DEL BUILD DURO Y SAGRADO ---
// Usamos { canalesTV } (importación nombrada) y la ruta correcta que nos diste.
// IMPORTANTE: Asegúrate de que el archivo canales_finales.js esté en src/data/
import { canalesTV } from "../data/canales_finales.js";
// --- FIN DEL ARREGLO DEL BUILD ---


// =========================================================================
// --- 🩺 EL ÓRGANO VIP SAGRADO (COMPONENTE INTERNO) ---
// Definimos todo el VIP aquí adentro para no crear archivos nuevos.
// Contiene la lógica blindada y las 21 VOCES COMPLETAS.
// =========================================================================
const FabulosaVipPlayerInterno = ({ BACK_LINK }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const videoRefVip = useRef(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const audioPoolRefVip = useRef(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isPlayingVip, setIsPlayingVip] = useState(false);

    // 📡 SEÑAL DE FABULOSA (HLS AUDIO - del archivo canales_finales.js)
    const STREAM_URL_VIP = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8";

    // 🎙️ LA ARTILLERÍA COMPLETA, SAGRADA Y ACTUALIZADA: LOS 21 LOCUTORES (No tocar)
    const LOCUTORES_POOL_VIP = [
        "/media/voces/miguel-voz-lenta.mp3",
        "/media/voces/rosalia-1.mp3",
        "/media/voces/rosalia-2.mp3",
        "/media/voces/rosalia-3.mp3",
        "/media/voces/claus-encant-bueno.mp3",
        "/media/voces/ElevenLabs_2026-04-19T17_23_11_Zabra - Energetic and Engaging Announcer_pvc_sp103_s100_sb100_se0_b_m2.mp3",
        "/media/voces/ElevenLabs_2026-04-19T17_24_42_Juan Carlos - Confident and Upbeat_pvc_sp100_s50_sb75_se0_b_m2.mp3",
        "/media/voces/ElevenLabs_2026-04-19T17_26_19_Cesar Rodriguez - Young and Energetic_pvc_sp100_s50_sb68_se0_b_m2.mp3",
        "/media/voces/ElevenLabs_2026-04-19T17_27_29_Cesar Rodriguez - Young and Energetic_pvc_sp100_s50_sb68_se0_b_m2.mp3",
        "/media/voces/ElevenLabs_2026-04-19T17_29_50_Claus Encant - Motivational and Urgent_pvc_sp109_s50_sb100_se0_b_m2.mp3",
        "/media/voces/ElevenLabs_2026-04-19T17_31_12_Cesar Rodriguez - Young and Energetic_pvc_sp100_s50_sb68_se0_b_m2.mp3",
        "/media/voces/ElevenLabs_2026-04-19T17_35_30_Sandra - Dynamic, Engaging and Energetic_pvc_sp108_s50_sb100_se0_b_m2.mp3",
        "/media/voces/ElevenLabs_2026-04-19T17_37_14_Cesar Rodriguez - Young and Energetic_pvc_sp100_s50_sb68_se0_b_m2.mp3",
        "/media/voces/ElevenLabs_2026-04-19T17_38_50_Zabra - Energetic and Engaging Announcer_pvc_sp103_s100_sb100_se0_b_m2.mp3",
        "/media/voces/inicio.mp3",
        "/media/voces/miguel-bienvenidos.mp3",
        "/media/voces/tony-garcia-dale-volumen.mp3",
        "/media/voces/tony-garcia-que-buena-nota.mp3",
        "/media/voces/tony-garcia-saludos-amas-de-casa.mp3",
        "/media/voces/tony-garcia-chat-en-vivo.mp3",
        "/media/voces/tony-garcia-chat-interactivo.mp3"
    ];

    // 📱 DATOS DE CONTACTO (SAGRADOS)
    const CONTACTO_VIP = {
        whatsapp: "https://wa.me/50664035313",
        email: "mailto:fabulosaplay@gmail.com",
        web: "https://www.fabulosaplay.online"
    };

    // 🎚️ LÓGICA COMPLETA DEL MIXER (DUCKING)
    const playMixerAudioVip = (path, duckVolume) => {
        if (!isPlayingVip || !audioPoolRefVip.current || !videoRefVip.current) return;
        if (!audioPoolRefVip.current.paused) return; 

        console.log("Reproduciendo: " + path);
        audioPoolRefVip.current.src = path;
        
        // 1. BAJA LA MÚSICA AL NIVEL SOLICITADO (Efecto Mixer)
        videoRefVip.current.volume = duckVolume;
        
        // 2. DISPARA EL AUDIO DE LA VOZ
        audioPoolRefVip.current.play().catch(e => {
            console.error("Error de audio:", e);
            videoRefVip.current.volume = 1; 
        });

        // 3. CUANDO TERMINA EL LOCUTOR, SUBE LA MÚSICA AL 100% (Efecto Mixer)
        audioPoolRefVip.current.onended = () => {
          if (videoRefVip.current) videoRefVip.current.volume = 1;
        };
    };

    // 🕒 LÓGICA COMPLETA DE TEMPORIZADORES AUTOMÁTICOS (24/7 sin parar)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (!isPlayingVip) return;

        // Sello de confirmación inicial a los 2 segundos
        setTimeout(() => playMixerAudioVip("/media/voces/sello-fabulosa.mp3", 0.8), 2000);

        // 1. LOCUTORES (15 min) -> Música al 20%
        const timerLocutoresVip = setInterval(() => {
        const trackVip = LOCUTORES_POOL_VIP[Math.floor(Math.random() * LOCUTORES_POOL_VIP.length)];
        playMixerAudioVip(trackVip, 0.2);
        }, 900000);

        // 2. SELLO FABULOSA (4 min) -> Música al 80%
        const timerSelloVip = setInterval(() => {
        playMixerAudioVip("/media/voces/sello-fabulosa.mp3", 0.8);
        }, 240000);

        // 3. SUBELE VOLUMEN (7 min) -> Música al 75%
        const timerSubeleVip = setInterval(() => {
        playMixerAudioVip("/media/voces/subele-volumen.mp3", 0.75);
        }, 420000);

        // Cleanup de temporizadores
        return () => {
            clearInterval(timerLocutoresVip);
            clearInterval(timerSelloVip);
            clearInterval(timerSubeleVip);
        };
    }, [isPlayingVip]);

    // 📺 LÓGICA COMPLETA DE CARGA TV HLS (Usando hls.js cargado dinámicamente)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const loadHLSVip = () => {
          if (window.Hls && window.Hls.isSupported()) {
            const hlsVip = new window.Hls();
            hlsVip.loadSource(STREAM_URL_VIP);
            hlsVip.attachMedia(videoRefVip.current);
            hlsVip.on(window.Hls.Events.MANIFEST_PARSED, () => { if(isPlayingVip) videoRefVip.current.play(); });
          }
        };
        if (window.Hls) { loadHLSVip(); }
        else {
            const scriptVip = document.createElement('script');
            scriptVip.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
            scriptVip.onload = loadHLSVip;
            document.body.appendChild(scriptVip);
        }
    }, [isPlayingVip]);

    const togglePlayVip = () => {
        if (isPlayingVip) videoRefVip.current.pause();
        else videoRefVip.current.play();
        setIsPlayingVip(!isPlayingVip);
    };

    // --- RENDERIZADO COMPLETO DE LA PÁGINA VIP (Mismo diseño sagrado) ---
    return (
        <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans relative">
            
            {/* 🎬 FONDO DE VIDEO YOUTUBE (Loop Infinito, Máxima Resolución) */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <iframe 
                className="w-[300%] h-[300%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                src="https://www.youtube.com/embed/JQczw3V7St8?autoplay=1&mute=1&loop=1&playlist=JQczw3V7St8&controls=0&modestbranding=1&rel=0"
                frameBorder="0" allow="autoplay; encrypted-media"
                />
                <div className="absolute inset-0 bg-black/50" />
            </div>

            <nav className="relative z-50 p-6 flex items-center justify-between border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0">
                {/* Volver a /canales-play (BACK_LINK prop) */}
                <Link to={BACK_LINK} className="p-3 bg-white/5 rounded-full hover:bg-yellow-500 hover:text-black transition-all">
                    <ArrowLeft size={24} />
                </Link>
                {/* Botón Manual de Sello */}
                <button onClick={() => playMixerAudioVip("/media/voces/sello-fabulosa.mp3", 0.7)} className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full font-black uppercase text-xs shadow-lg shadow-blue-500/20">
                    <Megaphone size={16} /> Sonar Sello ID
                </button>
            </nav>

            <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* LADO IZQUIERDO: LOGO Y CONTROLES */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                {/* Logo Fabulosa Gigante (max-w-[400px]) */}
                <div className="bg-zinc-900/80 p-6 rounded-[3rem] border border-white/10 shadow-2xl flex justify-center items-center backdrop-blur-md">
                    <img src="/logo-fabulosa.png" alt="Fabulosa" className="w-full max-w-[400px] object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform duration-500" />
                </div>

                {/* Controles de Radio */}
                <div className="bg-gradient-to-br from-zinc-900/90 to-black/90 p-8 rounded-[2rem] border border-white/10 shadow-2xl backdrop-blur-md">
                    <div className="flex items-center gap-4 mb-6">
                    <Radio className="text-yellow-500" size={30} />
                    <h2 className="text-xl font-black uppercase tracking-widest text-yellow-500">Radio VIP</h2>
                    </div>
                    
                    {/* Elemento de Audio Oculto para el Mixer */}
                    <audio ref={audioPoolRefVip} className="hidden" />

                    <button onClick={togglePlayVip} className="w-full py-4 rounded-full font-black uppercase bg-yellow-500 text-black shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-3">
                    {isPlayingVip ? <Pause fill="black" /> : <Play fill="black" />}
                    {isPlayingVip ? "PAUSAR SEÑAL" : "ENCENDER RADIO"}
                    </button>
                </div>

                {/* ICONOS SOCIALES ANIMADOS ORIGINALES RELLENADOS (Mantenemos movimiento y colores) */}
                <div className="flex gap-4 justify-center">
                    
                    {/* WhatsApp */}
                    <a href={CONTACTO_VIP.whatsapp} target="_blank" rel="noopener noreferrer" 
                    className="flex-1 bg-zinc-900/80 p-4 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors shadow-lg border border-white/5 text-center group">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="#25D366" className="animate-bounce group-hover:scale-110 transition-transform">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    </a>

                    {/* Gmail */}
                    <a href={CONTACTO_VIP.email} target="_blank" rel="noopener noreferrer"
                    className="flex-1 bg-zinc-900/80 p-4 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors shadow-lg border border-white/5 text-center group">
                    <svg viewBox="0 0 24 24" width="32" height="32" className="animate-bounce group-hover:scale-110 transition-transform" style={{animationDelay: "100ms"}}>
                        <path fill="#EA4335" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 8.414l8.073-4.921c1.618-1.214 3.927-.059 3.927 1.964Z"/><path fill="#34A853" d="M18.545 21h3.819C23.268 21 24 20.268 24 19.366V11.73l-5.455 4.091v5.18Z"/><path fill="#FBBC05" d="M24 5.457v6.273L18.545 15.82v-5.18l5.455-4.091Z"/><path fill="#4285F4" d="M0 5.457v6.273L5.455 15.82v-5.18L0 11.73Z"/><path fill="#C5221F" d="M0 11.73v7.636C0 20.268.732 21 1.636 21h3.819v-5.18L0 15.82Z"/>
                    </svg>
                    </a>

                    {/* Web */}
                    <a href={CONTACTO_VIP.web} target="_blank" rel="noopener noreferrer"
                    className="flex-1 bg-zinc-900/80 p-4 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors shadow-lg border border-white/5 text-center group">
                    <Globe size={32} color="#4285F4" className="animate-bounce group-hover:scale-110 transition-transform" style={{animationDelay: "200ms"}} />
                    </a>

                </div>
                </div>

                {/* LADO DERECHO: TELEVISOR TV VIP */}
                <div className="lg:col-span-8 flex flex-col">
                    <div className="flex items-center gap-3 mb-6 px-4"><Tv className="text-blue-500" size={28} /><h2 className="text-2xl font-black uppercase tracking-widest text-white">Fabulosa TV VIP</h2></div>
                    {/* Reproductor de Video (Señal de TV/Radio) */}
                    <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden border border-white/10 bg-black/80 shadow-2xl backdrop-blur-sm">
                        <video ref={videoRefVip} controls className="w-full h-full object-cover" poster="/logo-fabulosa.png" />
                    </div>
                </div>

            </div>
        </div>
    );
};
// =========================================================================
// --- 🩺 FIN DEL ÓRGANO VIP SAGRADO (COMPONENTE INTERNO) ---
// =========================================================================



const PlayChannelPage = () => {
  const { channelId } = useParams(); // Saca el id de la URL (ej: fabulosa-tv-vip)
  const BACK_LINK_TV = "/canales-tv"; // Enlace para volver a la card de canales

  // --- 🔥 PASO 3: Consolidación de Variables ---
  // Buscamos el canal en la base de datos usando canalesTV (variable de línea 7)
  const canal = canalesTV.find(c => c.id === channelId);
  // --- FIN DE LA CONSOLIDACIÓN ---

  // SI NO EXISTE EL CANAL (Seguridad)
  if (!canal) {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center font-black uppercase tracking-widest text-3xl">
            Canal no encontrado
        </div>
    );
  }

  // =========================================================================
  // --- 🔥 LA GRAN CIRUGÍA: IMPLANTACIÓN VIP SAGRADA ---
  // Detectamos si el ID del canal es el disparador 'fabulosa-tv-vip'
  // =========================================================================
  if (canal.id === 'fabulosa-tv-vip') {
    // Si es el VIP, llamamos al componente interno que definimos arriba.
    // Le pasamos el enlace de vuelta correcto para canales_tv.
    return (
        <FabulosaVipPlayerInterno BACK_LINK={BACK_LINK_TV} />
    );
  }
  // =========================================================================
  // --- 🔥 FIN DE LA CIRUGÍA VIP SAGRADA ---
  // =========================================================================



  // --- REPRODUCTOR GENÉRICO PARA EL RESTO DE CANALES ---
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const videoRefNormal = useRef(null);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // Si es el VIP, esta lógica no se ejecuta (ya salimos arriba con el return)
    const loadHLSNormal = () => {
      if (window.Hls && window.Hls.isSupported()) {
        const hlsNormal = new window.Hls();
        hlsNormal.loadSource(canal.url);
        hlsNormal.attachMedia(videoRefNormal.current);
        hlsNormal.on(window.Hls.Events.MANIFEST_PARSED, () => {
            videoRefNormal.current.play().catch(e => {
                console.error("Autoplay genérico bloqueado");
                // Intenta muted autoplay si falla el normal
                videoRefNormal.current.muted = true;
                videoRefNormal.current.play().catch(e => console.error("Muted autoplay también bloqueado"));
            });
        });
      } else if (videoRefNormal.current?.canPlayType('application/vnd.apple.mpegurl')) {
        videoRefNormal.current.src = canal.url;
      }
    };

    if (window.Hls) { loadHLSNormal(); }
    else {
        const scriptNormal = document.createElement('script');
        scriptNormal.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
        scriptNormal.onload = loadHLSNormal;
        document.body.appendChild(scriptNormal);
    }
  }, [canal.url, canal.id]);

  // --- RENDERIZADO GENÉRICO (Su diseño original para canales normales) ---
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans relative">
      <nav className="relative z-50 p-6 flex items-center justify-between border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0">
        <Link to={BACK_LINK_TV} className="p-3 bg-white/5 rounded-full hover:bg-yellow-500 hover:text-black transition-all">
          <ArrowLeft size={24} />
        </Link>
        <span className="font-black uppercase tracking-widest text-sm text-yellow-500">{canal.name}</span>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-12">
        <div className="bg-zinc-900 rounded-[2rem] border border-white/10 p-6 flex items-center gap-6 mb-8 shadow-2xl backdrop-blur-sm">
            <img src={canal.logo} alt={canal.name} className="w-20 h-20 object-contain rounded-xl drop-shadow-lg" />
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">{canal.name}</h1>
        </div>
        
        {/* Reproductor de Video Normal */}
        <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden border border-white/10 bg-black/80 shadow-2xl backdrop-blur-sm">
            <video ref={videoRefNormal} controls className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default PlayChannelPage;