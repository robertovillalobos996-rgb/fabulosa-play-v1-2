import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Share2, Eye, Clock, Megaphone, Newspaper } from 'lucide-react';

const NewsCenter = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/noticias.json');
        const data = await res.json();
        
        // Si hay datos, los ponemos. Si no, ponemos la noticia de bienvenida.
        if (data && data.length > 0) {
          setNews(data);
        } else {
          setNews([{
            id: 'welcome',
            title: "BIENVENIDOS AL CENTRO DE NOTICIAS PSC",
            content: "Estamos actualizando las informaciones de último minuto. Por favor, refresque en unos segundos para ver lo más reciente del acontecer regional.",
            time: "AHORA",
            views: "1.2k"
          }]);
        }
      } catch (err) { 
        // Si falla el fetch, cargamos la noticia de respaldo para que NO quede en blanco
        setNews([{
          id: 'error-fallback',
          title: "SINTONÍA EN VIVO: PSC INFORMA",
          content: "Conectando con la señal de Elva... Nuestra reportera de IA está procesando las noticias de la Zona Sur.",
          time: "EN VIVO",
          views: "500"
        }]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen bg-slate-100 font-sans">
      <header className="fixed top-0 w-full z-[100] bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-800">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl md:text-2xl font-black text-blue-900 tracking-tighter uppercase italic">
              PSC <span className="text-red-600">INFORMA</span>
          </h1>
        </div>
      </header>

      <main className="pt-24 pb-12 px-4 md:px-8 max-w-6xl mx-auto">
        
        {/* ✅ PORTADA CON LA IMAGEN QUE ME PEDISTE */}
        <section className="mb-10 relative rounded-[2rem] overflow-hidden shadow-2xl h-[250px] md:h-[400px] border-4 border-white">
            <img src="/psc_imforma.png" className="w-full h-full object-cover" alt="PSC Portada" />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-transparent to-transparent flex flex-col justify-end p-6 md:p-10">
                <div className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full w-fit mb-3 animate-pulse uppercase tracking-widest">
                    Extra de Última Hora
                </div>
                <h2 className="text-2xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
                    NOTICIAS <span className="text-red-500">DE LA ZONA SUR</span>
                </h2>
            </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                {news.map((item) => (
                    <article key={item.id} className="bg-white rounded-[1.5rem] p-6 md:p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
                        <div className="flex justify-between items-center mb-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                            <span className="flex items-center gap-1"><Clock size={12}/> {item.time}</span>
                            <span className="flex items-center gap-1 text-blue-600"><Eye size={12}/> {item.views} Lecturas</span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4 leading-tight uppercase italic">{item.title}</h3>
                        <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6 font-medium">{item.content}</p>
                        <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                            <button className="flex items-center gap-2 text-blue-700 font-black text-[10px] uppercase italic">
                                <Share2 size={14}/> Compartir Noticia
                            </button>
                            <img src="/assets/logo-psc.png" className="h-6 opacity-30" alt="PSC Small" />
                        </div>
                    </article>
                ))}
            </div>

            <aside className="space-y-6">
                <div className="bg-blue-900 rounded-[2rem] p-8 text-center text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform">
                        <Newspaper size={100} />
                    </div>
                    <Megaphone className="text-red-500 mx-auto mb-4 animate-bounce" size={40}/>
                    <h4 className="font-black uppercase italic text-xl mb-2">Publicidad con Impacto</h4>
                    <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-6">Llegue a miles en toda la región</p>
                    <a href="https://wa.me/50664035313" className="block w-full bg-red-600 py-4 rounded-2xl text-white font-black text-xs hover:bg-red-700 transition-all shadow-lg uppercase">Contactar Ventas</a>
                </div>
            </aside>
        </div>
      </main>
    </div>
  );
};

export default NewsCenter;