#!/usr/bin/env node
/* mutate-carrier-drift — prove carrier-drift.test.js can actually fail.
 *
 * WHY THIS ONE NEEDS IT MORE THAN MOST. Every failure mode of a propagation detector is SILENT
 * and prints GREEN. It has no crash state: a rotted pattern, an emptied trace list, a marker
 * check that stopped checking, a registry site quietly downgraded from `marked` to `mention` —
 * all of them produce a clean run and a reassuring number. The instrument this one replaces
 * failed exactly that way: `grep -rl "only decorrelated"` returned four files and looked like a
 * complete sweep, and the file it missed was the one the pass was named after.
 *
 * So "it has tests" is not the claim. The claim is that the suites go red on all twenty-one.
 *
 * THREE TARGETS. Half this tool's behaviour lives in DATA: a registry is not configuration here,
 * it is the armed half of the detector, and a mutation that weakens a pattern or relabels a site
 * is the most likely way this goes quietly blind. The third is the HOOK, because a detector
 * nobody fires is the exact thing registration 46 already describes. Mutants are marked
 * (registry) and (hook) below; the rest are the tool.
 *
 * A mutation that reports NOT APPLIED proves nothing and is reported loudly rather than counted.
 *
 * CRLF: anchors are matched against an LF-normalised copy and the original line endings are
 * restored, because an anchor miss against a CRLF file reports exactly like a passing mutant.
 *
 * Run: node dev/mutation/mutate-carrier-drift.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const TOOL = path.join(REPO, 'consonance', 'tools', 'carrier-drift.js');
const REG = path.join(REPO, 'consonance', 'tools', 'carrier-drift.registry.json');
const TEST = path.join(REPO, 'consonance', 'tools', 'carrier-drift.test.js');
const HOOK = path.join(REPO, 'consonance', 'hooks', 'carrier-drift-watch.js');
const HOOK_TEST = path.join(REPO, 'consonance', 'hooks', 'carrier-drift-watch.test.js');

const MUTANTS = [
  {
    name: 'collapse stops joining lines, so every anchor spanning a line break goes stale',
    file: TOOL,
    apply: (s) => s.replace("      if (out.length) { out += ' '; lineOf.push(at); }",
      "      if (out.length) { out += '\\n'; lineOf.push(at); }"),
  },
  {
    name: 'journals stop being traces — the telephone-game rule inverted',
    file: TOOL,
    apply: (s) => s.replace("  'exo_memory/journal/',\n", ''),
  },
  {
    name: 'a `marked` site no longer requires the marker (THE propagation failure, un-guarded)',
    file: TOOL,
    apply: (s) => s.replace("        if ((s.kind === 'marked' || s.kind === 'acknowledged') && !markerRe.test(doc.text)) {",
      '        if (false) {'),
  },
  {
    name: 'every occurrence counts as accounted for — the detector stops detecting',
    file: TOOL,
    apply: (s) => s.replace('        if (cover) { accounted++; continue; }',
      '        if (true) { accounted++; continue; }'),
  },
  {
    name: 'an anchor matching twice is accepted, so one entry silently excuses two occurrences',
    file: TOOL,
    apply: (s) => s.replace('        if (doc.text.indexOf(s.anchor, idx + 1) !== -1) {',
      '        if (false) {'),
  },
  {
    name: 'anchors are no longer required to contain the withdrawn wording',
    file: TOOL,
    apply: (s) => s.replace("      if (!new RegExp(w.pattern, 'i').test(s.anchor)) {", '      if (false) {'),
  },
  {
    name: 'an acknowledged exemption no longer has to say where the correction lives',
    file: TOOL,
    apply: (s) => s.replace("      if (s.kind === 'acknowledged' && !s.see) {", '      if (false) {'),
  },
  {
    name: 'a stale anchor is swallowed instead of reported',
    file: TOOL,
    apply: (s) => s.replace('        if (idx === -1) {', '        if (idx === -2) {'),
  },
  {
    name: 'a site naming a vanished file passes',
    file: TOOL,
    apply: (s) => s.replace('      if (!collapsed.has(s.file)) {', '      if (false) {'),
  },
  {
    name: 'an EMPTY registry reports green over everything (the unarmed instrument)',
    file: TOOL,
    apply: (s) => s.replace('  if (!Array.isArray(reg.withdrawals) || reg.withdrawals.length === 0) {',
      '  if (false) {'),
  },
  {
    name: 'the corpus walk descends into nothing, so a green run covers zero carriers',
    file: TOOL,
    apply: (s) => s.replace('      if (SKIP_DIRS.has(e.name)) continue;', '      continue;'),
  },
  {
    name: '(registry) the pattern becomes the room\'s own fixed-string grep — the wrapped, reworded re-assertion goes invisible',
    file: REG,
    apply: (s) => s.replace('"pattern": "only\\\\s+(?:\\\\w+\\\\s+){0,2}decorrelated"',
      '"pattern": "only decorrelated"'),
  },
  {
    name: '(registry) the marker matches anything, so no file can ever be an unmarked carrier',
    file: REG,
    apply: (s) => s.replace('"marker": "WITHDRAWN 2026-08-16|withdrawn in full|withdrew .{0,120}in full"',
      '"marker": "."'),
  },
  {
    name: '(registry) the 08-23 re-assertion is downgraded from `marked` to `mention`',
    file: REG,
    apply: (s) => s.replace('"anchor": " the keeper remains the only genuinely decorrelated reader. The case data c",\n          "kind": "marked"',
      '"anchor": " the keeper remains the only genuinely decorrelated reader. The case data c",\n          "kind": "mention"'),
  },

  // ── the hook. A detector nobody fires is registration 46's disease, so the wiring gets the
  // same treatment as the logic: every way it could go quietly useless, one edit at a time.
  {
    name: '(hook) the dream gate is removed - a hook instruments an anti-instruction',
    file: HOOK, test: HOOK_TEST,
    apply: (s) => s.replace('if (process.env.CONSONANCE_DREAM) process.exit(0);',
      'if (false) process.exit(0);'),
  },
  {
    name: '(hook) it speaks on every turn - dream-watch\'s 27 days, reproduced',
    file: HOOK, test: HOOK_TEST,
    apply: (s) => s.replace('  const speak = res.red && !(sameAsLast && withinCooldown);',
      '  const speak = true;'),
  },
  {
    name: '(hook) it never speaks - the detector runs and reaches nobody',
    file: HOOK, test: HOOK_TEST,
    apply: (s) => s.replace('  const speak = res.red && !(sameAsLast && withinCooldown);',
      '  const speak = false;'),
  },
  {
    name: '(hook) the cooldown is dropped, so an outstanding red nags every turn',
    file: HOOK, test: HOOK_TEST,
    apply: (s) => s.replace('  const withinCooldown = Number(prev.at || 0) > Date.now() - COOLDOWN_H * 3600 * 1000;',
      '  const withinCooldown = false;'),
  },
  {
    name: '(hook) a CHANGED finding is treated as the same one and swallowed by the cooldown',
    file: HOOK, test: HOOK_TEST,
    apply: (s) => s.replace('  const sameAsLast = prev.fp === fp;', '  const sameAsLast = true;'),
  },
  {
    name: '(hook) the ledger goes nowhere - silent-because-working stops being distinguishable from silent-because-absent',
    file: HOOK, test: HOOK_TEST,
    apply: (s) => s.replace("const LEDGER = path.join(DATA, 'carrier-drift.jsonl');",
      "const LEDGER = path.join(DATA, 'no-such-dir', 'carrier-drift.jsonl');"),
  },
  {
    name: '(hook) going green never re-arms, so the next red is suppressed as a repeat',
    file: HOOK, test: HOOK_TEST,
    apply: (s) => s.replace("  } else if (!res.red && prev.fp && prev.fp !== 'green') {",
      '  } else if (false) {'),
  },
];

const originals = new Map();
for (const f of [TOOL, REG, HOOK]) {
  const raw = fs.readFileSync(f, 'utf8');
  originals.set(f, { crlf: raw.includes('\r\n'), lf: raw.split('\r\n').join('\n') });
}
const restore = (f) => {
  const o = originals.get(f);
  fs.writeFileSync(f, o.crlf ? o.lf.split('\n').join('\r\n') : o.lf);
};
const write = (f, text) => {
  const o = originals.get(f);
  fs.writeFileSync(f, o.crlf ? text.split('\n').join('\r\n') : text);
};

let applied = 0, caught = 0, notApplied = 0;
try {
  for (const m of MUTANTS) {
    const base = originals.get(m.file).lf;
    const mutated = m.apply(base);
    if (mutated === base) {
      notApplied++;
      console.log('  NOT APPLIED  ' + m.name);
      console.log('               (the anchor did not match - this mutation proves NOTHING)');
      continue;
    }
    applied++;
    write(m.file, mutated);
    const r = spawnSync(process.execPath, ['--test', m.test || TEST], { encoding: 'utf8' });
    restore(m.file);
    const red = r.status !== 0;
    if (red) caught++;
    console.log('  ' + (red ? 'CAUGHT      ' : 'SURVIVED    ') + m.name);
    if (!red) console.log('               the suite passed over a real defect - it is not guarding this');
  }
} finally {
  for (const f of [TOOL, REG, HOOK]) restore(f);
}

console.log('');
console.log('  applied ' + applied + ' · caught ' + caught + ' · NOT APPLIED ' + notApplied +
  '  (of ' + MUTANTS.length + ')');
if (notApplied) console.log('  a NOT APPLIED mutant is not a pass: the harness never reached the code.');
process.exit(caught === applied && notApplied === 0 ? 0 : 1);
