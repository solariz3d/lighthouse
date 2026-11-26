// L250: which installed layouts carry another layout's AI line, and how open lines classify. Prints indices and numbers only, never a name.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const { readAiShape, ribbonOf } = require('C:/Consonance/t180-wt-l243/src/reference/ribbon.js');
const AC = 'C:/Program Files (x86)/Steam/steamapps/common/assettocorsa/content/tracks';
const rows = require('../l243/survey.json');
const parseLen = (s) => { if (s === null || s === undefined || s === 'unparsed') return null; const t = String(s).trim().toLowerCase().replace(/,/g, ''); const m = /^([\d.]+)\s*(km|m)?$/.exec(t); if (!m) return null; let v = +m[1]; if (m[2] === 'km' || (!m[2] && v < 100)) v *= 1000; return v; };
const tracks = [...new Set(rows.map((r) => r.track))];
const out = { lines: 0, refused: 0, sameAsAnother: 0, groups: [], offUi: [], open: 0, closed: 0, closingRatios: [] };
const byTrack = new Map();
for (const r of rows.filter((x) => x.ai)) {
  out.lines++;
  const b = fs.readFileSync(path.join(AC, r.track, r.layout, 'ai', 'fast_lane.ai'));
  let rib = null, sh = null; try { sh = readAiShape(b); rib = ribbonOf(sh); } catch (e) { out.refused++; continue; }
  const P = sh.points.map((p) => p.pos), sp = []; for (let k = 1; k < P.length; k++) sp.push(Math.hypot(P[k][0] - P[k - 1][0], P[k][1] - P[k - 1][1], P[k][2] - P[k - 1][2])); sp.sort((a, c) => a - c);
  const close = Math.hypot(P[P.length - 1][0] - P[0][0], P[P.length - 1][1] - P[0][1], P[P.length - 1][2] - P[0][2]);
  out.closingRatios.push({ t: tracks.indexOf(r.track), closed: rib.closed, gapM: +close.toFixed(1), medSpacingM: +sp[sp.length >> 1].toFixed(2), ratio: +(close / sp[sp.length >> 1]).toFixed(1), lengthM: Math.round(rib.lengthM) });
  rib.closed ? out.closed++ : out.open++;
  const shapeEnd = b.length - sh.gridBytes, h = crypto.createHash('sha256').update(b.subarray(0, shapeEnd)).digest('hex').slice(0, 12);
  const ui = parseLen(r.uiLen), off = ui ? rib.lengthM / ui - 1 : null;
  if (!byTrack.has(r.track)) byTrack.set(r.track, []);
  byTrack.get(r.track).push({ l: rows.filter((x) => x.track === r.track).indexOf(r), h, lengthM: Math.round(rib.lengthM), uiM: ui ? Math.round(ui) : null, offPct: off === null ? null : +(off * 100).toFixed(1) });
}
for (const [t, ls] of byTrack) {
  const hs = new Map(); for (const x of ls) hs.set(x.h, (hs.get(x.h) || 0) + 1);
  for (const x of ls) { x.same = hs.get(x.h) - 1; if (x.same) out.sameAsAnother++; if (x.offPct !== null && Math.abs(x.offPct) > 5) out.offUi.push({ track: tracks.indexOf(t), layoutIdx: x.l, lengthM: x.lengthM, uiM: x.uiM, offPct: x.offPct, sameAsAnotherLayout: x.same }); }
  if (ls.length > 1) out.groups.push({ track: tracks.indexOf(t), layouts: ls.length, distinct: hs.size });
}
out.closingRatios.sort((a, c) => a.ratio - c.ratio);
console.log(JSON.stringify(out, null, 1));
