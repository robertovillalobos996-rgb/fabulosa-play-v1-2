import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Gift, Loader2 
} from 'lucide-react';
import logoAlabanza from '../assets/fabulosa-alabanza-logo.jpeg';

const STREAM_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8";

const FabulosaAlabanza = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const playerRef = useRef(null);
  const [donacionModal, setDonacionModal] = useState(false);

  useEffect(() => {
    if (window.YT) {
      playerRef.current = new window.YT.Player('alabanza-player', {
        videoId: 'WujOmsOSY6w',
        playerVars: { 
          autoplay: 1, 
          controls: 0, 
          modestbranding: 1, 
          rel: 0,
          origin: window.location.origin // FIX: Resuelve el error de DOMWindow postMessage
        },
        events: {
          'onReady': () => setIsPlaying(true)
        }
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      <header className="p-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-amber-500 rounded-full transition-all">
            <ArrowLeft />
          </Link>
          <div className="flex items-center gap-3">
            {/* LOGO SIN FONDO NEGRO */}
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg bg-transparent">
              <img src={logoAlabanza} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-xl font-black uppercase tracking-tighter italic text-amber-500">Fabulosa Alabanza</h1>
          </div>
        </div>
        <button onClick={() => setDonacionModal(true)} className="px-4 py-2 bg-amber-500 text-black font-bold rounded-xl text-xs uppercase tracking-widest">
          Sembrar
        </button>
      </header>

      <main className="flex-1 relative bg-black">
        <div id="alabanza-player" className="w-full h-full"></div>
        {/* Controles y demás lógica se mantienen igual */}
      </main>
    </div>
  );
};

export default FabulosaAlabanza;