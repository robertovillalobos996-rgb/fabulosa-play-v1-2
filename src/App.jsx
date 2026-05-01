import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 🏠 PÁGINAS PRINCIPALES
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
import FabulosaTube from './pages/FabulosaTube'; // 🔥 EL NUEVO GIGANTE DE VIDEOS
import FabulositoKids from './pages/FabulosaTV';

// 💎 MUNDO PREMIUM VIP
import PremiumHub from './pages/PremiumHub';
import VoiceOverVIP from './pages/vip/VoiceOverVIP';
import FabulosaRadioVIP from './pages/vip/FabulosaRadioVIP';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* MENÚ PRINCIPAL */}
          <Route path="/" element={<Home />} />
          
          {/* 💎 SECCIÓN VIP PREMIUM */}
          <Route path="/premium" element={<PremiumHub />} />
          <Route path="/premium/voice-over" element={<VoiceOverVIP />} />