// contrast_png.js (pane B, L256): the reference panel's words against its ground AS DRAWN, from look256.js's panel pictures. The ground is sampled
// in the panel's left padding (x 7..12 px inside the picture: past its 4 px margin, the 1 px edge and the corner, in padding with no text), every row but the
// first and last 12 (clear of the rounded corners and their shine); the words' colours are the computed ones (look256.json). Reports each against the ground's lightest and darkest sample (WCAG).
// usage: node contrast_png.js <pictures dir> <look256.json> <builder tree>
const fs = require('fs'), path = require('path');
const [dir, jf, T] = process.argv.slice(2), { decode } = require(path.join(T, 'app/test/png.js')), J = JSON.parse(fs.readFileSync(jf, 'utf8'));
const lum = (c) => { const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return +((x + 0.05) / (y + 0.05)).toFixed(2); };
const rgb = (s) => s.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number);
const out = [];
for (const r of J.results) {
  const im = decode(fs.readFileSync(path.join(dir, `look_${r.look}_panel.png`)));
  const g = []; for (let y = 12; y < im.h - 12; y++) for (let x = 7; x <= 12; x++) g.push(im.px(x, y));
  g.sort((a, b) => lum(a) - lum(b)); const dark = g[0], light = g[g.length - 1], mid = g[g.length >> 1];
  const t = rgb(r.text), d = rgb(r.dim);
  out.push({ look: r.look, samples: g.length, groundDark: dark, groundMedian: mid, groundLight: light,
    words: { worst: Math.min(ratio(t, dark), ratio(t, light)), onMedian: ratio(t, mid) }, dimWords: { worst: Math.min(ratio(d, dark), ratio(d, light)), onMedian: ratio(d, mid) } });
}
console.log(JSON.stringify(out, null, 1));
