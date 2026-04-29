import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Globe, Megaphone, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import Hls from "hls.js";

import MainLogo from "../assets/logo_fabulosa.png";
import PscLogo from "../assets/logo-psc.png";
import RadioLogo from "../assets/logo-fabulosa.png"; 

// ✅ NUEVA RUTA DE AUDIO ACTUALIZADA
const STREAM_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8";
const PHONE_NUMBER = "+506 6403 5313";

const CentroMercadeo = () => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  // === MOTOR DE AUDIO HLS ===
  useEffect(() => {
    let hls;
    if (videoRef.current) {
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(STREAM_URL);
        hls.attachMedia(videoRef.current);
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = STREAM_URL;
      }
    }
    return () => {
      if (hls) hls.destroy();
    };
  }, []);

  const startAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.play().catch(e => console.log("Interacción requerida para audio"));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans" onClick={startAudio}>
      <video ref={videoRef} className="hidden" playsInline autoPlay muted={isMuted} />

      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,_rgba(25,25,25,1)_0%,_rgba(0,0,0,1)_100%)]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* LOGO SUPERIOR IMPACTANTE */}
        <header className="flex flex-col items-center gap-10 mb-16 lg:mb-24">
          <motion.img 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            src={MainLogo} 
            alt="Fabulosa Play" 
            className="h-32 sm:h-48 lg:h-64 w-auto drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]" 
          />
          
          <div className="flex flex-col sm:flex-row items-center justify-between w-full border-b border-white/5 pb-10 gap-8">
            <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-all group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-black text-xs uppercase tracking-[0.3em]">Cerrar Panel</span>
            </Link>

            <button 
              onClick={startAudio}
              className="flex items-center gap-4 bg-yellow-500 text-black px-10 py-5 rounded-full font-black text-sm uppercase tracking-tighter hover:bg-white transition-all shadow-2xl"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} className="animate-pulse" />}
              {isMuted ? "Escuchar Radio en Vivo" : "Fabulosa Radio Activa"}
            </button>
          </div>
        </header>

        {/* CONTENIDO CENTRAL */}
        <div className="grid lg:grid-cols-5 gap-16 items-center mb-32">
          <div className="lg:col-span-3 text-center lg:text-left">
            <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black mb-10 leading-[0.8] italic tracking-tighter">
              PUBLIQUE <br/> <span className="text-gray-600">Y GANE.</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Llegue a miles de hogares a través de nuestra red multimedios. La forma más rápida y efectiva de hacer crecer su negocio en la era digital.
            </p>
          </div>

          {/* BOTÓN DE PUBLICIDAD ANIMADO */}
          <div className="lg:col-span-2">
            <motion.div 
              animate={{ y: [0, -25, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="bg-white/5 border border-white/10 p-12 sm:p-16 rounded-[4rem] backdrop-blur-3xl text-center relative border-yellow-500/20"
            >
              <a 
                href={`https://wa.me/50664035313?text=Hola!%20Me%20interesa%20contratar%20publicidad%20en%20Fabulosa`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full bg-yellow-500 text-black font-black text-3xl py-8 rounded-3xl shadow-[0_30px_70px_rgba(234,179,8,0.4)] hover:scale-105 transition-transform"
              >
                <Megaphone className="inline-block mr-3 mb-1 animate-bounce" />
                ¡ANUNCIATE AQUI!
              </a>
              <p className="mt-10 text-gray-500 font-black uppercase text-xs tracking-widest italic">Línea de Ventas: {PHONE_NUMBER}</p>
            </motion.div>
          </div>
        </div>

        {/* CONTACTOS RÁPIDOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          <ContactCard icon={<Phone />} label="WhatsApp" value={PHONE_NUMBER} url={`https://wa.me/50664035313`} />
          <ContactCard icon={<Mail />} label="Email" value="fabulosaplay@gmail.com" url="mailto:fabulosaplay@gmail.com" />
          <ContactCard icon={<Globe />} label="Portal Web" value="fabulosaplay.online" url="https://fabulosaplay.online" />
        </div>

        {/* LOGOS INTERACTIVOS (CON ZOOM AL PASAR DEDO/MOUSE) */}
        <footer className="pt-24 border-t border-white/10 text-center">
          <p className="text-gray-700 text-[10px] font-black uppercase tracking-[0.8em] mb-16 italic">Nuestro Ecosistema Multimedia</p>
          <div className="flex flex-wrap justify-center items-center gap-14 sm:gap-24 lg:gap-40">
            
            <motion.img 
              whileHover={{ scale: 1.4, rotate: 3 }}
              whileTap={{ scale: 0.8 }}
              src={MainLogo} 
              alt="Fabulosa Play" 
              className="h-16 sm:h-20 w-auto cursor-pointer transition-all grayscale hover:grayscale-0 opacity-50 hover:opacity-100" 
            />

            <motion.img 
              whileHover={{ scale: 1.4, rotate: -3 }}
              whileTap={{ scale: 0.8 }}
              src={PscLogo} 
              alt="PSC Informa" 
              className="h-16 sm:h-20 w-auto cursor-pointer transition-all grayscale hover:grayscale-0 opacity-50 hover:opacity-100" 
            />

            <motion.img 
              whileHover={{ scale: 1.4, rotate: 3 }}
              whileTap={{ scale: 0.8 }}
              src={RadioLogo} 
              alt="Fabulosa Radio" 
              className="h-16 sm:h-20 w-auto cursor-pointer transition-all grayscale hover:grayscale-0 opacity-50 hover:opacity-100" 
            />

          </div>
          <p className="mt-24 text-gray-800 text-[10px] font-black tracking-[0.4em] uppercase">
            © 2026 FABULOSA PLAY ENTERTAINMENT GROUP | COSTA RICA
          </p>
        </footer>

      </div>
    </div>
  );
};

const ContactCard = ({ icon, label, value, url }) => (
  <motion.a 
    href={url} 
    target="_blank" 
    rel="noopener noreferrer" 
    whileHover={{ y: -15, scale: 1.02 }}
    className="flex flex-col items-center bg-white/5 border border-white/10 p-12 rounded-[3rem] transition-all group hover:bg-white/10"
  >
    <div className="mb-6 text-yellow-500 bg-black p-5 rounded-3xl border border-white/5 group-hover:bg-yellow-500 group-hover:text-black transition-all">
      {React.cloneElement(icon, { size: 32 })}
    </div>
    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">{label}</span>
    <span className="text-xl font-black">{value}</span>
  </motion.a>
);

export default CentroMercadeo;