import { useEffect, useState } from "react";

export default function AdminPanel() {
const [name, setName] = useState("");
const [url, setUrl] = useState("");
const [type, setType] = useState("youtube");

const [items, setItems] = useState([]);

// =========================================
// CARGAR CONTENIDO
// =========================================

const loadItems = async () => {
try {
const response = await fetch(
"http://localhost:5000/api/cameras"
);

```
  const data = await response.json();

  setItems(data);
} catch (error) {
  console.log(error);
}
```

};

useEffect(() => {
loadItems();
}, []);

// =========================================
// GUARDAR
// =========================================

const saveItem = async () => {
if (!name || !url) {
alert("Complete todo");
return;
}

```
try {
  await fetch("http://localhost:5000/api/cameras", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      name,
      url,
      type,
    }),
  });

  setName("");
  setUrl("");

  loadItems();

  alert("Contenido agregado");
} catch (error) {
  console.log(error);
}
```

};

// =========================================
// ELIMINAR
// =========================================

const deleteItem = async (id) => {
try {
await fetch(
`http://localhost:5000/api/cameras/${id}`,
{
method: "DELETE",
}
);

```
  loadItems();
} catch (error) {
  console.log(error);
}
```

};

return (
<div
style={{
minHeight: "100vh",
background: "#050505",
padding: "40px",
color: "#fff",
fontFamily: "Arial",
}}
>
{/* TITULO */}

```
  <h1
    style={{
      fontSize: "42px",
      marginBottom: "30px",
      fontWeight: "900",
    }}
  >
    📺 PANEL FABULOSA PLAY
  </h1>

  {/* FORMULARIO */}

  <div
    style={{
      background: "#111",
      padding: "25px",
      borderRadius: "20px",
      marginBottom: "40px",
      border: "1px solid rgba(255,255,255,.1)",
    }}
  >
    <h2
      style={{
        marginBottom: "20px",
      }}
    >
      Agregar contenido
    </h2>

    {/* NOMBRE */}

    <input
      placeholder="Nombre"
      value={name}
      onChange={(e) => setName(e.target.value)}
      style={{
        width: "100%",
        padding: "15px",
        marginBottom: "15px",
        borderRadius: "12px",
        border: "none",
        background: "#1a1a1a",
        color: "#fff",
        fontSize: "16px",
      }}
    />

    {/* URL */}

    <input
      placeholder="URL o ID YouTube"
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      style={{
        width: "100%",
        padding: "15px",
        marginBottom: "15px",
        borderRadius: "12px",
        border: "none",
        background: "#1a1a1a",
        color: "#fff",
        fontSize: "16px",
      }}
    />

    {/* TIPO */}

    <select
      value={type}
      onChange={(e) => setType(e.target.value)}
      style={{
        width: "100%",
        padding: "15px",
        marginBottom: "20px",
        borderRadius: "12px",
        border: "none",
        background: "#1a1a1a",
        color: "#fff",
        fontSize: "16px",
      }}
    >
      <option value="youtube">
        YouTube
      </option>

      <option value="video">
        Video MP4
      </option>

      <option value="facebook">
        Facebook Live
      </option>

      <option value="camera">
        Cámara
      </option>
    </select>

    {/* BOTON */}

    <button
      onClick={saveItem}
      style={{
        background: "#ff008c",
        color: "#fff",
        border: "none",
        padding: "15px 25px",
        borderRadius: "14px",
        fontSize: "18px",
        fontWeight: "800",
        cursor: "pointer",
      }}
    >
      ➕ GUARDAR CONTENIDO
    </button>
  </div>

  {/* LISTA */}

  <div>
    <h2
      style={{
        marginBottom: "20px",
      }}
    >
      Contenido del canal
    </h2>

    {items.map((item) => (
      <div
        key={item._id}
        style={{
          background: "#111",
          padding: "20px",
          borderRadius: "18px",
          marginBottom: "15px",
          border: "1px solid rgba(255,255,255,.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: "800",
              marginBottom: "5px",
            }}
          >
            {item.name}
          </div>

          <div
            style={{
              color: "#aaa",
              fontSize: "14px",
            }}
          >
            {item.type}
          </div>

          <div
            style={{
              color: "#666",
              marginTop: "10px",
              wordBreak: "break-all",
            }}
          >
            {item.url}
          </div>
        </div>

        <button
          onClick={() =>
            deleteItem(item._id)
          }
          style={{
            background: "#ff003c",
            border: "none",
            color: "#fff",
            padding: "12px 18px",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "800",
          }}
        >
          🗑 ELIMINAR
        </button>
      </div>
    ))}
  </div>
</div>
```

);
}
