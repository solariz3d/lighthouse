// wvsum.js <wv583 work dir>...: per step (the samples' mark), its time (from wv583.json) and the PEAK JS heap of the page, of the check worker, of the two
// together (the page's own renderer process: one 4 GB budget), and of the export's worker (a process of its own), in MB; and the load's settled sum.
'use strict';
const fs = require('fs'), path = require('path');
for (const dir of process.argv.slice(2)) {
  const j = JSON.parse(fs.readFileSync(path.join(dir, 'wv583.json'), 'utf8'));
  const rows = fs.readFileSync(path.join(dir, 'wv583-samples.csv'), 'utf8').trim().split('\n').map((l) => { const [t, mark, sum, ...kv] = l.split(','); const by = Object.fromEntries(kv.map((x) => { const i = x.lastIndexOf('='); return [x.slice(0, i), +x.slice(i + 1) || 0]; })); return { t: +t, mark, sum: +sum, by }; });
  const pick = (by, re) => Object.entries(by).filter(([k]) => re.test(k)).reduce((a, [, v]) => a + v, 0);
  console.log(`== ${path.basename(dir)}  (${j.exe.includes('c583') ? '0.4.33' : '0.4.32'}; crashes ${j.crashes.filter((c) => !/code 1000/.test(c.what)).length})`);
  console.log('step      s       page  checker  page+checker  export worker  (MB, peaks)');
  for (const st of j.steps) {
    const rs = rows.filter((r) => r.mark === st.name); if (!rs.length) continue;
    const mx = (f) => Math.max(...rs.map(f));
    console.log(`${st.name.padEnd(8)} ${st.s.toFixed(1).padStart(6)}  ${String(mx((r) => r.by.page)).padStart(6)}  ${String(mx((r) => pick(r.by, /checkworker/))).padStart(7)}  ${String(mx((r) => r.by.page + pick(r.by, /checkworker/))).padStart(12)}  ${String(mx((r) => pick(r.by, /^worker:[0-9a-f]{8}-/))).padStart(13)}${st.ok ? '' : '  FAILED ' + st.error.slice(0, 80)}`);
  }
  const lo = j.steps.find((s) => s.name === 'open'); if (lo && lo.ok) console.log('  open: ' + lo.result.replace(/;.*$/, '').slice(0, 120));
}
