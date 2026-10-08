import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

// Each immutable image has its own document; image bytes never inflate the catalog.
const PREFIX = "catalog-image:";
const MAX_IMAGE_BYTES = 350 * 1024;
const cache = new Map();

export function isStoredAdvertisingImage(source = "") {
  return /^catalog-image:home-ad-image-[a-zA-Z0-9-]+$/.test(source);
}

async function readDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("No se pudo leer la imagen seleccionada."));
    reader.readAsDataURL(blob);
  });
}

async function decodeImage(file) {
  const url = URL.createObjectURL(file);
  const image = new Image();
  try {
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error("El archivo no es una imagen válida. Seleccione otra imagen."));
      image.src = url;
    });
    return image;
  } finally { URL.revokeObjectURL(url); }
}

function encodeCanvas(canvas, quality) {
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("No se pudo preparar la imagen.")), "image/webp", quality));
}

export async function prepareAdvertisingImage(file) {
  if (!/^image\/(jpeg|png|webp|gif|avif)$/.test(file.type)) throw new Error("Seleccione una imagen JPG, PNG, WebP, GIF o AVIF.");
  if (file.size > 5 * 1024 * 1024) throw new Error("La imagen supera 5 MB. Reduzca su tamaño antes de subirla.");
  // Preserve GIF animation instead of flattening it through a canvas.
  if (file.type === "image/gif") {
    if (file.size > MAX_IMAGE_BYTES) throw new Error("Para conservar la animación, el GIF debe pesar menos de 350 KB. También puede usar un video.");
    return { dataUrl: await readDataUrl(file), contentType: file.type, sizeBytes: file.size };
  }
  const image = await decodeImage(file);
  const canvas = document.createElement("canvas");
  let scale = Math.min(1, 2560 / image.naturalWidth, 1600 / image.naturalHeight);
  for (let attempt = 0; attempt < 4; attempt += 1) {
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.92, 0.82, 0.72, 0.6]) {
      const blob = await encodeCanvas(canvas, quality);
      if (blob.size <= MAX_IMAGE_BYTES) return { dataUrl: await readDataUrl(blob), contentType: blob.type, sizeBytes: blob.size, width: canvas.width, height: canvas.height };
    }
    scale *= 0.75;
  }
  throw new Error("No se pudo optimizar esta imagen. Seleccione una versión más pequeña.");
}

export async function saveAdvertisingImage(file, onProgress) {
  if (auth.currentUser?.email?.toLowerCase() !== "fabulosaplay@gmail.com") throw new Error("Inicie sesión con la cuenta administradora.");
  onProgress?.(5);
  const image = await prepareAdvertisingImage(file);
  onProgress?.(40);
  const id = `home-ad-image-${crypto.randomUUID()}`;
  try {
    await setDoc(doc(db, "catalog", id), { ...image, type: "home-ad-image", createdAt: serverTimestamp() });
  } catch (reason) {
    if (reason.code?.includes("permission-denied")) throw new Error("Su sesión no permite guardar la imagen. Vuelva a ingresar al panel.");
    throw new Error("No se pudo guardar la imagen. Revise la conexión y vuelva a publicar.");
  }
  onProgress?.(100);
  const source = PREFIX + id;
  cache.set(source, Promise.resolve(image.dataUrl));
  return source;
}

export async function loadAdvertisingImage(source) {
  if (!isStoredAdvertisingImage(source)) return source;
  if (cache.has(source)) return cache.get(source);
  const pending = (async () => {
    const snapshot = await getDoc(doc(db, "catalog", source.slice(PREFIX.length)));
    const image = snapshot.exists() && snapshot.data();
    if (image.type !== "home-ad-image" || !/^data:image\/(webp|png|jpeg|gif|avif);base64,/.test(image.dataUrl || "") || image.dataUrl.length > 600000) throw new Error("No se pudo cargar la imagen del anuncio.");
    return image.dataUrl;
  })();
  cache.set(source, pending);
  if (cache.size > 30) cache.delete(cache.keys().next().value);
  try { return await pending; }
  catch (error) { cache.delete(source); throw error; }
}

export async function deleteAdvertisingImage(source) {
  if (!isStoredAdvertisingImage(source)) return;
  await deleteDoc(doc(db, "catalog", source.slice(PREFIX.length)));
  cache.delete(source);
}
