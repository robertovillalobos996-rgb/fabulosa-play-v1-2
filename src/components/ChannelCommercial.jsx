import { Maximize, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import BannerVideo from "./BannerVideo";
import { IMAGE_COMMERCIAL_SECONDS, IMAGE_SKIP_SECONDS, VIDEO_SKIP_SECONDS, isBannerVideo, landscapeFullscreen } from "../utils/commercials";

export default function ChannelCommercial({ commercial, onFinish, fullscreenTarget }) {
  const isVideo = isBannerVideo(commercial);
  const [watched, setWatched] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const dialogRef = useRef(null);
  const skipAfter = isVideo ? VIDEO_SKIP_SECONDS : IMAGE_SKIP_SECONDS;
  const remaining = Math.max(0, Math.ceil(skipAfter - watched));
  const canSkip = remaining === 0;

  useEffect(() => {
    const previousFocus = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => { document.body.style.overflow = overflow; if (previousFocus?.isConnected) previousFocus.focus?.(); };
  }, []);

  useEffect(() => {
    if (started || (!isVideo && loaded)) return undefined;
    const timeout = window.setTimeout(onFinish, 20000);
    return () => window.clearTimeout(timeout);
  }, [isVideo, loaded, onFinish, started]);

  useEffect(() => {
    if (isVideo || !loaded) return undefined;
    let previous = performance.now();
    const visibility = () => { previous = performance.now(); };
    document.addEventListener("visibilitychange", visibility);
    const timer = window.setInterval(() => {
      const now = performance.now();
      const delta = Math.min(0.5, (now - previous) / 1000);
      previous = now;
      if (!document.hidden) setWatched((value) => value + delta);
    }, 100);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", visibility); };
  }, [isVideo, loaded]);

  useEffect(() => { if (!isVideo && watched >= IMAGE_COMMERCIAL_SECONDS) onFinish(); }, [isVideo, watched, onFinish]);

  function keyDown(event) {
    if (event.key === "Escape") { event.preventDefault(); if (canSkip) onFinish(); }
    if (event.key === "Tab") {
      const buttons = [...dialogRef.current.querySelectorAll("button:not(:disabled), a[href]")];
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialogRef.current)) { event.preventDefault(); first?.focus(); }
    }
  }

  return (
    <div ref={dialogRef} tabIndex={-1} onKeyDown={keyDown} role="dialog" aria-modal="true" aria-label="Comercial" className="channel-commercial fixed inset-0 z-[100] bg-black text-white outline-none">
      <div className="commercial-media absolute inset-0">
        {isVideo ? <BannerVideo source={commercial.image} muted={muted} onProgress={setWatched} onStatus={(status) => { if (status === "playing" || status === "blocked") setStarted(true); }} onEnded={onFinish} onError={onFinish} className="h-full w-full" /> : <img src={commercial.image} alt={commercial.title || "Publicidad"} onLoad={() => setLoaded(true)} onError={onFinish} className="h-full w-full object-contain" />}
      </div>
      <div className="commercial-top absolute inset-x-0 top-0 z-50 flex items-center justify-between gap-3 bg-gradient-to-b from-black/80 to-transparent p-4 sm:p-6">
        <span className="rounded-full border border-white/20 bg-black/55 px-3 py-1.5 text-xs font-bold">Publicidad</span>
        <div className="flex gap-2">
          {isVideo && <button type="button" onClick={() => setMuted((value) => !value)} aria-label={muted ? "Activar sonido" : "Silenciar comercial"} className="focus-ring rounded-full bg-black/65 p-3">{muted ? <VolumeX size={20} /> : <Volume2 size={20} />}</button>}
          <button type="button" onClick={() => landscapeFullscreen(fullscreenTarget.current)} aria-label="Ver comercial en pantalla completa horizontal" className="focus-ring rounded-full bg-black/65 p-3"><Maximize size={20} /></button>
        </div>
      </div>
      <div className="commercial-bottom absolute inset-x-0 bottom-0 z-50 flex items-end justify-between gap-3 bg-gradient-to-t from-black/85 to-transparent p-4 sm:p-6">
        <p className="max-w-[60%] text-xs text-white/70">{isVideo ? "Volverá al canal al terminar el video." : "Volverá al canal al terminar el anuncio."}</p>
        <button type="button" disabled={!canSkip} onClick={() => { if (canSkip) onFinish(); }} className="focus-ring shrink-0 rounded-xl border border-white/30 bg-white px-4 py-3 text-sm font-black text-slate-950 disabled:bg-black/75 disabled:text-white/70" aria-label={canSkip ? "Omitir comercial" : `Omitir en ${remaining} segundos`}>{canSkip ? "Omitir comercial" : `Omitir en ${remaining} s`}</button>
      </div>
    </div>
  );
}
