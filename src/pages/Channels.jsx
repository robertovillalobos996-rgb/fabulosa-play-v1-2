import { AlertTriangle, Play, Search, Tv } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useCatalog from "../hooks/useCatalog";
import { channelCategory, groupChannels, matchesChannelSearch } from "../utils/channelCategories";
import useChannelCommercials from "../hooks/useChannelCommercials";
import ChannelCommercial from "../components/ChannelCommercial";
import { closePlayerFullscreen } from "../utils/commercials";
import ChannelPlayer from "../components/ChannelPlayer";
import { prepareChannelPlayback } from "../utils/channelPlayback";

const FALLBACK = "/logo-fabulosa.png";

export default function Channels() {
  const { data: channels, loading, remote, error } = useCatalog("channels");
  const [params] = useSearchParams();
  const requestedSearch = params.get("search") || "";
  const [search, setSearch] = useState(requestedSearch);
  const [genre, setGenre] = useState(null);
  const [selected, setSelected] = useState(null);
  const [watching, setWatching] = useState(false);
  const fullscreenTarget = useRef(null);
  const { data: banners, loading: bannersLoading } = useCatalog("banners");
  const { commercial, finish } = useChannelCommercials({ banners, watching, ready: !bannersLoading });
  const hasSelected = Boolean(selected);
  useEffect(() => {
    if (!hasSelected) return undefined;
    const element = fullscreenTarget.current;
    return () => { closePlayerFullscreen(element); };
  }, [hasSelected]);
  const genres = useMemo(() => [{ key: null, title: "Todos" }, ...groupChannels(channels)], [channels]);
  useEffect(() => {
    if (genre !== null && !genres.some((item) => item.key === genre)) setGenre(null);
  }, [genre, genres]);
  const filtered = useMemo(() => channels.filter((item) => {
    return matchesChannelSearch(item, search) && (genre === null || channelCategory(item) === genre);
  }), [channels, genre, search]);

  useEffect(() => {
    setSelected((current) => {
      const refreshed = channels.find((item) => item.id === current?.id);
      if (refreshed) return refreshed;
      const request = requestedSearch.trim().toLowerCase();
      return (request && channels.find((item) => item.title?.trim().toLowerCase() === request)) || channels[0] || null;
    });
  }, [channels, requestedSearch]);

  useEffect(() => {
    setSearch(requestedSearch);
    if (!requestedSearch) return;
    const request = requestedSearch.trim().toLowerCase();
    const match = channels.find((item) => item.title?.trim().toLowerCase() === request);
    if (match) setSelected(match);
  }, [requestedSearch, channels]);

  return (
    <div className="page-shell py-10">
      <header className="flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-black uppercase tracking-[.22em] text-fuchsia-400">Transmisiones disponibles</p><h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">TV en vivo</h1><p className="mt-3 max-w-2xl text-white/55">Explore el catálogo y abra una señal en el reproductor.</p></div>
        <div className="flex items-center gap-2 text-sm text-white/50"><span className={`h-2 w-2 rounded-full ${remote ? "bg-emerald-400" : "bg-amber-400"}`} /> {channels.length} canales</div>
      </header>

      {selected && (
        <section className="mt-8 grid overflow-hidden rounded-3xl border border-white/10 bg-[#0c0f18] shadow-2xl shadow-black/40 lg:grid-cols-[1.55fr_.45fr]">
          <div ref={fullscreenTarget} className="channel-screen relative aspect-video min-h-[230px] bg-black">
            {commercial ? <ChannelCommercial key={`${commercial.id}-${commercial.queueIndex}`} commercial={commercial} onFinish={finish} fullscreenTarget={fullscreenTarget} /> : <ChannelPlayer key={selected.id} channel={selected} onWatching={setWatching} fullscreenTarget={fullscreenTarget} />}
          </div>
          <div className="flex flex-col justify-between p-6">
            <div><div className="mb-5 grid h-20 w-20 place-items-center overflow-hidden rounded-full border border-white/10 bg-white p-2"><img src={selected.logo || FALLBACK} onError={(e) => { e.currentTarget.src = FALLBACK; }} alt="" className="h-full w-full rounded-full object-contain" /></div><p className="text-xs font-black uppercase tracking-[.18em] text-fuchsia-400">{selected.genre || "En vivo"}</p><h2 className="mt-2 text-2xl font-black">{selected.title}</h2></div>
            <p className="mt-8 text-xs leading-5 text-white/40">La disponibilidad depende del proveedor de cada señal. Algunas transmisiones pueden tener restricciones regionales.</p>
          </div>
        </section>
      )}

      <section className="mt-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" size={19} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar canal o categoría" className="focus-ring w-full rounded-2xl border border-white/10 bg-white/[0.05] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/35" /></div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {genres.map((item) => <button type="button" key={item.key === null ? "all" : `category:${item.key}`} onClick={() => setGenre(item.key)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${genre === item.key ? "bg-fuchsia-600 text-white" : "bg-white/[0.06] text-white/55 hover:bg-white/10"}`}>{item.title}</button>)}
          </div>
        </div>

        {error && <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-400/15 bg-amber-400/10 p-4 text-sm text-amber-100"><AlertTriangle size={18} className="mt-0.5 shrink-0" /><span>Se está mostrando el catálogo local. La sincronización estará disponible al terminar la configuración del panel.</span></div>}

        {loading ? <div className="py-20 text-center text-white/45">Cargando canales…</div> : filtered.length ? (
          <div className="mt-7 grid grid-cols-3 gap-x-3 gap-y-7 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
            {filtered.map((channel) => (
              <button type="button" key={channel.id} onPointerEnter={() => prepareChannelPlayback(channel)} onFocus={() => prepareChannelPlayback(channel)} onPointerDown={() => prepareChannelPlayback(channel)} onClick={() => { setSelected(channel); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="group min-w-0 text-center">
                <div className={`relative mx-auto aspect-square overflow-hidden rounded-full border bg-white/[0.055] p-2.5 transition duration-300 group-hover:-translate-y-1 ${selected?.id === channel.id ? "border-fuchsia-400 ring-4 ring-fuchsia-500/15" : "border-white/10 group-hover:border-white/30"}`}>
                  <img src={channel.logo || FALLBACK} onError={(e) => { e.currentTarget.src = FALLBACK; }} alt="" loading="lazy" className="h-full w-full rounded-full object-contain" />
                  <span className="absolute inset-0 grid place-items-center rounded-full bg-black/55 opacity-0 transition group-hover:opacity-100"><Play size={22} fill="white" /></span>
                </div>
                <p className="mt-2 truncate text-xs font-bold text-white/70 group-hover:text-white">{channel.title}</p>
              </button>
            ))}
          </div>
        ) : <div className="mt-8 grid min-h-56 place-items-center rounded-3xl border border-dashed border-white/15 text-center text-white/45"><div><Tv className="mx-auto mb-3" /><p>No encontramos canales con esos filtros.</p></div></div>}
      </section>
    </div>
  );
}
