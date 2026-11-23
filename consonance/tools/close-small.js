#!/usr/bin/env node
'use strict';
// close-small.js (B, L212, exo_memory/loop/packet_l212_close_small_B_2026-11-21.md): WHICH SEATS A "COMPACT WARM SEATS" (named "Close for the night" until L218) WOULD CUT.
//
//   node consonance/tools/close-small.js --dry-run [--json] [--warm-min 50] [--big 300000]
//
// WHY. A seat idle for more than an hour rewrites its whole context on its next call: on the laptop's night of 11-14 seven calls
// that woke large seats cold wrote 4,078k tokens, 29 % of the night's cost at list prices (the packet's "Why"). A seat cut while its
// cache is still warm wakes at about 150k instead. A COLD seat is never cut: the compaction itself would read its whole context
// uncached, which is the very cost this removes.
//
// THE RULE (decide): cut a seat only when its last call is UNDER warmMin minutes old (default 50) AND its context is OVER big tokens
// (default 300,000). Everything else is skipped, with its reason. Both numbers are dials.
//
// THIS FILE NEVER CUTS ANYTHING. It reads transcripts and the data folder and prints a list. The cut is the app's, behind his click
// ("Compact warm seats"); the app asks this file for the list (--json) so the rule lives in one place.
//
// THE SEATS: the kept panes in <data>/panes.json and the three fixed seats, which are never in panes.json (main.rs MAIN_SID,
// LIBRARIAN_SID, THIRD_PLACE_SID). Each seat's transcript is <projects>/<its folder, every non-alphanumeric as '-'>/<session>.jsonl.
//
// THE READING (lastRequest) is main.rs last_request (L067), the one keep-warm uses: the last API request is the last run of
// non-sidechain `assistant` lines sharing a requestId; it STARTED at the line just before that run; its context is that request's
// input + cache read + cache creation tokens. Only the tail of a transcript is read (a seat's can be hundreds of MB), widened until
// the whole last run and the line before it are inside.
const fs = require('fs');
const os = require('os');
const path = require('path');

const FIXED = {
  main: '0c0c0c0a-0000-4000-8000-000000000a01',
  librarian: '0c0c0c0b-0000-4000-8000-00000000115b',
  'third-place': '3d000000-0000-4000-8000-000000003d00',
};
const WARM_MIN = 50;
const BIG = 300000;
const MIN = 60 * 1000;

/** Claude Code's folder for a working directory: every character that is not a letter or a digit becomes '-'. */
const projectDir = (cwd) => String(cwd).replace(/[^A-Za-z0-9]/g, '-');

function lastRequest(jsonl) {
  const rows = [];
  for (const line of String(jsonl).split('\n')) {
    if (!line.trim()) continue;
    let v; try { v = JSON.parse(line); } catch (_) { continue; }   // a torn line (the head of a tail, or one being written)
    if (v && v.isSidechain !== true) rows.push(v);
  }
  const reqId = (v) => (v && v.type === 'assistant' && typeof v.requestId === 'string' ? v.requestId : null);
  let last = -1;
  for (let i = rows.length - 1; i >= 0; i--) if (reqId(rows[i])) { last = i; break; }
  if (last < 0) return null;
  const r = reqId(rows[last]);
  const u = (rows[last].message && rows[last].message.usage) || {};
  const context = ['input_tokens', 'cache_read_input_tokens', 'cache_creation_input_tokens'].reduce((n, k) => n + (Number(u[k]) || 0), 0);
  for (let i = last - 1; i >= 0; i--) {
    if (reqId(rows[i]) === r) continue;
    const t = Date.parse(rows[i].timestamp);
    if (Number.isFinite(t)) return { startedMs: t, context: context > 0 ? context : null };
  }
  return null;
}

/** lastRequest over the end of a file only, widened from 4 MB until it answers or the whole file was read. */
function lastRequestOfFile(file) {
  let size; try { size = fs.statSync(file).size; } catch (_) { return null; }
  for (let span = 4 << 20; ; span *= 4) {
    const n = Math.min(span, size), buf = Buffer.alloc(n);
    const fd = fs.openSync(file, 'r');
    try { fs.readSync(fd, buf, 0, n, size - n); } finally { fs.closeSync(fd); }
    const r = lastRequest(buf.toString('utf8'));
    if (r || n === size) return r;
  }
}

function decide(seat, { nowMs = Date.now(), warmMin = WARM_MIN, big = BIG } = {}) {
  if (!seat.last) return { action: 'skip', reason: seat.transcript ? 'no call recorded in its transcript' : 'no transcript found' };
  const ageMin = (nowMs - seat.last.startedMs) / MIN;
  const ctx = seat.last.context;
  if (!(ageMin < warmMin)) return { action: 'skip', reason: `cold: last call ${Math.round(ageMin)} min ago (a cut would read its whole context uncached)` };
  if (!(ctx > big)) return { action: 'skip', reason: `small: ${ctx == null ? 'context unknown' : `${Math.round(ctx / 1000)}k`} is not over ${Math.round(big / 1000)}k` };
  return { action: 'cut', reason: `warm (${Math.round(ageMin)} min) and large (${Math.round(ctx / 1000)}k)` };
}

/** L218 addendum, step 7: what happens to a COLD, LARGE seat, which the close never cuts. `listed` is ~/.consonance.json
 *  "cut_at_handback" (pane letters, empty by default): a listed pane is cut by the app just before its next dispatch; any other seat
 *  stays large until it is woken. The chair, the librarian and the Third Place are never listed (the app refuses them by name). */
const HOUSED = new Set(['main', 'chair', 'librarian', 'lib', 'third place', 'third-place', 'thirdplace']);
function coldNote(s, listed, big = BIG) {
  if (!s || s.action === 'cut' || !/^cold/.test(s.reason || '') || !(s.context > big)) return null;
  const name = String(s.name || '');
  const on = !HOUSED.has(name.toLowerCase()) && (listed || []).some((l) => String(l).toLowerCase() === name.toLowerCase());
  return on ? 'not cut now; cut before its next dispatch' : 'stays large until woken';
}

function readJson(file, dflt) { try { return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, '')); } catch (_) { return dflt; } }

/** Every seat, with its transcript (or null), its last call and the rule's decision. Reads only. */
function plan({ data, projects, instances, nowMs = Date.now(), warmMin = WARM_MIN, big = BIG }) {
  const letters = readJson(path.join(data, 'letters.json'), {}) || {};
  const kept = readJson(path.join(data, 'panes.json'), []);
  const seats = [];
  for (const k of Array.isArray(kept) ? kept : []) {
    if (!k || !k.pane || !k.cwd) continue;
    seats.push({ name: letters[k.pane] || k.pane.slice(0, 8), pane: k.pane, cwd: k.cwd });
  }
  for (const [name, sid] of Object.entries(FIXED)) seats.push({ name, pane: sid, cwd: path.join(instances, name) });
  return seats.map((s) => {
    const t = path.join(projects, projectDir(s.cwd), `${s.pane}.jsonl`);
    const transcript = fs.existsSync(t) ? t : null;
    const last = transcript ? lastRequestOfFile(transcript) : null;
    const d = decide({ ...s, transcript, last }, { nowMs, warmMin, big });
    return { ...s, transcript, lastCallMs: last ? last.startedMs : null, ageMin: last ? Math.round((nowMs - last.startedMs) / MIN) : null,
      context: last ? last.context : null, action: d.action, reason: d.reason };
  });
}

/** The folders by THE APP'S OWN RULE (main.rs set_dirs, default_data, default_instances): the config's value, else under home. */
function defaults() {
  const cfg = readJson(path.join(os.homedir(), '.consonance.json'), {}) || {};
  const pick = (v, d) => (typeof v === 'string' && v.trim() ? v.trim() : d);
  return {
    data: (process.env.CONSONANCE_DATA || '').trim() || pick(cfg.data_dir, path.join(os.homedir(), '.consonance')),
    instances: pick(cfg.instances_dir, path.join(os.homedir(), 'claude-instances')),
    projects: path.join(os.homedir(), '.claude', 'projects'),
    config: path.join(os.homedir(), '.consonance.json'),
  };
}

function main(argv) {
  const flag = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : undefined; };
  if (!argv.includes('--dry-run') && !argv.includes('--json')) {
    process.stderr.write('close-small: usage: node close-small.js --dry-run [--json] [--warm-min 50] [--big 300000] [--config <consonance.json>]\n' +
      '  It only lists. The cut is the app\'s "Compact warm seats", after his click.\n');
    return 2;
  }
  const d = defaults();
  const opts = { data: flag('--data') || d.data, projects: flag('--projects') || d.projects, instances: flag('--instances') || d.instances,
    nowMs: flag('--now') ? Date.parse(flag('--now')) : Date.now(),
    warmMin: flag('--warm-min') ? Number(flag('--warm-min')) : WARM_MIN, big: flag('--big') ? Number(flag('--big')) : BIG };
  if (!Number.isFinite(opts.nowMs) || !(opts.warmMin > 0) || !(opts.big > 0)) { process.stderr.write('close-small: a bad --now, --warm-min or --big\n'); return 2; }
  const seats = plan(opts);
  const cfgList = (readJson(flag('--config') || d.config, {}) || {}).cut_at_handback;
  const listed = Array.isArray(cfgList) ? cfgList.filter((x) => typeof x === 'string') : [];
  for (const s of seats) s.note = coldNote(s, listed, opts.big);
  if (argv.includes('--json')) {
    process.stdout.write(JSON.stringify({ at: new Date(opts.nowMs).toISOString(), warmMin: opts.warmMin, big: opts.big, seats }) + '\n');
    return 0;
  }
  const k = (n) => (n == null ? '?' : `${Math.round(n / 1000)}k`);
  console.log(`close-small dry run at ${new Date(opts.nowMs).toISOString()}: cut when the last call is under ${opts.warmMin} min old AND the context is over ${k(opts.big)}`);
  for (const s of seats) console.log(`  ${s.action === 'cut' ? 'CUT ' : 'skip'}  ${s.name.padEnd(12)} last call ${s.ageMin == null ? '-' : `${s.ageMin} min ago`}, context ${k(s.context)}: ${s.reason}${s.note ? `; ${s.note}` : ''}`);
  console.log(`${seats.filter((s) => s.action === 'cut').length} of ${seats.length} seats would be cut; nothing was cut (this is a dry run, and this file never cuts).`);
  return 0;
}

module.exports = { FIXED, WARM_MIN, BIG, projectDir, lastRequest, lastRequestOfFile, decide, plan, coldNote };
if (require.main === module) process.exitCode = main(process.argv.slice(2));
