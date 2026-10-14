import { useEffect } from 'react';
import { metadata, SITE_ORIGIN } from '../utils/seoMetadata';
export default function usePageSeo(kind, item) {
  const meta = metadata(kind, item);
  const about = item ? JSON.stringify({ "@type": kind === "movies" ? "Movie" : kind === "radios" ? "RadioStation" : "BroadcastService", name: item.title }) : "";
  useEffect(() => {
    document.title = meta.title;
    const tag = (selector, attributes) => {
      let node = document.head.querySelector(selector);
      if (!node) { node = document.createElement(selector.startsWith('link') ? 'link' : 'meta'); document.head.appendChild(node); }
      for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value);
    };
    tag('meta[name="description"]', { name: 'description', content: meta.description });
    tag('link[rel="canonical"]', { rel: 'canonical', href: meta.url });
    for (const [name, value] of Object.entries({ title: meta.title, description: meta.description, url: meta.url, image: meta.image })) tag(`meta[property="og:${name}"]`, { property: `og:${name}`, content: value });
    for (const [name, value] of Object.entries({ title: meta.title, description: meta.description, image: meta.image })) tag(`meta[name="twitter:${name}"]`, { name: `twitter:${name}`, content: value });
    tag('meta[name="robots"]', { name: 'robots', content: 'index,follow,max-image-preview:large' });
    let schema = document.getElementById('fabulosa-seo');
    if (!schema) { schema = document.createElement('script'); schema.type = 'application/ld+json'; schema.id = 'fabulosa-seo'; document.head.appendChild(schema); }
    schema.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': about ? 'WebPage' : 'CollectionPage', name: meta.title, url: meta.url, description: meta.description, inLanguage: 'es', ...(about ? { about: JSON.parse(about) } : {}) });
    return () => {
      const home = { title: 'TV en vivo, radio online y películas | Fabulosa Play', description: 'Fabulosa Play reúne canales de televisión en vivo, emisoras de radio online y películas. Explore señales de Costa Rica, Panamá y Latinoamérica.', url: SITE_ORIGIN+'/', image: SITE_ORIGIN+'/logo-fabulosa.png' };
      document.title = home.title;
      tag('meta[name="description"]', { name: 'description', content: home.description });
      tag('link[rel="canonical"]', { rel: 'canonical', href: home.url });
      for (const [name, value] of Object.entries(home)) tag(`meta[property="og:${name}"]`, { property: `og:${name}`, content: value });
      for (const [name, value] of Object.entries({ title: home.title, description: home.description, image: home.image })) tag(`meta[name="twitter:${name}"]`, { name: `twitter:${name}`, content: value });
      schema.remove();
    };
  }, [meta.title, meta.description, meta.url, meta.image, about]);
}
