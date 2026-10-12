/* DECA — shared behaviour.
   Every block is guarded, so one file can serve every page: a block whose
   markup is absent simply does nothing.

   Motion policy: all of it is decoration, none of it is information. The CSS
   only hides anything under `html.js`, so with scripting off the page renders
   complete; and prefers-reduced-motion is honoured in CSS, not here, so a
   reduced-motion visitor never depends on this file behaving. */
(function () {
  'use strict';

  function all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  /* ---------- theme switch ----------
     The head script has already set data-theme before first paint; this only
     handles the toggle and keeps an explicit choice sticky. If the visitor
     never chose, we keep following the system as it changes. */
  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    var stored = null;
    try { stored = localStorage.getItem('deca-theme'); } catch (e) {}

    var sync = function () {
      var dark = root.getAttribute('data-theme') === 'dark';
      toggle.setAttribute('aria-pressed', String(dark));
      toggle.setAttribute('aria-label', dark ? 'Ganti ke tema terang' : 'Ganti ke tema gelap');
    };

    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('deca-theme', next); } catch (e) {}
      stored = next;
      sync();
    });

    sync();

    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var onSystem = function (e) {
        if (stored !== 'dark' && stored !== 'light') {
          root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
          sync();
        }
      };
      if (mq.addEventListener) mq.addEventListener('change', onSystem);
      else if (mq.addListener) mq.addListener(onSystem);
    }
  }

  /* ---------- scroll reveal ---------- */
  var revealables = all('.reveal');
  if (revealables.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -56px 0px', threshold: 0 });
      revealables.forEach(function (el) { io.observe(el); });
    } else {
      // no observer support: show everything rather than leave it hidden
      revealables.forEach(function (el) { el.classList.add('in'); });
    }
  }

  /* ---------- nav: scroll shadow + reading progress ---------- */
  var nav = document.querySelector('.nav');
  if (nav) {
    var ticking = false;
    var update = function () {
      var doc = document.documentElement;
      var y = window.pageYOffset || doc.scrollTop || 0;
      nav.classList.toggle('is-scrolled', y > 8);
      var max = doc.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      nav.style.setProperty('--p', p.toFixed(4));
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- mobile navigation ---------- */
  var burger = document.getElementById('burger');
  var mobile = document.getElementById('nav-mobile');
  if (burger && mobile) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      burger.setAttribute('aria-label', open ? 'Buka menu' : 'Tutup menu');
      mobile.classList.toggle('open', !open);
    });
    mobile.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        burger.setAttribute('aria-expanded', 'false');
        mobile.classList.remove('open');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobile.classList.contains('open')) {
        burger.setAttribute('aria-expanded', 'false');
        mobile.classList.remove('open');
        burger.focus();
      }
    });
  }

  /* ---------- catalogue filter ---------- */
  var chips = all('.chip[data-filter]');
  var grid = document.getElementById('svc-grid');
  if (chips.length && grid) {
    var cards = all('.svc', grid);
    var empty = document.getElementById('svc-empty');
    var status = document.getElementById('svc-status');

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var want = chip.getAttribute('data-filter');
        chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });

        var shown = [];
        cards.forEach(function (card) {
          var match = want === 'all' || card.getAttribute('data-cat') === want;
          card.hidden = !match;
          if (match) {
            card.classList.remove('in');
            void card.offsetWidth;            // force reflow so the animation restarts
            shown.push(card);
          }
        });
        if (empty) empty.hidden = shown.length > 0;
        if (status) status.textContent = 'Menampilkan ' + shown.length + ' dari ' + cards.length + ' layanan.';

        // replay the reveal so a filter change reads as a change
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () {
            shown.forEach(function (card, i) {
              card.style.animationDelay = (Math.min(i, 6) * 0.035).toFixed(3) + 's';
              card.classList.add('in');
            });
          });
        });
      });
    });
  }

  /* ---------- flow tabs ---------- */
  var tabs = all('.flow-tab[role="tab"]');
  if (tabs.length) {
    var selectTab = function (tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
    };
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { selectTab(tab); });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') next = tabs[0];
        if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); next.focus(); selectTab(next); }
      });
    });
  }

  /* ---------- footer year ---------- */
  all('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
