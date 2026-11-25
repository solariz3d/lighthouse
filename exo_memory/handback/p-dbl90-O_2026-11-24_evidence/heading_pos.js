// heading_pos.js: the read's heading from its centre POSITIONS (chord over ±k stations), not the faces' forward vectors; and the curvature, to find where each turn runs
const read = require(require('path').resolve(process.argv[2])), k = +(process.argv[3] || 2), D = 180 / Math.PI;
const st = read.stations.filter((s) => s.c && s.d >= 300 && s.d <= 760);
let acc = 0, prev = null; const out = [];
for (let i = k; i + k < st.length; i++) {
  const a = st[i - k].c, b = st[i + k].c, h = Math.atan2(b[0] - a[0], b[2] - a[2]);
  if (prev !== null) { let dh = h - prev; while (dh > Math.PI) dh -= 2 * Math.PI; while (dh < -Math.PI) dh += 2 * Math.PI; acc += dh; }
  prev = h; out.push({ d: st[i].d, h: acc * D, w: st[i].width });
}
const at = (d) => out.reduce((x, y) => (Math.abs(y.d - d) < Math.abs(x.d - d) ? y : x));
const h0 = at(452).h, sg = Math.sign(at(516).h - h0);
for (let i = 1; i < out.length; i++) { const x = out[i]; if (x.d % 8 !== 0 || x.d < 440 || x.d > 620) continue; const rate = ((x.h - out[i - 2].h) / (x.d - out[i - 2].d)) * sg; console.log(x.d, ((x.h - h0) * sg).toFixed(1).padStart(6), (rate).toFixed(2).padStart(6) + ' deg/m', rate ? ('R ' + (180 / Math.PI / Math.abs(rate)).toFixed(0) + ' m').padStart(9) : '', 'w', x.w); }
