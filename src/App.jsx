import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Importamos todas las páginas con nombres claros
import Home from './pages/Home';
import Radio from './pages/Radio'; // Romántica
import RadiosCR from './pages/RadiosCR'; // Radios de Costa Rica
import RancheraPlay from './pages/RancheraPlay'; // LA QUE FALTABA
import Karaoke from './pages/Karaoke'; // CORREGIDA
import CinePlay from './pages/Movies'; 
import CanalesPlay from './pages/Channels'; 
import FabulosaAlabanza from './pages/FabulosaAlabanza';
import CentroMercadeo from './pages/CentroMercadeo';
import Camaras from './pages/Camaras'; // REPARADA
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
          <Route path="/radio" element={<Radio />} />
          <Route path="/radios-cr" element={<RadiosCR />} />
          <Route path="/ranchera" element={<RancheraPlay />} />
          <Route path="/karaoke" element={<Karaoke />} />
          <Route path="/cine-play" element={<CinePlay />} />
          <Route path="/canales-play" element={<CanalesPlay />} />
          <Route path="/alabanza" element={<FabulosaAlabanza />} />
          <Route path="/centro-mercadeo" element={<CentroMercadeo />} />
          <Route path="/camaras" element={<Camaras />} />
          <Route path="/fabulosa-verano" element={<FabulosaVerano />} />
          
          {/* Respaldos por si el usuario escribe rutas viejas */}
          <Route path="/tv-fabulosa" element={<CanalesPlay />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;