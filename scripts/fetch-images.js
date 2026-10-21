#!/usr/bin/env node
/* Downloads the existing product photography from the current WordPress site (and any
   Higgsfield-generated gap images listed in data/generated-images.json) into
   assets/img/products-src/, then runs scripts/images.js to produce WebP sizes.

   Why this exists: the build sandbox used to create this repo could not reach
   surreyhillsgardensupplies.com.au or the Higgsfield CDN, so the product images are
   referenced by stable local paths and fetched here, on a machine with normal internet.

   Run:  npm run fetch-images   (Node 18+, no extra deps; uses the WP REST media API) */
const fs = require('fs'); const path = require('path');
const root = path.join(__dirname, '..');
const OUT = path.join(root, 'assets/img/products-src'); fs.mkdirSync(OUT, { recursive: true });
const products = JSON.parse(fs.readFileSync(path.join(root, 'data/products.json')));
const posts = JSON.parse(fs.readFileSync(path.join(root, 'data/posts.json')));
const gen = fs.existsSync(path.join(root, 'data/generated-images.json')) ? JSON.parse(fs.readFileSync(path.join(root, 'data/generated-images.json'))) : [];
const SITE = 'https://surreyhillsgardensupplies.com.au';

async function mediaIndex() {
  const idx = {};
  for (let page = 1; page < 10; page++) {
    const r = await fetch(`${SITE}/wp-json/wp/v2/media?per_page=100&page=${page}&_fields=source_url`);
    if (!r.ok) break;
    const arr = await r.json(); if (!arr.length) break;
    for (const m of arr) idx[path.basename(m.source_url).replace(/\.(jpe?g|png)$/i, '')] = m.source_url;
  }
  return idx;
}
async function dl(url, dest) {
  if (fs.existsSync(dest)) return 'skip';
  const r = await fetch(url); if (!r.ok) return 'FAIL ' + r.status;
  fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer())); return 'ok';
}
(async () => {
  const idx = await mediaIndex().catch(() => ({}));
  for (const p of products) {
    for (const img of p.images) {
      const local = path.basename(img.src).replace(/\.webp$/, '');      // e.g. 10mm-pine-bark-1
      let url = img.oldSrc;
      if (!url && img.oldBase) url = idx[img.oldBase];
      if (!url) { console.log('no source for', local); continue; }
      const ext = (url.match(/\.(jpe?g|png)$/i) || ['.jpg'])[0].toLowerCase().replace('jpeg', 'jpg');
      console.log(local, await dl(url, path.join(OUT, local + ext)));
    }
  }
  for (const post of posts) {
    const url = (post.heroImage || '').replace(/^http:/, 'https:'); if (!url) continue;
    const ext = (url.match(/\.(jpe?g|png)$/i) || ['.jpg'])[0].toLowerCase().replace('jpeg', 'jpg');
    console.log('post ' + post.slug, await dl(url, path.join(OUT, 'post-' + post.slug + ext)));
  }
  for (const g of gen) {
    if (!g.url) continue;
    console.log('generated ' + g.file, await dl(g.url, path.join(OUT, g.file + (g.url.match(/\.(jpe?g|png|webp)$/i) || ['.jpg'])[0].toLowerCase().replace('jpeg', 'jpg'))));
  }
  require('child_process').execFileSync('node', [path.join(__dirname, 'images.js')], { stdio: 'inherit' });
})();
