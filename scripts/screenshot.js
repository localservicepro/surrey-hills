#!/usr/bin/env node
/* Screenshots key pages at mobile and desktop widths with Playwright (dev aid).
   Usage: node scripts/screenshot.js [baseUrl]   → writes to lighthouse/shots/ */
const path = require('path'); const fs = require('fs');
const base = process.argv[2] || 'http://localhost:8080';
const out = path.join(__dirname, '..', 'lighthouse', 'shots'); fs.mkdirSync(out, { recursive: true });
const pages = ['/', '/mulch/', '/mulch/10mm-pine-bark/', '/areas/box-hill/', '/calculator/', '/contact/', '/blog/which-mulch-do-i-use-around-my-home/'];
(async () => {
  const { chromium } = require('playwright');
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
  for (const [name, vp] of [['mobile', { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }], ['desktop', { width: 1366, height: 900 }]]) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.deviceScaleFactor || 1, isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    for (const p of pages) {
      await page.goto(base + p, { waitUntil: 'networkidle' });
      await page.evaluate(() => new Promise(r => { window.scrollTo(0, document.body.scrollHeight); setTimeout(() => { window.scrollTo(0, 0); r(); }, 600); }));
      await page.screenshot({ path: path.join(out, `${name}${p.replace(/\//g, '_') || '_home'}.png`), fullPage: true });
    }
    console.log(name, 'errors:', errors.length ? errors : 'none');
    await ctx.close();
  }
  await browser.close();
})();
