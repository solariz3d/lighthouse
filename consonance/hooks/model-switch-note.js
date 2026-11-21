// model-switch-note.js (L214, pane A): PreModelSwitch hook. Before a model switch in a seat whose prompt cache is WARM, say how many tokens the
// switch will rewrite. It WARNS; it never blocks (it prints no decision and always exits 0).
//
// WHY. Tonight's launch switched pane A's model twice, and two switches in warm seats on 11-14 rewrote 199k and 414k tokens (the L214 packet's "Why"):
// a different model has its own cache, so a switch re-reads the whole context uncached. The harness hands PreModelSwitch from_model, to_model,
// requested_model, source, context_tokens, prompt_cache_warm, cache_ttl, estimated_cache_write_usd and pricing (probed on 2.1.330, 2026-11-21, by a
// stream-json set_model: handback/p-l214-spend-less-A_2026-11-21.md). It also records one numbers-only row per switch to <data>/model-switch.jsonl,
// so the record of a switch is written AT the switch and not after it.
//
// The note appears only when the cache is warm AND the context is at least MIN tokens (default 50,000; CONSONANCE_MODELSWITCH_MIN overrides): a cold
// seat has nothing to lose, a small one little. Output is {"systemMessage": "..."}.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');

if (process.env.CONSONANCE_DREAM) process.exit(0);   // the gap-dream gets no hooks (consonance/hooks/dream-gate.test.js)

const LEDGER = 'model-switch.jsonl';
const WATCHDOG_MS = 3000;
const DEFAULT_MIN = 50000;

function dataDir(env = process.env) {
  const e = String(env.CONSONANCE_DATA || '').trim();
  if (e) return e;
  try { const d = String((JSON.parse(fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^﻿/, '')) || {}).data_dir || '').trim(); if (d) return d; } catch (_) { /* no config */ }
  return path.join(os.homedir(), '.consonance');
}
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const short = (v, n) => (typeof v === 'string' && v ? v.slice(0, n) : null);

/** The note for a switch, or null. Pure. */
function note(p, env = process.env) {
  if (!p || typeof p !== 'object') return null;
  const min = Number(env.CONSONANCE_MODELSWITCH_MIN) > 0 ? Number(env.CONSONANCE_MODELSWITCH_MIN) : DEFAULT_MIN;
  const ctx = num(p.context_tokens);
  if (p.prompt_cache_warm !== true || ctx === null || ctx < min) return null;
  if (p.from_model && p.to_model && p.from_model === p.to_model) return null;
  const usd = num(p.estimated_cache_write_usd);
  return `model switch ${short(p.from_model, 40) || '?'} -> ${short(p.to_model, 40) || '?'}: this seat's cache is warm, and the switch will rewrite about ${Math.round(ctx / 1000)}k tokens`
    + (usd !== null ? ` (an estimated $${usd.toFixed(2)} at list price)` : '') + '.';
}

function rowFrom(p, now = Date.now()) {
  return { v: 1, t: new Date(now).toISOString(), kind: 'model-switch', session: short(p && p.session_id, 8), from: short(p && p.from_model, 40), to: short(p && p.to_model, 40),
    source: short(p && p.source, 12), context_tokens: num(p && p.context_tokens), warm: typeof (p && p.prompt_cache_warm) === 'boolean' ? p.prompt_cache_warm : null,
    est_usd: num(p && p.estimated_cache_write_usd) };
}

// Never throws. Returns { text } for the note (or null).
function handle(p, env = process.env, now = Date.now()) {
  try {
    if (!p || typeof p !== 'object' || (p.hook_event_name && p.hook_event_name !== 'PreModelSwitch')) return { text: null };
    try { const d = dataDir(env); fs.mkdirSync(d, { recursive: true }); fs.appendFileSync(path.join(d, LEDGER), JSON.stringify(rowFrom(p, now)) + '\n'); } catch (_) { /* the note matters more than the record */ }
    return { text: note(p, env) };
  } catch (_) { return { text: null }; }
}

function main() {
  setTimeout(() => process.exit(0), WATCHDOG_MS).unref();   // fail OPEN on a hang
  let raw = '';
  process.stdin.on('data', (d) => (raw += d));
  process.stdin.on('end', () => {
    let p = null; try { p = JSON.parse(raw); } catch (_) { /* not JSON */ }
    const r = handle(p, process.env);
    if (r.text) process.stdout.write(JSON.stringify({ systemMessage: r.text }));
    process.exit(0);
  });
}
if (require.main === module) main();

module.exports = { note, rowFrom, handle, dataDir, LEDGER };
