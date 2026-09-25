// Result charts, rendered as plain HTML so labels stay crisp and wrap at any width.
import { el, tip } from './dom.js';

const pct = (a, b) => `${((100 * a) / b).toFixed(1)}%`;

// Show the long label if it fits inside its segment, else the short one, else none.
function fitLabels(root) {
  const fit = () => root.querySelectorAll('.seg-label').forEach((s) => {
    const [long, short] = s.children;
    long.hidden = false; short.hidden = true;
    if (s.scrollWidth <= s.clientWidth) return;
    long.hidden = true; short.hidden = false;
    if (s.scrollWidth > s.clientWidth) short.hidden = true;
  });
  new ResizeObserver(fit).observe(root);
}

export function taxonomy(root, { models, modes }) {
  root.replaceChildren(...models.map((m) => el('div', { class: 'taxbar' },
    el('span', { class: 'taxbar__name', text: m.name }),
    el('div', { class: 'taxbar__track' }, modes.map((mode) => {
      const v = mode[m.key];
      const seg = el('span', {
        class: `taxbar__seg${mode.reachable ? ' is-accent' : ''}`,
        style: { flex: `${v} 1 0` }, tabindex: 0,
        'aria-label': `${mode.name}, ${m.name}: ${v}%`,
      }, el('span', { class: 'seg-label' },
        el('span', { text: `${mode.name} ${v}%` }), el('span', { text: `${v}%` })));
      return tip(seg, `${v}%`, `${mode.name} · ${m.name}`);
    })))));
  fitLabels(root);
}

// Dumbbell: base → with correction, on a shared 0–100% axis.
export function success(root, rows) {
  const axis = el('div', { class: 'dumb__axis' },
    [0, 25, 50, 75, 100].map((t) => el('span', { style: { left: `${t}%` }, text: `${t}%` })));
  root.replaceChildren(el('div', { class: 'dumb' }, rows.map((r) => {
    const b = (100 * r.base[0]) / r.base[1];
    const o = (100 * r.ours[0]) / r.ours[1];
    const dot = (cls, x, v, n, who) => tip(el('span', {
      class: `dumb__dot ${cls}`, style: { left: `${x}%` }, tabindex: 0, 'aria-label': `${who}: ${v}`,
    }), v, `${who} · ${n[0]}/${n[1]}`);
    return el('div', { class: 'dumb__row' },
      el('span', { class: 'dumb__name', text: r.name }),
      el('div', { class: 'dumb__track' },
        el('span', { class: 'dumb__line', style: { left: `${b}%`, width: `${o - b}%` } }),
        dot('dot--base', b, pct(...r.base), r.base, 'Base π0.5'),
        dot('dot--accent', o, pct(...r.ours), r.ours, 'CorrectVLA'),
        el('span', { class: 'dumb__val is-base', style: { right: `calc(${100 - b}% + 10px)` }, text: pct(...r.base) }),
        el('span', { class: 'dumb__val is-ours', style: { left: `calc(${o}% + 10px)` }, text: pct(...r.ours) })));
  }), axis));
}

// Nested counts on one scale: failures → in a correctable task → recovered.
export function funnel(root, settings) {
  const max = Math.max(...settings.flatMap((s) => s.stages.map((x) => x.n)));
  root.replaceChildren(el('div', { class: 'funnel' }, settings.map((s) => el('div', { class: 'funnel__set' },
    el('p', { class: 'funnel__name', text: s.name }),
    s.stages.map((x) => el('div', { class: 'funnel__stage' },
      el('p', { class: 'funnel__label' }, el('b', { text: String(x.n) }), ` ${x.label}`),
      el('span', {
        class: `funnel__bar${x.accent ? ' is-accent' : x.soft ? ' is-soft' : ''}`,
        style: { width: `${(100 * x.n) / max}%` },
      })))))));
}

const dots = (n, of, cls) => el('span', { class: 'dots' },
  Array.from({ length: of }, (_, i) => el('i', { class: i < n ? cls : 'is-fail' })));

export function perTask(root, rows) {
  root.replaceChildren(el('div', { class: 'pertask' }, rows.map((r) => el('div', { class: 'pertask__row' },
    el('q', { class: 'pertask__task', text: r.task }),
    r.note
      ? el('span', { class: 'pertask__note', text: r.note })
      : el('span', { class: 'pertask__val' }, dots(r.rec, r.of, 'is-accent'), el('b', { text: `${r.rec}/${r.of}` }))))));
}

// Real robot: one cell per run of 10 trials, base vs with one sentence.
export function robot(root, { conditions, inDistributionRun, engagement }) {
  const run = (n, i, cond, isBase) => {
    const who = isBase ? 'Base π0.5-DROID' : 'With one sentence';
    const flag = isBase && inDistributionRun(n);
    const cell = el('div', { class: 'run', tabindex: 0, 'aria-label': `${cond}, ${who}, run ${i + 1}: ${n} of 10 succeeded` },
      dots(n, 10, isBase ? 'is-base' : 'is-accent'),
      el('span', { class: 'run__n', text: `${n}/10${flag ? ' †' : ''}` }));
    return tip(cell, `${n}/10`, `${who} · run ${i + 1}${flag ? ' · object inside the fine-tuning distribution' : ''}`);
  };
  const head = el('div', { class: 'robot__row robot__row--head' },
    el('span'),
    el('span', { class: 'robot__col', text: 'Base π0.5-DROID' }),
    el('span', { class: 'robot__col is-accent', text: 'With one sentence' }));
  const rows = conditions.map((c) => el('div', { class: 'robot__row' },
    el('p', { class: 'robot__name', text: c.name }),
    el('div', { class: 'robot__group', 'data-label': 'Base π0.5-DROID' }, c.base.map((n, i) => run(n, i, c.name, true))),
    el('div', { class: 'robot__group', 'data-label': 'With one sentence' }, c.ours.map((n, i) => run(n, i, c.name, false)))));
  const time = el('div', { class: 'robot__row robot__row--time' },
    el('p', { class: 'robot__name', text: 'Human time per run' }),
    el('div', { class: 'robot__group', 'data-label': 'Base π0.5-DROID' }, [0, 1, 2].map(() => el('span', { text: engagement.base }))),
    el('div', { class: 'robot__group', 'data-label': 'With one sentence' }, [0, 1, 2].map(() => el('span', { text: engagement.ours }))));
  root.replaceChildren(head, ...rows, time);
}
