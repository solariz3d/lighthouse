'use strict';
// q1: over probe5's drawn lists at the 5 m floor (seed 11, 160 lists, as drawn 3): refusals, the room each names, whether a smaller move lays, and whether a finer knot grid lays the list as asked
const D = require('./t/src/core/document.js'), { extend } = require('./t/src/core/extend.js');
const DEG = Math.PI / 180, LEN = 300;
const lead = extend(D.createDoc('p'), { length: 300, family: 'bowl', first: { w: 33 } });
function drawn(gap, count, seed = 11) {
  const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648), out = [];
  for (let k = 0; k < count; k++) {
    const tr = +(20 + rnd() * 80).toFixed(1), nm = 1 + Math.floor(rnd() * 3), marks = []; let at = tr;
    for (let i = 0; i < nm; i++) { at = +(at + gap + rnd() * 40).toFixed(1); if (at > LEN) break; marks.push({ at, target: (rnd() * 60 - 30) * DEG }); }
    out.push({ first: { at: tr, target: (rnd() * 60 - 30) * DEG }, marks });
  }
  return out;
}
const opts = (L, extra = {}) => ({ length: LEN, targets: { phi: L.first.target }, transition: { phi: L.first.at }, bankShape: 'flow', through: { phi: L.marks }, ...extra });
const lays = (L, extra) => { try { extend(lead, opts(L, extra)); return true; } catch (e) { if (e instanceof D.CoreError) return false; throw e; } };
const moved = (L, k, dm) => k === 0 ? { first: { at: +(L.first.at + dm).toFixed(4), target: L.first.target }, marks: L.marks.map((x) => ({ at: +(x.at + dm).toFixed(4), target: x.target })) }
  : { first: L.first, marks: L.marks.map((x, j) => (j >= k - 1 ? { at: +(x.at + dm).toFixed(4), target: x.target } : x)) };
const t = { n: 0, laid: 0, refused: 0, kinds: {}, roomNamed: 0, roomLays: 0, smallerLays: 0, knot5Lays: 0, knot2Lays: 0, noRoom: 0 }, ex = { smaller: [], knot: [] };
for (const L of drawn(5, 160)) {
  t.n++;
  let err = null; try { extend(lead, opts(L)); t.laid++; continue; } catch (e) { if (!(e instanceof D.CoreError)) { console.log('UNTYPED', e.message); continue; } err = e; }
  t.refused++;
  const kind = /joint/.test(err.message) ? 'joint' : /fewer free/.test(err.message) ? 'mark' : /built/.test(err.message) ? 'built' : /no curve/.test(err.message) ? 'range' : 'other'; t.kinds[kind] = (t.kinds[kind] || 0) + 1;
  const desc = [L.first, ...L.marks].map((m) => `${m.at}:${(m.target / DEG).toFixed(1)}`).join(' ');
  if (lays(L, { knotM: 5 })) { t.knot5Lays++; if (ex.knot.length < 5) ex.knot.push(desc); }
  if (lays(L, { knotM: 2.5 })) t.knot2Lays++;
  const m = /(?:mark (\d+)|first target) at ([\d.]+) m needs at least ([\d.]+) m after .*?\(it has ([\d.]+) m\)/.exec(err.message);
  if (!m) { t.noRoom++; continue; }
  t.roomNamed++;
  const k = m[1] ? +m[1] : 0, dm = +(+m[3] - +m[4]).toFixed(4);
  if (lays(moved(L, k, dm))) t.roomLays++;
  for (let d = 0.25; d < dm - 1e-9; d += 0.25) if (lays(moved(L, k, d))) { t.smallerLays++; if (dm - d > 1 + 1e-9) { t.over1 = (t.over1 || 0) + 1; (t.overList = t.overList || []).push(`${desc} | named +${dm}, lays at +${d}`); } if (ex.smaller.length < 6) ex.smaller.push(`${desc} | named +${dm} m on ${k ? 'mark ' + k : 'first'}, lays at +${d}`); break; }
}
console.log(JSON.stringify(t, null, 0)); for (const k of Object.keys(ex)) console.log(k, '\n  ' + ex[k].join('\n  '));
