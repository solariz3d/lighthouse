// mk154b.js: writes render154b.js = render154.js with its scenes replaced by run 2 (drag frames only). Same browser rules.
'use strict';
const fs = require('fs'), path = require('path');
let s = fs.readFileSync(path.join(__dirname, 'render154.js'), 'utf8');
const a = s.indexOf("    for (const tree of ['base', 'lab']) {"), b = s.indexOf("    say('page errors'");
if (a < 0 || b < 0) throw new Error('anchors');
const body = String.raw`    // RUN 2 (drag frames only): the press ON the 380 tick's right-edge stroke, seen at (922, 553) in run 1's l154-S-<tree>-tick380.png under the same pose
    for (const tree of ['base', 'lab']) {
      await fresh(tree);
      await setField('turn °', -90); await setField('bank °', 17.39); await sleep(1500); await camera('Free'); await sleep(2000);
      say(tree, 'S: extra turn made', await nudge('extra:turnDeg:0', 40), 'typed', await typeRow('extra turn', 180)); await sleep(1800);
      say(tree, 'S: extra bank made', await nudge('extra:bank:0', -30), 'typed', await typeRow('extra bank', -34.78)); await sleep(2200);
      say(tree, 'S state', JSON.stringify(await state()));
      await look(380, 380, 35, 45); await away(); await shot('l154-S-' + tree + '-tick380-run2');
      const c = { x: 921, y: 553 }, to = { x: 926, y: 404 };
      await mouse('mouseMoved', c.x, c.y); await sleep(300); await mouse('mousePressed', c.x, c.y, 1);
      for (let i = 1; i <= 12; i++) { await mouse('mouseMoved', c.x + (to.x - c.x) * i / 12, c.y + (to.y - c.y) * i / 12, 1); await sleep(60); }
      await sleep(1200); say(tree, 'mid-drag state', JSON.stringify(await state())); await shot('l154-S-' + tree + '-middrag');
      await mouse('mouseReleased', to.x, to.y); await sleep(1800); await away(); say(tree, 'after-release state', JSON.stringify(await state())); await shot('l154-S-' + tree + '-released');
      if (tree === 'lab') {
        say(tree, 'from back to 380', await typeRow('extra bank from', 380)); await sleep(1500);
        await look(300, 470, 70, 120); await away();
        const hs = await handles(), xs = hs.filter((x) => x.kind === 'extra:bank:0'); say(tree, 'extra bank handles (both pose)', JSON.stringify(xs.map((x) => [x.side, Math.round(x.px), Math.round(x.py)])));
        const xh = xs.sort((p, q) => Math.hypot(p.px - 726, p.py - 540) - Math.hypot(q.px - 726, q.py - 540))[0];
        if (xh) { const dx = 685 - 726, dy = 612 - 540, n = Math.hypot(dx, dy), ux = dx / n, uy = dy / n;
          await mouse('mouseMoved', xh.px, xh.py); await sleep(500); await mouse('mousePressed', xh.px, xh.py, 1);
          for (let i = 1; i <= 14; i++) { await mouse('mouseMoved', xh.px + ux * 50 * i / 14, xh.py + uy * 50 * i / 14, 1); await sleep(60); }
          await sleep(1200); say(tree, 'mid-slide state', JSON.stringify(await state())); await shot('l154-S-' + tree + '-midslide');
          await mouse('mouseReleased', xh.px + ux * 50, xh.py + uy * 50); await sleep(1500); say(tree, 'after-slide state', JSON.stringify(await state())); }
      }
    }
`;
s = s.slice(0, a) + body + s.slice(b);
s = s.replace("'t180l154e-'", "'t180l154e2-'").replace('a few frames (BelowNormal', 'run 2, drag frames (BelowNormal');
fs.writeFileSync(path.join(__dirname, 'render154b.js'), s);
console.log('wrote render154b.js');
