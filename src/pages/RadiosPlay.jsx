import { AlertTriangle, Pause, Play, Radio, Search, Volume2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useCatalog from "../hooks/useCatalog";

const FALLBACK = "/logo-fabulosa.png";

export default function RadiosPlay() {
  const { data: radios, loading, remote, error: catalogError } = useCatalog("radios");
  const [params] = useSearchParams();
  const requestedSearch = params.get("search") || "";
  const [search, setSearch] = useState(requestedSearch);
  const [country, setCountry] = useState("Todos");
  const [selected, setSelected] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [playerError, setPlayerError] = useState("");
  const audioRef = useRef(null);
  const hlsRef = useRef(null);

  const countries = useMemo(() => ["Todos", ...new Set(radios.map((item) => item.country).filter(Boolean))], [radios]);
  const filtered = useMemo(() => radios.filter((item) => {
    const text = `${item.title} ${item.genre || ""} ${item.frequency || ""} ${item.country || ""}`.toLowerCase();
    return text.includes(search.toLowerCase()) && (country === "Todos" || item.country === country);
  }), [country, radios, search]);

  useEffect(() => () => hlsRef.current?.destroy(), []);
  useEffect(() => setSearch(requestedSearch), [requestedSearch]);

  async function loadStation(station) {
    const audio = audioRef.current;
    hlsRef.current?.destroy();
    hlsRef.current = null;
    audio.pause();
    audio.removeAttribute("src");
    setSelected(station);
    setPlayerError("");
    try {
      const isHls = station.isHls || station.url.includes(".m3u8");
      if (isHls && !audio.canPlayType("application/vnd.apple.mpegurl")) {
        const { default: Hls } = await import("hls.js");
        if (!Hls.isSupported()) throw new Error("El navegador no admite esta transmisión.");
        const hls = new Hls({ enableWorker: true });
        hlsRef.current = hls;
        hls.loadSource(station.url);
        hls.attachMedia(audio);
        hls.on(Hls.Events.ERROR, (_event, data) => { if (data.fatal) setPlayerError("La emisora no respondió."); });
      } else audio.src = station.url;
      await audio.play();
      setPlaying(true);
    } catch (reason) {
      setPlaying(false);
      setPlayerError(reason?.message || "No fue posible reproducir la emisora.");
    }
  }

  function toggle() {
    if (!selected) return;
    if (playing) audioRef.current.pause();
    else audioRef.current.play().catch(() => setPlayerError("No fue posible iniciar el audio."));
    setPlaying(!playing);
  }

  return (
    <div className="page-shell py-10 pb-36">
      <audio ref={audioRef} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => selected && setPlayerError("La emisora no respondió o bloqueó la reproducción.")} />
      <header className="flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-black uppercase tracking-[.22em] text-cyan-400">Sonido que te acompaña</p><h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Radios en vivo</h1><p className="mt-3 max-w-2xl text-white/55">Música, noticias y programación desde Costa Rica y otros países.</p></div>
        <div className="flex items-center gap-2 text-sm text-white/50"><span className={`h-2 w-2 rounded-full ${remote ? "bg-emerald-400" : "bg-amber-400"}`} /> {radios.length} emisoras</div>
      </header>

      <section className="mt-8">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" size={19} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar emisora, género o frecuencia" className="focus-ring w-full rounded-2xl border border-white/10 bg-white/[0.05] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/35" /></div>
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="focus-ring rounded-2xl border border-white/10 bg-[#111520] px-4 py-3.5 text-sm text-white"><option value="Todos">Todos los países</option>{countries.slice(1).map((item) => <option key={item}>{item}</option>)}</select>
        </div>
        {catalogError && <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-400/15 bg-amber-400/10 p-4 text-sm text-amber-100"><AlertTriangle size={18} className="mt-0.5 shrink-0" /><span>Se está mostrando el catálogo local mientras termina la configuración del panel.</span></div>}
      </section>

      {loading ? <div className="py-20 text-center text-white/45">Cargando radios…</div> : filtered.length ? (
        <section className="mt-8 grid grid-cols-3 gap-x-3 gap-y-7 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
          {filtered.map((station) => (
            <button key={station.id} type="button" onClick={() => loadStation(station)} className="group min-w-0 text-center">
              <div className={`relative mx-auto aspect-square overflow-hidden rounded-full border bg-white/[0.055] p-2.5 transition duration-300 group-hover:-translate-y-1 ${selected?.id === station.id ? "border-cyan-400 ring-4 ring-cyan-500/15" : "border-white/10 group-hover:border-white/30"}`}>
                <img src={station.logo || FALLBACK} onError={(e) => { e.currentTarget.src = FALLBACK; }} alt="" loading="lazy" className="h-full w-full rounded-full object-contain" />
                <span className="absolute inset-0 grid place-items-center rounded-full bg-black/55 opacity-0 transition group-hover:opacity-100">{selected?.id === station.id && playing ? <Pause size={22} fill="white" /> : <Play size={22} fill="white" />}</span>
              </div>
              <p className="mt-2 truncate text-xs font-bold text-white/75 group-hover:text-white">{station.title}</p><p className="mt-0.5 truncate text-[10px] text-white/35">{station.frequency || station.country}</p>
            </button>
          ))}
        </section>
      ) : <div className="mt-8 grid min-h-56 place-items-center rounded-3xl border border-dashed border-white/15 text-center text-white/45"><div><Radio className="mx-auto mb-3" /><p>No encontramos emisoras con esos filtros.</p></div></div>}

      {selected && (
        <div className="glass fixed inset-x-0 bottom-[65px] z-40 border-y border-white/10 md:bottom-0">
          <div className="page-shell flex h-20 items-center gap-4">
            <img src={selected.logo || FALLBACK} onError={(e) => { e.currentTarget.src = FALLBACK; }} alt="" className="h-12 w-12 rounded-full border border-white/10 bg-white object-contain p-1" />
            <div className="min-w-0 flex-1"><p className="truncate font-black">{selected.title}</p><p className={`truncate text-xs ${playerError ? "text-red-300" : "text-white/45"}`}>{playerError || `${selected.frequency || "En vivo"} · ${selected.country || "Radio"}`}</p></div>
            <Volume2 className="hidden text-white/40 sm:block" size={19} />
            <button type="button" onClick={toggle} aria-label={playing ? "Pausar" : "Reproducir"} className="focus-ring grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-slate-950">{playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}</button>
          </div>
        </div>
      )}
    </div>
  );
}
