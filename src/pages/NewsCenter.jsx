import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Share2, Eye, Clock, Megaphone } from 'lucide-react';

const NewsCenter = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/noticias.json');
        const data = await res.json();
        if (data && data.length > 0) {
          setNews(data);
        } else {
          // Si el archivo está vacío, ponemos este mensaje de respaldo
          setNews([{ 
            id: 1, 
            title: "BIENVENIDOS A PSC INFORMA", 
            content: "Estamos preparando las últimas noticias para usted. Refresque en un momento.", 
            time: "AHORA", 
            views: "---" 
          }]);
        }
      } catch (err) { 
        // Si no encuentra el archivo json, pone esto para que NO quede en blanco
        setNews([{ 
          id: 2, 
          title: "SINTONÍA EN VIVO", 
          content: "Conectando con el centro de noticias de Elva... Espere un momento.", 
          time: "EN VIVO", 
          views: "---" 
        }]);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="w-full min-h-screen bg-slate-50">
      {/* NAVBAR */}
      <header className="fixed top-0 w-full z-[100] bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-800">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-black text-blue-900 tracking-tighter uppercase italic">
              PSC <span className="text-red-600">INFORMA</span>
          </h1>
        </div>
      </header>

      <main className="pt-24 pb-12 px-4 md:px-8 max-w-6xl mx-auto">
        
        {/* ✅ FOTO DE PORTADA CORREGIDA (CON 'N' Y RUTA A PUBLIC) */}
        <section className="mb-10 relative overflow-hidden rounded-[2rem] shadow-2xl h-[250px] md:h-[400px]">
            <img src="/psc_informa.png" className="w-full h-full object-cover" alt="PSC" />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-transparent to-transparent flex flex-col justify-end p-8">
                <h2 className="text-2xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
                    LA VERDAD <span className="text-red-500">AL INSTANTE</span>
                </h2>
            </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                {news.map(item => (
                    <article key={item.id} className="bg-white rounded-[1.5rem] p-6 border border-slate-200 shadow-sm">
                        <div className="flex justify-between mb-4">
                            <span className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1">
                                <Clock size={12}/> {item.time}
                            </span>
                            <span className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-1">
                                <Eye size={12}/> {item.views} LECTURAS
                            </span>
                        </div>
                        <h4 className="text-xl font-black text-slate-900 mb-4 uppercase italic leading-tight">
                            {item.title}
                        </h4>
                        <p className="text-slate-600 text-sm leading-relaxed mb-6">{item.content}</p>
                        <div className="flex justify-between border-t pt-4">
                            <button className="text-blue-600 font-black text-[10px] uppercase italic flex items-center gap-2">
                                <Share2 size={16}/> Compartir Noticia
                            </button>
                        </div>
                    </article>
                ))}
            </div>

            {/* SIDEBAR PUBLICIDAD */}
            <aside className="space-y-6">
                <div className="bg-blue-900 rounded-[2.5rem] p-8 text-center text-white shadow-xl">
                    <Megaphone className="text-red-500 mx-auto mb-4 animate-bounce" size={40}/>
                    <h5 className="font-black uppercase italic text-lg mb-2">Anuncia aquí</h5>
                    <a href="https://wa.me/50664035313" className="block w-full bg-red-600 py-3 rounded-2xl text-white font-black text-xs hover:bg-red-500 transition-all uppercase">Ventas WhatsApp</a>
                </div>
            </aside>
        </div>
      </main>
    </div>
  );
};

export default NewsCenter;