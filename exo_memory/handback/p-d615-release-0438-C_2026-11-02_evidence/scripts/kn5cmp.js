// kn5cmp.js <his kn5> <our kn5>: every mesh by name, his against ours, by the sha256 of its own record (test/fixtures/kn5nodes.js), grouped:
// the main road's physics (1ROAD_p*), the pit lane, the apron, the catch, the paint, the underskin, and anything else.
'use strict';
const fs = require('fs');
const { kn5Nodes } = require('C:/Users/nname/Desktop/worktrees/t180-c615/test/fixtures/kn5nodes.js');
const [a, b] = process.argv.slice(2).map((p) => kn5Nodes(fs.readFileSync(p)));
const map = (k) => new Map(k.meshes.map((m) => [m.name, m.full]));
const A = map(a), B = map(b), names = [...new Set([...A.keys(), ...B.keys()])].sort();
const GROUPS = [
  ['main road physics (1ROAD_p*)', (n) => /^1ROAD_p\d/.test(n)],
  ['pit lane (1ROAD_PIT*)', (n) => /^1ROAD_PIT/.test(n)],
  ['apron (1ROAD_APRON*, APRONSIDE*)', (n) => /^(1ROAD_APRON|APRONSIDE)/.test(n)],
  ['catch (1ROAD_CATCH*)', (n) => /^1ROAD_CATCH/.test(n)],
  ['paint (PAINT*)', (n) => /^PAINT/.test(n)],
  ['underskin (UNDERSKIN*)', (n) => /^UNDERSKIN/.test(n)],
];
const tally = (pick) => {
  const t = { same: [], differ: [], onlyHis: [], onlyOurs: [] };
  for (const n of names.filter(pick)) { if (!B.has(n)) t.onlyHis.push(n); else if (!A.has(n)) t.onlyOurs.push(n); else (A.get(n) === B.get(n) ? t.same : t.differ).push(n); }
  return t;
};
const line = (label, t) => `${label}: same ${t.same.length}, differ ${t.differ.length}, only his ${t.onlyHis.length}, only ours ${t.onlyOurs.length}`;
console.log(`meshes: his ${A.size}, ours ${B.size}`);
const seen = new Set();
for (const [label, pick] of GROUPS) {
  const t = tally(pick);
  names.filter(pick).forEach((n) => seen.add(n));
  console.log(line(label, t));
  for (const k of ['differ', 'onlyHis', 'onlyOurs']) if (t[k].length) console.log(`  ${k}: ${t[k].slice(0, 12).join(', ')}${t[k].length > 12 ? ' …' : ''}`);
}
console.log(line('anything else', tally((n) => !seen.has(n))));
