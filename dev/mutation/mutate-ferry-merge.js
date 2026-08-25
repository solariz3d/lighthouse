// Registered mutation for the ferry.js MERGE fix, run against the REAL tool and its REAL test.
//
// WHY IT EXISTS. `--record <sha> <pane>` deduped on the sha alone, so a commit routed to a second
// pane hit the idempotency check, wrote nothing, returned null and exited 0 - printing exactly
// what a genuine duplicate printed. The pane list therefore under-reported every multi-routed
// commit, silently. The fix merges per (sha, pane) and appends rather than rewriting.
//
// A test that goes green on the fix proves nothing on its own: the same green is available from a
// test that asserts nothing, and from a join that unions every row into every commit. So each
// mutant below reintroduces one specific way of getting this wrong - four of them are the shapes
// the fix was actually written against, and the fifth is the wrong fix that would satisfy a
// careless version of the merge test while making the pane list wrong in the other direction.
//
// Mutates the real file, runs the real test, restores unconditionally, and checks the restore is
// byte-identical. A mutant whose text does not apply is reported as NOT APPLIED and scored as a
// failure, because an unapplied mutation is a green that measured nothing.
//
//   node dev/mutation/mutate-ferry-merge.js
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const TOOL = path.join(ROOT, 'consonance', 'tools', 'ferry.js');
const TEST = path.join(ROOT, 'consonance', 'tools', 'ferry.test.js');

const CR = String.fromCharCode(13), LF = String.fromCharCode(10);
// The tool is stored CRLF. Anchors are written LF here for legibility and converted before use,
// so the harness never rewrites line endings it did not mean to touch.
const crlf = (t) => t.split(CR + LF).join(LF).split(LF).join(CR + LF);

function runTest() {
  try {
    return { code: 0, out: execFileSync(process.execPath, [TEST], { encoding: 'utf8', cwd: ROOT }) };
  } catch (e) {
    return { code: e.status === undefined ? -1 : e.status, out: (e.stdout || '') + (e.stderr || '') };
  }
}

const summarise = (r) => {
  const line = r.out.split(LF).find((l) => /passed, \d+ failed/.test(l)) || '(no summary line)';
  const failed = [...r.out.matchAll(/^ {2}FAIL (.+)$/gm)].map((m) => m[1].trim());
  return `exit=${r.code}  ${line.trim()}` + (failed.length ? LF + failed.map((f) => `            killed by: ${f}`).join(LF) : '');
};

// [label, search, replace] - each search is verbatim shipped text.
const MUTANTS = [
  ['THE ORIGINAL DEFECT: dedupe on the sha alone, drop the second pane, return null',
   `  if (prior.length && !added.length) {`,
   `  if (prior.length) return null;
  if (false) {`],

  ['the no-op stops being distinguishable: a duplicate returns null again',
   `    return { sha, panes: [...known], added: [], already: true, ferried_at: prior[0].ferried_at };`,
   `    return null;`],

  ['the join stops unioning: only the first row\'s panes are reported',
   `    return { ...c, ferry: { ...group[0], panes: [...new Set(group.flatMap(panesOf))] } };`,
   `    return { ...c, ferry: { ...group[0] } };`],

  ['the merge rewrites the timestamp: the LAST row wins, so latency becomes time-to-SLOWEST-hop',
   `    return { ...c, ferry: { ...group[0], panes: [...new Set(group.flatMap(panesOf))] } };`,
   `    return { ...c, ferry: { ...group[group.length - 1], panes: [...new Set(group.flatMap(panesOf))] } };`],

  ['THE WRONG FIX: union across every row regardless of sha - every commit credited with every pane',
   `    const group = usable.filter(r => c.sha.startsWith(r.sha) || r.sha.startsWith(c.sha));`,
   `    const group = usable.filter(r => c.sha.startsWith(r.sha) || r.sha.startsWith(c.sha) || true);`],
];

const base = runTest();
console.log('baseline:', summarise(base));
if (base.code !== 0) {
  console.error('baseline is not green - refusing to score mutants against a red tree.');
  process.exit(2);
}

const original = fs.readFileSync(TOOL, 'utf8');
let killed = 0;

for (const [label, search, replace] of MUTANTS) {
  const s = crlf(search), rep = crlf(replace);
  if (!original.includes(s)) {
    console.log(`NOT APPLIED  ${label}`);
    console.log('             the mutant text is not in the shipped file - this scored nothing.');
    continue;
  }
  fs.writeFileSync(TOOL, original.replace(s, rep));
  const mutated = fs.readFileSync(TOOL, 'utf8') !== original;
  const r = runTest();
  fs.writeFileSync(TOOL, original);
  const restored = fs.readFileSync(TOOL, 'utf8') === original;

  const dead = mutated && r.code !== 0;
  if (dead) killed++;
  console.log(`${dead ? 'KILLED  ' : 'SURVIVED'}  ${label}`);
  console.log(`            ${summarise(r)}`);
  console.log(`            applied=${mutated}  restored-byte-identical=${restored}`);
  if (!restored) { console.error('RESTORE FAILED - stopping before another mutant lands on a dirty file.'); process.exit(3); }
}

const after = runTest();
console.log('after   :', summarise(after));
console.log(`mutation score: ${killed}/${MUTANTS.length}`);
process.exit(killed === MUTANTS.length && after.code === 0 ? 0 : 1);
