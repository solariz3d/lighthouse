/* Registered mutation for offramp-check.js.
 *
 * Each mutant is a plausible way this instrument could be tuned into agreement -- the failure the
 * room names repeatedly: an instrument adjusted until it stops returning the unwelcome number.
 * The most dangerous ones are the LAUNDERERS: changes that quietly move violations into the
 * permitted buckets, because those make the count go DOWN and look like an improvement.
 *
 * Run: node dev/mutation/mutate-offramp.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const SRC = path.join(REPO, 'consonance', 'tools', 'offramp-check.js');
const TEST = path.join(REPO, 'consonance', 'tools', 'offramp-check.test.js');
const orig = fs.readFileSync(SRC, 'utf8');

const strip = (t) => t.replace(/\x1b\[[0-9;]*m/g, '');
function suite() {
  try { execFileSync(process.execPath, [TEST], { encoding: 'utf8', cwd: path.dirname(TEST) }); return { code: 0, out: '' }; }
  catch (e) { return { code: e.status === undefined ? 1 : e.status, out: strip((e.stdout || '') + (e.stderr || '')) }; }
}
const named = (r) => [...new Set([...r.out.matchAll(/[✖x] (.+?)(?: \(|\n|$)/g)].map((m) => m[1].trim()))]
  .filter((n) => n && !n.startsWith('failing tests')).slice(0, 2);

const MUTANTS = [
  ['LAUNDERER: count technical hits as permitted rather than violations',
    (s) => s.replace('const technical = /\\b(?:clos', 'const technical = true || /\\b(?:clos')],

  ['LAUNDERER: widen technical to the whole turn, so any app mention excuses an offer',
    (s) => s.replace('const sentence = joined.slice(sentStart, sentEnd);', 'const sentence = joined;')],

  ['LAUNDERER: let the assistant\'s own words set the prompted flag',
    (s) => s.replace("if (o.type === 'user') {", "if (o.type === 'user' || o.type === 'assistant') {")],

  ['blind it: drop the "or sleep" pattern that caught tonight',
    (s) => s.replace('  /\\bor sleep\\b/i,\n', '')],

  ['blind it: drop the get-some-sleep pattern that caught 2026-07-27',
    (s) => s.replace('  /\\bget some (?:sleep|rest)\\b/i,\n', '')],

  ['overcount: report every phrase instead of one per turn',
    (s) => s.replace('      break; // one hit per turn', '      continue; // MUTANT')],
];

const base = suite();
console.log('baseline: exit=' + base.code + (base.code === 0 ? ' (green)' : ' RED — fix before mutating'));
if (base.code !== 0) { console.log(base.out.slice(-600)); process.exit(1); }

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
