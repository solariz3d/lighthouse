#!/usr/bin/env node
/* jev-shadow-runner.js — keeps jev-shadow.js running for as long as the app is open. D104.
 *
 *   node consonance/tools/jev-shadow-runner.js --app-pid <pid> [--shadow-every <sec>] [--max-calls <n>] [--daily-cap <n>]
 *
 * STARTED BY THE APP, not by a service. `main.rs` spawns it beside the exit waiter on every launch (start_jev_shadow,
 * next to start_exit_waiter; L059 §3 made that call site unconditional), windowless, with the app's own pid. It exits
 * by itself when that pid dies. It is not a scheduled task, not a service, and it has no WakeToRun.
 *
 * ONE PROCESS, IN-PROCESS CALLS. `capture` every 3 s (a job lives >= 8.3 s, D103) and `shadow` on a cadence, both
 * through require('./jev-shadow.js'). The key is held in memory and handed to `shadow` as an env OBJECT: it is never
 * put in argv, never in a child's environment, never in a file, never in the log.
 *
 * THE KEY: process.env.AI_GATEWAY_API_KEY, else the User environment (HKCU\Environment) read IN-PROCESS with
 * `reg query`, its stdout captured by a pipe. The User read exists because a variable set after the app started
 * does not reach the app's children (the D102/D103 case: stored 12:45, app started 08:47). No key: REFUSED, logged,
 * exit 2 — loud where a windowless process can be loud, in the log.
 *
 * THE CADENCE, argued (D104): shadow every 10 min, at most 25 calls a run, at most 600 a day.
 *  · Nothing acts on the answer (measured, not acted on), so latency is worth nothing and batching costs nothing.
 *  · The busiest day measured was 233 L2 + 302 L3 = 535 verdicts, about 22 an hour; 25 per 10 min is 150 an hour, so
 *    the runner keeps up with room to spare and a backlog after a pause drains in bounded steps.
 *  · Worst cases, at about 10k input tokens and $0.000000042 a token: about $0.011 a run and about $0.25 a day.
 *    The daily cap sits above the busiest measured day, so it limits a runaway, not a normal day.
 *
 * ONE RUNNER per store: an exclusive lock file (`wx`). A second runner exits 3 and says so in the log; a lock whose
 * pid is dead is taken over, and the takeover is logged.
 *
 * NEVER TOUCHES THE JUDGES: capture reads ~/.claude/shell, shadow reads the verdict ledgers, and both write only the
 * store. The installed hooks and both scoring windows (loop/scoring_windows_2026-09-21.md) run exactly as before.
 *
 * STORE: %LOCALAPPDATA%\consonance\jev-shadow — outside the data dir, so no manifest row (the librarian's ruling,
 * D104, under the keeper's standing permission). Holds captures (conversation text), shadow.jsonl, runner.log,
 * runner.lock.
 *
 * JUDGE MODE (L071, pane A — the keeper, 02:4x: "system agnostic ... just run through consonance itself"). Beside
 * the shadow, and on EVERY machine with no switch: jev-judge.js captures each live seat's finished turn on the capture
 * tick (the same input the L2/L3 hooks build at Stop) and asks Jev on the shadow cadence, into its OWN ledger
 * (jev_judge.jsonl, judge:"jev", unverified:true) — never l2/l3_overseer.jsonl. ONE daily cap covers both modes. If
 * judge mode cannot run (no data dir, a hook function missing) it says so ONCE and the shadow runs exactly as before.
 * run() turns it on only when handed a dataDir AND a projectsDir; main() hands it this machine's real ones.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const shadowMod = require('./jev-shadow.js');
const judgeMod = require('./jev-judge.js');
const jev = require('./jev-ask.js');

const { Refusal } = jev;
class AlreadyRunning extends Error { constructor(m) { super(m); this.exitCode = 3; } }

const DEFAULTS = { captureMs: 3000, shadowMs: 10 * 60 * 1000, pidPollMs: 5000, maxCalls: 25, dailyCap: 600 };

function defaultStore(env = process.env) {
  if (!env.LOCALAPPDATA) throw new Refusal('LOCALAPPDATA is not set — the store lives at %LOCALAPPDATA%\\consonance\\jev-shadow');
  return path.join(env.LOCALAPPDATA, 'consonance', 'jev-shadow');
}

/** `reg query HKCU\Environment /v <name>` output → the value, or null. */
function parseRegQuery(out, name) {
  const re = new RegExp(`^\\s*${name}\\s+REG_(?:EXPAND_)?SZ\\s+(.*?)\\s*$`);
  for (const line of String(out).split(/\r?\n/)) { const m = re.exec(line); if (m) return m[1]; }
  return null;
}

/** The User environment, read in-process. Its output goes to a pipe and is parsed; nothing is printed. */
function readUserEnv(name) {
  if (process.platform !== 'win32') return null;
  try {
    const out = execFileSync('reg', ['query', 'HKCU\\Environment', '/v', name],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], windowsHide: true });
    return parseRegQuery(out, name);
  } catch { return null; }
}

function isAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; }
}

/**
 * Start the runner. Resolves to { stop(reason), done } once it is running; rejects with Refusal (no key, no app,
 * a capture that cannot build the judged prompt) or AlreadyRunning. `done` resolves to the stop reason.
 */
async function run(o) {
  const cfg = { ...DEFAULTS, ...o };
  const { store, appPid } = cfg;
  if (!store) throw new Refusal('no store');
  fs.mkdirSync(store, { recursive: true });
  let key = '';
  const logPath = path.join(store, 'runner.log');
  const log = (msg) => { try { fs.appendFileSync(logPath, `${new Date().toISOString()} ${jev.scrub(msg, key)}\n`); } catch {} };

  key = String((cfg.env || {}).AI_GATEWAY_API_KEY || '').trim() || String(cfg.readUserEnv('AI_GATEWAY_API_KEY') || '').trim();
  if (!key) {
    const m = 'no AI_GATEWAY_API_KEY in the process environment or the User environment — refusing to start';
    log(`REFUSED ${m}`);
    throw new Refusal(m);
  }
  if (!isAlive(appPid)) {
    const m = `the app pid ${appPid} is not running — nothing to shadow for`;
    log(`REFUSED ${m}`);
    throw new Refusal(m);
  }

  // ONE RUNNER: exclusive create; a live holder wins, a dead one is taken over.
  const lockPath = path.join(store, 'runner.lock');
  const token = crypto.randomBytes(8).toString('hex');
  for (let attempt = 0; ; attempt++) {
    try {
      fs.writeFileSync(lockPath, JSON.stringify({ pid: process.pid, token, app_pid: appPid, started_at: new Date().toISOString() }), { flag: 'wx' });
      break;
    } catch (e) {
      if (e.code !== 'EEXIST' || attempt > 0) throw e;
      let held = null;
      try { held = JSON.parse(fs.readFileSync(lockPath, 'utf8')); } catch {}
      if (held && isAlive(held.pid)) {
        log(`another runner (pid ${held.pid}) is running on this store — this one exits`);
        throw new AlreadyRunning(`another runner (pid ${held.pid}) holds ${lockPath}`);
      }
      log(`stale lock (pid ${held ? held.pid : 'unreadable'}, not running) taken over`);
      try { fs.unlinkSync(lockPath); } catch {}
    }
  }
  const release = () => {
    try { const held = JSON.parse(fs.readFileSync(lockPath, 'utf8')); if (held.token === token) fs.unlinkSync(lockPath); } catch {}
  };

  const env = { AI_GATEWAY_API_KEY: key };        // in memory only
  const base = { shellDir: cfg.shellDir, disciplineDir: cfg.disciplineDir, store };
  const timers = [];
  let stopping = false, inFlight = Promise.resolve(), shadowBusy = false, capLoggedFor = null;
  let resolveDone;
  const done = new Promise((r) => { resolveDone = r; });

  const stop = (reason) => {
    if (stopping) return done;
    stopping = true;
    for (const t of timers) clearInterval(t);
    inFlight.then(() => { release(); log(`stopped: ${reason}`); resolveDone(reason); });
    return done;
  };

  // ONE DAILY CAP, BOTH MODES (L071): the shadow's ok rows today plus judge mode's. Two caps would double the day's
  // worst case without anyone deciding it.
  const callsToday = () => {
    const today = new Date().toDateString();
    let n = 0;
    try {
      for (const l of fs.readFileSync(path.join(store, 'shadow.jsonl'), 'utf8').split('\n')) {
        if (!l) continue;
        try { const r = JSON.parse(l); if (r.status === 'ok' && new Date(r.ts).toDateString() === today) n++; } catch {}
      }
    } catch {}
    return n + judgeMod.callsToday(store, today);
  };

  // JUDGE MODE state. Off, with its reason said ONCE, when it cannot run; the shadow never depends on it.
  let judgeOff = (cfg.dataDir && cfg.projectsDir) ? null : 'no data dir or projects dir was given to run()';
  const judgeMemo = {};
  const judgeCfg = { store, repo: cfg.repo || path.resolve(__dirname, '..', '..'), dataDir: cfg.dataDir,
    projectsDir: cfg.projectsDir, disciplineDir: cfg.disciplineDir };
  if (judgeOff) log(`judge mode off: ${judgeOff}`);
  const judgeFailed = (e) => { judgeOff = e.message; log(`judge mode off: ${e.message} — the shadow keeps running`); };

  const doCapture = () => {
    if (stopping) return;
    try { shadowMod.capture(base); } catch (e) {
      if (e instanceof Refusal) { log(`REFUSED capture: ${e.message} — stopping rather than feed Jev a prompt the judge did not see`); stop('capture refused'); }
      else log(`capture error: ${e.message}`);
    }
    if (stopping || judgeOff) return;
    // A judge-mode Refusal turns judge mode off and never the runner: on D the shadow is the measurement and must not
    // stop because judge mode could not build a prompt.
    try { judgeMod.capturePass({ ...judgeCfg, memo: judgeMemo }); } catch (e) {
      if (e instanceof Refusal) judgeFailed(e); else log(`judge capture error: ${e.message}`);
    }
  };

  const doShadow = () => {
    if (stopping || shadowBusy) return;
    const left = cfg.dailyCap - callsToday();
    if (left <= 0) {
      const day = new Date().toDateString();
      if (capLoggedFor !== day) { log(`daily cap of ${cfg.dailyCap} calls reached — no more calls today`); capLoggedFor = day; }
      return;
    }
    shadowBusy = true;
    inFlight = shadowMod.shadow({ ...base, maxCalls: Math.min(cfg.maxCalls, left), env, fetchImpl: cfg.fetchImpl })
      .then((r) => {
        if (r.asked || r.refused) log(`shadow: asked ${r.asked}, refused ${r.refused}, remaining ${r.remaining}`);
        // L071: an empty cadence said NOTHING, so an idle runner and a broken one read the same (L, 09-22: zero calls
        // for hours, and no way to tell why from the log). One line per empty cadence, with the count it found.
        else {
          let n = 0;
          for (const j of ['l2', 'l3']) { try { n += fs.readdirSync(path.join(store, 'captures', j)).filter((x) => x.endsWith('.json')).length; } catch {} }
          log(`shadow: nothing to shadow (${n} captures)`);
        }
      })
      .catch((e) => log(`shadow error (next cadence retries): ${e.message}`))
      .then(() => {
        // JUDGE MODE, after the shadow and inside the same cadence, so the two draw on one budget in turn and never
        // at the same moment. The cap is re-read here: the shadow may just have spent some of it.
        if (stopping || judgeOff) return;
        const rest = cfg.dailyCap - callsToday();
        if (rest <= 0) {
          const day = new Date().toDateString();
          if (capLoggedFor !== day) { log(`daily cap of ${cfg.dailyCap} calls reached — no more calls today`); capLoggedFor = day; }
          return;
        }
        return judgeMod.judgePass({ store, maxCalls: Math.min(cfg.maxCalls, rest), env, fetchImpl: cfg.fetchImpl })
          .then((r) => log(r.asked || r.refused
            ? `judge: asked ${r.asked}, refused ${r.refused}, remaining ${r.remaining}`
            : `judge: nothing new to judge (${r.captures} turns captured so far)`))
          .catch((e) => { if (e instanceof Refusal) judgeFailed(e); else log(`judge error (next cadence retries): ${e.message}`); });
      })
      .finally(() => { shadowBusy = false; });
  };

  log(`started: app pid ${appPid}, capture every ${cfg.captureMs} ms, shadow every ${cfg.shadowMs} ms, `
    + `at most ${cfg.maxCalls} calls a run and ${cfg.dailyCap} a day`);
  doCapture();
  doShadow();
  // A stop during the FIRST pass (a capture that refuses at once) must not be followed by timers nobody clears:
  // found D104, when that case kept the process alive forever after it had logged "stopped".
  if (!stopping) {
    timers.push(setInterval(doCapture, cfg.captureMs));
    timers.push(setInterval(doShadow, cfg.shadowMs));
    timers.push(setInterval(() => { if (!isAlive(appPid)) stop('app closed'); }, cfg.pidPollMs));
  }
  return { stop, done };
}

function parseArgs(argv) {
  const a = {};
  const num = (k, v) => { const n = Number(v); if (!Number.isFinite(n) || n <= 0) throw new Refusal(`${k} needs a positive number`); return n; };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i], v = argv[i + 1];
    if (k === '--app-pid') { a.appPid = num(k, v); i++; }
    else if (k === '--shadow-every') { a.shadowMs = num(k, v) * 1000; i++; }
    else if (k === '--max-calls') { a.maxCalls = num(k, v); i++; }
    else if (k === '--daily-cap') { a.dailyCap = num(k, v); i++; }
    else if (k === '--pid-poll-ms') { a.pidPollMs = num(k, v); i++; }
    else throw new Refusal(`unknown argument ${JSON.stringify(k)}`);
  }
  if (!a.appPid) throw new Refusal('--app-pid <pid> is required: the runner lives exactly as long as that process');
  if (a.maxCalls && a.maxCalls > shadowMod.HARD_CAP) throw new Refusal(`--max-calls is at most ${shadowMod.HARD_CAP}`);
  return a;
}

/** CONSONANCE_DATA, else ~/.consonance.json data_dir, else null — the same order as every other tool here. */
function dataDirOf(env = process.env) {
  const e = String(env.CONSONANCE_DATA || '').trim();
  if (e) return e;
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^﻿/, ''));
    return cfg && cfg.data_dir ? String(cfg.data_dir) : null;
  } catch { return null; }
}

async function main(argv = process.argv.slice(2), env = process.env) {
  let a;
  try { a = parseArgs(argv); } catch (e) { process.stderr.write(`jev-shadow-runner: REFUSED — ${e.message}\n`); return 2; }
  try {
    const h = await run({
      ...a,
      store: env.JEV_SHADOW_STORE || defaultStore(env),
      shellDir: env.CONSONANCE_SHELL_DIR || path.join(os.homedir(), '.claude', 'shell'),
      disciplineDir: env.JEV_SHADOW_DISCIPLINE || path.resolve(__dirname, '..', '..'),   // this checkout's root (see jev-shadow.js)
      // JUDGE MODE's two inputs (L071). The app spawns this runner WITHOUT CONSONANCE_DATA (main.rs env_remove), so the
      // data dir comes from ~/.consonance.json's data_dir — the one place both machines declare it. None → judge mode
      // says so once and stays off; the shadow is unaffected.
      dataDir: dataDirOf(env),
      projectsDir: env.CLAUDE_PROJECTS_DIR || path.join(os.homedir(), '.claude', 'projects'),
      env,
      readUserEnv: env.JEV_SHADOW_NO_USER_ENV === '1' ? () => null : readUserEnv,
    });
    for (const sig of ['SIGINT', 'SIGTERM', 'SIGBREAK']) process.on(sig, () => h.stop(sig));
    await h.done;
    return 0;
  } catch (e) {
    process.stderr.write(`jev-shadow-runner: ${e instanceof AlreadyRunning ? 'ALREADY RUNNING' : e instanceof Refusal ? 'REFUSED' : 'FAILED'} — ${jev.scrub(e.message, (env.AI_GATEWAY_API_KEY || '').trim())}\n`);
    return e.exitCode || 1;
  }
}

module.exports = { run, parseArgs, parseRegQuery, readUserEnv, defaultStore, dataDirOf, isAlive, DEFAULTS, Refusal, AlreadyRunning };

if (require.main === module) main().then((code) => { process.exitCode = code; });
