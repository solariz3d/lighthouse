// mentions.js <name>...: per name, the last commit touching consonance/{tools,hooks}/<name>.*, and the record files dated 2026-10-01+ (handback, librarian,
// loop, journal; never third_place/) that name it, with the newest such path. NUL bytes dropped before reading. READ-ONLY.
'use strict';
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const ROOT = 'C:/Users/nname/Desktop/lighthouse', EM = path.join(ROOT, 'exo_memory');
function walk(d, out) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (e.name !== 'third_place' && !e.name.endsWith('_evidence')) walk(p, out); } else if (e.name.endsWith('.md')) out.push(p); } return out; }
const docs = [];
for (const sub of ['handback', 'librarian', 'loop', 'journal']) for (const f of walk(path.join(EM, sub), [])) {
  const m = /(20\d\d-\d\d-\d\d)/.exec(path.basename(f)); if (m && m[1] >= '2026-10-01') docs.push({ f: path.relative(ROOT, f).replace(/\\/g, '/'), d: m[1], t: fs.readFileSync(f).toString('utf8').replace(/\0/g, '') });
}
for (const n of process.argv.slice(2)) {
  const last = execFileSync('git', ['-C', ROOT, 'log', '-1', '--format=%cs', '--', `consonance/tools/${n}.*`, `consonance/hooks/${n}.*`], { encoding: 'utf8', windowsHide: true }).trim();
  const re = new RegExp('\\b' + n.replace(/[-.]/g, '\\$&') + '(\\.js|\\.mutants|\\b)');
  const hit = docs.filter((x) => re.test(x.t)).sort((a, b) => (a.d < b.d ? -1 : 1));
  console.log(n.padEnd(20), 'last-commit', last || '-', '| record files since 10-01:', hit.length, hit.length ? '| newest ' + hit[hit.length - 1].f : '');
}
