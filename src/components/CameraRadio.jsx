import { useEffect, useRef, useState } from "react";
import { Music2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { CAMERA_AUDIO_KINDS, createCameraRadioPlanner } from "../utils/cameraStation";

function readVolume() { try { const value = Number(localStorage.getItem("fabulosa-camera-radio-volume")); return localStorage.getItem("fabulosa-camera-radio-volume") !== null && Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0.7; } catch { return 0.7; } }

export default function CameraRadio({ config, tracks, loading, error }) {
  const audioRef = useRef(null), planner = useRef(null), currentRef = useRef(null), control = useRef({}), desired = useRef(true);
  const [current, setCurrent] = useState(null), [status, setStatus] = useState("loading"), [volume, setVolume] = useState(readVolume);
  const [message, setMessage] = useState("");
  const settings = useRef({ config, tracks, loading });
  useEffect(() => { settings.current = { config, tracks, loading }; planner.current?.update(tracks, config); if (config.enabled === false) { audioRef.current?.pause(); setStatus("paused"); } else if (!loading && desired.current && audioRef.current?.paused && currentRef.current) control.current.play?.(); }, [config, tracks, loading]);
  useEffect(() => { audioRef.current.volume = volume; try { localStorage.setItem("fabulosa-camera-radio-volume", String(volume)); } catch { /* Private mode. */ } }, [volume]);
  useEffect(() => {
    const audio = audioRef.current;
    let active = true, started = false, busy = false, ticket = 0, lastProgress = performance.now(), lastTime = 0;
    desired.current = true;
    planner.current = createCameraRadioPlanner(settings.current.tracks, settings.current.config);
    async function play() {
      if (settings.current.config.enabled === false || !desired.current) return;
      const version = ticket;
      try { await audio.play(); if (!active || !desired.current || settings.current.config.enabled === false) { audio.pause(); return; } if (active && desired.current && version === ticket) { setStatus("playing"); setMessage(""); } }
      catch (reason) { if (!active || version !== ticket || reason.name === "AbortError") return; if (reason.name === "NotAllowedError") setStatus("blocked"); else fail(); }
    }
    function advance() {
      if (!active || !desired.current || settings.current.loading || settings.current.config.enabled === false) return;
      const next = planner.current.next();
      currentRef.current = next; setCurrent(next); ticket++; lastProgress = performance.now(); lastTime = 0;
      if (!next) { audio.pause(); audio.removeAttribute("src"); setStatus("empty"); return; }
      started = true; setStatus("loading"); audio.src = next.url; audio.load(); play();
    }
    function fail() {
      if (!active || busy || !currentRef.current) return;
      busy = true; planner.current.reject(currentRef.current);
      setMessage("Un audio no está disponible. Continuando con la programación.");
      audio.pause();
      setTimeout(() => { busy = false; if (active) advance(); }, 250);
    }
    function ended() { advance(); }
    function playing() { if (active) { setStatus("playing"); lastProgress = performance.now(); } }
    function ready() { if (active && desired.current && settings.current.config.enabled !== false) play(); }
    audio.addEventListener("ended", ended); audio.addEventListener("error", fail); audio.addEventListener("playing", playing); audio.addEventListener("canplay", ready);
    control.current = {
      play: () => { desired.current = true; if (!currentRef.current || audio.error || audio.ended) advance(); else play(); },
      pause: () => { desired.current = false; audio.pause(); setStatus("paused"); },
    };
    const timer = setInterval(() => {
      if (!active || settings.current.loading || settings.current.config.enabled === false || !desired.current) return;
      if (!started || (!currentRef.current && settings.current.tracks.some((track) => track.kind === "music" && track.enabled !== false))) { advance(); return; }
      if (audio.currentTime > lastTime + 0.01) { lastTime = audio.currentTime; lastProgress = performance.now(); }
      else if (!audio.paused && performance.now() - lastProgress > 20000 && !document.hidden) fail();
    }, 500);
    return () => {
      active = false; ticket++; clearInterval(timer); control.current = {}; planner.current = null;
      audio.removeEventListener("ended", ended); audio.removeEventListener("error", fail); audio.removeEventListener("playing", playing); audio.removeEventListener("canplay", ready);
      audio.pause(); audio.removeAttribute("src"); audio.load();
    };
  }, []);
  const enabled = config.enabled !== false;
  const playing = status === "playing";
  const label = error ? "No se pudo cargar la emisora" : loading ? "Cargando programación…" : !enabled ? "Música desactivada" : current ? current.title : "Música para acompañar su vista";
  return <div className="camera-radio" aria-label="Emisora de Cámaras">
    <audio ref={audioRef} preload="auto" />
    <Music2 size={16} className="shrink-0 text-cyan-300" />
    <div className="min-w-0 flex-1"><strong className="block truncate text-xs">{config.name || "Fabulosa Radio"}</strong><span className="block truncate text-[10px] text-white/60" aria-live="polite">{label}{current && ` · ${CAMERA_AUDIO_KINDS[current.kind]}`}</span></div>
    {enabled && <><button type="button" className="focus-ring camera-radio-button" disabled={!current && (loading || !tracks.length)} aria-label={playing ? "Pausar música de Cámaras" : "Activar música de Cámaras"} onClick={() => playing ? control.current.pause?.() : control.current.play?.()}>{playing ? <Pause size={15} /> : <Play size={15} />}</button><button type="button" className="focus-ring camera-radio-button" aria-label={volume === 0 ? "Activar volumen de la emisora" : "Silenciar emisora"} onClick={() => { setVolume(volume === 0 ? 0.7 : 0); if (status === "blocked") control.current.play?.(); }}>{volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}</button><input type="range" min="0" max="1" step="0.05" aria-label="Volumen de la emisora de Cámaras" value={volume} onChange={(event) => setVolume(Number(event.target.value))} /></>}
    {message && <span className="sr-only" role="status">{message}</span>}
  </div>;
}
