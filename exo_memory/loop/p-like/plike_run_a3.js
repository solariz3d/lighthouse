// P-LIKE runner, AMENDMENT 3 form (B, D182): the fixed reader pinned (ca45c683), the width hint 0 when the export has none, and the
// cross-section SHAPE rows T13–T14 scored with the sealed plike_profile.js against the sealed profile targets.
// P-LIKE runner (B, D182). Follows exo_memory/loop/p-like_registration_2026-09-27.md (sha256 37d9ede8…) §2 and its
// amendment 1 (3097aa89…): one palette word per reader word, default font-by-shape and default tempo, ONLY the path handles
// set (length, heading, climb as pitch change, a jump's gap and drop); close; export with every check on; read back with the
// PINNED reader; score with the sealed plike_stats.js against the sealed target.
//   node plike_run.js <builder worktree> <track> <real read.json> <out dir>
// Writes <out>/<track>.run.json (every step and every refusal) and prints the score. Reads other authors' tracks only as
// the pinned read.json (numbers); writes nothing into any repository.
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const { execFileSync } = require('child_process');
const [WT, TRACK, REAL, OUT] = process.argv.slice(2);
if (!OUT) { console.error('usage: node plike_run.js <worktree> <track> <real read.json> <out dir>'); process.exit(2); }
const HERE = __dirname, LIVE_READER = 'C:/Users/nname/Desktop/t180-track-builder/tools/read_track.cjs', READER_SHA = 'ca45c683cf626214';
const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
if (!sha(LIVE_READER).startsWith(READER_SHA)) throw new Error('the pinned reader has changed; P-LIKE is not run on another reader');
fs.mkdirSync(OUT, { recursive: true });
if (path.resolve(OUT).toLowerCase().includes('t180-track-builder')) throw new Error('out dir inside the repository');
const D = require(path.join(WT, 'src/doc/index.js'));
const { closeLoop } = require(path.join(WT, 'src/doc/connector.js'));
const { exportTrack } = require(path.join(WT, 'src/export/fromwords.js'));
const M = require(path.join(WT, 'src/markers/index.js'));
const { WORDS, FONTS } = require(path.join(WT, 'src/doc/vocab.js'));
const log = { track: TRACK, worktree: WT, reader: READER_SHA, refused: [], notes: [] };
const done = (o) => { fs.writeFileSync(path.join(OUT, `${TRACK}.run.json`), JSON.stringify({ ...log, ...o }, null, 1)); console.log(JSON.stringify(o.score || o)); };

// ---- the real stretch: reader words with from ≤ 3000, and their stations
const real = JSON.parse(fs.readFileSync(REAL, 'utf8'));
const st = real.stations, words = real.text.filter((w) => w.from <= 3000);
const at = (d) => st.reduce((b, s) => (Math.abs(s.d - d) < Math.abs(b.d - d) ? s : b), st[0]);
const inWord = (w) => st.filter((s) => s.d >= w.from && s.d <= w.to && s.k != null);
log.realStartGrade = at(0).grade;

// ---- the export (registration §2 + amendment 2): every check on first; ONLY a validation RED is lifted, through the
// exporter's own code with validate() wrapped to empty its red list and lap verdict, and every lifted red is recorded
function liftedExportTrack(lifted) {
  const vp = require.resolve(path.join(WT, 'src/validate/index.js')), fp = require.resolve(path.join(WT, 'src/export/fromwords.js'));
  const V = require(vp), orig = V.validate;
  V.validate = (...a) => {
    const v = orig(...a);
    for (const x of v.red) lifted.push(`${x.reason} at ${(+x.s0).toFixed(0)}–${(+x.s1).toFixed(0)} m`);
    if (v.lap && v.lap.ok === false) lifted.push(`lap-proof: ${(v.lap.where || []).slice(0, 3).map((w) => `${w.reason} at ${(+w.s).toFixed(0)} m`).join(', ')}${(v.lap.where || []).length > 3 ? ' …' : ''}`);
    return { ...v, red: [], lap: v.lap ? { ...v.lap, ok: null } : v.lap };
  };
  delete require.cache[fp];
  const F = require(fp);
  V.validate = orig; delete require.cache[fp];
  return F.exportTrack;
}
function exportOnce(doc, dir, opts) {
  try { return { r: exportTrack(doc, { outDir: dir, ...opts }), exportable: true, lifted: [] }; } catch (e) {
    if (e.code !== 'RED') throw e;
    const lifted = [];
    fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
    const r = liftedExportTrack(lifted)(doc, { outDir: dir, ...opts });
    return { r, exportable: false, lifted, redMessage: e.message.slice(0, 300) };
  }
}

// ---- font by shape: the palette font the reader reads as that shape, placed as a default straight (registration §2)
function readBack(doc, name) {
  const dir = path.join(OUT, name); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const r = exportOnce(doc, dir, {}).r, folder = r.folders[0].dir || r.folders[0];
  const ui = JSON.parse(fs.readFileSync(path.join(folder, 'ui', 'ui_track.json'), 'utf8'));
  const len = parseFloat(ui.length), wid = parseFloat(ui.width);
  const out = execFileSync(process.execPath, [LIVE_READER, folder, String(len), String(Number.isFinite(wid) && wid >= 0 ? wid : 0)], { env: { ...process.env, READ_PROFILE: '1' }, maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'pipe'] });
  const f = path.join(OUT, `${name}.read.json`); fs.writeFileSync(f, out); return { file: f, exported: r };
}
const shapeOf = (s) => { const e1 = Math.min(s.edgeL, s.edgeR), e2 = Math.max(s.edgeL, s.edgeR); return e2 < 12 ? 'flat' : e1 > 25 ? (e2 > 70 ? 'pipe+' : 'pipe') : (e2 > 70 ? 'bowl+' : 'bowl'); };
const fontShape = {};
for (const font of Object.keys(FONTS)) {
  try {
    let d = D.createDoc(`plike-font-${font}`);
    d = D.appendWord(d, 'straight', { font }); d = D.editWord(d, 'w1', { handles: { length: 400 } });
    const c = closeLoop(d); if (!c.candidates.length) { fontShape[font] = { error: 'no close' }; continue; }
    const rb = readBack(c.candidates.slice().sort((a, b) => a.lengthM - b.lengthM)[0].doc, `font-${font}`);
    const S = JSON.parse(fs.readFileSync(rb.file, 'utf8')).stations.filter((s) => s.d >= 40 && s.d <= 360 && s.k != null && s.edgeL != null);
    const n = {}; for (const s of S) n[shapeOf(s)] = (n[shapeOf(s)] || 0) + 1;
    fontShape[font] = { shape: Object.entries(n).sort((a, b) => b[1] - a[1])[0]?.[0] || null, counts: n };
  } catch (e) { fontShape[font] = { error: `${e.code || ''} ${e.message}`.slice(0, 200) }; }
}
log.fontShape = fontShape;
const fontFor = (shape, word) => {
  const fonts = Object.entries(fontShape).filter(([, v]) => v.shape === shape.replace('+', '')).map(([f]) => f);
  const def = D.defaultWord(word).font;
  if (!fonts.length) { log.notes.push(`no palette font reads as ${shape}; ${word} keeps its default font ${def}`); return undefined; }
  return fonts.includes(def) ? def : fonts[0];
};

// ---- the palette words (registration §2 + amendment 1)
const plan = [];
for (let i = 0; i < words.length; i++) {
  const w = words[i], m = /^([a-z+]+)-(straight|sweep|turn|tight)([LR]?)(\/up|\/down)?(\^wall|\^inv)?$/.exec(w.w);
  const jm = /^JUMP\(([\d.]+)m gap, ([\d.]+)m (drop|up)\)$/.exec(w.w);
  if (jm) { plan.push({ word: 'jump', gap: +jm[1], drop: jm[3] === 'drop' ? +jm[2] : -jm[2], from: w.from, to: w.to }); continue; }
  if (!m) { log.notes.push(`unparsed reader word ${w.w}`); continue; }
  const roll = m[5] === '^inv' ? 'inversion' : m[5] === '^wall' ? 'wall-ride' : null;
  const last = plan[plan.length - 1];
  if (roll && last && last.word === roll) { last.to = w.to; last.src.push(w); continue; }   // a run of ^wall / ^inv → ONE word
  plan.push({ word: roll || m[2], shape: m[1], from: w.from, to: w.to, src: [w] });
}
for (const p of plan) {
  if (p.word === 'jump') continue;
  const S = st.filter((s) => s.d >= p.from && s.d <= p.to && s.k != null);
  p.length = p.to - p.from + 4;
  p.turn = S.reduce((a, s) => a + s.k * 4, 0);
  const g0 = S.length ? S[0].grade : 0, g1 = S.length ? S[S.length - 1].grade : 0;
  p.climb = Math.atan((g1 || 0) / 100) - Math.atan((g0 || 0) / 100);
  p.dir = p.turn >= 0 ? 'L' : 'R';
}
log.plan = plan.map(({ src, ...q }) => q);

// ---- build
let doc = D.createDoc(`plike-${TRACK}`);
for (const p of plan) {
  const before = doc;
  try {
    if (p.word === 'jump') {
      doc = D.appendWord(doc, 'jump');
      const id = doc.words[doc.words.length - 1].id;
      try { doc = D.editWord(doc, id, { handles: { gap: p.gap, drop: p.drop } }); } catch (e) { log.refused.push({ id, what: 'jump gap/drop', why: e.message.slice(0, 160) }); }
      continue;
    }
    const font = fontFor(p.shape, p.word);
    doc = D.appendWord(doc, p.word, { dir: p.dir, ...(font ? { font } : {}) });
    const id = doc.words[doc.words.length - 1].id, hs = D.handlesOf(p.word);
    const want = {}; if (hs.includes('length')) want.length = p.length; if (hs.includes('turn')) want.turn = p.turn; if (hs.includes('climb')) want.climb = p.climb;
    try { doc = D.editWord(doc, id, { handles: want }); } catch (e) {
      log.refused.push({ id, word: p.word, want, why: e.message.slice(0, 160) });
      for (const [k, v] of Object.entries(want)) { try { doc = D.editWord(doc, id, { handles: { [k]: v } }); } catch (e2) { log.refused.push({ id, handle: k, value: v, why: e2.message.slice(0, 120) }); } }
    }
  } catch (e) { log.refused.push({ at: p.from, word: p.word, why: `append: ${e.message}`.slice(0, 160) }); doc = before; }
}
log.words = doc.words.length;
try { D.resolve(doc); } catch (e) { return done({ result: 'NOT RUN', why: `the stretch does not resolve: ${e.message}`.slice(0, 300) }); }

// ---- close, anchor the line on w1, export, read back, score
let closed;
try { const c = closeLoop(doc); if (!c.candidates.length) return done({ result: 'NOT RUN', why: `no connector: ${c.reason || ''}`.slice(0, 300) }); closed = c.candidates.slice().sort((a, b) => a.lengthM - b.lengthM)[0].doc; } catch (e) { return done({ result: 'NOT RUN', why: `closeLoop threw: ${e.message}`.slice(0, 300) }); }
let rb;
try {
  // the start line on w1, 55 m in, so the pole (10 m behind it) is 45 m into w1, within its first 50 m (registration §2); the
  // pits behind the grid as defaultLayout places them: line − last slot (34 m) − one spacing (8 m) = 13 m into w1
  const markers = { version: 1, height: M.DEFAULTS.height, gateInsetM: M.DEFAULTS.gateInsetM, line: { word: 'w1', along: 55 },
    grid: { pattern: M.DEFAULTS.pattern, count: M.DEFAULTS.count, poleBackM: M.DEFAULTS.poleBackM, rowGapM: M.DEFAULTS.rowGapM, colGapM: M.DEFAULTS.colGapM, edits: {} },
    pits: { at: { word: 'w1', along: 13 }, count: M.DEFAULTS.pits, spacingM: M.DEFAULTS.pitSpacingM, u: 0, lane: null }, hotlap: { speedKmh: null }, sectors: [] };
  const dir = path.join(OUT, `${TRACK}-rebuild`); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  let ex; try { ex = exportOnce(closed, dir, { markers }); } catch (e) {
    if (e.code !== 'MARKERS' && e.code !== 'NO_START_STRAIGHT' && e.code !== 'BAD_LAYOUT') throw e;
    log.notes.push(`the w1 start line was refused (${e.code}): ${e.message.slice(0, 200)}; the default layout is used instead`);
    fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
    ex = exportOnce(closed, dir, {}); log.defaultLayout = true;
  }
  const r = ex.r; log.exportable = ex.exportable; log.liftedReds = ex.lifted; if (!ex.exportable) log.redMessage = ex.redMessage;
  const folder = r.folders[0].dir || r.folders[0], ui = JSON.parse(fs.readFileSync(path.join(folder, 'ui', 'ui_track.json'), 'utf8'));
  const out = execFileSync(process.execPath, [LIVE_READER, folder, String(parseFloat(ui.length)), String(Number.isFinite(parseFloat(ui.width)) && parseFloat(ui.width) >= 0 ? parseFloat(ui.width) : 0)], { env: { ...process.env, READ_PROFILE: '1' }, maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'pipe'] });
  fs.writeFileSync(path.join(OUT, `${TRACK}-rebuild.read.json`), out);
  rb = { markers: r.markers.filter((x) => /^AC_START_0$|^AC_TIME_0_L$/.test(x.name)) };
} catch (e) { return done({ result: 'NOT RUN', why: `export or read-back: ${e.code || ''} ${e.message}`.slice(0, 400) }); }
const stats = JSON.parse(execFileSync(process.execPath, [path.join(HERE, 'plike_stats.js'), path.join(OUT, `${TRACK}-rebuild.read.json`), '0', '3000'], { encoding: 'utf8' }));
const target = JSON.parse(fs.readFileSync(path.join(HERE, `${TRACK}.target.json`), 'utf8'));
// T1–T12 (registration §3), verbatim in numbers
const within = (x, lo, hi) => x >= lo && x <= hi;
const rel = (t, f) => [t * (1 - f), t * (1 + f)];
const T = [];
const row = (id, what, got, [lo, hi]) => T.push({ id, what, got, band: [+lo.toFixed(2), +hi.toFixed(2)], ok: within(got, lo, hi) });
row('T1', 'span m', stats.span_m, rel(target.span_m, 0.10));
row('T2', 'width median m', stats.width.median, rel(target.width.median, 0.20));
row('T3', 'width p90 m', stats.width.p90, rel(target.width.p90, 0.25));
T.push({ id: 'T4', what: 'dominant shape', got: stats.shapeDominant, band: target.shapeDominant, ok: stats.shapeDominant === target.shapeDominant });
for (const k of Object.keys(target.shapeShares)) row('T5', `shape share ${k} %`, stats.shapeShares[k], [target.shapeShares[k] - 15, target.shapeShares[k] + 15]);
row('T6', 'bank median °', stats.bank_up_deg.median, [target.bank_up_deg.median - 8, target.bank_up_deg.median + 8]);
row('T7', 'bank p90 °', stats.bank_up_deg.p90, [target.bank_up_deg.p90 - 12, target.bank_up_deg.p90 + 12]);
for (const k of Object.keys(target.turnShares)) row('T8', `turn share ${k} %`, stats.turnShares[k], [target.turnShares[k] - 15, target.turnShares[k] + 15]);
row('T9', 'curved radius median m', stats.radiusCurved_m.median || 0, [target.radiusCurved_m.median / 1.5, target.radiusCurved_m.median * 1.5]);
const tolY = Math.max(10, 0.25 * target.climb.range_m);
row('T10', 'net Δy m', stats.climb.netDy_m, [target.climb.netDy_m - tolY, target.climb.netDy_m + tolY]);
row('T11', 'height range m', stats.climb.range_m, [target.climb.range_m - Math.max(10, 0.25 * target.climb.range_m), target.climb.range_m + Math.max(10, 0.25 * target.climb.range_m)]);
const tolG = Math.max(2, 0.25 * target.climb.absGradeP90_pct);
row('T12', '|grade| p90 %', stats.climb.absGradeP90_pct, [target.climb.absGradeP90_pct - tolG, target.climb.absGradeP90_pct + tolG]);
// T13–T14 (amendment 3 §3): the cross-section shape, per side
const prof = JSON.parse(execFileSync(process.execPath, [path.join(HERE, 'plike_profile.js'), path.join(OUT, `${TRACK}-rebuild.read.json`), '0', '3000'], { encoding: 'utf8' }));
const ptarget = JSON.parse(fs.readFileSync(path.join(HERE, `${TRACK}.profile-target.json`), 'utf8'));
for (const k of ['L', 'R']) {
  for (const pt of ['q1', 'q2', 'q3', 'edge']) row('T13', `tilt ${k} ${pt} median °`, prof[k].psi_deg[pt].median, [ptarget[k].psi_deg[pt].p10 - 3, ptarget[k].psi_deg[pt].p90 + 3]);
  row('T14', `steepest tilt rate ${k} median °/m`, prof[k].maxTiltRate_degPerM.median, [-Infinity, 1.5 * ptarget[k].maxTiltRate_degPerM.median]);
  row('T14', `steepest tilt rate ${k} p90 °/m`, prof[k].maxTiltRate_degPerM.p90, [-Infinity, 1.5 * ptarget[k].maxTiltRate_degPerM.p90]);
}
log.profile = prof;
const failed = T.filter((t) => !t.ok).map((t) => `${t.id} ${t.what}`);
done({ result: failed.length ? 'FAIL' : 'PASS', score: { track: TRACK, result: failed.length ? 'FAIL' : 'PASS', exportable: log.exportable, liftedReds: (log.liftedReds || []).length, failed, rows: T }, stats, markers: rb.markers });
