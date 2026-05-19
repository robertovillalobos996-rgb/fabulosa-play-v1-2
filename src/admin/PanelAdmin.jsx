import { useEffect, useState } from "react";

export default function PanelAdmin() {

  const [camaras, setCamaras] = useState([]);

  const [nombre, setNombre] = useState("");
  const [url, setUrl] = useState("");
  const [tipo, setTipo] = useState("video");

  // =========================================
  // CARGAR CAMARAS
  // =========================================

  useEffect(() => {

    const guardadas = localStorage.getItem("camaras-play");

    if (guardadas) {

      const data = JSON.parse(guardadas);

      if (data.length > 0) {
        setCamaras(data);
        return;
      }

    }

    // =========================================
    // DEFAULT
    // =========================================

    const iniciales = [

      {
        id: 1,
        name: "NEW YORK",
        tipo: "video",
        src: "https://cdn.coverr.co/videos/coverr-new-york-city-1564848609438?download=1080p",
        activa: true,
      },

      {
        id: 2,
        name: "TOKIO",
        tipo: "video",
        src: "https://cdn.coverr.co/videos/coverr-busy-tokyo-crosswalk-at-night-1564848593342?download=1080p",
        activa: true,
      },

      {
        id: 3,
        name: "PARIS",
        tipo: "video",
        src: "https://cdn.coverr.co/videos/coverr-aerial-view-of-paris-1564848624898?download=1080p",
        activa: true,
      },

      {
        id: 4,
        name: "CAMARA IPTV",
        tipo: "m3u8",
        src: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        activa: false,
      },

      {
        id: 5,
        name: "YOUTUBE LIVE",
        tipo: "youtube",
        src: "https://www.youtube.com/embed/jfKfPfyJRdk",
        activa: false,
      },

    ];

    setCamaras(iniciales);

    localStorage.setItem(
      "camaras-play",
      JSON.stringify(iniciales)
    );

  }, []);

  // =========================================
  // GUARDAR
  // =========================================

  const guardar = (data) => {

    setCamaras(data);

    localStorage.setItem(
      "camaras-play",
      JSON.stringify(data)
    );

  };

  // =========================================
  // AGREGAR
  // =========================================

  const agregarCamara = () => {

    if (!nombre || !url) return;

    const nueva = {
      id: Date.now(),
      name: nombre,
      tipo,
      src: url,
      activa: true,
    };

    const nuevas = [...camaras, nueva];

    guardar(nuevas);

    setNombre("");
    setUrl("");

  };

  // =========================================
  // ELIMINAR
  // =========================================

  const eliminarCamara = (id) => {

    const nuevas = camaras.filter(
      (cam) => cam.id !== id
    );

    guardar(nuevas);

  };

  // =========================================
  // ACTIVAR
  // =========================================

  const toggleCamara = (id) => {

    const nuevas = camaras.map((cam) => {

      if (cam.id === id) {
        return {
          ...cam,
          activa: !cam.activa,
        };
      }

      return cam;

    });

    guardar(nuevas);

  };

  return (

    <div className="min-h-screen bg-black p-10 text-white">

      {/* TITULO */}

      <h1 className="text-6xl font-black text-pink-500 mb-10">
        PANEL ADMIN CAMARAS
      </h1>

      {/* FORM */}

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-10 flex gap-3 flex-wrap">

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="bg-black border border-zinc-700 rounded-lg px-4 py-3 flex-1"
        />

        <input
          type="text"
          placeholder="URL video o YouTube"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-black border border-zinc-700 rounded-lg px-4 py-3 flex-1"
        />

        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="bg-black border border-zinc-700 rounded-lg px-4 py-3 w-[230px]"
        >

          <option value="video">
            VIDEO MP4
          </option>

          <option value="youtube">
            YOUTUBE
          </option>

          <option value="m3u8">
            IPTV M3U8
          </option>

        </select>

        <button
          onClick={agregarCamara}
          className="
            bg-pink-600
            hover:bg-pink-500
            px-8
            py-3
            rounded-lg
            font-black
          "
        >
          AGREGAR CAMARA
        </button>

      </div>

      {/* LISTA */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {camaras.map((cam) => (

          <div
            key={cam.id}
            className="
              bg-zinc-900
              border border-zinc-800
              rounded-2xl
              overflow-hidden
            "
          >

            {/* PREVIEW */}

            <div className="h-[220px] bg-black">

              {cam.tipo === "youtube" ? (

                <iframe
                  src={cam.src}
                  className="w-full h-full"
                  allowFullScreen
                />

              ) : (

                <video
                  src={cam.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />

              )}

            </div>

            {/* INFO */}

            <div className="p-5">

              <h2 className="text-3xl font-black mb-2">
                {cam.name}
              </h2>

              <p className="text-cyan-400 font-bold mb-2">
                Tipo: {cam.tipo}
              </p>

              <p className="text-zinc-400 text-sm break-all mb-5">
                {cam.src}
              </p>

              <div className="flex gap-3">

                <button
                  onClick={() => toggleCamara(cam.id)}
                  className={`
                    px-5
                    py-2
                    rounded-lg
                    font-black
                    ${
                      cam.activa
                        ? "bg-green-500 text-black"
                        : "bg-red-500 text-white"
                    }
                  `}
                >

                  {cam.activa
                    ? "ACTIVA"
                    : "INACTIVA"}

                </button>

                <button
                  onClick={() => eliminarCamara(cam.id)}
                  className="
                    bg-zinc-700
                    hover:bg-zinc-600
                    px-5
                    py-2
                    rounded-lg
                    font-black
                  "
                >
                  ELIMINAR
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}