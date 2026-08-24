#!/usr/bin/env node
/* mutate-resolve-pane — prove resolve_pane_tests can fail.
 *
 * The defect these tests pin (pane E, 2026-08-24): `resolve_pane` fell through to
 * `keys().find(|k| k.starts_with(t))` over a HashMap. MAIN_SID and LIBRARIAN_SID share seven
 * characters ("0c0c0c0"), so a short target chose between the two ACTING seats on unspecified
 * iteration order — silently, and in the direction that SUCCEEDS. Nothing errored; the caller
 * learned which seat it had addressed only by consequence.
 *
 * That matters more after the librarian is given injecting power, because then BOTH ends of the
 * collision are seats that can be delivered into. So the guard has to be proven able to fail
 * before the widening lands on top of it.
 *
 * Every mutant below is a plausible future edit — a revert, a loosened arm, a reworded message —
 * not a synthetic break. Anchors are normalised to LF before matching (the CRLF miss class).
 *
 * NOTE: the suite is run FILTERED to resolve_pane_tests. `shelf_tests::the_shelf_reaches_the_intake`
 * is red at HEAD for an unrelated reason (the librarian intake orders the shelf before the room);
 * running the whole bin here would report that pre-existing red as this guard's result.
 *
 * Run: node dev/mutation/mutate-resolve-pane.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const RS = path.join(REPO, 'consonance', 'src-tauri', 'src', 'main.rs');
const TAURI = path.join(REPO, 'consonance', 'src-tauri');
const FILTER = 'resolve_pane_tests';

const MUTANTS = [
  { name: 'the revert: first-match instead of unique-match (the original defect, restored)',
    from: '    match_prefix(live, t)\n}',
    to:   '    live.iter().find(|k| k.starts_with(t)).cloned().ok_or_else(|| format!("no live pane matches \'{t}\'"))\n}' },

  /* DELIVERY. The first run of this harness caught the tests rather than the code: with the name
   * and id lookups still inside the live function, reverting it to `keys().find(..)` left
   * match_prefix intact and all six tests green. This mutant is that exact edit, kept so the
   * delegation can never quietly be bypassed again. */
  { name: 'resolve_pane stops delegating and matches prefixes itself (the delivery bypass)',
    from: '    resolve_from(&n, &live, target)\n}',
    to:   '    let _ = n;\n    live.iter().find(|k| k.starts_with(target.trim())).cloned().ok_or_else(|| "no live pane".to_string())\n}' },

  { name: 'someone decides two matches is close enough',
    from: '        1 => Ok(hits[0].clone()),',
    to:   '        1 | 2 => Ok(hits[0].clone()),' },

  { name: 'the empty-target guard is dropped (empty matches every id by starts_with)',
    from: '    if t.is_empty() {\n        return Err("refused — empty target".to_string());\n    }\n',
    to:   '' },

  { name: 'the collision is reworded to read like a miss — the two facts print one sentence again',
    from: '                "refused — \'{t}\' is AMBIGUOUS: it matches {} live panes ({}). \\',
    to:   '                "no live pane matches \'{t}\' ({} candidates, {}). \\' },

  { name: 'the refusal stops naming WHICH seats collided, so the caller cannot disambiguate',
    from: '                shown.join(", ")',
    to:   '                String::new()' },

  { name: "a pane may take the orchestrator's own address again",
    from: 'const RESERVED_SEAT_NAMES: &[&str] = &["M", "LIB"];',
    to:   'const RESERVED_SEAT_NAMES: &[&str] = &["LIB"];' },

  { name: "a pane may take the librarian's address again",
    from: 'const RESERVED_SEAT_NAMES: &[&str] = &["M", "LIB"];',
    to:   'const RESERVED_SEAT_NAMES: &[&str] = &["M"];' },
];

function runSuite() {
  const r = spawnSync('cargo', ['test', '--bin', 'consonance', FILTER], {
    cwd: TAURI, encoding: 'utf8', shell: true,
  });
  const out = (r.stdout || '') + (r.stderr || '');
  // A mutant that does not COMPILE is caught too — it is still "the edit cannot land unnoticed".
  if (/^error(\[|:)/m.test(out) && !/test result:/.test(out)) return { caught: true, how: 'did not compile' };
  const m = out.match(/test result: (\w+)\. (\d+) passed; (\d+) failed/);
  if (!m) return { caught: null, how: 'no test result line — could not classify' };
  return { caught: Number(m[3]) > 0, how: `${m[2]} passed, ${m[3]} failed` };
}

const original = fs.readFileSync(RS, 'utf8');
const crlf = original.includes('\r\n');
const lf = original.split('\r\n').join('\n');
const write = (s) => fs.writeFileSync(RS, crlf ? s.split('\n').join('\r\n') : s);

let applied = 0, caught = 0, notApplied = 0, unclassified = 0;
console.log('mutate-resolve-pane — ' + MUTANTS.length + ' mutant(s), suite filtered to ' + FILTER + '\n');

try {
  // baseline first: a guard that is already red proves nothing about any mutant
  const base = runSuite();
  if (base.caught !== false) {
    console.error('BASELINE IS NOT GREEN (' + base.how + ') — refusing to run. A red baseline makes');
    console.error('every mutant read as caught, which is the failure this harness exists to avoid.');
    process.exit(2);
  }
  console.log('baseline: ' + base.how + '\n');

  for (const mut of MUTANTS) {
    if (!lf.includes(mut.from)) {
      notApplied++;
      console.log('NOT APPLIED  ' + mut.name);
      console.log('             anchor absent — this mutant proves NOTHING, do not count it as a pass');
      continue;
    }
    write(lf.replace(mut.from, mut.to));
    applied++;
    const r = runSuite();
    if (r.caught === null) { unclassified++; console.log('UNCLASSIFIED ' + mut.name + '  (' + r.how + ')'); }
    else if (r.caught) { caught++; console.log('caught       ' + mut.name + '  (' + r.how + ')'); }
    else { console.log('SURVIVED     ' + mut.name + '  (' + r.how + ')'); }
    write(lf);
  }
} finally {
  write(lf); // the source goes back whatever happened, including on a throw
}

console.log('\napplied ' + applied + ' / caught ' + caught + ' / NOT APPLIED ' + notApplied +
            (unclassified ? ' / UNCLASSIFIED ' + unclassified : ''));
process.exit(caught === applied && notApplied === 0 && unclassified === 0 ? 0 : 1);
