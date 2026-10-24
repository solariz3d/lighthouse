// mut.js: apply one mutant at a time to leftovers.js in a COPY of the tools folder, run leftovers.test.js against it, report applied/caught.
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), { spawnSync } = require('child_process');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (_) {}
const src = 'C:/Users/nname/Desktop/worktrees/lh-d450-c/consonance/tools';
const work = path.join(__dirname, 'mutwork'); fs.rmSync(work, { recursive: true, force: true }); fs.mkdirSync(work);
for (const f of ['leftovers.js', 'leftovers.test.js', 'scratch.js']) fs.copyFileSync(path.join(src, f), path.join(work, f));
const orig = fs.readFileSync(path.join(work, 'leftovers.js'), 'utf8');
const M = [
  ['a zero read is printed as a count', "return { state: 'UNCALIBRATED', count: null, titles, how: `read 0, and ${tried}` };", "return { state: 'CALIBRATED', count: 0, titles, how: `read 0, and ${tried}` };"],
  ['the control rise is not required', 'if (control && control.during > control.before) {', 'if (control) {'],
  ['the tray sanity check is dropped', 'if (!(w.trays >= 1)) return', 'if (false) return'],
  ['registered worktrees count as strays', "if (gd && wtRoots.some((r) => (norm(gd) + '\\\\').startsWith(r)) && fs.existsSync(gd)) continue;", ''],
  ['a dangling .git counts as registered', ' && fs.existsSync(gd)) continue;', ') continue;'],
  ['the main checkout counts as a stray', 'if (mains.has(norm(path.resolve(p)))) continue;', ''],
  ['infrastructure is listed', 'if (INFRA_NAMES.has(name) || INFRA_CMD.some((re) => re.test(cmd))) continue;', ''],
  ['young processes are listed', 'if (!(now - p.started >= minAgeMin * 60000)) continue;', ''],
  ['processes not ours are listed', 'if (!OURS.some((re) => re.test(cmd)) && !(HEADLESS_BROWSER.test(name) && /--headless/.test(cmd))) continue;', ''],
  ['any --headless process counts as ours', 'HEADLESS_BROWSER.test(name) && /--headless/', '/--headless/'],
  ['a headless browser is not ours', '&& !(HEADLESS_BROWSER.test(name) && /--headless/.test(cmd))) continue;', ') continue;'],
  ['fake- match is loosened', '/^fake-/i.test(n)', '/^fake/i.test(n)'],
  ['worktrees are not counted', 'return { label: repo.label, dir: repo.dir, linked: names.length };', 'return { label: repo.label, dir: repo.dir, linked: 0 };'],
];
let applied = 0, caught = 0, notApplied = 0;
for (const [name, a, b] of M) {
  if (orig.split(a).length !== 2) { notApplied++; console.log(`NOT APPLIED  ${name}`); continue; }
  applied++;
  fs.writeFileSync(path.join(work, 'leftovers.js'), orig.replace(a, b));
  const r = spawnSync(process.execPath, ['--test', path.join(work, 'leftovers.test.js')], { encoding: 'utf8', windowsHide: true });
  const killed = r.status !== 0; if (killed) caught++;
  console.log(`${killed ? 'caught      ' : 'SURVIVED    '} ${name}`);
}
fs.writeFileSync(path.join(work, 'leftovers.js'), orig);
const base = spawnSync(process.execPath, ['--test', path.join(work, 'leftovers.test.js')], { encoding: 'utf8', windowsHide: true });
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${notApplied}; unmutated copy ${base.status === 0 ? 'green' : 'RED'}`);
fs.rmSync(work, { recursive: true, force: true });
