// probe.js (pane B, D232): independent of A's code where it can be. (1) every candidate read's own `end`, read straight from the JSON; (2) the widths
// recomputed with MY percentile (nearest rank) and a linear one, against src/doc/widths.json; (3) the drop-down's entries and the tube wording, from
// app/core/widthlike.js.   node probe.js <tree>
'use strict';
const fs = require('fs'), path = require('path'), T = path.resolve(process.argv[2]), R = path.join(T, 'reads');
const W = JSON.parse(fs.readFileSync(path.join(T, 'src/doc/widths.json'), 'utf8')), { LAYOUTS } = require(path.join(T, 'tools/widths.cjs')), WL = require(path.join(T, 'app/core/widthlike.js'));
const nearest = (s, q) => s[Math.max(0, Math.ceil(q * s.length) - 1)], linear = (s, q) => { const h = (s.length - 1) * q, lo = Math.floor(h), hi = Math.ceil(h); return s[lo] + (s[hi] - s[lo]) * (h - lo); };
const ends = {}, mismatch = [], rows = [];
for (const [file, name] of LAYOUTS) {
  const r = JSON.parse(fs.readFileSync(path.join(R, `${file}.read.json`), 'utf8')); ends[name] = r.end;
  const s = r.stations.map((x) => x.width).filter(Number.isFinite).sort((a, b) => a - b), e = W.tracks.find((t) => t.name === name);
  const mine = [nearest(s, 0.5), nearest(s, 0.1), nearest(s, 0.9)], lin = [linear(s, 0.5), linear(s, 0.1), linear(s, 0.9)].map((x) => +x.toFixed(2));
  rows.push({ name, end: r.end, stations: s.length, nearest: mine.join('/'), linear: lin.join('/'), file: e ? `${e.median_m}/${e.p10_m}/${e.p90_m}` : '(not in file)' });
  if (r.end === 'closed' && (!e || e.stations !== s.length || e.median_m !== lin[0] || e.p10_m !== lin[1] || e.p90_m !== lin[2])) mismatch.push(name);
  if (r.end !== 'closed' && e) mismatch.push(`${name} (unclosed but in the file)`);
}
const closed = Object.entries(ends).filter(([, v]) => v === 'closed').map(([k]) => k), unclosed = Object.entries(ends).filter(([, v]) => v !== 'closed').map(([k, v]) => `${k} (${v})`);
const flat = WL.entries(false), tube = WL.entries(true), offered = flat.slice(1).map((e) => e.label.split(',')[0]);
const aurora = flat.find((e) => /^Aurora/.test(e.label)), auroraT = tube.find((e) => /^Aurora/.test(e.label));
console.log(JSON.stringify({
  candidates: LAYOUTS.length, closed: closed.length, unclosed, fileTracks: W.tracks.length, closedSetEqualsFile: closed.slice().sort().join('|') === W.tracks.map((t) => t.name).sort().join('|'), mismatch,
  offered: offered.length, offeredUnclosed: offered.filter((n) => ends[n] !== 'closed'), placeholder: [flat[0].label, tube[0].label],
  aurora: aurora && aurora.label, auroraValue: aurora && aurora.value, auroraTube: auroraT && auroraT.label, across34: (34 / Math.PI).toFixed(3),
  tubeNote38: WL.tubeNote(38), across38: (38 / Math.PI).toFixed(3), tubeLabelsAllAcrossEqMedianOverPi: tube.slice(1).every((e, i) => e.label.endsWith(`a tube ${(W.tracks[i].median_m / Math.PI).toFixed(1)} m across`) && e.label.includes(`${W.tracks[i].median_m} m round`)),
}, null, 1));
console.log(rows.map((r) => `${r.name.padEnd(28)} ${String(r.end).padEnd(7)} n ${String(r.stations).padStart(5)}  nearest ${r.nearest.padEnd(10)} linear ${r.linear.padEnd(12)} file ${r.file}`).join('\n'));
