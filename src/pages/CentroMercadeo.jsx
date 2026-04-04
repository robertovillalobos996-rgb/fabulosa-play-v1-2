import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Tv, MapPin, Mail, Phone, Globe, ShieldCheck, Zap, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion"; // Necesario para el movimiento del logo PSC

// --- IMPORTACIÓN DE LOGOS (RUTAS LOCALES ACTUALIZADAS) ---
import MainLogo from "../assets/logo_fabulosa.png";
import PscLogo from "../assets/logo-psc.png";
// Usamos logo-fabulosa (con guión) para la radio para distinguir
import RadioLogo from "../assets/logo-fabulosa.png"; 

const CentroMercadeo = () => {
  const [scrolled, setScrolled] = useState(false);
  const audioRef = useRef(null);

  // === 🚀 MOTOR DE AUDIO DE FONDO (Stream sintonizado en low quality) ===
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.15; // Volumen de fondo muy suave
      const startAudio = async () => {
        try {
          await audio.play();
          console.log("🔊 Sintonizando experiencia auditiva Fabulosa...");
        } catch (error) {
          // Navegadores bloquean autoplay sin interacción. El usuario debe tocar.
          console.log("🔇 Autoplay de audio bloqueado por el navegador.");
          
          // Fallback: Sintonizar al primer toque
          const playOnTouch = () => {
              audio.play();
              window.removeEventListener('click', playOnTouch);
          };
          window.addEventListener('click', playOnTouch);
        }
      };
      startAudio();
    }
    return () => { if (audio) audio.pause(); };
  }, []);

  // Efecto visual para el Navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Datos de contacto fijos
  const CONTACT_INFO = {
    phone: "+506 6403 5313",
    wa_link: "https://wa.me/50664035313",
    email: "fabulosaplay@gmail.com",
    web: "www.fabulosaplay.online",
    web_link: "https://www.fabulosaplay.online",
    psc_fb: "https://www.facebook.com/profile.php?id=100089994882915"
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-red-600 pb-20">
      
      {/* 🎧 ELEMENTO DE AUDIO NASA ENGINE */}
      <audio ref={audioRef} src="https://dattavolt.com/8030/stream" loop preLoad="auto" />

      {/* NAVBAR MODERNIZADO */}
      <nav className={`fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'}`}>
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 bg-white/5 rounded-full hover:bg-red-600 transition-colors"><ArrowLeft size={20} /></Link>
          <div className="flex items-center gap-1 font-black text-2xl tracking-tighter uppercase italic">
             <Tv className="text-red-600" size={30} fill="currentColor"/>
             <span className="text-white">CANALES<span className="text-red-600 font-light">PLAY</span></span>
          </div>
        </div>
      </nav>

      {/* 🚀 HERO: CARÁTULA DE INNOVACIÓN Y TECNOLOGÍA */}
      <div className="relative w-full h-[70vh] flex items-center justify-center pt-24 overflow-hidden bg-zinc-950 border-b border-white/5">
        <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px]"></div>
        
        <div className="max-w-7xl mx-auto px-6 z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                <img src={MainLogo} alt="Fabulosa Play" className="w-48 h-48 object-contain mx-auto mb-10 drop-shadow-[0_0_30px_rgba(255,0,0,0.5)]" />
                <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter italic leading-none text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-white to-red-600 drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
                    INNOVACIÓN DIGITAL
                </h1>
                <p className="mt-6 text-xl md:text-2xl font-black text-gray-400 uppercase tracking-[0.3em] leading-snug">
                    TECNOLOGÍA • ENTRETENIMIENTO • COMUNICACIÓN GLOBAL
                </p>
                <div className="flex items-center justify-center gap-2 mt-4 text-cyan-400 font-bold text-xs">
                    <Zap size={16} /> MOTOR NASA SINTONIZADO
                </div>
            </motion.div>
        </div>
      </div>

      {/* 📜 RESEÑA: QUIÉNES SOMOS */}
      <div className="max-w-7xl mx-auto px-6 py-20 border-b border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="border border-white/5 bg-zinc-900/50 p-8 rounded-2xl">
                <ShieldCheck className="text-red-600 mb-6 mx-auto md:mx-0" size={40} />
                <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-4">Tecnología Blindada</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                    Somos la evolución de la infraestructura multimedia. Sintonizamos señales potentes y estables, garantizando entretenimiento sin interrupciones mediante el uso de tecnología de punta y seguridad blindada.
                </p>
            </div>
            <div className="border border-white/5 bg-zinc-900/50 p-8 rounded-2xl">
                <Zap className="text-cyan-400 mb-6 mx-auto md:mx-0" size={40} />
                <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-4">Innovación Constante</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                    El futuro es hoy. Fabulosa Play es el ecosistema digital donde la innovación mediática redefine la forma en que Costa Rica y el mundo consumen entretenimiento y comunicación veraz.
                </p>
            </div>
            <div className="border border-white/5 bg-zinc-900/50 p-8 rounded-2xl">
                <HeartHandshake className="text-green-400 mb-6 mx-auto md:mx-0" size={40} />
                <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-4">Conexión Humana</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                    Unimos a Costa Rica. Integramos información responsable a través de PSC Informa y la compañía musical de Radio Fabulosa, llevando conexión y entretenimiento directo al corazón de nuestros usuarios.
                </p>
            </div>
        </div>
      </div>

      {/* 🏷️ ECOSISTEMA INTERACTIVO: LOGOS Y ENLACES */}
      <div className="max-w-7xl mx-auto px-6 py-20 border-b border-white/5">
        <div className="text-center mb-16">
            <h2 className="text-sm font-black text-red-600 uppercase tracking-widest animate-pulse">Nuestro Grupo</h2>
            <h3 className="text-5xl font-black uppercase tracking-tighter">UN SOLO UNIVERSO DIGITAL</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* FABULOSA PLAY (Main Hub) */}
            <a href={CONTACT_INFO.web_link} target="_blank" rel="noopener noreferrer" 
            className="group border-2 border-white/5 bg-zinc-950 p-10 rounded-3xl text-center flex flex-col items-center justify-between hover:border-red-600/50 hover:bg-black transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(255,0,0,0.3)]">
                <img src={MainLogo} alt="Fabulosa Play" className="w-40 h-40 object-contain drop-shadow-[0_0_15px_rgba(255,0,0,0.5)] mb-8 transition-transform group-hover:scale-110" />
                <div className="flex-1">
                    <h4 className="text-2xl font-black uppercase tracking-tight text-white line-clamp-1 group-hover:text-red-600 transition-colors">FABULOSA PLAY</h4>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2 line-clamp-1">Technology & Entertainment Hub</p>
                </div>
                <div className="w-full h-1 bg-red-600/20 rounded-full mt-6"></div>
            </a>

            {/* PSC INFORMA (Con Movimiento) */}
            <a href={CONTACT_INFO.psc_fb} target="_blank" rel="noopener noreferrer"
            className="group border-2 border-white/5 bg-zinc-950 p-10 rounded-3xl text-center flex flex-col items-center justify-between hover:border-green-600/50 hover:bg-black transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(0,255,0,0.3)]">
                {/* === 🌀 MOVIMIENTO FLOTANTE PSC === */}
                <motion.img src={PscLogo} alt="PSC Informa" className="w-40 h-40 object-contain mb-8 transition-transform group-hover:scale-110" 
                    animate={{ y: [0, -10, 0] }} // Flotando
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} 
                />
                <div className="flex-1">
                    <h4 className="text-2xl font-black uppercase tracking-tight text-white line-clamp-1 group-hover:text-green-600 transition-colors">PSC INFORMA</h4>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2 line-clamp-1">Noticias Veraces en Vivo</p>
                </div>
                <div className="w-full h-1 bg-green-600/20 rounded-full mt-6"></div>
            </a>

            {/* RADIO FABULOSA */}
            <a href={CONTACT_INFO.wa_link} target="_blank" rel="noopener noreferrer"
            className="group border-2 border-white/5 bg-zinc-950 p-10 rounded-3xl text-center flex flex-col items-center justify-between hover:border-cyan-600/50 hover:bg-black transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(0,255,255,0.3)]">
                <img src={RadioLogo} alt="Radio Fabulosa" className="w-40 h-40 object-contain drop-shadow-[0_0_15px_rgba(0,255,255,0.5)] mb-8 transition-transform group-hover:scale-110" />
                <div className="flex-1">
                    <h4 className="text-2xl font-black uppercase tracking-tight text-white line-clamp-1 group-hover:text-cyan-600 transition-colors">RADIO FABULOSA</h4>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2 line-clamp-1">La Mejor Música 24/7</p>
                </div>
                <div className="w-full h-1 bg-cyan-600/20 rounded-full mt-6"></div>
            </a>

        </div>
      </div>

      {/* 📞 CONTACTO: BOTONES FUNCIONALES */}
      <div className="max-w-7xl mx-auto px-6 pt-20">
        <div className="text-center mb-10">
            <h3 className="text-5xl font-black uppercase tracking-tighter">CENTRO DE ATENCIÓN</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* WHATSAPP TRASPARENTE */}
            <a href={CONTACT_INFO.wa_link} target="_blank" rel="noopener noreferrer" 
            className="flex items-center gap-6 bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:scale-105 transition-all text-gray-300 hover:text-white">
                <Phone className="text-green-400" size={30} />
                <div>
                    <h5 className="font-bold text-sm tracking-widest uppercase">WhatsApp Directo</h5>
                    <p className="font-black text-xl">{CONTACT_INFO.phone}</p>
                </div>
            </a>

            {/* EMAIL TRASPARENTE */}
            <a href={`mailto:${CONTACT_INFO.email}`} target="_blank" rel="noopener noreferrer" 
            className="flex items-center gap-6 bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:scale-105 transition-all text-gray-300 hover:text-white">
                <Mail className="text-red-400" size={30} />
                <div>
                    <h5 className="font-bold text-sm tracking-widest uppercase">Soporte Técnico</h5>
                    <p className="font-black text-xl truncate">{CONTACT_INFO.email}</p>
                </div>
            </a>

            {/* WEB TRASPARENTE */}
            <a href={CONTACT_INFO.web_link} target="_blank" rel="noopener noreferrer" 
            className="flex items-center gap-6 bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:scale-105 transition-all text-gray-300 hover:text-white">
                <Globe className="text-cyan-400" size={30} />
                <div>
                    <h5 className="font-bold text-sm tracking-widest uppercase">Ecosistema Oficial</h5>
                    <p className="font-black text-xl">{CONTACT_INFO.web}</p>
                </div>
            </a>
        </div>
      </div>
      
      <style>{`.custom-scrollbar::-webkit-scrollbar { height: 6px; }`}</style>
    </div>
  );
};

export default CentroMercadeo;