import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { pagesConfig } from './pages.config';

// Componentes globales
import SecurityLock from './components/SecurityLock';

// Páginas principales
import Home from './pages/Home';
import CinePlay from './pages/Movies'; 
import CanalesPlay from './pages/Channels'; 
import FabulosaAlabanza from './pages/FabulosaAlabanza';
import CentroMercadeo from './pages/CentroMercadeo';

// 🌈 IMPORTANTE: Cargamos el mundo de Fabulosito Kids
import FabulositoKids from './components/FabulosaTV';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SecurityLock />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* RUTA MÁGICA PARA NIÑOS */}
          <Route path="/tv-1" element={<FabulositoKids />} />

          <Route path="/cine-play" element={<CinePlay />} />
          <Route path="/canales-play" element={<CanalesPlay />} />
          <Route path="/alabanza" element={<FabulosaAlabanza />} />
          <Route path="/centro-mercadeo" element={<CentroMercadeo />} />

          {/* CARGA AUTOMÁTICA DE OTRAS PÁGINAS */}
          {Object.entries(pagesConfig?.Pages || {}).map(([path, config]) => {
            const Component = require(`./pages/${config.component}`).default;
            return <Route key={path} path={path} element={<Component />} />;
          })}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;