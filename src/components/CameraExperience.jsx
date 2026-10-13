import { useCallback, useEffect, useMemo, useState } from "react";
import useCameraStation from "../hooks/useCameraStation";
import { stationMinutes } from "../utils/cameraStation";
import { visibleHomeAds } from "../utils/homeAdvertising";
import CameraRadio from "./CameraRadio";
import HomeAdvertising from "./HomeAdvertising";
import "./cameraExperience.css";

const REST_KEY = "fabulosa-camera-ad-rest-until";
function restUntil() { try { return Number(sessionStorage.getItem(REST_KEY)) || 0; } catch { return 0; } }

function CameraAdvertising({ items, config, reducedMotion }) {
  const ads = useMemo(() => visibleHomeAds(items), [items]);
  const [nextAt, setNextAt] = useState(restUntil);
  const [now, setNow] = useState(Date.now);
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);
  const finish = useCallback(() => {
    const next = Date.now() + Math.max(0.1, stationMinutes(config.advertisingMinutes, 10)) * 60000;
    try { sessionStorage.setItem(REST_KEY, String(next)); } catch { /* Private mode. */ }
    setNextAt(next); setNow(Date.now());
  }, [config.advertisingMinutes]);
  if (!ads.length || config.advertisingEnabled === false || now < nextAt) return null;
  return <div className="camera-ad-break" aria-label="Bloque de publicidad de Cámaras"><HomeAdvertising items={ads} reducedMotion={reducedMotion} singlePass forceMuted onComplete={finish} /></div>;
}

export default function CameraExperience({ children, advertising, reducedMotion }) {
  const station = useCameraStation();
  return <div className="camera-experience">
    <div className="h-full w-full">{children}</div>
    <CameraRadio {...station} />
    {!station.loading && <CameraAdvertising items={advertising} config={station.config} reducedMotion={reducedMotion} />}
  </div>;
}
