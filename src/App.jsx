import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// 1. IMPORTACIÓN DE PÁGINAS (Verificadas según sus archivos)[cite: 8, 9, 10]
import Home from './pages/Home';
import PremiumHub from './pages/PremiumHub';
import RadioPremium from './pages/RadioPremium'; 
import Radio from './pages/Radio'; // El archivo que filtra Costa Rica
import Movies from './pages/Movies';
import Channels from './pages/Channels';
import FabulosaTube from './pages/FabulosaTube';
import RancheraPlay from './pages/RancheraPlay';
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
        {/* PANTALLA PRINCIPAL (12 CARDS) */}
        <Route path="/" element={<Home />} />

        {/* CARD 1: MUNDO VIP Y SUS SEÑALES[cite: 8, 10] */}
        <Route path="/premium" element={<PremiumHub />} />
        {/* Estas rutas ahora sí abrirán el reproductor VIP */}
        <Route path="/premium/voice-over" element={<RadioPremium />} />
        <Route path="/premium/fabulosa-radio" element={<RadioPremium />} />

        {/* CARD 6: RADIOS DE COSTA RICA (Corregida)[cite: 8, 9] */}
        <Route path="/radios-cr" element={<Radio />} />

        {/* RESTO DE LAS CARDS[cite: 8] */}
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