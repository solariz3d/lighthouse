// Registered mutation for portable-paths.js, run against the REAL repo rather than a fixture.
// The fixture test in portable-paths.test.js proves the mechanism; this proves the guard is
// wired to the actual tree — that its scope really covers the shipped files, and that a path
// landing in one of them today would fail the check that runs on this machine.
//
// Each mutant is the VERBATIM text of an incident this repo has already had, appended to the
// real file it would plausibly land in. Mutates, runs the guard, restores unconditionally.
//
//   node dev/mutation/mutate-portable-paths.js
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const GUARD = path.join(ROOT, 'consonance', 'tools', 'portable-paths.js');

function guard() {
  try {
    return { code: 0, out: execFileSync(process.execPath, [GUARD], { encoding: 'utf8', cwd: ROOT }) };
  } catch (e) { return { code: e.status, out: (e.stdout || '') + (e.stderr || '') }; }
}

const summarise = (r) => {
  const first = r.out.split('\n').find((l) => /green|RED|ZERO|no baseline/.test(l)) || '(no summary)';
  const verdicts = [...new Set([...r.out.matchAll(/^ {2}(DRIVE|DISGUISED) +(\S+)/gm)].map((m) => m[2]))];
  return `exit=${r.code}  ${first.trim()}` + (verdicts.length ? `  [${verdicts.join(',')}]` : '');
};

// [file to mutate, label, appended line] — real files, real historical text.
const MUTANTS = [
  ['consonance/hooks/blind.js',
   'guard-census tool line (28f749f:61) — a foreign user home',
   `const BLACKBOX = "C:/Users/nname/Desktop/blackbox";\n`],
  ['consonance/tools/ferry.js',
   'the env-override-with-a-one-box-default shape (24 live instances)',
   `const NEW_LEDGER = process.env.NOPE || 'C:\\\\Consonance\\\\data\\\\new.jsonl';\n`],
  ['consonance/src-tauri/src/main.rs',
   'main.rs OneDrive fallback (:376) — invisible to a C:\\ grep',
   `fn _mutant() -> String { format!("{}\\\\OneDrive\\\\Desktop\\\\projects\\\\lighthouse\\\\x", home()) }\n`],
  ['consonance/tools/guard-census.test.js',
   'guard-census TEST line (28f749f:99) — inside a *.test.js, where a blanket exemption hides it',
   `const _f = path.join("C:/Users/nname/Desktop/lighthouse/consonance/src-tauri", "tests", "arch_test.rs");\n`],
];

const base = guard();
console.log('baseline:', summarise(base));
if (base.code !== 0) {
  console.error('baseline is not green — refusing to score mutants against a red tree.');
  process.exit(2);
}

let killed = 0;
for (const [rel, label, line] of MUTANTS) {
  const p = path.join(ROOT, rel);
  const orig = fs.readFileSync(p, 'utf8');
  fs.writeFileSync(p, orig + line);
  const r = guard();
  fs.writeFileSync(p, orig);
  const identical = fs.readFileSync(p, 'utf8') === orig;
  const dead = r.code === 1 && r.out.includes(rel.split('/').pop());
  if (dead) killed++;
  console.log(`${dead ? 'KILLED  ' : 'SURVIVED'}  ${rel}`);
  console.log(`          ${label}`);
  console.log(`          ${summarise(r)}  restored-byte-identical=${identical}`);
}

const after = guard();
console.log('after   :', summarise(after));
console.log(`mutation score: ${killed}/${MUTANTS.length}`);
process.exit(killed === MUTANTS.length && after.code === 0 ? 0 : 1);
