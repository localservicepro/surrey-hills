#!/usr/bin/env node
/* Prints a markdown table of every built page: path, title (len), description (len), H1, schema types, word count.
   Used to refresh SEO-CHECKLIST.md after a build:  node scripts/seo-table.js > /tmp/seo.md */
const fs = require('fs'); const path = require('path');
const SITE = path.join(__dirname, '..', 'site');
function walk(d, out = []) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p, out); else if (e.name === 'index.html') out.push(p); } return out; }
const rows = walk(SITE).map(f => {
  const html = fs.readFileSync(f, 'utf8');
  const url = '/' + path.relative(SITE, path.dirname(f)).replace(/\\/g, '/') + '/';
  const g = (re) => (html.match(re) || [])[1] || '';
  const title = g(/<title>([^<]*)<\/title>/); const desc = g(/<meta name="description" content="([^"]*)"/); const h1 = g(/<h1[^>]*>([\s\S]*?)<\/h1>/).replace(/<[^>]+>/g, '').trim();
  const schemas = [...html.matchAll(/"@type":"([^"\]]+)"/g)].map(m => m[1]).filter((v, i, a) => a.indexOf(v) === i && !['PostalAddress', 'City', 'ListItem', 'Question', 'Answer', 'Brand', 'Offer', 'Organization', 'ImageObject', 'GeoCoordinates'].includes(v));
  const main = (html.match(/<main[\s\S]*<\/main>/) || [''])[0].replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
  const words = main.split(/\s+/).filter(Boolean).length;
  const noindex = /noindex/.test(html) ? ' (noindex)' : '';
  return { url: url.replace('//', '/'), title, desc, h1, schemas: schemas.join(', '), words, noindex };
}).sort((a, b) => a.url.localeCompare(b.url));
console.log('| URL | Title (chars) | Meta description (chars) | H1 | Schema | Words |');
console.log('|---|---|---|---|---|---|');
for (const r of rows) console.log(`| ${r.url}${r.noindex} | ${r.title} (${r.title.length}) | ${r.desc} (${r.desc.length}) | ${r.h1} | ${r.schemas} | ${r.words} |`);
