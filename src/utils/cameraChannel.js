export const CAMERA_CHANNEL_DEFAULTS = {
  channelName: "Fabulosa Cámaras",
  channelCategory: "Cámaras",
  logoScale: 1, clockScale: 1, cameraLabels: {}, cameraLabelsEnabled: true,
  channelLogo: "/logo-fabulosa.png",
  liveAudioUrl: "https://ny1.radio.serverroom.net/4437/stream",
  liveAudioEnabled: true,
  advertisingEnabled: true,
};
export function cameraSlot(elapsed, count) {
  return count > 0 ? Math.floor(Math.max(0, elapsed) / 240000) % count : 0;
}
export function costaRicaClock(date) {
  return new Intl.DateTimeFormat("es-CR", { timeZone: "America/Costa_Rica", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).format(date);
}
export function validChannelUrl(value, local = false) {
  if (local && /^\/(?!\/)/.test(value)) return true;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}

export function combinedCameraCatalog(channels, config, isCamera) {
  const sources = channels.filter(isCamera);
  const others = channels.filter((channel) => !isCamera(channel));
  if (!sources.length) return others;
  return [{ id: "fabulosa-camera-channel", title: config.channelName || "Fabulosa Cámaras", genre: config.channelCategory || "Cámaras", logo: config.channelLogo || "/logo-fabulosa.png", combinedCameras: true }, ...others];
}
