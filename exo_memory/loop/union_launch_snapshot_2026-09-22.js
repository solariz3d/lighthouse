#!/usr/bin/env node
'use strict';
// union_launch_snapshot — the BEFORE/AFTER instrument for the keeper's first launch with union-at-launch (D122, pane A).
//
//   node exo_memory/loop/union_launch_snapshot_2026-09-22.js --before
//   node exo_memory/loop/union_launch_snapshot_2026-09-22.js --after <the snapshot file --before printed>
//
// READ-ONLY on the room. It reads the data dir and the state dir named in ~/.consonance.json (or CONSONANCE_DATA /
// CONSONANCE_STATE), and it writes ONE file, the snapshot, under the OS temp dir — never the data dir, never the repo.
//
// THE UNIT IS writeUnion's OWN (ledger-union.js step 7): COMPLETE LINES, AS A MULTISET. A partial last line is a writer
// mid-line and is not counted, exactly as `completeLines` leaves it. Each line is kept as its sha256 with a COUNT, so a
// line held twice is two, and "after holds at least as many of every line as before" is a comparison of counts — the
// check A's FATAL-1 showed a set test cannot make (board.jsonl holds 7,514 duplicate rows on D).
//
// THE FILES are the MANIFEST's `install: "fast-forward"` set, read from consonance/state-manifest.json — the same list
// the union step reads (§7.4), not a copy of it.
const fs = require('fs'), path = require('path'), os = require('os'), crypto = require('crypto');
const REPO = path.resolve(__dirname, '..', '..');
const LU = require(path.join(REPO, 'consonance', 'tools', 'ledger-union.js'));

function cfg() {
  let c = {};
  try { c = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^﻿/, '')); } catch (_) {}
  const data = process.env.CONSONANCE_DATA || c.data_dir;
  const state = process.env.CONSONANCE_STATE || c.state_dir;
  if (!data || !state) throw new Error('no data dir or state dir: set them in ~/.consonance.json (data_dir, state_dir)');
  return { data, state };
}
function ledgers() {
  const m = JSON.parse(fs.readFileSync(path.join(REPO, 'consonance', 'state-manifest.json'), 'utf8'));
  const out = [];
  const walk = (o) => { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') { if (o.install === 'fast-forward' && o.glob) out.push(o.glob); Object.values(o).forEach(walk); } };
  walk(m);
  return [...new Set(out)];
}
const h = (s) => crypto.createHash('sha256').update(s).digest('hex');
function multiset(file) {
  let buf;
  try { buf = fs.readFileSync(file); } catch (_) { return null; }
  const lines = LU.completeLines(buf, 0).lines;
  const counts = {};
  for (const l of lines) { const k = h(l); counts[k] = (counts[k] || 0) + 1; }
  const digest = h(Object.keys(counts).sort().map((k) => `${k}:${counts[k]}`).join('\n'));
  return { lines: lines.length, distinct: Object.keys(counts).length, multiset_sha256: digest, counts };
}

function before() {
  const { data, state } = cfg();
  const snap = { taken_at: new Date().toISOString(), data, state, files: {} };
  console.log(`BEFORE · ${snap.taken_at} · data ${data}`);
  console.log('  file'.padEnd(30) + 'lines'.padStart(9) + 'distinct'.padStart(10) + '  multiset sha256 (first 16)  arriving lines');
  for (const g of ledgers()) {
    const live = multiset(path.join(data, g));
    const arr = multiset(path.join(state, 'data', g));
    snap.files[g] = { live, arriving: arr ? { lines: arr.lines, counts: arr.counts } : null };
    console.log(`  ${g.padEnd(28)}${String(live ? live.lines : '-').padStart(9)}${String(live ? live.distinct : '-').padStart(10)}  ${live ? live.multiset_sha256.slice(0, 16) : '(absent)          '}          ${arr ? arr.lines : '(none)'}`);
  }
  const dir = path.join(os.tmpdir(), 'consonance-union-watch');
  fs.mkdirSync(dir, { recursive: true });
  const out = path.join(dir, `before-${snap.taken_at.replace(/[:.]/g, '-')}.json`);
  fs.writeFileSync(out, JSON.stringify(snap));
  console.log(`\nsnapshot: ${out}\n  AFTER the launch run:  node exo_memory/loop/union_launch_snapshot_2026-09-22.js --after "${out}"`);
  return 0;
}

function after(file) {
  const snap = JSON.parse(fs.readFileSync(file, 'utf8'));
  const { data } = cfg();
  console.log(`AFTER · ${new Date().toISOString()} · against BEFORE ${snap.taken_at}`);
  let lost = 0;
  for (const [g, b] of Object.entries(snap.files)) {
    if (!b.live) { console.log(`  ${g.padEnd(28)} was absent before — nothing to lose`); continue; }
    const a = multiset(path.join(data, g));
    if (!a) { console.log(`  ${g.padEnd(28)} STOP: the live file is GONE (it was ${b.live.lines} lines)`); lost += b.live.lines; continue; }
    let short = 0, fromArriving = 0, newHere = 0;
    for (const [k, n] of Object.entries(b.live.counts)) { const have = a.counts[k] || 0; if (have < n) short += n - have; }
    const arr = (b.arriving && b.arriving.counts) || {};
    for (const [k, n] of Object.entries(a.counts)) {
      const extra = n - (b.live.counts[k] || 0);
      if (extra <= 0) continue;
      const fromA = Math.min(extra, Math.max(0, (arr[k] || 0) - (b.live.counts[k] || 0)));
      fromArriving += fromA; newHere += extra - fromA;
    }
    lost += short;
    const verdict = short ? `STOP: ${short} line(s) held before are MISSING now` : 'ok  (after ⊇ before, as a multiset)';
    console.log(`  ${g.padEnd(28)} ${String(b.live.lines).padStart(7)} → ${String(a.lines).padStart(7)}   +${fromArriving} from the arriving copy, +${newHere} written here since   ${verdict}`);
  }
  console.log(lost ? `\nSTOP — ${lost} line(s) that existed before the launch are not in the live files. Do not keep using the app; a seat must look.` : '\nPASS — every line held before the launch is still held, at least as many times.');
  return lost ? 1 : 0;
}

const argv = process.argv.slice(2);
try {
  if (argv[0] === '--before') process.exit(before());
  if (argv[0] === '--after' && argv[1]) process.exit(after(argv[1]));
  console.error('usage: --before | --after <snapshot file>'); process.exit(2);
} catch (e) { console.error(`union_launch_snapshot: ${e.message}`); process.exit(2); }
