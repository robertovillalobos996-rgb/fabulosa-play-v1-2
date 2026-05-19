import { useState } from "react";

export default function AddCameraForm({ onSave }) {

  const [name, setName] = useState("");
  const [src, setSrc] = useState("");
  const [tipo, setTipo] = useState("video");

  const guardar = () => {

    if (!name || !src) {
      alert("Complete todos los campos");
      return;
    }

    const nuevaCamara = {
      id: Date.now(),
      name,
      src,
      tipo,
      activa: true,
    };

    onSave(nuevaCamara);

    setName("");
    setSrc("");
    setTipo("video");

  };

  return (

    <div className="
      bg-zinc-900
      border border-pink-500/20
      rounded-2xl
      p-6
      flex
      flex-col
      gap-4
    ">

      <h2 className="text-white text-3xl font-black">
        AGREGAR CÁMARA
      </h2>

      {/* NOMBRE */}

      <input
        type="text"
        placeholder="Nombre cámara"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="
          bg-black
          border border-white/10
          rounded-xl
          p-4
          text-white
          outline-none
        "
      />

      {/* TIPO */}

      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        className="
          bg-black
          border border-white/10
          rounded-xl
          p-4
          text-white
          outline-none
        "
      >

        <option value="video">VIDEO MP4</option>

        <option value="youtube">YOUTUBE EMBED</option>

      </select>

      {/* URL */}

      <textarea
        placeholder="URL cámara"
        value={src}
        onChange={(e) => setSrc(e.target.value)}
        rows={4}
        className="
          bg-black
          border border-white/10
          rounded-xl
          p-4
          text-white
          outline-none
        "
      />

      {/* BOTON */}

      <button
        onClick={guardar}
        className="
          bg-pink-600
          hover:bg-pink-500
          transition-all
          rounded-xl
          p-4
          text-white
          text-xl
          font-black
        "
      >
        GUARDAR CÁMARA
      </button>

    </div>

  );

}