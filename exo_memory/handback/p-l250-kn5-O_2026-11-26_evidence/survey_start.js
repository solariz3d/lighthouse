// survey_start.js (pane O, L250, the start part): what a layout's kn5 says about where it starts, against its AI line where it has one. Read only,
// name-free (layout N in reference.rs list order is not reproduced here; layouts are numbered by models ini order, as survey_rules3.js).
// Dummies from tools/kn5.cjs readKn5 (kn5.cjs:30: every AC_ dummy, pos = its world matrix's translation, fwd = its third row, M[8..10]).
// For each layout: which of AC_START_0, AC_TIME_0_L, AC_TIME_0_R it has (and how many of each across its files); for layouts with an AI line too:
// the angle between START's fwd and the AI line's first direction, START's distance from the AI line's first point; the same for the time line's
// midpoint, its dummies' fwd, and the two directions across the gate (up x (R - L) and its opposite).
'use strict';
const fs = require('fs'), path = require('path');
const T = 'C:/Consonance/t180-wt-o-l250';
const { readKn5 } = require(T + '/tools/kn5.cjs');
const { readAiShape } = require(T + '/src/reference/ribbon.js');
const AC = 'C:/Program Files (x86)/Steam/steamapps/common/assettocorsa/content/tracks';
const deg = (a, b) => { const la = Math.hypot(a[0], a[2]), lb = Math.hypot(b[0], b[2]); if (!la || !lb) return null; const c = (a[0] * b[0] + a[2] * b[2]) / (la * lb); return +(Math.acos(Math.max(-1, Math.min(1, c))) * 180 / Math.PI).toFixed(1); };
const dist = (a, b) => +Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]).toFixed(1);
const cache = new Map(); const rows = []; let li = 0;
for (const t of fs.readdirSync(AC).sort()) {
  const td = path.join(AC, t); if (!fs.statSync(td).isDirectory()) continue;
  const lay = fs.readdirSync(td).filter((f) => /^models_(.*)\.ini$/i.test(f)).map((f) => f.replace(/^models_|\.ini$/gi, ''));
  for (const L of (lay.length ? lay : [''])) {
    li++;
    const ini = path.join(td, L ? `models_${L}.ini` : 'models.ini');
    const files = fs.existsSync(ini) ? [...fs.readFileSync(ini, 'utf8').matchAll(/^\s*FILE\s*=\s*(.+?)\s*$/gmi)].map((m) => m[1]) : [t + '.kn5'];
    const d = {};
    for (const f0 of files) {
      const f = path.join(td, f0); if (!fs.existsSync(f)) continue;
      if (!cache.has(f)) cache.set(f, readKn5(f).dummies);
      for (const x of cache.get(f)) { const k = x.name.toUpperCase(); if (/^AC_(START_0|TIME_0_L|TIME_0_R)$/.test(k)) (d[k] = d[k] || []).push(x); }
    }
    const S = d.AC_START_0, TL = d.AC_TIME_0_L, TR = d.AC_TIME_0_R;
    const r = { layout: li, start: S ? S.length : 0, timeL: TL ? TL.length : 0, timeR: TR ? TR.length : 0 };
    const aiF = path.join(td, L, 'ai', 'fast_lane.ai');
    let ai = null; try { const sh = readAiShape(fs.readFileSync(aiF)); const P = sh.points.map((q) => q.pos); ai = { p0: P[0], dir: [P[1][0] - P[0][0], 0, P[1][2] - P[0][2]] }; } catch (e) { /* no AI line, or one that does not read */ }
    r.ai = !!ai;
    if (ai && S) { r.startFwdVsAi = deg(S[0].fwd, ai.dir); r.startToAi0 = dist(S[0].pos, ai.p0); }
    if (TL && TR) {
      const l = TL[0].pos, rr = TR[0].pos, mid = [(l[0] + rr[0]) / 2, (l[1] + rr[1]) / 2, (l[2] + rr[2]) / 2], lr = [rr[0] - l[0], 0, rr[2] - l[2]];
      const acrossA = [-lr[2], 0, lr[0]];   // up x (R - L), with up = +y: (0,1,0) x (x,0,z) = (z, 0, -x)?  computed both ways below
      const upCross = [lr[2], 0, -lr[0]];   // (0,1,0) x (lx, 0, lz) = (1*lz - 0*0, 0*lx - 0*lz, 0*0 - 1*lx) = (lz, 0, -lx)
      r.gateWidth = +Math.hypot(lr[0], lr[2]).toFixed(1);
      if (ai) { r.timeMidToAi0 = dist(mid, ai.p0); r.timeLFwdVsAi = deg(TL[0].fwd, ai.dir); r.timeRFwdVsAi = deg(TR[0].fwd, ai.dir); r.upCrossRminusLVsAi = deg(upCross, ai.dir); r.oppositeVsAi = deg(acrossA, ai.dir); }
      if (S) { r.startFwdVsUpCross = deg(S[0].fwd, upCross); r.startToTimeMid = dist(S[0].pos, mid); }
    }
    rows.push(r);
  }
}
const n = (f) => rows.filter(f).length;
console.log(JSON.stringify({
  layouts: rows.length, withStart: n((r) => r.start), withTimeBoth: n((r) => r.timeL && r.timeR), timeOnly: n((r) => !r.start && r.timeL && r.timeR), neither: n((r) => !r.start && !(r.timeL && r.timeR)),
  noAi: n((r) => !r.ai), noAiWithStart: n((r) => !r.ai && r.start), noAiTimeOnly: n((r) => !r.ai && !r.start && r.timeL && r.timeR), noAiNeither: n((r) => !r.ai && !r.start && !(r.timeL && r.timeR)),
  moreThanOneStart: n((r) => r.start > 1), rows }, null, 0).replace(/\},\{/g, '},\n{'));
