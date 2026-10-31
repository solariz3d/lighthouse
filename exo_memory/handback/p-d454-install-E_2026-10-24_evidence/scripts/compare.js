// compare.js (D454 part 3, pane E): per hook run, the paths a generated hook touched against the paths its dev copy touched, in the same mode.
// Only the install home and the probe's own work folder are normalised; every other byte of every path must match.
//   node compare.js <a.jsonl> <homeA> <b.jsonl> <homeB>
'use strict';
const fs = require('fs');
const [fa, ha, fb, hb] = process.argv.slice(2);
const load = (f, home, tag) => {
  const h = home.split('\\').join('/').toLowerCase();
  return fs.readFileSync(f, 'utf8').trim().split('\n').map((l) => JSON.parse(l)).map((r) => {
    const key = r.event + ' ' + r.script.split('\\').join('/').toLowerCase().replace(h, '<HOOKS>') + ' ' + (r.tool || '');
    const paths = new Set(r.rows.filter((x) => x.op !== 'probe-start').map((x) => {
      const p = String(x.path || x.cmd || '').split(String.fromCharCode(92)).join('/').toLowerCase().replace(h, '<HOOKS>').replace(/\/work-[a-z0-9.-]+?\.jsonl/, '/<WORK>').replace(/log-\d+-[0-9a-f]+\.jsonl/, '<LOG>');
      return (x.w ? 'W ' : x.op.startsWith('child') || x.op.startsWith('subprocess') ? 'X ' : 'R ') + p + (x.args ? ' ' + x.args.join(' ').split(String.fromCharCode(92)).join('/').toLowerCase().split(h).join('<HOOKS>').replace(/\/work-[a-z0-9.-]+?\.jsonl/g, '/<WORK>') : '');
    }));
    return { key, paths, status: r.status };
  });
};
const A = load(fa, ha), B = load(fb, hb);
let same = 0, diff = 0;
for (let i = 0; i < Math.max(A.length, B.length); i++) {
  const a = A[i], b = B[i];
  if (!a || !b || a.key !== b.key) { diff++; console.log('ORDER', a && a.key, '|', b && b.key); continue; }
  const onlyA = [...a.paths].filter((p) => !b.paths.has(p)), onlyB = [...b.paths].filter((p) => !a.paths.has(p));
  if (!onlyA.length && !onlyB.length && a.status === b.status) { same++; continue; }
  diff++; console.log('DIFF', a.key, 'status', a.status, b.status); for (const p of onlyA) console.log('   only in A:', p); for (const p of onlyB) console.log('   only in B:', p);
}
console.log('runs', A.length, 'identical', same, 'different', diff);
