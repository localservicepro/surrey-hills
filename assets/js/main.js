/* Surrey Hills Garden Supplies — shared behaviour (vanilla JS, no deps) */
(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mobile nav */
  var burger = document.querySelector('.burger');
  var mnav = document.getElementById('mobile-nav');
  if (burger && mnav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      mnav.setAttribute('data-open', String(!open));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { burger.click(); burger.focus(); }
    });
  }

  /* Reveal on scroll */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); var ol = en.target.closest('.steps'); if (ol) ol.classList.add('in'); io.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      reveals.forEach(function (el, i) { el.style.setProperty('--d', ((i % 4) * 0.08) + 's'); io.observe(el); });
      setTimeout(function () { reveals.forEach(function (el) { el.classList.add('in'); }); }, 2500); /* safety net: never leave content hidden */
    }
  }

  /* Counter animation (fulfilment strip) */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var run = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var prefix = el.getAttribute('data-prefix') || '';
      if (reduce) { el.textContent = prefix + target + suffix; return; }
      var start = null, dur = 1100;
      var step = function (ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { run(en.target); cio.unobserve(en.target); } });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { cio.observe(el); });
    } else { counters.forEach(run); }
  }

  /* Product gallery */
  var gal = document.querySelector('.gallery');
  if (gal) {
    var main = gal.querySelector('.gallery__main img');
    gal.querySelectorAll('.gallery__thumbs button').forEach(function (b) {
      b.addEventListener('click', function () {
        gal.querySelectorAll('.gallery__thumbs button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        var img = b.querySelector('img');
        main.src = b.getAttribute('data-full') || img.src;
        main.alt = img.alt;
      });
    });
  }

  /* Hero video: injected only on wide screens, after load, and never for reduced-motion / data-saver users.
     Phones get the still (keeps the mobile LCP small). */
  var hm = document.querySelector('.hero__media[data-video-mp4]');
  if (hm) {
    var conn = navigator.connection || {};
    var ok = !reduce && !conn.saveData && !/2g/.test(conn.effectiveType || '') && window.innerWidth >= 700;
    if (ok) {
      var inject = function () {
        var v = document.createElement('video');
        v.className = 'hero__video'; v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true; v.setAttribute('aria-hidden', 'true'); v.preload = 'auto';
        if (hm.getAttribute('data-video-webm')) { var sw = document.createElement('source'); sw.src = hm.getAttribute('data-video-webm'); sw.type = 'video/webm'; v.appendChild(sw); }
        var sm = document.createElement('source'); sm.src = hm.getAttribute('data-video-mp4'); sm.type = 'video/mp4'; v.appendChild(sm);
        v.addEventListener('playing', function () { hm.classList.add('hero__media--video'); });
        hm.appendChild(v); var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
      };
      if (document.readyState === 'complete') setTimeout(inject, 300); else window.addEventListener('load', function () { setTimeout(inject, 300); });
    }
  }

  /* Contact form: prefill from ?product=&qty= and keep Netlify happy */
  var form = document.querySelector('form[name="quote"]');
  if (form) {
    try {
      var q = new URLSearchParams(location.search);
      var p = q.get('product'), qty = q.get('qty'), sub = q.get('suburb');
      if (p) { var pf = form.querySelector('[name="products"]'); if (pf) pf.value = p; }
      if (qty) { var qf = form.querySelector('[name="quantity"]'); if (qf) qf.value = qty; }
      if (sub) { var sf = form.querySelector('[name="suburb"]'); if (sf) sf.value = sub; }
      if (p || qty) { var n = form.querySelector('[name="notes"]'); if (n && q.get('note')) n.value = q.get('note'); }
    } catch (e) {}
  }

  /* Mark current nav item */
  var path = location.pathname.replace(/index\.html$/, '');
  document.querySelectorAll('.nav a, .mobile-nav a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href && href !== '/' && path.indexOf(href) === 0) a.setAttribute('aria-current', 'page');
  });
})();
