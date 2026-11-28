// shellsave.js <treeA> <treeB> <copiesDir> <out.json>: pane C, L270 role 2, a check beside the bytes.js rule. bytes.js runs D.serialize(D.parse(text)), and
// src/core/document.js is the same file on c522ea6 and 9de0b18 (0 diff lines), so that check cannot differ between the two trees. This one goes through the
// shell, which the merge DID change (app/core/coreshell.js): each copied track is opened by the shell's own open() (its undo sidecar with it, from an
// in-memory storage holding the copies), then saved by the shell's own save(); then every Undo step back to the oldest and every Redo step forward to the
// newest, each followed by a save. Each save writes the track text and the sidecar text; their sha256 are compared between the trees, step for step, along with
// the shell's message and the number of past and future steps the open restored. A refusal compares by its message. His folder is never opened; no name is written out.
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const [, , TA, TB, DIR, OUT] = process.argv;
const sha = (t) => (typeof t === 'string' ? crypto.createHash('sha256').update(t).digest('hex') : null);
const files = fs.readdirSync(DIR).sort(), tracks = files.filter((f) => f.endsWith('.t180track'));
function storageOf(written) {
  const src = (name, ext) => { const p = path.join(DIR, name + ext); return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null; };
  return {
    openDoc: async (n) => { if (n in written.doc) return written.doc[n]; const t = src(n, '.t180track'); if (t === null) throw new Error('not found'); return t; },
    openUndo: async (n) => (n in written.undo ? written.undo[n] : src(n, '.t180undo')),
    saveDoc: async (n, t) => { written.doc[n] = t; written.log.push(['doc', sha(t)]); },
    saveUndo: async (n, t) => { written.undo[n] = t; written.log.push(['undo', sha(t)]); },
    listDocs: async () => tracks.map((f) => f.slice(0, -'.t180track'.length)),
    docSavedAt: async () => null, backupDoc: async () => 'b', saveAutosave: async () => {}, clearAutosave: async () => {}, openAutosave: async () => null,
  };
}
async function walk(T, file) {
  const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
  const written = { doc: {}, undo: {}, log: [] }, storage = storageOf(written);
  const s = await createCoreShell({ storage, autosaveMs: 0 });
  const full = file.slice(0, -'.t180track'.length), name = full.startsWith('eq-') ? full.slice(3) : null;
  if (name === null) return { opened: 'not a core track (no eq- prefix): the shell does not list it', steps: [] };
  await s.open(name);
  const st0 = s.getState();
  if (st0.name !== name) return { opened: `refused: ${st0.message}`, steps: [] };
  const rec = { opened: 'opened', note: st0.message || null, past: st0.history.past.length, future: st0.history.future.length, steps: [] };
  const step = async (what) => { written.log.length = 0; await s.save(name); const m = s.getState().message; rec.steps.push({ what, msg: m || null, writes: written.log.map((x) => x.join(':')) }); };
  await step('as opened');
  for (let k = 0; k < rec.past; k++) { s.undo(); await step(`undo ${k + 1}`); }
  for (let k = 0; k < rec.past + rec.future; k++) { s.redo(); await step(`redo ${k + 1}`); }
  return rec;
}
(async () => {
  const out = { tracks: [], totals: {} };
  let n = 0, same = 0, steps = 0, stepsSame = 0;
  for (const f of tracks) {
    n++; const a = await walk(path.resolve(TA), f), b = await walk(path.resolve(TB), f);
    const eq = JSON.stringify(a) === JSON.stringify(b); if (eq) same++;
    const k = Math.max(a.steps.length, b.steps.length); steps += k;
    for (let i = 0; i < k; i++) if (JSON.stringify(a.steps[i]) === JSON.stringify(b.steps[i])) stepsSame++;
    out.tracks.push({ n, same: eq, a: { opened: a.opened, note: a.note, past: a.past, future: a.future, saves: a.steps.length }, b: { opened: b.opened, note: b.note, past: b.past, future: b.future, saves: b.steps.length },
      firstDiffer: eq ? null : a.steps.findIndex((x, i) => JSON.stringify(x) !== JSON.stringify(b.steps[i])), aSteps: a.steps, bSteps: eq ? 'the same' : b.steps });
  }
  out.totals = { tracks: n, tracksSame: same, saves: steps, savesSame: stepsSame, opened: out.tracks.filter((t) => t.a.opened === 'opened').length, restoredPast: out.tracks.reduce((x, t) => x + (t.a.past || 0), 0) };
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out.totals));
  for (const t of out.tracks) console.log(t.n, t.same ? 'same' : `DIFFER at save ${t.firstDiffer}`, t.a.opened, 'past', t.a.past, 'future', t.a.future, 'saves', t.a.saves, t.a.note ? `note: ${t.a.note.slice(0, 90)}` : '');
})().catch((e) => { console.error('FATAL', e && e.stack || e); process.exitCode = 1; });
