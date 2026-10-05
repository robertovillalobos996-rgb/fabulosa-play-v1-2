import { Clapperboard, Clock3, Home, Megaphone, Radio, Search, Tv, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import logo from "../assets/logo_fabulosa.png";
import useCatalog from "../hooks/useCatalog";
import { getDisplayPreferences } from "../utils/sitePreferences";

const links = [
  { to: "/", label: "Inicio", icon: Home, end: true },
  { to: "/canales-play", label: "TV en vivo", icon: Tv },
  { to: "/radios-cr", label: "Radio", icon: Radio },
  { to: "/cine-play", label: "Películas", icon: Clapperboard },
  { to: "/anunciate", label: "Contacto", icon: Megaphone },
];

function DesktopLink({ item }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) => `rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${isActive ? "border-sky-400/80 bg-sky-500/10 text-white shadow-[0_0_22px_rgba(56,189,248,.2)]" : "border-transparent text-white/60 hover:bg-white/[0.06] hover:text-white"}`}
    >
      {item.label}
    </NavLink>
  );
}

function Clock({ clock24 }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <div className="hidden min-w-[92px] items-center justify-end gap-2 text-sm font-semibold text-white/65 xl:flex">
      <Clock3 size={16} className="text-sky-300" />
      {now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: !clock24 })}
    </div>
  );
}

function ResultGroup({ title, icon: Icon, items, route, onSelect, poster = false }) {
  if (!items.length) return null;
  return (
    <section>
      <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[.18em] text-white/45"><Icon size={15} /> {title}</div>
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`${route}?search=${encodeURIComponent(item.title)}`}
            onClick={onSelect}
            className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.035] p-2.5 transition hover:border-sky-400/40 hover:bg-sky-400/[0.07]"
          >
            <img src={item.logo || item.poster || "/logo-fabulosa.png"} onError={(event) => { event.currentTarget.src = "/logo-fabulosa.png"; }} alt="" className={`shrink-0 bg-white/10 object-contain ${poster ? "h-14 w-10 rounded-md" : "h-11 w-11 rounded-full p-1"}`} />
            <span className="min-w-0"><strong className="block truncate text-sm">{item.title}</strong><small className="block truncate text-white/35">{item.genre || item.category || item.frequency || item.country || "Fabulosa Play"}</small></span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function GlobalSearch({ open, onClose }) {
  const { data: channels } = useCatalog("channels");
  const { data: radios } = useCatalog("radios");
  const { data: movies } = useCatalog("movies");
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const normalized = query.trim().toLowerCase();
  const result = useMemo(() => {
    if (normalized.length < 2) return { channels: [], radios: [], movies: [] };
    const matches = (item) => `${item.title || ""} ${item.genre || ""} ${item.category || ""} ${item.country || ""}`.toLowerCase().includes(normalized);
    return { channels: channels.filter(matches).slice(0, 6), radios: radios.filter(matches).slice(0, 6), movies: movies.filter(matches).slice(0, 6) };
  }, [channels, movies, normalized, radios]);
  const total = result.channels.length + result.radios.length + result.movies.length;

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 80);
    else setQuery("");
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] bg-[#030711]/92 p-3 backdrop-blur-xl sm:p-7" role="dialog" aria-modal="true" aria-label="Buscar en Fabulosa Play">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center gap-3 rounded-2xl border border-sky-400/30 bg-[#0a1220] p-3 shadow-[0_0_45px_rgba(14,165,233,.12)]">
          <Search className="ml-2 shrink-0 text-sky-300" />
          <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar canales, radios y películas" className="min-w-0 flex-1 bg-transparent py-2 text-base text-white outline-none placeholder:text-white/30 sm:text-lg" />
          <button type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.07] text-white/65 hover:text-white" aria-label="Cerrar búsqueda"><X size={20} /></button>
        </div>
        <div className="no-scrollbar mt-5 max-h-[calc(100vh-130px)] space-y-6 overflow-y-auto rounded-2xl border border-white/[0.06] bg-[#07101b]/80 p-4 sm:p-6">
          {normalized.length < 2 ? <div className="grid min-h-52 place-items-center text-center text-white/40"><div><Search className="mx-auto mb-3" size={34} /><p>Escriba al menos dos letras para buscar en todo Fabulosa Play.</p></div></div> : total ? <><ResultGroup title="TV en vivo" icon={Tv} items={result.channels} route="/canales-play" onSelect={onClose} /><ResultGroup title="Emisoras de radio" icon={Radio} items={result.radios} route="/radios-cr" onSelect={onClose} /><ResultGroup title="Películas" icon={Clapperboard} items={result.movies} route="/cine-play" onSelect={onClose} poster /></> : <div className="grid min-h-52 place-items-center text-center text-white/40"><p>No encontramos resultados para “{query}”.</p></div>}
        </div>
      </div>
    </div>
  );
}

export default function AppShell() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { data: settings } = useCatalog("settings");
  const preferences = getDisplayPreferences(settings);

  useEffect(() => {
    document.documentElement.dataset.motion = preferences.reducedMotion ? "reduced" : "full";
  }, [preferences.reducedMotion]);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) { event.preventDefault(); setSearchOpen(true); }
      if (event.key === "Escape") { setSearchOpen(false); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className={`min-h-screen bg-[#030914] text-white ${preferences.compact ? "density-compact" : ""}`}>
      <header className="glass fixed inset-x-0 top-0 z-50 border-b border-sky-400/10">
        <div className="page-shell flex h-16 items-center gap-3 lg:h-[76px]">
          <NavLink to="/" className="flex min-w-0 shrink-0 items-center" aria-label="Fabulosa Play, inicio">
            <img src={logo} alt="Fabulosa Play" className="h-12 w-32 object-contain object-left sm:w-40 lg:h-14 lg:w-48" />
          </NavLink>
          <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
            {links.map((item) => <DesktopLink key={item.to} item={item} />)}
          </nav>
          <div className="ml-auto flex items-center gap-1.5 border-l border-white/10 pl-3 lg:ml-4">
            <button type="button" onClick={() => setSearchOpen(true)} className="focus-ring grid h-10 w-10 place-items-center rounded-xl text-white/65 transition hover:bg-white/[0.07] hover:text-white" aria-label="Buscar"><Search size={21} /></button>
            <Clock clock24={preferences.clock24} />
          </div>
        </div>
      </header>

      <main className="min-h-screen pb-24 pt-16 lg:pb-8 lg:pt-[76px]"><Outlet context={{ preferences }} /></main>

      <nav className="glass fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-white/10 px-1 pb-[max(.45rem,env(safe-area-inset-bottom))] pt-2 lg:hidden" aria-label="Navegación móvil">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex min-w-0 flex-col items-center gap-1 px-1 py-1 text-[10px] font-semibold transition ${isActive ? "text-sky-300" : "text-white/45"}`}>
            <Icon size={20} strokeWidth={2.1} /><span className="max-w-full truncate">{label}</span>
          </NavLink>
        ))}
      </nav>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
