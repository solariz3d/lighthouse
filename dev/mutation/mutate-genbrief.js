/* Registered mutation for gen-brief.ps1's leak self-check.
 *
 * The script's own header says it refuses and DELETES its output rather than writing a quiet leak.
 * That claim was true for five identity patterns and untested for the three added 2026-08-22 --
 * the SHARED-PAST and FINGERPRINT classes, which the guard structurally could not see before a
 * cold read found them by feel.
 *
 * Each mutant reintroduces one leak INTO THE MASTER (exo_memory/BOOT.md), runs the generator, and
 * asserts it refuses. Restores the master byte-identically and regenerates the brief afterwards --
 * a refusal deletes brief/BOOT.md, so leaving it deleted would be a worse state than we started in.
 *
 * Run: node dev/mutation/mutate-genbrief.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const MASTER = path.join(REPO, 'exo_memory', 'BOOT.md');
const OUT = path.join(REPO, 'consonance', 'src-tauri', 'brief', 'BOOT.md');
const GEN = path.join(REPO, 'consonance', 'src-tauri', 'gen-brief.ps1');

const origMaster = fs.readFileSync(MASTER);
const origOut = fs.existsSync(OUT) ? fs.readFileSync(OUT) : null;

function gen() {
  try {
    const out = execFileSync('powershell', ['-ExecutionPolicy', 'Bypass', '-File', GEN],
      { encoding: 'utf8', cwd: path.dirname(GEN) });
    return { ok: true, out };
  } catch (e) { return { ok: false, out: (e.stdout || '') + (e.stderr || '') }; }
}

/* Injected into a paragraph the generator does not itself rewrite, so a failure to refuse is a
 * failure of the GUARD and never an artefact of another transformation eating the text. */
const HOST = '## Honest status';
/* Each mutant declares what SHOULD happen, because the two classes behave differently and a
 * harness that expected one outcome for both would report a false failure -- as this one did on
 * its first run.
 *
 *   'refuse'      the leak survives every transformation and must trip the self-check.
 *   'neutralise'  transformation 1 REWRITES the phrase before the check ever sees it. The correct
 *                 outcome is a clean generate whose output does not contain the phrase. The
 *                 self-check's own 'solariz3d' pattern is therefore not a leak detector at all --
 *                 it is a CANARY ON TRANSFORMATION 1, and can only fire if that replacement stops
 *                 running. Worth keeping, worth not mistaking for the other thing.
 */
const MUTANTS = [
  ["shared past: 'we've watched'", "we've watched it happen together. ", 'refuse'],
  ['fingerprint: the project name', 'The keeper built the audio-reactive cosmic-web visualizer. ', 'refuse'],
  ['fingerprint: the shift', 'An overnight-shift thinker wrote this. ', 'refuse'],
  ['identity: the handle (neutralised, not refused)', 'Written by solariz3d. ', 'neutralise'],
  ['build log: pending decision', 'Pending his call. ', 'refuse'],
  ['build log: dev-repo command', 'Run cargo tauri dev to start. ', 'refuse'],
  ['fingerprint: the second phrasing', 'Signal is Electron, so we matched it. ', 'refuse'],
];

const base = gen();
console.log('baseline: ' + (base.ok ? 'generated clean' : 'ALREADY REFUSING -- fix before mutating'));
if (!base.ok) { console.log(base.out.slice(-500)); process.exit(1); }

let killed = 0, applied = 0;
for (const [name, phrase, expect] of MUTANTS) {
  const src = origMaster.toString('utf8');
  if (!src.includes(HOST)) { console.error('host anchor missing'); break; }
  applied++;
  fs.writeFileSync(MASTER, src.replace(HOST, HOST + '\n\n' + phrase), 'utf8');
  const r = gen();
  fs.writeFileSync(MASTER, origMaster);
  let pass, why;
  if (expect === 'refuse') {
    const refused = !r.ok && /REFUSED/i.test(r.out);
    const deleted = !fs.existsSync(OUT);
    pass = refused && deleted;
    why = !refused ? '   <-- the guard did NOT refuse' : (!deleted ? '   <-- refused but left the output' : '');
  } else {
    // must generate cleanly AND the phrase must be absent from the output
    const wrote = r.ok && fs.existsSync(OUT);
    const clean = wrote && !/solariz3d/i.test(fs.readFileSync(OUT, 'utf8'));
    pass = wrote && clean;
    why = !wrote ? '   <-- refused when it should have neutralised' : (!clean ? '   <-- handle survived into the output' : '');
  }
  if (pass) killed++;
  console.log((pass ? 'KILLED   ' : 'SURVIVED ') + name + '  [' + expect + ']' + why);
}

// restore: master byte-identical, and regenerate the brief the refusals deleted
fs.writeFileSync(MASTER, origMaster);
const final = gen();
const masterOk = Buffer.compare(fs.readFileSync(MASTER), origMaster) === 0;
console.log('\nmaster restored byte-identical: ' + masterOk);
console.log('brief regenerated: ' + (final.ok && fs.existsSync(OUT)));
if (origOut && fs.existsSync(OUT)) {
  console.log('brief byte-identical to before: ' + (Buffer.compare(fs.readFileSync(OUT), origOut) === 0));
}
console.log('mutation score: ' + killed + '/' + applied);
process.exit(killed === applied && masterOk && final.ok ? 0 : 1);
