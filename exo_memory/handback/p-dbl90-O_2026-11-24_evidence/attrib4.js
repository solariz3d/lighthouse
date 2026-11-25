// attrib.js: does each bank change, by ITS OWN effect, pull the built bank back over the hold? Built bank with changes 1..k against 1..k-1, in [mark − 250, mark];
// and after the mark, the built bank within the document's range there (bankAsBuilt's second test), and at the change's end within 0.5° of the document
const path = require('path'), tree = process.argv[2], R = (p) => require(path.join(tree, p));
const D = R('src/core/document.js'), { extend } = R('src/core/extend.js'), A = R('src/core/adapter.js'), NC = R('src/core/turnby_nocheck.scratch.js');
const DEG = Math.PI / 180, r = (x) => x * DEG, TOL = 0.5;
const lead = extend(D.createDoc('d'), { length: 300, family: 'bowl', first: { w: 33 } });
const TURNS = [{ from: 112, deg: -78 }, { from: 176, deg: 0 }, { from: 224, deg: 67 }, { from: 256, deg: 0.001 }];
const marks = [112, 144, 224, 256], tg = [27, -20, -26, 0];
const lay = (n, hold = false) => NC.extendCorner(lead, { length: 356, bankShape: "rounded", targets: { phi: r(22) }, transition: { phi: 112 }, turnDeg: 0,
  changes: { turnDeg: TURNS, ...(n ? { phi: marks.slice(0, n).map((f, k) => ({ from: f, target: hold && k === n - 1 ? (k ? r(tg[k - 1]) : r(22)) + 1e-7 : r(tg[k]) })) } : {}) } });
const built = (doc) => { const fn = A.bankPlan(doc)[1].fn, P = doc.pieces[1]; return (s) => (fn ? fn(s) : D.channelValue(P, 'phi', s)); };
for (let k = 1; k <= marks.length; k++) {
  const dk = lay(k), dp = lay(k, true), bk = built(dk), bp = built(dp), P = dk.pieces[1], F = marks[k - 1], end = k < marks.length ? marks[k] : 356;
  let own = 0; for (let t = Math.max(0, F - 250); t <= F; t += 0.5) own = Math.max(own, Math.abs(bk(t) - bp(t)) / DEG);
  let lo = Infinity, hi = -Infinity; for (let t = F; t <= end; t += 0.5) { const x = D.channelValue(P, 'phi', t); lo = Math.min(lo, x); hi = Math.max(hi, x); }
  let out = 0; for (let t = F; t <= end; t += 0.5) { const b = bk(t); out = Math.max(out, (lo - b) / DEG, (b - hi) / DEG); }
  const atEnd = Math.abs(bk(end) - D.channelValue(P, 'phi', end)) / DEG;
  console.log(`change ${k} (${k === 1 ? 22 : tg[k - 2]} -> ${tg[k - 1]} over ${F}..${end}): its own effect before the mark ${own.toFixed(2)}°, out of range after ${Math.max(0, out).toFixed(2)}°, at its end ${atEnd.toFixed(2)}° (bar ${TOL}°)  ${own <= TOL && out <= TOL && atEnd <= TOL ? 'HOLDS' : 'FAILS'}`);
}
