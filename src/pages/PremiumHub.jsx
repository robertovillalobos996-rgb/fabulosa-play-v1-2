import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

const PremiumHub = () => {
  // 💎 LISTA DE CLIENTES VIP
  const vipClients = [
    { 
      id: 'voice-over', 
      name: 'Voice Over TV & Radio', 
      logo: '/voice_over.png', 
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
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      <div className="p-6 flex items-center justify-between border-b border-yellow-600/30 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="p-3 bg-zinc-900 rounded-full hover:bg-yellow-500 hover:text-black transition-all">
          <ArrowLeft size={24} />
        </Link>
        <div className="flex items-center gap-3">
          <Crown className="text-yellow-500" size={32} />
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-yellow-500">Fabulosa VIP</h1>
        </div>
      </div>

      <div className="p-8 md:p-16">
        <h2 className="text-gray-400 font-bold uppercase tracking-widest mb-8">Nuestros Clientes Premium</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {vipClients.map((client) => (
            <Link key={client.id} to={client.path}>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                className="aspect-video bg-zinc-900 rounded-2xl border border-white/10 hover:border-yellow-500 flex items-center justify-center p-6 shadow-xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <img src={client.logo} alt={client.name} className="w-full h-full object-contain relative z-10" />
              </motion.div>
              <h3 className="text-center mt-4 font-black uppercase text-sm text-gray-300">{client.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PremiumHub;