// usage: node table.js   D643: the fork-against-fork table from the session's files (L = t180-e643L f2884fa, D = t180-e643D 376ddc2). Speed: each run's p95 (ms a move) per fork
// and drag, rolling and early; per run the fork's own rolling ÷ early ratio (the 2 × bar's reading) and D's rolling ÷ L's rolling; reported as the median of the three runs and
// the spread (min-max). Correctness: the hashes side by side and the walk's six cases side by side.
'use strict';
const fs = require('fs'), path = require('path'), S = __dirname;
const med = (a) => { const s = a.slice().sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; }, f2 = (x) => (Number.isFinite(x) ? x.toFixed(2) : '—');
const rows = fs.readFileSync(path.join(S, 'speed.jsonl'), 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
const get = (run, tree, drag, mode) => { const r = rows.find((x) => x.run === run && x.tree === tree && x.drag === drag && x.mode === mode); return r && r.r ? r.r.p95Ms : NaN; };
const out = [];
for (const drag of ['bank-back', 'into-the-hold', 'mark-slide']) {
  const runs = [...new Set(rows.filter((x) => x.drag === drag).map((x) => x.run))].sort();
  const per = runs.map((run) => { const Lr = get(run, 't180-e643L', drag, 'rolling'), Le = get(run, 't180-e643L', drag, 'early'), Dr = get(run, 't180-e643D', drag, 'rolling'), De = get(run, 't180-e643D', drag, 'early'); return { run, Lr, Le, Dr, De, Lx: Lr / Le, Dx: Dr / De, DoverL: Dr / Lr }; });
  const col = (k) => per.map((p) => p[k]).filter(Number.isFinite);
  out.push({ drag, runs: per.length, L_rolling_p95_ms: `${f2(med(col('Lr')))} (${f2(Math.min(...col('Lr')))}-${f2(Math.max(...col('Lr')))})`, D_rolling_p95_ms: `${f2(med(col('Dr')))} (${f2(Math.min(...col('Dr')))}-${f2(Math.max(...col('Dr')))})`,
    L_x_early: `${f2(med(col('Lx')))} (${f2(Math.min(...col('Lx')))}-${f2(Math.max(...col('Lx')))})`, D_x_early: `${f2(med(col('Dx')))} (${f2(Math.min(...col('Dx')))}-${f2(Math.max(...col('Dx')))})`,
    D_over_L_rolling: `${f2(med(col('DoverL')))} (${f2(Math.min(...col('DoverL')))}-${f2(Math.max(...col('DoverL')))})`, perRun: per.map((p) => `run ${p.run}: L ${f2(p.Lr)}/${f2(p.Le)} D ${f2(p.Dr)}/${f2(p.De)}`) });
}
const hL = JSON.parse(fs.readFileSync(path.join(S, 'hash-t180-e643L.json'), 'utf8')), hD = JSON.parse(fs.readFileSync(path.join(S, 'hash-t180-e643D.json'), 'utf8'));
const hashes = Object.keys(hL.tracks).map((k) => ({ track: k, samples: hL.tracks[k].samples, L: hL.tracks[k].sha256, D: hD.tracks[k] && hD.tracks[k].sha256, same: hD.tracks[k] && hL.tracks[k].sha256 === hD.tracks[k].sha256 }));
hashes.push({ track: `core answers (${hL.coreAnswers.asks} asks, ${hL.coreAnswers.spanHoldsTrue} hold)`, L: hL.coreAnswers.sha256, D: hD.coreAnswers.sha256, same: hL.coreAnswers.sha256 === hD.coreAnswers.sha256 });
const wL = JSON.parse(fs.readFileSync(path.join(S, 'walk-t180-e643L.json'), 'utf8')), wD = JSON.parse(fs.readFileSync(path.join(S, 'walk-t180-e643D.json'), 'utf8'));
const walks = wL.map((a, i) => { const b = wD[i]; return { case: a.case, L: `refused ${a.refused}, over 1.05 ${a.over105 ?? '—'}, over 1.0 ${a.overBar1}, worst ${a.worstPeak}, kept ${a.distinctKept ?? '—'}`, D: `refused ${b.refused}, over 1.05 ${b.over105 ?? '—'}, over 1.0 ${b.overBar1}, worst ${b.worstPeak}, kept ${b.distinctKept ?? '—'}`, same: JSON.stringify({ ...a }) === JSON.stringify({ ...b }) }; });
console.log(JSON.stringify({ speed: out, hashes, walks }, null, 1));
