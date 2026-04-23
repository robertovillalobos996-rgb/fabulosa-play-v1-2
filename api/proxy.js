export default async function handler(req, res) {
  const { url, referer } = req.query;
  if (!url) return res.status(400).send("Falta la URL");

  try {
    const response = await fetch(decodeURIComponent(url), {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": referer || "https://www.repretel.com/",
        "Origin": referer || "https://www.repretel.com/"
      }
    });

    const data = await response.text();
    
    // Configuración de cabeceras para que el navegador no bloquee el video
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send("Error en el túnel de fuerza bruta");
  }
}