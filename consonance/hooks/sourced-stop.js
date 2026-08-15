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
// without re-scanning 88 MB transcripts. Since build_ruling.md (2026-08-15) the rows are also
// the input to the second-vantage reader: enrichment per C2 makes each row ROUTABLE — the
// claim sentence, the touched paths, and claim-time HEAD ride the row so a clock-fired reader
// can re-derive the claim against the tree it was made in (WORLD-MOVED != WRONG needs the HEAD).
// Rows accumulate here; nothing reads them in-loop. If a future hand wires this file's output
// into a warning, delete the wire and re-read the refusal above — it was priced before you
// got here.
//
// ── ROW SCHEMA v2 — A CONTRACT. Consumers: the second-vantage reader (A), the return path (K),
// and B's rate analysis. Change fields only by bumping `v` and posting the diff to the board. ──
//   v         2                 guaranteed. Rows without `v` are v1 (no claims/paths/heads).
//   ts        ISO-8601 string   guaranteed — row write time.
//   session   string (<=8)      guaranteed — session id prefix, may be "".
//   pane      string            guaranteed — basename of the hook's cwd.
//   turn_ts   string | null     timestamp of the turn's last assistant record.
//   values    string[]          guaranteed, possibly [] — value KINDS matched in TURN TEXT
//                               (port|count|timestamp|state|version|linecount). [] rows keep
//                               the denominator honest; v1 meaning unchanged.
//   sourced   bool              guaranteed — a reading tool ran somewhere in the turn.
//   tools     int               guaranteed — tool_use count in the turn.
//   claims    object[]          guaranteed, possibly []. Max 8. Each:
//               { kinds: string[]         value kinds this sentence matched (>=1)
//                 channel: "turn"|"artifact"
//                 sentence: string        the matched sentence, trimmed, <=240 chars
//                 path: string|null       artifact target for channel:"artifact", else null }
//   paths     string[]          guaranteed, possibly []. Max 16. file_path targets of
//                               Write/Edit/Read/NotebookEdit this turn, deduped, order kept.
//   heads     object            guaranteed, possibly {}. Up to 3 entries of
//                               { "<git toplevel, forward slashes>": "<40-hex HEAD sha>" },
//                               resolved at Stop time from cwd + touched-path dirs. {} when no
//                               repo is reachable — consumers MUST treat a missing repo as
//                               "cannot pin", never as "unchanged" (C2: no reader launches
//                               without the HEAD it needs).
//
// ── THE ARTIFACT CHANNEL — decided, with its bounds named (chair's ask, 2026-08-15). ──
// A measured that panes ship figures through Write into artifacts, not into turn text — B's own
// figure-dense session parsed to 7,283 text chars and ZERO value-turn matches. A turn-text-only
// sensor makes the ledger a chair-only instrument by construction. So this sensor ALSO scans
// artifact content it can already see in the transcript tail: Write `content` and Edit
// `new_string` — PROSE TARGETS ONLY (.md/.txt/.markdown), first 64 KB per write, max 4 writes
// per turn; matches become claims with channel:"artifact" and the target path.
// WHAT REMAINS OUTSIDE, by decision rather than discovery:
//   - code artifacts (.js/.rs/...): not scanned — version strings and line counts in code are
//     a false-positive flood, and a drowned ledger is a dead ledger (dream-watch's lesson);
//   - values landing via Bash redirects/heredocs, and commit messages: invisible to this
//     sensor (they live in command strings, not tool file targets);
//   - Edit deletions (old_string): a removed sentence is not a claim.
// Anyone extending the reach re-prices the false-positive rate first.
//
// AUTHORITY. The value patterns and reading-tool list are inline COPIES; consonance/tools/
// sourced.js is the authority if they ever disagree (ferry-watch precedent: a hook that dies
// when a repo moves goes silently missing, so it imports nothing from the repo).
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// THE DREAM GATE, same reasoning as every hook here: the gap-dream is an anti-instruction and
// gets no instrumentation.
if (process.env.CONSONANCE_DREAM) process.exit(0);

const LEDGER = process.env.SOURCED_LEDGER || 'C:\\Consonance\\data\\sourced_ledger.jsonl';
const TAIL_BYTES = 768 * 1024;
const SENTENCE_CAP = 240;
const CLAIMS_CAP = 8;
const PATHS_CAP = 16;
const HEADS_CAP = 3;
const HEAD_CANDIDATE_CAP = 4;
const ARTIFACT_BYTES_CAP = 64 * 1024;
const ARTIFACTS_CAP = 4;
const PROSE_TARGET = /\.(md|txt|markdown)$/i;
const FILE_TOOLS = new Set(['Write', 'Edit', 'Read', 'NotebookEdit']);

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
  const fresh = () => ({ text: '', tools: [], paths: [], writes: [], ts: null });
  let turn = fresh();
  for (const line of lines) {
    if (!line.trim()) continue;
    let r; try { r = JSON.parse(line); } catch { continue; }
    const c = (r.message || {}).content;
    if (r.type === 'user') {
      const isToolResult = Array.isArray(c) && c.some(b => b.type === 'tool_result');
      if (!isToolResult) turn = fresh();                          // a real user turn resets
      continue;
    }
    if (r.type !== 'assistant' || !Array.isArray(c)) continue;
    turn.ts = r.timestamp || turn.ts;
    for (const b of c) {
      if (b.type === 'text') turn.text += '\n' + (b.text || '');
      if (b.type === 'tool_use') {
        turn.tools.push(b.name);
        const inp = b.input || {};
        if (FILE_TOOLS.has(b.name) && typeof inp.file_path === 'string' && inp.file_path) {
          turn.paths.push(inp.file_path);
          const body = b.name === 'Write' ? inp.content : b.name === 'Edit' ? inp.new_string : null;
          if (typeof body === 'string' && body && PROSE_TARGET.test(inp.file_path))
            turn.writes.push({ path: inp.file_path, body: body.slice(0, ARTIFACT_BYTES_CAP) });
        }
      }
    }
  }
  return turn;
}

// One claim per matched sentence: the sentence (capped), the kinds it matched, its channel.
function extractClaims(text, channel, artifactPath, out) {
  const sentences = text.split(/(?<=[.!?])\s+|\r?\n+/);
  for (const raw of sentences) {
    if (out.length >= CLAIMS_CAP) return;
    const s = raw.trim();
    if (s.length < 8) continue;
    const kinds = VALUE_PATTERNS.filter(p => p.re.test(s)).map(p => p.name);
    if (!kinds.length) continue;
    out.push({
      kinds,
      channel,
      sentence: s.slice(0, SENTENCE_CAP),
      path: channel === 'artifact' ? artifactPath : null,
    });
  }
}

// Claim-time HEAD per reachable repo: candidates are the hook's cwd plus the directory of each
// touched path; deduped by git's own toplevel so two paths in one repo cost one entry. Every
// failure is silent per the sensor law — a missing repo yields no entry, never a dead hook.
function resolveHeads(cwd, touchedPaths) {
  const heads = {};
  const candidates = [];
  const seen = new Set();
  for (const p of [cwd, ...touchedPaths.map(t => { try { return path.dirname(t); } catch (_) { return null; } })]) {
    if (!p || seen.has(p)) continue;
    seen.add(p);
    candidates.push(p);
    if (candidates.length >= HEAD_CANDIDATE_CAP) break;
  }
  for (const dir of candidates) {
    if (Object.keys(heads).length >= HEADS_CAP) break;
    try {
      if (!fs.existsSync(dir)) continue;
      const r = spawnSync('git', ['-C', dir, 'rev-parse', '--show-toplevel', 'HEAD'],
        { encoding: 'utf8', timeout: 1000, windowsHide: true });
      if (r.status !== 0 || !r.stdout) continue;
      const [top, sha] = r.stdout.split(/\r?\n/);
      if (top && sha && /^[0-9a-f]{40}$/.test(sha.trim()))
        heads[top.trim().replace(/\\/g, '/')] = sha.trim();
    } catch (_) { /* no repo here; the field stays honest by absence */ }
  }
  return heads;
}

function main() {
  let input;
  try { input = JSON.parse(readStdin()); } catch (_) { return; }
  const tp = input && input.transcript_path;
  if (!tp || !fs.existsSync(tp)) return;

  const turn = lastTurn(tp);
  if (!turn.ts && !turn.text.trim()) return;

  const kinds = VALUE_PATTERNS.filter(p => p.re.test(turn.text)).map(p => p.name);

  const claims = [];
  extractClaims(turn.text, 'turn', null, claims);
  for (const w of turn.writes.slice(0, ARTIFACTS_CAP)) extractClaims(w.body, 'artifact', w.path, claims);

  const paths = [];
  for (const p of turn.paths) {
    if (!paths.includes(p)) paths.push(p);
    if (paths.length >= PATHS_CAP) break;
  }

  const cwd = input.cwd || process.cwd();
  const row = {
    v: 2,
    ts: new Date().toISOString(),
    session: String(input.session_id || '').slice(0, 8),
    pane: path.basename(cwd),
    turn_ts: turn.ts,
    values: kinds,                                   // [] rows keep the denominator honest
    sourced: turn.tools.some(n => READING_TOOLS.has(n)),
    tools: turn.tools.length,
    claims,
    paths,
    heads: resolveHeads(cwd, paths),
  };
  fs.mkdirSync(path.dirname(LEDGER), { recursive: true });
  fs.appendFileSync(LEDGER, JSON.stringify(row) + '\n');
}

try { main(); } catch (_) { /* a sensor must never break a turn */ }
process.exit(0);
