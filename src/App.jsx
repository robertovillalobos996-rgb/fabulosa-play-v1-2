
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Páginas - Nombres corregidos según sus archivos
import Home from './pages/Home';
import RadioRomantica from './pages/RadioPremium'; // Esta es la de Radios
import RancheraPlay from './pages/RancheraPlay'; 
import Karaoke from './pages/Karaoke';
import CinePlay from './pages/Movies'; 
import CanalesPlay from './pages/Channels'; 
import FabulosaAlabanza from './pages/FabulosaAlabanza';
import CentroMercadeo from './pages/CentroMercadeo';
import Camaras from './pages/Camaras'; 
import FabulosaVerano from './pages/FabulosaVerano';
import FabulositoKids from './pages/FabulosaTV';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tv-1" element={<FabulositoKids />} />
          
          {/* Aquí acomodamos las radios para que no se clonen */}
          <Route path="/radio" element={<RadioRomantica />} /> 
          <Route path="/radios-cr" element={<RadioRomantica />} /> 
          
          <Route path="/ranchera" element={<RancheraPlay />} />
          <Route path="/karaoke" element={<Karaoke />} />
          <Route path="/cine-play" element={<CinePlay />} />
          <Route path="/canales-play" element={<CanalesPlay />} />
          <Route path="/alabanza" element={<FabulosaAlabanza />} />
          <Route path="/centro-mercadeo" element={<CentroMercadeo />} />
          <Route path="/camaras" element={<Camaras />} />
          <Route path="/fabulosa-verano" element={<FabulosaVerano />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;