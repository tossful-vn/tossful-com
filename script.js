/* Tossful brand-site v2 — vanilla JS
   Handles: language toggle, hero carousel, tabs, mobile nav */

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
     replaced by the canonical Tossful nutrition calculator, which the
     "Tính Calo" nav tab links to at /calculator. That path is a Vercel
     rewrite to web-order-app's /nutrition route — single source of
     truth, no drift, no incorrect pricing on the marketing site.
     ============================================================ */

  /* ============================================================
     6. Welcome popup — PARKED (TSK-121, 2026-06-03).
     The signup→voucher loop needs Phase 2 (login + iPOS API + automated
     fulfilment); manual fulfilment doesn't scale during brand launch.
     Popup component removed from the homepage. See
     web-order/2026-06-03_popup-signup-voucher-investigation.md.
     ============================================================ */
})();
