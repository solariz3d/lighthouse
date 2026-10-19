'use strict';
// D412 part 2 (b) (O): each mutant's verdict in a new TAP against the 0.4.8 suite TAP (3841908), mutant by mutant. A mutant row is a top-level
// row whose title holds "applied, and caught"; at 3841908 all 579 such titles are distinct (checked: sort | uniq -d → 0), so a title is the key.
// `path` is the row's own diagnostic, '# D412 path: narrowed|whole', written after its YAML block (the harnesses say it from the commit after
// af66ee9). A TAP from before that has none, and the path is then INFERRED from the duration (under 3 s reads narrowed), marked '(inferred)'.
// The inference is weak: L15 ran narrowed in 12.7 s, its named test being slow.
//   node compare-mutants.js <ref.tap> <new.tap> [<title filter regex>] [--md]
const fs = require('fs');
const [refFile, newFile, filter, ...flags] = process.argv.slice(2);
const md = flags.includes('--md') || filter === '--md';
const re = filter && filter !== '--md' ? new RegExp(filter) : null;
function rows(file) {
  const L = fs.readFileSync(file, 'utf8').split(/\r?\n/), out = new Map();
  for (let i = 0; i < L.length; i++) {
    const m = /^(not ok|ok) \d+ - (.*)$/.exec(L[i]);
    if (!m || !/applied, and caught/i.test(m[2])) continue;
    let ms = null, path = null;
    for (let j = i + 1; j < L.length && !/^(not ok|ok) \d+ - /.test(L[j]) && !/^# Subtest: /.test(L[j]); j++) {
      const d = /^\s{2}duration_ms: ([\d.]+)/.exec(L[j]); if (d && ms === null) ms = Number(d[1]);
      const p = /^# D412 path: (\w+)/.exec(L[j]); if (p) path = p[1];
    }
    if (out.has(m[2])) throw new Error(`duplicate mutant title in ${file}: ${m[2]}`);
    out.set(m[2], { ok: m[1] === 'ok', ms, path });
  }
  return out;
}
const ref = rows(refFile), now = rows(newFile);
const keys = [...now.keys()].filter((k) => !re || re.test(k));
let same = 0, diff = 0, narrowed = 0, whole = 0, inferred = 0;
const lines = [];
for (const k of keys) {
  const a = ref.get(k), b = now.get(k);
  const refV = a ? (a.ok ? 'ok' : 'NOT OK') : 'MISSING at 0.4.8', newV = b.ok ? 'ok' : 'NOT OK', eq = !!a && a.ok === b.ok;
  eq ? same++ : diff++;
  const pathV = b.path || (b.ms === null ? '?' : (b.ms < 3000 ? 'narrowed' : 'whole') + ' (inferred)');
  if (!b.path) inferred++;
  if (pathV.startsWith('narrowed')) narrowed++; else if (pathV.startsWith('whole')) whole++;
  lines.push(md ? `| ${k.replace(/^mutation /, '').replace(/: applied, and caught by .*$/, '').replace(/\|/g, '\\|')} | ${refV} | ${newV} | ${eq ? 'same' : '**DIFFERENT**'} | ${pathV} | ${b.ms === null ? '' : (b.ms / 1000).toFixed(1)} |`
    : `${eq ? 'same' : 'DIFF'}\t${refV}\t${newV}\t${pathV}\t${b.ms}\t${k}`);
}
const missingNow = [...ref.keys()].filter((k) => (!re || re.test(k)) && !now.has(k));
if (md) console.log('| mutant | 0.4.8 (3841908) | now | verdict | path | s |\n|---|---|---|---|---|---|');
console.log(lines.join('\n'));
console.log(`${md ? '\n' : ''}rows: ${keys.length} · same verdict: ${same} · different: ${diff} · narrowed: ${narrowed} · whole: ${whole} · path inferred from duration: ${inferred} · in 0.4.8 but not in this run${re ? ' (filtered)' : ''}: ${missingNow.length}`);
