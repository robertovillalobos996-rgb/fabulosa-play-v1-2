import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 🏠 PÁGINAS PRINCIPALES
import Home from './pages/Home';
import RadiosPlay from './pages/RadiosPlay'; 
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
import Noticias from './pages/Noticias'; // ✅ CORREGIDO: Importa el archivo real "Noticias"

// 💎 MUNDO PREMIUM VIP 
import PremiumHub from './pages/PremiumHub'; 
import VoiceOverVIP from './pages/vip/VoiceOverVIP';
import FabulosaRadioVIP from './pages/vip/FabulosaRadioVIP';
import FabulosaMixVIP from './pages/vip/FabulosaMixVIP'; 

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* 📺 RUTAS DEL MENÚ INICIO */}
          <Route path="/" element={<Home />} />
          <Route path="/radios-cr" element={<RadiosPlay />} />
          <Route path="/ranchera" element={<RancheraPlay />} />
          <Route path="/karaoke" element={<Karaoke />} />
          <Route path="/cine-play" element={<CinePlay />} />
          <Route path="/canales-play" element={<CanalesPlay />} />
          <Route path="/alabanza" element={<FabulosaAlabanza />} />
          <Route path="/centro-mercadeo" element={<CentroMercadeo />} />
          <Route path="/camaras" element={<Camaras />} />
          <Route path="/fabulosa-tube" element={<FabulosaTube />} />
          <Route path="/tv" element={<FabulositoKids />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/noticias" element={<Noticias />} /> {/* ✅ Ruta activada apuntando a Noticias */}
          
          {/* 💎 RUTAS SECCIÓN VIP PREMIUM */}
          <Route path="/premium" element={<PremiumHub />} /> 
          <Route path="/premium/voice-over" element={<VoiceOverVIP />} />
          <Route path="/premium/fabulosa-radio" element={<FabulosaRadioVIP />} />
          <Route path="/premium/fabulosa-mix" element={<FabulosaMixVIP />} /> 
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;