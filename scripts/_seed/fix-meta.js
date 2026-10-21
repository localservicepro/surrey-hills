#!/usr/bin/env node
// One-off: tighten titles (≤60) and meta descriptions (≤155) and top up thin product copy.
const fs = require('fs'); const path = require('path');
const root = path.join(__dirname, '..', '..');
const cats = JSON.parse(fs.readFileSync(path.join(root, 'data/categories.json')));
const prods = JSON.parse(fs.readFileSync(path.join(root, 'data/products.json')));

const md = {
  // categories
  "soil": "Blended soil, premium organic soil and native garden mix from our Surrey Hills yard. 15kg bags or bulk loads delivered to Melbourne's east in under 2 hours.",
  "sand": "Brick sand, washed sand, triple washed and kiln dried sand in Surrey Hills. Bags, bulker bags or bulk loads delivered to Melbourne's east in under 2 hours.",
  "rock-and-stone": "Crushed rock, scoria, screenings, Tuscan toppings, 7mm aggregate and crusher dust. 15kg bags, trailer or bulk delivery from Surrey Hills to Melbourne's east.",
  "concrete-products": "Cement Australia bagged cement, concrete mix, rapid set, reo mesh, bar chairs, oxides and additives. Pickup or delivery from Surrey Hills Garden Supplies.",
  "tool-shop": "Bricklaying, concreting, plastering and landscaping tools, safety gear and garden products. Trade-quality tools at fair prices, Surrey Hills Garden Supplies.",
  "grass": "Smart Grass synthetic lawn, instant turf, lawn seed, edging and installation items. Surrey Hills Garden Supplies is the Australian distributor of Smart Grass.",
  "building-materials": "Bricks, pavers, besser blocks, sleepers, star pickets, reo mesh, lintels and brick ties from Surrey Hills Garden Supplies. Yard pickup or delivered.",
  "drainage": "Ag pipe, plastic drainage pits and fittings, scoria and screenings for garden and site drainage. Large and small orders from Surrey Hills Garden Supplies.",
  // products
  "10mm-pine-bark": "10mm pine bark mulch (cottage bark, tan bark) in 15kg bags, bulk loads or BYO trailer from Surrey Hills. Delivered to Melbourne's east in under 2 hours.",
  "20mm-pine-bark": "20mm pine bark mulch for large beds and under trees. Bagged, bulk or BYO trailer from Surrey Hills Garden Supplies, delivered in under 2 hours.",
  "black-midnight-mulch": "Black Midnight mulch: dyed recycled timber mulch that holds its colour. 15kg bags, bulk loads or BYO trailer from Surrey Hills, delivered in under 2 hours.",
  "organic-mulch": "Composted organic mulch (compost mulch) that feeds the soil as it breaks down. 15kg bags, bulk or BYO trailer from Surrey Hills Garden Supplies.",
  "soft-play-mulch": "Soft Play certified playground mulch (AS/NZS 4422) from Surrey Hills Garden Supplies. Ordered in for you, minimum 6m³, delivered across Melbourne's east.",
  "blended-soil": "Blended soil: sawdust, sandy loam, chicken manure and pine fines. The all-rounder for lawns, turf, beds and fill. Bags, bulk or BYO trailer, Surrey Hills.",
  "premium-organic-soil": "Premium organic soil: 50/50 organic mulch and blended soil for vegie patches, raised beds and pots. Bags, bulk or trailer from Surrey Hills Garden Supplies.",
  "native-garden-mix": "Native garden mix: 50% washed sand, 50% blended soil for Australian natives and drainage. 15kg bags, bulk or BYO trailer from Surrey Hills Garden Supplies.",
  "white-brick-sand": "White brick sand (builders sand) for bricklaying and packing. 1m³ lays about 1,000 bricks. Bags, bulk or BYO trailer from Surrey Hills Garden Supplies.",
  "washed-sand": "Washed sand (concrete sand) for paving, concreting and plastering. Coarse, clean and free draining. Bags, bulk or BYO trailer from Surrey Hills.",
  "triple-washed-sand": "Triple washed sand for tiling, grouting, rendering, shower bases and sandpits. Bags, bulk loads or BYO trailer from Surrey Hills Garden Supplies.",
  "kiln-dried-sand": "Kiln dried silica sand for synthetic grass infill and paver joints. 20kg bags, 1-tonne bulker bags or bulk loads up to 12m³ from Surrey Hills.",
  "crushed-rock": "20mm crushed rock with fines (class 4) for driveways, paths, slabs and tank bases. 15kg bags, bulk or BYO trailer from Surrey Hills Garden Supplies.",
  "tuscan-toppings": "Tuscan toppings: decorative 14mm crushed sandstone in tan and terracotta tones for paths, driveways and nature strips. Bags or bulk from Surrey Hills.",
  "14mm-screenings": "14mm screenings: clean single-size stone for concrete, drainage backfill, pipe bedding and toppings. Bags, bulk or BYO trailer from Surrey Hills.",
  "scoria": "14–20mm red scoria: light, porous volcanic rock for drainage, retaining wall backfill and toppings. 15kg bags, bulk or BYO trailer from Surrey Hills.",
  "7mm-aggregate": "7mm aggregate (quarter minus) for pipe bedding, fine concrete, paving base and toppings. 15kg bags, bulk or BYO trailer from Surrey Hills Garden Supplies.",
  "crusher-dust": "Crusher dust (Eco Base): fines to 5mm blue metal that compacts hard. The base for synthetic grass, paths and slabs. Bags, bulk or trailer, Surrey Hills.",
  "large-rubble-rock": "40mm rock, 60mm and 80–100mm rubble for construction sites, car parks and feature beds. Ordered in, minimum 6m³, delivered within hours from Surrey Hills.",
  "cement": "Cement Australia 20kg bags: GP, builders and off-white cement, concrete mix, rapid set, mortar mix and hydrated lime. Pickup or delivered from Surrey Hills.",
  "concrete-mix": "Concrete mix: bulk Conmix (washed sand and 14mm aggregate) by the cubic metre, or 20kg bagged mix. Pickup, BYO trailer or delivered from Surrey Hills.",
  "steel": "Ute mesh SL62/SL72, trench mesh, reo bar, galvanised H beam, C channel, angle and flat bar from Surrey Hills Garden Supplies. Yard pickup or delivered.",
  "additives": "Colorlinx oxides, Auseal sealers, Gibco MRF, Best Bond, brick waterproofer, plasticiser, cold bitumen, hydrochloric acid and liquid lime at Surrey Hills.",
  "plastic": "Black builders plastic in 100um and 200um, rolls from 5x2m to 50x4m and sold per metre. Under-slab vapour barrier and site cover from Surrey Hills.",
  "bar-chairs": "Plastic bar chairs in 25/40, 50/65 and 75/90mm plus trench chairs for 8–12mm steel, to hold reo mesh at the right cover. Surrey Hills Garden Supplies.",
  "tools": "Marshalltown and Marco Pesaro trowels, floats, jointers, levels, line blocks, diamond blades, hammers, chisels, rakes and brooms at Surrey Hills Garden Supplies.",
  "safety-products": "Gloves, safety glasses, dust masks, ear plugs, knee pads, hi-vis vests, barrier tape and bollards for trades and home owners at Surrey Hills Garden Supplies.",
  "garden-products": "Dynamic Lifter, poultry, sheep and cow manure, gypsum, lime, lawn seed and starter kits, weed mat, geotextile and pest control at Surrey Hills Garden Supplies.",
  "smart-grass": "Smart Grass synthetic lawn from 12mm sports to 40mm residential, 7-year warranty. Surrey Hills Garden Supplies is the Australian distributor. Samples at the yard.",
  "artificial-grass-items": "Everything to install synthetic grass: kiln dried sand, rubber infill, joining tape, 150mm nails, glue and Smell B Gone pet infill from Surrey Hills.",
  "instant-turf": "Instant turf fresh from the farm: Kings Pride Buffalo, Tall Fescue, Kikuyu and Santa Ana Couch. Minimum 30m², 2–3 days, delivered by Surrey Hills.",
  "lawn-edging": "EverEdge steel edging in Corten, brown and black, Link Edge aluminium, jarrah edging in 4.2m lengths and plastic edging from Surrey Hills Garden Supplies.",
  "building-products": "Besser blocks, recycled red bricks, bluestone pitchers, treated pine sleepers, star pickets, hoop iron, ties, dampcourse and subfloor vents at Surrey Hills.",
  "drainage-supplies": "Ag pipe in various sizes, plastic drainage pits, grates and fittings, geotextile, scoria and screenings for site drainage from Surrey Hills Garden Supplies."
};
const titles = {
  "tool-shop": "Tool Shop Surrey Hills | Bricklaying & Concreting Tools",
  "building-materials": "Building Materials Surrey Hills | Bricks, Blocks & Mesh",
  "smart-grass": "Smart Grass Synthetic Grass Surrey Hills | AU Distributor"
};
const extra = {
  "native-garden-mix": "<p>Because it is half sand, native garden mix is lighter and freer draining than our blended soil, so it also works as a top dressing on compacted lawns and as a planting mix in raised beds where water tends to sit. Like all our soils it is a natural blend, so slight variations in colour and texture can occur between loads.</p>",
  "triple-washed-sand": "<p>Triple washed sand is a fine, pale sand that stays consistent from load to load, which is why tilers and renderers specify it: there is no clay to weaken an adhesive or streak a render. Keep it covered on site so it stays clean, and allow about 1.5 tonnes per cubic metre when working out trailer loads.</p>",
  "miscellaneous-items": "<p>Half wine barrels are heavy and awkward to carry, so most customers either collect them with a trailer or add one to a bulk delivery of soil and mulch. If you want a barrel planted up, a half barrel takes roughly 0.15 cubic metres of soil, which is about ten 15kg bags of premium organic soil.</p>"
};
for (const c of cats) if (md[c.slug]) c.metaDescription = md[c.slug];
for (const p of prods) { if (md[p.slug]) p.metaDescription = md[p.slug]; if (titles[p.slug]) p.title = titles[p.slug]; if (extra[p.slug]) p.bodyHtml = (p.bodyHtml ? p.bodyHtml + '\n' : '') + extra[p.slug]; }
for (const c of cats) if (titles[c.slug]) c.title = titles[c.slug];
fs.writeFileSync(path.join(root, 'data/categories.json'), JSON.stringify(cats, null, 2) + '\n');
fs.writeFileSync(path.join(root, 'data/products.json'), JSON.stringify(prods, null, 2) + '\n');
for (const x of [...cats, ...prods]) { if (x.title.length > 60) console.log('TITLE LONG', x.slug, x.title.length); if (x.metaDescription.length > 155) console.log('MD LONG', x.slug, x.metaDescription.length); }
console.log('meta fixed');
