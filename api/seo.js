import { readFile } from 'node:fs/promises';
import { publicCatalog } from '../server/seoCatalog.js';
import { contentUrl, metadata, SEO_SECTIONS, SITE_ORIGIN } from '../src/utils/seoMetadata.js';
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
export function seoMarkup(kind, item, items = []) {
  const meta = metadata(kind, item), section = SEO_SECTIONS[kind];
  const schema = { '@context': 'https://schema.org', '@type': item ? 'WebPage' : 'CollectionPage', name: meta.title, description: meta.description, url: meta.url, inLanguage: 'es', isPartOf: { '@type': 'WebSite', name: 'Fabulosa Play', url: SITE_ORIGIN }, ...(item ? { about: { '@type': kind === 'movies' ? 'Movie' : kind === 'radios' ? 'RadioStation' : 'BroadcastService', name: item.title } } : { mainEntity: { '@type': 'ItemList', itemListElement: items.map((value, index) => ({ '@type': 'ListItem', position: index + 1, name: value.title, url: contentUrl(kind, value) })) } }) };
  const head = `<title>${escape(meta.title)}</title><meta name="description" content="${escape(meta.description)}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${escape(meta.url)}"><meta property="og:type" content="website"><meta property="og:site_name" content="Fabulosa Play"><meta property="og:title" content="${escape(meta.title)}"><meta property="og:description" content="${escape(meta.description)}"><meta property="og:url" content="${escape(meta.url)}"><meta property="og:image" content="${escape(meta.image)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(meta.title)}"><meta name="twitter:description" content="${escape(meta.description)}"><meta name="twitter:image" content="${escape(meta.image)}"><script id="fabulosa-seo" type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`;
  const body = `<main style="max-width:1000px;margin:40px auto;padding:24px;font-family:system-ui;color:white;background:#0b101a"><nav><a href="/">Fabulosa Play</a> · <a href="${section.path}">${section.label}</a></nav><h1>${escape(item ? item.title : section.label)}</h1><p>${escape(meta.description)}</p>${item ? `<img src="${escape(meta.image)}" alt="${escape(item.title)}" width="140"><p>El reproductor se carga al activar JavaScript. Las señales pueden tener restricciones de disponibilidad o región.</p><p>Fabulosa Play reúne señales y contenidos online; esta página no implica afiliación oficial con la emisora o canal.</p>` : `<ul>${items.map((value) => `<li><a href="${escape(contentUrl(kind, value))}">${escape(value.title)}</a>${value.country || value.genre || value.category ? ` — ${escape(value.country || value.genre || value.category)}` : ''}</li>`).join('')}</ul>`}</main>`;
  return { head, body };
}
export default async function handler(req, res) {
  if (!['GET', 'HEAD'].includes(req.method)) return res.status(405).end();
  res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.setHeader('X-Content-Type-Options', 'nosniff');
  const kind = String(req.query.kind || ''), section = Object.hasOwn(SEO_SECTIONS, kind) ? SEO_SECTIONS[kind] : null;
  if (!section) return res.status(404).end('Página no encontrada');
  try {
    const items = await publicCatalog(kind), id = String(req.query[section.parameter] || '');
    const item = id ? items.find((value) => String(value.id) === id || (value.combinedCameras && id.startsWith('fabulosa-camera-channel'))) : null;
    if (id && !item) { res.setHeader('X-Robots-Tag', 'noindex'); return res.status(404).end('Este contenido ya no está disponible. <a href="'+section.path+'">Volver al catálogo</a>'); }
    let html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
    const { head, body } = seoMarkup(kind, item, items);
    html = html.replace(/<title>[\s\S]*?<\/title>/i, '').replace(/<meta\b[^>]*name=["'](?:description|robots)["'][^>]*>/gi, '').replace(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi, '').replace(/<meta\b[^>]*(?:property=["']og:[^"']+["']|name=["']twitter:[^"']+["'])[^>]*>/gi, '').replace('</head>', head+'</head>').replace('<div id="root"></div>', `<div id="root">${body}</div>`);
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300');
    return res.status(200).end(req.method === 'HEAD' ? '' : html);
  } catch { res.setHeader('Retry-After', '60'); res.setHeader('Cache-Control', 'no-store'); return res.status(503).end('Página temporalmente no disponible. Intente nuevamente en un momento.'); }
}
