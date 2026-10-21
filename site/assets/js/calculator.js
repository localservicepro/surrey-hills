/* Surrey Hills Garden Supplies — volume calculator (vanilla JS)
   Mounts on every element with [data-calculator]. Inputs render without JS; results need JS.
   Product list comes from a JSON script tag (#calc-products) written by the build from data/products.json:
   [{slug, name, path, density (t/m³), bagWeightKg, formats:{bag15kg,bag20kg,bulkerBag,bulkM3}}] */
(function () {
  'use strict';
  var products = [];
  try { products = JSON.parse(document.getElementById('calc-products').textContent); } catch (e) { products = []; }
  var bySlug = {};
  products.forEach(function (p) { bySlug[p.slug] = p; });

  function fmt(n, d) { return Number(n).toLocaleString('en-AU', { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function roundUpQuarter(x) { return Math.ceil(x * 4 - 1e-9) / 4; }

  function mount(root) {
    var form = root.querySelector('form');
    var out = root.querySelector('.calc__results');
    var nojs = root.querySelector('.calc__nojs');
    if (nojs) nojs.hidden = true;
    var sel = form.querySelector('[name="product"]');
    var preset = root.getAttribute('data-product');
    if (preset && sel && bySlug[preset]) sel.value = preset;

    var depthInput = form.querySelector('[name="depth"]');
    root.querySelectorAll('.depth-presets button').forEach(function (b) {
      b.addEventListener('click', function () {
        depthInput.value = b.getAttribute('data-depth');
        root.querySelectorAll('.depth-presets button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        calc();
      });
    });

    function shapeUI() {
      var circle = form.querySelector('[name="shape"][value="circle"]').checked;
      form.querySelector('.calc__rect').hidden = circle;
      form.querySelector('.calc__circle').hidden = !circle;
    }

    function calc() {
      var circle = form.querySelector('[name="shape"][value="circle"]').checked;
      var depthMm = parseFloat(depthInput.value);
      var area;
      if (circle) {
        var dia = parseFloat(form.querySelector('[name="diameter"]').value);
        area = isFinite(dia) ? Math.PI * Math.pow(dia / 2, 2) : NaN;
      } else {
        var l = parseFloat(form.querySelector('[name="length"]').value);
        var w = parseFloat(form.querySelector('[name="width"]').value);
        area = (isFinite(l) && isFinite(w)) ? l * w : NaN;
      }
      var p = bySlug[sel.value];
      if (!isFinite(area) || !isFinite(depthMm) || area <= 0 || depthMm <= 0 || !p) { out.hidden = true; return; }
      var wastage = form.querySelector('[name="wastage"]').checked ? 1.1 : 1;
      var m3raw = area * (depthMm / 1000) * wastage;
      var m3 = roundUpQuarter(m3raw);
      var density = p.density || 1;
      var tonnes = m3raw * density;
      var bagKg = p.bagWeightKg || 15;
      var bags = Math.ceil((tonnes * 1000) / bagKg);

      out.querySelector('[data-out="area"]').textContent = fmt(area, 1) + ' m²';
      out.querySelector('[data-out="m3"]').textContent = fmt(m3, 2) + ' m³';
      out.querySelector('[data-out="tonnes"]').textContent = p.density ? ('≈ ' + fmt(tonnes, 2) + ' t') : 'n/a';
      var bagRow = out.querySelector('[data-row="bags"]');
      var hasBags = p.formats && (p.formats.bag15kg || p.formats.bag20kg);
      bagRow.hidden = !hasBags;
      out.querySelector('[data-out="bags"]').textContent = bags + ' × ' + bagKg + 'kg';
      var rec;
      if (p.formats && p.formats.bulkM3 && hasBags) rec = 'Order ' + fmt(m3, 2) + ' m³ bulk, or ' + bags + ' × ' + bagKg + 'kg bags.';
      else if (p.formats && p.formats.bulkM3) rec = 'Order ' + fmt(m3, 2) + ' m³ bulk' + (p.minOrder ? ' (' + p.minOrder + ')' : '') + '.';
      else if (hasBags) rec = 'Order ' + bags + ' × ' + bagKg + 'kg bags.';
      else rec = 'About ' + fmt(m3, 2) + ' m³. Call us to confirm quantity for ' + p.name + '.';
      out.querySelector('.calc__rec').textContent = rec;
      out.querySelector('[data-out="product"]').textContent = p.name;

      var quote = out.querySelector('.calc__quote');
      if (quote) {
        var qs = new URLSearchParams({ product: p.name, qty: fmt(m3, 2) + ' m³ (' + bags + ' × ' + bagKg + 'kg bags)', note: 'Calculated: ' + fmt(area, 1) + ' m² at ' + depthMm + 'mm' + (wastage > 1 ? ' incl. 10% wastage' : '') });
        quote.href = '/contact/?' + qs.toString() + '#quote';
      }
      var link = out.querySelector('.calc__productlink');
      if (link) { link.href = p.path; link.textContent = 'See ' + p.name; }
      out.hidden = false;
    }

    form.addEventListener('input', calc);
    form.addEventListener('change', function () { shapeUI(); calc(); });
    form.addEventListener('submit', function (e) { e.preventDefault(); calc(); out.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); });
    shapeUI();
    calc();
  }

  document.querySelectorAll('[data-calculator]').forEach(mount);
})();
