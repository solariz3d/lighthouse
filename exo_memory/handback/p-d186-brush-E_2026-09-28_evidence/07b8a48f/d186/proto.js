// D186 (pane E): PROTOTYPE ONLY, in ./proto (a copy of ./tree). Patches COPIES of A's document.js, extend.js and adapter.js so
// the document carries the offset channels h and l (0 by default, quantised 1e-4 m) and the adapter calls src/core/offset.js
// after buildPath. It exists to run B's hill test (amendment 2, A2-4) end to end before A decides. Nothing in the repo is changed.
const fs = require('fs'), path = require('path');
const P = path.join(__dirname, 'proto');
const rep = (f, a, b) => { const p = path.join(P, f); let s = fs.readFileSync(p, 'utf8'); if (s.includes('\r\n')) { a = a.replace(/\n/g, '\r\n'); b = b.replace(/\n/g, '\r\n'); } if (s.split(a).length !== 2) throw new Error(`${f}: not once: ${a.slice(0, 60)}`); fs.writeFileSync(p, s.split(a).join(b)); };
rep('src/core/document.js', "const CHANNELS = Object.freeze(['kh', 'kv', 'phi', 'w', 'r']);", "const CHANNELS = Object.freeze(['kh', 'kv', 'phi', 'w', 'r', 'h', 'l']);");
rep('src/core/document.js', "const DEC = Object.freeze({ m: 4, kh: 9, kv: 9, phi: 9, w: 4, r: 6, rad: 9 });", "const DEC = Object.freeze({ m: 4, kh: 9, kv: 9, phi: 9, w: 4, r: 6, h: 4, l: 4, rad: 9 });");
rep('src/core/extend.js', "const f = { kh: 0, kv: 0, phi: 0, w: WIDTHS[fam], r: RATES[fam], ...(first || {}) };", "const f = { kh: 0, kv: 0, phi: 0, w: WIDTHS[fam], r: RATES[fam], h: 0, l: 0, ...(first || {}) };");
rep('src/core/adapter.js', "  return { segments, path };\n}", `  // PROTOTYPE (pane E, D186): the offset channels, applied after the geometry (src/core/offset.js)
  const off = new Map(); let acc = 0; for (const g of segments) { if (!off.has(g.id)) off.set(g.id, acc); acc += g.length; }
  const byId = new Map(doc.pieces.map((P) => [P.id, P]));
  const at = (x) => { const g = segments[x.seg], P = byId.get(g.id); if (!P || P.type !== 'road') return null; const s = Math.min(Math.max(x.s - off.get(g.id), 0), P.length);
    const h = D.channelAt(P, 'h', s), l = D.channelAt(P, 'l', s); return { h: h.v, dh: h.d1, l: l.v, dl: l.d1 }; };
  const { offsetSamples } = require('./offset.js');
  const samples = offsetSamples(path.samples, (s, x) => at(x));
  return { segments, path: samples === path.samples ? path : { ...path, samples } };
}`);
// offset.js's at(s) gets the sample too, for its segment
rep('src/core/offset.js', "const o = samples.map((x) => { const v = at(x.s);", "const o = samples.map((x) => { const v = at(x.s, x);");
console.log('prototype patched');
