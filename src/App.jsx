import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { pagesConfig } from './pages.config';

import SecurityLock from './components/SecurityLock';
import CentroMercadeo from './pages/CentroMercadeo';
import RancheraPlay from './pages/RancheraPlay'; 
import ReporteMensual from './pages/ReporteMensual';

const queryClient = new QueryClient();

const { Pages, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = Pages[mainPageKey];

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SecurityLock />
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/centro-mercadeo" element={<CentroMercadeo />} />
          <Route path="/cantina" element={<RancheraPlay />} />
          <Route path="/reporte" element={<ReporteMensual />} />

          {Object.entries(Pages).map(([path, Page]) => (
            <Route key={path} path={`/${path}`} element={<Page />} />
          ))}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;