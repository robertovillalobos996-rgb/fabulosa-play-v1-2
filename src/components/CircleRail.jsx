import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const FALLBACK = "/logo-fabulosa.png";

export default function CircleRail({ title, icon: Icon, items, to, accent = "sky" }) {
  const accentClass = accent === "cyan" ? "group-hover:border-cyan-300 group-hover:shadow-[0_0_24px_rgba(34,211,238,.24)]" : "group-hover:border-sky-300 group-hover:shadow-[0_0_24px_rgba(56,189,248,.24)]";
  return (
    <section className="stream-row py-4">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2.5 text-lg font-black tracking-tight sm:text-xl"><Icon size={22} className={accent === "cyan" ? "text-cyan-300" : "text-sky-300"} /> {title}</h2>
        <Link to={to} className="flex shrink-0 items-center gap-1 text-xs font-bold text-white/45 transition hover:text-white sm:text-sm">Ver todas <ChevronRight size={17} /></Link>
      </div>
      <div className="no-scrollbar flex gap-4 overflow-x-auto px-0.5 pb-2 sm:gap-5">
        {items.map((item) => (
          <Link key={item.id} to={`${to}?search=${encodeURIComponent(item.title)}`} className="media-circle group shrink-0 text-center">
            <div className={`relative mx-auto aspect-square overflow-hidden rounded-full border-2 border-white/20 bg-[#0b1725] p-1.5 shadow-lg transition duration-300 group-hover:-translate-y-1 ${accentClass}`}>
              <img src={item.logo || FALLBACK} alt="" loading="lazy" onError={(event) => { event.currentTarget.src = FALLBACK; }} className="h-full w-full rounded-full bg-white/[0.04] object-contain p-1" />
              <span className="absolute inset-0 rounded-full bg-gradient-to-t from-black/25 to-transparent" />
            </div>
            <p className="mt-2 truncate text-xs font-semibold text-white/70 group-hover:text-white sm:text-sm">{item.title}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
