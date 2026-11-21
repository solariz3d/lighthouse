// usage-ledger.js (the reader, L213, pane A): which seat moved the 7-day figure.
//   node consonance/tools/usage-ledger.js --since <ISO> [--file <ledger.jsonl>] [--json]
// Reads <data>/usage-ledger.jsonl (written by consonance/hooks/usage-ledger.js) and prints, per seat, how far the account's 7-day
// figure moved on that seat's turns, beside its tokens by class.
//
// THE RULE AND ITS LIMIT. The 7-day figure is one number for the account, in whole percent, reported with each turn. Walking the
// turn rows in time order, a row whose figure is above the one before it (whichever seat wrote that) carries the difference: "the
// seat whose turn reported the move". A drop, or a new reset time, is a new window and counts as no movement. So: with two seats
// working at once a step lands on whichever reports it first, and a step is a whole percent at least; read it as a tally over
// hours, never as one turn's cost. It is a measurement of what the figure did, not of what a turn cost.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');

function readRows(file) {
  let text = '';
  try { text = fs.readFileSync(file, 'utf8'); } catch (_) { return []; }
  const rows = [];
  for (const line of text.split('\n')) { if (!line.trim()) continue; try { rows.push(JSON.parse(line)); } catch (_) { /* a torn line is skipped */ } }
  return rows;
}

function report(rows, opts = {}) {
  const since = opts.since ? Date.parse(opts.since) : 0;
  const kept = rows.filter((r) => r && Date.parse(r.t) >= since).sort((a, b) => Date.parse(a.t) - Date.parse(b.t));
  const seats = new Map();
  const get = (id) => {
    const k = id || '?';
    if (!seats.has(k)) seats.set(k, { seat: k, turns: 0, moved: 0, in: 0, out: 0, cache_create: 0, cache_read: 0, wakes: 0, wake_tokens_cold: 0, models: new Set() });
    return seats.get(k);
  };
  let prev = null, firstPct = null, lastPct = null, withoutPct = 0;
  for (const r of kept) {
    const s = get(r.seat);
    if (r.kind === 'wake') { s.wakes += 1; if (r.cache_expired === true && typeof r.context_tokens === 'number') s.wake_tokens_cold += r.context_tokens; continue; }
    if (r.kind !== 'turn') continue;
    s.turns += 1;
    for (const f of ['in', 'out', 'cache_create', 'cache_read']) if (typeof r[f] === 'number') s[f] += r[f];
    if (r.model) s.models.add(r.model);
    if (typeof r.seven_day_pct !== 'number') { withoutPct += 1; continue; }
    if (firstPct === null) firstPct = r.seven_day_pct;
    lastPct = r.seven_day_pct;
    if (prev && prev.resets === r.seven_day_resets && r.seven_day_pct > prev.pct) s.moved += r.seven_day_pct - prev.pct;
    prev = { pct: r.seven_day_pct, resets: r.seven_day_resets };
  }
  const list = [...seats.values()].map((s) => ({ ...s, models: [...s.models] })).sort((a, b) => b.moved - a.moved || b.out - a.out || (a.seat < b.seat ? -1 : 1));
  return { since: opts.since || null, rows: kept.length, rows_without_pct: withoutPct, first_pct: firstPct, last_pct: lastPct, seats: list };
}

function lettersFor() {
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^﻿/, ''));
    const m = JSON.parse(fs.readFileSync(path.join(String(cfg.data_dir), 'letters.json'), 'utf8').replace(/^﻿/, ''));
    return m && typeof m === 'object' ? m : {};
  } catch (_) { return {}; }
}

function render(out, letters = {}) {
  const lines = [];
  lines.push(`7-day figure: ${out.first_pct === null ? 'none seen' : out.first_pct + '% -> ' + out.last_pct + '%'}  (${out.rows} rows since ${out.since || 'the start'}${out.rows_without_pct ? ', ' + out.rows_without_pct + ' turn rows without it' : ''})`);
  lines.push('seat      pane  moved   turns   in        out       cache_create  cache_read   wakes  cold_wake_tokens  models');
  for (const s of out.seats) {
    const key = Object.keys(letters).find((k) => String(k).slice(0, 8) === s.seat);
    const pane = key ? letters[key] : '';
    lines.push(`${String(s.seat).padEnd(9)} ${String(pane).padEnd(5)} ${('+' + s.moved).padEnd(7)} ${String(s.turns).padEnd(7)} ${String(s.in).padEnd(9)} ${String(s.out).padEnd(9)} ${String(s.cache_create).padEnd(13)} ${String(s.cache_read).padEnd(12)} ${String(s.wakes).padEnd(6)} ${String(s.wake_tokens_cold).padEnd(17)} ${s.models.join(',')}`);
  }
  return lines.join('\n');
}

function main(argv) {
  const opt = { file: null, since: null, json: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--since') opt.since = argv[++i];
    else if (argv[i] === '--file') opt.file = argv[++i];
    else if (argv[i] === '--json') opt.json = true;
    else { console.error('unknown argument ' + argv[i]); return 2; }
  }
  if (opt.since && !Number.isFinite(Date.parse(opt.since))) { console.error('--since is not a date: ' + opt.since); return 2; }
  const { dataDir } = require('../hooks/usage-ledger.js');
  const file = opt.file || path.join(dataDir(), 'usage-ledger.jsonl');
  const out = report(readRows(file), { since: opt.since });
  console.log(opt.json ? JSON.stringify(out) : render(out, lettersFor()));
  return 0;
}

if (require.main === module) process.exit(main(process.argv.slice(2)));
module.exports = { report, readRows, render };
