import { useEffect, useRef, useState } from "react";
import channelState from "../data/channelState";

export default function TVPlayer() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [day, setDay] = useState("");

  const [commercialIndex, setCommercialIndex] = useState(0);

  const audioRef = useRef(null);

  const commercials = channelState.commercials;

  // CLOCK
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      const timeString = now.toLocaleTimeString("es-CR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      const cleanTime = timeString
        .replace("a. m.", "")
        .replace("p. m.", "")
        .trim();

      const dateString = now.toLocaleDateString("es-CR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const dayString = now.toLocaleDateString("es-CR", {
        weekday: "long",
      });

      setTime(cleanTime);
      setDate(dateString);
      setDay(dayString);
    };

    updateClock();

    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  // COMMERCIAL ROTATION
  useEffect(() => {
    const interval = setInterval(() => {
      setCommercialIndex((prev) =>
        prev + 1 >= commercials.length ? 0 : prev + 1
      );
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  // FULLSCREEN
  useEffect(() => {
    const handleClick = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }

        if (audioRef.current) {
          audioRef.current.play();
        }
      } catch (error) {
        console.log(error);
      }

      document.removeEventListener("click", handleClick);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const currentCommercial = commercials[commercialIndex];

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* VIDEO PRINCIPAL */}

      <iframe
        src={channelState.currentSource.url}
        className="absolute top-0 left-0 w-full h-full object-cover"
        allow="autoplay; encrypted-media"
        allowFullScreen
        frameBorder="0"
      />

      {/* RADIO */}

      <audio
        ref={audioRef}
        src={channelState.radio.url}
        autoPlay
        loop
      />

      {/* LOGO + CLOCK */}

      <div className="absolute top-5 right-5 z-50 flex flex-col items-center bg-black/40 px-5 py-4 rounded-2xl backdrop-blur-md">

        <img
          src="/icon-512x512.png"
          alt="logo"
          className="w-[170px] object-contain mb-3"
        />

        <div className="w-full h-[2px] bg-pink-500 mb-3"></div>

        <div className="text-white text-6xl font-black leading-none">
          {time}
        </div>

        <div className="text-white text-2xl mt-2 font-semibold">
          {date}
        </div>

        <div className="text-pink-500 text-3xl font-black mt-2 capitalize">
          {day}
        </div>
      </div>

      {/* RCC */}

      {channelState.ticker.enabled && (
        <div className="absolute bottom-0 left-0 w-full z-50 bg-red-700 py-4 overflow-hidden">
          <div className="ticker whitespace-nowrap text-white text-3xl font-black">
            🚨 {channelState.ticker.text}
          </div>
        </div>
      )}

      {/* COMERCIAL */}

      {currentCommercial && (
        <div className="absolute bottom-5 left-5 z-40 bg-black/70 rounded-2xl overflow-hidden border border-white/10">

          {currentCommercial.type === "image" ? (
            <img
              src={currentCommercial.url}
              alt="ad"
              className="w-[420px] h-[110px] object-cover"
            />
          ) : (
            <video
              src={currentCommercial.url}
              autoPlay
              muted
              loop
              className="w-[420px] h-[110px] object-cover"
            />
          )}
        </div>
      )}

      {/* BOTÓN INICIO */}

      <button
        onClick={() => {
          if (audioRef.current) {
            audioRef.current.play();
          }

          document.documentElement.requestFullscreen();
        }}
        className="absolute bottom-10 right-10 z-[999] bg-pink-600 hover:bg-pink-700 text-white font-black px-10 py-5 rounded-full text-2xl"
      >
        INICIAR CANAL
      </button>
    </div>
  );
}