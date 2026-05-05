import { useState, useEffect } from "react";
import { Search, Bell, Menu, X, Tv } from "lucide-react";

const NAV_LINKS = ["Inicio", "TV", "Películas", "Series", "Deportes", "Kids", "Radio"];

export default function TopNav({ scrolled }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const n = new Date();
      let h = n.getHours();
      const m = n.getMinutes().toString().padStart(2, "0");
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur border-b border-white/10">
        <div className="flex items-center px-4 md:px-10 lg:px-16 h-14 gap-4">

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded flex items-center justify-center bg-purple-600">
              <Tv className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold hidden sm:block">
              FABULOSA PLAY
            </span>
          </div>

          <div className="hidden md:flex gap-4 ml-6">
            {NAV_LINKS.map((n, i) => (
              <span key={n} className={`text-sm ${i === 0 ? "text-white" : "text-white/50"}`}>
                {n}
              </span>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="text-white/40 text-xs hidden sm:block">{time}</span>
            <Search className="w-4 h-4 text-white/60" />
            <Bell className="w-4 h-4 text-white/60" />

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 bg-black pt-14 z-40">
          {NAV_LINKS.map((n) => (
            <div key={n} className="p-4 border-b border-white/10 text-white">
              {n}
            </div>
          ))}
        </div>
      )}
    </>
  );
}