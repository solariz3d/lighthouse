// mut-leftovers.js: one mutant at a time on leftovers.js, in a COPY placed at <scratch repo>/consonance/tools (a real git repo, so the
// own-repository default has something to count); leftovers.test.js run against it. Reports applied / caught / NOT APPLIED.
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), { spawnSync } = require('child_process');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (_) {}
const src = 'C:/Users/nname/Desktop/worktrees/lh-d454-c/consonance/tools';
const repo = path.join(__dirname, 'mutrepo'); fs.rmSync(repo, { recursive: true, force: true });
const work = path.join(repo, 'consonance', 'tools'); fs.mkdirSync(work, { recursive: true });
spawnSync('git', ['init', '-q', repo]);
for (const f of ['leftovers.js', 'leftovers.test.js', 'scratch.js']) fs.copyFileSync(path.join(src, f), path.join(work, f));
const orig = fs.readFileSync(path.join(work, 'leftovers.js'), 'utf8');
const M = [
  // the D450 set, re-anchored where D454 changed the text
  ['a zero read is printed as a count', "return { state: 'UNCALIBRATED', count: null, titles, how: `read 0, and ${tried}` };", "return { state: 'CALIBRATED', count: 0, titles, how: `read 0, and ${tried}` };"],
  ['the control rise is not required', 'if (control && control.during > control.before) {', 'if (control) {'],
  ['the tray sanity check is dropped', 'if (!(w.trays >= 1)) return', 'if (false) return'],
  ['registered worktrees count as strays', "if (gd && wtRoots.some((r) => (norm(gd) + '\\\\').startsWith(r)) && fs.existsSync(gd)) continue;", ''],
  ['a dangling .git counts as registered', ' && fs.existsSync(gd)) continue;', ') continue;'],
  ['the main checkout counts as a stray', 'if (mains.has(norm(path.resolve(p)))) continue;', ''],
  ['infrastructure is listed', 'if (INFRA_NAMES.has(name) || INFRA_CMD.some((re) => re.test(cmd))) continue;', ''],
  ['young processes are listed', 'if (!(now - p.started >= minAgeMin * 60000)) continue;', ''],
  ['processes not ours are listed', 'if (!ours.some((re) => re.test(cmd)) && !(HEADLESS_BROWSER.test(name) && /--headless/.test(cmd))) continue;', ''],
  ['any --headless process counts as ours', 'HEADLESS_BROWSER.test(name) && /--headless/', '/--headless/'],
  ['a headless browser is not ours', '&& !(HEADLESS_BROWSER.test(name) && /--headless/.test(cmd))) continue;', ') continue;'],
  ['fake- match is loosened', '/^fake-/i.test(n)', '/^fake/i.test(n)'],
  ['worktrees are not counted', 'return { label: repo.label, dir: repo.dir, linked: names.length };', 'return { label: repo.label, dir: repo.dir, linked: 0 };'],
  // D454 part 2
  ['a linked worktree is read as if .git were a folder', 'if (st.isDirectory()) return g;', 'return g;'],
  ['names-only is ignored', 'if (!r.namesOnly) for (const d of worktreeDirs(r))', 'for (const d of worktreeDirs(r))'],
  ['strays ignore their prefix', 'if (!e.name.toLowerCase().startsWith(prefix.toLowerCase())) continue;', ''],
  ['no default repository', 'opts.repos && opts.repos.length ? opts.repos : [{ label: labelOf(REPO), dir: REPO }]', '(opts.repos || [])'],
  ['strays scanned by default in the old place', 'const strays = opts.strays || null;', "const strays = opts.strays || { dir: require('os').homedir(), prefix: 't180-' };"],
  ['a given repo is not ours', 'res.push(under(r.dir)); if (!r.namesOnly)', 'if (!r.namesOnly)'],
  ['its worktrees are not ours', 'for (const d of worktreeDirs(r)) res.push(under(d));', ';'],
  ['the strays folder is not ours', 'if (strays) res.push(', 'if (false) res.push('],
  ['the scratch root is not ours', 'under(scratch.scratchRoot())', '/$^/'],
  ['an unknown flag is accepted', 'if (!VALUED.has(a[i])) {', 'if (false) {'],
  ['the old keeper paths are ours again', "const OURS_ALWAYS = [/\\\\temp\\\\claude\\\\/,", "const OURS_ALWAYS = [/\\\\desktop\\\\lighthouse\\\\/, /\\\\temp\\\\claude\\\\/,"],
];
let applied = 0, caught = 0, notApplied = 0;
const t = () => spawnSync(process.execPath, ['--test', path.join(work, 'leftovers.test.js')], { encoding: 'utf8', windowsHide: true, cwd: repo });
for (const [name, a, b] of M) {
  if (orig.split(a).length !== 2) { notApplied++; console.log(`NOT APPLIED  ${name}`); continue; }
  applied++;
  fs.writeFileSync(path.join(work, 'leftovers.js'), orig.replace(a, b));
  const killed = t().status !== 0; if (killed) caught++;
  console.log(`${killed ? 'caught      ' : 'SURVIVED    '} ${name}`);
}
fs.writeFileSync(path.join(work, 'leftovers.js'), orig);
const base = t();
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${notApplied}; unmutated copy ${base.status === 0 ? 'green' : 'RED'}`);
if (base.status !== 0) console.log(base.stdout.split('\n').filter((l) => /not ok|✖|Error/.test(l)).slice(0, 10).join('\n'));
fs.rmSync(repo, { recursive: true, force: true });
