// excl-rows.js <worktree>: TEMPORARILY add C's three lap-4 EXCLUDE rows to gen-consumer.js (B's file) for a measurement run.
// Never committed: the caller restores the file with `git checkout -- consonance/tools/gen-consumer.js`. The rows are B's to land.
'use strict';
const fs = require('fs'), path = require('path');
const f = path.join(process.argv[2], 'consonance', 'tools', 'gen-consumer.js');
let t = fs.readFileSync(f, 'utf8');
const anchor = "  'exo_memory/memory/verify-before-claiming.md':\n";
if (t.split(anchor).length !== 2) throw new Error('anchor moved');
const ROWS =
  "  'exo_memory/memory/split-the-work-with-the-panes.md':\n" +
  "    'STATE of one pair: the keeper\\'s correction to one seat, written as this seat\\'s own memory (\"he has corrected this at least three times\"). A new user\\'s memory starts blank (D273 lap 4, the cold read C3)',\n" +
  "  'exo_memory/memory/frozen-is-not-dead.md':\n" +
  "    'the keeper\\'s own insight (2026-07-25) written as this seat\\'s memory. A new user\\'s memory starts blank (D273 lap 4, the cold read C3); the insight stays in the keeper\\'s record',\n" +
  "  'exo_memory/cards/dont-offer-rest-assume-momentum.md':\n" +
  "    'one person\\'s temperament as a rule about the reader (\"He calls rest when he needs it\"); its general form, cards/never-pathologize-the-user.md, ships (D273 lap 4, the cold read C4)',\n";
t = t.replace(anchor, ROWS + anchor);
fs.writeFileSync(f, t);
console.log('added 3 EXCLUDE rows (temporary)');
