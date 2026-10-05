import { Clapperboard, Play, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useCatalog from "../hooks/useCatalog";

const FALLBACK = "/logo-fabulosa.png";

function MovieModal({ movie, onClose }) {
  useEffect(() => {
    const close = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", close);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", close); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-3 sm:p-8" role="dialog" aria-modal="true" aria-label={movie.title}>
      <button type="button" onClick={onClose} className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Cerrar"><X /></button>
      <div className="w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-[#0b0d13] shadow-2xl">
        <video src={movie.url} poster={movie.backdrop || movie.poster} controls autoPlay playsInline className="aspect-video w-full bg-black object-contain">Su navegador no puede reproducir este video.</video>
        <div className="p-5"><h2 className="text-xl font-black">{movie.title}</h2><p className="mt-1 text-sm text-white/50">{[movie.year, movie.category].filter(Boolean).join(" · ")}</p></div>
      </div>
    </div>
  );
}

export default function Movies() {
  const { data: movies, loading } = useCatalog("movies");
  const [params] = useSearchParams();
  const requestedSearch = params.get("search") || "";
  const [search, setSearch] = useState(requestedSearch);
  const [category, setCategory] = useState("Todas");
  const [watching, setWatching] = useState(null);
  const categories = useMemo(() => ["Todas", ...new Set(movies.map((movie) => movie.category).filter(Boolean))], [movies]);
  const filtered = useMemo(() => movies.filter((movie) => `${movie.title} ${movie.category || ""} ${movie.year || ""}`.toLowerCase().includes(search.toLowerCase()) && (category === "Todas" || movie.category === category)), [category, movies, search]);
  const featured = movies.find((movie) => movie.featured) || movies[0];

  useEffect(() => setSearch(requestedSearch), [requestedSearch]);

  return (
    <div>
      {featured ? (
        <section className="relative min-h-[500px] overflow-hidden">
          <img src={featured.backdrop || featured.poster || FALLBACK} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07090f] via-[#07090f]/75 to-transparent" /><div className="absolute inset-0 bg-gradient-to-t from-[#07090f] via-transparent to-transparent" />
          <div className="page-shell relative flex min-h-[500px] items-end pb-14 sm:items-center"><div className="max-w-xl"><p className="text-xs font-black uppercase tracking-[.22em] text-amber-400">Película destacada</p><h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">{featured.title}</h1><p className="mt-4 line-clamp-2 text-base leading-7 text-white/65">{featured.description}</p><p className="mt-3 text-sm font-bold text-white/50">{[featured.year, featured.category].filter(Boolean).join(" · ")}</p><button type="button" onClick={() => setWatching(featured)} className="focus-ring mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-black text-slate-950"><Play size={18} fill="currentColor" /> Reproducir</button></div></div>
        </section>
      ) : (
        <section className="border-b border-white/10 bg-[radial-gradient(circle_at_70%_10%,rgba(245,158,11,.18),transparent_38%),#090b12]"><div className="page-shell py-20 sm:py-28"><p className="text-xs font-black uppercase tracking-[.22em] text-amber-400">Cine en casa</p><h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">Movies</h1><p className="mt-5 max-w-xl text-lg leading-8 text-white/55">Aquí aparecerán las películas MP4 que publique desde el panel de control.</p></div></section>
      )}

      <div className="page-shell py-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" size={19} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar una película" className="focus-ring w-full rounded-2xl border border-white/10 bg-white/[0.05] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/35" /></div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${category === item ? "bg-amber-500 text-slate-950" : "bg-white/[0.06] text-white/55"}`}>{item}</button>)}</div>
        </div>

        {loading ? <div className="py-24 text-center text-white/45">Cargando películas…</div> : filtered.length ? (
          <section className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filtered.map((movie) => <button key={movie.id} type="button" onClick={() => setWatching(movie)} className="group min-w-0 text-left"><div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05]"><img src={movie.poster || FALLBACK} onError={(e) => { e.currentTarget.src = FALLBACK; }} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><span className="absolute inset-0 grid place-items-center bg-black/45 opacity-0 transition group-hover:opacity-100"><span className="grid h-12 w-12 place-items-center rounded-full bg-white text-slate-950"><Play size={19} fill="currentColor" /></span></span></div><h2 className="mt-3 truncate font-black">{movie.title}</h2><p className="mt-1 truncate text-xs text-white/40">{[movie.year, movie.category].filter(Boolean).join(" · ")}</p></button>)}
          </section>
        ) : (
          <section className="mt-8 grid min-h-[320px] place-items-center rounded-3xl border border-dashed border-white/15 bg-white/[0.025] p-8 text-center"><div><Clapperboard className="mx-auto text-amber-400" size={42} /><h2 className="mt-5 text-2xl font-black">El catálogo está listo para recibir películas</h2><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/50">Agregue el título, portada y una URL directa HTTPS del archivo MP4 desde el panel administrativo. No se requieren plataformas externas.</p></div></section>
        )}
      </div>
      <div className="page-shell pb-8 text-xs leading-5 text-white/35"><img src="https://www.themoviedb.org/assets/v4/logos/v2/blue_long_2-9665a76b1ae401a510ec1e0ca40ddcb3b0cfe45f1d51b77a308fea0845885648.svg" alt="The Movie Database (TMDB)" className="mb-3 h-5 w-auto" /><p>Este producto utiliza la API de TMDB, pero no está respaldado ni certificado por TMDB.</p></div>
      {watching && <MovieModal movie={watching} onClose={() => setWatching(null)} />}
    </div>
  );
}
