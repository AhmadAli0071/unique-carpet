/* ==========================================================================
   Unique Carpet & Interior — site behaviour
   ========================================================================== */
(function () {
  "use strict";

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- 1. Fill every generative artwork placeholder ---------- */
  function paintArt(scope) {
    $$('[data-svg]', scope).forEach(function (el) {
      if (el.dataset.painted) return;
      var parts = el.dataset.svg.split('|');
      /* prepend, never replace — these containers often hold captions/labels */
      el.insertAdjacentHTML('afterbegin',
        window.UCArt(parts[0], parts[1], parts[2] || parts[0] + parts[1]));
      el.dataset.painted = '1';

      /* If a real photograph exists at data-img, lay it over the drawn artwork.
         Nothing breaks when the file is missing — the SVG simply stays. */
      var src = el.dataset.img;
      if (!src) return;
      var have = window.UC_IMAGES;
      if (Object.prototype.toString.call(have) === '[object Array]' &&
          have.indexOf(src.slice(src.indexOf('images/') + 7)) === -1) return;
      var probe = new Image();
      probe.onload = function () {
        var img = document.createElement('img');
        img.src = src;
        img.alt = el.dataset.alt || '';
        img.className = 'art-photo';
        img.decoding = 'async';
        el.appendChild(img);
        el.classList.add('has-photo');
      };
      probe.src = src;
    });
  }

  /* ---------- 2. Header: sticky shadow, dropdowns, mobile drawer ---------- */
  function nav() {
    var header = $('.site-header');
    if (header) {
      var onScroll = function () {
        header.classList.toggle('is-stuck', window.scrollY > 12);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    var toggle = $('.nav__toggle'), menu = $('.nav__menu');
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        var open = menu.classList.toggle('is-open');
        toggle.classList.toggle('is-active', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.style.overflow = open && window.innerWidth <= 960 ? 'hidden' : '';
      });
    }

    $$('.nav__item--has-menu').forEach(function (item) {
      var link = $('.nav__link', item);
      var isTouchLayout = function () { return window.innerWidth <= 960; };

      link.addEventListener('click', function (e) {
        if (isTouchLayout()) {
          e.preventDefault();
          item.classList.toggle('is-open');
        }
      });
      item.addEventListener('mouseenter', function () {
        if (!isTouchLayout()) item.classList.add('is-open');
      });
      item.addEventListener('mouseleave', function () {
        if (!isTouchLayout()) item.classList.remove('is-open');
      });
      link.addEventListener('focus', function () {
        if (!isTouchLayout()) item.classList.add('is-open');
      });
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav__item--has-menu') && window.innerWidth > 960) {
        $$('.nav__item--has-menu').forEach(function (i) { i.classList.remove('is-open'); });
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        $$('.nav__item.is-open').forEach(function (i) { i.classList.remove('is-open'); });
        if (menu && menu.classList.contains('is-open')) toggle.click();
        closeLightbox();
      }
    });
  }

  /* ---------- 3. Scroll reveal ---------- */
  function reveal() {
    var items = $$('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (i) { i.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var el = en.target;
          var delay = parseInt(el.dataset.delay || 0, 10);
          setTimeout(function () { el.classList.add('is-in'); }, delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px' });
    items.forEach(function (i) { io.observe(i); });

    /* failsafe: nothing on this site may stay invisible because an observer
       never fired (print, screenshot, thumbnail, odd viewport). */
    setTimeout(function () {
      items.forEach(function (i) { i.classList.add('is-in'); });
    }, 2500);
  }

  /* ---------- 4. Counters ---------- */
  function counters() {
    var nums = $$('[data-count]');
    if (!nums.length || !('IntersectionObserver' in window)) {
      nums.forEach(function (n) { n.textContent = n.dataset.count + (n.dataset.suffix || ''); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var end = parseFloat(el.dataset.count);
        var suffix = el.dataset.suffix || '';
        var dec = (String(end).split('.')[1] || '').length;
        var start = null, dur = 1400;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (end * eased).toFixed(dec) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* ---------- 5. Accordion ---------- */
  function accordions() {
    $$('.acc__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.acc__item');
        var panel = $('.acc__panel', item);
        var open = item.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        panel.style.maxHeight = open ? panel.scrollHeight + 'px' : 0;
      });
    });
  }

  /* ---------- 6. Product grid + filters ---------- */
  function prodImg(id) {
    var rel = 'products/' + id + '.jpg';
    var alias = window.UC_IMG_ALIAS || {};
    return '../images/' + (alias[rel] || rel);
  }
  function cardHTML(p) {
    return '' +
      '<article class="card reveal" data-coll="' + p.coll + '" data-id="' + p.id + '">' +
        '<div class="card__media" data-svg="' + p.art + '|' + p.pal + '|' + p.id + '"' +
             ' data-img="' + prodImg(p.id) + '" data-alt="' + p.name + ' — Unique Carpet &amp; Interior, Lahore">' +
          '<span class="card__tag">' + p.sub + '</span>' +
        '</div>' +
        '<div class="card__body">' +
          '<h3>' + p.name + '</h3>' +
          '<p>' + p.blurb + '</p>' +
          '<div class="card__meta">' + p.tags.map(function (t) {
            return '<span class="chip">' + t + '</span>';
          }).join('') + '</div>' +
          '<div class="card__foot">' +
            '<span class="card__price">Price on request</span>' +
            '<button class="link-more js-quick" type="button" data-id="' + p.id + '">Details &rsaquo;</button>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function productGrid() {
    var grid = $('#product-grid');
    if (!grid || !window.UC_PRODUCTS) return;

    var PARENT = window.UC_PARENT || {};
    var matches = function (p, key) {
      return p.coll === key || PARENT[p.coll] === key;
    };

    var only = (grid.dataset.coll || 'all').split(',').map(function (s) { return s.trim(); });
    var pool = only[0] === 'all'
      ? window.UC_PRODUCTS
      : window.UC_PRODUCTS.filter(function (p) {
          for (var i = 0; i < only.length; i++) { if (matches(p, only[i])) return true; }
          return false;
        });

    grid.innerHTML = pool.map(cardHTML).join('');
    paintArt(grid);
    reveal();

    $$('.filter').forEach(function (btn) {
      btn.addEventListener('click', function () {
        $$('.filter').forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var f = btn.dataset.filter;
        var list = f === 'all' ? pool : pool.filter(function (p) { return matches(p, f); });
        grid.innerHTML = list.length
          ? list.map(cardHTML).join('')
          : '<p class="muted">Nothing in this group yet — call us on 0320 1417293 and we will source it.</p>';
        paintArt(grid);
        $$('.card', grid).forEach(function (c) { c.classList.add('is-in'); });
        bindQuick();
      });
    });

    bindQuick();
  }

  /* ---------- 7. Quick-view lightbox ---------- */
  function closeLightbox() {
    var lb = $('#lightbox');
    if (lb) { lb.classList.remove('is-open'); document.body.style.overflow = ''; }
  }

  function bindQuick() {
    $$('.js-quick').forEach(function (b) {
      b.addEventListener('click', function () {
        var p = (window.UC_PRODUCTS || []).filter(function (x) { return x.id === b.dataset.id; })[0];
        if (!p) return;
        var lb = $('#lightbox');
        if (!lb) return;
        var art = $('#lb-art');
        art.innerHTML = '';
        delete art.dataset.painted;
        art.dataset.svg = p.art + '|' + p.pal + '|' + p.id;
        art.dataset.img = prodImg(p.id);
        art.dataset.alt = p.name;
        paintArt(art.parentNode);
        $('#lb-title').textContent = p.name;
        $('#lb-sub').textContent = p.sub;
        $('#lb-text').textContent = p.blurb;
        $('#lb-tags').innerHTML = p.tags.map(function (t) { return '<span class="chip">' + t + '</span>'; }).join('');
        $('#lb-wa').href = 'https://wa.me/923201417293?text=' +
          encodeURIComponent('Assalam-o-Alaikum, I would like a quote for: ' + p.name);
        lb.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });
    });
  }

  function lightbox() {
    var lb = $('#lightbox');
    if (!lb) return;
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.closest('.lightbox__close')) closeLightbox();
    });
  }

  /* ---------- 8. Back to top ---------- */
  function toTop() {
    var btn = $('.totop');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.classList.toggle('is-visible', window.scrollY > 500);
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 9. Enquiry form ---------- */
  function forms() {
    $$('form[data-validate]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = true;
        $$('.field', form).forEach(function (field) {
          var input = $('input,select,textarea', field);
          if (!input || !input.required) return;
          var val = (input.value || '').trim();
          var bad = !val ||
            (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) ||
            (input.type === 'tel' && val.replace(/\D/g, '').length < 7);
          field.classList.toggle('is-invalid', bad);
          if (bad) ok = false;
        });
        if (!ok) return;

        /* No server is attached to this static site. The enquiry is handed to
           WhatsApp so it reaches the shop straight away. Swap this block for a
           POST to your own endpoint or a service like Formspree when ready. */
        var get = function (n) { var f = form.elements[n]; return f ? f.value.trim() : ''; };
        var msg = 'New website enquiry%0A' +
          '----------------------%0A' +
          'Name: ' + get('name') + '%0A' +
          'Email: ' + get('email') + '%0A' +
          'Phone: ' + get('phone') + '%0A' +
          'Interested in: ' + get('interest') + '%0A' +
          'Message: ' + get('message');
        var note = $('.form-success', form.parentNode) || $('.form-success', form);
        if (note) note.classList.add('is-visible');
        form.reset();
        window.open('https://wa.me/923201417293?text=' + msg.replace(/%0A/g, '%0A'), '_blank', 'noopener');
      });

      $$('.field input,.field select,.field textarea', form).forEach(function (i) {
        i.addEventListener('input', function () {
          i.closest('.field').classList.remove('is-invalid');
        });
      });
    });
  }

  /* ---------- 10. Misc ---------- */
  function misc() {
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

    /* mark the current page in the nav */
    var here = location.pathname.split('/').pop() || 'index.html';
    $$('.nav__menu a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href === here) {
        a.setAttribute('aria-current', 'page');
        var parent = a.closest('.nav__item--has-menu');
        if (parent) $('.nav__link', parent).setAttribute('aria-current', 'page');
      }
    });

    /* shop open / closed indicator — opens 9:00 AM, Pakistan time */
    var flag = $('[data-openstate]');
    if (flag) {
      var now = new Date();
      var h = now.getHours();
      flag.textContent = (h >= 9 && h < 20) ? 'Open now' : 'Closed · Opens 9 am';
      flag.style.color = (h >= 9 && h < 20) ? '#7fd1a0' : '';
    }
  }

  /* ---------- boot ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    paintArt(document);
    nav();
    productGrid();
    reveal();
    counters();
    accordions();
    lightbox();
    toTop();
    forms();
    misc();
  });
})();
