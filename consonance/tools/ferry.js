#!/usr/bin/env node
// ferry.js - make the un-ferried artifact visible.
//
// WHY THIS EXISTS, and it is a finding rather than a feature request.
//
// On 2026-08-10 the chair and pane C produced genuinely decorrelated errors across five
// exchanges - each catching structural defects the other had missed, in real work, with full
// mutual information, no blind window, no assigned roles and no gauge. That is the quantity four
// diversity gauges were built to detect and none of them could see.
//
// It did not happen because anything routed it. It happened because the KEEPER routed it, by
// hand, every single time: "check what Around said", "be wary of their output", "check Around's
// reply first". The chair holds chair_inject and chair_scrollback and used neither unprompted.
//
// Pane C's own measurement is the other half: panes do not pull from the board. It is pull, not
// push, and the human is the ferry. The board has carried 18 multi-pane laps in its entire life
// and is 95% a single pane.
//
// So the missing piece was never a metric for diversity. It was the ROUTING that puts one pane's
// actual output in front of another at the moment it matters - and a convention that depends on
// the chair remembering cannot protect a tree (B, 2026-08-02). This does not route anything. It
// records what was DUE and what was DONE, so a miss is a visible line rather than an absence.
//
// Usage:
//   node ferry.js --due                       artifact commits with no ferry recorded
//   node ferry.js --record <sha> <pane> ...   mark an artifact as ferried to panes
//   node ferry.js --report                    miss rate and latency over all history
//
// The ledger lives OUTSIDE the repo, beside board.jsonl, because it is machine state and not a
// trace: C:\Consonance\data\ferry.jsonl

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const LEDGER = process.env.FERRY_LEDGER || 'C:\\Consonance\\data\\ferry.jsonl';

// WHAT COUNTS AS AN ARTIFACT. Claim-bearing files only: a design, a registration, a result, a
// map entry, a journal. Code commits are excluded deliberately - code is reviewed by its tests,
// and the thing that went unchecked tonight was PROSE MAKING CLAIMS, which is the surface BOOT
// says has no instrument at all.
const ARTIFACT_DIRS = ['exo_memory/loop/', 'exo_memory/map/', 'exo_memory/journal/'];

function git(args) {
  return execSync(`git ${args}`, { cwd: repoRoot(), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}
function repoRoot() {
  return process.env.FERRY_REPO || 'C:\\Consonance\\lighthouse';
}

/** Every commit that touched a claim-bearing file, newest first. */
function artifactCommits() {
  const out = git(`log --format=%H%x1f%at%x1f%s --name-only -- ${ARTIFACT_DIRS.join(' ')}`);
  const commits = [];
  let cur = null;
  for (const line of out.split(/\r?\n/)) {
    if (line.includes('\x1f')) {
      const [sha, at, subject] = line.split('\x1f');
      cur = { sha, at: Number(at) * 1000, subject, files: [] };
      commits.push(cur);
    } else if (line.trim() && cur) {
      if (ARTIFACT_DIRS.some(d => line.startsWith(d))) cur.files.push(line.trim());
    }
  }
  return commits.filter(c => c.files.length > 0);
}

function ledger() {
  if (!fs.existsSync(LEDGER)) return [];
  return fs.readFileSync(LEDGER, 'utf8').split(/\r?\n/).filter(Boolean).map(l => {
    try { return JSON.parse(l); } catch { return null; }
  }).filter(Boolean);
}

/** When the instrument started existing. Commits older than this are UNMEASURED, not missed.
 *
 * The first report said 97.2% and that number was forced by construction: the denominator spanned
 * 47 days of history while the numerator could only span the hour the ledger had existed. Any
 * ledger created today, against that denominator, must print >=97% regardless of what actually
 * happened — so it measured the ledger's birthday. Worse, it CONTRADICTED this file's own header,
 * which credits the keeper with routing by hand every time; those ferries happened and were all
 * counted as misses. And it could only ever fall as the tool got used, which would have read as
 * improvement caused by the tool.
 */
function epoch() {
  const e = ledger().find(r => r.epoch);
  if (e) return e.epoch;
  const times = ledger().map(r => r.ferried_at).filter(Number.isFinite);
  return times.length ? Math.min(...times) : null;
}

function record(sha, panes, when) {
  fs.mkdirSync(path.dirname(LEDGER), { recursive: true });
  // IDEMPOTENT. Without this the ledger accumulates duplicate rows for one commit — it already
  // holds `cb0df2d38` and `cb0df2d` for the same one, because a sha was typed twice. Counting
  // dedupes, so the totals stayed right; row count and ferry count would have drifted apart until
  // someone read the difference as data.
  const already = ledger().some(r => r.sha && (sha.startsWith(r.sha) || r.sha.startsWith(sha)));
  if (already) return null;
  const row = { sha, panes, ferried_at: when };
  fs.appendFileSync(LEDGER, JSON.stringify(row) + '\n');
  return row;
}

/** The two sets joined. An artifact is FERRIED if any ledger row names its sha.
 *
 * PREFIX MATCH, and it is not a convenience. The first version compared full shas exactly, so
 * three rows recorded with the short shas a human actually types were written to the ledger,
 * matched nothing, and the report said 0 ferried WITH NO ERROR. An instrument that accepts a
 * write and then silently omits it from its own count is the failure this whole tool exists to
 * make visible, reproduced inside the tool on its first use. A row shorter than 7 is refused
 * rather than matched loosely, because at 6 characters collisions stop being hypothetical.
 */
function status() {
  const rows = ledger().filter(r => r.sha && r.sha.length >= 7);
  return artifactCommits().map(c => ({
    ...c,
    ferry: rows.find(r => c.sha.startsWith(r.sha) || r.sha.startsWith(c.sha)) || null,
  }));
}

function report() {
  const all = status();
  const ep = epoch();
  // Split at the epoch. A rate is only computed over the window the instrument existed for;
  // everything older is reported as UNMEASURED and never folded into a percentage.
  const inWindow = ep === null ? [] : all.filter(r => r.at >= ep);
  const before = ep === null ? all : all.filter(r => r.at < ep);
  const ferried = inWindow.filter(r => r.ferry);
  const missed = inWindow.filter(r => !r.ferry);
  const lat = all.filter(r => r.ferry)
    .map(r => (r.ferry.ferried_at - r.at) / 60000)
    .filter(n => Number.isFinite(n) && n >= 0)
    .sort((a, b) => a - b);
  const median = lat.length ? lat[Math.floor(lat.length / 2)] : null;

  console.log(`artifact commits       ${all.length}`);
  console.log(`  before the ledger    ${before.length}   UNMEASURED - the instrument did not exist`);
  console.log(`  since the ledger     ${inWindow.length}`);
  console.log(`ferried (in window)    ${ferried.length}`);
  console.log(`missed  (in window)    ${missed.length}`);
  // A RATE NEEDS AN n. The first version printed 97.2% off a denominator the instrument could not
  // have observed; the fix made the window honest and immediately produced 0.0% off n=3, which is
  // the same defect pointing the other way and reads as a clean bill of health. Under 10 the
  // counts print and the percentage does not.
  const RATE_FLOOR = 10;
  const rate = inWindow.length >= RATE_FLOOR
    ? (100 * missed.length / inWindow.length).toFixed(1) + '%'
    : `n/a - only ${inWindow.length} in window, need ${RATE_FLOOR} before a rate means anything`;
  console.log(`miss rate              ${rate}`);
  console.log(`median latency         ${median === null ? 'n/a' : median.toFixed(1) + ' min'}`);
  if (ep !== null) console.log(`ledger epoch           ${new Date(ep).toISOString().slice(0, 16).replace('T', ' ')}`);
  return { total: all.length, unmeasured: before.length, window: inWindow.length, ferried: ferried.length, missed: missed.length, median, epoch: ep };
}

if (require.main === module) {
  const argv = process.argv.slice(2);
  if (argv[0] === '--due') {
    const due = status().filter(r => !r.ferry);
    for (const r of due) {
      console.log(`${r.sha.slice(0, 7)}  ${new Date(r.at).toISOString().slice(0, 16).replace('T', ' ')}  ${r.subject}`);
    }
    console.log(`\n${due.length} artifact commit(s) never ferried`);
  } else if (argv[0] === '--record') {
    const [, sha, ...panes] = argv;
    if (!sha || !panes.length) { console.error('usage: --record <sha> <pane>...'); process.exit(2); }
    // Stamped by the caller, never by the module, so the ledger is reproducible in tests.
    const when = Number(process.env.FERRY_NOW) || Date.now();
    console.log(JSON.stringify(record(sha, panes, when)));
  } else {
    report();
  }
}

module.exports = { artifactCommits, ledger, record, status, report, epoch, LEDGER, ARTIFACT_DIRS };
