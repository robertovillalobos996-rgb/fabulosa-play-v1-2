import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Todos los componentes importados desde la carpeta 'page'
import Home from './page/Home';
import PremiumHub from './page/PremiumHub';
import FabulosaTube from './page/FabulosaTube';
import RancheraPlay from './page/RancheraPlay';
import Radio from './page/Radio';
import Movies from './page/Movies';
import Channels from './page/Channels';
import Karaoke from './page/Karaoke';
import FabulosaAlabanza from './page/FabulosaAlabanza';
import Camaras from './page/Camaras';
import CentroMercadeo from './page/CentroMercadeo';
import FabulosaTV from './page/FabulosaTV';
import AdminPanel from './page/AdminPanel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/premium" element={<PremiumHub />} />
        <Route path="/tube" element={<FabulosaTube />} />
        <Route path="/ranchera" element={<RancheraPlay />} />
        <Route path="/radio" element={<Radio />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/canales-play" element={<Channels />} />
        <Route path="/karaoke" element={<Karaoke />} />
        <Route path="/alabanza" element={<FabulosaAlabanza />} />
        <Route path="/camaras" element={<Camaras />} />
        <Route path="/mercadeo" element={<CentroMercadeo />} />
        <Route path="/tv" element={<FabulosaTV />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;