import { useState, useEffect } from "react";

const slides = [
  {
    title: "TV EN VIVO",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=1600",
    path: "/canales-play"
  },
  {
    title: "KARAOKE",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1600",
    path: "/karaoke"
  }
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const i = setInterval(() => {
      setIndex((p) => (p + 1) % slides.length);
    }, 5000);
    return () => clearInterval(i);
  }, []);

  const item = slides[index];

  return (
    <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden">
      <img src={item.image} className="w-full h-full object-cover" />

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />

      <div className="absolute bottom-10 left-6 md:left-16">
        <h1 className="text-4xl md:text-6xl font-bold text-white">
          {item.title}
        </h1>

        <button className="mt-4 bg-white text-black px-4 py-2 rounded">
          Ver
        </button>
      </div>
    </div>
  );
}