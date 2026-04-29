import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Globe, Megaphone, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import Hls from "hls.js";

import MainLogo from "../assets/logo_fabulosa.png";
import PscLogo from "../assets/logo-psc.png";
import RadioLogo from "../assets/logo-fabulosa.png"; // Ajustar si tiene un tercer logo diferente

const STREAM_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosaplay/playlist.m3u8";
const PHONE_NUMBER = "+506 6403 5313";

const CentroMercadeo = () => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

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
      videoRef.current.play().catch(e => console.log("Esperando interacción..."));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans">
      <video ref={videoRef} className="hidden" playsInline autoPlay muted={isMuted} />

      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,_rgba(20,20,20,1)_0%,_rgba(0,0,0,1)_100%)]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* LOGO ARRIBA BIEN GRANDE */}
        <header className="flex flex-col items-center gap-8 mb-16 lg:mb-24">
          <motion.img 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={MainLogo} 
            alt="Fabulosa Play" 
            className="h-24 sm:h-32 lg:h-40 w-auto drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]" 
          />
          
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full justify-between border-b border-white/5 pb-8">
            <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-all group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold text-xs uppercase tracking-widest">Regresar</span>
            </Link>

            <button 
              onClick={toggleAudio}
              className="flex items-center gap-3 bg-yellow-500 text-black px-6 py-3 rounded-full font-black text-xs uppercase tracking-tighter hover:bg-white transition-all shadow-lg"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} className="animate-pulse" />}
              {isMuted ? "Escuchar Señal en Vivo" : "Señal Activa"}
            </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-5 gap-12 items-center mb-24">
          <div className="lg:col-span-3 text-center lg:text-left">
            <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black mb-8 leading-[0.8] italic tracking-tighter">
              EL PODER <br/> <span className="text-gray-600">DE MARCAR.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Únase a la red multimedios líder. Televisión, radio y noticias con cobertura total para que su empresa llegue al siguiente nivel.
            </p>
          </div>

          {/* BOTÓN PUBLICIDAD ANIMADO */}
          <div className="lg:col-span-2">
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="bg-white/5 border border-white/10 p-12 rounded-[3rem] backdrop-blur-3xl text-center"
            >
              <a 
                href={`https://wa.me/${PHONE_NUMBER.replace(/\s+/g, '')}?text=Hola!%20Me%20interesa%20pautar%20publicidad%20en%20Fabulosa%20Play`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full bg-yellow-500 text-black font-black text-2xl py-6 rounded-2xl shadow-[0_20px_50px_rgba(234,179,8,0.3)] hover:scale-105 transition-transform"
              >
                <Megaphone className="inline-block mr-2 mb-1" />
                ¡ANUNCIE AQUÍ!
              </a>
              <p className="mt-6 text-gray-500 font-bold uppercase text-xs tracking-widest">Contacto Directo: {PHONE_NUMBER}</p>
            </motion.div>
          </div>
        </div>

        {/* TARJETAS DE CONTACTO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <ContactCard icon={<Phone />} label="WhatsApp" value={PHONE_NUMBER} url={`https://wa.me/${PHONE_NUMBER.replace(/\s+/g, '')}`} />
          <ContactCard icon={<Mail />} label="Email" value="fabulosaplay@gmail.com" url="mailto:fabulosaplay@gmail.com" />
          <ContactCard icon={<Globe />} label="Web" value="fabulosaplay.online" url="https://fabulosaplay.online" />
        </div>

        {/* LOS 3 LOGOS ABAJO */}
        <footer className="pt-16 border-t border-white/10 text-center">
          <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.5em] mb-12">Nuestras Marcas Principales</p>
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-60">
            <img src={MainLogo} alt="Fabulosa Play" className="h-10 sm:h-12 hover:opacity-100 transition-opacity" />
            <img src={PscLogo} alt="PSC Informa" className="h-10 sm:h-12 hover:opacity-100 transition-opacity" />
            <img src={RadioLogo} alt="Fabulosa Radio" className="h-10 sm:h-12 hover:opacity-100 transition-opacity" />
          </div>
          <p className="mt-16 text-gray-700 text-[10px] font-bold">© 2026 FABULOSA PLAY ENTERTAINMENT GROUP | COSTA RICA</p>
        </footer>

      </div>
    </div>
  );
};

const ContactCard = ({ icon, label, value, url }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all group">
    <div className="mb-4 text-yellow-500 group-hover:scale-110 transition-transform">{icon}</div>
    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</span>
    <span className="text-lg font-bold">{value}</span>
  </a>
);

export default CentroMercadeo;