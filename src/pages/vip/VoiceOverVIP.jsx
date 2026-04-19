import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Radio, Tv, Globe, Megaphone } from 'lucide-react';

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
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <iframe className="w-[300%] h-[300%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" src="https://www.youtube.com/embed/sC6m9xDMfso?autoplay=1&mute=1&loop=1&playlist=sC6m9xDMfso&controls=0&modestbranding=1&rel=0" frameBorder="0" allow="autoplay; encrypted-media" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <nav className="relative z-50 p-6 flex items-center justify-between border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0">
        <Link to="/premium" className="p-3 bg-white/5 rounded-full hover:bg-yellow-500 hover:text-black transition-all"><ArrowLeft size={24} /></Link>
        <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full font-black uppercase text-xs"><Megaphone size={16} /> Sonar Sello ID</button>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* LOGO GIGANTE (.jpeg) */}
          <div className="bg-zinc-900/80 p-8 rounded-[3rem] border border-white/10 shadow-2xl flex justify-center items-center backdrop-blur-md">
            <img src="/voice_over.jpeg" alt="Voice Over" className="w-full max-w-[350px] object-contain rounded-2xl drop-shadow-2xl" />
          </div>

          <div className="bg-gradient-to-br from-zinc-900/90 to-black/90 p-8 rounded-[2rem] border border-white/10 backdrop-blur-md shadow-2xl">
            <div className="flex items-center gap-4 mb-6"><Radio className="text-yellow-500" size={30} /><h2 className="text-xl font-black uppercase tracking-widest">Radio en Vivo</h2></div>
            <audio ref={audioRef} src={RADIO_URL} /><button onClick={toggleRadio} className="w-full py-4 rounded-full font-black uppercase bg-yellow-500 text-black shadow-lg hover:scale-105 transition-transform">{isPlayingRadio ? "Pausar Radio" : "Escuchar Ahora"}</button>
          </div>

          {/* ICONOS ANIMADOS ORIGINALES */}
          <div className="flex gap-4 justify-center">
            {/* WhatsApp */}
            <button className="flex-1 bg-zinc-900/80 p-4 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors shadow-lg border border-white/5">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="#25D366" className="animate-bounce">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </button>
            {/* Gmail */}
            <button className="flex-1 bg-zinc-900/80 p-4 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors shadow-lg border border-white/5">
              <svg viewBox="0 0 24 24" width="32" height="32" className="animate-bounce" style={{animationDelay: "100ms"}}>
                <path fill="#EA4335" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 8.414l8.073-4.921c1.618-1.214 3.927-.059 3.927 1.964Z"/><path fill="#34A853" d="M18.545 21h3.819C23.268 21 24 20.268 24 19.366V11.73l-5.455 4.091v5.18Z"/><path fill="#FBBC05" d="M24 5.457v6.273L18.545 15.82v-5.18l5.455-4.091Z"/><path fill="#4285F4" d="M0 5.457v6.273L5.455 15.82v-5.18L0 11.73Z"/><path fill="#C5221F" d="M0 11.73v7.636C0 20.268.732 21 1.636 21h3.819v-5.18L0 15.82Z"/>
              </svg>
            </button>
            {/* Web */}
            <button className="flex-1 bg-zinc-900/80 p-4 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors shadow-lg border border-white/5">
              <Globe size={32} color="#4285F4" className="animate-bounce" style={{animationDelay: "200ms"}} />
            </button>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col">
          <div className="flex items-center gap-3 mb-6"><Tv className="text-blue-500" size={28} /><h2 className="text-2xl font-black uppercase tracking-widest">Señal de TV</h2></div>
          <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden border border-white/10 bg-black/80 shadow-2xl backdrop-blur-sm"><video ref={videoRef} controls autoPlay muted className="w-full h-full object-cover" /></div>
        </div>
      </div>
    </div>
  );
};
export default VoiceOverVIP;