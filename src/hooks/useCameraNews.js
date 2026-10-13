import { useEffect, useState } from "react";
export default function useCameraNews(enabled) {
  const [headlines, setHeadlines] = useState([]);
  useEffect(() => {
    if (!enabled) return undefined;
    let active = true, controller;
    const refresh = async () => {
      controller?.abort(); controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      try {
        const response = await fetch("/api/camera-news", { signal: controller.signal });
        if (!response.ok) throw new Error("Noticias no disponibles");
        const body = await response.json();
        if (active) setHeadlines(Array.isArray(body.headlines) ? body.headlines : []);
      } catch { if (active) setHeadlines([]); } finally { clearTimeout(timeout); }
    };
    refresh(); const timer = setInterval(refresh, 300000);
    const visible = () => { if (document.visibilityState === "visible") refresh(); };
    document.addEventListener("visibilitychange", visible);
    return () => { active = false; clearInterval(timer); controller?.abort(); document.removeEventListener("visibilitychange", visible); };
  }, [enabled]);
  return enabled ? headlines.filter((item) => Number(item.publishedAt) >= new Date().getTime() - 86400000) : [];
}
