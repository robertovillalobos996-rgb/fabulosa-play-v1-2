import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Play, X, Mic2, Sparkles } from 'lucide-react';

const YOUTUBE_API_KEYS = ["AIzaSyDxLD8PviKQwlHBs7rmRm3GoyIKk-aQpww", "AIzaSyACeTldeUs5tbn2Lwr6o_6Lc48rF1nINY0", "AIzaSyBUk0oq1zjA6BKx5HK8DEQc1TxQqreqGtk", "AIzaSyBys-0J3T5Ou_fdPGxqYC5LWDMgppwD0Y4", "AIzaSyDHdkSo4WSHjYL4nHFU9wKmXW5D9PScO4g", "AIzaSyDJqDMnZsYHyJtzahtvv1r55Z-JfgLk5TU", "AIzaSyCruj7UZTEmElS3ZUeUBmYPecbsAA667U8", "AIzaSyBfMNrgQESeymMQ9srVBHKjXB3_WeRfkXE", "AIzaSyB1e_YSB74yAelvAhapDWu11VPLz2wBkUg", "AIzaSyCsvViGGiPJxx8-FkSwQvHE2T_U8d2UO5E", "AIzaSyBRvdUqolryjMRustJUyqN_HtkjRCbHLfI", "AIzaSyCdmCZW6J49Onl-QAf3cTsNu0im84EBVZc", "AIzaSyCeref7W3di_9o6W3YnEtqgvCQyvyQ5a5Q", "AIzaSyAwtE19mD7rpv1pu5nB4R8Q0HmEX9OkgJI"];

const Karaoke = () => {
    const [videos, setVideos] = useState([]);
    const [selected, setSelected] = useState(null);
    const [term, setTerm] = useState("");

    const buscar = async (q) => {
        // FORZAMOS QUE LA BÚSQUEDA SEA DE KARAOKE
        const queryFinal = q ? `${q} karaoke` : "karaoke exitos español";
        let index = 0;
        let exito = false;
        while (index < YOUTUBE_API_KEYS.length && !exito) {
            try {
                const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(queryFinal)}&type=video&key=${YOUTUBE_API_KEYS[index]}`);
                const data = await res.json();
                if (data.items) { setVideos(data.items); exito = true; }
                else { index++; }
            } catch { index++; }
        }
    };

    useEffect(() => { buscar(""); }, []);

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-10">
            <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
                <Link to="/" className="flex items-center gap-2 text-red-500 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors">
                    <ArrowLeft size={16}/> Volver al Inicio
                </Link>
                <div className="relative w-full md:w-96">
                    <input value={term} onChange={(e) => setTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && buscar(term)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-sm" placeholder="Busca tu canción de Karaoke..." />
                    <button onClick={() => buscar(term)} className="absolute right-3 top-2.5 p-1.5 bg-red-600 rounded-xl"><Search size={18}/></button>
                </div>
                <div className="flex items-center gap-2 bg-red-600/10 px-4 py-2 rounded-full border border-red-600/20 text-red-500 font-black italic">
                    <Mic2 size={20} /> FABULOSA KARAOKE
                </div>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {videos.map(v => (
                    <div key={v.id.videoId} onClick={() => setSelected(v)} className="cursor-pointer group">
                        <div className="aspect-video rounded-3xl overflow-hidden border-2 border-white/5 group-hover:border-red-600 transition-all relative">
                            <img src={v.snippet.thumbnails.high.url} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play fill="white" size={40} />
                            </div>
                        </div>
                        <p className="mt-3 text-[10px] md:text-xs font-bold uppercase text-center line-clamp-2 text-white/60">{v.snippet.title}</p>
                    </div>
                ))}
            </div>

            {selected && (
                <div className="fixed inset-0 z-[100] bg-black flex flex-col">
                    <div className="p-4 flex justify-between items-center bg-zinc-900">
                        <button onClick={() => setSelected(null)} className="bg-red-600 px-6 py-2 rounded-full font-black text-xs uppercase italic">Cerrar Karaoke</button>
                        <h2 className="text-xs font-bold uppercase truncate max-w-xs">{selected.snippet.title}</h2>
                    </div>
                    <iframe className="flex-1" src={`https://www.youtube.com/embed/${selected.id.videoId}?autoplay=1`} frameBorder="0" allowFullScreen />
                </div>
            )}
        </div>
    );
};

export default Karaoke;