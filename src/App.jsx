import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 🏠 PÁGINAS PRINCIPALES
import Home from './pages/Home';
import RadiosPlay from './pages/Radio'; // Tu Archivo 1 (Radios de Costa Rica)
import RadiosMundo from './pages/RadioPremium'; 
import RancheraPlay from './pages/RancheraPlay'; 
import Karaoke from './pages/Karaoke';
import CinePlay from './pages/Movies'; 
import CanalesPlay from './pages/Channels'; 
import FabulosaAlabanza from './pages/FabulosaAlabanza';
import CentroMercadeo from './pages/CentroMercadeo';
import Camaras from './pages/Camaras'; 
import FabulosaTube from './pages/FabulosaTube'; 
import FabulositoKids from './pages/FabulosaTV';
import AdminPanel from './pages/Admin';

// 💎 MUNDO PREMIUM VIP (Conectado a tu Archivo 2)
import PremiumHub from './pages/PremiumHub'; // Tu Archivo 2
import VoiceOverVIP from './pages/vip/VoiceOverVIP';
import FabulosaRadioVIP from './pages/vip/FabulosaRadioVIP';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* MENÚ PRINCIPAL */}
          <Route path="/" element={<Home />} />
          <Route path="/radio" element={<RadiosPlay />} />
          <Route path="/radio-premium" element={<RadiosMundo />} />
          <Route path="/ranchera" element={<RancheraPlay />} />
          <Route path="/karaoke" element={<Karaoke />} />
          <Route path="/movies" element={<CinePlay />} />
          <Route path="/canales-play" element={<CanalesPlay />} />
          <Route path="/alabanza" element={<FabulosaAlabanza />} />
          <Route path="/mercadeo" element={<CentroMercadeo />} />
          <Route path="/camaras" element={<Camaras />} />
          <Route path="/tube" element={<FabulosaTube />} />
          <Route path="/tv" element={<FabulositKids />} />
          <Route path="/admin" element={<AdminPanel />} />
          
          {/* 💎 SECCIÓN VIP PREMIUM */}
          {/* La ruta /premium abre tu PremiumHub con los 2 clientes VIP */}
          <Route path="/premium" element={<PremiumHub />} /> 
          <Route path="/premium/voice-over" element={<VoiceOverVIP />} />
          <Route path="/premium/fabulosa-radio" element={<FabulosaRadioVIP />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;