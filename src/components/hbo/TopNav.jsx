import { useEffect, useState } from "react";

export default function TopNav() {
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
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 px-6 md:px-10 h-14 flex items-center justify-between">

      <div className="text-white font-bold tracking-wide">
        FABULOSA PLAY
      </div>

      <div className="text-white/60 text-sm">
        {time}
      </div>

    </div>
  );
}