#!/usr/bin/env node
'use strict';
// state-manifest.js — read consonance/state-manifest.json, walk the data dir, and answer two
// questions in one run: IS ANY PATH UNCLASSIFIED, and HOW BIG IS TRAVELS.
//
// WHY BOTH IN ONE COMMAND. P-STATE-SET's bar is that the manifest re-derives its size by one
// command AND that a path in no column fails the check. Two commands would let the size be
// quoted while the completeness check went unrun — and a figure quoted without its check is the
// hand-made number this room has been paying for since 2026-08-02.
//
// THE FAILURE THIS EXISTS TO CATCH is not a wrong classification. It is a path NOBODY
// classified, which then travels or fails to travel by accident, and which reads in a listing
// exactly like a path that was considered. So an unmatched path is EXIT 1, always, with no
// default class anywhere in this file. A default would make the check unable to say no.
//
// AND REGENERATES IS AUDITED, NOT TRUSTED. A REGENERATES rule with no `regenerated_by` and
// `regenerated_when` is a path someone is choosing to lose while calling it maintenance. That is
// a CLASS ERROR here, not a warning — the same reason the machine-bound class makes an
// undeclared exemption fail rather than pass quietly.
//
//   node consonance/tools/state-manifest.js            # check + sizes, exit 1 if anything is unplaced
//   node consonance/tools/state-manifest.js --paths    # also print every path with its class
//   node consonance/tools/state-manifest.js --json     # machine-readable
//
// UNDECIDED IS NOT A FAILURE AND NOT A PASS. It is printed on its own line with what would
// decide it, and it does not enter the TRAVELS total. A manifest that reads complete while one
// file is genuinely unruled is the thing P-STATE-SET forbade.

const fs = require('fs');
const path = require('path');
const os = require('os');

const REPO = path.resolve(__dirname, '..', '..');
// STATE_MANIFEST is a test seam, and it exists for the reason dream-watch's env overrides do: an
// instrument whose whole job is to fail on an unclassified path cannot have an untestable core.
// Without it the only fixture available is the live data dir, and a check that can only be run
// over the one universe it was written against is green by construction — which is precisely the
// class of defect this file was built to catch.
const MANIFEST = (process.env.STATE_MANIFEST || '').trim() || path.join(REPO, 'consonance', 'state-manifest.json');

// Corpus resolution, per portable-paths: env, then this machine's config, then REFUSE. No
// literal fallback — a tool that guesses a data dir reports about a disk nobody asked about,
// which is the defect actors.test.js shipped for a week (machine_bound_class_2026-08-25.md).
function dataDir() {
  const env = (process.env.CONSONANCE_DATA || '').trim();
  if (env) return env;
  try {
    const raw = fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8');
    const cfg = JSON.parse(raw.replace(/^﻿/, ''));
    if (cfg.data_dir) return cfg.data_dir;
  } catch (_) { /* fall through to the refusal */ }
  return null;
}

// `*` matches within one segment, `**` matches across segments. Anchored at both ends: a rule
// must name the whole relative path, so no rule can quietly widen into a catch-all.
function globToRe(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') { re += '.*'; i++; } else { re += '[^/]*'; }
    } else if ('\\^$.|?+()[]{}'.includes(c)) { re += '\\' + c; }
    else { re += c; }
  }
  return new RegExp('^' + re + '$');
}

function walk(root) {
  const out = [];
  (function rec(dir, rel) {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
    catch (e) { out.push({ rel, kind: 'unreadable', bytes: 0, why: e.code }); return; }
    for (const e of entries) {
      const r = rel ? rel + '/' + e.name : e.name;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { out.push({ rel: r, kind: 'dir', bytes: 0 }); rec(p, r); }
      else {
        let bytes = 0;
        // An unstattable file is UNKNOWN, never 0 — a size that cannot be read reported as zero
        // is the false green this room keeps finding (residue.js, 2026-08-17).
        try { bytes = fs.statSync(p).size; } catch (_) { out.push({ rel: r, kind: 'unstattable', bytes: 0 }); continue; }
        out.push({ rel: r, kind: 'file', bytes });
      }
    }
  })(root, '');
  return out;
}

function main() {
  const args = process.argv.slice(2);
  const DATA = dataDir();
  if (!DATA) {
    console.error('state-manifest: no corpus declared — CONSONANCE_DATA is unset and ~/.consonance.json has no data_dir.');
    console.error('                Refusing rather than guessing a path: a report about the wrong disk reads exactly like a report about this one.');
    process.exit(2);
  }
  if (!fs.existsSync(DATA)) {
    console.error(`state-manifest: data dir does not exist: ${DATA}`);
    process.exit(2);
  }

  const man = JSON.parse(fs.readFileSync(MANIFEST, 'utf8').replace(/^﻿/, ''));
  const rules = man.rules.map((r, i) => ({ ...r, i, re: globToRe(r.glob), hits: 0, bytes: 0 }));

  // Class errors in the manifest itself, checked before it is used to classify anything.
  // One implementation, shared with state-sync.js — see classErrorsFor.
  const VALID = new Set(['TRAVELS', 'STAYS', 'REGENERATES', 'UNDECIDED']);
  const classErrors = classErrorsFor(man);

  // A BROKEN MANIFEST CLASSIFIES NOTHING, so report and stop before walking.
  //
  // Found by this file's own test, 2026-09-09: an unknown class name reached the tally, indexed
  // byClass with a key that was not there, and CRASHED — exiting 1 for the wrong reason. The test
  // asserting "exit 1" went green over a TypeError, which is a check that cannot tell a detection
  // from a collapse. Stopping here also means no totals are printed from a manifest that is not
  // trustworthy: a TRAVELS figure computed under a broken rule set reads exactly as authoritative
  // as a good one, and this room decides a transport on that figure.
  if (classErrors.length) {
    console.error('state-manifest: CLASS ERROR in the manifest itself — classifying nothing until it is fixed:');
    for (const e of classErrors) console.error(`  ${e}`);
    process.exit(1);
  }

  // FORBIDDEN — a declaration that a path must NOT be here, checked by its PRESENCE.
  //
  // Added 2026-09-09 for install_id, and it is not a fifth column. TRAVELS/STAYS/REGENERATES all
  // answer "this path exists, what happens to it"; a forbidden path is one whose existence under
  // this root is itself the fault, whatever column it were put in. install_id is the case that
  // forced it: a STAYS rule would keep it out of the sync AND STILL trip live-host.js's
  // identityHazard, which tests the PATH PREFIX and not this manifest — so the manifest would
  // read as having satisfied E's dependency while silently blocking the guard from arming. A
  // rule that looks like compliance and prevents the thing it was asked for is worse than no
  // rule, so the honest form is a declaration that goes red the day the file appears.
  const forbidden = (man.forbidden || []).map((f) => ({ ...f, re: globToRe(f.glob) }));
  const violations = [];

  const paths = walk(DATA);
  const unplaced = [];
  const broken = [];
  const byClass = {};
  for (const c of VALID) byClass[c] = { paths: 0, files: 0, bytes: 0 };

  for (const p of paths) {
    if (p.kind === 'unreadable' || p.kind === 'unstattable') { broken.push(p); continue; }
    // Checked BEFORE classification, and deliberately: a forbidden path that also matched some
    // rule would otherwise be reported as placed, which is the reading this check exists to deny.
    const f = forbidden.find((f) => f.re.test(p.rel));
    if (f) { violations.push({ rel: p.rel, why: f.why }); continue; }
    const r = rules.find((r) => r.re.test(p.rel));
    if (!r) { unplaced.push(p); continue; }
    r.hits++; r.bytes += p.bytes;
    p.class = r.class;
    const b = byClass[r.class];
    b.paths++; if (p.kind === 'file') { b.files++; b.bytes += p.bytes; }
  }

  const mb = (n) => (n / 1048576).toFixed(1) + ' MB';
  const declared = rules.filter((r) => r.hits === 0);
  const undecided = rules.filter((r) => r.class === 'UNDECIDED');

  if (args.includes('--json')) {
    console.log(JSON.stringify({
      data_dir: DATA, at: new Date().toISOString(),
      totals: byClass, unplaced: unplaced.map((p) => p.rel), broken: broken.map((p) => p.rel),
      forbidden_present: violations,
      class_errors: classErrors, declared_not_present: declared.map((r) => r.glob),
      undecided: undecided.map((r) => ({ glob: r.glob, decided_by: r.decided_by, interim: r.interim })),
      paths: args.includes('--paths') ? paths : undefined,
    }, null, 2));
  } else {
    console.log(`state-manifest v${man.version} · ${DATA} · ${new Date().toISOString()}`);
    console.log(`  ${paths.length} paths walked (${paths.filter((p) => p.kind === 'file').length} files, ${paths.filter((p) => p.kind === 'dir').length} dirs)`);
    console.log('');
    for (const c of ['TRAVELS', 'STAYS', 'REGENERATES', 'UNDECIDED']) {
      const b = byClass[c];
      console.log(`  ${c.padEnd(12)} ${String(b.paths).padStart(4)} paths · ${String(b.files).padStart(4)} files · ${mb(b.bytes).padStart(10)}`);
    }
    console.log('');
    if (args.includes('--paths')) {
      for (const p of paths.slice().sort((a, b) => b.bytes - a.bytes)) {
        console.log(`  ${(p.class || 'UNPLACED').padEnd(12)} ${String(p.bytes).padStart(10)}  ${p.rel}${p.kind === 'dir' ? '/' : ''}`);
      }
      console.log('');
    }
    for (const r of undecided) {
      console.log(`  UNDECIDED  ${r.glob}  (${r.hits} paths, ${mb(r.bytes)}) — NOT counted in TRAVELS`);
      console.log(`             decided by: ${r.decided_by}`);
      if (r.interim) console.log(`             interim:    ${r.interim}`);
    }
    for (const r of declared) console.log(`  declared, not present yet: ${r.glob} (${r.class})`);
    for (const p of broken) console.log(`  UNKNOWN SIZE — ${p.rel} (${p.kind}) — counted in no total, and that is the honest answer`);
    if (unplaced.length) {
      console.log('');
      console.log(`  UNPLACED — ${unplaced.length} path(s) match no rule. Each would travel or fail to travel by accident:`);
      for (const p of unplaced) console.log(`    ${p.rel}`);
    }
    if (violations.length) {
      console.log('');
      console.log(`  FORBIDDEN PATH PRESENT — ${violations.length}. Its existence here is the fault, not its column:`);
      for (const v of violations) console.log(`    ${v.rel}\n      ${v.why}`);
    }
    if (classErrors.length) {
      console.log('');
      console.log('  CLASS ERROR in the manifest itself:');
      for (const e of classErrors) console.log(`    ${e}`);
    }
    console.log('');
    console.log(`  TRAVELS = ${byClass.TRAVELS.bytes} bytes (${mb(byClass.TRAVELS.bytes)})   [GitHub per-file hard limit is 100 MB]`);
  }

  if (unplaced.length || classErrors.length || violations.length) process.exit(1);
  process.exit(0);
}

/**
 * The arrival transforms a rule is allowed to name. `state-sync.js` implements them and asserts
 * that its registry and this list are the same set; a name here with no implementation, or an
 * implementation with no name here, is a test failure rather than a surprise at install time.
 */
const VALID_ARRIVAL = ['roster-cwds'];

/**
 * Every way the manifest can be wrong ABOUT ITSELF, in one place.
 *
 * WHY THIS IS A FUNCTION AND NOT A LOOP IN main(). `state-sync.js` had its own copy of these
 * checks — three of the four, drifting quietly — and this file's whole reason for exporting
 * `globToRe` was that two implementations of one rule set is how a transport and its checker come
 * to disagree while both report green. The validation was the last piece still duplicated.
 *
 * AND THE NEW ONES ARE THE POINT OF D056-1. `panes.json` travelled with its condition written as
 * `precondition`: prose beside the rule saying the entry is wrong if the two machines resolve
 * different instance dirs. **A COMMENT CANNOT FAIL.** It read as clearance, it was scored as
 * checked, and the sentence was false in a way it could not express anyway — what is machine-bound
 * is not the root, it is the `sibling-<id>` dirs minted inside it. So:
 *
 *   - `precondition` is REFUSED outright. A condition on a class must be a mechanism.
 *   - `on_arrival` names a transform that must EXIST, and must be on a rule that actually travels.
 *   - a rule that transforms must declare what it points at OUTSIDE the root — B's §0.7 criterion
 *     made mechanical: `panes.json` is the only TRAVELS file pointing outside its own transported
 *     tree, and the thing it points at was classified nowhere.
 *   - that out-of-root target may honestly be UNDECIDED (`packet_state_set_2026-09-09.md` §5's
 *     fourth state), but an undecided with no decider is just an omission and is refused too.
 */
function classErrorsFor(man) {
  const errs = [];
  const VALID = new Set(['TRAVELS', 'STAYS', 'REGENERATES', 'UNDECIDED']);
  const outOfRoot = man.out_of_root || [];
  for (const r of man.rules || []) {
    if (!VALID.has(r.class)) errs.push(`${r.glob}: class '${r.class}' is not one of ${[...VALID].join(', ')}`);
    if (r.class === 'REGENERATES' && !(r.regenerated_by && r.regenerated_when)) {
      errs.push(`${r.glob}: REGENERATES without regenerated_by AND regenerated_when — that is a path being lost, and it must say so in those words`);
    }
    if (r.class === 'UNDECIDED' && !r.decided_by) {
      errs.push(`${r.glob}: UNDECIDED without decided_by — an undecided with no decider is just an omission`);
    }
    if (r.precondition) {
      errs.push(`${r.glob}: a 'precondition' is prose and CANNOT FAIL (D055-B-02 passed and missed). State the condition as an 'on_arrival' transform, or class the path UNDECIDED with a decided_by.`);
    }
    if (r.on_arrival) {
      if (!VALID_ARRIVAL.includes(r.on_arrival)) {
        errs.push(`${r.glob}: on_arrival '${r.on_arrival}' is not implemented — one of ${VALID_ARRIVAL.join(', ')}`);
      }
      if (r.class !== 'TRAVELS') {
        errs.push(`${r.glob}: on_arrival on a ${r.class} rule — a transform on a file that never arrives is a transform nothing runs`);
      }
      if (!outOfRoot.some((e) => e.handled_by === r.on_arrival)) {
        errs.push(`${r.glob}: on_arrival '${r.on_arrival}' with no out_of_root entry naming it — a rule that transforms is a rule that points somewhere this manifest's root does not cover, and that target must be declared`);
      }
    }
  }
  for (const e of outOfRoot) {
    if (!e.ref || !e.points_at) errs.push(`out_of_root: an entry needs both 'ref' and 'points_at'`);
    if (!VALID.has(e.class)) errs.push(`out_of_root ${e.ref}: class '${e.class}' is not one of ${[...VALID].join(', ')}`);
    if (e.class === 'UNDECIDED' && !e.decided_by) {
      errs.push(`out_of_root ${e.ref}: UNDECIDED without decided_by — an undecided with no decider is just an omission`);
    }
    if (e.handled_by && !VALID_ARRIVAL.includes(e.handled_by)) {
      errs.push(`out_of_root ${e.ref}: handled_by '${e.handled_by}' is not an implemented transform`);
    }
  }
  return errs;
}

// EXPORTED so state-sync.js classifies with THIS file's rules and THIS file's glob
// semantics rather than a second copy of them. Two implementations of one rule set is how a
// transport and its checker come to disagree while both report green — the failure this whole
// manifest exists to make loud. The CLI behaviour above is unchanged: main() still runs when this
// file is the entry point, and its 25 tests are the proof of that.
if (require.main === module) main();
module.exports = {
  globToRe, walk, dataDir, MANIFEST, classErrorsFor,
  VALID_CLASSES: ['TRAVELS', 'STAYS', 'REGENERATES', 'UNDECIDED'],
  VALID_ARRIVAL,
};
