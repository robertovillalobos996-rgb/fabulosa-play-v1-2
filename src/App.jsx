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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SecurityLock />
      <Router>
        <Routes>
          {/* RUTA PRINCIPAL (Menú de Cards) */}
          <Route path="/" element={<Home />} />
          
          {/* RUTAS ESPECÍFICAS REPARADAS (Adiós pantallas negras) */}
          <Route path="/cine-play" element={<CinePlay />} />
          <Route path="/canales-play" element={<CanalesPlay />} />
          <Route path="/alabanza" element={<FabulosaAlabanza />} />
          <Route path="/centro-mercadeo" element={<CentroMercadeo />} />

          {/* RUTAS AUTOMÁTICAS (Carga cualquier otra página configurada) */}
          {Object.entries(pagesConfig?.Pages || {}).map(([path, Page]) => (
            <Route key={path} path={`/${path}`} element={<Page />} />
          ))}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;