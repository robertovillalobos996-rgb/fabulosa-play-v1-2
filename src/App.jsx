import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Páginas - Importaciones exactas
import Home from './pages/Home';
import RadioRomantica from './pages/Radio'; // La específica que me mandaste
import RadiosMundo from './pages/RadioPremium'; // La lista global de radios
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
          {/* MENÚ PRINCIPAL */}
          <Route path="/" element={<Home />} />
          
          {/* EL MUNDO DE LOS NIÑOS */}
          <Route path="/tv-1" element={<FabulositoKids />} />
          
          {/* RADIOS (YA NO SON CLONES) */}
          <Route path="/radio" element={<RadioRomantica />} /> 
          <Route path="/radios-cr" element={<RadiosMundo />} /> 
          
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