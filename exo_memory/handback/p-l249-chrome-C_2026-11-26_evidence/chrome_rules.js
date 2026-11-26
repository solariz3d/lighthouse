// chrome_rules.js (pane C, L249): reads a theme file's text (comments stripped) at a commit and lists (1) every border-radius it sets and (2) every
// box-shadow or text-shadow layer that is a GLOW: an outer layer (not inset) with a blur above 0 whose colour is not neutral. Neutral = black, white or
// grey (r, g and b within 12 of each other), or near-black (every channel 60 or under: a dark drop or shading, not light). A var() colour is resolved
// against the file's own [data-theme] token blocks. Read-only: git show.
// usage: node chrome_rules.js <builder repo> <sha> <look> [<look> ...]
'use strict';
const { execFileSync } = require('child_process');
const [repo, sha, ...looks] = process.argv.slice(2);
const show = (p) => execFileSync('git', ['-C', repo, 'show', `${sha}:${p}`], { maxBuffer: 1 << 26 }).toString().replace(/\r\n/g, '\n').replace(/\/\*[\s\S]*?\*\//g, '');
const splitTop = (s, ch) => { const out = []; let d = 0, cur = ''; for (const c of s) { if (c === '(') d++; if (c === ')') d--; if (c === ch && d === 0) { out.push(cur); cur = ''; } else cur += c; } out.push(cur); return out.map((x) => x.trim()).filter(Boolean); };
const rgbOf = (c) => {
  let m = /^#([0-9a-f]{3,8})$/i.exec(c);
  if (m) { let h = m[1]; if (h.length <= 4) h = [...h].map((x) => x + x).join(''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).concat(h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1); }
  m = /^rgba?\(([^)]*)\)$/i.exec(c);
  if (m) { const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; }
  return null;
};
let glowsTotal = 0;
for (const look of looks) {
  const css = show(`app/themes/${look}.css`);
  const vars = {};
  for (const b of css.matchAll(new RegExp(`\\[data-theme="${look}"\\]\\s*\\{([^{}]*)\\}`, 'g'))) for (const m of b[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) vars[m[1]] = m[2].trim();
  const res = (v, d = 0) => (d > 5 ? v : v.replace(/var\((--[\w-]+)(?:,\s*([^)]*))?\)/g, (a, n, fb) => (n in vars ? res(vars[n], d + 1) : fb || a)));
  const radii = [], glows = [];
  for (const r of css.replace(/@[^{]+\{/g, '').matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const sel = r[1].trim().replace(/\s+/g, ' ');
    for (const d of r[2].matchAll(/(border-radius|box-shadow|text-shadow)\s*:\s*([^;]+)/g)) {
      const prop = d[1], val = d[2].replace(/!important/, '').trim();
      if (prop === 'border-radius') { radii.push(`${val.padEnd(34)} ${sel.slice(0, 110)}`); continue; }
      if (val === 'none') continue;
      for (const layer of splitTop(val, ',')) {
        if (/^inset\b|\binset$/.test(layer)) continue;
        const parts = splitTop(res(layer), ' ');
        const lens = parts.filter((p) => /^-?[\d.]+(px)?$/.test(p)).map((p) => parseFloat(p));
        const colour = parts.find((p) => !/^-?[\d.]+(px)?$/.test(p));
        const blur = prop === 'text-shadow' ? (lens[2] || 0) : (lens[2] || 0);
        const rgb = colour ? rgbOf(colour) : null;
        const neutral = rgb && (Math.max(rgb[0], rgb[1], rgb[2]) - Math.min(rgb[0], rgb[1], rgb[2]) <= 12 || Math.max(rgb[0], rgb[1], rgb[2]) <= 60);
        if (blur > 0 && !neutral) glows.push(`${prop}: ${layer}  (blur ${blur}, colour ${colour})  ${sel.slice(0, 90)}`);
      }
    }
  }
  glowsTotal += glows.length;
  console.log(`== ${look} at ${sha}: ${radii.length} border-radius declarations, ${glows.length} coloured glows`);
  for (const r of radii) console.log(`  radius  ${r}`);
  for (const g of glows) console.log(`  GLOW    ${g}`);
}
console.log(`total coloured glows: ${glowsTotal}`);
