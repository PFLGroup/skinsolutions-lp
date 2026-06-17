/* =====================================================================
   SKIN SOLUTIONS — main.js
   Vanilla JS, zero zależności. Progresywne ulepszenia:
   1) mobile nav  2) sticky header  3) smooth scroll  4) scroll-reveal
   5) licznik  6) rok w stopce  7) walidacja formularza (fallback mailto)
   ES2017+, defensywne sprawdzanie elementów, respektuje prefers-reduced-motion.
   ===================================================================== */
(function () {
  'use strict';

  var doc = document;
  var prefersReducedMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  function ready(fn) {
    if (doc.readyState === 'loading') {
      doc.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  /* -------------------------------------------------------------------
     Wysokość sticky headera (do offsetu przy smooth scroll)
  ------------------------------------------------------------------- */
  function getHeaderHeight() {
    var header = doc.querySelector('.site-header');
    if (header && header.offsetHeight) return header.offsetHeight;
    // fallback z CSS var --header-h
    var raw = getComputedStyle(doc.documentElement).getPropertyValue('--header-h');
    var parsed = parseInt(raw, 10);
    return isNaN(parsed) ? 76 : parsed;
  }

  /* ===================================================================
     1) MOBILE NAV
  =================================================================== */
  function initNav() {
    var toggle = doc.querySelector('.js-nav-toggle');
    var nav = doc.getElementById('primary-nav');
    if (!toggle || !nav) return;

    var bodyOpenClass = 'nav-open';
    var mq = window.matchMedia ? window.matchMedia('(max-width: 768px)') : null;

    function isMobile() {
      return mq ? mq.matches : window.innerWidth <= 768;
    }

    function openMenu() {
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Zamknij menu nawigacji');
      nav.classList.add('is-open');
      if (isMobile()) doc.body.classList.add(bodyOpenClass);
    }

    function closeMenu(returnFocus) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Otwórz menu nawigacji');
      nav.classList.remove('is-open');
      doc.body.classList.remove(bodyOpenClass);
      if (returnFocus) {
        try { toggle.focus(); } catch (e) {}
      }
    }

    function isOpen() {
      return toggle.getAttribute('aria-expanded') === 'true';
    }

    toggle.addEventListener('click', function () {
      if (isOpen()) {
        closeMenu(false);
      } else {
        openMenu();
        // przenieś focus na pierwszy link w menu (sensowne zarządzanie focusem)
        var firstLink = nav.querySelector('a');
        if (firstLink && isMobile()) {
          try { firstLink.focus(); } catch (e) {}
        }
      }
    });

    // Zamknij menu po kliknięciu dowolnego linku w nawigacji
    nav.addEventListener('click', function (ev) {
      var link = ev.target.closest ? ev.target.closest('a') : null;
      if (link && isOpen()) {
        closeMenu(false);
      }
    });

    // Esc zamyka i wraca focusem na przycisk
    doc.addEventListener('keydown', function (ev) {
      if ((ev.key === 'Escape' || ev.key === 'Esc') && isOpen()) {
        closeMenu(true);
      }
    });

    // Przy powrocie do desktopu sprzątamy stan otwarcia
    function handleViewportChange() {
      if (!isMobile() && isOpen()) {
        closeMenu(false);
      }
    }
    if (mq) {
      if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', handleViewportChange);
      } else if (typeof mq.addListener === 'function') {
        mq.addListener(handleViewportChange);
      }
    }
  }

  /* ===================================================================
     2) STICKY HEADER (rAF throttle)
  =================================================================== */
  function initStickyHeader() {
    var header = doc.querySelector('.site-header');
    if (!header) return;

    var threshold = 40;
    var ticking = false;

    function update() {
      var scrolled = window.pageYOffset > threshold;
      header.classList.toggle('is-scrolled', scrolled);
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    update(); // stan początkowy (np. po odświeżeniu w połowie strony)
  }

  /* ===================================================================
     3) SMOOTH SCROLL (z offsetem headera, respektuje reduced-motion)
  =================================================================== */
  function initSmoothScroll() {
    var links = doc.querySelectorAll('a[href^="#"]');
    if (!links.length) return;

    Array.prototype.forEach.call(links, function (link) {
      link.addEventListener('click', function (ev) {
        var href = link.getAttribute('href');
        if (!href || href === '#' || href.charAt(0) !== '#') return;

        var id = href.slice(1);
        var target = doc.getElementById(id);
        if (!target) return; // niech zadziała natywnie (np. brak kotwicy)

        ev.preventDefault();

        var headerH = getHeaderHeight();
        var rectTop = target.getBoundingClientRect().top + window.pageYOffset;
        var top = Math.max(0, rectTop - headerH - 8);

        window.scrollTo({
          top: top,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });

        // Dostępność: przenieś focus do sekcji docelowej bez ponownego skoku
        var hadTabindex = target.hasAttribute('tabindex');
        if (!hadTabindex) target.setAttribute('tabindex', '-1');
        try { target.focus({ preventScroll: true }); } catch (e) {
          try { target.focus(); } catch (e2) {}
        }
        if (!hadTabindex) {
          target.addEventListener('blur', function handler() {
            target.removeAttribute('tabindex');
            target.removeEventListener('blur', handler);
          });
        }

        // Zaktualizuj hash bez ponownego skoku (lepsze deep-linki)
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', href);
        }
      });
    });
  }

  /* ===================================================================
     4) SCROLL-REVEAL ([data-reveal] → .is-visible)
     5) LICZNIK (.counter[data-target])
     Obsłużone wspólnym podejściem z IntersectionObserver.
  =================================================================== */

  // Formatowanie liczby po polsku (separator tysięcy = wąska spacja/zwykła spacja).
  // Dopasowane do HTML: w hero "1000+" (bez spacji), więc dla licznika
  // używamy formatu bez separatora gdy w atrybucie/markupie nie ma spacji.
  function formatNumber(value) {
    // > 999 → grupowanie tysięcy spacją (PL). Tu jednak utrzymujemy zgodność z HTML.
    return String(value);
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    if (prefersReducedMotion) {
      el.textContent = formatNumber(target);
      return;
    }

    var duration = 1600; // ~1.6s
    var startTime = null;

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function step(now) {
      if (startTime === null) startTime = now;
      var elapsed = now - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var current = Math.round(easeOutCubic(progress) * target);
      el.textContent = formatNumber(current);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = formatNumber(target);
      }
    }

    window.requestAnimationFrame(step);
  }

  function initRevealAndCounters() {
    var revealEls = doc.querySelectorAll('[data-reveal]');
    var counters = doc.querySelectorAll('.counter[data-target]');

    var noObserver = typeof window.IntersectionObserver !== 'function';

    // Fallback: brak IntersectionObserver LUB reduced-motion → pokaż wszystko od razu
    if (noObserver || prefersReducedMotion) {
      Array.prototype.forEach.call(revealEls, function (el) {
        el.classList.add('is-visible');
      });
      Array.prototype.forEach.call(counters, function (el) {
        var target = parseInt(el.getAttribute('data-target'), 10);
        if (!isNaN(target)) el.textContent = formatNumber(target);
      });
      return;
    }

    // Reveal observer
    if (revealEls.length) {
      var revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px'
      });

      Array.prototype.forEach.call(revealEls, function (el) {
        revealObserver.observe(el);
      });
    }

    // Counter observer (osobny — inny próg, animacja jednokrotna)
    if (counters.length) {
      var counterObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.4
      });

      Array.prototype.forEach.call(counters, function (el) {
        counterObserver.observe(el);
      });
    }
  }

  /* ===================================================================
     6) ROK W STOPCE
  =================================================================== */
  function initYear() {
    var yearEl = doc.getElementById('year');
    if (!yearEl) return;
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ===================================================================
     7) FORMULARZ — delikatna walidacja, nie psuje fallbacku mailto:
  =================================================================== */
  function initForm() {
    var form = doc.getElementById('contact-form');
    if (!form) return;

    var nameEl = doc.getElementById('cf-name');
    var emailEl = doc.getElementById('cf-email');
    var consentEl = doc.getElementById('cf-consent');

    // Kontener komunikatów (aria-live) — tworzymy raz, jeśli go nie ma
    var liveRegion = doc.getElementById('cf-status');
    if (!liveRegion) {
      liveRegion = doc.createElement('p');
      liveRegion.id = 'cf-status';
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', 'polite');
      // wizualnie dyskretny komunikat, ale dostępny dla AT i wzroku
      liveRegion.style.margin = '0.8rem 0 0';
      liveRegion.style.fontSize = '0.85rem';
      liveRegion.style.minHeight = '1em';
      form.appendChild(liveRegion);
    }

    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setError(field, message) {
      if (!field) return;
      field.setAttribute('aria-invalid', 'true');
    }

    function clearError(field) {
      if (!field) return;
      field.removeAttribute('aria-invalid');
    }

    function clearAll() {
      clearError(nameEl);
      clearError(emailEl);
      clearError(consentEl);
      liveRegion.textContent = '';
      liveRegion.style.color = '';
    }

    form.addEventListener('submit', function (ev) {
      clearAll();

      var errors = [];
      var firstInvalid = null;

      // Imię i nazwisko — wymagane
      if (!nameEl || !nameEl.value.trim()) {
        errors.push('podaj imię i nazwisko');
        setError(nameEl);
        if (!firstInvalid) firstInvalid = nameEl;
      }

      // E-mail — wymagany i poprawny
      var emailVal = emailEl ? emailEl.value.trim() : '';
      if (!emailVal || !EMAIL_RE.test(emailVal)) {
        errors.push('podaj poprawny adres e-mail');
        setError(emailEl);
        if (!firstInvalid) firstInvalid = emailEl;
      }

      // Zgoda — wymagana
      if (!consentEl || !consentEl.checked) {
        errors.push('zaznacz zgodę na kontakt');
        setError(consentEl);
        if (!firstInvalid) firstInvalid = consentEl;
      }

      if (errors.length) {
        ev.preventDefault();
        liveRegion.style.color = '#9a2f2f';
        liveRegion.textContent = 'Sprawdź formularz: ' + errors.join(', ') + '.';
        if (firstInvalid) {
          try { firstInvalid.focus(); } catch (e) {}
        }
        return;
      }

      // Walidacja OK → NIE blokujemy. Pozwalamy zadziałać natywnemu mailto:.
      liveRegion.style.color = '';
      liveRegion.textContent = 'Otwieramy Twojego klienta poczty, aby wysłać wiadomość…';
    });

    // Czyszczenie błędu pola przy edycji
    [nameEl, emailEl, consentEl].forEach(function (field) {
      if (!field) return;
      var evtName = field.type === 'checkbox' ? 'change' : 'input';
      field.addEventListener(evtName, function () {
        clearError(field);
      });
    });
  }

  /* ===================================================================
     INIT
  =================================================================== */
  ready(function () {
    initNav();
    initStickyHeader();
    initSmoothScroll();
    initRevealAndCounters();
    initYear();
    initForm();
  });
})();
