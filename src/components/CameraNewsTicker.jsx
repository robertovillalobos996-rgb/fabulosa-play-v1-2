import { useEffect, useRef, useState } from "react";
export default function CameraNewsTicker({ text, speed = 40, reducedMotion }) {
  const viewport = useRef(null), content = useRef(null);
  const [sizes, setSizes] = useState({ viewport: 0, text: 0 });
  useEffect(() => {
    const measure = () => { if (viewport.current && content.current) setSizes({ viewport: viewport.current.clientWidth, text: content.current.scrollWidth }); };
    measure(); const observer = new ResizeObserver(measure); observer.observe(viewport.current); observer.observe(content.current);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [text]);
  const pixelsPerSecond = Math.max(20, Math.min(80, Number(speed) || 40));
  const duration = Math.max(10, (sizes.viewport + sizes.text) / pixelsPerSecond);
  return <div className={`camera-news-ticker ${reducedMotion ? "camera-ticker-static" : ""}`} role="region" aria-label="Noticias e información" style={{ "--ticker-start": `${sizes.viewport}px`, "--ticker-end": `${-sizes.text}px`, "--ticker-duration": `${duration}s` }}>
    <span className="camera-news-badge">PSC INFORMA</span><div ref={viewport} className="camera-news-viewport"><span key={text} ref={content} className="camera-news-text">{text}</span></div>
  </div>;
}
