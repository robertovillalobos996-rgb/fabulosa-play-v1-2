import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { ArrowLeft } from "lucide-react";

const Noticias = () => {
  const [data, setData] = useState({ main: [], ticker: [] });
  const [dolar, setDolar] = useState({ compra: "...", venta: "..." });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "configuracion", "dolar"), (docSnap) => {
      if (docSnap.exists()) setDolar(docSnap.data());
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    fetch("https://fabulosa-backend.onrender.com/api/noticias")
      .then(res => res.json())
      .then(json => setData(json))
      .catch(e => console.log("Error RSS", e));
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="p-2 bg-white/5 rounded-full"><ArrowLeft /></Link>
        <div className="flex gap-4">
           <div className="bg-green-600/20 px-4 py-2 rounded-xl border border-green-500/20">
             <p className="text-[10px] font-bold text-green-500 uppercase">Compra</p>
             <p className="text-xl font-black">{dolar.compra}</p>
           </div>
           <div className="bg-red-600/20 px-4 py-2 rounded-xl border border-red-600/20">
             <p className="text-[10px] font-bold text-red-500 uppercase">Venta</p>
             <p className="text-xl font-black">{dolar.venta}</p>
           </div>
        </div>
      </div>
      <h1 className="text-4xl font-black italic uppercase text-red-600">Noticias Fabulosa</h1>
      <div className="mt-10">
        {data.main.map((n, i) => (
          <div key={i} className="p-4 mb-2 bg-white/5 rounded-xl font-bold border border-white/5">
            {n.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Noticias;