import { ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AD_STRIP_RATIO, homeAdSeconds, safeAdDestination, visibleHomeAds } from "../utils/homeAdvertising";
import useAdvertisingImage from "../hooks/useAdvertisingImage";
import { loadAdvertisingImage } from "../utils/advertisingImages";
import "./homeAdvertising.css";

export default function HomeAdvertising({ items = [], reducedMotion = false }) {
  const ads = useMemo(() => visibleHomeAds(items), [items]);
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [motionOverride, setMotionOverride] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [failed, setFailed] = useState(false);
  const [previous, setPrevious] = useState(null);
  const [visible, setVisible] = useState(true);
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const lastImage = useRef(null);
  const ad = ads[index % Math.max(ads.length, 1)];
  const video = ad?.mediaType === "video";
  const destination = safeAdDestination(ad?.actionUrl);
  const { source, error: imageError } = useAdvertisingImage(ad?.source);
  const stopped = paused || (reducedMotion && !motionOverride);
  const running = visible && !stopped;

  function advance(direction = 1) {
    if (ads.length > 1) setIndex((value) => (value + direction + ads.length) % ads.length);
  }

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setFailed(false);
    setBlocked(false);
  }, [ad]);

  useEffect(() => {
    if (imageError) setFailed(true);
  }, [imageError]);

  useEffect(() => {
    if (!source) return undefined;
    setPrevious(lastImage.current);
    lastImage.current = video ? null : { ...ad, source };
    const timer = window.setTimeout(() => setPrevious(null), 650);
    return () => window.clearTimeout(timer);
  }, [ad, video, source]);

  useEffect(() => {
    const next = ads[(index + 1) % Math.max(ads.length, 1)];
    if (next?.mediaType !== "video" && next?.source) loadAdvertisingImage(next.source).catch(() => {});
  }, [ads, index]);

  useEffect(() => {
    if (!ad || !source || video || ads.length < 2 || !running) return undefined;
    const timer = window.setTimeout(() => setIndex((value) => (value + 1) % ads.length), homeAdSeconds(ad) * 1000);
    return () => window.clearTimeout(timer);
  }, [ad, source, video, ads.length, running]);

  useEffect(() => {
    const element = videoRef.current;
    if (!element || !video) return;
    if (running) element.play().then(() => setBlocked(false)).catch((error) => {
      if (error.name !== "AbortError") setBlocked(true);
    });
    else element.pause();
  }, [source, video, running]);

  // A damaged asset never traps the carousel on a black frame.
  useEffect(() => {
    if (!failed || ads.length < 2 || !running) return undefined;
    const timer = window.setTimeout(() => setIndex((value) => (value + 1) % ads.length), 3000);
    return () => window.clearTimeout(timer);
  }, [failed, ads.length, running]);

  function togglePlay() {
    if (blocked || (reducedMotion && !motionOverride)) {
      setMotionOverride(true);
      setPaused(false);
      videoRef.current?.play().then(() => { setBlocked(false); setPaused(false); }).catch(() => setBlocked(true));
    } else setPaused((value) => !value);
  }

  const label = ad?.title || "Publicidad en Fabulosa Play";
  return (
    <section ref={sectionRef} className="home-ad-section" aria-label="Publicidad del inicio">
      <div className="home-ad-heading"><span>PUBLICIDAD</span>{ads.length > 1 && <span>{index % ads.length + 1} / {ads.length}</span>}</div>
      <div className="home-ad-frame" style={{ aspectRatio: AD_STRIP_RATIO }}>
        <div className="home-ad-placeholder" aria-hidden="true"><img src="/logo-fabulosa.png" alt="" /><span>Canales · Radios · Películas</span></div>
        {previous?.source && previous.source !== source && <img src={previous.source} alt="" className="home-ad-media home-ad-previous" />}
        {ad && source && !failed && (video ? (
          <video key={`${ad.id}-${source}`} ref={videoRef} src={source} muted={muted} playsInline preload="metadata" loop={ads.length === 1} onEnded={() => advance()} onError={() => setFailed(true)} onPlaying={() => setBlocked(false)} aria-label={label} className="home-ad-media home-ad-current" />
        ) : <img key={`${ad.id}-${source}`} src={source} alt={label} onError={() => setFailed(true)} className="home-ad-media home-ad-current" />)}
        {destination && !failed && (/^https?:/i.test(destination)
          ? <a href={destination} target="_blank" rel="noopener noreferrer" className="home-ad-link focus-ring" aria-label={`Abrir ${label}`} />
          : <Link to={destination} className="home-ad-link focus-ring" aria-label={`Abrir ${label}`} />)}
        {ad && <div className="home-ad-controls">
          {ads.length > 1 && <button type="button" onClick={() => advance(-1)} aria-label="Publicidad anterior"><ChevronLeft size={15} /></button>}
          {(video || ads.length > 1) && <button type="button" onClick={togglePlay} aria-label={stopped || blocked ? "Reproducir publicidad" : "Pausar publicidad"}>{stopped || blocked ? <Play size={13} /> : <Pause size={13} />}</button>}
          {video && <button type="button" onClick={() => setMuted((value) => !value)} aria-label={muted ? "Activar sonido de publicidad" : "Silenciar publicidad"}>{muted ? <VolumeX size={15} /> : <Volume2 size={15} />}</button>}
          {ads.length > 1 && <button type="button" onClick={() => advance()} aria-label="Siguiente publicidad"><ChevronRight size={15} /></button>}
        </div>}
      </div>
    </section>
  );
}
