// saves264.js (pane E, L264 read, the librarian's item 3): his documents, from COPIES only: every track and every undo step (present, past, future) of every sidecar,
// in each copy set given. For each document that parses and is open: the head's width slope. For EVERY open document whose head width is NOT level, and for the
// first open track whose head is level (brushed at its head here with the app's brush, +1.37 at end-5, r 20, to make one that is not): one Extend of 100 m with
// nothing typed, through the core and through the shell with the panel's extendOptions, on BOTH trees. Compared: the pieces already there (before and after, and
// between the trees), and the new piece. Nothing is named: documents are numbered (set, file number in name order, step).
// usage: node saves264.js <baseTree> <tipTree> <out.json> <label>=<copies dir> ...
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const [BT, TT, OUT, ...setArgs] = process.argv.slice(2);
const load = (T) => { T = path.resolve(T); return { D: require(path.join(T, 'src/core/document.js')), extend: require(path.join(T, 'src/core/extend.js')).extend,
  createCoreShell: require(path.join(T, 'app/core/coreshell.js')).createCoreShell, extendOptions: require(path.join(T, 'app/core/panel.js')).extendOptions }; };
const B = load(BT), Tp = load(TT);
const h = (x) => crypto.createHash('sha256').update(typeof x === 'string' ? x : JSON.stringify(x)).digest('hex').slice(0, 12);
const BLANK = { length: 100, turn: '', climb: '', bank: '', width: '', cup: '', edge: '', edgeR: '', widthR: '', start: '', tube: '' };
const out = { docs: 0, open: 0, closed: 0, refused: 0, headSlopes: [], notLevel: [], extended: [] };
async function extendBoth(text, label, brushIt) {
  const row = { label, brushed: !!brushIt };
  for (const [tn, X] of [['base', B], ['tip', Tp]]) {
    try {
      const s = await X.createCoreShell({ autosaveMs: 0 }); s.commitDoc(X.D.parse(text));
      if (brushIt) { const L = s.getState().history.present.pieces.reduce((a, P) => a + (P.length || 0), 0); s.beginBrush({ mode: 'rate', channel: 'w', s0: L - 5, r: 20 }); s.brushTo(1.37); s.endBrush(); row[`${tn}BrushMsg`] = (s.getState().message || '').slice(0, 80); }
      const d0 = s.getState().history.present, head = X.D.endState(d0).w; row.head = head;
      const core = X.extend(d0, { length: 100 }), corePiece = core.pieces.at(-1);
      s.extend(X.extendOptions({ ...BLANK, head: s.headState() })); const d1 = s.getState().history.present, P = d1.pieces.at(-1);
      row[tn] = { before: h(d0.pieces), placedSameCore: h(core.pieces.slice(0, -1)) === h(d0.pieces), placedSamePanel: h(d1.pieces.slice(0, -1)) === h(d0.pieces), laid: d1 !== d0, msg: d1 === d0 ? s.getState().message : null,
        corePiece: h(corePiece), panelPiece: h(P), endW: X.D.pieceEnd(P).w, joint: X.D.jointProblem(X.D.pieceEnd(d0.pieces.at(-1)), P, X.D.kindOf(d0.pieces.at(-1))), coreEndW: X.D.pieceEnd(corePiece).w };
    } catch (e) { row[tn] = { refused: `${e.code || e.name}: ${String(e.message).slice(0, 100)}` }; }
  }
  out.extended.push(row);
}
(async () => {
  let firstLevelTrack = null;
  for (const a of setArgs) {
    const i = a.indexOf('='), set = a.slice(0, i), dir = a.slice(i + 1), files = fs.readdirSync(dir).filter((f) => /\.t180(track|undo)$/.test(f)).sort();
    for (let n = 0; n < files.length; n++) {
      const f = files[n], raw = fs.readFileSync(path.join(dir, f), 'utf8');
      const steps = f.endsWith('.t180track') ? [['track', raw]] : (() => { try { const u = JSON.parse(raw); return [['present', u.present], ...(u.past || []).map((t, k) => [`past${k}`, t]), ...(u.future || []).map((t, k) => [`future${k}`, t])].filter(([, t]) => typeof t === 'string'); } catch (e) { return []; } })();
      for (const [step, text] of steps) {
        out.docs++; let d; try { d = Tp.D.parse(text); } catch (e) { out.refused++; continue; }
        if (d.closed) { out.closed++; continue; }
        out.open++; const head = Tp.D.endState(d); const m = head && head.w ? head.w.m : null; const label = `${set} #${n + 1} ${step}`;
        out.headSlopes.push(m);
        if (m !== 0 && m !== null) { out.notLevel.push({ label, w: head.w }); await extendBoth(text, label, false); }
        else if (!firstLevelTrack && step === 'track') firstLevelTrack = { text, label };
      }
    }
  }
  if (firstLevelTrack) await extendBoth(firstLevelTrack.text, `${firstLevelTrack.label}, brushed at its head here`, true);
  out.headSlopesSummary = { level: out.headSlopes.filter((m) => m === 0).length, notLevel: out.headSlopes.filter((m) => m !== 0 && m !== null).length, noWidth: out.headSlopes.filter((m) => m === null).length };
  delete out.headSlopes;
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1)); console.log(JSON.stringify({ docs: out.docs, open: out.open, closed: out.closed, refused: out.refused, ...out.headSlopesSummary, extended: out.extended.length }));
})().catch((e) => { console.error('saves264 failed:', e); process.exit(1); });
