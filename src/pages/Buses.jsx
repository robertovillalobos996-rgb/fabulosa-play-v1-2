import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bus, Clock, MapPin, Phone, ArrowLeft, Star } from 'lucide-react';

const Buses = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  const rutas = [
    { empresa: "TRACOPA", ruta: "Paso Canoas - San José", salidas: "05:00, 07:30, 10:00, 13:30", tel: "2221-4214" },
    { empresa: "UTP", ruta: "Golfito - Ciudad Neily", salidas: "Cada 30 min", tel: "2775-1010" }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-600 pb-20 font-sans">
      <header className="bg-black border-b border-white/10 p-6 flex items-center justify-between sticky top-0 z-50">
         <div className="flex items-center gap-4">
            <Link to="/noticias" className="p-2 bg-white/5 rounded-full hover:bg-white/10"><ArrowLeft /></Link>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase flex items-center gap-2">
                <Bus className="text-blue-500"/> Terminal de Buses
            </h1>
         </div>
         <div className="text-right">
            <p className="text-xs text-gray-500 font-bold uppercase">Hora Actual</p>
            <p className="text-xl font-black text-blue-400">{time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
         </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        {rutas.map((ruta, i) => (
            <div key={i} className="bg-[#111] border border-white/10 rounded-3xl p-8 hover:border-blue-500/50 transition-all flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <h2 className="text-2xl font-black text-white mb-2">{ruta.empresa}</h2>
                    <div className="flex items-center gap-2 text-gray-400 text-sm font-bold uppercase"><MapPin size={16}/> {ruta.ruta}</div>
                </div>
                <div className="bg-blue-900/20 px-6 py-4 rounded-2xl border border-blue-500/20 text-center">
                    <div className="flex items-center justify-center gap-2 text-blue-400 mb-1"><Clock size={18}/> <span className="text-xs font-bold uppercase">Salidas</span></div>
                    <p className="text-lg font-bold text-white">{ruta.salidas}</p>
                </div>
                <div className="flex items-center gap-2 text-gray-500 font-bold bg-black px-4 py-2 rounded-lg">
                    <Phone size={16}/> {ruta.tel}
                </div>
            </div>
        ))}

        <div className="bg-gradient-to-br from-blue-900/20 to-black border-4 border-dashed border-blue-500/20 rounded-[3rem] flex flex-col items-center justify-center p-10 text-center cursor-pointer hover:bg-blue-900/30 transition-all">
            <div className="bg-blue-600 p-6 rounded-full mb-6 shadow-2xl"><Star size={40} fill="white"/></div>
            <h3 className="text-3xl font-black italic mb-2 tracking-tighter uppercase leading-none">Anuncie su <br/> Empresa Aquí</h3>
            <button className="bg-white text-black px-12 py-4 rounded-2xl font-black italic uppercase mt-4">Contactar</button>
        </div>
      </main>
    </div>
  );
};

export default Buses;