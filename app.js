// menu, przewijane rzedy kart, powiekszenia zdjec, komunikaty podgladu
(function () {
  var hamb = document.querySelector('.hamb'), menu = document.getElementById('menu');
  function zamknij() { menu.classList.remove('otw'); hamb.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }
  hamb.addEventListener('click', function () {
    var otw = !menu.classList.contains('otw');
    menu.classList.toggle('otw', otw); hamb.setAttribute('aria-expanded', otw ? 'true' : 'false');
    document.body.style.overflow = otw ? 'hidden' : '';
  });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) zamknij(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') zamknij(); });

  // aktywna pozycja menu wg sekcji na ekranie
  var linki = [].slice.call(menu.querySelectorAll('a'));
  var cele = linki.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (wpisy) {
      wpisy.forEach(function (w) {
        if (!w.isIntersecting) return;
        linki.forEach(function (a, i) { a.classList.toggle('akt', cele[i] === w.target); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    cele.forEach(function (c) { if (c) io.observe(c); });
  }

  var toast = document.getElementById('toast'), tt;
  function pokaz(t) { toast.textContent = t; toast.classList.add('widac'); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('widac'); }, 3200); }
  document.querySelectorAll('[data-podglad-info]').forEach(function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); pokaz('To podgląd strony głównej. Koszyk i podstrony działają w docelowym sklepie.'); });
  });

  // przeciaganie mysza + strzalki
  function przewijany(el) {
    var x0, s0, ruch = false, wcisniety = false;
    el.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      wcisniety = true; ruch = false; x0 = e.clientX; s0 = el.scrollLeft;
    });
    window.addEventListener('pointermove', function (e) {
      if (!wcisniety) return;
      var dx = e.clientX - x0;
      if (!ruch && Math.abs(dx) > 6) { ruch = true; el.classList.add('ciag'); }
      if (ruch) el.scrollLeft = s0 - dx;
    });
    window.addEventListener('pointerup', function () {
      if (!wcisniety) return; wcisniety = false;
      if (ruch) { setTimeout(function () { el.classList.remove('ciag'); }, 0); }
    });
    el.addEventListener('click', function (e) { if (ruch) { e.preventDefault(); e.stopPropagation(); ruch = false; } }, true);
  }
  document.querySelectorAll('.tor, .galeria').forEach(przewijany);
  document.querySelectorAll('.strzalki').forEach(function (s) {
    var t = document.getElementById(s.getAttribute('data-tor'));
    s.addEventListener('click', function (e) {
      var b = e.target.closest('[data-kier]'); if (!b) return;
      t.scrollBy({ left: Number(b.getAttribute('data-kier')) * t.clientWidth * 0.8, behavior: 'smooth' });
    });
  });

  // powiekszenie zdjecia
  var lb = document.getElementById('lb'), lbImg = lb.querySelector('img');
  document.querySelectorAll('.gfot').forEach(function (b) {
    b.addEventListener('click', function () {
      lbImg.src = b.getAttribute('data-duze'); lbImg.alt = b.querySelector('img').alt;
      if (lb.showModal) lb.showModal();
    });
  });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target.tagName === 'BUTTON') lb.close(); });

  var form = document.getElementById('formularz');
  form.addEventListener('submit', function (e) { e.preventDefault(); form.querySelector('.info').hidden = false; });
})();
