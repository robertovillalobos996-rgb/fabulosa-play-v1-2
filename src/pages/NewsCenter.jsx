import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Bell, Share2, Eye, Trash2,
  ExternalLink, AlertTriangle, Newspaper, Clock, TrendingUp, Megaphone 
} from 'lucide-react';

// ✅ Imagen de portada original
import pscPortada from '../assets/psc_imforma.png';

const NewsCenter = () => {
  const [news, setNews] = useState([]);
  const [isEmergency, setIsEmergency] = useState(false);
  const [audioAllowed, setAudioAllowed] = useState(false);
  const sirenRef = useRef(new Audio('https://www.soundjay.com/buttons/sounds/beep-01a.mp3'));

  // 📡 CARGAR NOTICIAS REALES DE ELVA
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/noticias.json'); // El archivo que actualiza Elva
        const data = await res.json();
        setNews(data);
      } catch (err) { console.log("Cargando base de datos..."); }
    };
    fetchNews();
    const interval = setInterval(fetchNews, 30000); // Actualiza cada 30 seg
    return () => clearInterval(interval);
  }, []);

  const borrarNoticia = (id) => {
    if(window.confirm("¿Desea eliminar esta noticia del feed visual?")) {
        setNews(news.filter(n => n.id !== id));
    }
  };

  return (
    <div className={`w-full min-h-screen transition-colors duration-500 ${isEmergency ? 'bg-red-950' : 'bg-slate-50'}`}>
      
      {/* NAVBAR PROFESIONAL */}
      <header className="fixed top-0 w-full z-[100] bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-800"><ArrowLeft size={24} /></Link>
          <h1 className="text-2xl font-black text-blue-900 tracking-tighter uppercase italic">
              PSC <span className="text-red-600">INFORMA</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
            {!audioAllowed && (
                <button onClick={() => setAudioAllowed(true)} className="px-4 py-2 bg-blue-600 text-white rounded-full font-bold text-xs animate-pulse">
                    🔔 ACTIVAR ALERTAS
                </button>
            )}
        </div>
      </header>

      <main className="pt-24 pb-12 px-4 md:px-8 max-w-6xl mx-auto">
        
        {/* PORTADA PRINCIPAL */}
        <section className="mb-10 relative group overflow-hidden rounded-[2rem] shadow-2xl h-[300px] md:h-[450px]">
            <img src={pscPortada} className="w-full h-full object-cover" alt="PSC" />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-transparent to-transparent flex flex-col justify-end p-8">
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
                    LA VERDAD <span className="text-red-500">AL INSTANTE</span>
                </h2>
            </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                {news.map(item => (
                    <article key={item.id} className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm relative group">
                        
                        {/* 🗑️ BOTÓN BORRAR PARA ALLAN */}
                        <button onClick={() => borrarNoticia(item.id)} className="absolute top-4 right-4 bg-red-100 text-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white z-30">
                            <Trash2 size={20}/>
                        </button>

                        <div className="p-6">
                            <div className="flex justify-between mb-4">
                                <span className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1"><Clock size={12}/> {item.time || "AHORA"}</span>
                                <span className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-1"><Eye size={12}/> {item.views || "1k"} LECTURAS</span>
                            </div>
                            <h4 className="text-xl md:text-2xl font-black text-slate-900 mb-4 uppercase italic">{item.title}</h4>
                            
                            {item.image && (
                                <div className="rounded-2xl overflow-hidden mb-4 aspect-video bg-slate-100">
                                    <img src={item.image} className="w-full h-full object-cover" alt="Noticia" />
                                </div>
                            )}

                            <p className="text-slate-600 text-sm leading-relaxed mb-6">{item.content}</p>

                            <div className="flex justify-between border-t pt-4">
                                <button className="text-blue-600 font-black text-xs uppercase italic flex items-center gap-2">
                                    <Share2 size={16}/> Compartir
                                </button>
                                <span className="text-[9px] font-bold text-slate-300 uppercase">www.fabulosaplay.online</span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* SIDEBAR PUBLICIDAD */}
            <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-900 to-black rounded-[2.5rem] p-8 text-center shadow-xl">
                    <Megaphone className="text-red-500 mx-auto mb-4 animate-bounce" size={40}/>
                    <h5 className="text-white font-black uppercase italic text-xl mb-2">Anuncia aquí</h5>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-6">Zona Sur y el Mundo</p>
                    <a href="https://wa.me/50664035313" className="block w-full bg-red-600 py-3 rounded-2xl text-white font-black text-xs hover:bg-red-500 transition-all">WHATSAPP VENTAS</a>
                </div>

                {/* ADSENSE */}
                <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm overflow-hidden">
                    <span className="text-[9px] font-bold text-slate-400 uppercase mb-2 block text-center">Publicidad</span>
                    <ins className="adsbygoogle"
                        style={{ display: 'block' }}
                        data-ad-client="ca-pub-9326186822962530"
                        data-ad-slot="7869741603"
                        data-ad-format="auto"></ins>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default NewsCenter;