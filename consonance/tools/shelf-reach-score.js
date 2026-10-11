#!/usr/bin/env node
// shelf-reach-score.js — the F1–F3 scorer for the shelf-budget build (D297 part 3, ledger D298, seat A, 2026-10-11).
//
// Registered at exo_memory/loop/shelf_budget_registration_2026-10-11.md §3. This file FIXES the counting rule so it cannot drift:
//   an OPEN is a `Read` tool_use in a librarian transcript (<projects>/C--Consonance-instances-librarian*) whose file_path, with
//   backslashes changed to / and lower-cased, ends in exo_memory/<rel>; its timestamp must be >= W0; Third Place transcripts are
//   never scanned. (Derived from scratchpad/d294b/opens.js. read_ledger.jsonl records no opens, so it is not used.)
//
//   NEW = index entries on the W0 shelf (--after) and not on today's (--base).   OLD = the index-tier entries (map/ journal/ loop/)
//   listed on today's shelf.   An "index entry" is a `- <rel>  (N lines)  <title>` line in the shelf's NOT CARRIED section.
//   F1  fires when 0 NEW entries were opened in the window; >= 3 helped; 1-2 undecided (never rounded up).
//   F2  fires when the share of OLD entries opened falls below 4.1% (half of 17/207).
//   F3  fires when 0 of the newly listed hand-backs were opened; >= 1 reports the count.
//   Unit: DISTINCT entries opened (the unit of opens.js's 17/207); total Read calls are printed beside it.
//   The window is 14 days from W0.
//
// usage: node consonance/tools/shelf-reach-score.js --base <dump.md> --after <dump.md> (--since <iso> | --since-file <shelf>)
//          [--projects <dir>] [--until <iso>] [--json]
//        node consonance/tools/shelf-reach-score.js --base <..> --after <..> --replay-days 14   (BASELINE: prints counts, scores nothing)
// Exit 0 on a printed report; 2 on bad input.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');

const WINDOW_DAYS = 14;
const F2_BAR = 0.041;
const TIER = /^(map|journal|loop)\//;
const BACKSLASH = String.fromCharCode(92);

/** The index entries of a shelf dump, lower-cased, in order. Empty when the section is absent. */
function parseEntries(text) {
  const lines = String(text).split(/\r?\n/);
  const a = lines.findIndex((l) => l.startsWith('## NOT CARRIED'));
  if (a < 0) return [];
  let b = lines.findIndex((l, i) => i > a && /^(THE INDEX IS WINDOWED|## )/.test(l));
  if (b < 0) b = lines.length;
  const out = [];
  for (const l of lines.slice(a, b)) {
    const m = /^- (\S+) {2}\(/.exec(l);
    if (m) out.push(m[1].toLowerCase());
  }
  return out;
}

/** The three lists the falsifiers read. NEW = after minus base; OLD = base's index tier; HB = NEW under handback/. */
function lists(baseEntries, afterEntries) {
  const base = new Set(baseEntries);
  const nw = [...new Set(afterEntries)].filter((r) => !base.has(r));
  return { new: nw, old: [...base].filter((r) => TIER.test(r)), hb: nw.filter((r) => r.startsWith('handback/')) };
}

/** Project dirs the rule scans: librarian transcripts only; a Third Place directory is never entered. */
function librarianDirs(projects) {
  let names = [];
  try { names = fs.readdirSync(projects); } catch { return []; }
  return names
    .filter((n) => n.startsWith('C--Consonance-instances-librarian') && !/third-place/i.test(n))
    .map((n) => path.join(projects, n));
}

/** @returns {Promise<{files:number, reads:Map<string,number>}>} reads: rel -> Read count with ts in [since, until]. */
async function scanOpens(projects, since, until) {
  const reads = new Map();
  const files = [];
  const walk = (d) => {
    let es; try { es = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of es) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { if (!/third-place/i.test(e.name)) walk(p); }
      else if (e.name.endsWith('.jsonl')) { try { if (fs.statSync(p).mtimeMs >= since) files.push(p); } catch { /* gone */ } }
    }
  };
  for (const d of librarianDirs(projects)) walk(d);
  for (const f of files) {
    const rl = readline.createInterface({ input: fs.createReadStream(f), crlfDelay: Infinity });
    for await (const line of rl) {
      if (!line.includes('"Read"')) continue;
      let o; try { o = JSON.parse(line); } catch { continue; }
      const t = Date.parse(o.timestamp);
      if (!(t >= since) || t > until) continue;
      const c = o.message && o.message.content;
      if (!Array.isArray(c)) continue;
      for (const b of c) {
        if (!b || b.type !== 'tool_use' || b.name !== 'Read' || !b.input || typeof b.input.file_path !== 'string') continue;
        const fp = b.input.file_path.split(BACKSLASH).join('/').toLowerCase();
        const i = fp.lastIndexOf('exo_memory/');
        if (i < 0) continue;
        const rel = fp.slice(i + 'exo_memory/'.length);
        reads.set(rel, (reads.get(rel) || 0) + 1);
      }
    }
  }
  return { files: files.length, reads };
}

const opened = (set, reads) => set.filter((r) => reads.get(r) > 0);
const total = (set, reads) => set.reduce((n, r) => n + (reads.get(r) || 0), 0);

/** Pure: the numbers and the three verdicts (verdicts null in replay mode). */
function score(L, reads, { replay = false } = {}) {
  const f1 = opened(L.new, reads), f2 = opened(L.old, reads), f3 = opened(L.hb, reads);
  const rate = L.old.length ? f2.length / L.old.length : null;
  const v = replay ? { f1: null, f2: null, f3: null } : {
    f1: f1.length === 0 ? 'FIRES (the build did not help reach)' : f1.length >= 3 ? 'helped (not refuted; never "reach restored")' : 'undecided (1-2 opens, not rounded up)',
    f2: rate === null ? 'no OLD entries' : rate < F2_BAR ? 'FIRES (shorter entries cost reach)' : 'no measured cost',
    f3: f3.length === 0 ? 'FIRES (the hand-back half did not help)' : 'reports ' + f3.length,
  };
  return {
    sizes: { new: L.new.length, old: L.old.length, handbacks: L.hb.length },
    f1: { opened: f1.length, of: L.new.length, reads: total(L.new, reads), entries: f1, verdict: v.f1 },
    f2: { opened: f2.length, of: L.old.length, reads: total(L.old, reads), rate, bar: F2_BAR, verdict: v.f2 },
    f3: { opened: f3.length, of: L.hb.length, reads: total(L.hb, reads), entries: f3, verdict: v.f3 },
  };
}

function report(s, meta) {
  const pc = (x) => (x === null ? 'n/a' : (x * 100).toFixed(2) + '%');
  const L = [];
  if (meta.replay) L.push('BASELINE REPLAY — NOT A RESULT. Counts over ' + meta.since + ' .. ' + meta.until + ', scored by nothing: no F1-F3 verdict is printed.');
  else L.push('F1-F3 over the window ' + meta.since + ' .. ' + meta.until + ' (W0 = ' + meta.since + ')');
  L.push('transcripts scanned: ' + meta.files + ' · NEW ' + s.sizes.new + ' · OLD ' + s.sizes.old + ' · newly listed hand-backs ' + s.sizes.handbacks);
  L.push('F1  NEW entries opened:  ' + s.f1.opened + ' of ' + s.f1.of + ' distinct (' + s.f1.reads + ' Reads)' + (s.f1.verdict ? ' -> ' + s.f1.verdict : ''));
  L.push('F2  OLD entries opened:  ' + s.f2.opened + ' of ' + s.f2.of + ' = ' + pc(s.f2.rate) + ' (bar ' + pc(s.f2.bar) + ', ' + s.f2.reads + ' Reads)' + (s.f2.verdict ? ' -> ' + s.f2.verdict : ''));
  L.push('F3  hand-backs opened:   ' + s.f3.opened + ' of ' + s.f3.of + ' distinct (' + s.f3.reads + ' Reads)' + (s.f3.verdict ? ' -> ' + s.f3.verdict : ''));
  if (s.f1.entries.length) L.push('    NEW opened: ' + s.f1.entries.slice(0, 20).join(', '));
  return L.join('\n');
}

function arg(argv, k) { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : undefined; }

async function main(argv) {
  const baseP = arg(argv, '--base'), afterP = arg(argv, '--after');
  if (!baseP || !afterP) { console.error('need --base <dump> and --after <dump>'); return 2; }
  let base, after;
  try { base = fs.readFileSync(baseP, 'utf8'); after = fs.readFileSync(afterP, 'utf8'); } catch (e) { console.error('cannot read a dump: ' + e.message); return 2; }
  const be = parseEntries(base), ae = parseEntries(after);
  if (!be.length || !ae.length) { console.error('no index entries parsed from ' + (be.length ? afterP : baseP)); return 2; }
  const replayDays = arg(argv, '--replay-days');
  const replay = replayDays !== undefined;
  let since;
  if (replay) since = Date.now() - Number(replayDays) * 864e5;
  else if (arg(argv, '--since')) since = Date.parse(arg(argv, '--since'));
  else if (arg(argv, '--since-file')) { try { since = fs.statSync(arg(argv, '--since-file')).mtimeMs; } catch (e) { console.error('cannot stat --since-file: ' + e.message); return 2; } }
  if (!(since > 0)) { console.error('need --since <iso>, --since-file <shelf> or --replay-days <n>'); return 2; }
  const until = replay ? Date.now() : (arg(argv, '--until') ? Date.parse(arg(argv, '--until')) : since + WINDOW_DAYS * 864e5);
  if (!(until > since)) { console.error('--until must be after --since'); return 2; }
  const projects = arg(argv, '--projects') || path.join(os.homedir(), '.claude', 'projects');
  const { files, reads } = await scanOpens(projects, since, until);
  const s = score(lists(be, ae), reads, { replay });
  const meta = { replay, since: new Date(since).toISOString(), until: new Date(until).toISOString(), files };
  console.log(argv.includes('--json') ? JSON.stringify({ meta, ...s }, null, 1) : report(s, meta));
  return 0;
}

if (require.main === module) main(process.argv.slice(2)).then((c) => process.exit(c), (e) => { console.error(e); process.exit(1); });
module.exports = { parseEntries, lists, librarianDirs, scanOpens, score, report, WINDOW_DAYS, F2_BAR };
