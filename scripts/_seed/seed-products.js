#!/usr/bin/env node
// One-off: merges scraped copy (data/_old/pages.json) with product-meta.js → data/products.json
// Re-running will overwrite data/products.json. After seeding, edit data/products.json directly.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..', '..');
const old = JSON.parse(fs.readFileSync(path.join(root, 'data/_old/pages.json'), 'utf8'));
const meta = require('./product-meta.js');
const oldBySlug = Object.fromEntries(old.map(p => [p.slug, p]));

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fixTypos = s => s
  .replace(/\btripple\b/gi, m => m[0] === 'T' ? 'Triple' : 'triple')
  .replace(/Surry hills/gi, 'Surrey Hills')
  .replace(/Surrey Hills garden Supplies/g, 'Surrey Hills Garden Supplies')
  .replace(/\(Read More\)/g, '')
  .replace(/\s+\./g, '.')
  .replace(/ {2,}/g, ' ');

function toHtml(body) {
  if (!body) return '';
  const blocks = body.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  const out = [];
  for (const b of blocks) {
    const lines = b.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.every(l => l.startsWith('- '))) {
      out.push('<ul>' + lines.map(l => `<li>${esc(fixTypos(l.slice(2)))}</li>`).join('') + '</ul>');
      continue;
    }
    if (/^Supplier:\s*https?:\/\//i.test(b)) {
      const url = b.replace(/^Supplier:\s*/i, '').replace(/\.$/, '');
      out.push(`<p class="supplier">Supplier: <a href="${esc(url)}" rel="nofollow noopener" target="_blank">${esc(url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0])}</a></p>`);
      continue;
    }
    if (/^https?:\/\/\S+$/.test(b)) {
      out.push(`<p class="supplier"><a href="${esc(b)}" rel="nofollow noopener" target="_blank">${esc(b.replace(/^https?:\/\/(www\.)?/, ''))}</a></p>`);
      continue;
    }
    if (lines.length === 1 && lines[0].length < 70 && !/[.!?]$/.test(lines[0]) && !/^(Available in|Sizes|Colours)/i.test(lines[0])) {
      out.push(`<h3>${esc(fixTypos(lines[0]))}</h3>`);
      continue;
    }
    // mixed block: text lines then bullets
    let para = [], list = [];
    const flush = () => { if (para.length) { out.push(`<p>${esc(fixTypos(para.join(' ')))}</p>`); para = []; } if (list.length) { out.push('<ul>' + list.map(l => `<li>${esc(fixTypos(l))}</li>`).join('') + '</ul>'); list = []; } };
    for (const l of lines) {
      if (l.startsWith('- ')) { if (para.length) { out.push(`<p>${esc(fixTypos(para.join(' ')))}</p>`); para = []; } list.push(l.slice(2)); }
      else { if (list.length) { out.push('<ul>' + list.map(x => `<li>${esc(fixTypos(x))}</li>`).join('') + '</ul>'); list = []; } para.push(l); }
    }
    flush();
  }
  return out.join('\n');
}

const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const products = meta.map(m => {
  const o = m.oldSlug ? oldBySlug[m.oldSlug] : null;
  let bodyHtml = o ? toHtml(o.bodyText) : '';
  if (m.slug === 'drainage-supplies') bodyHtml = '';
  const images = (m.images || []).map((base, i) => ({
    src: `/assets/img/products/${m.slug}-${i + 1}.webp`,
    oldSrc: `https://surreyhillsgardensupplies.com.au/wp-content/uploads/{{PATH}}/${base}`,
    oldBase: base,
    alt: `${m.name} ${m.category === 'tool-shop' || m.category === 'building-materials' ? 'at' : 'bulk and bagged supply at'} Surrey Hills Garden Supplies, Melbourne east`
  }));
  return {
    slug: m.slug,
    oldSlug: m.oldSlug,
    category: m.category,
    alsoIn: m.alsoIn || [],
    name: m.name,
    h1: m.name,
    searchName: m.searchName || m.name,
    keyword: m.keyword,
    title: m.title,
    metaDescription: m.metaDescription,
    short: m.short,
    intro: m.intro,
    bodyHtml,
    variants: m.variants || [],
    catalogue: !!m.catalogue,
    density: m.density,
    bagWeightKg: m.bagWeightKg,
    formats: Object.assign({ bag15kg: false, bag20kg: false, bulkerBag: false, bulkM3: false, byoTrailer: false, pickupOnly: false, roll: false, each: false }, m.formats),
    prices: { bag15kg: null, bag20kg: null, bulkerBag: null, bulkM3: null, note: "POA — prices supplied by the client; null renders as 'Call for price'" },
    minOrder: m.minOrder || null,
    images,
    fallbackImage: m.localImage,
    faqs: m.faqs || []
  };
});

// resolve old image paths from the media list captured in data/_old/image-urls.txt
const urlList = fs.existsSync(path.join(root, 'data/_old/image-urls.txt')) ? fs.readFileSync(path.join(root, 'data/_old/image-urls.txt'), 'utf8').split('\n') : [];
for (const p of products) for (const img of p.images) {
  const hit = urlList.find(u => u.replace(/\.(jpe?g|png)$/i, '').endsWith('/' + img.oldBase));
  img.oldSrc = hit || null;
  delete img.oldBase;
}

fs.writeFileSync(path.join(root, 'data/products.json'), JSON.stringify(products, null, 2) + '\n');
const words = s => (s || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
for (const p of products) {
  const w = words(p.intro) + words(p.bodyHtml) + p.faqs.reduce((a, f) => a + words(f.q) + words(f.a), 0);
  console.log(`${p.slug.padEnd(28)} words=${String(w).padStart(5)} imgs=${p.images.filter(i => i.oldSrc).length}/${p.images.length}`);
}
console.log('wrote data/products.json', products.length, 'products');
