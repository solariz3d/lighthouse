// cl-merge.js (D483, pane E): the CHANGELOG conflict merged by hand: both sides kept whole; under Fixed, the drag-lag entry first, then D477's three. CRLF kept.
'use strict';
const fs = require('fs'), f = 'C:/Users/nname/Downloads/t180-wt-e483/CHANGELOG.md';
const raw = fs.readFileSync(f, 'utf8'), crlf = raw.includes('\r\n'); let s = raw.split('\r\n').join('\n');
const m = /<<<<<<< HEAD\n([\s\S]*?)\n=======\n([\s\S]*?)\n>>>>>>> 883c200\n/.exec(s);
if (!m || s.split('<<<<<<<').length !== 2) throw new Error('not exactly one conflict');
const ours = m[1], theirs = m[2];
const [added, fixedOurs] = ours.split('\n\n### Fixed\n');
if (!added.startsWith('### Added\n') || !fixedOurs) throw new Error('ours is not Added + Fixed');
if (!theirs.startsWith('### Fixed\n')) throw new Error('theirs is not Fixed');
const merged = `${added}\n\n### Fixed\n${theirs.slice('### Fixed\n'.length)}\n${fixedOurs}\n`;
s = s.replace(m[0], () => merged);
fs.writeFileSync(f, crlf ? s.split('\n').join('\r\n') : s);
console.log('merged; entry lines:', merged.split('\n').filter((l) => l.startsWith('- ')).length);
