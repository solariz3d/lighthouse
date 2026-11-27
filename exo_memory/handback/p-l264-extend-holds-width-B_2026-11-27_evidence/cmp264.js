// cmp264.js (pane B, L264): two bytes264.js runs (the base, the branch) compared: tracks saved the same, undo steps the same, and the Extend at each open head the
// same or not, with each head's width slope beside it. usage: node cmp264.js <base.json> <branch.json>
'use strict';
const [a, b] = process.argv.slice(2).map((f) => require(require('path').resolve(f)));
const tr = a.tracks.map((x, i) => ({ x, y: b.tracks[i] }));
const sameSaved = tr.filter(({ x, y }) => x.saved === y.saved).length, roundTrip = tr.filter(({ y }) => y.same === true).length;
const steps = a.undo.flatMap((u, i) => (u.steps || []).map((s, k) => s === ((b.undo[i] || {}).steps || [])[k]));
const open = tr.filter(({ x }) => x.closed === false), extSame = open.filter(({ x, y }) => x.extended === y.extended);
console.log(`tracks: saved the same on both ${sameSaved} of ${tr.length}; byte for byte their own file again on the branch ${roundTrip} of ${tr.length}; refused on both ${tr.filter(({ x, y }) => /^REFUSED/.test(x.saved) && x.saved === y.saved).length}`);
console.log(`undo steps: the same on both ${steps.filter(Boolean).length} of ${steps.length}`);
console.log(`open tracks ${open.length}, closed ${tr.filter(({ x }) => x.closed === true).length}: an Extend of 100 m at the head lays the same piece on both ${extSame.length} of ${open.length}`);
for (const { x, y } of open) console.log(`  track #${x.n}: head width slope ${x.headWidthSlope} per m; the new piece ${x.extended === y.extended ? 'the same' : 'DIFFERS'}`);
