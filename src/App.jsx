import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// 1. IMPORTACIÓN DE TODAS SUS PÁGINAS (Nombres exactos de sus archivos)[cite: 5]
import Home from './pages/Home';
import PremiumHub from './pages/PremiumHub';
import FabulosaTube from './pages/FabulosaTube';
import RancheraPlay from './pages/RancheraPlay';
import Radio from './pages/Radio'; // Este es el de Costa Rica
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
        {/* PANTALLA DE INICIO (Las 12 Cards) */}
        <Route path="/" element={<Home />} />

        {/* 2. CONEXIÓN DE LAS 12 CARDS (Rutas exactas de Home.jsx)[cite: 3] */}
        <Route path="/premium" element={<PremiumHub />} />
        <Route path="/fabulosa-tube" element={<FabulosaTube />} />
        <Route path="/tv-1" element={<FabulosaTV />} />
        <Route path="/ranchera" element={<RancheraPlay />} />
        
        {/* POSICIÓN 6: RADIOS DE TODO COSTA RICA */}
        <Route path="/radios-cr" element={<Radio />} />

        <Route path="/cine-play" element={<Movies />} />
        <Route path="/canales-play" element={<Channels />} />
        <Route path="/karaoke" element={<Karaoke />} />
        <Route path="/alabanza" element={<FabulosaAlabanza />} />
        <Route path="/camaras" element={<Camaras />} />
        <Route path="/centro-mercadeo" element={<CentroMercadeo />} />
        
        {/* RUTA DEL ADMINISTRADOR */}
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;