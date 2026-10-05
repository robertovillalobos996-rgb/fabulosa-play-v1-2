import { RotateCcw, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { saveCatalog } from "../lib/firebase";
import { defaultDisplayPreferences, getDisplayPreferences } from "../utils/sitePreferences";

const fields = [
  ["compact", "Vista compacta", "Muestra más canales y emisoras al mismo tiempo."],
  ["reducedMotion", "Reducir movimiento", "Pausa el cambio automático de la portada y reduce las animaciones."],
  ["clock24", "Reloj de 24 horas", "Cambia el formato de la hora en la barra superior."],
];

export default function SitePreferencesEditor({ settings, setSettings }) {
  const [form, setForm] = useState(() => getDisplayPreferences(settings));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => setForm(getDisplayPreferences(settings)), [settings]);
  async function submit(event) {
    event.preventDefault(); setBusy(true); setMessage("");
    const next = { ...settings, displayPreferences: form };
    try { await saveCatalog("settings", next); setSettings(next); setMessage("Configuración publicada para todo el sitio."); }
    catch (reason) { setMessage(`No se pudo guardar: ${reason.message}`); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit} className="max-w-2xl space-y-5 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8"><div><h2 className="text-2xl font-black">Configuración del sitio</h2><p className="mt-2 text-sm text-white/50">Estas opciones se administran aquí y se aplican a teléfono, computadora y tablet.</p></div>{fields.map(([key, label, copy]) => <label key={key} className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4"><span><strong className="block text-sm">{label}</strong><small className="mt-1 block text-white/45">{copy}</small></span><input type="checkbox" checked={form[key]} onChange={(event) => setForm((value) => ({ ...value, [key]: event.target.checked }))} className="h-5 w-5 shrink-0 accent-sky-500" /></label>)}<div className="flex flex-wrap gap-3"><button disabled={busy} className="focus-ring inline-flex items-center gap-2 rounded-xl bg-fuchsia-600 px-5 py-3 font-black disabled:opacity-50"><Save size={18} /> {busy ? "Guardando…" : "Guardar configuración"}</button><button type="button" disabled={busy} onClick={() => setForm({ ...defaultDisplayPreferences })} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-bold"><RotateCcw size={16} /> Restablecer valores</button></div>{message && <p role="status" className="text-sm text-white/70">{message}</p>}</form>;
}
