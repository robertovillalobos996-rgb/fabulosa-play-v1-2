import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Mail, Globe, Zap } from 'lucide-react';

import imgFondoCentro from '../assets/centro-de-publicidad.png'; 
import logoFabulosaPlay from '../assets/logo-fabulosa-play.png';

const CentroMercadeo = () => {
  const audioRef = useRef(new Audio("http://s14.myradiostream.com:32364/;"));

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true; 
    audio.volume = 0.4;
    const playAudio = () => audio.play().catch(() => {});
    playAudio();
    window.addEventListener('click', playAudio, { once: true });
    return () => audio.pause();
  }, []);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden font-sans">
      <div className="absolute inset-0 w-full h-full bg-cover bg-center z-0" style={{ backgroundImage: `url(${imgFondoCentro})` }}></div>
      
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-50">
        <Link to="/" className="flex items-center gap-2 px-6 py-2 bg-black/50 hover:bg-red-600 rounded-full text-white font-bold border border-white/20 transition-all">
          <ArrowLeft size={18} /> SALIR
        </Link>
        <img src={logoFabulosaPlay} alt="Logo" className="h-20 drop-shadow-2xl" />
      </div>

      <div className="absolute top-0 right-0 w-full md:w-[45%] h-full bg-black/70 backdrop-blur-xl border-l border-white/10 p-12 flex flex-col justify-center z-40">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="text-red-500 animate-pulse" size={32} />
          <h2 className="text-4xl font-black text-white uppercase italic">Quiénes <span className="text-red-500">Somos</span></h2>
        </div>
        <p className="text-gray-100 text-sm font-semibold mb-6">Fabulosa Play es un ecosistema multimedia avanzado diseñado para la nueva era digital. Fusionamos entretenimiento de alta calidad con interacción en tiempo real.</p>
        
        <div className="space-y-5">
          <a href="https://wa.me/50664035313" target="_blank" className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
            <MessageCircle className="text-green-500" />
            <span className="font-bold">+506 6403 5313</span>
          </a>
          <a href="mailto:fabulosaplay@gmail.com" className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
            <Mail className="text-sky-500" />
            <span className="font-bold">fabulosaplay@gmail.com</span>
          </a>
          <a href="http://www.fabulosaplay.online" target="_blank" className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
            <Globe className="text-pink-500" />
            <span className="font-bold">www.fabulosaplay.online</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default CentroMercadeo;