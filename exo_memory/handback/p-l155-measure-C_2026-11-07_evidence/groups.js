// groups.js (pane C, L155): the per-file CSVs (pertest.js) summed into four groups, each group's share of the log's in-test time, and the top files.
//   node groups.js <csv>...    -> groups.csv, top.csv, and a printout
// Groups, first match wins: MUTATION (*mutation.test.js, test-fast's own rule); FRAME-TIMING (the five the L154/L155 packets name); BROWSER-PAGE (the test files that load
// app/test/soundrender.js, the module that launches headless Chrome: checked by git grep at 890c2a7); REST. A log's "(ambiguous)" row is put in MUTATION only when every
// ambiguous title is shared among mutation harnesses alone (pertest.js prints the sets; checked on both full-suite logs).
'use strict';
const fs = require('fs');
const TIMING = new Set(['app/test/drag-frame.test.js', 'app/test/release-frame.test.js', 'app/test/sculpt-frame.test.js', 'app/test/core-extra-bank-drag-cost.test.js', 'app/test/preview-lod-frame.test.js']);
const BROWSER = new Set(['app/test/blenderexport-page.test.js', 'app/test/browser-cap.test.js', 'app/test/chrome-mute.test.js', 'app/test/drag-frame.test.js', 'app/test/export-isolated-page.test.js',
  'app/test/menubar-page.test.js', 'app/test/preview-lod-frame.test.js', 'app/test/release-frame.test.js', 'app/test/sculpt-frame.test.js', 'app/test/sky-crisp.test.js', 'app/test/sky-dither.test.js',
  'app/test/sound-bands.test.js', 'app/test/texture-page.test.js', 'app/test/theme-mutation.test.js', 'app/test/vignette-page.test.js', 'app/test/vignette.test.js']);
const groupOf = (f) => (f === '(ambiguous)' ? 'mutation*' : f === '(unmatched)' ? 'unmatched' : /mutation\.test\.js$/.test(f) ? 'mutation' : TIMING.has(f) ? 'frame-timing' : BROWSER.has(f) ? 'browser-page' : 'rest');
const G = {}, top = [];
for (const csv of process.argv.slice(2)) {
  for (const line of fs.readFileSync(csv, 'utf8').trim().split('\n').slice(1)) {
    const [label, file, ms, n] = line.split(','); const g = groupOf(file), k = `${label}`;
    G[k] = G[k] || { total: 0, groups: {}, files: {} }; G[k].total += Number(ms); G[k].groups[g] = G[k].groups[g] || { ms: 0, files: 0, tests: 0 };
    G[k].groups[g].ms += Number(ms); G[k].groups[g].files += file.startsWith('(') ? 0 : 1; G[k].groups[g].tests += Number(n);
    if (!file.startsWith('(')) top.push({ label, file, ms: Number(ms), n: Number(n), g });
  }
}
const order = ['mutation', 'mutation*', 'frame-timing', 'browser-page', 'rest', 'unmatched'];
let out = 'log,group,files,tests,sum_s,share_pct\n';
for (const [k, v] of Object.entries(G)) {
  console.log(`\n${k}: in-test total ${(v.total / 1000).toFixed(0)} s`);
  for (const g of order) { const r = v.groups[g]; if (!r) continue; const line = `${k},${g},${r.files},${r.tests},${(r.ms / 1000).toFixed(1)},${(100 * r.ms / v.total).toFixed(1)}`; out += line + '\n'; console.log('  ' + line.split(',').slice(1).join('\t')); }
}
fs.writeFileSync('groups.csv', out);
let t = 'log,rank,file,group,tests,sum_s,share_pct\n';
for (const k of Object.keys(G)) top.filter((x) => x.label === k).sort((a, b) => b.ms - a.ms).slice(0, 15).forEach((x, i) => { t += `${k},${i + 1},${x.file},${x.g},${x.n},${(x.ms / 1000).toFixed(1)},${(100 * x.ms / G[k].total).toFixed(1)}\n`; });
fs.writeFileSync('top.csv', t);
