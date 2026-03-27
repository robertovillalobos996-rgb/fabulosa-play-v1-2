import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, setDoc, onSnapshot, collection, addDoc } from "firebase/firestore";

const Admin = () => {
    const [dolar, setDolar] = useState({ compra: "", venta: "" });
    const [peli, setPeli] = useState({ title: "", url: "", category: "Estrenos" });

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "configuracion", "dolar"), (docSnap) => {
            if (docSnap.exists()) setDolar(docSnap.data());
        });
        return () => unsub();
    }, []);

    const guardarDolar = async () => {
        await setDoc(doc(db, "configuracion", "dolar"), dolar);
        alert("💰 Dolar actualizado en Google");
    };

    const guardarPeli = async () => {
        await addDoc(collection(db, "peliculas"), peli);
        alert("🎬 Pelicula agregada al catálogo");
        setPeli({ title: "", url: "", category: "Estrenos" });
    };

    return (
        <div className="min-h-screen bg-black text-white p-10 font-sans">
            <h1 className="text-3xl font-black text-red-600 mb-10 italic">FABULOSA MASTER CONTROL</h1>
            <div className="grid md:grid-cols-2 gap-10">
                <div className="bg-zinc-900 p-8 rounded-3xl border border-white/5">
                    <h2 className="mb-6 font-bold uppercase text-gray-400">Tipo de Cambio</h2>
                    <input value={dolar.compra} onChange={e => setDolar({...dolar, compra: e.target.value})} className="w-full bg-black p-4 mb-4 rounded-xl text-green-500 font-bold" placeholder="Compra" />
                    <input value={dolar.venta} onChange={e => setDolar({...dolar, venta: e.target.value})} className="w-full bg-black p-4 mb-4 rounded-xl text-red-500 font-bold" placeholder="Venta" />
                    <button onClick={guardarDolar} className="w-full bg-white text-black font-black py-4 rounded-xl uppercase">Guardar Dólar</button>
                </div>
                <div className="bg-zinc-900 p-8 rounded-3xl border border-white/5">
                    <h2 className="mb-6 font-bold uppercase text-gray-400">Nueva Película / Video</h2>
                    <input value={peli.title} onChange={e => setPeli({...peli, title: e.target.value})} className="w-full bg-black p-4 mb-4 rounded-xl" placeholder="Título" />
                    <input value={peli.url} onChange={e => setPeli({...peli, url: e.target.value})} className="w-full bg-black p-4 mb-4 rounded-xl" placeholder="Link del video" />
                    <button onClick={guardarPeli} className="w-full bg-red-600 font-black py-4 rounded-xl uppercase">Subir a la App</button>
                </div>
            </div>
        </div>
    );
};

export default Admin;