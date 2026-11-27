// f2mm.js (pane B, L258 F2): what the panel sends for a right width he wants 3 mm off the width, under the rule built (the panel: typed as the width is shown means
// wd 0), on a width that shows all its decimals (19.1) and on one that does not (19.1346, shown 19.13). Then the same through Extend: where the right side ends.
// usage: node f2mm.js <tree>
'use strict';
const path = require('path');
const T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const BLANK = { length: 100, turn: '', climb: '', bank: '', width: '', cup: '', edge: '', edgeR: '', widthR: '', start: '', tube: '' };
const r6 = (x) => +x.toFixed(6);
for (const [w, cases] of [[19.1, [['19.103', '']]], [19.1346, [['19.133', ''], ['19.1376', ''], ['19.133', '19.13']]]]) {
  const d = extend(D.createDoc('mm'), { length: 120, first: { w }, targets: { kh: 0 } });
  for (const [widthR, width] of cases) {
    const o = extendOptions({ ...BLANK, widthR, width, head: { w } }), e = D.pieceEnd(extend(d, o).pieces[1]);
    console.log(`width ${w} (shown ${Math.round(w * 100) / 100}); typed right width ${widthR}${width ? `, width ${width}` : ', width left as shown'}: wd sent ${r6(o.targets.wd)}; the piece ends width ${r6(e.w.v)}, right width ${r6(e.w.v + e.wd.v)} (${r6(e.wd.v * 1000)} mm off its width)`);
  }
}
