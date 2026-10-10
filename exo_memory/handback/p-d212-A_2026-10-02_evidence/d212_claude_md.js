// byte-exact insertion into the librarian's CLAUDE.md, from the backup (the Edit tool had normalised trailing whitespace across the file)
const fs = require('fs');
const D = 'C:/Consonance/instances/librarian/';
const bak = D + 'CLAUDE.md.bak-d212-20261002-135553';
const src = fs.readFileSync(bak, 'utf8');
const anchor = '**When that note is there, the next station is yours to name** — the pane did not name it.\n\n';
if (src.split(anchor).length !== 2) throw new Error('anchor count ' + (src.split(anchor).length - 1));
const add = '**Every `call_librarian` and `call_chair` ring also carries a `SOURCES:` line directly above its NEXT trailer** (D212, 2026-10-02): `SOURCES: <path> · <path> · \\`<command>\\`` naming what THIS turn opened or ran, or `SOURCES: none (no state claims)`. A hook (`consonance/hooks/sources-gate.js`) DENIES the ring in the same turn when it is missing or an item matches nothing you opened; fix the line and re-send. The master is `BUILDING.md`, WHAT A HAND-BACK OWES item 8.\n\n';
fs.writeFileSync(D + 'CLAUDE.md', src.replace(anchor, () => anchor + add));
console.log('written');
