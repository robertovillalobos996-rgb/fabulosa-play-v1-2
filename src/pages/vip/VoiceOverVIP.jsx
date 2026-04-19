import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Radio, Tv, Instagram, Globe, Mail, Download, Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';

const VoiceOverVIP = () => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [isPlayingRadio, setIsPlayingRadio] = useState(false);
  const TV_URL = "https://tvservices.fullhd-streaming.com:3941/multi_web/play_720.m3u8";
  const RADIO_URL = "https://rtv.fullhd-streaming.com:2020/stream/voiceoverradio";

  useEffect(() => {
    const loadVideo = () => {
      if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls();
        hls.loadSource(TV_URL);
        hls.attachMedia(videoRef.current);
        hls.on(window.Hls.Events.MANIFEST_PARSED, () => videoRef.current.play().catch(e => {}));
      } else if (videoRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = TV_URL;
      }
    };
    if (!window.Hls) {
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
      script.onload = loadVideo;
      document.body.appendChild(script);
    } else { loadVideo(); }
  }, []);

  const toggleRadio = () => {
    if (isPlayingRadio) { audioRef.current.pause(); } 
    else { audioRef.current.play(); if(videoRef.current) videoRef.current.muted = true; }
    setIsPlayingRadio(!isPlayingRadio);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans relative">
      
      {/* 🎬 FONDO DE VIDEO YOUTUBE INFINITO */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <iframe 
          className="w-[300%] h-[300%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          src="https://www.youtube.com/embed/sC6m9xDMfso?autoplay=1&mute=1&loop=1&playlist=sC6m9xDMfso&controls=0&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0"
          frameBorder="0"
          allow="autoplay; encrypted-media"
        />
        {/* Capa de oscuridad leve para que resalte el reproductor */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <nav className="relative p-6 flex items-center justify-between border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <Link to="/premium" className="p-3 bg-white/5 rounded-full hover:bg-yellow-500 hover:text-black transition-all"><ArrowLeft size={24} /></Link>
        <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full font-black uppercase text-xs transition-colors"><Megaphone size={16} /> Sonar Sello ID</button>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-zinc-900/80 p-10 rounded-[3rem] border border-white/10 shadow-2xl flex justify-center items-center backdrop-blur-md"><img src="/voice_over.png" alt="Voice Over" className="w-full max-w-[250px] object-contain" /></div>
          <div className="bg-gradient-to-br from-zinc-900/90 to-black/90 p-8 rounded-[2rem] border border-white/10 backdrop-blur-md shadow-2xl">
            <div className="flex items-center gap-4 mb-6"><Radio className="text-yellow-500" size={30} /><h2 className="text-xl font-black uppercase tracking-widest">Radio en Vivo</h2></div>
            <audio ref={audioRef} src={RADIO_URL} /><button onClick={toggleRadio} className="w-full py-4 rounded-full font-black uppercase bg-yellow-500 text-black shadow-lg">{isPlayingRadio ? "Pausar Radio" : "Escuchar Ahora"}</button>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="flex-1 bg-white/5 p-3 rounded-xl flex items-center justify-center hover:bg-pink-600 transition-colors"><Instagram size={20} /></button>
            <button className="flex-1 bg-white/5 p-3 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors"><Globe size={20} /></button>
            <button className="flex-1 bg-white/5 p-3 rounded-xl flex items-center justify-center hover:bg-green-600 transition-colors"><Mail size={20} /></button>
            <button className="flex-1 bg-white/5 p-3 rounded-xl flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-colors"><Download size={20} /></button>
          </div>
        </div>
        <div className="lg:col-span-8 flex flex-col">
          <div className="flex items-center gap-3 mb-6"><Tv className="text-blue-500" size={28} /><h2 className="text-2xl font-black uppercase tracking-widest">Señal de TV</h2></div>
          <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden border border-white/10 bg-black/80 shadow-2xl backdrop-blur-sm"><video ref={videoRef} controls autoPlay muted className="w-full h-full object-cover" /></div>
          <div className="mt-8 grid grid-cols-2 gap-4">
             <div className="bg-zinc-900/80 aspect-video rounded-2xl border border-white/10 flex items-center justify-center text-gray-500 font-bold uppercase text-[10px] backdrop-blur-md">Espacio Cámara 1</div>
             <div className="bg-zinc-900/80 aspect-video rounded-2xl border border-white/10 flex items-center justify-center text-gray-500 font-bold uppercase text-[10px] backdrop-blur-md">Galería Fotos</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VoiceOverVIP;