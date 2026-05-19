import { useEffect, useState } from "react";

export default function AdminCamaras() {
  const [tab, setTab] = useState("camaras"); // 'camaras', 'publicidad' o 'envivo'
  const [cameras, setCameras] = useState([]);
  const [ads, setAds] = useState([]);
  
  // Estados para Cámaras
  const [name, setName] = useState("");
  const [tipo, setTipo] = useState("youtube");
  const [src, setSrc] = useState("");

  // Estados para Publicidad
  const [adUrl, setAdUrl] = useState("");
  const [adType, setAdType] = useState("image");

  // Estados para Transmisiones Especiales en Vivo
  const [liveEvent, setLiveEvent] = useState({ active: false, name: "", tipo: "youtube", src: "" });
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("youtube");
  const [eventSrc, setEventSrc] = useState("");

  useEffect(() => {
    const savedCams = localStorage.getItem("camaras-play");
    const savedAds = localStorage.getItem("ads-camaras");
    const savedLive = localStorage.getItem("envivo-play");
    
    if (savedCams) setCameras(JSON.parse(savedCams));
    if (savedAds) setAds(JSON.parse(savedAds));
    if (savedLive) {
      const parsedLive = JSON.parse(savedLive);
      setLiveEvent(parsedLive);
      setEventName(parsedLive.name);
      setEventType(parsedLive.tipo);
      setEventSrc(parsedLive.src);
    }
  }, []);

  const saveCameras = (cams) => {
    setCameras(cams);
    localStorage.setItem("camaras-play", JSON.stringify(cams));
    window.dispatchEvent(new Event("storage"));
  };

  const saveAds = (newAds) => {
    setAds(newAds);
    try {
      localStorage.setItem("ads-camaras", JSON.stringify(newAds));
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      alert("⚠️ Archivo muy pesado. Usa la opción de URL para recursos grandes.");
      setAds(ads); 
    }
  };

  const saveLiveEvent = (data) => {
    setLiveEvent(data);
    localStorage.setItem("envivo-play", JSON.stringify(data));
    window.dispatchEvent(new Event("storage"));
  };

  const getYoutubeId = (url) => {
    try {
      const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
      return (match && match[2].length === 11) ? match[2] : null;
    } catch { return null; }
  };

  const getYoutubeThumb = (url) => {
    const id = getYoutubeId(url);
    if (!id) return "https://via.placeholder.com/640x360.png?text=URL+INVALIDA";
    return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
  };

  const addCamera = () => {
    if (!name || !src) return alert("Llena el nombre y la URL");
    saveCameras([...cameras, { id: Date.now(), name, tipo, src, activa: true }]);
    setName(""); setSrc("");
  };

  const deleteCamera = (id) => {
    if(window.confirm("¿Borrar esta cámara?")) saveCameras(cameras.filter((cam) => cam.id !== id));
  };

  const toggleCamera = (id) => {
    saveCameras(cameras.map((cam) => cam.id === id ? { ...cam, activa: !cam.activa } : cam));
  };

  const uploadAdFromPC = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const type = file.type.includes("video") ? "video" : "image";
      saveAds([...ads, { id: Date.now(), type, src: reader.result }]);
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const addAdByUrl = () => {
    if (!adUrl) return alert("Pega un enlace válido");
    saveAds([...ads, { id: Date.now(), type: adType, src: adUrl }]);
    setAdUrl("");
  };

  const deleteAd = (id) => saveAds(ads.filter((ad) => ad.id !== id));
  const deleteAllAds = () => { if(window.confirm("¿Borrar toda la publicidad?")) saveAds([]); };

  const handleUpdateEvent = () => {
    if (!eventName || !eventSrc) return alert("Llena el nombre y la señal del evento");
    const updated = { ...liveEvent, name: eventName, tipo: eventType, src: eventSrc };
    saveLiveEvent(updated);
    alert("Transmisión configurada con éxito.");
  };

  const toggleLiveEventActive = () => {
    const updated = { ...liveEvent, active: !liveEvent.active };
    saveLiveEvent(updated);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans overflow-y-auto">
      <h1 className="text-4xl md:text-5xl font-black text-pink-500 mb-8 tracking-wider">
        PANEL DE CONTROL <span className="text-cyan-400">FABULOSA PLAY</span>
      </h1>

      <div className="flex flex-wrap gap-4 mb-8 border-b border-zinc-800 pb-4">
        <button onClick={() => setTab("camaras")} className={`px-8 py-4 rounded-2xl font-black text-xl transition-all ${tab === "camaras" ? "bg-cyan-500 text-black shadow-[0_0_20px_rgba(34,211,238,0.4)]" : "bg-zinc-900 text-zinc-400"}`}>
          📹 CÁMARAS
        </button>
        <button onClick={() => setTab("publicidad")} className={`px-8 py-4 rounded-2xl font-black text-xl transition-all ${tab === "publicidad" ? "bg-pink-600 text-white shadow-[0_0_20px_rgba(219,39,119,0.4)]" : "bg-zinc-900 text-zinc-400"}`}>
          📺 PUBLICIDAD
        </button>
        <button onClick={() => setTab("envivo")} className={`px-8 py-4 rounded-2xl font-black text-xl transition-all ${tab === "envivo" ? "bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)]" : "bg-zinc-900 text-zinc-400"}`}>
          🔥 EN VIVO / EVENTOS
        </button>
      </div>

      {tab === "camaras" && (
        <div>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl mb-8">
            <div className="text-2xl font-black mb-4">AGREGAR NUEVA SEÑAL</div>
            <div className="grid md:grid-cols-3 gap-4">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="NOMBRE DE CÁMARA" className="bg-zinc-800 p-4 rounded-xl font-bold text-white outline-none" />
              <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="bg-zinc-800 p-4 rounded-xl font-bold text-white outline-none">
                <option value="youtube">YOUTUBE LIVE / VIDEO</option>
                <option value="video">VIDEO DIRECTO (MP4)</option>
                <option value="m3u8">M3U8 / HLS</option>
                <option value="rtmp">RTMP</option>
                <option value="iptv">IPTV</option>
              </select>
              <input value={src} onChange={(e) => setSrc(e.target.value)} placeholder="URL DE LA SEÑAL" className="bg-zinc-800 p-4 rounded-xl font-bold text-white outline-none" />
            </div>
            <button onClick={addCamera} className="mt-4 bg-pink-600 px-8 py-3 rounded-xl font-black">+ AGREGAR CÁMARA</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cameras.map((cam) => (
              <div key={cam.id} className={`bg-zinc-900 rounded-2xl overflow-hidden border-2 ${cam.activa ? 'border-cyan-500' : 'border-zinc-800 opacity-60'}`}>
                <div className="h-40 bg-black">
                  {cam.tipo === "youtube" ? <img src={getYoutubeThumb(cam.src)} className="w-full h-full object-cover"/> : <video src={cam.src} className="w-full h-full object-cover"/>}
                </div>
                <div className="p-4">
                  <div className="font-black text-xl truncate">{cam.name}</div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => toggleCamera(cam.id)} className={`flex-1 py-2 font-black rounded-lg ${cam.activa ? "bg-cyan-500 text-black" : "bg-zinc-700"}`}>ON/OFF</button>
                    <button onClick={() => deleteCamera(cam.id)} className="flex-1 py-2 bg-red-600 font-black rounded-lg">BORRAR</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "publicidad" && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
            <div className="text-2xl md:text-3xl font-black">BANNERS DE PUBLICIDAD</div>
            <button onClick={deleteAllAds} className="bg-red-600 px-6 py-2 rounded-xl font-black hover:bg-red-500">BORRAR TODO</button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-zinc-800 rounded-2xl border border-zinc-700">
              <p className="font-bold mb-4 text-zinc-300 text-lg">1. Subir desde PC (Imagen o Video MP4):</p>
              <input type="file" accept="image/*,video/*" onChange={uploadAdFromPC} className="block w-full text-base font-bold file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:font-black file:bg-pink-600 file:text-white cursor-pointer" />
            </div>

            <div className="p-6 bg-zinc-800 rounded-2xl border border-zinc-700">
              <p className="font-bold mb-4 text-zinc-300 text-lg">2. Agregar URL Externa (Para videos muy pesados):</p>
              <div className="flex gap-2 mb-4">
                <select value={adType} onChange={(e) => setAdType(e.target.value)} className="bg-zinc-900 p-3 rounded-xl font-bold outline-none">
                  <option value="image">IMAGEN</option>
                  <option value="video">VIDEO (MP4)</option>
                </select>
                <input value={adUrl} onChange={(e) => setAdUrl(e.target.value)} placeholder="http://..." className="flex-1 bg-zinc-900 p-3 rounded-xl font-bold outline-none" />
              </div>
              <button onClick={addAdByUrl} className="w-full bg-cyan-500 text-black py-3 font-black rounded-xl hover:bg-cyan-400">GUARDAR URL</button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {ads.map((ad) => (
              <div key={ad.id} className="bg-black rounded-xl overflow-hidden border border-zinc-700">
                <div className="h-24">
                  {ad.type === "image" ? <img src={ad.src} className="w-full h-full object-cover" /> : <video src={ad.src} className="w-full h-full object-cover" />}
                </div>
                <div className="bg-zinc-800 text-center py-1 text-xs font-bold text-zinc-400 uppercase">{ad.type}</div>
                <button onClick={() => deleteAd(ad.id)} className="w-full bg-red-600/20 text-red-500 py-2 font-black hover:bg-red-600 hover:text-white">BORRAR BANNER</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "envivo" && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-3xl">
          <div className="text-2xl md:text-3xl font-black mb-2">TRANSMISIONES ESPECIALES EN VIVO</div>
          <p className="text-zinc-400 mb-6 font-bold">Use esta opción para interrumpir las cámaras y pasar Partidos, Conciertos o Cadena Nacional con su AUDIO ORIGINAL.</p>
          
          <div className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700 mb-8">
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col gap-2">
                <label className="font-black text-zinc-300">Nombre del Evento:</label>
                <input value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="Ej. PARTIDO EN VIVO SUTRAA" className="bg-zinc-900 p-4 rounded-xl font-bold text-white outline-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-black text-zinc-300">Tipo de Señal:</label>
                <select value={eventType} onChange={(e) => setEventType(e.target.value)} className="bg-zinc-900 p-4 rounded-xl font-bold text-white outline-none">
                  <option value="youtube">YOUTUBE (TRANSMISIÓN O VIDEO)</option>
                  <option value="video">VIDEO DIRECTO ENLACE (MP4)</option>
                  {/* AGREGADAS LAS OPCIONES M3U / IPTV AQUÍ */}
                  <option value="m3u8">M3U8 / HLS / M3U</option>
                  <option value="rtmp">RTMP</option>
                  <option value="iptv">IPTV</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-black text-zinc-300">Enlace o URL de la señal:</label>
                <input value={eventSrc} onChange={(e) => setEventSrc(e.target.value)} placeholder="https://..." className="bg-zinc-900 p-4 rounded-xl font-bold text-white outline-none" />
              </div>
            </div>
            <button onClick={handleUpdateEvent} className="bg-cyan-500 text-black px-8 py-3 rounded-xl font-black hover:bg-cyan-400 transition-all">
              💾 GUARDAR CONFIGURACIÓN DEL EVENTO
            </button>
          </div>

          <div className="bg-black p-8 rounded-3xl border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
            <div>
              <div className="text-2xl font-black mb-2">INTERRUPTOR DE AIRE</div>
              <p className="text-zinc-500 font-bold">Estado actual: {liveEvent.active ? <span className="text-red-500 animate-pulse">🔴 TRANSMITIENDO EVENTO ESPECIAL</span> : <span className="text-green-500">🟢 CÁMARAS ROTATIVAS + RADIO ACTIVAS</span>}</p>
            </div>
            
            <button 
              onClick={toggleLiveEventActive}
              className={`px-12 py-6 rounded-2xl font-black text-2xl tracking-wider uppercase transition-all shadow-xl cursor-pointer ${liveEvent.active ? 'bg-red-600 text-white hover:bg-red-500 shadow-[0_0_30px_rgba(220,38,38,0.5)] animate-pulse' : 'bg-green-600 text-white hover:bg-green-500 shadow-[0_0_30px_rgba(22,163,74,0.3)]'}`}
            >
              {liveEvent.active ? "❌ DESACTIVAR Y VOLVER A CÁMARAS" : "🔥 ACTIVAR EVENTO AL AIRE"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}