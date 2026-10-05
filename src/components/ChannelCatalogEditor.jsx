import { Pencil, Plus, Save, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { saveCatalog } from "../lib/firebase";
import { getChannelSource, normalizeChannelUrl } from "../utils/channelMedia";
import { channelCategory, deleteChannelCategory, groupChannels, matchesChannelSearch, renameChannelCategory } from "../utils/channelCategories";

const FALLBACK = "/logo-fabulosa.png";
const NEW_CATEGORY = "new-category";

function channelForm(channel, category = "") {
  const source = getChannelSource(channel);
  return {
    ...channel,
    title: channel?.title || "",
    genre: channel ? channelCategory(channel) : category,
    logo: channel?.logo || "",
    sourceMode: source.type === "iframe" ? "iframe" : "direct",
    sourceUrl: normalizeChannelUrl(channel?.iframe_url || channel?.url),
  };
}

export default function ChannelCatalogEditor({ items, setItems, loading, error, remote }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(null);
  const [form, setForm] = useState(() => channelForm());
  const [editingId, setEditingId] = useState("");
  const [newCategory, setNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [dialog, setDialog] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [deleteChannels, setDeleteChannels] = useState(false);
  const dialogRef = useRef(null);
  const formRef = useRef(null);
  const blocked = loading || Boolean(error);
  const groups = useMemo(() => groupChannels(items), [items]);
  const visible = useMemo(() => items.filter((item) => (category === null || channelCategory(item) === category) && matchesChannelSearch(item, search)), [items, category, search]);
  const visibleGroups = useMemo(() => groupChannels(visible), [visible]);
  const assignedGroups = groups.filter((group) => group.key);
  const dialogGroup = dialog ? groups.find((group) => group.key === dialog.category) : null;

  useEffect(() => {
    if (category !== null && !groups.some((group) => group.key === category)) setCategory(null);
  }, [category, groups]);
  useEffect(() => {
    if (dialog && !dialogRef.current.open) dialogRef.current.showModal();
  }, [dialog]);

  function reset(nextCategory = category || "") {
    setEditingId(""); setForm(channelForm(null, nextCategory)); setNewCategory(false); setNewCategoryName("");
  }
  function edit(item) {
    setEditingId(item.id); setForm(channelForm(item)); setNewCategory(false); setNewCategoryName(""); setMessage("");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  async function publish(next, text) {
    if (busy || blocked) return false;
    setBusy(true); setMessage("");
    try { await saveCatalog("channels", next); setItems(next); setMessage(text); return true; }
    catch (reason) { setMessage(`No se pudo guardar: ${reason.message}`); return false; }
    finally { setBusy(false); }
  }
  async function submit(event) {
    event.preventDefault();
    const genre = (newCategory ? newCategoryName : form.genre).trim();
    if (newCategory && !genre) { setMessage("Escriba el nombre de la nueva categoría."); return; }
    if (editingId && !items.some((item) => item.id === editingId)) { setMessage("Este canal ya fue eliminado. Seleccione otro canal."); return; }
    const sourceUrl = normalizeChannelUrl(form.sourceUrl);
    if (sourceUrl) {
      try { if ((!/^https?:\/\//i.test(sourceUrl) && !sourceUrl.startsWith("/")) || !["http:", "https:"].includes(new URL(sourceUrl, window.location.origin).protocol)) throw new Error(); }
      catch { setMessage("Escriba una URL de transmisión válida (HTTP o HTTPS)."); return; }
    }
    const { sourceMode, sourceUrl: _sourceUrl, ...fields } = form;
    const entry = { ...fields, id: editingId || `channel-${crypto.randomUUID()}`, title: form.title.trim(), genre, logo: form.logo.trim(), url: sourceMode === "direct" ? sourceUrl : "", iframe_url: sourceMode === "iframe" ? sourceUrl : "" };
    if (!entry.title) { setMessage("Escriba el nombre del canal."); return; }
    const next = editingId ? items.map((item) => item.id === editingId ? entry : item) : [entry, ...items];
    if (await publish(next, `Canal publicado en ${genre || "Sin categoría"}.`)) reset();
  }
  async function remove(item) {
    if (!window.confirm(`¿Eliminar el canal “${item.title}”?`)) return;
    if (await publish(items.filter((channel) => channel.id !== item.id), "Canal eliminado.")) {
      if (editingId === item.id) reset();
    }
  }
  function openCategoryDialog(kind, key) {
    setCategoryName(key); setDeleteChannels(false); setDialog({ kind, category: key }); setMessage("");
  }
  async function saveCategory(event) {
    event.preventDefault();
    if (!dialogGroup) { setMessage("La categoría cambió. Vuelva a seleccionarla."); setDialog(null); return; }
    const oldName = dialog.category;
    if (dialog.kind === "rename") {
      const name = categoryName.trim();
      if (!name) { setMessage("Escriba el nombre de la categoría."); return; }
      if (await publish(renameChannelCategory(items, oldName, name), `Categoría publicada: ${name}.`)) {
        if (category === oldName) setCategory(name);
        if (form.genre === oldName) setForm((current) => ({ ...current, genre: name }));
        setDialog(null);
      }
    } else {
      const next = deleteChannelCategory(items, oldName, deleteChannels);
      const text = deleteChannels ? `Categoría eliminada junto con sus ${dialogGroup.channels.length} canales.` : "Categoría eliminada. Sus canales quedaron en Sin categoría.";
      if (await publish(next, text)) {
        if (category === oldName) setCategory(deleteChannels ? null : "");
        if (editingId && !next.some((item) => item.id === editingId)) reset("");
        else if (form.genre === oldName) setForm((current) => ({ ...current, genre: "" }));
        setDialog(null);
      }
    }
  }
  const inputClass = "focus-ring mt-2 w-full rounded-xl border border-white/10 bg-[#0c1019] px-3 py-2.5 text-sm text-white";
  return (
    <div>
      {error && <p role="alert" className="mb-5 rounded-xl border border-amber-400/25 bg-amber-400/10 p-4 text-sm text-amber-100">No se pudo cargar el catálogo publicado. Recargue el panel antes de guardar cambios: {error}</p>}
      {!loading && !error && !remote && <p className="mb-5 text-sm text-amber-200">Se muestra el catálogo local completo. Al guardar, se publicará en el sitio.</p>}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-2xl font-black">Canales por categoría</h2><p className="mt-2 text-sm text-white/55" role="status">{loading ? "Cargando el catálogo completo…" : `${visible.length} de ${items.length} canales · ${assignedGroups.length} categorías`}</p></div><button type="button" disabled={busy || blocked} onClick={() => { reset(); formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="inline-flex items-center gap-2 rounded-xl bg-fuchsia-600 px-4 py-3 text-sm font-black disabled:opacity-50"><Plus size={18} /> Agregar canal</button></div>
      {message && <p role="status" className="mb-5 rounded-xl bg-white/[0.06] p-4 text-sm text-white/80">{message}</p>}
      <div className="grid gap-7 xl:grid-cols-[360px_minmax(0,1fr)]">
        <form ref={formRef} onSubmit={submit} className="h-fit scroll-mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5 xl:sticky xl:top-5">
          <div className="flex items-center justify-between gap-3"><h3 className="text-xl font-black">{editingId ? "Editar canal" : "Agregar canal"}</h3>{editingId && <button type="button" disabled={busy} onClick={() => reset()} aria-label="Cancelar edición" className="rounded-full bg-white/10 p-2"><X size={17} /></button>}</div>
          <fieldset disabled={busy || blocked} className="mt-5 space-y-4 disabled:opacity-60">
            <label className="block text-sm font-bold text-white/70">Nombre del canal<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className={inputClass} /></label>
            <label className="block text-sm font-bold text-white/70">Categoría del canal<select aria-label="Categoría del canal" value={newCategory ? NEW_CATEGORY : `category:${form.genre}`} onChange={(event) => { const value = event.target.value; setNewCategory(value === NEW_CATEGORY); if (value !== NEW_CATEGORY) setForm({ ...form, genre: value.slice(9) }); }} className={inputClass}><option value="category:">Sin categoría</option>{assignedGroups.map((group) => <option key={group.key} value={`category:${group.key}`}>{group.title}</option>)}{form.genre && !assignedGroups.some((group) => group.key === form.genre) && <option value={`category:${form.genre}`}>{form.genre}</option>}<option value={NEW_CATEGORY}>Crear otra categoría…</option></select></label>
            {newCategory && <label className="block text-sm font-bold text-white/70">Nombre de la nueva categoría<input required value={newCategoryName} onChange={(event) => setNewCategoryName(event.target.value)} className={inputClass} /></label>}
            <label className="block text-sm font-bold text-white/70">Logo del canal<input value={form.logo} onChange={(event) => setForm({ ...form, logo: event.target.value })} placeholder="https://.../logo.png o /logos_canales/archivo.png" className={inputClass} /></label>
            {form.logo && <img key={form.logo} src={form.logo} onError={(event) => { event.currentTarget.src = FALLBACK; }} alt="Vista previa del logo" className="h-16 w-16 rounded-full bg-white p-1 object-contain" />}
            <label className="block text-sm font-bold text-white/70">Tipo de enlace<select aria-label="Tipo de enlace" value={form.sourceMode} onChange={(event) => setForm({ ...form, sourceMode: event.target.value })} className={inputClass}><option value="direct">Señal directa (HLS / MP4)</option><option value="iframe">Reproductor del proveedor / YouTube</option></select></label>
            <label className="block text-sm font-bold text-white/70">URL de transmisión<input value={form.sourceUrl} onChange={(event) => setForm({ ...form, sourceUrl: event.target.value })} placeholder="https://..." className={inputClass} /></label>
            <button className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-xl bg-fuchsia-600 px-4 py-3 font-black"><Save size={18} /> {busy ? "Guardando…" : editingId ? "Guardar cambios del canal" : "Agregar y publicar canal"}</button>
          </fieldset>
        </form>
        <div className="min-w-0">
          <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 sm:grid-cols-2"><label className="block text-xs font-bold text-white/60">Filtrar por categoría<select aria-label="Filtrar por categoría" value={category === null ? "all" : `category:${category}`} onChange={(event) => setCategory(event.target.value === "all" ? null : event.target.value.slice(9))} className={inputClass}><option value="all">Todas las categorías ({items.length})</option>{groups.map((group) => <option key={group.key} value={`category:${group.key}`}>{group.title} ({group.channels.length})</option>)}</select></label><label className="block text-xs font-bold text-white/60">Buscar canal<div className="relative mt-2"><Search className="absolute left-3 top-3 text-white/35" size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nombre o categoría" className="focus-ring w-full rounded-xl border border-white/10 bg-[#0c1019] py-2.5 pl-10 pr-3 text-sm" /></div></label>{(search || category !== null) && <button type="button" onClick={() => { setSearch(""); setCategory(null); }} className="text-left text-xs font-bold text-sky-300 sm:col-span-2">Ver todos los canales</button>}</div>
          {loading ? <p className="py-12 text-center text-white/50">Cargando canales…</p> : visibleGroups.length ? <div className="mt-5 space-y-6">{visibleGroups.map((group) => {
            const total = groups.find((entry) => entry.key === group.key).channels.length;
            return <section key={group.key} aria-label={`Categoría ${group.title}`} className="overflow-hidden rounded-2xl border border-white/10"><div className="flex flex-wrap items-center justify-between gap-3 bg-white/[0.06] p-4"><div><h3 className="break-words text-lg font-black">{group.title}</h3><p className="mt-1 text-xs text-white/45">{group.channels.length === total ? `${total} canales` : `${group.channels.length} de ${total} canales`}</p></div>{group.key && <div className="flex flex-wrap gap-2"><button type="button" disabled={busy || blocked} onClick={() => openCategoryDialog("rename", group.key)} aria-label={`Renombrar categoría ${group.title}`} className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-bold disabled:opacity-50"><Pencil size={14} /> Renombrar categoría</button><button type="button" disabled={busy || blocked} onClick={() => openCategoryDialog("delete", group.key)} aria-label={`Eliminar categoría ${group.title}`} className="inline-flex items-center gap-2 rounded-lg bg-red-500/15 px-3 py-2 text-xs font-bold text-red-200 disabled:opacity-50"><Trash2 size={14} /> Eliminar categoría</button></div>}</div><div className="divide-y divide-white/[0.06]">{group.channels.map((item) => <article key={item.id} data-channel-id={item.id} className="flex items-center gap-3 p-3"><img src={item.logo || FALLBACK} loading="lazy" onError={(event) => { event.currentTarget.src = FALLBACK; }} alt="" className="h-12 w-12 shrink-0 rounded-full bg-white object-contain p-1" /><div className="min-w-0 flex-1"><p className="break-words text-sm font-black">{item.title || "Sin nombre"}</p><p className="mt-1 text-xs text-white/40">{group.title}{!item.url && !item.iframe_url ? " · Sin URL de transmisión" : ""}</p></div><div className="flex shrink-0 gap-2"><button type="button" disabled={busy || blocked} onClick={() => edit(item)} aria-label={`Editar canal ${item.title}`} className="rounded-lg bg-white/10 p-2.5 text-white/75 disabled:opacity-50"><Pencil size={16} /></button><button type="button" disabled={busy || blocked} onClick={() => remove(item)} aria-label={`Eliminar canal ${item.title}`} className="rounded-lg bg-red-500/10 p-2.5 text-red-300 disabled:opacity-50"><Trash2 size={16} /></button></div></article>)}</div></section>;
          })}</div> : <p className="py-12 text-center text-white/50">{items.length ? "No hay canales con estos filtros." : "Todavía no hay canales. Agregue el primero desde el formulario."}</p>}
        </div>
      </div>
      {dialog && <dialog ref={dialogRef} aria-label={dialog.kind === "rename" ? "Renombrar categoría" : "Eliminar categoría"} onCancel={(event) => { event.preventDefault(); if (!busy) setDialog(null); }} className="fixed inset-0 m-auto w-[calc(100%_-_2rem)] max-w-lg rounded-2xl border border-white/15 bg-[#101521] p-6 text-white backdrop:bg-black/75"><form onSubmit={saveCategory}><h2 className="text-xl font-black">{dialog.kind === "rename" ? "Renombrar categoría" : "Eliminar categoría"}</h2><p className="mt-3 text-sm text-white/60">{dialog.category} · {dialogGroup?.channels.length || 0} canales. La operación se aplica a la categoría completa, aunque haya una búsqueda activa.</p>{message && <p role="alert" className="mt-4 rounded-xl bg-red-500/15 p-3 text-sm text-red-200">{message}</p>}<fieldset disabled={busy} className="mt-5 space-y-4">{dialog.kind === "rename" ? <><label className="block text-sm font-bold text-white/70">Nuevo nombre de la categoría<input required value={categoryName} onChange={(event) => setCategoryName(event.target.value)} className={inputClass} /></label>{categoryName.trim() !== dialog.category && groups.some((group) => group.key === categoryName.trim()) && <p className="text-sm text-amber-200">Ya existe esa categoría. Sus canales se unirán a ella.</p>}</> : <><label className="flex cursor-pointer gap-3 rounded-xl border border-white/10 p-3 text-sm"><input type="radio" name="category-delete-mode" checked={!deleteChannels} onChange={() => setDeleteChannels(false)} className="accent-fuchsia-500" /><span>Conservar los canales en Sin categoría</span></label><label className="flex cursor-pointer gap-3 rounded-xl border border-red-400/25 p-3 text-sm"><input type="radio" name="category-delete-mode" checked={deleteChannels} onChange={() => setDeleteChannels(true)} className="accent-red-500" /><span>Eliminar también los {dialogGroup?.channels.length || 0} canales</span></label></>}<div className="flex flex-wrap justify-end gap-3 pt-2"><button type="button" onClick={() => setDialog(null)} className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-bold">Cancelar</button><button className={`rounded-xl px-4 py-2.5 text-sm font-black ${dialog.kind === "delete" ? "bg-red-600" : "bg-fuchsia-600"}`}>{busy ? "Guardando…" : dialog.kind === "rename" ? "Guardar categoría" : deleteChannels ? `Eliminar categoría y ${dialogGroup?.channels.length || 0} canales` : "Eliminar solo la categoría"}</button></div></fieldset></form></dialog>}
    </div>
  );
}
