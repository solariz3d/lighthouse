// sources-gate.js - the SOURCES gate (D212, plan: exo_memory/loop/plan_sources_gate_d212_2026-10-02.md; the keeper approved it 2026-10-02 13:42).
//
// A PreToolUse hook on mcp__consonance__call_librarian and mcp__consonance__call_chair, the two hand-back channels (and, since D215, on the chair's DISPATCH verb
// mcp__consonance__chair_inject: its `text` is gated the same way; its `token` is never read or logged), formerly on the SAME matcher as the second
// reader. A hand-off ring must carry one line, `SOURCES: <path> · <path> · `<command>``, naming what this turn actually opened or ran that the message
// relies on (or `SOURCES: none (no state claims)`). The gate DENIES the ring when the line is missing, empty, or names an item that matches no call in
// THIS turn. A deny is returned to the SAME turn with the reason, so the seat fixes it and re-sends at once.
//
// THE DENY CONTRACT (Claude Code hooks reference, code.claude.com/docs/en/hooks, read 2026-10-02): a PreToolUse hook that exits 0 with
//   {"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"..."}}
// on stdout blocks the tool call; the reason is shown to Claude, and the conversation stays on the same turn. Exit 0 with no output allows. A hook
// that times out or errors does not block. All matching hooks run in PARALLEL, so the second reader (allow-at-once) still fires on a ring this gate
// denies: its row for the denied ring and its row for the re-send are two rows (the denied one is joinable by ringSha to this ledger).
//
// FAILS OPEN on any internal error, any shape it does not recognise, any timeout (a self-imposed 8 s watchdog under the registered 10 s). A hook bug
// must never trap a seat. And it DENIES ONLY AFTER ITS LEDGER ROW IS ON DISK: a deny it could not record would lose the pointer (the 09-19 return-leg
// lesson, exo_memory/loop/plan_return_leg_2026-09-19.md), so with no data dir or an unwritable ledger the ring is allowed.
//
// WHAT COUNTS AS "OPENED" (the matching, chosen cheaply on purpose):
//   - a Read file_path; a Grep path (a file, or a directory only if the result names the item); a Glob whose result names the item; a WebFetch url;
//   - a Bash / PowerShell command segment that contains the item (a path, or the quoted command) and whose leading word is not a pure printer
//     (echo, printf, Write-Host, Write-Output ...) or a metadata-only one (ls, stat, test, [, file, dir, Get-Item, Get-ChildItem, Test-Path ...), so a path merely MENTIONED in an echo or
//     only stat-ed by an ls does not count. Segments split on && || ; | and newlines.
//   - only calls that COMPLETED in this turn count (a call with no recorded result, or an errored one, did not open anything), and only calls after
//     the seat's last prompt (a user message with text and no tool result).
// NOT CAUGHT, and said so: a path printed by `node -e`, `python -c` or inside a wrapper shell string; a listed item that opens but does not back
// the claim (the second reader's half, not this gate's).
'use strict';

// THE DREAM GATE, the same one every hook here carries (dream-gate.test.js polices it): the gap-dream is an anti-instruction and gets no hooks.
if (process.env.CONSONANCE_DREAM) process.exit(0);

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const DISPATCH_TOOL = 'mcp__consonance__chair_inject';   // D215: the chair's DISPATCH verb. Its input is { target, text, token }: the message is `text`; the TOKEN is a secret and is never read, hashed, logged or echoed (see redactToken)
const RING_TOOLS = new Set(['mcp__consonance__call_librarian', 'mcp__consonance__call_chair', DISPATCH_TOOL]);
const RUN_ENV = 'CONSONANCE_SECOND_READER_RUN';   // the second reader's own run: it never rings, but the guard is the room's one reentrancy variable
const LEDGER = 'sources-gate.jsonl';
const WATCHDOG_MS = 8000;
const TAIL_START = 4 * 1024 * 1024, TAIL_MAX = 64 * 1024 * 1024;   // read the transcript from the end, doubling until the turn's start is in view
// Leading words that do NOT open a source (D212, D214). PRINTERS only print what they are given; METADATA leaders ask about a file (does it exist, how big, when,
// what kind) and never read its content (B's look, p-d212-B section 5: `ls -la <path>` was ALLOWED as having opened it). The list is explicit and tested leader by leader.
// DELIBERATELY NOT here: `wc` (it reads every byte and reports a measure of it), `find` (`-exec cat` opens), `git` (`git log -- path`, `git show` read content), `cd`.
const PRINTERS = ['echo', 'printf', 'write-host', 'write-output', 'write-verbose', 'write-warning', 'write-error', 'write-information', 'true', ':'];
const METADATA = ['ls', 'll', 'la', 'dir', 'stat', 'test', '[', '[[', 'file', 'du', 'tree', 'get-item', 'get-childitem', 'gci', 'test-path', 'resolve-path'];
const NON_OPENING = new Set([...PRINTERS, ...METADATA]);
const FORMAT = 'SOURCES: <path> · <path> · `<command>`   (one line, above the NEXT: line; or  SOURCES: none (no state claims)  when the message states nothing about state)';

/* THE SECRET SCAN, self-contained (an installed hook cannot require the repo's tools); second-reader.test.js-style drift guard in sources-gate.test.js. */
const SECRET_SHAPES = [
  /\bsk-or-[A-Za-z0-9_-]{16,}/g,
  /\bsk-ant-[A-Za-z0-9_-]{16,}/g,
  /\bvck_[A-Za-z0-9_-]{16,}/g,
  /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}/g,
  /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36,}|\bgithub_pat_[A-Za-z0-9_]{22,}/g,
  /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g,
  /\bxox[abposr]-[A-Za-z0-9-]{10,}/g,
  /\bAIza[0-9A-Za-z_-]{35}/g,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/g,
  /\bBearer\s+[A-Za-z0-9._~+/-]{20,}/gi,
  /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g,
  /\b[A-Za-z0-9_]*(?:API_KEY|APIKEY|SECRET|TOKEN|PASSWORD)\s*[:=]\s*["']?[A-Za-z0-9_\-/+=.]{16,}/gi,
];
function scrub(s) { let m = String(s == null ? '' : s); for (const re of SECRET_SHAPES) m = m.replace(re, '<redacted>'); return m; }
/** D215: chair_inject carries a token in tool_input. The gate never reads it into a row or a reason, and on top of that every string it logs or returns has the token's exact value taken out (a token pasted into the text, or into a SOURCES item, would otherwise reach the ledger or the deny reason). */
function redactToken(s, token) { const m = String(s == null ? '' : s); return typeof token === 'string' && token.length >= 4 ? m.split(token).join('<redacted-token>') : m; }
const clip = (s, n) => (s.length > n ? s.slice(0, n) + '…' : s);

function dataDir() {
  const env = (process.env.CONSONANCE_DATA || '').trim();
  if (env) return env;
  try {
    const raw = fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^﻿/, '');
    const d = String((JSON.parse(raw) || {}).data_dir || '').trim();
    if (d) return d;
  } catch (_) { /* no config: no data dir: the hook logs nothing and therefore never denies */ }
  return null;
}
/** One ledger row. Returns true only when it is on disk. Never carries the message text: a sha, and for a deny the scrubbed pointer line. */
function record(dir, row) {
  try { fs.appendFileSync(path.join(dir, LEDGER), JSON.stringify({ ts: new Date().toISOString(), ...row }) + '\n'); return true; } catch (_) { return false; }
}

// ------------------------------------------------------------------ the SOURCES line

/**
 * The slot. Returns { present, none, items }. The line is the LAST line that starts with `SOURCES:` (markdown emphasis around it is tolerated); lines
 * that follow it up to a blank line or the NEXT: trailer continue it. Items are separated by ` · ` outside backticks; a backticked span is one item.
 */
function parseSources(text) {
  const lines = String(text == null ? '' : text).split(/\r?\n/);
  let idx = -1, rest = '';
  for (let i = lines.length - 1; i >= 0; i--) {
    const m = lines[i].match(/^\s*[*_>\-\s]*SOURCES[*_]*\s*:[*_]*\s*(.*)$/);
    if (m) { idx = i; rest = m[1]; break; }
  }
  if (idx < 0) return { present: false, none: false, items: [] };
  for (let j = idx + 1; j < lines.length; j++) {
    if (!lines[j].trim() || /^\s*NEXT\s*:/.test(lines[j])) break;
    rest += ' · ' + lines[j].replace(/^\s*[-*•]\s*/, '');
  }
  rest = rest.trim();
  if (/^`?\**none\b/i.test(rest)) return { present: true, none: true, items: [] };
  const raw = [];
  let cur = '', quoted = false, inTick = false;
  const push = () => { const t = cur.trim(); if (t) raw.push({ s: t, quoted }); cur = ''; quoted = false; inTick = false; };
  for (const ch of rest) {
    if (ch === '`') { if (inTick) { inTick = false; quoted = true; } else { inTick = true; } continue; }
    if (ch === '·' && !inTick) { push(); continue; }
    cur += ch;
  }
  push();
  const items = [];
  for (const r of raw) {
    let s = r.s.replace(/^["'*_]+|["'*_]+$/g, '').trim();
    if (!r.quoted) s = s.replace(/\s*\([^)]*\)\s*$/, '').trim();   // an unquoted item may carry a trailing "(lines 1-40)"; a quoted command is taken whole
    if (!/\s/.test(s)) s = s.replace(/(?<![\\/:]|^[A-Za-z]):\d+(?:-\d+)?$/, '').replace(/#L\d+(?:-L?\d+)?$/, '');   // path:123 / path#L10
    if (s) items.push(s);
  }
  return { present: true, none: false, items };
}

// ------------------------------------------------------------------ matching

/** One spelling for a path or a command: lower case, forward slashes, /c/x -> c:/x, runs of space collapsed, no trailing slash. */
function norm(s) {
  let n = String(s == null ? '' : s).toLowerCase().replace(/\\/g, '/').replace(/\s+/g, ' ').trim();
  n = n.replace(/(^|[\s"'=(])\/([a-z])\//g, '$1$2:/');
  if (n.startsWith('~/')) n = norm(os.homedir()) + n.slice(1);
  return n.length > 1 ? n.replace(/\/+$/, '') : n;
}
const isAbs = (n) => /^[a-z]:\//.test(n) || n.startsWith('/');
function resolveCall(p, cwd) {
  const n = norm(p);
  if (!n || isAbs(n) || /^https?:/.test(n)) return n;
  return cwd ? norm(cwd) + '/' + n.replace(/^\.\//, '') : n;
}
/** The path forms an item may be matched by inside a command: the whole item, then shorter tails down to two components (one component stays whole). */
function tails(n) {
  const parts = n.split('/'), out = [n];
  if (/\s/.test(n) || parts.length < 3) return out;
  for (let i = 1; i <= parts.length - 2; i++) out.push(parts.slice(i).join('/'));
  return out;
}
function leadingWord(seg) {
  let s = seg.trim().replace(/^[&(\s]+/, '');
  if (s.startsWith('#')) return '#';
  while (/^[A-Za-z_][A-Za-z0-9_]*=\S*\s+/.test(s)) s = s.replace(/^[A-Za-z_][A-Za-z0-9_]*=\S*\s+/, '');
  return (s.split(/\s+/)[0] || '').toLowerCase();
}
function opensInSegment(command, itemN) {
  for (const seg of String(command || '').split(/&&|\|\||;|\||\r?\n/)) {
    const lead = leadingWord(seg);
    if (lead === '#' || NON_OPENING.has(lead)) continue;
    const sn = norm(seg);
    for (const t of tails(itemN)) if (t && sn.includes(t)) return true;
  }
  return false;
}

// ------------------------------------------------------------------ what is a PROMPT (a turn boundary)

const textOf = (c) => (typeof c === 'string' ? c : Array.isArray(c) ? c.filter((p) => p && p.type === 'text').map((p) => p.text || '').join('\n') : '');
const hasToolResult = (m) => Array.isArray(m.content) && m.content.some((p) => p && p.type === 'tool_result');
// D214, the librarian's ruling on a live false deny: a background-task notification or a system notification arrives as a USER message with text
// (Claude Code writes it with origin.kind "task-notification" and a content string that starts <task-notification>; the reminder form is
// "[SYSTEM NOTIFICATION"). It is not a new request, so the seat's turn runs through it and a source read before it still counts after it. These are
// D199's keeper.js machine-form classes for notifications (`<task-notification`, `[SYSTEM`), and NO others: a keeper message, a chair or pane ring and
// a keep-warm are all still boundaries.
// HOW A MIXED MESSAGE IS TOLD APART: take out the harness's own wrappers (<system-reminder> blocks, hook-output blocks, <task-notification> blocks, a
// "[SYSTEM NOTIFICATION ...]" banner) and look at what is LEFT. Nothing left, and a notification marker was present: it is machine-only, NOT a boundary.
// ANY text left, even one word beside a notification: it is the keeper's (or a ring's), a boundary. An unterminated <task-notification> leaves its text
// behind, so it is a boundary too (the safe side). And a message Claude Code itself records as typed by a human (origin.kind "human") is a boundary
// whatever it contains.
const NOTE_WRAPPERS = [/<system-reminder>[\s\S]*?<\/system-reminder>/g, /<([a-z-]*hook[a-z-]*)>[\s\S]*?<\/\1>/gi, /<task-notification>[\s\S]*?<\/task-notification>/g, /\[SYSTEM NOTIFICATION[^\]]*\]/g];
function isNotificationOnly(e, text) {
  if (e && e.origin && e.origin.kind === 'human') return false;
  const marked = /<task-notification|\[SYSTEM NOTIFICATION/.test(text) || !!(e && e.origin && e.origin.kind === 'task-notification');
  if (!marked) return false;
  let rest = String(text);
  for (const re of NOTE_WRAPPERS) rest = rest.replace(re, '');
  return rest.trim() === '';
}
/** A PROMPT: a user message with text, no tool result, not meta, not a subagent's, and not a machine-only notification. */
function isPrompt(e) {
  const m = e && e.message;
  if (!m || m.role !== 'user' || e.isSidechain || e.isMeta || hasToolResult(m)) return false;
  const t = textOf(m.content);
  return !!t.trim() && !isNotificationOnly(e, t);
}

/** The completed calls of THIS turn: everything after the seat's last prompt, minus the ring itself, minus errored calls and calls with no recorded result. */
function turnCalls(entries, ring = {}) {
  const live = entries.filter((e) => e && !e.isSidechain);
  let from = 0;
  for (let i = live.length - 1; i >= 0; i--) {
    if (isPrompt(live[i])) { from = i + 1; break; }
  }
  const calls = [], byId = new Map();
  for (const e of live.slice(from)) {
    const m = e.message; if (!m || !Array.isArray(m.content)) continue;
    for (const p of m.content) {
      if (!p) continue;
      if (p.type === 'tool_use') {
        if (ring.toolUseId && p.id === ring.toolUseId) continue;
        const c = { id: p.id, name: p.name, input: p.input || {}, done: false, isError: false, result: '' };
        calls.push(c); if (p.id) byId.set(p.id, c);
      } else if (p.type === 'tool_result' && byId.has(p.tool_use_id)) {
        const c = byId.get(p.tool_use_id);
        c.done = true; c.isError = !!p.is_error;
        c.result = typeof p.content === 'string' ? p.content : Array.isArray(p.content) ? p.content.map((x) => (x && typeof x.text === 'string' ? x.text : '')).join('\n') : '';
      }
    }
  }
  return calls.filter((c) => c.done && !c.isError);
}

/** Does this item match a completed call of the turn? Returns the kind of match, or null. */
function itemMatches(item, calls, cwd) {
  const itemN = norm(item);
  if (!itemN) return null;
  const itemAbs = isAbs(itemN) || /^https?:/.test(itemN);
  const mentions = (c) => { const r = norm(c.result); return tails(itemN).some((t) => t && r.includes(t)) || r.includes(itemN.split('/').pop() || '\u0000'); };
  for (const c of calls) {
    const inp = c.input || {};
    if (c.name === 'Read' && inp.file_path) {
      const p = resolveCall(inp.file_path, cwd);
      if (p === itemN || (!itemAbs && p.endsWith('/' + itemN.replace(/^\.\//, '')))) return 'read';
    } else if (c.name === 'Grep' || c.name === 'Glob') {
      const base = inp.path ? resolveCall(inp.path, cwd) : '';
      if (c.name === 'Grep' && base && (base === itemN || (!itemAbs && base.endsWith('/' + itemN)))) return 'grep';
      if (base && itemAbs && itemN.startsWith(base + '/') && mentions(c)) return c.name.toLowerCase() + '-dir';
      if (mentions(c) && (!itemAbs || !base || itemN.startsWith(base + '/') || base === itemN)) return c.name.toLowerCase() + '-result';
    } else if (c.name === 'WebFetch' && inp.url) {
      const u = norm(inp.url);
      if (u === itemN || u.replace(/^https?:\/\//, '') === itemN.replace(/^https?:\/\//, '')) return 'webfetch';
    } else if ((c.name === 'Bash' || c.name === 'PowerShell') && inp.command) {
      if (opensInSegment(inp.command, itemN)) return c.name.toLowerCase();
    }
  }
  return null;
}

/** The whole decision, with no I/O. calls come from turnCalls. Returns { decision, none, items, unmatched, reason }. */
function decide(text, calls, cwd, ledgerPath = 'sources-gate.jsonl', ringSha = '', what = 'ring') {
  const s = parseSources(text);
  const tail = ` This ${what} was NOT delivered. Its pointer is logged (${ledgerPath}, ring ${String(ringSha).slice(0, 12)}), so nothing is lost: fix the line and re-send the same ${what} in this turn. Format: ${FORMAT}.`;
  if (!s.present) return { decision: 'deny', none: false, items: [], unmatched: [], kind: 'missing', reason: `SOURCES gate: the ${what} has no SOURCES: line. List what you opened or ran this turn that the message relies on.` + tail };
  if (s.none) return { decision: 'allow', none: true, items: [], unmatched: [], kind: 'none', reason: '' };
  if (!s.items.length) return { decision: 'deny', none: false, items: [], unmatched: [], kind: 'empty', reason: 'SOURCES gate: the SOURCES: line is empty. List what you opened or ran this turn, or write "none (no state claims)".' + tail };
  const unmatched = s.items.filter((it) => !itemMatches(it, calls, cwd));
  if (!unmatched.length) return { decision: 'allow', none: false, items: s.items, unmatched: [], kind: 'matched', reason: '' };
  return {
    decision: 'deny', none: false, items: s.items, unmatched, kind: 'unmatched',
    reason: `SOURCES gate: ${unmatched.length} of ${s.items.length} listed item(s) match nothing you opened or ran in THIS turn (a call from an earlier turn, a failed call, a metadata-only command such as ls or stat, or an echo that only names a path does not count; NOR does a call made in the SAME message as this ${what}, because it had not finished yet: send the ring in a LATER message, after its sources have returned; and a file you only WROTE this turn needs a read-back, Read or cat, in an earlier message): ${unmatched.map((u) => '"' + clip(u, 160) + '"').join(' ; ')}. Open each now (Read / Grep / Glob, or run the command), or drop it from the message. Write each item repo-relative or as a C:\\... path, not /c/... (a /c/ spelling still matches here, but the running digest gate has refused it); the hand-back POINTER in the ring's prose is repo-relative (exo_memory/handback/<packet>_<date>.md), the form the digest gate hashes.` + tail,
  };
}

// ------------------------------------------------------------------ the transcript

/** The turn's entries from the END of the transcript: read a tail, double it until a prompt boundary is in view (or the cap), parse complete lines. */
function readTurnEntries(transcriptPath) {
  if (!transcriptPath || !fs.existsSync(transcriptPath)) throw new Error('no-transcript');
  const size = fs.statSync(transcriptPath).size;
  const fd = fs.openSync(transcriptPath, 'r');
  try {
    for (let want = TAIL_START; ; want *= 2) {
      const start = Math.max(0, size - want), len = size - start, buf = Buffer.alloc(len);
      fs.readSync(fd, buf, 0, len, start);
      let text = buf.toString('utf8');
      if (start > 0) { const nl = text.indexOf('\n'); if (nl >= 0) text = text.slice(nl + 1); }
      const out = [];
      for (const line of text.split('\n')) { if (!line.trim()) continue; try { out.push(JSON.parse(line)); } catch (_) { /* a partial or foreign line */ } }
      if (!out.length && text.trim()) throw new Error('unparseable');   // a transcript with content and no parseable line is not one this hook can read: fail open
      const hasBoundary = out.some(isPrompt);
      if (hasBoundary || start === 0 || want >= TAIL_MAX) return out;
    }
  } finally { fs.closeSync(fd); }
}

function emitDeny(reason) {
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: reason } }), () => process.exit(0));
  setTimeout(() => process.exit(0), 1000).unref();
}

function main() {
  if (process.env[RUN_ENV] === '1') return process.exit(0);
  setTimeout(() => process.exit(0), WATCHDOG_MS).unref();   // fail OPEN on a hang

  let payload;
  try { payload = JSON.parse(fs.readFileSync(0, 'utf8')); } catch (_) { return process.exit(0); }
  const tool = payload && payload.tool_name;
  if (!RING_TOOLS.has(tool)) return process.exit(0);
  const dir = dataDir();
  const seat = (process.env.CONSONANCE_PANE || '').trim() || null;
  const text = payload.tool_input && payload.tool_input.text;
  if (typeof text !== 'string' || !text.trim()) { if (dir) record(dir, { seat, tool, ringSha: null, decision: 'skipped-no-text' }); return process.exit(0); }
  const ringSha = crypto.createHash('sha256').update(text).digest('hex');   // of the TEXT only, never of tool_input as a whole: the token is not in it
  const token = payload.tool_input && typeof payload.tool_input.token === 'string' ? payload.tool_input.token : '';
  const R = (x) => redactToken(x, token);
  const what = tool === DISPATCH_TOOL ? 'dispatch' : 'ring';
  if (!dir) return process.exit(0);   // no ledger, no deny: a deny that cannot be recorded could lose the pointer

  let calls;
  try { calls = turnCalls(readTurnEntries(payload.transcript_path), { toolUseId: payload.tool_use_id || null }); }
  catch (e) { record(dir, { seat, tool, ringSha, decision: 'error', error: 'transcript: ' + String(e && e.message || e).slice(0, 80) }); return process.exit(0); }

  let d;
  try { d = decide(text, calls, payload.cwd || '', path.join(dir, LEDGER), ringSha, what); }
  catch (e) { record(dir, { seat, tool, ringSha, decision: 'error', error: 'decide: ' + String(e && e.message || e).slice(0, 80) }); return process.exit(0); }

  const base = { seat, tool, ringSha, sessionId: payload.session_id || null, kind: d.kind, nItems: d.items.length, nCalls: calls.length, ...(tool === DISPATCH_TOOL ? { target: clip(scrub(R(String((payload.tool_input && payload.tool_input.target) || ''))), 20) } : {}) };
  if (d.decision === 'allow') { record(dir, { ...base, decision: 'allow', items: d.items.slice(0, 12).map((x) => clip(scrub(R(x)), 200)) }); return process.exit(0); }

  const first = text.split(/\r?\n/).find((l) => l.trim()) || '';
  const pointerPaths = (text.match(/[\w./\\:~-]*exo_memory[\w./\\-]*\.\w+/g) || []).slice(0, 5).map((x) => clip(scrub(R(x)), 200));
  const ok = record(dir, { ...base, decision: 'deny', unmatched: d.unmatched.slice(0, 12).map((x) => clip(scrub(R(x)), 200)), pointer: clip(scrub(R(first.trim())), 400), pointerPaths });
  if (!ok) return process.exit(0);   // could not record the pointer: allow rather than risk losing it
  return emitDeny(R(d.reason));
}

if (require.main === module) { try { main(); } catch (_) { process.exit(0); } }   // fail OPEN, without exception

module.exports = { DISPATCH_TOOL, redactToken, RING_TOOLS, LEDGER, SECRET_SHAPES, PRINTERS, METADATA, NON_OPENING, isPrompt, isNotificationOnly, parseSources, norm, tails, opensInSegment, turnCalls, itemMatches, decide, readTurnEntries, scrub };
