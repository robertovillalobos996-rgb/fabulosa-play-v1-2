import Home from './pages/Home';
import Radio from './pages/Radio'; 
import RadioPremium from './pages/RadioPremium'; 
import Movies from './pages/Movies';
import Channels from './pages/Channels'; 
import Karaoke from './pages/Karaoke';
import FabulosaAlabanza from './pages/FabulosaAlabanza';
import Camaras from './pages/Camaras';
import FabulosaTV from './pages/FabulosaTV';
import FabulosaVerano from './pages/FabulosaVerano'; 

// 👇 IMPORTACIÓN DE LAS NUEVAS SECCIONES PROFESIONALES
import CentroMercadeo from './pages/CentroMercadeo'; 
import ControlRemoto from './pages/ControlRemoto';

export const pagesConfig = {
  mainPage: 'home',
  Pages: {
    'home': Home,
    'radio': Radio,                // Fabulosa Romántica
    'radios-cr': RadioPremium,     // Radios de Costa Rica (Tuner)
    'movies': Movies,
    'channels': Channels,          // Canales de TV
    'karaoke': Karaoke,
    'alabanza': FabulosaAlabanza,
    'camaras': Camaras,
    'fabulosa-tv': FabulosaTV,
    'verano': FabulosaVerano, 
    
    // 👇 CONEXIÓN DE MERCADEO Y CONTROL REMOTO
    'mercadeo': CentroMercadeo,    // Centro de Mercadeo con fondo DJ y audio
    'control': ControlRemoto,      // Control Remoto Universal blindado
  }
};