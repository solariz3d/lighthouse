// words_b.js: his words out of the builder repo (they were in comments), and the changelog's Even entry made true to A1/A1B and item 2. usage: node words_b.js <worktree>
'use strict';
const fs = require('fs'), path = require('path');
const WT = process.argv[2];
const FILES = ['src/core/even.js', 'app/core/coreshell.js', 'app/core/evenwords.js', 'app/core/panel.js', 'app/test/core-pieces-ui.test.js', 'app/test/sculpt-even-sentence.test.js', 'app/test/sculpt-even.test.js', 'test/core_even.test.js', 'test/core_even_mutation.test.js'];
const load = (rel) => { const f = path.join(WT, rel), raw = fs.readFileSync(f, 'utf8'); return { f, crlf: raw.includes('\r\n'), s: raw.replace(/\r\n/g, '\n') }; };
const save = (x) => fs.writeFileSync(x.f, x.crlf ? x.s.replace(/\n/g, '\r\n') : x.s);
let n = 0;
for (const rel of FILES) {
  const x = load(rel), before = x.s;
  x.s = x.s.split('his "B" at 03:41 (lighthouse exo_memory/briefs/t180_sculpt_even.md:106)').join("the keeper's call, L271").split('his \\"B\\"').join("the keeper's call").split('his "B"').join("the keeper's call");
  if (x.s !== before) { n++; save(x); }
  if (/his "B"|his \\"B\\"|t180_sculpt_even\.md:106/.test(x.s)) throw new Error(`${rel} still carries his words`);
}
console.log('files cleaned', n);
const C = load('CHANGELOG.md');
const rep = (a, b) => { const k = C.s.split(a).length - 1; if (k !== 1) throw new Error(`CHANGELOG anchor ${k}x: ${a.slice(0, 70)}`); C.s = C.s.replace(a, () => b); };
const i = C.s.indexOf('**The kept edge can move, by metres.**'), j = C.s.indexOf("nothing here says it stays where it is.", i);
if (i < 0 || j < 0) throw new Error('CHANGELOG: the kept edge paragraph not found');
rep(C.s.slice(i, j + "nothing here says it stays where it is.".length), `**The kept edge is put back where the road had it, and the message says how far it moved.** Even
  reads the road's own width and offset at the stretch's two ends and lays the kept edge on the road between them, bumps taken out, only where those
  ends support a reading: an end is at rest when the road holds within 1 mm at 10, 20 and 30 m beyond it, and either both ends are at rest and agree
  within 1 cm, or one is at rest and the other heads toward it (L271; the first reading tested 10 m only, and put the edge 9.31 m off on a run from the
  track's start, 3.94 m after a row of grabs, and 2.92 m where the road's width steps inside the run, saying nothing). Where the ends do not support a
  reading (a run from the track's start, a stretch end on a grab, a width changing away from the other end's), the kept edge is kept where it is now,
  one least-squares fit over the stretch (within 0.01 m on every case measured but one, 0.0138 m), and the message says so and why. On a banked
  stretch the road is read under the bank as Even finds it (the kept edge within 0.008 m of that road). Every message with an edge kept says which it
  did, how far the edge moved and where. A road whose own width changes inside the run with no bump is still read from its ends, and wrongly (1.5 m
  and 2.9 m on two roads made to show it), so on such a road that figure is the warning.`);
rep("lap at every offset it reads.", `lap at every offset it reads. The check that the road does not come too close under another pass now runs once, when the drag is
  released (a break refuses the whole drag by name and puts the track back as it was), not at every step, and the stretch's cut track and the road
  read from its ends are kept for the whole drag (L271): on the largest lap measured on that machine, 13.2 km, a step went from 1.09 s to 0.19 s
  (the grab's step there is 0.10 s), and the release now pauses 0.74 s for that check.`);
save(C);
console.log('changelog done');
