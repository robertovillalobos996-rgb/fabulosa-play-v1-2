import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tv, Radio, Newspaper, Megaphone, Zap, ExternalLink, Play } from "lucide-react";
import Hls from "hls.js";

// Importación de logos
import MainLogo from "../assets/logo_fabulosa.png";
import PscLogo from "../assets/logo-psc.png";
import RadioLogo from "../assets/logo_radio.png";

// === INICIO DE LA CIRUGÍA ===
// Referenciamos la nueva imagen desde la carpeta 'public'. 
// En React, las imágenes en 'public' se acceden desde la raíz '/'
const ChannelsBackground = "/canales_play.png"; 
// === FIN DE LA CIRUGÍA ===

// Constante de ejemplo para los canales (esto debería venir de una API en el futuro)
const FEATURED_CHANNELS = [
  { id: 1, name: "Fabulosa TV", type: "Variedades", logo: MainLogo },
  { id: 2, name: "PSC Informa", type: "Noticias", logo: PscLogo },
];

const Home = () => {
  const videoRef = useRef(null);
  const [activeTab, setActiveTab] = useState("radio");

  useEffect(() => {
    // Configuración básica de HLS para el preview si es necesario
    if (videoRef.current) {
        // Lógica de video preview si la tiene...
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={MainLogo} alt="Fabulosa Play Logo" className="h-10 w-auto" />
            <span className="text-2xl font-black tracking-tighter text-white">Fabulosa<span className="text-sky-500">Play</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-2">
             <Link to="/channels" className="text-sm font-medium px-4 py-2 rounded-full text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2"><Tv size={16}/>Canales</Link>
             <Link to="/" className="text-sm font-medium px-4 py-2 rounded-full text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2"><Radio size={16}/>Radio</Link>
             <a href="https://pscinforma.com" target="_blank" className="text-sm font-medium px-4 py-2 rounded-full text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2"><Newspaper size={16}/>Noticias</a>
             <Link to="/marketing" className="text-sm font-medium px-4 py-2 rounded-full text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 hover:bg-yellow-400/20 transition-colors flex items-center gap-2"><Megaphone size={16}/>Publicidad</Link>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* SECCIÓN CANALES (CON LA NUEVA IMAGEN) */}
          <Link
            to="/channels"
            className="group relative block w-full aspect-video rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 transform hover:border-sky-500 transition-all duration-300"
          >
            {/* Background image con gradient */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{
                // Usamos la variable que definimos arriba con la ruta '/canales_play.png'
                backgroundImage: `linear-gradient(135deg, rgba(2, 6, 23, 0.95), rgba(12, 74, 110, 0.8)), url(${ChannelsBackground})`,
              }}
            />
            
            {/* Overlay content */}
            <div className="relative z-10 h-full p-6 md:p-8 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                  <Tv size={24} />
                </div>
                <Zap className="text-sky-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-white mb-2">Canales de TV</h2>
                <p className="text-slate-300 text-sm md:text-base max-w-sm">Accede a nuestra parrilla exclusiva de canales locales e internacionales en vivo.</p>
              </div>
            </div>
          </Link>

          {/* SECCIÓN RADIO (SIN TOCAR) */}
          <div className="w-full aspect-video rounded-3xl p-6 md:p-8 bg-slate-900 border border-slate-800 flex flex-col justify-between">
             {/* ... contenido de radio ... */}
          </div>
        </div>

        {/* MÁS SECCIONES (SIN TOCAR) */}
        {/* ... resto del componente ... */}
      </main>

      {/* FOOTER */}
      {/* ... footer ... */}
    </div>
  );
};

export default Home;