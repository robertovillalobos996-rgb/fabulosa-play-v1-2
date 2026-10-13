import { useEffect, useState } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, saveCatalog } from "../lib/firebase";
import useCameraChannel from "../hooks/useCameraChannel";
import useCatalog from "../hooks/useCatalog";
import { isCameraChannel } from "../utils/cameraStation";
import { validChannelUrl } from "../utils/cameraChannel";
const inputClass = "focus-ring mt-2 w-full rounded-xl border border-white/15 bg-[#0c101a] px-3 py-2.5 text-sm text-white";
export default function CameraStationEditor() {
  const { config, error } = useCameraChannel();
  const { data: channels, loading: channelsLoading, error: channelsError } = useCatalog("channels");
  const [form, setForm] = useState(config), [busy, setBusy] = useState(false), [message, setMessage] = useState("");
  useEffect(() => setForm(config), [config]);
  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  async function save(event) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      if (!validChannelUrl(form.liveAudioUrl)) throw new Error("El audio debe tener una URL HTTPS directa.");
      if (!validChannelUrl(form.channelLogo, true)) throw new Error("Use un enlace HTTPS para el logo.");
      if (channelsLoading || channelsError) throw new Error("Espere a que carguen las cámaras antes de guardar.");
      const stable = channels.map((channel) => isCameraChannel(channel) ? { ...channel, cameraSource: true } : channel);
      if (channels.some((channel) => isCameraChannel(channel) && channel.cameraSource !== true)) await saveCatalog("channels", stable);
      await setDoc(doc(db, "catalog", "camera-radio-config"), { channelName: form.channelName.trim(), channelCategory: form.channelCategory.trim() || "Cámaras", channelLogo: form.channelLogo.trim(), liveAudioUrl: form.liveAudioUrl.trim(), liveAudioEnabled: form.liveAudioEnabled !== false, advertisingEnabled: form.advertisingEnabled !== false, tickerGoogleEnabled: form.tickerGoogleEnabled !== false, tickerCostaRica: form.tickerCostaRica !== false, tickerWorld: form.tickerWorld !== false, tickerText: String(form.tickerText || "").trim(), tickerEnabled: form.tickerEnabled !== false, tickerSpeed: Number(form.tickerSpeed) || 40, logoScale: Number(form.logoScale), clockScale: Number(form.clockScale), cameraLabelsEnabled: form.cameraLabelsEnabled !== false, cameraLabels: form.cameraLabels || {}, updatedAt: serverTimestamp() }, { merge: true });
      setMessage("Canal guardado. Audio de RadioBOSS y publicidad aplicados a todas las cámaras.");
    } catch (reason) { setMessage(reason.message); } finally { setBusy(false); }
  }
  return <section className="rounded-3xl border border-white/10 bg-white/[.03] p-6">
    <h2 className="text-2xl font-black">Canal de cámaras · RadioBOSS</h2>
    <p className="mt-3 text-sm text-white/65">Las cámaras de la categoría Cámaras forman un canal: cambian cada cuatro minutos y permanecen sin sonido. RadioBOSS transmite música, IDs, sellos y comerciales. La franja utiliza los anuncios del Home y permanece visible.</p>
    <form onSubmit={save} className="mt-6 grid gap-5 sm:grid-cols-2">
      <label>Nombre del canal<input required maxLength={100} className={inputClass} value={form.channelName} onChange={(event) => change("channelName", event.target.value)} /></label>
      <label>Categorías del canal (separadas por coma)<input required className={inputClass} value={form.channelCategory} onChange={(event) => change("channelCategory", event.target.value)} /></label>
      <label>Logo: enlace HTTPS o ruta del sitio<input required className={inputClass} value={form.channelLogo} onChange={(event) => change("channelLogo", event.target.value)} /></label>
      {[["logoScale", "Tamaño del logo"], ["clockScale", "Tamaño del reloj"]].map(([key, label]) => <label key={key}>{label}: {Math.round((Number(form[key]) || 1) * 100)}%<input aria-label={label} className="mt-3 w-full accent-cyan-400" type="range" min="0.5" max="2.5" step="0.05" value={form[key]} onChange={(event) => change(key, Number(event.target.value))} /></label>)}
      <label className="sm:col-span-2"><input type="checkbox" checked={form.cameraLabelsEnabled !== false} onChange={(event) => change("cameraLabelsEnabled", event.target.checked)} /> Mostrar ubicación y distintivo EN VIVO</label>
      {channels.filter(isCameraChannel).map((camera) => <label key={camera.id}>Nombre en pantalla · {camera.title}<input maxLength={80} className={inputClass} value={form.cameraLabels?.[camera.id] || ""} placeholder={camera.title} onChange={(event) => change("cameraLabels", { ...form.cameraLabels, [camera.id]: event.target.value })} /></label>)}
      <label className="sm:col-span-2">Audio en vivo · enlace HTTPS<input required type="url" className={inputClass} value={form.liveAudioUrl} onChange={(event) => change("liveAudioUrl", event.target.value)} /></label>
      <div className="sm:col-span-2 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4"><h3 className="font-black">PSC INFORMA · noticias automáticas y avisos propios</h3><p className="mt-2 text-sm text-white/60">Google Noticias se consulta cada cinco minutos mientras el canal está abierto. Solo titulares publicados en las últimas 24 horas, con el nombre del medio y la hora de publicación. Sus avisos manuales aparecen primero.</p><div className="mt-3 flex flex-wrap gap-4">{[["tickerGoogleEnabled", "Google Noticias automático"], ["tickerCostaRica", "Costa Rica"], ["tickerWorld", "Mundo"]].map(([key, label]) => <label key={key}><input type="checkbox" checked={form[key] !== false} onChange={(event) => change(key, event.target.checked)} /> {label}</label>)}</div></div>
      <label className="sm:col-span-2">Noticias e información · texto que corre en pantalla<textarea aria-label="Texto de noticias" rows={4} maxLength={10000} className={inputClass} value={form.tickerText || ""} placeholder="Escriba noticias, avisos o información. Separe los mensajes con •" onChange={(event) => change("tickerText", event.target.value)} /></label>
      <label><input type="checkbox" checked={form.tickerEnabled !== false} onChange={(event) => change("tickerEnabled", event.target.checked)} /> Mostrar franja de noticias</label>
      <label>Velocidad del texto: {form.tickerSpeed || 40} px/s<input aria-label="Velocidad de noticias" type="range" min="20" max="80" step="5" value={form.tickerSpeed || 40} onChange={(event) => change("tickerSpeed", Number(event.target.value))} className="mt-3 w-full accent-cyan-400" /><span className="mt-1 block text-xs text-white/50">Izquierda: más lento. Derecha: más rápido.</span></label>
      <label><input type="checkbox" checked={form.liveAudioEnabled !== false} onChange={(event) => change("liveAudioEnabled", event.target.checked)} /> Audio de RadioBOSS activo</label>
      <label><input type="checkbox" checked={form.advertisingEnabled !== false} onChange={(event) => change("advertisingEnabled", event.target.checked)} /> Publicidad fija activa</label>
      <button disabled={busy || Boolean(error)} className="focus-ring rounded-xl bg-fuchsia-600 px-5 py-3 font-bold disabled:opacity-40">{busy ? "Guardando…" : "Guardar canal"}</button>
    </form>
    <p role="status" className="mt-4 text-sm text-cyan-200">{message || error}</p>
    <p className="mt-4 text-sm text-white/50">En Canales, marque Fuente del canal de cámaras para incluir cada video, en cualquier categoría. El público verá el canal combinado en las categorías que escriba arriba, por ejemplo Costa Rica, Música, Cámaras en vivo. Guarde este panel una vez para recuperar y fijar las fuentes existentes. Los audios antiguos permanecen guardados, pero este canal utiliza exclusivamente RadioBOSS.</p>
  </section>;
}
