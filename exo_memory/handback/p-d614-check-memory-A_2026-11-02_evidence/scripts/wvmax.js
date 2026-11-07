// wvmax.js <work dir>...: from wv583-samples.csv (t, mark, sum, label=MB...), per run and step: samples, the largest sum, the largest of the page, of the
// check worker, of page + check worker in one sample, and of the export's own worker (the uuid-named worker in the sandboxed frame's process)
'use strict';
const fs = require('fs'), path = require('path');
for (const W of process.argv.slice(2)) for (const step of ['open', 'install']) {
  const rows = fs.readFileSync(path.join(W, 'wv583-samples.csv'), 'utf8').trim().split(/\r?\n/).map((l) => l.split(','))
    .filter((r) => r[1] === step).map((r) => { const by = {}; for (const c of r.slice(3)) { const i = c.lastIndexOf('='); by[c.slice(0, i)] = +c.slice(i + 1) || 0; } return { t: +r[0], sum: +r[2], by }; });
  const get = (by, re) => Object.entries(by).filter(([k]) => re.test(k)).reduce((a, [, v]) => a + v, 0);
  const max = (f) => Math.max(...rows.map((r) => f(r)));
  const page = (r) => r.by.page || 0, chk = (r) => get(r.by, /checkworker/), exp = (r) => get(r.by, /^worker:[0-9a-f]{8}-/);
  console.log(`${path.basename(W)} ${step}: ${rows.length} samples; sum max ${max((r) => r.sum)}; page max ${max(page)}; check worker max ${max(chk)}; page+check max ${max((r) => page(r) + chk(r))}; export worker max ${max(exp)}`);
}
