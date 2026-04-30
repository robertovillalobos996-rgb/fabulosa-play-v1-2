import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// 1. Importación de todas las páginas necesarias[cite: 3, 6, 7]
import Home from './pages/Home';
import PremiumHub from './pages/PremiumHub';
import RadioPremium from './pages/RadioPremium'; // Su radio VIP[cite: 5]
import FabulosaTube from './pages/FabulosaTube';
import RancheraPlay from './pages/RancheraPlay';
import Radio from './pages/Radio'; // Radios de Costa Rica
import Movies from './pages/Movies';
import Channels from './pages/Channels';
import Karaoke from './pages/Karaoke';
import FabulosaAlabanza from './pages/FabulosaAlabanza';
import Camaras from './pages/Camaras';
import CentroMercadeo from './pages/CentroMercadeo';
import FabulosaTV from './pages/FabulosaTV'; 
import AdminPanel from './AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PANTALLA DE INICIO (Las 12 Cards)[cite: 3] */}
        <Route path="/" element={<Home />} />

        {/* MUNDO VIP / PREMIUM HUB */}
        <Route path="/premium" element={<PremiumHub />} />
        {/* Estas son las rutas que le daban error de "No matched location" */}
        <Route path="/premium/voice-over" element={<RadioPremium />} />
        <Route path="/premium/fabulosa-radio" element={<RadioPremium />} />

        {/* RADIOS COSTA RICA (Posición 6)[cite: 3, 7] */}
        <Route path="/radios-cr" element={<Radio />} />

        {/* RESTO DE LAS 12 CARDS[cite: 3] */}
        <Route path="/premium-hub" element={<PremiumHub />} />
        <Route path="/fabulosa-tube" element={<FabulosaTube />} />
        <Route path="/tv-1" element={<FabulosaTV />} />
        <Route path="/ranchera" element={<RancheraPlay />} />
        <Route path="/cine-play" element={<Movies />} />
        <Route path="/canales-play" element={<Channels />} />
        <Route path="/karaoke" element={<Karaoke />} />
        <Route path="/alabanza" element={<FabulosaAlabanza />} />
        <Route path="/camaras" element={<Camaras />} />
        <Route path="/centro-mercadeo" element={<CentroMercadeo />} />
        
        {/* PANEL DE ADMINISTRACIÓN */}
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;