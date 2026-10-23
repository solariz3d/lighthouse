'use strict';
// D447 Part 2 (O): one COPY of his track, closed by the page's own press (app/core/closejob.js runCloseBest, what Close runs) in one tree, measured, and exported
// to a FAKE AC root. Inputs are read only; nothing is written outside <out dir> (the script refuses his tracks folder and any content\tracks path).
//   node measure.js <tree> <track file> <reopen|open> <label> <out dir>
//     reopen: the saved closed lap reopened at its seam (closed: false, the same pieces), so the press takes the near path; open: an open lap as saved
// Prints one JSON line: the route and its report; over every curved station of the closed lap (|κh| > 1/600 m) the stations leaning out (against the horizontal
// turn, D443), the mean lean into the turn, the same over the UPRIGHT pieces only; the peak side load at the design speed (the validator's f = v²κ⃗ + g·ŷ across
// the road); the gap at the seam (close.js residual); how many non-upright pieces kept their bank channel byte for byte; and the export's outcome.
const fs = require('fs'), path = require('path');
const [TREE, FILE, MODE, LABEL, OUT] = process.argv.slice(2), T = path.resolve(TREE);
if (/content[\\/]+tracks/i.test(OUT) || /com\.solariz3d\.t180-track-builder/i.test(OUT)) throw new Error(`refusing to write into ${OUT}`);
require(path.join(__dirname, '..', '..', '..', 'consonance', 'tools', 'heavy-run.js')).hold({ cmd: `O D447 measure ${LABEL} (a copy, close + export to a fake AC root; not a timing run)`, tree: T });
const D = require(path.join(T, 'src/core/document.js')), AD = require(path.join(T, 'src/core/adapter.js')), CJ = require(path.join(T, 'app/core/closejob.js'));
const { residual } = require(path.join(T, 'src/core/close.js')), { MACH6, G } = require(path.join(T, 'src/validate/limits.js')), DEG = Math.PI / 180, v = MACH6.designSpeedKmh / 3.6;
(async () => {
  const saved = D.parse(fs.readFileSync(FILE, 'utf8')), open = MODE === 'reopen' ? D.checkDoc({ ...saved, closed: false }) : saved;
  const up0 = D.valuesAt(open.pieces[0], 0).phi, isUp = (P) => P.type === 'road' && P.channels.phi.every((x) => Math.abs(x - up0) <= 5 * DEG);
  const t0 = Date.now(), r = CJ.runCloseBest({ doc: open }), closeS = (Date.now() - t0) / 1000;
  const out = { label: LABEL, tree: path.basename(T), mode: MODE, closeS: +closeS.toFixed(1), converged: r.converged, route: r.route || null, report: String(r.report).slice(0, 200) };
  if (!r.converged) { console.log(JSON.stringify(out)); return; }
  const doc = r.doc, { segments, path: p } = AD.toPath(doc, { step: 2 }), upIds = new Set(open.pieces.filter(isUp).map((P) => P.id));
  let n = 0, outN = 0, sum = 0, nU = 0, sumU = 0, side = 0;
  for (const q of p.samples) {
    const g = segments[q.seg]; if (g.kind === 'gap') continue; const k = q.kvec;
    side = Math.max(side, Math.abs((v * v * k[0] * q.L[0] + (v * v * k[1] + G) * q.L[1] + v * v * k[2] * q.L[2]) / G));
    const kh = Math.hypot(k[0], k[2]); if (kh < 1 / 600) continue;
    const l = Math.asin(Math.max(-1, Math.min(1, (q.U[0] * k[0] + q.U[2] * k[2]) / kh))) / DEG; n++; sum += l; if (l < -5) outN++;
    if (upIds.has(g.id)) { nU++; sumU += l; }
  }
  const nonUp = open.pieces.map((P, i) => i).filter((i) => !isUp(open.pieces[i]));
  const changed = open.pieces.map((P, i) => [P, doc.pieces[i]]).filter(([P, Q]) => Q && P.channels.phi.length === Q.channels.phi.length && P.channels.phi.some((x, j) => x !== Q.channels.phi[j])).map(([P, Q]) => `${P.id} ${(Math.max(...P.channels.phi.map((x, j) => Math.abs(Q.channels.phi[j] - x))) / DEG).toFixed(1)}°`);
  const kept = nonUp.filter((i) => doc.pieces[i] && doc.pieces[i].channels.phi.length === open.pieces[i].channels.phi.length && doc.pieces[i].channels.phi.every((x, j) => x === open.pieces[i].channels.phi[j])).length;
  Object.assign(out, { curved: n, out: outN, meanLeanDeg: +(sum / n).toFixed(1), uprightCurved: nU, uprightMeanLeanDeg: nU ? +(sumU / nU).toFixed(1) : null, peakSideG: +side.toFixed(2),
    seamGapMm: +(residual(doc).gapM * 1000).toFixed(3), nonUpright: nonUp.length, nonUprightPhiByteEqual: kept, phiChanged: changed, newPieces: doc.pieces.length - open.pieces.length });
  // the export, as the page builds it (the shell opens the document, buildExport), to <out dir>/<label>/; untextured
  const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { makeExporter } = require(path.join(T, 'app/export/export.js'));
  const NAME = `D447 ${LABEL}`, text = D.serialize({ ...doc, name: NAME }), ex = await makeExporter(async (rel) => fs.readFileSync(path.join(T, rel), 'utf8'));
  const s = await createCoreShell({ brushFn: null, exporter: ex, autosaveMs: 0, storage: { openDoc: async () => text } }); await s.open(NAME);
  try {
    const t1 = Date.now(), e = s.buildExport({}), dir = path.join(OUT, LABEL);
    for (const f of e.folders) for (const x of f.files) { const fp = path.join(dir, f.folder, x.path); fs.mkdirSync(path.dirname(fp), { recursive: true }); fs.writeFileSync(fp, Buffer.from(x.bytes)); }
    const w = (e.result.warnings || []).map(String);
    out.export = { refused: null, s: +((Date.now() - t1) / 1000).toFixed(1), files: e.folders.reduce((a, f) => a + f.files.length, 0), warnings: w.length,
      rayGap: w.filter((x) => /ray|gap/i.test(x)).map((x) => x.slice(0, 160)), nearTouch: w.filter((x) => /near|touch|under the road|over another/i.test(x)).map((x) => x.slice(0, 160)), all: w.map((x) => x.slice(0, 120)) };
  } catch (err) { out.export = { refused: err.code || 'error', message: String(err.message).slice(0, 300), reds: (err.red || []).slice(0, 8).map((x) => `${x.reason} ${x.s0}-${x.s1}`) }; }
  console.log(JSON.stringify(out));
})().catch((e) => { console.error('ERR', e.stack); process.exit(1); });
