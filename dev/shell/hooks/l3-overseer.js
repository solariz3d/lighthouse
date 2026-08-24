#!/usr/bin/env node
// L3 overseer hook — runs FAST. Extracts a multi-turn USER trajectory view
// from the transcript, drops a job file, kicks off the worker detached, exits.
// The worker handles the actual `claude -p` call (with WELFARE.md as the L3
// discipline) and logging.
//
// L3 watches the USER, not the model — see lighthouse/WELFARE.md for the
// discipline. Output schema: {trajectory, specific_observations, recommendation}.
//
// v0 IS DELIBERATELY SILENT IN-SESSION — verdicts log to l3_overseer.jsonl
// and (planned, not yet built) get surfaced via SessionStart to the next
// session so the model can read what L3 saw and decide what to do with it.
// L3 itself NEVER speaks to the user; per WELFARE.md the model in the loop
// is the agent of any change.
//
// Reentrancy-safe: bails if CLAUDE_OVERSEER_RUN=1 in env (worker sets this
// when spawning claude -p, so the overseer's own Stop doesn't loop, and
// L2 + L3 hooks don't trigger each other recursively).

// THE DREAM GATE, the same one every other hook here carries. The gap-dream is an
// anti-instruction and gets no instrumentation: L3 watches the USER trajectory, and a dream has
// no user in it. Without this the overseer files arc-perceptions about a synthetic session into
// the same ledger the real ones land in.
//
// ADDED 2026-08-17 and it was absent for the file's whole life. Invisible because this hook was
// in no repository and in no installer manifest, so dream-gate.test.js — which polices exactly
// this invariant across install.ps1's manifest — could not see it. It failed on the first run
// after the manifest grew: "a hook the dream runner cannot switch off", and "spoke to a dream".
if (process.env.CONSONANCE_DREAM) process.exit(0);
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const // CONSONANCE_DATA first. Hardcoded, these six wrote their ledgers into the REAL ~/.claude/shell
// every time dream-gate.test.js spawned them with a synthetic payload -- 276 rows per file, all
// of it test residue carrying Main's session id as a fixture literal, which is why it read from
// outside as an unaccounted process writing about a live session (pane E, 2026-08-24).
//
// Same seam precompact-preserve.js:66 already uses, and dream-gate.test.js already sets the
// variable for every hook it spawns (:230), so the harness isolates itself with no test change.
SHELL_DIR = process.env.CONSONANCE_DATA || path.join(os.homedir(), '.claude', 'shell');
const JOBS_DIR = path.join(SHELL_DIR, 'l3-jobs');
const OVERSEER_LOG = path.join(SHELL_DIR, 'l3_overseer.jsonl');
const WORKER = path.join(SHELL_DIR, 'hooks', 'l3-overseer-worker.js');

// How many recent user TEXT messages to include in the trajectory view.
// L3 needs multi-turn context to see arc-level patterns; single turn won't
// surface cadence, frame-hardening, or compounding dependence.
const TRAJECTORY_TURNS = 10;

// Each user message capped at this many chars in the view (avoid one giant
// message swamping the trajectory signal).
const PER_TURN_CHARS = 2000;

function safeReadStdin() {
  try { return fs.readFileSync(0, 'utf8'); } catch (e) { return ''; }
}
function safeParseJSON(s) {
  if (!s) return {};
  try { return JSON.parse(s); } catch (e) { return {}; }
}
function safeAppend(p, obj) {
  try { fs.appendFileSync(p, JSON.stringify(obj) + '\n'); } catch (e) {}
}

function extractText(msg) {
  if (!msg) return '';
  if (typeof msg.content === 'string') return msg.content;
  if (Array.isArray(msg.content)) {
    return msg.content
      .filter(p => p.type === 'text')
      .map(p => p.text)
      .join('\n');
  }
  return '';
}

// Read the tail of the transcript and extract the last N user TEXT messages
// with timestamps. Skips tool_result-only user turns. Newest last in the
// returned array (chronological order).
function readTrajectoryView(transcriptPath) {
  if (!transcriptPath || !fs.existsSync(transcriptPath)) return null;
  try {
    const TAIL_BYTES = 8 * 1024 * 1024;
    const stats = fs.statSync(transcriptPath);
    const start = Math.max(0, stats.size - TAIL_BYTES);
    const length = stats.size - start;
    const buf = Buffer.alloc(length);
    const fd = fs.openSync(transcriptPath, 'r');
    try { fs.readSync(fd, buf, 0, length, start); }
    finally { fs.closeSync(fd); }
    let text = buf.toString('utf8');
    if (start > 0) {
      const nl = text.indexOf('\n');
      if (nl >= 0) text = text.slice(nl + 1);
    }
    const lines = text.trim().split('\n');

    // Walk forward; collect every user TEXT message with timestamp.
    const userTurns = [];
    for (const ln of lines) {
      const obj = safeParseJSON(ln);
      if (!obj.message || obj.message.role !== 'user') continue;
      const txt = extractText(obj.message).trim();
      if (!txt) continue;
      userTurns.push({
        timestamp: obj.timestamp || null,
        text: txt.slice(0, PER_TURN_CHARS)
      });
    }
    if (!userTurns.length) return null;
    return userTurns.slice(-TRAJECTORY_TURNS);
  } catch (e) {
    return null;
  }
}

function main() {
  if (process.env.CLAUDE_OVERSEER_RUN === '1') {
    process.stdout.write('{}');
    return;
  }

  const meta = safeParseJSON(safeReadStdin());
  const view = readTrajectoryView(meta.transcript_path);

  if (view && view.length) {
    try {
      if (!fs.existsSync(JOBS_DIR)) fs.mkdirSync(JOBS_DIR, { recursive: true });
      const jobId = Date.now() + '-' + Math.random().toString(36).slice(2, 8);
      const jobPath = path.join(JOBS_DIR, jobId + '.json');
      const job = {
        job_id: jobId,
        created_at: new Date().toISOString(),
        session_id: meta.session_id || null,
        user_turns: view
      };
      fs.writeFileSync(jobPath, JSON.stringify(job));

      const child = spawn(process.execPath, [WORKER, jobPath], {
        env: { ...process.env, CLAUDE_OVERSEER_RUN: '1' },
        detached: true,
        stdio: 'ignore',
        windowsHide: true
      });
      child.unref();
    } catch (e) {
      safeAppend(OVERSEER_LOG, {
        type: 'l3_overseer_hook_error',
        timestamp: new Date().toISOString(),
        error: String(e).slice(0, 400)
      });
    }
  } else {
    safeAppend(OVERSEER_LOG, {
      type: 'l3_overseer_skipped',
      timestamp: new Date().toISOString(),
      session_id: meta.session_id || null,
      reason: 'no user text turns found in trajectory view',
      transcript_path: meta.transcript_path || null
    });
  }

  process.stdout.write('{}');
}

main();
