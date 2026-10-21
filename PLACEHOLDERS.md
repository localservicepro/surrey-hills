# PLACEHOLDERS, ASSUMPTIONS AND GENERATED IMAGES

Everything the client must confirm or supply before launch. Tokens appear in the generated HTML exactly as written here (search the `site/` folder for `{{`). Most live in one place: `data/business.json`.

## 1. Tokens

| Token | Where it lives | Used on | What to supply |
|---|---|---|---|
| `{{STREET_NUMBER}}` | `data/business.json → address.streetNumber` and `address.formatted` | footer, contact page, LocalBusiness schema on every page | **680 or 682** Canterbury Road. The current site shows 680 in the header/footer and 682 in the title tag. Nothing is hard-coded; change it once in business.json and rebuild. |
| `{{HOURS}}` | `data/business.json → hours` | footer, contact page, delivery page | Opening hours as text, e.g. "Mon–Fri 7am–4:30pm, Sat 7:30am–2pm, Sun closed". Not published anywhere on the current site. |
| `{{HOURS_SCHEMA}}` | `data/business.json → openingHoursSpecification` | LocalBusiness JSON-LD | Replace the string with a schema.org `openingHoursSpecification` array (see HANDOFF.md). Until then it is omitted from the schema. |
| `{{ABN}}` | `data/business.json → abn` | footer, privacy page | The ABN. |
| `{{GBP_URL}}` | `data/business.json → gbpUrl` | homepage reviews block, LocalBusiness `sameAs` | Google Business Profile share link. Reviews block stays a placeholder until supplied. |
| `{{GEO_LAT}}` / `{{GEO_LNG}}` | `data/business.json → geo` | LocalBusiness `geo` | Coordinates of the yard (from Google Maps). Omitted from schema until filled. |
| `{{CLIENT_CONTACT}}` | `data/business.json → clientContact` | nowhere public | Client contact name for this project. |
| `{{DELIVERY_FEE_ZONE_1/2/3}}` | `scripts/build.js` (delivery page) | /delivery/ | Delivery fee per zone, or "included over X m³". |
| `{{DELIVERY_FEE_<SUBURB>}}` | `scripts/build.js` (suburb pages) | every /areas/{suburb}/ page | Per-suburb fee, or remove the block once zone fees are set. |
| `{{MIN_ORDER}}` | `scripts/build.js` | /delivery/, suburb pages | Minimum delivery order (e.g. "1 m³"). |
| `{{TRUCK_1_NAME}}`, `{{TRUCK_1_CAPACITY}}`, `{{TRUCK_2_NAME}}`, `{{TRUCK_2_CAPACITY}}` | `scripts/build.js` | /delivery/ | Truck names/sizes and capacities in m³. |
| `{{SUPPLIER_LIST}}` / `{{SUPPLIER_NAME_n}}` | `data/suppliers.json` | homepage supplier strip (alt text + caption) | Confirm the 35 brands below; remove any no longer stocked. |
| `{{PRIVACY_REVIEW}}` | privacy page footer line | /privacy/ | Delete the line once the client has reviewed the policy. |

## 2. Prices — none shown

Every product's `prices` object in `data/products.json` is `null`, which renders as **"Call for price"**. No price was published on the old site and none has been invented. Product schema `offers` is only emitted when a real numeric price exists. Fill `bag15kg`, `bag20kg`, `bulkerBag`, `bulkM3` per product (numbers in AUD, e.g. `"bulkM3": "108"`) and rebuild.

## 3. Assumptions to confirm

1. **Service area (UNCONFIRMED).** The 15 suburbs in `data/suburbs.json` (Surrey Hills, Box Hill, Canterbury, Camberwell, Balwyn, Mont Albert, Blackburn, Burwood, Hawthorn, Kew, Doncaster, Glen Iris, Ashburton, Nunawading, Ringwood) came from the brief, not the client. Distances/drive times are approximate map estimates. Replace with the real delivery zone; add or delete suburb objects and rebuild (HANDOFF.md explains how). The old site had landing pages for ~60 more suburbs (Toorak, Richmond, Bentleigh, Eltham …) — all 301 to `/areas/` or the nearest category, never 404.
2. **Delivery zones on /delivery/** (Zone 1/2/3 grouping) are a placeholder structure.
3. **Formats per product.** `bag15kg / bulkM3 / byoTrailer` were set from the old site's copy ("can bag the product into 15kg bags, bulk loads, truck loads or BYO your trailer"). `bulkerBag` is only enabled on kiln dried sand (the only product where the old site mentions it). Confirm which other products are sold in bulker bags.
4. **concrete-mix vs concrete-mix-bags.** The old site had two URLs with identical copy. Treated as ONE product at `/concrete-products/concrete-mix/` covering bulk Conmix and 20kg bags. If they are genuinely separate products, add `concrete-mix-bags` to `data/products.json`, and change the `concrete-mix-bags` line in `data/redirects-source.json` to `/concrete-products/concrete-mix-bags/`, then `npm run redirects && npm run build`.
5. **Building materials extended range** (brick ties, reo mesh/bar, starter bars, lintels, H beams, sleepers) is mentioned in copy as "being confirmed". When the client sends the list, add products under `building-materials` (steel items can also be listed as variants on `/concrete-products/steel/`, which already has H beam, C channel, angle, flat bar).
6. **Aggregate sizes.** 7mm and 14mm are on the site; the product plan asks which other sizes are carried.
7. **Concrete vs timber sleepers.** Only treated pine sleepers appear on the old site; concrete sleepers (2,900 searches/month in the plan) are not listed anywhere yet.
8. **Builders cement vs GP cement** are listed as separate variants on `/concrete-products/cement/` because the old site described both.
9. **Densities** (t/m³) in `data/products.json` are the brief's defaults (mulch 0.4, soil 1.2, sand 1.5, crushed rock 1.6, scoria 0.9, screenings 1.5, toppings 1.6, crusher dust 1.7; organic mulch 0.5, premium organic soil 1.0, native mix 1.3, 7mm 1.5, Conmix 1.8 are estimates). Adjust per product if the yard's figures differ.
10. **Blog dates and titles** are as shown on the old blog index. Author shown as the business (the old site's author was a WordPress username).
11. **Trading since 2012** comes from the brief and the old footer ("© 2012 – 2026").
12. **"Australian distributor of Smart Grass"** is from the old homepage copy.
13. **Social URLs** use the handles from the old site (`facebook.com/surreyhillsgardensupplies`, `instagram.com/surreyhillsgardensupplies`); confirm both profiles exist.
14. **Quote form** uses Netlify Forms (`data-netlify="true"`, honeypot field). Set the notification email in the Netlify dashboard after the first deploy. If the site is not on Netlify, point the form at another handler.
15. **Map embeds** use a keyless Google Maps embed by address query. Works without an API key; swap for the GBP "embed a map" iframe once the GBP URL is supplied.
16. **Hero video** (`assets/video/hero.mp4`, 5 s, 1280×720, 0.75 MB, muted loop) was generated with Higgsfield Kling 3.0 from the branded yard still. It is illustrative (AI-generated truck decal and yard) and should be replaced with real footage of the yard. It plays on screens ≥700px wide; phones, reduced-motion and data-saver users get the still. To swap it, replace `hero.mp4` (keep it under 4 MB, H.264, no audio) and rebuild.
17. **Old-site product photos.** 73 product photos were carried over from the current website (most are 500×500 px). They are fine for cards and galleries but soft as full-width heroes; replace with new yard photos when possible. Six "category" photos in the client's Drive folder (mulch, sand, soil, cement, scoria, turf) carry a "Picture Partners" stock-photo copyright tag in their EXIF; they are the same images the old site used. Confirm the licence or replace with yard photos.

## 4. Brand colours sampled from the logo

`Surrey-Hills-1.png` (476×120) contains exactly two colours:

| Role | Hex | Source |
|---|---|---|
| Logo green (primary action) | `#8CC73F` | sampled, 6,208 px |
| White | `#FFFFFF` | sampled, 4,489 px |
| Dark neutral (base) | `#171A14` | **not in the logo** — derived from the soil photo (#171209) and bluestone (#494741) |
| Green dark (hover) | `#6EA52A` | darkened logo green |
| Off-white sections | `#F5F3EE` | chosen |
| Bark brown | `#523027` / `#936B54` | sampled from Mulch2.jpeg |
| Sand | `#EDE4D3` / `#B38D5F` | sampled from sand.jpeg |
| Bluestone grey | `#7E7A72` / `#494741` | sampled from Bluestone.jpeg |
| Scoria | `#997668` | sampled from Scoria3-1.jpeg |

All in `assets/css/tokens.css`. **Logo placement note:** the brief assumed the logo could sit on white, but the "GARDEN SUPPLIES" line of the artwork is white, so on a white background it disappears. The logo therefore sits on a dark-neutral rounded tile in the header and on the dark footer; it is never recoloured, stretched or cropped. If the client has a version of the logo with a dark second line, drop it in `assets/img/logo/` and the header tile can go back to white. Favicon and touch icons crop the palm icon only.

## 5. Generated images (Higgsfield, nano_banana_pro) — replace with real photos

The client's Drive folder contained no truck, loader, bagging or delivery photos, and the old site had no drainage/steel yard shots, so these were generated. Each is listed in `data/generated-images.json` with its prompt and where it is used. Pages that use one carry a small "illustrative image" note.

| File (assets/img/products/…) | Used on | Replace with |
|---|---|---|
| `gen-hero-yard` | Home hero | wide photo of the real yard |
| `gen-tipper-delivery` | Home "how we deliver", /areas/ hero, every suburb page hero | SHGS truck tipping a load |
| `gen-loader-trailer` | /delivery/ hero, /about/ | loader filling a trailer at the yard |
| `gen-bags-15kg` | /calculator/ hero | bagged product at the yard |
| `gen-bulker-bag`, `gen-drainage-hero`, `gen-drainage-tile`, `gen-steel-hero`, `gen-steel-tile`, `gen-crushed-rock-tile` | not placed (spares for drainage/steel/lintel pages when the extended range is added) | yard photos |

Everything else on the site is either from the client's Drive folder (`yard-01` panorama, the six category product shots, the logo) or carried over from the current website (product photos, blog images, 35 supplier logos).

## 6. Supplier logos (carried over from the current homepage — confirm)

Cement Australia, Yates, Grow Better, Rally, Holman, EverEdge, Auseal, Masonry Construction Products, Vinidex, Marx, UltraColor, Donaghys, Heiniger, Medalist, Bayer Advanced, Supercraft, SafeCorp, Colorlinx, Marshalltown, H.B. Fuller, Ancora Pavan, Arrow, Dy-Mark, Geelong Brush, Marco Pesaro, Valley Seeds, Wasp Trade Tools, Rx Plastics, Ransom Toolworks, Gripwell, Sequence, Gardena, Flexovit, Melbourne Nails Aust, Cyclone. (`data/suppliers.json`)

## 7. Reviews

No reviews are shown. The homepage reviews block is a labelled placeholder until the GBP URL is supplied and reviews are exported (paste them into a `data/reviews.json` and render them in `scripts/build.js`; see HANDOFF.md).
