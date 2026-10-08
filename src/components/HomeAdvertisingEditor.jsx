import { ArrowDown, ArrowUp, Pencil, Save, Trash2, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { saveCatalog } from "../lib/firebase";
import { homeAdSeconds, safeAdDestination } from "../utils/homeAdvertising";
import { uploadHomeAdvertising } from "../utils/uploadHomeAdvertising";
import HomeAdvertising from "./HomeAdvertising";

const EMPTY = { title: "", source: "", mediaType: "image", seconds: 10, actionUrl: "", enabled: true };
const INPUT = "focus-ring mt-2 w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-white";

export default function HomeAdvertisingEditor({ items = [], setItems, loading, error }) {
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [inputKey, setInputKey] = useState(0);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  function clearPreview() { if (preview) URL.revokeObjectURL(preview); setPreview(""); }
  function reset() { clearPreview(); setFile(null); setForm(EMPTY); setEditing(""); setInputKey((value) => value + 1); }
  function chooseFile(event) {
    const next = event.target.files?.[0];
    if (!next) return;
    clearPreview(); setFile(next); setPreview(URL.createObjectURL(next));
    setForm((value) => ({ ...value, mediaType: next.type.startsWith("video/") ? "video" : "image" }));
    setMessage("");
  }
  function edit(item) { reset(); setForm({ ...EMPTY, ...item }); setEditing(item.id); setMessage(""); }

  async function publish(next, success) {
    await saveCatalog("homeAdvertising", next);
    setItems(next); setMessage(success);
  }
  async function submit(event) {
    event.preventDefault();
    if (busy || loading || error) return;
    if (!file && !form.source) { setMessage("Seleccione una imagen o un video para publicar."); return; }
    if (!file && !/^https:\/\//i.test(form.source)) { setMessage("Use un enlace directo HTTPS para el archivo alojado."); return; }
    if (form.actionUrl && !safeAdDestination(form.actionUrl)) { setMessage("El destino debe ser un enlace HTTPS o una ruta del sitio que empiece con /."); return; }
    setBusy(true); setMessage(""); setProgress(0);
    try {
      const media = file ? await uploadHomeAdvertising(file, setProgress) : { source: form.source, mediaType: form.mediaType };
      const item = { ...form, ...media, id: editing || `home-ad-${crypto.randomUUID()}`, seconds: homeAdSeconds(form), actionUrl: safeAdDestination(form.actionUrl) };
      const next = editing ? items.map((entry) => entry.id === editing ? item : entry) : [...items, item];
      await publish(next, "Anuncio publicado en la franja debajo de Películas."); reset();
    } catch (reason) { setMessage(reason.message || "No se pudo publicar el anuncio."); }
    finally { setBusy(false); }
  }
  async function change(next, success) {
    if (busy || loading || error) return;
    setBusy(true); setMessage("");
    try { await publish(next, success); }
    catch (reason) { setMessage(`No se pudo guardar: ${reason.message}`); }
    finally { setBusy(false); }
  }
  function move(index, direction) {
    const next = [...items];
    [next[index], next[index + direction]] = [next[index + direction], next[index]];
    change(next, "Orden actualizado.");
  }
  function remove(item) {
    if (!window.confirm(`¿Eliminar el anuncio “${item.title || "Sin título"}” de la franja?`)) return;
    if (editing === item.id) reset();
    change(items.filter((entry) => entry.id !== item.id), "Anuncio eliminado de la franja.");
  }

  const previewItem = { ...form, source: preview || form.source, id: "preview", enabled: true };
  const disabled = busy || loading || Boolean(error);
  return (
    <div>
      <p className="mb-6 max-w-3xl text-sm leading-6 text-white/55">Banda publicitaria del inicio, debajo de Películas y encima del menú inferior. Imágenes y videos tienen el mismo marco horizontal. Los videos terminan completos antes de pasar al siguiente anuncio.</p>
      {error && <p role="alert" className="mb-5 rounded-xl bg-red-400/10 p-4 text-sm text-red-200">No se pudo cargar la publicidad. Recargue el panel antes de guardar cambios.</p>}
      <div className="grid gap-7 xl:grid-cols-[420px_minmax(0,1fr)]">
        <form onSubmit={submit} className="h-fit rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="flex items-center justify-between"><h2 className="text-xl font-black">{editing ? "Editar anuncio" : "Nuevo anuncio"}</h2>{editing && <button type="button" disabled={busy} onClick={reset} aria-label="Cancelar edición" className="rounded-full bg-white/10 p-2"><X size={17} /></button>}</div>
          <fieldset disabled={disabled} className="mt-5 space-y-4 disabled:opacity-50">
            <label className="block text-sm font-bold text-white/65">Nombre del anuncio<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className={INPUT} placeholder="Nombre del negocio o campaña" /></label>
            <label className="block cursor-pointer rounded-xl border border-dashed border-sky-300/30 bg-sky-400/[0.04] p-4 text-sm font-bold text-sky-200"><span className="flex items-center gap-2"><Upload size={18} /> Cargar imagen o video desde mi computadora</span><input key={inputKey} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm" onChange={chooseFile} className="mt-3 block w-full text-xs font-normal text-white/60 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-white" /><span className="mt-3 block text-xs font-normal leading-5 text-white/45">Recomendado: 1920 × 240 px (8:1). Imagen: hasta 5 MB. Video MP4 o WebM: menos de 250 MB. Otros tamaños se ajustan sin recortes.</span></label>
            <details className="text-xs text-white/50"><summary className="cursor-pointer">Usar un archivo ya alojado</summary><label className="mt-3 block">Tipo de archivo<select value={form.mediaType} onChange={(event) => { clearPreview(); setFile(null); setForm({ ...form, mediaType: event.target.value }); }} className={INPUT}><option value="image">Imagen</option><option value="video">Video MP4 / WebM</option></select></label><label className="mt-3 block">Enlace directo HTTPS<input type="url" value={form.source} onChange={(event) => { clearPreview(); setFile(null); setForm({ ...form, source: event.target.value }); }} className={INPUT} placeholder="https://…" /></label></details>
            {form.mediaType === "image" && <label className="block text-sm font-bold text-white/65">Segundos en pantalla<input type="number" min="3" max="120" value={form.seconds} onChange={(event) => setForm({ ...form, seconds: event.target.value })} className={INPUT} /></label>}
            <label className="block text-sm font-bold text-white/65">Destino al tocar el anuncio (opcional)<input value={form.actionUrl} onChange={(event) => setForm({ ...form, actionUrl: event.target.value })} placeholder="https://… o /anunciate" className={INPUT} /></label>
            <label className="flex items-center gap-3 text-sm text-white/65"><input type="checkbox" checked={form.enabled} onChange={(event) => setForm({ ...form, enabled: event.target.checked })} className="accent-sky-400" /> Anuncio activo</label>
          </fieldset>
          <p className="mt-5 text-xs font-bold text-white/45">Vista previa del marco</p><HomeAdvertising key={previewItem.source} items={previewItem.source ? [previewItem] : []} />
          <button disabled={disabled} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-fuchsia-600 px-5 py-3 font-black disabled:opacity-50"><Save size={18} /> {busy ? file && progress < 100 ? `Cargando ${progress}%…` : "Guardando…" : editing ? "Guardar cambios" : "Publicar anuncio"}</button>
          {busy && file && <progress max="100" value={progress} className="mt-3 w-full accent-sky-400" aria-label="Progreso de carga" />}
          {message && <p role="status" className="mt-4 rounded-xl bg-white/[0.06] p-3 text-sm leading-5 text-white/70">{message}</p>}
        </form>
        <div>
          <h2 className="text-xl font-black">Anuncios de la franja</h2><p className="mt-2 text-xs text-white/45">{loading ? "Cargando anuncios…" : `${items.length} anuncios · ${items.filter((item) => item.enabled !== false).length} activos`}</p>
          <div className="mt-5 space-y-3">{items.map((item, index) => <article key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <div className="flex items-center gap-3"><span className="text-sm font-black text-white/35">{index + 1}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-black">{item.title || "Publicidad sin título"}</p><p className="mt-1 text-xs text-white/40">{item.mediaType === "video" ? "Video completo" : `Imagen · ${homeAdSeconds(item)} segundos`} · {item.enabled === false ? "Desactivado" : "Activo"}</p></div><button type="button" disabled={disabled} onClick={() => edit(item)} aria-label={`Editar ${item.title || "anuncio"}`} className="rounded-lg bg-white/10 p-2"><Pencil size={16} /></button><button type="button" disabled={disabled} onClick={() => remove(item)} aria-label={`Eliminar ${item.title || "anuncio"}`} className="rounded-lg bg-red-500/10 p-2 text-red-300"><Trash2 size={16} /></button></div>
            <div className="mt-4 flex items-center gap-2"><button type="button" disabled={disabled || index === 0} onClick={() => move(index, -1)} aria-label={`Subir ${item.title || "anuncio"}`} className="rounded-lg bg-white/10 p-2 disabled:opacity-30"><ArrowUp size={15} /></button><button type="button" disabled={disabled || index === items.length - 1} onClick={() => move(index, 1)} aria-label={`Bajar ${item.title || "anuncio"}`} className="rounded-lg bg-white/10 p-2 disabled:opacity-30"><ArrowDown size={15} /></button><button type="button" disabled={disabled} onClick={() => change(items.map((entry) => entry.id === item.id ? { ...entry, enabled: entry.enabled === false } : entry), "Estado del anuncio actualizado.")} className="ml-auto rounded-lg bg-white/10 px-3 py-2 text-xs font-bold">{item.enabled === false ? "Activar" : "Desactivar"}</button></div>
          </article>)}</div>
          {!loading && !items.length && <p className="mt-6 rounded-2xl border border-dashed border-white/10 p-6 text-sm text-white/45">Cargue su primer anuncio. La franja conserva su tamaño mientras agrega el contenido.</p>}
        </div>
      </div>
    </div>
  );
}
