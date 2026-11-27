// sculpt260.js (pane A, L260): his saved tracks on L, from COPIES (neutral names; his folder is not read here), under one tree's Sculpt bank drag and bank brush.
// Per track (opened by the app's own shell.open, its sidecar beside it):
//   every road piece k: Sculpt on, piece k selected, a bank drag of +10 (beginSculpt / sculptTo / endSculpt, as the handle drives it), its middle before and after,
//   the shell's message; then Undo, so each drag starts from the track as opened (the document after Undo is checked to be the opened one)
//   one bank brush of -10 (rate, r = half the middle road piece) at that piece's middle, Sculpt off: the document's sha256 after
// usage: node sculpt260.js <tree> <copies dir> <out.json>
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const T = path.resolve(process.argv[2]), DIR = path.resolve(process.argv[3]), OUT = path.resolve(process.argv[4]);
const D = require(path.join(T, 'src/core/document.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
const SC = require(path.join(T, 'src/core/sculpt.js'));
const DEG = Math.PI / 180, sha = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16), r6 = (x) => (Number.isFinite(x) ? +x.toFixed(6) : x);

async function open(alias, text, undo) {
  const mem = { ['eq-' + alias]: text }, side = undo === null ? {} : { ['eq-' + alias]: undo };
  const storage = { openDoc: async (k) => mem[k], openUndo: async (k) => (k in side ? side[k] : null), saveDoc: async () => {}, saveUndo: async () => {}, listDocs: async () => [], docSavedAt: async () => null,
    backupDoc: async () => {}, listBackups: async () => [], clearAutosave: async () => {}, openAutosave: async () => null, saveAutosave: async () => {} };
  const s = await createCoreShell({ storage, autosaveMs: 0 }); await s.open(alias); return s;
}
async function one(alias) {
  const text = fs.readFileSync(path.join(DIR, `${alias}.t180track`), 'utf8'), up = path.join(DIR, `${alias}.t180undo`), undo = fs.existsSync(up) ? fs.readFileSync(up, 'utf8') : null;
  try { D.parse(text); } catch (e) { return { track: alias, bad: String(e && (e.code || e.message)).slice(0, 40) }; }
  const s = await open(alias, text, undo), d0 = s.getState().history.present, opened = D.serialize(d0), r = { track: alias, pieces: d0.pieces.length, drags: [], maxAbsMiddle: 0 };
  s.setSculpt(true);
  for (let k = 0; k < d0.pieces.length; k++) {
    if (d0.pieces[k].type !== 'road') continue;
    s.selectPiece(k); const si = s.sculptInfo(); if (!si) { r.drags.push({ k, skip: 'no sculpt info' }); continue; }
    const before = si.values.phi; r.maxAbsMiddle = Math.max(r.maxAbsMiddle, Math.abs(before));
    s.beginSculpt({ channel: 'phi' }); s.sculptTo(10 * DEG); s.endSculpt();
    const msg = s.getState().message, after = s.sculptInfo() ? s.sculptInfo().values.phi : null, changed = s.getState().history.present !== d0;
    r.drags.push({ k, before: r6(before), after: r6(after), msg: msg ? String(msg).slice(0, 80) : null, doc: sha(D.serialize(s.getState().history.present)) });
    if (changed) { s.undo(); if (D.serialize(s.getState().history.present) !== opened) { r.undoMismatch = k; break; } }
  }
  s.setSculpt(false);
  const offs = SC.pieceOffsets(d0), mids = d0.pieces.map((P, i) => (P.type === 'road' ? i : -1)).filter((i) => i >= 0), m = mids[Math.floor(mids.length / 2)];
  if (m !== undefined) { const P = d0.pieces[m]; s.beginBrush({ mode: 'rate', channel: 'phi', s0: offs[m] + P.length / 2, r: P.length / 2 }); s.brushTo(-10 * DEG); s.endBrush(); r.brush = { piece: m, msg: s.getState().message ? String(s.getState().message).slice(0, 80) : null, doc: sha(D.serialize(s.getState().history.present)) }; }
  r.maxAbsMiddle = r6(r.maxAbsMiddle);
  return r;
}
(async () => {
  const names = fs.readdirSync(DIR).filter((f) => f.endsWith('.t180track')).map((f) => f.replace(/\.t180track$/, '')).sort(), out = [];
  for (const a of names) { try { out.push(await one(a)); } catch (e) { out.push({ track: a, error: String(e && e.message || e).slice(0, 200) }); } }
  fs.writeFileSync(OUT, JSON.stringify({ tree: path.basename(T), head: require('child_process').execSync('git rev-parse --short=7 HEAD', { cwd: T }).toString().trim(), tracks: out }, null, 1));
  console.log(`${path.basename(T)}: ${out.length} tracks, ${out.reduce((n, r) => n + (r.drags ? r.drags.length : 0), 0)} drags`);
})().catch((e) => { console.error(e); process.exit(1); });
