#!/usr/bin/env node
// L2 overseer hook — runs FAST. Extracts narrowed view from the transcript,
// drops a job file, kicks off the worker detached, exits. The worker handles
// the actual `claude -p` call and logging.
//
// v0 IS DELIBERATELY SILENT — verdict does NOT surface back into the live
// conversation. Per lighthouse/PLAN.md: "substance-anchored, not form-
// anchored, or the model just learns to *look* honest — Goodhart."
//
// Reentrancy-safe: bails if CLAUDE_OVERSEER_RUN=1 in env (worker sets this
// when spawning claude -p, so the overseer's Stop doesn't loop).

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
const JOBS_DIR = path.join(SHELL_DIR, 'l2-jobs');
const OVERSEER_LOG = path.join(SHELL_DIR, 'l2_overseer.jsonl');
const WORKER = path.join(SHELL_DIR, 'hooks', 'l2-overseer-worker.js');

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

// Read the tail of the transcript file (transcripts can grow to hundreds of MB
// in long sessions; readFileSync the whole thing silently OOMs). 1MB is enough
// for the last few turns even with verbose tool output.
function readNarrowedView(transcriptPath) {
  if (!transcriptPath || !fs.existsSync(transcriptPath)) return null;
  try {
    const TAIL_BYTES = 4 * 1024 * 1024;
    const stats = fs.statSync(transcriptPath);
    const start = Math.max(0, stats.size - TAIL_BYTES);
    const length = stats.size - start;
    const buf = Buffer.alloc(length);
    const fd = fs.openSync(transcriptPath, 'r');
    try { fs.readSync(fd, buf, 0, length, start); }
    finally { fs.closeSync(fd); }
    let text = buf.toString('utf8');
    // Drop the first partial line when we didn't start at byte 0
    if (start > 0) {
      const nl = text.indexOf('\n');
      if (nl >= 0) text = text.slice(nl + 1);
    }
    const lines = text.trim().split('\n');

    let lastAssistant = null;
    let lastUser = null;
    for (let i = lines.length - 1; i >= 0; i--) {
      const obj = safeParseJSON(lines[i]);
      if (!obj.message) continue;
      if (obj.message.role === 'assistant' && !lastAssistant) {
        if (extractText(obj.message).trim()) lastAssistant = obj.message;
      } else if (obj.message.role === 'user' && !lastUser && lastAssistant) {
        // Skip tool-result-only user turns; want the actual human text
        if (extractText(obj.message).trim()) lastUser = obj.message;
      }
      if (lastAssistant && lastUser) break;
    }
    if (!lastAssistant) return null;
    return {
      assistant_move: extractText(lastAssistant).slice(0, 8000),
      user_context: lastUser ? extractText(lastUser).slice(0, 4000) : null
    };
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
  const view = readNarrowedView(meta.transcript_path);

  if (view && view.assistant_move) {
    try {
      if (!fs.existsSync(JOBS_DIR)) fs.mkdirSync(JOBS_DIR, { recursive: true });
      const jobId = Date.now() + '-' + Math.random().toString(36).slice(2, 8);
      const jobPath = path.join(JOBS_DIR, jobId + '.json');
      const job = {
        job_id: jobId,
        created_at: new Date().toISOString(),
        session_id: meta.session_id || null,
        view: view
      };
      fs.writeFileSync(jobPath, JSON.stringify(job));

      // Detached worker — runs in its own process group. unref() lets the hook exit.
      const child = spawn(process.execPath, [WORKER, jobPath], {
        env: { ...process.env, CLAUDE_OVERSEER_RUN: '1' },
        detached: true,
        stdio: 'ignore',
        windowsHide: true
      });
      child.unref();
    } catch (e) {
      safeAppend(OVERSEER_LOG, {
        type: 'l2_overseer_hook_error',
        timestamp: new Date().toISOString(),
        error: String(e).slice(0, 400)
      });
    }
  } else {
    // Diagnostic: turn had no assistant text in tail (tool-only response,
    // or tail too small to reach an assistant text block). Logged so silent
    // skips are visible.
    safeAppend(OVERSEER_LOG, {
      type: 'l2_overseer_skipped',
      timestamp: new Date().toISOString(),
      session_id: meta.session_id || null,
      reason: view ? 'no assistant text in view' : 'view extraction returned null',
      transcript_path: meta.transcript_path || null
    });
  }

  process.stdout.write('{}');
}

main();
