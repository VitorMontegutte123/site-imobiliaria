/**
 * app.js
 * Preloader, custom cursor, mobile menu, contact form, misc chrome.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* Preloader                                                          */
  /* ------------------------------------------------------------------ */
  window.addEventListener('load', function () {
    var preloader = document.getElementById('preloader');
    if (!preloader) return;
    setTimeout(function () { preloader.classList.add('is-hidden'); }, 500);
  });

  /* ------------------------------------------------------------------ */
  /* Custom cursor                                                      */
  /* ------------------------------------------------------------------ */
  (function cursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    var dot = document.querySelector('.cursor-dot');
    var ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    var hasMoved = false;
    var mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener('mousemove', function (e) {
      hasMoved = true;
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
    });

    (function loop() {
      if (hasMoved) {
        rx += (mx - rx) * 0.16;
        ry += (my - ry) * 0.16;
        ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      }
      requestAnimationFrame(loop);
    })();

    document.querySelectorAll('a, button, input, .glass-card').forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('is-active'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('is-active'); });
    });
  })();

  /* ------------------------------------------------------------------ */
  /* Mobile menu                                                        */
  /* ------------------------------------------------------------------ */
  (function mobileMenu() {
    var burger = document.getElementById('navbarBurger');
    var menu = document.getElementById('mobileMenu');
    if (!burger || !menu) return;

    burger.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(isOpen));
    });

    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  })();

  /* ------------------------------------------------------------------ */
  /* Footer year                                                        */
  /* ------------------------------------------------------------------ */
  var yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------ */
  /* Contact form                                                       */
  /* ------------------------------------------------------------------ */
  (function contactForm() {
    var form = document.getElementById('leadForm');
    if (!form) return;

    var success = document.getElementById('contactSuccess');
    var submitBtn = document.getElementById('formSubmit');
    var phoneInput = document.getElementById('fieldTelefone');

    phoneInput.addEventListener('input', function () {
      var v = this.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 6) {
        v = v.replace(/(\d{2})(\d{1})(\d{4})(\d{0,4})/, '($1) $2 $3-$4');
      } else if (v.length > 2) {
        v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
      }
      this.value = v.trim();
      this.closest('.field').classList.remove('has-error');
    });

    form.querySelectorAll('input').forEach(function (input) {
      input.addEventListener('input', function () {
        this.closest('.field').classList.remove('has-error');
      });
    });

    function isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nome = document.getElementById('fieldNome');
      var telefone = document.getElementById('fieldTelefone');
      var email = document.getElementById('fieldEmail');

      var nomeOk = nome.value.trim().length >= 2;
      var telOk = telefone.value.replace(/\D/g, '').length >= 10;
      var emailOk = isValidEmail(email.value.trim());

      [[nome, nomeOk], [telefone, telOk], [email, emailOk]].forEach(function (pair) {
        pair[0].closest('.field').classList.toggle('has-error', !pair[1]);
      });

      if (!(nomeOk && telOk && emailOk)) {
        var firstInvalid = form.querySelector('.field.has-error input');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = 'Enviando…';

      // Placeholder for a real integration (CRM / e-mail service / webhook).
      setTimeout(function () {
        form.style.display = 'none';
        success.classList.add('is-visible');
        success.setAttribute('tabindex', '-1');
        success.focus();
      }, 550);
    });
  })();
})();
