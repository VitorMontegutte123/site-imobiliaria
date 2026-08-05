/**
 * slider.js
 * Cinematic gallery — cross-fade transition, slow autoplay, minimal pagination.
 */
(function () {
  'use strict';

  if (typeof Swiper === 'undefined') return;

  var el = document.querySelector('.gallery-swiper');
  if (!el) return;

  new Swiper(el, {
    effect: 'fade',
    fadeEffect: { crossFade: true },
    speed: 1400,
    loop: true,
    autoplay: {
      delay: 4200,
      disableOnInteraction: false
    },
    pagination: {
      el: el.querySelector('.swiper-pagination'),
      clickable: true
    },
    a11y: {
      prevSlideMessage: 'Imagem anterior',
      nextSlideMessage: 'Próxima imagem'
    },
    keyboard: { enabled: true }
  });
})();
