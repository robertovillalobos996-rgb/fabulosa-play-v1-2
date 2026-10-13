const LOCALE = "hl=es-419&gl=CR&ceid=CR:es-419";
export const FEEDS = [
  { region: "Costa Rica", url: `https://news.google.com/rss/search?q=${encodeURIComponent('Costa Rica when:1d')}&${LOCALE}` },
  { region: "Mundo", url: `https://news.google.com/rss/headlines/section/topic/WORLD?${LOCALE}` },
  ...["teletica.com", "crhoy.com", "repretel.com", "monumental.co.cr", "nacion.com"].map((site) => ({ region: "Costa Rica", url: `https://news.google.com/rss/search?q=${encodeURIComponent(`site:${site} when:1d`)}&${LOCALE}` })),
];
function decode(value) {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/&(?:#(x[0-9a-f]+|[0-9]+)|(amp|quot|apos|lt|gt));/gi, (full, numeric, named) => {
    if (numeric) { const point = numeric[0].toLowerCase() === "x" ? parseInt(numeric.slice(1), 16) : Number(numeric); return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : ""; }
    return { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">" }[named.toLowerCase()] || full;
  }).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}
export function parseNews(xml, region, now = Date.now()) {
  const field = (item, tag) => decode(item.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1] || "");
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].slice(0, 150);
  return items.map((match) => {
    const item = match[1], source = field(item, "source"), rawTitle = field(item, "title");
    const title = source && rawTitle.endsWith(` - ${source}`) ? rawTitle.slice(0, -(source.length + 3)) : rawTitle;
    const publishedAt = Date.parse(field(item, "pubDate")), url = field(item, "link");
    return { title: title.slice(0, 350), source: source.slice(0, 100), region, publishedAt, url };
  }).filter((item) => item.title && item.source && Number.isFinite(item.publishedAt) && item.publishedAt >= now - 86400000 && item.publishedAt <= now + 300000 && /^https:\/\/news\.google\.com\//.test(item.url)).sort((a, b) => b.publishedAt - a.publishedAt);
}
export function mergeNews(groups) {
  const result = [], seen = new Set();
  for (let index = 0; index < 8; index++) for (const group of groups) {
    const item = group[index]; if (!item) continue;
    const key = item.title.toLocaleLowerCase("es"); if (seen.has(key)) continue;
    seen.add(key); result.push(item);
  }
  return result;
}
export default async function handler(req, res) {
  if (req.method !== "GET") { res.setHeader("Allow", "GET"); return res.status(405).json({ error: "Método no permitido" }); }
  const results = await Promise.allSettled(FEEDS.map(async (feed) => {
    const response = await fetch(feed.url, { cache: "no-store", signal: AbortSignal.timeout(8000), headers: { Accept: "application/rss+xml, application/xml, text/xml" } });
    if (!response.ok) throw new Error("Feed no disponible");
    const xml = await response.text(); if (xml.length > 2000000 || !xml.includes("<rss")) throw new Error("Feed inválido");
    return parseNews(xml, feed.region);
  }));
  const fulfilled = results.filter((result) => result.status === "fulfilled").map((result) => result.value);
  if (!fulfilled.length) { res.setHeader("Cache-Control", "no-store"); return res.status(502).json({ headlines: [], error: "Google Noticias no está disponible temporalmente" }); }
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("X-Content-Type-Options", "nosniff");
  return res.status(200).json({ headlines: mergeNews(fulfilled), fetchedAt: Date.now(), partial: fulfilled.length !== FEEDS.length });
}
