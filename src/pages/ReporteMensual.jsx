import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Users, Eye, TrendingUp, Calendar, ArrowLeft, ShieldCheck } from 'lucide-react';

const ReporteMensual = () => {
  const stats = [
    { name: 'Chinito Express', views: '45,230', status: 'Activo', color: 'text-cyan-400' },
    { name: 'La Mexicana', views: '38,100', status: 'Activo', color: 'text-amber-500' },
    { name: 'Uñas Yendry', views: '12,450', status: 'Finalizado', color: 'text-pink-500' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-white/40 hover:text-white"><ArrowLeft /></Link>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic text-amber-500">Reporte Mensual de Pauta</h1>
          </div>
          <div className="bg-white/5 px-6 py-2 rounded-full border border-white/10 flex items-center gap-2">
            <Calendar size={18} className="text-amber-500" />
            <span className="font-bold text-sm">MARZO 2026</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
            <Eye className="text-cyan-400 mb-4" />
            <div className="text-4xl font-black">1.2M</div>
            <div className="text-xs font-bold text-white/40 uppercase tracking-widest">Impresiones Totales</div>
          </div>
          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
            <Users className="text-amber-500 mb-4" />
            <div className="text-4xl font-black">240K</div>
            <div className="text-xs font-bold text-white/40 uppercase tracking-widest">Oyentes Únicos</div>
          </div>
          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
            <TrendingUp className="text-green-500 mb-4" />
            <div className="text-4xl font-black">+18%</div>
            <div className="text-xs font-bold text-white/40 uppercase tracking-widest">Crecimiento Mensual</div>
          </div>
        </div>

        <div className="bg-white/5 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/10 flex justify-between items-center">
            <h2 className="font-black text-xl uppercase italic">Desempeño de Anunciantes</h2>
            <ShieldCheck className="text-amber-500" />
          </div>
          <table className="w-full">
            <thead className="bg-white/5">
              <tr className="text-left text-xs font-black uppercase tracking-widest text-white/40">
                <th className="p-6">Cliente</th>
                <th className="p-6">Visualizaciones</th>
                <th className="p-6">Estado de Campaña</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stats.map((s, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="p-6 font-bold">{s.name}</td>
                  <td className={`p-6 font-black ${s.color}`}>{s.views}</td>
                  <td className="p-6">
                    <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase border border-white/10">
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReporteMensual;