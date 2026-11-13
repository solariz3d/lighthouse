#!/usr/bin/env node
// memwatch.js (A, 2026-11-13): the memory record and gate that the 2026-11-13 low-memory reap lacked (exo_memory/loop/stall_trace_lowmem_reaper_2026-11-13.md).
//
// Why: when the harness stopped my sweep script "because the system is running low on memory", the only listing I had was process IDs, with no sizes, so
// what held the memory could not be named. This records, every sample, the free physical and free commit (page-file) memory and the largest processes, and
// gates a start on both.
//
// Usage:
//   node memwatch.js --once  [--log FILE]                      print one sample (and append it to FILE as one JSON line)
//   node memwatch.js --gate [--min-free-mb 8192] [--min-commit-mb 6144] [--log FILE]
//                                                              exit 0 when both are at least the thresholds; exit 1 and say which is short
//   node memwatch.js --watch SECONDS [--log FILE]              sample every SECONDS until killed (run in the background beside a sweep)
// The thresholds are inferred, not measured at a reap: 8 GB of 32 GB physical and 6 GB of commit headroom, a margin over the 4-thread sweep's own needs.
'use strict';
const fs = require('node:fs');
const cp = require('node:child_process');

function arg(name, def) {
  const i = process.argv.indexOf(name);
  return i >= 0 && i + 1 < process.argv.length && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : def;
}
const has = (name) => process.argv.includes(name);

function sample() {
  const ps = [
    "$o = Get-CimInstance Win32_OperatingSystem;",
    "$top = Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 6 | ForEach-Object { @{ name = $_.ProcessName; pid = $_.Id; mb = [math]::Round($_.WorkingSet64 / 1MB) } };",
    "$dz = Get-Process dz-chase,dz-world,dz-gym,chase_tests,world_app_tests,game_tests,gen_tests -ErrorAction SilentlyContinue | ForEach-Object { @{ name = $_.ProcessName; pid = $_.Id; mb = [math]::Round($_.WorkingSet64 / 1MB) } };",
    "@{ free_mb = [math]::Round($o.FreePhysicalMemory / 1024); total_mb = [math]::Round($o.TotalVisibleMemorySize / 1024); commit_free_mb = [math]::Round($o.FreeVirtualMemory / 1024); commit_total_mb = [math]::Round($o.TotalVirtualMemorySize / 1024); top = @($top); room = @($dz) } | ConvertTo-Json -Depth 4 -Compress",
  ].join(' ');
  const r = cp.spawnSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', ps], { encoding: 'utf8', timeout: 20000 });
  if (r.status !== 0 || !r.stdout) throw new Error('memwatch: could not read memory: ' + (r.stderr || r.error || 'no output').toString().slice(0, 200));
  const s = JSON.parse(r.stdout);
  s.t = new Date().toISOString();
  return s;
}

function record(s, log) {
  if (log) fs.appendFileSync(log, JSON.stringify(s) + '\n');
}

function line(s) {
  const room = (s.room || []).map((p) => `${p.name} ${p.mb} MB`).join(', ') || 'none';
  return `memwatch ${s.t}: free ${s.free_mb} of ${s.total_mb} MB, commit free ${s.commit_free_mb} of ${s.commit_total_mb} MB; room programs: ${room}; largest: ` +
    (s.top || []).map((p) => `${p.name} ${p.mb}`).join(', ');
}

const log = arg('--log', null);
if (has('--gate')) {
  const minFree = Number(arg('--min-free-mb', '8192')), minCommit = Number(arg('--min-commit-mb', '6144'));
  const s = sample();
  record({ ...s, gate: { min_free_mb: minFree, min_commit_mb: minCommit } }, log);
  console.log(line(s));
  const short = [];
  if (s.free_mb < minFree) short.push(`free physical ${s.free_mb} MB is under ${minFree}`);
  if (s.commit_free_mb < minCommit) short.push(`commit headroom ${s.commit_free_mb} MB is under ${minCommit}`);
  if (short.length) {
    console.log('memwatch GATE: NOT STARTING: ' + short.join('; '));
    process.exit(1);
  }
  console.log('memwatch gate: clear');
  process.exit(0);
} else if (has('--watch')) {
  const every = Math.max(5, Number(arg('--watch', '15'))) * 1000;
  const tick = () => {
    try { const s = sample(); record(s, log); } catch (e) { console.error(e.message); }
  };
  tick();
  setInterval(tick, every);
} else {
  const s = sample();
  record(s, log);
  console.log(line(s));
}
