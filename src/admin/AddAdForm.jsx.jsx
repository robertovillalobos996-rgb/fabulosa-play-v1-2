import { useState } from "react";

export default function AddAdForm({ onSave }) {

  const [type, setType] = useState("image");
  const [src, setSrc] = useState("");

  const guardar = () => {

    if (!src) {
      alert("Ingrese URL");
      return;
    }

    const nuevaPublicidad = {
      id: Date.now(),
      type,
      src,
      activa: true,
    };

    onSave(nuevaPublicidad);

    setSrc("");

  };

  return (

    <div className="
      bg-zinc-900
      border border-cyan-500/20
      rounded-2xl
      p-6
      flex
      flex-col
      gap-4
    ">

      <h2 className="
        text-cyan-400
        text-3xl
        font-black
      ">
        AGREGAR PUBLICIDAD
      </h2>

      {/* TIPO */}

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="
          bg-black
          border border-white/10
          rounded-xl
          p-4
          text-white
        "
      >

        <option value="image">
          IMAGEN
        </option>

        <option value="video">
          VIDEO
        </option>

      </select>

      {/* URL */}

      <textarea
        rows={4}
        value={src}
        onChange={(e) => setSrc(e.target.value)}
        placeholder="Ruta publicidad"
        className="
          bg-black
          border border-white/10
          rounded-xl
          p-4
          text-white
        "
      />

      {/* BOTON */}

      <button
        onClick={guardar}
        className="
          bg-cyan-500
          hover:bg-cyan-400
          transition-all
          rounded-xl
          p-4
          text-black
          text-xl
          font-black
        "
      >
        GUARDAR PUBLICIDAD
      </button>

    </div>

  );

}