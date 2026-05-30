/* Tossful brand-site v2 — vanilla JS
   Handles: language toggle, hero carousel, tabs, mobile nav, popup */

(function () {
  /* ============================================================
     1. Language toggle (VI / EN)
     ============================================================ */
  var html = document.documentElement;
  var stored = localStorage.getItem('tossful-lang');
  if (stored === 'en' || stored === 'vi') html.setAttribute('lang', stored);

  document.querySelectorAll('[data-lang-toggle]').forEach(function (btn) {
    var label = btn.querySelector('[data-lang-label]');
    function reflect() {
      var l = html.getAttribute('lang');
      if (label) label.textContent = (l === 'en' ? 'EN' : 'VI');
    }
    reflect();
    btn.addEventListener('click', function () {
      var next = html.getAttribute('lang') === 'vi' ? 'en' : 'vi';
      html.setAttribute('lang', next);
      localStorage.setItem('tossful-lang', next);
      reflect();
    });
  });

  /* ============================================================
     2. Hero carousel — cross-fade between slides
     ============================================================ */
  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var slides = root.querySelectorAll('[data-slide]');
    var dots   = root.querySelectorAll('[data-carousel-dot]');
    var prev   = root.querySelector('[data-carousel-prev]');
    var next   = root.querySelector('[data-carousel-next]');
    var i = 0;
    var timer = null;
    var INTERVAL = 6000;

    function go(idx) {
      i = (idx + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
      dots.forEach(function (d, k)  { d.classList.toggle('is-active', k === i); });
    }
    function tick()  { go(i + 1); }
    function start() { stop(); timer = setInterval(tick, INTERVAL); }
    function stop()  { if (timer) clearInterval(timer); }

    if (prev) prev.addEventListener('click', function () { go(i - 1); start(); });
    if (next) next.addEventListener('click', function () { go(i + 1); start(); });
    dots.forEach(function (d) {
      d.addEventListener('click', function () { go(parseInt(d.dataset.carouselDot, 10)); start(); });
    });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    start();
  });

  /* ============================================================
     3. Tabs (Home, Menu, News, Careers)
     ============================================================ */
  document.querySelectorAll('[data-tabs]').forEach(function (root) {
    var btns = root.querySelectorAll('.tab-headline, .tab-btn, .subtab-btn');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var group = btn.dataset.tabGroup || 'default';
        var target = btn.dataset.tabTarget;
        root.querySelectorAll('[data-tab-group="' + group + '"]')
          .forEach(function (b) { b.setAttribute('aria-selected', 'false'); });
        btn.setAttribute('aria-selected', 'true');
        root.querySelectorAll('[data-tab-panel-group="' + group + '"]').forEach(function (p) {
          p.classList.toggle('is-active', p.dataset.tabPanel === target);
        });
      });
    });
  });

  /* ============================================================
     4. Mobile nav
     ============================================================ */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open);
    });
  }

  /* ============================================================
     5. Bowl builder — REMOVED 2026-05-22.
     The brand-site previously had an inline builder widget here with
     hard-coded ingredient kcal/price estimates. That widget has been
     replaced by the canonical Tossful nutrition calculator at
     /calculator/index.html (a synced copy of
     web-order/workshop/nutrition-calculator/index.html), embedded on
     mix-bowl.html via iframe. Single source of truth, no drift, no
     incorrect pricing on the marketing site.
     ============================================================ */

  /* ============================================================
     6. Welcome popup — 1.5s after first load, dismiss persistent per session
     ============================================================ */
  var popup = document.querySelector('[data-popup]');
  if (popup) {
    var seen = sessionStorage.getItem('tossful-popup-seen');
    if (!seen) setTimeout(function () { popup.classList.add('is-open'); }, 1500);
    popup.addEventListener('click', function (e) {
      if (e.target === popup || e.target.closest('[data-popup-close]')) {
        popup.classList.remove('is-open');
        sessionStorage.setItem('tossful-popup-seen', '1');
      }
    });
  }
})();
