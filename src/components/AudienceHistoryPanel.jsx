import { useEffect, useState } from "react";
import { collection, onSnapshot, query, Timestamp, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { costaRicaDay, countryName, reportDays, summarizeVisits } from "../utils/audienceVisits";
export default function AudienceHistoryPanel({ now }) {
  const [days, setDays] = useState(7), [daily, setDaily] = useState([]), [entries, setEntries] = useState([]);
  const [status, setStatus] = useState({ daily: false, entries: false }), [error, setError] = useState("");
  const today = costaRicaDay(now).key;
  useEffect(() => {
    setStatus({ daily: false, entries: false }); setError("");
    const start = Timestamp.fromMillis(reportDays(days).at(0).start);
    const watch = (name, key, setData) => onSnapshot(query(collection(db, name), where("dayStart", ">=", start)), { includeMetadataChanges: true }, (snapshot) => {
      setData(snapshot.docs.map((item) => item.data()));
      setStatus((previous) => ({ ...previous, [key]: !snapshot.metadata.fromCache }));
    }, () => { setStatus((previous) => ({ ...previous, [key]: false })); setError("No se pudo consultar el historial. Revise las reglas de Firebase, la conexión y las cuotas."); });
    const stopDaily = watch("audienceDaily", "daily", setDaily), stopEntries = watch("audienceVisits", "entries", setEntries);
    return () => { stopDaily(); stopEntries(); };
  }, [days, today]);
  const ready = status.daily && status.entries && !error, summary = summarizeVisits(daily, entries, days, now);
  return <section className="space-y-5 border-t border-white/10 pt-8">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h3 className="text-xl font-black">Visitas y países</h3><p className="mt-2 text-sm text-white/55">Toda la plataforma · fechas de Costa Rica · registros desde la instalación</p></div><label className="text-sm font-bold">Período<select aria-label="Período del historial" value={days} onChange={(event) => setDays(Number(event.target.value))} className="ml-3 rounded-xl border border-white/10 bg-slate-900 px-3 py-2"><option value={7}>Últimos 7 días</option><option value={30}>Últimos 30 días</option></select></label></div>
    {error && <p role="alert" className="rounded-xl bg-red-500/10 p-4 text-red-200">{error}</p>}
    <div className="grid gap-4 sm:grid-cols-3">{[["Navegadores únicos hoy", summary.today], [`Navegadores únicos en ${days} días`, summary.unique], [`Entradas en ${days} días`, summary.entries]].map(([label, count]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-3xl font-black text-violet-300">{ready ? count : "—"}</p><p className="mt-2 text-sm text-white/60">{label}</p></div>)}</div>
    {ready && <div className="grid gap-5 lg:grid-cols-2"><div className="overflow-x-auto rounded-2xl border border-white/10"><table className="w-full text-left text-sm"><thead className="bg-white/5"><tr><th className="p-4">Día</th><th className="p-4">Navegadores únicos</th><th className="p-4">Entradas</th></tr></thead><tbody>{summary.rows.map((row) => <tr key={row.day} className="border-t border-white/10"><td className="p-4">{row.day.split("-").reverse().join("/")}</td><td className="p-4">{row.unique}</td><td className="p-4">{row.entries}</td></tr>)}</tbody></table></div><div className="rounded-2xl border border-white/10 p-5"><h4 className="font-black">País de conexión · {days} días</h4>{summary.countries.length ? summary.countries.map((item) => <div key={item.code} className="mt-4 flex justify-between gap-3 border-b border-white/5 pb-3 text-sm"><span>{countryName(item.code)}</span><strong>{item.count}</strong></div>) : <p className="mt-4 text-sm text-white/50">Todavía no hay visitas registradas.</p>}</div></div>}
    <p className="text-sm leading-6 text-white/50">Un navegador se cuenta una vez por día y una vez en el total del período. Otro dispositivo, una ventana privada o borrar los datos puede contarlo nuevamente. Una entrada es una sesión de navegación: recargar o cambiar de sección dentro de 30 minutos no suma otra; una pestaña nueva sí. El país es aproximado y una VPN puede cambiarlo; se utiliza el país más reciente de cada navegador dentro del período. No se guarda la dirección IP en estos registros. Las sesiones de administrador quedan fuera.</p>
  </section>;
}
