export default async function handler(req, res) {
  // 1. Cabeceras de "Fuerza Bruta" para que el navegador no pregunte nada
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { url, referer } = req.query;
  if (!url) return res.status(400).send("Falta la URL");

  try {
    // 2. Hacemos la petición como si fuéramos VLC
    const response = await fetch(decodeURIComponent(url), {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": referer || "https://www.repretel.com/",
        "Origin": referer || "https://www.repretel.com/"
      }
    });

    const data = await response.text();
    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send("Error de conexión");
  }
}