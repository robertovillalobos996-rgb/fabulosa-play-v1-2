import { useEffect, useMemo, useState } from "react";
import useCameraChannel from "../hooks/useCameraChannel";
import { isCameraChannel } from "../utils/cameraStation";
import { cameraSlot, costaRicaClock } from "../utils/cameraChannel";
import ChannelPlayer from "./ChannelPlayer";
import CameraRadio from "./CameraRadio";
import FullscreenButton from "./FullscreenButton";
import HomeAdvertising from "./HomeAdvertising";
import "./cameraExperience.css";
const noop = () => {};
export default function CameraExperience({ channels, selected, advertising, reducedMotion, fullscreenTarget }) {
  const { config } = useCameraChannel();
  const [started] = useState(Date.now);
  const [now, setNow] = useState(Date.now);
  const cameras = useMemo(() => channels.filter(isCameraChannel), [channels]);
  const ordered = useMemo(() => {
    const first = cameras.findIndex((camera) => camera.id === selected.id);
    return first < 0 ? cameras : [...cameras.slice(first), ...cameras.slice(0, first)];
  }, [cameras, selected.id]);
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 250); return () => clearInterval(timer); }, []);
  const slot = cameraSlot(now - started, ordered.length);
  const camera = ordered[slot];
  const previous = slot === 0 ? ordered[ordered.length - 1] : ordered[slot - 1];
  const elapsed = now - started;
  const transition = !reducedMotion && ordered.length > 1 && elapsed >= 240000 && elapsed % 240000 < 800;
  const cameraLayer = (item, current) => item && <div key={item.id} className={`camera-video-layer ${current && transition ? "camera-video-enter" : ""}`} style={{ zIndex: current ? 2 : 1 }}><ChannelPlayer channel={item} onWatching={noop} fullscreenTarget={fullscreenTarget} /></div>;
  return <div className="camera-experience">
    <div className="camera-video-area">{transition && cameraLayer(previous, false)}{cameraLayer(camera, true)}</div>
    <div className="camera-channel-brand"><img src={config.channelLogo || "/logo-fabulosa.png"} alt={config.channelName || "Fabulosa Cámaras"} onError={(event) => { if (!event.currentTarget.src.endsWith("/logo-fabulosa.png")) event.currentTarget.src = "/logo-fabulosa.png"; }} /><time>{costaRicaClock(new Date(now))}</time></div>
    <CameraRadio url={config.liveAudioUrl} enabled={config.liveAudioEnabled !== false} />
    <FullscreenButton targetRef={fullscreenTarget} compact className="focus-ring camera-channel-fullscreen" />
    {config.advertisingEnabled !== false && <div className="camera-ad-break"><HomeAdvertising items={advertising} reducedMotion={reducedMotion} forceMuted /></div>}
  </div>;
}
