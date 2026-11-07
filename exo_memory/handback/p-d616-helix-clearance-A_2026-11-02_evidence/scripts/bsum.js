// bsum.js <body.csv>: per piece, the lowest body-box point over its road, the lowest wheel centre, the nearest thing above, with the frame's speed and boost
const L = require('fs').readFileSync(process.argv[2], 'utf8').trim().split('\n'), H = L[0].split(','), rows = L.slice(1).map((l) => { const c = l.split(','); return Object.fromEntries(H.map((h, i) => [h, c[i]])); });
const num = (x) => (x === '' ? null : +x); const by = {};
const bo = rows.map((r) => +r.boost); console.log('frames', rows.length, 'boost min', Math.min(...bo), 'max', Math.max(...bo), 'frames boost>0.5', bo.filter((b) => b > 0.5).length, '| speed max', Math.max(...rows.map((r) => +r.kph)));
const hb = rows.map((r) => +r.hBodyOverWheels).sort((a, b) => a - b); console.log('body over wheel plane (m): p1', hb[Math.floor(hb.length * .01)], 'median', hb[hb.length >> 1], 'p99', hb[Math.floor(hb.length * .99)]);
for (const r of rows) { const p = r.piece || '(none)', b = (by[p] = by[p] || { n: 0, bot: null, wh: null, up: null });
  b.n++; const bb = num(r.bodyBottomMin), ww = num(r.wheelMin), uu = num(r.upMin);
  if (bb !== null && (!b.bot || bb < b.bot.v)) b.bot = { v: bb, f: r.frame, t: r.lapT, kph: r.kph, boost: r.boost, gas: r.gas };
  if (ww !== null && (!b.wh || ww < b.wh.v)) b.wh = { v: ww, f: r.frame };
  if (uu !== null && (!b.up || uu < b.up.v)) b.up = { v: uu, f: r.frame, mesh: r.upMesh, kph: r.kph, boost: r.boost }; }
for (const [p, b] of Object.entries(by).sort((a, c) => (+a[0].slice(1) || 0) - (+c[0].slice(1) || 0)))
  console.log(p.padEnd(6), String(b.n).padStart(5), 'bodyLow', b.bot ? `${b.bot.v.toFixed(3)} @f${b.bot.f} lapT ${b.bot.t} ${b.bot.kph} km/h boost ${b.bot.boost} gas ${b.bot.gas}` : '-', '| wheelCtrLow', b.wh ? b.wh.v.toFixed(3) : '-', '| above', b.up ? `${b.up.v.toFixed(2)} ${b.up.mesh} @f${b.up.f} ${b.up.kph} km/h boost ${b.up.boost}` : 'nothing within 40 m');
