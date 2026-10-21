#!/usr/bin/env node
/* Runs Lighthouse (mobile + desktop) against a local server and writes a summary table.
   Usage: npx http-server site -p 8080 -c-1 &  then  node scripts/lighthouse.js [baseUrl]
   Requires: npm i -D lighthouse (not a production dependency). Writes lighthouse/summary.json + .md */
const path = require('path'); const fs = require('fs'); const cp = require('child_process');
const base = process.argv[2] || 'http://localhost:8080';
const out = path.join(__dirname, '..', 'lighthouse'); fs.mkdirSync(out, { recursive: true });
const pages = ['/', '/mulch/', '/mulch/10mm-pine-bark/', '/areas/box-hill/', '/calculator/', '/contact/', '/blog/which-mulch-do-i-use-around-my-home/'];
const chrome = process.env.CHROME_PATH || '/opt/pw-browsers/chromium';
const rows = [];
for (const p of pages) {
  for (const form of ['mobile', 'desktop']) {
    const file = path.join(out, `${form}${p.replace(/\//g, '_') || '_home'}.json`);
    const args = ['lighthouse', base + p, '--output=json', `--output-path=${file}`, '--quiet', '--chrome-flags=--headless=new --no-sandbox --disable-gpu', '--only-categories=performance,accessibility,best-practices,seo'];
    if (form === 'desktop') args.push('--preset=desktop');
    try { cp.execFileSync('npx', args, { env: Object.assign({}, process.env, { CHROME_PATH: chrome }), stdio: 'inherit', timeout: 180000 }); } catch (e) { console.log('lighthouse failed', p, form); continue; }
    const r = JSON.parse(fs.readFileSync(file)); const c = r.categories;
    rows.push({ page: p, form, performance: Math.round(c.performance.score * 100), accessibility: Math.round(c.accessibility.score * 100), bestPractices: Math.round(c['best-practices'].score * 100), seo: Math.round(c.seo.score * 100), lcp: r.audits['largest-contentful-paint'].displayValue, cls: r.audits['cumulative-layout-shift'].displayValue });
  }
}
fs.writeFileSync(path.join(out, 'summary.json'), JSON.stringify(rows, null, 2));
const md = ['| Page | Form | Perf | A11y | Best | SEO | LCP | CLS |', '|---|---|---|---|---|---|---|---|'].concat(rows.map(r => `| ${r.page} | ${r.form} | ${r.performance} | ${r.accessibility} | ${r.bestPractices} | ${r.seo} | ${r.lcp} | ${r.cls} |`)).join('\n');
fs.writeFileSync(path.join(out, 'summary.md'), md + '\n');
console.log(md);
