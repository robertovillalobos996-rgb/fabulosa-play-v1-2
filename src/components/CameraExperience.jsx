import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useCameraChannel from "../hooks/useCameraChannel";
import { isCameraChannel } from "../utils/cameraStation";
import { costaRicaClock } from "../utils/cameraChannel";
import { getChannelSource } from "../utils/channelMedia";
import ChannelPlayer from "./ChannelPlayer";
import CameraRadio from "./CameraRadio";
import CameraNewsTicker from "./CameraNewsTicker";
import useLiveAudience from "../hooks/useLiveAudience";
import useCameraNews from "../hooks/useCameraNews";
import FullscreenButton from "./FullscreenButton";
import HomeAdvertising from "./HomeAdvertising";
import "./cameraExperience.css";
function CameraLayer({ camera, mode, onReady, fullscreenTarget, reducedMotion }) {
  const ready = useCallback((playing) => onReady(camera.id, playing), [camera.id, onReady]);
  return <div inert className={`camera-video-layer ${["hls", "video"].includes(getChannelSource(camera).type) ? "camera-layer-native" : ""} camera-layer-${mode} ${mode === "current" && !reducedMotion ? "camera-video-enter" : ""}`} aria-hidden={mode !== "current" || undefined}><ChannelPlayer channel={camera} onWatching={ready} fullscreenTarget={fullscreenTarget} /></div>;
}
export default function CameraExperience({ channels, advertising, reducedMotion, fullscreenTarget }) {
  const [audioPlaying, setAudioPlaying] = useState(false);
  const { config } = useCameraChannel();
  const cameras = useMemo(() => channels.filter(isCameraChannel), [channels]);
  const [currentId, setCurrentId] = useState("");
  const [outgoingId, setOutgoingId] = useState("");
  const [now, setNow] = useState(Date.now);
  const started = useRef(0), transitionUntil = useRef(0), ready = useRef(new Set()), failed = useRef(new Set());
  const [controls, setControls] = useState(true);
  const hideTimer = useRef(null);
  const markReady = useCallback((id, playing) => { if (playing) ready.current.add(id); else ready.current.delete(id); }, []);
  const reveal = useCallback(() => { setControls(true); clearTimeout(hideTimer.current); hideTimer.current = setTimeout(() => setControls(false), 2500); }, []);
  useEffect(() => { reveal(); return () => clearTimeout(hideTimer.current); }, [reveal]);
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 250); return () => clearInterval(timer); }, []);
  const currentIndex = cameras.findIndex((camera) => camera.id === currentId);
  const current = cameras[currentIndex < 0 ? 0 : currentIndex];
  const next = cameras.length > 1 ? cameras.find((camera, offset) => offset > currentIndex && !failed.current.has(camera.id)) || cameras.find((camera) => camera.id !== current?.id && !failed.current.has(camera.id)) : null;
  const elapsed = now - started.current;
  const nativeNext = next && ["hls", "video"].includes(getChannelSource(next).type);
  const preload = nativeNext && elapsed >= 220000 ? next : null;
  useEffect(() => {
    if (!current) return;
    if (currentId !== current.id) { started.current = Date.now(); setCurrentId(current.id); failed.current.clear(); return; }
    if (outgoingId && now >= transitionUntil.current) setOutgoingId("");
    if (!next || now - started.current < 240000) return;
    // Native signals only become current after they are actually playing.
    if (nativeNext && !ready.current.has(next.id)) {
      if (now - started.current >= 260000) { failed.current.add(next.id); started.current = now - 240000; }
      return;
    }
    setOutgoingId(current.id); setCurrentId(next.id); started.current = now; transitionUntil.current = now + (reducedMotion ? 0 : 800); failed.current.clear();
  }, [current, currentId, next, nativeNext, now, outgoingId, reducedMotion]);
  const outgoing = cameras.find((camera) => camera.id === outgoingId);
  const layers = [outgoing, preload, current].filter((camera, index, all) => camera && all.findIndex((item) => item?.id === camera.id) === index);
  const news = useCameraNews(config.tickerGoogleEnabled !== false && config.tickerEnabled !== false);
  const newsText = news.filter((item) => item.region === "Costa Rica" ? config.tickerCostaRica !== false : config.tickerWorld !== false).map((item) => {
    const hour = new Intl.DateTimeFormat("es-CR", { timeZone: "America/Costa_Rica", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(item.publishedAt));
    return `${item.region}: ${item.title} — ${item.source} (${hour})`;
  });
  const tickerItems = [String(config.tickerText || "").replace(/\s+/g, " ").trim(), ...newsText].filter(Boolean);
  const tickerVisible = config.tickerEnabled !== false && tickerItems.length > 0;
  const label = config.cameraLabels?.[current?.id] || current?.title || "Cámara en vivo";
  useLiveAudience(current ? { channelId: "fabulosa-camera-channel", channelName: config.channelName || "Fabulosa Cámaras", camera: true, cameraName: label, audioPlaying, videoPlaying: ready.current.has(current.id), verified: ["hls", "video"].includes(getChannelSource(current).type) || /youtube/.test(getChannelSource(current).src) } : null);
  const scale = (value) => Math.min(2.5, Math.max(.5, Number(value) || 1));
  return <div className={`camera-experience ${controls ? "camera-controls-visible" : ""} ${tickerVisible ? "camera-has-ticker" : ""}`} onPointerMove={reveal} onPointerDown={reveal} onFocusCapture={reveal} style={{ "--camera-logo-scale": scale(config.logoScale), "--camera-clock-scale": scale(config.clockScale) }}>
    <div className="camera-video-area">{layers.map((camera) => <CameraLayer key={camera.id} camera={camera} mode={camera.id === current?.id ? "current" : camera.id === outgoingId ? "outgoing" : "preload"} onReady={markReady} fullscreenTarget={fullscreenTarget} reducedMotion={reducedMotion} />)}</div>
    {current && <div className="camera-native-glass" aria-hidden="true" />}
    <div className="camera-channel-brand"><img src={config.channelLogo || "/logo-fabulosa.png"} alt={config.channelName || "Fabulosa Cámaras"} onError={(event) => { if (!event.currentTarget.src.endsWith("/logo-fabulosa.png")) event.currentTarget.src = "/logo-fabulosa.png"; }} /><time>{costaRicaClock(new Date(now))}</time></div>
    {config.cameraLabelsEnabled !== false && <div className="camera-location"><span className="camera-live-dot" /><span>{label}</span><small>EN VIVO</small></div>}
    {tickerVisible && <CameraNewsTicker items={tickerItems} speed={config.tickerSpeed} reducedMotion={reducedMotion} />}
    <CameraRadio onListening={setAudioPlaying} url={config.liveAudioUrl} enabled={config.liveAudioEnabled !== false} />
    <FullscreenButton targetRef={fullscreenTarget} compact className="focus-ring camera-channel-fullscreen" />
    {config.advertisingEnabled !== false && <div className="camera-ad-break" inert><HomeAdvertising items={advertising} reducedMotion={reducedMotion} forceMuted /></div>}
  </div>;
}
