// apronset.js <his kn5> <our kn5> <relean list>: the apron plank meshes that are byte-equal and that differ, by the piece in their name, against the pieces
// D609's re-lean list names as moved (A's relean-elysium.txt). Prints counts and any disagreement.
'use strict';
const fs = require('fs');
const { kn5Nodes } = require('C:/Users/nname/Desktop/worktrees/t180-c615/test/fixtures/kn5nodes.js');
const [a, b] = process.argv.slice(2, 4).map((p) => kn5Nodes(fs.readFileSync(p)));
const moved = new Set([...fs.readFileSync(process.argv[4], 'utf8').matchAll(/^\s+p(\d+) [LR]: \d+ plank/gm)].map((m) => +m[1]));
const by = (k) => new Map(k.meshes.map((m) => [m.name, m.full]));
const A = by(a), B = by(b), same = [], diff = [];
for (const [k, v] of B) if (/^1ROAD_APRON_p\d+/.test(k) && A.has(k)) (A.get(k) === v ? same : diff).push(k);
const piece = (k) => +k.match(/^1ROAD_APRON_p(\d+)/)[1];
console.log(`D609 moved pieces: ${moved.size}; apron plank meshes same ${same.length}, differ ${diff.length}`);
console.log(`differ on a piece D609 did not move: ${diff.filter((k) => !moved.has(piece(k))).join(', ') || 0}`);
console.log(`same on a piece D609 moved: ${same.filter((k) => moved.has(piece(k))).join(', ') || 0}`);
console.log(`same: ${same.join(', ')}`);
