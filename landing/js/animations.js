/**
 * animations.js
 * GSAP + ScrollTrigger + SplitType choreography.
 * Everything here is additive: without JS the .no-js CSS fallback keeps
 * all content fully visible (see animations.css).
 */
(function () {
  'use strict';

  if (typeof gsap === 'undefined') return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ------------------------------------------------------------------ */
  /* Hero title — split into lines/chars and reveal on load             */
  /* ------------------------------------------------------------------ */
  function revealHero() {
    var titleEl = document.getElementById('heroTitle');
    var tl = gsap.timeline({ delay: 0.35 });

    if (titleEl && typeof SplitType !== 'undefined' && !reduceMotion) {
      var split = new SplitType(titleEl, { types: 'chars', tagName: 'span' });
      gsap.set(split.chars, { yPercent: 120, opacity: 0 });
      tl.to(split.chars, {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.028
      }, 0);
    } else if (titleEl) {
      gsap.set(titleEl, { opacity: 0, y: 24 });
      tl.to(titleEl, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0);
    }

    document.querySelectorAll('.hero .reveal-fade').forEach(function (el) {
      var delay = parseFloat(el.dataset.delay || 0);
      gsap.set(el, { opacity: 0, y: 16 });
      tl.to(el, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 0.5 + delay);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Scroll reveals — fade/slide up, fade, and image scale/clip         */
  /* ------------------------------------------------------------------ */
  function revealOnScroll() {
    if (typeof ScrollTrigger === 'undefined') return;

    gsap.utils.toArray('.reveal-up').forEach(function (el) {
      var delay = parseFloat(el.dataset.delay || 0);
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: delay,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    gsap.utils.toArray('.reveal-image').forEach(function (el) {
      gsap.to(el, {
        opacity: 1,
        scale: 1,
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Navbar background state                                            */
  /* ------------------------------------------------------------------ */
  function navbarState() {
    var nav = document.getElementById('navbar');
    if (!nav) return;
    var toggle = function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 60);
    };
    (window.__lenis ? window.__lenis.on.bind(window.__lenis) : window.addEventListener.bind(window))('scroll', toggle);
    toggle();
  }

  /* ------------------------------------------------------------------ */
  /* Hero mouse-follow glow (desktop only, subtle)                      */
  /* ------------------------------------------------------------------ */
  function heroGlow() {
    var hero = document.getElementById('hero');
    var glow = document.getElementById('heroGlow');
    if (!hero || !glow || window.matchMedia('(pointer: coarse)').matches) return;

    hero.addEventListener('mouseenter', function () { gsap.to(glow, { opacity: 1, duration: 0.4 }); });
    hero.addEventListener('mouseleave', function () { gsap.to(glow, { opacity: 0, duration: 0.4 }); });
    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      gsap.to(glow, {
        '--x': (e.clientX - rect.left) + 'px',
        '--y': (e.clientY - rect.top) + 'px',
        duration: 0.6,
        ease: 'power2.out'
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Scroll progress bar                                                */
  /* ------------------------------------------------------------------ */
  function scrollProgress() {
    var bar = document.getElementById('scrollProgress');
    if (!bar) return;
    var update = function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = pct + '%';
    };
    (window.__lenis ? window.__lenis.on.bind(window.__lenis) : window.addEventListener.bind(window))('scroll', update);
    window.addEventListener('resize', update);
    update();
  }

  /* ------------------------------------------------------------------ */
  /* Floating WhatsApp button — appears after leaving the hero          */
  /* ------------------------------------------------------------------ */
  function floatingWaVisibility() {
    var btn = document.getElementById('floatingWa');
    var hero = document.getElementById('hero');
    if (!btn || !hero) return;
    var toggle = function () {
      btn.classList.toggle('is-visible', window.scrollY > hero.offsetHeight * 0.6);
    };
    (window.__lenis ? window.__lenis.on.bind(window.__lenis) : window.addEventListener.bind(window))('scroll', toggle);
    toggle();
  }

  /* ------------------------------------------------------------------ */
  /* Glass card subtle 3D tilt                                          */
  /* ------------------------------------------------------------------ */
  function glassTilt() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.querySelectorAll('.glass-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, {
          rotateX: py * -6,
          rotateY: px * 6,
          translateY: -4,
          duration: 0.5,
          ease: 'power2.out',
          transformPerspective: 800
        });
      });
      card.addEventListener('mouseleave', function () {
        gsap.to(card, { rotateX: 0, rotateY: 0, translateY: 0, duration: 0.6, ease: 'power3.out' });
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Init                                                                */
  /* ------------------------------------------------------------------ */
  window.addEventListener('DOMContentLoaded', function () {
    revealHero();
    revealOnScroll();
    navbarState();
    heroGlow();
    glassTilt();
    scrollProgress();
    floatingWaVisibility();
  });
})();
