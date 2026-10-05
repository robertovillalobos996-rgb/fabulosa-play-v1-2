import { AlertTriangle, LoaderCircle, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { getChannelSource } from "../utils/channelMedia";

export default function ChannelPlayer({ channel, onWatching }) {
  const source = useMemo(() => getChannelSource(channel), [channel]);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    let hls;
    let retryTimer;
    let loadingTimer;
    let networkRetries = 0;
    let mediaRetries = 0;
    const video = videoRef.current;
    onWatching(false);
    setMessage("");
    setStatus("loading");
    const fail = (text) => { if (active) { window.clearTimeout(loadingTimer); setMessage(text); setStatus("error"); onWatching(false); } };
    const play = () => {
      if (!active || !video) return;
      video.play().catch((reason) => {
        if (!active || reason.name === "AbortError") return;
        if (reason.name === "NotAllowedError") { setStatus("paused"); setMessage("Pulse Reproducir para iniciar el canal."); }
        else fail("No fue posible iniciar esta señal. Puede volver a intentarlo.");
      });
    };
    if (source.type === "missing") fail("Este canal todavía no tiene un enlace de transmisión válido.");
    else if (window.location.protocol === "https:" && source.src.startsWith("http:")) fail("El enlace de esta señal necesita actualizarse. Puede abrir la señal por separado.");
    else if (source.type === "iframe") {
      // Playback stays with the provider; fullscreen is explicitly allowed.
    } else {
      loadingTimer = window.setTimeout(() => fail("La señal tardó en responder. Pulse Reintentar."), 25000);
      const canPlay = () => { window.clearTimeout(loadingTimer); play(); };
      video.addEventListener("canplay", canPlay);
      async function start() {
        if (source.type === "hls" && !video.canPlayType("application/vnd.apple.mpegurl")) {
          const { default: Hls } = await import("hls.js");
          if (!active) return;
          if (!Hls.isSupported()) { fail("Este navegador no admite esta señal. Puede abrirla por separado."); return; }
          hls = new Hls({ enableWorker: true, lowLatencyMode: false, backBufferLength: 30 });
          hlsRef.current = hls;
          hls.on(Hls.Events.MEDIA_ATTACHED, () => { if (active) hls.loadSource(source.src); });
          hls.on(Hls.Events.MANIFEST_PARSED, play);
          hls.on(Hls.Events.ERROR, (_event, data) => {
            if (!active || !data.fatal) return;
            onWatching(false);
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR && networkRetries++ < 2) {
              setStatus("loading");
              window.clearTimeout(retryTimer);
              retryTimer = window.setTimeout(() => { if (active) hls.startLoad(); }, 1500);
            } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR && mediaRetries++ < 1) hls.recoverMediaError();
            else fail("El servidor de este canal no respondió o bloqueó la señal. Pulse Reintentar.");
          });
          hls.attachMedia(video);
        } else {
          video.src = source.src;
          video.load();
        }
      }
      start().catch(() => fail("No fue posible cargar esta señal. Pulse Reintentar."));
      return () => {
        active = false;
        window.clearTimeout(retryTimer);
        window.clearTimeout(loadingTimer);
        video.removeEventListener("canplay", canPlay);
        hls?.destroy();
        hlsRef.current = null;
        video.pause();
        video.removeAttribute("src");
        video.load();
        onWatching(false);
      };
    }
    return () => { active = false; onWatching(false); };
  }, [source, attempt, onWatching]);

  function resume() {
    videoRef.current?.play().then(() => setMessage("")).catch(() => { setMessage("No fue posible reproducir. Pulse Reintentar."); setStatus("error"); });
  }
  const mixedContent = window.location.protocol === "https:" && source.src.startsWith("http:");
  return (
    <div className="relative h-full w-full bg-black">
      {source.type === "iframe" && !mixedContent ? <iframe key={`${source.src}-${attempt}`} title={channel.title} src={source.src} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen onLoad={() => { setStatus("playing"); onWatching(true); }} className="h-full w-full border-0" /> : <video ref={videoRef} controls playsInline preload="auto" poster={channel.logo || "/logo-fabulosa.png"} onPlaying={() => { setStatus("playing"); setMessage(""); onWatching(true); }} onPause={() => { setStatus((value) => value === "error" ? value : "paused"); onWatching(false); }} onWaiting={() => { setStatus((value) => value === "error" ? value : "loading"); onWatching(false); }} onEnded={() => { setStatus("paused"); onWatching(false); }} onError={() => { if (!hlsRef.current) { setStatus("error"); setMessage("Esta señal no pudo reproducirse. Pulse Reintentar."); onWatching(false); } }} className="h-full w-full object-contain" />}
      {status !== "playing" && <div className="pointer-events-none absolute inset-x-4 top-1/2 z-20 -translate-y-1/2 text-center">
        {status === "loading" && source.type !== "iframe" && <span className="inline-flex items-center gap-2 rounded-xl bg-black/75 px-4 py-3 text-sm"><LoaderCircle size={20} className="animate-spin" /> Cargando señal…</span>}
        {status === "paused" && <button type="button" onClick={resume} className="focus-ring pointer-events-auto inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-black text-slate-950"><Play size={20} fill="currentColor" /> Reproducir</button>}
        {status === "error" && <div className="mx-auto max-w-md rounded-2xl bg-black/90 p-4 text-sm"><AlertTriangle className="mx-auto mb-2 text-amber-300" size={22} /><p>{message}</p><div className="mt-3 flex flex-wrap justify-center gap-3"><button type="button" onClick={() => setAttempt((value) => value + 1)} className="focus-ring pointer-events-auto inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-bold text-slate-950"><RotateCcw size={16} /> Reintentar</button>{source.src && <a href={source.src} target="_blank" rel="noreferrer" className="pointer-events-auto rounded-lg border border-white/30 px-4 py-2 font-bold">Abrir señal</a>}</div></div>}
      </div>}
    </div>
  );
}
