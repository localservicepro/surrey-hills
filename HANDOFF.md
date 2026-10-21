# HANDOFF — Surrey Hills Garden Supplies static site

Plain HTML site generated from JSON. No framework. Open `site/index.html` in a browser (or `npm run serve`) and it works; Node is only needed to regenerate pages after editing data.

```
data/            ← edit these (copy, prices, suburbs, posts, NAP)
assets/          ← css, js, fonts, images (src folders hold originals)
scripts/         ← build.js, images.js, build-redirects.js, check-redirects.js, lighthouse.js
site/            ← GENERATED output (committed so it deploys with zero tooling)
netlify.toml, redirects.csv, site/_redirects
```

## Commands

| Command | What it does |
|---|---|
| `npm install` | installs `sharp` (optional, for image conversion). The build itself has no dependencies. |
| `npm run build` | regenerates `site/` from `data/` (77 pages, sitemap.xml, robots.txt). Prints warnings for titles >60, descriptions >155, missing images, thin copy, duplicate H1s. |
| `npm run images` | converts `assets/img/src`, `assets/img/products-src`, `assets/img/suppliers-src` into 400/800/1600 WebP and refreshes `data/_image-dims.json`. Run after adding photos, then `npm run build`. |
| `npm run redirects` | regenerates `redirects.csv`, `site/_redirects` and the redirect block in `netlify.toml` from `data/redirects-source.json`. |
| `npm run fetch-images` | re-downloads the old site's product photos (if ever needed) from the WordPress media API into `products-src`, then runs `images`. |
| `BASE_URL=https://surreyhillsgardensupplies.com.au npm run check-redirects` | after go-live: fetches every old URL (http/https, with/without slash) and asserts one 301 to the mapped page, no chains. |
| `npm run serve` | local server on :8080. `node scripts/lighthouse.js` runs Lighthouse against it (needs `npm i -D lighthouse`). |

## Change hours, address, phone, ABN, socials (NAP)

All in `data/business.json`. It feeds the header phone, footer, contact page, delivery page, map query and the LocalBusiness JSON-LD on every page. Then `npm run build`.

For opening hours in schema, replace the `openingHoursSpecification` string with:
```json
[
  {"@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "07:00", "closes": "16:30"},
  {"@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "07:30", "closes": "14:00"}
]
```

## Add or edit a product

1. Add an object to `data/products.json` (copy an existing one). Required: `slug`, `category` (one of the 9 category slugs), `name`, `h1`, `title` (≤60), `metaDescription` (≤155), `short`, `intro`, `bodyHtml` (simple HTML: p/h3/ul/li), `formats`, `prices`, `density` (t/m³, or `null` for non-bulk items — this also hides the calculator), `bagWeightKg`, `images`, `fallbackImage`, `faqs`.
2. `alsoIn: ["grass"]` cross-lists the product on another category page **without** creating a second URL.
3. Photos: drop `assets/img/products-src/<slug>-1.jpg`, `<slug>-2.jpg` … then `npm run images`. The `images` array in the product gives each one its alt text. If a photo is missing the build falls back to `fallbackImage` (a name from `assets/img/src`).
4. Prices: put numbers in `prices.bag15kg` etc. (`"38"` renders as `38`; keep the currency out). `null` renders "Call for price". A numeric price also switches on Product `offers` schema.
5. `npm run build`. The product appears on its category page, the sitemap, related-product blocks and the calculator product list (if it has a density).

## Add or edit a category

`data/categories.json`: `slug`, `name`, `navLabel`, `h1`, `title`, `metaDescription`, `tile` (homepage tile copy), `image` (name from `assets/img/src`), `intro` (150–250 words), `howToChoose[]`, `faqs[]`, `related[]`. The main nav is fixed in `scripts/build.js` (`NAV` array) so adding a category also means adding it to `NAV` if it should appear in the header.

## Add a suburb page

Add an object to `data/suburbs.json`: `slug`, `name`, `postcode`, `distanceKm`, `driveMins`, `title`, `metaDescription`, `h1`, `intro`, `body` (array of HTML paragraphs, aim ≥300 words of non-templated copy), `popularProducts` (5 × `"category/slug"`), `faqs` (3), `landmarks`. The page, the footer link, the areas index card, the LocalBusiness `areaServed` and the redirect rule for old `garden-supplies-in-<slug>` URLs all follow automatically. `npm run redirects && npm run build`.

## Add a blog post

Add to `data/posts.json`: `slug`, `title`, `date` (YYYY-MM-DD), `excerpt` (≤155 chars, used as meta description), `bodyHtml`, `relatedProducts` (array of product paths like `/mulch/organic-mulch/`). Hero image: save `assets/img/products-src/post-<slug>.jpg`, run `npm run images`, then `npm run build`. BlogPosting schema is generated.

## Reviews (when the GBP link arrives)

Create `data/reviews.json` (`[{author, rating, text, date}]`), then in `scripts/build.js` replace the `.placeholder` block in the home `rev-h` section with a loop rendering `.review` cards (markup already styled in `main.css`: `.reviews > .review > .review__stars / blockquote / cite`). Keep quotes verbatim.

## Calculator

`assets/js/calculator.js` mounts on any element with `data-calculator`; `data-product="<slug>"` pre-selects a product. The product list is embedded by the build as `<script id="calc-products" type="application/json">` from `data/products.json` (`density`, `bagWeightKg`, `formats`, `minOrder`). Results round up to 0.25 m³. The "Get a quote for this" button links to `/contact/?product=…&qty=…&note=…`, which `main.js` uses to prefill the form.

## Redirects

`data/redirects-source.json` holds the 245 old WordPress slugs, explicit mappings and keyword rules. `npm run redirects` writes three outputs: `redirects.csv` (audit trail), `site/_redirects` (Netlify, with and without trailing slash, `301!` forced) and the `[[redirects]]` block in `netlify.toml`. `/author/*` → `/` and `/order/` are `noindex` via headers in `netlify.toml` and `robots.txt`.

## Deploy (Netlify)

1. New site from this repo. Build command `npm run build`, publish directory `site` (already in `netlify.toml`). The committed `site/` also deploys unchanged if the build command is left blank.
2. Add the custom domain `surreyhillsgardensupplies.com.au` (apex) and `www` → Netlify redirects www to apex; `_redirects` also forces https.
3. Forms: the quote form is detected automatically (`data-netlify`). Set the notification email under Site settings → Forms.
4. After DNS cut-over run `BASE_URL=https://surreyhillsgardensupplies.com.au npm run check-redirects` and submit `sitemap.xml` in Search Console.

## Phase 3 — online ordering

`/order/` is a `noindex` stub. The payload contract for the Swift Dispatch integration is `data/order-schema.json` (also published at `/order-schema.json`). Build the order UI into `/order/` without changing its URL; product slugs and the `format` enum (`bag15 | bag20 | bulkerBag | bulkM3`) are the join keys.
