#!/usr/bin/env node
'use strict';
// OPEN ITEMS — what is still owed, COMPUTED rather than remembered.
//
// WHY THIS FILE EXISTS, with the number that caused it. On 2026-08-18 four panes measured what one
// compaction destroys, against a falsifier fixed before a row was read: file and instrument names
// survive at 33.8%, commit shas at 10.2%, structured numbers at 9.3%, and REGISTERED PREDICTIONS
// AND FALSIFIERS AT 3.5%. The summarizer keeps story and loses verification, and the class this room
// runs on is the class it keeps least. Lost material does not heal in later conversation either —
// about 9% recovery for shas.
//
// The consequence is not "summarize better". It is that A COMMITMENT HELD ONLY AS PROSE HAS ROUGHLY
// A 1-IN-30 CHANCE OF SURVIVING THE NEXT GAP, and a forgotten falsifier is indistinguishable from
// one that was never registered. Maintenance law 1 already said recall from the master; what the
// measurement adds is that THE TRANSCRIPT IS NOT A MASTER. Prose in a conversation is a copy by
// construction.
//
// So this does not store the open items as text. Each is a QUESTION WITH A COMMAND, and the answer
// is recomputed on every run. Nothing here can go stale, because nothing here is a claim about the
// world — it is a reading of it. A handoff paragraph saying "the rebuild is pending" is wrong the
// moment somebody rebuilds; this prints CLOSED and says why.
//
//   node consonance/tools/open-items.js          human output
//   node consonance/tools/open-items.js --json   one object per item
//
// Exit 0 always. A sensor, not a gate — same law as sourced-stop.js and for the same reason: a
// check that can block is a check somebody disables.
//
// TO ADD AN ITEM: give it a check() returning {state, detail}. If you cannot write a command that
// answers it, IT DOES NOT GO HERE — put it in the journal as prose and accept the 3.5%. That
// refusal is the point: the value of this file is that everything in it is decidable.
//
// AND EVERY CHECK PRINTS ITS UNIVERSE — {universe: {seen, skipped, rule}} — because a verdict
// computed over a surface nobody stated is a verdict about an unknown thing. P-UNIVERSE,
// registered 2026-08-25: an instrument computes health over the surface it CAN see and reports it
// as health of the surface it is NAMED for. The failure lives in the DENOMINATOR, not the check.
//
// This file had two of them. `seed-carrier` compared five briefs with `if (!a || !b) continue`,
// so a brief that vanished from the repo or the build was dropped in silence and the CLOSED line
// counted only what survived — an absent file and a matching one produced the same green. Both
// ledger readers parse JSON per line and `.filter(Boolean)` the failures away, so a corrupted row
// reduces the denominator instead of being reported. Neither was a wrong check. Both were right
// checks over a surface that had quietly shrunk.
//
// THE ITEMS LIST IS ITSELF SUCH A SURFACE, and it is the one that cannot be fixed by printing —
// only by admitting. "2 of 5 still open" is a reading of the commitments SOMEBODY WROTE A CHECK
// FOR. A commitment nobody wrote a check for is not CLOSED here; it is ABSENT, and absent reads
// exactly like done. The footer says so on every run rather than leaving the reader to infer it.

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const HOME = os.homedir();

function sh(cmd) {
  try {
    return execSync(cmd, { cwd: REPO, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (e) { return null; }
}
function md5(p) {
  try { return crypto.createHash('md5').update(fs.readFileSync(p)).digest('hex').slice(0, 8); }
  catch (e) { return null; }
}

/* Where a release build actually lands. cargo honours CARGO_TARGET_DIR and .cargo/config.toml,
 * so the conventional path under src-tauri/ can be empty while a complete build exists
 * elsewhere. This item reported "no built copy — never built on this machine" for weeks because
 * it looked in exactly one place, while a full release build sat in C:\build\lighthouse-target.
 * An absence you did not search for is not a finding. */
function candidateDirs() {
  const out = [];
  if (process.env.CARGO_TARGET_DIR) out.push(path.join(process.env.CARGO_TARGET_DIR, "release"));
  for (const cfg of [path.join(REPO, "consonance/src-tauri/.cargo/config.toml"),
                     path.join(REPO, ".cargo/config.toml")]) {
    try {
      const m = fs.readFileSync(cfg, "utf8").match(/target-dir\s*=\s*"([^"]+)"/);
      if (m) out.push(path.join(m[1], "release"));
    } catch (_) {}
  }
  out.push(path.join(REPO, "consonance/src-tauri/target/release"));
  out.push(path.join(REPO, "target/release"));
  return out;
}

/* ONE ledger reader, counting what it could NOT parse instead of filtering it away.
 *
 * Both vantage items did `.map(JSON.parse-or-null).filter(Boolean)`, which turns a corrupted row
 * into a smaller denominator. That is the P-UNIVERSE shape exactly: the check was right and the
 * surface had quietly shrunk. A row that will not parse is a row whose outcome is UNKNOWN, and an
 * unknown must be counted, never dropped — residue.js was fixed for the same defect on 2026-08-17
 * (its count-what-you-cannot-parse safeguard was invisible in every output mode because it was an
 * expando on an Array, so it is worth putting the number in the RETURN VALUE, not on the array). */
function readLedger(file) {
  let text;
  try { text = fs.readFileSync(file, 'utf8'); }
  catch (e) { return { rows: [], lines: 0, unparseable: 0, missing: true }; }
  const lines = text.trim() ? text.trim().split(/\r?\n/).filter(Boolean) : [];
  const rows = [];
  let unparseable = 0;
  for (const l of lines) {
    try { rows.push(JSON.parse(l)); }
    catch (e) { unparseable++; }
  }
  return { rows, lines: lines.length, unparseable, missing: false };
}

function releaseDir() {
  for (const d of candidateDirs()) {
    try { if (fs.existsSync(path.join(d, "BOOT.md"))) return d; } catch (_) {}
  }
  return null;
}

const ITEMS = [
  {
    id: 'seed-carrier',
    title: 'the briefs a fresh room reads match the repo',
    why: 'Eighth landed-is-not-shipped (034685f). The rename is correct in the repo; rooms read the app bundle.',
    how: 'node consonance/tools/open-items.js — md5 of each brief/*.md against the built copy in releaseDir()',
    check() {
      const names = ['SEED', 'BOOT', 'BASE_JOURNAL', 'COMMITTEE', 'LIBRARIAN'];
      const dirs = candidateDirs();
      const dir = releaseDir();
      if (!dir) {
        return {
          state: 'UNKNOWN',
          // Inline candidateDirs() on purpose: open-items-build.test.js pins this spelling,
          // and the intent it pins (the UNKNOWN branch must NAME what it searched) is exactly
          // this change's own thesis — an absence you did not search for is not a finding.
          detail: 'no build found — looked in ' + candidateDirs().join(' , '),
          universe: { seen: 0, skipped: names.length, rule: names.length +
            ' brief name(s), all unreachable: no build dir among the ' + dirs.length + ' candidates carries BOOT.md',
            skippedList: names },
        };
      }
      /* Every brief a spawn can read, not SEED alone. A stale LIBRARIAN.md sends that seat to a
       * dead notes path; a stale COMMITTEE.md briefs a pane with retired rules. Checking one file
       * and reporting a verdict on the whole bundle is the same overreach this item exists to catch. */
      /* AND THE SKIP IS NOW COUNTED. This loop used to `continue` when either side was unreadable,
       * so a brief missing from the repo or from the build vanished from the denominator and the
       * CLOSED line reported "N brief(s) byte-identical" over whatever happened to survive. Same
       * shape as install.ps1's $same, which was false both for MISSING and for DIFFERENT: a
       * comparison that cannot run is not a comparison that passed. */
      const drift = [];
      const skipped = [];
      let compared = 0;
      for (const n of names) {
        const a = md5(path.join(REPO, 'consonance/src-tauri/brief/' + n + '.md'));
        const b = md5(path.join(dir, n + '.md'));
        if (!a && !b) { skipped.push(n + ' (absent from BOTH repo and build)'); continue; }
        if (!a) { skipped.push(n + ' (absent from the REPO — the build carries one the repo does not)'); continue; }
        if (!b) { skipped.push(n + ' (absent from the BUILD — a fresh room never reads it)'); continue; }
        compared++;
        if (a !== b) drift.push(n);
      }
      const universe = {
        seen: names.length,
        skipped: skipped.length,
        rule: 'the ' + names.length + ' brief names a spawn can read, compared repo vs ' + dir +
          '; a name is SKIPPED when either side is unreadable — never silently dropped',
        skippedList: skipped,
      };
      if (!compared) return { state: 'UNKNOWN', detail: 'build at ' + dir + ' carries no briefs to compare', universe };
      if (skipped.length) {
        /* A brief that is absent from the BUILD is not a passing comparison — it is the failure
         * this item exists to catch, in its most complete form. Say OPEN. */
        return { state: 'OPEN', detail: compared + ' of ' + names.length + ' compared' +
          (drift.length ? ', ' + drift.join(', ') + ' DRIFTED' : ', no drift among them') +
          ' — but ' + skipped.length + ' could not be compared at all: ' + skipped.join('; '), universe };
      }
      if (!drift.length) {
        return { state: 'CLOSED', detail: compared + ' brief(s) byte-identical to the repo in ' + dir, universe };
      }
      return { state: 'OPEN', detail: drift.join(', ') + ' differ from the built copy (' + compared +
        ' compared) — a fresh spawn reads the STALE one until a rebuild', universe };
    },
  },
  {
    id: 'hold-userprompt-submit',
    title: 'the userprompt-submit.js two-way conflict',
    why: '83 real lines differ — 69 only in the repo including a BOM-strip fix, 14 only on this machine. The installer refuses to decide it.',
    how: 'the Hold flag on the manifest entry, plus md5 of repo against installed',
    check() {
      const inst = path.join(REPO, 'dev/shell/install.ps1');
      let src;
      try { src = fs.readFileSync(inst, 'utf8'); }
      catch (e) { return { state: 'UNKNOWN', detail: 'install.ps1 unreadable' }; }
      const held = /userprompt-submit\.js';[^\n]*Hold\s*=\s*\$true/.test(src);
      const repoPath = path.join(REPO, 'dev/shell/hooks/userprompt-submit.js');
      const instPath = path.join(HOME, '.claude/shell/hooks/userprompt-submit.js');
      const a = md5(repoPath);
      const b = md5(instPath);
      /* TWO SIDES IS THE WHOLE UNIVERSE, and naming which one is missing is the point: a two-way
       * conflict needs two sides, and install.ps1 spent months reporting HOLD about a file that
       * was not there. The installed path here is hooks\userprompt-submit.js, which on this
       * machine does not exist — the destination layout is flat. That is why b reads absent, and
       * a reader who is only shown "absent" cannot tell "not installed" from "installed
       * elsewhere". */
      const universe = {
        seen: 2,
        skipped: (a ? 0 : 1) + (b ? 0 : 1),
        rule: 'exactly two files: ' + repoPath + ' and ' + instPath +
          '; unreadable counts as SKIPPED, and a side that is absent cannot be a side of a conflict',
        skippedList: [].concat(a ? [] : ['repo copy unreadable'], b ? [] : ['installed copy absent at that exact path']),
      };
      if (!held) return { state: 'CLOSED', detail: 'Hold flag removed from the manifest — somebody resolved it', universe };
      if (a && b && a === b) return { state: 'CLOSED', detail: 'files identical now — drop the Hold flag', universe };
      return { state: 'OPEN', detail: 'still HELD · repo ' + (a || '?') + ' vs installed ' + (b || 'absent'), universe };
    },
  },
  {
    id: 'f1-vantage-clock',
    title: 'F1 — the blind reader\u2019s thirty-day kill window',
    why: 'build_ruling C4: thirty days live with zero true DISAGREEs and the reader is deleted. The clock starts at its first fire.',
    how: 'rows in vantage_findings.jsonl, and days since the first vantage_runs.log entry',
    check() {
      const data = process.env.VANTAGE_DATA || 'C:/Consonance/data';
      const runs = path.join(data, 'vantage_runs.log');
      const finds = path.join(data, 'vantage_findings.jsonl');
      // COUNT VERDICTS, NEVER ROWS. The first version of this check counted lines in the findings
      // ledger and reported CLOSED — "7 findings filed". Six of those seven were UNLAUNCHABLE: the
      // reader never ran on them. A row is an ATTEMPT; only a verdict is an OUTCOME, and F1 asks
      // whether the reader produces, not whether it tried. Counting the artifact instead of the
      // outcome is the exact defect this file exists to catch — committed inside it, ten minutes
      // after it was written, and found by running it.
      const led = readLedger(finds);
      const rows = led.rows;
      const universe = {
        seen: led.lines,
        skipped: led.unparseable,
        rule: led.missing
          ? 'no ' + finds + ' — zero rows seen, which is NOT the same as zero attempts made'
          : led.lines + ' line(s) in ' + finds + ', one JSON object per line; a line that will not parse is counted here, never dropped from the denominator',
        skippedList: led.unparseable ? [led.unparseable + ' line(s) did not parse — their outcome is UNKNOWN, not absent'] : [],
      };
      const verdicts = rows.filter((r) => r && r.verdict).length;
      const unlaunchable = rows.filter((r) => r && r.status === 'UNLAUNCHABLE').length;
      if (verdicts > 0) {
        return { state: 'CLOSED', detail: verdicts + ' verdict(s) of ' + rows.length + ' attempt(s) — F1 cannot fire while the reader produces', universe };
      }
      if (rows.length) {
        return { state: 'OPEN', detail: rows.length + ' attempt(s), 0 verdicts (' + unlaunchable + ' unlaunchable) — trying is not producing', universe };
      }
      if (!fs.existsSync(runs)) {
        return { state: 'OPEN', detail: 'no vantage_runs.log — the reader has never fired, so F1 has not started', universe };
      }
      let first = null, days = '?';
      try {
        const lines = fs.readFileSync(runs, 'utf8').trim().split(/\r?\n/).filter(Boolean);
        const m = lines[0] && lines[0].match(/\d{4}-\d{2}-\d{2}T[\d:.]+Z/);
        if (m) { first = m[0]; days = Math.floor((Date.now() - Date.parse(first)) / 86400000); }
      } catch (e) { /* leave unknown */ }
      return { state: 'OPEN', detail: '0 findings, ' + days + ' of 30 days since ' + (first || 'first fire'), universe };
    },
  },
  {
    id: 'vantage-reach',
    title: "the artifact tier's real reach on this machine",
    why: 'C1 routes artifact-bound claims at 100%, on the assumption that an artifact is a repo file. Measured 2026-08-18: 16 of 17 artifact-tier rows point at ~/.claude/shell/ — digests, duration-goal state, drift-watch findings, plan files. None is under version control, so resolveHeads correctly returns {} and C2 correctly refuses. Nothing is broken; the tier reaches less than its name implies.',
    how: 'share of artifact-tier ledger rows whose heads{} is empty',
    check() {
      const data = process.env.VANTAGE_DATA || 'C:/Consonance/data';
      const led = path.join(data, 'sourced_ledger.jsonl');
      const r = readLedger(led);
      const rows = r.rows;
      const art = rows.filter((x) => Array.isArray(x.claims) && x.claims.some((c) => c && c.channel === 'artifact'));
      /* TWO NESTED DENOMINATORS, and only the inner one was ever printed. The percentage below is
       * over ARTIFACT-TIER rows; the reader is owed both how many rows existed and how many of
       * them this question even applies to, or "16 of 17" reads as a share of the ledger. */
      const universe = {
        seen: r.lines,
        skipped: r.unparseable + (rows.length - art.length),
        rule: r.missing
          ? 'no ' + led + ' — zero rows seen'
          : r.lines + ' line(s) in ' + led + '; ' + r.unparseable + ' unparseable, ' +
            (rows.length - art.length) + ' carry no artifact-tier claim (out of scope for this question), ' +
            art.length + ' scored',
        skippedList: r.unparseable ? [r.unparseable + ' line(s) did not parse'] : [],
      };
      if (r.missing) return { state: 'UNKNOWN', detail: 'no sourced_ledger.jsonl', universe };
      if (!art.length) return { state: 'UNKNOWN', detail: 'no artifact-tier rows yet', universe };
      const noHead = art.filter((x) => !x.heads || !Object.keys(x.heads).length).length;
      const pct = Math.round((noHead / art.length) * 100);
      if (pct >= 50) {
        return { state: 'OPEN', detail: noHead + ' of ' + art.length + ' artifact rows (' + pct + '%) are outside any repo — unreachable by design, and the tier does not say so', universe };
      }
      return { state: 'CLOSED', detail: noHead + ' of ' + art.length + ' artifact rows outside a repo (' + pct + '%) — the tier mostly reaches', universe };
    },
  },
  {
    id: 'actors-canary',
    title: 'the actors.test.js canary is red and js-suite exits 0 over it',
    why: '354ad79 argued a canary must not become a suppression bucket. The classification is honest; the suppression is still in force.',
    how: 'run actors.test.js directly and read ITS exit code, not the suite runner\u2019s',
    check() {
      const p = path.join(REPO, 'consonance/tools/actors.test.js');
      /* THE UNIVERSE HERE IS ONE FILE, and saying so is the honest half. js-suite DISCOVERS its
       * canaries by walking the tree; this checks the one file somebody named. If a second file
       * ever declares EXPECTED-RED, js-suite sees it and this does not — and the two would then
       * disagree again, for a different reason than they disagreed on 2026-08-24.
       *
       * NOT A DENOMINATOR BUG, and worth being exact about because this item is cited as one. The
       * bb3d92c defect was a loose PATTERN over the right file, not a right pattern over the wrong
       * set — see the P-UNIVERSE registration, which excludes it from the class and puts it in the
       * duplicated-rule class instead. The fix copied js-suite.js:140 VERBATIM with a comment
       * saying the two "cannot drift apart again"; copying is precisely how they drifted the first
       * time. js-suite.js has no module.exports, so this cannot require the real one. */
      const universe = {
        seen: 1,
        skipped: fs.existsSync(p) ? 0 : 1,
        rule: 'exactly one named file, consonance/tools/actors.test.js — NOT a walk. js-suite ' +
          'discovers canaries across the tree; a canary declared anywhere else is invisible here. ' +
          'The marker pattern is a hand-copy of js-suite.js:140, not a shared import.',
        skippedList: fs.existsSync(p) ? [] : ['actors.test.js absent'],
      };
      if (!fs.existsSync(p)) return { state: 'CLOSED', detail: 'file gone', universe };
      /* ANCHORED, not a substring search. A bare /EXPECTED-RED/ matches the marker quoted inside
       * a comment ABOUT the marker — which is exactly what pane A left behind when it removed the
       * real declaration (6cf7504, actors.test.js:12). This instrument then reported the canary as
       * declared-and-singing while js-suite, which anchors, reported 0 canary. Two instruments,
       * one file, opposite answers.
       *
       * Fourth instance of the self-reference class here: js-suite failing on itself (08-17), the
       * shelf test matching "## THE SHELF IS TIERED" in prose (08-24), C's census greps matching
       * its own scorecard (08-24). The pattern below is js-suite.js:140 VERBATIM so the two
       * cannot drift apart again. */
      const declared = /^\s*(\/\/|#)\s*JS-SUITE:\s*EXPECTED-RED/m.test(fs.readFileSync(p, 'utf8'));
      const red = sh('node "' + p + '"') === null;
      if (!red && declared) {
        return { state: 'OPEN', detail: 'declared EXPECTED-RED but now GREEN — a canary singing is itself a failure', universe };
      }
      if (!red) return { state: 'CLOSED', detail: 'green, and not declared red', universe };
      return { state: 'OPEN', detail: 'red by declaration — resolve the unresolved board ids, or give it an expiry', universe };
    },
  },
];

const rows = ITEMS.map((it) => {
  let r;
  try { r = it.check(); }
  catch (e) { r = { state: 'ERROR', detail: e.message }; }
  /* An item with no universe is reported as such rather than given a default. A missing
   * denominator that prints as "1 seen / 0 skipped" is the failure this whole change is against,
   * committed inside the change itself. */
  return { id: it.id, title: it.title, state: r.state, detail: r.detail, why: it.why, how: it.how,
           universe: r.universe || null };
});

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(rows, null, 2));
  process.exit(0);
}

const open = rows.filter((r) => r.state === 'OPEN').length;
console.log('\nOPEN ITEMS — computed, not remembered');
console.log('(a commitment held only as prose survives a compaction at 3.5%; these are recomputed every run)\n');
for (const r of rows) {
  console.log('  ' + r.state.padEnd(8) + r.title);
  console.log('          ' + r.detail);
  console.log('          check: ' + r.how);
  if (!r.universe) {
    console.log('          universe: NOT DECLARED — this item\'s check() returns no denominator, so');
    console.log('                    its verdict is over an unstated surface');
  } else {
    const u = r.universe;
    console.log('          universe: ' + u.seen + ' seen · ' + u.skipped + ' skipped · ' + u.rule);
    for (const sk of (u.skippedList || [])) console.log('                    SKIPPED: ' + sk);
  }
  console.log('');
}
console.log('  ' + open + ' of ' + rows.length + ' still open.');
/* THE INSTRUMENT'S OWN UNIVERSE, and it is the one that cannot be repaired by printing.
 * Everything above is a reading of the commitments SOMEBODY WROTE A CHECK FOR. That set is
 * hand-maintained, so a commitment nobody encoded is not CLOSED here — it is ABSENT, and absent
 * reads exactly like done. No walk can find it: there is no directory of things that are owed. */
const noUniverse = rows.filter((r) => !r.universe).length;
const errored = rows.filter((r) => r.state === 'ERROR').length;
console.log('');
console.log('  universe — what this instrument could and could not see');
console.log('    ' + rows.length + ' item(s) defined · ' + (rows.length - errored) + ' checked · ' +
  errored + ' errored · ' + noUniverse + ' with no declared denominator');
console.log('    rule: an item exists here only because someone wrote a check() for it. THIS');
console.log('          DENOMINATOR IS HAND-MAINTAINED AND CANNOT BE WALKED — a commitment with no');
console.log('          check is not CLOSED, it is ABSENT, and absent reads exactly like done.');
console.log('');
process.exit(0);
