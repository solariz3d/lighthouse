// runon.js (pane E, L270): after a grab at the head, Extend as shown: the new piece's l and h along it, by length. node runon.js <tree>
'use strict';
const path = require('path'), T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const BLANK = { turn: '', climb: '', bank: '', width: '', cup: '', edge: '', edgeR: '', widthR: '', start: '', tube: '' };
(async () => {
  for (const [nm, ch, s0, r] of [['lateral 2 at 1980 r60', 'lateral', 1980, 60], ['height 2 at 1980 r60', 'height', 1980, 60], ['lateral 2 at 1500 r200 (window short of head)', 'lateral', 1500, 200]]) {
    for (const len of [100, 300, 1000]) {
      const s = await createCoreShell({ autosaveMs: 0 }); s.extend({ family: 'bowl', length: 1000 }); s.extend({ family: 'bowl', length: 1000 });
      s.beginBrush({ mode: 'local', channel: ch, s0, r }); s.brushTo(2); s.endBrush();
      const d0 = s.getState().history.present, H = d0.pieces.at(-1), c = ch === 'lateral' ? 'l' : 'h', hv = D.channelAt(H, c, H.length);
      const o = extendOptions({ ...BLANK, length: len, head: s.headState() }); s.extend(o);
      const P = s.getState().history.present.pieces.at(-1);
      const at = (x) => +D.channelAt(P, c, x).v.toFixed(3);
      console.log(JSON.stringify({ nm, len, targets: Object.keys(o.targets || {}), head: { v: +hv.v.toFixed(4), m: +hv.d1.toFixed(5) }, along: [0, len / 4, len / 2, len].map((x) => [x, at(x)]), msg: s.getState().message }));
    }
  }
})();
