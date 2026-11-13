#!/usr/bin/env node
'use strict';
// landed-live.js — Lap I, I1 (exo_memory/loop/landed_live_2026-11-13/00_lap_i_spec.md:79-190, with its second reader's changes, :852-853):
// ONE read of what a seat on THIS machine runs, against the repo. It writes nothing.
//
// WHY. A landed hook change is not live until this machine's installed copy is the repo's, and a seat running it is registered to run it. Of 9
// recorded returns of drift, 7 came by a hook change that landed with no install step (prior_fixes.md:211-229). install.ps1 -Check says whether
// bytes match; it does not say whether anything RUNS the file, so a file nobody runs read as a problem and a stale file that runs read the same.
//
//   node consonance/tools/landed-live.js [--all]        every $files entry, one state each; exit 0 unless unreadable (2)
//   node consonance/tools/landed-live.js --range A..B   only the entries whose source changed in A..B (and their By and require neighbours);
//                                                       exit 1 on any failing state among them
//   --explain   adds `installed = <commit> (<n> behind)` to each non-LIVE entry      --summary   the last line only      --json   machine-readable
//
// STATES. Failing: OWED (it runs here and its bytes are not HEAD's, or a file it requires is not), NEW (declared to run, not installed, not held),
// HOLD EXPIRED, LOCAL EDIT (installed bytes match no object in the repo). Printed, never failing: LIVE, NOT RUN HERE, HELD, EXCLUDED, EXCLUDED BUT
// LIVE, RUNS FROM REPO, WIRED ELSEWHERE, LIB (no By).
//
// HOW. install.ps1's $files and $register tables are parsed TABLE BY TABLE (each `@{` to its closing `}`, after dropping `#` lines), never line by
// line: nine $register rows carry a key on their second line (the second reader, :856). "Runs here" is a settings.json command whose LAST quoted
// path is exactly <USERPROFILE>\.claude\shell\<To> (case-insensitive), never a leaf match; a Lib row runs here when a hook its `By` names does.
// Bytes are compared as git blobs after CRLF->LF (the repo pins eol=lf), against HEAD's blob from ONE `git ls-tree`. Clock seam: LANDED_NOW.
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const FAILING = new Set(['OWED', 'NEW', 'HOLD EXPIRED', 'LOCAL EDIT']);

function machineTag() {
  const env = (process.env.CONSONANCE_MACHINE || '').trim();
  if (env) return env;
  try {
    const cfg = JSON.parse(
      fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^\uFEFF/, '')
    );
    if (cfg.machine_tag) return String(cfg.machine_tag);
  } catch (_) { /* fall through */ }
  return os.hostname();
}
const now = () => { const e = process.env.LANDED_NOW; const t = e ? new Date(e) : new Date(); return Number.isNaN(t.getTime()) ? new Date() : t; };
const git = (repo, args, input) => { const r = spawnSync('git', ['-C', repo, ...args], { encoding: 'utf8', windowsHide: true, maxBuffer: 1 << 28, input }); return r.status === 0 ? r.stdout : null; };
const leaf = (p) => String(p).split(/[\\/]/).pop().toLowerCase();
const normPath = (p) => path.win32.normalize(String(p).replace(/\//g, '\\')).toLowerCase();

// ── install.ps1 ──
/** The lines of `$<name> = @(` up to its closing `)` at column 0, or null. */
function blockLines(text, name) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const start = lines.findIndex((l) => new RegExp(`^\\$${name}\\s*=\\s*@\\(`).test(l));
  if (start < 0) return null;
  const end = lines.findIndex((l, i) => i > start && /^\)\s*$/.test(l));
  return end < 0 ? null : lines.slice(start + 1, end);
}
function parseValue(v) {
  v = v.trim();
  if (/^\$true$/i.test(v)) return true;
  if (/^\$false$/i.test(v)) return false;
  if (v.startsWith('@(')) return [...v.matchAll(/'((?:[^']|'')*)'|"([^"]*)"/g)].map((m) => (m[1] !== undefined ? m[1].replace(/''/g, "'") : m[2]));
  if (v.startsWith("'")) return v.slice(1, -1).replace(/''/g, "'");
  if (v.startsWith('"')) return v.slice(1, -1);
  return /^\d+$/.test(v) ? Number(v) : v;
}
/** Each `@{ ... }` table in the block, parsed across lines; `#` lines dropped first. */
function tables(lines) {
  const body = lines.filter((l) => !/^\s*#/.test(l)).join('\n'), out = [];
  for (let i = body.indexOf('@{'); i >= 0; i = body.indexOf('@{', i)) {
    let j = i + 2, q = null, depth = 1;
    for (; j < body.length && depth; j++) {
      const c = body[j];
      if (q) { if (c === q) q = null; continue; }
      if (c === "'" || c === '"') q = c; else if (c === '{') depth++; else if (c === '}') depth--;
    }
    const inner = body.slice(i + 2, j - 1), row = {};
    for (const m of inner.matchAll(/(\w+)\s*=\s*('(?:[^']|'')*'|"[^"]*"|\$true|\$false|@\([^)]*\)|[^;\s}]+)/gi)) row[m[1]] = parseValue(m[2]);
    out.push(row);
    i = j;
  }
  return out;
}
function readManifest(repo) {
  const file = path.join(repo, 'dev', 'shell', 'install.ps1');
  let text; try { text = fs.readFileSync(file, 'utf8'); } catch (_) { return { error: `not readable (${file})` }; }
  const f = blockLines(text, 'files'), r = blockLines(text, 'register');
  const files = f ? tables(f).filter((x) => x.From && x.To) : [], register = r ? tables(r).filter((x) => x.Rel) : [];
  if (!files.length || !register.length) return { error: 'not readable (install.ps1 changed shape)' };
  return { files, register };
}

// ── settings.json: what runs on this machine ──
function commands(home) {
  const f = path.join(home, '.claude', 'settings.json');
  let s; try { s = JSON.parse(fs.readFileSync(f, 'utf8').replace(/^\uFEFF/, '')); } catch (_) { return null; }
  const out = [];
  for (const [event, groups] of Object.entries((s && s.hooks) || {})) for (const g of [].concat(groups || [])) for (const h of [].concat((g && g.hooks) || [])) {
    if (!h || !h.command) continue;
    const qs = [...String(h.command).matchAll(/"([^"]*)"/g)];
    out.push({ event, path: qs.length ? qs[qs.length - 1][1] : String(h.command).trim() });
  }
  return out;
}

// ── bytes ──
const blobOf = (buf) => { const b = Buffer.from(buf.toString('binary').replace(/\r\n/g, '\n'), 'binary'); return crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex'); };
function headBlobs(repo, ref = 'HEAD') {
  const out = git(repo, ['ls-tree', '-r', ref, '--', 'dev/shell', 'consonance/hooks']);
  if (out === null) return null;
  const m = new Map();
  for (const l of out.split('\n')) { const x = /^\d+ blob ([0-9a-f]+)\t(.+)$/.exec(l); if (x) m.set(x[2].toLowerCase(), x[1]); }
  return m;
}
const repoPath = (from) => String(from).replace(/\\/g, '/').toLowerCase();
/** Literal relative requires of a source, as the installed To paths they resolve to (lower case, backslashes). */
function requiresOf(text, to) {
  const dir = path.win32.dirname(String(to)), out = [];
  for (const m of String(text).matchAll(/require\(\s*(['"])(\.{1,2}\/[^'"]+)\1\s*\)/g)) {
    let p = path.win32.normalize(path.win32.join(dir === '.' ? '' : dir, m[2].replace(/\//g, '\\')));
    if (!/\.\w+$/.test(p)) p += '.js';
    out.push(p.toLowerCase());
  }
  return out;
}

/**
 * One state per $files entry. Returns { rows: [{ leaf, from, to, state, detail, neighbours }], machine, head, unreadable }.
 * opts: { repo, home, ref }.
 */
function classify(opts = {}) {
  const repo = opts.repo || process.env.LANDED_REPO || path.resolve(__dirname, '..', '..'), home = opts.home || os.homedir(), ref = opts.ref || 'HEAD';
  const man = readManifest(repo);
  if (man.error) return { unreadable: man.error };
  const cmds = commands(home);
  if (cmds === null) return { unreadable: 'UNKNOWN: settings.json is missing or not JSON; no guess is made' };
  const blobs = headBlobs(repo, ref);
  if (!blobs) return { unreadable: 'not readable (git ls-tree failed)' };
  const shell = path.join(home, '.claude', 'shell'), machine = machineTag(), t = now();
  let room = null;
  try { const c = JSON.parse(fs.readFileSync(path.join(home, '.consonance.json'), 'utf8').replace(/^\uFEFF/, '')); if (c.room_path) room = normPath(path.resolve(String(c.room_path), '..', '..')); } catch (_) { /* none */ }
  const installedAt = (to) => normPath(path.join(shell, String(to)));
  const runsAt = (to) => cmds.some((c) => normPath(c.path) === installedAt(to));
  const regOf = (to) => man.register.find((r) => leaf(r.Rel) === leaf(to));
  const byTo = new Map(man.files.map((f) => [normPath(f.To), f]));
  const info = new Map();   // To -> { present, same, known, text }
  for (const f of man.files) {
    const dst = path.join(shell, f.To);
    let buf = null; try { buf = fs.readFileSync(dst); } catch (_) { /* absent */ }
    const head = blobs.get(repoPath(f.From));
    const blob = buf ? blobOf(buf) : null;
    const known = blob ? git(repo, ['cat-file', '-e', blob]) !== null : false;
    let src = ''; try { src = fs.readFileSync(path.join(repo, f.From), 'utf8'); } catch (_) { /* absent from repo */ }
    info.set(normPath(f.To), { present: !!buf, same: !!buf && blob === head, known, blob, head, requires: requiresOf(src, f.To) });
  }
  const rows = [];
  for (const f of man.files) {
    const me = info.get(normPath(f.To)), reg = regOf(f.To), lf = leaf(f.To);
    const by = f.By ? String(f.By).split(',').map((x) => x.trim()).filter(Boolean) : [];
    const neighbours = [...new Set(me.requires)].filter((r) => byTo.has(r)).map((r) => byTo.get(r));   // a file required twice is one neighbour
    const row = { leaf: lf, from: f.From, to: f.To, state: null, detail: '', neighbours: neighbours.map((n) => leaf(n.To)),
      bytes: !me.present ? 'ABSENT' : me.same ? 'ok' : 'DRIFT' };   // install.ps1 -Check's own three words, for the agreement test
    const holdHere = f.Hold && typeof f.Hold === 'string' && (!f.HoldOn || [].concat(f.HoldOn).length === 0 || [].concat(f.HoldOn).includes(machine));
    const elsewhere = cmds.find((c) => leaf(c.path) === lf && normPath(c.path) !== installedAt(f.To));
    if (holdHere) {
      const until = f.HoldUntil ? new Date(`${f.HoldUntil}T23:59:59`) : null;
      if (until && t > until) { row.state = 'HOLD EXPIRED'; row.detail = `${f.Hold} (until ${f.HoldUntil})`; }
      else { row.state = 'HELD'; row.detail = `${f.Hold}${f.HoldUntil ? ` until ${f.HoldUntil}` : ''}`; }
    } else if (reg && reg.Excluded) {
      row.state = runsAt(reg.Rel) ? 'EXCLUDED BUT LIVE' : 'EXCLUDED'; row.detail = String(reg.Excluded);
    } else if (f.Lib && !by.length) {
      row.state = 'LIB (no By)';
    } else {
      const runHere = f.Lib ? by.some((b) => { const h = man.files.find((x) => leaf(x.To) === b.toLowerCase()); return h && runsAt(h.To); }) : runsAt(f.To);
      if (!runHere) {
        if (elsewhere && room && normPath(elsewhere.path).startsWith(room + '\\')) { row.state = 'RUNS FROM REPO'; row.detail = elsewhere.path; }
        else if (elsewhere) { row.state = 'WIRED ELSEWHERE'; row.detail = elsewhere.path; }
        else if (!me.present && reg && !f.Lib) row.state = 'NEW';
        else row.state = 'NOT RUN HERE';
      } else if (!me.present) row.state = 'OWED';
      else if (!me.same && !me.known) row.state = 'LOCAL EDIT';
      else if (!me.same) row.state = 'OWED';
      else {
        const stale = neighbours.filter((n) => { const x = info.get(normPath(n.To)); return !x.same; });
        if (stale.length) { row.state = 'OWED'; row.detail = `requires ${stale.map((n) => leaf(n.To)).join(', ')}, not HEAD's`; } else row.state = 'LIVE';
      }
    }
    rows.push(row);
  }
  // a Lib whose hook is OWED is owed with it (its install line names both); a Lib's own stale bytes make its hook OWED above
  for (const r of rows) if (r.state === 'OWED') {
    const neigh = new Set(r.neighbours);
    for (const f of man.files) if (f.Lib && f.By && String(f.By).split(',').map((x) => x.trim().toLowerCase()).includes(r.leaf)) neigh.add(leaf(f.To));
    r.install = `install.ps1 -NoRegister -Only ${[r.leaf, ...[...neigh].filter((x) => x !== r.leaf)].join(',')}`;
  }
  // settings commands that run a file from inside the repo and no $files row claims
  const claimed = new Set(man.files.map((f) => leaf(f.To)));
  for (const c of cmds) if (room && normPath(c.path).startsWith(room + '\\') && !claimed.has(leaf(c.path))) rows.push({ leaf: leaf(c.path), state: 'RUNS FROM REPO', detail: c.path, neighbours: [] });
  return { rows, machine, head: (git(repo, ['rev-parse', '--short=8', ref]) || '').trim(), repo };
}

/** The entries a range touches: $files rows whose From changed in A..B, plus their By and require neighbours. */
function scope(range, opts = {}) {
  const repo = opts.repo || process.env.LANDED_REPO || path.resolve(__dirname, '..', '..');
  const out = git(repo, ['diff', '--name-only', range]);
  if (out === null) return null;
  const changed = new Set(out.split('\n').filter(Boolean).map((x) => x.toLowerCase()));
  const man = readManifest(repo); if (man.error) return null;
  const hit = new Set(man.files.filter((f) => changed.has(repoPath(f.From))).map((f) => leaf(f.To)));
  for (const f of man.files) {
    const by = f.By ? String(f.By).split(',').map((x) => x.trim().toLowerCase()) : [];
    if (by.some((b) => hit.has(b))) hit.add(leaf(f.To));
    if (hit.has(leaf(f.To))) for (const b of by) hit.add(b);
  }
  return hit;
}

function summary(res) {
  const pick = (s) => res.rows.filter((r) => r.state === s).map((r) => r.leaf);
  const runHere = res.rows.filter((r) => ['LIVE', 'OWED', 'LOCAL EDIT', 'EXCLUDED BUT LIVE'].includes(r.state)).length;
  const tree = (git(res.repo, ['status', '--porcelain', '--', 'dev/shell', 'consonance/hooks']) || '').split('\n').filter(Boolean).length;
  const ahead = Number((git(res.repo, ['rev-list', '--count', 'HEAD..refs/remotes/origin/main']) || '0').trim()) || 0;
  return `LIVE-HERE ${res.machine} HEAD ${res.head}${tree ? ` tree +${tree}` : ''}${ahead ? ` origin/main +${ahead} as of last fetch` : ''}: `
    + `${pick('LIVE').length}/${runHere} live; owed ${pick('OWED').join(',') || 'none'}; new ${pick('NEW').join(',') || 'none'}; held ${pick('HELD').join(',') || 'none'}`;
}

function explain(res, row) {
  const f = row.from; if (!f) return '';
  const p = repoPath(f), dst = path.join(os.homedir(), '.claude', 'shell', row.to);
  let buf; try { buf = fs.readFileSync(dst); } catch (_) { return ' installed = absent'; }
  const b = blobOf(buf);
  const c = (git(res.repo, ['log', '--all', '--reverse', '--format=%h', `--find-object=${b}`, '--', p]) || '').split('\n').filter(Boolean)[0];
  if (!c) return ' installed = no commit';
  const n = (git(res.repo, ['rev-list', '--count', `${c}..HEAD`, '--', p]) || '').trim();
  return ` installed = ${c} (${n} behind)`;
}

function main(argv) {
  const json = argv.includes('--json'), only = argv.includes('--summary'), exp = argv.includes('--explain');
  const ri = argv.indexOf('--range'), range = ri >= 0 ? argv[ri + 1] : null;
  const res = classify({});
  if (res.unreadable) { console.log(res.unreadable); return 2; }
  let rows = res.rows;
  if (range) {
    const s = scope(range, {});
    if (s === null) { console.log(`not readable (git diff ${range})`); return 2; }
    rows = rows.filter((r) => s.has(r.leaf));
    if (!rows.length) { console.log(`nothing in range ${range}`); console.log(summary(res)); return 0; }
  }
  if (json) { console.log(JSON.stringify({ machine: res.machine, head: res.head, rows, summary: summary(res) })); }
  else if (!only) {
    for (const r of rows) console.log(`${r.state.padEnd(17)} ${r.leaf}${r.detail ? `   ${r.detail}` : ''}${r.install ? `   -> ${r.install}` : ''}${exp && r.state !== 'LIVE' ? explain(res, r) : ''}`);
  }
  console.log(summary(res));
  return range && rows.some((r) => FAILING.has(r.state)) ? 1 : 0;
}

module.exports = { classify, summary, scope, tables, blockLines, readManifest, commands, blobOf, requiresOf, machineTag, FAILING };

if (require.main === module) process.exit(main(process.argv.slice(2)));
