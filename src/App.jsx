import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { pagesConfig } from './pages.config';

// 👇 IMPORTAMOS EL COMPONENTE DE SEGURIDAD (EL CANDADO)
import SecurityLock from './components/SecurityLock';

const queryClient = new QueryClient();

const { Pages, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = Pages[mainPageKey];

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* 🔐 ACTIVAMOS EL BLINDAJE PARA TODA LA APP */}
      <SecurityLock />
      
      <Router>
        <Routes>
          {/* RUTA PRINCIPAL (HOME) */}
          <Route path="/" element={<MainPage />} />
          
          {/* GENERACIÓN AUTOMÁTICA DE RUTAS (MERCADEO, CONTROL, ETC) */}
          {Object.entries(Pages).map(([path, Page]) => (
            <Route key={path} path={`/${path}`} element={<Page />} />
          ))}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;