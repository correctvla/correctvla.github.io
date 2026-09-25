// "Where the correction sits in time": the human window as a share of the rollout.
import { el, svg, showTip, hideTip } from './dom.js';

// Piecewise-linear envelope: 0 at the window edges, 1 at its midpoint.
const phi = (t, [a, b]) => (t < a || t > b ? 0 : 1 - Math.abs(t - (a + b) / 2) / ((b - a) / 2));

function ticks(T) {
  const step = T <= 4 ? 1 : 2;
  const out = [];
  for (let t = 0; t < T - 0.4 * step; t += step) out.push(t);
  return [...out, T];
}

function render(root, ex) {
  const [a, b] = ex.window;
  const T = ex.length;
  root.querySelector('.explainer__task').replaceChildren(
    el('b', { text: ex.task }), ` · ${ex.suite}`);
  root.querySelector('.sentence').textContent = ex.sentence;
  root.querySelector('.tuples').replaceChildren(...ex.tuples.map((t) => el('code', { class: 'tuple' },
    '⟨', ...t.flatMap((f, i) => [i ? ' · ' : '', el('span', { text: f })]), '⟩')));
  root.querySelector('.explainer__stat').replaceChildren(
    el('b', { text: `${(b - a).toFixed(1)} s` }),
    ` of a ${T} s rollout (${Math.round((100 * (b - a)) / T)}%) — the policy acts on its own for the rest.`);
  root.querySelector('.explainer__note').textContent = ex.note;
  const watch = root.querySelector('.explainer__watch');
  watch.hidden = !ex.demo;
  watch.onclick = () => document.dispatchEvent(new CustomEvent('gallery:select', { detail: ex.demo }));

  // Envelope drawn in window-local coordinates; the SVG box is the window.
  const env = root.querySelector('.timeline__env');
  Object.assign(env.style, { left: `${(100 * a) / T}%`, width: `${(100 * (b - a)) / T}%` });
  env.setAttribute('viewBox', '0 0 100 100');
  env.replaceChildren(
    svg('polygon', { points: '0,100 50,4 100,100', class: 'env-fill' }),
    svg('polyline', { points: '0,100 50,4 100,100', class: 'env-line', 'vector-effect': 'non-scaling-stroke' }));

  // Label the larger stretch the policy handles alone.
  const own = a > T - b ? a / 2 : (b + T) / 2;
  root.querySelector('.timeline__own').style.left = `${(100 * own) / T}%`;

  root.querySelector('.timeline__axis').replaceChildren(...ticks(T).map((t) => el('span', {
    style: { left: `${(100 * t) / T}%` }, text: t === T ? `${T} s` : String(t),
  })));
}

export function initExplainer(root, examples) {
  const tabs = root.querySelector('.seg');
  let current = examples[0];
  const select = (ex) => {
    current = ex;
    tabs.querySelectorAll('button').forEach((btn, i) => btn.setAttribute('aria-selected', examples[i] === ex));
    render(root, ex);
  };
  tabs.replaceChildren(...examples.map((ex) => {
    const btn = el('button', { type: 'button', role: 'tab', text: ex.tab });
    btn.addEventListener('click', () => select(ex));
    return btn;
  }));

  // Crosshair readout: where are we, and is the correction acting?
  const track = root.querySelector('.timeline__track');
  const cursor = root.querySelector('.timeline__cursor');
  track.addEventListener('pointermove', (e) => {
    const r = track.getBoundingClientRect();
    const x = Math.min(Math.max(0, e.clientX - r.left), r.width);
    const t = (x / r.width) * current.length;
    const f = phi(t, current.window);
    cursor.style.left = `${x}px`;
    cursor.hidden = false;
    showTip(`t = ${t.toFixed(2)} s`, f > 0 ? `correction active · φ = ${f.toFixed(2)}` : 'policy on its own', e.clientX, r.top);
  });
  track.addEventListener('pointerleave', () => { cursor.hidden = true; hideTip(); });

  select(current);
}
