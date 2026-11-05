// joint.js <repo> <track copy>: is p2 itself changed by laying a next piece (core extend), or only its segments (adapter)? And does a straight-banked p2 do the same?
'use strict';
const path = require('path'), fs = require('fs'), R = process.argv[2], T = process.argv[3], req = (p) => require(path.join(R, p));
const { createCoreShell } = req('app/core/coreshell.js'), TB = req('src/core/turnby.js'), A = req('src/core/adapter.js'), D = req('src/core/document.js');
(async () => {
  const store = { openDoc: async () => fs.readFileSync(T, 'utf8'), listDocs: async () => ['eq-turntest2'] };
  const s = await createCoreShell({ storage: store, brushFn: null, autosaveMs: 0 }); await s.open('turntest2');
  const doc = s.getState().history.present, next = TB.extendCorner(doc, { length: 100, targets: {} });
  console.log('p2 identical in the candidate document:', JSON.stringify(doc.pieces[1]) === JSON.stringify(next.pieces[1]));
  const P2 = doc.pieces[1]; console.log('p2 phi at the end:', D.channelAt(P2, 'phi', P2.length).v.toFixed(6), 'rate', ((D.channelAt(P2, 'phi', P2.length).v - D.channelAt(P2, 'phi', P2.length - 2).v) / 2).toExponential(3));
  const segA = A.toSegments ? A.toSegments(doc) : null, segB = A.toSegments ? A.toSegments(next) : null;
  if (segA) { let k = 0; const a = segA.segments || segA, b = segB.segments || segB; for (; k < a.length; k++) if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) break; console.log('adapter toSegments: placed', a.length, 'first differing', k < a.length ? k : 'none'); }
  // the same piece with the bank reaching its value early (ending at a roll rate of 0): does a next piece still change it?
  const s2 = await createCoreShell({ brushFn: null, autosaveMs: 0 }); s2.extend({ length: 1000, family: 'bowl' });
  for (const [name, o] of [['linear bank to the end (his)', { length: 1000, turnDeg: -90, targets: { phi: 1.5437437233889846, c: 15.5, w: 31 } }], ['bank, no turn', { length: 1000, targets: { phi: 1.5437437233889846 } }], ['no bank, -90', { length: 1000, turnDeg: -90, targets: {} }]]) {
    const s3 = await createCoreShell({ brushFn: null, autosaveMs: 0 }); s3.extend({ length: 1000, family: 'bowl' }); s3.extend(o);
    const d3 = s3.getState().history.present, n3 = TB.extendCorner(d3, { length: 100, targets: {} }), a3 = s3.getState().resolved.segments, b3 = s3.candidate({ length: 100, targets: {} }).segments;
    let k = 0; for (; k < a3.length; k++) if (JSON.stringify(a3[k]) !== JSON.stringify(b3[k])) break;
    console.log(`${name}: p-last identical ${JSON.stringify(d3.pieces[1]) === JSON.stringify(n3.pieces[1])}; placed segments ${a3.length}, first differing ${k < a3.length ? k : 'none'}`);
  }
})().catch((e) => { console.log('ERR', e.stack || e); process.exit(1); });
