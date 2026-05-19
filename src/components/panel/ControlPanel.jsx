import { useState } from "react";

export default function ControlPanel() {
  const [activeTab, setActiveTab] = useState("camaras");

  const cameras = [
    {
      name: "Nueva York",
      id: "DjdUEyjx8GM",
    },

    {
      name: "Tokio",
      id: "21X5lGlDOfg",
    },
  ];

  const ads = [
    {
      name: "Publicidad Playa",
      type: "Imagen",
    },

    {
      name: "Comercial TV",
      type: "Video",
    },
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "340px",
        height: "100vh",
        background: "rgba(5,10,20,.92)",
        backdropFilter: "blur(20px)",
        borderLeft: "1px solid rgba(255,255,255,.08)",
        zIndex: 9999,
        overflowY: "auto",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* TITLE */}

      <div
        style={{
          color: "#00cfff",
          fontSize: "26px",
          fontWeight: "900",
          marginBottom: "20px",
          letterSpacing: "1px",
        }}
      >
        PANEL DE CONTROL
      </div>

      {/* TABS */}

      <div
        style={{
          display: "flex",
          background: "#0b1320",
          borderRadius: "14px",
          padding: "5px",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => setActiveTab("camaras")}
          style={{
            flex: 1,
            padding: "12px",
            border: "none",
            borderRadius: "10px",
            background:
              activeTab === "camaras"
                ? "#00cfff"
                : "transparent",
            color:
              activeTab === "camaras"
                ? "#000"
                : "#fff",
            fontWeight: "800",
            cursor: "pointer",
          }}
        >
          📹 Cámaras
        </button>

        <button
          onClick={() => setActiveTab("ads")}
          style={{
            flex: 1,
            padding: "12px",
            border: "none",
            borderRadius: "10px",
            background:
              activeTab === "ads"
                ? "#ff00aa"
                : "transparent",
            color: "#fff",
            fontWeight: "800",
            cursor: "pointer",
          }}
        >
          📺 Publicidad
        </button>
      </div>

      {/* CAMARAS */}

      {activeTab === "camaras" && (
        <>
          <div
            style={{
              background: "#0d1628",
              borderRadius: "20px",
              padding: "18px",
              marginBottom: "20px",
              border: "1px solid rgba(255,255,255,.06)",
            }}
          >
            <div
              style={{
                color: "#00cfff",
                fontWeight: "900",
                marginBottom: "15px",
                fontSize: "20px",
              }}
            >
              NUEVA CÁMARA
            </div>

            <input
              placeholder="Nombre cámara"
              style={inputStyle}
            />

            <select style={inputStyle}>
              <option>YouTube Live</option>
              <option>IPTV</option>
            </select>

            <input
              placeholder="ID o URL"
              style={inputStyle}
            />

            <button style={cameraButton}>
              + AGREGAR CÁMARA
            </button>
          </div>

          {/* LISTA */}

          {cameras.map((cam, index) => (
            <div
              key={index}
              style={{
                background: "#101827",
                borderRadius: "16px",
                padding: "15px",
                marginBottom: "12px",
                border: "1px solid rgba(255,255,255,.05)",
              }}
            >
              <div
                style={{
                  color: "#fff",
                  fontWeight: "800",
                  fontSize: "17px",
                }}
              >
                {cam.name}
              </div>

              <div
                style={{
                  color: "#777",
                  fontSize: "13px",
                  marginTop: "5px",
                }}
              >
                {cam.id}
              </div>
            </div>
          ))}
        </>
      )}

      {/* ADS */}

      {activeTab === "ads" && (
        <>
          <div
            style={{
              background: "#171024",
              borderRadius: "20px",
              padding: "18px",
              marginBottom: "20px",
              border: "1px solid rgba(255,255,255,.06)",
            }}
          >
            <div
              style={{
                color: "#ff00aa",
                fontWeight: "900",
                marginBottom: "15px",
                fontSize: "20px",
              }}
            >
              NUEVA PUBLICIDAD
            </div>

            <input
              placeholder="Nombre anuncio"
              style={inputStyle}
            />

            <select style={inputStyle}>
              <option>Imagen</option>
              <option>Video</option>
            </select>

            <input
              placeholder="URL o archivo"
              style={inputStyle}
            />

            <button style={adsButton}>
              + AGREGAR PUBLICIDAD
            </button>
          </div>

          {/* LISTA ADS */}

          {ads.map((ad, index) => (
            <div
              key={index}
              style={{
                background: "#181126",
                borderRadius: "16px",
                padding: "15px",
                marginBottom: "12px",
                border: "1px solid rgba(255,255,255,.05)",
              }}
            >
              <div
                style={{
                  color: "#fff",
                  fontWeight: "800",
                  fontSize: "17px",
                }}
              >
                {ad.name}
              </div>

              <div
                style={{
                  color: "#999",
                  fontSize: "13px",
                  marginTop: "5px",
                }}
              >
                {ad.type}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  marginBottom: "12px",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,.08)",
  background: "#0b1320",
  color: "#fff",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

const cameraButton = {
  width: "100%",
  padding: "15px",
  border: "none",
  borderRadius: "14px",
  background: "#00cfff",
  color: "#000",
  fontWeight: "900",
  cursor: "pointer",
  fontSize: "15px",
};

const adsButton = {
  width: "100%",
  padding: "15px",
  border: "none",
  borderRadius: "14px",
  background: "#7b2cff",
  color: "#fff",
  fontWeight: "900",
  cursor: "pointer",
  fontSize: "15px",
};