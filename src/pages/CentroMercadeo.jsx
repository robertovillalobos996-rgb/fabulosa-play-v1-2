import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Globe, Megaphone, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Hls from "hls.js";

import MainLogo from "../assets/logo_fabulosa.png";
import PscLogo from "../assets/logo-psc.png";

// Enlace de su señal
const STREAM_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosaplay/playlist.m3u8";

const CentroMercadeo = () => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  // --- MOTOR DE AUDIO (HLS) ---
  useEffect(() => {
    if (videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(STREAM_URL);
        hls.attachMedia(videoRef.current);
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = STREAM_URL;
      }
    }
  }, []);

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans">
      {/* VIDEO/AUDIO OCULTO PARA EL STREAMING */}
      <video ref={videoRef} className="hidden" playsInline autoPlay muted={isMuted} />

      {/* FONDO DINÁMICO */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,_rgba(30,30,30,1)_0%,_rgba(0,0,0,1)_100%)]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* HEADER RESPONSIVO */}
        <header className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-12 lg:mb-20">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-all group order-2 sm:order-1">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-sm sm:text-base">Volver al Ecosistema</span>
          </Link>
          <img src={MainLogo} alt="Fabulosa Play" className="h-10 sm:h-14 w-auto order-1 sm:order-2" />
          
          {/* CONTROL DE AUDIO FLOTANTE */}
          <button 
            onClick={toggleAudio}
            className="order-3 flex items-center gap-3 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all border border-white/10"
          >
            {isMuted ? <VolumeX size={18} className="text-red-500" /> : <Volume2 size={18} className="text-yellow-500 animate-pulse" />}
            <span className="text-xs font-bold uppercase tracking-widest">
              {isMuted ? "Activar Radio" : "En Vivo"}
            </span>
          </button>
        </header>

        {/* CONTENIDO PRINCIPAL - GRID AJUSTABLE */}
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          
          {/* TEXTO: QUIÉNES SOMOS */}
          <motion.div 
            className="lg:col-span-3 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-yellow-500 font-black tracking-[0.2em] text-xs sm:text-sm uppercase mb-4">Líderes en Comunicación Digital</h2>
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black mb-8 leading-[0.9] italic tracking-tighter">
              IMPULSE SU <br className="hidden sm:block"/> <span className="text-gray-500">NEGOCIO HOY.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-10">
              Somos la plataforma multimedia con mayor crecimiento. Integramos televisión de vanguardia, radio en alta definición y el portal de noticias <strong>PSC Informa</strong> para conectar su marca con miles de personas.
            </p>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 border-t border-white/10 pt-10">
              <StatItem label="Canales" value="+900" />
              <StatItem label="Alcance" value="Global" />
              <StatItem label="Soporte" value="24/7" />
            </div>
          </motion.div>

          {/* TARJETA DE PUBLICIDAD - EL "IMÁN" DE VENTAS */}
          <motion.div 
            className="lg:col-span-2 flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-full bg-gradient-to-b from-white/10 to-transparent border border-white/10 p-8 sm:p-12 rounded-[2.5rem] backdrop-blur-2xl text-center relative overflow-hidden">
              {/* Animación de fondo decorativa */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
              
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <a 
                  href="https://wa.me/50670313508?text=Hola!%20Me%20interesa%20anunciar%20mi%20negocio%20en%20Fabulosa%20Play"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-col items-center justify-center p-1 bg-yellow-500 rounded-full group transition-all hover:shadow-[0_0_60px_rgba(234,179,8,0.4)]"
                >
                  <span className="bg-black text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-all px-8 py-5 rounded-full flex items-center gap-3 font-black text-xl sm:text-2xl tracking-tighter">
                    <Megaphone className="animate-bounce" />
                    ¡ANUNCIE AQUÍ!
                  </span>
                </a>
              </motion.div>
              
              <h3 className="mt-8 text-xl font-bold text-white">¿Busca resultados reales?</h3>
              <p className="mt-4 text-gray-400 text-sm leading-relaxed">
                Su marca merece estar donde todos están viendo. Pida su cotización por WhatsApp y reciba una asesoría personalizada.
              </p>
            </div>
          </motion.div>
        </div>

        {/* GRID DE CONTACTO RESPONSIVO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 lg:mt-24">
          <ContactLink icon={<Phone />} label="WhatsApp" value="+506 7031 3508" url="https://wa.me/50670313508" color="hover:text-green-400" />
          <ContactLink icon={<Mail />} label="Email" value="fabulosaplay@gmail.com" url="mailto:fabulosaplay@gmail.com" color="hover:text-red-400" />
          <ContactLink icon={<Globe />} label="Sitio Web" value="fabulosaplay.online" url="https://fabulosaplay.online" color="hover:text-blue-400" />
        </div>

        {/* FOOTER */}
        <footer className="mt-20 lg:mt-32 pt-10 border-t border-white/5 flex flex-col items-center text-center">
          <div className="flex gap-8 mb-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            <img src={MainLogo} alt="Fabulosa" className="h-6 sm:h-8" />
            <img src={PscLogo} alt="PSC" className="h-6 sm:h-8" />
          </div>
          <p className="text-[10px] sm:text-xs text-gray-600 font-bold tracking-[0.3em] uppercase">
            © 2026 Fabulosa Play Entertainment Group | Costa Rica
          </p>
        </footer>

      </div>
    </div>
  );
};

// Componentes pequeños para mantener el código limpio
const StatItem = ({ label, value }) => (
  <div className="text-center lg:text-left">
    <div className="text-2xl sm:text-3xl font-black text-white">{value}</div>
    <div className="text-[10px] sm:text-xs font-bold text-gray-600 uppercase tracking-widest">{label}</div>
  </div>
);

const ContactLink = ({ icon, label, value, url, color }) => (
  <a 
    href={url} 
    target="_blank" 
    rel="noopener noreferrer"
    className={`flex items-center gap-4 bg-white/5 border border-white/10 p-6 rounded-3xl transition-all ${color} group hover:bg-white/10`}
  >
    <div className="p-3 bg-black rounded-xl group-hover:scale-110 transition-transform">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div className="overflow-hidden">
      <p className="text-[10px] font-black uppercase text-gray-500 tracking-tighter">{label}</p>
      <p className="text-sm sm:text-base font-bold truncate">{value}</p>
    </div>
  </a>
);

export default CentroMercadeo;