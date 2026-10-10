// defensive.js <handback dir> [--json]: the defensive-text trend in hand-backs, by date (D276 item 4, pane C). READ-ONLY.
//
// THE RULE (fixed before the run; the same rule for every file and every seat):
//   unit      = a non-empty line of a dated hand-back `*_YYYY-MM-DD*.md` directly in the directory (subfolders = evidence, not hand-backs),
//               dated by the date in its FILE NAME.
//   SECTION   = a markdown heading (#..######) and every line under it until the next heading of the same or a higher level.
//   NV  (not-verified, what BUILDING's "what a hand-back owes" asks for): a line in a section whose heading matches NV_HEAD,
//               or, outside such sections, a line matching NV_LINE.
//   SD  (self-defence / self-correction): a line in a section whose heading matches SD_HEAD, or, outside NV/SD sections, SD_LINE.
//   A heading that matches both is NV (the stricter-to-the-brief reading); a line counts once.
//   PERIODS   = before <= 2026-10-01 · transition 2026-10-02..03 (the SOURCES gate live 10-02, the reply slot live 10-03) · after >= 2026-10-04.
'use strict';
const fs = require('fs'), path = require('path');
const NV_HEAD = /does ?n[o']t establish|doesn't establish|not established|what (this|it|the finding) (does not|doesn't) (prove|establish|show|cover)|\blimits?\b|not verified|unverified|\bnot run\b|caveats?|not (yet )?(shown|proven)/i;
const SD_HEAD = /correction|my own|\bfault\b|mistake|\bslips?\b|i was wrong|errors? of mine/i;
const NV_LINE = /not verified|unverified|does ?n[o']t establish|not established|\binferred:/i;
const SD_LINE = /my own (fault|error|mistake|slip)|my mistake|i was wrong/i;
const DATE = /_(\d{4}-\d{2}-\d{2})/;

function classify(text) {
  const lines = text.split(/\r?\n/);
  const stack = [];   // [{ level, cls }]
  let total = 0, nv = 0, sd = 0, nvSec = false, sdSec = false;
  for (const l of lines) {
    const h = l.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      while (stack.length && stack[stack.length - 1].level >= level) stack.pop();
      const cls = NV_HEAD.test(h[2]) ? 'nv' : SD_HEAD.test(h[2]) ? 'sd' : null;
      stack.push({ level, cls });
      if (cls === 'nv') nvSec = true; if (cls === 'sd') sdSec = true;
    }
    if (!l.trim()) continue;
    total++;
    const inherited = [...stack].reverse().find((s) => s.cls);
    if (inherited) { if (inherited.cls === 'nv') nv++; else sd++; continue; }
    if (NV_LINE.test(l)) nv++; else if (SD_LINE.test(l)) sd++;
  }
  return { total, nv, sd, nvSec, sdSec };
}

const dir = process.argv[2], json = process.argv.includes('--json');
const files = fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isFile() && /\.md$/.test(e.name) && DATE.test(e.name)).map((e) => e.name);
const byDate = {}, byPeriod = { before: [], transition: [], after: [] };
for (const name of files) {
  const date = name.match(DATE)[1];
  const c = classify(fs.readFileSync(path.join(dir, name), 'utf8'));
  const d = (byDate[date] = byDate[date] || { files: 0, total: 0, nv: 0, sd: 0, withNvSec: 0, withSdSec: 0, lengths: [] });
  d.files++; d.total += c.total; d.nv += c.nv; d.sd += c.sd; d.withNvSec += c.nvSec ? 1 : 0; d.withSdSec += c.sdSec ? 1 : 0; d.lengths.push(c.total);
  const p = date <= '2026-10-01' ? 'before' : date <= '2026-10-03' ? 'transition' : 'after';
  byPeriod[p].push({ name, ...c });
}
const pct = (a, b) => (b ? (100 * a / b).toFixed(1) + '%' : '-');
const med = (xs) => { const s = [...xs].sort((a, b) => a - b); return s.length ? (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : 0; };
const sum = (xs, k) => xs.reduce((a, x) => a + x[k], 0);
const periods = Object.fromEntries(Object.entries(byPeriod).map(([p, xs]) => [p, {
  files: xs.length, total: sum(xs, 'total'), nv: sum(xs, 'nv'), sd: sum(xs, 'sd'),
  nvShare: pct(sum(xs, 'nv'), sum(xs, 'total')), sdShare: pct(sum(xs, 'sd'), sum(xs, 'total')),
  medianLines: med(xs.map((x) => x.total)), withNvSection: pct(xs.filter((x) => x.nvSec).length, xs.length), withSdSection: pct(xs.filter((x) => x.sdSec).length, xs.length),
  medianNvSharePerFile: pct(med(xs.map((x) => (x.total ? x.nv / x.total : 0))) * 1000, 1000), medianSdSharePerFile: pct(med(xs.map((x) => (x.total ? x.sd / x.total : 0))) * 1000, 1000),
}]));
if (json) { console.log(JSON.stringify({ files: files.length, periods, byDate }, null, 1)); process.exit(0); }
console.log(`files ${files.length} (dated *.md directly in ${dir})`);
console.log('PERIOD      files  lines   NV lines  NV share  SD lines  SD share  median lines/file  files w/ NV section  files w/ SD section  median NV share/file  median SD share/file');
for (const [p, v] of Object.entries(periods)) console.log(`${p.padEnd(11)} ${String(v.files).padStart(5)} ${String(v.total).padStart(6)} ${String(v.nv).padStart(9)} ${v.nvShare.padStart(9)} ${String(v.sd).padStart(9)} ${v.sdShare.padStart(9)} ${String(v.medianLines).padStart(18)} ${v.withNvSection.padStart(20)} ${v.withSdSection.padStart(20)} ${v.medianNvSharePerFile.padStart(21)} ${v.medianSdSharePerFile.padStart(21)}`);
console.log('\nDATE        files  lines   NV share  SD share  median lines/file');
for (const date of Object.keys(byDate).sort()) { const d = byDate[date]; console.log(`${date} ${String(d.files).padStart(5)} ${String(d.total).padStart(6)} ${pct(d.nv, d.total).padStart(9)} ${pct(d.sd, d.total).padStart(9)} ${String(med(d.lengths)).padStart(18)}`); }
