#!/usr/bin/env node
'use strict';
/* trip-check.js — ONE ROW PER TRIP (launch · union · close), so "a clean week" is a count and not a feeling.
 * D112, pane C. The criterion it serves is #2 of `exo_memory/loop/solid_registration_2026-09-22.md` §2, which names the
 * six fields a row must carry; this file is the instrument that registration said was OWED.
 *
 * ── WHERE EVERY FIELD COMES FROM ────────────────────────────────────────────────────────────────
 * A row is built from the TOOLS' OWN OUTPUTS. Nothing here is retold from memory, and where a number cannot be had from
 * a tool the row SAYS SO rather than quietly re-deriving one that could disagree:
 *
 *   install  <data>/sync-completion.json      state-sync.js's own receipt: installed, installed_files, head, and its
 *                                             `refused` list with each path's local_only / incoming_only counts.
 *   union    <data>/<file>.pre-union-<stamp>  ledger-union.js WRITES NO RECEIPT (D112 finding). It leaves the backup
 *                                             beside the live file and prints its JSON to stdout, which nothing keeps.
 *                                             So a union row is DERIVED from backup vs live and is stamped
 *                                             `counts_from_tool: false`. Fixing that is one appendFileSync in
 *                                             ledger-union's writeUnion — NOT this lap's file.
 *   close    the state repo's own commits     `git log` in the state dir: sha, machine and time from the commit the
 *                                             publish made, plus `git cat-file -e` to say the head RESOLVES.
 *
 * ── WHAT MAKES A TRIP NOT CLEAN ─────────────────────────────────────────────────────────────────
 *   1. a file overwritten        an install that reports files installed WHILE it reports refusals contradicts
 *                                stop-before-write, which writes nothing when anything is refused.
 *   2. a refused file never      a refusal is a deferred repair. If no union of that path happened AFTER the refusal,
 *      unioned                   the rows the other machine holds are still not here.
 *   3. a count that does not     a union that ends with fewer rows than it began with, or that lost any row the backup
 *      match                     held. Row identity is ledger-union's own: every field, key order aside.
 *   4. a head that does not      a published head the state repo cannot resolve is a publish nobody can install.
 *      resolve
 *
 * Read-only over the data dir. It writes a row FILE only where told (`--out`), never into the data dir: no rule in
 * `consonance/state-manifest.json` covers a trip ledger, and this lap does not add one (D112 packet). See §STORAGE below.
 *
 *   node consonance/tools/trip-check.js                      # scan this machine, print the table
 *   node consonance/tools/trip-check.js --json               # the rows, one JSON object per line
 *   node consonance/tools/trip-check.js --out <file>         # ALSO append the rows there (outside the data dir)
 *
 * Exit 0 when every trip is clean, 1 when any is not, 2 on a refusal.
 *
 * ── STORAGE, UNPLACED ON PURPOSE ────────────────────────────────────────────────────────────────
 * Rows belong beside the other ledgers at `<data>/trip.jsonl`, as an append-only TRAVELS file installing
 * fast-forward-or-refuse, exactly like the eleven. That needs a manifest rule plus a `*.pre-union-*` STAYS rule, and
 * adding one was not granted this lap, so the tool defaults to printing and leaves the file unplaced.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

/** ledger-union's key: two rows are the same row only if every field is equal, key order aside. */
function canon(v) {
  if (Array.isArray(v)) return '[' + v.map(canon).join(',') + ']';
  if (v && typeof v === 'object') return '{' + Object.keys(v).sort().map((k) => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}';
  return JSON.stringify(v);
}
const keyOf = (line) => { try { return canon(JSON.parse(line)); } catch (_) { return 'RAW:' + line; } };
const linesOf = (p) => { try { return fs.readFileSync(p, 'utf8').split('\n').filter((l) => l.length); } catch (_) { return []; } };

/** `lap.jsonl.pre-union-2026-09-22T15-39-49-131Z` → the ISO instant the union froze the original. */
function stampToIso(name) {
  const m = /\.pre-union-(\d{4}-\d{2}-\d{2})T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z$/.exec(name);
  return m ? `${m[1]}T${m[2]}:${m[3]}:${m[4]}.${m[5]}Z` : null;
}

/** Every `*.pre-union-*` backup under the data dir, one level of subdirectory included (resonance/atoms.jsonl). */
function backups(dataDir) {
  const out = [];
  const look = (dir, prefix) => {
    let entries = [];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (_) { return; }
    for (const e of entries) {
      const rel = prefix ? prefix + '/' + e.name : e.name;
      if (e.isDirectory()) { if (!prefix && e.name !== 'attic') look(path.join(dir, e.name), rel); continue; }
      const at = stampToIso(e.name);
      if (at) out.push({ backup: rel, file: rel.replace(/\.pre-union-.*$/, ''), at, full: path.join(dir, e.name) });
    }
  };
  look(dataDir, '');
  return out.sort((a, b) => a.at.localeCompare(b.at));
}

const gitLive = (stateDir) => ({
  log: () => {
    let out = '';
    try {
      out = execFileSync('git', ['-C', stateDir, 'log', '--format=%h%x09%cI%x09%s', '-n', '200'], { encoding: 'utf8', maxBuffer: 1 << 24 });
    } catch (_) { return []; }
    return out.split('\n').filter(Boolean).map((l) => {
      const [sha, cIso, ...rest] = l.split('\t');
      const subject = rest.join('\t');
      const m = /^state:\s+(\S+)\s+(\S+)/.exec(subject);
      return m ? { sha, machine: m[1], at: m[2], subject } : null;
    }).filter(Boolean);
  },
  resolves: (sha) => {
    try { execFileSync('git', ['-C', stateDir, 'cat-file', '-e', `${sha}^{commit}`], { stdio: 'ignore' }); return true; } catch (_) { return false; }
  },
});

function installRow(dataDir) {
  const p = path.join(dataDir, 'sync-completion.json');
  let c;
  try { c = JSON.parse(fs.readFileSync(p, 'utf8')); } catch (_) { return null; }
  const refused = (c.refused || []).map((r) => ({ path: r.path, kind: r.kind, local_only: r.local_only, incoming_only: r.incoming_only }));
  return {
    kind: 'install', at: c.at, machine: c.machine, source: 'sync-completion.json', counts_from_tool: true,
    installed: c.installed, installed_files: c.installed_files, head: c.head, verified: c.verified, stage: c.stage,
    refused, refusals_unresolved: [], replaced: c.installed ? c.installed_files : 0, clean: true, not_clean: [],
  };
}

function unionRows(dataDir) {
  return backups(dataDir).map((b) => {
    const before = linesOf(b.full).map(keyOf);
    const after = linesOf(path.join(dataDir, b.file.split('/').join(path.sep))).map(keyOf);
    const beforeSet = new Set(before), afterSet = new Set(after);
    let lost = 0;
    for (const k of beforeSet) if (!afterSet.has(k)) lost++;
    return {
      kind: 'union', at: b.at, machine: null, file: b.file, source: b.backup, counts_from_tool: false,
      rows_before: beforeSet.size, rows_after: afterSet.size, rows_added_since_backup: afterSet.size - beforeSet.size,
      rows_lost: lost,
      // LINES as well as distinct rows, and they are not the same guard. On DISTINCT rows "fewer after than before" is
      // unreachable — a smaller set means some earlier row is missing, which `rows_lost` already catches (found by a
      // surviving mutant, D112). Lines can shrink while the row SET holds: the live file is carried verbatim, repeats
      // included, so a file rewritten rather than unioned loses lines without losing rows. That is the overwrite case.
      lines_before: before.length, lines_after: after.length,
      backup: b.backup, clean: true, not_clean: [],
    };
  });
}

function closeRows(git) {
  return git.log().map((c) => ({
    kind: 'close', at: c.at, machine: c.machine, source: 'state repo commit', counts_from_tool: true,
    head: c.sha, head_resolves: git.resolves(c.sha), clean: true, not_clean: [],
  }));
}

function judge(rows) {
  const unions = rows.filter((r) => r.kind === 'union');
  for (const r of rows) {
    const why = [];
    if (r.kind === 'install') {
      if (r.installed && r.refused.length) {
        why.push(`the install reports ${r.installed_files} file(s) installed WHILE refusing ${r.refused.length} — under stop-before-write a refusal writes nothing, so one of the two is wrong`);
      }
      r.refusals_unresolved = r.refused
        .filter((x) => !unions.some((u) => u.file === x.path && u.at > r.at))
        .map((x) => x.path);
      for (const p of r.refusals_unresolved) why.push(`refused ${p} and no union of it followed — the rows the other machine holds are still not here`);
    }
    if (r.kind === 'union') {
      if (r.rows_lost > 0) why.push(`${r.file}: ${r.rows_lost} row(s) the backup held are LOST from the live file`);
      if (r.lines_after < r.lines_before) why.push(`${r.file}: ended with ${r.lines_after} lines, fewer than the ${r.lines_before} it began with — a union only ever adds, so the file was REPLACED`);
    }
    if (r.kind === 'close' && !r.head_resolves) why.push(`published head ${r.head} does not resolve in the state repo`);
    r.not_clean = why;
    r.clean = why.length === 0;
  }
  return rows;
}

/** Every trip this machine can still account for, oldest first. Read-only. */
function scan({ dataDir, stateDir, git = null }) {
  const g = git || gitLive(stateDir);
  const rows = [];
  const i = installRow(dataDir);
  if (i) rows.push(i);
  rows.push(...unionRows(dataDir), ...closeRows(g));
  rows.sort((a, b) => String(a.at).localeCompare(String(b.at)));
  return judge(rows);
}

/** A clean week is a COUNT: days covered by trips, all clean. One not-clean trip restarts it at zero. */
function cleanWeek(rows, now = new Date()) {
  const end = now.getTime(), start = end - 7 * 24 * 3600 * 1000;
  const inWeek = rows.filter((r) => { const t = Date.parse(r.at); return Number.isFinite(t) && t >= start && t <= end; });
  const bad = inWeek.filter((r) => !r.clean);
  const days = new Set(inWeek.filter((r) => r.clean).map((r) => String(r.at).slice(0, 10)));
  const lastBad = bad.length ? Math.max(...bad.map((r) => Date.parse(r.at))) : null;
  return {
    trips: inWeek.length, clean_trips: inWeek.length - bad.length, not_clean_trips: bad.length,
    clean_days: days.size, clean: bad.length === 0 && days.size >= 7,
    days_since_not_clean: lastBad === null ? null : Math.floor((end - lastBad) / (24 * 3600 * 1000)),
  };
}

function dataDir() {
  if (process.env.CONSONANCE_DATA) return process.env.CONSONANCE_DATA;
  const cfg = path.join(require('os').homedir(), '.consonance.json');
  try { const d = JSON.parse(fs.readFileSync(cfg, 'utf8')).data_dir; if (d) return d; } catch (_) {}
  throw new Error('no data dir: CONSONANCE_DATA is unset and ~/.consonance.json has no data_dir');
}
function stateDirOf() {
  if (process.env.CONSONANCE_STATE) return process.env.CONSONANCE_STATE;
  const cfg = path.join(require('os').homedir(), '.consonance.json');
  try { const d = JSON.parse(fs.readFileSync(cfg, 'utf8')).state_dir; if (d) return d; } catch (_) {}
  throw new Error('no state dir: CONSONANCE_STATE is unset and ~/.consonance.json has no state_dir');
}

/** True when `out` would land inside the data dir. No manifest rule covers a trip ledger, so the tool refuses that. */
function outIsInsideData(dataDir, out) {
  const rel = path.relative(path.resolve(dataDir), path.resolve(out));
  return !rel.startsWith('..') && !path.isAbsolute(rel);
}

function main(argv) {
  let data, state;
  try { data = argv.includes('--data') ? argv[argv.indexOf('--data') + 1] : dataDir(); state = argv.includes('--state') ? argv[argv.indexOf('--state') + 1] : stateDirOf(); } catch (e) { console.error(`trip-check: REFUSED — ${e.message}`); return 2; }
  const rows = scan({ dataDir: data, stateDir: state });
  const out = argv.includes('--out') ? argv[argv.indexOf('--out') + 1] : null;
  if (out) {
    if (outIsInsideData(data, out)) { console.error(`trip-check: refusing --out inside the data dir (${out}) — no manifest rule covers a trip ledger yet`); return 2; }
    fs.appendFileSync(out, rows.map((r) => JSON.stringify(r)).join('\n') + (rows.length ? '\n' : ''));
  }
  if (argv.includes('--json')) { for (const r of rows) console.log(JSON.stringify(r)); }
  else {
    for (const r of rows) {
      const what = r.kind === 'union' ? `${r.file} ${r.rows_before}→${r.rows_after} (+${r.rows_added_since_backup} since backup, lost ${r.rows_lost})`
        : r.kind === 'install' ? `installed ${r.installed} · files ${r.installed_files} · head ${r.head} · refused ${r.refused.length}`
          : `head ${r.head} resolves ${r.head_resolves}`;
      console.log(`${r.clean ? 'clean    ' : 'NOT CLEAN'} ${String(r.at).padEnd(26)} ${r.kind.padEnd(8)} ${what}`);
      for (const w of r.not_clean) console.log(`          └─ ${w}`);
    }
    const cw = cleanWeek(rows);
    console.log(`\nlast 7 days: ${cw.trips} trip(s) · ${cw.clean_trips} clean · ${cw.not_clean_trips} NOT clean · ${cw.clean_days} clean day(s) · clean week: ${cw.clean}`);
    console.log('union counts are DERIVED from the backups: ledger-union leaves no receipt (D112). Every other field is a tool\'s own output.');
  }
  return rows.every((r) => r.clean) ? 0 : 1;
}

module.exports = { scan, judge, cleanWeek, canon, stampToIso, backups, installRow, unionRows, closeRows, outIsInsideData };

if (require.main === module) process.exitCode = main(process.argv.slice(2));
