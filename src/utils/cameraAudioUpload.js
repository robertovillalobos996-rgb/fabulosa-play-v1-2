const MAX_FREE_FILE = 50 * 1024 * 1024;
let session = null;

export function validateStationStorage(config) {
  const url = String(config.storageUrl || "").replace(/\/+$/, "");
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url)) throw new Error("Escriba la URL de su proyecto Supabase (https://...supabase.co).");
  const key = String(config.storageKey || "").trim();
  if (key.startsWith("sb_secret_")) throw new Error("Use la clave pública; nunca una clave secreta o service_role.");
  if (key.startsWith("ey")) {
    try { if (JSON.parse(atob(key.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))).role !== "anon") throw new Error(); }
    catch { throw new Error("La clave debe ser pública anon; nunca service_role."); }
  } else if (!key.startsWith("sb_publishable_")) throw new Error("Escriba la clave pública publishable o anon de Supabase.");
  const bucket = String(config.storageBucket || "camera-radio").trim();
  if (!/^[a-z0-9_-]+$/i.test(bucket)) throw new Error("El nombre del contenedor solo admite letras, números, guion y guion bajo.");
  return { url, key, bucket };
}

export async function connectStationStorage(config, email, password) {
  const { url, key } = validateStationStorage(config);
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, { method: "POST", headers: { apikey: key, "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.msg || data.error_description || "No se pudo conectar la cuenta de almacenamiento.");
  if (data.user?.email?.toLowerCase() !== "fabulosaplay@gmail.com") throw new Error("Conecte la cuenta administradora fabulosaplay@gmail.com.");
  session = { url, key, access: data.access_token, refresh: data.refresh_token, expires: Date.now() + data.expires_in * 1000 };
}

export function disconnectStationStorage() { session = null; }

async function accessToken(config) {
  const { url, key } = validateStationStorage(config);
  if (!session || session.url !== url || session.key !== key) throw new Error("Conecte su cuenta de almacenamiento antes de subir archivos.");
  if (session.expires < Date.now() + 60000) {
    const response = await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, { method: "POST", headers: { apikey: key, "Content-Type": "application/json" }, body: JSON.stringify({ refresh_token: session.refresh }) });
    const data = await response.json();
    if (!response.ok) { session = null; throw new Error("La sesión de almacenamiento terminó. Conéctese nuevamente."); }
    session = { ...session, access: data.access_token, refresh: data.refresh_token, expires: Date.now() + data.expires_in * 1000 };
  }
  return session.access;
}

export async function measureAudio(source, timeout = 30000) {
  const audio = document.createElement("audio");
  audio.preload = "metadata";
  try {
    return await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("No se pudo leer la duración del audio. Verifique el archivo o su enlace.")), timeout);
      const done = (error) => { clearTimeout(timer); if (error) reject(error); else resolve(audio.duration); };
      audio.onloadedmetadata = () => Number.isFinite(audio.duration) && audio.duration > 0 ? done() : done(new Error("Seleccione un archivo de audio con duración definida."));
      audio.onerror = () => done(new Error("El navegador no puede leer ese audio. Use MP3, M4A, WAV u OGG compatible."));
      audio.src = source;
    });
  } finally { audio.removeAttribute("src"); audio.load(); }
}

export async function uploadCameraAudio(file, kind, config, onProgress) {
  if (!["music", "id", "commercial", "voice"].includes(kind)) throw new Error("Tipo de audio inválido.");
  if (!/\.(mp3|m4a|aac|wav|ogg|flac)$/i.test(file.name)) throw new Error("Seleccione archivos MP3, M4A, AAC, WAV, OGG o FLAC.");
  if (file.size > MAX_FREE_FILE) throw new Error(`${file.name}: Supabase Free admite hasta 50 MB por archivo. Puede agregar un enlace HTTPS para un mix más grande.`);
  const local = URL.createObjectURL(file);
  let duration;
  try { duration = await measureAudio(local); } finally { URL.revokeObjectURL(local); }
  const { url, key, bucket } = validateStationStorage(config);
  const token = await accessToken(config);
  const path = `${kind}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${url}/storage/v1/object/${encodeURIComponent(bucket)}/${path}`);
    xhr.setRequestHeader("apikey", key); xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("Content-Type", file.type || ({ mp3: "audio/mpeg", m4a: "audio/mp4", aac: "audio/aac", wav: "audio/wav", ogg: "audio/ogg", flac: "audio/flac" }[file.name.split(".").pop().toLowerCase()])); xhr.setRequestHeader("Cache-Control", "3600");
    xhr.upload.onprogress = (event) => { if (event.lengthComputable) onProgress?.(Math.round(event.loaded / event.total * 100)); };
    xhr.timeout = 180000;
    xhr.onload = () => { if (xhr.status >= 200 && xhr.status < 300) resolve(); else { let text; try { text = JSON.parse(xhr.responseText).message; } catch { /* Plain-text response. */ } reject(new Error(text || `No se pudo subir el archivo (${xhr.status}). Revise el contenedor, sus permisos y la capacidad disponible.`)); } };
    xhr.onerror = () => reject(new Error("Falló la conexión con el almacenamiento. Revise el servicio y sus permisos."));
    xhr.ontimeout = () => reject(new Error("La carga tardó demasiado. Intente nuevamente."));
    xhr.send(file);
  });
  return { url: `${url}/storage/v1/object/public/${encodeURIComponent(bucket)}/${path}`, duration, sizeBytes: file.size, storagePath: path, storageBucket: bucket, storageProject: url };
}

export async function deleteCameraAudioFile(track, config) {
  if (!track.storagePath) return;
  const { url, key } = validateStationStorage(config);
  if (track.storageProject !== url) throw new Error("Conecte el proyecto original del archivo para eliminarlo.");
  const token = await accessToken(config);
  const response = await fetch(`${url}/storage/v1/object/${encodeURIComponent(track.storageBucket)}`, { method: "DELETE", headers: { apikey: key, Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ prefixes: [track.storagePath] }) });
  if (!response.ok) throw new Error("No se pudo borrar el audio de la nube. Verifique los permisos.");
}
