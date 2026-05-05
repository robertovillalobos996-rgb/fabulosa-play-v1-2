import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, ArrowLeft, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Hls from 'hls.js';
import logoImage from '../assets/logo_fabulosa.png';

const AUDIO_RADIO_URL = "https://live20.bozztv.com/akamaissh101/ssh101/fabulosa/playlist.m3u8";

const YOUTUBE_CAMS = [
  "rnXIjl_Rzy4","EO_1LWqsCNE","gFRtAAmiFbE","loHbMM9JfCs",
  "uV3wWHSvkfs","nFozEhYTEMo","8Rw-tZTeBjU","rqBfiegG5qU"
];

const ADS_IMAGES = [
  '/publicidad_vertical/mexicana_1.png',
  '/publicidad_vertical/mexicana_2.png',
  '/publicidad_vertical/unas_yendry.png',
  '/publicidad_vertical/anunciete_1.png',
  '/publicidad_vertical/chinito_express.png'
];

const Camaras = () => {
  const navigate = useNavigate();

  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);

  const [currentCamIndex, setCurrentCamIndex] = useState(0);
  const [camError, setCamError] = useState(false);

  const audioRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  /* 🔊 AUDIO HLS */
  useEffect(() => {
    if (!audioRef.current) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(AUDIO_RADIO_URL);
      hls.attachMedia(audioRef.current);
    } else {
      audioRef.current.src = AUDIO_RADIO_URL;
    }

    audioRef.current.volume = volume;
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  /* 🎮 CONTROL REMOTO */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") {
        nextCam();
      }
      if (e.key === "ArrowLeft") {
        prevCam();
      }
      if (e.key === "Enter") {
        setIsMuted(m => !m);
      }
      if (e.key === "Escape") {
        navigate('/');
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  /* 📱 TOUCH (SWIPE) */
  useEffect(() => {
    let startX = 0;

    const start = (e) => startX = e.touches[0].clientX;
    const end = (e) => {
      let endX = e.changedTouches[0].clientX;

      if (startX - endX > 50) nextCam();
      if (endX - startX > 50) prevCam();
    };

    window.addEventListener("touchstart", start);
    window.addEventListener("touchend", end);

    return () => {
      window.removeEventListener("touchstart", start);
      window.removeEventListener("touchend", end);
    };
  }, []);

  /* 🔁 AUTO CAMBIO */
  useEffect(() => {
    const t = setInterval(nextCam, 120000);
    return () => clearInterval(t);
  }, []);

  const nextCam = () => {
    setCamError(false);
    setCurrentCamIndex(i => (i + 1) % YOUTUBE_CAMS.length);
  };

  const prevCam = () => {
    setCamError(false);
    setCurrentCamIndex(i => (i - 1 + YOUTUBE_CAMS.length) % YOUTUBE_CAMS.length);
  };

  /* 👁 CONTROLES AUTO HIDE */
  useEffect(() => {
    const show = () => {
      setIsControlsVisible(true);
      clearTimeout(controlsTimeoutRef.current);

      controlsTimeoutRef.current = setTimeout(() => {
        setIsControlsVisible(false);
      }, 3000);
    };

    window.addEventListener("mousemove", show);
    window.addEventListener("touchstart", show);
    show();

    return () => {
      window.removeEventListener("mousemove", show);
      window.removeEventListener("touchstart", show);
    };
  }, []);

  /* 🚨 FALLBACK SI VIDEO FALLA */
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCamError(true);
      nextCam();
    }, 8000);

    return () => clearTimeout(timeout);
  }, [currentCamIndex]);

  return (
    <>
      <audio ref={audioRef} autoPlay loop />

      <div className="bg-black h-screen w-screen relative overflow-hidden">

        {/* VIDEO */}
        <AnimatePresence mode="wait">
          <motion.iframe
            key={currentCamIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            src={`https://www.youtube.com/embed/${YOUTUBE_CAMS[currentCamIndex]}?autoplay=1&mute=1&playsinline=1&controls=0&rel=0&modestbranding=1`}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media"
          />
        </AnimatePresence>

        {/* LOGO */}
        <div className="absolute top-6 left-6 z-50">
          <img src={logoImage} className="h-16" />
        </div>

        {/* CONTROLES */}
        <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/80 px-6 py-3 rounded-full flex gap-6 transition ${isControlsVisible ? 'opacity-100' : 'opacity-0'}`}>

          <button onClick={() => navigate('/')}>
            <ArrowLeft />
          </button>

          <button onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <VolumeX /> : <Volume2 />}
          </button>

        </div>
      </div>
    </>
  );
};

export default Camaras;