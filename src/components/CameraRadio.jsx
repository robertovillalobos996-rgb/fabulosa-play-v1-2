import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
export default function CameraRadio({ url, enabled }) {
  const audio = useRef(null);
  const [volume, setVolume] = useState(.8);
  const [muted, setMuted] = useState(false);
  const [status, setStatus] = useState("loading");
  const retry = useRef(null);
  useEffect(() => {
    const media = audio.current;
    if (!enabled || !url) return undefined;
    let active = true;
    const play = () => { media.play().catch((error) => { if (active) setStatus(error.name === "NotAllowedError" ? "blocked" : "error"); }); };
    const reconnect = () => {
      if (!active) return;
      setStatus("error"); clearTimeout(retry.current);
      retry.current = setTimeout(() => { if (active) { media.load(); play(); } }, 5000);
    };
    const playing = () => { setStatus("playing"); clearTimeout(retry.current); };
    media.addEventListener("playing", playing);
    media.addEventListener("error", reconnect);
    media.addEventListener("ended", reconnect);
    media.addEventListener("stalled", reconnect);
    media.src = url; play();
    return () => { active = false; clearTimeout(retry.current); media.removeEventListener("playing", playing); media.removeEventListener("error", reconnect); media.removeEventListener("ended", reconnect); media.removeEventListener("stalled", reconnect); media.pause(); media.removeAttribute("src"); media.load(); };
  }, [url, enabled]);
  useEffect(() => { if (audio.current) { audio.current.volume = volume; audio.current.muted = muted; } }, [volume, muted]);
  if (!enabled) return null;
  const activate = () => { setMuted(false); audio.current.play().catch(() => setStatus("error")); };
  return <div className="camera-live-volume">
    <audio ref={audio} preload="none" />
    <button type="button" className="focus-ring camera-volume-button" aria-label={status !== "playing" ? "Activar audio de RadioBOSS" : muted ? "Activar sonido" : "Silenciar radio"} onClick={() => { if (status !== "playing") activate(); else setMuted(!muted); }}>{muted ? <VolumeX size={20} /> : <Volume2 size={20} />}</button>
    <input aria-label="Volumen de RadioBOSS" type="range" min="0" max="1" step=".01" value={volume} onChange={(event) => { setVolume(Number(event.target.value)); setMuted(false); if (status !== "playing") activate(); }} />
    {status !== "playing" && <span role="status">{status === "error" ? "Radio sin señal; toque volumen para reintentar" : "Toque volumen para activar audio"}</span>}
  </div>;
}
