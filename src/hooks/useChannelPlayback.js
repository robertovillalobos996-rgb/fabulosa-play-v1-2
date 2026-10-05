import { useCallback, useEffect, useRef, useState } from "react";
import { channelEngineConfig, loadChannelEngine } from "../utils/channelPlayback";

export default function useChannelPlayback({ source, videoRef, onWatching }) {
  const [status, setStatus] = useState("connecting");
  const [levels, setLevels] = useState([]), [quality, setQuality] = useState(-1), [actualQuality, setActualQuality] = useState("");
  const [live, setLive] = useState(source.type === "hls");
  const controller = useRef({});

  useEffect(() => {
    const video = videoRef.current;
    let active = true, desired = true, phase = "connecting", engine, restartTimer, recovering = false;
    let retries = 0, mediaRecoveries = 0, selectedQuality = -1, resumeAt = 0, generation = 0;
    let lastProgress = performance.now(), lastTime = 0, pending = false;
    const transition = (next) => { if (active) { phase = next; setStatus(next); } };
    const watching = (value) => { if (active) onWatching(value); };
    setLevels([]); setQuality(-1); setActualQuality(""); setLive(source.type === "hls"); onWatching(false);

    function attemptPlay() {
      if (!active || !desired) return;
      const ticket = generation;
      video.play().catch(async (error) => {
        if (!active || !desired || ticket !== generation || error.name === "AbortError") return;
        if (error.name === "NotAllowedError") {
          video.muted = true;
          try { await video.play(); }
          catch { if (active && desired && ticket === generation) { transition("blocked"); watching(false); } }
        } else scheduleReconnect();
      });
    }
    function disposeEngine() {
      engine?.destroy(); engine = null;
      video.pause(); video.removeAttribute("src"); video.load();
    }
    function scheduleReconnect(permanent = false) {
      if (!active || restartTimer || !desired || ["missing", "iframe"].includes(source.type)) return;
      watching(false);
      const delay = permanent ? 30000 : [500, 1500, 3000, 6000, 12000, 30000][Math.min(retries++, 5)];
      transition(permanent || retries >= 4 ? "offline" : "buffering"); recovering = true;
      if (Number.isFinite(video.duration) && video.currentTime > 0) resumeAt = video.currentTime;
      restartTimer = window.setTimeout(() => {
        restartTimer = undefined;
        if (!active || !desired) return;
        if (document.hidden || navigator.onLine === false) { pending = true; transition("offline"); return; }
        connect();
      }, delay);
    }
    async function connect() {
      if (!active) return;
      const ticket = ++generation;
      recovering = true; disposeEngine(); recovering = false; pending = false;
      lastProgress = performance.now(); lastTime = 0;
      transition(retries >= 4 ? "offline" : "connecting"); watching(false);
      try {
        if (source.type === "hls") {
          const Hls = await loadChannelEngine();
          if (!active || ticket !== generation) return;
          if (!Hls.isSupported()) {
            if (video.canPlayType("application/vnd.apple.mpegurl")) { video.src = source.src; video.load(); }
            else transition("unsupported");
            return;
          }
          const current = new Hls(channelEngineConfig()); engine = current;
          current.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
            if (!active || engine !== current) return;
            setLevels(data.levels.map((level, index) => ({ index, label: level.height ? `${level.height}p` : `${Math.round(level.bitrate / 1000)} kbps` })));
            if (selectedQuality >= data.levels.length) { selectedQuality = -1; setQuality(-1); }
            current.loadLevel = selectedQuality; attemptPlay();
          });
          current.on(Hls.Events.LEVEL_LOADED, (_event, data) => { if (active && engine === current) setLive(Boolean(data.details.live)); });
          current.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => { if (active && engine === current) { const level = current.levels[data.level]; setActualQuality(level?.height ? `${level.height}p` : ""); } });
          current.on(Hls.Events.ERROR, (_event, data) => {
            if (!active || engine !== current || !data.fatal) return;
            watching(false);
            if (data.type === Hls.ErrorTypes.MEDIA_ERROR && mediaRecoveries++ < 2) { recovering = true; transition("buffering"); current.recoverMediaError(); }
            else scheduleReconnect([400, 401, 403, 404, 410].includes(data.response?.code));
          });
          // Start the playlist request while MediaSource attaches in parallel.
          current.loadSource(source.src); current.attachMedia(video);
        } else { video.src = source.src; video.load(); }
      } catch { if (active && ticket === generation) scheduleReconnect(); }
    }
    const playing = () => {
      if (!active || !desired) return;
      window.clearTimeout(restartTimer); restartTimer = undefined;
      recovering = false; retries = 0; mediaRecoveries = 0;
      lastProgress = performance.now(); lastTime = video.currentTime;
      transition("playing"); watching(true);
    };
    const waiting = () => { if (active && desired && video.readyState < 3 && !["offline", "unsupported"].includes(phase)) { transition("buffering"); watching(false); } };
    const paused = () => { watching(false); if (active && !recovering && (phase === "playing" || !desired)) { desired = false; transition("paused"); } };
    const canPlay = () => attemptPlay();
    const metadata = () => { if (resumeAt && Number.isFinite(video.duration)) { video.currentTime = Math.min(resumeAt, Math.max(0, video.duration - 0.1)); resumeAt = 0; } };
    const nativeError = () => { if (!engine) scheduleReconnect(); };
    const ended = () => { desired = false; transition("paused"); watching(false); };
    const online = () => { if (active && desired && (pending || phase === "offline")) { window.clearTimeout(restartTimer); restartTimer = undefined; connect(); } };
    const visibility = () => { lastProgress = performance.now(); if (!document.hidden && pending) online(); };
    const events = { playing, waiting, stalled: waiting, pause: paused, canplay: canPlay, loadedmetadata: metadata, error: nativeError, ended };
    Object.entries(events).forEach(([name, handler]) => video.addEventListener(name, handler));
    window.addEventListener("online", online); document.addEventListener("visibilitychange", visibility);
    controller.current = {
      play: () => { desired = true; if (phase === "offline" || video.error) { window.clearTimeout(restartTimer); restartTimer = undefined; connect(); } else attemptPlay(); },
      pause: () => { desired = false; window.clearTimeout(restartTimer); restartTimer = undefined; video.pause(); transition("paused"); watching(false); },
      quality: (value) => { selectedQuality = value; setQuality(value); if (engine) engine.loadLevel = value; },
      live: () => { const edge = engine?.liveSyncPosition ?? (video.seekable.length ? video.seekable.end(video.seekable.length - 1) - 1 : undefined); if (Number.isFinite(edge)) video.currentTime = Math.max(0, edge); desired = true; attemptPlay(); },
    };
    if (source.type === "missing" || (window.location.protocol === "https:" && source.src.startsWith("http:"))) transition("unavailable");
    else connect();
    const watchdog = window.setInterval(() => {
      if (!active || !desired || document.hidden || restartTimer || ["paused", "blocked", "unsupported", "unavailable"].includes(phase)) return;
      if (video.currentTime > lastTime + 0.05) { lastTime = video.currentTime; lastProgress = performance.now(); if (phase === "buffering" && !video.paused && video.readyState >= 3) { transition("playing"); watching(true); } }
      if (performance.now() - lastProgress > 20000) { lastProgress = performance.now(); scheduleReconnect(); }
    }, 1000);
    return () => {
      active = false; window.clearTimeout(restartTimer); window.clearInterval(watchdog);
      Object.entries(events).forEach(([name, handler]) => video.removeEventListener(name, handler));
      window.removeEventListener("online", online); document.removeEventListener("visibilitychange", visibility);
      controller.current = {}; disposeEngine(); onWatching(false);
    };
  }, [source.src, source.type, videoRef, onWatching]);

  return { status, levels, quality, actualQuality, live,
    play: useCallback(() => controller.current.play?.(), []), pause: useCallback(() => controller.current.pause?.(), []),
    setQuality: useCallback((value) => controller.current.quality?.(value), []), goLive: useCallback(() => controller.current.live?.(), []),
  };
}
