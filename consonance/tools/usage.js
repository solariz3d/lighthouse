#!/usr/bin/env node
'use strict';
/* usage.js — token use per seat per day, read from this machine's Claude Code transcripts. "Solid" criterion 3.
 *
 * WHY IT EXISTS. `loop/solid_registration_2026-09-22.md` §3 found no instrument "of any kind" that reads usage, and the
 * keeper adopted "solid" with criterion 3 scored NOT MEASURED until one exists (`loop/solid_decision_sheet_2026-09-23.md`).
 * This is the reading half. It measures the tokens it can SEE; it does not know the account's total, and says so in
 * every report (THE BLIND SPOT, below).
 *
 *   node consonance/tools/usage.js                         per seat per day, the last 7 local days
 *   node consonance/tools/usage.js --days 14
 *   node consonance/tools/usage.js --week --reset fri@04:00        the week that ENDS at the keeper's reset
 *   node consonance/tools/usage.js --week --reset fri@04:00 --limit 50000000 --limit-counts all
 *   node consonance/tools/usage.js --json                  the same report as JSON
 *
 * WHERE THE NUMBERS COME FROM. Every `assistant` row in ~/.claude/projects/<dir>/**.jsonl (subagent transcripts under
 * <session>/subagents/ and `.jsonl.orphaned` files included) that carries `message.usage`. The four fields are the ones
 * main.rs already reads (`extract_usage`, main.rs:2189): input_tokens, output_tokens, cache_creation_input_tokens,
 * cache_read_input_tokens, and the model is `message.model`.
 *
 * DEDUP, measured on L's 2,707 transcript files on 2026-09-23 before the key was chosen:
 *   - one API response is written as SEVERAL rows sharing message.id (one per content block). 39,203 repeats carried
 *     identical usage; 1,603 did not, and in every sampled case only output_tokens differed, growing (5 → 231): the
 *     early row is written mid-stream. So a response is counted ONCE, and each field takes its MAXIMUM over the rows.
 *   - the key is message.id, not requestId: every usage row has a message.id, 92 have no requestId, and no message.id
 *     spans two requestIds.
 *   - a resumed session copies earlier rows into a new file (114 responses were in two files) and 391 responses exist
 *     ONLY in a `.jsonl.orphaned` file, so dedup is across ALL files and orphaned files are read.
 *   - `<synthetic>` rows are the client's own messages (e.g. an expired login), not API calls, and are skipped.
 *   - `cost-state` rows carry `modelUsage`, but as a running SESSION total (totalCostUSD, startTime). Adding them would
 *     count the same tokens twice, so they are counted as a cross-check line and never added.
 *
 * SEATS. The project dir is the cwd with every non-alphanumeric character turned into '-' (main.rs `encode_cwd`). The
 * instances dir comes from CONSONANCE_INSTANCES / ~/.consonance.json instances_dir, the same resolution board-digest.js
 * uses. <instances>/main is MAIN, /librarian LIBRARIAN, /third-place THIRD-PLACE. A sibling is named by its LETTER:
 * <data>/panes.json maps the dir's cwd to a pane id and <data>/letters.json maps the pane id to the letter, the mapping
 * board-digest.js uses. A retired sibling no longer in panes.json is still named if one of its session files is a
 * pane id in letters.json. Anything else (other work, test subjects) is shown under its own dir name, never dropped.
 *
 * KEEP-WARM. The registration's criterion is usage "with keep-warm on", and it asks for keep-warm's share. A response
 * is keep-warm when the last real prompt before it is the chair's ping (KEEP_WARM_TEXT, main.rs:10776, matched on its
 * opening words so a later rewording of the tail does not silently zero the column).
 *
 * THE LIMIT is typed by the keeper: `--limit N --limit-counts <all|no-cache-read|output>` for one run, or
 * `usage.weekly_limit` + `usage.limit_counts` in ~/.consonance.json for every run (the flag wins). WHAT A LIMIT COUNTS
 * is part of the limit and is never assumed: until BOTH are set the report says so and prints no percentage. The reset
 * is typed the same way (`--reset fri@04:00`, or `usage.reset`), in the zone from `--tz`, else ~/.consonance.json
 * `ambient_tz`, else this machine's zone. Read-only: this tool writes nothing.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');

const KEEP_WARM_PREFIX = '[keep-warm, from the chair';
const COUNTS = {
  all: (u) => u.input + u.output + u.cacheWrite + u.cacheRead,
  'no-cache-read': (u) => u.input + u.output + u.cacheWrite,
  output: (u) => u.output,
};
const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const DAY_MS = 86400000;

// The blind spot, named by site. Every report prints it. A site added later is found by the grep in the note.
const BLIND = [
  'one-shot calls spawned with --no-session-persistence write NO transcript, so their usage is NOT in these numbers:',
  '    consonance/src-tauri/src/main.rs `claude_oneshot` (the Scribe, committee_form) · consonance/tools/curate.js ·',
  '    consonance/tools/second-vantage.js · exo_memory/loop/d121_relay/harness.js',
  '    (find any new one: grep -rn -- "--no-session-persistence" --include=*.js --include=*.rs .)',
  'Jev runs through the Vercel AI gateway on its own key: it is not Claude Code usage at all and is not here.',
  'this reads the transcripts ON THIS MACHINE. A conversation carried between machines by dev/tail-carry.js arrives',
  '    with its other-machine rows, so those ARE counted (once: the rows keep their message ids). Work done on another',
  '    machine in a conversation that was not carried here is not.',
];

const encodeCwd = (cwd) => String(cwd).replace(/[^A-Za-z0-9]/g, '-');
const readJson = (p, fallback) => {
  try { return JSON.parse(fs.readFileSync(p, 'utf8').replace(/^﻿/, '')); } catch (_) { return fallback; }
};

function textOf(content) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  // A tool_result is the model's own loop, not a new prompt.
  if (content.some((c) => c && c.type === 'tool_result')) return null;
  return content.map((c) => (c && typeof c.text === 'string' ? c.text : '')).join('');
}

function listFiles(root) {
  const out = [];
  const walk = (d, top) => {
    let entries;
    try { entries = fs.readdirSync(d, { withFileTypes: true }); } catch (_) { return; }
    for (const e of entries) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p, top || e.name);
      else if (top && /\.jsonl(\.orphaned)?$/.test(e.name)) out.push({ file: p, dir: top });
    }
  };
  walk(root, null);
  return out;
}

/** Every counted API response, once. `sinceMs` skips files last written before it (a row cannot be newer than its
 *  file). Returns { responses: Map(id -> response), costState, synthetic, files }. */
function readResponses(projectsDir, sinceMs = 0) {
  const responses = new Map();
  let costState = 0;
  let synthetic = 0;
  let read = 0;
  for (const { file, dir } of listFiles(projectsDir)) {
    try { if (fs.statSync(file).mtimeMs < sinceMs) continue; } catch (_) { continue; }
    read += 1;
    let text;
    try { text = fs.readFileSync(file, 'utf8'); } catch (_) { continue; }
    let keepWarm = false;
    for (const line of text.split('\n')) {
      if (!line) continue;
      let v;
      try { v = JSON.parse(line); } catch (_) { continue; }
      if (v.type === 'cost-state') { costState += 1; continue; }
      if (v.type === 'user' && !v.isSidechain && v.message) {
        const t = textOf(v.message.content);
        if (t !== null && t.trim()) keepWarm = t.trim().startsWith(KEEP_WARM_PREFIX);
        continue;
      }
      const m = v.message;
      if (!m || !m.usage || !m.id) continue;
      if (m.model === '<synthetic>') { synthetic += 1; continue; }
      const ts = Date.parse(v.timestamp);
      if (!Number.isFinite(ts)) continue;
      const u = m.usage;
      const n = (k) => (Number.isFinite(Number(u[k])) ? Number(u[k]) : 0);
      const row = { input: n('input_tokens'), output: n('output_tokens'), cacheWrite: n('cache_creation_input_tokens'), cacheRead: n('cache_read_input_tokens') };
      const prev = responses.get(m.id);
      if (!prev) {
        responses.set(m.id, { id: m.id, dir, ts, model: String(m.model || '?'), keepWarm, sidechain: !!v.isSidechain, ...row });
      } else {
        for (const k of Object.keys(row)) prev[k] = Math.max(prev[k], row[k]);
        if (ts < prev.ts) prev.ts = ts;
        prev.keepWarm = prev.keepWarm || keepWarm;
      }
    }
  }
  return { responses, costState, synthetic, files: read };
}

/** dir name -> seat label. */
function seatNamer({ instancesDir, dataDir, projectsDir }) {
  const inst = instancesDir ? encodeCwd(instancesDir) : null;
  const fixed = inst ? { [`${inst}-main`]: 'MAIN', [`${inst}-librarian`]: 'LIBRARIAN', [`${inst}-third-place`]: 'THIRD-PLACE' } : {};
  const letters = readJson(path.join(dataDir, 'letters.json'), {});
  const roster = readJson(path.join(dataDir, 'panes.json'), []);
  const byDir = {};
  for (const r of Array.isArray(roster) ? roster : []) {
    if (r && typeof r === 'object' && r.cwd && letters[r.pane]) byDir[encodeCwd(r.cwd)] = letters[r.pane];
  }
  const cache = new Map();
  return (dir) => {
    if (cache.has(dir)) return cache.get(dir);
    let name = fixed[dir] || (byDir[dir] ? `pane ${byDir[dir]}` : null);
    if (!name && inst && dir.startsWith(`${inst}-sibling-`)) {
      // A retired sibling: its session file is named by its pane id.
      try {
        for (const f of fs.readdirSync(path.join(projectsDir, dir))) {
          const id = f.replace(/\.jsonl(\.orphaned)?$/, '');
          if (letters[id]) { name = `pane ${letters[id]}`; break; }
        }
      } catch (_) { /* unreadable dir: fall through to its own name */ }
    }
    name = name || dir;
    cache.set(dir, name);
    return name;
  };
}

// ── time, in a named zone ─────────────────────────────────────────────────────────────────────────────────────
function zoneParts(ms, tz) {
  const f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', weekday: 'short' });
  const p = Object.fromEntries(f.formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
  return { y: +p.year, mo: +p.month, d: +p.day, h: +p.hour, mi: +p.minute, s: +p.second, wd: DAYS.indexOf(p.weekday.toLowerCase().slice(0, 3)) };
}
const dayKey = (ms, tz) => { const p = zoneParts(ms, tz); return `${p.y}-${String(p.mo).padStart(2, '0')}-${String(p.d).padStart(2, '0')}`; };
/** The UTC instant of a wall-clock time in `tz` (two passes settle any offset change). */
function zoneToUtc(y, mo, d, h, mi, tz) {
  let guess = Date.UTC(y, mo - 1, d, h, mi);
  for (let i = 0; i < 2; i++) {
    const p = zoneParts(guess, tz);
    guess += Date.UTC(y, mo - 1, d, h, mi) - Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi, p.s);
  }
  return guess;
}

function parseReset(spec) {
  const m = /^(sun|mon|tue|wed|thu|fri|sat)[a-z]*@([01]?\d|2[0-3]):([0-5]\d)$/i.exec(String(spec || '').trim());
  if (!m) return null;
  return { wd: DAYS.indexOf(m[1].toLowerCase()), h: +m[2], mi: +m[3] };
}

/** The week that ENDS at the next reset strictly after `now`: [end - 7 days, end). */
function weekWindow(nowMs, reset, tz) {
  const p = zoneParts(nowMs, tz);
  for (let k = 0; k <= 7; k++) {
    const day = new Date(Date.UTC(p.y, p.mo - 1, p.d + k));
    const end = zoneToUtc(day.getUTCFullYear(), day.getUTCMonth() + 1, day.getUTCDate(), reset.h, reset.mi, tz);
    if (zoneParts(end, tz).wd === reset.wd && end > nowMs) return { start: end - 7 * DAY_MS, end };
  }
  throw new Error('no reset found in the next 8 days — this is a bug in weekWindow');
}

// ── the report ────────────────────────────────────────────────────────────────────────────────────────────────
function sum(list) {
  const t = { responses: 0, input: 0, output: 0, cacheWrite: 0, cacheRead: 0, keepWarmAll: 0, keepWarmResponses: 0 };
  for (const r of list) {
    t.responses += 1;
    for (const k of ['input', 'output', 'cacheWrite', 'cacheRead']) t[k] += r[k];
    if (r.keepWarm) { t.keepWarmResponses += 1; t.keepWarmAll += COUNTS.all(r); }
  }
  t.all = COUNTS.all(t);
  return t;
}

function build(opts) {
  const now = opts.now;
  const window = opts.week
    ? weekWindow(now, opts.reset, opts.tz)
    : (() => { const p = zoneParts(now, opts.tz); return { start: zoneToUtc(p.y, p.mo, p.d, 0, 0, opts.tz) - (opts.days - 1) * DAY_MS, end: now + 1 }; })();
  const { responses, costState, synthetic, files } = readResponses(opts.projectsDir, window.start - DAY_MS);
  const seatOf = seatNamer(opts);
  const inWin = [...responses.values()].filter((r) => r.ts >= window.start && r.ts < window.end);
  const bySeat = new Map();
  const bySeatDay = new Map();
  for (const r of inWin) {
    const seat = seatOf(r.dir);
    (bySeat.get(seat) || bySeat.set(seat, []).get(seat)).push(r);
    const k = `${seat}\u0000${dayKey(r.ts, opts.tz)}`;
    (bySeatDay.get(k) || bySeatDay.set(k, []).get(k)).push(r);
  }
  const seats = [...bySeat.entries()].map(([seat, list]) => ({ seat, ...sum(list), models: [...new Set(list.map((r) => r.model))].sort() }))
    .sort((a, b) => b.all - a.all || a.seat.localeCompare(b.seat));
  const days = [...bySeatDay.entries()].map(([k, list]) => { const [seat, day] = k.split('\u0000'); return { seat, day, ...sum(list) }; })
    .sort((a, b) => a.seat.localeCompare(b.seat) || a.day.localeCompare(b.day));
  const total = sum(inWin);
  let limit = { set: false, why: 'not set' };
  if (opts.limit != null && opts.limitCounts) {
    const used = COUNTS[opts.limitCounts](total);
    limit = { set: true, tokens: opts.limit, counts: opts.limitCounts, source: opts.limitSource, used, percent: (100 * used) / opts.limit };
    if (!opts.week) limit = { set: true, tokens: opts.limit, counts: opts.limitCounts, source: opts.limitSource, why: 'a weekly limit is compared only in the --week view' };
  } else if (opts.limit != null) {
    limit = { set: false, why: `set to ${opts.limit}, but WHAT IT COUNTS is not set (--limit-counts ${Object.keys(COUNTS).join('|')})` };
  }
  return { now, tz: opts.tz, tzSource: opts.tzSource, week: !!opts.week, reset: opts.resetSpec || null, window, files, seats, days, total, limit, costState, synthetic, blind: BLIND };
}

const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const stamp = (ms, tz) => { const p = zoneParts(ms, tz); return `${dayKey(ms, tz)} ${String(p.h).padStart(2, '0')}:${String(p.mi).padStart(2, '0')}`; };

function render(r) {
  const out = [];
  const cols = ['responses', 'input', 'output', 'cache-write', 'cache-read', 'all four', 'keep-warm'];
  const w = Math.max(12, ...r.days.map((d) => d.seat.length), ...r.seats.map((s) => s.seat.length)) + 2;
  const row = (a, b, t) => `  ${a.padEnd(w)}${b.padEnd(12)}${[t.responses, t.input, t.output, t.cacheWrite, t.cacheRead, t.all, t.keepWarmAll].map((n) => fmt(n).padStart(14)).join('')}`;
  out.push('USAGE — tokens this tool can SEE in this machine\'s Claude Code transcripts (each API response counted once)');
  out.push(`  zone ${r.tz} (${r.tzSource}) · now ${stamp(r.now, r.tz)} · ${r.files} transcript file(s) read`);
  out.push(r.week
    ? `  WEEK ending at the keeper's reset (${r.reset}): ${stamp(r.window.start, r.tz)} → ${stamp(r.window.end, r.tz)}`
    : `  window: ${stamp(r.window.start, r.tz)} → now, by local day`);
  out.push(`  keep-warm = all four fields of the responses to the chair's keep-warm ping`);
  out.push('');
  out.push('PER SEAT PER DAY');
  out.push(`  ${'seat'.padEnd(w)}${'day'.padEnd(12)}${cols.map((c) => c.padStart(14)).join('')}`);
  if (!r.days.length) out.push('  (no responses in this window)');
  for (const d of r.days) out.push(row(d.seat, d.day, d));
  out.push('');
  out.push(r.week ? 'THE WEEK, PER SEAT' : 'THE WINDOW, PER SEAT');
  for (const s of r.seats) out.push(`${row(s.seat, '', s)}   ${s.models.join(', ')}`);
  out.push(row('TOTAL', '', r.total));
  if (r.total.all) out.push(`  keep-warm share of all four: ${(100 * r.total.keepWarmAll / r.total.all).toFixed(2)}% (${fmt(r.total.keepWarmResponses)} response(s))`);
  out.push('');
  if (r.limit.set && r.limit.percent != null) {
    out.push(`LIMIT: ${fmt(r.limit.tokens)} tokens counting "${r.limit.counts}" (${r.limit.source}) · used ${fmt(r.limit.used)} = ${r.limit.percent.toFixed(1)}% of the limit, of what this tool can see`);
  } else {
    out.push(`limit: ${r.limit.why}`);
    if (!r.limit.set) out.push('  set it with --limit N --limit-counts <all|no-cache-read|output>, or usage.weekly_limit + usage.limit_counts in ~/.consonance.json');
  }
  out.push('');
  out.push('THE BLIND SPOT — these numbers are what this tool can SEE. They are NOT the account\'s total usage.');
  for (const b of r.blind) out.push(b.startsWith(' ') ? `  ${b}` : `  - ${b}`);
  out.push(`  - ${r.costState} cost-state row(s) carry a running session modelUsage total; never added (it would count twice).`);
  if (r.synthetic) out.push(`  - ${r.synthetic} <synthetic> row(s) skipped: the client's own messages, not API calls.`);
  return out.join('\n');
}

function parseArgs(argv, env) {
  const home = env.USERPROFILE || env.HOME || os.homedir();
  const cfg = readJson(path.join(home, '.consonance.json'), {});
  const u = cfg.usage && typeof cfg.usage === 'object' ? cfg.usage : {};
  const envv = (n) => (env[n] && String(env[n]).trim() ? String(env[n]).trim() : null);
  const a = { days: 7, week: false, json: false };
  const need = (i, flag) => { if (i + 1 >= argv.length) throw new Error(`${flag} needs a value`); return argv[i + 1]; };
  for (let i = 0; i < argv.length; i++) {
    const f = argv[i];
    if (f === '--week') a.week = true;
    else if (f === '--json') a.json = true;
    else if (f === '--days') { a.days = Number(need(i, f)); i++; }
    else if (f === '--reset') { a.resetSpec = need(i, f); i++; }
    else if (f === '--limit') { a.limitRaw = need(i, f); i++; }
    else if (f === '--limit-counts') { a.limitCounts = need(i, f); i++; }
    else if (f === '--tz') { a.tz = need(i, f); i++; }
    else if (f === '--now') { a.nowRaw = need(i, f); i++; }
    else if (f === '--projects') { a.projectsDir = need(i, f); i++; }
    else throw new Error(`unknown argument: ${f}`);
  }
  if (!Number.isInteger(a.days) || a.days < 1) throw new Error('--days must be a positive whole number');
  a.now = a.nowRaw != null ? Date.parse(a.nowRaw) : Date.now();
  if (!Number.isFinite(a.now)) throw new Error(`--now is not a date: ${a.nowRaw}`);
  a.tzSource = a.tz ? '--tz' : cfg.ambient_tz ? '~/.consonance.json ambient_tz' : 'this machine';
  a.tz = a.tz || cfg.ambient_tz || Intl.DateTimeFormat().resolvedOptions().timeZone;
  try { zoneParts(0, a.tz); } catch (_) { throw new Error(`not a time zone: ${a.tz}`); }
  if (a.resetSpec == null && u.reset != null) a.resetSpec = u.reset;
  if (a.week) {
    if (a.resetSpec == null) throw new Error('--week needs the keeper\'s reset: --reset fri@04:00, or usage.reset in ~/.consonance.json');
    a.reset = parseReset(a.resetSpec);
    if (!a.reset) throw new Error(`--reset is not <day>@HH:MM: ${a.resetSpec}`);
  }
  if (a.limitRaw != null) a.limitSource = '--limit';
  else if (u.weekly_limit != null) { a.limitRaw = u.weekly_limit; a.limitSource = '~/.consonance.json usage.weekly_limit'; }
  if (a.limitCounts == null && u.limit_counts != null) a.limitCounts = u.limit_counts;
  if (a.limitRaw != null) {
    a.limit = Number(a.limitRaw);
    if (!Number.isInteger(a.limit) || a.limit <= 0) throw new Error(`the limit must be a positive whole number of tokens: ${a.limitRaw}`);
  }
  if (a.limitCounts != null && !COUNTS[a.limitCounts]) throw new Error(`--limit-counts must be one of ${Object.keys(COUNTS).join(', ')}: ${a.limitCounts}`);
  a.projectsDir = a.projectsDir || path.join(home, '.claude', 'projects');
  a.dataDir = envv('CONSONANCE_DATA') || cfg.data_dir || path.join(home, '.consonance');
  a.instancesDir = envv('CONSONANCE_INSTANCES') || cfg.instances_dir || path.join(home, 'claude-instances');
  if (!fs.existsSync(a.projectsDir)) throw new Error(`no transcripts at ${a.projectsDir}`);
  return a;
}

if (require.main === module) {
  let opts;
  try { opts = parseArgs(process.argv.slice(2), process.env); } catch (e) { console.error(`usage.js: ${e.message}`); process.exit(2); }
  const r = build(opts);
  console.log(opts.json ? JSON.stringify(r, null, 1) : render(r));
}

module.exports = { readResponses, seatNamer, weekWindow, parseReset, zoneToUtc, dayKey, build, render, parseArgs, encodeCwd, KEEP_WARM_PREFIX };
