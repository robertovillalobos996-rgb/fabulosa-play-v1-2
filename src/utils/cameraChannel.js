export const CAMERA_CHANNEL_DEFAULTS = {
  channelName: "Fabulosa Cámaras",
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
