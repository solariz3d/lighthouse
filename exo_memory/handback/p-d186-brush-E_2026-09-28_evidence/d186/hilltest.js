// D186 (pane E): B's HILL TEST as sealed (d185_registration_amendment-2, A2-4), run on the PROTOTYPE (./proto: offset channels
// h, l in copies of A's document/extend/adapter + src/core/offset.js). 12 cases: Δh ∈ {+5, −5} × s₀ at 25/50/75% × r ∈ {20, 100},
// on generated track 0, OPEN, no close. Rules 1–6 as written; W⁺ = W widened by 2 local knot spans of the BRUSHED document.
// The call: brush(doc, { mode: 'hill', s0, r, delta: Δh }).
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'pane E: D186 hill test on the prototype' });
const path = require('path'), P = path.join(__dirname, process.argv[2] || 'proto');
const D = require(path.join(P, 'src/core/document.js')), S = require(path.join(P, 'src/core/sculpt.js')), { toPath } = require(path.join(P, 'src/core/adapter.js'));
const H = require(path.join(P, 'test/core_helpers.js'));
const BASE = H.docFrom(H.gen()[0]), OLD = toPath(BASE).path.samples, LEN = OLD.at(-1).s, LENM = toPath(BASE).path.lengthM;
const F8 = ['pos', 'T', 'L', 'U', 'kvec', 'roll', 'bankG', 'grade'];
const same = (a, b) => (Array.isArray(a) ? a.length === b.length && a.every((v, i) => Object.is(v, b[i])) : Object.is(a, b));
const out = []; let pass = 0;
for (const dh of [5, -5]) for (const frac of [0.25, 0.5, 0.75]) for (const r of [20, 100]) {
  const s0 = frac * LEN, name = `Δh ${dh > 0 ? '+' : ''}${dh} at ${frac * 100}% (s₀ ${s0.toFixed(0)}), r ${r}`, fail = [];
  let res; try { res = S.brush(BASE, { mode: 'hill', s0, r, delta: dh }); } catch (e) { out.push(`FAIL  ${name}: the call refused: ${e.message}`); continue; }
  const doc = res.doc, off = S.pieceOffsets(doc), lo = s0 - r, hi = s0 + r;
  let h = 0; doc.pieces.forEach((Q, p) => { if (Q.type !== 'road') return; const t = [0, ...Q.knots, Q.length]; for (let k = 0; k + 1 < t.length; k++) if (off[p] + t[k + 1] >= lo && off[p] + t[k] <= hi) h = Math.max(h, t[k + 1] - t[k]); });
  const loP = lo - 2 * h, hiP = hi + 2 * h, pm = toPath(doc).path, NEW = pm.samples;
  if (NEW.length !== OLD.length) fail.push(`sample count ${NEW.length} vs ${OLD.length}`);
  let up = 0, down = 0; NEW.forEach((x, i) => { const o = OLD[i]; const bad = F8.some((f) => !same(x[f], o[f])); if (bad && x.s < loP) up++; if (bad && x.s > hiP) down++; });
  if (up) fail.push(`rule 1: ${up} upstream samples differ`); if (down) fail.push(`rule 2: ${down} downstream samples differ`);
  let best = -Infinity, at = NaN; NEW.forEach((x, i) => { if (x.s < lo || x.s > hi) return; const v = (x.pos[1] - OLD[i].pos[1]) * Math.sign(dh); if (v > best) { best = v; at = x.s; } });
  if (!(best >= 0.9 * Math.abs(dh) && best <= 1.1 * Math.abs(dh))) fail.push(`rule 3: peak ${best.toFixed(4)} m`); if (!(Math.abs(at - s0) <= r / 2)) fail.push(`rule 3: peak at ${at.toFixed(1)}, ${Math.abs(at - s0).toFixed(1)} m from s₀`);
  let other = 0; doc.pieces.forEach((Q, p) => { if (Q.type !== 'road') return; for (const c of D.CHANNELS) { if (c === 'h') continue; if (!same(Q.channels[c], BASE.pieces[p].channels[c])) other++; } });
  if (other) fail.push(`rule 4: ${other} channel arrays differ outside h`);
  const chv = (s) => { let p = off.findIndex((o, i) => s >= o && (i === off.length - 1 || s < off[i + 1])); return D.channelAt(doc.pieces[p], 'h', Math.min(s - off[p], doc.pieces[p].length)); };
  let steep = 0; for (let s = lo; s <= hi; s += 0.5) steep = Math.max(steep, Math.abs(chv(s).d1));
  const d = 1e-4; for (const e of [lo, hi, loP, hiP]) { const f = (s) => chv(s).v, jump = Math.abs(f(e + d) - f(e - d)) - Math.abs(chv(e).d1) * 2 * d, sl = Math.abs((f(e + 2 * d) - f(e + d)) / d - (f(e - d) - f(e - 2 * d)) / d);
    if (jump >= 1e-9 * Math.abs(dh) + 1e-15) fail.push(`rule 5: value jump at ${e.toFixed(1)}`); if (sl >= 1e-4 * steep + 1e-12) fail.push(`rule 5: slope jump ${sl.toExponential(1)} at ${e.toFixed(1)}`); }
  if (Math.abs(pm.lengthM - LENM) > 1e-6) fail.push(`rule 6: length ${pm.lengthM} vs ${LENM}`);
  if (!fail.length) pass++;
  out.push(`${fail.length ? 'FAIL' : 'PASS'}  ${name}: radius used ${res.radiusUsed.toFixed(1)}, peak ${best.toFixed(4)} m at ${at.toFixed(1)}, W⁺ ±${(r + 2 * h).toFixed(1)}${fail.length ? ' · ' + fail.join('; ') : ''}`);
}
out.push(`HILL TEST: ${pass} of 12`);
console.log(out.join('\n'));
