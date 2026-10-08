import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { auth } from "../lib/firebase";
import { saveAdvertisingImage } from "./advertisingImages";

export async function uploadHomeAdvertising(file, onProgress) {
  if (auth.currentUser?.email?.toLowerCase() !== "fabulosaplay@gmail.com") throw new Error("Inicie sesión con la cuenta administradora.");
  const video = /^video\/(mp4|webm)$/.test(file.type);
  const image = /^image\/(jpeg|png|webp|gif|avif)$/.test(file.type);
  if (!image && !video) throw new Error("Seleccione una imagen JPG, PNG, WebP, GIF o AVIF, o un video MP4/WebM.");
  if (image) return { source: await saveAdvertisingImage(file, onProgress), mediaType: "image" };
  if (file.size >= 250 * 1024 * 1024) throw new Error("El video debe pesar menos de 250 MB.");
  const storage = getStorage(auth.app);
  storage.maxUploadRetryTime = 90000;
  const target = ref(storage, `banners/home-advertising/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`);
  const task = uploadBytesResumable(target, file, { contentType: file.type, cacheControl: "public,max-age=31536000" });
  return new Promise((resolve, reject) => {
    task.on("state_changed", (snapshot) => onProgress?.(Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100)), (error) => {
      const messages = {
        "storage/unauthorized": "El almacenamiento no permite subir este video. Revise los permisos de la cuenta administradora.",
        "storage/bucket-not-found": "El almacenamiento de videos todavía no está habilitado.",
        "storage/quota-exceeded": "El almacenamiento de videos alcanzó su límite.",
        "storage/retry-limit-exceeded": "No se pudo completar la carga. Revise la conexión y el almacenamiento de videos.",
      };
      reject(new Error(messages[error.code] || "No se pudo subir el video. Revise la conexión y vuelva a intentarlo."));
    }, async () => {
      try { resolve({ source: await getDownloadURL(task.snapshot.ref), mediaType: "video" }); }
      catch { reject(new Error("El video se subió, pero no se pudo obtener su enlace. Intente nuevamente.")); }
    });
  });
}
