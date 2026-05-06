import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Maximize } from "lucide-react";
import Hls from "hls.js";

import logoFabulosa from "../assets/logo_fabulosa.png";
import { canalesTV as initialCanales } from "../data/canales_finales.js";

const Channels = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [channels] = useState(initialCanales || []);
  const [currentChannel, setCurrentChannel] = useState(initialCanales?.[0] || null);

  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  const isMobile = window.innerWidth < 768;

  /* CATEGORÍAS */
  const categories = useMemo(() => {
    return ["Todos", ...new Set(channels.map((c) => c.genre || "Varios"))];
  }, [channels]);

  /* FILTRO */
  const filteredChannels = useMemo(() => {
    return channels.filter((c) => {
      const match =
        activeCategory === "Todos" || c.genre === activeCategory;
      const name = c.name || c.title || "";
      return match && name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [channels, activeCategory, searchTerm]);

  /* 🔥 FIX CRÍTICO */
  useEffect(() => {
    setFocusedIndex(0);
  }, [activeCategory, searchTerm]);

  /* 🎮 CONTROL REMOTO */
  useEffect(() => {
    const handleKeyDown = (e) => {
      const columns = isMobile ? 2 : window.innerWidth < 1024 ? 4 : 8;

      if (e.key === "ArrowRight")
        setFocusedIndex((i) => Math.min(i + 1, filteredChannels.length - 1));

      if (e.key === "ArrowLeft")
        setFocusedIndex((i) => Math.max(i - 1, 0));

      if (e.key === "ArrowDown")
        setFocusedIndex((i) =>
          Math.min(i + columns, filteredChannels.length - 1)
        );

      if (e.key === "ArrowUp")
        setFocusedIndex((i) => Math.max(i - columns, 0));

      if (e.key === "Enter") {
        const ch = filteredChannels[focusedIndex];
        if (!ch) return;
        setCurrentChannel(ch);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredChannels, focusedIndex]);

  /* 🚀 PLAYER ULTRA ESTABLE */
  useEffect(() => {
    if (!currentChannel) return;

    setIsLoading(true);

    // limpiar HLS anterior
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const video = videoRef.current;

    // 🔒 CANALES 7 y 13 (iframe)
    if (currentChannel.iframe_url) {
      setIsLoading(false);
      return;
    }

    if (currentChannel.url?.includes(".m3u8")) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          lowLatencyMode: true,
          maxBufferLength: 10,
        });

        hls.loadSource(currentChannel.url);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
          setIsLoading(false);
        });

        hlsRef.current = hls;
      } else {
        video.src = currentChannel.url;
        video.onloadedmetadata = () => {
          video.play().catch(() => {});
          setIsLoading(false);
        };
      }
    } else {
      video.src = currentChannel.url;
      video.onloadeddata = () => {
        video.play().catch(() => {});
        setIsLoading(false);
      };
    }
  }, [currentChannel]);

  /* FULLSCREEN */
  const handleFullscreen = () => {
    const el = videoRef.current;
    if (el.requestFullscreen) el.requestFullscreen();
  };

  return (
    <div className="flex flex-col h-screen w-full bg-black text-white">

      <button onClick={() => navigate("/")} className="absolute top-4 left-4 z-50 bg-red-600 p-3 rounded-full">
        <ArrowLeft size={20} />
      </button>

      <button onClick={handleFullscreen} className="absolute top-4 right-4 z-50 bg-black/70 p-3 rounded-full">
        <Maximize size={20} />
      </button>

      {/* PLAYER FIJO */}
      <div className="relative w-full h-[35%] bg-black">

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="animate-spin text-red-600" size={40} />
          </div>
        )}

        {currentChannel?.iframe_url ? (
          <iframe
            src={currentChannel.iframe_url}
            className="w-full h-full border-none"
            allow="autoplay; fullscreen"
          />
        ) : (
          <video ref={videoRef} className="w-full h-full" />
        )}
      </div>

      {/* CATEGORÍAS */}
      <div className="flex overflow-x-auto gap-2 p-3">
        {categories.map((cat) => (
          <button
            key={`cat-${cat}`}  // 🔥 KEY ARREGLADA
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm ${
              activeCategory === cat ? "bg-red-600" : "bg-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 p-3">

        {filteredChannels.map((channel, idx) => (
          <div
            key={`${channel.id}-${idx}`}  // 🔥 FIX DEFINITIVO
            onClick={() => {
              setFocusedIndex(idx);
              setCurrentChannel(channel);
            }}
            onMouseEnter={() => setFocusedIndex(idx)}
            onTouchStart={() => setFocusedIndex(idx)}
            className={`cursor-pointer p-3 bg-[#111] rounded-xl flex flex-col items-center justify-center transition ${
              focusedIndex === idx ? "ring-4 ring-red-600 scale-110" : ""
            }`}
          >
            <img src={channel.logo} className="max-h-14 object-contain" />
            <span className="text-xs mt-2 text-center">
              {channel.name || channel.title}
            </span>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Channels;