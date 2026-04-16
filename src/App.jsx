import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Home from './pages/Home';
import FabulositoKids from './pages/FabulosaTV'; // El archivo que acabamos de crear arriba

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tv-1" element={<FabulositoKids />} />
          {/* ... el resto de sus rutas ... */}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;