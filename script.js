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
    var btns = root.querySelectorAll('[data-tab-target]');  // any tab button (headline, subtab, menu/news/careers tabs)
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
     5b. News featured carousel (2026-07-19, diff-review #12)
     ============================================================ */
  var newsCar = document.querySelector('[data-news-carousel]');
  if (newsCar) {
    var slides = newsCar.querySelectorAll('[data-news-slide]');
    var dots = newsCar.querySelectorAll('[data-news-dot]');
    var cur = 0, timer = null;
    function showSlide(i) {
      cur = i;
      slides.forEach(function (s) { s.classList.toggle('is-active', s.dataset.newsSlide == i); });
      dots.forEach(function (d) { d.classList.toggle('is-active', d.dataset.newsDot == i); });
    }
    dots.forEach(function (d) {
      d.addEventListener('click', function () {
        showSlide(parseInt(d.dataset.newsDot, 10));
        if (timer) { clearInterval(timer); timer = null; }
      });
    });
    timer = setInterval(function () { showSlide((cur + 1) % slides.length); }, 6000);
  }

  /* ============================================================
     6. Soft-opening popup — re-enabled 2026-07-18 per TCD marketing
     package (Hieu approved). Static promo image -> beacons.ai; shown
     once per browser session. The Phase-2 signup→voucher popup remains
     a separate future project.
     ============================================================ */
  var popup = document.getElementById('welcome-popup');
  if (popup) {
    var KEY = 'tossful-popup-seen';
    var seen = false;
    try { seen = sessionStorage.getItem(KEY) === '1'; } catch (e) {}
    if (!seen) {
      /* 2026-08-24: the popup used to open on a bare 1200ms timer, so on a
         slow phone connection it appeared as a dimmed page with a floating
         close button and no poster. Only open it once the image has really
         decoded; if it errors or is still not ready after 8s, skip the popup
         for this visit (and leave KEY unset so it can show next time). */
      var promo = popup.querySelector('img');
      var opened = false;
      var open = function () {
        if (opened) return;
        opened = true;
        popup.hidden = false;
        try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
      };
      var ready = function () { setTimeout(open, 1200); };
      if (!promo) {
        ready();
      } else if (promo.complete && promo.naturalWidth > 0) {
        ready();
      } else {
        var give_up = setTimeout(function () { opened = true; }, 8000);
        promo.addEventListener('load', function () { clearTimeout(give_up); ready(); });
        promo.addEventListener('error', function () { clearTimeout(give_up); opened = true; });
      }
    }
    popup.querySelectorAll('[data-popup-close]').forEach(function (el) {
      el.addEventListener('click', function () { popup.hidden = true; });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') popup.hidden = true;
    });
  }

  /* ============================================================
     7. Nutrition sync — pull published kcal from /nutrition.json
     Source of truth = Supabase items.published_kcal (view
     v_menu_published) -> nutrition.json via `nutrition sync`.
     Progressive enhancement: overrides the hardcoded kcal text on
     each .menu-item; if the fetch fails, the hardcoded values stay.
     Matches by dish name (EN then VI), so no per-item markup needed.
     ============================================================ */
  (function () {
    function slugBase(s) {
      return (s || '')
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .toLowerCase()
        .replace(/\s*-\s*wrap\s*$/, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    fetch('/nutrition.json', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (doc) {
        if (!doc || !doc.items) return;
        var map = {};
        doc.items.forEach(function (it) {
          var v = { kcal: it.kcal, diet: it.diet };
          if (it.name_en) map[slugBase(it.name_en)] = v;
          if (it.name_vn) map[slugBase(it.name_vn)] = v;
        });
        document.querySelectorAll('.menu-item').forEach(function (card) {
          var nameEl = card.querySelector('.menu-item__name');
          var metaEl = card.querySelector('.menu-item__meta');
          if (!nameEl || !metaEl) return;
          var en = nameEl.querySelector('[lang="en"]');
          var vi = nameEl.querySelector('[lang="vi"]');
          var cands = [];
          if (en) cands.push(en.textContent);
          if (vi) cands.push(vi.textContent);
          cands.push(nameEl.textContent);
          var hit = null;
          for (var k = 0; k < cands.length; k++) {
            var s = slugBase(cands[k]);
            if (map[s]) { hit = map[s]; break; }
          }
          if (!hit || hit.kcal == null) return;
          metaEl.textContent = hit.kcal + ' Kcal' + (hit.diet ? ' | ' + hit.diet : '');
        });
      })
      .catch(function () { /* keep hardcoded fallback */ });
  })();
})();
