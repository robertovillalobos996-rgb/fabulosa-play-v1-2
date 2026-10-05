import { Maximize, Minimize } from "lucide-react";
import { useEffect, useState } from "react";
import { closePlayerFullscreen, isPlayerFullscreen, landscapeFullscreen } from "../utils/commercials";

export default function FullscreenButton({ targetRef }) {
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    const element = targetRef.current;
    const update = () => setExpanded(isPlayerFullscreen(element));
    const key = (event) => { if (event.key === "Escape" && element?.classList.contains("player-expanded")) closePlayerFullscreen(element); };
    document.addEventListener("fullscreenchange", update);
    document.addEventListener("webkitfullscreenchange", update);
    element?.addEventListener("playerfullscreenchange", update);
    document.addEventListener("keydown", key);
    update();
    return () => {
      document.removeEventListener("fullscreenchange", update);
      document.removeEventListener("webkitfullscreenchange", update);
      element?.removeEventListener("playerfullscreenchange", update);
      document.removeEventListener("keydown", key);
    };
  }, [targetRef]);
  return <button type="button" onClick={() => { if (expanded) closePlayerFullscreen(targetRef.current); else landscapeFullscreen(targetRef.current); }} aria-label={expanded ? "Salir de pantalla completa" : "Pantalla completa"} className="focus-ring absolute right-3 top-3 z-30 flex items-center gap-2 rounded-full border border-white/20 bg-black/75 px-3 py-2.5 text-xs font-bold text-white">{expanded ? <Minimize size={20} /> : <Maximize size={20} />}<span className="hidden sm:inline">{expanded ? "Salir" : "Pantalla completa"}</span></button>;
}
