#!/usr/bin/env node
/* Surrey Hills Garden Supplies — static site generator.
   Reads /data/*.json, writes /site/**. No dependencies (sharp is optional, for image dimensions).
   Run: npm run build */
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const SITE = path.join(root, 'site');
const D = (f) => JSON.parse(fs.readFileSync(path.join(root, 'data', f), 'utf8'));
const biz = D('business.json');
const categories = D('categories.json');
const products = D('products.json');
const suburbs = D('suburbs.json');
const posts = D('posts.json').sort((a, b) => b.date.localeCompare(a.date));
const generated = fs.existsSync(path.join(root, 'data/generated-images.json')) ? D('generated-images.json') : [];
const BASE = biz.website.replace(/\/$/, '');
const TODAY = new Date().toISOString().slice(0, 10);
let sharp = null; try { sharp = require('sharp'); } catch (e) {}

const warnings = [];
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const words = (html) => String(html || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
const catBySlug = Object.fromEntries(categories.map(c => [c.slug, c]));
const prodBySlug = Object.fromEntries(products.map(p => [p.slug, p]));
const prodPath = (p) => `/${p.category}/${p.slug}/`;
const catProducts = (c) => products.filter(p => p.category === c.slug);
const catAlsoProducts = (c) => products.filter(p => (p.alsoIn || []).includes(c.slug));
const NAV = [
  ['Mulch', '/mulch/'], ['Soil & Sand', '/soil/'], ['Rock & Stone', '/rock-and-stone/'], ['Concrete', '/concrete-products/'],
  ['Tool Shop', '/tool-shop/'], ['Grass', '/grass/'], ['Building Materials', '/building-materials/'],
  ['Calculator', '/calculator/'], ['Blog', '/blog/'], ['Contact', '/contact/']
];
const NAV_MOBILE = NAV.concat([['Drainage', '/drainage/'], ['Delivery', '/delivery/'], ['Areas', '/areas/'], ['About', '/about/']]);

/* ---------------- images ---------------- */
const dimsCachePath = path.join(root, 'data/_image-dims.json');
const dims = fs.existsSync(dimsCachePath) ? JSON.parse(fs.readFileSync(dimsCachePath)) : {};
const imgExists = (rel) => fs.existsSync(path.join(root, rel.replace(/^\//, '')));
const genByFile = Object.fromEntries(generated.map(g => [g.file, g]));
/** Resolve an image base ("yard-01", "products/10mm-pine-bark-1") to srcset data or null */
function resolveImg(base) {
  const b800 = `/assets/img/${base}-800.webp`;
  if (!imgExists(b800)) return null;
  const out = { src: b800, srcset: [400, 800, 1600].filter(w => imgExists(`/assets/img/${base}-${w}.webp`)).map(w => `/assets/img/${base}-${w}.webp ${w}w`).join(', ') };
  const d = dims[base + '-800'];
  if (d) { out.w = d[0]; out.h = d[1]; }
  const g = genByFile[path.basename(base)];
  if (g) out.generated = true;
  return out;
}
function img(base, alt, opts = {}) {
  const r = resolveImg(base) || (opts.fallback ? resolveImg(opts.fallback) : null);
  if (!r) { warnings.push(`missing image: ${base}`); return `<div class="img-missing" aria-hidden="true" style="background:var(--c-sand);width:100%;height:100%"></div>`; }
  const sizes = opts.sizes || '(min-width: 960px) 33vw, (min-width: 640px) 50vw, 100vw';
  const eager = opts.eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"';
  const wh = r.w ? ` width="${r.w}" height="${r.h}"` : '';
  const cls = opts.class ? ` class="${opts.class}"` : '';
  return `<img src="${r.src}" srcset="${r.srcset}" sizes="${sizes}" alt="${esc(alt)}"${wh} ${eager}${cls}>`;
}
const productImg = (p, i, alt, opts = {}) => img(`products/${p.slug}-${i}`, alt, Object.assign({ fallback: p.fallbackImage }, opts));
const productHasImg = (p, i) => !!resolveImg(`products/${p.slug}-${i}`);

/* ---------------- icons ---------------- */
const I = {
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
  calc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8" y2="10.01"/><line x1="12" y1="10" x2="12" y2="10.01"/><line x1="16" y1="10" x2="16" y2="10.01"/><line x1="8" y1="14" x2="8" y2="14.01"/><line x1="12" y1="14" x2="12" y2="14.01"/><line x1="16" y1="14" x2="16" y2="18"/><line x1="8" y1="18" x2="8" y2="18.01"/><line x1="12" y1="18" x2="12" y2="18.01"/></svg>',
  quote: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 7h12l1 14H5z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 8h13v8H1z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="5.5" cy="18.5" r="1.8"/><circle cx="17.5" cy="18.5" r="1.8"/></svg>',
  trailer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 9h13v7H2z"/><path d="M15 13h7"/><circle cx="8" cy="18.5" r="1.8"/><path d="M5 9V6h7v3"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  ruler: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 17 17 3l4 4L7 21z"/><path d="m7 13 2 2M10 10l2 2M13 7l2 2"/></svg>',
  fb: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.3c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.4H7.4V14h2.8v8z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>'
};

/* ---------------- schema ---------------- */
const addressSchema = {
  '@type': 'PostalAddress', streetAddress: `${biz.address.streetNumber} ${biz.address.streetName}`, addressLocality: biz.address.suburb,
  addressRegion: biz.address.state, postalCode: biz.address.postcode, addressCountry: biz.address.country
};
function localBusiness() {
  const o = {
    '@context': 'https://schema.org', '@type': biz.schemaTypes, '@id': `${BASE}/#business`, name: biz.name, url: `${BASE}/`,
    telephone: biz.phoneTel, email: biz.email, image: `${BASE}${biz.ogImage}`, logo: `${BASE}${biz.logo}`,
    address: addressSchema, priceRange: biz.priceRange, foundingDate: String(biz.tradingSince),
    areaServed: suburbs.map(s => ({ '@type': 'City', name: s.name })),
    sameAs: [biz.social.facebook, biz.social.instagram].concat(biz.gbpUrl && !/\{\{/.test(biz.gbpUrl) ? [biz.gbpUrl] : [])
  };
  if (biz.geo && !/\{\{/.test(biz.geo.latitude)) o.geo = { '@type': 'GeoCoordinates', latitude: biz.geo.latitude, longitude: biz.geo.longitude };
  if (biz.openingHoursSpecification && typeof biz.openingHoursSpecification === 'object') o.openingHoursSpecification = biz.openingHoursSpecification;
  return o;
}
const breadcrumb = (items) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it[0], item: `${BASE}${it[1]}` })) });
const faqSchema = (faqs) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });

/* ---------------- layout ---------------- */
function layout(page) {
  const canonical = `${BASE}${page.path}`;
  const title = page.title; const desc = page.description;
  if (title.length > 60) warnings.push(`title >60 (${title.length}): ${page.path}`);
  if (desc.length > 155) warnings.push(`description >155 (${desc.length}): ${page.path}`);
  const ogImg = page.ogImage ? `${BASE}${page.ogImage}` : `${BASE}${biz.ogImage}`;
  const schemas = [localBusiness()].concat(page.schemas || []);
  const heroPreload = page.preload ? `<link rel="preload" as="image" href="${page.preload.src}" imagesrcset="${esc(page.preload.srcset)}" imagesizes="100vw">` : '';
  const robots = page.noindex ? '<meta name="robots" content="noindex, nofollow">' : '<meta name="robots" content="index, follow, max-image-preview:large">';
  const crumbsHtml = page.crumbs ? `<nav class="crumbs" aria-label="Breadcrumb"><ol>${page.crumbs.map((c, i) => i === page.crumbs.length - 1 ? `<li><span aria-current="page">${esc(c[0])}</span></li>` : `<li><a href="${c[1]}">${esc(c[0])}</a></li>`).join('')}</ol></nav>` : '';
  return `<!DOCTYPE html>
<html lang="en-AU" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${robots}
<link rel="canonical" href="${canonical}">
<meta property="og:locale" content="en_AU">
<meta property="og:type" content="${page.ogType || 'website'}">
<meta property="og:site_name" content="${esc(biz.name)}">
<meta property="og:title" content="${esc(page.ogTitle || title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImg}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#171a14">
<link rel="icon" href="/assets/img/logo/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="/assets/img/logo/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/barlow-semi-condensed-800.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/inter-variable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/img/logo/surrey-hills-garden-supplies-logo.png" as="image">
${heroPreload}
<link rel="stylesheet" href="/assets/css/tokens.css">
<link rel="stylesheet" href="/assets/css/main.css">
<script>document.documentElement.classList.remove('no-js')</script>
${schemas.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n')}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="header">
  <div class="wrap header__in">
    <a class="logo" href="/" aria-label="${esc(biz.name)} home"><img src="${biz.logo}" alt="${esc(biz.name)}" width="476" height="120"></a>
    <nav class="nav" aria-label="Main"><ul>${NAV.map(n => `<li><a href="${n[1]}">${esc(n[0])}</a></li>`).join('')}</ul></nav>
    <div class="header__right">
      <div class="header__phone"><a class="btn btn--primary" href="tel:${biz.phoneTel}">${I.phone}<span>${esc(biz.phoneDisplay)}</span></a></div>
      <a class="header__call" href="tel:${biz.phoneTel}" aria-label="Call ${esc(biz.phoneDisplay)}">${I.phone}</a>
      <button class="burger" aria-expanded="false" aria-controls="mobile-nav" aria-label="Menu"><span></span><span></span><span></span></button>
    </div>
  </div>
  <nav class="mobile-nav" id="mobile-nav" data-open="false" aria-label="Mobile"><ul>${NAV_MOBILE.map(n => `<li><a href="${n[1]}">${esc(n[0])}</a></li>`).join('')}</ul></nav>
</header>
<main id="main">
${page.hero ? page.hero.replace('{{CRUMBS}}', crumbsHtml) : ''}
${page.body}
</main>
${page.noCta ? '' : ctaBand(page.ctaText)}
${footer()}
<nav class="bottombar" aria-label="Quick actions">
  <a href="tel:${biz.phoneTel}">${I.phone}Call</a>
  <a href="/calculator/">${I.calc}Calculator</a>
  <a href="/contact/#quote">${I.quote}Get a Quote</a>
</nav>
<script src="/assets/js/main.js" defer></script>
${page.calculator ? `<script id="calc-products" type="application/json">${calcProductsJson()}</script>\n<script src="/assets/js/calculator.js" defer></script>` : ''}
</body>
</html>
`;
}
function ctaBand(text) {
  return `<section class="cta cut-top" aria-labelledby="cta-h">
  <div class="wrap cta__in">
    <div><h2 id="cta-h">${I.clock.replace('aria-hidden="true"', 'aria-hidden="true" style="width:.9em;height:.9em;vertical-align:-.1em"')} Deliveries in less than 2 hours</h2><p>${esc(text || "Tell us the product, the quantity and your suburb. We'll confirm a price and a delivery time on the phone.")}</p></div>
    <div class="cta__actions"><a class="cta__phone" href="tel:${biz.phoneTel}">${esc(biz.phoneDisplay)}</a><a class="btn btn--dark" href="/contact/#quote">Get a quote</a></div>
  </div>
</section>`;
}
function footer() {
  const catLinks = categories.map(c => `<li><a href="/${c.slug}/">${esc(c.name)}</a></li>`).join('');
  const subLinks = suburbs.map(s => `<li><a href="/areas/${s.slug}/">${esc(s.name)}</a></li>`).join('');
  return `<footer class="footer">
  <div class="wrap">
    <div class="footer__grid" style="padding-top:3rem">
      <div>
        <div class="logo-tile"><img src="${biz.logo}" alt="${esc(biz.name)}" width="476" height="120" loading="lazy"></div>
        <p><strong style="color:#fff">${esc(biz.name)}</strong><br>Garden, landscape and building supplies in Melbourne's east since ${biz.tradingSince}. Trade and public welcome.</p>
        <address>${esc(biz.address.formatted)}<br><a href="tel:${biz.phoneTel}">${esc(biz.phoneDisplay)}</a><br><a href="mailto:${biz.email}">${biz.email}</a></address>
        <p class="small">Hours: ${esc(biz.hours)}</p>
        <div class="footer__social">
          <a href="${biz.social.facebook}" aria-label="Facebook" rel="noopener" target="_blank">${I.fb}</a>
          <a href="${biz.social.instagram}" aria-label="Instagram" rel="noopener" target="_blank">${I.ig}</a>
        </div>
      </div>
      <div><h3 class="footer__h">Products</h3><ul>${catLinks}<li><a href="/calculator/">Volume calculator</a></li></ul></div>
      <div><h3 class="footer__h">Company</h3><ul><li><a href="/about/">About</a></li><li><a href="/delivery/">Delivery</a></li><li><a href="/contact/">Contact</a></li><li><a href="/blog/">Blog</a></li><li><a href="/order/">Order online</a></li><li><a href="/privacy/">Privacy</a></li></ul></div>
      <div><h3 class="footer__h">We deliver to</h3><ul>${subLinks}<li><a href="/areas/">All areas</a></li></ul></div>
    </div>
    <div class="footer__bottom"><span>© ${new Date().getFullYear()} ${esc(biz.name)}. ABN ${esc(biz.abn)}.</span><span>${esc(biz.address.formatted)}</span></div>
  </div>
</footer>`;
}
function calcProductsJson() {
  return JSON.stringify(products.filter(p => p.density).map(p => ({ slug: p.slug, name: p.name, path: prodPath(p), density: p.density, bagWeightKg: p.bagWeightKg || 15, formats: p.formats, minOrder: p.minOrder || null })));
}

/* ---------------- shared sections ---------------- */
function hero(opts) {
  const { h1, sub, text, imgBase, imgAlt, ctas, badges, page, crumbs } = opts;
  const r = resolveImg(imgBase) || resolveImg('yard-01');
  const video = (opts.video && fs.existsSync(path.join(root, 'assets/video/hero.mp4'))) ? `<video class="hero__video" autoplay muted loop playsinline preload="metadata" poster="${r ? r.src.replace('-800', '-1600') : ''}" aria-hidden="true"><source src="/assets/video/hero.webm" type="video/webm"><source src="/assets/video/hero.mp4" type="video/mp4"></video>` : '';
  const media = r ? `<div class="hero__media"><img class="${video ? '' : 'hero__kb'}" src="${r.src}" srcset="${r.srcset}" sizes="100vw" alt="${esc(imgAlt || '')}" fetchpriority="high" decoding="async"${r.w ? ` width="${r.w}" height="${r.h}"` : ''}>${video}</div>` : '';
  return { html: `<section class="hero ${page ? 'hero--page' : ''} cut-bottom">${media}<div class="wrap hero__in">${crumbs ? '{{CRUMBS}}' : ''}<h1 class="h-anim">${h1}</h1>${sub ? `<p class="hero__sub h-anim">${sub}</p>` : ''}${text ? `<p class="hero__text h-anim">${text}</p>` : ''}${ctas ? `<div class="hero__cta h-anim">${ctas}</div>` : ''}${badges ? `<div class="hero__badges h-anim">${badges.map(b => `<span>${esc(b)}</span>`).join('')}</div>` : ''}</div></section>`, preload: r };
}
const heroCtas = `<a class="btn btn--primary" href="tel:${biz.phoneTel}">${I.phone}Call ${esc(biz.phoneDisplay)}</a><a class="btn btn--ghost" href="/contact/#quote">Get a quote</a>`;
function fulfilmentStrip() {
  return `<section class="strip" aria-label="How we supply">
  <div class="wrap"><div class="strip__in">
    <div class="strip__item reveal">${I.bag}<div><div class="strip__num"><span data-count="15">15</span>kg</div><div class="strip__label">Bags for pickup</div><div class="strip__sub">Every bulk product bagged at the yard (20kg kiln dried sand, 1-tonne bulker bags)</div></div></div>
    <div class="strip__item reveal">${I.truck}<div><div class="strip__num">Bulk</div><div class="strip__label">Truck loads delivered</div><div class="strip__sub">By the cubic metre on our tippers</div></div></div>
    <div class="strip__item reveal">${I.trailer}<div><div class="strip__num">BYO</div><div class="strip__label">Trailer loaded</div><div class="strip__sub">Back up to the bay and we load it</div></div></div>
    <div class="strip__item reveal">${I.clock}<div><div class="strip__num">&lt;<span data-count="2">2</span>hr</div><div class="strip__label">Eastern suburbs delivery</div><div class="strip__sub">Put us to the test</div></div></div>
  </div></div>
</section>`;
}
function faqSection(faqs, title) {
  if (!faqs || !faqs.length) return '';
  return `<section class="section section--alt" aria-labelledby="faq-h"><div class="wrap"><div class="section-head"><p class="eyebrow">Good to know</p><h2 id="faq-h">${esc(title || 'Frequently asked questions')}</h2></div><div class="faq">${faqs.map(f => `<details class="reveal"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div></div></section>`;
}
function suburbChips(list, dark) {
  return `<ul class="chips">${(list || suburbs).map(s => `<li><a href="/areas/${s.slug}/">${esc(s.name)}</a></li>`).join('')}<li><a href="/areas/">All delivery areas →</a></li></ul>`;
}
function productCard(p, alt) {
  const f = p.formats || {};
  const badges = [f.bag15kg && '15kg bags', f.bag20kg && '20kg bags', f.bulkerBag && 'Bulker bag', f.bulkM3 && 'Bulk m³', f.byoTrailer && 'BYO trailer', f.roll && 'By the roll', (f.pickupOnly && !f.each && !f.roll) && 'Yard pickup'].filter(Boolean);
  return `<a class="card reveal" href="${prodPath(p)}"><div class="card__media">${productImg(p, 1, alt || `${p.name} at Surrey Hills Garden Supplies`)}</div><div class="card__body"><h3>${esc(p.name)}</h3><p>${esc(p.short)}</p><div class="badges">${badges.map(b => `<span class="badge badge--green">${b}</span>`).join('')}</div><span class="card__link">View ${esc(p.name.toLowerCase())}</span></div></a>`;
}
function calculatorHtml({ productSlug, compact, heading }) {
  const opts = products.filter(p => p.density).map(p => `<option value="${p.slug}"${p.slug === productSlug ? ' selected' : ''}>${esc(p.name)}</option>`).join('');
  return `<div class="calc ${compact ? 'calc--compact' : ''}" data-calculator${productSlug ? ` data-product="${productSlug}"` : ''}>
  <div class="calc__head"><h3>${esc(heading || 'How much do I need?')}</h3><span>Volume calculator</span></div>
  <div class="calc__body">
    <form action="/calculator/" method="get" novalidate>
      <fieldset>
        <legend>Area</legend>
        <div class="seg" role="radiogroup" aria-label="Shape"><input type="radio" name="shape" id="sh-r-${compact ? 'c' : 'f'}" value="rectangle" checked><label for="sh-r-${compact ? 'c' : 'f'}">Rectangle</label><input type="radio" name="shape" id="sh-c-${compact ? 'c' : 'f'}" value="circle"><label for="sh-c-${compact ? 'c' : 'f'}">Circle</label></div>
        <div class="calc__rect field--row"><div class="field"><label for="len-${compact ? 'c' : 'f'}">Length (m)</label><input type="number" inputmode="decimal" step="0.1" min="0" name="length" id="len-${compact ? 'c' : 'f'}" placeholder="e.g. 6"></div><div class="field"><label for="wid-${compact ? 'c' : 'f'}">Width (m)</label><input type="number" inputmode="decimal" step="0.1" min="0" name="width" id="wid-${compact ? 'c' : 'f'}" placeholder="e.g. 4"></div></div>
        <div class="calc__circle field" hidden><label for="dia-${compact ? 'c' : 'f'}">Diameter (m)</label><input type="number" inputmode="decimal" step="0.1" min="0" name="diameter" id="dia-${compact ? 'c' : 'f'}" placeholder="e.g. 3"></div>
        <div class="field"><label for="dep-${compact ? 'c' : 'f'}">Depth (mm)</label><input type="number" inputmode="numeric" step="5" min="0" name="depth" id="dep-${compact ? 'c' : 'f'}" value="100"><div class="depth-presets" aria-label="Depth presets"><button type="button" data-depth="50">50</button><button type="button" data-depth="75">75</button><button type="button" data-depth="100" aria-pressed="true">100</button><button type="button" data-depth="150">150</button></div></div>
        <div class="field"><label for="prod-${compact ? 'c' : 'f'}">Product</label><select name="product" id="prod-${compact ? 'c' : 'f'}">${opts}</select></div>
        <label class="toggle"><input type="checkbox" name="wastage" value="1"> Add 10% for wastage and settling</label>
        <button class="btn btn--primary btn--sm" type="submit">Calculate</button>
        <p class="calc__nojs">Enter your measurements; results appear here when JavaScript is enabled, or call ${esc(biz.phoneDisplay)} and we will work it out with you.</p>
      </fieldset>
    </form>
    <div class="calc__results" hidden aria-live="polite">
      <div class="result"><span>Area</span><strong data-out="area">—</strong></div>
      <div class="result result--hero"><span>Volume (rounded up to 0.25 m³)</span><strong data-out="m3">—</strong></div>
      <div class="result"><span>Approx. weight</span><strong data-out="tonnes">—</strong></div>
      <div class="result" data-row="bags"><span>Bags</span><strong data-out="bags">—</strong></div>
      <p class="calc__rec"></p>
      <p class="calc__note">For <span data-out="product"></span>. Guide only: densities vary with moisture. <a class="calc__productlink" href="/">See product</a>.</p>
      <a class="btn btn--dark btn--sm calc__quote" href="/contact/#quote">Get a quote for this</a>
    </div>
  </div>
</div>`;
}

/* ---------------- pages ---------------- */
const pages = [];
function add(p) { pages.push(p); }

/* HOME */
(function home() {
  const h = hero({
    h1: 'Garden &amp; Landscape Supplies in Surrey Hills, Melbourne',
    sub: 'Deliveries in less than 2 hours — put us to the test',
    text: `Mulch, soil, sand, rock, cement, synthetic grass, tools and building materials from our yard on Canterbury Road. Bagged for pickup, loaded into your trailer, or delivered in bulk across Melbourne's eastern suburbs. Trade and public welcome.`,
    imgBase: resolveImg('products/gen-brand-yard') ? 'products/gen-brand-yard' : (resolveImg('products/gen-hero-yard') ? 'products/gen-hero-yard' : 'yard-01'),
    imgAlt: 'Surrey Hills Garden Supplies yard: loader filling a branded tipper truck beside bays of mulch, soil, sand and rock',
    ctas: heroCtas, badges: ['Trading since ' + biz.tradingSince, 'Trade & public', 'Australian distributor of Smart Grass'], video: true
  });
  const tiles = categories.map((c, i) => `<a class="tile reveal" href="/${c.slug}/">${img(c.image, c.imageAlt, { sizes: '(min-width: 960px) 33vw, (min-width: 640px) 50vw, 100vw' })}<div class="tile__body"><h3>${esc(c.name)}</h3><p>${esc(c.tile)}</p></div><span class="tile__bar"></span></a>`).join('');
  const topBulk = ['10mm-pine-bark', 'blended-soil', 'washed-sand', 'crushed-rock', 'scoria', 'kiln-dried-sand'].map(s => prodBySlug[s]);
  const body = `
${fulfilmentStrip()}
<section class="section" aria-labelledby="cats-h"><div class="wrap">
  <div class="section-head"><p class="eyebrow">What we supply</p><h2 id="cats-h">Everything for the garden, the landscape and the build</h2><p class="lede">Nine ranges held in bays and on shelves at the Surrey Hills yard. Tap a range to see products, formats and the calculator.</p></div>
  <div class="grid grid--3">${tiles}</div>
</div></section>
<section class="section section--alt" aria-labelledby="pop-h"><div class="wrap">
  <div class="section-head"><p class="eyebrow">Most ordered</p><h2 id="pop-h">Bulk products our eastern suburbs customers order most</h2></div>
  <div class="grid grid--3">${topBulk.map(p => productCard(p, `${p.name} bulk delivery Surrey Hills, Melbourne east`)).join('')}</div>
</div></section>
<section class="section" aria-labelledby="how-h"><div class="wrap">
  <div class="section-head"><p class="eyebrow">How we deliver</p><h2 id="how-h">Three ways to get it home</h2><p class="lede">Same bays, same product, your choice of how it travels. Pick the one that suits the job size.</p></div>
  <div class="how">
    <ol class="steps">
      <li class="step reveal"><div class="step__icon">${I.bag}</div><div class="step__num">01</div><h3>Bagged for pickup</h3><p>Every bulk product is bagged into 15kg bags at the yard (20kg for kiln dried sand, 1-tonne bulker bags). Grab a few for a top-up.</p><span class="step__tag">Small jobs · top-ups</span></li>
      <li class="step reveal"><div class="step__icon">${I.trailer}</div><div class="step__num">02</div><h3>BYO trailer</h3><p>Back your trailer up to the bay and we load it with the loader. A 6×4 trailer carries about half a cubic metre.</p><span class="step__tag">Up to ~0.5 m³ per trip</span></li>
      <li class="step reveal"><div class="step__icon">${I.truck}</div><div class="step__num">03</div><h3>Bulk delivered</h3><p>Order by the cubic metre and one of our tippers brings it to the kerb, driveway or site. Eastern suburbs: under two hours.</p><span class="step__tag">1 m³ and up · under 2 hrs</span></li>
    </ol>
    <div class="how__media reveal">
      <figure class="how__photo">${img(resolveImg('products/gen-brand-trucks') ? 'products/gen-brand-trucks' : (resolveImg('products/gen-tipper-delivery') ? 'products/gen-tipper-delivery' : 'yard-01'), 'Surrey Hills Garden Supplies tipper truck and trailer loaded with mulch and sand at the yard', { sizes: '(min-width: 960px) 45vw, 100vw' })}<figcaption class="how__badge"><strong>&lt;<span data-count="2">2</span> hrs</strong><span>eastern suburbs delivery</span></figcaption></figure>
      <figure class="how__photo how__photo--small">${img(resolveImg('products/gen-tipper-delivery') ? 'products/gen-tipper-delivery' : 'mulch-02', 'Tipper truck delivering bulk mulch to a driveway in the eastern suburbs of Melbourne', { sizes: '(min-width: 960px) 22vw, 50vw' })}</figure>
      <figure class="how__photo how__photo--small">${img(resolveImg('products/gen-brand-bags') ? 'products/gen-brand-bags' : (resolveImg('products/gen-bags-15kg') ? 'products/gen-bags-15kg' : 'soil-04'), 'Pallets of 15kg bagged mulch and soil and a bulker bag ready for pickup at Surrey Hills Garden Supplies', { sizes: '(min-width: 960px) 22vw, 50vw' })}</figure>
    </div>
  </div>
  <p style="margin-top:1.6rem"><a class="btn btn--dark" href="/delivery/">Delivery zones &amp; truck sizes</a> &nbsp; <a class="btn btn--ghost" href="/calculator/">${I.calc}Work out quantities</a></p>
</div></section>
<section class="stats-band" aria-label="The yard in numbers"><div class="wrap stats-band__in">
  <div class="stat-big reveal"><strong><span data-count="${categories.length}">${categories.length}</span></strong><span>product ranges</span></div>
  <div class="stat-big reveal"><strong><span data-count="${products.length}">${products.length}</span>+</strong><span>products on the yard</span></div>
  <div class="stat-big reveal"><strong><span data-count="${suburbs.length}">${suburbs.length}</span></strong><span>eastern suburbs delivered to</span></div>
  <div class="stat-big reveal"><strong>${biz.tradingSince}</strong><span>trading on Canterbury Road since</span></div>
</div></section>
<section class="section section--sand cut-both" aria-labelledby="calc-h"><div class="wrap">
  <div class="split split--rev">
    <div class="reveal">${calculatorHtml({ compact: true, heading: 'Quick volume calculator' })}</div>
    <div class="reveal"><p class="eyebrow">Work it out</p><h2 id="calc-h">How many cubic metres, tonnes or bags?</h2><p>Measure the bed, pick a depth and a product. The calculator rounds up to the nearest quarter metre, converts to tonnes using the product's density and counts the bags.</p>
      <div class="coverage-chart" role="img" aria-label="One cubic metre covers 20 square metres at 50 millimetres, 13 at 75, 10 at 100 and 6.5 at 150"><p class="coverage-chart__title">What 1 m³ covers</p>
        <div class="cbar"><span class="cbar__label">50 mm</span><span class="cbar__track"><span class="cbar__fill" style="--w:100%"></span></span><span class="cbar__val">20 m²</span></div>
        <div class="cbar"><span class="cbar__label">75 mm</span><span class="cbar__track"><span class="cbar__fill" style="--w:65%"></span></span><span class="cbar__val">13 m²</span></div>
        <div class="cbar"><span class="cbar__label">100 mm</span><span class="cbar__track"><span class="cbar__fill" style="--w:50%"></span></span><span class="cbar__val">10 m²</span></div>
        <div class="cbar"><span class="cbar__label">150 mm</span><span class="cbar__track"><span class="cbar__fill" style="--w:33%"></span></span><span class="cbar__val">6.5 m²</span></div>
      </div>
      <p><a class="btn btn--dark" href="/calculator/">Open the full calculator</a></p></div>
  </div>
</div></section>
<section class="section" aria-labelledby="trust-h"><div class="wrap">
  <div class="section-head section-head--center"><p class="eyebrow">Why Surrey Hills</p><h2 id="trust-h">A local yard, not a call centre</h2></div>
  <div class="trust-wrap">
  ${resolveImg('products/gen-brand-storefront') ? `<figure class="trust__photo reveal">${img('products/gen-brand-storefront', 'Surrey Hills Garden Supplies yard entrance and signage on Canterbury Road', { sizes: '(min-width: 960px) 40vw, 100vw' })}</figure>` : ''}
  <div class="trust">
    <div class="trust__item reveal"><strong>Since ${biz.tradingSince}</strong><span>Supplying Melbourne's eastern suburbs from Canterbury Road, Surrey Hills.</span></div>
    <div class="trust__item reveal"><strong>Trade &amp; public</strong><span>Landscapers, builders and plumbers buy from the same bays as home gardeners. Ask about trade accounts.</span></div>
    <div class="trust__item reveal"><strong>Australian distributor of Smart Grass</strong><span>Synthetic lawn supplied Australia wide, with samples at the yard.</span></div>
  </div>
  </div>
</div></section>
<section class="section section--alt" aria-labelledby="sup-h"><div class="wrap">
  <div class="section-head"><p class="eyebrow">Brands on the yard</p><h2 id="sup-h">Suppliers we stock</h2></div>
  ${supplierStrip()}
</div></section>
<section class="section" aria-labelledby="rev-h"><div class="wrap">
  <div class="section-head"><p class="eyebrow">Reviews</p><h2 id="rev-h">What customers say</h2></div>
  <div class="placeholder"><strong>Google reviews will appear here.</strong> They are pulled from the Google Business Profile once the profile link ({{GBP_URL}}) is supplied. No reviews are shown until then, so none are invented.</div>
</div></section>
<section class="section section--dark" aria-labelledby="areas-h"><div class="wrap">
  <div class="section-head"><p class="eyebrow">Delivery areas</p><h2 id="areas-h">Bulk delivery across Melbourne's east</h2><p class="lede">Surrey Hills, Box Hill, Canterbury, Camberwell, Balwyn, Mont Albert, Blackburn, Burwood, Hawthorn, Kew, Doncaster, Glen Iris, Ashburton, Nunawading and Ringwood, usually in less than two hours.</p></div>
  ${suburbChips()}
</div></section>`;
  add({ path: '/', title: 'Garden Supplies Surrey Hills | Mulch, Soil, Sand & Rock', description: "Mulch, soil, sand, rock, cement, synthetic grass and building supplies in Surrey Hills. Bagged, bulk or BYO trailer, delivered in under 2 hours.", hero: h.html, preload: h.preload, body, calculator: true, schemas: [{ '@context': 'https://schema.org', '@type': 'WebSite', url: `${BASE}/`, name: biz.name }] });
})();
function supplierStrip() {
  const items = [];
  const sup = fs.existsSync(path.join(root, 'data/suppliers.json')) ? D('suppliers.json').logos : [];
  for (const s of sup) { const r = resolveImg(`suppliers/${s.file}`); if (r) items.push(`<div class="logos__item"><img src="${r.src}" alt="${esc(s.name)} logo" title="${esc(s.name)}" loading="lazy" decoding="async" width="160" height="80"></div>`); }
  if (!items.length) return `<div class="placeholder"><strong>Supplier logo strip.</strong> Placeholder until the client supplies the brand list ({{SUPPLIER_LIST}}). The current site shows 35 supplier logos; they are listed in PLACEHOLDERS.md for confirmation.</div>`;
  return `<div class="logos">${items.join('')}</div><p class="small muted" style="margin-top:.8rem">Logos carried over from the current website. Brand names to be confirmed by the client ({{SUPPLIER_LIST}}).</p>`;
}

/* CATEGORIES */
for (const c of categories) {
  const mine = catProducts(c); const also = catAlsoProducts(c);
  const h = hero({ h1: esc(c.h1), text: esc(c.metaDescription), imgBase: c.image, imgAlt: c.imageAlt, ctas: heroCtas, page: true, crumbs: true });
  const relatedCats = (c.related || []).map(s => catBySlug[s]).filter(Boolean);
  const subs = suburbs.slice(0, 6);
  const body = `
<section class="section" aria-labelledby="intro-h"><div class="wrap">
  <div class="split">
    <div class="prose reveal"><p class="eyebrow">${esc(c.name)} in Surrey Hills</p><h2 id="intro-h">${esc(c.name)} for trade and home gardeners</h2><p>${esc(c.intro)}</p><p><a class="btn btn--dark btn--sm" href="/calculator/">${I.calc}Work out quantities</a></p></div>
    <div class="reveal">${img(c.image, c.imageAlt, { sizes: '(min-width: 900px) 50vw, 100vw' })}</div>
  </div>
</div></section>
<section class="section section--alt" aria-labelledby="prod-h"><div class="wrap">
  <div class="section-head"><p class="eyebrow">Products</p><h2 id="prod-h">${esc(c.name)} products at the yard</h2><p class="lede">Badges show how each product is sold: bags for pickup, bulk by the cubic metre delivered, or loaded into your own trailer.</p></div>
  <div class="grid grid--3">${mine.map(p => productCard(p)).join('')}</div>
  ${also.length ? `<h3 style="margin-top:2rem">Also useful for ${esc(c.name.toLowerCase())}</h3><div class="grid grid--3">${also.map(p => productCard(p)).join('')}</div>` : ''}
</div></section>
<section class="section" aria-labelledby="choose-h"><div class="wrap">
  <div class="section-head"><p class="eyebrow">How to choose</p><h2 id="choose-h">Which ${esc(c.name.toLowerCase())} product do I need?</h2></div>
  <div class="choose">${(c.howToChoose || []).map(x => `<div class="choose__item reveal"><strong>${esc(x.q)}</strong><p>${esc(x.a)}</p></div>`).join('')}</div>
</div></section>
${faqSection(c.faqs, `${c.name} questions`)}
<section class="section" aria-labelledby="rel-h"><div class="wrap">
  <div class="section-head"><h2 id="rel-h">Related ranges</h2></div>
  <div class="grid grid--3">${relatedCats.map(r => `<a class="card reveal" href="/${r.slug}/"><div class="card__media">${img(r.image, r.imageAlt)}</div><div class="card__body"><h3>${esc(r.name)}</h3><p>${esc(r.tile.slice(0, 110))}…</p><span class="card__link">Browse ${esc(r.name.toLowerCase())}</span></div></a>`).join('')}</div>
  <h3 style="margin-top:2.4rem">${esc(c.name)} delivered to</h3>
  ${suburbChips(subs)}
</div></section>`;
  add({ path: `/${c.slug}/`, title: c.title, description: c.metaDescription, hero: h.html, preload: h.preload, body, calculator: false, ogImage: resolveImg(c.image) ? `/assets/img/${c.image}-1600.webp` : null,
    crumbs: [['Home', '/'], [c.name, `/${c.slug}/`]], schemas: [breadcrumb([['Home', '/'], [c.name, `/${c.slug}/`]]), faqSchema(c.faqs), { '@context': 'https://schema.org', '@type': 'ItemList', name: `${c.name} products`, itemListElement: mine.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${BASE}${prodPath(p)}`, name: p.name })) }] });
}

/* PRODUCTS */
for (const p of products) {
  const c = catBySlug[p.category];
  const f = p.formats || {}; const pr = p.prices || {};
  const price = (v) => v ? esc(v) : 'Call for price';
  const rows = [];
  if (f.bag15kg) rows.push(['15kg bag (yard pickup)', price(pr.bag15kg)]);
  if (f.bag20kg) rows.push(['20kg bag', price(pr.bag20kg)]);
  if (f.bulkerBag) rows.push(['1-tonne bulker bag', price(pr.bulkerBag)]);
  if (f.bulkM3) rows.push(['Bulk per m³ (delivered or pickup)', price(pr.bulkM3)]);
  if (f.byoTrailer) rows.push(['BYO trailer (loaded at the yard)', 'Priced per m³']);
  if (f.roll) rows.push(['By the roll / per m²', 'Call for price']);
  if (f.each) rows.push(['Per item / length / sheet', 'Call for price']);
  if (f.pickupOnly && !rows.length) rows.push(['Yard pickup', 'Call for price']);
  const mainAlt = p.images[0] ? p.images[0].alt : `${p.name} at Surrey Hills Garden Supplies`;
  const thumbs = p.images.map((im, i) => productHasImg(p, i + 1) ? `<button type="button" aria-pressed="${i === 0 ? 'true' : 'false'}" data-full="/assets/img/products/${p.slug}-${i + 1}-1600.webp">${productImg(p, i + 1, im.alt, { sizes: '120px' })}</button>` : '').filter(Boolean);
  const genNote = (resolveImg(`products/${p.slug}-1`) || {}).generated ? `<p class="small muted">Illustrative image generated for this page; to be replaced with a yard photo.</p>` : '';
  const related = catProducts(c).filter(x => x.slug !== p.slug).slice(0, 3).concat(catAlsoProducts(c).slice(0, 1)).slice(0, 3);
  const crumbs = [['Home', '/'], [c.name, `/${c.slug}/`], [p.name, prodPath(p)]];
  const h = `<section class="hero hero--page cut-bottom" style="--cut:2.5vw"><div class="wrap hero__in" style="padding-bottom:3rem">{{CRUMBS}}<h1 class="h-anim">${esc(p.h1)}</h1><p class="hero__sub h-anim">${esc(p.short)}</p></div></section>`;
  const body = `
<section class="section" style="padding-top:2rem"><div class="wrap">
  <div class="product">
    <div>
      <div class="gallery reveal"><div class="gallery__main">${productImg(p, 1, mainAlt, { sizes: '(min-width: 960px) 55vw, 100vw', eager: true })}</div>${thumbs.length > 1 ? `<div class="gallery__thumbs">${thumbs.join('')}</div>` : ''}${genNote}</div>
      <div class="prose" style="margin-top:1.6rem">
        <p class="product__intro">${esc(p.intro)}</p>
        ${p.variants && p.variants.length ? `<h2>Options</h2><ul class="variants">${p.variants.map(v => `<li>${esc(v)}</li>`).join('')}</ul>` : ''}
        <h2>About ${esc(p.name.toLowerCase())}</h2>
        <div class="${p.catalogue ? 'prose--catalogue' : ''}">${p.bodyHtml || `<p>${esc(p.short)}</p>`}</div>
      </div>
    </div>
    <aside>
      <div class="avail reveal">
        <h2>Available as</h2>
        <table><tbody>${rows.map(r => `<tr><th scope="row">${r[0]}</th><td class="price">${r[1]}</td></tr>`).join('')}</tbody></table>
        ${p.minOrder ? `<p class="minorder">Minimum order: ${esc(p.minOrder)}</p>` : ''}
        <div class="avail__cta">
          <a class="btn btn--primary" href="tel:${biz.phoneTel}">${I.phone}Call ${esc(biz.phoneDisplay)}</a>
          <a class="btn btn--dark" href="/contact/?product=${encodeURIComponent(p.name)}#quote">${I.quote}Get a quote</a>
          <a class="btn btn--ghost" href="/order/">Order online — coming soon</a>
        </div>
        ${p.density ? `<div class="coverage">${I.ruler}<div><strong>Coverage:</strong> 1 m³ covers about 10 m² at 100mm deep (≈13 m² at 75mm). Approx. ${p.density} t per m³.</div></div>` : ''}
        <p class="small muted" style="margin:.8rem 0 0">Trade and public welcome. Delivered across Melbourne's east, usually in less than 2 hours. <a href="/delivery/">Delivery details</a>.</p>
      </div>
      ${p.density ? `<div style="margin-top:1.2rem" class="reveal">${calculatorHtml({ productSlug: p.slug, compact: true, heading: `How much ${esc(p.name.toLowerCase())} do I need?` })}</div>` : `<div style="margin-top:1.2rem" class="reveal"><div class="placeholder"><strong>Need a quantity?</strong> Tell us the job and we will work it out: <a href="tel:${biz.phoneTel}">${esc(biz.phoneDisplay)}</a>. For bulk materials use the <a href="/calculator/">volume calculator</a>.</div></div>`}
    </aside>
  </div>
</div></section>
${faqSection(p.faqs, `${p.name} questions`)}
<section class="section" aria-labelledby="rel-h"><div class="wrap">
  <div class="section-head"><h2 id="rel-h">Related products</h2></div>
  <div class="grid grid--3">${related.map(r => productCard(r)).join('')}</div>
  <p style="margin-top:1.6rem"><a href="/${c.slug}/">← All ${esc(c.name.toLowerCase())}</a> &nbsp;·&nbsp; <a href="/calculator/">Volume calculator</a>${(p.alsoIn || []).map(s => ` &nbsp;·&nbsp; <a href="/${s}/">Also in ${esc(catBySlug[s].name)}</a>`).join('')}</p>
</div></section>`;
  const productSchema = { '@context': 'https://schema.org', '@type': 'Product', name: p.name, description: p.short, category: c.name, url: `${BASE}${prodPath(p)}`, brand: { '@type': 'Brand', name: biz.name }, image: resolveImg(`products/${p.slug}-1`) ? `${BASE}/assets/img/products/${p.slug}-1-1600.webp` : (resolveImg(p.fallbackImage) ? `${BASE}/assets/img/${p.fallbackImage}-1600.webp` : undefined) };
  const realPrice = Object.entries(pr).find(([k, v]) => k !== 'note' && v && /^\d/.test(String(v)));
  if (realPrice) productSchema.offers = { '@type': 'Offer', priceCurrency: 'AUD', price: String(realPrice[1]).replace(/[^0-9.]/g, ''), availability: 'https://schema.org/InStock', url: `${BASE}${prodPath(p)}` };
  const wc = words(p.intro) + words(p.bodyHtml) + (p.faqs || []).reduce((a, f) => a + words(f.q + ' ' + f.a), 0);
  if (wc < 150) warnings.push(`thin copy (${wc} words): ${prodPath(p)}`);
  add({ path: prodPath(p), title: p.title, description: p.metaDescription, hero: h, body, calculator: !!p.density, crumbs, preload: resolveImg(`products/${p.slug}-1`) || resolveImg(p.fallbackImage), ogType: 'product', ogImage: productSchema.image ? productSchema.image.replace(BASE, '') : null,
    schemas: [breadcrumb(crumbs), productSchema].concat(p.faqs && p.faqs.length ? [faqSchema(p.faqs)] : []) });
}

/* AREAS */
(function areas() {
  const h = hero({ h1: 'Garden Supplies Delivered Across Melbourne\'s East', text: 'Bulk mulch, soil, sand, rock and cement delivered from our Surrey Hills yard, usually in less than two hours. Pick your suburb for delivery times and the products people there order most.', imgBase: resolveImg('products/gen-tipper-delivery') ? 'products/gen-tipper-delivery' : 'yard-01', imgAlt: 'Tipper truck delivering garden supplies in Melbourne\'s eastern suburbs', ctas: heroCtas, page: true, crumbs: true });
  const cards = suburbs.map(s => `<a class="card reveal" href="/areas/${s.slug}/"><div class="card__body"><h3>${esc(s.name)} ${esc(s.postcode)}</h3><p>${esc(s.intro)}</p><p class="small"><strong>About ${esc(s.driveMins)} min</strong> from the yard</p><span class="card__link">Delivery to ${esc(s.name)}</span></div></a>`).join('');
  const body = `<section class="section"><div class="wrap"><div class="section-head"><p class="eyebrow">Delivery zone (to be confirmed)</p><h2>Suburbs we deliver to</h2><p class="lede">The suburbs below are our core eastern-suburbs run. If yours is not listed, call ${esc(biz.phoneDisplay)}: we deliver further afield depending on the load and the truck schedule.</p></div><div class="grid grid--3">${cards}</div></div></section>`;
  add({ path: '/areas/', title: 'Delivery Areas | Garden Supplies Melbourne East | SHGS', description: 'Bulk garden and landscape supplies delivered to Surrey Hills, Box Hill, Camberwell, Balwyn, Kew, Doncaster, Blackburn and more, usually in under 2 hours.', hero: h.html, preload: h.preload, body, crumbs: [['Home', '/'], ['Delivery areas', '/areas/']], schemas: [breadcrumb([['Home', '/'], ['Delivery areas', '/areas/']])] });
  for (const s of suburbs) {
    const pops = (s.popularProducts || []).map(x => prodBySlug[x.split('/')[1]]).filter(Boolean);
    const crumbs = [['Home', '/'], ['Delivery areas', '/areas/'], [s.name, `/areas/${s.slug}/`]];
    const hh = hero({ h1: esc(s.h1), text: esc(s.intro), imgBase: resolveImg('products/gen-tipper-delivery') ? 'products/gen-tipper-delivery' : 'yard-01', imgAlt: `Bulk garden supplies delivery to ${s.name} from Surrey Hills Garden Supplies`, ctas: heroCtas, page: true, crumbs: true });
    const mapQ = encodeURIComponent(`${s.name} VIC ${s.postcode}`);
    const body = `
<section class="section"><div class="wrap">
  <div class="stats" style="margin-bottom:2rem">
    <div class="stat reveal"><strong>${esc(s.driveMins)} min</strong><span>approx. drive from the yard</span></div>
    <div class="stat reveal"><strong>~${esc(String(s.distanceKm))} km</strong><span>from Canterbury Road, Surrey Hills</span></div>
    <div class="stat reveal"><strong>&lt; 2 hrs</strong><span>typical bulk delivery</span></div>
    <div class="stat reveal"><strong>${esc(s.postcode)}</strong><span>${esc(s.name)} VIC</span></div>
  </div>
  <div class="split" style="align-items:start">
    <div class="prose">${(s.body || []).join('\n')}</div>
    <div>
      <div class="map-holder reveal"><iframe title="Map of ${esc(s.name)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${mapQ}&output=embed"></iframe></div>
      ${s.landmarks && s.landmarks.length ? `<p class="small muted" style="margin-top:.8rem">Near ${esc(s.landmarks.join(', '))}.</p>` : ''}
      <div class="placeholder" style="margin-top:1rem"><strong>Delivery fees for ${esc(s.name)}:</strong> {{DELIVERY_FEE_${s.slug.toUpperCase().replace(/-/g, '_')}}} — minimum order {{MIN_ORDER}}. Call for current rates.</div>
    </div>
  </div>
</div></section>
<section class="section section--alt"><div class="wrap">
  <div class="section-head"><p class="eyebrow">Popular in ${esc(s.name)}</p><h2>Bulk products we deliver to ${esc(s.name)}</h2></div>
  <div class="grid grid--3">${pops.map(p => productCard(p, `${p.name} delivered to ${s.name} by Surrey Hills Garden Supplies`)).join('')}</div>
  <p style="margin-top:1.5rem"><a class="btn btn--dark" href="/calculator/">${I.calc}Work out how much you need</a></p>
</div></section>
${faqSection(s.faqs, `Delivery to ${s.name}`)}
<section class="section"><div class="wrap"><h2>Other suburbs we deliver to</h2>${suburbChips(suburbs.filter(x => x.slug !== s.slug))}</div></section>`;
    add({ path: `/areas/${s.slug}/`, title: s.title, description: s.metaDescription, hero: hh.html, preload: hh.preload, body, crumbs, schemas: [breadcrumb(crumbs), faqSchema(s.faqs || []), { '@context': 'https://schema.org', '@type': 'Service', name: `Garden supplies delivery ${s.name}`, provider: { '@id': `${BASE}/#business` }, areaServed: { '@type': 'City', name: s.name }, serviceType: 'Bulk landscape supplies delivery' }] });
  }
})();

/* DELIVERY */
(function delivery() {
  const h = hero({ h1: 'Delivery from Surrey Hills', sub: 'Deliveries in less than 2 hours across the eastern suburbs', text: 'Bulk loads by the cubic metre on our tipper trucks, bagged product for pickup, or your own trailer loaded at the yard.', imgBase: resolveImg('products/gen-loader-trailer') ? 'products/gen-loader-trailer' : 'yard-01', imgAlt: 'Loader filling a customer trailer with soil at Surrey Hills Garden Supplies', ctas: heroCtas, page: true, crumbs: true });
  const body = `
<section class="section"><div class="wrap wrap--narrow prose">
  <h2>How delivery works</h2>
  <p>Call ${esc(biz.phoneDisplay)} or send a quote request with the product, the quantity in cubic metres (use the <a href="/calculator/">calculator</a>) and the delivery address. We confirm the price and a delivery window on the phone. In Melbourne's eastern suburbs we aim to have a bulk load on site in less than two hours. Loads are tipped where the truck can safely reach: a driveway, nature strip or the kerb. Tell us if access is tight, if there are overhead wires, or if you want the load on a tarp.</p>
  <h2>Delivery zones</h2>
  <table class="table"><thead><tr><th>Zone</th><th>Suburbs</th><th>Delivery fee</th></tr></thead><tbody>
  <tr><td>Zone 1 (local)</td><td>Surrey Hills, Mont Albert, Canterbury, Box Hill, Balwyn, Camberwell</td><td>{{DELIVERY_FEE_ZONE_1}}</td></tr>
  <tr><td>Zone 2 (eastern suburbs)</td><td>Blackburn, Burwood, Hawthorn, Kew, Doncaster, Glen Iris, Ashburton, Nunawading</td><td>{{DELIVERY_FEE_ZONE_2}}</td></tr>
  <tr><td>Zone 3 (outer east)</td><td>Ringwood and beyond, by arrangement</td><td>{{DELIVERY_FEE_ZONE_3}}</td></tr>
  </tbody></table>
  <p class="small muted">Zones and suburbs are UNCONFIRMED and will be replaced with the client's actual delivery zone. See <a href="/areas/">delivery areas</a>.</p>
  <h2>Truck sizes and minimums</h2>
  <table class="table"><thead><tr><th>Truck</th><th>Capacity</th><th>Minimum order</th></tr></thead><tbody>
  <tr><td>{{TRUCK_1_NAME}}</td><td>{{TRUCK_1_CAPACITY}} m³</td><td>{{MIN_ORDER}}</td></tr>
  <tr><td>{{TRUCK_2_NAME}}</td><td>{{TRUCK_2_CAPACITY}} m³</td><td>{{MIN_ORDER}}</td></tr>
  </tbody></table>
  <p>Some products are ordered in rather than held in the yard and carry their own minimum: Soft Play mulch and 40–100mm rubble rock are 6 cubic metres, instant turf is 30 square metres and arrives 2–3 days after ordering. Kiln dried sand can be delivered in loads up to 12 cubic metres.</p>
  <h2>Pickup and BYO trailer</h2>
  <p>The yard is at ${esc(biz.address.formatted)}. Bulk products are bagged into 15kg bags for pickup (20kg for kiln dried sand). If you bring a trailer, back up to the bay and we load it: a standard 6x4 trailer carries about half a cubic metre, which is roughly 600kg of soil or 800kg of crushed rock, so check your trailer's rated capacity. Bring a tarp or cover for the trip home.</p>
  <h2>Hours</h2>
  <p>Yard and delivery hours: {{HOURS}}.</p>
</div></section>`;
  const crumbs = [['Home', '/'], ['Delivery', '/delivery/']];
  add({ path: '/delivery/', title: 'Delivery Zones & Minimums | Surrey Hills Garden Supplies', description: 'How bulk delivery works from Surrey Hills Garden Supplies: zones across Melbourne\'s east, truck sizes, minimums, pickup and BYO trailer. Under 2 hrs.', hero: h.html, preload: h.preload, body, crumbs, schemas: [breadcrumb(crumbs)] });
})();

/* CALCULATOR */
(function calculator() {
  const h = hero({ h1: 'Garden Supplies Volume Calculator', text: 'Work out cubic metres, tonnes and bag counts for mulch, soil, sand and rock. Rounds up to the nearest quarter metre.', imgBase: resolveImg('gen-bags-15kg') ? 'gen-bags-15kg' : 'yard-01', imgAlt: 'Stacked 15kg bags of garden supplies at Surrey Hills Garden Supplies', page: true, crumbs: true });
  const body = `
<section class="section"><div class="wrap">
  ${calculatorHtml({ heading: 'How much do I need?' })}
  <div class="prose" style="margin-top:2.5rem">
    <h2>How the calculator works</h2>
    <p>Volume is length × width × depth (or π × radius² × depth for a circle), converted from millimetres of depth to metres. The result is rounded up to the nearest 0.25 m³ because that is how we load and price bulk product. Weight is the raw volume multiplied by the product's typical density in tonnes per cubic metre, and bags are the weight divided by the bag size, rounded up. Tick the 10% wastage box for beds that are uneven or for materials that compact, such as crushed rock and crusher dust.</p>
    <h2>Typical densities (t/m³)</h2>
    <table class="table"><thead><tr><th>Product</th><th>Density</th><th>Bag</th></tr></thead><tbody>${products.filter(p => p.density).map(p => `<tr><td><a href="${prodPath(p)}">${esc(p.name)}</a></td><td>${p.density}</td><td>${p.bagWeightKg || 15}kg</td></tr>`).join('')}</tbody></table>
    <p class="small muted">Densities are typical values and vary with moisture content. For large or critical orders call the yard on ${esc(biz.phoneDisplay)}.</p>
    <h2>Coverage rule of thumb</h2>
    <p>One cubic metre covers about 10 m² at 100mm, 13 m² at 75mm, 20 m² at 50mm and 6.5 m² at 150mm. A 6x4 trailer holds roughly half a cubic metre.</p>
  </div>
</div></section>`;
  const crumbs = [['Home', '/'], ['Calculator', '/calculator/']];
  add({ path: '/calculator/', title: 'Mulch, Soil & Rock Calculator | Surrey Hills Garden Supplies', description: 'Free volume calculator: enter length, width and depth to get cubic metres, tonnes and 15kg bag counts for mulch, soil, sand, crushed rock and scoria.', hero: h.html, preload: h.preload, body, calculator: true, crumbs, schemas: [breadcrumb(crumbs), { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Garden supplies volume calculator', applicationCategory: 'UtilityApplication', operatingSystem: 'Any', url: `${BASE}/calculator/`, offers: { '@type': 'Offer', price: '0', priceCurrency: 'AUD' } }] });
})();

/* CONTACT */
(function contact() {
  const mapQ = encodeURIComponent(biz.mapEmbedQuery);
  const h = hero({ h1: 'Contact Surrey Hills Garden Supplies', text: 'See our products on site or we\'ll deliver to you. Call, email, or send a quote request and we will come back with a price and a delivery time.', imgBase: 'yard-01', imgAlt: 'Surrey Hills Garden Supplies yard on Canterbury Road', page: true, crumbs: true });
  const prodOpts = products.map(p => `<option value="${esc(p.name)}">`).join('');
  const body = `
<section class="section"><div class="wrap">
  <div class="split" style="align-items:start">
    <div>
      <div class="contact-card reveal">
        <h2>The yard</h2>
        <address>
          <a class="big" href="tel:${biz.phoneTel}">${esc(biz.phoneDisplay)}</a>
          <a href="mailto:${biz.email}">${biz.email}</a><br>
          ${esc(biz.address.formatted)}<br>
          <strong>Hours:</strong> ${esc(biz.hours)}
        </address>
        <p>Our friendly team are ready to help you with any questions you may have about your garden project. To make orders come in and see us on site or organise one of our trucks to come and deliver to you on site.</p>
        <div class="footer__social" style="margin-top:.5rem"><a href="${biz.social.facebook}" aria-label="Facebook" rel="noopener" target="_blank" style="border-color:var(--c-line);color:var(--c-ink)">${I.fb}</a><a href="${biz.social.instagram}" aria-label="Instagram" rel="noopener" target="_blank" style="border-color:var(--c-line);color:var(--c-ink)">${I.ig}</a></div>
      </div>
      <div class="map-holder reveal" style="margin-top:1.2rem"><iframe title="Map to ${esc(biz.name)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${mapQ}&output=embed"></iframe></div>
    </div>
    <div id="quote">
      <h2>Get a quote</h2>
      <p class="muted">Tell us what you need and where. We reply by phone or email, usually the same day.</p>
      <form class="form" name="quote" method="POST" action="/api/quote" data-netlify="true" netlify-honeypot="company">
        <input type="hidden" name="form-name" value="quote">
        <p class="sr-only" aria-hidden="true"><label>Don't fill this out: <input name="company" tabindex="-1" autocomplete="off"></label></p>
        <div class="field"><label for="f-name">Name *</label><input id="f-name" name="name" type="text" required autocomplete="name"></div>
        <div class="field"><label for="f-email">Email *</label><input id="f-email" name="email" type="email" required autocomplete="email"></div>
        <div class="field"><label for="f-phone">Phone *</label><input id="f-phone" name="phone" type="tel" required autocomplete="tel"></div>
        <div class="field"><label for="f-suburb">Delivery suburb</label><input id="f-suburb" name="suburb" type="text" list="suburb-list" autocomplete="address-level2"><datalist id="suburb-list">${suburbs.map(s => `<option value="${esc(s.name)}">`).join('')}</datalist></div>
        <div class="field field--full"><label for="f-products">Product(s) wanted *</label><input id="f-products" name="products" type="text" list="product-list" required placeholder="e.g. 10mm pine bark, blended soil"><datalist id="product-list">${prodOpts}</datalist></div>
        <div class="field"><label for="f-qty">Approx. quantity</label><input id="f-qty" name="quantity" type="text" placeholder="e.g. 2.5 m³ or 20 bags"></div>
        <div class="field"><label for="f-fulfil">Pickup or delivery</label><select id="f-fulfil" name="fulfilment"><option value="delivery">Delivery</option><option value="pickup">Pickup (bags)</option><option value="byoTrailer">BYO trailer</option></select></div>
        <div class="field field--full"><label for="f-notes">Notes</label><textarea id="f-notes" name="notes" placeholder="Access, preferred day, anything else"></textarea></div>
        <div class="field field--full"><button class="btn btn--primary btn--block" type="submit">Send quote request</button></div>
        <p class="small muted field--full">Or call <a href="tel:${biz.phoneTel}">${esc(biz.phoneDisplay)}</a>. We never share your details.</p>
      </form>
    </div>
  </div>
</div></section>`;
  const crumbs = [['Home', '/'], ['Contact', '/contact/']];
  add({ path: '/contact/', title: 'Contact & Quotes | Surrey Hills Garden Supplies', description: `Call ${biz.phoneDisplay}, email or request a quote. Surrey Hills Garden Supplies, ${biz.address.streetName}, Surrey Hills VIC 3127. Pickup, BYO trailer or bulk delivery.`, hero: h.html, preload: h.preload, body, crumbs, noCta: true, schemas: [breadcrumb(crumbs), { '@context': 'https://schema.org', '@type': 'ContactPage', url: `${BASE}/contact/`, mainEntity: { '@id': `${BASE}/#business` } }] });
  add({ path: '/thank-you/', title: 'Thanks — we\'ll be in touch | Surrey Hills Garden Supplies', description: 'Your quote request has been received by Surrey Hills Garden Supplies. We will call or email you back, usually the same day.', noindex: true, noCta: true,
    hero: `<section class="hero hero--page cut-bottom"><div class="wrap hero__in"><h1>Thanks, we've got your request</h1><p class="hero__sub">We'll call or email you back, usually the same day.</p><p class="hero__text">Need it sooner? Call <a href="tel:${biz.phoneTel}" style="color:#fff">${esc(biz.phoneDisplay)}</a> and talk to the yard.</p><div class="hero__cta"><a class="btn btn--primary" href="/">Back to home</a><a class="btn btn--ghost" href="/calculator/">Volume calculator</a></div></div></section>`, body: '' });
})();

/* ABOUT */
(function about() {
  const h = hero({ h1: 'About Surrey Hills Garden Supplies', text: 'A garden, landscape and building supply yard on Canterbury Road, serving Melbourne\'s eastern suburbs since ' + biz.tradingSince + '.', imgBase: 'yard-01', imgAlt: 'Surrey Hills Garden Supplies yard bays on Canterbury Road', ctas: heroCtas, page: true, crumbs: true });
  const body = `
<section class="section"><div class="wrap">
  <div class="split" style="align-items:start">
    <div class="prose">
      <h2>Operating out of the eastern suburbs</h2>
      <p>Operating out of the Eastern Suburbs, Surrey Hills Garden Supplies provides Melbourne with a range of gardening, building and landscaping essentials. Located on Canterbury Road in Surrey Hills, we deliver throughout the city and surrounding suburbs, and we have done so since ${biz.tradingSince}.</p>
      <p>We service trades people and the general public with a team of experts to help you with your garden, landscape or new build. We specialise in helping you choose the right soil, mulch, compost, sleepers or anything else for your project, and everyone at Surrey Hills Garden Supplies strives to continually exceed the expectations of our customers to give them the satisfaction and results they deserve.</p>
      <h2>What is on the yard</h2>
      <p>Mulch, soil and sand in bays; crushed rock, screenings, scoria and toppings; the Cement Australia bagged range with reinforcing steel and bar chairs; a tool shop stocked for bricklayers, concreters, plasterers and landscapers; synthetic grass (we are the Australian distributor of Smart Grass) and instant turf; building products from besser blocks to sleepers; and drainage supplies. Everything bulk can be bagged into 15kg bags, loaded into your trailer or delivered on our trucks.</p>
      <h2>Deliveries in less than 2 hours</h2>
      <p>That is the promise for the eastern suburbs, and we ask customers to put us to the test. Call the yard, tell us the product and the quantity, and we will tell you when the truck can be there.</p>
      <ul class="checklist"><li>Trading since ${biz.tradingSince}</li><li>Trade and public customers</li><li>Australian distributor of Smart Grass</li><li>Bagged, bulk or BYO trailer</li></ul>
      <p><a class="btn btn--primary" href="/contact/">Visit or contact the yard</a></p>
    </div>
    <div class="reveal">${img(resolveImg('products/gen-loader-trailer') ? 'products/gen-loader-trailer' : 'yard-01', 'Loader filling a trailer with garden soil at Surrey Hills Garden Supplies', { sizes: '(min-width: 900px) 50vw, 100vw' })}</div>
  </div>
</div></section>`;
  const crumbs = [['Home', '/'], ['About', '/about/']];
  add({ path: '/about/', title: 'About Us | Surrey Hills Garden Supplies, Since 2012', description: 'Surrey Hills Garden Supplies is a garden, landscape and building supply yard on Canterbury Road, serving Melbourne\'s east since 2012. Trade and public.', hero: h.html, preload: h.preload, body, crumbs, schemas: [breadcrumb(crumbs), { '@context': 'https://schema.org', '@type': 'AboutPage', url: `${BASE}/about/`, mainEntity: { '@id': `${BASE}/#business` } }] });
})();

/* BLOG */
(function blog() {
  const postImg = (post, alt, opts) => img(`products/post-${post.slug}`, alt, Object.assign({ fallback: 'mulch-02' }, opts || {}));
  const fmtDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
  const h = hero({ h1: 'Garden Supplies Blog', text: 'Plain advice from the yard on which mulch, sand and soil to use, and how to get a low-maintenance garden.', imgBase: 'mulch-02', imgAlt: 'Pine bark mulch', page: true, crumbs: true });
  const cards = posts.map(post => `<a class="card post-card reveal" href="/blog/${post.slug}/"><div class="card__media">${postImg(post, post.title)}</div><div class="card__body"><p class="post-meta">${fmtDate(post.date)}</p><h3>${esc(post.title)}</h3><p>${esc(post.excerpt)}</p><span class="card__link">Read more</span></div></a>`).join('');
  add({ path: '/blog/', title: 'Blog | Mulch, Soil & Sand Advice | SHGS Surrey Hills', description: 'Advice from Surrey Hills Garden Supplies on choosing mulch, sand and soil, kiln dried sand for synthetic grass, and low-maintenance gardens in Melbourne.', hero: h.html, preload: h.preload, body: `<section class="section"><div class="wrap"><div class="grid grid--3">${cards}</div></div></section>`, crumbs: [['Home', '/'], ['Blog', '/blog/']], schemas: [breadcrumb([['Home', '/'], ['Blog', '/blog/']])] });
  for (const post of posts) {
    const crumbs = [['Home', '/'], ['Blog', '/blog/'], [post.title, `/blog/${post.slug}/`]];
    const rel = (post.relatedProducts || []).map(pth => products.find(p => prodPath(p) === pth)).filter(Boolean).slice(0, 3);
    const body = `
<article class="section"><div class="wrap wrap--narrow">
  <div class="post-hero">${postImg(post, post.title, { sizes: '(min-width: 860px) 820px, 100vw', eager: true })}</div>
  <div class="prose">${post.bodyHtml}</div>
  ${rel.length ? `<h2 style="margin-top:2.5rem">Products mentioned</h2><div class="grid grid--3">${rel.map(p => productCard(p)).join('')}</div>` : ''}
  <p style="margin-top:2rem"><a href="/blog/">← All posts</a></p>
</div></article>`;
    const hh = `<section class="hero hero--page cut-bottom" style="--cut:2.5vw"><div class="wrap hero__in" style="padding-bottom:2.5rem">{{CRUMBS}}<p class="eyebrow" style="color:var(--c-green)">${fmtDate(post.date)}</p><h1 class="h-anim">${esc(post.title)}</h1><p class="hero__text h-anim">${esc(post.excerpt)}</p></div></section>`;
    const r = resolveImg(`products/post-${post.slug}`);
    add({ path: `/blog/${post.slug}/`, title: (post.title.length > 42 ? post.title : post.title + ' | SHGS Blog').slice(0, 60), description: post.excerpt.length > 155 ? post.excerpt.slice(0, 152).replace(/\s+\S*$/, '') + '…' : post.excerpt, hero: hh, body, crumbs, ogType: 'article', ogImage: r ? r.src.replace('-800', '-1600') : null,
      schemas: [breadcrumb(crumbs), { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, datePublished: post.date, dateModified: post.date, author: { '@type': 'Organization', name: biz.name }, publisher: { '@type': 'Organization', name: biz.name, logo: { '@type': 'ImageObject', url: `${BASE}${biz.logo}` } }, mainEntityOfPage: `${BASE}/blog/${post.slug}/`, image: r ? `${BASE}${r.src.replace('-800', '-1600')}` : undefined, description: post.excerpt }] });
  }
})();

/* ORDER (stub), PRIVACY, 404 */
add({ path: '/order/', title: 'Order Online — Coming Soon | Surrey Hills Garden Supplies', description: `Online ordering is coming soon. Call ${biz.phoneDisplay} to order mulch, soil, sand, rock and cement for pickup or delivery from Surrey Hills.`, noindex: true, noCta: true,
  hero: `<section class="hero hero--page cut-bottom"><div class="wrap hero__in"><h1>Online ordering coming soon</h1><p class="hero__sub">Call ${esc(biz.phoneDisplay)} to order</p><p class="hero__text">Until online ordering launches, phone the yard with the product, quantity and your suburb and we will confirm a price and a delivery time, or <a href="/contact/#quote" style="color:#fff">send a quote request</a>.</p><div class="hero__cta"><a class="btn btn--primary" href="tel:${biz.phoneTel}">${I.phone}Call ${esc(biz.phoneDisplay)}</a><a class="btn btn--ghost" href="/calculator/">Work out quantities</a></div></div></section>`,
  body: `<section class="section"><div class="wrap wrap--narrow prose"><h2>What you will be able to do</h2><p>Choose a product and format (15kg bags, 20kg bags, bulker bags or bulk by the cubic metre), pick delivery, pickup or BYO trailer, enter your address and a preferred date, and pay online. The order goes straight to our dispatch system so the truck can be scheduled. The data structure for that is already defined in this site (<code>/data/order-schema.json</code>) so the page and URL will not change when ordering goes live.</p></div></section>` });
add({ path: '/privacy/', title: 'Privacy Policy | Surrey Hills Garden Supplies', description: 'How Surrey Hills Garden Supplies collects and uses the details you give us through this website, quote requests and phone orders.',
  hero: `<section class="hero hero--page cut-bottom"><div class="wrap hero__in"><h1>Privacy policy</h1><p class="hero__text">Last updated ${TODAY}.</p></div></section>`,
  body: `<section class="section"><div class="wrap wrap--narrow prose">
<p>${esc(biz.name)} (ABN ${esc(biz.abn)}) collects personal information only to respond to enquiries, prepare quotes and deliver orders. This page explains what we collect and how it is used.</p>
<h2>What we collect</h2><p>When you send a quote request we collect your name, email address, phone number, delivery suburb and the details of what you want to order. When you phone or visit the yard we may record your name, contact details and delivery address to fulfil an order. We do not collect payment card details through this website.</p>
<h2>How we use it</h2><p>We use your details to reply to your enquiry, arrange pickup or delivery, and keep a record of orders for accounting purposes. We do not sell or rent your information. We may share delivery details with our drivers and dispatch software so your order can be scheduled.</p>
<h2>Website forms and hosting</h2><p>Quote requests are submitted through our hosting provider's form service and emailed to us. The website uses no advertising cookies. Embedded maps are provided by Google and are subject to Google's privacy policy.</p>
<h2>Access and corrections</h2><p>You can ask to see or correct the information we hold about you at any time by emailing <a href="mailto:${biz.email}">${biz.email}</a> or calling ${esc(biz.phoneDisplay)}.</p>
<h2>Contact</h2><p>${esc(biz.name)}, ${esc(biz.address.formatted)}. Phone ${esc(biz.phoneDisplay)}.</p>
<p class="small muted">{{PRIVACY_REVIEW}}: this policy is a plain-English draft and should be reviewed by the client before launch.</p>
</div></section>` });
add({ path: '/404.html', file: '404.html', title: 'Page not found | Surrey Hills Garden Supplies', description: 'That page does not exist. Browse mulch, soil, sand, rock, concrete products and more from Surrey Hills Garden Supplies.', noindex: true, noCta: true,
  hero: `<section class="hero hero--page cut-bottom"><div class="wrap hero__in"><h1>Page not found</h1><p class="hero__text">The page you were after is not here. Try one of our product ranges or call ${esc(biz.phoneDisplay)}.</p><div class="hero__cta"><a class="btn btn--primary" href="/">Home</a><a class="btn btn--ghost" href="/contact/">Contact</a></div></div></section>`,
  body: `<section class="section"><div class="wrap"><div class="grid grid--3">${categories.map(c => `<a class="card" href="/${c.slug}/"><div class="card__body"><h3>${esc(c.name)}</h3><p>${esc(c.tile.slice(0, 100))}…</p></div></a>`).join('')}</div></div></section>` });

/* ---------------- write ---------------- */
function rmrf(p) { if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true }); }
function copyDir(src, dest, skip = []) {
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    if (skip.includes(e.name)) continue;
    const s = path.join(src, e.name), d = path.join(dest, e.name);
    if (e.isDirectory()) copyDir(s, d, skip); else fs.copyFileSync(s, d);
  }
}
// keep generated _redirects; rebuild everything else
const keepRedirects = fs.existsSync(path.join(SITE, '_redirects')) ? fs.readFileSync(path.join(SITE, '_redirects')) : null;
rmrf(SITE); fs.mkdirSync(SITE, { recursive: true });
if (keepRedirects) fs.writeFileSync(path.join(SITE, '_redirects'), keepRedirects);
copyDir(path.join(root, 'assets'), path.join(SITE, 'assets'), ['src', 'products-src']);
fs.copyFileSync(path.join(root, 'data/order-schema.json'), path.join(SITE, 'order-schema.json'));

const urls = [];
for (const p of pages) {
  const html = layout(p);
  const file = p.file ? path.join(SITE, p.file) : path.join(SITE, p.path, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  const h1s = (html.match(/<h1[\s>]/g) || []).length; if (h1s !== 1) warnings.push(`h1 count ${h1s}: ${p.path}`);
  if (!p.noindex && !p.file) urls.push(p.path);
}
fs.writeFileSync(path.join(SITE, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${BASE}${u}</loc><lastmod>${TODAY}</lastmod></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(SITE, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /order/\nDisallow: /author/\nDisallow: /thank-you/\n\nSitemap: ${BASE}/sitemap.xml\n`);
// author archive noindex landing (redirected by Netlify; kept for non-Netlify hosts)
fs.mkdirSync(path.join(SITE, 'author'), { recursive: true });
fs.writeFileSync(path.join(SITE, 'author/index.html'), `<!DOCTYPE html><html lang="en-AU"><head><meta charset="utf-8"><title>Redirecting</title><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=/"><link rel="canonical" href="${BASE}/"></head><body><a href="/">Surrey Hills Garden Supplies</a></body></html>`);

console.log(`built ${pages.length} pages → site/`);
if (warnings.length) { console.log('warnings:'); [...new Set(warnings)].forEach(w => console.log(' -', w)); }
