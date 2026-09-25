// Page chrome: section nav and the figure lightbox.

export function initNav(nav, hero) {
  const bar = nav.querySelector('.topnav__links');
  const links = [...bar.querySelectorAll('a')];

  // Reveal the nav once the hero is out of view.
  new IntersectionObserver(([e]) => nav.classList.toggle('is-visible', !e.isIntersecting), { rootMargin: '-64px 0px 0px 0px' })
    .observe(hero);

  // Highlight the section under the middle of the viewport; keep it visible on narrow screens.
  const spy = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      for (const a of links) {
        const on = a.hash === `#${e.target.id}`;
        a.classList.toggle('is-active', on);
        if (on) bar.scrollTo({ left: a.offsetLeft - (bar.clientWidth - a.offsetWidth) / 2, behavior: 'smooth' });
      }
    }
  }, { rootMargin: '-45% 0px -50% 0px' });
  links.forEach((a) => { const s = document.querySelector(a.hash); if (s) spy.observe(s); });
}

export function initLightbox(dialog) {
  const img = dialog.querySelector('img');
  document.querySelectorAll('.zoom').forEach((btn) => btn.addEventListener('click', () => {
    const src = btn.querySelector('img');
    img.src = src.currentSrc || src.src;
    img.alt = src.alt;
    dialog.showModal();
  }));
  dialog.addEventListener('click', () => dialog.close());
}
