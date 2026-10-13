import { useEffect, useMemo, useRef, useState } from "react";
import { deleteDoc, doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import useCameraStation from "../hooks/useCameraStation";
import { CAMERA_AUDIO_KINDS, safeAudioUrl } from "../utils/cameraStation";
import { connectStationStorage, deleteCameraAudioFile, disconnectStationStorage, measureAudio, uploadCameraAudio, validateStationStorage } from "../utils/cameraAudioUpload";

const inputClass = "focus-ring mt-2 w-full rounded-xl border border-white/15 bg-[#0c101a] px-3 py-2.5 text-sm text-white";
const buttonClass = "focus-ring rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold disabled:opacity-40";
const emptyTrack = { title: "", url: "", kind: "music", startTime: "", endTime: "", order: 0, enabled: true };
function durationLabel(seconds) { return `${Math.floor((seconds || 0) / 60)}:${String(Math.floor((seconds || 0) % 60)).padStart(2, "0")}`; }
function Field({ label, children }) { return <label className="block text-sm font-bold text-white/65">{label}{children}</label>; }

export default function CameraStationEditor() {
  const station = useCameraStation();
  const [config, setConfig] = useState(station.config), [form, setForm] = useState(emptyTrack), [editing, setEditing] = useState("");
  const [busy, setBusy] = useState(false), [message, setMessage] = useState(""), [progress, setProgress] = useState("");
  const [connected, setConnected] = useState(false), [password, setPassword] = useState("");
  const [search, setSearch] = useState(""), [kindFilter, setKindFilter] = useState(""), [page, setPage] = useState(0);
  const active = useRef(true), fileInput = useRef(null), preview = useRef(null), uploadBusy = useRef(false);
  useEffect(() => { setConfig(station.config); }, [station.config]);
  useEffect(() => { active.current = true; return () => { active.current = false; disconnectStationStorage(); }; }, []);
  useEffect(() => { setPage(0); }, [search, kindFilter]);
  const filtered = useMemo(() => station.tracks.filter((track) => (!kindFilter || track.kind === kindFilter) && String(track.title || "").toLowerCase().includes(search.toLowerCase())), [station.tracks, search, kindFilter]);
  const pages = Math.max(1, Math.ceil(filtered.length / 50)), visiblePage = Math.min(page, pages - 1);
  const visible = filtered.slice(visiblePage * 50, (visiblePage + 1) * 50);
  const bytes = station.tracks.reduce((total, track) => total + (Number(track.sizeBytes) || 0), 0);
  function changeConfig(key, value) { setConfig((current) => ({ ...current, [key]: value })); if (key.startsWith("storage")) { disconnectStationStorage(); setConnected(false); } }
  async function perform(action, success) {
    setBusy(true); setMessage("");
    try { await action(); if (active.current) setMessage(success); }
    catch (error) { if (active.current) setMessage(error.message || "No se pudo completar el cambio."); }
    finally { if (active.current) setBusy(false); }
  }
  function reset() { preview.current?.pause(); setEditing(""); setForm(emptyTrack); }
  async function saveConfig(event) {
    event.preventDefault();
    await perform(async () => {
      if (config.storageUrl || config.storageKey) validateStationStorage(config);
      const times = config.commercialTimes.trim().split(/[\s,;]+/).filter(Boolean);
      if (times.some((time) => !/^([01]\d|2[0-3]):[0-5]\d$/.test(time))) throw new Error("Use horarios como 08:00, 12:30, 18:00.");
      await setDoc(doc(db, "catalog", "camera-radio-config"), { ...config, commercialTimes: times.join(", "), timezone: "America/Costa_Rica", updatedAt: serverTimestamp() });
    }, "Programación guardada. Se aplicará a todas las cámaras.");
  }
  async function saveTrack(event) {
    event.preventDefault();
    await perform(async () => {
      const url = safeAudioUrl(form.url); if (!url) throw new Error("Use un enlace HTTPS directo a un archivo de audio.");
      const existing = station.tracks.find((track) => track.id === editing);
      if (existing?.storagePath && existing.url !== url) throw new Error("Para cambiar un archivo subido, elimine su registro y agregue el nuevo. Así no quedan archivos olvidados en la nube.");
      const duration = existing?.url === url ? existing.duration : await measureAudio(url);
      const id = editing || `camera-radio-track-${crypto.randomUUID()}`;
      await setDoc(doc(db, "catalog", id), { ...form, title: form.title.trim(), url, duration, order: Number(form.order) || 0, updatedAt: serverTimestamp() }, { merge: true });
      reset();
    }, "Audio guardado en la biblioteca.");
  }
  async function connect(event) {
    event.preventDefault(); const secret = password; setPassword("");
    await perform(async () => { await connectStationStorage(config, "fabulosaplay@gmail.com", secret); setConnected(true); }, "Almacenamiento conectado. Ya puede cargar archivos.");
  }
  async function upload(files) {
    if (!files.length || uploadBusy.current) return;
    uploadBusy.current = true; setBusy(true); setMessage("");
    const errors = []; let saved = 0;
    const batchConfig = { ...config }, batchForm = { ...form };
    try {
      for (const [index, file] of files.entries()) {
        if (!active.current) break;
        let uploaded;
        try {
          setProgress(`${index + 1}/${files.length} · ${file.name} · preparando`);
          uploaded = await uploadCameraAudio(file, batchForm.kind, batchConfig, (percent) => { if (active.current) setProgress(`${index + 1}/${files.length} · ${file.name} · ${percent}%`); });
          if (!active.current) { await deleteCameraAudioFile(uploaded, batchConfig); break; }
          await setDoc(doc(db, "catalog", `camera-radio-track-${crypto.randomUUID()}`), { ...uploaded, title: file.name.replace(/\.[^.]+$/, ""), kind: batchForm.kind, enabled: true, startTime: batchForm.startTime, endTime: batchForm.endTime, order: Number(batchForm.order) + index, createdAt: serverTimestamp() });
          saved++;
        } catch (error) {
          let cleanup = "";
          if (uploaded) { try { await deleteCameraAudioFile(uploaded, batchConfig); } catch { cleanup = " El archivo quedó en Storage; elimínelo allí para liberar espacio."; } }
          errors.push(`${file.name}: ${error.message}${cleanup}`);
        }
      }
      if (active.current) setMessage(`${saved} archivos guardados.${errors.length ? "\n" + errors.join("\n") : ""}`);
    } finally { uploadBusy.current = false; if (active.current) { setBusy(false); setProgress(""); if (fileInput.current) fileInput.current.value = ""; } }
  }
  async function remove(track) {
    if (!window.confirm(`¿Eliminar “${track.title}”${track.storagePath ? " y su archivo de la nube" : " de la biblioteca"}?`)) return;
    await perform(async () => {
      if (track.storagePath) { if (!connected) throw new Error("Conecte el almacenamiento antes de eliminar un archivo subido."); await updateDoc(doc(db, "catalog", track.id), { enabled: false }); await deleteCameraAudioFile(track, config); }
      await deleteDoc(doc(db, "catalog", track.id)); if (editing === track.id) reset();
    }, "Audio eliminado.");
  }
  return <div className="space-y-6">
    <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5"><h2 className="text-xl font-black">Una emisora para la categoría Cámaras</h2><p className="mt-2 text-sm leading-6 text-white/65">Cada visitante escucha su propia programación. La música continúa al cambiar de cámara y se detiene al salir de esa categoría. Las canciones y mixes terminan completos antes de pasar al siguiente audio.</p><p className="mt-2 text-xs text-white/50">El navegador puede pedir que el visitante toque “Activar música” una vez. Los demás canales conservan su audio.</p></div>
    {(message || station.error) && <p role="status" className="whitespace-pre-wrap rounded-xl border border-white/15 bg-white/5 p-4 text-sm leading-6">{message || station.error}</p>}
    <form onSubmit={saveConfig} className="rounded-3xl border border-white/10 bg-white/[.035] p-5 sm:p-6">
      <h3 className="text-lg font-black">Programación automática</h3>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <Field label="Nombre de la emisora"><input maxLength={100} required className={inputClass} value={config.name} onChange={(event) => changeConfig("name", event.target.value)} /></Field>
        {[["idMinutes", "Un ID cada (minutos)"], ["voiceMinutes", "Una voz cada (minutos)"], ["commercialMinutes", "Bloque comercial cada (minutos)"], ["advertisingMinutes", "Espera entre franjas visuales (minutos)"]].map(([key, label]) => <Field key={key} label={label}><input type="number" min={key === "advertisingMinutes" ? .1 : 0} step="0.1" required className={inputClass} value={config[key]} onChange={(event) => changeConfig(key, Number(event.target.value))} /></Field>)}
        <Field label="Horarios comerciales adicionales (Costa Rica)"><input className={inputClass} value={config.commercialTimes} placeholder="08:00, 12:30, 18:00" onChange={(event) => changeConfig("commercialTimes", event.target.value)} /></Field>
      </div>
      <div className="mt-5 flex flex-wrap gap-5 text-sm"><label><input type="checkbox" checked={config.enabled} onChange={(event) => changeConfig("enabled", event.target.checked)} /> Emisora activa</label><label><input type="checkbox" checked={config.advertisingEnabled} onChange={(event) => changeConfig("advertisingEnabled", event.target.checked)} /> Franja visual activa</label></div>
      <p className="mt-4 text-xs leading-6 text-white/55">Música aleatoria sin repetir hasta recorrer la biblioteca. Cada bloque comercial comienza con un ID; cargue al menos uno. Use 0 para desactivar un intervalo. Si un horario cae durante un mix, espera a que termine. La franja usa los anuncios de “Franja de publicidad”: los muestra una vez, se oculta y espera el tiempo indicado.</p>
      <button disabled={busy || station.loading} className={`${buttonClass} mt-4 bg-cyan-600`}>Guardar programación</button>
    </form>
    <details className="rounded-3xl border border-white/10 bg-white/[.035] p-5">
      <summary className="cursor-pointer font-black">Almacenamiento gratuito · conectar Supabase</summary>
      <p className="mt-4 text-sm leading-6 text-white/60">El plan Free tiene 1 GB de almacenamiento, archivos de hasta 50 MB y transferencia mensual limitada. No es ilimitado. Puede usar enlaces HTTPS propios para audios más grandes. La guía instalada en docs/cameras-radio.md explica cómo crear el proyecto y aplicar sus permisos.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="URL del proyecto"><input disabled={busy} className={inputClass} value={config.storageUrl} placeholder="https://su-proyecto.supabase.co" onChange={(event) => changeConfig("storageUrl", event.target.value)} /></Field><Field label="Clave pública publishable / anon"><input disabled={busy} className={inputClass} value={config.storageKey} placeholder="sb_publishable_..." onChange={(event) => changeConfig("storageKey", event.target.value)} /></Field></div>
      <p className="mt-3 text-xs text-white/50">Contenedor: camera-radio. Nunca pegue claves secretas o service_role. Guarde la programación después de completar estos datos.</p>
      <form onSubmit={connect} className="mt-4 flex flex-wrap items-end gap-3"><Field label="Contraseña de su usuario Supabase fabulosaplay@gmail.com"><input type="password" required autoComplete="off" disabled={busy || connected} className={inputClass} value={password} onChange={(event) => setPassword(event.target.value)} /></Field>{connected ? <button type="button" disabled={busy} className={buttonClass} onClick={() => { disconnectStationStorage(); setConnected(false); }}>Desconectar almacenamiento</button> : <button disabled={busy} className={buttonClass}>Conectar almacenamiento</button>}</form>
      <p className="mt-3 text-xs text-white/40">La contraseña no se guarda. Archivos registrados: {(bytes / 1024 / 1024).toFixed(1)} MB; consulte Storage para el uso total real.</p>
    </details>
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <form onSubmit={saveTrack} className="h-fit space-y-4 rounded-3xl border border-white/10 bg-white/[.035] p-5">
        <h3 className="text-lg font-black">{editing ? "Editar audio" : "Agregar música, IDs y comerciales"}</h3>
        <Field label="Tipo de audio"><select disabled={busy} className={inputClass} value={form.kind} onChange={(event) => setForm({ ...form, kind: event.target.value })}>{Object.entries(CAMERA_AUDIO_KINDS).map(([kind, label]) => <option key={kind} value={kind}>{label}</option>)}</select></Field>
        <Field label="Nombre"><input required maxLength={200} className={inputClass} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></Field>
        <Field label="Enlace directo HTTPS del audio"><input required className={inputClass} value={form.url} placeholder="https://.../audio.mp3" onChange={(event) => setForm({ ...form, url: event.target.value })} /></Field>
        {form.kind === "commercial" && <div className="grid grid-cols-2 gap-3"><Field label="Desde"><input type="time" className={inputClass} value={form.startTime} onChange={(event) => setForm({ ...form, startTime: event.target.value })} /></Field><Field label="Hasta"><input type="time" className={inputClass} value={form.endTime} onChange={(event) => setForm({ ...form, endTime: event.target.value })} /></Field></div>}
        <Field label="Orden dentro del bloque comercial"><input type="number" className={inputClass} value={form.order} onChange={(event) => setForm({ ...form, order: Number(event.target.value) })} /></Field>
        <label className="block text-sm"><input type="checkbox" checked={form.enabled} onChange={(event) => setForm({ ...form, enabled: event.target.checked })} /> Audio activo</label>
        {form.url && <audio ref={preview} controls preload="none" src={safeAudioUrl(form.url)} className="w-full" />}
        <button disabled={busy || station.loading} className={`${buttonClass} w-full bg-fuchsia-600`}>{editing ? "Guardar cambios" : "Agregar enlace"}</button>
        {editing && <button type="button" disabled={busy} className={buttonClass} onClick={reset}>Cancelar edición</button>}
        {!editing && <div className="border-t border-white/15 pt-4"><p className="text-sm font-bold">O cargar varios archivos</p><p className="mt-2 text-xs leading-5 text-white/50">Se guardan con el tipo de audio seleccionado. Para comerciales, también usan el horario indicado arriba.</p><input ref={fileInput} type="file" accept=".mp3,.m4a,.aac,.wav,.ogg,.flac" multiple disabled={busy || !connected || station.loading} className="mt-3 w-full text-xs" onChange={(event) => upload(Array.from(event.target.files || []))} />{!connected && <p className="mt-2 text-xs text-amber-200">Conecte el almacenamiento para subir archivos.</p>}{progress && <p role="status" className="mt-3 break-words text-xs text-cyan-200">{progress}</p>}</div>}
      </form>
      <div className="min-w-0"><h3 className="text-lg font-black">Biblioteca · {station.tracks.length} audios</h3><div className="mt-4 grid gap-3 sm:grid-cols-2"><input aria-label="Buscar audio" className={inputClass} placeholder="Buscar audio" value={search} onChange={(event) => setSearch(event.target.value)} /><select aria-label="Filtrar tipo de audio" className={inputClass} value={kindFilter} onChange={(event) => setKindFilter(event.target.value)}><option value="">Todos los tipos</option>{Object.entries(CAMERA_AUDIO_KINDS).map(([kind, label]) => <option key={kind} value={kind}>{label}</option>)}</select></div>
        {!station.tracks.some((track) => track.kind === "id" && track.enabled !== false) && <p className="mt-4 text-xs text-amber-200">Cargue un ID para que puedan comenzar los bloques comerciales.</p>}
        <div className="mt-4 space-y-2">{visible.map((track) => <article key={track.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/[.035] p-3"><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{track.title}</p><p className="text-xs text-white/45">{CAMERA_AUDIO_KINDS[track.kind]} · {durationLabel(track.duration)} · {track.enabled === false ? "Inactivo" : "Activo"}{track.kind === "commercial" && ` · ${track.startTime || "00:00"}–${track.endTime || "23:59"}`}</p></div><button disabled={busy} className={buttonClass} onClick={() => { preview.current?.pause(); setEditing(track.id); setForm({ ...emptyTrack, ...track }); }}>Editar</button><button disabled={busy} className={`${buttonClass} text-red-300`} onClick={() => remove(track)}>Eliminar</button></article>)}</div>
        {!station.loading && !filtered.length && <p className="py-10 text-center text-sm text-white/40">No hay audios en esta selección.</p>}
        <div className="mt-4 flex items-center justify-between gap-3"><button type="button" className={buttonClass} disabled={visiblePage === 0} onClick={() => setPage(visiblePage - 1)}>Anterior</button><span className="text-xs text-white/50">{visiblePage + 1} / {pages} · {filtered.length} resultados</span><button type="button" className={buttonClass} disabled={visiblePage >= pages - 1} onClick={() => setPage(visiblePage + 1)}>Siguiente</button></div>
      </div>
    </div>
  </div>;
}
