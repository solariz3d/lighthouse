// dispatch-gate-report.js — the gate's cited-rate SPLIT BY MODE, and a pooled figure REFUSED.
//
// WHY A SEPARATE FILE. `dispatch-gate.js` is the hook and the object under test; `7d40480` says
// "--report can split the cited-rate by mode" but the hook exposes no `--report` (its CLI is
// `--quarantine` and `--outcomes`, and the only cited-rate it prints is the POOLED line inside the
// quarantine dry-run). This file is where the split lives, importing the hook's own classifier so
// the two never disagree about which rows are real.
//
// WHY NO POOLED FIGURE, EVER. `7d40480` switched GATE_MODE from 'ask' to 'print' at one instant. The
// rows before it were written under a gate that STOPPED the verb for a click; the rows after under a
// gate that only prints. Those are two populations, and the registered falsifier — "if the cited-rate
// under 'print' does not fall well below the 90.4% measured under 'ask', THE ASK WAS NOT THE LEVER" —
// is scoreable only if they are never added together. A pooled rate is L017 again: a number that
// looks like a measurement of a behaviour and is actually a ratio of two periods' row counts.
//
// HOW A ROW IS BUCKETED, in this order, and it is deliberately not by date alone:
//   mode:'print' | mode:'ask'   the row says which gate wrote it          -> that bucket
//   no mode field, ts <  switch  written before the field existed          -> 'ask' by construction
//   no mode field, ts >= switch  written AFTER the switch by a hook that does not stamp mode,
//                                i.e. an INSTALLED COPY OLDER THAN THE COMMIT -> 'unstamped', counted
//                                in NEITHER rate and printed on its own line, because that is a fact
//                                about deployment and hiding it inside 'ask' would hide a stale hook.
// Rows are never backfilled; this file never writes.
//
// Run:  node consonance/tools/dispatch-gate-report.js [--since <iso>]
//       node consonance/tools/dispatch-gate-report.js --pooled      -> refuses, exit 1
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { classifyLedger } = require('../hooks/dispatch-gate.js');

// The instant GATE_MODE became 'print': the commit time of 7d40480.
//   git log -1 --format=%cI 7d40480   ->   2026-08-31T05:40:04-06:00
// The hook's own GATE_MODE_SINCE is a bare date ('2026-08-31') and is not exported; a date is too
// coarse here because rows written that morning BEFORE 05:40 local were asked, and were.
const MODE_SWITCH_ISO = '2026-08-31T11:40:04Z';

function dataDir() {
  const env = (process.env.CONSONANCE_DATA || '').trim();
  if (env) return env;
  try {
    const raw = fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^﻿/, '');
    const d = String((JSON.parse(raw) || {}).data_dir || '').trim();
    if (d) return d;
  } catch (_) {}
  return null;
}

function readLedger(file) {
  return fs.readFileSync(file, 'utf8').split(/\r?\n/).filter((s) => s.trim()).map((s) => JSON.parse(s));
}

/// Which population a row belongs to. Pure.
function bucketOf(row, switchIso) {
  if (row.mode === 'print' || row.mode === 'ask') return row.mode;
  const t = Date.parse(row.ts);
  if (Number.isFinite(t) && t < Date.parse(switchIso || MODE_SWITCH_ISO)) return 'ask';
  return 'unstamped';
}

/// rows in, three tallies out — and NOTHING that adds two of them together. Pure.
/// `cited` and `gated` follow the hook's own quarantine line exactly: cited = sha|path,
/// gated = allowed|asked. An [interrupt] row is gated and uncited, and is counted on its own too.
function splitByMode(rows, switchIso) {
  const since = switchIso || MODE_SWITCH_ISO;
  const mk = () => ({ gated: 0, cited: 0, asked: 0, interrupt: 0, byConstruction: 0 });
  const s = { switchIso: since, ask: mk(), print: mk(), unstamped: mk() };
  for (const r of rows) {
    if (r.outcome !== 'allowed' && r.outcome !== 'asked') continue;   // 'inert' rows measure nothing
    const b = bucketOf(r, since);
    const t = s[b];
    t.gated++;
    if (r.cited === 'sha' || r.cited === 'path') t.cited++;
    if (r.outcome === 'asked') t.asked++;
    if (r.cited === 'interrupt') t.interrupt++;
    if (b === 'ask' && !(r.mode === 'ask')) t.byConstruction++;
  }
  return s;
}

function rateLine(label, t) {
  const rate = t.gated ? (t.cited / t.gated * 100).toFixed(1) + '%' : 'NOT REPORTABLE — no rows';
  return '  ' + label.padEnd(6) + t.cited + ' cited of ' + t.gated + ' gated = ' + rate +
         '   (asked ' + t.asked + ', [interrupt] ' + t.interrupt + ')';
}

/// The report text. The refusal is a LINE, printed every run, so its absence would be visible.
function render(split) {
  const lines = [];
  lines.push('dispatch-gate cited-rate BY MODE   (switch: ' + split.switchIso + ' = 7d40480)');
  lines.push(rateLine('ask', split.ask) +
             (split.ask.byConstruction ? '   incl. ' + split.ask.byConstruction +
              ' pre-switch rows with no mode field — ask by construction, not backfilled' : ''));
  lines.push(rateLine('print', split.print));
  if (split.unstamped.gated) {
    lines.push('  UNSTAMPED after the switch: ' + split.unstamped.gated + ' row(s) with no mode field ' +
               'written after ' + split.switchIso + ' — an installed hook older than 7d40480 wrote them. ' +
               'Counted in NEITHER mode. Run dev/shell/install.ps1 -Check.');
  }
  lines.push('  pooled figure: REFUSED — two periods are not one population (L017).');
  return lines.join('\n');
}

function cli(argv) {
  if (argv.includes('--pooled')) {
    console.error('refusing: a cited-rate pooled across ask and print is two populations reported as one ' +
                  '(L017). Read the per-mode lines.');
    return 1;
  }
  const i = argv.indexOf('--since');
  const since = i >= 0 ? argv[i + 1] : MODE_SWITCH_ISO;
  if (!Number.isFinite(Date.parse(since))) { console.error('refusing: --since is not an ISO instant'); return 1; }
  const dir = dataDir();
  if (!dir) { console.error('no data dir resolved (CONSONANCE_DATA or data_dir in ~/.consonance.json)'); return 1; }
  const rows = readLedger(path.join(dir, 'dispatch-gate.jsonl'));
  const c = classifyLedger(rows);
  if (c.keep.length + c.quarantine.length !== rows.length) { console.error('refusing: partition does not sum'); return 1; }
  console.log(render(splitByMode(c.keep, since)));
  console.log('  rows ' + rows.length + '   test-run rows excluded ' + c.quarantine.length +
              '   (' + path.join(dir, 'dispatch-gate.jsonl') + ')');
  return 0;
}

if (require.main === module) process.exit(cli(process.argv.slice(2)));

module.exports = { MODE_SWITCH_ISO, bucketOf, splitByMode, render };
