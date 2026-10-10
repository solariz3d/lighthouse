// Read-only. For each forced delivery, find where its text FIRST renders in the receiving pane's raw PTY
// capture, and dump the ANSI-stripped bytes just before it: the screen the gate was looking at while it held.
// Raw logs carry no timestamps, so the anchor is the delivered text itself; ALL occurrences are counted
// and printed so an earlier echo (e.g. the sender quoting it) cannot be mistaken for the arrival.
const fs = require('fs');
const CAP = 'C:/Consonance/data/captures/';
const CASES = [
  ['0c0c0c0a-0000-4000-8000-000000000a01', 'D072 (SMALL FIXES, CHUNK 1) RETURN'],
  ['0c0c0c0b-0000-4000-8000-00000000115b', 'D072 is landed at 5838529'],
  ['0c0c0c0a-0000-4000-8000-000000000a01', 'CHUNK 2 IS SHAPED'],
  ['0c0c0c0b-0000-4000-8000-00000000115b', 'P-SECOND-INSTANCE-TEXT (D073'],
  ['0c0c0c0a-0000-4000-8000-000000000a01', 'THE FIRST BIGGER LINE IS PLANNED'],
  ['a2122153-a37e-41a6-a86f-534267ec0565', 'P-COMPOSER-TRISTATE (a build'],
];
const BACK = +(process.argv[2] || 3000);
const strip = (s) => s.replace(/\x1b\[[0-9;?]*[ -/]*[@-~]/g, '').replace(/\x1b\][^\x07\x1b]*(\x07|\x1b\\)/g, '')
  .replace(/\x1b[()][0-9A-Za-z]/g, '').replace(/\x1b[=>78M]/g, '').replace(/\r/g, '');
const cache = {};
for (const [pane, needle] of CASES) {
  const buf = cache[pane] || (cache[pane] = fs.readFileSync(CAP + pane + '.log'));
  const nb = Buffer.from(needle, 'utf8');
  const hits = []; let i = -1;
  while ((i = buf.indexOf(nb, i + 1)) !== -1) hits.push(i);
  console.log(`\n==== ${pane.slice(0, 8)}  "${needle}"  log ${buf.length} B  occurrences ${hits.length}  first @${hits[0]}`);
  if (!hits.length) continue;
  const at = hits[0];
  const pre = strip(buf.slice(Math.max(0, at - BACK), at).toString('utf8'));
  const lines = pre.split('\n').map((l) => l.replace(/\s+$/, '')).filter((l) => l.trim());
  console.log(lines.slice(-25).map((l) => '  | ' + l.slice(0, 160)).join('\n'));
}
