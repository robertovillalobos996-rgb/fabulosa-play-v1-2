import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Globe, Megaphone, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import Hls from "hls.js";

import MainLogo from "../assets/logo_fabulosa.png";
import PscLogo from "../assets/logo-psc.png";
import RadioLogo from "../assets/logo-fabulosa.png"; 

const STREAM_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosaplay/playlist.m3u8";
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

  // Función para forzar el inicio del audio
  const startAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.play().catch(e => console.log("Error al reproducir:", e));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans" onClick={startAudio}>
      {/* VIDEO OCULTO PARA EL AUDIO */}
      <video ref={videoRef} className="hidden" playsInline autoPlay muted={isMuted} />

      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,_rgba(30,30,30,1)_0%,_rgba(0,0,0,1)_100%)]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* HEADER CON LOGO GRANDE */}
        <header className="flex flex-col items-center gap-8 mb-16 lg:mb-20">
          <motion.img 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            src={MainLogo} 
            alt="Fabulosa Play" 
            className="h-28 sm:h-40 lg:h-52 w-auto drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]" 
          />
          
          <div className="flex flex-col sm:flex-row items-center justify-between w-full border-b border-white/5 pb-10 gap-6">
            <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-all group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-black text-xs uppercase tracking-[0.2em]">Regresar</span>
            </Link>

            {/* BOTÓN DE CONTROL DE AUDIO */}
            <button 
              onClick={startAudio}
              className="flex items-center gap-4 bg-yellow-500 text-black px-8 py-4 rounded-full font-black text-sm uppercase tracking-tighter hover:bg-white hover:scale-105 transition-all shadow-[0_10px_30px_rgba(234,179,8,0.3)]"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} className="animate-pulse" />}
              {isMuted ? "Activar Audio en Vivo" : "Escuchando Fabulosa TV"}
            </button>
          </div>
        </header>

        {/* SECCIÓN DE IMPACTO */}
        <div className="grid lg:grid-cols-5 gap-16 items-center mb-24">
          <div className="lg:col-span-3 text-center lg:text-left">
            <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black mb-8 leading-[0.8] italic tracking-tighter">
              DOMINE EL <br/> <span className="text-gray-600">MERCADO.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Su marca merece la máxima exposición. Únase a la plataforma multimedios más innovadora de la región y conecte con miles de clientes hoy mismo.
            </p>
          </div>

          {/* BOTÓN PUBLICIDAD QUE SE MUEVE */}
          <div className="lg:col-span-2 w-full">
            <motion.div 
              animate={{ y: [0, -20, 0], rotate: [0, 1, -1, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="bg-white/5 border border-white/10 p-10 sm:p-14 rounded-[3.5rem] backdrop-blur-3xl text-center relative"
            >
               <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">Negocio Rentable</div>
              <a 
                href={`https://wa.me/50664035313?text=Hola!%20Deseo%20información%20sobre%20publicidad%20en%20Fabulosa%20Play`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full bg-yellow-500 text-black font-black text-2xl py-7 rounded-3xl shadow-[0_20px_60px_rgba(234,179,8,0.4)] hover:bg-white transition-colors"
              >
                <Megaphone className="inline-block mr-3 mb-1 animate-bounce" />
                ¡ANUNCIE AQUÍ!
              </a>
              <p className="mt-8 text-gray-400 font-bold text-sm">Hablemos por WhatsApp: {PHONE_NUMBER}</p>
            </motion.div>
          </div>
        </div>

        {/* TARJETAS DE CONTACTO RESPONSIVAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <ContactCard icon={<Phone />} label="WhatsApp Directo" value={PHONE_NUMBER} url={`https://wa.me/50664035313`} />
          <ContactCard icon={<Mail />} label="Correo Oficial" value="fabulosaplay@gmail.com" url="mailto:fabulosaplay@gmail.com" />
          <ContactCard icon={<Globe />} label="Ecosistema Web" value="fabulosaplay.online" url="https://fabulosaplay.online" />
        </div>

        {/* FOOTER CON LOGOS INTERACTIVOS (ZOOM) */}
        <footer className="pt-20 border-t border-white/10 text-center">
          <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.6em] mb-14 italic">Nuestra Red de Medios</p>
          <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-20 lg:gap-32 pb-10">
            
            {/* LOGO 1: FABULOSA PLAY */}
            <motion.img 
              whileHover={{ scale: 1.3, rotate: 2 }}
              whileTap={{ scale: 0.9 }}
              src={MainLogo} 
              alt="Fabulosa Play" 
              className="h-12 sm:h-16 w-auto cursor-pointer filter brightness-90 hover:brightness-125 transition-all" 
            />

            {/* LOGO 2: PSC INFORMA */}
            <motion.img 
              whileHover={{ scale: 1.3, rotate: -2 }}
              whileTap={{ scale: 0.9 }}
              src={PscLogo} 
              alt="PSC Informa" 
              className="h-12 sm:h-16 w-auto cursor-pointer filter brightness-90 hover:brightness-125 transition-all" 
            />

            {/* LOGO 3: FABULOSA RADIO */}
            <motion.img 
              whileHover={{ scale: 1.3, rotate: 2 }}
              whileTap={{ scale: 0.9 }}
              src={RadioLogo} 
              alt="Fabulosa Radio" 
              className="h-12 sm:h-16 w-auto cursor-pointer filter brightness-90 hover:brightness-125 transition-all" 
            />

          </div>
          <p className="mt-16 text-gray-800 text-[10px] font-black tracking-widest uppercase">
            © 2026 FABULOSA PLAY ENTERTAINMENT GROUP | LÍDERES EN COSTA RICA
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
    whileHover={{ y: -10, backgroundColor: "rgba(255,255,255,0.08)" }}
    className="flex flex-col items-center bg-white/5 border border-white/10 p-10 rounded-[2.5rem] transition-all group"
  >
    <div className="mb-5 text-yellow-500 group-hover:scale-110 transition-transform bg-black p-4 rounded-2xl border border-white/5">
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">{label}</span>
    <span className="text-xl font-black group-hover:text-yellow-500 transition-colors">{value}</span>
  </motion.a>
);

export default CentroMercadeo;