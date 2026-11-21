// usage-ledger.js (L213, pane A): one row per turn per seat of NUMBERS, so the room can see which seat moves the weekly limit.
//
// ONE FILE, TWO REGISTRATIONS, told apart by what the harness puts on stdin (probed on 2.1.330, 2026-11-21; the keys are in
// exo_memory/handback/p-l213-usage-ledger-A_2026-11-21.md):
//   · the STATUS LINE (settings.statusLine) gets cost, context_window.current_usage, prompt_cache and, after the first response,
//     rate_limits. It fires several times a turn, so a row is written once per (session, prompt_id, cache requests).
//   · a SessionStart hook gets, on a resume, seconds_since_last_response, context_tokens, prompt_cache_likely_expired and
//     estimated_cache_write_usd: a WAKE row, the cost of coming back to a cold cache.
// It writes <data>/usage-ledger.jsonl and prints, for the status line only, one short line. It never blocks and always exits 0.
//
// NUMBERS ONLY. No transcript text, no folder, no account, no session name, no path: a string in a row is a seat id (8), a session
// id (8), a model id, an effort word or a source word, and the tests hold every one of them to 40 characters.
//
//   row (kind 'turn'): v t kind seat session model effort seven_day_pct seven_day_resets five_hour_pct five_hour_resets
//     cache_warm cache_requests cache_misses cache_hit_ratio cache_write recache_if_cold in out cache_create cache_read
//     ctx_pct ctx_size total_in total_out cost_usd dur_ms
//   row (kind 'wake'): v t kind seat session source seconds_since context_tokens cache_expired est_cache_write_usd
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');

if (process.env.CONSONANCE_DREAM) process.exit(0);   // the gap-dream gets no hooks (consonance/hooks/dream-gate.test.js)

const LEDGER = 'usage-ledger.jsonl';
const WATCHDOG_MS = 3000;   // a hook never waits on a stdin that does not end

function dataDir(env = process.env) {
  const e = String(env.CONSONANCE_DATA || '').trim();
  if (e) return e;
  try { const d = String((JSON.parse(fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^﻿/, '')) || {}).data_dir || '').trim(); if (d) return d; } catch (_) { /* no config */ }
  return path.join(os.homedir(), '.consonance');
}
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const short = (v, n) => (typeof v === 'string' && v ? v.slice(0, n) : null);
const seatOf = (env) => short(String(env.CONSONANCE_PANE || '').trim(), 8);

function rowFromStatus(p, env = process.env, now = Date.now()) {
  const cw = (p && p.context_window) || {}, cu = cw.current_usage || {}, pc = (p && p.prompt_cache) || {};
  const rl = (p && p.rate_limits) || {}, sd = rl.seven_day || {}, fh = rl.five_hour || {}, cost = (p && p.cost) || {};
  return {
    v: 1, t: new Date(now).toISOString(), kind: 'turn', seat: seatOf(env), session: short(p && p.session_id, 8),
    model: short(p && p.model && p.model.id, 40), effort: short(p && p.effort && p.effort.level, 12),
    seven_day_pct: num(sd.used_percentage), seven_day_resets: num(sd.resets_at), five_hour_pct: num(fh.used_percentage), five_hour_resets: num(fh.resets_at),
    cache_warm: typeof pc.warm === 'boolean' ? pc.warm : null, cache_requests: num(pc.requests), cache_misses: num(pc.misses), cache_hit_ratio: num(pc.hit_ratio),
    cache_write: num(pc.cache_write_tokens), recache_if_cold: num(pc.recache_tokens_if_cold),
    in: num(cu.input_tokens), out: num(cu.output_tokens), cache_create: num(cu.cache_creation_input_tokens), cache_read: num(cu.cache_read_input_tokens),
    ctx_pct: num(cw.used_percentage), ctx_size: num(cw.context_window_size), total_in: num(cw.total_input_tokens), total_out: num(cw.total_output_tokens),
    cost_usd: num(cost.total_cost_usd), dur_ms: num(cost.total_duration_ms),
  };
}

function rowFromWake(p, env = process.env, now = Date.now()) {
  return {
    v: 1, t: new Date(now).toISOString(), kind: 'wake', seat: seatOf(env), session: short(p && p.session_id, 8), source: short(p && p.source, 12),
    seconds_since: num(p && p.seconds_since_last_response), context_tokens: num(p && p.context_tokens),
    cache_expired: typeof (p && p.prompt_cache_likely_expired) === 'boolean' ? p.prompt_cache_likely_expired : null, est_cache_write_usd: num(p && p.estimated_cache_write_usd),
  };
}

function append(dir, row) {
  fs.mkdirSync(dir, { recursive: true });
  fs.appendFileSync(path.join(dir, LEDGER), JSON.stringify(row) + '\n');
}

// A status line payload carries no hook_event_name; a hook payload does. Returns { wrote, line } and never throws.
function handle(p, env = process.env, now = Date.now()) {
  try {
    if (!p || typeof p !== 'object') return { wrote: false };
    const dir = dataDir(env);
    if (p.hook_event_name === 'SessionStart') {
      if (p.source !== 'resume' && p.source !== 'compact' && p.source !== 'startup' && p.source !== 'clear') return { wrote: false };
      append(dir, rowFromWake(p, env, now));
      return { wrote: true };
    }
    if (p.hook_event_name) return { wrote: false };
    const cu = p.context_window && p.context_window.current_usage;
    const rl = p.rate_limits && p.rate_limits.seven_day;
    const line = [rl && typeof rl.used_percentage === 'number' ? '7d ' + rl.used_percentage + '%' : null, p.prompt_cache ? 'cache ' + (p.prompt_cache.warm ? 'warm' : 'cold') : null].filter(Boolean).join(' · ');
    if (!cu) return { wrote: false, line };   // the first line of a session: nothing used yet
    const seat = seatOf(env) || short(p.session_id, 8) || 'x';
    const key = [p.prompt_id || '', p.prompt_cache && p.prompt_cache.requests, p.context_window.total_output_tokens].join(':');
    const stateDir = path.join(dir, 'usage-ledger-state');
    const stateFile = path.join(stateDir, seat + '.txt');
    let last = ''; try { last = fs.readFileSync(stateFile, 'utf8'); } catch (_) { /* first row of this seat */ }
    if (last === key) return { wrote: false, line };
    append(dir, rowFromStatus(p, env, now));
    fs.mkdirSync(stateDir, { recursive: true }); fs.writeFileSync(stateFile, key);
    return { wrote: true, line };
  } catch (_) { return { wrote: false }; }
}

function main() {
  setTimeout(() => process.exit(0), WATCHDOG_MS).unref();   // fail OPEN on a hang, as the room's other hooks do
  let raw = '';
  process.stdin.on('data', (d) => (raw += d));
  process.stdin.on('end', () => {
    let p = null; try { p = JSON.parse(raw); } catch (_) { /* not JSON */ }
    const r = handle(p, process.env);
    if (r.line) process.stdout.write(r.line);
    process.exit(0);
  });
}
if (require.main === module) main();

module.exports = { rowFromStatus, rowFromWake, handle, dataDir, LEDGER };
