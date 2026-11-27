// changelog678r1.js (pane B, D678 ruling 1): the one CHANGELOG sentence the ruling asks for when the try misses, inserted after the Finish exception,
// the paragraph's tail rewrapped to its neighbours' width (about 150 columns), CRLF kept. Run on the file as at 346e2a0. usage: node changelog678r1.js <CHANGELOG.md>
'use strict';
const fs = require('fs'), f = process.argv[2];
const s = fs.readFileSync(f, 'utf8');
const from = "  2e-7 rad per metre, and the closed lap's pieces end within 0.1 mm of a level head's. The app has no right-width brush (Sculpt's brushes refuse\r\n" +
  '  the right width), so nothing there is left changing by a brush.\r\n';
const to = [
  "  2e-7 rad per metre, and the closed lap's pieces end within 0.1 mm of a level head's. One try at laying that hold only once the lap is closed",
  '  (D678) was measured against the bar set for it beforehand and missed it (after a grab with Sculpt, by more than a step of bank, as Finish from the',
  "  same head with its width level also does), so it was not kept and Finish stays as described here. The app has no right-width brush (Sculpt's brushes",
  '  refuse the right width), so nothing there is left changing by a brush.',
].join('\r\n') + '\r\n';
if (s.split(from).length !== 2) { console.error('the two lines do not occur exactly once'); process.exit(1); }
fs.writeFileSync(f, s.replace(from, to));
console.log('replaced; longest new line', Math.max(...to.split('\r\n').map((l) => l.length)));
