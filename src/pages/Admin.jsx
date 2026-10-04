import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { ArrowLeft, BarChart3, Clapperboard, Image, LogOut, Megaphone, Pencil, Radio, Save, Search, Trash2, Tv, Upload, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useCatalog from "../hooks/useCatalog";
import { auth, saveCatalog } from "../lib/firebase";
import { getYouTubeVideoId, uploadCloudinaryImage } from "../utils/media";

const ADMIN_EMAIL = "fabulosaplay@gmail.com";

const tabs = [
  { id: "dashboard", label: "Resumen", icon: BarChart3 },
  { id: "banners", label: "Portada", icon: Image },
  { id: "channels", label: "Canales", icon: Tv },
  { id: "radios", label: "Radios", icon: Radio },
  { id: "movies", label: "Movies", icon: Clapperboard },
  { id: "settings", label: "Publicidad", icon: Megaphone },
];

const schemas = {
  banners: [
    { key: "mediaType", label: "Tipo de contenido", type: "select", defaultValue: "image", options: [{ value: "image", label: "Imagen desde la computadora" }, { value: "youtube", label: "Video de YouTube" }] },
    { key: "image", label: "Archivo o enlace", media: true, required: true },
    { key: "showContent", label: "Mostrar texto y botón sobre la publicidad", type: "checkbox", defaultValue: true },
    { key: "title", label: "Título (opcional)" }, { key: "subtitle", label: "Descripción (opcional)" },
    { key: "actionLabel", label: "Texto del botón (opcional)" },
    { key: "actionUrl", label: "Destino del botón", placeholder: "/canales-play" },
  ],
  channels: [
    { key: "title", label: "Nombre", required: true }, { key: "genre", label: "Categoría" },
    { key: "logo", label: "Logo", image: true }, { key: "url", label: "URL directa / HLS" },
    { key: "iframe_url", label: "URL de iframe" },
  ],
  radios: [
    { key: "title", label: "Nombre", required: true }, { key: "frequency", label: "Frecuencia" },
    { key: "genre", label: "Género" }, { key: "country", label: "País" },
    { key: "logo", label: "Logo", image: true }, { key: "url", label: "URL de la emisora", required: true },
    { key: "isHls", label: "Es una señal HLS", type: "checkbox" },
  ],
  movies: [
    { key: "title", label: "Título", required: true }, { key: "year", label: "Año" },
    { key: "category", label: "Categoría" }, { key: "description", label: "Descripción", type: "textarea" },
    { key: "poster", label: "Portada vertical", image: true }, { key: "backdrop", label: "Imagen horizontal", image: true },
    { key: "url", label: "URL HTTPS del archivo MP4", required: true, placeholder: "https://.../pelicula.mp4" },
    { key: "featured", label: "Película destacada", type: "checkbox" },
  ],
};

function friendlyAuthError(code) {
  if (code?.includes("invalid-credential")) return "El correo o la contraseña no son correctos.";
  if (code?.includes("too-many-requests")) return "Demasiados intentos. Espere unos minutos.";
  if (code?.includes("operation-not-allowed")) return "El acceso por correo todavía no está activado en Firebase.";
  return "No fue posible iniciar sesión. Revise la configuración de Firebase.";
}

function Login({ checking, accessError }) {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault(); setBusy(true); setError("");
    try { await signInWithEmailAndPassword(auth, email.trim(), password); }
    catch (reason) { setError(friendlyAuthError(reason?.code)); setBusy(false); }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_50%_0%,rgba(217,70,239,.2),transparent_42%),#07090f] p-5 text-white">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0d1019]/95 p-7 shadow-2xl sm:p-9">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-white/50 hover:text-white"><ArrowLeft size={17} /> Volver al sitio</Link>
        <img src="/logo-fabulosa.png" alt="Fabulosa Play" className="h-16 w-16 rounded-2xl object-contain" />
        <h1 className="mt-5 text-3xl font-black">Panel de control</h1><p className="mt-2 text-sm leading-6 text-white/50">Acceso exclusivo para administrar el contenido de Fabulosa Play.</p>
        {checking ? <p className="mt-8 text-sm text-white/45">Verificando acceso…</p> : (
          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="block text-sm font-bold text-white/70">Correo<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" className="focus-ring mt-2 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-white" /></label>
            <label className="block text-sm font-bold text-white/70">Contraseña<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className="focus-ring mt-2 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-white" /></label>
            {(error || accessError) && <p className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error || accessError}</p>}
            <button disabled={busy} className="focus-ring w-full rounded-xl bg-fuchsia-600 px-5 py-3.5 font-black transition hover:bg-fuchsia-500 disabled:opacity-50">{busy ? "Ingresando…" : "Ingresar"}</button>
          </form>
        )}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, color }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><div className={`grid h-10 w-10 place-items-center rounded-xl ${color}`}><Icon size={20} /></div><p className="mt-5 text-3xl font-black">{value}</p><p className="mt-1 text-sm text-white/45">{label}</p></div>;
}

function Dashboard({ catalogs, onMigrate }) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  async function migrate() {
    if (!window.confirm("Esto publicará el catálogo actual en Firebase. ¿Desea continuar?")) return;
    setBusy(true); setStatus("");
    try { await onMigrate(); setStatus("Catálogo publicado correctamente."); }
    catch (error) { setStatus(`No se pudo publicar: ${error.message}`); }
    finally { setBusy(false); }
  }
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={Tv} label="Canales" value={catalogs.channels.length} color="bg-fuchsia-500/15 text-fuchsia-300" />
        <Stat icon={Radio} label="Radios" value={catalogs.radios.length} color="bg-cyan-500/15 text-cyan-300" />
        <Stat icon={Clapperboard} label="Películas" value={catalogs.movies.length} color="bg-amber-500/15 text-amber-300" />
        <Stat icon={Image} label="Banners" value={catalogs.banners.length} color="bg-violet-500/15 text-violet-300" />
      </div>
      <div className="mt-7 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8"><h2 className="text-2xl font-black">Publicación inicial</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">Use este botón una sola vez para copiar los catálogos locales a Firebase. Después, cada cambio se guardará directamente desde su sección.</p><button type="button" onClick={migrate} disabled={busy} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-black text-slate-950 disabled:opacity-50"><Upload size={18} /> {busy ? "Publicando…" : "Publicar catálogo actual"}</button>{status && <p className="mt-4 text-sm text-white/65">{status}</p>}</div>
    </div>
  );
}

function BannerPreview({ source, mediaType }) {
  const youtubeId = getYouTubeVideoId(source);
  if (youtubeId) return <iframe src={`https://www.youtube-nocookie.com/embed/${youtubeId}`} title="Vista previa de YouTube" allow="autoplay; encrypted-media" className="mt-3 aspect-video w-full rounded-xl bg-black" />;
  if (mediaType === "video") return <video src={source} muted playsInline controls className="mt-3 aspect-video w-full rounded-xl bg-black object-cover" />;
  return <img src={source} alt="Vista previa" className="mt-3 aspect-[3/1] w-full rounded-xl bg-black object-cover" />;
}

function CatalogMedia({ item, catalogKey }) {
  const youtubeId = catalogKey === "banners" ? getYouTubeVideoId(item.image) : "";
  if (youtubeId) return <img src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`} alt="" className="h-12 w-16 shrink-0 rounded-lg bg-black object-cover" />;
  if (catalogKey === "banners" && item.mediaType === "video") return <video src={item.image} muted playsInline className="h-12 w-16 shrink-0 rounded-lg bg-black object-cover" />;
  return <img src={item.logo || item.poster || item.image || "/logo-fabulosa.png"} onError={(e) => { e.currentTarget.src = "/logo-fabulosa.png"; }} alt="" className="h-12 w-12 shrink-0 rounded-full bg-white object-contain p-1" />;
}

function CatalogEditor({ catalogKey, items, setItems, uploadConfig, onOpenSettings }) {
  const schema = schemas[catalogKey];
  const empty = useMemo(() => Object.fromEntries(schema.map((field) => [field.key, field.defaultValue ?? (field.type === "checkbox" ? false : "")])), [schema]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState("");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState("");
  const visible = useMemo(() => items.filter((item) => `${item.title || ""} ${item.genre || item.category || ""}`.toLowerCase().includes(search.toLowerCase())).slice(0, 120), [items, search]);

  function startEdit(item) { setEditingId(item.id); setForm({ ...empty, ...item }); setMessage(""); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function reset() { setEditingId(""); setForm(empty); setUploadProgress(0); }

  async function uploadImage(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) { setMessage("Seleccione un archivo de imagen."); return; }
    if (file.size > 15 * 1024 * 1024) { setMessage("La imagen supera 15 MB. Comprímala antes de subirla."); return; }
    if (!uploadConfig?.cloudName || !uploadConfig?.uploadPreset) {
      setMessage("Primero configure la carga gratuita de imágenes en la sección Publicidad."); return;
    }
    setUploading(true); setUploadProgress(0); setMessage("Subiendo imagen…");
    try {
      const url = await uploadCloudinaryImage(file, uploadConfig, setUploadProgress);
      setForm((current) => ({ ...current, image: url, mediaType: "image" }));
      setMessage("Imagen cargada correctamente. Ahora pulse Agregar y publicar.");
    } catch (error) {
      setMessage(`No se pudo subir la imagen: ${error.message}`);
    } finally {
      setUploading(false);
    }
  }

  async function submit(event) {
    event.preventDefault(); setBusy(true); setMessage("");
    if (catalogKey === "banners" && !editingId && items.length >= 20) {
      setBusy(false); setMessage("El carrusel admite un máximo de 20 anuncios. Elimine uno antes de agregar otro."); return;
    }
    const id = editingId || `${catalogKey.slice(0, -1)}-${Date.now()}`;
    const nextItem = { ...form, id };
    const next = editingId ? items.map((item) => item.id === editingId ? nextItem : item) : [nextItem, ...items];
    try { await saveCatalog(catalogKey, next); setItems(next); reset(); setMessage("Cambio publicado correctamente."); }
    catch (error) { setMessage(`No se pudo guardar: ${error.message}`); }
    finally { setBusy(false); }
  }

  async function remove(item) {
    if (!window.confirm(`¿Eliminar “${item.title}”?`)) return;
    setBusy(true); setMessage("");
    const next = items.filter((entry) => entry.id !== item.id);
    try { await saveCatalog(catalogKey, next); setItems(next); if (editingId === item.id) reset(); setMessage("Registro eliminado."); }
    catch (error) { setMessage(`No se pudo eliminar: ${error.message}`); }
    finally { setBusy(false); }
  }

  return (
    <div className="grid gap-7 xl:grid-cols-[420px_minmax(0,1fr)]">
      <form onSubmit={submit} className="h-fit rounded-3xl border border-white/10 bg-white/[0.04] p-6 xl:sticky xl:top-6">
        <div className="flex items-center justify-between"><h2 className="text-xl font-black">{editingId ? "Editar registro" : "Agregar registro"}</h2>{editingId && <button type="button" onClick={reset} className="grid h-9 w-9 place-items-center rounded-full bg-white/10"><X size={17} /></button>}</div>
        {catalogKey === "banners" && <p className="mt-2 text-xs leading-5 text-white/40">Carrusel principal: {items.length}/20 anuncios. Las imágenes duran 10 segundos y cada video se reproduce completo.</p>}
        {catalogKey === "banners" && <div className="mt-5 rounded-xl border border-sky-400/20 bg-sky-400/[0.06] p-4 text-xs leading-5 text-white/55"><strong className="block text-sm text-sky-200">Imágenes y videos gratuitos</strong><span className="mt-1 block">Las imágenes se seleccionan desde la computadora. Para los videos solamente debe pegar un enlace de YouTube.</span>{(!uploadConfig?.cloudName || !uploadConfig?.uploadPreset) && <button type="button" onClick={onOpenSettings} className="mt-3 font-black text-amber-300 hover:text-amber-200">Configurar carga de imágenes →</button>}</div>}
        <div className="mt-6 space-y-4">
          {schema.map((field) => field.media && catalogKey === "banners" ? (
            form.mediaType === "youtube" ? <label key={field.key} className="block text-sm font-bold text-white/65">Enlace del video de YouTube<input required value={form[field.key] || ""} placeholder="https://youtu.be/..." onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} className="focus-ring mt-2 w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-white" />{form[field.key] && <BannerPreview source={form[field.key]} mediaType="youtube" />}</label> : <div key={field.key}><span className="block text-sm font-bold text-white/65">Imagen publicitaria</span><label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-sky-400/35 bg-sky-400/[0.06] px-4 py-4 text-sm font-black text-sky-200 transition hover:bg-sky-400/10"><Upload size={18} /> {uploading ? `Subiendo… ${uploadProgress}%` : form[field.key] ? "Cambiar imagen" : "Seleccionar imagen de la computadora"}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={uploadImage} className="sr-only" /></label>{form[field.key] && <BannerPreview source={form[field.key]} mediaType="image" />}</div>
          ) : field.type === "checkbox" ? (
            <label key={field.key} className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-3 text-sm font-bold text-white/70"><input type="checkbox" checked={Boolean(form[field.key])} onChange={(e) => setForm({ ...form, [field.key]: e.target.checked })} className="h-4 w-4 accent-fuchsia-500" /> {field.label}</label>
          ) : field.type === "select" ? (
            <label key={field.key} className="block text-sm font-bold text-white/65">{field.label}<select value={form[field.key] || field.defaultValue || ""} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} className="focus-ring mt-2 w-full rounded-xl border border-white/10 bg-[#0c1019] px-3 py-2.5 text-sm text-white">{field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
          ) : (
            <label key={field.key} className="block text-sm font-bold text-white/65">{field.label}{field.type === "textarea" ? <textarea required={field.required} rows="3" value={form[field.key] || ""} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} className="focus-ring mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-white" /> : <input required={field.required} value={form[field.key] || ""} placeholder={field.placeholder || (field.image ? "https://.../imagen.jpg" : field.media ? "Pegue aquí el enlace" : "")} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} className="focus-ring mt-2 w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-white" />}{field.image && form[field.key] && <img src={form[field.key]} alt="Vista previa" className="mt-2 h-12 w-12 rounded-lg bg-white object-contain p-1" />}{field.media && form[field.key] && <BannerPreview source={form[field.key]} mediaType={form.mediaType} />}</label>
          ))}
        </div>
        <button disabled={busy || uploading} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-fuchsia-600 px-5 py-3 font-black hover:bg-fuchsia-500 disabled:opacity-50"><Save size={18} /> {busy ? "Guardando…" : editingId ? "Guardar cambios" : "Agregar y publicar"}</button>
        {message && <p className="mt-4 rounded-xl bg-white/[0.06] p-3 text-xs leading-5 text-white/65">{message}</p>}
      </form>

      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-xl font-black">Catálogo</h2><p className="mt-1 text-xs text-white/40">{items.length} registros · se muestran hasta 120 resultados</p></div><div className="relative sm:w-72"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar" className="focus-ring w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-3 text-sm" /></div></div>
        <div className="mt-5 space-y-2">{visible.map((item) => <article key={item.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3"><CatalogMedia item={item} catalogKey={catalogKey} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-black">{item.title || (catalogKey === "banners" ? "Publicidad sin texto" : "Sin nombre")}</p><p className="truncate text-xs text-white/35">{item.genre || item.category || item.frequency || (catalogKey === "banners" ? (getYouTubeVideoId(item.image) ? "YouTube" : item.mediaType === "video" ? "Video" : "Imagen") : item.actionUrl) || "Sin categoría"}</p></div><button type="button" onClick={() => startEdit(item)} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10 text-white/65 hover:text-white" aria-label="Editar"><Pencil size={16} /></button><button type="button" onClick={() => remove(item)} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-red-500/10 text-red-300 hover:bg-red-500/20" aria-label="Eliminar"><Trash2 size={16} /></button></article>)}</div>
      </div>
    </div>
  );
}

function SettingsEditor({ settings, setSettings }) {
  const [form, setForm] = useState(settings);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => setForm(settings), [settings]);
  async function submit(event) { event.preventDefault(); setBusy(true); setMessage(""); try { await saveCatalog("settings", form); setSettings(form); setMessage("Información publicada correctamente."); } catch (error) { setMessage(`No se pudo guardar: ${error.message}`); } finally { setBusy(false); } }
  const fields = [
    ["contactEmail", "Correo de contacto"], ["whatsapp", "WhatsApp con código de país"], ["website", "Página web"], ["facebook", "Enlace de Facebook"],
    ["instagram", "Enlace de Instagram"], ["businessHours", "Horario de atención"], ["cloudinaryCloudName", "Cloudinary: Cloud name"],
    ["cloudinaryUploadPreset", "Cloudinary: Upload preset"], ["contactIntro", "Texto de presentación"],
  ];
  return <form onSubmit={submit} className="max-w-3xl rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8"><h2 className="text-2xl font-black">Contacto y publicidad</h2><p className="mt-2 text-sm text-white/45">Esta información aparece en la página pública para anunciantes.</p><div className="mt-6 rounded-2xl border border-sky-400/15 bg-sky-400/[0.05] p-4 text-xs leading-5 text-white/50"><strong className="block text-sm text-sky-200">Carga gratuita de imágenes</strong><span className="mt-1 block">Cloud name y Upload preset permiten seleccionar imágenes desde la computadora. No escriba aquí el API Secret ni ninguna contraseña.</span></div><div className="mt-7 grid gap-5 sm:grid-cols-2">{fields.map(([key, label]) => <label key={key} className={`text-sm font-bold text-white/65 ${key === "contactIntro" ? "sm:col-span-2" : ""}`}>{label}{key === "contactIntro" ? <textarea rows="4" value={form[key] || ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="focus-ring mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-white" /> : <input value={form[key] || ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="focus-ring mt-2 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-white" />}</label>)}</div><button disabled={busy} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-fuchsia-600 px-5 py-3 font-black disabled:opacity-50"><Save size={18} /> {busy ? "Guardando…" : "Guardar información"}</button>{message && <p className="mt-4 text-sm text-white/60">{message}</p>}</form>;
}

export default function Admin() {
  const channelData = useCatalog("channels"); const radioData = useCatalog("radios"); const movieData = useCatalog("movies"); const bannerData = useCatalog("banners"); const settingsData = useCatalog("settings");
  const [user, setUser] = useState(null); const [checking, setChecking] = useState(true); const [active, setActive] = useState("dashboard");
  const [accessError, setAccessError] = useState("");
  const [channels, setChannels] = useState(channelData.data); const [radios, setRadios] = useState(radioData.data); const [movies, setMovies] = useState(movieData.data); const [banners, setBanners] = useState(bannerData.data); const [settings, setSettings] = useState(settingsData.data);
  useEffect(() => onAuthStateChanged(auth, async (account) => {
    if (account && account.email?.toLowerCase() !== ADMIN_EMAIL) {
      setUser(null); setChecking(false); setAccessError("Esta cuenta no tiene autorización para administrar Fabulosa Play.");
      await signOut(auth); return;
    }
    if (account) setAccessError("");
    setUser(account); setChecking(false);
  }), []);
  useEffect(() => setChannels(channelData.data), [channelData.data]); useEffect(() => setRadios(radioData.data), [radioData.data]); useEffect(() => setMovies(movieData.data), [movieData.data]); useEffect(() => setBanners(bannerData.data), [bannerData.data]); useEffect(() => setSettings(settingsData.data), [settingsData.data]);
  if (!user) return <Login checking={checking} accessError={accessError} />;
  const catalogs = { channels, radios, movies, banners };
  async function migrate() { for (const key of ["channels", "radios", "movies", "banners", "settings"]) await saveCatalog(key, key === "settings" ? settings : catalogs[key]); }
  return (
    <div className="min-h-screen bg-[#07090f] text-white lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
      <aside className="border-b border-white/10 bg-[#0b0e16] p-4 lg:min-h-screen lg:border-b-0 lg:border-r lg:p-5"><div className="flex items-center justify-between lg:block"><Link to="/" className="flex items-center gap-3"><img src="/logo-fabulosa.png" alt="" className="h-10 w-10 rounded-xl object-contain" /><span className="font-black">Fabulosa <span className="text-fuchsia-400">Admin</span></span></Link><button type="button" onClick={() => signOut(auth)} className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.06] text-white/55 lg:hidden"><LogOut size={18} /></button></div><nav className="no-scrollbar mt-4 flex gap-2 overflow-x-auto lg:mt-10 lg:block lg:space-y-1">{tabs.map(({ id, label, icon: Icon }) => <button type="button" key={id} onClick={() => setActive(id)} className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition lg:w-full ${active === id ? "bg-fuchsia-600 text-white" : "text-white/50 hover:bg-white/[0.06] hover:text-white"}`}><Icon size={18} /> {label}</button>)}</nav><div className="mt-auto hidden pt-10 lg:block"><p className="truncate text-xs text-white/35">{user.email}</p><button type="button" onClick={() => signOut(auth)} className="mt-3 flex w-full items-center gap-2 rounded-xl bg-white/[0.06] px-4 py-3 text-sm font-bold text-white/55 hover:text-white"><LogOut size={17} /> Cerrar sesión</button></div></aside>
      <main className="min-w-0 p-4 sm:p-7 lg:p-9"><header className="mb-8 flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[.2em] text-fuchsia-400">Panel de control</p><h1 className="mt-1 text-3xl font-black">{tabs.find((tab) => tab.id === active)?.label}</h1></div><Link to="/" className="hidden items-center gap-2 rounded-xl bg-white/[0.06] px-4 py-2.5 text-sm font-bold text-white/60 hover:text-white sm:flex"><ArrowLeft size={17} /> Ver sitio</Link></header>
        {active === "dashboard" && <Dashboard catalogs={catalogs} onMigrate={migrate} />}
        {active === "channels" && <CatalogEditor catalogKey="channels" items={channels} setItems={setChannels} />}
        {active === "radios" && <CatalogEditor catalogKey="radios" items={radios} setItems={setRadios} />}
        {active === "movies" && <CatalogEditor catalogKey="movies" items={movies} setItems={setMovies} />}
        {active === "banners" && <CatalogEditor catalogKey="banners" items={banners} setItems={setBanners} uploadConfig={{ cloudName: settings.cloudinaryCloudName, uploadPreset: settings.cloudinaryUploadPreset }} onOpenSettings={() => setActive("settings")} />}
        {active === "settings" && <SettingsEditor settings={settings} setSettings={setSettings} />}
      </main>
    </div>
  );
}
