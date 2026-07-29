// TRIGGER #2 — a correction that lands beside its target instead of on it goes RED here.
//
// WHY THIS IS A SEPARATE FILE. residue.js measures this already and prints "CORRECTIONS THAT
// DELETE NOTHING — 4 of 6". It will never fail on it, by its own instruction:
//
//     "If this file ever grows a threshold, a grade, or the word 'should', it has become the
//      lifeguard and should be deleted rather than tuned."
//
// That refusal is correct and it is exactly why residue stayed a SENSOR. Every shape it prints
// has an innocent reading it cannot rule out, and a tool that decided on those would be lying.
// So the judgement lives here, in a file that is allowed to be wrong out loud, and residue
// stays the thing that only reports. Sensor and trigger, two files, on purpose.
//
// WHAT IT GUARDS. muscle_map.md ran +982 / -1 across two days. A commit titled "Track 2
// corrected" filed ninety lines BELOW the Track 2 it corrected, leaving the overturned version
// in place at full authority with no marker — so the file's oldest wrong version and its newest
// right one were indistinguishable by form. mapindex.py later found exactly one silent
// supersession in 25 sections; this stops the second one being created.
//
// THE ROOM'S OWN LAW, which is the whole reason this exists rather than another paragraph:
// naming an invariant does not install it. Only a test that fails installs it. Carrier-drift
// was named in the map and re-ran three times inside two hours with the entry sitting at the
// top of the log. Articulation is not installation.
//
// WHAT COUNTS AS LANDING. Deleting a line is one way. Marking one in place is the other and is
// usually the better one — the room settled on struck-in-place with the original text kept
// verbatim, because maintenance law 2 forbids rewriting a master from memory and a strike
// rewrites nothing. So this passes a correction that adds a STRUCK/SUPERSEDED marker even
// though its diff deletes nothing.
//
// WHAT IT CANNOT SEE, printed on every run: whether the marker is on the RIGHT claim. It reads
// diffs, not meaning. A commit that strikes an unrelated paragraph passes here. This catches
// the shape of a correction filed beside its target, not the correctness of the landing.
//
//   node consonance/tools/corrections-gate.js                exit 0/1, last 24h
//   node consonance/tools/corrections-gate.js --since "3 days ago"
//   node consonance/tools/corrections-gate.js --warn         report, never fail
'use strict';

const path = require('path');
const { execFileSync } = require('child_process');
const R = require('./residue.js');

// A correction lands when its own diff removes something, or when it adds an explicit
// supersession marker. Both are real landings; only "added prose elsewhere" is not.
const MARKER_RE = /\b(STRUCK|SUPERSEDED|RETRACTED|WITHDRAWN|OVERTURNED)\b/;

// Files where this is enforced. Deliberately narrow: an append-only journal is CORRECT and
// residue says so — the rule only bites where a file both accumulates corrections AND claims
// to be a live map someone recalls from. Adding a path here is a real decision, not hygiene.
const GUARDED = [/muscle_map\.md$/i];

/** Lines this commit ADDED to one file. Read here rather than in residue, which is a sensor
 *  and should not grow a reason to fetch diffs. `+` lines only, and the `+++` header dropped. */
function addedLines(repo, hash, file) {
  try {
    return execFileSync('git', ['-C', repo, 'show', '--format=', '--unified=0', hash, '--', file],
      { encoding: 'utf8', maxBuffer: 1 << 26 })
      .split('\n').filter(l => l.startsWith('+') && !l.startsWith('+++')).join('\n');
  } catch {
    return '';                 // unreadable diff is not evidence of a marker
  }
}

function gate(opts = {}) {
  const since = opts.since || '24 hours ago';
  const repo = opts.repo || path.resolve(__dirname, '..', '..');
  const all = R.corrections(R.readCommits(repo, since));

  const offenders = [], passed = [], ignored = [];
  for (const c of all) {
    const target = c.target && c.target.file;
    if (!target || !GUARDED.some(rx => rx.test(target))) { ignored.push(c); continue; }
    // The marker must be in what this commit ADDED, not merely present in the file. A file
    // that already contains STRUCK from an earlier commit would otherwise excuse every later
    // one forever — the guard would pass by inheritance and never fire again.
    const landed = c.deleted > 0 || MARKER_RE.test(addedLines(repo, c.hash, target));
    (landed ? passed : offenders).push(c);
  }
  return { since, offenders, passed, ignored, total: all.length };
}

function main(argv) {
  const warn = argv.includes('--warn');
  const i = argv.indexOf('--since');
  const since = i >= 0 ? argv[i + 1] : undefined;
  const r = gate({ since });

  console.log(`corrections-gate — ${r.total} correction-subject commit(s) since ${r.since}`);
  console.log(`  ${r.passed.length} landed · ${r.offenders.length} filed beside their target · ` +
              `${r.ignored.length} outside the guarded files\n`);

  for (const c of r.offenders) {
    console.log(`  RED  ${c.hash}  +${c.added}/-${c.deleted}  ${c.subject.slice(0, 68)}`);
    console.log(`       touched ${c.target.file} and neither removed a line nor marked one.`);
  }
  if (r.offenders.length) {
    console.log('\n  A correction that removes nothing leaves the version it corrects in place,');
    console.log('  at equal authority, with no marker — a reader arriving at the old text has no');
    console.log('  way to know. Strike it IN PLACE (original kept verbatim, dated, with the');
    console.log('  evidence) rather than filing the correction below it.');
  }
  console.log('\n  What this cannot see: whether the marker is on the RIGHT claim. It reads');
  console.log('  diffs, not meaning — a commit that strikes an unrelated paragraph passes here.');

  if (warn) return 0;
  return r.offenders.length ? 1 : 0;
}

module.exports = { gate, MARKER_RE, GUARDED };

if (require.main === module) process.exit(main(process.argv.slice(2)));
