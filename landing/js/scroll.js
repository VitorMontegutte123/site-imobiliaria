/**
 * scroll.js
 * Lenis smooth-scroll wired into the GSAP ticker so ScrollTrigger stays in sync.
 * Exposes window.__lenis for other modules (slider.js, animations.js).
 */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof Lenis === 'undefined') {
    window.__lenis = null;
    return;
  }

  var lenis = new Lenis({
    duration: 1.15,
    easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.1
  });

  window.__lenis = lenis;

  if (typeof gsap !== 'undefined') {
    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } else {
    requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    });
  }

  // Keep ScrollTrigger in sync with Lenis' virtual scroll position.
  if (typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
  }

  // Anchor links scroll through Lenis instead of the native jump.
  document.addEventListener('click', function (e) {
    var anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    var id = anchor.getAttribute('href');
    if (id.length < 2) return;
    var target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -20, duration: 1.3 });
    document.getElementById('mobileMenu')?.classList.remove('is-open');
    document.getElementById('navbarBurger')?.setAttribute('aria-expanded', 'false');
  });
})();
