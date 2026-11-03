// second-reader-note.js - the second reader's SAME-TURN NOTE (D631 (b); plan: exo_memory/loop/plan_room_fixes_2_5_2026-11-03.md).
//
// A PostToolUse hook on mcp__consonance__call_librarian and mcp__consonance__call_chair. By the time it fires the ring has been DELIVERED
// (PostToolUse "fire[s] after a tool has already executed successfully", code.claude.com/docs/en/hooks, read 2026-11-03), so it cannot block,
// delay or alter a ring: it only shows the RINGING seat what the second reader found on that ring, as `additionalContext` beside the tool result
// ("Claude reads the reminder on the next model request", same page), in the same turn. A NOTE, NEVER A BLOCK: it never prints a decision,
// never exits non-zero, and every failure is silence.
//
// WHY SYNCHRONOUS. An `async: true` hook's output is "delivered on the next conversation turn" (same page, "How async hooks execute"), which is
// the next prompt, not this turn. So this hook waits, bounded, for the worker the PreToolUse half started (second-reader.js) to write this
// ring's row, found by the ring's tool_use_id. The worker took 7.1 s at the median and 10.3 s at p90 over 3,214 ok rows (the live ledger,
// 2026-11-03); WAIT_MS bounds the wait and install.ps1 registers this hook with a Timeout above it. The wait happens only on a ring the
// narrowed trigger sent to the model: an out-of-class ring's row (skipped-class) is already written when this fires, and it returns at once.
//
// WHAT IT SAYS: the flagged sentences and the sources they name, from the row, verbatim (already scrubbed by the worker), with a count. No
// advice and no instruction; the seat decides what to do (findings-return.js's fourth law). A note shown, and a wait that ran out, are each a
// ledger line (`note-shown`, `note-timeout`); the quotes are not copied into them.
'use strict';

if (process.env.CONSONANCE_DREAM) process.exit(0);   // THE DREAM GATE (dream-gate.test.js)

const fs = require('fs');
const os = require('os');
const path = require('path');

const RING_TOOLS = new Set(['mcp__consonance__call_librarian', 'mcp__consonance__call_chair']);
const RUN_ENV = 'CONSONANCE_SECOND_READER_RUN';
const WAIT_MS = Number(process.env.CONSONANCE_SECOND_READER_NOTE_WAIT_MS) > 0 ? Number(process.env.CONSONANCE_SECOND_READER_NOTE_WAIT_MS) : 25000;   // the override is the tests' seam
const GRACE_MS = 1500;      // no row and no worker holding the lock: the reader never started for this ring
const POLL_MS = 250;
const TAIL_BYTES = 256 * 1024;
const SHOW = 5;
const FINAL = new Set(['ok', 'error', 'skipped-class', 'skipped-busy', 'skipped-no-text']);

function dataDir() {   // the same resolution as second-reader.js
  const env = (process.env.CONSONANCE_DATA || '').trim();
  if (env) return env;
  try {
    const raw = fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^﻿/, '');
    const d = String((JSON.parse(raw) || {}).data_dir || '').trim();
    if (d) return d;
  } catch (_) { /* no config, or no data_dir in it: the app's default below */ }
  return path.join(os.homedir(), '.consonance');
}

/** This ring's final row in the ledger tail, or null. Never throws. */
function findRow(dir, toolUseId) {
  try {
    const p = path.join(dir, 'second-reader.jsonl'), size = fs.statSync(p).size, start = Math.max(0, size - TAIL_BYTES), len = size - start, buf = Buffer.alloc(len);
    const fd = fs.openSync(p, 'r'); try { fs.readSync(fd, buf, 0, len, start); } finally { fs.closeSync(fd); }
    const lines = buf.toString('utf8').split('\n');
    for (let i = lines.length - 1; i >= 0; i--) {
      if (!lines[i].includes(toolUseId)) continue;
      let r; try { r = JSON.parse(lines[i]); } catch (_) { continue; }
      if (r && r.toolUseId === toolUseId && FINAL.has(r.status)) return r;
    }
  } catch (_) { /* no ledger yet */ }
  return null;
}

function workerRunning(dir) {
  try {
    const held = JSON.parse(fs.readFileSync(path.join(dir, 'second-reader.lock'), 'utf8'));
    if (!Number.isFinite(held.ts) || Date.now() - held.ts > 180000) return false;
    try { process.kill(held.pid, 0); return true; } catch (e) { return !!(e && e.code === 'EPERM'); }
  } catch (_) { return false; }
}

function record(dir, row) {
  try { fs.appendFileSync(path.join(dir, 'second-reader.jsonl'), JSON.stringify({ ts: new Date().toISOString(), ...row }) + '\n'); } catch (_) { /* bookkeeping must not break a turn */ }
}

const clip = (s, n) => (s.length > n ? s.slice(0, n) + '…' : s);
/** The note's text: counts and the row's own quotes, nothing else. */
function render(flags) {
  const n = flags.length, shown = flags.slice(0, SHOW);
  const lines = [`[second reader, D631] The ring you just sent was DELIVERED; this is a note, not a block. In it, ${n} sentence${n === 1 ? '' : 's'} name${n === 1 ? 's' : ''} a source that this turn shows no read or run of:`];
  shown.forEach((f, i) => lines.push(`${i + 1}. "${clip(String(f.quote || ''), 300)}" (names: ${clip(String(f.names || ''), 200)})`));
  if (n > SHOW) lines.push(`(${n - SHOW} more in the ledger row.)`);
  return lines.join('\n');
}

async function main() {
  if (process.env[RUN_ENV] === '1') return;
  let payload; try { payload = JSON.parse(fs.readFileSync(0, 'utf8')); } catch (_) { return; }
  if (!payload || !RING_TOOLS.has(payload.tool_name)) return;
  const id = payload.tool_use_id;
  if (typeof id !== 'string' || !id) return;
  const dir = dataDir(); if (!dir) return;
  const seat = (process.env.CONSONANCE_PANE || '').trim() || null;
  const t0 = Date.now();
  for (;;) {
    const r = findRow(dir, id);
    if (r) {
      if (r.status !== 'ok' || !Array.isArray(r.flags) || !r.flags.length) return;
      record(dir, { seat, tool: payload.tool_name, ringSha: r.ringSha || null, toolUseId: id, status: 'note-shown', flags: r.flags.length, waitedMs: Date.now() - t0 });
      process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: render(r.flags) } }));
      return;
    }
    const waited = Date.now() - t0;
    if (waited >= WAIT_MS) { record(dir, { seat, tool: payload.tool_name, toolUseId: id, status: 'note-timeout', waitedMs: waited }); return; }
    if (waited >= GRACE_MS && !workerRunning(dir) && !findRow(dir, id)) return;   // nothing is coming: the reader is not installed, or never started for this ring (re-read: the worker writes its row, THEN releases)
    await new Promise((res) => setTimeout(res, POLL_MS));
  }
}

if (require.main === module) main().then(() => process.exit(0), () => process.exit(0));   // fail OPEN, without exception

module.exports = { RING_TOOLS, WAIT_MS, render, findRow };
