// sourced-stop.js — a Stop-hook SENSOR: one ledger row per turn, no gate, no output.
//
// WHAT IT IS, and what it deliberately is not. The harness can fire a command at exactly four
// kinds of moment; Stop — the end of every assistant turn — is the only one adjacent to
// generation, and this room had never registered one. This hook occupies that moment as a
// SENSOR ONLY: it reads the turn that just ended, applies sourced.js's question to it (did a
// turn asserting a checkable value touch a source?), and appends one JSON line to a ledger.
// It prints nothing, blocks nothing, and always exits 0.
//
// THE GATE THAT WAS REFUSED, in writing, so nobody rebuilds it by accident (the full argument
// is exo_memory/loop/catch_latency.md §2, 2026-08-15; the evidence is the room's own record):
//   1. The base rate convicts it as a nag: 110 of 137 value-turns unsourced on the Main
//      transcript the night this was written. A gate firing on 80% of value-turns is
//      dream-watch's 27-day lesson rebuilt at the one moment that cannot be skipped.
//   2. Its satisfaction test is fake-able by the very defect it targets: tool-call-presence is
//      not evidence-contact. The 2026-08-11 scoreboarding happened one turn AFTER a genuine
//      instrument run; a blocking gate checking "did a reading tool run" is satisfied by any
//      unrelated Read.
//   3. The lexical net misses the real offenses: "found 45 real problems" matches no value
//      pattern. A gate trains the shape out of the text, not the move out of the model
//      (tell-index's Goodhart clause, stated twice in its own docs).
//   4. A Tier 2 number wired into a trigger converts an instrument into a training signal
//      against itself (mechanizable_checks.md §3.2).
//
// WHAT THE LEDGER IS FOR. B's preregistration needs per-turn sourced rates over time, per pane,
// without re-scanning 88 MB transcripts. Rows accumulate here; nothing reads them in-loop.
// If a future hand wires this file's output into a warning, delete the wire and re-read the
// refusal above — it was priced before you got here.
//
// AUTHORITY. The value patterns and reading-tool list are inline COPIES; consonance/tools/
// sourced.js is the authority if they ever disagree (ferry-watch precedent: a hook that dies
// when a repo moves goes silently missing, so it imports nothing from the repo).
'use strict';

const fs = require('fs');
const path = require('path');

// THE DREAM GATE, same reasoning as every hook here: the gap-dream is an anti-instruction and
// gets no instrumentation.
if (process.env.CONSONANCE_DREAM) process.exit(0);

const LEDGER = process.env.SOURCED_LEDGER || 'C:\\Consonance\\data\\sourced_ledger.jsonl';
const TAIL_BYTES = 768 * 1024;

// Inline copies — sourced.js is the authority.
const VALUE_PATTERNS = [
  { name: 'port',      re: /\bport\s+\d{3,5}\b|127\.0\.0\.1:\d{3,5}/i },
  { name: 'count',     re: /\b(?:holds?|has|contains?|carries|there are|found)\s+\*{0,2}\d+\*{0,2}\s+(?:file|test|entr|commit|line|dream|size|image|assertion|instance|identifier|pane)/i },
  { name: 'timestamp', re: /\b\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}/ },
  { name: 'state',     re: /\b(?:is|was|are|were)\s+(?:still\s+)?(?:running|armed|live|installed|registered|clean|stale|current)\b/i },
  { name: 'version',   re: /\bv?\d+\.\d+\.\d+\b/ },
  { name: 'linecount', re: /\b\d{2,}\s+lines?\b/i },
];
const READING_TOOLS = new Set(['Bash', 'Read', 'Grep', 'Glob', 'WebSearch', 'WebFetch', 'PowerShell']);

function readStdin() {
  // BOM stripped: a PowerShell pipe prepends U+FEFF, and JSON.parse rejects it.
  try { return fs.readFileSync(0, 'utf8').replace(/^﻿/, ''); } catch (_) { return ''; }
}

// Tail-read the transcript and return the last completed assistant turn: every assistant record
// after the last non-tool-result user record. A tool_result arrives as a user-type record inside
// a continuing turn; a real user record ends one (board-digest's counting lesson).
function lastTurn(transcriptPath) {
  const fd = fs.openSync(transcriptPath, 'r');
  let text;
  try {
    const size = fs.fstatSync(fd).size;
    const start = Math.max(0, size - TAIL_BYTES);
    const buf = Buffer.alloc(size - start);
    fs.readSync(fd, buf, 0, buf.length, start);
    text = buf.toString('utf8');
  } finally { fs.closeSync(fd); }

  const lines = text.split(/\r?\n/);
  if (lines.length && text.length >= TAIL_BYTES) lines.shift();   // first line may be a partial record
  const turn = { text: '', tools: [], ts: null };
  for (const line of lines) {
    if (!line.trim()) continue;
    let r; try { r = JSON.parse(line); } catch { continue; }
    const c = (r.message || {}).content;
    if (r.type === 'user') {
      const isToolResult = Array.isArray(c) && c.some(b => b.type === 'tool_result');
      if (!isToolResult) { turn.text = ''; turn.tools = []; turn.ts = null; }   // a real user turn resets
      continue;
    }
    if (r.type !== 'assistant' || !Array.isArray(c)) continue;
    turn.ts = r.timestamp || turn.ts;
    for (const b of c) {
      if (b.type === 'text') turn.text += '\n' + (b.text || '');
      if (b.type === 'tool_use') turn.tools.push(b.name);
    }
  }
  return turn;
}

function main() {
  let input;
  try { input = JSON.parse(readStdin()); } catch (_) { return; }
  const tp = input && input.transcript_path;
  if (!tp || !fs.existsSync(tp)) return;

  const turn = lastTurn(tp);
  if (!turn.ts && !turn.text.trim()) return;

  const kinds = VALUE_PATTERNS.filter(p => p.re.test(turn.text)).map(p => p.name);
  const row = {
    ts: new Date().toISOString(),
    session: String(input.session_id || '').slice(0, 8),
    pane: path.basename(input.cwd || process.cwd()),
    turn_ts: turn.ts,
    values: kinds,                                   // [] rows keep the denominator honest
    sourced: turn.tools.some(n => READING_TOOLS.has(n)),
    tools: turn.tools.length,
  };
  fs.mkdirSync(path.dirname(LEDGER), { recursive: true });
  fs.appendFileSync(LEDGER, JSON.stringify(row) + '\n');
}

try { main(); } catch (_) { /* a sensor must never break a turn */ }
process.exit(0);
