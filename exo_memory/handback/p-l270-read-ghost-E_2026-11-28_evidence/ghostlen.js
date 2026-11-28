// ghostlen.js (pane E, L270): the next piece's ghost against placing, by piece length, after a sideways grab at the head. node ghostlen.js <tree>
'use strict';
const path = require('path'), T = path.resolve(process.argv[2]);
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { createTrackModel } = require(path.join(T, 'app/preview/trackmodel.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const BLANK = { turn: '', climb: '', bank: '', width: '', cup: '', edge: '', edgeR: '', widthR: '', start: '', tube: '' };
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
(async () => {
  for (const [ch, len] of [['lateral', 300], ['lateral', 1000], ['height', 1000]]) {
    const s = await createCoreShell({ autosaveMs: 0 }); s.extend({ family: 'bowl', length: 1000 }); s.extend({ family: 'bowl', length: 1000 });
    s.beginBrush({ mode: 'local', channel: ch, s0: 1980, r: 60 }); s.brushTo(2); s.endBrush();
    const tm = createTrackModel(); tm.update(s.getState().resolved);
    const o = extendOptions({ ...BLANK, length: len, head: s.headState() }), g = tm.ghostFor(s.candidate(o));
    s.extend(o); tm.update(s.getState().resolved);
    console.log(JSON.stringify({ ch, len, headMiss: +dist(g.head.pos, tm.path.head.pos).toFixed(4) }));
  }
})();
