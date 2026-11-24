// dev.js: for the check-skipped one piece, the built bank (adapter bankPlan) against the document's, along the piece; and each change's own window as bankAsBuilt reads it
const path = require('path'), tree = process.argv[2], R = (p) => require(path.join(tree, p));
const D = R('src/core/document.js'), { extend } = R('src/core/extend.js'), A = R('src/core/adapter.js'), NC = R('src/core/turnby_nocheck.scratch.js');
const DEG = Math.PI / 180, r = (x) => x * DEG;
const lead = extend(D.createDoc('d'), { length: 300, family: 'bowl', first: { w: 33 } });
const TURNS = [{ from: 112, deg: -78 }, { from: 176, deg: 0 }, { from: 224, deg: 67 }, { from: 256, deg: 0.001 }];
const marks = [112, 144, 176, 224, 256], tg = [27, 9, -20, -26, 0];
for (const variant of ['with turns', 'straight (no turns)']) {
  const opts = { length: 356, bankShape: 'rounded', targets: { phi: r(22) }, transition: { phi: 112 }, ...(variant === 'with turns' ? { turnDeg: 0, changes: { turnDeg: TURNS } } : { changes: {} }) };
  opts.changes.phi = marks.map((f, k) => ({ from: f, target: r(tg[k]) }));
  const doc = variant === 'with turns' ? NC.extendCorner(lead, opts) : extend(lead, { ...opts, bankCheck: false });
  const P = doc.pieces[1], fn = A.bankPlan(doc)[1].fn;
  console.log(`== ${variant}: built bank function ${fn ? 'present (rounded by the adapter)' : 'none (built as the document)'}`);
  if (!fn) continue;
  let worst = { d: 0, s: 0 };
  const rows = [];
  for (let s = 0; s <= 356; s += 2) { const dv = (fn(s) - D.channelValue(P, 'phi', s)) / DEG; if (Math.abs(dv) > Math.abs(worst.d)) worst = { d: dv, s }; if (s % 16 === 0) rows.push(`${s}:${dv.toFixed(2)}`); }
  console.log(`  built − document every 16 m (deg): ${rows.join(' ')}`);
  console.log(`  worst ${worst.d.toFixed(2)}° at ${worst.s} m of the piece (measured ${340 + worst.s})`);
  marks.forEach((F, k) => { const end = k + 1 < marks.length ? marks[k + 1] : 356; let w = 0, at = 0; for (let t = Math.max(0, F - 250); t <= F; t += 0.5) { const x = Math.abs(fn(t) - D.channelValue(P, 'phi', t)) / DEG; if (x > w) { w = x; at = t; } }
    console.log(`  change ${k + 1} (from ${F}): worst |built − doc| in its look-back [${Math.max(0, F - 250)}, ${F}] = ${w.toFixed(2)}° at ${at} m (bar 0.5°)`); });
}
