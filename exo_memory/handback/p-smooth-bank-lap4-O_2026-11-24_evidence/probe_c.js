// LAP 4 probe (c), on the patched copy probe_b.js leaves in ../tmp/probe-b: for each list still refused with knots added (variant argv[2]), the room today's search names
// (whole call) against the least move that lays scanned up by the metre and by the half metre (non-monotone safe on that grid), with each one's trials and time.
// usage: node probe_c.js <uniform|local|none>
'use strict';
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const path = require('path'), P = path.join(__dirname, '../tmp/probe-b');
if (process.argv[2] !== 'none') process.env.FLOW_REFINE = process.argv[2];
const D = require(path.join(P, 'src/core/document.js')), { extend } = require(path.join(P, 'src/core/extend.js'));
const DEG = Math.PI / 180, LEN = 300, lead = extend(D.createDoc('p'), { length: 300, family: 'bowl', first: { w: 33 } });
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
const lays = (L) => { try { extend(lead, opts(L, { roomSearch: false })); return true; } catch (e) { if (e instanceof D.CoreError) return false; throw e; } };
const moved = (L, k, dm) => k === 0 ? { first: { at: +(L.first.at + dm).toFixed(4), target: L.first.target }, marks: L.marks.map((x) => ({ at: +(x.at + dm).toFixed(4), target: x.target })) }
  : { first: L.first, marks: L.marks.map((x, j) => (j >= k - 1 ? { at: +(x.at + dm).toFixed(4), target: x.target } : x)) };
const ms = (f) => { const t0 = process.hrtime.bigint(); const r = f(); return [r, Number(process.hrtime.bigint() - t0) / 1e6]; };
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? +s[Math.floor(s.length / 2)].toFixed(1) : null; }, mx = (a) => (a.length ? +Math.max(...a).toFixed(1) : null);
const desc = (L) => [L.first, ...L.marks].map((m) => `${m.at}:${(m.target / DEG).toFixed(1)}`).join(' ');
for (const gap of [5, 20]) {
  const out = { refused: 0, named: 0, noRoom: 0, sameAsMetre: 0, over1: 0, over5: 0, under: 0, wholeMs: [], scanMs: [], scanTrials: [], halfLess: 0 }, worst = [];
  for (const L of drawn(gap, 160)) {
    if (lays(L)) continue;
    out.refused++;
    const [err, w] = ms(() => { try { extend(lead, opts(L)); return null; } catch (e) { return e; } }); out.wholeMs.push(w);
    const m = /(?:mark (\d+)|first target) at ([\d.]+) m needs at least ([\d.]+) m after .*?\(it has ([\d.]+) m\)/.exec(err.message);
    if (!m) { out.noRoom++; continue; }
    out.named++;
    const k = m[1] ? +m[1] : 0, named = +(+m[3] - +m[4]).toFixed(4), top = LEN - L.marks.concat([L.first]).reduce((a, x) => Math.max(a, x.at), 0);
    // the least by the metre for the SAME stretch k, scanned up from 0 (no monotone assumption on that grid)
    let trials = 0; const [least, s] = ms(() => { for (let d = 0; d <= top + 1e-9; d += 1) { trials++; if (lays(moved(L, k, d))) return d; } return null; });
    out.scanMs.push(s); out.scanTrials.push(trials);
    let half = null; for (let d = 0.5; least !== null && d < least; d += 1) if (lays(moved(L, k, d))) { half = d; break; }
    if (half !== null) out.halfLess++;
    if (least === null) { out.under++; continue; }
    if (Math.abs(least - named) < 1e-9) out.sameAsMetre++; else if (least > named) out.under++;
    if (named - least > 1 + 1e-9) out.over1++; if (named - least > 5 + 1e-9) out.over5++;
    worst.push({ d: named - least, line: `named +${named}, least by the metre +${least}${half !== null ? `, +${half} lays` : ''}` });
  }
  worst.sort((a, b) => b.d - a.d);
  console.log(`gap ${gap} (${process.argv[2]}): ${out.refused} refused, ${out.named} name a room (${out.noRoom} none); the named room is the metre's least in ${out.sameAsMetre}, over-asks > 1 m in ${out.over1}, > 5 m in ${out.over5}; a half metre below the least lays in ${out.halfLess}`);
  console.log(`  whole call (today's search): median ${med(out.wholeMs)} ms, max ${mx(out.wholeMs)}; the metre scan of the named stretch alone: median ${med(out.scanMs)} ms, max ${mx(out.scanMs)}, trials median ${med(out.scanTrials)}, max ${mx(out.scanTrials)}`);
  console.log('  worst: ' + worst.slice(0, 4).map((x) => x.line).join('; '));
}
