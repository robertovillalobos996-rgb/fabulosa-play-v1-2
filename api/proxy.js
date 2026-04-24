export default async function handler(req, res) {
  // 1. CONFIGURACIÓN DE CABECERAS DE "FUERZA BRUTA"
  // Esto le dice al navegador: "No bloquees este video, yo doy permiso"
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  // 2. RESPUESTA PARA EL "PREFLIGHT" (La pregunta de seguridad del navegador)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { url, referer } = req.query;
  if (!url) return res.status(400).send("Falta la URL del canal");

  try {
    // 3. LA LLAMADA DISFRAZADA (Como lo hace VLC)
    const response = await fetch(decodeURIComponent(url), {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": referer || "https://www.repretel.com/",
        "Origin": referer || "https://www.repretel.com/"
      }
    });

    const data = await response.text();
    
    // 4. ENTREGAR EL VIDEO AL REPRODUCTOR
    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.status(200).send(data);
    
  } catch (error) {
    console.error("Error en el túnel:", error);
    res.status(500).send("Error de conexión con el servidor del canal");
  }
}