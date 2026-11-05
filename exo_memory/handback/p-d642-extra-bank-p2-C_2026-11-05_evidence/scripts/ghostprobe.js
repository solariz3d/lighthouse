// ghostprobe.js <repo> <track copy>: his save opened in the core shell; the next piece's ghost built as the preview builds it (trackmodel update + ghostFor of
// shell.candidate), for the fields his panel showed (1000, -90 corner, bank 88.45, cup 15.5, width 31), and a plain straight next piece for comparison
'use strict';
const path = require('path'), fs = require('fs'), R = process.argv[2], T = process.argv[3], req = (p) => require(path.join(R, p));
const { createCoreShell } = req('app/core/coreshell.js'), TM = req('app/preview/trackmodel.js'), D = req('src/core/document.js');
(async () => {
  const store = { openDoc: async () => fs.readFileSync(T, 'utf8'), listDocs: async () => ['eq-turntest2'] };
  const s = await createCoreShell({ storage: store, brushFn: null, autosaveMs: 0 }); await s.open('turntest2');
  const st = s.getState(); console.log('opened:', st.message, '| pieces', st.history.present.pieces.length);
  const tm = TM.createTrackModel(); tm.update({ segments: st.resolved.segments, closed: false, start: st.resolved.start });
  const DEG = Math.PI / 180;
  for (const [name, o] of [['his fields', { length: 1000, turnDeg: -90, targets: { phi: 88.45 * DEG, c: 15.5, w: 31 } }], ['plain straight', { length: 100, targets: {} }]]) {
    try { const c = s.candidate(o); const g = tm.ghostFor(c); console.log(`${name}: ghost OK, ${g.batches.length} batches`); }
    catch (e) { console.log(`${name}: ghost REFUSED: ${e.message}`); }
  }
  // where the candidate and the placed track part: the first segment that differs
  const placed = st.resolved.segments, cand = s.candidate({ length: 100, targets: {} }).segments;
  let k = 0; for (; k < placed.length; k++) if (JSON.stringify(placed[k]) !== JSON.stringify(cand[k])) break;
  console.log(`placed ${placed.length} segments; candidate ${cand.length}; first differing segment index ${k < placed.length ? k : 'none'}`);
  if (k < placed.length) { const a = placed[k], b = cand[k]; for (const key of Object.keys(a)) if (JSON.stringify(a[key]) !== JSON.stringify(b[key])) console.log(`  segment ${k} key ${key}: placed ${JSON.stringify(a[key]).slice(0, 120)} | candidate ${JSON.stringify(b[key]).slice(0, 120)}`); }
})().catch((e) => { console.log('ERR', e.stack || e); process.exit(1); });
