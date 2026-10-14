import { publicCatalog } from '../server/seoCatalog.js';
import { contentUrl, SITE_ORIGIN } from '../src/utils/seoMetadata.js';
const xml = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export default async function handler(req, res) {
  if (!['GET', 'HEAD'].includes(req.method)) return res.status(405).end();
  try {
    const lists = await Promise.all(['channels', 'radios', 'movies'].map(publicCatalog));
    const urls = [...['/', '/canales-play', '/radios-cr', '/cine-play', '/anunciate'].map((path) => SITE_ORIGIN+path), ...lists.flatMap((items, index) => items.map((item) => contentUrl(['channels', 'radios', 'movies'][index], item)))];
    const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...new Set(urls)].slice(0, 45000).map((url) => `<url><loc>${xml(url)}</loc></url>`).join('')}</urlset>`;
    res.setHeader('Content-Type', 'application/xml; charset=utf-8'); res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300');
    return res.status(200).end(req.method === 'HEAD' ? '' : body);
  } catch { res.setHeader('Cache-Control', 'no-store'); res.setHeader('Retry-After', '60'); return res.status(503).end('Sitemap temporalmente no disponible'); }
}
