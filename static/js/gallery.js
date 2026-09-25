// One before/after player for every rollout pair. Both clips start together,
// hold their final frame, and restart together once both have finished.
import { el } from './dom.js';

export function initGallery(root, groups, { autoplay = true } = {}) {
  const $ = (s) => root.querySelector(s);
  const [vFail, vPass] = root.querySelectorAll('video');
  const vids = [vFail, vPass];
  const bars = root.querySelectorAll('.player__bar i');
  const win = $('.player__window');
  const live = $('.player__live');
  const toggle = $('[data-act="toggle"]');
  let item = null;
  let userPaused = false;
  let inView = false;
  let timer = 0;

  const playing = () => inView && !userPaused && autoplay;
  const sync = () => {
    clearTimeout(timer);
    vids.forEach((v) => (playing() ? v.play().catch(() => {}) : v.pause()));
    toggle.classList.toggle('is-paused', !playing());
    toggle.setAttribute('aria-label', playing() ? 'Pause' : 'Play');
  };
  const restart = () => { vids.forEach((v) => { v.currentTime = 0; }); sync(); };

  vids.forEach((v) => v.addEventListener('ended', () => {
    if (vids.every((x) => x.ended)) timer = setTimeout(restart, 1200);
  }));

  // Progress bars, plus a badge that stays up briefly: the window itself lasts ~0.2 s.
  let liveUntil = 0;
  (function tick(now) {
    vids.forEach((v, i) => { bars[i].style.width = `${v.duration ? (100 * v.currentTime) / v.duration : 0}%`; });
    const w = item?.correction?.window;
    if (w && vPass.currentTime >= w[0] && vPass.currentTime <= w[1]) liveUntil = now + 1500;
    live.hidden = now > liveUntil;
    requestAnimationFrame(tick);
  })(0);

  vPass.addEventListener('loadedmetadata', () => {
    const w = item?.correction?.window;
    win.hidden = !w;
    if (w) Object.assign(win.style, { left: `${(100 * w[0]) / vPass.duration}%`, width: `${(100 * (w[1] - w[0])) / vPass.duration}%` });
  });

  function selectItem(group, it) {
    item = it;
    liveUntil = 0;
    root.style.setProperty('--aspect', group.aspect);
    const list = $('.gallery__tasks');
    list.querySelectorAll('button').forEach((b) => b.setAttribute('aria-current', b.dataset.id === it.id));
    // Keep the chosen task visible inside the list without scrolling the page.
    const cur = list.querySelector('[aria-current="true"]');
    if (cur) list.scrollTo({ left: cur.offsetLeft - 12, top: cur.offsetTop - 12, behavior: 'smooth' });
    $('.gallery__title').replaceChildren(el('b', { text: it.task }), el('span', { text: it.suite }));
    root.querySelectorAll('.player__who').forEach((n, i) => { n.textContent = group.who[i]; });
    const c = it.correction;
    const chip = $('.gallery__correction');
    chip.hidden = !c;
    if (c) chip.replaceChildren('The correction: ', el('q', { text: c.sentence }), ` · ${c.window[0]}–${c.window[1]} s`);
    win.hidden = true;
    vFail.src = it.fail;
    vPass.src = it.pass;
    restart();
  }

  function selectGroup(group, it = group.items[0]) {
    root.querySelectorAll('.gallery__groups button').forEach((b) => b.setAttribute('aria-selected', b.dataset.key === group.key));
    const list = $('.gallery__tasks');
    list.replaceChildren();
    let heading = null;
    for (const x of group.items) {
      if (x.group !== heading) list.append(el('p', { class: 'gallery__group', text: (heading = x.group) }));
      const btn = el('button', { type: 'button', 'data-id': x.id },
        el('span', { text: x.task }), el('small', { text: x.suite }), x.correction && el('i', { class: 'has-corr', title: 'Correction window shown' }));
      btn.addEventListener('click', () => selectItem(group, x));
      list.append(btn);
    }
    selectItem(group, it);
  }

  $('.gallery__groups').replaceChildren(...groups.map((g) => {
    const b = el('button', { type: 'button', role: 'tab', 'data-key': g.key },
      g.label, el('span', { class: 'count', text: String(g.items.length) }));
    b.addEventListener('click', () => selectGroup(g));
    return b;
  }));

  toggle.addEventListener('click', () => { userPaused = !userPaused; sync(); });
  $('[data-act="restart"]').addEventListener('click', () => { userPaused = false; restart(); });

  new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); }, { threshold: 0.35 })
    .observe($('.gallery__pair'));

  document.addEventListener('gallery:select', (e) => {
    const g = groups.find((x) => x.items.some((i) => i.id === e.detail));
    if (g) selectGroup(g, g.items.find((i) => i.id === e.detail));
  });

  // Open on the rollout whose correction window we know (paper Figure 3).
  const start = groups[0].items.find((i) => i.correction) || groups[0].items[0];
  selectGroup(groups[0], start);
}
