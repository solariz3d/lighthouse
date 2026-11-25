// usage-ledger.js (the reader, L213, pane A): which seat moved the 7-day figure.
//   node consonance/tools/usage-ledger.js --since <ISO> [--until <ISO>] [--file <ledger.jsonl>] [--transcripts [<projects dir>]] [--json]
//   node consonance/tools/usage-ledger.js --rereads <transcript.jsonl>...   (L235) per cut: files re-read in the first lap after it that were read before it.
//   --transcripts also counts, per seat, the model calls and how many of them only wait (the rule is above isWaitCommand).
// Reads <data>/usage-ledger.jsonl (written by consonance/hooks/usage-ledger.js) and prints, per seat, how far the account's 7-day
// figure moved on that seat's turns, beside its tokens by class.
//
// THE RULE AND ITS LIMIT. The 7-day figure is one number for the account, in whole percent, reported with each turn. Walking the
// turn rows in time order, a row whose figure is above the one before it (whichever seat wrote that) carries the difference: "the
// seat whose turn reported the move". A drop, or a new reset time, is a new window and counts as no movement. So: with two seats
// working at once a step lands on whichever reports it first, and a step is a whole percent at least; read it as a tally over
// hours, never as one turn's cost. It is a measurement of what the figure did, not of what a turn cost.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');

function readRows(file) {
  let text = '';
  try { text = fs.readFileSync(file, 'utf8'); } catch (_) { return []; }
  const rows = [];
  for (const line of text.split('\n')) { if (!line.trim()) continue; try { rows.push(JSON.parse(line)); } catch (_) { /* a torn line is skipped */ } }
  return rows;
}


// L225 A2 (pane A): CALLS THAT ONLY WAIT. THE RULE, written before any count (R3).
// A MODEL CALL is one assistant message id in a seat's transcript (a call is split over several rows that share the id; sidechains,
// the subagents', are not the seat's calls). It is a WAIT when it made at least one tool call and EVERY tool call in it is a Bash or
// PowerShell call whose command only waits. A command only waits when every statement in it is one of:
//   a sleep (sleep, Start-Sleep, timeout);  a tail or follow (tail, Get-Content with -Tail or -Wait);
//   a status re-read of a run already started (tasklist, Get-Process, ps, Get-Job, Receive-Job, and heavy-run.js --status when
//   nothing follows it that does other work);  or the test of a wait loop (until/while, do, done, grep -q, test, [ ]).
// Statements are split on && || ; and newlines; of a pipe only the first command is judged (the rest are filters). One statement that
// does anything else (a build, git, ls, a read of a file, an edit) makes the whole command, and so the call, NOT a wait.
// What it cannot see: a Read of a log (a plain file read is work), a wait spelled some other way, and a wait that is the right move.
const LOOP_WORDS = /^((until|while|done|do|then|fi|if|else)\b|!|\{|\}|\(|\))\s*/;
const WAIT_STATEMENT = [
  /^(sleep|start-sleep|timeout)\b/i,
  /^tail\b/i,
  /^get-content\b.*\s-(tail|wait)\b/i,
  /^(tasklist|get-process|ps|get-job|receive-job)\b/i,
  /^node\s+\S*heavy-run\.js\s+--status\s*$/i,
  /^(grep\s+-q|test|\[\[?|echo\b)/i,
];
function statementsOf(cmd) {
  if (typeof cmd !== 'string') return [];
  return cmd.split(/&&|\|\||;|\r?\n/).map((x) => x.trim().split('|')[0].trim()).map((x) => { let b; do { b = x; x = x.replace(LOOP_WORDS, '').trim(); } while (x !== b); return x; }).filter(Boolean);
}
// MIXED: a shell-only call with at least one waiting statement among others that do work (the looser reading; counted apart).
function hasWaitStatement(cmd) { return statementsOf(cmd).some((st) => WAIT_STATEMENT.some((re) => re.test(st))); }
const NEUTRAL_STATEMENT = /^(cd|set-location|export|pushd|popd)\b|^\$?[A-Za-z_][A-Za-z0-9_]*=/i;   // moves or names something; does no work
function isWaitCommand(cmd) {
  const sts = statementsOf(cmd).filter((st) => !NEUTRAL_STATEMENT.test(st));
  return sts.length > 0 && sts.every((st) => WAIT_STATEMENT.some((re) => re.test(st)));
}

// One seat's transcript lines -> { calls, waits } by the rule above, inside [since, until).
function countCalls(lines, opts = {}) {
  const since = opts.since ? Date.parse(opts.since) : 0, until = opts.until ? Date.parse(opts.until) : Infinity;
  const calls = new Map();   // message id -> { tools: [], }
  for (const line of lines) {
    if (line.indexOf('"assistant"') < 0) continue;
    let j; try { j = JSON.parse(line); } catch (_) { continue; }
    if (!j || j.type !== 'assistant' || j.isSidechain || !j.message || !j.message.id) continue;
    const t = Date.parse(j.timestamp);
    if (!(t >= since && t < until)) continue;
    if (!calls.has(j.message.id)) calls.set(j.message.id, []);
    for (const b of Array.isArray(j.message.content) ? j.message.content : []) if (b && b.type === 'tool_use') calls.get(j.message.id).push(b);
  }
  let waits = 0, mixed = 0;
  for (const tools of calls.values()) {
    const shell = tools.length > 0 && tools.every((b) => b.name === 'Bash' || b.name === 'PowerShell');
    if (!shell) continue;
    if (tools.every((b) => isWaitCommand(b.input && b.input.command))) waits += 1;
    else if (tools.some((b) => hasWaitStatement(b.input && b.input.command))) mixed += 1;
  }
  return { calls: calls.size, waits, mixed };
}

// { seat: { calls, waits } } for the seats whose transcript is found: a file whose name starts with the seat id, in any folder under root.
function callsBySeat(root, seats, opts = {}) {
  const out = {};
  let dirs = [];
  try { dirs = fs.readdirSync(root, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => path.join(root, d.name)); } catch (_) { return out; }
  for (const seat of seats) {
    let calls = 0, waits = 0, mixed = 0, found = false;
    for (const d of dirs) {
      let names = []; try { names = fs.readdirSync(d); } catch (_) { continue; }
      for (const n of names) {
        if (!n.startsWith(seat) || !n.endsWith('.jsonl')) continue;
        found = true;
        const c = countCalls(fs.readFileSync(path.join(d, n), 'utf8').split('\n'), opts);
        calls += c.calls; waits += c.waits; mixed += c.mixed;
      }
    }
    if (found) out[seat] = { calls, waits, mixed };
  }
  return out;
}

function report(rows, opts = {}) {
  const since = opts.since ? Date.parse(opts.since) : 0;
  const until = opts.until ? Date.parse(opts.until) : Infinity;
  const kept = rows.filter((r) => r && Date.parse(r.t) >= since && Date.parse(r.t) < until).sort((a, b) => Date.parse(a.t) - Date.parse(b.t));
  const seats = new Map();
  const get = (id) => {
    const k = id || '?';
    if (!seats.has(k)) seats.set(k, { seat: k, turns: 0, moved: 0, in: 0, out: 0, cache_create: 0, cache_read: 0, calls: null, waits: null, mixed: null, wakes: 0, wake_tokens_cold: 0, models: new Set() });
    return seats.get(k);
  };
  let prev = null, firstPct = null, lastPct = null, withoutPct = 0;
  for (const r of kept) {
    const s = get(r.seat);
    if (r.kind === 'wake') { s.wakes += 1; if (r.cache_expired === true && typeof r.context_tokens === 'number') s.wake_tokens_cold += r.context_tokens; continue; }
    if (r.kind !== 'turn') continue;
    s.turns += 1;
    for (const f of ['in', 'out', 'cache_create', 'cache_read']) if (typeof r[f] === 'number') s[f] += r[f];
    if (r.model) s.models.add(r.model);
    if (typeof r.seven_day_pct !== 'number') { withoutPct += 1; continue; }
    if (firstPct === null) firstPct = r.seven_day_pct;
    lastPct = r.seven_day_pct;
    if (prev && prev.resets === r.seven_day_resets && r.seven_day_pct > prev.pct) s.moved += r.seven_day_pct - prev.pct;
    prev = { pct: r.seven_day_pct, resets: r.seven_day_resets };
  }
  for (const s of seats.values()) { const c = opts.calls && opts.calls[s.seat]; if (c) { s.calls = c.calls; s.waits = c.waits; s.mixed = c.mixed || 0; } }
  const list = [...seats.values()].map((s) => ({ ...s, models: [...s.models] })).sort((a, b) => b.moved - a.moved || b.out - a.out || (a.seat < b.seat ? -1 : 1));
  return { since: opts.since || null, rows: kept.length, rows_without_pct: withoutPct, first_pct: firstPct, last_pct: lastPct, seats: list };
}

function lettersFor() {
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^﻿/, ''));
    const m = JSON.parse(fs.readFileSync(path.join(String(cfg.data_dir), 'letters.json'), 'utf8').replace(/^﻿/, ''));
    return m && typeof m === 'object' ? m : {};
  } catch (_) { return {}; }
}

function render(out, letters = {}) {
  const lines = [];
  lines.push(`7-day figure: ${out.first_pct === null ? 'none seen' : out.first_pct + '% -> ' + out.last_pct + '%'}  (${out.rows} rows since ${out.since || 'the start'}${out.rows_without_pct ? ', ' + out.rows_without_pct + ' turn rows without it' : ''})`);
  lines.push('seat      pane  moved   turns   in        out       cache_create  cache_read   wakes  cold_wake_tokens  models  waits of calls');
  for (const s of out.seats) {
    const key = Object.keys(letters).find((k) => String(k).slice(0, 8) === s.seat);
    const pane = key ? letters[key] : '';
    lines.push(`${String(s.seat).padEnd(9)} ${String(pane).padEnd(5)} ${('+' + s.moved).padEnd(7)} ${String(s.turns).padEnd(7)} ${String(s.in).padEnd(9)} ${String(s.out).padEnd(9)} ${String(s.cache_create).padEnd(13)} ${String(s.cache_read).padEnd(12)} ${String(s.wakes).padEnd(6)} ${String(s.wake_tokens_cold).padEnd(17)} ${s.models.join(',')}  ${s.calls === null ? 'not counted' : s.waits + ' of ' + s.calls}`);
  }
  return lines.join('\n');
}

// L235: files a pane re-reads in its first lap after a cut that it had already read before the cut (read-only; a transcript in, numbers out).
// "Read before" is only the reads since the PREVIOUS cut (what this cut removed), and a shell token counts only with a separator and an extension (pane C, L235).
// A cut is a `system` row with subtype `compact_boundary`. "Read" is a Read tool call (input.file_path) or a shell command whose
// reading verb (cat, head, tail, sed, grep, rg, type, less, more, Get-Content) is followed by a path-looking token. The first lap after a cut runs
// from the boundary to the next chair dispatch whose lap id differs from the first one after it (else to the next cut, else the end).
// LIMIT: shell paths are found by shape (a token with a slash or an extension), so a shell read of a path built by a variable is not seen,
// and a path read by glob counts as the glob text; both undercount. Paths are compared lower-cased with slashes unified and /c/ -> c:/.
const READ_VERB = /(?:^|[\s;&|(])(?:cat|head|tail|sed|grep|rg|type|less|more|get-content|gc)\b([^;&|\n]*)/gi;
function normPath(p) {
  let s = String(p).replace(/^["'`]|["'`,)]+$/g, '').replace(/\\/g, '/').toLowerCase();
  s = s.replace(/^\/([a-z])\//, '$1:/');
  return s;
}
function shellPaths(cmd) {
  const out = [];
  for (const m of String(cmd || '').matchAll(READ_VERB)) {
    for (const tok of m[1].split(/\s+/)) {
      if (!tok || tok.startsWith('-')) continue;
      if (/[*?[\]$]/.test(tok)) continue;   // a glob or a pattern, not a path
      const n = normPath(tok);   // tested after the quotes are stripped, so a quoted path counts (pane C, L236)
      if (/[/\\]/.test(n) && /\.[a-z0-9]{1,5}$/i.test(n)) out.push(n);   // a separator AND an extension (pane C, L235)
    }
  }
  return out;
}
function pathsOf(block) {
  if (!block || block.type !== 'tool_use') return [];
  const i = block.input || {};
  if (block.name === 'Read' && i.file_path) return [normPath(i.file_path)];
  if (block.name === 'Bash' || block.name === 'PowerShell') return shellPaths(i.command);
  return [];
}
function lapOf(row) {
  const c = row.message && row.message.content;
  const t = typeof c === 'string' ? c : Array.isArray(c) ? c.filter((b) => b && b.type === 'text').map((b) => b.text).join('\n') : '';
  if (!t.includes('[chair:MAIN]')) return null;
  const m = t.split('[chair:MAIN]')[1].slice(0, 160).match(/(?:^|[^A-Za-z0-9])(L\d{3,4})(?![A-Za-z0-9])/);
  return m ? m[1] : null;
}
// -> [{ at, before: n distinct paths read before, reread: [paths], firstLap, calls }]
function rereadsAfterCuts(lines) {
  const rows = [];
  for (const l of lines) { if (!l) continue; try { const v = JSON.parse(l); if (!v.isSidechain) rows.push(v); } catch (_) { /* a torn line */ } }
  const cuts = [];
  rows.forEach((v, i) => { if (v.type === 'system' && v.subtype === 'compact_boundary') cuts.push(i); });
  const out = [];
  for (let c = 0; c < cuts.length; c++) {
    const seen = new Set();
    for (let i = c > 0 ? cuts[c - 1] + 1 : 0; i < cuts[c]; i++) if (rows[i].type === 'assistant') for (const b of (rows[i].message && rows[i].message.content) || []) for (const p of pathsOf(b)) seen.add(p);
    const end = c + 1 < cuts.length ? cuts[c + 1] : rows.length;
    let firstLap = null, stop = end;
    for (let i = cuts[c] + 1; i < end; i++) {
      const v = rows[i];
      if (v.type !== 'user' || v.isCompactSummary) continue;
      const lap = lapOf(v);
      if (!lap) continue;
      if (!firstLap) firstLap = lap; else if (lap !== firstLap) { stop = i; break; }
    }
    const again = new Set(); let calls = 0;
    for (let i = cuts[c] + 1; i < stop; i++) {
      if (rows[i].type !== 'assistant') continue;
      calls += 1;
      for (const b of (rows[i].message && rows[i].message.content) || []) for (const p of pathsOf(b)) if (seen.has(p)) again.add(p);
    }
    out.push({ at: rows[cuts[c]].timestamp, before: seen.size, reread: [...again], firstLap, calls });
  }
  return out;
}

function main(argv) {
  const opt = { file: null, since: null, until: null, json: false, transcripts: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--since') opt.since = argv[++i];
    else if (argv[i] === '--file') opt.file = argv[++i];
    else if (argv[i] === '--until') opt.until = argv[++i];
    else if (argv[i] === '--transcripts') opt.transcripts = (argv[i + 1] && !argv[i + 1].startsWith('--')) ? argv[++i] : path.join(os.homedir(), '.claude', 'projects');
    else if (argv[i] === '--json') opt.json = true;
    else if (argv[i] === '--rereads') { opt.rereads = []; while (argv[i + 1] && !argv[i + 1].startsWith('--')) opt.rereads.push(argv[++i]); }
    else { console.error('unknown argument ' + argv[i]); return 2; }
  }
  if (opt.since && !Number.isFinite(Date.parse(opt.since))) { console.error('--since is not a date: ' + opt.since); return 2; }
  const { dataDir } = require('../hooks/usage-ledger.js');
  const file = opt.file || path.join(dataDir(), 'usage-ledger.jsonl');
  if (opt.until && !Number.isFinite(Date.parse(opt.until))) { console.error('--until is not a date: ' + opt.until); return 2; }
  if (opt.rereads) {
    for (const f of opt.rereads) for (const r of rereadsAfterCuts(fs.readFileSync(f, 'utf8').split('\n'))) console.log(path.basename(f) + ' cut ' + r.at + ': ' + r.reread.length + ' re-read of ' + r.before + ' read before; first lap ' + r.firstLap + ', ' + r.calls + ' calls');
    return 0;
  }
  const rows = readRows(file);
  const ropt = { since: opt.since, until: opt.until };
  if (opt.transcripts) ropt.calls = callsBySeat(opt.transcripts, [...new Set(rows.map((r) => r && r.seat).filter(Boolean))], ropt);
  const out = report(rows, ropt);
  console.log(opt.json ? JSON.stringify(out) : render(out, lettersFor()));
  return 0;
}

if (require.main === module) process.exit(main(process.argv.slice(2)));
module.exports = { report, readRows, render, isWaitCommand, hasWaitStatement, countCalls, callsBySeat, rereadsAfterCuts };
