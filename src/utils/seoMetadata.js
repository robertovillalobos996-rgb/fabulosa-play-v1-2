export const SITE_ORIGIN = 'https://fabulosaplay.online';
export const SEO_SECTIONS = {
  channels: { path: '/canales-play', parameter: 'channel', label: 'TV en vivo', title: 'Canales de TV en vivo de Latinoamérica | Fabulosa Play', description: 'Explore canales de televisión en vivo de Costa Rica, Panamá y otros países de Latinoamérica en Fabulosa Play. Busque una señal y abra su reproductor.' },
  radios: { path: '/radios-cr', parameter: 'radio', label: 'Radios en vivo', title: 'Emisoras de radio en vivo de Latinoamérica | Fabulosa Play', description: 'Escuche emisoras de radio online de Costa Rica, Panamá y Latinoamérica. Explore música, noticias y programación en vivo en Fabulosa Play.' },
  movies: { path: '/cine-play', parameter: 'movie', label: 'Películas', title: 'Películas para ver online | Fabulosa Play', description: 'Explore el catálogo de películas de Fabulosa Play. Encuentre títulos por nombre, año y categoría y abra su reproductor online.' },
};
export function contentUrl(kind, item) {
  const section = SEO_SECTIONS[kind], url = new URL(section.path, SITE_ORIGIN);
  if (item) url.searchParams.set(section.parameter, item.combinedCameras ? 'fabulosa-camera-channel' : String(item.id));
  return url.href;
}
export function metadata(kind, item) {
  const section = SEO_SECTIONS[kind];
  if (!item) return { title: section.title, description: section.description, url: contentUrl(kind), image: `${SITE_ORIGIN}/logo-fabulosa.png` };
  const name = String(item.title || section.label).trim(), extra = [kind === 'movies' ? item.year : item.frequency, item.country || item.genre || item.category].filter(Boolean).join(' · ');
  const description = kind === 'movies' ? `Vea ${name}${extra ? ` (${extra})` : ''} en Fabulosa Play. ${String(item.description || 'Consulte la información de la película y abra su reproductor online.').slice(0, 160)}` : `${kind === 'radios' ? 'Escuche' : 'Vea'} ${name} en vivo${extra ? ` · ${extra}` : ''} en Fabulosa Play. Abra el reproductor y comparta el enlace directo. La disponibilidad depende de la señal y su región.`;
  let image; try { const candidate = new URL(item.poster || item.logo || '/logo-fabulosa.png', SITE_ORIGIN); image = ['https:', 'http:'].includes(candidate.protocol) ? candidate.href : `${SITE_ORIGIN}/logo-fabulosa.png`; } catch { image = `${SITE_ORIGIN}/logo-fabulosa.png`; }
  return { title: `${name}${kind === 'movies' ? ' | Película online' : kind === 'radios' ? ' | Radio en vivo' : ' | TV en vivo'} | Fabulosa Play`, description, url: contentUrl(kind, item), image };
}
