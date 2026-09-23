#!/usr/bin/env node
'use strict';
// mutant-harness.js — pane A's mutant harness, tracked (D081, P-MUTANT-HARNESS-CHECK). Until this lap it lived only in
// a scratchpad, one copy per lap, each edited from the last.
//
//   node consonance/tools/mutant-harness.js <rows.js> [--only <n>] [--audit]
//
//   <rows.js>   a module exporting { label, repo, rel, rows, score: { cmd, args, cwd } }
//                 repo   the live checkout (absolute); it is READ, and hashed before and after, never written
//                 rel    the mutated file, relative to repo
//                 rows   [[name, anchor, replacement], ...] — the anchor must occur exactly once in the source
//                 score  the command that scores one mutant; cwd is relative to the worktree
//   --only <n>  run exactly one row (1-based, list order)
//   --audit     run the gates only: no worktree, no build
//
// Every mutant is written into a COPY: a detached git worktree of HEAD (under the OS temp dir) with the live file's
// working text copied in, built with its own CARGO_TARGET_DIR. The order is L061's: shape (R3) -> dirty source ->
// anchors (R2) -> mutate, and a survivor prints what it became (R1). A mutant that does not compile is NO RESULT,
// never killed.

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const count = (hay, needle) => hay.split(needle).length - 1;

// R3: every row is [name, anchor, replacement], all non-empty strings, and the replacement differs from the anchor.
function shapeErrors(rows) {
  return rows
    .map((r, i) => [i + 1, r])
    .filter(([, r]) => !Array.isArray(r) || r.length !== 3 || r.some((x) => typeof x !== 'string' || !x) || r[1] === r[2]);
}

// Does the source already carry this row's mutation — a previous run's leftover? Judged AT THE ANCHOR'S POSITION, not
// across the whole file (D081): the replacement standing somewhere else is legitimate text, and until this lap it
// refused a sound row five laps running (handback/p-address-refusal-pointer-A_2026-09-19.md §4).
//   anchor present: the anchor's own text is intact, so the replacement can stand at its position only if the
//                   replacement CONTAINS the anchor (an insertion before or after it). And any occurrence of such a
//                   replacement contains an occurrence of the anchor, so it necessarily stands on one: finding it
//                   anywhere IS finding it at the anchor's position. A replacement that does not contain the anchor
//                   cannot be there, wherever else in the file it appears.
//   anchor absent:  there is no position to compare at. The replacement anywhere is then reported as a possible
//                   leftover — the run is refused by the anchor gate either way, and this diagnosis says RESTORE,
//                   where "MISSING" would invite re-pointing the anchor onto the mutation.
// (A first version computed each anchor occurrence and each alignment explicitly; its three alignment mutants
// survived because they were equivalent to this. D081 hand-back §3.)
function carriesMutation(source, from, to) {
  if (!source.includes(from)) return source.includes(to);
  return to.includes(from) && source.includes(to);
}

// The three gates, in order. Each is a list; the caller refuses on the first non-empty one.
function audit(source, rows) {
  const malformed = shapeErrors(rows);
  if (malformed.length) return { malformed, dirty: [], orphan: [] };
  const dirty = rows.map((r, i) => [i + 1, r]).filter(([, [, from, to]]) => carriesMutation(source, from, to));
  const orphan = rows.map((r, i) => [i + 1, r, count(source, r[1])]).filter(([, , n]) => n !== 1);
  return { malformed, dirty, orphan };
}

function auditReport(a) {
  const lines = [];
  if (a.malformed.length) {
    lines.push('MALFORMED ROW(S) — each row is [name, anchor, replacement], non-empty, replacement != anchor');
    for (const [id, r] of a.malformed) lines.push(`  #${id} ${JSON.stringify(r)}`);
  } else if (a.dirty.length) {
    lines.push('THE SOURCE ALREADY CARRIES A MUTATION — restore it, do not re-point anchors');
    for (const [id, [name, , to]] of a.dirty) lines.push(`  #${id} ${name}\n      found: ${JSON.stringify(to)}`);
  } else if (a.orphan.length) {
    lines.push('ANCHOR AUDIT (R2) — every anchor must occur exactly once');
    for (const [id, [name, from], n] of a.orphan) lines.push(`  #${id} ${name}: ${n === 0 ? 'MISSING' : n + ' MATCHES'} — anchor: ${JSON.stringify(from)}`);
  }
  return lines.join('\n');
}

const refused = (a) => a.malformed.length + a.dirty.length + a.orphan.length > 0;

function cargoResult(out) {
  const m = /test result: (ok|FAILED)\. (\d+) passed; (\d+) failed/.exec(out);
  if (!m) return { state: 'NO RESULT' };
  const names = [...out.matchAll(/test ([\w:]+) \.\.\. FAILED/g)].map((x) => x[1]);
  return { state: m[1] === 'ok' ? 'green' : 'red', passed: +m[2], failed: +m[3], names };
}

function main(argv) {
  const args = argv.slice(2);
  const cfgPath = args.find((a) => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--only');
  if (!cfgPath) { console.error('usage: node mutant-harness.js <rows.js> [--only <n>] [--audit]'); return 2; }
  // ONE HEAVY RUNNER PER TREE (L098, heavy-run.js). --audit runs the gates only — no worktree, no build — and is not
  // a heavy run; everything else builds and scores mutants and waits its turn.
  if (!argv.includes('--audit')) require('./heavy-run.js').hold({ cmd: `mutant-harness ${path.basename(cfgPath)}` });
  const cfg = require(path.resolve(cfgPath));
  const only = args.includes('--only') ? Number(args[args.indexOf('--only') + 1]) : null;
  const live = path.join(cfg.repo, cfg.rel);
  const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
  const before = sha(live);
  const original = fs.readFileSync(live, 'utf8').replace(/\r\n/g, '\n');

  const a = audit(original, cfg.rows);
  if (refused(a)) { console.error(auditReport(a)); return 2; }
  if (only !== null && !(only >= 1 && only <= cfg.rows.length)) { console.error(`--only ${only}: no such row (1..${cfg.rows.length})`); return 2; }
  if (args.includes('--audit')) { console.log(`${cfg.label}: ${cfg.rows.length} rows pass the gates (shape, dirty source, anchors)`); return 0; }

  const run = (cmd, a2, opts) => spawnSync(cmd, a2, Object.assign({ encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 }, opts));
  const work = path.join(os.tmpdir(), `mutant-harness-${cfg.label}`);
  const wt = path.join(work, 'wt');
  const target = path.join(work, 'target');
  const add = run('git', ['-C', cfg.repo, 'worktree', 'add', '--detach', wt, 'HEAD']);
  if (add.status !== 0) { console.error(add.stderr); return 2; }
  const wtFile = path.join(wt, cfg.rel);
  const env = { ...process.env, CARGO_TARGET_DIR: target };
  const score = () => {
    const r = run(cfg.score.cmd, cfg.score.args, { cwd: path.join(wt, cfg.score.cwd || '.'), env, timeout: 3600000 });
    return Object.assign(cargoResult((r.stdout || '') + (r.stderr || '')), { out: (r.stdout || '') + (r.stderr || '') });
  };

  let killed = 0;
  const survivors = [];
  const noResult = [];
  let code = 0;
  try {
    fs.writeFileSync(wtFile, original);
    const pre = score();
    console.log(`pre-flight (unmutated copy): ${pre.state} ${pre.passed ?? ''}/${pre.failed ?? ''}`);
    if (pre.state !== 'green') { console.error(pre.out.slice(-3000)); return 2; }
    const picked = cfg.rows.map((r, i) => [i + 1, r]).filter(([id]) => only === null || id === only);
    let notApplied = 0;
    for (const [id, [name, from, to]] of picked) {
      if (count(original, from) !== 1) { notApplied++; console.log(`  NOT APPLIED #${id} ${name} — anchor: ${JSON.stringify(from)}`); continue; }
      fs.writeFileSync(wtFile, original.replace(from, () => to));
      const r = score();
      if (r.state === 'red') { killed++; console.log(`  killed    #${id} ${name}   (${r.names.join(', ')})`); }
      else if (r.state === 'green') {
        survivors.push(`#${id} ${name}\n      anchor: ${JSON.stringify(from)}\n      became: ${JSON.stringify(to)}`);
        console.log(`  SURVIVED  #${id} ${name}`);
      } else { noResult.push(id); console.log(`  NO RESULT #${id} ${name} — did not compile; NOT counted as killed\n${r.out.slice(-1200)}`); }
    }
    console.log(`\n${cfg.label} mutants: ${picked.length} listed · ${killed} killed · ${survivors.length} survived · ${noResult.length} no result · ${notApplied} not applied`);
    for (const s of survivors) console.log('  ' + s);
    code = survivors.length || noResult.length || notApplied ? 1 : 0;
  } finally {
    run('git', ['-C', cfg.repo, 'worktree', 'remove', '--force', wt]);
    const same = sha(live) === before;
    console.log(`live ${cfg.rel} unchanged: ${same}`);
    if (!same) code = 2;
  }
  return code;
}

module.exports = { shapeErrors, carriesMutation, audit, auditReport, refused };

if (require.main === module) process.exit(main(process.argv));
