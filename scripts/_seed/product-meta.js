// Hand-authored product metadata used ONCE by seed-products.js to generate data/products.json
// from the scraped copy in data/_old/pages.json. After seeding, edit data/products.json directly.
// Densities are t/m³ (defaults from the brief; editable per product). bagWeightKg is the standard pickup bag.
// formats: bag15kg | bag20kg | bulkerBag | bulkM3 | byoTrailer | pickupOnly | roll | each
// prices are intentionally empty (POA) — never fake a price.

const BULK = { bag15kg: true, bag20kg: false, bulkerBag: false, bulkM3: true, byoTrailer: true };
const BAGGED20 = { bag15kg: false, bag20kg: true, bulkerBag: false, bulkM3: false, byoTrailer: false };
const SHOP = { bag15kg: false, bag20kg: false, bulkerBag: false, bulkM3: false, byoTrailer: false, pickupOnly: true };

module.exports = [
  // ---------------- MULCH ----------------
  {
    slug: "10mm-pine-bark", oldSlug: "10mm-pine-bark", category: "mulch",
    name: "10mm Pine Bark", searchName: "Pine Bark Mulch", keyword: "pine bark mulch",
    title: "10mm Pine Bark Mulch Surrey Hills | Bulk & Bagged | SHGS",
    metaDescription: "10mm pine bark mulch (cottage bark, tan bark) from Surrey Hills Garden Supplies. 15kg bags, bulk loads or BYO trailer, delivered to Melbourne's east in under 2 hours.",
    short: "Fine chocolate-brown pine bark for high-profile garden beds. Does not blow or wash away.",
    intro: "10mm pine bark is the mulch most Surrey Hills customers come back for. It is a fine, even, chocolate-brown bark that sits flat on a garden bed, holds moisture through summer and does not blow about in a northerly. We hold it in a bay on the Canterbury Road yard, bag it into 15kg bags for pickup, load trailers, and deliver it in bulk by the cubic metre across Melbourne's eastern suburbs, usually in less than two hours.",
    density: 0.4, bagWeightKg: 15, formats: BULK, images: ["10mm-Pine-Mulch", "10mm-Pine-Mulch2", "10mm-Pine-Mulch-1"], localImage: "mulch-02",
    faqs: [
      {q: "How much 10mm pine bark do I need?", a: "At 100mm deep one cubic metre covers about 10 square metres; at 75mm it covers about 13 square metres. Use the calculator above and add 10% for settling."},
      {q: "Is 10mm pine bark the same as tan bark?", a: "Yes. 10mm pine bark is also sold as cottage bark or tan bark. It is the finer grade; 20mm pine bark is the chunkier version."}
    ]
  },
  {
    slug: "20mm-pine-bark", oldSlug: "20mm-pine-bark", category: "mulch",
    name: "20mm Pine Bark", keyword: "pine bark mulch",
    title: "20mm Pine Bark Mulch Surrey Hills | Bulk & Bagged | SHGS",
    metaDescription: "20mm pine bark mulch for large beds and under trees. Bagged, bulk or BYO trailer from Surrey Hills Garden Supplies, delivered across Melbourne's east in under 2 hours.",
    short: "Chunky brown pine bark for larger beds, slopes and under trees. Long lasting and low maintenance.",
    intro: "20mm pine bark is the bigger brother of our 10mm bark: the same plantation pine, screened to a chunkier grade that spreads further and lasts longer between top-ups. It is the mulch to choose for big open beds, slopes and the areas under established trees where leaves fall and need to blend in. Available in 15kg bags, by the trailer load or delivered in bulk from the Surrey Hills yard.",
    density: 0.4, bagWeightKg: 15, formats: BULK, images: ["20mm-Pine-Mulch", "20mm-Pine-Mulch2"], localImage: "mulch-02",
    faqs: [
      {q: "Should I use 10mm or 20mm pine bark?", a: "Use 10mm for a fine finish on beds close to the house, and 20mm for large beds, slopes and under trees where a chunkier, longer-lasting cover suits better."}
    ]
  },
  {
    slug: "black-midnight-mulch", oldSlug: "black-midnight-mulch", category: "mulch",
    name: "Black Midnight Mulch", searchName: "Black Mulch", keyword: "black mulch",
    title: "Black Mulch Surrey Hills | Black Midnight Mulch | SHGS",
    metaDescription: "Black Midnight mulch: dyed recycled timber mulch that holds its colour. 15kg bags, bulk loads or BYO trailer from Surrey Hills, delivered in under 2 hours across Melbourne's east.",
    short: "Decorative jet-black dyed mulch that holds its colour. Makes greens and flowers pop.",
    intro: "Black mulch gives a garden the sharp, contemporary look that modern Melbourne builds ask for. Our Black Midnight mulch is a recycled timber mulch, cleaned of nails and plastics and coloured with an environmentally friendly dye that holds for far longer than untreated mulch. It is purely decorative, so pair it with a good soil underneath. Sold in 15kg bags, by the trailer load or delivered in bulk from Surrey Hills.",
    density: 0.4, bagWeightKg: 15, formats: BULK, images: ["Black-Mulch", "Black-Mulch-2"], localImage: "mulch-02",
    faqs: [
      {q: "Does black mulch stain?", a: "It can while fresh. Wear gloves when spreading it and lay a tarp down where a bulk load is tipped, especially on concrete or pavers."},
      {q: "How long does black mulch keep its colour?", a: "The Longalife colouring holds substantially longer than traditional mulches. Turning it over with a fork every six weeks keeps the surface looking fresh."}
    ]
  },
  {
    slug: "organic-mulch", oldSlug: "organic-mulch", category: "mulch",
    name: "Organic Mulch", keyword: "organic mulch",
    title: "Organic Mulch Surrey Hills | Compost Mulch Bulk & Bagged",
    metaDescription: "Composted organic mulch (compost mulch) that feeds the soil as it breaks down. 15kg bags, bulk loads or BYO trailer from Surrey Hills Garden Supplies, delivered in under 2 hours.",
    short: "Composted garden organics that feed the soil as they break down. Great for vegie beds and rejuvenation.",
    intro: "Organic mulch is the one to choose when you want the garden fed, not just covered. It is made by controlled batch composting of soft garden organics, leaves and small branches, aged until mature, and it is dark grey to almost black when moist. Spread 75–100mm over a bed and it holds moisture, suppresses weeds and slowly releases nutrients while worms work it into the soil. Bagged, bulk or trailer loads from the Surrey Hills yard.",
    density: 0.5, bagWeightKg: 15, formats: BULK, images: ["Organic-Mulch", "Organic-Mulch2"], localImage: "soil-04",
    faqs: [
      {q: "Is organic mulch the same as compost?", a: "It is also known as compost or compost mulch. It is composted garden organics with aged fines and sawdust, used as a mulch or dug through tired soil as a conditioner."}
    ]
  },
  {
    slug: "soft-play-mulch", oldSlug: "soft-play", category: "mulch",
    name: "Soft Play Mulch", searchName: "Playground Mulch", keyword: "playground mulch",
    title: "Soft Play Playground Mulch Surrey Hills | Certified | SHGS",
    metaDescription: "Soft Play certified playground mulch (AS/NZS 4422) from Surrey Hills Garden Supplies. Ordered in for you, minimum 6 cubic metres, delivered across Melbourne's east.",
    short: "Certified playground under-surface mulch (AS/NZS 4422). Ordered in, minimum 6 cubic metres.",
    intro: "Soft Play is the playground mulch schools, kindergartens and playground installers across Melbourne specify because it is certified as an impact-absorbing under-surface to AS/NZS 4422. It is 100% plantation pine chip, free of sharp material, and it is also a perfectly good mulch for ordinary garden beds. It is not held in the yard: we order it in for you with a minimum of 6 cubic metres, and deliver it in bulk.",
    density: 0.4, bagWeightKg: 15, formats: { bag15kg: false, bag20kg: false, bulkerBag: false, bulkM3: true, byoTrailer: false }, minOrder: "6 m³ (ordered on request, not held in the yard)",
    images: ["Soft-Play"], localImage: "mulch-02",
    faqs: [
      {q: "How deep does Soft Play need to be?", a: "It depends on the fall height of the equipment. For a 3.1m critical fall height the installed depth is 340mm. Tell us the fall height and we will work out the cubic metres."},
      {q: "Can I buy Soft Play in bags?", a: "No. Soft Play is ordered in on request with a 6 cubic metre minimum and delivered in bulk."}
    ]
  },

  // ---------------- SOIL ----------------
  {
    slug: "blended-soil", oldSlug: "blended-soil", category: "soil", alsoIn: ["grass"],
    name: "Blended Soil", searchName: "Topsoil", keyword: "topsoil",
    title: "Blended Soil Surrey Hills | Topsoil Bulk & Bagged | SHGS",
    metaDescription: "Blended soil: sawdust, sandy loam, chicken manure and pine fines. The all-rounder for lawns, instant turf, beds and fill. Bags, bulk or BYO trailer from Surrey Hills.",
    short: "The all-rounder: garden beds, planter boxes, under instant turf, top dressing and fill.",
    intro: "Blended soil is our everyday topsoil and the most-ordered soil on the yard. It is a blend of sawdust, sandy loam, chicken manure and pine fines, so it has nutrition and body without being heavy. Landscapers use it as the base under instant turf, home gardeners use it to top up beds and fill planter boxes, and it levels a lawn before seeding. Available in 15kg bags, trailer loads or bulk delivery from Surrey Hills.",
    density: 1.2, bagWeightKg: 15, formats: BULK, images: ["Blended-Soil", "Blended-Soil2"], localImage: "soil-04",
    faqs: [
      {q: "How much blended soil do I need under instant turf?", a: "Allow 100mm. One cubic metre covers about 10 square metres at that depth. Rake it level and firm it before the turf goes down."},
      {q: "Is blended soil good for vegetables?", a: "Yes, it is a good all-rounder for vegetable gardens. For raised beds and planter boxes where you want more organic matter, choose premium organic soil."}
    ]
  },
  {
    slug: "premium-organic-soil", oldSlug: "premium-organic-soil", category: "soil",
    name: "Premium Organic Soil", keyword: "organic soil",
    title: "Premium Organic Soil Surrey Hills | Vegie Garden Soil | SHGS",
    metaDescription: "Premium organic soil: a 50/50 blend of organic mulch and blended soil for vegie patches, raised beds, new gardens and pots. Bags, bulk or trailer from Surrey Hills.",
    short: "50% organic mulch, 50% blended soil. Rich, dark and ready to plant into.",
    intro: "Premium organic soil is what we recommend for vegetable patches, raised beds and new gardens. It is a 50/50 blend of our organic mulch and our blended soil, so it has the body of a soil and the organic matter of a compost. It is dark grey to black when moist, holds water well and releases nutrients slowly. Pick it up in 15kg bags, fill a trailer, or have a bulk load delivered from the Surrey Hills yard.",
    density: 1.0, bagWeightKg: 15, formats: BULK, images: ["Premium-organic-Soil", "Premium-Organic-Soil2"], localImage: "soil-04",
    faqs: [
      {q: "Can I plant straight into premium organic soil?", a: "Yes. Fill the bed or planter, water it in and plant. For heavy feeders such as tomatoes, add a handful of Dynamic Lifter from the garden products range."}
    ]
  },
  {
    slug: "native-garden-mix", oldSlug: "native-garden-mix", category: "soil",
    name: "Native Garden Mix", keyword: "native garden mix",
    title: "Native Garden Mix Surrey Hills | Free-Draining Soil | SHGS",
    metaDescription: "Native garden mix: 50% washed sand, 50% blended soil for Australian natives and drainage problems. 15kg bags, bulk or BYO trailer from Surrey Hills Garden Supplies.",
    short: "Sandy, free-draining soil for Australian natives and beds that hold water.",
    intro: "Australian natives hate wet feet. Native garden mix is our blended soil cut 50/50 with washed sand, so it drains freely and stays low in nutrients the way grevilleas, banksias, kangaroo paws and most other natives prefer. It also fixes heavy, poorly draining beds. Bagged into 15kg bags for pickup, loaded into trailers, or delivered in bulk across Melbourne's east from Surrey Hills.",
    density: 1.3, bagWeightKg: 15, formats: BULK, images: ["Native-Garden-Mix", "Native-Garden-Mix-2"], localImage: "sand-03",
    faqs: [
      {q: "Which plants suit native garden mix?", a: "Most Australian natives: grevillea, banksia, kangaroo paw, westringia, correa and native grasses. Avoid it for vegetables and hungry exotics, which want premium organic soil."}
    ]
  },

  // ---------------- SAND ----------------
  {
    slug: "white-brick-sand", oldSlug: "white-brick-sand", category: "sand",
    name: "White Brick Sand", searchName: "Brick Sand", keyword: "brick sand",
    title: "Brick Sand Surrey Hills | White Builders Sand | SHGS",
    metaDescription: "White brick sand (builders sand, fatty sand) for bricklaying and packing. 1m³ lays about 1000 bricks. Bags, bulk or BYO trailer from Surrey Hills Garden Supplies.",
    short: "Fatty builders sand for mortar. One cubic metre lays roughly 1,000 bricks.",
    intro: "Brick sand is the bricklayer's sand. Ours is a fine, slightly clayey sand (hence 'fatty') that makes a mortar which stays workable on the board and holds on the trowel. Mixed 6:1:1 with cement and hydrated lime it is the standard mortar for brick and block work, and it doubles as packing sand under slabs. Despite the name it is yellow-orange rather than white. Available bagged, by the trailer or delivered in bulk from Surrey Hills.",
    density: 1.5, bagWeightKg: 15, formats: BULK, images: ["White-Brick-Sand", "White-Brick-Sand2"], localImage: "sand-03",
    faqs: [
      {q: "How many bricks does a cubic metre of brick sand lay?", a: "Approximately 1,000 standard bricks, mixed with cement and lime at 6:1:1."}
    ]
  },
  {
    slug: "washed-sand", oldSlug: "washed-sand", category: "sand",
    name: "Washed Sand", searchName: "Concrete Sand", keyword: "concrete sand",
    title: "Washed Sand Surrey Hills | Concrete & Paving Sand | SHGS",
    metaDescription: "Washed sand (concrete sand) for paving, concreting and plastering. Coarse, clean and free draining. Bags, bulk loads or BYO trailer from Surrey Hills Garden Supplies.",
    short: "Coarse, clean, free-draining sand for pavers, concrete and plastering.",
    intro: "Washed sand, also sold as concrete sand, is the workhorse of the yard. It is a coarse, off-white sand with the clay washed out, so it drains and compacts, which is exactly what you want as a bed under pavers, in site-mixed concrete with our 14mm screenings, or blended through soil to improve drainage. Pick it up in 15kg bags, fill a trailer, or have it delivered by the cubic metre from Surrey Hills.",
    density: 1.5, bagWeightKg: 15, formats: BULK, images: ["Washed-Sand", "Washed-Sand-2"], localImage: "sand-03",
    faqs: [
      {q: "Can I use washed sand under pavers?", a: "Yes. A 30mm screeded bed of washed sand over a compacted crusher dust or crushed rock base is the standard method."}
    ]
  },
  {
    slug: "triple-washed-sand", oldSlug: "tripple-washed-sand", category: "sand",
    name: "Triple Washed Sand", keyword: "triple washed sand",
    title: "Triple Washed Sand Surrey Hills | Tiling & Render Sand",
    metaDescription: "Triple washed sand for tiling, grouting, plastering, rendering, shower bases and sandpits. Bags, bulk loads or BYO trailer from Surrey Hills Garden Supplies.",
    short: "Washed three times for tiling, rendering, grouting, shower bases and kids' sandpits.",
    intro: "Triple washed sand is washed three times to strip out clay, silt and organic matter, which leaves a clean, fine, consistent sand. Tilers use it for screeds and shower bases, plasterers and renderers for fine finishes, and parents buy it for sandpits because it is clean and soft. It can also be used for concreting and kerb-and-channel work. Available in 15kg bags, trailer loads or bulk delivery from the Surrey Hills yard.",
    density: 1.5, bagWeightKg: 15, formats: BULK, images: ["Triple-Washed", "Triple-Washed-Sand2"], localImage: "sand-03",
    faqs: [
      {q: "Is triple washed sand safe for a children's sandpit?", a: "Yes. It is the preferred sand for sandpits and playgrounds because it is clean, fine and free of clay and debris."}
    ]
  },
  {
    slug: "kiln-dried-sand", oldSlug: "kiln-dried-sand", category: "sand", alsoIn: ["grass"],
    name: "Kiln Dried Sand", keyword: "kiln dried sand",
    title: "Kiln Dried Sand Surrey Hills | 20kg Bags & Bulker Bags",
    metaDescription: "Kiln dried silica sand for synthetic grass infill and paver joints. 20kg bags, 1-tonne bulker bags or bulk loads up to 12m³ from Surrey Hills Garden Supplies.",
    short: "Oven-dried silica sand for artificial grass infill and paver joints. 20kg bags, bulker bags or bulk.",
    intro: "Kiln dried silica sand is the sand of choice for top dressing artificial grass, and it is also what goes into the joints of paving. Because it is oven dried it pours freely and works down between the blades of synthetic turf, weighing the grass down and keeping the pile upright. We supply it in 20kg bags, one-tonne bulker bags and bulk loads up to 12 cubic metres, from the Surrey Hills yard or delivered across Melbourne's east.",
    density: 1.5, bagWeightKg: 20, formats: { bag15kg: false, bag20kg: true, bulkerBag: true, bulkM3: true, byoTrailer: true }, images: ["Kiln-Dried-Sand", "Kiln-Dried-Sand2"], localImage: "sand-03",
    faqs: [
      {q: "How much kiln dried sand do I need for synthetic grass?", a: "Infill rates vary by grass style; as a guide allow roughly 10–15kg per square metre and check your grass supplier's spec. Our blog post on kiln dried sand applications explains the method."},
      {q: "Why does the sand have to be kiln dried?", a: "Damp sand clumps and will not fall between the blades or into paver joints. Kiln drying removes the moisture so it flows like a liquid."}
    ]
  },

  // ---------------- ROCK & STONE ----------------
  {
    slug: "crushed-rock", oldSlug: "crushed-rock", category: "rock-and-stone",
    name: "Crushed Rock", keyword: "crushed rock",
    title: "Crushed Rock Surrey Hills | 20mm Class 4 Bulk Delivery",
    metaDescription: "20mm crushed rock with fines (class 4) for driveways, paths, slabs and water tank bases. 15kg bags, bulk loads or BYO trailer from Surrey Hills Garden Supplies.",
    short: "20mm minus crushed rock with fines. Compacts hard for driveways, paths and under slabs.",
    intro: "Crushed rock is the base under almost everything built outdoors in Melbourne: driveways, shed slabs, paths, water tank pads and car parks. Ours is a 20mm-and-smaller class 4 crushed rock with fines, which means it locks together and compacts into a solid, stable layer. We hold it in a bay at Surrey Hills, bag it into 15kg bags, load trailers and deliver it by the cubic metre across the eastern suburbs, usually in under two hours.",
    density: 1.6, bagWeightKg: 15, formats: BULK, images: ["Crushed-Rock", "Crushed-Rock-2", "Crushed-Rock-3"], localImage: "scoria-06",
    faqs: [
      {q: "How much crushed rock do I need for a driveway?", a: "Allow 100–150mm compacted. One cubic metre covers about 10 square metres at 100mm; add 10–15% for compaction. The calculator above does the sums."},
      {q: "What does a cubic metre of crushed rock weigh?", a: "About 1.6 tonnes. A 6x4 trailer carries roughly half a cubic metre, so check its rated capacity."}
    ]
  },
  {
    slug: "tuscan-toppings", oldSlug: "tuscan-toppings", category: "rock-and-stone",
    name: "Tuscan Toppings", keyword: "tuscan toppings",
    title: "Tuscan Toppings Surrey Hills | Driveway & Path Gravel",
    metaDescription: "Tuscan toppings: decorative 14mm crushed sandstone in tan, off-white and terracotta tones for paths, driveways and nature strips. Bags or bulk from Surrey Hills.",
    short: "Warm terracotta-toned 14mm crushed sandstone with fines for paths, driveways and nature strips.",
    intro: "Tuscan toppings give a path or driveway the warm, compacted gravel look of a Mediterranean courtyard. It is a crushed sandstone, 14mm with fines, in a mix of tan, off-white, orange and bronze tones that compacts firm underfoot and suppresses weeds. Landscapers use it for walkways, nature strips and high-traffic areas around the garden. Sold in 15kg bags, trailer loads or bulk delivery from the Surrey Hills yard.",
    density: 1.6, bagWeightKg: 15, formats: BULK, images: ["Tuscan-Toppings", "Tuscan-Toppings-2", "Tuscan-Toppings-3"], localImage: "sand-03",
    faqs: [
      {q: "How deep should Tuscan toppings be laid?", a: "50–75mm compacted over a firm base for a path; 75–100mm for a driveway. Wet it down and compact it in layers."}
    ]
  },
  {
    slug: "14mm-screenings", oldSlug: "14mm-screenings", category: "rock-and-stone",
    name: "14mm Screenings", searchName: "Screenings", keyword: "screenings",
    title: "14mm Screenings Surrey Hills | Concrete & Drainage Stone",
    metaDescription: "14mm screenings: clean single-size stone for concrete, drainage backfill, pipe bedding and toppings. 15kg bags, bulk or BYO trailer from Surrey Hills Garden Supplies.",
    short: "Clean 14mm single-size stone for concrete, drainage and pipe bedding.",
    intro: "Screenings are the aggregate in concrete. Our 14mm screenings are a screened, single-size bluestone with no fines, so they also make an ideal free-draining backfill behind walls, bedding around agricultural pipe and a hard-wearing topping. Mixed with washed sand and cement they produce a standard concrete. Bagged into 15kg bags, loaded into trailers or delivered in bulk from Surrey Hills to Melbourne's east.",
    density: 1.5, bagWeightKg: 15, formats: BULK, images: ["14mm-Screenings", "14mm-Screenings2"], localImage: "scoria-06",
    faqs: [
      {q: "What is the concrete mix ratio with screenings?", a: "A common site mix is 1 part cement, 2 parts washed sand and 3 parts 14mm screenings by volume. For small jobs, bagged concrete mix is easier."}
    ]
  },
  {
    slug: "scoria", oldSlug: "scoria", category: "rock-and-stone",
    name: "Scoria", keyword: "scoria",
    title: "Scoria Surrey Hills | 14-20mm Drainage Rock Bulk & Bagged",
    metaDescription: "14–20mm red scoria: lightweight, porous volcanic rock for drainage, retaining wall backfill and toppings. 15kg bags, bulk or BYO trailer from Surrey Hills Garden Supplies.",
    short: "Light, porous red volcanic rock. The plumber's and landscaper's drainage stone.",
    intro: "Scoria is the stone plumbers and landscapers reach for when water has to get away. It is a deep red volcanic rock, very porous and light for its size, so it drains freely and is easy to shovel into a trench or behind a retaining wall. Our 14–20mm scoria is held in a bay at Surrey Hills and goes out in 15kg bags, trailer loads and bulk deliveries by the cubic metre. It also makes a striking decorative topping.",
    density: 0.9, bagWeightKg: 15, formats: BULK, images: ["Scoria", "Scoria2", "Scoria3"], localImage: "scoria-06",
    faqs: [
      {q: "How much does scoria weigh?", a: "Roughly 0.9 tonnes per cubic metre, a little over half the weight of crushed rock, which is why it is favoured behind retaining walls and in trailers."},
      {q: "Do I need geotextile with scoria?", a: "Behind a wall or in a trench, yes: a geotextile layer between the scoria and the soil stops silt clogging the drain. We stock it in the tool shop."}
    ]
  },
  {
    slug: "7mm-aggregate", oldSlug: "7mm-aggregate", category: "rock-and-stone",
    name: "7mm Aggregate", searchName: "Aggregate", keyword: "aggregate",
    title: "7mm Aggregate Surrey Hills | Quarter Minus Bulk & Bagged",
    metaDescription: "7mm aggregate (quarter minus) for pipe bedding, fine concrete, paving base and toppings. 15kg bags, bulk loads or BYO trailer from Surrey Hills Garden Supplies.",
    short: "Quarter minus: fine 7mm screened stone for pipe bedding, paving base and finer concrete.",
    intro: "Quarter minus, or 7mm aggregate, is the fine screened stone plumbers use to bed pipes and pavers use under slabs and paving. It compacts to a smooth, stable surface, and blended with sand and cement it makes a finer, more pliable concrete than 14mm stone, which is easier to work into tight formwork. It also serves as a decorative topping and drainage backfill. Bagged, trailer loads or bulk delivery from the Surrey Hills yard.",
    density: 1.5, bagWeightKg: 15, formats: BULK, images: ["7mm-Agregate", "7mm-Agregate2"], localImage: "scoria-06",
    faqs: [
      {q: "What other aggregate sizes do you stock?", a: "7mm and 14mm are held in the yard, with 20mm crushed rock and larger 40–100mm rubble available. Call for other sizes."}
    ]
  },
  {
    slug: "crusher-dust", oldSlug: "eco-base-crusher-dust", category: "rock-and-stone", alsoIn: ["grass"],
    name: "Crusher Dust (Eco Base)", searchName: "Crusher Dust", keyword: "crusher dust",
    title: "Crusher Dust Surrey Hills | Eco Base for Synthetic Grass",
    metaDescription: "Crusher dust (Eco Base, stone dust): fines to 5mm blue metal that compacts hard. The base for artificial grass, paths and slabs. Bags, bulk or trailer from Surrey Hills.",
    short: "Fine blue metal dust that compacts rock hard. The standard base under synthetic grass and paving.",
    intro: "Crusher dust, sold here as Eco Base and also called stone dust, is a fine blue metal product from dust up to 5mm. It compacts into a hard, smooth, level surface, which is why it is the standard base under synthetic grass and the screed bed under pavers, as well as fill for trenches, under slabs and under water tanks. Every Smart Grass installation starts with it. Available in 15kg bags, trailer loads or bulk delivery from Surrey Hills.",
    density: 1.7, bagWeightKg: 15, formats: BULK, images: ["EcoBase"], localImage: "scoria-06",
    faqs: [
      {q: "How much crusher dust goes under artificial grass?", a: "Typically 50–100mm compacted. One cubic metre covers about 10 square metres at 100mm; allow 15% extra for compaction."}
    ]
  },
  {
    slug: "large-rubble-rock", oldSlug: "large-rubble-rock", category: "rock-and-stone",
    name: "Large Rubble Rock", keyword: "rubble rock",
    title: "Large Rubble Rock Surrey Hills | 40mm, 60mm & 100mm Rock",
    metaDescription: "40mm rock, 60mm rubble and 80–100mm rubble for construction sites, car parks and feature beds. Ordered in, minimum 6m³, delivered within hours by Surrey Hills Garden Supplies.",
    short: "40mm, 60mm and 80–100mm rock and rubble. Ordered in, minimum 6 cubic metres.",
    intro: "When 20mm crushed rock is too small for the job, we can source larger rock and rubble in 40mm, 60mm and 80–100mm grades for construction site access, car parks, hard stand areas and dry creek beds. These sizes are not held in the yard: they are ordered in with a minimum of 6 cubic metres and we can usually have a load on site within a few hours. Call the yard to arrange.",
    density: 1.6, bagWeightKg: 15, formats: { bag15kg: false, bag20kg: false, bulkerBag: false, bulkM3: true, byoTrailer: false }, minOrder: "6 m³ (ordered on request, not held in the yard)",
    images: ["40mm-Rock", "60mm-Rock", "80mm-100mm-Rock"], localImage: "scoria-06",
    faqs: [
      {q: "Can I pick up large rubble rock from the yard?", a: "No. 40mm, 60mm and 100mm rubble are ordered in by the truckload with a 6 cubic metre minimum and delivered direct to site."}
    ]
  },

  // ---------------- CONCRETE PRODUCTS ----------------
  {
    slug: "cement", oldSlug: "cement", category: "concrete-products",
    name: "Cement", searchName: "GP Cement", keyword: "gp cement",
    title: "Cement Surrey Hills | GP, Builders & Off White Cement",
    metaDescription: "Cement Australia 20kg bags: general purpose, builders, off-white cement, concrete mix, rapid set, mortar mix and hydrated lime. Yard pickup or delivered from Surrey Hills.",
    short: "Cement Australia 20kg bags: GP, builders, off-white, concrete mix, rapid set, mortar mix and lime.",
    intro: "Surrey Hills Garden Supplies stocks the Cement Australia bagged range in 20kg bags, so a concreter, bricklayer or weekend builder in Melbourne's east can pick up the right cement with the sand and stone to go with it. General purpose cement for everyday concrete, builders cement for mortars and grouts, off-white cement for architectural finishes, plus concrete mix, rapid set, mortar mix and hydrated lime. Buy at the yard or have bags delivered with a bulk load.",
    density: null, bagWeightKg: 20, formats: BAGGED20, images: ["cementproduct", "cement"], localImage: "cement-05",
    variants: ["General Purpose Cement", "Builders Cement", "Off White Cement", "Concrete Mix", "Rapid Set", "Mortar Mix", "Hydrated Lime"],
    faqs: [
      {q: "Which cement do I use for bricklaying?", a: "Builders cement or mortar mix with white brick sand. Add hydrated lime for a more workable mortar."},
      {q: "Is white cement different from off-white cement?", a: "Off-white cement gives a lighter finish than grey cement and conforms to AS3972 Type HE. Ask the yard if you need a true white cement."}
    ]
  },
  {
    slug: "concrete-mix", oldSlug: "concrete-mix", category: "concrete-products", alsoIn: ["rock-and-stone"],
    name: "Concrete Mix", keyword: "concrete mix",
    title: "Concrete Mix Surrey Hills | Bulk Conmix & 20kg Bags | SHGS",
    metaDescription: "Concrete mix (Conmix): 50/50 washed sand and 14mm aggregate by the cubic metre, or Cement Australia 20kg bags. Pickup, BYO trailer or delivered from Surrey Hills.",
    short: "Bulk Conmix (sand and 14mm aggregate, just add cement) by the metre, or 20kg bagged concrete mix.",
    intro: "Concrete mix comes two ways at Surrey Hills. Bulk Conmix is a 50/50 blend of washed sand and 14mm aggregate, sold by the cubic metre for slabs, footings and paths: you add the cement. A finer version with 7mm aggregate (Corfill) suits block core-filling. For small jobs such as post holes and mower strips we also stock Cement Australia 20kg bagged concrete mix, which only needs water. Bulk is available in 15kg bags, trailer loads or delivered.",
    density: 1.8, bagWeightKg: 20, formats: { bag15kg: true, bag20kg: true, bulkerBag: false, bulkM3: true, byoTrailer: true }, images: ["Conmix", "Conmix2"], localImage: "cement-05",
    faqs: [
      {q: "How much cement do I add to bulk Conmix?", a: "A common ratio is about 6 bags of 20kg GP cement per cubic metre of Conmix for general-purpose concrete. Ask the yard for the mix that suits your job."},
      {q: "Is bagged concrete mix the same as bulk Conmix?", a: "No. Bagged concrete mix already contains cement and only needs water. Bulk Conmix is sand and aggregate only; you add cement on site."}
    ]
  },
  {
    slug: "steel", oldSlug: "steel", category: "concrete-products", alsoIn: ["building-materials"],
    name: "Steel & Reinforcing", searchName: "Reo Mesh", keyword: "reo mesh",
    title: "Reo Mesh & Reinforcing Steel Surrey Hills | SHGS",
    metaDescription: "Ute mesh SL62/SL72, trench mesh, deformed reo bar, galvanised H beam, C channel, angle and flat bar from Surrey Hills Garden Supplies. Yard pickup or delivered.",
    short: "Ute mesh, trench mesh, reo bar and galvanised steel sections for footings, slabs and walls.",
    intro: "Reinforcing steel is stocked alongside the cement so a footing or slab can be set up in one trip. Ute mesh (SL62 and SL72) in 4 x 2m sheets that travel legally on a ute, 3-bar and 4-bar trench mesh in 6m lengths, deformed N-class reo bar, and galvanised H beam, C channel, angle and flat bar for sleeper walls and fabrication. Starter bars, tie wire and bar chairs complete the kit. Pick up from the Surrey Hills yard or have it delivered with your sand and cement.",
    density: null, bagWeightKg: null, formats: { bag15kg: false, bag20kg: false, bulkerBag: false, bulkM3: false, byoTrailer: true, each: true }, images: ["One-Mesh", "Trench-Mesh", "Rebar", "H-Chanel", "C-Chanel", "Angle", "Flat-Bar"], localImage: "yard-01",
    variants: ["Ute Mesh SL62 / SL72", "Trench Mesh 3-bar & 4-bar", "Reinforcing Bar", "Galvanised H Beam", "Galvanised C Channel", "Galvanised Angle", "Galvanised Flat Bar"],
    faqs: [
      {q: "What mesh do I need for a shed slab?", a: "SL72 ute mesh on bar chairs is typical for a residential shed or driveway slab. Check your engineer's or council's requirement for anything structural."}
    ]
  },
  {
    slug: "additives", oldSlug: "additives", category: "concrete-products",
    name: "Additives & Oxides", searchName: "Concrete Oxides", keyword: "concrete oxide",
    title: "Concrete Additives & Oxides Surrey Hills | SHGS",
    metaDescription: "Colorlinx oxides, Auseal sealers, Gibco MRF, Best Bond, brick waterproofer, mortar plasticiser, cold bitumen, hydrochloric acid, retarder and liquid lime from Surrey Hills.",
    short: "Oxides, sealers, bonding agents, waterproofers, plasticisers, retarders and acids for concrete and masonry.",
    intro: "The additives shelf covers the chemistry that goes with concrete and masonry: Colorlinx oxides in six colours to tint concrete and mortar, Auseal acrylic sealers and xylene thinner, Gibco MRF admixture, Best Bond bonding agent, brickies red waterproofer, mortar plasticiser, cold bitumen, hydrochloric acid for cleaning, exposed aggregate retarder and liquid lime for lawns and soil. All are available at the Surrey Hills yard and can be added to a delivery.",
    density: null, bagWeightKg: null, formats: SHOP, images: ["Oxide", "Auseal", "Gibcos-MRF", "Best-Bond", "Brickies-Red-Waterproofer", "Mortar-Plasticizer", "Bitupack", "Hydraulic-Acid", "Liquid-Lime"], localImage: "cement-05",
    faqs: [
      {q: "How much oxide do I add to concrete?", a: "Oxide is dosed as a percentage of the cement weight and the result varies with the sand, cement and water used. Follow the pack rate and mix a test batch first."}
    ]
  },
  {
    slug: "plastic", oldSlug: "plastic", category: "concrete-products", alsoIn: ["building-materials"],
    name: "Builders Plastic", keyword: "builders plastic",
    title: "Builders Plastic Surrey Hills | 100um & 200um Black Plastic",
    metaDescription: "Black builders plastic in 100um and 200um, rolls from 5x2m to 50x4m and sold per metre. Vapour barrier under slabs and site protection, from Surrey Hills Garden Supplies.",
    short: "Black builders film in 100 and 200 micron, rolls from 5x2m to 50x4m or cut per metre.",
    intro: "Builders plastic is the black polythene film laid under a concrete slab as a vapour barrier and used across sites to protect floors, cover materials and line trenches. Surrey Hills Garden Supplies carries it in 100 micron and 200 micron thicknesses, in rolls from 5 x 2m up to 50 x 4m, and the 200um is also sold per metre off the roll so you only buy what the job needs. Pick it up with your cement and mesh or add it to a delivery.",
    density: null, bagWeightKg: null, formats: { ...SHOP, each: true }, images: ["Black-Plastic"], localImage: "cement-05",
    faqs: [
      {q: "Which thickness do I need under a slab?", a: "200 micron is the usual vapour barrier under a concrete slab. 100 micron suits covering and protection."}
    ]
  },
  {
    slug: "bar-chairs", oldSlug: "bar-chairs", category: "concrete-products", alsoIn: ["building-materials"],
    name: "Bar Chairs", keyword: "bar chairs",
    title: "Bar Chairs Surrey Hills | Reo Mesh Chairs 25-90mm | SHGS",
    metaDescription: "Plastic bar chairs in 25/40, 50/65 and 75/90mm plus trench bar chairs for 8–12mm steel, to hold reinforcing mesh at the right cover. From Surrey Hills Garden Supplies.",
    short: "Four sizes of bar chair to hold mesh and reo at the correct height in a slab or footing.",
    intro: "Bar chairs are the small plastic supports that hold reinforcing mesh and bar off the ground so the steel ends up in the middle of the concrete, not the bottom. Surrey Hills Garden Supplies carries four sizes: 25/40mm, 50/65mm and 75/90mm chairs for slab mesh, and trench bar chairs for 8–12mm steel in footings. They are sold by the bag at the yard alongside ute mesh, trench mesh and reo bar, and can be added to any delivery.",
    density: null, bagWeightKg: null, formats: { ...SHOP, each: true }, images: ["Bar-Chairs", "Bar-Chairs2"], localImage: "cement-05",
    faqs: [
      {q: "Which bar chair height do I need?", a: "Match the chair to the concrete cover your slab needs. For a 100mm residential slab with mesh in the middle, 50/65 chairs are common. Trench chairs suit footings."},
      {q: "How many bar chairs per sheet of mesh?", a: "Allow roughly one chair per square metre, more at sheet edges and laps, so the mesh cannot sag under foot traffic during the pour."}
    ]
  },

  // ---------------- TOOL SHOP ----------------
  {
    slug: "tools", oldSlug: "tools", category: "tool-shop",
    name: "Tools", searchName: "Bricklaying & Concreting Tools", keyword: "bricklaying tools",
    title: "Trade Tools Surrey Hills | Bricklaying & Concreting Tools",
    metaDescription: "Marshalltown and Marco Pesaro trowels, floats, bull floats, jointers, levels, line blocks, diamond blades, hammers, chisels, rakes and brooms at Surrey Hills Garden Supplies.",
    short: "Trowels, floats, jointers, levels, blades, hammers, rakes and brooms for brickies, concreters and landscapers.",
    intro: "The tool wall at Surrey Hills Garden Supplies is stocked for the trades that buy our sand, cement and stone. Bricklayers will find Marshalltown and Marco Pro brick trowels, jointers, line blocks and pins, brick carriers and bolsters. Concreters get bull floats, edgers, magnesium and wood floats, kneeling boards and placer rakes. Everyone else finds diamond blades, levels, sledge and claw hammers, cold chisels, post hole shovels, landscape rakes and brooms. The full list is below; call if you need something not on it.",
    density: null, bagWeightKg: null, formats: SHOP, catalogue: true, images: ["Marshelltown-Brick-Trowels", "Marco-Pesaro-Aluminium-Bull-Float", "Levels", "All-Material-Diamond-Blade", "Landscape-Rake", "Sledge-Hammer"], localImage: "yard-01",
    faqs: [
      {q: "Do you sharpen or repair tools?", a: "No, but we stock replacement handles for brooms and hammers and a wide range of consumables such as blades, line and marking paint."}
    ]
  },
  {
    slug: "safety-products", oldSlug: "safety-products", category: "tool-shop",
    name: "Safety Products", keyword: "safety products",
    title: "Safety Gear Surrey Hills | Gloves, Glasses, Masks, Vests",
    metaDescription: "Gloves, safety glasses, dust masks, ear plugs, knee pads, hi-vis vests, barrier tape and bollards for tradespeople and home owners at Surrey Hills Garden Supplies.",
    short: "Gloves, glasses, masks, hearing protection, knee pads, hi-vis and site barricade gear.",
    intro: "Surrey Hills Garden Supplies carries the safety gear a tradesperson or home owner needs before starting a job: leather rigger, neoprene, PVC gauntlet and general purpose gloves, safety glasses, disposable dust masks, corded and uncorded ear plugs, heavy-duty knee pads and kneeling boards, hi-vis vests compliant to AS/NZS 4602:1999, and site control items including 75mm barrier tape, 1150mm reflective bollards and witches hats. Our staff will talk through what you need to stay protected on your next project.",
    density: null, bagWeightKg: null, formats: SHOP, catalogue: true, images: ["Safety-Glasses", "Leather-Gloves", "Dust-Mask", "Safety-Vest", "Knee-Pads", "Safety-Barricade-Tape", "Safety-Bollards"], localImage: "yard-01",
    faqs: []
  },
  {
    slug: "garden-products", oldSlug: "garden-products", category: "tool-shop", alsoIn: ["grass"],
    name: "Garden Products", searchName: "Fertilisers & Garden Products", keyword: "garden fertiliser",
    title: "Garden Products Surrey Hills | Fertiliser, Manure, Seed",
    metaDescription: "Dynamic Lifter, poultry, sheep and cow manure, gypsum, garden lime, lawn seed and starter kits, weed mat, geotextile, Charlie Carp and Confidor at Surrey Hills Garden Supplies.",
    short: "Fertilisers, manures, lime, gypsum, lawn seed, weed mat, geotextile and pest control.",
    intro: "Garden products are the bags and bottles that make the soil and mulch work harder: Dynamic Lifter pelletised fertiliser, 25-litre bags of poultry, sheep and cow manure, gypsum for clay soils, garden lime, lawn starter and repair kits, Valley Seeds and budget lawn seed, weed mat and geotextile, Charlie Carp fish fertiliser and Confidor for pests. We also keep star pickets, treated pine sleepers, pavers and plastic edging on the same aisle. All available at the Surrey Hills yard or added to a delivery.",
    density: null, bagWeightKg: null, formats: SHOP, catalogue: true, images: ["Dynamic-Lifter", "Poultry-Manure", "Cow-Manure", "Gypsum", "Garden-Lime", "Lawn-Seed", "weed-Mat", "Rally-Geotextile", "Charlie-carp"], localImage: "soil-04",
    faqs: [
      {q: "Which manure is best for vegetables?", a: "Poultry manure is the richest all-purpose organic fertiliser; cow and sheep manure are gentler soil conditioners. Many gardeners use a mix of both."}
    ]
  },
  {
    slug: "miscellaneous-items", oldSlug: "miscellaneous-items", category: "tool-shop",
    name: "Miscellaneous Items", searchName: "Wine Barrels & Odds and Ends", keyword: "half wine barrels",
    title: "Half Wine Barrels & Miscellaneous Items Surrey Hills",
    metaDescription: "Half oak wine barrels from South Australian wineries, plus the odds and ends a garden project needs, at Surrey Hills Garden Supplies on Canterbury Road.",
    short: "Half oak wine barrels from South Australian wineries, plus odds and ends.",
    intro: "Not everything on the yard fits a category. Surrey Hills Garden Supplies carries half wine barrels made from oak and retired from South Australian wineries, which make generous planters for a vegetable patch, a citrus tree or a feature plant on a deck; fill one with premium organic soil and it is ready to plant. This page collects those odds and ends. Stock changes, so call the yard on (03) 9890 3901 to check what is currently in before you make the trip.",
    density: null, bagWeightKg: null, formats: SHOP, images: ["Wine-Barrels"], localImage: "yard-01",
    faqs: [
      {q: "How big is a half wine barrel?", a: "Sizes vary because they are genuine reclaimed barrels, but a half barrel is typically around 60–70cm across and 45cm tall. Call to check current stock."}
    ]
  },

  // ---------------- GRASS ----------------
  {
    slug: "smart-grass", oldSlug: "smart-grass", category: "grass",
    name: "Smart Grass Synthetic Grass", searchName: "Synthetic Grass", keyword: "synthetic grass",
    title: "Smart Grass Synthetic Grass Surrey Hills | Australian Distributor",
    metaDescription: "Smart Grass synthetic lawn from 12mm sports grass to 40mm residential, 7-year warranty. Surrey Hills Garden Supplies is the Australian distributor. Samples at the yard.",
    short: "Synthetic lawn from 12mm sports to 40mm residential styles, 7-year warranty. We are the Australian distributor.",
    intro: "Surrey Hills Garden Supplies is the Australian distributor of Smart Grass, a synthetic lawn range that runs from 12mm sports grass to 40mm recreation grass and comes with a 7-year warranty. Styles include 35mm Fairway, 35mm Esteem, Putting, Sportgrass, Civil and 40mm Summer Supreme, each with its own pile height, colour and density to replicate natural turf or a sports surface. It is used on sports fields, courts, cricket pitches, putting greens, school playgrounds and in thousands of Melbourne backyards. See samples at the Canterbury Road yard.",
    density: null, bagWeightKg: null, formats: { bag15kg: false, bag20kg: false, bulkerBag: false, bulkM3: false, byoTrailer: true, roll: true }, images: ["Smart-Grass", "Smart-Grass-2", "Smart-Grass-4", "fairway.2", "Esteem-1", "putting-1", "Sportgrass", "civil.1", "Grass"], localImage: "turf-07",
    variants: ["35mm Fairway", "35mm Esteem", "Putting", "Sportgrass", "Civil", "40mm Summer Supreme"],
    faqs: [
      {q: "How is synthetic grass sold?", a: "By the roll, cut to the length you need. Tell us the area and we will work out roll widths and joins to minimise waste."},
      {q: "What do I need to install Smart Grass?", a: "A compacted crusher dust base, the grass, joining tape and nails, and kiln dried sand infill. All of it is on the yard; see the artificial grass items page."}
    ]
  },
  {
    slug: "artificial-grass-items", oldSlug: "artificial-grass-items", category: "grass",
    name: "Artificial Grass Installation Items", keyword: "artificial grass installation",
    title: "Artificial Grass Installation Items Surrey Hills | SHGS",
    metaDescription: "Everything to install synthetic grass: kiln dried sand, rubber infill, joining tape, 150mm nails, glue, wet gel and Smell B Gone pet infill from Surrey Hills Garden Supplies.",
    short: "Joining tape, 150mm nails, glue, rubber infill, Smell B Gone and kiln dried sand for synthetic lawns.",
    intro: "A synthetic lawn is only as good as what holds it down and fills it. Surrey Hills Garden Supplies carries the full installation kit: 150mm (6-inch) metal nails to secure the edges, joining tape in 5m and 20m rolls, glue and wet gel for seams, rubber infill, and Smell B Gone, an Australian-made organic infill in 15kg bags that neutralises pet odours and keeps the grass cooler in summer. Pair it with crusher dust for the base and kiln dried sand for the infill, both stocked on the yard.",
    density: null, bagWeightKg: 15, formats: { ...SHOP, each: true }, images: ["Joining-Tape", "Nails", "Smellbgone"], localImage: "turf-07",
    faqs: [
      {q: "Do I need Smell B Gone if I have a dog?", a: "It is made for exactly that. The organic infill absorbs and neutralises urine odour and holds moisture that cools the grass on hot days."}
    ]
  },
  {
    slug: "instant-turf", oldSlug: "instant-turf", category: "grass",
    name: "Instant Turf", keyword: "instant turf",
    title: "Instant Turf Surrey Hills | Buffalo, Kikuyu, Couch, Fescue",
    metaDescription: "Instant turf ordered fresh from the farm: Kings Pride Buffalo, Tall Fescue, Kikuyu and Santa Ana Couch. Minimum 30m², 2–3 days, delivered by Surrey Hills Garden Supplies.",
    short: "Kings Pride Buffalo, Tall Fescue, Kikuyu and Santa Ana Couch, farm fresh. Minimum 30 square metres.",
    intro: "Instant turf is ordered direct from the turf farm for each customer so it arrives fresh, which means allowing 2–3 days from order to delivery and a minimum of 30 square metres. Surrey Hills Garden Supplies supplies Kings Pride Buffalo for shade-tolerant family lawns, Tall Fescue for a soft, cool-season lawn, Kikuyu for hard-wearing sunny areas and Santa Ana Couch for a fine, low-mown finish. Lay it on 100mm of our blended soil, and ask about lawn starter fertiliser when you order.",
    density: null, bagWeightKg: null, formats: { bag15kg: false, bag20kg: false, bulkerBag: false, bulkM3: false, byoTrailer: false, roll: true }, minOrder: "30 m² (ordered from the farm, allow 2–3 days)", images: ["Instant-turf", "Turf-1"], localImage: "turf-07",
    faqs: [
      {q: "Which instant turf is best for shade?", a: "Kings Pride Buffalo handles shade best of the four. Kikuyu and Santa Ana Couch want full sun; Tall Fescue copes with part shade and stays green in winter."},
      {q: "How much soil do I need under instant turf?", a: "About 100mm of blended soil, raked level and firmed. One cubic metre covers roughly 10 square metres."}
    ]
  },
  {
    slug: "lawn-seed", oldSlug: "seed", category: "grass",
    name: "Lawn Seed", keyword: "lawn seed",
    title: "Lawn Seed Surrey Hills | 1kg to 25kg Bags | SHGS",
    metaDescription: "Lawn seed in 1kg to 25kg bags: budget blends, drought-tolerant blends, Valley Seeds, lawn starter and lawn repair kits from Surrey Hills Garden Supplies.",
    short: "Seed blends from 1kg to 25kg bags, plus lawn starter and lawn repair products.",
    intro: "Seeding is the economical way to start or thicken a lawn, and Surrey Hills Garden Supplies carries seed in sizes from a 1kg bag for patching to 25kg bags for a whole block. The range includes budget lawn blends, drought-tolerant blends for Melbourne summers, Valley Seeds varieties, and the lawn starter and lawn repair products that give new seed the best chance. Sow onto raked blended soil, keep it moist for the first few weeks, and feed with a starter fertiliser.",
    density: null, bagWeightKg: null, formats: SHOP, images: ["Lawn-Seed", "Budet-Lawn-Seed", "Survivor-Lawn-Seed", "Lawn-Starter", "Lawn-Repair"], localImage: "turf-07",
    faqs: [
      {q: "How much lawn seed do I need?", a: "Sowing rates vary by blend; as a guide most lawn blends go down at 25–35 grams per square metre for a new lawn. Check the bag and we will help you size it."},
      {q: "When should I sow lawn seed in Melbourne?", a: "Autumn and spring, when the soil is warm and rain is likely. Avoid the middle of summer unless you can water daily."}
    ]
  },
  {
    slug: "lawn-edging", oldSlug: "edging", category: "grass",
    name: "Garden & Lawn Edging", searchName: "Garden Edging", keyword: "garden edging",
    title: "Garden Edging Surrey Hills | EverEdge, Link Edge, Jarrah",
    metaDescription: "EverEdge flexible steel edging in Corten, brown and black, Link Edge aluminium, jarrah edging in 4.2m lengths and UV-stable plastic edging from Surrey Hills Garden Supplies.",
    short: "EverEdge steel, Link Edge aluminium, jarrah timber and plastic edging to keep lawns, beds and paths crisp.",
    intro: "Edging is what makes a garden look finished, keeps mulch and pebbles where they belong and stops the lawn creeping into the beds. Surrey Hills Garden Supplies carries four types: EverEdge flexible steel in Corten, brown and black at 75, 100 and 125mm heights, Link Edge aluminium in 3m lengths at 75 and 100mm, jarrah timber edging in 4.2m lengths with single and double pegs, and UV-stabilised plastic edging in a range of colours and heights. All are easy enough for a home gardener to install in an afternoon.",
    density: null, bagWeightKg: null, formats: { ...SHOP, each: true }, images: ["Edging", "Edging2", "Edging3", "Cyclone-Garden-Edging", "Link-Edge"], localImage: "turf-07",
    variants: ["EverEdge steel edging", "Link Edge aluminium edging", "Jarrah edging", "Plastic edging"],
    faqs: [
      {q: "Which edging is best for curves?", a: "EverEdge steel and Link Edge aluminium both bend to tight curves. Jarrah will take a gentle curve; plastic edging is the most flexible of all."}
    ]
  },

  // ---------------- BUILDING MATERIALS ----------------
  {
    slug: "building-products", oldSlug: "building-products", category: "building-materials",
    name: "Building Products", searchName: "Building Supplies", keyword: "building supplies",
    title: "Building Products Surrey Hills | Bricks, Blocks, Sleepers",
    metaDescription: "Besser blocks, recycled red bricks, bluestone pitchers, treated pine sleepers, star pickets, hoop iron, ties, dampcourse, hessian, subfloor vents and more at Surrey Hills Garden Supplies.",
    short: "Besser blocks, recycled bricks, bluestone pitchers, sleepers, star pickets, ties, dampcourse and more.",
    intro: "The building products range at Surrey Hills Garden Supplies covers the masonry and site items that go with our sand, cement and steel: 20-01 and 15-01 besser blocks, recycled red bricks, reclaimed bluestone pitchers, treated pine sleepers, star pickets, hoop iron, brick ties, dampcourse, hessian, Brick Weld, wooden pegs, subfloor vents, broom heads, oxides and hydrochloric acid. The client's extended building range, including brick ties, reo mesh and bar, starter bars, steel lintels, H beams and sleepers, is being confirmed and will be listed here. Buy at the yard or have it delivered with a bulk load.",
    density: null, bagWeightKg: null, formats: { ...SHOP, each: true, byoTrailer: true }, catalogue: true, images: ["Besser-Bricks", "Bricks", "Bluestone", "Treated-Pine", "Star-Pickets", "Hoop-Irons", "Ties", "Dampcourse", "Hessian", "Subfloor-vents", "Concrete-Block-444-Series", "Clay-BricksPavers-777-Series"], localImage: "yard-01",
    faqs: [
      {q: "What size are besser blocks?", a: "20-01 blocks are 390 x 190 x 190mm and 15-01 blocks are 390 x 140 x 190mm. Standard bricks are 230 x 110 x 76mm."},
      {q: "Do you deliver pallets of bricks and blocks?", a: "Yes. Pallets and loose quantities can be delivered on our trucks, with sand and cement on the same load."}
    ]
  },

  // ---------------- DRAINAGE ----------------
  {
    slug: "drainage-supplies", oldSlug: null, category: "drainage",
    name: "Drainage Supplies", keyword: "drainage supplies",
    title: "Drainage Supplies Surrey Hills | Ag Pipe, Pits & Fittings",
    metaDescription: "Agricultural pipe in various sizes, plastic drainage pits, grates and fittings, geotextile, scoria and screenings for garden and site drainage from Surrey Hills Garden Supplies.",
    short: "Ag pipe in various sizes, plastic pits and fittings, geotextile and the stone to go around them.",
    intro: "Our large range of quality drainage supplies offers everything needed to create effective water flow in any sized garden. Surrey Hills Garden Supplies stocks agricultural (ag) pipe in various sizes, slotted and solid, along with plastic drainage pits, grates, joiners and fittings, and geotextile fabric to keep the system clear of silt. The stone that surrounds the pipe, scoria and 14mm screenings, is held in bays on the same yard, so a plumber or landscaper can collect the whole trench in one visit or have it delivered together. Large and small orders accepted.",
    density: null, bagWeightKg: null, formats: { ...SHOP, each: true, byoTrailer: true }, images: ["Drainage2", "drainage"], localImage: "scoria-06",
    seedFromHomeTile: true,
    faqs: [
      {q: "Which ag pipe do I use behind a retaining wall?", a: "Slotted ag pipe, usually in a filter sock, laid at the base of the wall with a fall to an outlet, surrounded by scoria and wrapped in geotextile."},
      {q: "Do you sell drainage pits and grates?", a: "Yes. Plastic pits, grates and the fittings to connect them to ag pipe and stormwater are stocked on the yard."}
    ]
  }
];
