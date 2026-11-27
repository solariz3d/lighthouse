// changelog678w.js (pane B, D678 words only, the packet's "Amended 13:4x"): C1, C2 and F1 written into the width-hold entry of the CHANGELOG at 1074d5d,
// each replaced span checked to occur exactly once, CRLF kept, every new line's length printed. usage: node changelog678w.js <CHANGELOG.md>
'use strict';
const fs = require('fs'), f = process.argv[2];
let s = fs.readFileSync(f, 'utf8');
const L = (...lines) => lines.join('\r\n') + '\r\n';
const EDITS = [
  ['C2 and F1',
    L("  head's change per metre: 18 to 33 cm after the +4 m grab) and bends much harder: after that grab the width's second derivative reaches 4.4 to 7.2 per",
      '  metre (7.15 with a ramp of 1). A level head lays exactly as before, and a typed width still goes where it is typed.'),
    L("  head's change per metre: 18 to 33 cm after the +4 m grab) and bends much harder: after that grab the width's second derivative reaches 5.0 to 9.0 per",
      '  metre at the joint (8.95 with a ramp of 1). When a bank, cup or edge is typed with its "early" box ticked in the same Extend from such a head, the',
      "  width goes past the head's the way it was heading by about a third of the head's change per metre times the early ramp's first step (0.94 m on a",
      '  30 m piece, 2.3 m on 100 m), stays there for about 10 m and comes back, within 1 mm by about 16 m: on a 30 m piece 47 mm after the wide brush and',
      '  0.52 m after the +4 m grab, on a 100 m piece 0.12 m and 1.30 m. A level head lays exactly as before, and a typed width still goes where it is typed.')],
  ['C1',
    L("  2e-7 rad per metre, and the closed lap's pieces end within 0.1 mm of a level head's. One try at laying that hold only once the lap is closed",
      '  (D678) was measured against the bar set for it beforehand and missed it (after a grab with Sculpt, by more than a step of bank, as Finish from the',
      "  same head with its width level also does), so it was not kept and Finish stays as described here. The app has no right-width brush (Sculpt's brushes",
      '  refuse the right width), so nothing there is left changing by a brush.'),
    L("  2e-7 rad per metre, and its first two new pieces end about 1.4 and 1.0 mm from where a level head's do (the lap's own end within 0.1 mm). One try",
      '  at laying that hold only once the lap is closed (D678) was measured against the bar set for it beforehand and missed it (after a grab with Sculpt,',
      '  by more than a step of bank, as Finish from the same head with its width level also does), so it was not kept and Finish stays as described here.',
      "  The app has no right-width brush (Sculpt's brushes refuse the right width), so nothing there is left changing by a brush.")],
];
for (const [name, from, to] of EDITS) {
  const n = s.split(from).length - 1;
  if (n !== 1) { console.error(`${name}: the old text occurs ${n} times, not once; nothing written`); process.exit(1); }
  s = s.replace(from, to);
  console.log(`${name}: replaced; new line lengths ${to.split('\r\n').filter(Boolean).map((l) => l.length).join(', ')}`);
}
fs.writeFileSync(f, s);
