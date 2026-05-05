import { useState, useEffect } from "react";
import { Search, Bell, User, Tv, Menu, X } from "lucide-react";

const NAV_LINKS = ["Inicio", "TV", "Películas", "Series", "Deportes", "Kids", "Radio"];

export default function TopNav({ scrolled }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const n = new Date();
      let h = n.getHours();
      const m = n.getMinutes().toString().padStart(2,"0");
      const ap = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      setTime(`${h}:${m} ${ap}`);
    };
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(13,13,13,0.97)"
            : "linear-gradient(to bottom, rgba(13,13,13,0.9) 0%, transparent 100%)",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
        }}>

        <div className="flex items-center px-4 md:px-10 lg:px-16 h-14 gap-4">

          <div className="flex items-center gap-2 flex-shrink-0 mr-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#8B00FF,#BF5FFF)" }}>
              <Tv className="w-4 h-4 text-white"/>
            </div>
            <span className="font-bebas tracking-widest text-lg text-white hidden sm:block">
              FABULOSA <span style={{ color: "#BF5FFF" }}>PLAY</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1 flex-1">
            {NAV_LINKS.map((n, i) => (
              <button key={n}
                className="px-3 py-1.5 text-xs font-semibold rounded transition-colors"
                style={{ color: i === 0 ? "#fff" : "rgba(255,255,255,0.45)" }}>
                {n}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-white/35 text-xs font-mono hidden sm:block">{time}</span>

            <button className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white">
              <Search className="w-4 h-4"/>
            </button>

            <button className="relative w-8 h-8 flex items-center justify-center text-white/40 hover:text-white">
              <Bell className="w-4 h-4"/>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"/>
            </button>

            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "linear-gradient(135deg,#8B00FF,#BF5FFF)" }}>
              F
            </div>

            <button className="md:hidden w-8 h-8 flex items-center justify-center text-white/60"
              onClick={() => setMenuOpen(m => !m)}>
              {menuOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 pt-14 bg-black/95">
          <div className="flex flex-col">
            {NAV_LINKS.map((n) => (
              <button key={n} className="px-6 py-4 text-left text-white border-b border-white/10">
                {n}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}