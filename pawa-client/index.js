/* Fade-in für .card[data-animate] – fehlte zuvor in /pawa-client, dadurch blieben die Karten unsichtbar (opacity:0) */
(function () {
  var items = document.querySelectorAll('[data-animate]');
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('visible'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
  items.forEach(function (el) { io.observe(el); });
})();
