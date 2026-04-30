import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// 1. IMPORTACIÓN DE TODAS SUS PÁGINAS (Verificadas en su carpeta pages)
import Home from './pages/Home';
import PremiumHub from './pages/PremiumHub';
import FabulosaTube from './pages/FabulosaTube';
import RancheraPlay from './pages/RancheraPlay';
import Radio from './pages/Radio';
import Movies from './pages/Movies';
import Channels from './pages/Channels';
import Karaoke from './pages/Karaoke';
import FabulosaAlabanza from './pages/FabulosaAlabanza';
import Camaras from './pages/Camaras';
import CentroMercadeo from './pages/CentroMercadeo';
import FabulosaTV from './pages/FabulosaTV'; // Usada para la ruta /tv-1
import AdminPanel from './AdminPanel'; // Su panel de control

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTA PRINCIPAL: DONDE ESTÁN LAS 12 CARDS */}
        <Route path="/" element={<Home />} />

        {/* 2. CONEXIÓN EXACTA CON LOS ENLACES DE HOME.JSX */}
        <Route path="/premium" element={<PremiumHub />} />
        <Route path="/fabulosa-tube" element={<FabulosaTube />} />
        <Route path="/tv-1" element={<FabulosaTV />} />
        <Route path="/ranchera" element={<RancheraPlay />} />
        <Route path="/radios-cr" element={<Radio />} />
        <Route path="/cine-play" element={<Movies />} />
        <Route path="/canales-play" element={<Channels />} />
        <Route path="/karaoke" element={<Karaoke />} />
        <Route path="/alabanza" element={<FabulosaAlabanza />} />
        <Route path="/camaras" element={<Camaras />} />
        <Route path="/centro-mercadeo" element={<CentroMercadeo />} />
        
        {/* RUTA PARA SU PANEL DE ADMINISTRACIÓN */}
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;