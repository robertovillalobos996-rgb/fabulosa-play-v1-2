import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { pagesConfig } from './pages.config';

import SecurityLock from './components/SecurityLock';
import Home from './pages/Home';
import CinePlay from './pages/Movies'; // Asegúrate de que el archivo se llame Movies o CinePlay
import CanalesPlay from './pages/Channels'; // Asegúrate de que el archivo se llame Channels o CanalesPlay
import FabulosaAlabanza from './pages/FabulosaAlabanza';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SecurityLock />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* RUTAS CORREGIDAS PARA QUE COINCIDAN CON LAS CARDS */}
          <Route path="/cine-play" element={<CinePlay />} />
          <Route path="/canales-play" element={<CanalesPlay />} />
          <Route path="/alabanza" element={<FabulosaAlabanza />} />

          {/* Mantenimiento de las demás rutas automáticas */}
          {Object.entries(pagesConfig.Pages).map(([path, Page]) => (
            <Route key={path} path={`/${path}`} element={<Page />} />
          ))}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;