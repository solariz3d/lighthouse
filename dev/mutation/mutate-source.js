/* Registered mutation for state-block.js's TRIGGER TABLE (sourceSection).
 *
 * Replaces mutate-cards.js: cardSection was superseded by sourceSection on 2026-08-22, ~40 minutes
 * after it shipped, because a card DESCRIPTION answers "what is this about" and a TRIGGER answers
 * "the situation is now" -- and the injected content that measurably gets used in this room is the
 * kind indexed to the present moment.
 *
 * The mutants are the ways a trigger table degrades into a decoration: pointing at nothing,
 * silently omitting a card, lying about a target, or vanishing from the block while its unit tests
 * stay green. That last one is not hypothetical -- mutate-cards.js caught exactly it on its first
 * run, which is why the delivery test exists.
 *
 * Run: node dev/mutation/mutate-source.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const SRC = path.join(REPO, 'consonance', 'tools', 'state-block.js');
const TEST = path.join(REPO, 'consonance', 'tools', 'state-block.test.js');
const orig = fs.readFileSync(SRC, 'utf8');

const strip = (t) => t.replace(/\x1b\[[0-9;]*m/g, '');
function suite() {
  try { execFileSync(process.execPath, [TEST], { encoding: 'utf8', cwd: path.dirname(TEST) }); return { code: 0, out: '' }; }
  catch (e) { return { code: e.status === undefined ? 1 : e.status, out: strip((e.stdout || '') + (e.stderr || '')) }; }
}
const named = (r) => [...new Set([...r.out.matchAll(/[✖x] (.+?)(?: \(|\n|$)/g)].map((m) => m[1].trim()))]
  .filter((n) => n && !n.startsWith('failing tests')).slice(0, 2);

const MUTANTS = [
  ['point at nothing: parse the whole file, not just the TRIGGERS section',
    (s) => s.replace('  for (let i = start + 1; i < lines0.length; i++) {\n    if (/^##\\s/.test(lines0[i])) break;',
                     '  for (let i = 0; i < lines0.length; i++) {')],

  ['go silent: drop the orphan-card audit',
    (s) => s.replace("    if (orphans.length) lines.push('NO TRIGGER for '", "    if (false) lines.push('NO TRIGGER for '")],

  ['lie about a target: shorten non-path targets too',
    (s) => s.replace("  const short = (t) => /\\.md$/.test(t) ?", "  const short = (t) => true ?")],

  ['vanish: remove the section from the block while its unit tests stay green',
    (s) => s.replace('instrumentSection(), sourceSection(), nameSection()', 'instrumentSection(), nameSection()')],

  ['fail quietly: emit an empty table instead of FAILED when nothing parses',
    (s) => s.replace("if (!rows.length) return { title: 'triggers', cmd: 'cat ' + SRC, lines: ['FAILED: no trigger rows parsed from ' + SRC] };",
                     "if (!rows.length) return { title: 'triggers', cmd: 'cat ' + SRC, lines: [] };")],
];

const base = suite();
console.log('baseline: exit=' + base.code + (base.code === 0 ? ' (green)' : ' RED — fix before mutating'));
if (base.code !== 0) { console.log(base.out.slice(-700)); process.exit(1); }

let killed = 0, applied = 0;
for (const [name, fn] of MUTANTS) {
  const m = fn(orig);
  if (m === orig) { console.log('NOT APPLIED  ' + name + '   <-- anchor drifted; proves nothing'); continue; }
  applied++;
  fs.writeFileSync(SRC, m);
  const r = suite();
  fs.writeFileSync(SRC, orig);
  if (r.code !== 0) killed++;
  console.log((r.code !== 0 ? 'KILLED   ' : 'SURVIVED ') + name);
  if (r.code !== 0) console.log('           red: ' + named(r).join(' | '));
}

fs.writeFileSync(SRC, orig);
console.log('\nrestored byte-identical: ' + (fs.readFileSync(SRC, 'utf8') === orig));
console.log('mutation score: ' + killed + '/' + applied + (applied === MUTANTS.length ? '' : '  (of ' + MUTANTS.length + ' written)'));
process.exit(killed === applied && applied === MUTANTS.length ? 0 : 1);
