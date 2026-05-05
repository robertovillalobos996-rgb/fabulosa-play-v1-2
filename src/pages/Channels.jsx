import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import Hls from "hls.js";

import logoFabulosa from "../assets/logo_fabulosa.png";
import { canalesTV as initialCanales } from "../data/canales_finales.js";

const Channels = () => {
  const navigate = useNavigate();

  const [channels] = useState(initialCanales || []);
  const [currentChannel, setCurrentChannel] = useState(initialCanales[0]);
  const [isLoading, setIsLoading] = useState(true);

  const [focusedIndex, setFocusedIndex] = useState(0);
  const [focusedSection, setFocusedSection] = useState("grid");

  const videoRef = useRef(null);
  const preVideoRef = useRef(null);
  const hlsRef = useRef(null);
  const retryRef = useRef(0);

  // 🎯 FILTRO SIMPLE
  const filteredChannels = useMemo(() => channels, [channels]);

  // 🎬 PLAYER PRINCIPAL
  const playChannel = (channel) => {
    if (!channel) return;

    setCurrentChannel(channel);
    setIsLoading(true);
    retryRef.current = 0;
  };

  // ⚡ ZAPPING
  const zap = (dir) => {
    let i = focusedIndex + dir;

    if (i < 0) i = filteredChannels.length - 1;
    if (i >= filteredChannels.length) i = 0;

    setFocusedIndex(i);
    playChannel(filteredChannels[i]);
  };

  // 🚀 PRELOAD SIGUIENTE
  const preloadNext = (index) => {
    const next = filteredChannels[(index + 1) % filteredChannels.length];
    if (!next || !preVideoRef.current) return;

    const video = preVideoRef.current;

    if (next.url?.includes(".m3u8") && Hls.isSupported()) {
      const hls = new Hls({ maxBufferLength: 30 });
      hls.loadSource(next.url);
      hls.attachMedia(video);
    } else {
      video.src = next.url;
      video.load();
    }
  };

  // 🎬 MOTOR DE VIDEO PRO
  useEffect(() => {
    const video = videoRef.current;
    if (!currentChannel?.url) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    setIsLoading(true);

    const startPlayback = () => {
      video.play().catch(() => {});
      setIsLoading(false);
    };

    // HLS
    if (currentChannel.url.includes(".m3u8")) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          lowLatencyMode: true,
          maxBufferLength: 60,
        });

        hls.loadSource(currentChannel.url);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, startPlayback);

        hls.on(Hls.Events.ERROR, () => {
          if (retryRef.current < 3) {
            retryRef.current++;
            setTimeout(() => playChannel(currentChannel), 1000);
          }
        });

        hlsRef.current = hls;
      } else {
        video.src = currentChannel.url;
        video.onloadedmetadata = startPlayback;
      }
    } else {
      video.src = currentChannel.url;
      video.onloadeddata = startPlayback;
    }

    preloadNext(focusedIndex);

  }, [currentChannel]);

  // 🎮 CONTROL REMOTO TOTAL
  useEffect(() => {
    const handle = (e) => {
      if (focusedSection === "grid") {
        if (e.key === "ArrowRight") zap(1);
        if (e.key === "ArrowLeft") zap(-1);
        if (e.key === "Enter") playChannel(filteredChannels[focusedIndex]);
      }
    };

    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [focusedIndex, filteredChannels]);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-black text-white">

      {/* BACK */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 z-50 bg-red-600 p-3 rounded-full"
      >
        <ArrowLeft />
      </button>

      {/* SIDEBAR */}
      <aside className="w-full lg:w-60 bg-[#0a0a0a] p-4">
        <img src={logoFabulosa} className="h-10 mb-6" />
        <p className="text-xs opacity-60">Canales en vivo</p>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col">

        {/* PLAYER */}
        <div className="relative w-full h-[40%] bg-black">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="animate-spin text-red-600" />
            </div>
          )}

          <video ref={videoRef} className="w-full h-full" controls />
          <video ref={preVideoRef} style={{ display: "none" }} muted />
        </div>

        {/* GRID */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 p-4 overflow-y-auto">

          {filteredChannels.map((ch, i) => (
            <div
              key={ch.id}
              onClick={() => {
                setFocusedIndex(i);
                playChannel(ch);
              }}
              className={`p-3 bg-[#111] rounded-xl cursor-pointer ${
                i === focusedIndex ? "ring-4 ring-red-600 scale-105" : ""
              }`}
            >
              <img src={ch.logo} className="h-12 mx-auto object-contain" />
              <p className="text-xs text-center mt-2">{ch.name}</p>
            </div>
          ))}

        </div>
      </main>
    </div>
  );
};

export default Channels;