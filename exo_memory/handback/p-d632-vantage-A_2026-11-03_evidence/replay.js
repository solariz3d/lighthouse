// replay.js — D632: put P's 37 SURFACE rows (rows37.jsonl, v01..v37 in run order) back through the vantage reader.
//   node replay.js route                 the new code's routing only: skip or repo, no reader (deterministic)
//   node replay.js run <arm> <from> <to> real readers for rows from..to (1-based); arm = new | old; appends out-<arm>.jsonl
// The new arm loads the tool from the d632-a worktree; the old arm loads 82da03fc's copy (old/second-vantage.js).
// Both measure the same lighthouse tree (the worktree) and, for the new arm, the read-only t180 clone. Each reader gets
// its own empty cell, hooks off, no MCP, no saved session, windowsHide; this process lowers itself to BelowNormal first,
// and every reader inherits that.
'use strict';
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const WT = 'C:/Users/nname/Desktop/worktrees/a-d632-wt';
const T180 = path.join(__dirname, 't180-clone');
const ROWS = fs.readFileSync(path.join(__dirname, 'rows37.jsonl'), 'utf8').split(/\n/).filter(Boolean).map(JSON.parse);
const id = (i) => 'v' + String(i + 1).padStart(2, '0');

function load(arm) {
  return arm === 'old' ? require(path.join(__dirname, 'old', 'second-vantage.js'))
                       : require(path.join(WT, 'consonance', 'tools', 'second-vantage.js'));
}
// The rows' heads name the lighthouse checkout by its path on the day; the replay measures the worktree, so that key is
// renamed to it (the head value is unchanged). Without this, a two-head row maps to no head and is UNLAUNCHABLE.
function prep(sv, row) {
  const heads = {};
  for (const [k, v] of Object.entries(row.heads || {})) heads[/\/lighthouse$/i.test(k) ? WT : k] = v;
  const r = { ...row, heads };
  const m = sv.fromV2(r);
  if (!m.head) for (const [k, v] of Object.entries(heads)) if (k === WT) m.head = v;
  return m;
}
const tierOf = (i) => JSON.parse(fs.readFileSync(path.join(__dirname, 'surface37.jsonl'), 'utf8').split(/\n/)[i]).tier;

let n = 0;
function spawner(briefText, repoRoot) {
  const cell = path.join(__dirname, 'cells', `${process.pid}-${++n}`);
  fs.mkdirSync(cell, { recursive: true });
  const env = { ...process.env };
  for (const k of Object.keys(env)) if (/^CLAUDE/i.test(k)) delete env[k];
  const sv = load('new');
  const t0 = Date.now();
  const r = cp.spawnSync('C:/Users/nname/.local/bin/claude.exe', sv.readerArgs(briefText),
    { cwd: cell, env, encoding: 'utf8', timeout: 240000, windowsHide: true });
  fs.appendFileSync(path.join(__dirname, 'readers.log'), JSON.stringify({ at: new Date().toISOString(), pid: process.pid, n,
    repoRoot, secs: Math.round((Date.now() - t0) / 1000), status: r.status, err: r.error ? r.error.message : '' }) + '\n');
  if (r.error || r.status !== 0) return { failed: true, raw: `${r.error ? r.error.message : ''}\n${r.stderr || ''}`.trim() };
  return { failed: false, raw: r.stdout || '' };
}

const [mode, arm, from, to] = process.argv.slice(2);
if (mode === 'route') {
  const sv = load('new');
  for (let i = 0; i < ROWS.length; i++) {
    const row = prep(sv, ROWS[i]);
    const tier = tierOf(i);
    const sentences = row.sentences && row.sentences.length ? row.sentences : [sv.claimOf(row, tier)];
    const live = sentences.map(sv.liveState);
    const skip = live.every(Boolean);
    const rr = skip ? null : sv.resolveRepo(row, tier, WT, [T180]);
    console.log(JSON.stringify({ v: id(i), tier, live: `${live.filter(Boolean).length}/${live.length}`, skip,
      repo: rr ? (rr.root === WT ? 'lighthouse' : rr.root === T180 ? 't180' : rr.root) : null, by: rr && rr.by,
      head: rr ? (rr.head || '').slice(0, 8) : null }));
  }
} else if (mode === 'run') {
  cp.spawnSync('powershell', ['-NoProfile', '-Command', `(Get-Process -Id ${process.pid}).PriorityClass='BelowNormal'`], { windowsHide: true });
  const sv = load(arm);
  const out = path.join(__dirname, `out-${arm}.jsonl`);
  for (let i = Number(from) - 1; i < Number(to); i++) {
    const row = prep(sv, ROWS[i]);
    const f = arm === 'old' ? sv.processRow(row, tierOf(i), WT, spawner)
                            : sv.processRow(row, tierOf(i), WT, spawner, [T180]);
    fs.appendFileSync(out, JSON.stringify({ v: id(i), arm, status: f.status, verdict: f.verdict, repo: f.repo || null,
      world: f.world, evidence: f.evidence, commands: f.commands }) + '\n');
    console.log(id(i), arm, f.status);
  }
}
