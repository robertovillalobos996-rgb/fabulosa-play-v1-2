import { useState, useEffect } from "react";

const ITEMS = [
  {
    title: "KARAOKE",
    image: "/card-fabulosa-karaoke.webp",
  },
  {
    title: "CINE PLAY",
    image: "/cine_play.png",
  },
  {
    title: "TV EN VIVO",
    image: "/canales_play.png",
  },
];

export default function HeroSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % ITEMS.length);
    }, 5000);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full h-[60vh] overflow-hidden">

      {ITEMS.map((item, i) => (
        <img
          key={i}
          src={item.image}
          className="absolute w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: i === active ? 1 : 0 }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      <div className="absolute bottom-10 left-6 text-white z-10">
        <h1 className="text-4xl font-bold">
          {ITEMS[active].title}
        </h1>
      </div>
    </div>
  );
}