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
// L105: the data dir, the discipline dir and the room come from ONE resolver, shared by every Jev tool.
const room = require('./jev-room.js');

const { Refusal } = jev;
class AlreadyRunning extends Error { constructor(m) { super(m); this.exitCode = 3; } }

/* THE CAP, PARTITIONED (L074). The keeper handed the call to the librarian (librarian/2026-09-22.md, 04:0x): 2,000 calls a
 * day IN ALL, 600 of them RESERVED for the shadow — judge mode's share is the other 1,400, so it can never starve the
 * shadow, and the shadow's measurement (busiest measured day 535) never has to compete. Measured on L: ~55 judge calls an
 * hour in an active lap at ~4,240 input tokens each; 2,000 a day is ~$0.36 at worst. The cap is a FUSE, not a budget.
 * A partition, not a shared pool with a floor: each mode's limit is its own, and the total is checked on every call.
 *
 * RETENTION (L074): judge CAPTURES (the conversation text a verdict was made on, ~27 KB each, ~20 MB a day) are kept 14
 * days and then deleted here; the verdict ROWS (jev_judge.jsonl: hashes, not text) are never touched. */
const DEFAULTS = { captureMs: 3000, shadowMs: 10 * 60 * 1000, pidPollMs: 5000, maxCalls: 25, dailyCap: 2000, shadowReserve: 600,
  retainDays: 14, pruneMs: 60 * 60 * 1000 };
const DAY_MS = 24 * 60 * 60 * 1000;

/** What each mode may still spend today. The shadow's limit is its reserve; judge mode's is the rest; the total is the fuse. */
function budget({ dailyCap, shadowReserve, shadowToday, judgeToday }) {
  const total = dailyCap - shadowToday - judgeToday;
  const shadowLimit = Math.min(shadowReserve, dailyCap);
  const judgeLimit = Math.max(0, dailyCap - shadowReserve);
  return {
    shadowLeft: Math.max(0, Math.min(shadowLimit - shadowToday, total)),
    judgeLeft: Math.max(0, Math.min(judgeLimit - judgeToday, total)),
    totalLeft: Math.max(0, total), shadowLimit, judgeLimit,
  };
}

/**
 * Delete judge captures older than retainDays. ONLY files directly inside <store>/judge-captures ending in .json — no
 * recursion, no directories, no links, and each path is checked to sit in that directory before it is unlinked. The age
 * is the capture's own captured_at; a capture whose date cannot be read falls back to its file time.
 */
function pruneJudgeCaptures({ store, now = () => new Date(), retainDays = DEFAULTS.retainDays }) {
  const dir = path.resolve(store, judgeMod.CAPTURES);
  const res = { dir, pruned: 0, kept: 0, deleted: [] };
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return res; }
  const cutoff = now().getTime() - retainDays * DAY_MS;
  for (const e of entries) {
    if (!e.isFile() || !e.name.endsWith('.json')) continue;
    const p = path.join(dir, e.name);
    if (path.dirname(path.resolve(p)) !== dir) continue;          // never outside the capture directory
    let t = NaN;
    try { t = Date.parse(JSON.parse(fs.readFileSync(p, 'utf8')).captured_at); } catch { /* undated */ }
    if (!Number.isFinite(t)) { try { t = fs.statSync(p).mtimeMs; } catch { continue; } }
    if (t < cutoff) { fs.unlinkSync(p); res.pruned++; res.deleted.push(p); } else res.kept++;
  }
  return res;
}

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
  // L105: without METHOD.md neither the shadow nor judge mode can build the prompt the judge saw. Before, an installed copy
  // defaulted to `__dirname/../..` and logged a capture error on every tick; now it refuses ONCE, here, and says why.
  if (!cfg.disciplineDir) {
    const m = `no discipline dir — ${cfg.disciplineWhy || 'none was given to run()'}`;
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
  let stopping = false, inFlight = Promise.resolve(), shadowBusy = false;
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
  const shadowToday = () => {
    const today = new Date().toDateString();
    let n = 0;
    try {
      for (const l of fs.readFileSync(path.join(store, 'shadow.jsonl'), 'utf8').split('\n')) {
        if (!l) continue;
        try { const r = JSON.parse(l); if (r.status === 'ok' && new Date(r.ts).toDateString() === today) n++; } catch {}
      }
    } catch {}
    return n;
  };
  const budgetNow = () => budget({ dailyCap: cfg.dailyCap, shadowReserve: cfg.shadowReserve,
    shadowToday: shadowToday(), judgeToday: judgeMod.callsToday(store, new Date().toDateString()) });
  // One line per limit per day: which limit, so a stopped mode says WHY it stopped.
  const capLogged = new Set();
  const logCap = (b, mode) => {
    const why = b.totalLeft <= 0 ? `daily cap of ${cfg.dailyCap} calls reached — no more calls today`
      : mode === 'shadow' ? `shadow reserve of ${b.shadowLimit} reached — the rest of the day is judge mode's`
      : `judge cap of ${b.judgeLimit} reached — the rest of the day is the shadow's reserve`;
    const key = `${new Date().toDateString()}:${why}`;
    if (!capLogged.has(key)) { capLogged.add(key); log(why); }
  };

  // JUDGE MODE state. Off, with its reason said ONCE, when it cannot run; the shadow never depends on it.
  let judgeOff = (cfg.dataDir && cfg.projectsDir) ? null : 'no data dir or projects dir was given to run()';
  const judgeMemo = {};
  // L105: `repo` is passed through as given, never defaulted to `__dirname/../..` — jev-room.js roomOf tries room_path, then
  // the checkout this file sits in, and says which.
  const judgeCfg = { store, repo: cfg.repo, dataDir: cfg.dataDir,
    projectsDir: cfg.projectsDir, disciplineDir: cfg.disciplineDir };
  if (judgeOff) log(`judge mode off: ${judgeOff}`);
  const judgeFailed = (e) => { judgeOff = e.message; log(`judge mode off: ${e.message} — the shadow keeps running`); };
  // D123: CONSONANCE_JEV_MODULE, read HERE and nowhere else, from the app's own environment (cfg.env). Exactly "on"
  // routes judge mode through the standalone jev/ module (jev-judge.js loadJevModule says what changes); anything else,
  // including unset — the default — is today's path, and nothing below is different. A module that cannot load turns
  // judge mode OFF, loudly: judging on the old path when the new one was asked for would be a silent substitution.
  let jevModule = null;
  if (!judgeOff && judgeMod.jevModuleOn(cfg.env)) {
    try {
      jevModule = judgeMod.loadJevModule({ repo: cfg.repo, env: cfg.env });
      judgeCfg.jevModule = jevModule;
      log(`judge mode via the jev/ module (${judgeMod.JEV_MODULE_FLAG}=on; config ${jevModule.configFile})`);
    } catch (e) { if (e instanceof Refusal) judgeFailed(e); else throw e; }
  }

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
    const left = budgetNow().shadowLeft;
    if (left <= 0) { logCap(budgetNow(), 'shadow'); /* judge mode may still run */ }
    shadowBusy = true;
    inFlight = (left > 0
      ? shadowMod.shadow({ ...base, maxCalls: Math.min(cfg.maxCalls, left), env, fetchImpl: cfg.fetchImpl })
      : Promise.resolve({ asked: 0, refused: 0, remaining: 0, capped: true }))
      .then((r) => {
        if (r.capped) return;
        // L079 (found by C): the shadow's failed items were never logged, and an all-503 cadence fell through to
        // "nothing to shadow" — idle and broken reading the same again. One line per failed item, key and status only,
        // written HERE (not by passing the log into shadow()), so runner.log has one writer and one format for both modes.
        for (const x of r.failed || []) log(`shadow: item ${x.key} failed (${x.status}) — skipped, retried next cadence`);
        const nFail = (r.failed || []).length;
        if (r.asked || r.refused || nFail) log(`shadow: asked ${r.asked}, refused ${r.refused}, failed ${nFail}, remaining ${r.remaining}`);
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
        const b = budgetNow();
        const rest = b.judgeLeft;
        if (rest <= 0) { logCap(b, 'judge'); return; }
        return judgeMod.judgePass({ store, maxCalls: Math.min(cfg.maxCalls, rest), env, fetchImpl: cfg.fetchImpl, jevModule })
          .then((r) => {
            // L078: a failed call no longer ends the pass. One line per failed item — its key and status, never the
            // error body, the prompt or the key — and it is retried first on the next cadence.
            for (const x of r.failed || []) log(`judge: item ${x.key} failed (${x.status}) — skipped, retried next cadence`);
            const nFail = (r.failed || []).length;
            log(r.asked || r.refused || nFail
              ? `judge: asked ${r.asked}, refused ${r.refused}, failed ${nFail}, remaining ${r.remaining}`
              : `judge: nothing new to judge (${r.captures} turns captured so far)`);
          })
          .catch((e) => { if (e instanceof Refusal) judgeFailed(e); else log(`judge error (next cadence retries): ${e.message}`); });
      })
      .finally(() => { shadowBusy = false; });
  };

  log(`started: app pid ${appPid}, capture every ${cfg.captureMs} ms, shadow every ${cfg.shadowMs} ms, `
    + `at most ${cfg.maxCalls} calls a run and ${cfg.dailyCap} a day (${Math.min(cfg.shadowReserve, cfg.dailyCap)} reserved for the shadow), `
    + `judge captures kept ${cfg.retainDays} days`);
  const doPrune = () => {
    try {
      const r = pruneJudgeCaptures({ store, retainDays: cfg.retainDays });
      if (r.pruned) log(`retention: pruned ${r.pruned} judge capture(s) older than ${cfg.retainDays} days from ${r.dir} (${r.kept} kept; the verdict rows are never pruned)`);
    } catch (e) { log(`retention error (next hour retries): ${e.message}`); }
  };
  doPrune();
  doCapture();
  doShadow();
  // A stop during the FIRST pass (a capture that refuses at once) must not be followed by timers nobody clears:
  // found D104, when that case kept the process alive forever after it had logged "stopped".
  if (!stopping) {
    timers.push(setInterval(doCapture, cfg.captureMs));
    timers.push(setInterval(doPrune, cfg.pruneMs));
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
    else if (k === '--shadow-reserve') { a.shadowReserve = num(k, v); i++; }
    else if (k === '--pid-poll-ms') { a.pidPollMs = num(k, v); i++; }
    else throw new Refusal(`unknown argument ${JSON.stringify(k)}`);
  }
  if (!a.appPid) throw new Refusal('--app-pid <pid> is required: the runner lives exactly as long as that process');
  const cap = a.dailyCap || DEFAULTS.dailyCap, reserve = a.shadowReserve || DEFAULTS.shadowReserve;
  if (reserve > cap) throw new Refusal(`the shadow reserve (${reserve}) is larger than the daily cap (${cap}) — the reserve is part of the cap, not added to it`);
  if (a.maxCalls && a.maxCalls > shadowMod.HARD_CAP) throw new Refusal(`--max-calls is at most ${shadowMod.HARD_CAP}`);
  return a;
}

/** L105: moved to jev-room.js (same order, plus a `home` for tests); kept as this module's export so its callers are unchanged. */
const dataDirOf = (env = process.env) => room.dataDirOf(env);

async function main(argv = process.argv.slice(2), env = process.env) {
  let a;
  try { a = parseArgs(argv); } catch (e) { process.stderr.write(`jev-shadow-runner: REFUSED — ${e.message}\n`); return 2; }
  // L105: the discipline dir through config — JEV_SHADOW_DISCIPLINE, else the room (jev-room.js). run() refuses, loudly, on none.
  const disc = room.disciplineDirOf({ env });
  try {
    const h = await run({
      ...a,
      store: env.JEV_SHADOW_STORE || defaultStore(env),
      shellDir: env.CONSONANCE_SHELL_DIR || path.join(os.homedir(), '.claude', 'shell'),
      disciplineDir: disc.dir, disciplineWhy: disc.why,
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

module.exports = { run, parseArgs, parseRegQuery, readUserEnv, defaultStore, dataDirOf, isAlive, budget, pruneJudgeCaptures, DEFAULTS, Refusal, AlreadyRunning };

if (require.main === module) main().then((code) => { process.exitCode = code; });
