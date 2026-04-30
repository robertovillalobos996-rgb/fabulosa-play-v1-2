import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'; 

// Importación de sus 4 módulos originales[cite: 3]
import Home from './pages/Home';
import Radio from './pages/Radio';
import Movies from './pages/Movies';
import Channels from './pages/Channels'; 

// Importación del nuevo cerebro de control
import AdminPanel from './AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Aquí es donde viven sus 12 CARDS principales (No se tocan)[cite: 3] */}
        <Route path="/" element={<Home />} />

        {/* Sus otros módulos activos[cite: 3] */}
        <Route path="/radio" element={<Radio />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/channels" element={<Channels />} />

        {/* ENLACE PRIVADO: Solo para usted administrar[cite: 4] */}
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;