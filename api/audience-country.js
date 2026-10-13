export default function handler(req, res) {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "GET") { res.setHeader("Allow", "GET"); return res.status(405).json({ error: "Método no permitido" }); }
  const value = process.env.VERCEL === "1" ? String(req.headers["x-vercel-ip-country"] || "").toUpperCase() : "";
  return res.status(200).json({ country: /^[A-Z]{2}$/.test(value) ? value : "ZZ", now: Date.now() });
}
