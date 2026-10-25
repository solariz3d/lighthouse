// claim-check.js - the CLAIM CHECK at the point of claim (D305 part 4, seat C; design: exo_memory/loop/claim_check_design_2026-10-11.md, E;
// bar: exo_memory/loop/claim_check_registration_2026-10-11.md, B; rulings: exo_memory/loop/plan_claim_check_d305_2026-10-11.md "Wave 1 read").
//
// A state or figure claim goes out only when the same turn ran something that could have shown it wrong. Lexical and narrow, on purpose: the model
// reader was measured indiscriminate (E §0). It asks only whether the turn COULD have known, never whether the claim is true.
//
// THE SWITCH: `claim_check` in ~/.consonance.json, read the way main.rs reads `handback_index` (handback_index_from): JSON boolean `true` turns it ON
// (refuses); the string "shadow" logs what it would refuse and never refuses; ANYTHING ELSE, absent or unreadable, is OFF. OFF exits at once: no row,
// no output, nothing read. A row in claim-check.test.js pins that OFF changes nothing.
//
// WHERE A CLAIM IS MADE (E §3.4; the ruling: v1 AND the Bash write path, both built):
//   reply         a Stop hook: the reply text (last_assistant_message). stop_hook_active is the once-per-turn guard.
//   ring          PreToolUse on mcp__consonance__call_librarian / call_chair / chair_inject: the `text` (the token is never read).
//   record-write  PreToolUse on Write / Edit / MultiEdit whose file_path is under exo_memory/: the content written.
//   bash-write    PreToolUse on Bash whose command writes into exo_memory/ by a heredoc or a > / >> redirect (or tee): the heredoc bodies and echoed
//                 strings. The gap E named in §3.4 (12 of the census's 27). Fragile to parse, said so: a write through `node -e`, python or a script
//                 file is not seen.
// A PreToolUse refusal is once per turn per place: a second refusal in the same turn and place goes through, with a logged row (E §4).
//
// THE PURE PART is check(turn, opts) -> { verdict, flagged, backed, skipped } (E §1), with turn = { prompt, events[], outgoing }. No I/O.
// FAILS OPEN on every error, on a 5 s watchdog, with no data dir, and when its row cannot be written (a refusal it cannot record is not made).
// NO MESSAGE TEXT is stored: per flag only its kind, need and whether it was backed (E §8, the reply slot's discipline).
'use strict';

// THE DREAM GATE, the same one every hook here carries (dream-gate.test.js polices it): the gap-dream is an anti-instruction and gets no hooks.
if (process.env.CONSONANCE_DREAM) process.exit(0);

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const LEDGER = 'claim-check.jsonl';
const WATCHDOG_MS = 5000;
const RING_TOOLS = new Set(['mcp__consonance__call_librarian', 'mcp__consonance__call_chair', 'mcp__consonance__chair_inject']);
const WRITE_TOOLS = new Set(['Write', 'Edit', 'MultiEdit']);
const ALL_VIAS = ['reply', 'ring', 'record-write', 'bash-write'];
const V1_VIAS = ['reply', 'ring', 'record-write'];

// Reuse, not copy: the reply slot's token patterns and the SOURCES gate's turn reader; claimrec's unit splitter (side by side when installed, else the repo's).
let G = null, RS = null, U = null, LOAD_ERR = '';
try { G = require('./sources-gate.js'); RS = require('./reply-slot.js'); } catch (e) { LOAD_ERR = String((e && e.message) || e).slice(0, 80); }
for (const p of ['./units.js', path.join(__dirname, '..', '..', 'exo_memory', 'loop', 'claimrec', 'units.js')]) { if (U) break; try { U = require(p); } catch (_) { /* next */ } }

// ------------------------------------------------------------------ the switch
/** 'on' | 'shadow' | 'off'. Boolean true only is ON (as handback_index_from); "shadow" is shadow; everything else, and any parse failure, is OFF. */
function claimCheckFrom(raw) {
  try {
    const v = (JSON.parse(String(raw == null ? '' : raw).replace(/^﻿/, '')) || {}).claim_check;
    if (v === true) return 'on';
    if (typeof v === 'string' && v.trim().toLowerCase() === 'shadow') return 'shadow';
    return 'off';
  } catch (_) { return 'off'; }
}
function claimCheckMode(home = os.homedir()) {
  try { return claimCheckFrom(fs.readFileSync(path.join(home, '.consonance.json'), 'utf8')); } catch (_) { return 'off'; }
}

// ------------------------------------------------------------------ recognising claims (E §2)
const ANSI = /\x1b\[[0-9;]*m|\[\d{1,3}(?:;\d{1,3})*m/g;
const normText = (s) => String(s == null ? '' : s).replace(ANSI, '').replace(/(\d),(?=\d{3}\b)/g, '$1').replace(/\s+/g, ' ');
const UNIT_RE = '(?:\\s?(?:KB|MB|GB|B|ms|s|min|h|°|m|MiB|KiB))?';
// E §2.2: the reply slot's kinds minus `path`, plus number, size, time and multiplier.
const EXTRA_KINDS = [
  ['multiplier', /\b\d+(?:\.\d+)?×/g],
  ['size', /\b\d+(?:\.\d+)?k\b/g],
  ['time', /(?:\b(?:at|since|until|by|before|after|from)\s+|~)(\d{1,2}:\d{2}(?::\d{2})?)\b/g],
  ['number', new RegExp('(?<![\\w.:/#§-])\\d{1,3}(?:,\\d{3})+(?:\\.\\d+)?' + UNIT_RE + '(?![\\w/:.-]*\\d)|(?<![\\w.:/#§-])\\d+(?:\\.\\d+)?' + UNIT_RE + '(?![\\w/:-])', 'g')],
];
const DATE = /\b\d{4}-\d{2}-\d{2}(?:T[\d:.]+Z?)?\b/g;
const LEDGER_ID = /\b[A-Z]{1,2}\d{2,4}[a-z]?\b|#\d+/g;
const PATH_LINE = /[\w./\\-]+\.\w{1,6}:\d+(?:-\d+)?/g;
const PATHISH = /(?:\b[A-Za-z]:[\\/][^\s`'"<>|)]+|\b[\w.-]+(?:[\\/][\w.-]+)+)/g;

/** The spans of a unit that hold no figure claim (dates, ledger ids, path:line, paths, section signs); a token inside one is not a figure. */
function maskedSpans(u) {
  const spans = [];
  for (const re of [DATE, LEDGER_ID, PATH_LINE, PATHISH, /§\s?\d+(?:\.\d+)*/g]) for (const m of u.matchAll(re)) spans.push([m.index, m.index + m[0].length]);
  return spans;
}
const inSpans = (spans, a, b) => spans.some(([s, e]) => a >= s && b <= e);

/** Figure flags of one unit: [{ kind, token }]. */
// REVISION (D305 wave 3; B's read: bare `number` flags were 194 of the week's flags, and list numbers a named misfire). A bare number is not a figure when it
// is a single digit 1-9 with no unit and no decimal ("2 rules", "7 commits": prose counting, the number words E already left out, written as digits), or a
// LABEL: the number after part, item, step, lap, row and the like, or an enumerator "(3)". Zero stays a figure ("0 hits" is a claim), as do multi-digit counts,
// decimals and anything with a unit.
const LABEL_BEFORE = /\b(?:part|item|step|lap|wave|phase|round|chunk|row|line|column|section|chapter|cycle|attempt|option|pass|day|week|rule|point|case|level|stage|tier|arm|group|question|page|no\.|number|packet|unit|lane|slot)\s*\(?$/i;
function notAFigure(u, tok, a, b) {
  const bare = /^\d+$/.test(tok);
  if (bare && Number(tok) >= 1 && Number(tok) <= 9) return true;
  if (bare && LABEL_BEFORE.test(u.slice(0, a))) return true;
  if (u[a - 1] === '(' && u[b] === ')') return true;
  return false;
}
function figuresIn(u) {
  if (/^\s*#{1,6}\s/.test(u)) u = u.replace(/^(\s*#{1,6}\s+)\d+(?:\.\d+)*\.?\s/, '$1');   // an ordinal heading number is not a figure
  u = u.replace(/^(\s*)\d+[.)](\s)/, (m, a, b) => a + ' '.repeat(m.length - a.length - b.length) + b);   // nor is a list item's own number (units.js merges the marker into the item); same length, so spans stay put
  const spans = maskedSpans(u), out = [], taken = [];
  const kinds = [...RS.TOKEN_KINDS.filter(([k]) => k !== 'path'), ...EXTRA_KINDS];
  for (const [kind, re] of kinds) {
    for (const m of u.matchAll(new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g'))) {
      const tok = (kind === 'time' && m[1]) ? m[1] : m[0].trim();
      const a = kind === 'time' && m[1] ? m.index + m[0].lastIndexOf(m[1]) : m.index, b = a + tok.length;
      if (kind !== 'sha' && kind !== 'commit' && inSpans(spans, a, b)) continue;
      if (taken.some(([s, e]) => a < e && b > s)) continue;   // one flag per stretch of text: the first (most specific) kind wins
      taken.push([a, b]);
      if (kind === 'number' && notAFigure(u, tok, a, b)) continue;   // the stretch stays taken, so no later kind re-flags it
      out.push({ kind, token: tok.replace(/[.,;:!?)\]'"]+$/, '') });
    }
  }
  return out;
}

// E §2.3: state words, each mapped to the source that reads that state.
const STATE_WORDS = [
  ['git', /\b(?:landed|merged|committed|on main|pushed|unpushed|behind|ahead)\b/i],
  ['process', /\b(?:running|alive|exited|stopped|killed)\b/i],
  ['board', /\b(?:idle|working|logged (?:in|out)|rang|rung|queued|delivered|waiting|started its half|hasn't started|has not started|never rang)\b/i],
  ['fs', /\b(?:exists|absent|missing|on disk|does not exist|doesn't exist|never did|deleted|untouched|unchanged|empty)\b/i],
  ['compute', /\b(?:green|red|passing|failing|confirmed|verified)\b/i],
  ['board', /\b(?:filed|dispatched|closed)\b/i],
  ['process', /\b(?:started|finished)\b/i],
];
// REVISION: the seat a unit is about (a letter, or chair / librarian), so a run word said of a SEAT ("B has finished") is read as a board state, and a
// seat's own ring in the turn's prompt backs it. Process words said of anything else keep need `process`, now also backed by a run in the turn that names it.
const SEAT_IN_UNIT = /\b(?:pane|seat)\s+([A-E])\b|\b([A-E])'s\b|\b([A-E])(?=\s+(?:is|was|has|hasn't|had|finished|started|rang|never|logged|is still)\b)|\b(chair|librarian)\b/;
function seatOfUnit(u) { const m = SEAT_IN_UNIT.exec(u); return m ? (m[1] || m[2] || m[3] || m[4]).toLowerCase() : null; }
/** Does the turn's prompt come from that seat (a `[pane:X]` ring, or the chair's / librarian's own ring)? */
function promptFromSeat(prompt, seat) {
  const head = String(prompt || '').replace(/<[^>]+>/g, ' ').trim().slice(0, 200);
  if (!seat) return false;
  if (seat.length === 1) return new RegExp(`^\\[pane:${seat}\\]`, 'i').test(head);
  return new RegExp(`^\\[${seat === 'chair' ? '(?:chair|orchestrator)' : 'librarian'}[:\\]]`, 'i').test(head);
}
const CONDITION_BEFORE = /\b(?:if|when|whenever|once|after|until|unless)\b/i;
const STOP = new Set(['that', 'this', 'with', 'from', 'have', 'been', 'into', 'then', 'there', 'they', 'their', 'what', 'which', 'when', 'will', 'were', 'still', 'running', 'finished', 'started', 'stopped', 'exited', 'killed', 'alive', 'now', 'just', 'about', 'after', 'before']);
/** A run call that names the unit's object: a Bash/PowerShell command (not a printer) sharing a word of 4+ characters with the unit. */
function runNamesUnit(call, u) {
  if (!(call.tool === 'Bash' || call.tool === 'PowerShell') || PRINTERS.has((call.cmd.trim().split(/\s+/)[0] || '').toLowerCase())) return false;
  const words = (u.toLowerCase().match(/[a-z0-9][\w.-]{3,}/g) || []).map((w) => w.replace(/[.,;:]+$/, '')).filter((w) => w.length >= 4 && !STOP.has(w));
  const cmd = call.cmd.toLowerCase();
  return words.some((w) => cmd.includes(w));
}
// "About a named object" (E §2.3): a path, a sha, a seat, a pid or a tool name. A state word with no object is skipped as no-object.
const OBJECT = /(?:\b[A-Za-z]:[\\/]|\b[\w.-]+[\\/][\w.-]+|\b(?=[0-9a-f]*[a-f])(?=[0-9a-f]*\d)[0-9a-f]{7,40}\b|\b(?:pane|seat)\s+[A-E]\b|\b[A-E]'s\b|\b[A-E](?=\s+(?:is|was|has|hasn't|had|finished|started|rang|never|logged|is still)\b)|\b(?:chair|librarian|orchestrator|keeper's machine)\b|\bpid\s*\d+|\b(?:node|cargo|npm|git|js-suite|harness|mutants?|suite|test|tests|hook|lock|board\.jsonl|persist\.log|panes\.json|origin\/main|main|branch|worktree)\b|\b[\w-]+\.(?:js|rs|md|json|jsonl|ps1|log|txt|py)\b)/i;

/** Why a unit is out of scope (E §2.4), or null. */
function skipReason(u, inferredBlock) {
  const t = u.trim();
  if (inferredBlock || /^[-*>\s]*(?:\*\*)?inferred(?:\*\*)?\s*:/i.test(t)) return 'inferred';
  if (/^```/.test(t)) return 'quote';
  if (/^>/.test(t)) return 'quote';
  if (/^(?:\*\*)?(?:NEXT|SOURCES|OUTPUT\s*→\s*NEXT)\s*:/i.test(t)) return 'trailer';
  if (/\?\s*$/.test(t)) return 'question';
  if (/\b(?:will|would|should|next|to do|owed|plan|propose[sd]?)\b/i.test(t)) return 'plan';
  return null;
}
/** The unit with quoted text taken out: "…" and *"…"* report what something said, not what is. */
const unquote = (u) => u.replace(/\*?"[^"\n]{1,400}"\*?|“[^”\n]{1,400}”/g, ' ');

// ------------------------------------------------------------------ backing (E §3)
const PRINTERS = new Set(['echo', 'printf', 'write-host', 'write-output', 'cat', 'true', ':']);
function numOf(tok) { const m = String(tok).replace(/,/g, '').match(/-?\d+(?:\.\d+)?/); return m ? Number(m[0]) : NaN; }
const decimals = (tok) => { const m = String(tok).replace(/,/g, '').match(/\d+\.(\d+)/); return m ? m[1].length : 0; };
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Is the figure literally in the text, as a whole token (E §3.1 literal)? */
function literalIn(flag, text) {
  if (!text) return false;
  const t = normText(text), tok = normText(flag.token);
  if (flag.kind === 'sha' || flag.kind === 'commit') { const hex = (tok.match(/[0-9a-f]{7,64}/i) || [''])[0]; return !!hex && t.toLowerCase().includes(hex.toLowerCase()); }
  if (flag.kind === 'count') {
    const m = tok.match(/(\d+)\s*(?:\/|of)\s*(\d+)/); if (!m) return false;
    return new RegExp(`(?<![\\d.])${m[1]}\\s*(?:/|of)\\s*${m[2]}(?![\\d])`).test(t);
  }
  if (flag.kind === 'time') return new RegExp(`(?<!\\d)${esc(tok)}(?!\\d)`).test(t);
  const core = tok.replace(/\s?(?:KB|MB|GB|B|ms|s|min|h|°|m|MiB|KiB|k|×|%)$/, '');
  if (!/\d/.test(core)) return false;
  return new RegExp(`(?<![\\d.])${esc(core)}(?![\\d]|\\.\\d)`).test(t);
}
const SCALE = { B: [1, 1 / 1024, 1 / 1048576, 1 / 1000, 1 / 1e6], KB: [1, 1 / 1024, 1 / 1000], MB: [1, 1 / 1048576, 1 / 1e6, 1 / 1024, 1 / 1000], KiB: [1, 1 / 1024], MiB: [1, 1 / 1048576], ms: [1], s: [1, 1 / 1000], min: [1, 1 / 60, 1 / 60000], h: [1, 1 / 3600, 1 / 60] };
/** A figure marked approximate (~, about, ≈) is backed by a number in the text that rounds to it at the written precision (E §3.1 rounded), units converted. */
function roundedIn(flag, unitText, text) {
  if (!new RegExp(`(?:~|≈|\\babout\\s+|\\baround\\s+)\\s*${esc(flag.token)}`).test(unitText)) return false;
  const target = numOf(flag.token), d = decimals(flag.token), unit = (flag.token.match(/(KiB|MiB|KB|MB|GB|ms|min|B|s|h)$/) || [])[1];
  if (!Number.isFinite(target)) return false;
  const facs = unit ? [...new Set([1, ...Object.values(SCALE).flat()])] : [1];
  const half = 0.5 * Math.pow(10, -d);
  for (const m of normText(text).matchAll(/(?<![\d.])\d+(?:\.\d+)?(?![\d])/g)) {
    const x = Number(m[0]);
    for (const f of facs) if (Math.abs(x * f - target) < half + 1e-9) return true;
  }
  return false;
}
/** A written computation (E §3.1 computed): `a op b = c`, or `n/m = p%`, whose operands are backed. Returns the tokens it backs. */
function computedTokens(unitText, isBacked) {
  const out = new Set(), t = normText(unitText);
  for (const m of t.matchAll(/(\d+(?:\.\d+)?)\s*([+\-×x*/])\s*(\d+(?:\.\d+)?)\s*=\s*~?(\d+(?:\.\d+)?)\s*(%)?/g)) {
    const a = Number(m[1]), b = Number(m[3]), c = Number(m[4]), op = m[2];
    if (!isBacked(m[1]) || !isBacked(m[3])) continue;
    let v = op === '+' ? a + b : op === '-' ? a - b : op === '/' ? a / b : a * b;
    if (m[5] === '%') v *= 100;
    if (Math.abs(v - c) < 0.5 * Math.pow(10, -decimals(m[4])) + 1e-9) { out.add(m[4]); out.add(`${m[1]}/${m[3]}`); }
  }
  return out;
}

// What reads each state (E §3.2). A call backs a state flag when its input reaches the state and its result is not an error.
const NEED_READS = {
  git: (c) => /\bgit\s+(?:log|status|rev-parse|branch|show|ls-remote|fetch|diff|cherry|merge-base|commit|push|cherry-pick)\b|\bgh\s/.test(c.cmd),
  process: (c) => /\b(?:Get-Process|Win32_Process|tasklist|ps\b|pgrep)\b/i.test(c.cmd),
  board: (c) => /read_board|chair_status/.test(c.tool) || /board\.jsonl|panes\.json|captures?[\\/]|chain-status|lap-row/i.test(c.cmd),
  fs: (c) => ['Read', 'Glob', 'Grep'].includes(c.tool) || /(?:^|[\s;&|(])(?:ls|stat|test|find|wc|du|cmp|diff|cat|head|tail|Get-ChildItem|Test-Path|Get-Item|git\s+hash-object|git\s+ls-files)\b/i.test(c.cmd),
  compute: (c) => (c.tool === 'Bash' || c.tool === 'PowerShell') && !PRINTERS.has((c.cmd.trim().split(/\s+/)[0] || '').toLowerCase()),
};
/** For an fs flag, a call backs it only if its input names one of the unit's paths (or its folder); with no path in the unit any fs read counts. */
function namesUnitPath(call, u) {
  const paths = (u.match(PATHISH) || []).map((p) => p.replace(/\\/g, '/').replace(/[`'".,;:)]+$/, '').toLowerCase());
  if (!paths.length) return true;
  const inp = call.cmd.replace(/\\/g, '/').toLowerCase();
  return paths.some((p) => { const parts = p.split('/').filter(Boolean); const last = parts[parts.length - 1] || p, dir = parts[parts.length - 2] || ''; return inp.includes(last) || (dir && inp.includes(dir)); });
}

/** The command a call ran (Bash/PowerShell `command`), else its input as text. A's replay hands the input as a clipped JSON string: parsed, else read by pattern. */
function cmdOf(input) {
  if (input && typeof input === 'object') return typeof input.command === 'string' ? input.command : JSON.stringify(input);
  const s = String(input == null ? '' : input);
  try { const o = JSON.parse(s); if (o && typeof o.command === 'string') return o.command; } catch (_) { /* clipped */ }
  const m = /"command"\s*:\s*"((?:[^"\\]|\\.)*)/.exec(s);
  return m ? m[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\') : s;
}
/** Pair calls with their results in order (a result belongs to the latest call before it that has none). */
function pairEvents(events) {
  const calls = [], open = [];
  events.forEach((e, i) => {
    if (e.kind === 'call') { const c = { i, ts: e.ts, tool: e.tool, cmd: cmdOf(e.input), result: null }; calls.push(c); open.push(c); }
    else if (e.kind === 'result') { const c = open.shift(); if (c) c.result = e; }
  });
  return calls;
}

// ------------------------------------------------------------------ the check (E §1, §5)
/**
 * check(turn, opts) -> { verdict: 'allow'|'refuse', flagged, backed, skipped }. Pure.
 * turn = { prompt, events: [{ts, kind:'call'|'result'|'text', tool?, input?, text?, isError?}], outgoing: { ts, via, text } }
 * opts = { mode: 'strict'|'shadow', vias: [...] (default all four) }
 */
function check(turn, opts = {}) {
  const res = { verdict: 'allow', flagged: [], backed: [], skipped: [] };
  const out = turn && turn.outgoing;
  if (!out || typeof out.text !== 'string' || !out.text.trim()) return res;
  const vias = opts.vias || ALL_VIAS;
  if (!vias.includes(out.via)) { res.skipped.push({ unit: 0, reason: 'via-out-of-scope' }); return res; }
  const tOut = Date.parse(out.ts);
  const before = (e) => !Number.isFinite(tOut) || !e.ts || Date.parse(e.ts) < tOut;
  const results = (turn.events || []).filter((e) => e.kind === 'result' && before(e) && !e.isError);
  const evidence = results.map((e) => e.text || '');
  const calls = pairEvents((turn.events || []).filter(before)).filter((c) => c.result && !c.result.isError);
  const prompt = String(turn.prompt || '');
  const backedNums = new Set();
  const isBacked = (n) => backedNums.has(String(Number(n))) || evidence.some((t) => literalIn({ kind: 'number', token: n }, t)) || literalIn({ kind: 'number', token: n }, prompt);
  const us = U.units(out.text);
  let inferredBlock = false;
  us.forEach((u0, k) => {
    const unit = k + 1;
    if (/^\s*[-*]?\s*(?:\*\*)?inferred(?:\*\*)?\s*:/i.test(u0)) inferredBlock = true;
    else if (!/^\s*[-*+]\s|^\s*\d+[.)]\s/.test(u0)) inferredBlock = false;   // an inferred: label covers the list under it, and ends at the next non-item
    const why = skipReason(u0, inferredBlock && !/inferred\s*:/i.test(u0) ? true : false);
    if (why) { res.skipped.push({ unit, reason: why }); return; }
    const u = unquote(u0);
    const comp = computedTokens(u, isBacked);
    const flags = [];
    for (const f of figuresIn(u)) flags.push({ unit, text: u0, kind: 'figure', token: f.token, figureKind: f.kind, need: 'literal' });
    const seat = seatOfUnit(u);
    for (const [need0, re] of STATE_WORDS) {
      const m = u.match(re); if (!m) continue;
      if (CONDITION_BEFORE.test(u.slice(0, m.index))) { res.skipped.push({ unit, reason: 'conditional' }); continue; }   // REVISION: "if/when/after X has finished" states no state
      const need = need0 === 'process' && seat ? 'board' : need0;   // REVISION: a run word said of a seat is the seat's state
      if (flags.some((f) => f.kind === 'state' && f.need === need)) continue;
      if (!OBJECT.test(u)) { res.skipped.push({ unit, reason: 'no-object' }); continue; }
      flags.push({ unit, text: u0, kind: 'state', token: m[0], need, why: '' });
    }
    for (const f of flags) {
      let by = null;
      if (f.kind === 'figure') {
        const idx = evidence.findIndex((t) => literalIn({ kind: f.figureKind, token: f.token }, t));
        if (idx >= 0) by = { eventIndex: idx, how: 'literal' };
        else if (literalIn({ kind: f.figureKind, token: f.token }, prompt)) by = { eventIndex: -1, how: 'prompt' };
        else if (comp.has(f.token.replace(/[%\s]/g, '')) || comp.has(String(numOf(f.token)))) by = { eventIndex: -1, how: 'computed' };
        else if (evidence.some((t) => roundedIn(f, u, t))) by = { eventIndex: -1, how: 'rounded' };
        else if (numOf(f.token) === 0 && calls.some((c) => /^\s*(?:0|no matches found|no files found|)\s*$/i.test(String(c.result.text || '').replace(ANSI, '')) || /no such file/i.test(c.result.text || ''))) by = { eventIndex: -1, how: 'empty-result' };
        if (by && Number.isFinite(numOf(f.token))) backedNums.add(String(numOf(f.token)));
        f.why = by ? '' : 'a figure: no result before this message contains it, and it is not computed from figures that do';
      } else {
        const c = calls.find((x) => NEED_READS[f.need](x) && (f.need !== 'fs' || namesUnitPath(x, u)) && (f.need !== 'git' || !/\b(?:un)?pushed\b/i.test(f.token) || /origin|ls-remote|\.\.HEAD|push/.test(x.cmd)));
        if (c) by = { eventIndex: c.i, tool: c.tool, how: 'read' };
        // REVISION: a seat's state is backed by that seat's own ring in the prompt; a run state by a run in the turn that names the thing
        else if (f.need === 'board' && promptFromSeat(prompt, seat)) by = { eventIndex: -1, how: 'prompt' };
        else if (f.need === 'process') { const r = calls.find((x) => runNamesUnit(x, u)); if (r) by = { eventIndex: r.i, tool: r.tool, how: 'run' }; }
        f.why = by ? '' : `a state (${f.need}): nothing in this turn read that state`;
      }
      if (by) res.backed.push({ unit, token: f.token, by });
      else res.flagged.push({ unit: f.unit, text: f.text, kind: f.kind, token: f.token, need: f.kind === 'figure' ? f.figureKind : f.need, why: f.why });
    }
  });
  if (res.flagged.length && opts.mode !== 'shadow') res.verdict = 'refuse';
  return res;
}

/** The refusal text (E §4): every unbacked flag at once, and the three ways out. */
function refusalText(r, gates = 'consonance/GATES.md') {
  const clipped = (s, n) => (s.length > n ? s.slice(0, n) + '…' : s);
  const lines = r.flagged.slice(0, 8).map((f) => `  - "${clipped(String(f.token).replace(/"/g, "'"), 60)}" (unit ${f.unit}): ${f.why}.`);
  return `CLAIM CHECK: ${r.flagged.length} claim(s) in this message have nothing in THIS turn that could have shown them wrong.\n${lines.join('\n')}${r.flagged.length > 8 ? `\n  - and ${r.flagged.length - 8} more` : ''}\n` +
    'Answer one of three ways, then send again: (1) run or open the thing that shows it (the command for a figure; read_board for a seat), in a message BEFORE this one; ' +
    '(2) drop the claim; (3) mark it as an inference: put it on a line starting `inferred:` and name where it would be checked. Nothing was sent. The message is logged, so nothing is lost. ' +
    `This check refuses once per turn and place; a second send goes through. How it works: ${gates}.`;
}

// ------------------------------------------------------------------ where the claim is (E §3.4) and the turn, from a hook payload
/** True if a shell command writes into exo_memory/ (heredoc or > / >> redirect, or tee). */
function bashWritesRecord(cmd) {
  const c = String(cmd || '').replace(/\\/g, '/');
  return /(?:>>?|\btee\s+(?:-a\s+)?)\s*["']?[^\s"'|;&]*exo_memory\//.test(c);
}
/** The text a Bash command writes: its heredoc bodies and the strings echo/printf redirect into a file. */
function bashWrittenText(cmd) {
  const out = [], c = String(cmd || '');
  for (const m of c.matchAll(/<<-?\s*(['"]?)(\w+)\1[^\n]*\n([\s\S]*?)\n\s*\2\s*(?:\n|$)/g)) out.push(m[3]);
  for (const m of c.matchAll(/\b(?:echo|printf)\s+(?:-[a-z]+\s+)*(["'])([\s\S]*?)\1\s*>>?/g)) out.push(m[2]);
  return out.join('\n');
}
const underRecord = (p) => /(^|[\\/])exo_memory[\\/]/.test(String(p || ''));
/** { via, text, target } for a PreToolUse payload, or null when the call is not a place a claim is made. */
function outgoingOfTool(tool, input) {
  const i = input || {};
  if (RING_TOOLS.has(tool)) return typeof i.text === 'string' ? { via: 'ring', text: i.text, target: tool } : null;
  if (WRITE_TOOLS.has(tool)) {
    if (!underRecord(i.file_path)) return null;
    const text = tool === 'Write' ? i.content : tool === 'Edit' ? i.new_string : (i.edits || []).map((e) => e.new_string || '').join('\n');
    return typeof text === 'string' ? { via: 'record-write', text, target: String(i.file_path) } : null;
  }
  if ((tool === 'Bash' || tool === 'PowerShell') && bashWritesRecord(i.command)) { const text = bashWrittenText(i.command); return text.trim() ? { via: 'bash-write', text, target: 'bash' } : null; }
  return null;
}
/** E §1's turn from the transcript entries of THIS turn (the SOURCES gate's reader): prompt, then call/result pairs in order. */
function turnFromEntries(entries) {
  const live = entries.filter((e) => e && !e.isSidechain);
  let from = 0, prompt = '', promptTs = null;
  for (let i = live.length - 1; i >= 0; i--) if (G.isPrompt(live[i])) { from = i + 1; const c = live[i].message.content; prompt = typeof c === 'string' ? c : (c || []).filter((p) => p && p.type === 'text').map((p) => p.text || '').join('\n'); promptTs = live[i].timestamp || null; break; }
  const events = [];
  for (const e of live.slice(from)) {
    const m = e.message; if (!m || !Array.isArray(m.content)) continue;
    for (const p of m.content) {
      if (!p) continue;
      if (p.type === 'tool_use') events.push({ ts: e.timestamp, kind: 'call', tool: p.name, input: p.name === 'mcp__consonance__chair_inject' ? { target: (p.input || {}).target, text: (p.input || {}).text } : (p.input || {}) });
      else if (p.type === 'tool_result') events.push({ ts: e.timestamp, kind: 'result', tool: '', text: typeof p.content === 'string' ? p.content : Array.isArray(p.content) ? p.content.map((x) => (x && x.text) || '').join('\n') : '', isError: !!p.is_error });
    }
  }
  return { prompt, promptTs, events };
}

// ------------------------------------------------------------------ the ledger
function dataDir() {
  const env = (process.env.CONSONANCE_DATA || '').trim();
  if (env) return env;
  try { const d = String((JSON.parse(fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^﻿/, '')) || {}).data_dir || '').trim(); if (d) return d; } catch (_) { /* none */ }
  return path.join(os.homedir(), '.consonance');   // D454: the app's third step (main.rs default_data); a folder not made yet is an unwritable ledger, which allows
}
function record(dir, row) { try { fs.appendFileSync(path.join(dir, LEDGER), JSON.stringify({ ts: new Date().toISOString(), ...row }) + '\n'); return true; } catch (_) { return false; } }
/** Has this session already been refused in this turn at this place? (once per turn per place, E §4) */
function refusedBefore(dir, session, turnKey, via) {
  try {
    const lines = fs.readFileSync(path.join(dir, LEDGER), 'utf8').split('\n').slice(-500);
    return lines.some((l) => { try { const r = JSON.parse(l); return r.refused && r.session === session && r.turn === turnKey && r.via === via; } catch (_) { return false; } });
  } catch (_) { return false; }
}

// ------------------------------------------------------------------ main
function main() {
  const mode = claimCheckMode();
  if (mode === 'off') return process.exit(0);   // OFF changes nothing: nothing read, nothing written, nothing printed
  setTimeout(() => process.exit(0), WATCHDOG_MS).unref();
  let payload; try { payload = JSON.parse(fs.readFileSync(0, 'utf8')); } catch (_) { return process.exit(0); }
  if (!payload || typeof payload !== 'object') return process.exit(0);
  const dir = dataDir(); if (!dir) return process.exit(0);
  const session = String(payload.session_id || '').slice(0, 8);
  if (!G || !RS || !U) { record(dir, { v: 1, mode, session, kind: 'error', error: 'load: ' + (LOAD_ERR || 'units.js not found') }); return process.exit(0); }
  const isStop = payload.hook_event_name === 'Stop' || (payload.hook_event_name == null && typeof payload.last_assistant_message === 'string');
  let outgoing;
  if (isStop) {
    if (payload.stop_hook_active) return process.exit(0);
    const text = payload.last_assistant_message; if (typeof text !== 'string' || !text.trim() || /^\s*ok[.!]?\s*$/i.test(text)) return process.exit(0);
    outgoing = { via: 'reply', text, target: 'reply' };
  } else {
    outgoing = outgoingOfTool(payload.tool_name, payload.tool_input);
    if (!outgoing) return process.exit(0);
  }
  let t; try { t = turnFromEntries(G.readTurnEntries(payload.transcript_path)); } catch (e) { record(dir, { v: 1, mode, session, via: outgoing.via, kind: 'error', error: 'transcript: ' + String((e && e.message) || e).slice(0, 80) }); return process.exit(0); }
  const turnKey = t.promptTs || 'none';
  let r; try { r = check({ prompt: t.prompt, events: t.events, outgoing: { ts: new Date().toISOString(), via: outgoing.via, text: outgoing.text } }, { mode: mode === 'on' ? 'strict' : 'shadow' }); }
  catch (e) { record(dir, { v: 1, mode, session, via: outgoing.via, kind: 'error', error: 'check: ' + String((e && e.message) || e).slice(0, 80) }); return process.exit(0); }
  const second = r.verdict === 'refuse' && refusedBefore(dir, session, turnKey, outgoing.via);
  const row = { v: 1, mode, session, turn: turnKey, via: outgoing.via, textSha: crypto.createHash('sha256').update(outgoing.text).digest('hex').slice(0, 16), verdict: r.verdict, refused: r.verdict === 'refuse' && !second, secondSend: second, flagged: r.flagged.map((f) => ({ kind: f.kind, need: f.need })), nBacked: r.backed.length, skipped: r.skipped.map((s) => s.reason) };
  const logged = record(dir, row);
  if (!row.refused || !logged) return process.exit(0);   // allow, a second send, or a row we could not write: the message goes
  const reason = refusalText(r, G.gatesDoc ? G.gatesDoc() : undefined);
  const outJson = isStop ? { decision: 'block', reason } : { hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: reason } };
  process.stdout.write(JSON.stringify(outJson), () => process.exit(0)); setTimeout(() => process.exit(0), 1000).unref();
}

if (require.main === module) { try { main(); } catch (_) { process.exit(0); } }   // fail OPEN, without exception

module.exports = { LEDGER, ALL_VIAS, V1_VIAS, claimCheckFrom, claimCheckMode, figuresIn, skipReason, literalIn, roundedIn, computedTokens, check, refusalText, bashWritesRecord, bashWrittenText, outgoingOfTool, turnFromEntries, pairEvents };
