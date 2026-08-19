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

const ITEMS = [
  {
    id: 'seed-carrier',
    title: 'the SEED.md rename reaches a new room',
    why: 'Eighth landed-is-not-shipped (034685f). The rename is correct in the repo; rooms read the app bundle.',
    how: 'md5 of consonance/src-tauri/brief/SEED.md against target/release/SEED.md',
    check() {
      const src = path.join(REPO, 'consonance/src-tauri/brief/SEED.md');
      const built = path.join(REPO, 'consonance/src-tauri/target/release/SEED.md');
      const a = md5(src), b = md5(built);
      if (!a) return { state: 'UNKNOWN', detail: 'source SEED.md not found' };
      if (!b) return { state: 'UNKNOWN', detail: 'no built copy — never built on this machine' };
      if (a === b) return { state: 'CLOSED', detail: 'both ' + a + ' — the bundle matches the repo' };
      return { state: 'OPEN', detail: 'repo ' + a + ' vs bundle ' + b + ' — needs a rebuild (dev/rebuild-on-close.ps1)' };
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
      const a = md5(path.join(REPO, 'dev/shell/hooks/userprompt-submit.js'));
      const b = md5(path.join(HOME, '.claude/shell/hooks/userprompt-submit.js'));
      if (!held) return { state: 'CLOSED', detail: 'Hold flag removed from the manifest — somebody resolved it' };
      if (a && b && a === b) return { state: 'CLOSED', detail: 'files identical now — drop the Hold flag' };
      return { state: 'OPEN', detail: 'still HELD · repo ' + (a || '?') + ' vs installed ' + (b || 'absent') };
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
      let rows = [];
      try {
        rows = fs.readFileSync(finds, 'utf8').trim().split(/\r?\n/).filter(Boolean)
          .map((l) => { try { return JSON.parse(l); } catch (e) { return null; } })
          .filter(Boolean);
      } catch (e) { rows = []; }
      const verdicts = rows.filter((r) => r && r.verdict).length;
      const unlaunchable = rows.filter((r) => r && r.status === 'UNLAUNCHABLE').length;
      if (verdicts > 0) {
        return { state: 'CLOSED', detail: verdicts + ' verdict(s) of ' + rows.length + ' attempt(s) — F1 cannot fire while the reader produces' };
      }
      if (rows.length) {
        return { state: 'OPEN', detail: rows.length + ' attempt(s), 0 verdicts (' + unlaunchable + ' unlaunchable) — trying is not producing' };
      }
      if (!fs.existsSync(runs)) {
        return { state: 'OPEN', detail: 'no vantage_runs.log — the reader has never fired, so F1 has not started' };
      }
      let first = null, days = '?';
      try {
        const lines = fs.readFileSync(runs, 'utf8').trim().split(/\r?\n/).filter(Boolean);
        const m = lines[0] && lines[0].match(/\d{4}-\d{2}-\d{2}T[\d:.]+Z/);
        if (m) { first = m[0]; days = Math.floor((Date.now() - Date.parse(first)) / 86400000); }
      } catch (e) { /* leave unknown */ }
      return { state: 'OPEN', detail: '0 findings, ' + days + ' of 30 days since ' + (first || 'first fire') };
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
      let rows = [];
      try {
        rows = fs.readFileSync(led, 'utf8').trim().split(/\r?\n/).filter(Boolean)
          .map((l) => { try { return JSON.parse(l); } catch (e) { return null; } })
          .filter(Boolean);
      } catch (e) { return { state: 'UNKNOWN', detail: 'no sourced_ledger.jsonl' }; }
      const art = rows.filter((r) => Array.isArray(r.claims) && r.claims.some((c) => c && c.channel === 'artifact'));
      if (!art.length) return { state: 'UNKNOWN', detail: 'no artifact-tier rows yet' };
      const noHead = art.filter((r) => !r.heads || !Object.keys(r.heads).length).length;
      const pct = Math.round((noHead / art.length) * 100);
      if (pct >= 50) {
        return { state: 'OPEN', detail: noHead + ' of ' + art.length + ' artifact rows (' + pct + '%) are outside any repo — unreachable by design, and the tier does not say so' };
      }
      return { state: 'CLOSED', detail: noHead + ' of ' + art.length + ' artifact rows outside a repo (' + pct + '%) — the tier mostly reaches' };
    },
  },
  {
    id: 'actors-canary',
    title: 'the actors.test.js canary is red and js-suite exits 0 over it',
    why: '354ad79 argued a canary must not become a suppression bucket. The classification is honest; the suppression is still in force.',
    how: 'run actors.test.js directly and read ITS exit code, not the suite runner\u2019s',
    check() {
      const p = path.join(REPO, 'consonance/tools/actors.test.js');
      if (!fs.existsSync(p)) return { state: 'CLOSED', detail: 'file gone' };
      const declared = /EXPECTED-RED/.test(fs.readFileSync(p, 'utf8'));
      const red = sh('node "' + p + '"') === null;
      if (!red && declared) {
        return { state: 'OPEN', detail: 'declared EXPECTED-RED but now GREEN — a canary singing is itself a failure' };
      }
      if (!red) return { state: 'CLOSED', detail: 'green, and not declared red' };
      return { state: 'OPEN', detail: 'red by declaration — resolve the unresolved board ids, or give it an expiry' };
    },
  },
];

const rows = ITEMS.map((it) => {
  let r;
  try { r = it.check(); }
  catch (e) { r = { state: 'ERROR', detail: e.message }; }
  return { id: it.id, title: it.title, state: r.state, detail: r.detail, why: it.why, how: it.how };
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
  console.log('          check: ' + r.how + '\n');
}
console.log('  ' + open + ' of ' + rows.length + ' still open.\n');
process.exit(0);
