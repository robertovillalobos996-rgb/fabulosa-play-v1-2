import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { pagesConfig } from './pages.config';

// Componentes globales
import SecurityLock from './components/SecurityLock';

// PÃ¡ginas principales
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
          {/* RUTA PRINCIPAL (MenÃº de Cards) */}
          <Route path="/" element={<Home />} />
          
          {/* RUTAS ESPECÃFICAS REPARADAS (AdiÃ³s pantallas negras) */}
          <Route path="/cine-play" element={<CinePlay />} />
          <Route path="/canales-play" element={<CanalesPlay />} />
          <Route path="/alabanza" element={<FabulosaAlabanza />} />
          <Route path="/centro-mercadeo" element={<CentroMercadeo />} />

          {/* RUTAS AUTOMÃTICAS (Carga cualquier otra pÃ¡gina configurada) */}
          {Object.entries(pagesConfig?.Pages || {}).map(([path, Page]) => (
            <Route key={path} path={`/${path}`} element={<Page />} />
          ))}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;