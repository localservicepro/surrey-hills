#!/usr/bin/env node
/* Converts source photography into optimised WebP sizes.
     assets/img/src/            → assets/img/<name>-{400,800,1600}.webp   (site photography: hero, category tiles)
     assets/img/products-src/   → assets/img/products/<name>-{400,800,1600}.webp
     assets/img/suppliers-src/  → assets/img/suppliers/<name>-{400,800}.webp
   Also writes data/_image-dims.json (width/height of each -800 file, used by the build for width/height attrs)
   and assets/img/og-default.jpg (1200×630).
   Uses sharp (npm install) and falls back to Python/Pillow. Run: npm run images */
const fs = require('fs'); const path = require('path'); const cp = require('child_process');
const root = path.join(__dirname, '..');
const JOBS = [
  { src: 'assets/img/src', out: 'assets/img', key: '', sizes: [1600, 800, 400] },
  { src: 'assets/img/products-src', out: 'assets/img/products', key: 'products/', sizes: [1600, 800, 400] },
  { src: 'assets/img/suppliers-src', out: 'assets/img/suppliers', key: 'suppliers/', sizes: [800, 400] }
];
let sharp = null; try { sharp = require('sharp'); } catch (e) {}
const dimsPath = path.join(root, 'data/_image-dims.json');
const dims = fs.existsSync(dimsPath) ? JSON.parse(fs.readFileSync(dimsPath)) : {};

async function convert(f, out, w, q) {
  if (sharp) {
    await sharp(f).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: q, effort: 6 }).toFile(out);
    const m = await sharp(out).metadata(); return [m.width, m.height];
  }
  const r = cp.execFileSync('python3', ['-I', '-c', `
from PIL import Image, ImageOps; import sys
im=ImageOps.exif_transpose(Image.open(sys.argv[1])).convert('RGB'); w=int(sys.argv[3])
if im.width>w: im=im.resize((w, round(im.height*w/im.width)), Image.LANCZOS)
im.save(sys.argv[2],'WEBP',quality=int(sys.argv[4]),method=6); print(im.width, im.height)`, f, out, String(w), String(q)]).toString().trim().split(' ').map(Number);
  return r;
}
(async () => {
  let n = 0;
  for (const job of JOBS) {
    const srcDir = path.join(root, job.src); if (!fs.existsSync(srcDir)) continue;
    const outDir = path.join(root, job.out); fs.mkdirSync(outDir, { recursive: true });
    for (const f of fs.readdirSync(srcDir)) {
      if (!/\.(jpe?g|png|webp)$/i.test(f) || /^logo/i.test(f)) continue;
      const base = f.replace(/\.(jpe?g|png|webp)$/i, '');
      for (const w of job.sizes) {
        const out = path.join(outDir, `${base}-${w}.webp`);
        const [cw, ch] = await convert(path.join(srcDir, f), out, w, w >= 1600 ? 72 : (w === 800 ? 70 : 68));
        if (w === 800) dims[job.key + base + '-800'] = [cw, ch];
      }
      n++;
    }
  }
  fs.writeFileSync(dimsPath, JSON.stringify(dims, null, 0) + '\n');
  // OG default image (1200x630) from the hero
  const og = ['assets/img/products-src/gen-hero-yard.jpg', 'assets/img/src/yard-01.jpg'].map(p => path.join(root, p)).find(fs.existsSync);
  if (og) {
    if (sharp) await sharp(og).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 80 }).toFile(path.join(root, 'assets/img/og-default.jpg'));
    else cp.execFileSync('python3', ['-I', '-c', `from PIL import Image, ImageOps; import sys; ImageOps.fit(Image.open(sys.argv[1]).convert('RGB'),(1200,630)).save(sys.argv[2],quality=80)`, og, path.join(root, 'assets/img/og-default.jpg')]);
  }
  console.log(`converted ${n} source images; dims cache → data/_image-dims.json`);
})();
