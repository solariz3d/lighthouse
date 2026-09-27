'use strict';
// claimrec/asof.js — the base-rate verifiers' helpers (L119, B): a source AS OF a claim's time T.
// Plan: loop/plan_claim_recognition_2026-09-27.md "NEXT: THE BASE RATE (L119)". Read-only: nothing here writes.
//
//   node asof.js time  <timestamp>                  the exact instant, as epoch ms and UTC ISO
//   node asof.js file  <repo> <path> <timestamp>    the file as the repository held it at T
//   node asof.js board <timestamp> [--data <dir>]   board.jsonl rows with ts <= T (count + rows as JSON lines)
//   node asof.js ledger <timestamp> [--data <dir>]  lap.jsonl rows with at <= T
//
// THE TIME RULE. T is an exact instant in UTC:
//   - an ISO 8601 string MUST carry its zone: a trailing `Z` (the transcripts' form) or a numeric offset (`-06:00`, the
//     form git and the room's notes carry). A timestamp with NO zone is REFUSED, never guessed: "01:36" could be Regina
//     or UTC, six hours apart.
//   - a number, or an all-digit string of 13 digits, is epoch milliseconds (the board's `ts` and the ledger's `at`).
//   - git records commit times to the SECOND. So "at or before T" for git compares against T floored to the whole
//     second; the result carries both T and the second used.
//
// FILE AS OF T. "The file as of T" = the file in the repository's state at T: the newest commit on HEAD's
// FIRST-PARENT line whose committer date is at or before T, and the file at that commit (`git show <commit>:<path>`).
// Statuses: FOUND · NOT-YET-EXISTING (the path appears only in commits after T) · DELETED (it existed before T and was
// removed by T) · NOT-TRACKED (git has never held this path, under this name or a followed rename) · NO-COMMIT (the
// repository has no commit at or before T). With a rename, `renamedFrom` names the path it had at T (git --follow).
//
// LIMITS, stated rather than approximated:
//   - UNCOMMITTED STATE IS INVISIBLE. A file edited but not committed at T, or written at T and committed later, is
//     not what git shows for T. `nextChange` reports the first commit after T that touched the path, so a verifier can
//     see "this file changed N seconds after the claim" and mark the claim UNVERIFIABLE instead of WRONG.
//   - COMMITTER DATE, NOT ARRIVAL. A history rewritten or rebased keeps or resets dates; a commit made on another
//     machine carries that machine's clock. The first-parent line of HEAD is the history this checkout has, which may
//     differ from what another machine had at T.
//   - --follow tracks ONE path's renames, by git's similarity heuristic; a split or merge of files is not followed.
//   - The board and ledger are filtered by their own time field, not by line position: the board is a union of two
//     machines, so its lines are not in time order. A row's time is the writer's clock.
const fs = require('fs'), os = require('os'), path = require('path');
const { execFileSync } = require('child_process');
const { parseBoardLine } = require('../../../consonance/tools/chain-status.js');

// ── time ──────────────────────────────────────────────────────────────────────────────────
function parseTime(t) {
  if (typeof t === 'number' && Number.isFinite(t)) return t;
  const s = String(t == null ? '' : t).trim();
  if (/^\d{13}$/.test(s)) return Number(s);
  const m = s.match(/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d{1,9})?)?(Z|[+-]\d{2}:?\d{2})$/i);
  if (!m) {
    if (/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(s)) throw new Error(`time "${s}" has no zone: add Z (UTC) or an offset such as -06:00; a zoneless time is refused, not guessed`);
    throw new Error(`time "${s}" is not an ISO 8601 instant with a zone, nor 13-digit epoch milliseconds`);
  }
  const ms = Date.parse(s.replace(' ', 'T').replace(/([+-]\d{2})(\d{2})$/, '$1:$2'));
  if (!Number.isFinite(ms)) throw new Error(`time "${s}" does not parse`);
  return ms;
}
const iso = (ms) => new Date(ms).toISOString();

// ── git ───────────────────────────────────────────────────────────────────────────────────
function git(repo, args) {
  return execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
}
function gitOk(repo, args) { try { return git(repo, args); } catch (_) { return null; } }

function fileAsOf(repo, relPath, t) {
  const tMs = parseTime(t);
  const sec = Math.floor(tMs / 1000);
  const p = relPath.replace(/\\/g, '/');
  const gitDate = iso(sec * 1000).replace('.000Z', 'Z'); // git compares whole seconds; an explicit UTC instant, never a local date
  const base = { path: p, t: iso(tMs), gitSecond: gitDate };
  // the repository's state at T: newest first-parent commit on HEAD with committer date <= T (to the second)
  const commit = (git(repo, ['rev-list', '-1', '--first-parent', `--before=${gitDate}`, 'HEAD']) || '').trim();
  const nextChange = (() => {
    const out = (gitOk(repo, ['log', '--first-parent', '--reverse', `--after=${gitDate}`, '--format=%H %cI', 'HEAD', '--', p]) || '').trim().split('\n').filter(Boolean);
    // --after is inclusive of the boundary second; the commit AT T is not "after T"
    const firstAfter = out.map((l) => l.split(' ')).find(([, when]) => Math.floor(Date.parse(when) / 1000) > sec);
    return firstAfter ? { commit: firstAfter[0], time: iso(Date.parse(firstAfter[1])) } : null;
  })();
  if (!commit) return { ...base, status: 'NO-COMMIT', commit: null, content: null, nextChange };
  const commitTime = iso(Date.parse(git(repo, ['show', '-s', '--format=%cI', commit]).trim()));
  const at = { ...base, commit, commitTime, nextChange };
  const content = gitOk(repo, ['show', `${commit}:${p}`]);
  if (content !== null) return { ...at, status: 'FOUND', content, renamedFrom: null };
  // Not under this name at T. The renames git --follow reports for this path, each with its commit time:
  const renames = []; let when = null;
  for (const line of (gitOk(repo, ['log', '--follow', '--name-status', '--format=@@%H %cI', 'HEAD', '--', p]) || '').split('\n')) {
    const h = line.match(/^@@(\S+) (\S+)$/); if (h) { when = Math.floor(Date.parse(h[2]) / 1000); continue; }
    const r = line.match(/^R\d*\t([^\t]+)\t([^\t]+)$/); if (r && when !== null) renames.push({ from: r[1], to: r[2], sec: when });
  }
  // BACKWARD only: if the path got its name AFTER T, it had an older name at T — follow that chain back.
  let name = p;
  for (let moved = true; moved;) { moved = false; for (const r of renames) if (r.to === name && r.sec > sec) { name = r.from; moved = true; } }
  if (name !== p) {
    const c = gitOk(repo, ['show', `${commit}:${name}`]);
    if (c !== null) return { ...at, status: 'FOUND', content: c, renamedFrom: name };
  }
  // A path renamed AWAY by T is gone under this name: DELETED, with where it went (never its new content as FOUND).
  // `--follow` on a path absent at HEAD reports that rename as a plain delete, so the rename is looked up across the
  // whole history (-M, renames only, no pathspec: a pathspec of the old name alone hides the pairing).
  let away = renames.find((r) => r.from === p && r.sec <= sec);
  if (!away) {
    let w = null;
    for (const line of (gitOk(repo, ['log', '-M', '--diff-filter=R', '--name-status', '--format=@@%H %cI', 'HEAD']) || '').split('\n')) {
      const h = line.match(/^@@(\S+) (\S+)$/); if (h) { w = Math.floor(Date.parse(h[2]) / 1000); continue; }
      const r = line.match(/^R\d*\t([^\t]+)\t([^\t]+)$/);
      if (r && r[1] === p && w !== null && w <= sec) { away = { from: r[1], to: r[2], sec: w }; break; }
    }
  }
  const names = [...new Set([p, name])];
  const everAtOrBefore = (gitOk(repo, ['log', '-1', '--first-parent', `--before=${gitDate}`, '--format=%H', 'HEAD', '--', ...names]) || '').trim();
  if (away || everAtOrBefore) return { ...at, status: 'DELETED', content: null, lastSeenIn: everAtOrBefore || null, renamedTo: away ? away.to : null };
  const everAfter = (gitOk(repo, ['log', '-1', '--format=%H', 'HEAD', '--', ...names]) || '').trim();
  if (everAfter) return { ...at, status: 'NOT-YET-EXISTING', content: null };
  return { ...at, status: 'NOT-TRACKED', content: null };
}

// ── the data dir, resolved the way the tools resolve it (actors.js, chain-status.js) ───────────
function resolveDataDir(explicit) {
  if (explicit) return path.resolve(explicit);
  const env = (process.env.CONSONANCE_DATA || '').trim();
  if (env) return env;
  try {
    const raw = fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^\uFEFF/, '');
    const d = JSON.parse(raw).data_dir;
    if (d && String(d).trim()) return String(d).trim();
  } catch (_) { /* fall through to the refusal */ }
  throw new Error('no data dir: CONSONANCE_DATA is unset and ~/.consonance.json has no data_dir (or pass --data <dir>)');
}

// rows of a JSONL file with their time field <= T. Fused lines are split with the tools' own parseBoardLine; a line that
// cannot be decomposed is COUNTED as unreadable, never guessed at.
function jsonlAsOf(file, timeField, t) {
  const tMs = parseTime(t);
  if (!fs.existsSync(file)) throw new Error(`not found: ${file}`);
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const rows = []; let fused = 0, unreadable = 0, noTime = 0, after = 0, total = 0;
  for (const raw of lines) {
    if (!raw.trim()) continue;
    total++;
    const r = parseBoardLine(raw);
    if (!r) { unreadable++; continue; }
    if (r.fused) fused++;
    for (const o of r.rows) {
      const v = o && typeof o === 'object' ? o[timeField] : undefined;
      if (typeof v !== 'number' || !Number.isFinite(v)) { noTime++; continue; }
      if (v <= tMs) rows.push(o); else after++;
    }
  }
  rows.sort((a, b) => a[timeField] - b[timeField]);
  return { file, t: iso(tMs), timeField, rows, counts: { lines: total, fusedLinesRecovered: fused, unreadableLines: unreadable, rowsWithoutTime: noTime, rowsAfterT: after, rowsAtOrBeforeT: rows.length } };
}
const boardAsOf = (t, opts = {}) => jsonlAsOf(path.join(resolveDataDir(opts.dataDir), 'board.jsonl'), 'ts', t);
const ledgerAsOf = (t, opts = {}) => jsonlAsOf(path.join(resolveDataDir(opts.dataDir), 'lap.jsonl'), 'at', t);

module.exports = { parseTime, fileAsOf, resolveDataDir, jsonlAsOf, boardAsOf, ledgerAsOf };

if (require.main === module) {
  const [cmd, ...rest] = process.argv.slice(2);
  const di = rest.indexOf('--data'); const dataDir = di >= 0 ? rest.splice(di, 2)[1] : undefined;
  try {
    if (cmd === 'time') { const ms = parseTime(rest[0]); console.log(JSON.stringify({ ms, utc: iso(ms) })); }
    else if (cmd === 'file') { const r = fileAsOf(rest[0], rest[1], rest[2]); const { content, ...meta } = r; console.log(JSON.stringify(meta)); if (content !== null) process.stdout.write(content); }
    else if (cmd === 'board' || cmd === 'ledger') { const r = (cmd === 'board' ? boardAsOf : ledgerAsOf)(rest[0], { dataDir }); console.log(JSON.stringify({ file: r.file, t: r.t, counts: r.counts })); for (const row of r.rows) console.log(JSON.stringify(row)); }
    else { console.error('usage: node asof.js time|file|board|ledger … (see the header)'); process.exit(2); }
  } catch (e) { console.error(`asof: ${e.message}`); process.exit(1); }
}
