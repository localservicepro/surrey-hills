#!/usr/bin/env node
/* Converts source photography in assets/img/src/ (and assets/img/products-src/ if present)
   into optimised WebP sizes under assets/img/. Uses sharp (npm i) — falls back to Python/PIL.
   Output naming:  <name>-1600.webp (hero/product main), <name>-800.webp (cards), <name>-400.webp (thumbs)
   Run: npm run images */
const fs = require('fs'); const path = require('path'); const cp = require('child_process');
const root = path.join(__dirname, '..');
const SRC_DIRS = [path.join(root, 'assets/img/src'), path.join(root, 'assets/img/products-src')];
const OUT = path.join(root, 'assets/img');
const SIZES = [1600, 800, 400];
let sharp = null; try { sharp = require('sharp'); } catch (e) {}

const files = [];
for (const d of SRC_DIRS) if (fs.existsSync(d)) for (const f of fs.readdirSync(d)) if (/\.(jpe?g|png|webp)$/i.test(f)) files.push(path.join(d, f));
if (!files.length) { console.log('no source images found'); process.exit(0); }

(async () => {
  for (const f of files) {
    const base = path.basename(f).replace(/\.(jpe?g|png|webp)$/i, '');
    const isProduct = f.includes('products-src');
    const outDir = isProduct ? path.join(OUT, 'products') : OUT;
    fs.mkdirSync(outDir, { recursive: true });
    if (/^logo/i.test(base)) continue; // logo handled separately (kept as PNG, never recompressed lossy)
    for (const w of SIZES) {
      const out = path.join(outDir, `${base}-${w}.webp`);
      if (sharp) {
        const img = sharp(f); const meta = await img.metadata();
        if (meta.width < w && w !== SIZES[SIZES.length - 1] && meta.width < 800) { /* upscale guard: still write smaller sizes */ }
        await img.resize({ width: w, withoutEnlargement: true }).webp({ quality: w === 1600 ? 78 : 76, effort: 5 }).toFile(out);
      } else {
        cp.execFileSync('python3', ['-I', '-c', `
from PIL import Image; import sys
im=Image.open(sys.argv[1]).convert('RGB'); w=int(sys.argv[3])
if im.width>w: im=im.resize((w, round(im.height*w/im.width)), Image.LANCZOS)
im.save(sys.argv[2],'WEBP',quality=78,method=6)`, f, out, String(w)]);
      }
    }
    console.log('✓', base);
  }
  // OG default image (1200x630) from the yard photo
  const og = files.find(f => /yard-01/.test(f));
  if (og && sharp) await sharp(og).resize(1200, 630, { fit: 'cover', position: 'centre' }).jpeg({ quality: 80 }).toFile(path.join(OUT, 'og-default.jpg'));
})();
