import { useCallback, useEffect, useRef, useState } from "react";
import { commercialQueue, COMMERCIAL_INTERVAL_MS, COMMERCIAL_SESSION_KEY, nextCommercial, restoreCommercialClock } from "../utils/commercials";

function readClock() {
  try { return restoreCommercialClock(JSON.parse(sessionStorage.getItem(COMMERCIAL_SESSION_KEY))); }
  catch { return restoreCommercialClock(); }
}
function storeClock(clock) {
  try { sessionStorage.setItem(COMMERCIAL_SESSION_KEY, JSON.stringify(clock)); } catch { /* Private browsing can block session storage. */ }
}

export default function useChannelCommercials({ banners, watching, ready }) {
  const [commercial, setCommercial] = useState(null);
  const clock = useRef(null);
  const active = useRef(null);
  const previousTick = useRef(0);
  const current = useRef({ banners, watching, ready });
  useEffect(() => { current.current = { banners, watching, ready }; }, [banners, watching, ready]);

  useEffect(() => {
    clock.current = readClock();
    previousTick.current = performance.now();
    let lastSave = previousTick.current;
    const visibility = () => { previousTick.current = performance.now(); };
    document.addEventListener("visibilitychange", visibility);
    const timer = window.setInterval(() => {
      const now = performance.now();
      const delta = Math.min(1500, Math.max(0, now - previousTick.current));
      previousTick.current = now;
      if (!active.current && current.current.watching && current.current.ready && !document.hidden) {
        clock.current.elapsed = Math.min(COMMERCIAL_INTERVAL_MS, clock.current.elapsed + delta);
        const next = nextCommercial(clock.current, commercialQueue(current.current.banners));
        if (next) { active.current = next; setCommercial(next); }
      }
      if (now - lastSave >= 5000) { storeClock(clock.current); lastSave = now; }
    }, 500);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", visibility);
      storeClock(clock.current);
    };
  }, []);

  const finish = useCallback(() => {
    if (!active.current) return;
    clock.current = { elapsed: 0, next: active.current.queueIndex + 1, lastId: active.current.id };
    storeClock(clock.current);
    previousTick.current = performance.now();
    active.current = null;
    setCommercial(null);
  }, []);

  return { commercial, finish };
}
