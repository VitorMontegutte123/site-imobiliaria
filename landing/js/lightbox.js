/**
 * lightbox.js
 * Minimal accessible lightbox for the project gallery.
 * With Swiper's fade effect + loop, slides stack absolutely on top of each
 * other (duplicates included), so whichever slide is on top at a given
 * point can intercept the click — not necessarily the visible one. Rather
 * than trust which element was hit, the click just confirms "the gallery
 * was clicked" and the open image comes from the Swiper instance's own
 * realIndex, which is always the one actually on screen.
 */
(function () {
  'use strict';

  var items = [
    { src: 'assets/images/gallery-1.jpg', alt: 'Fachada do Lago di Como', caption: 'A torre — imagem ilustrativa, sujeita a alterações' },
    { src: 'assets/images/gallery-2.jpg', alt: 'Entrada do Lago di Como', caption: 'A entrada — imagem ilustrativa, sujeita a alterações' },
    { src: 'assets/images/gallery-3.jpg', alt: 'Fachada do Lago di Como ao entardecer', caption: 'Os detalhes — imagem ilustrativa, sujeita a alterações' }
  ];

  var lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  var imgEl = document.getElementById('lightboxImg');
  var captionEl = document.getElementById('lightboxCaption');
  var closeBtn = document.getElementById('lightboxClose');
  var prevBtn = document.getElementById('lightboxPrev');
  var nextBtn = document.getElementById('lightboxNext');

  var current = 0;
  var lastFocused = null;

  function show(index) {
    current = ((index % items.length) + items.length) % items.length;
    var item = items[current];
    imgEl.src = item.src;
    imgEl.alt = item.alt;
    captionEl.textContent = item.caption;
  }

  function open(index) {
    lastFocused = document.activeElement;
    show(index);
    lightbox.classList.add('is-open');
    document.documentElement.classList.add('lightbox-locked');
    closeBtn.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function close() {
    lightbox.classList.remove('is-open');
    document.documentElement.classList.remove('lightbox-locked');
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') show(current + 1);
    else if (e.key === 'ArrowLeft') show(current - 1);
  }

  var galleryEl = document.querySelector('.gallery-swiper');
  if (galleryEl) {
    var openFromEvent = function (target) {
      var slide = target.closest('.swiper-slide');
      if (!slide) return;
      var swiper = galleryEl.swiper;
      var index = swiper ? swiper.realIndex : parseInt(slide.getAttribute('data-lightbox-index') || '0', 10);
      open(index);
    };
    galleryEl.addEventListener('click', function (e) { openFromEvent(e.target); });
    galleryEl.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.swiper-slide')) {
        e.preventDefault();
        openFromEvent(e.target);
      }
    });
  }

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', function () { show(current - 1); });
  nextBtn.addEventListener('click', function () { show(current + 1); });
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) close();
  });
})();
