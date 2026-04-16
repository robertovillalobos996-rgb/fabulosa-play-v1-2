import React, { useState, useEffect } from "react";
import { base44 } from "../api/base44Client";
import { CheckCircle, XCircle, Trash2, Radio, RefreshCw, Clock } from "lucide-react";

export default function AdminPublicidad() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("pending");

  useEffect(() => { loadAds(); }, []);

  const loadAds = async () => {
    setLoading(true);
    try {
      const all = await base44.entities.Advertisement.list("-created_date", 50);
      setAds(all);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleAction = async (id, status) => {
    await base44.entities.Advertisement.update(id, { status });
    loadAds();
  };

  const filtered = ads.filter(a => a.status === tab);

  return (
    <div className="min-h-screen bg-[#080b14] text-white p-6 font-sans">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Radio className="text-orange-500" />
          <h1 className="text-xl font-black uppercase italic">Control de Pautas</h1>
        </div>
        <button onClick={loadAds} className="p-2 bg-white/5 rounded-lg hover:bg-white/10"><RefreshCw size={20}/></button>
      </div>

      <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-2xl w-fit">
        {["pending", "active", "expired"].map((t) => (
          <button key={t} onClick={() => setTab(t)} 
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${tab === t ? "bg-orange-500 text-black" : "text-gray-400 hover:text-white"}`}>
            {t === "pending" ? "Pendientes" : t === "active" ? "Activas" : "Vencidas"}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {loading ? <p className="text-center py-10 opacity-20 italic">Cargando base de datos...</p> : 
         filtered.length === 0 ? <p className="text-center py-10 text-gray-600 italic uppercase text-xs tracking-widest">No hay anuncios aquÃ­</p> :
         filtered.map(ad => (
          <div key={ad.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-black flex-shrink-0">
              <img src={ad.media_url} className="w-full h-full object-cover" alt="Preview" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm uppercase italic leading-none mb-1">{ad.business_name}</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Plan {ad.plan} Â· {ad.phone_numbers}</p>
            </div>
            <div className="flex gap-2">
              {tab === "pending" && (
                <button onClick={() => handleAction(ad.id, "active")} className="p-2 bg-green-500 text-black rounded-lg hover:scale-110 transition-transform"><CheckCircle size={18}/></button>
              )}
              <button onClick={() => handleAction(ad.id, "rejected")} className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}