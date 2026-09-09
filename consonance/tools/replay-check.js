/* replay-check.js — score a relaunch against a bound taken from the TRANSCRIPTS, never from
 * board.jsonl. Written 2026-09-09 for L049 (P-BOARD-REPLAY).
 *
 * WHY IT EXISTS. "The board relaunched and barely grew" is consistent with two different
 * worlds: the writer is fixed, or the writer is open and the night was quiet. A count taken
 * from board.jsonl cannot tell those apart, because it is the file under judgement. So the bar
 * is: a relaunch may add no more transcript-sourced rows than there are NEW TRANSCRIPT LINES
 * since the mark — a number that lives in ~/.claude/projects and moves for its own reasons.
 *
 * THE UNIT, and why it is lines and not turns. Every board row the tailer writes comes from
 * exactly one transcript JSONL line (start_tailer -> extract_turn, main.rs). Not every line
 * becomes a row — tool results, summaries and empty-text turns are dropped — so the line count
 * is an UPPER BOUND that cannot undercount. Counting "turns" instead would mean mirroring
 * extract_turn here, and a mirror that drifts from its original is a number nobody can check.
 * A loose bound that is certainly a bound beats a tight one that is possibly wrong.
 *
 * Rows the tailer did NOT write — the `backfill` announcement, committee and chair posts — are
 * not bounded by anything in a transcript. They are counted separately and reported, never
 * folded into the pass. That split is the only thing the scorer reads out of board.jsonl
 * besides the byte offset it starts at.
 *
 *   node consonance/tools/replay-check.js --mark      # before quitting the app
 *   ... quit, relaunch, wait past the 20s backfill window ...
 *   node consonance/tools/replay-check.js --score     # prints PASS/FAIL and every input
 *
 * Read-only except for the mark file. It REFUSES to score across a compaction (a board smaller
 * than at the mark), since the two are then not the same corpus and a verdict across that seam
 * is arithmetic on sand.
 *
 * WHERE THE FILES ARE, and why there is no default (2026-09-09, second pass — portable-paths
 * read this file RED at the two lines that used to be here, and it was right).
 *
 * The first version hardcoded one machine's data dir. Its failure on any other machine is not
 * the one you would guess, so both are stated: an ABSENT board throws ENOENT out of statSync
 * and is loud, no argument. The dangerous case is a board that EXISTS at the hardcoded path and
 * is not the live one — a second checkout, a restored backup, a machine that keeps the layout
 * but points data_dir elsewhere. Then the tool scores a live relaunch against a board nobody is
 * writing, sees nothing added, and prints PASS. A dead board reads as a fixed writer, which is
 * the exact inversion this instrument exists to prevent.
 *
 * That is not hypothetical in kind. There is a stale twin of the board on this very machine, in
 * the DEFAULT data dir, 212 rows, last written 2026-07-27 — produced by the defect this tool
 * was built for (main.rs resolving a data path before set_dirs). A detector for "a file written
 * at one path and read at another" cannot itself carry a literal path; that is the same bug
 * rebuilt inside the instrument that catches it. And the lap this landed in is the two-machine
 * lap, where a one-machine literal is not a style question.
 *
 * So: resolution order is CONSONANCE_BOARD / CONSONANCE_REPLAY_MARK / CONSONANCE_PROJECTS, then
 * CONSONANCE_DATA, then data_dir from ~/.consonance.json, then NOTHING. No fatal default. If it
 * cannot resolve, it says what it looked for and exits non-zero rather than inventing a path and
 * reporting a number about a machine it never opened — chain-status.js:261-274 is the authority
 * for this order and for that instruction; it is copied rather than imported, the way that file
 * copies lap-row.js, and named here so the copy is auditable.
 *
 * The mark file's name and its home are fixed by the state manifest, which classifies
 * `replay-check.mark.json` at the data-dir root as STAYS (a mark names this machine's board AND
 * its transcripts, and transcripts do not travel). Renaming it breaks that entry — the manifest
 * records the reservation.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');

/* ~/.consonance.json, the app's own config. Order and shape copied from chain-status.js:252. */
function fromConfig(key) {
  try {
    const raw = fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^\uFEFF/, '');
    const v = JSON.parse(raw);
    const d = v && v[key] != null ? String(v[key]).trim() : '';
    return d || null;
  } catch (_) { return null; }
}

/* Pure over its inputs so the resolution order is testable without a config file or a spawn —
 * the order IS the fix, and an untestable fix for a path defect is not a fix. */
function resolve(env = process.env, cfg = fromConfig) {
  const pick = (k) => (env[k] || '').trim() || null;
  const dataDir = pick('CONSONANCE_DATA') || cfg('data_dir') || null;
  const under = (name) => (dataDir ? path.join(dataDir, name) : null);
  return {
    dataDir,
    board: pick('CONSONANCE_BOARD') || under('board.jsonl'),
    mark: pick('CONSONANCE_REPLAY_MARK') || under('replay-check.mark.json'),
    // Not data_dir: this is Claude Code's own layout under the user's home, portable by shape.
    projects: pick('CONSONANCE_PROJECTS') || path.join(os.homedir(), '.claude', 'projects'),
  };
}

const { board: BOARD, mark: MARK, projects: PROJECTS } = resolve();

/* Complete lines only — a torn final line has not been handed to any reader yet. Pure. */
function countLines(buf) {
  let n = 0;
  for (let i = 0; i < buf.length; i++) if (buf[i] === 0x0a) n++;
  return n;
}

/* Every pane transcript Consonance tails: <projects>/<encoded cwd>/<session id>.jsonl. Keyed by
 * session id because that IS the board's `pane` field (start_tailer takes pane_id as the file
 * stem), which is what lets the split below be exact rather than a guess. */
function transcripts(root) {
  const out = {};
  let dirs = [];
  try { dirs = fs.readdirSync(root, { withFileTypes: true }); } catch (_) { return out; }
  for (const d of dirs) {
    if (!d.isDirectory()) continue;
    let files = [];
    try { files = fs.readdirSync(path.join(root, d.name)); } catch (_) { continue; }
    for (const f of files) {
      if (!f.endsWith('.jsonl')) continue;
      const p = path.join(root, d.name, f);
      try {
        out[f.slice(0, -6)] = {
          path: p,
          bytes: fs.statSync(p).size,
          lines: countLines(fs.readFileSync(p)),
        };
      } catch (_) { /* vanished between readdir and stat: not a pane anyone can be judged on */ }
    }
  }
  return out;
}

/* The bound: new transcript lines since the mark. A transcript that appeared after the mark
 * contributes ALL of its lines; one that SHRANK contributes all of its lines too, because a
 * shrink is exactly the case where the tailer is entitled to re-read from the top
 * (resume_offset, the len < offset arm) and a delta would understate what it may legitimately
 * push. Pure over two snapshots, so the test can drive it without a filesystem. */
function bound(before, after) {
  let total = 0;
  const per = {};
  for (const [sid, now] of Object.entries(after)) {
    const was = before[sid];
    const n = !was || now.lines < was.lines ? now.lines : now.lines - was.lines;
    per[sid] = n;
    total += n;
  }
  return { total, per };
}

/* Split the rows appended since the mark into the ones a transcript can account for and the
 * ones it cannot. `known` is the set of session ids that have a transcript on this machine. */
function splitAdded(tailText, known) {
  let fromTranscripts = 0, other = 0, unparsed = 0;
  for (const line of tailText.split('\n')) {
    if (!line) continue;
    let row;
    try { row = JSON.parse(line); } catch (_) { unparsed++; continue; }
    if (known.has(row.pane)) fromTranscripts++;
    else other++;
  }
  return { fromTranscripts, other, unparsed };
}

/* The verdict. Pure, and deliberately the whole of the judgement — everything above is
 * counting. `added` must be transcript-sourced rows only, and `boundTotal` must come from the
 * transcripts. If the two are ever computed from the same file this returns pass forever,
 * which is the failure the whole tool exists to make unreachable by accident. */
function verdict(added, boundTotal) {
  return { pass: added <= boundTotal, added, bound: boundTotal, excess: Math.max(0, added - boundTotal) };
}

module.exports = { countLines, transcripts, bound, splitAdded, verdict, resolve, BOARD, MARK, PROJECTS };

if (require.main === module) {
  const mode = process.argv[2];

  // Degrade LOUDLY. The alternative — a default — makes this tool report a number about a
  // machine it never opened, which is the failure it was built to catch. Exit 4, name what was
  // looked for, print nothing that could be mistaken for a measurement.
  if (!BOARD || !MARK) {
    console.error('replay-check: cannot locate the board or the mark, so there is nothing to');
    console.error('measure and no default worth guessing. Looked for, in order:');
    console.error('  CONSONANCE_BOARD / CONSONANCE_REPLAY_MARK   (unset)');
    console.error('  CONSONANCE_DATA                             (unset)');
    console.error(`  data_dir in ${path.join(os.homedir(), '.consonance.json')}   (absent or empty)`);
    process.exit(4);
  }

  const boardBytes = fs.statSync(BOARD).size;

  if (mode === '--mark') {
    const m = { at: new Date().toISOString(), board: BOARD, boardBytes, panes: transcripts(PROJECTS) };
    fs.writeFileSync(MARK, JSON.stringify(m, null, 2));
    const lines = Object.values(m.panes).reduce((a, p) => a + p.lines, 0);
    console.log(`marked ${m.at}`);
    console.log(`  board  ${boardBytes} bytes  (${BOARD})`);
    console.log(`  panes  ${Object.keys(m.panes).length} transcripts, ${lines} lines`);
    console.log(`  mark   ${MARK}`);
    console.log('\nQuit the app, relaunch, wait past the 20s backfill window, then run --score.');
    process.exit(0);
  }

  if (mode !== '--score') {
    console.error('usage: replay-check.js --mark | --score');
    process.exit(2);
  }

  const m = JSON.parse(fs.readFileSync(MARK, 'utf8'));
  if (boardBytes < m.boardBytes) {
    console.error(`REFUSED: the board is ${m.boardBytes - boardBytes} bytes SMALLER than at the mark.`);
    console.error('It was rotated or compacted, so this is not the same corpus and a verdict taken');
    console.error('across that seam would mean nothing. Re-mark, then relaunch.');
    process.exit(3);
  }
  const fd = fs.openSync(BOARD, 'r');
  const tail = Buffer.alloc(boardBytes - m.boardBytes);
  if (tail.length) fs.readSync(fd, tail, 0, tail.length, m.boardBytes);
  fs.closeSync(fd);

  const now = transcripts(PROJECTS);
  const b = bound(m.panes, now);
  const added = splitAdded(tail.toString('utf8'), new Set(Object.keys(now)));
  const v = verdict(added.fromTranscripts, b.total);

  console.log(`mark taken ${m.at}`);
  console.log(`board grew ${boardBytes - m.boardBytes} bytes since the mark`);
  console.log(`  rows added, transcript-sourced : ${added.fromTranscripts}   <- judged`);
  console.log(`  rows added, everything else    : ${added.other}   (backfill / committee / chair — unbounded, reported not judged)`);
  if (added.unparsed) console.log(`  unparsed lines                 : ${added.unparsed}`);
  console.log(`  BOUND, new transcript lines    : ${b.total}   <- from ${PROJECTS}, not from the board`);
  for (const [sid, n] of Object.entries(b.per)) if (n) console.log(`      ${sid}  +${n}`);
  console.log(`\n${v.pass ? 'PASS' : 'FAIL'}: ${v.added} transcript-sourced rows against a bound of ${v.bound}`
    + (v.pass ? '' : ` — ${v.excess} rows no transcript can account for. That is replay.`));
  process.exit(v.pass ? 0 : 1);
}
