'use strict';
// q3: drawn lists on the instrumented copy (t2): how flowInside ends, whether a laid bank meets its marks and stays inside on the document and the built road
// (read independently here), and the time of each extend. Usage: node q3.js <gap> <count> <seed> <numericTransition 0|1> <maxAbsDeg> <maxMarks>
const D = require('./t2/src/core/document.js'), { extend } = require('./t2/src/core/extend.js'), RP = require('./t2/test/roll_profile.js');
const [gap, count, seed0, numeric, amp, maxM] = process.argv.slice(2).map(Number);
const DEG = Math.PI / 180, LEN = 300, LEAD = 300;
const lead = extend(D.createDoc('p'), { length: LEAD, family: 'bowl', first: { w: 33 } });
let seed = seed0; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const lists = []; for (let k = 0; k < count; k++) {
  const tr = +(20 + rnd() * 80).toFixed(1), nm = 1 + Math.floor(rnd() * maxM), marks = []; let at = tr;
  for (let i = 0; i < nm; i++) { at = +(at + gap + rnd() * 40).toFixed(1); if (at > LEN) break; marks.push({ at, target: (rnd() * 2 * amp - amp) * DEG }); }
  lists.push({ first: { at: tr, target: (rnd() * 2 * amp - amp) * DEG }, marks });
}
const out = { laid: 0, refused: {}, untyped: [], gi: {}, marksMissed: [], docOut: [], roadOut: [], tLaid: [], tRefused: [] };
for (const L of lists) {
  const o = { length: LEN, targets: { phi: L.first.target }, transition: numeric ? L.first.at : { phi: L.first.at }, bankShape: 'flow', through: { phi: L.marks } };
  global.__gi = []; const t0 = performance.now(); let doc = null, err = null;
  try { doc = extend(lead, o); } catch (e) { err = e; }
  const dt = performance.now() - t0;
  for (const r of global.__gi) { const k = r.split(':')[0]; out.gi[k] = (out.gi[k] || 0) + 1; if (k === 'ok') out.gi.maxIt = Math.max(out.gi.maxIt || 0, +r.split(':')[1]); }
  const desc = [L.first, ...L.marks].map((m) => `${m.at}:${(m.target / DEG).toFixed(1)}`).join(' ');
  if (err) {
    if (!(err instanceof D.CoreError)) { out.untyped.push(desc + ' | ' + err.message); continue; }
    const kind = /joint/.test(err.message) ? 'joint' : /fewer free/.test(err.message) ? 'mark' : /as built|road as built/.test(err.message) ? 'built' : /no curve/.test(err.message) ? 'range' : 'other:' + err.message.slice(0, 60);
    out.refused[kind] = (out.refused[kind] || 0) + 1; out.tRefused.push(dt); continue;
  }
  out.laid++; out.tLaid.push(dt);
  const P = doc.pieces[1], v0 = D.channelValue(doc.pieces[0], 'phi', LEAD) / DEG, all = [{ at: 0, deg: v0 }, L.first, ...L.marks].map((m) => ({ at: m.at, deg: m.deg !== undefined ? m.deg : m.target / DEG }));
  // marks met: every mark but the last exactly (a row), the last within FLOW_SNAP_M after
  all.slice(1).forEach((m, j, a) => { const v = D.channelValue(P, 'phi', m.at) / DEG, last = j === a.length - 1, v2 = last ? D.channelValue(P, 'phi', Math.min(LEN, m.at + 1)) / DEG : v;
    if (Math.min(Math.abs(v - m.deg), Math.abs(v2 - m.deg)) > 0.01) out.marksMissed.push(`${desc} | mark ${j} ${m.deg.toFixed(2)} read ${v.toFixed(3)}`); });
  const hi = Math.max(...all.map((m) => m.deg)) + 0.5, lo = Math.min(...all.map((m) => m.deg)) - 0.5;
  const bad = (read) => { for (let s = 0; s <= LEN; s += 0.1) { const v = read(s); if (v > hi + 1e-9 || v < lo - 1e-9) return `${v.toFixed(3)} at ${s.toFixed(1)}`; const j = all.findIndex((m) => m.at > s); if (j > 0 && all[j - 1].deg * all[j].deg > 0 && v * all[j - 1].deg < -1e-6) return `wrong way ${v.toFixed(4)} at ${s.toFixed(1)}`; } return null; };
  const b1 = bad((s) => D.channelValue(P, 'phi', s) / DEG); if (b1) out.docOut.push(desc + ' | ' + b1);
  const B = RP.builtBank(doc, 0.5); const b2 = bad((s) => RP.near(B, LEAD + s).v); if (b2) out.roadOut.push(desc + ' | ' + b2);
}
const st = (a) => { if (!a.length) return '-'; const s = [...a].sort((x, y) => x - y); return `n ${a.length} med ${s[s.length >> 1].toFixed(0)} p95 ${s[Math.floor(s.length * 0.95)].toFixed(0)} max ${s[s.length - 1].toFixed(0)} ms`; };
console.log(JSON.stringify({ args: process.argv.slice(2).join(' '), laid: out.laid, refused: out.refused, gi: out.gi, untyped: out.untyped.length, marksMissed: out.marksMissed.length, docOut: out.docOut.length, roadOut: out.roadOut.length, tLaid: st(out.tLaid), tRefused: st(out.tRefused) }));
for (const k of ['untyped', 'marksMissed', 'docOut', 'roadOut']) out[k].slice(0, 4).forEach((x) => console.log('  ' + k + ': ' + x));
