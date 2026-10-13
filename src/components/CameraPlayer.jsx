import { useEffect, useRef, useState } from "react";
import StreamPlayer from "./StreamPlayer";
import FullscreenButton from "./FullscreenButton";
import { normalizeChannelUrl } from "../utils/channelMedia";
import { getYouTubeVideoId } from "../utils/media";
import { loadYouTubeApi } from "../utils/youtube";

function SilentYouTube({ videoId, onWatching, fullscreenTarget }) {
  const container = useRef(null);
  const [error, setError] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const playerRef = useRef(null);
  useEffect(() => {
    let active = true, player, timer;
    setError(false); setBlocked(false); onWatching(false);
    const target = document.createElement("div"); container.current.replaceChildren(target);
    loadYouTubeApi().then((YT) => {
      if (!active) return;
      player = new YT.Player(target, {
        videoId, playerVars: { autoplay: 1, mute: 1, controls: 0, disablekb: 1, fs: 0, playsinline: 1, rel: 0, origin: location.origin },
        events: {
          onReady: (event) => {
            if (!active) return;
            playerRef.current = event.target;
            event.target.getIframe().setAttribute("allow", "autoplay; encrypted-media; fullscreen");
            event.target.getIframe().setAttribute("tabindex", "-1");
            event.target.getIframe().setAttribute("title", "Cámara de YouTube sin audio");
            event.target.mute(); event.target.playVideo();
            timer = setInterval(() => { if (active && event.target.isMuted?.() === false) event.target.mute(); }, 500);
          },
          onStateChange: (event) => { if (active) { event.target.mute(); const playing = event.data === 1; onWatching(playing); if (playing) setBlocked(false); } },
          onAutoplayBlocked: () => { if (active) setBlocked(true); },
          onError: () => { if (active) { setError(true); onWatching(false); } },
        },
      });
    }).catch(() => { if (active) setError(true); });
    return () => { active = false; clearInterval(timer); player?.destroy?.(); playerRef.current = null; onWatching(false); };
  }, [videoId, onWatching]);
  return <div className="relative h-full w-full bg-black">
    <div ref={container} className="media-youtube pointer-events-none h-full w-full" inert />
    <div className="absolute inset-0" aria-hidden="true" />
    {error && <p className="absolute inset-0 grid place-items-center p-6 text-center text-sm text-white/60">El proveedor no permite mostrar esta cámara en este momento.</p>}
    {blocked && <button type="button" onClick={() => { playerRef.current?.mute(); playerRef.current?.playVideo(); }} className="focus-ring absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-950">Mostrar cámara</button>}
    <FullscreenButton targetRef={fullscreenTarget} />
  </div>;
}

export default function CameraPlayer({ channel, source, onWatching, fullscreenTarget }) {
  const videoId = getYouTubeVideoId(normalizeChannelUrl(channel.iframe_url || channel.url));
  if (videoId) return <SilentYouTube videoId={videoId} onWatching={onWatching} fullscreenTarget={fullscreenTarget} />;
  if (["hls", "video"].includes(source.type)) return <StreamPlayer channel={channel} source={source} onWatching={onWatching} fullscreenTarget={fullscreenTarget} silent />;
  // A cross-origin iframe cannot be muted reliably without its provider API.
  // Never load an uncontrolled, audible player into the Cameras category.
  return <div className="grid h-full place-items-center bg-black p-6 text-center text-sm text-white/60"><p>Esta cámara necesita un enlace HLS, MP4 o YouTube para mostrarla sin audio.</p></div>;
}
