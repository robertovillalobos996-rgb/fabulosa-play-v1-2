import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

const PremiumHub = () => {
  // 💎 LISTA DE CLIENTES VIP (Actualizado a .jpeg para Voice Over)
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
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden relative">
      
      {/* 🎬 FONDO YOUTUBE NUEVO (Sin Filtros, Pantalla Completa) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <iframe 
          className="w-[300%] h-[300%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          src="https://www.youtube.com/embed/JQczw3V7St8?autoplay=1&mute=1&loop=1&playlist=JQczw3V7St8&controls=0&modestbranding=1&rel=0"
          frameBorder="0" allow="autoplay; encrypted-media"
        />
        {/* Sin filtro oscuro, para que se vea el video en todo su esplendor */}
      </div>

      <div className="relative z-50 p-6 flex items-center justify-between border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0">
        <Link to="/" className="p-3 bg-zinc-900 rounded-full hover:bg-yellow-500 hover:text-black transition-all">
          <ArrowLeft size={24} />
        </Link>
        <div className="flex items-center gap-3">
          <Crown className="text-yellow-500" size={32} />
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-yellow-500 drop-shadow-lg">Mundo VIP</h1>
        </div>
      </div>

      <div className="relative z-10 p-8 md:p-16">
        <h2 className="text-white font-black uppercase tracking-widest mb-8 drop-shadow-md bg-black/40 inline-block px-4 py-2 rounded-xl backdrop-blur-sm">Seleccione su Señal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {vipClients.map((client) => (
            <Link key={client.id} to={client.path} className="group">
              {/* Tarjetas Gigantes sin padding para que el logo cubra todo */}
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                className="aspect-video bg-black/80 rounded-[2rem] border-4 border-white/10 group-hover:border-yellow-500 flex items-center justify-center p-4 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden backdrop-blur-md"
              >
                <img src={client.logo} alt={client.name} className="w-full h-full object-contain relative z-10 drop-shadow-2xl" />
              </motion.div>
              <h3 className="text-center mt-6 font-black uppercase text-lg text-white drop-shadow-lg bg-black/50 py-2 rounded-full backdrop-blur-sm w-max mx-auto px-6">{client.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PremiumHub;