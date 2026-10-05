import { LoaderCircle, Pause, Play, Radio, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useChannelPlayback from "../hooks/useChannelPlayback";
import { closePlayerFullscreen, isPlayerFullscreen, landscapeFullscreen } from "../utils/commercials";
import FullscreenButton from "./FullscreenButton";

function audioPreferences() {
  try { const saved = JSON.parse(localStorage.getItem("fabulosa-player-audio-v1")); return { volume: typeof saved?.volume === "number" ? Math.min(1, Math.max(0, saved.volume)) : 0.85, muted: saved?.muted === true }; }
  catch { return { volume: 0.85, muted: false }; }
}
function timeLabel(value) {
  const seconds = Math.floor(Number.isFinite(value) ? Math.max(0, value) : 0);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function StreamPlayer({ channel, source, onWatching, fullscreenTarget }) {
  const videoRef = useRef(null), rootRef = useRef(null), hideTimer = useRef(null);
  const target = fullscreenTarget || rootRef;
  const [audio, setAudio] = useState(audioPreferences), [shown, setShown] = useState(true);
  const [time, setTime] = useState(0), [duration, setDuration] = useState(0);
  useEffect(() => { const video = videoRef.current; video.volume = audio.volume; video.muted = audio.muted; try { localStorage.setItem("fabulosa-player-audio-v1", JSON.stringify(audio)); } catch { /* Private browsing. */ } }, [audio]);
  const player = useChannelPlayback({ source, videoRef, onWatching });
  useEffect(() => {
    window.clearTimeout(hideTimer.current);
    if (player.status !== "playing") { setShown(true); return undefined; }
    hideTimer.current = window.setTimeout(() => { if (!rootRef.current?.contains(document.activeElement)) setShown(false); }, 3000);
    return () => window.clearTimeout(hideTimer.current);
  }, [player.status, shown]);
  function reveal() {
    setShown(true); window.clearTimeout(hideTimer.current);
    if (player.status === "playing") hideTimer.current = window.setTimeout(() => { if (!rootRef.current?.contains(document.activeElement)) setShown(false); }, 3000);
  }
  function togglePlay() { if (["playing", "buffering", "connecting"].includes(player.status)) player.pause(); else player.play(); reveal(); }
  function toggleFullscreen() { if (isPlayerFullscreen(target.current)) closePlayerFullscreen(target.current); else landscapeFullscreen(target.current); }
  function keyDown(event) {
    if (["INPUT", "SELECT", "BUTTON", "A"].includes(event.target.tagName)) return;
    const key = event.key.toLowerCase();
    if ([" ", "k", "m", "f", "arrowup", "arrowdown"].includes(key)) event.preventDefault();
    if (key === " " || key === "k") togglePlay();
    if (key === "m") setAudio((current) => ({ ...current, muted: !current.muted }));
    if (key === "f") toggleFullscreen();
    if (key === "arrowup" || key === "arrowdown") setAudio((current) => ({ muted: false, volume: Math.min(1, Math.max(0, current.volume + (key === "arrowup" ? 0.1 : -0.1))) }));
    reveal();
  }
  const paused = ["paused", "blocked"].includes(player.status);
  const buffering = ["connecting", "buffering"].includes(player.status);
  const unavailable = ["offline", "unavailable", "unsupported"].includes(player.status);
  const controlsVisible = shown || player.status !== "playing";
  return <div ref={rootRef} tabIndex={0} role="region" aria-label={`Reproductor de ${channel.title}`} onKeyDown={keyDown} onPointerMove={reveal} onPointerDown={reveal} onFocus={reveal} className={`stream-player relative h-full w-full overflow-hidden bg-black outline-none ${controlsVisible ? "" : "stream-controls-hidden"}`}>
    <video ref={videoRef} playsInline preload="auto" onClick={() => { if (paused) player.play(); reveal(); }} onDoubleClick={toggleFullscreen} onTimeUpdate={() => setTime(videoRef.current.currentTime)} onDurationChange={() => setDuration(videoRef.current.duration)} onVolumeChange={() => setAudio((current) => { const next = { volume: videoRef.current.volume, muted: videoRef.current.muted }; return next.volume === current.volume && next.muted === current.muted ? current : next; })} className="h-full w-full object-contain" />
    <div className="stream-chrome pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center gap-3 bg-gradient-to-b from-black/85 to-transparent p-4 pb-12"><span className={`h-2 w-2 rounded-full ${unavailable ? "bg-white/35" : "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,.6)]"}`} /><strong className="min-w-0 truncate text-sm font-bold text-white">{channel.title}</strong><span className="ml-auto shrink-0 rounded-md border border-white/20 bg-black/40 px-2 py-1 text-[10px] font-black tracking-wider text-white/85">{player.live ? "EN VIVO" : "VIDEO"}</span></div>
    {(buffering || unavailable) && <div className="pointer-events-none absolute inset-0 grid place-items-center"><div className="max-w-xs px-5 text-center">{buffering ? <><LoaderCircle size={36} className="mx-auto animate-spin text-sky-400" /><p className="mt-3 text-xs font-medium text-white/65">{player.status === "connecting" ? "Conectando…" : "Ajustando la señal…"}</p></> : <><Radio size={30} className="mx-auto text-white/35" /><p className="mt-3 text-sm text-white/65">{player.status === "unsupported" ? "Esta señal necesita un navegador compatible." : "La señal del canal no está disponible en este momento."}</p></>}</div></div>}
    {paused && <button type="button" onClick={player.play} aria-label="Reproducir canal" className="focus-ring absolute left-1/2 top-1/2 z-20 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-sky-500/90 text-white shadow-lg shadow-sky-950/50"><Play size={28} fill="currentColor" /></button>}
    <div className="stream-chrome absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/80 to-transparent px-3 pb-3 pt-12 sm:px-5 sm:pb-4">
      {!player.live && Number.isFinite(duration) && duration > 0 && <input type="range" aria-label="Posición del video" min={0} max={duration} step={0.1} value={Math.min(time, duration)} onChange={(event) => { videoRef.current.currentTime = Number(event.target.value); }} className="mb-3 h-1 w-full cursor-pointer accent-sky-400" />}
      <div className="flex items-center gap-1.5 sm:gap-3"><button type="button" onClick={togglePlay} aria-label={paused || unavailable ? "Reproducir" : "Pausar"} title={paused || unavailable ? "Reproducir (K)" : "Pausar (K)"} className="focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-lg text-white hover:bg-white/10">{paused || unavailable ? <Play size={23} fill="currentColor" /> : <Pause size={23} fill="currentColor" />}</button><button type="button" onClick={() => setAudio((current) => ({ ...current, muted: !current.muted, volume: current.volume || 0.85 }))} aria-label={audio.muted || audio.volume === 0 ? "Activar sonido" : "Silenciar"} className="focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-lg text-white hover:bg-white/10">{audio.muted || audio.volume === 0 ? <VolumeX size={21} /> : <Volume2 size={21} />}</button><input aria-label="Volumen" type="range" min={0} max={1} step={0.05} value={audio.muted ? 0 : audio.volume} onChange={(event) => setAudio({ volume: Number(event.target.value), muted: false })} className="hidden h-1 w-20 cursor-pointer accent-sky-400 sm:block" />{player.live ? <button type="button" onClick={player.goLive} aria-label="Ir al directo" className="focus-ring inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-black text-white/85 hover:bg-white/10"><span className="h-1.5 w-1.5 rounded-full bg-red-500" /> EN VIVO</button> : Number.isFinite(duration) && duration > 0 && <span className="shrink-0 text-[11px] tabular-nums text-white/65">{timeLabel(time)} / {timeLabel(duration)}</span>}<div className="ml-auto flex items-center gap-2">{player.levels.length > 1 && <select aria-label="Calidad de video" value={player.quality} onChange={(event) => player.setQuality(Number(event.target.value))} className="focus-ring max-w-28 rounded-lg border border-white/15 bg-black/80 px-2 py-2 text-[11px] font-bold text-white"><option value={-1}>Auto{player.actualQuality ? ` · ${player.actualQuality}` : ""}</option>{player.levels.map((level) => <option key={level.index} value={level.index}>{level.label}</option>)}</select>}<FullscreenButton targetRef={target} compact className="focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-lg text-white hover:bg-white/10" /></div></div>
    </div>
  </div>;
}
