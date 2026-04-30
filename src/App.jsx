import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'; 

// Importación de Páginas
import Home from './pages/Home';
import Radio from './pages/Radio';
import Movies from './pages/Movies';
import Channels from './pages/Channels'; 
import AdminPanel from './AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PANTALLA PRINCIPAL CON LAS 12 CARDS */}
        <Route path="/" element={<Home />} />

        {/* RUTAS CORREGIDAS PARA QUE COINCIDAN CON HOME.JSX */}
        <Route path="/radios-cr" element={<Radio />} />
        <Route path="/cine-play" element={<Movies />} />
        <Route path="/canales-play" element={<Channels />} />
        
        {/* PANEL DE ADMINISTRACIÓN */}
        <Route path="/admin" element={<AdminPanel />} />

        {/* NOTA: Para las tarjetas de Premium, Karaoke, etc., 
            asegúrese de tener sus archivos .jsx creados o 
            crearemos rutas para ellos más adelante. */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;