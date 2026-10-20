#!/usr/bin/env node
'use strict';
// run.js — D411 launcher (pane P, 2026-10-19). The master is
// exo_memory/loop/plan_d411_ponytail_proof_2026-10-19.md; this script only does what it says.
//
//   node run.js prep                 write the 10 builder prompts, show the 5 prompt diffs, make the worktrees
//   node run.js builders             run the 10 builder sessions, 2 at a time (both arms of a lap together)
//   node run.js measure [L1..L5]     the launcher's table rows: diff, rows, test files whole, harnesses (under the lock)
//   node run.js reviews [L1..L5]     coin per lap -> key.json (append only, never read here), blind X/Y review sessions
//   node run.js table                print the table from out/
//
// Arms: R = brief + ponytail.md under "## Working rule"; N = the same brief without it (renamed from F/P, 07:19).
// The launcher never reads key.json. It never reads the other arm's worktree for anything but the diff.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawn, spawnSync } = require('child_process');

const E = __dirname;
const LH = 'C:/Users/nname/Desktop/lighthouse';
const T180 = 'C:/Users/nname/Desktop/t180-track-builder';
const WT_ROOT = 'C:/Users/nname/Desktop/worktrees';
const CLAUDE = 'C:/Users/nname/.local/bin/claude.exe';
const MODEL = 'claude-opus-5-5';
const PLAN = path.join(LH, 'exo_memory/loop/plan_d411_ponytail_proof_2026-10-19.md');
const PONYTAIL = path.join(E, 'prompts/ponytail-37369e08.md');   // git show 37369e08:consonance/src-tauri/brief/ponytail.md
const LOCK_DIR = 'C:/Consonance/data';
const BUILDER_TIMEOUT_MS = 120 * 60 * 1000;   // of ACTIVE time: minutes in which no other seat holds the heavy-run lock (see session)
const ABS_CAP_MS = 6 * 60 * 60 * 1000;        // absolute ceiling per session, lock or no lock
const LOCK_POLL_MS = 30 * 1000;
const REVIEW_TIMEOUT_MS = 60 * 60 * 1000;

// Bases: the packet's, except L2. The packet's ce65aa0 / e4b38ee were rebuilt by B's 0.4.8 landing with
// `git commit-tree` on IDENTICAL trees (p-0.4.8-landing-B_2026-10-19.md §1: ce65aa0 -> 16b7170, e4b38ee -> 5aa0c57);
// the old names no longer resolve in the t180 repo (`git cat-file -t ce65aa0` -> fatal). Same tree, new name.
const LAPS = [
  { id: 'L1', repo: 't180', base: 'd582c9e', packetBase: 'd582c9e' },
  { id: 'L2', repo: 't180', base: '16b7170', packetBase: 'ce65aa0' },
  { id: 'L3', repo: 't180', base: '6e2050d', packetBase: '6e2050d' },
  { id: 'L4', repo: 't180', base: 'cbd7a40', packetBase: 'cbd7a40' },
  { id: 'L5', repo: 'lh', base: '13b7d3b4', packetBase: '13b7d3b4' },
];
const ARMS = ['R', 'N'];

function out(name) { return path.join(E, 'out', name); }
function wt(lap, arm) { return path.join(WT_ROOT, `p-d411-${lap}-${arm}`); }
function sh(cmd, opts = {}) {
  const r = spawnSync(cmd, { shell: true, encoding: 'utf8', windowsHide: true, maxBuffer: 64 * 1024 * 1024, ...opts });
  return { code: r.status, stdout: r.stdout || '', stderr: r.stderr || '' };
}
function must(cmd, opts) { const r = sh(cmd, opts); if (r.code !== 0) throw new Error(`${cmd}\n${r.stderr}${r.stdout}`); return r.stdout; }
function log(s) { process.stdout.write(s + '\n'); }

// ---- the task texts, verbatim from the packet (parsed, not retyped) ----
function tasks() {
  const plan = fs.readFileSync(PLAN, 'utf8');
  const t = {};
  const re = /\*\*(L[1-5])\. [^\n]*\((t180|lighthouse), base `([0-9a-f]+)`\)\n- \*\*Task:\*\* "([\s\S]*?)"\n- \*\*Hidden check/g;
  let m;
  while ((m = re.exec(plan))) t[m[1]] = { repo: m[2], packetBase: m[3], text: m[4] };
  for (const l of LAPS) {
    if (!t[l.id]) throw new Error(`task text for ${l.id} not found in the packet`);
    if (t[l.id].packetBase !== l.packetBase) throw new Error(`${l.id}: packet base ${t[l.id].packetBase} != expected ${l.packetBase}`);
  }
  return t;
}

// ---- the common brief (the same for every lap; the arms differ only in the appended section) ----
function brief(lap, text) {
  const hr = path.join(E, 'hr.js').replace(/\\/g, '/');
  return [
    '# Task',
    '',
    text,
    '',
    '# How to work',
    '',
    '- This directory is a git checkout of the whole project at its base commit. Work only here.',
    '- Test first: a red row that fails on the base, then the fix, then the row green.',
    '- Run the test files you touch, whole.',
    `- Every test command goes through the lock wrapper, which waits for other heavy runs on this machine and then runs your command as given: \`node "${hr}" -- <your command>\` (for example \`node "${hr}" -- node --test app/test/settings.test.js\`).`,
    '- If anything you run would open a browser or an Electron window, pass --headless and --mute-audio; never open an installed app.',
    '- Commit by named paths on this worktree\'s branch (`git commit -- <paths>`); do not push.',
    '- Write a short hand-back to `HANDBACK.md` in this directory (do not commit it): what changed, tests run with counts, Not done / Limits.',
    '- One session, one shot: when the hand-back is written, stop.',
    '',
  ].join('\n');
}

function prep() {
  const t = tasks();
  const pony = fs.readFileSync(PONYTAIL, 'utf8');
  fs.mkdirSync(path.join(E, 'prompts'), { recursive: true });
  fs.mkdirSync(path.join(E, 'out'), { recursive: true });
  let diffs = '';
  for (const l of LAPS) {
    const n = brief(l.id, t[l.id].text);
    const r = n + '## Working rule\n\n' + pony;
    const pn = path.join(E, 'prompts', `prompt-${l.id}-N.txt`);
    const pr = path.join(E, 'prompts', `prompt-${l.id}-R.txt`);
    fs.writeFileSync(pn, n);
    fs.writeFileSync(pr, r);
    const d = sh(`diff "${pn}" "${pr}"`);
    diffs += `$ diff prompt-${l.id}-N.txt prompt-${l.id}-R.txt\n${d.stdout}\n`;
  }
  fs.writeFileSync(out('prompt-diffs.txt'), diffs);
  log(diffs);
  // worktrees / extracts
  for (const l of LAPS) for (const arm of ARMS) makeTree(l, arm);
}

function makeTree(l, arm) {
  const dir = wt(l.id, arm);
  if (fs.existsSync(dir)) { log(`exists: ${dir}`); return dir; }
  if (l.repo === 't180') {
    must(`git -C "${T180}" worktree add -b d411-${l.id}-${arm} "${dir}" ${l.base}`);
    log(`worktree ${dir} at ${must(`git -C "${dir}" rev-parse --short HEAD`).trim()}`);
    mute(dir);
  } else {
    // L5 leak guard: an extract of `consonance` only, its own git init, one base commit. No exo_memory.
    fs.mkdirSync(dir, { recursive: true });
    const tar = path.join(E, 'out', `consonance-${l.base}.tar`);
    if (!fs.existsSync(tar)) must(`git -C "${LH}" archive ${l.base} consonance -o "${tar}"`);
    const fwd = (p) => p.replace(/\\/g, '/');   // GNU tar reads `C:` as a host; --force-local plus forward slashes
    must(`tar --force-local -xf "${fwd(tar)}" -C "${fwd(dir)}"`);
    must(`git -C "${dir}" init -q -b main`);
    must(`git -C "${dir}" -c user.name=d411 -c user.email=d411@local add -A`);
    must(`git -C "${dir}" -c user.name=d411 -c user.email=d411@local commit -q -m "base: consonance at lighthouse ${l.base}"`);
    const leak = sh(`grep -rl "300000\\|D390" "${dir}" --exclude-dir=.git`);
    fs.writeFileSync(out(`leak-guard-${l.id}-${arm}.txt`), `$ grep -rl "300000\\|D390" ${dir} --exclude-dir=.git\n${leak.stdout}`);
    log(`extract ${dir}; leak guard hits:\n${leak.stdout}`);
  }
  return dir;
}
// The chair, 14:23Z: at these bases app/test/soundrender.js launchChrome passes no --mute-audio, and the keeper heard a
// test's Chrome from A's run. CHROME_PATH cannot carry the flag (a wrapper exe would fail the test's pid-ownership check),
// so the flag goes into the file as a LAUNCHER COMMIT on top of the base, the same in both arms and in the review tree, and
// the arm's work is measured from that commit (baseSha). Not part of the task; the prompt is unchanged.
function mute(dir) {
  const f = path.join(dir, 'app/test/soundrender.js');
  if (!fs.existsSync(f)) return;   // L5's extract has no Chrome tests
  const src = fs.readFileSync(f, 'utf8');
  if (src.includes("'--mute-audio'")) return;
  const from = "'--headless=new', `--remote-debugging-port", to = "'--headless=new', '--mute-audio', `--remote-debugging-port";
  if (src.split(from).length !== 2) throw new Error(`mute: launchChrome line not found exactly once in ${f}`);
  fs.writeFileSync(f, src.replace(from, to));
  must(`git -C "${dir}" -c user.name=d411-launcher -c user.email=d411@local commit -q -m "launcher: headless Chrome passes --mute-audio (D411 launcher requirement, both arms equally; not part of the task)" -- app/test/soundrender.js`);
  log(`mute commit ${must(`git -C "${dir}" log --format=%h -1`).trim()} in ${dir}`);
}
function baseSha(l, arm) {
  if (l.repo === 't180') {
    const m = sh(`git -C "${wt(l.id, arm)}" log --format=%h --grep="^launcher: headless Chrome" ${l.base}..HEAD`).stdout.trim().split('\n').filter(Boolean);
    return m.length ? m[m.length - 1] : l.base;   // the launcher commit sits directly on the lap base; the arm's work is measured from it
  }
  return must(`git -C "${wt(l.id, arm)}" rev-list --max-parents=0 HEAD`).trim();
}

// ---- sessions ----
function childEnv(label) {
  const env = {};
  for (const [k, v] of Object.entries(process.env)) if (!/^(CLAUDE|CONSONANCE)/.test(k)) env[k] = v;
  env.CONSONANCE_HEAVY_SLOTS = '1';            // every live lock blocks: one heavy run on the machine at a time
  env.CONSONANCE_HEAVY_WAIT_MS = String(3 * 60 * 60 * 1000);   // 3 h: a queued test run waits rather than erroring at 60 min (raised after L2-R attempt 1)
  env.CONSONANCE_PANE = `${label}-${crypto.randomBytes(4).toString('hex')}`;   // the lock's seat = first 8 chars
  env.D411_LABEL = label;
  return env;
}
function session({ label, cwd, promptFile, timeoutMs, name }) {
  return new Promise((resolve) => {
    const prompt = fs.readFileSync(promptFile);
    const args = ['-p', '--model', MODEL, '--output-format', 'json', '--safe-mode', '--strict-mcp-config',
      '--dangerously-skip-permissions', '--add-dir', cwd, '--name', name];
    const t0 = Date.now();
    const started = new Date(t0).toISOString();
    const child = spawn(CLAUDE, args, { cwd, env: childEnv(label), windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] });
    let so = '', se = '', killed = false;
    child.stdout.on('data', (d) => { so += d; });
    child.stderr.on('data', (d) => { se += d; });
    // The cap counts ACTIVE time only. Every 30 s the lock dir is read; if a lock not from d411 is live, that
    // slice counts as others_hold_lock_ms (the arm's own test runs cannot start then: CONSONANCE_HEAVY_SLOTS=1),
    // otherwise as active_ms. Kill at timeoutMs of active time, or at ABS_CAP_MS of wall time.
    // (Added after L2-R attempt 1 was killed at 120 min wall with its test run still queued on other seats' locks.)
    let active_ms = 0, others_ms = 0, kill_reason = null;
    const lockLog = fs.createWriteStream(out(`${label}.locks.jsonl`), { flags: 'a' });
    const foreignLocks = () => {
      const r = [];
      try { for (const f of fs.readdirSync(LOCK_DIR)) { if (!/^heavy-run(\.\d+)?\.lock$/.test(f)) continue;
        const j = JSON.parse(fs.readFileSync(path.join(LOCK_DIR, f), 'utf8')); if (!/^d411/.test(j.cmd || '')) r.push(`${j.seat} ${j.cmd}`); } } catch (_) { r.push('unreadable'); }
      return r;
    };
    const timer = setInterval(() => {
      const held = foreignLocks();
      if (held.length) others_ms += LOCK_POLL_MS; else active_ms += LOCK_POLL_MS;
      lockLog.write(JSON.stringify({ t: new Date().toISOString(), others: held }) + '\n');
      const wall = Date.now() - t0;
      if (active_ms >= timeoutMs) kill_reason = `active ${(active_ms / 60000).toFixed(0)} min >= cap`;
      else if (wall >= ABS_CAP_MS) kill_reason = `wall ${(wall / 60000).toFixed(0)} min >= absolute cap`;
      if (kill_reason) { killed = true; child.kill(); clearInterval(timer); }
    }, LOCK_POLL_MS);
    child.on('close', (code, signal) => {
      clearInterval(timer); lockLog.end();
      const wall_ms = Date.now() - t0;
      let json = null; try { json = JSON.parse(so); } catch (_) { /* recorded as non-JSON below */ }
      const rec = { label, started, ended: new Date().toISOString(), wall_ms, active_ms, others_hold_lock_ms: others_ms, exit_code: code, signal, launcher_killed: killed, kill_reason,
        args, cwd, prompt_sha256: crypto.createHash('sha256').update(prompt).digest('hex'), prompt_bytes: prompt.length,
        session_id: json && json.session_id, subtype: json && json.subtype, is_error: json && json.is_error,
        num_turns: json && json.num_turns, duration_ms: json && json.duration_ms, duration_api_ms: json && json.duration_api_ms,
        usage: json && json.usage, models: json && json.modelUsage ? Object.keys(json.modelUsage) : null,
        stop_reason: json && json.stop_reason, terminal_reason: json && json.terminal_reason, result: json && json.result };
      fs.writeFileSync(out(`${label}.json`), JSON.stringify(rec, null, 1));
      fs.writeFileSync(out(`${label}.stdout.txt`), so);
      fs.writeFileSync(out(`${label}.stderr.txt`), se);
      log(`[${label}] exit ${code} ${signal || ''} wall ${(wall_ms / 1000).toFixed(0)} s (others held the lock ${(others_ms / 60000).toFixed(0)} min) turns ${rec.num_turns} ${killed ? 'LAUNCHER-KILLED: ' + kill_reason : ''}`);
      resolve(rec);
    });
    child.stdin.end(prompt);
  });
}

function aHoldsLock() {
  try {
    for (const f of fs.readdirSync(LOCK_DIR)) {
      if (!/^heavy-run(\.\d+)?\.lock$/.test(f)) continue;
      const j = JSON.parse(fs.readFileSync(path.join(LOCK_DIR, f), 'utf8'));
      if (/A D407/.test(j.cmd || '')) return `${f}: ${j.cmd} (since ${j.started})`;
    }
  } catch (_) { return 'unreadable lock'; }
  return null;
}
async function waitForA() {
  let said = '';
  for (;;) {
    const h = aHoldsLock();
    if (!h) return;
    if (h !== said) { log(`${new Date().toISOString()} waiting: A holds the heavy-run lock — ${h}`); said = h; }
    await new Promise((r) => setTimeout(r, 30000));
  }
}

async function builders() {
  const t = tasks();
  // (start-gate on A's lock removed at 16:4x Z, after L2-R attempt 1: the arms' TEST runs already block on every live lock through hr.js with CONSONANCE_HEAVY_SLOTS=1, which is the chair's rule; gating the session START on A as well only spent wall time. L1 started after A cleared at 13:35:50Z; later laps start when their turn comes.)
  for (const l of LAPS) {
    // HOLD: while out/HOLD exists no new session starts (the chair, 18:59:41Z: A's D407 timing window; no new D411
    // session until A rings done). In-flight sessions are untouched; their test runs queue on the lock as before.
    let heldSaid = false;
    while (fs.existsSync(out('HOLD'))) { if (!heldSaid) { log(`${new Date().toISOString()} HOLD: out/HOLD present, ${l.id} not started`); heldSaid = true; } await new Promise((r) => setTimeout(r, 30000)); }
    if (heldSaid) log(`${new Date().toISOString()} HOLD lifted, starting ${l.id}`);
    const jobs = ARMS.map((arm) => {
      const label = `${l.id}-${arm}`;
      if (fs.existsSync(out(`${label}.json`))) { log(`skip ${label}: already run (one shot, never re-run)`); return null; }
      const dir = wt(l.id, arm);
      if (fs.existsSync(path.join(dir, 'HANDBACK.md'))) { log(`skip ${label}: HANDBACK.md already there`); return null; }
      return session({ label, cwd: dir, promptFile: path.join(E, 'prompts', `prompt-${l.id}-${arm}.txt`), timeoutMs: BUILDER_TIMEOUT_MS, name: `d411-${label}` });
    }).filter(Boolean);
    await Promise.all(jobs);   // at most 2 at a time: both arms of one lap, then the next lap
    for (const arm of ARMS) {
      const hb = path.join(wt(l.id, arm), 'HANDBACK.md');
      if (!fs.existsSync(hb)) { log(`[${l.id}-${arm}] no HANDBACK.md written (the session ended without one)`); continue; }
      if (fs.readFileSync(hb, 'utf8').startsWith('D411 LAUNCHER HOLD MARKER')) { log(`[${l.id}-${arm}] HOLD marker, not copied`); continue; }
      fs.copyFileSync(hb, out(`${l.id}-${arm}-handback.md`));
    }
  }
}

// ---- measurement ----
const TEST_RE = /(^|\/)(test|tests)\/.*\.test\.js$|\.test\.js$|\.mutants\.js$/;
function rowsIn(text, sign) {
  const re = new RegExp(`^\\${sign}\\s*(?:test|it)\\s*\\(\\s*(['"\`])([\\s\\S]*?)\\1`, 'gm');
  const r = []; let m; while ((m = re.exec(text))) r.push(m[2]); return r;
}
function measure(lapId) {
  const l = LAPS.find((x) => x.id === lapId);
  for (const arm of ARMS) {
    const dir = wt(l.id, arm), base = baseSha(l, arm), label = `${l.id}-${arm}`;
    const m = { label, base, dir };
    m.commits = sh(`git -C "${dir}" log --format="%h %s" ${base}..HEAD`).stdout.trim();
    m.status = sh(`git -C "${dir}" status --porcelain`).stdout.trim();
    const diff = sh(`git -C "${dir}" diff ${base} HEAD`).stdout;
    fs.writeFileSync(out(`${label}.diff`), diff);
    fs.writeFileSync(out(`${label}.worktree.diff`), sh(`git -C "${dir}" diff ${base}`).stdout);   // committed + uncommitted, for the record
    m.stat = sh(`git -C "${dir}" diff --stat ${base} HEAD`).stdout.trim();
    m.numstat = sh(`git -C "${dir}" diff --numstat ${base} HEAD`).stdout.trim();
    let add = 0, del = 0; const files = [];
    for (const line of m.numstat.split('\n').filter(Boolean)) { const [a, d, f] = line.split('\t'); add += +a || 0; del += +d || 0; files.push(f); }
    m.files = files; m.added = add; m.removed = del; m.changed_lines = add + del;
    m.test_files = files.filter((f) => TEST_RE.test(f));
    m.source_files = files.filter((f) => !TEST_RE.test(f));
    // test rows added / deleted / rewritten, from the test files' hunks only
    const perFile = {};
    for (const f of m.test_files) {
      const d = sh(`git -C "${dir}" diff ${base} HEAD -- "${f}"`).stdout;
      const plus = rowsIn(d, '+'), minus = rowsIn(d, '-');
      const rewritten = minus.filter((n) => plus.includes(n));
      perFile[f] = { added: plus.filter((n) => !minus.includes(n)), deleted: minus.filter((n) => !plus.includes(n)), rewritten };
    }
    m.rows = perFile;
    m.rows_added = Object.values(perFile).reduce((s, x) => s + x.added.length, 0);
    m.rows_deleted = Object.values(perFile).reduce((s, x) => s + x.deleted.length, 0);
    m.rows_rewritten = Object.values(perFile).reduce((s, x) => s + x.rewritten.length, 0);
    // the named test files, run whole, under the lock
    m.test_runs = [];
    for (const f of m.test_files) {
      const cmd = l.repo === 't180' ? `node --test "${f}"` : `node "${f}"`;
      const r = runLocked(dir, label, cmd);
      fs.writeFileSync(out(`${label}.test.${path.basename(f)}.txt`), `$ ${cmd}\n(exit ${r.code})\n${r.stdout}\n${r.stderr}`);
      m.test_runs.push({ file: f, cmd, exit: r.code, counts: counts(l.repo, r.stdout + r.stderr) });
    }
    // mutation harnesses that anchor the touched source files, run whole
    m.harness_runs = [];
    for (const h of anchoringHarnesses(l, dir, m.source_files)) {
      const cmd = l.repo === 't180' ? `node --test "${h}"` : `node "${h}"`;
      const r = runLocked(dir, label, cmd);
      fs.writeFileSync(out(`${label}.harness.${path.basename(h)}.txt`), `$ ${cmd}\n(exit ${r.code})\n${r.stdout}\n${r.stderr}`);
      m.harness_runs.push({ file: h, cmd, exit: r.code, counts: counts(l.repo, r.stdout + r.stderr), mutants: mutantCounts(r.stdout + r.stderr) });
    }
    fs.writeFileSync(out(`${label}.measure.json`), JSON.stringify(m, null, 1));
    log(`[${label}] ${m.stat.split('\n').pop()} | rows +${m.rows_added} -${m.rows_deleted} ~${m.rows_rewritten} | tests ${m.test_runs.map((t) => `${path.basename(t.file)} ${t.counts}`).join(', ')} | harnesses ${m.harness_runs.map((t) => `${path.basename(t.file)} ${t.mutants || t.counts}`).join(', ') || 'none anchor'}`);
  }
}
function remeasure(lapId) {
  const l = LAPS.find((x) => x.id === lapId);
  for (const arm of ARMS) {
    const label = `${l.id}-${arm}`, dir = wt(l.id, arm);
    const m = JSON.parse(fs.readFileSync(out(`${label}.measure.json`), 'utf8'));
    for (const t of m.test_runs) {
      const saved = fs.readFileSync(out(`${label}.test.${path.basename(t.file)}.txt`), 'utf8');
      t.counts = counts(l.repo, saved); t.counts_from = 'saved output of the first measure pass, re-parsed';
    }
    m.harness_runs = [];
    for (const h of anchoringHarnesses(l, dir, m.source_files)) {
      const cmd = l.repo === 't180' ? `node --test "${h}"` : `node "${h}"`;
      const r = runLocked(dir, label, cmd);
      fs.writeFileSync(out(`${label}.harness.${path.basename(h)}.txt`), `$ ${cmd}
(exit ${r.code})
${r.stdout}
${r.stderr}`);
      m.harness_runs.push({ file: h, cmd, exit: r.code, counts: counts(l.repo, r.stdout + r.stderr), mutants: mutantCounts(r.stdout + r.stderr) });
    }
    fs.writeFileSync(out(`${label}.measure.json`), JSON.stringify(m, null, 1));
    log(`[${label}] tests ${m.test_runs.map((t) => `${path.basename(t.file)} ${t.counts} (exit ${t.exit})`).join(', ')} | harnesses ${m.harness_runs.map((t) => `${path.basename(t.file)} ${t.mutants || t.counts} (exit ${t.exit})`).join(', ') || 'none anchor'}`);
  }
}
// baseline: the union of both arms' named test files, run at the untouched base tree (L5: a fresh extract), to tell a pre-existing red from an arm's.
function baseline(lapId) {
  const l = LAPS.find((x) => x.id === lapId);
  const dir = makeTree(l, 'base');
  const files = new Set();
  for (const arm of ARMS) for (const f of JSON.parse(fs.readFileSync(out(`${l.id}-${arm}.measure.json`), 'utf8')).test_files) files.add(f);
  for (const f of files) {
    const cmd = l.repo === 't180' ? `node --test "${f}"` : `node "${f}"`;
    const r = runLocked(dir, `${l.id}-base`, cmd);
    fs.writeFileSync(out(`${l.id}-base.test.${path.basename(f)}.txt`), `$ ${cmd}
(exit ${r.code})
${r.stdout}
${r.stderr}`);
    log(`[${l.id}-base] ${path.basename(f)} ${counts(l.repo, r.stdout + r.stderr)} (exit ${r.code})`);
  }
}
function runLocked(dir, label, cmd) {
  const hr = path.join(E, 'hr.js');
  return sh(`node "${hr}" -- ${cmd}`, { cwd: dir, env: childEnv(`measure-${label}`) });
}
function counts(repo, text) {
  const plain = text.replace(/\x1b\[[0-9;]*m/g, '');
  const ip = /^\s*\u2139 pass (\d+)/m.exec(plain), inf = /^\s*\u2139 fail (\d+)/m.exec(plain);   // node --test spec reporter (correction: the first measure pass parsed TAP only)
  if (ip || inf) return `pass ${ip ? ip[1] : '?'} / fail ${inf ? inf[1] : '?'}`;
  if (repo === 't180') {
    const p = /^# pass (\d+)/m.exec(text), f = /^# fail (\d+)/m.exec(text);
    return p || f ? `pass ${p ? p[1] : '?'} / fail ${f ? f[1] : '?'}` : '(no node --test summary)';
  }
  const ok = (text.match(/^\s+ok\s/gm) || []).length, fail = (text.match(/^\s+FAIL\s/gm) || []).length;
  return `ok ${ok} / FAIL ${fail}`;
}
function mutantCounts(text) {
  // the lighthouse harnesses print "73 applied · 73 caught · 0 survived · 0 NOT APPLIED" (number first); the first form below is kept (correction)
  const sum = /(\d+) applied(?: · | )(\d+) caught(?: · | )(\d+) survived(?: · | )(\d+) NOT APPLIED/.exec(text);
  if (sum) return `applied ${sum[1]} / caught ${sum[2]} / survived ${sum[3]} / NOT APPLIED ${sum[4]}`;
  const a = /applied\s+(\d+)/i.exec(text), c = /caught\s+(\d+)/i.exec(text), n = /NOT APPLIED\s+(\d+)/i.exec(text);
  return a || c || n ? `applied ${a ? a[1] : '?'} / caught ${c ? c[1] : '?'} / NOT APPLIED ${n ? n[1] : '?'}` : null;
}
function anchoringHarnesses(l, dir, sources) {
  const set = new Set();
  const pat = l.repo === 't180' ? `"test/*mutation*.test.js" "app/test/*mutation*.test.js"` : `"consonance/tools/*.mutants.js"`;   // double quotes: cmd.exe passes single quotes literally (correction)
  for (const s of sources) {
    const b = path.basename(s);
    const r = sh(`git -C "${dir}" grep -l -F "${b}" HEAD -- ${pat}`);
    for (const line of r.stdout.split('\n').filter(Boolean)) set.add(line.replace(/^(HEAD|[0-9a-f]+):/, ''))   // git grep <rev> prefixes 'HEAD:' (correction);
  }
  return [...set];
}

// ---- the blind review ----
function scrub(text, lap, arm) {
  const pony = fs.readFileSync(PONYTAIL, 'utf8');
  const words = pony.replace(/[`*#>_]/g, ' ').split(/\s+/).filter(Boolean);
  const windows = new Set();
  for (let i = 0; i + 6 <= words.length; i++) windows.add(words.slice(i, i + 6).join(' ').toLowerCase());
  const removed = [];
  const lines = text.split('\n').map((line) => {
    let l = line;
    const paths = [wt(lap, arm), wt(lap, arm).replace(/\//g, '\\'), `d411-${lap}-${arm}`];
    for (const p of paths) if (l.includes(p)) { removed.push(`path token replaced: ${p}`); l = l.split(p).join('<worktree>'); }
    if (/working rule|ponytail|lazy senior/i.test(l)) { removed.push(`line removed (arm-revealing words): ${line}`); return null; }
    const w = l.replace(/[`*#>_]/g, ' ').split(/\s+/).filter(Boolean).map((x) => x.toLowerCase());
    for (let i = 0; i + 6 <= w.length; i++) if (windows.has(w.slice(i, i + 6).join(' '))) { removed.push(`line removed (quotes the section): ${line}`); return null; }
    return l;
  }).filter((x) => x !== null);
  return { text: lines.join('\n'), removed };
}
function reviewPrompt(l, text, base) {
  return [
    '# Review',
    '',
    'Two authors were each given the task below, on a clean checkout at the base commit, and asked to fix it test-first and commit.',
    'Their diffs against the base are `review/X.diff` and `review/Y.diff`; each author\'s own hand-back is `review/X-handback.md` and `review/Y-handback.md`.',
    `This directory is a clean checkout at that base (\`${base}\`). You may apply a diff (\`git apply review/X.diff\`), run tests, and reset (\`git checkout -- . && git clean -fd -e review\`). Run every test command through the lock wrapper: \`node review/hr.js -- <command>\`. If anything would open a browser or an Electron window, pass --headless and --mute-audio.`,
    '',
    '## The task the authors were given',
    '',
    text,
    '',
    '## What to answer',
    '',
    'For each diff: is it correct; what edge cases does it miss (name them, with a probe if you can run one); did it cut or weaken a test; how much would you have to change to land it. Then: which would you land, X, Y, or neither, and why in two lines.',
    '',
    'Write your whole answer to `review/VERDICT.md` in this directory, and also print it as your final message.',
    '',
  ].join('\n');
}
async function reviews(only) {
  const t = tasks();
  for (const l of LAPS) {
    if (only && l.id !== only) continue;
    const label = `review-${l.id}`;
    if (fs.existsSync(out(`${label}.json`))) { log(`skip ${label}: already run`); continue; }
    for (const arm of ARMS) if (!fs.existsSync(out(`${l.id}-${arm}.diff`))) throw new Error(`${l.id}: run measure first (no ${l.id}-${arm}.diff)`);
    const coin = crypto.randomInt(2);
    const X = coin ? 'R' : 'N', Y = coin ? 'N' : 'R';
    fs.appendFileSync(path.join(E, 'key.json'), JSON.stringify({ lap: l.id, X, Y, coin }) + '\n');   // append only; never read by this script
    const dir = makeTree(l, 'review');
    const base = baseSha(l, 'review');
    const rv = path.join(dir, 'review');
    fs.mkdirSync(rv, { recursive: true });
    fs.copyFileSync(path.join(E, 'hr.js'), path.join(rv, 'hr.js'));   // its own copy: the prompt never names the evidence directory, where key.json lives
    const removals = [];
    for (const [lbl, arm] of [['X', X], ['Y', Y]]) {
      fs.copyFileSync(out(`${l.id}-${arm}.diff`), path.join(rv, `${lbl}.diff`));
      const s = scrub(fs.readFileSync(out(`${l.id}-${arm}-handback.md`), 'utf8'), l.id, arm);
      fs.writeFileSync(path.join(rv, `${lbl}-handback.md`), s.text);
      fs.writeFileSync(path.join(E, 'scrub', `${l.id}-${lbl}-handback.md`), s.text);
      removals.push(`## ${lbl}\n${s.removed.map((r) => '- ' + r).join('\n') || '- (nothing removed)'}`);
    }
    fs.writeFileSync(out(`${label}-removals.md`), `# ${l.id}: removed from the hand-backs the reviewer saw\n\n${removals.join('\n\n')}\n`);
    const pf = path.join(E, 'prompts', `prompt-${l.id}-review.txt`);
    fs.writeFileSync(pf, reviewPrompt(l, t[l.id].text, base));
    await session({ label, cwd: dir, promptFile: pf, timeoutMs: REVIEW_TIMEOUT_MS, name: `d411-${label}` });
    const v = path.join(rv, 'VERDICT.md');
    if (fs.existsSync(v)) fs.copyFileSync(v, out(`${label}-VERDICT.md`));
  }
}

// ---- the table ----
function table() {
  const rows = ['| lap | arm | files | +/- | changed | rows + / − / rewritten | test files whole | harnesses | session wall | turns | exit |', '|---|---|---|---|---|---|---|---|---|---|---|'];
  for (const l of LAPS) for (const arm of ARMS) {
    const label = `${l.id}-${arm}`;
    const m = fs.existsSync(out(`${label}.measure.json`)) ? JSON.parse(fs.readFileSync(out(`${label}.measure.json`), 'utf8')) : null;
    const s = fs.existsSync(out(`${label}.json`)) ? JSON.parse(fs.readFileSync(out(`${label}.json`), 'utf8')) : null;
    rows.push(`| ${l.id} | ${arm} | ${m ? m.files.length : '-'} | ${m ? `+${m.added} −${m.removed}` : '-'} | ${m ? m.changed_lines : '-'} | ${m ? `${m.rows_added} / ${m.rows_deleted} / ${m.rows_rewritten}` : '-'} | ${m ? m.test_runs.map((t) => `${path.basename(t.file)}: ${t.counts} (exit ${t.exit})`).join('; ') || 'none' : '-'} | ${m ? m.harness_runs.map((t) => `${path.basename(t.file)}: ${t.mutants || t.counts} (exit ${t.exit})`).join('; ') || 'none anchor' : '-'} | ${s ? `${(s.wall_ms / 60000).toFixed(1)} min` : '-'} | ${s ? s.num_turns : '-'} | ${s ? `${s.exit_code}${s.launcher_killed ? ' (launcher killed)' : ''} ${s.subtype || ''}` : '-'} |`);
  }
  log(rows.join('\n'));
}

(async () => {
  const [mode, arg] = process.argv.slice(2);
  if (mode === 'prep') prep();
  else if (mode === 'builders') await builders();
  else if (mode === 'measure') { for (const l of LAPS) if (!arg || l.id === arg) measure(l.id); }   // braces: a bare for-if here swallowed every later else-if (correction)
  else if (mode === 'remeasure') { for (const l of LAPS) if (!arg || l.id === arg) remeasure(l.id); }
  else if (mode === 'baseline') baseline(arg);
  else if (mode === 'reviews') await reviews(arg);
  else if (mode === 'table') table();
  else { log('usage: node run.js prep | builders | measure [Lk] | remeasure [Lk] | baseline Lk | reviews [Lk] | table'); process.exit(2); }
})().catch((e) => { process.stderr.write(String(e.stack || e) + '\n'); process.exit(1); });
