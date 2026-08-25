'use strict';
/* Mutation harness for the submit-gap fix and the unconfirmed string (2026-08-25).
 *
 * WHY IT EXISTS. The July fix for this same defect was a bare literal inside an I/O function, so
 * nothing could ask whether it was still correct. It was not: a 3.7KB brief to a pane idle for 54
 * minutes lodged in the composer exactly as in July. A test that cannot go red is a comment, so
 * each mutant below is a way the fix could be undone by someone tidying, and each must produce a
 * RED cargo test.
 *
 * Reports applied / caught / NOT APPLIED. A NOT APPLIED mutant proves nothing and is reported as
 * such rather than counted as a pass.
 */
const fs = require('fs');
const { execSync } = require('child_process');

const SRC = 'C:/Consonance/lighthouse/consonance/src-tauri/src/main.rs';
const CWD = 'C:/Consonance/lighthouse/consonance/src-tauri';
const original = fs.readFileSync(SRC, 'utf8');

const MUTANTS = [
  {
    name: 'the gap goes back to a flat 120ms (the July fix, which did not hold)',
    from: 'let scaled = FLOOR_MS.saturating_add(payload_bytes as u64 / BYTES_PER_MS);',
    to:   'let scaled = FLOOR_MS;',
  },
  {
    name: 'the ceiling is removed — a big paste stalls the chair',
    from: 'scaled.min(CEILING_MS)',
    to:   'scaled',
  },
  {
    name: 'the floor is dropped below the known-good July value',
    from: 'const FLOOR_MS: u64 = 120;',
    to:   'const FLOOR_MS: u64 = 0;',
  },
  {
    name: 'the unconfirmed string goes back to the delivered-shaped wording',
    from: '"NOT CONFIRMED DELIVERED to {short} — the text may be sitting UNSUBMITTED in that pane\'s \\',
    to:   '"written to {short} — UNCONFIRMED (no render yet) placeholder \\',
  },
  {
    name: 'the recovery action is trimmed out of the string',
    from: 'if the text is in the box, press Enter there. Do NOT \\',
    to:   'it may or may not have arrived. Do NOT \\',
  },
  {
    name: 'THE DELIVERY: the call site bypasses the function and inlines a literal',
    from: '_ => unconfirmed_delivery_line(short_id(&tid)),',
    to:   '_ => format!("written to {} — UNCONFIRMED", short_id(&tid)),',
  },
];

let applied = 0, caught = 0, notApplied = 0;

for (const m of MUTANTS) {
  const hits = original.split(m.from).length - 1;
  if (hits !== 1) {
    console.log('  NOT APPLIED  ' + m.name + '  (anchor matched ' + hits + ' times)');
    notApplied++;
    continue;
  }
  fs.writeFileSync(SRC, original.split(m.from).join(m.to));
  applied++;
  let red = false;
  try {
    execSync('cargo test --bin consonance', { cwd: CWD, stdio: 'pipe' });
  } catch (_) {
    red = true;
  }
  fs.writeFileSync(SRC, original);
  if (red) { caught++; console.log('  caught       ' + m.name); }
  else { console.log('  MISSED       ' + m.name); }
}

// Restore is not enough on its own: prove the restored tree is green, or a green run above could
// have been a tree that never compiled in the first place.
let green = true;
try { execSync('cargo test --bin consonance', { cwd: CWD, stdio: 'pipe' }); } catch (_) { green = false; }

console.log('');
console.log('applied ' + applied + ' / caught ' + caught + ' / NOT APPLIED ' + notApplied);
console.log('restored tree green: ' + green);
process.exit(caught === applied && notApplied === 0 && green ? 0 : 1);
