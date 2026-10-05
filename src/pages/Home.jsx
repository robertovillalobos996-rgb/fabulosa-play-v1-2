import { ChevronRight, Clapperboard, Megaphone, Play, Radio, Tv, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import CircleRail from "../components/CircleRail";
import useCatalog from "../hooks/useCatalog";
import BannerVideo from "../components/BannerVideo";
import { isBannerVideo } from "../utils/commercials";

const FALLBACK = "/logo-fabulosa.png";
const IMAGE_DURATION_MS = 10000;
function BannerDestination({ url, label }) {
  if (!url) return null;
  const className = "absolute inset-0 z-10 focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-sky-300";
  if (/^https?:\/\//i.test(url)) return <a href={url} target="_blank" rel="noreferrer" className={className} aria-label={label} />;
  return <Link to={url} className={className} aria-label={label} />;
}

function MovieRail({ movies }) {
  return (
    <section className="stream-row min-w-0 py-4">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2.5 text-lg font-black tracking-tight sm:text-xl"><Clapperboard size={22} className="text-violet-300" /> Películas</h2>
        <Link to="/cine-play" className="flex shrink-0 items-center gap-1 text-xs font-bold text-white/45 hover:text-white sm:text-sm">Ver todas <ChevronRight size={17} /></Link>
      </div>
      {movies.length ? (
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2 sm:gap-4">
          {movies.slice(0, 12).map((movie) => (
            <Link to={`/cine-play?search=${encodeURIComponent(movie.title)}`} key={movie.id} className="movie-home-card group shrink-0">
              <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-white/15 bg-white/[0.05] shadow-lg transition duration-300 group-hover:-translate-y-1 group-hover:border-violet-300/70 group-hover:shadow-[0_0_24px_rgba(167,139,250,.18)]">
                <img src={movie.poster || FALLBACK} onError={(event) => { event.currentTarget.src = FALLBACK; }} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute inset-x-2 bottom-2 truncate text-xs font-black">{movie.title}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <Link to="/cine-play" className="flex min-h-40 items-center gap-5 rounded-2xl border border-dashed border-white/15 bg-white/[0.025] p-6 transition hover:border-violet-300/40 hover:bg-violet-400/[0.04]">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-violet-400/10 text-violet-300"><Clapperboard size={28} /></span>
          <span><strong className="block text-lg">Catálogo de Movies</strong><small className="mt-1 block leading-5 text-white/40">Las tarjetas aparecerán aquí cuando agreguemos las películas MP4.</small></span>
        </Link>
      )}
    </section>
  );
}

function ContactCard() {
  return (
    <Link to="/anunciate" className="group mb-4 mt-[3.35rem] hidden min-h-40 flex-col items-center justify-center rounded-2xl border border-sky-400/20 bg-[radial-gradient(circle_at_50%_10%,rgba(14,165,233,.14),transparent_50%),#07111e] p-5 text-center shadow-[0_0_28px_rgba(14,165,233,.08)] transition hover:border-sky-300/50 xl:flex">
      <span className="text-xs font-bold text-white/50">¿Necesita ayuda?</span><span className="mt-4 grid h-11 w-11 place-items-center rounded-full border border-sky-300/30 bg-sky-400/10 text-sky-300"><Megaphone size={21} /></span><strong className="mt-3">Contacto</strong><small className="mt-1 text-white/40">Estamos para ayudarle</small><span className="mt-4 rounded-full bg-white px-4 py-2 text-xs font-black text-slate-950 transition group-hover:bg-sky-200">Contactar ahora</span>
    </Link>
  );
}

export default function Home() {
  const { preferences } = useOutletContext();
  const { data: banners } = useCatalog("banners");
  const { data: channels } = useCatalog("channels");
  const { data: radios } = useCatalog("radios");
  const { data: movies } = useCatalog("movies");
  const [active, setActive] = useState(0);
  const [videoMuted, setVideoMuted] = useState(true);
  const safeBanners = banners.slice(0, 20);
  const bannerCount = safeBanners.length;
  const banner = safeBanners[active % Math.max(safeBanners.length, 1)];
  const isVideo = isBannerVideo(banner);
  const showContent = banner?.showContent !== false && Boolean(banner?.title || banner?.subtitle || banner?.actionLabel);
  function advance() {
    if (bannerCount > 1) setActive((value) => (value + 1) % bannerCount);
  }

  useEffect(() => {
    if (bannerCount < 2 || preferences.reducedMotion || isVideo) return undefined;
    const timer = window.setTimeout(() => setActive((value) => (value + 1) % bannerCount), IMAGE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [banner?.id, bannerCount, isVideo, preferences.reducedMotion]);

  useEffect(() => {
    if (active >= safeBanners.length) setActive(0);
  }, [active, safeBanners.length]);

  return (
    <div className="pb-6">
      <section className="hero-stage relative overflow-hidden border-b border-white/[0.06]">
        {banner && (isVideo ? (
          <div key={`${banner.id}-${banner.image}`} className="hero-slide absolute inset-0">
            <BannerVideo source={banner.image} muted={videoMuted} autoPlay={!preferences.reducedMotion} loop={bannerCount === 1 && !preferences.reducedMotion} onEnded={advance} onError={advance} className="h-full w-full" />
          </div>
        ) : (
          <img key={banner.id} src={banner.image} onError={(event) => { event.currentTarget.src = "/fondo_fabulosa_play.webp"; }} alt={banner.title || "Publicidad en Fabulosa Play"} className="hero-slide absolute inset-0 h-full w-full object-cover" />
        ))}

        {!showContent && !isVideo && <BannerDestination url={banner?.actionUrl} label={banner?.actionLabel || banner?.title || "Abrir publicidad"} />}

        {showContent && (
          <div className="page-shell pointer-events-none relative z-20 flex h-full items-end py-7 sm:items-center sm:py-10">
            <div className="pointer-events-auto max-w-xl rounded-2xl border border-white/15 bg-[#020711]/72 p-5 shadow-2xl backdrop-blur-md sm:p-7 lg:max-w-2xl">
              {banner.title && <h1 className="max-w-xl text-3xl font-black leading-[.98] tracking-[-.04em] sm:text-5xl lg:text-6xl">{banner.title}</h1>}
              {banner.subtitle && <p className="mt-4 max-w-lg text-sm leading-6 text-white/80 sm:text-base">{banner.subtitle}</p>}
              {banner.actionLabel && banner.actionUrl && (/^https?:\/\//i.test(banner.actionUrl) ? (
                <a href={banner.actionUrl} target="_blank" rel="noreferrer" className="focus-ring mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-sky-100"><Play size={17} fill="currentColor" /> {banner.actionLabel}</a>
              ) : (
                <Link to={banner.actionUrl} className="focus-ring mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-sky-100"><Play size={17} fill="currentColor" /> {banner.actionLabel}</Link>
              ))}
            </div>
          </div>
        )}

        {isVideo && <button type="button" onClick={() => setVideoMuted((value) => !value)} className="focus-ring absolute right-4 top-4 z-30 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-md hover:bg-black/65" aria-label={videoMuted ? "Activar sonido" : "Silenciar video"}>{videoMuted ? <VolumeX size={19} /> : <Volume2 size={19} />}</button>}
        {safeBanners.length > 1 && <div className="absolute bottom-4 right-4 z-30 flex gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-2 backdrop-blur-md sm:right-8">{safeBanners.map((item, index) => <button key={item.id} type="button" onClick={() => setActive(index)} aria-label={`Mostrar anuncio ${index + 1}`} className={`h-2 rounded-full border border-white/20 transition-all ${index === active ? "w-7 bg-white" : "w-2 bg-white/40 hover:bg-white/70"}`} />)}</div>}
      </section>

      <div className="page-shell pt-2">
        <CircleRail title="TV en vivo" icon={Tv} items={channels.slice(0, preferences.compact ? 16 : 12)} to="/canales-play" />
        <CircleRail title="Emisoras de radio" icon={Radio} items={radios.slice(0, preferences.compact ? 16 : 12)} to="/radios-cr" accent="cyan" />
        <div className="grid min-w-0 xl:grid-cols-[minmax(0,1fr)_230px] xl:gap-5"><MovieRail movies={movies} /><ContactCard /></div>
      </div>
    </div>
  );
}
