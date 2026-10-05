import { getYouTubeVideoId } from "./media.js";

export function normalizeChannelUrl(value) {
  const raw = String(value || "").trim();
  const iframe = raw.match(/<iframe\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/i);
  return (iframe?.[1] || raw).replace(/&amp;/gi, "&");
}

export function isHlsUrl(value) {
  try { return /\.m3u8$/i.test(decodeURIComponent(new URL(value, "https://fabulosaplay.online").pathname)); }
  catch { return false; }
}

export function getChannelSource(channel) {
  const iframe = normalizeChannelUrl(channel?.iframe_url);
  const direct = normalizeChannelUrl(channel?.url);
  const src = iframe || direct;
  if (!src) return { type: "missing", src: "" };
  try { if (!["http:", "https:"].includes(new URL(src, "https://fabulosaplay.online").protocol)) return { type: "missing", src: "" }; }
  catch { return { type: "missing", src: "" }; }
  if (isHlsUrl(src)) return { type: "hls", src };
  const youtube = getYouTubeVideoId(src);
  if (/^[a-zA-Z0-9_-]{11}$/.test(youtube)) return { type: "iframe", src: `https://www.youtube.com/embed/${youtube}?autoplay=1&playsinline=1&rel=0` };
  if (iframe) return { type: "iframe", src };
  if (/\.(mp4|webm|og[gv]|mov)(?:\?|#|$)/i.test(src)) return { type: "video", src };
  // Extensionless endpoints and redirect links may also deliver HLS manifests.
  return { type: "hls", src };
}
