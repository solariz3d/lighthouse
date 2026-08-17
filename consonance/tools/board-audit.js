/* board-audit.js — re-derive the board's duplication numbers from board.jsonl, deterministically.
 *
 * WHY THIS EXISTS (2026-08-17, the night the board's 96.6% turned out to be replay).
 * board.jsonl carried 51k rows of which ~58% were exact (pane, role, text) repeats within 30s of
 * a previous copy and ~65% carried a timestamp BEHIND the maximum already written. The published
 * pane-share figures (95% on 08-09, 96.4% on 08-15, 96.6% on 08-16) all counted the replays, and
 * the published TREND — "five panes were added and the share went UP" — was measuring replay
 * accumulation, not room behaviour: re-derived clean, the share FELL (92.9 → 92.6 → 91.8 by one
 * pipeline, 92.4 → 92.1 → 91.2 by an independent second) while raw rose 94.6 → 96.4 → 96.6.
 * The panes DID dilute Main. Raw board counts are not comparable across days until the replay
 * fix lands; this tool is how any board-derived number gets re-derived clean.
 *
 * THE MECHANISM the numbers trace back to (see board-bursts.js for the per-burst forensics):
 * the tailer's dedup belt (SEEN, main.rs) is process-memory, and resume_offset (main.rs) resolves
 * any doubt about a transcript to offset 0 on the stated grounds that "re-reading a file is a
 * duplicate the dedup belt can catch." At launch the belt is EMPTY — the offset persistence
 * trusts the belt exactly where the belt does not exist yet, two halves each assuming the other,
 * both absent at the same moment. Every silent full re-read replays turns with their ORIGINAL
 * transcript timestamps, which is why the duplicates sit at 0ms gap from their originals and why
 * bucketing timestamps could never have fixed this: the keys already matched; the table was empty.
 *
 * Read-only. Every number this prints re-derives from one run of this file.
 *
 *   node consonance/tools/board-audit.js [--at LINE]...
 *
 * --at LINE adds a snapshot row at that 1-based line count (defaults include 24845 and 42309,
 * the ~08-09 and 08-15 published snapshot points; raw at 42309 must print 96.4% — that match
 * against the 08-15 journal is what makes the clean-vs-raw comparison fair).
 */
'use strict';
const fs = require('fs');

const BOARD = process.env.CONSONANCE_BOARD || 'C:\\Consonance\\data\\board.jsonl';
const MAIN_SID = '0c0c0c0a-0000-4000-8000-000000000a01';
/* A repeat only counts against the corpus when it lands within this window of a previous copy.
 * Replays carry original timestamps, so they land at 0ms; a genuine later repeat (the keeper
 * saying "yes" twice) is a different turn with its own transcript ts and survives any window. */
const REPEAT_WINDOW_MS = 30_000;

function parseBoard(lines) {
  const rows = [];
  for (let i = 0; i < lines.length; i++) {
    try { const r = JSON.parse(lines[i]); r._i = i; rows.push(r); } catch (_) { /* torn tail line */ }
  }
  return rows;
}

/* Flag every row that repeats an identical (pane, role, text) within windowMs of the PREVIOUS
 * occurrence. Keyed on the previous occurrence, not the first — a replay of a replay is still
 * a repeat, and chaining on the latest copy is what keeps a thrice-replayed turn counted thrice. */
function markRepeats(rows, windowMs) {
  const lastSeen = new Map();
  const isRepeat = new Array(rows.length).fill(false);
  for (const r of rows) {
    const k = r.pane + '\u0000' + r.role + '\u0000' + r.text;
    if (lastSeen.has(k) && Math.abs(r.ts - lastSeen.get(k)) < windowMs) isRepeat[r._i] = true;
    lastSeen.set(k, r.ts);
  }
  return isRepeat;
}

/* Flag every row whose ts is behind the maximum already written — the replay tell, since the
 * board is append-only and live turns arrive in near order. Global max, not per-pane: a replay
 * is a re-read of history and history is behind everyone. */
function markBackward(rows) {
  let maxTs = 0;
  const isBack = new Array(rows.length).fill(false);
  for (const r of rows) {
    if (r.ts < maxTs) isBack[r._i] = true;
    else maxTs = r.ts;
  }
  return isBack;
}

/* Raw and clean share of one pane at each snapshot line count (1-based, ascending). */
function shareSnapshots(rows, isRepeat, pane, atLines) {
  const out = [];
  let rawPane = 0, cleanN = 0, cleanPane = 0, s = 0;
  const snaps = [...atLines].sort((a, b) => a - b);
  for (const r of rows) {
    if (r.pane === pane) rawPane++;
    if (!isRepeat[r._i]) { cleanN++; if (r.pane === pane) cleanPane++; }
    while (s < snaps.length && r._i + 1 === snaps[s]) {
      out.push({ at: snaps[s], raw: rawPane / (r._i + 1), clean: cleanPane / cleanN, cleanCorpus: cleanN });
      s++;
    }
  }
  return out;
}

module.exports = { parseBoard, markRepeats, markBackward, shareSnapshots, BOARD, MAIN_SID, REPEAT_WINDOW_MS };

if (require.main === module) {
  const lines = fs.readFileSync(BOARD, 'utf8').split('\n').filter(Boolean);
  const rows = parseBoard(lines);
  const isRepeat = markRepeats(rows, REPEAT_WINDOW_MS);
  const isBack = markBackward(rows);

  const repeats = isRepeat.filter(Boolean).length;
  const backward = isBack.filter(Boolean).length;
  let exact0 = 0;
  {
    const lastSeen = new Map();
    for (const r of rows) {
      const k = r.pane + '\u0000' + r.role + '\u0000' + r.text;
      if (lastSeen.has(k) && r.ts === lastSeen.get(k)) exact0++;
      lastSeen.set(k, r.ts);
    }
  }
  const pct = n => (100 * n / rows.length).toFixed(1) + '%';
  console.log(`board: ${rows.length} rows parsed of ${lines.length} lines  (${BOARD})`);
  console.log(`repeats <${REPEAT_WINDOW_MS / 1000}s of a previous copy: ${repeats} (${pct(repeats)}), of which exact-0ms: ${exact0}`);
  console.log(`rows behind the running ts maximum: ${backward} (${pct(backward)})`);

  const extra = [];
  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === '--at' && process.argv[i + 1]) extra.push(Number(process.argv[++i]));
  }
  const atLines = [...new Set([24845, 42309, rows.length, ...extra])].filter(n => n > 0 && n <= rows.length);
  console.log(`\nMain (${MAIN_SID.slice(0, 8)}) share, raw vs clean — the trend lives in the CLEAN column:`);
  for (const s of shareSnapshots(rows, isRepeat, MAIN_SID, atLines)) {
    console.log(`  at line ${String(s.at).padStart(6)}: raw ${(100 * s.raw).toFixed(1)}%  clean ${(100 * s.clean).toFixed(1)}%  (clean corpus ${s.cleanCorpus})`);
  }
}
