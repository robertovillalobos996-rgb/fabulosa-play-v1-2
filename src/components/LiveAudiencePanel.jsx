import { useEffect, useState } from "react";
import { collection, onSnapshot, query, Timestamp, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { ensureAudienceUser } from "../hooks/useLiveAudience";
import AudienceHistoryPanel from "./AudienceHistoryPanel";
import { summarizeAudience } from "../utils/liveAudience";
export default function LiveAudiencePanel() {
  const [records, setRecords] = useState([]), [now, setNow] = useState(Date.now);
  const [state, setState] = useState("loading"), [error, setError] = useState("");
  const [setup, setSetup] = useState("checking");
  useEffect(() => { let active = true; ensureAudienceUser().then(() => { if (active) setSetup("ready"); }).catch(() => { if (active) setSetup("error"); }); return () => { active = false; }; }, []);
  useEffect(() => {
    let stop;
    const connect = () => {
      stop?.();
      const recent = query(collection(db, "liveAudience"), where("lastSeen", ">=", Timestamp.fromMillis(Date.now() - 120000)));
      stop = onSnapshot(recent, { includeMetadataChanges: true }, (snapshot) => {
        setRecords(snapshot.docs.map((item) => item.data()));
        setState(snapshot.metadata.fromCache ? "offline" : "live"); setError("");
      }, (reason) => { setState("error"); setError(reason.code === "permission-denied" ? "Publique las reglas de Firebase para activar la audiencia." : "No se puede consultar la audiencia. Revise la conexión."); });
    };
    connect(); const refresh = setInterval(connect, 60000), clock = setInterval(() => setNow(Date.now()), 1000);
    return () => { stop?.(); clearInterval(refresh); clearInterval(clock); };
  }, []);
  const summary = summarizeAudience(records, now), live = state === "live" && setup === "ready";
  return <section className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-2xl font-black">Audiencia en vivo</h2><p className="mt-2 text-sm text-white/60">Cámaras, televisión, radios y películas · conexiones activas</p></div><span className={`rounded-full px-4 py-2 text-sm font-bold ${live ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-200"}`}>{live ? "● En directo" : state === "loading" ? "Conectando…" : "Sin datos en directo"}</span></div>
    {setup === "error" && <p role="alert" className="rounded-xl bg-amber-500/10 p-4 text-amber-200">No se pudo activar el registro de conexiones. Active Anónimo en Firebase Authentication y recargue. Si ya está activo, revise la conexión y las cuotas.</p>}
    {error && <p role="alert" className="rounded-xl bg-red-500/10 p-4 text-red-200">{error}</p>}
    <div className="grid gap-4 sm:grid-cols-3">{[["Conexiones al canal de cámaras", summary.cameras], ["Radio de cámaras sonando", summary.listeners], ["Conexiones a TV, radio y películas", summary.total]].map(([label, count]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-6"><p className="text-4xl font-black text-cyan-300">{live ? count : "—"}</p><p className="mt-2 text-sm text-white/60">{label}</p></div>)}</div>
    {live && <div className="overflow-x-auto rounded-2xl border border-white/10"><table className="w-full text-left text-sm"><thead className="bg-white/5"><tr>{["Contenido", "Conectados", "Video confirmado y visible", "Audio confirmado", "Reproductor externo sin confirmar"].map((label) => <th key={label} className="p-4">{label}</th>)}</tr></thead><tbody>{summary.rows.map((item) => <tr key={item.id} className="border-t border-white/10"><td className="p-4 font-bold">{item.name}<p className="mt-1 text-xs font-normal text-cyan-300">{item.camera ? "Canal de cámaras" : item.kind === "radio" ? "Radio" : item.kind === "movie" ? "Película" : "Televisión"}</p>{Object.entries(item.sources).map(([name, count]) => <p key={name} className="mt-1 text-xs font-normal text-white/50">{name}: {count}</p>)}</td><td className="p-4">{item.connected}</td><td className="p-4">{item.watching}</td><td className="p-4">{item.camera || item.kind === "radio" ? item.listening : "—"}</td><td className="p-4">{item.unverified}</td></tr>)}</tbody></table>{!summary.rows.length && <p className="p-6 text-white/60">No hay conexiones recientes registradas.</p>}</div>}
    <p className="text-sm leading-6 text-white/50">Cada pestaña se registra por separado. Actualización hasta cada 30 segundos; una conexión que desaparece vence en 90 segundos. Audio confirmado significa que el navegador reproduce la radio con volumen, no que podemos verificar los altavoces. Los reproductores externos sin eventos fiables se cuentan como abiertos. Su panel de administrador no se cuenta.</p>
    <AudienceHistoryPanel now={now} />
    <p className="text-sm text-white/50">Activación inicial: Firebase → Authentication → Método de acceso → Anónimo. La lectura de este panel está restringida al administrador.</p>
  </section>;
}
