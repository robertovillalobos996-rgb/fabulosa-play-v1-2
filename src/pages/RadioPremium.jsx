import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Pause, Search, Radio, LayoutGrid, Volume2, VolumeX, ShieldCheck, Globe } from "lucide-react";
import Hls from "hls.js";

// ðŸŒŽ IMPORTAMOS LA LISTA MUNDIAL
import { radiosMundo } from "../data/radios-mundo";

const VERTICAL_ADS = [
    "/publicidad_vertical/anunciete_1.png", "/publicidad_vertical/chinito_express.png", 
    "/publicidad_vertical/mexicana_1.png", "/publicidad_vertical/mexicana_2.png"
];

const RadiosPlay = () => {
  const [stations, setStations] = useState(radiosMundo);
  const [currentStation, setCurrentStation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [activeCountry, setActiveCountry] = useState("Todos");
  const [activeCategory, setActiveCategory] = useState("Todos");
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [vAdIndex, setVAdIndex] = useState(0);

  const audioRef = useRef(null);
  const hlsRef = useRef(null);

  const countries = ["Todos", ...new Set(radiosMundo.map(r => r.country).filter(Boolean))];
  const categories = ["Todos", ...new Set(radiosMundo.map(r => r.genre).filter(Boolean))];

  useEffect(() => {
      const adInterval = setInterval(() => setVAdIndex((p) => (p + 1) % VERTICAL_ADS.length), 15000);
      return () => clearInterval(adInterval);
  }, []);

  useEffect(() => {
      try { if (window.adsbygoogle) window.adsbygoogle.push({}); } catch (e) {}
  }, [vAdIndex]);

  useEffect(() => {
    let filtradas = radiosMundo;
    if (activeCountry !== "Todos") filtradas = filtradas.filter(radio => radio.country === activeCountry);
    if (activeCategory !== "Todos") filtradas = filtradas.filter(radio => radio.genre === activeCategory);
    if (searchTerm.trim() !== "") {
      filtradas = filtradas.filter(radio => 
        radio.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        radio.frequency.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setStations(filtradas);
  }, [searchTerm, activeCountry, activeCategory]);

  useEffect(() => {
    if (!currentStation || !audioRef.current) return;
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }

    const startAudio = async () => {
        try {
            if (currentStation.url.includes(".m3u8") || currentStation.isHls) {
                if (Hls.isSupported()) {
                    const hls = new Hls({ enableWorker: false });
                    hlsRef.current = hls;
                    hls.loadSource(currentStation.url);
                    hls.attachMedia(audioRef.current);
                    hls.on(Hls.Events.MANIFEST_PARSED, () => {
                        audioRef.current.play().catch(e => console.log("Carga en proceso"));
                        setIsPlaying(true);
                    });
                } else if (audioRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                    audioRef.current.src = currentStation.url;
                    audioRef.current.addEventListener('loadedmetadata', () => {
                        audioRef.current.play().catch(e => console.log(e));
                        setIsPlaying(true);
                    });
                }
            } else {
                audioRef.current.src = currentStation.url;
                await audioRef.current.play();
                setIsPlaying(true);
            }
        } catch (error) {
            console.log("Error:", error);
            setIsPlaying(false);
        }
    };
    startAudio();
    return () => { if (hlsRef.current) hlsRef.current.destroy(); };
  }, [currentStation]);

  const selectStation = (station) => {
    setCurrentStation(station);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const togglePlay = () => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseInt(e.target.value);
    setVolume(newVol);
    if (audioRef.current) audioRef.current.volume = newVol / 100;
  };

  // ðŸ›¡ï¸ GENERADOR DE LOGOS SALVAVIDAS
  const handleImageError = (e, title) => {
    e.target.onerror = null; 
    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=111&color=0ea5e9&size=128&bold=true`;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-sky-500 pb-24">
      
      <nav className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 bg-white/5 rounded-full hover:bg-sky-500 transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="text-2xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">
            FM PLAY MUNDIAL
          </h1>
        </div>
      </nav>

      <div className="w-full bg-gradient-to-b from-black/80 to-[#050505] py-8 px-6 flex justify-center border-b border-sky-500/20">
        <div className="relative w-full max-w-3xl group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none"><Search size={28} className="text-sky-400 group-focus-within:animate-pulse" /></div>
          <input type="text" placeholder="Busca tu emisora (Ej: Ke Buena, Omega)..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-black border-2 border-white/10 hover:border-sky-500/50 focus:border-sky-500 rounded-full py-5 pl-16 pr-6 text-lg font-bold text-white shadow-[0_0_30px_rgba(56,189,248,0.1)] focus:shadow-[0_0_40px_rgba(56,189,248,0.3)] transition-all outline-none placeholder-gray-500 uppercase tracking-wide" />
        </div>
      </div>

      {/* ðŸŒŽ FILTRO 1: PAÃSES */}
      <div className="w-full border-b border-white/5 bg-black/80 backdrop-blur-md sticky top-[73px] z-40">
        <div className="flex items-center gap-2 overflow-x-auto px-6 py-3 custom-scrollbar">
          <Globe size={18} className="text-gray-500 mr-2 flex-shrink-0" />
          {countries.map(pais => (
            <button key={pais} onClick={() => { setActiveCountry(pais); setSearchTerm(""); }} className={`px-5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeCountry === pais ? 'bg-blue-600 text-white border-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)] scale-105' : 'bg-transparent border-white/10 text-gray-400 hover:text-white hover:border-white/30'}`}>
              {pais}
            </button>
          ))}
        </div>
      </div>

      {/* ðŸŽµ FILTRO 2: GÃ‰NEROS */}
      <div className="w-full border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-[120px] z-30">
        <div className="flex items-center gap-2 overflow-x-auto px-6 py-3 custom-scrollbar">
          <Radio size={18} className="text-gray-500 mr-2 flex-shrink-0" />
          {categories.map(cat => (
            <button key={cat} onClick={() => { setActiveCategory(cat); setSearchTerm(""); }} className={`px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${activeCategory === cat ? 'bg-sky-500 text-black border-sky-500 shadow-[0_0_10px_rgba(56,189,248,0.4)]' : 'bg-[#111] border-white/5 text-gray-500 hover:text-white hover:border-white/20'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 px-6 pt-8 max-w-[1800px] mx-auto">
        <div className="flex-1">
            
            {/* REPRODUCTOR DE AUDIO PRINCIPAL */}
            {currentStation && (
            <div className="mb-12 animate-fade-in-down relative w-full bg-gradient-to-br from-slate-900 to-black rounded-3xl overflow-hidden border border-sky-500/30 shadow-[0_20px_50px_rgba(56,189,248,0.15)] p-8 flex flex-col md:flex-row items-center gap-8">
                <audio ref={audioRef} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
                
                {/* ðŸ“» LOGO GRANDE EN EL REPRODUCTOR */}
                <div className="relative w-40 h-40 flex-shrink-0 rounded-3xl border-4 border-sky-500/50 shadow-[0_0_30px_rgba(56,189,248,0.4)] flex items-center justify-center bg-white overflow-hidden p-2">
                    {isPlaying && <div className="absolute inset-0 bg-sky-500/20 animate-pulse"></div>}
                    <img src={currentStation.logo} alt="Logo" onError={(e) => handleImageError(e, currentStation.title)} className="w-full h-full object-contain relative z-10" />
                </div>
                
                <div className="flex-1 text-center md:text-left w-full">
                    <span className="bg-red-600/90 text-white text-[10px] font-black tracking-widest px-3 py-1.5 rounded-md shadow-lg inline-flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div> EN VIVO
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-2">{currentStation.title}</h2>
                    <p className="text-sky-400 font-bold uppercase tracking-widest mb-8">{currentStation.frequency} â€¢ {currentStation.country} â€¢ {currentStation.genre}</p>
                    <div className="flex flex-col sm:flex-row items-center gap-6 bg-black/50 p-4 rounded-2xl border border-white/5">
                        <button onClick={togglePlay} className="w-16 h-16 bg-sky-500 hover:bg-sky-400 rounded-full flex items-center justify-center text-black transition-all transform hover:scale-110 shadow-[0_0_20px_rgba(56,189,248,0.5)]">
                            {isPlaying ? <Pause size={30} fill="currentColor" /> : <Play size={30} fill="currentColor" className="ml-1" />}
                        </button>
                        <div className="flex-1 flex items-center gap-4 w-full">
                            <VolumeX size={20} className="text-gray-400" />
                            <input type="range" min="0" max="100" value={volume} onChange={handleVolumeChange} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-500" />
                            <Volume2 size={20} className="text-sky-400" />
                        </div>
                    </div>
                </div>
            </div>
            )}

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3 text-gray-200">
                    <LayoutGrid className="text-sky-500" size={24} /> 
                    <h3 className="text-xl font-black uppercase tracking-widest">
                        {searchTerm ? `Resultados` : `${activeCountry} - ${activeCategory}`}
                    </h3>
                </div>
                <span className="text-xs text-gray-500 font-bold tracking-widest">{stations.length} ENCONTRADAS</span>
            </div>

            {/* GRILLA CON TARJETAS (CARDS) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {stations.map(station => (
                <div key={station.id} onClick={() => selectStation(station)} className="group cursor-pointer relative">
                <div className={`aspect-square rounded-3xl overflow-hidden bg-zinc-900 border-2 transition-all duration-300 p-6 flex flex-col items-center justify-center gap-3 ${currentStation?.id === station.id ? 'border-sky-500 shadow-[0_0_30px_rgba(56,189,248,0.4)] scale-105' : 'border-white/5 hover:border-white/20 hover:-translate-y-2 hover:shadow-2xl'}`}>
                    
                    {/* ðŸ“» LOGO DENTRO DE LA CARD */}
                    <div className="w-20 h-20 rounded-full bg-white border-2 border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner p-2 overflow-hidden">
                        <img src={station.logo} alt={station.title} onError={(e) => handleImageError(e, station.title)} className="w-full h-full object-contain" />
                    </div>
                    
                    <div className="text-center w-full">
                        <h3 className="text-sm font-black text-white leading-tight uppercase line-clamp-2">{station.title}</h3>
                        <p className="text-[10px] text-sky-400 font-bold mt-1 tracking-widest leading-tight">
                            {station.frequency} <br/> 
                            <span className="text-gray-400 text-[9px]">{station.country}</span>
                        </p>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] bg-black/40">
                        <div className="bg-sky-500 p-3 rounded-full shadow-[0_0_20px_rgba(56,189,248,0.8)] transform scale-50 group-hover:scale-100 transition-transform duration-300"><Play fill="black" size={20} className="ml-1 text-black" /></div>
                    </div>
                </div>
                </div>
            ))}
            </div>

            {stations.length === 0 && (
            <div className="text-center mt-20 p-10 bg-zinc-900/50 rounded-3xl border border-white/5">
                <Globe className="mx-auto mb-4 text-gray-600" size={48} />
                <p className="text-gray-400 font-black uppercase tracking-widest text-lg">No encontramos emisoras.</p>
            </div>
            )}
        </div>

        {/* ANUNCIOS */}
        <div className="w-full xl:w-[350px] flex flex-col gap-8">
            <div className="h-[600px] bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl relative">
                <img src={VERTICAL_ADS[vAdIndex]} className="w-full h-full object-contain transition-all duration-1000" alt="Ad" />
            </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-15px); } to { opacity: 1; transform: translateY(0); } } 
        .animate-fade-in-down { animation: fadeInDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; } 
        .custom-scrollbar::-webkit-scrollbar { height: 6px; } 
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } 
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; } 
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #0ea5e9; }
      `}</style>
    </div>
  );
};

export default RadiosPlay;