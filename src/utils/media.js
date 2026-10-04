export function getYouTubeVideoId(value = "") {
  const source = String(value).trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(source)) return source;

  try {
    const url = new URL(source);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    if (host === "youtu.be") return url.pathname.split("/").filter(Boolean)[0] || "";
    if (host === "youtube.com" || host.endsWith(".youtube.com")) {
      if (url.pathname === "/watch") return url.searchParams.get("v") || "";
      const match = url.pathname.match(/^\/(?:embed|shorts|live)\/([a-zA-Z0-9_-]{11})/);
      return match?.[1] || "";
    }
  } catch {
    return "";
  }
  return "";
}

export function uploadCloudinaryImage(file, { cloudName, uploadPreset }, onProgress) {
  return new Promise((resolve, reject) => {
    if (!cloudName || !uploadPreset) {
      reject(new Error("Falta configurar Cloudinary en la sección Publicidad."));
      return;
    }

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", uploadPreset);

    const request = new XMLHttpRequest();
    request.open("POST", `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`);
    request.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
    });
    request.addEventListener("load", () => {
      let response;
      try { response = JSON.parse(request.responseText); }
      catch { reject(new Error("Cloudinary devolvió una respuesta no válida.")); return; }
      if (request.status >= 200 && request.status < 300 && response.secure_url) resolve(response.secure_url);
      else reject(new Error(response.error?.message || "No fue posible subir la imagen."));
    });
    request.addEventListener("error", () => reject(new Error("No fue posible conectar con Cloudinary.")));
    request.send(form);
  });
}
