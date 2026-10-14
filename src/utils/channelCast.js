import { getChannelSource } from './channelMedia';
let loading;
export function castMedia(channel, origin = window.location.origin) {
  if (channel.combinedCameras) return null;
  const source = getChannelSource(channel);
  if (!['hls', 'video'].includes(source.type)) return null;
  const url = new URL(source.src, origin);
  if (url.protocol !== 'https:') return null;
  return { url: url.href, type: source.type === 'hls' ? 'application/x-mpegURL' : /\.webm$/i.test(url.pathname) ? 'video/webm' : /\.og[gv]$/i.test(url.pathname) ? 'video/ogg' : /\.mov$/i.test(url.pathname) ? 'video/quicktime' : 'video/mp4', live: source.type === 'hls' };
}
export function loadCast() {
  if (window.cast?.framework && window.chrome?.cast) return Promise.resolve(window.cast.framework.CastContext.getInstance());
  if (!loading) loading = new Promise((resolve, reject) => {
    let finished = false;
    const finish = (available) => {
      if (finished) return;
      finished = true; clearTimeout(timer);
      if (!available || !window.cast?.framework) { document.getElementById("fabulosa-cast-sdk")?.remove(); loading = undefined; reject(new Error('Google Cast no está disponible en este navegador. Use Chrome compatible o duplicación de pantalla.')); return; }
      const context = window.cast.framework.CastContext.getInstance();
      context.setOptions({ receiverApplicationId: window.chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID, autoJoinPolicy: window.chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED });
      resolve(context);
    };
    const timer = setTimeout(() => finish(false), 15000);
    window.__onGCastApiAvailable = finish;
    let script = document.getElementById('fabulosa-cast-sdk');
    if (!script) { script = document.createElement('script'); script.id = 'fabulosa-cast-sdk'; script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1'; script.async = true; document.head.appendChild(script); }
    script.onerror = () => { script.remove(); finish(false); };
  });
  return loading;
}
export async function sendChannelToCast(context, channel, currentTime = 0) {
  const source = castMedia(channel);
  if (!source) throw new Error('Esta señal requiere duplicar la pantalla.');
  if (!context.getCurrentSession()) await context.requestSession();
  const session = context.getCurrentSession();
  if (!session) throw new Error('No se seleccionó un televisor.');
  const api = window.chrome.cast.media;
  const info = new api.MediaInfo(source.url, source.type);
  info.streamType = source.live ? api.StreamType.LIVE : api.StreamType.BUFFERED;
  const metadata = new api.GenericMediaMetadata(); metadata.title = channel.title || 'Fabulosa Play';
  info.metadata = metadata;
  const request = new api.LoadRequest(info); request.autoplay = true;
  if (!source.live && Number.isFinite(currentTime)) request.currentTime = Math.max(0, currentTime);
  await session.loadMedia(request);
  return session;
}
