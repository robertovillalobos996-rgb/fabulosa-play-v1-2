import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown } from 'lucide-react';

const PremiumHub = () => {
  const navigate = useNavigate();
  
  // ESTADOS DE NAVEGACIÓN PARA TV
  const [focusedSection, setFocusedSection] = useState("grid"); // "back", "grid"
  const [focusedIndex, setFocusedIndex] = useState(0);

  const vipClients = [
    { 
      id: 'voice-over', 
      name: 'Voice Over TV & Radio', 
      logo: '/voice_over.jpeg', 
      path: '/premium/voice-over' 
    },
    { 
      id: 'fabulosa-radio', 
      name: 'Fabulosa Radio VIP', 
      logo: '/logo-fabulosa.png', 
      path: '/premium/fabulosa-radio' 
    },
    { 
      id: 'fabulosa-mix', 
      name: 'Fabulosa Mix', 
      logo: '/logo-fabulosamix.png', 
      path: '/premium/fabulosa-mix' 
    }
  ];

  // MOTOR DE CONTROL REMOTO PARA MUNDO VIP
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (focusedSection === "grid") {
        if (e.key === "ArrowRight") setFocusedIndex(p => Math.min(p + 1, vipClients.length - 1));
        if (e.key === "ArrowLeft") setFocusedIndex(p => Math.max(p - 1, 0));
        if (e.key === "ArrowUp") setFocusedSection("back");
        if (e.key === "Enter") navigate(vipClients[focusedIndex].path);
      } 
      else if (focusedSection === "back") {
        if (e.key === "ArrowDown") setFocusedSection("grid");
        if (e.key === "Enter") navigate("/");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedSection, focusedIndex, navigate, vipClients]);

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden relative app-container-4k">
      <div className="bg-film-grain absolute inset-0 pointer-events-none" />
      
      {/* 🎬 FONDO YOUTUBE (FIJO) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <iframe 
          className="w-[300%] h-[300%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          src="https://www.youtube.com/embed/JQczw3V7St8?autoplay=1&mute=1&loop=1&playlist=JQczw3V7St8&controls=0&modestbranding=1&rel=0"
          frameBorder="0" allow="autoplay; encrypted-media"
        />
      </div>

      <div className="relative z-[100] p-6 flex items-center justify-between border-b border-white/10 bg-black/60 backdrop-blur-xl sticky top-0">
        {/* BOTÓN VOLVER CON GIRO PROFESIONAL */}
        <button 
          onClick={() => navigate("/")} 
          className={`p-4 bg-zinc-900 rounded-full transition-all duration-700 group outline-none ${focusedSection === "back" ? 'ring-4 ring-yellow-500 scale-110 bg-yellow-500 text-black shadow-[0_0_30px_rgba(234,179,8,0.4)]' : 'text-white'}`}
        >
          <ArrowLeft className="group-hover:rotate-[-360deg] transition-transform duration-700" size={28} />
        </button>
        
        <div className="flex items-center gap-4">
          <Crown className="text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" size={36} />
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-[0.2em] text-yellow-500 drop-shadow-2xl text-hdr-4k">Mundo VIP</h1>
        </div>
      </div>

      <div className="relative z-10 p-8 md:p-16">
        <h2 className="text-white font-black uppercase tracking-[0.3em] mb-12 drop-shadow-md bg-black/60 inline-block px-8 py-3 rounded-2xl backdrop-blur-md border border-white/10">
          Seleccione su Señal
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {vipClients.map((client, idx) => {
            const isFocused = focusedSection === "grid" && focusedIndex === idx;
            return (
              <div 
                key={client.id} 
                onClick={() => navigate(client.path)}
                className="group cursor-pointer outline-none"
              >
                <div 
                  className={`aspect-video bg-black/80 rounded-[2.5rem] border-4 transition-all duration-500 flex items-center justify-center p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative overflow-hidden backdrop-blur-xl ${isFocused ? 'border-yellow-500 scale-110 ring-4 ring-yellow-500/20 shadow-[0_0_60px_rgba(234,179,8,0.3)]' : 'border-white/10'}`}
                >
                  <img src={client.logo} alt={client.name} className="w-full h-full object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]" />
                  {isFocused && <div className="absolute inset-0 bg-yellow-500/5 animate-pulse" />}
                </div>
                <h3 className={`text-center mt-8 font-black uppercase text-xl tracking-widest transition-all duration-300 py-3 rounded-full backdrop-blur-md w-max mx-auto px-10 border ${isFocused ? 'bg-yellow-500 text-black border-yellow-500 shadow-xl' : 'bg-black/60 text-white border-white/5'}`}>
                  {client.name}
                </h3>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        body { background-color: black; margin: 0; overflow-x: hidden; }
      `}</style>
    </div>
  );
};

export default PremiumHub;