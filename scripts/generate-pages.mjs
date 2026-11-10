import { readFile, writeFile } from 'node:fs/promises';
import { render, PAGE_META, SITE_URL, structuredData } from '../dist-ssr/prerender.js';
const template = await readFile('dist/index.html', 'utf8');
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
for (const [path, meta] of Object.entries(PAGE_META)) {
  const url = SITE_URL + path;
  const html = template
    .replace(/<title>.*?<\/title>/s, `<title>${escape(meta.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(">)/, `$1${escape(meta.description)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(">)/, `$1${url}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(">)/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(">)/, `$1${escape(meta.title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(">)/, `$1${escape(meta.description)}$2`)
    .replace(/(<script id="page-schema" type="application\/ld\+json">).*?(<\/script>)/s, (_, start, end) => start + JSON.stringify(structuredData(path)).replaceAll('<', '\\u003c') + end)
    .replace('<div id="root"></div>', () => '<div id="root">' + render(path) + '</div>');
  await writeFile(path === '/' ? 'dist/index.html' : `dist${path}.html`, html);
}
const paths = ['/', ...Object.keys(PAGE_META).filter(path => !['/', '/anfrage', '/impressum', '/agb', '/datenschutz', '/widerruf'].includes(path))];
await writeFile('dist/sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + paths.map(path => `  <url><loc>${SITE_URL}${path}</loc></url>`).join('\n') + '\n</urlset>\n');
console.log(`Prerendered ${Object.keys(PAGE_META).length} pages with unique metadata and sitemap.`);
