#!/usr/bin/env node
/* Verifies every old URL in redirects.csv returns a single 301 to the expected new URL (no chains).
   Usage: BASE_URL=https://surreyhillsgardensupplies.com.au node scripts/check-redirects.js
   Also checks http:// and the with/without-trailing-slash variants of each old path.
   Exit code 1 if any check fails. Node 18+ (uses global fetch). */
const fs = require('fs'); const path = require('path');
const BASE = (process.env.BASE_URL || 'https://surreyhillsgardensupplies.com.au').replace(/\/$/, '');
const host = BASE.replace(/^https?:\/\//, '');
const rows = fs.readFileSync(path.join(__dirname, '..', 'redirects.csv'), 'utf8').trim().split('\n').slice(1)
  .map(l => { const [from, to, status] = l.split(','); return { from, to, status: Number(status) }; })
  .filter(r => !r.from.includes('*'));

async function check(url, expectTo) {
  const r = await fetch(url, { redirect: 'manual' });
  const loc = r.headers.get('location') || '';
  const want = expectTo.startsWith('http') ? expectTo : `${BASE}${expectTo}`;
  if (r.status !== 301) return `expected 301, got ${r.status}`;
  if (loc !== want && loc !== expectTo) return `expected → ${want}, got ${loc}`;
  // no chain: the target must answer 200 directly
  const t = await fetch(want, { redirect: 'manual' });
  if (t.status !== 200) return `target ${want} answered ${t.status} (chain or missing page)`;
  return null;
}
(async () => {
  let fails = 0, n = 0;
  const limit = 6; let i = 0;
  await Promise.all(Array.from({ length: limit }, async () => {
    while (i < rows.length) {
      const r = rows[i++];
      if (r.to === r.from + '/') continue; // same path, only slash differs — handled by pretty URLs
      const variants = [`${BASE}${r.from}`, `${BASE}${r.from}/`, `http://${host}${r.from}`];
      for (const v of variants) {
        n++;
        try { const err = await check(v, r.to); if (err) { fails++; console.log('FAIL', v, '→', err); } }
        catch (e) { fails++; console.log('FAIL', v, e.message); }
      }
    }
  }));
  console.log(`${n} checks, ${fails} failures`);
  process.exit(fails ? 1 : 0);
})();
