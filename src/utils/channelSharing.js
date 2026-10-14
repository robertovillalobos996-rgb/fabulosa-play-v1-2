export function channelShareUrl(channel, origin, tv = false) {
  const url = new URL('/canales-play', origin);
  url.searchParams.set('channel', String(channel.id));
  if (tv) url.searchParams.set('tv', '1');
  return url.href;
}
export function resolveSharedChannel(channels, id) {
  return channels.find((item) => item.id === id) || (id.startsWith('fabulosa-camera-channel') ? channels.find((item) => item.combinedCameras === true) : null) || null;
}
export async function copyChannelUrl(url) {
  if (navigator.clipboard?.writeText) {
    try { await navigator.clipboard.writeText(url); return; } catch { /* Try the clipboard fallback. */ }
  }
  const input = document.createElement('textarea');
  input.value = url; input.setAttribute('readonly', ''); input.style.position = 'fixed'; input.style.opacity = '0';
  document.body.appendChild(input); input.select();
  try { if (!document.execCommand('copy')) throw new Error('No se pudo copiar. Seleccione el enlace y cópielo manualmente.'); }
  finally { input.remove(); }
}
