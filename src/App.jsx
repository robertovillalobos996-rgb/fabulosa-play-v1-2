import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Home from './pages/Home';
import RadioRomantica from './pages/Radio'; 
import RadiosMundo from './pages/RadioPremium'; 
import RancheraPlay from './pages/RancheraPlay'; 
import Karaoke from './pages/Karaoke';
import CinePlay from './pages/Movies'; 
import CanalesPlay from './pages/Channels'; 
import FabulosaAlabanza from './pages/FabulosaAlabanza';
import CentroMercadeo from './pages/CentroMercadeo';
import Camaras from './pages/Camaras'; 
import FabulosaVerano from './pages/FabulosaVerano';
import FabulositoKids from './pages/FabulosaTV';
import PremiumHub from './pages/PremiumHub';
import VoiceOverVIP from './pages/vip/VoiceOverVIP';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/premium" element={<PremiumHub />} />
          <Route path="/premium/voice-over" element={<VoiceOverVIP />} />
          <Route path="/tv-1" element={<FabulositoKids />} />
          <Route path="/radio" element={<RadioRomantica />} /> 
          <Route path="/radios-cr" element={<RadiosMundo />} /> 
          <Route path="/ranchera" element={<RancheraPlay />} />
          <Route path="/karaoke" element={<Karaoke />} />
          <Route path="/cine-play" element={<CinePlay />} />
          <Route path="/canales-play" element={<CanalesPlay />} />
          <Route path="/alabanza" element={<FabulosaAlabanza />} />
          <Route path="/centro-mercadeo" element={<CentroMercadeo />} />
          <Route path="/camaras" element={<Camaras />} />
          <Route path="/verano" element={<FabulosaVerano />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
export default App;