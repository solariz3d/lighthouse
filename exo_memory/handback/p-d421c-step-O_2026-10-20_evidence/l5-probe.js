'use strict';
// D421c part 4 (O): is mutant L5 (the channel SET not compared) equivalent? Only if an unflagged piece never reads an optional channel it may lack. On a tube made by
// Extend's targets after a legacy lead (no cup or edge flag): for each optional channel, the tube's segments without the array against with it at other values.
//   node l5-probe.js <tree>
const TREE = process.argv[2];
const D = require(`${TREE}/src/core/document.js`), AD = require(`${TREE}/src/core/adapter.js`), { isDeepStrictEqual } = require('util');
const { createCoreShell } = require(`${TREE}/app/core/coreshell.js`);
(async () => {
  const s = await createCoreShell({}); s.extend({ length: 300, family: 'bowl' }); s.extend({ length: 300, transition: 40, targets: { t: 120 } });
  const d = s.getState().history.present, P = d.pieces[1];
  console.log('flags: edge', !!P.edge, 'cup', !!P.cup, 'tube', !!P.tube);
  for (const ch of Object.keys(D.OPTIONAL)) {
    const without = { ...P.channels }; delete without[ch];
    const dA = { ...d, pieces: [d.pieces[0], { ...P, channels: without }] };
    let validA = 'yes'; try { D.checkDoc(dA); } catch (e) { validA = e.code; }
    const n = P.channels[ch].length, other = P.channels[ch].map((v, k) => (k >= 2 && k < n - 2 ? v + 0.5 : v));
    const dB = { ...d, pieces: [d.pieces[0], { ...P, channels: { ...P.channels, [ch]: other } }] };
    let validB = 'yes'; try { D.checkDoc(dB); } catch (e) { validB = e.code; }
    const same = validA === 'yes' && validB === 'yes' ? isDeepStrictEqual(AD.toSegments(dA).filter((g) => g.id === P.id), AD.toSegments(dB).filter((g) => g.id === P.id)) : null;
    console.log(JSON.stringify({ channel: ch, without_valid: validA, other_values_valid: validB, segments_same: same }));
  }
})().catch((e) => { console.error(e); process.exit(1); });
