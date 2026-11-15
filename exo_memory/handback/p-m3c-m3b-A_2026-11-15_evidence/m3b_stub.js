// D677 M3b, red first: switch the fall's call in cross() off (stub: today's drop) or back on.   node m3b_stub.js on|off [tree]
const fs = require('fs');
const f = (process.argv[3] || 'G:/consonance-scratch/a-m1-dz3/') + 'chase/chaser.cpp';
let s = fs.readFileSync(f, 'utf8');
const real = 'if (c.gait == Gait::Drop && c.body.root_law == 1) {';
const stub = 'if (c.gait == Gait::Drop && c.body.root_law == 2) {  // SCRATCH STUB (M3b red first), never committed';
const [from, to] = process.argv[2] === 'off' ? [real, stub] : [stub, real];
if (s.split(from).length !== 2) throw new Error('anchor not found exactly once: ' + from);
fs.writeFileSync(f, s.replace(from, () => to));
console.log('the fall ' + (process.argv[2] === 'off' ? 'STUBBED (today\'s drop)' : 'real'));
