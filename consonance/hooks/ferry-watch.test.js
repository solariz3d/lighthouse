// ferry-watch.test.js — the ferry hook finds its repository and its ledger the way the app finds them. Run: node --test consonance/hooks/ferry-watch.test.js
//
// D273 lap 2 (pane B, 2026-10-08). This hook is copied into ~/.claude/shell by install.ps1, so it cannot find the repo from its own folder. With no
// FERRY_REPO it used a hardcoded C:\Consonance\lighthouse, which exists on neither machine of this room and became an unexpandable '%CONSONANCE_HOME%'
// in the consumer tree (handback/p-consumer-parity-B_2026-10-08.md §4). It had no test. Now: FERRY_REPO, else the repo ~/.consonance.json's room_path
// sits in (<repo>/exo_memory/BOOT.md, the same derivation as the pulse hooks); the ledger: FERRY_LEDGER, else <data dir>/ferry.jsonl, the data dir being
// CONSONANCE_DATA, else data_dir in ~/.consonance.json, else ~/.consonance (main.rs default_data). Neither resolved: silent, exit 0.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs'), os = require('os'), path = require('path');
const { spawnSync, execFileSync } = require('child_process');

const HOOK = path.join(__dirname, 'ferry-watch.js');

function world() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ferry-watch-'));
  const repo = path.join(tmp, 'repo'), home = path.join(tmp, 'home'), data = path.join(tmp, 'data'), chair = path.join(tmp, 'chair');
  for (const d of [repo, home, data, chair]) fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(chair, '.chair-token'), 'x');
  const g = (args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  g(['init', '-q', '.']); g(['config', 'user.email', 'ferry@test']); g(['config', 'user.name', 'ferry test']);
  fs.mkdirSync(path.join(repo, 'exo_memory', 'loop'), { recursive: true });
  fs.writeFileSync(path.join(repo, 'exo_memory', 'BOOT.md'), 'boot\n');
  fs.writeFileSync(path.join(repo, 'exo_memory', 'loop', 'a.md'), 'artifact\n');
  g(['add', '.']); g(['commit', '-q', '-m', 'a fresh artifact']);
  return { tmp, repo, home, data, chair, sha: g(['rev-parse', 'HEAD']), done: () => fs.rmSync(tmp, { recursive: true, force: true }) };
}
function hook(w, env) {
  const base = { ...process.env }; for (const k of ['FERRY_REPO', 'FERRY_LEDGER', 'CONSONANCE_DATA', 'CONSONANCE_DREAM']) delete base[k];
  const r = spawnSync(process.execPath, [HOOK], { cwd: w.chair, encoding: 'utf8', env: { ...base, USERPROFILE: w.home, HOME: w.home, ...env } });
  return { code: r.status, out: r.stdout || '', err: r.stderr || '' };
}

test('D273: with no FERRY_REPO the repository is the one room_path in ~/.consonance.json sits in, and a fresh unferried artifact is named', () => {
  const w = world();
  try {
    fs.writeFileSync(path.join(w.home, '.consonance.json'), JSON.stringify({ room_path: path.join(w.repo, 'exo_memory', 'BOOT.md'), data_dir: w.data }));
    const r = hook(w, {});
    assert.strictEqual(r.code, 0, r.err);
    assert.match(r.out, /\[ferry\] 1 claim-bearing artifact/, 'the hook did not reach the repository: ' + JSON.stringify(r.out));
    assert.ok(r.out.includes(w.sha.slice(0, 7)), r.out);
  } finally { w.done(); }
});

test('D273: the ledger is ferry.jsonl in the data dir from ~/.consonance.json, so a recorded ferry silences it', () => {
  const w = world();
  try {
    fs.writeFileSync(path.join(w.home, '.consonance.json'), JSON.stringify({ room_path: path.join(w.repo, 'exo_memory', 'BOOT.md'), data_dir: w.data }));
    assert.match(hook(w, {}).out, /\[ferry\] 1/, 'control: with nothing recorded it speaks (else the silences below prove nothing)');
    fs.writeFileSync(path.join(w.data, 'ferry.jsonl'), JSON.stringify({ sha: w.sha, pane: 'C' }) + '\n');
    assert.strictEqual(hook(w, {}).out, '', 'the ledger in data_dir was not read');
    fs.rmSync(path.join(w.data, 'ferry.jsonl'));
    fs.mkdirSync(path.join(w.home, '.consonance'));
    fs.writeFileSync(path.join(w.home, '.consonance.json'), JSON.stringify({ room_path: path.join(w.repo, 'exo_memory', 'BOOT.md') }));
    assert.match(hook(w, {}).out, /\[ferry\] 1/, 'control: no data_dir and nothing recorded, it speaks');
    fs.writeFileSync(path.join(w.home, '.consonance', 'ferry.jsonl'), JSON.stringify({ sha: w.sha, pane: 'C' }) + '\n');
    assert.strictEqual(hook(w, {}).out, '', 'with no data_dir the app default ~/.consonance was not read');
  } finally { w.done(); }
});

test('D273: with no FERRY_REPO and no room_path it is silent and exits 0 (a nag must never break a turn); FERRY_REPO still wins', () => {
  const w = world();
  try {
    const r = hook(w, {});
    assert.deepStrictEqual([r.code, r.out], [0, ''], r.err);
    assert.match(hook(w, { FERRY_REPO: w.repo, FERRY_LEDGER: path.join(w.data, 'none.jsonl') }).out, /\[ferry\] 1 claim-bearing/);
  } finally { w.done(); }
});
