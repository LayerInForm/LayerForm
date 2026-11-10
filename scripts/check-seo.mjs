import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { PAGE_META, SERVICE_PAGES, SITE_URL } from '../dist-ssr/prerender.js';
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
const titles = new Set();
for (const [path, meta] of Object.entries(PAGE_META)) {
  const html = await readFile(path === '/' ? 'dist/index.html' : `dist${path}.html`, 'utf8');
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${path}: exactly one H1`);
  assert(html.includes(`rel="canonical" href="${SITE_URL}${path}"`), `${path}: canonical`);
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert(title && !titles.has(title), `${path}: unique title`); titles.add(title);
  const graph = JSON.parse(html.match(/<script id="page-schema" type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert.equal(graph['@graph'].find(item => item['@type'] === 'WebPage').url, SITE_URL + path);
  assert(meta.description.length > 0);
  for (const match of html.matchAll(/(?:src|href)="(\/(?:assets|projects)\/[^"?#]+)"/g)) await access('dist' + match[1]);
  for (const service of SERVICE_PAGES) assert(html.includes(`href="${service.path}"`), `${path}: service link`);
  const service = SERVICE_PAGES.find(page => page.path === path);
  if (service) {
    assert(html.includes(service.heading), `${path}: content without JavaScript`);
    assert.equal((html.match(/<details\b/g) || []).length, service.faqs.length);
    assert(sitemap.includes(`<loc>${SITE_URL}${path}</loc>`));
    assert(html.includes('/anfrage?thema='), `${path}: inquiry link`);
  }
}
for (const privatePath of ['/intern', '/api/', '/kalk']) assert(!sitemap.includes(privatePath));
assert.equal((sitemap.match(/<loc>/g) || []).length, 5);
console.log('SEO checks passed: 10 rendered pages, titles, H1s, canonicals, JSON-LD, internal links, assets and sitemap.');
