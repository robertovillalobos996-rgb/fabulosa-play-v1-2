import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 🏠 PÁGINAS PRINCIPALES (Corregido a la carpeta 'page')
import Home from './page/Home';
import RadioRomantica from './page/Radio'; 
import RadiosMundo from './page/RadioPremium'; 
import RancheraPlay from './page/RancheraPlay'; 
import Karaoke from './page/Karaoke';
import CinePlay from './page/Movies'; 
import CanalesPlay from './page/Channels'; 
import FabulosaAlabanza from './page/FabulosaAlabanza';
import CentroMercadeo from './page/CentroMercadeo';
import Camaras from './page/Camaras'; 
import FabulosaTube from './page/FabulosaTube'; // 🔥 EL NUEVO GIGANTE DE VIDEOS
import FabulositoKids from './page/FabulosaTV';

// 💎 MUNDO PREMIUM VIP (Corregido a la carpeta 'page')
import PremiumHub from './page/PremiumHub';
import VoiceOverVIP from './page/vip/VoiceOverVIP';
import FabulosaRadioVIP from './page/vip/FabulosaRadioVIP';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* MENÚ PRINCIPAL */}
          <Route path="/" element={<Home />} />
          <Route path="/radio" element={<RadioRomantica />} />
          <Route path="/radio-premium" element={<RadiosMundo />} />
          <Route path="/ranchera" element={<RancheraPlay />} />
          <Route path="/karaoke" element={<Karaoke />} />
          <Route path="/movies" element={<CinePlay />} />
          <Route path="/canales-play" element={<CanalesPlay />} />
          <Route path="/alabanza" element={<FabulosaAlabanza />} />
          <Route path="/mercadeo" element={<CentroMercadeo />} />
          <Route path="/camaras" element={<Camaras />} />
          <Route path="/tube" element={<FabulosaTube />} />
          <Route path="/tv" element={<FabulositoKids />} />
          
          {/* 💎 SECCIÓN VIP PREMIUM */}
          <Route path="/premium" element={<PremiumHub />} />
          <Route path="/premium/voice-over" element={<VoiceOverVIP />} />
          <Route path="/premium/fabulosa-radio" element={<FabulosaRadioVIP />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;