import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import Hls from "hls.js";

import logoFabulosa from "../assets/logo_fabulosa.png";
import { canalesTV as initialCanales } from "../data/canales_finales.js";

const Channels = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [channels] = useState(initialCanales || []);
  const [currentChannel, setCurrentChannel] = useState(initialCanales?.[0] || null);

  const [focusedSection, setFocusedSection] = useState("grid");
  const [focusedIndex, setFocusedIndex] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  /* CATEGORÍAS */
  const categories = useMemo(() => {
    return ["Todos", ...new Set(channels.map((c) => c.genre || "Varios"))];
  }, [channels]);

  /* FILTRO */
  const filteredChannels = useMemo(() => {
    return channels.filter((c) => {
      const matchCat =
        activeCategory === "Todos" || c.genre === activeCategory;
      const nombre = c.name || c.title || "";
      return matchCat && nombre.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [channels, activeCategory, searchTerm]);

  /* CONTROL REMOTO */
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMobile = window.innerWidth < 768;
      const columns = isMobile ? 2 : window.innerWidth < 1024 ? 4 : 8;

      if (focusedSection === "grid") {
        if (e.key === "ArrowRight")
          setFocusedIndex((i) => Math.min(i + 1, filteredChannels.length - 1));

        if (e.key === "ArrowLeft") {
          if (focusedIndex % columns === 0) {
            setFocusedSection("sidebar");
            setFocusedIndex(0);
          } else {
            setFocusedIndex((i) => Math.max(i - 1, 0));
          }
        }

        if (e.key === "ArrowDown")
          setFocusedIndex((i) =>
            Math.min(i + columns, filteredChannels.length - 1)
          );

        if (e.key === "ArrowUp") {
          if (focusedIndex < columns) {
            setFocusedSection("player");
          } else {
            setFocusedIndex((i) => Math.max(i - columns, 0));
          }
        }

        if (e.key === "Enter") {
          const ch = filteredChannels[focusedIndex];
          if (ch) handleChannelSelect(ch);
        }
      }

      if (focusedSection === "sidebar") {
        if (e.key === "ArrowDown")
          setFocusedIndex((i) => Math.min(i + 1, categories.length - 1));

        if (e.key === "ArrowUp")
          setFocusedIndex((i) => Math.max(i - 1, 0));

        if (e.key === "ArrowRight") {
          setFocusedSection("grid");
          setFocusedIndex(0);
        }

        if (e.key === "Enter") {
          setActiveCategory(categories[focusedIndex]);
        }
      }

      if (focusedSection === "player") {
        if (e.key === "ArrowDown") {
          setFocusedSection("grid");
          setFocusedIndex(0);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedSection, focusedIndex, filteredChannels, categories]);

  const handleChannelSelect = (channel) => {
    setCurrentChannel(channel);
    setIsLoading(true);
  };

  /* PLAYER */
  useEffect(() => {
    if (!currentChannel) return;

    const video = videoRef.current;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    setIsLoading(true);

    if (currentChannel.iframe_url) {
      setIsLoading(false);
      return;
    }

    if (currentChannel.url?.includes(".m3u8")) {
      if (Hls.isSupported()) {
        const hls = new Hls({ lowLatencyMode: true });
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

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-black text-white overflow-hidden">

      {/* BOTÓN VOLVER */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 z-50 bg-red-600 p-3 rounded-full"
      >
        <ArrowLeft size={20} />
      </button>

      {/* SIDEBAR */}
      <aside className="w-full lg:w-64 bg-[#0a0a0a] border-r border-white/5">
        <div className="p-4 pt-16">
          <img src={logoFabulosa} className="h-10 mb-6" />

          <input
            type="text"
            placeholder="Buscar..."
            className="w-full bg-white/10 p-3 rounded-xl text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="p-4 space-y-2">
          {categories.map((cat, idx) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`w-full p-3 rounded-xl text-left ${
                activeCategory === cat ? "bg-red-600" : "bg-white/5"
              } ${
                focusedSection === "sidebar" && focusedIndex === idx
                  ? "ring-2 ring-white"
                  : ""
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col">

        {/* PLAYER */}
        <div className="relative w-full h-[40%] bg-black">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="animate-spin text-red-600" size={40} />
            </div>
          )}

          {currentChannel?.iframe_url ? (
            <iframe
              src={currentChannel.iframe_url}
              className="w-full h-full border-none"
              allow="autoplay"
            />
          ) : (
            <video ref={videoRef} className="w-full h-full" controls />
          )}
        </div>

        {/* GRID */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 p-4">
          {filteredChannels.map((channel, idx) => (
            <div
              key={channel.id}
              onClick={() => handleChannelSelect(channel)}
              className={`cursor-pointer p-4 bg-[#111] rounded-xl flex flex-col items-center justify-center transition ${
                focusedSection === "grid" && focusedIndex === idx
                  ? "ring-4 ring-red-600 scale-110"
                  : ""
              }`}
            >
              <img
                src={channel.logo}
                className="max-h-16 object-contain"
              />
              <span className="text-xs mt-2 text-center">
                {channel.name || channel.title}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Channels;