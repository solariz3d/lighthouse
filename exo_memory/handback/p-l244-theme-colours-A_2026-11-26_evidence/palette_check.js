// palette_check.js: for each look's proposed --mark-* colours, the nearest other mark and the nearest backdrop (road edge, grid, fog, sky, sky a/b/c), RGB distance (W4's unit)
// usage: TREE=<builder tree> node palette_check.js
const fs = require('fs'), path = require('path');
const TREE = process.env.TREE;
const P = require('./palettes.js');
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const fromCss = (v) => { const m = /color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)\)/.exec(v); if (m) return [m[1], m[2], m[3]].map((x) => Math.round(Number(x) * 255)); if (/^#[0-9a-f]{6}$/i.test(v.trim())) return hex(v.trim()); return null; };
function vars(look) {
  const html = fs.readFileSync(path.join(TREE, 'app/index.html'), 'utf8'), root = /:root\s*\{([\s\S]*?)\}/.exec(html)[1], v = {};
  const take = (b) => { for (const m of b.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) v[m[1]] = m[2].trim(); };
  take(root);
  if (look !== 'sigil') { const css = fs.readFileSync(path.join(TREE, 'app/themes', `${look}.css`), 'utf8'); for (const m of css.matchAll(new RegExp(`\\[data-theme="${look}"\\]\\s*\\{([^{}]*)\\}`, 'g'))) take(m[1]); }
  return v;
}
const d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
let worst = Infinity;
for (const [look, pal] of Object.entries(P)) {
  const v = vars(look === "today" ? "sigil" : look), back = {};
  for (const n of (process.env.ALLSKY ? ['--road-edge', '--ground-grid', '--fog', '--sky', '--sky-a', '--sky-b', '--sky-c'] : ['--road-edge', '--ground-grid', '--fog', '--sky'])) { const c = v[n] && fromCss(v[n]); if (c) back[n] = c; }
  console.log(`\n${look}`);
  for (const [f, h] of Object.entries(pal)) {
    const c = hex(h);
    const om = Object.entries(pal).filter(([g]) => g !== f).map(([g, k]) => [g, d(c, hex(k))]).sort((a, b) => a[1] - b[1])[0];
    const ob = Object.entries(back).map(([g, k]) => [g, d(c, k)]).sort((a, b) => a[1] - b[1])[0];
    worst = Math.min(worst, om[1]);
    console.log(`  ${f.padEnd(7)} ${h}  nearest mark ${om[0].padEnd(7)} ${om[1].toFixed(0).padStart(4)}   nearest backdrop ${ob[0].padEnd(14)} ${ob[1].toFixed(0).padStart(4)}`);
  }
  console.log(`  bank-turn ${d(hex(pal.bank), hex(pal.turn)).toFixed(0)}`);
}
console.log(`\nworst mark pair ${worst.toFixed(0)}`);
