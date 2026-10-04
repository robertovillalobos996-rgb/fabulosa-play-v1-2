import {
  ArrowRight,
  BarChart3,
  Check,
  Clock3,
  Globe2,
  Mail,
  Megaphone,
  MessageCircle,
  MonitorPlay,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { useState } from "react";
import useCatalog from "../hooks/useCatalog";

const DEFAULT_PHONE = "+506 6403 5335";
const DEFAULT_EMAIL = "FabulosaPlay@gmail.com";
const DEFAULT_WEBSITE = "https://www.fabulosaplay.online";

const offers = [
  { icon: MonitorPlay, title: "Más visibilidad", copy: "Banners y espacios destacados dentro de las secciones con mayor tráfico.", tone: "sky" },
  { icon: Users, title: "Más audiencia", copy: "Promociones integradas para conectar su negocio con clientes potenciales.", tone: "fuchsia" },
  { icon: BarChart3, title: "Más resultados", copy: "Paquetes ajustados a sus objetivos, duración y presupuesto disponible.", tone: "amber" },
];

const toneClasses = {
  sky: "border-sky-400/20 bg-sky-400/10 text-sky-300",
  fuchsia: "border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-300",
  amber: "border-amber-300/20 bg-amber-300/10 text-amber-200",
};

export default function Advertise() {
  const { data: settings } = useCatalog("settings");
  const [form, setForm] = useState({ name: "", business: "", contact: "", message: "" });

  const email = settings.contactEmail?.trim() || DEFAULT_EMAIL;
  const displayPhone = settings.whatsapp?.trim() || DEFAULT_PHONE;
  const phone = displayPhone.replace(/\D/g, "");
  const website = settings.website?.trim() || DEFAULT_WEBSITE;
  const websiteUrl = /^https?:\/\//i.test(website) ? website : `https://${website}`;
  const websiteLabel = website.replace(/^https?:\/\//i, "").replace(/\/$/, "");
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent("Hola, deseo información para anunciar mi negocio en Fabulosa Play.")}`;
  const emailUrl = `mailto:${email}?subject=${encodeURIComponent("Publicidad en Fabulosa Play")}`;

  function submit(event) {
    event.preventDefault();
    const body = `Hola, deseo anunciarme en Fabulosa Play.\n\nNombre: ${form.name}\nNegocio o marca: ${form.business || "No indicado"}\nContacto: ${form.contact}\nMensaje: ${form.message}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(body)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="advertise-page overflow-hidden">
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 -z-20 bg-[#03071c]" />
        <img src="/centro-de-publicidad.png" alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,7,25,.96)_0%,rgba(2,7,25,.74)_45%,rgba(2,7,25,.22)_100%)]" />
        <div className="absolute -left-32 top-12 -z-10 h-80 w-80 rounded-full bg-fuchsia-500/25 blur-[100px]" />
        <div className="absolute right-0 top-0 -z-10 h-96 w-96 rounded-full bg-sky-500/20 blur-[110px]" />

        <div className="page-shell grid min-h-[560px] items-center gap-10 py-14 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/25 bg-fuchsia-500/10 px-4 py-2 text-xs font-black uppercase tracking-[.2em] text-fuchsia-200 backdrop-blur-xl">
              <Sparkles size={15} /> Publicidad y contacto
            </div>
            <h1 className="mt-6 text-5xl font-black leading-[.92] tracking-[-.055em] sm:text-6xl lg:text-7xl">
              Anúnciate con nosotros y haz que tu <span className="bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">marca brille.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
              {settings.contactIntro || "Cuéntenos qué desea promocionar y prepararemos una propuesta para su negocio."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="focus-ring inline-flex items-center gap-3 rounded-2xl bg-emerald-500 px-5 py-3.5 font-black text-white shadow-[0_0_34px_rgba(16,185,129,.32)] transition hover:-translate-y-0.5 hover:bg-emerald-400">
                <MessageCircle size={21} /> Escríbenos ahora <ArrowRight size={18} />
              </a>
              <a href="#propuesta" className="focus-ring inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-3.5 font-black text-white backdrop-blur-xl transition hover:bg-white/15">
                Solicitar propuesta
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-fuchsia-500/25 via-sky-500/10 to-amber-300/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-[#07102b]/80 p-5 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-7">
              <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-sky-500 shadow-[0_0_28px_rgba(217,70,239,.3)]"><Megaphone size={24} /></div>
                <div><p className="text-xs font-black uppercase tracking-[.2em] text-cyan-300">Contacto directo</p><h2 className="mt-1 text-2xl font-black">Hablemos de su proyecto</h2></div>
              </div>

              <div className="mt-5 space-y-3">
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="contact-action group border-emerald-300/25 bg-gradient-to-r from-emerald-500/25 to-emerald-400/10 hover:border-emerald-300/55">
                  <span className="contact-action-icon bg-emerald-500 text-white shadow-[0_0_24px_rgba(16,185,129,.4)]"><MessageCircle size={24} /></span>
                  <span className="min-w-0 flex-1"><span className="block text-xs font-bold uppercase tracking-wider text-emerald-200/75">WhatsApp</span><span className="mt-0.5 block truncate text-lg font-black sm:text-xl">{displayPhone}</span></span>
                  <ArrowRight className="shrink-0 transition group-hover:translate-x-1" size={20} />
                </a>

                <a href={emailUrl} className="contact-action group border-sky-300/25 bg-gradient-to-r from-sky-500/25 to-blue-500/10 hover:border-sky-300/55">
                  <span className="contact-action-icon bg-blue-600 text-white shadow-[0_0_24px_rgba(37,99,235,.4)]"><Mail size={24} /></span>
                  <span className="min-w-0 flex-1"><span className="block text-xs font-bold uppercase tracking-wider text-sky-200/75">Correo electrónico</span><span className="mt-0.5 block truncate text-base font-black sm:text-lg">{email}</span></span>
                  <ArrowRight className="shrink-0 transition group-hover:translate-x-1" size={20} />
                </a>

                <a href={websiteUrl} target="_blank" rel="noreferrer" className="contact-action group border-cyan-300/25 bg-gradient-to-r from-cyan-500/25 to-indigo-500/10 hover:border-cyan-300/55">
                  <span className="contact-action-icon bg-cyan-600 text-white shadow-[0_0_24px_rgba(8,145,178,.4)]"><Globe2 size={24} /></span>
                  <span className="min-w-0 flex-1"><span className="block text-xs font-bold uppercase tracking-wider text-cyan-200/75">Página web</span><span className="mt-0.5 block truncate text-base font-black sm:text-lg">{websiteLabel}</span></span>
                  <ArrowRight className="shrink-0 transition group-hover:translate-x-1" size={20} />
                </a>
              </div>

              <div className="mt-5 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-white/55">
                <Clock3 size={16} className="shrink-0 text-amber-300" /> {settings.businessHours}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="page-shell py-14 sm:py-20">
        <section className="grid gap-4 md:grid-cols-3">
          {offers.map(({ icon: Icon, title, copy, tone }) => (
            <article key={title} className="card-surface group rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20">
              <div className={`grid h-12 w-12 place-items-center rounded-2xl border ${toneClasses[tone]}`}><Icon size={23} /></div>
              <h2 className="mt-5 text-xl font-black">{title}</h2><p className="mt-2 text-sm leading-6 text-white/55">{copy}</p>
            </article>
          ))}
        </section>

        <section id="propuesta" className="mt-14 grid scroll-mt-28 gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#10173a] to-[#080b16] p-7 sm:p-9">
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-fuchsia-500/15 blur-3xl" />
            <div className="relative">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-fuchsia-500/15 text-fuchsia-300"><Target size={24} /></div>
              <h2 className="mt-6 text-3xl font-black">Su marca también juega aquí.</h2>
              <p className="mt-3 leading-7 text-white/55">Creamos oportunidades para negocios locales, emprendimientos y marcas regionales.</p>
              <div className="mt-7 space-y-4 text-sm text-white/70">
                {["Contenido disponible desde cualquier dispositivo", "Audiencia interesada en entretenimiento y actualidad", "Contacto directo para adaptar cada campaña", "Espacios publicitarios a la medida"].map((text) => <div key={text} className="flex gap-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-300"><Check size={15} /></span><span className="pt-0.5">{text}</span></div>)}
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="card-surface rounded-[2rem] p-7 sm:p-9">
            <p className="text-xs font-black uppercase tracking-[.2em] text-fuchsia-400">Cuéntenos su idea</p><h2 className="mt-2 text-3xl font-black">Solicite una propuesta</h2><p className="mt-3 text-sm leading-6 text-white/50">Complete sus datos y abriremos WhatsApp con el mensaje listo para enviar.</p>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-bold text-white/75">Nombre<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="contact-input" /></label>
              <label className="text-sm font-bold text-white/75">Negocio o marca<input value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })} className="contact-input" /></label>
              <label className="text-sm font-bold text-white/75 sm:col-span-2">Teléfono o correo<input required value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} className="contact-input" /></label>
              <label className="text-sm font-bold text-white/75 sm:col-span-2">¿Qué desea promocionar?<textarea required rows="5" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="contact-input resize-none" /></label>
            </div>
            <button className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-500 px-5 py-4 font-black shadow-[0_0_30px_rgba(217,70,239,.22)] transition hover:brightness-110"><MessageCircle size={19} /> Enviar solicitud por WhatsApp</button>
          </form>
        </section>
      </div>
    </div>
  );
}
