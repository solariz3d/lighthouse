/* board-bursts.js — per-burst forensics for the board's replay defect: WHICH re-reads, WHEN,
 * and whether each one announced itself.
 *
 * WHAT THIS FOUND WHEN FIRST RUN (2026-08-17, board at 51,279 rows) — kept here because the
 * numbers date but the signatures don't:
 *
 *   THE OFFSET-ZERO SIGNATURE. 15 bursts of >=100 backward rows; TWELVE began with Main's
 *   literal first turn ever ("Hello", 2026-06-30 08:05) — full re-reads of the entire Main
 *   transcript from byte 0, at ~2/day on active days, at Main-relaunch wall-clocks (~07:59
 *   and ~01:15 local). A burst whose first backward row sits at its pane's minimum board ts
 *   is a resume_offset -> 0 event; a burst starting mid-history is a STALE offset instead
 *   (two app processes clobbering tailer-offsets.json — save_offsets writes the whole map,
 *   last writer wins; 2 of 15 fit that).
 *
 *   ANNOUNCED vs SILENT. Only 4 of 15 bursts sat within 30 lines of a "backfill: first
 *   launch" announce. The announce is armed by BACKFILL_ACTIVE = !offsets_path().exists()
 *   (main.rs) — it covers ONLY the missing-file case, and the "ONE TIME" line has fired 11
 *   times. The other resets — head mismatch and shrink, the two silent arms of
 *   resume_offset — announce NOTHING. Eleven full re-reads of a 100MB transcript said not
 *   one word. The compounding factor was never the re-read; it was the silence.
 *
 *   THE HEAD IS AIMED AT THE MUTABLE REGION. The transcript fingerprint is FNV over the
 *   FIRST 512 bytes (HEAD_BYTES, main.rs) — and a Claude Code transcript opens with
 *   mode / permission-mode / file-history-snapshot records, harness-rewritable header
 *   content on a file this room has already documented as mutating while watched. The
 *   identity check was pointed at the one region of an append-only log that gets rewritten.
 *   (Falsifier before any rebuild: head-watch.js, which logs whether the head actually
 *   flips at a Main relaunch, and discriminates the head arm from the shrink arm.)
 *
 *   TWO HALVES, EACH ASSUMING THE OTHER. resume_offset resolves doubt to 0 because
 *   "re-reading a file is a duplicate the dedup belt can catch" — but the belt (SEEN) is
 *   process-memory and every launch-time reset runs against an EMPTY belt. The offset
 *   persistence trusts the belt exactly where the belt does not exist yet; both halves are
 *   absent at the same moment, and 30k rows landed through the gap.
 *
 * BURST COUNT IS A CLUSTERING-PARAMETER ARTIFACT — this tool prints the count at two gap
 * widths to keep that visible (first run: 31 bursts at gap<=20 lines, ONE at gap<=200).
 * Never publish "N bursts" bare; publish the re-read count and cadence, which are stable.
 *
 * Read-only.   node consonance/tools/board-bursts.js [--min-size N]
 */
'use strict';
const fs = require('fs');
const { parseBoard, markBackward, BOARD } = require('./board-audit.js');

/* Cluster backward rows into bursts: same burst while the next backward row is within
 * gapLines of the previous one. The gap parameter is the artifact knob — see header. */
function clusterBursts(isBack, gapLines) {
  const bursts = [];
  let cur = null;
  for (let i = 0; i < isBack.length; i++) {
    if (!isBack[i]) continue;
    if (cur && i - cur.end <= gapLines) { cur.end = i; cur.n++; }
    else { cur = { start: i, end: i, n: 1 }; bursts.push(cur); }
  }
  return bursts;
}

/* Offset-zero signature: the burst's first backward row sits at (within a minute of) its
 * pane's minimum ts anywhere on the board — i.e. the replay began at the transcript's top. */
function atPaneMin(rows, paneMin, first) {
  return Math.abs(first.ts - (paneMin.get(first.pane) || 0)) < 60_000;
}

module.exports = { clusterBursts, atPaneMin };

if (require.main === module) {
  let minSize = 100;
  const mi = process.argv.indexOf('--min-size');
  if (mi > 0 && process.argv[mi + 1]) minSize = Number(process.argv[mi + 1]);

  const lines = fs.readFileSync(BOARD, 'utf8').split('\n').filter(Boolean);
  const rows = parseBoard(lines);
  const isBack = markBackward(rows);

  const tight = clusterBursts(isBack, 20);
  const loose = clusterBursts(isBack, 200);
  console.log(`bursts at gap<=20: ${tight.length}   at gap<=200: ${loose.length}   <- parameter-dependent, see header`);

  const paneMin = new Map();
  for (const r of rows) if (!paneMin.has(r.pane) || r.ts < paneMin.get(r.pane)) paneMin.set(r.pane, r.ts);
  const announces = rows.filter(r => r.text.startsWith('backfill: first launch'));
  console.log(`backfill announces on the board: ${announces.length} (the line that says ONE TIME)`);

  const fmt = t => new Date(t).toISOString().replace('T', ' ').slice(0, 16);
  const big = tight.filter(b => b.n >= minSize);
  console.log(`\nbursts >= ${minSize} rows: ${big.length}`);
  console.log('lines               n   firstBackTs        wall(prev fresh)  offset-zero  announced  first row');
  for (const b of big) {
    const first = rows[b.start];
    let wall = null;
    for (let i = b.start - 1; i >= 0; i--) if (!isBack[i]) { wall = rows[i].ts; break; }
    const zero = atPaneMin(rows, paneMin, first) ? 'YES' : 'no ';
    const ann = announces.some(a => a._i >= b.start - 30 && a._i <= b.start + 5) ? 'ANNOUNCED' : 'silent   ';
    console.log(`${String(b.start).padStart(6)}-${String(b.end).padEnd(6)} ${String(b.n).padStart(5)}  ${fmt(first.ts)}  ${wall ? fmt(wall) : '?               '}  ${zero}          ${ann}  ${first.pane.slice(0, 8)} ${JSON.stringify(first.text.slice(0, 36))}`);
  }

  const byDay = {};
  for (const b of big) {
    let wall = null;
    for (let i = b.start - 1; i >= 0; i--) if (!isBack[i]) { wall = rows[i].ts; break; }
    const day = wall ? new Date(wall).toISOString().slice(0, 10) : '?';
    byDay[day] = (byDay[day] || 0) + b.n;
  }
  console.log('\nreplayed rows by estimated wall day (dating is the previous fresh row — an estimate):');
  for (const d of Object.keys(byDay).sort()) console.log(`  ${d}  ${byDay[d]}`);
}
