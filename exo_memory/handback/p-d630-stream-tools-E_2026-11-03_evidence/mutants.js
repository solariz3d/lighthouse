// usage: node mutants.js <lighthouse worktree>
// D630's mutants, by hand (no harness names these files): each one is ONE exact string replacement in a COPY of consonance/tools in the
// scratch root; the tracked files are never written. "applied" = the string occurs exactly once; "caught" = big-transcript.test.js
// (with the pattern given) has at least one failing test. A CONTROL runs the unmutated copy first.
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const W = process.argv[2], ONLY = process.argv[3] || null, SRC = path.join(W, 'consonance', 'tools');
const ROOT = path.join('G:', 'consonance-scratch', `d630-mut-${process.pid}`);
const M = [
  { id: 'P1 the text record\'s own tool is ignored', file: 'pane-status.js', pattern: 'read forward', from: 'if (t.trim()) { text = t.trim(); toolAfterText = tool; }', to: 'if (t.trim()) { text = t.trim(); toolAfterText = false; }' },
  { id: 'P2 a tool after the last text is ignored', file: 'pane-status.js', pattern: 'read forward', from: 'else if (tool) toolAfterText = true;', to: 'else if (tool) void 0;' },
  { id: 'P3 the prefilter skips every record', file: 'pane-status.js', pattern: 'pane-status', from: `line.indexOf('"assistant"') < 0`, to: `line.indexOf('"assistantX"') < 0` },
  { id: 'P4 pane-status reads the whole file as one string again', file: 'pane-status.js', pattern: 'past the string limit instead of crashing', from: "require('./sourced.js').eachLine(file, (line) => {", to: "fs.readFileSync(file, 'utf8').split('\\n').forEach((line) => {" },
  { id: 'U1 a read error is skipped', file: 'usage.js', pattern: 'cannot be read', from: "try { require('./sourced.js').eachLine(file, onLine); } catch (e) { throw unreadable(file, e); }", to: "try { require('./sourced.js').eachLine(file, onLine); } catch (e) { /* skipped */ }" },
  { id: 'U2 a stat error is skipped', file: 'usage.js', pattern: 'cannot be stat', from: 'try { st = fs.statSync(file); } catch (e) { throw unreadable(file, e); }', to: 'try { st = fs.statSync(file); } catch (e) { continue; }' },
  { id: 'U3 the command line lets the error through uncaught', file: 'usage.js', pattern: 'command line', from: "try { r = build(opts); } catch (e) { console.error(`usage.js: ${e.message}`); process.exit(1); }", to: 'r = build(opts);' },
  { id: 'U4 usage reads the whole file as one string again, skipping on error', file: 'usage.js', pattern: 'counts every response', from: "try { require('./sourced.js').eachLine(file, onLine); } catch (e) { throw unreadable(file, e); }", to: "try { fs.readFileSync(file, 'utf8').split('\\n').forEach(onLine); } catch (e) { /* skipped */ }" },
  { id: 'O1 offramp-check reads the whole file as one string again', file: 'offramp-check.js', pattern: 'offramp-check', from: "require('./sourced.js').eachLine(file, (line) => {", to: "fs.readFileSync(file, 'utf8').split('\\n').forEach((line) => {" },
];
function tree() { const d = path.join(ROOT, String(Date.now())); fs.cpSync(SRC, d, { recursive: true, filter: (p) => !/\.mutant-|node_modules/.test(p) }); return d; }
function run(dir, pattern) {
  const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== 'NODE_TEST_CONTEXT'));
  const r = spawnSync(process.execPath, ['--test', ...(pattern ? ['--test-name-pattern', pattern] : []), path.join(dir, 'big-transcript.test.js')], { cwd: dir, env, encoding: 'utf8', windowsHide: true, timeout: 15 * 60 * 1000 });
  const out = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, ''), n = (k) => Number((out.match(new RegExp(`ℹ ${k} (\\d+)`)) || [])[1]);
  return { tests: n('tests'), pass: n('pass'), fail: n('fail'), out };
}
fs.mkdirSync(ROOT, { recursive: true });
let applied = 0, caught = 0, notApplied = 0;
try {
  { const d = tree(); const r = run(d, null); console.log(`CONTROL: tests ${r.tests}, pass ${r.pass}, fail ${r.fail}`); fs.rmSync(d, { recursive: true, force: true }); if (r.fail || !r.tests) { console.log(r.out.slice(-1500)); process.exit(3); } }
  for (const m of M) {
    if (ONLY && !m.id.startsWith(ONLY)) continue;
    const d = tree(), f = path.join(d, m.file), s = fs.readFileSync(f, 'utf8'), k = s.split(m.from).length - 1;
    if (k !== 1) { notApplied++; console.log(`${m.id}: NOT APPLIED (${k} occurrences)`); fs.rmSync(d, { recursive: true, force: true }); continue; }
    applied++; fs.writeFileSync(f, s.replace(m.from, () => m.to));
    const r = run(d, m.pattern);
    if (r.fail > 0) caught++;
    console.log(`${m.id}: ${r.fail > 0 ? 'caught' : 'NOT CAUGHT'} (${r.fail} of ${r.tests} failed, pattern "${m.pattern}")`);
    fs.rmSync(d, { recursive: true, force: true });
  }
} finally { fs.rmSync(ROOT, { recursive: true, force: true }); }
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${notApplied}`);
