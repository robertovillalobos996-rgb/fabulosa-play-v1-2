import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";

const HERO = [
  { title: "TV EN VIVO", path: "/canales-play", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=1600&q=85" },
  { title: "KARAOKE", path: "/karaoke", image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1600&q=85" },
  { title: "CINE PLAY", path: "/cine-play", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&q=85" },
];

export default function HeroSlider() {
  const [i, setI] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % HERO.length), 5000);
    return () => clearInterval(id);
  }, []);

  const item = HERO[i];

  return (
    <div className="relative h-[60vh] w-full overflow-hidden">
      <img src={item.image} className="absolute w-full h-full object-cover"/>

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"/>

      <div className="absolute bottom-10 left-10 text-white">
        <h1 className="text-5xl font-bold">{item.title}</h1>

        <button
          onClick={() => navigate(item.path)}
          className="mt-4 flex items-center gap-2 bg-white text-black px-6 py-2 rounded">
          <Play className="w-4 h-4"/> Ver
        </button>
      </div>
    </div>
  );
}