// Tiny DOM helpers shared by every module. Text always goes in via textContent.

export function el(tag, attrs = {}, ...kids) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k === 'style') Object.assign(node.style, v);
    else node.setAttribute(k, v === true ? '' : v);
  }
  node.append(...kids.flat().filter((k) => k != null));
  return node;
}

export function svg(tag, attrs = {}) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  return node;
}

// One tooltip for the page. Marks opt in with tip(node, value, label).
const tipEl = () => document.getElementById('tip');

function show(value, label, x, y) {
  const t = tipEl();
  t.replaceChildren(el('b', { text: value }), el('span', { text: label }));
  t.hidden = false;
  const r = t.getBoundingClientRect();
  const left = Math.min(Math.max(8, x - r.width / 2), innerWidth - r.width - 8);
  const top = y - r.height - 12 < 8 ? y + 16 : y - r.height - 12;
  t.style.transform = `translate(${left}px, ${top}px)`;
}

function hide() { tipEl().hidden = true; }

export function tip(node, value, label) {
  node.addEventListener('pointermove', (e) => show(value, label, e.clientX, e.clientY));
  node.addEventListener('pointerleave', hide);
  node.addEventListener('focus', () => {
    const r = node.getBoundingClientRect();
    show(value, label, r.left + r.width / 2, r.top);
  });
  node.addEventListener('blur', hide);
  return node;
}

export { show as showTip, hide as hideTip };
