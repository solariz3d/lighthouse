#!/usr/bin/env node
'use strict';
// heavy-run.js — ONE HEAVY RUNNER PER TREE (L098, stall fix 3 of exo_memory/loop/stall_trace_2026-09-23.md).
//
// WHY. On 2026-09-23 several seats ran the full js-suite and the mutant harnesses at once in one checkout. The chair read
// 122/1 off a snapshot of another seat's half-written files, and a pane hit portable-paths red the same way. A reading
// taken while another run is rewriting the tree is a reading of nobody's state. One heavy run at a time makes it mean
// something.
//
// THE LOCK is <data>/heavy-run.lock — the data dir every tool already resolves (state-manifest.js dataDir: CONSONANCE_DATA,
// then ~/.consonance.json data_dir) — holding {pid, seat, cmd, started, token}. It is created EXCLUSIVELY ('wx'), so two
// runners can never both hold it. `seat` is the first 8 of CONSONANCE_PANE (the pane's session id), or 'terminal'.
//
// D286 (the keeper, 2026-10-10 09:38: "multiple heavy runs at once"): TWO SLOTS, ONE PER TREE. The lock exists because seats read each other's half-written files IN ONE CHECKOUT, so it
// only has to serialise within a tree; one machine-wide file made a t180 landing wait on a lighthouse run in another worktree. There are now N slots (default 2; CONSONANCE_HEAVY_SLOTS, 1..8,
// else the default: a typo must not switch the lock off): <data>/heavy-run.lock, heavy-run.2.lock, ... Each lock records its TREE (`git rev-parse --show-toplevel` of the cwd, lower-cased on
// Windows; a cwd outside git, or where git cannot run, is the ONE shared bucket "(not in a git tree)", so such runs serialise with each other and run beside a run in a real tree). A runner
// whose tree already holds a slot WAITS, whichever slot is free; a lock with no tree recorded (written before D286) blocks every tree. With ONE slot every live lock blocks: today's behaviour.
// The slot scan looks at every slot file (to 8) even when this runner may claim fewer. Two runners of one tree can claim different free slots in the same instant, so after writing its claim a runner
// looks once more and backs off (removes its own claim, tries again after a jitter) if a blocking lock is there: the one that proceeds is the one that saw nobody. The takeover rules below are
// applied PER SLOT, unchanged. A runner waiting with every slot held names every holder; one held up by its own tree names that holder.
//
// A SECOND RUNNER WAITS and says whom it waits on — `heavy-run: waiting on <seat> pid <pid> (<cmd>, since <t>)` — once at
// once, then once a minute, polling every 2 s.
//
// THE MAX WAIT IS 30 MINUTES, and after it the runner FAILS LOUDLY with the holder's details (exit 3). It never runs
// anyway: running anyway is the defect this file exists to end. Why 30: a full js-suite on L takes a few minutes and a
// single `--only` mutant a few more, so a waiter behind ordinary work gets through; a whole-harness run (state-sync's
// 54 mutants, each a full suite) takes far longer than 30 minutes, and a seat parked silently behind it for hours is the
// stall this lap is fixing in another costume. At 30 minutes the waiting seat is told who holds the tree and decides
// (wait again, ask that seat), rather than spending its night in a poll. CONSONANCE_HEAVY_WAIT_MS overrides it.
//
// A STALE LOCK (its pid is not alive) is TAKEN OVER, and the takeover is LOGGED on stderr with the holder and its age,
// and recorded in the new lock as `took_over`. There is no separate log file: a new file in the data dir is UNPLACED at
// close until the manifest names it, and the lock itself already needs that row (see the hand-back). Liveness is the
// codebase's own idiom (ledger-union.js :293, head-watch.js, close.mutants.js): process.kill(pid, 0), EPERM = alive.
// D283 (the chair, 2026-10-10: "C's run took over my LIVE lock"): checked, and the takeover was RIGHT. The chair's own TaskStop on its land_turnby run is in its
// transcript at 01:58:50.042Z; the takeover's age_ms was 2,300,472 on a lock started 01:20:31.118Z, i.e. 01:58:51.590Z, 1.5 s later, from a waiter that polls every 2 s. A
// stopped background task takes its whole tree with it (holder, cmd.exe, child: all three read dead by kill(0), tasklist and CIM) and leaves the lock file behind, so
// "a stale lock, taken over at once" is what TaskStop produces. Cross-session kill(0) works: the chair's live holder, read from another seat's session, was alive by all
// three methods, and its CIM creation time matched the lock's started to 27 ms. BUT a lock this young deserves a second witness before it is taken, so it now is:
//   - a lock YOUNGER than YOUNG_MS (30 min: the longest known full run is 1,570 s) is taken only when pidGone(pid) (tasklist on Windows) ALSO says the holder is gone;
//     if the two disagree, or the second cannot tell, it waits and says so once. A lock with no readable `started` counts as young (unknown is the safe side). An older
//     lock is as before: kill(0) alone.
// A pid the OS has since REUSED reads alive. Since L124 (L's 88278a1, ported at the L/D convergence 2026-11-04) a lock records its holder's image and start,
// and a live pid whose process differs is taken over as stale (see PID REUSE below); an OLD lock without them still waits and, at the max wait, fails loudly
// naming it, which is the safe direction. The takeover moves the stale file aside with an atomic rename; if a race moved ANOTHER runner's
// lock instead, it is put back with linkSync, which cannot overwrite, and the waiter keeps waiting; the next poll judges that lock like any other (D289). That includes
// an unreadable one younger than the grace: a claim whose write has not landed yet (D289 F1).
//
// NESTED RUNS ARE THE SAME RUN. The holder exports its token as CONSONANCE_HEAVY_RUN_TOKEN, which every child inherits;
// a runner whose environment carries the token of the current lock does not wait (it would wait on its own parent
// forever) and does not release. js-suite runs mutant-harness.test.js, which spawns mutant-harness.js --audit.
//
// RELEASED on normal exit and on an uncaught error (both fire process 'exit'), and on SIGINT/SIGTERM/SIGBREAK/SIGHUP. A
// release removes the lock only if it still carries this run's token.
//
// THE DISK GUARD (D287 part 2; C: hit 0 bytes at 12:13 on 2026-10-10, and a run that fills the disk takes every seat's transcript with it).
// Before it takes a slot, a runner reads the free space of every drive the run will write to: the cwd's, the scratch root's (scratch.js) and
// CARGO_TARGET_DIR's when set. The lowest decides. Under 50 GB it WARNS once; under 20 GB it REFUSES (exit 4) with the free figure and what
// the janitor's dry run would free, so the fix is in the message. A nested run is the same run and is not checked again.
//
// THE SHAPE of the cap (L155 follow-up): "spread" (the default when the machine's cores can be read) takes ONE THREAD PER PHYSICAL CORE first, then the siblings, so N CPUs
// are N cores' worth of silicon instead of N/2 cores run hot; "lowest" is the lowest N logical CPUs. The siblings are READ from the OS (GetLogicalProcessorInformationEx,
// RelationProcessorCore, through a PowerShell Add-Type), never assumed adjacent. If the topology cannot be read it falls back to "lowest" and says so.
// THE CPU CAP (L155, the keeper: "use our hardware but not maxing it out"). CONSONANCE_HEAVY_CPUS=N makes hold() pin ITS OWN process to the N lowest logical CPUs
// (Windows: Get-Process -Id <pid> ProcessorAffinity, read back to confirm). A Windows child is created with its parent's affinity, so everything the runner starts
// afterwards (test workers, headless Chrome, cargo, and theirs) shares those N CPUs whatever the run's own concurrency. Unset, empty, unusable, N >= the machine's
// CPUs, or not Windows: no cap, today's behaviour, and a set-but-unusable value is said once. The cap is taken AFTER the lock, so a waiter is never throttled.
//
// THE MACHINE PROFILE (L155 amendment: one size does not fit a 32-thread laptop and a 16-thread desktop). `heavy: { cpus, concurrency, slots, timing }` in THIS machine's
// ~/.consonance.json (never synced; CONSONANCE_CONFIG names another file): cpus = the cap above; slots = the slot count; concurrency = test workers (read by t180's runners);
// timing = whether frame-timing tests belong on this machine. Each field is overridden for one run by CONSONANCE_HEAVY_CPUS / _CONCURRENCY / _SLOTS / _TIMING. A missing file,
// key or field, or an invalid value (dropped and named in `ignored`), is today's behaviour. Other tools read it with `node consonance/tools/heavy-run.js --profile [key]`
// (JSON of every set field, or one value, empty when unset) or `require('./heavy-run.js').profile().values`.
//
// THE EXCLUSIVE HOLD (D663; the chair, 2026-11-11 21:23Z: a hold RELAYED to a busy pane waits in its inbox and cannot bind, so C's slot-2 work ran in P's quiet landing
// window 14 minutes before the word reached it). A run that needs the machine quiet — a timing session, a landing's quiet window — calls hold({ cmd, exclusive: true }),
// or the CLI `node heavy-run.js --run --exclusive --cmd "<what>" -- <program> [args...]`. It writes <data>/heavy-run.hold with 'wx' ({pid, seat, cmd, tree, started,
// token, image, holder_start, exclusive}), then waits until EVERY slot is free of other runs (any tree, any seat), then takes its slot under the same token. While the hold
// exists every other runner WAITS, in the lock's own style (not a refusal), and says once: `heavy-run: waiting on an exclusive hold by <seat> pid <pid> (<cmd>, since <t>)`;
// the max wait and its loud failure apply as for a lock. A runner carrying the hold's token (the holder's children, through CONSONANCE_HEAVY_RUN_TOKEN) passes. A
// runner that claimed a slot looks at the hold once more after its claim and backs off if one appeared (the same two-step as the slot rival check), so a claim racing
// the hold's write never runs inside it. Release removes the hold only with its own token, and a holder that gives up (the max wait) removes its hold before it fails.
// A STALE hold (holder gone) is taken over by the lock's own rules (takeIfStale: kill(0), D283's second witness when young, PID reuse), and logged. A hold older
// than HOLD_MAX_MS (90 min) is IGNORED, with a loud line once per hold: a forgotten hold must never park the room. An exclusive runner that meets an over-age hold moves it
// aside (loudly) and writes its own. Not in scope: a process watcher (a run that never takes heavy-run is not stopped by any of this; GATES.md says which runs must).
//
//   const h = require('./heavy-run.js').hold({ cmd: 'js-suite' });   // waits, or exits 3 loudly; releases on exit

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');
const { dataDir: manifestDataDir } = require('./state-manifest.js');
// D454: the app's third step (main.rs default_data), for a config with no data_dir: a new user's default Data folder. The app creates it at
// launch; acquire() creates it too, so a heavy run before the first launch is not refused.
const appDefaultDataDir = () => path.join(process.env.USERPROFILE || require('os').homedir(), '.consonance');

const LOCK_NAME = 'heavy-run.lock';   // slot 1; slot k is heavy-run.k.lock (D286)
const HOLD_NAME = 'heavy-run.hold';   // D663: the exclusive hold
const HOLD_MAX_MS = 90 * 60 * 1000;   // D663: a hold older than this is ignored, loudly
const DEFAULT_SLOTS = 2;
const MAX_SLOTS = 8;
const NON_GIT_TREE = '(not in a git tree)';
const TOKEN_ENV = 'CONSONANCE_HEAVY_RUN_TOKEN';
const MAX_WAIT_MS = 30 * 60 * 1000;
const POLL_MS = 2000;
const SAY_EVERY_MS = 60 * 1000;
const YOUNG_MS = 30 * 60 * 1000;         // D283: a lock younger than this is taken only when a SECOND method also says its holder is gone (the full suite took 1,570 s)
const UNREADABLE_GRACE_MS = 10 * 1000;   // a lock being written this instant reads empty; only an OLD unreadable one is stale
// L202 (B), THE IDLE-HOLDER GUARD (loop/stall_trace_lockbn_cmd_c_mangled_2026-11-12.md). Twice a slot was held by a wrapper whose only
// child was an idle `cmd.exe C:/ ...` (Git Bash had turned `cmd /c` into `cmd C:/`): 6 minutes on 11-12, 40 on 11-13, the room on one
// slot and nobody told. A runner WAITING on a slot now samples each holder's WHOLE process tree once a minute and, when the tree has
// used under IDLE_CPU_S of CPU over IDLE_WINDOW_MS, names it once: a log line and, through the waiting seat's own MCP mount, a board
// line. It ONLY reports: it never stops a process, never releases or takes a lock, and a fault in it leaves the wait exactly as it was.
// REGISTERED (12:35Z, B's sampler over the two live holders): real runs used 55-57 s (A's sweep: node, cmd, dz-chase) and 117-122 s
// (C's: node, bash, world_app_tests) of tree CPU in every 30 s; the two stalls used 0 s in 6 min and 0.27 s in 40. The whole tree is
// summed because a ctest or cmd parent idles while its children work (cmd.exe 0.0 s beside dz-chase.exe 131 s, the chair at 12:32Z).
// 5 minutes is far inside the waiter's 30-minute give-up, and under 1 s in 5 minutes is three orders of magnitude below a real run.
// ITS LIMITS (P, 11-13, after it named two busy holders idle on D): (1) CLOSED: a tree whose CPU falls (a child that worked has exited)
// is not measurable and starts its window afresh, never named for the fall; (2) CLOSED: a parent id is a reused number, so a process
// counts as a child only when created at or after its parent (a stranger carrying a stale parent id is left out; an unknown time
// counts; a clock step backwards between the two leaves a real child out); (3) OPEN: work done only by children that start and end
// between two one-minute samples is never seen, so such a holder can read idle while it works. No row covers (3).
const IDLE_WINDOW_MS = 5 * 60 * 1000;
const IDLE_CPU_S = 1.0;
const IDLE_CHECK_MS = 60 * 1000;
const DISK_WARN_BYTES = 50e9;            // D287: under this, warn
const DISK_REFUSE_BYTES = 20e9;          // D287: under this, refuse to start

/** Free bytes on the drive holding `p` (fs.statfsSync: GetDiskFreeSpaceExW on Windows). */
function freeBytes(p) { const s = fs.statfsSync(path.parse(path.resolve(p)).root); return s.bavail * s.bsize; }
/** The paths a run writes to: its cwd, the scratch root, and CARGO_TARGET_DIR when set. scratch.js is required here, not at load. */
function writePaths(env = process.env, cwd = process.cwd()) {
  const out = [cwd];
  try { out.push(require('./scratch.js').scratchRoot(env)); } catch (_) { /* no scratch.js beside this copy: the cwd still counts */ }
  if (env.CARGO_TARGET_DIR) out.push(env.CARGO_TARGET_DIR);
  return out;
}
/** What the janitor's dry run would free, as text for the refusal; its failure is said, never thrown (the refusal stands either way). */
function janitorTotal() {
  try { const p = require('./janitor.js').plan(); return `the janitor's dry run would free ${(p.total / 1e9).toFixed(1)} GB (node consonance/tools/janitor.js to see it, --apply to act)`; }
  catch (e) { return `the janitor's dry run failed (${e.message}); run node consonance/tools/janitor.js`; }
}
/** D287: refuse (throw HEAVY_RUN_DISK) when a drive the run writes to is under DISK_REFUSE_BYTES; warn under DISK_WARN_BYTES. */
function checkDisk({ paths, free = freeBytes, total = janitorTotal, log }) {
  let low = null;
  for (const p of paths) {
    const root = path.parse(path.resolve(p)).root;
    let b; try { b = free(p); } catch (e) { log(`heavy-run: could not read the free space of ${root} (${e.code || e.message}); not checked`); continue; }
    if (low === null || b < low.bytes) low = { root, bytes: b };
  }
  if (!low) return null;
  const gbs = (low.bytes / 1e9).toFixed(1);
  if (low.bytes < DISK_REFUSE_BYTES) throw Object.assign(new Error(`heavy-run: refusing to start: ${low.root} has ${gbs} GB free, under the ${DISK_REFUSE_BYTES / 1e9} GB floor; a heavy run that fills the disk fails every seat's writes. ${total()}. How it works: consonance/GATES.md, "The heavy-run lock".`), { code: 'HEAVY_RUN_DISK', free: low });
  if (low.bytes < DISK_WARN_BYTES) log(`heavy-run: WARNING: ${low.root} has ${gbs} GB free, under ${DISK_WARN_BYTES / 1e9} GB; run node consonance/tools/janitor.js`);
  return low;
}

const PROFILE_FIELDS = {
  shape: { env: 'CONSONANCE_HEAVY_SHAPE', parse: (v) => (/^(spread|lowest)$/.test(String(v).trim()) ? String(v).trim() : undefined) },
  cpus: { env: 'CONSONANCE_HEAVY_CPUS', parse: (v) => (/^[0-9]+$/.test(String(v).trim()) && Number(v) >= 1 ? Number(v) : undefined) },
  concurrency: { env: 'CONSONANCE_HEAVY_CONCURRENCY', parse: (v) => (/^[0-9]+$/.test(String(v).trim()) && Number(v) >= 1 && Number(v) <= 64 ? Number(v) : undefined) },
  slots: { env: 'CONSONANCE_HEAVY_SLOTS', parse: (v) => (/^[0-9]+$/.test(String(v).trim()) && Number(v) >= 1 && Number(v) <= MAX_SLOTS ? Number(v) : undefined) },
  timing: { env: 'CONSONANCE_HEAVY_TIMING', parse: (v) => (v === true || /^(1|true)$/i.test(String(v).trim()) ? true : v === false || /^(0|false)$/i.test(String(v).trim()) ? false : undefined) },
};
/** This machine's heavy-run profile: { values, source, ignored }. File first, then each field's env var over it. Never throws; unusable input is an empty profile. */
function profile({ file, env = process.env } = {}) {
  const f = file || env.CONSONANCE_CONFIG || path.join(process.env.USERPROFILE || require('os').homedir(), '.consonance.json');
  let heavy = {};
  try { const j = JSON.parse(fs.readFileSync(f, 'utf8')); if (j && typeof j.heavy === 'object' && j.heavy !== null && !Array.isArray(j.heavy)) heavy = j.heavy; } catch (_) { /* no file or junk: empty */ }
  const values = {}, source = {}, ignored = [];
  for (const [k, { env: ev, parse }] of Object.entries(PROFILE_FIELDS)) {
    const fromEnv = env[ev] !== undefined && String(env[ev]).trim() !== '' ? parse(env[ev]) : undefined;
    if (fromEnv !== undefined) { values[k] = fromEnv; source[k] = 'env'; continue; }
    if (k in heavy) { const v = parse(heavy[k]); if (v === undefined) ignored.push(k); else { values[k] = v; source[k] = 'file'; } }
  }
  return { values, source, ignored };
}
const TOPOLOGY_PS = `Add-Type -TypeDefinition @'
using System; using System.Runtime.InteropServices; using System.Text;
public static class Topo {
  [DllImport("kernel32.dll", SetLastError=true)] static extern bool GetLogicalProcessorInformationEx(int rel, IntPtr buf, ref int len);
  public static string Cores() {
    int len = 0; GetLogicalProcessorInformationEx(0, IntPtr.Zero, ref len);
    IntPtr p = Marshal.AllocHGlobal(len);
    if (!GetLogicalProcessorInformationEx(0, p, ref len)) return "";
    StringBuilder sb = new StringBuilder(); int off = 0;
    while (off < len) {
      int size = Marshal.ReadInt32(p, off + 4); int gc = Marshal.ReadInt16(p, off + 30);
      for (int g = 0; g < gc; g++) sb.Append(Marshal.ReadInt16(p, off + 32 + g * 16 + 8)).Append(":").Append((ulong)Marshal.ReadInt64(p, off + 32 + g * 16)).Append(";");
      sb.Append("\\n"); off += size;
    }
    return sb.ToString();
  }
}
'@; [Topo]::Cores()`;
/** The logical-CPU mask (BigInt) of each physical core, from the OS: [mask, ...], or null when it cannot be read, is in more than one processor group, or does not cover exactly the machine's CPUs. */
function coreMasks({ run = spawnSync, platform = process.platform, cpus = require('os').cpus().length } = {}) {
  if (platform !== 'win32' || cpus > 64) return null;
  let r; try { r = run('powershell', ['-NoProfile', '-NonInteractive', '-Command', TOPOLOGY_PS], { encoding: 'utf8', timeout: 30000, windowsHide: true }); } catch (_) { return null; }
  if (!r || r.error || r.status !== 0 || typeof r.stdout !== 'string') return null;
  const out = [];
  for (const line of r.stdout.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const m = line.trim().match(/^0:([0-9]+);$/);
    if (!m) return null;
    out.push(BigInt(m[1]));
  }
  let all = 0n;
  for (const c of out) { if (c === 0n || (all & c) !== 0n) return null; all |= c; }
  return out.length && all === (1n << BigInt(cpus)) - 1n ? out : null;
}
/** The SPREAD mask of N CPUs over `cores` (from coreMasks): the lowest thread of each core first (cores in order), then each core's next thread, and so on. null = no cap (same rule as cpuMask). */
function spreadMask(raw, cores) {
  if (!Array.isArray(cores) || !cores.length) return null;
  let all = 0n; for (const c of cores) { if (typeof c !== 'bigint' || c === 0n || (all & c) !== 0n) return null; all |= c; }
  const total = cores.reduce((n, c) => n + c.toString(2).replace(/0/g, '').length, 0);
  const lowest = cpuMask(raw, total);
  if (lowest === null) return null;
  const n = lowest.toString(2).length;
  const rest = cores.map((c) => c);
  let mask = 0n, taken = 0;
  while (taken < n) {
    for (let i = 0; i < rest.length && taken < n; i++) {
      if (rest[i] === 0n) continue;
      const low = rest[i] & -rest[i];
      mask |= low; rest[i] ^= low; taken++;
    }
  }
  return mask;
}
/** The affinity mask (BigInt) of the N lowest logical CPUs, or null for "no cap": N must be a whole number from 1 to cpus-1, and cpus at most 64 (one processor group). */
function cpuMask(raw, cpus = require('os').cpus().length) {
  if (raw === undefined || raw === null || raw === '') return null;
  if (typeof raw === 'string' && !/^[0-9]+$/.test(raw.trim())) return null;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || !Number.isInteger(cpus) || cpus > 64 || n >= cpus) return null;
  return (1n << BigInt(n)) - 1n;
}
/** Apply CONSONANCE_HEAVY_CPUS to process `pid` (default: this one). Returns { applied, cpus?, mask?, reason? }; never throws, never exits: a cap that cannot be set is said and the run goes on uncapped. */
function applyCap({ env = process.env, heavy, cores, pid = process.pid, platform = process.platform, cpus = require('os').cpus().length, run = spawnSync, log = (s) => process.stderr.write(s + '\n') } = {}) {
  const raw = env.CONSONANCE_HEAVY_CPUS !== undefined && String(env.CONSONANCE_HEAVY_CPUS).trim() !== '' ? env.CONSONANCE_HEAVY_CPUS : (heavy || profile({ env }).values).cpus;
  if (raw === undefined || raw === null || String(raw).trim() === '') return { applied: false, reason: 'unset' };
  const prof = heavy || profile({ env }).values;
  const want = env.CONSONANCE_HEAVY_SHAPE !== undefined && PROFILE_FIELDS.shape.parse(env.CONSONANCE_HEAVY_SHAPE) ? env.CONSONANCE_HEAVY_SHAPE.trim() : (prof.shape || 'spread');
  let shape = 'lowest', mask = cpuMask(String(raw).trim(), cpus);
  if (mask !== null && want === 'spread' && platform === 'win32') {
    const sp = spreadMask(String(raw).trim(), cores === undefined ? coreMasks({ run, platform, cpus }) : cores);
    if (sp !== null) { mask = sp; shape = 'spread'; } else log('heavy-run: the cores could not be read from the OS; using the lowest N logical CPUs');
  }
  if (mask === null) { log(`heavy-run: CONSONANCE_HEAVY_CPUS=${raw} is not a whole number from 1 to ${cpus - 1} (this machine has ${cpus} logical CPUs, or more than 64); NOT applied, running uncapped`); return { applied: false, reason: 'unusable' }; }
  if (platform !== 'win32') { log('heavy-run: CONSONANCE_HEAVY_CPUS is the Windows affinity cap; NOT applied on this platform'); return { applied: false, reason: 'platform' }; }
  if (!Number.isInteger(pid) || pid <= 0) return { applied: false, reason: 'pid' };
  let r; try {
    r = run('powershell', ['-NoProfile', '-NonInteractive', '-Command',
      `$p = Get-Process -Id ${pid} -ErrorAction Stop; $p.ProcessorAffinity = [IntPtr][Int64]${mask}; $p.Refresh(); $p.ProcessorAffinity.ToInt64()`],
    { encoding: 'utf8', timeout: 20000, windowsHide: true });
  } catch (_) { r = null; }
  const ok = Boolean(r) && r.status === 0 && !r.error;
  const got = ok ? String(r.stdout || '').trim() : '';
  if (got !== String(mask)) { log(`heavy-run: CONSONANCE_HEAVY_CPUS=${raw}: the affinity was NOT applied (wanted ${mask}, read back ${got || 'nothing'}); running uncapped`); return { applied: false, reason: 'readback' }; }
  log(`heavy-run: capped to ${raw} of ${cpus} logical CPUs, ${shape} (affinity ${mask}); every child inherits it`);
  return { applied: true, cpus: Number(raw), mask: String(mask), shape };
}

function pidAlive(pid, kill = process.kill.bind(process)) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try { kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; }
}
/** The SECOND witness (D283): true = the pid is gone, false = a process with that pid is listed, null = cannot tell. On Windows it asks `tasklist /FI "PID eq n"`, which
 *  is the OS's own process list and does not depend on what kill(0) is allowed to open; elsewhere kill(0) is the whole truth, so there is nothing to add (true). */
function pidGone(pid, run = spawnSync, platform = process.platform) {
  if (platform !== 'win32') return true;
  let r; try { r = run('tasklist', ['/FI', `PID eq ${pid}`, '/FO', 'CSV', '/NH'], { encoding: 'utf8', timeout: 8000, windowsHide: true }); } catch (_) { return null; }
  if (!r || r.error || r.status !== 0 || typeof r.stdout !== 'string') return null;
  const listed = r.stdout.split(/\r?\n/).some((line) => { const c = line.match(/"[^"]*"/g); return !!c && c.length >= 2 && Number(c[1].slice(1, -1)) === pid; });
  return !listed;
}
// PID REUSE (L124, L's 88278a1). A live pid is not a live HOLDER: on 2026-09-27 a stale lock's pid 27836 had been handed by Windows to another program's crash
// handler five seconds after the holder exited, and kill(0) read it as alive. So a lock records who took it — `image` (this executable's base name) and
// `holder_start` (this process's start) — and a live pid whose process has a DIFFERENT image, or started more than START_TOLERANCE_MS away from the recorded
// start, is a different process: the lock is stale (reason 'pid_reused'). D283's second witness is not asked here: the pid IS running, and the identity is
// the witness that it is not the holder.
//   * RECORDING needs no spawn: the start is Date.now() - process.uptime(), the image path.parse(process.execPath).name.
//   * ASKING about another pid is `Get-Process … StartTime` (whats-live.js's query), Windows only. Elsewhere, or if the query fails, the identity is UNKNOWN
//     (null) and the lock is treated as held. Failing to look is never a reason to take a live lock.
//   * An OLD lock (no `image`, no `holder_start`) is never asked about and behaves exactly as before.
//   * The tolerance absorbs the gap between the OS's creation time and node's own start; a pid reused by the SAME image within that window is not caught.
const START_TOLERANCE_MS = 10 * 1000;
const IDENTITY_RECHECK_MS = 60 * 1000;   // a waiter asks the OS about the same holder at most this often, not every poll
function selfIdentity() {
  return { image: path.parse(process.execPath).name, holder_start: new Date(Date.now() - process.uptime() * 1000).toISOString() };
}
/** { image, start } of the process at `pid`, or null when it cannot be told. The pid comes from a lock FILE and is interpolated into PowerShell, so a
 *  non-integer never reaches the shell. */
function processIdentity(pid, run = spawnSync, platform = process.platform) {
  if (!Number.isInteger(pid) || pid <= 0 || platform !== 'win32') return null;
  let r; try {
    r = run('powershell', ['-NoProfile', '-NonInteractive', '-Command',
      `$p = Get-Process -Id ${pid} -ErrorAction SilentlyContinue; if ($p) { $s = ''; try { $s = $p.StartTime.ToUniversalTime().ToString('o') } catch {}; $p.ProcessName + '|' + $s }`],
    { encoding: 'utf8', timeout: 20000, windowsHide: true });
  } catch (_) { return null; }
  if (!r || r.error || r.status !== 0 || typeof r.stdout !== 'string') return null;
  const out = r.stdout.trim(), i = out.lastIndexOf('|');
  if (i <= 0) return null;
  const start = Date.parse(out.slice(i + 1));
  return { image: out.slice(0, i), start: Number.isFinite(start) ? start : null };
}
const hasIdentity = (h) => Boolean(h && (h.image || h.holder_start));
/** Is the process `id` (from processIdentity) the one that took lock `h`? Unknown (null) counts as the same. */
function sameHolder(h, id) {
  if (!id) return true;
  if (h.image && id.image && String(h.image).toLowerCase() !== String(id.image).toLowerCase()) return false;
  const recorded = Date.parse(h.holder_start);
  if (Number.isFinite(recorded) && Number.isFinite(id.start) && Math.abs(id.start - recorded) > START_TOLERANCE_MS) return false;
  return true;
}
const ageOf = (h, t) => { const s = Date.parse(h && h.started); return Number.isFinite(s) ? t - s : null; };
function seatName(env) { const p = String(env.CONSONANCE_PANE || '').trim(); return p ? p.slice(0, 8) : 'terminal'; }
function sleepSync(ms) { Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms); }
function readLock(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { return e.code === 'ENOENT' ? null : { unreadable: e.message }; }
}
const describe = (h) => `${h.seat || '?'} pid ${h.pid} (${h.cmd || '?'}, since ${h.started || '?'})`;
const mins = (ms) => `${Math.round(ms / 60000)}m`;

const slotFile = (dir, k) => path.join(dir, k === 1 ? LOCK_NAME : `heavy-run.${k}.lock`);
/** The slot count: the `slots` option, else CONSONANCE_HEAVY_SLOTS, else DEFAULT_SLOTS. Anything that is not a whole number from 1 to MAX_SLOTS is the default (a typo must not switch the lock off). */
function slotCount(raw) {
  if (raw === undefined || raw === null || raw === '') return DEFAULT_SLOTS;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 && n <= MAX_SLOTS ? n : DEFAULT_SLOTS;
}
/** D286: the tree a run belongs to — `git rev-parse --show-toplevel` of the cwd, lower-cased on Windows (git prints C:/ and the OS may say c:\). A cwd that is not in a git tree (or where git cannot
 *  run) is NON_GIT_TREE: ONE shared bucket, so non-git runs serialise with each other (unknown is the safe side) and still run beside a run in a real tree. */
function resolveTree(cwd = process.cwd(), run = spawnSync, platform = process.platform) {
  let r; try { r = run('git', ['rev-parse', '--show-toplevel'], { cwd, encoding: 'utf8', timeout: 8000, windowsHide: true }); } catch (_) { return NON_GIT_TREE; }
  const top = r && !r.error && r.status === 0 && typeof r.stdout === 'string' ? r.stdout.trim() : '';
  if (!top) return NON_GIT_TREE;
  const p = path.resolve(top);
  return platform === 'win32' ? p.toLowerCase() : p;
}

// ── L202: the idle-holder guard's parts (see IDLE_WINDOW_MS). Each is replaceable in acquire() for the rows, and none can throw into it. ──
/** pid -> { cpu (seconds, the whole tree's kernel + user time), names } for each pid asked, from ONE CIM query of every process. */
function idleSampleTree(pids, run = spawnSync, platform = process.platform) {
  const out = new Map();
  if (platform !== 'win32' || !pids.length) return out;
  const r = run('powershell', ['-NoProfile', '-NonInteractive', '-Command',
    'Get-CimInstance Win32_Process | ForEach-Object { "{0}|{1}|{2}|{3}|{4}" -f $_.ProcessId, $_.ParentProcessId, ([double]$_.KernelModeTime + [double]$_.UserModeTime), $_.Name, $(if ($_.CreationDate) { $_.CreationDate.ToFileTimeUtc() } else { \'\' }) }'],
  { encoding: 'utf8', timeout: 30000, windowsHide: true, maxBuffer: 1 << 26 });
  if (!r || r.error || r.status !== 0) return out;
  const procs = new Map(), kids = new Map();
  for (const line of String(r.stdout || '').split(/\r?\n/)) {
    const [pid, ppid, cpu, name, created] = line.split('|');
    if (!pid) continue;
    procs.set(Number(pid), { cpu: Number(cpu) / 1e7, name, created: created ? Number(created) : null });
    if (!kids.has(Number(ppid))) kids.set(Number(ppid), []);
    kids.get(Number(ppid)).push(Number(pid));
  }
  // A process is a child only when it was created AT OR AFTER its parent (L202, the chair's ruling from O's accident at 18:13Z on 11-13:
  // a parent id is a number Windows reuses, so a stranger whose real parent died can carry a later holder's pid as its parent id; it
  // was created before that holder). An unknown creation time on either side counts, as before: leaving out a real child is what
  // names a busy holder idle. Not closed: a clock step backwards between a parent's and a child's creation leaves the real child out
  // (seen at boot on D: Secure System is stamped before its parent System).
  const childOf = (p, k) => { const a = procs.get(p).created, b = procs.get(k).created; return a === null || b === null || b >= a; };
  for (const root of pids) {
    if (!procs.has(root)) continue;
    const tree = [root];
    for (let i = 0; i < tree.length; i++) for (const k of kids.get(tree[i]) || []) if (k !== tree[i] && !tree.includes(k) && childOf(tree[i], k)) tree.push(k);
    out.set(root, { cpu: tree.reduce((s, p) => s + procs.get(p).cpu, 0), names: [...new Set(tree.map((p) => procs.get(p).name))] });
  }
  return out;
}
/** The WAITING seat's own MCP mount (the app writes <data>/mcp.consonance.<letter>.json at each start), or null: then the log only. */
function seatMountUrl({ dataDir, env = process.env }) {
  try {
    const pane = String(env.CONSONANCE_PANE || '').trim();
    if (!pane || !dataDir) return null;
    const letter = JSON.parse(fs.readFileSync(path.join(dataDir, 'letters.json'), 'utf8'))[pane];
    if (!letter || !/^[A-Za-z0-9]+$/.test(letter)) return null;
    const url = JSON.parse(fs.readFileSync(path.join(dataDir, `mcp.consonance.${letter}.json`), 'utf8')).mcpServers.consonance.url;
    return /^http:\/\/127\.0\.0\.1:\d+\/mcp\/[A-Za-z0-9]+$/.test(url) ? url : null;   // loopback, the seat's own route, nothing else
  } catch (_) { return null; }
}
/** post_board through that mount: the MCP handshake, then the one call. Each request gives up after 10 s. */
async function postBoardVia(url, text) {
  const head = { 'content-type': 'application/json', accept: 'application/json, text/event-stream' };
  const send = async (body, extra = {}) => {
    const r = await fetch(url, { method: 'POST', headers: { ...head, ...extra }, body: JSON.stringify(body), signal: AbortSignal.timeout(10000) });
    await r.text();
    return r;
  };
  const r1 = await send({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'heavy-run', version: '1' } } });
  const sid = r1.headers.get('mcp-session-id');
  const extra = sid ? { 'mcp-session-id': sid } : {};
  await send({ jsonrpc: '2.0', method: 'notifications/initialized' }, extra);
  await send({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'post_board', arguments: { text } } }, extra);
}
/** Name an idle holder: one log line here, and a board line posted by a detached child (so the wait never blocks on the network). */
function reportIdle(h, info, { log, dataDir, env = process.env, spawnFn = require('child_process').spawn }) {
  const text = `heavy-run: IDLE HOLDER — ${describe(h)}: its whole process tree (${(info.names || []).join(', ') || '?'}) used ${info.cpu.toFixed(2)} s of CPU in the last ${Math.round(info.minutes)} min. A shell started as \`cmd C:/\` by Git Bash looks like this. Reported only: nothing is stopped or released (L202).`;
  log(text);
  const url = seatMountUrl({ dataDir, env });
  if (url) spawnFn(process.execPath, [__filename, '--post-board', url, text], { detached: true, stdio: 'ignore', windowsHide: true }).unref();
}

function acquire({
  cmd, dataDir, env = process.env, slots, tree, onClaim, beforeClaim, beforeTake,
  maxWaitMs = Number(process.env.CONSONANCE_HEAVY_WAIT_MS) || MAX_WAIT_MS, pollMs = POLL_MS,
  alive = pidAlive, confirmGone = pidGone, identify = processIdentity, log = (s) => process.stderr.write(s + '\n'), now = () => Date.now(), sleep = sleepSync,
  writes, diskFree = freeBytes, diskTotal = janitorTotal, heavy, exclusive = false, holdMaxMs = HOLD_MAX_MS,
  idleSample = idleSampleTree, idleReport, idleWindowMs = IDLE_WINDOW_MS, idleCpuS = IDLE_CPU_S,
} = {}) {
  let dir = dataDir === undefined ? manifestDataDir() : dataDir;
  if (dataDir === undefined && !dir) { dir = appDefaultDataDir(); fs.mkdirSync(dir, { recursive: true }); }
  if (!dir) throw Object.assign(new Error('heavy-run: no data dir (CONSONANCE_DATA unset and ~/.consonance.json has no data_dir) — refusing to run without the lock'), { code: 'HEAVY_RUN_NO_DATA' });
  const n = slotCount(slots !== undefined ? slots : (heavy || profile({ env: process.env }).values).slots);

  // A nested run carries the token of the lock it runs under, in whichever slot that lock is.
  if (env[TOKEN_ENV]) {
    for (let k = 1; k <= MAX_SLOTS; k++) {
      const file = slotFile(dir, k), current = readLock(file);
      if (current && current.token === env[TOKEN_ENV]) return { file, slot: k, reentrant: true, holder: current, release() {} };
    }
  }

  checkDisk({ paths: writes || writePaths(env), free: diskFree, total: diskTotal, log });   // D287: refuses (throws) under the floor; a nested run returned above
  const myTree = tree !== undefined ? tree : resolveTree();
  const token = crypto.randomUUID();
  const t0 = now();
  let said = -Infinity;
  // L202: per holder (by token), its tree's CPU samples while we wait on it; a holder is named at most once per waiter.
  let idleAt = -Infinity;
  const idleSeen = new Map(), idleNamed = new Set();
  const nameIdle = idleReport || ((h, info) => reportIdle(h, info, { log, dataDir: dir, env }));
  const watchIdle = (holders) => {
    try {
      if (now() - idleAt < IDLE_CHECK_MS) return;
      idleAt = now();
      const cpu = idleSample(holders.map((h) => h.pid));
      for (const h of holders) {
        const s = cpu && cpu.get(h.pid), key = h.token || String(h.pid);
        if (!s || idleNamed.has(key)) continue;
        // A live tree's CPU only grows. A fall means a child that used CPU has exited and taken its time out of the sum (A's sweep
        // and C's stomp run named idle at -47.67 s and -504.44 s on D, 11-13): nothing before the fall measures this tree, so the
        // window starts afresh here. A shrinking tree is not measurable, never idle.
        const prev = idleSeen.get(key) || [];
        const kept = prev.length && s.cpu < prev[prev.length - 1].cpu ? [] : prev;
        const samples = kept.concat([{ t: now(), cpu: s.cpu }]);
        // keep the newest sample at least a window old (the baseline) and everything after it
        let b = 0;
        for (let i = 0; i < samples.length; i++) if (now() - samples[i].t >= idleWindowMs) b = i;
        idleSeen.set(key, samples.slice(b));
        const base = samples[b];
        if (now() - base.t >= idleWindowMs && s.cpu - base.cpu < idleCpuS) {
          idleNamed.add(key);
          nameIdle(h, { cpu: s.cpu - base.cpu, minutes: (now() - base.t) / 60000, names: s.names });
        }
      }
    } catch (_) { /* the guard only reports: a fault in it leaves the wait exactly as it was */ }
  };
  let tookOver = null;
  const disagreed = new Set();   // tokens whose liveness disagreement has been said once
  const probes = new Map();      // L124: token -> { at, id }, the last identity asked of the OS for that holder
  const self = selfIdentity();
  // Does a lock held by `h` forbid me to run? Always with ONE slot (today's machine-wide lock); else when it is in my tree, or records none (a lock from before D286: unknown is the safe side).
  const blocks = (h) => n === 1 || !h.tree || h.tree === myTree;

  // D283's judgement of one lock file, unchanged: true = the lock was STALE and has been taken out of the way (the slot is free now), false = it is live.
  function takeIfStale(file, k, h) {
    let stale = false, reason = null, nowRunning = null;
    if (h.unreadable) {
      let age = 0;
      try { age = now() - fs.statSync(file).mtimeMs; } catch (_) { return true; }
      stale = age > UNREADABLE_GRACE_MS;
      reason = 'unreadable';
    } else {
      stale = !alive(h.pid);
      reason = 'dead';
      if (!stale && hasIdentity(h)) {   // L124: alive, but is it still the holder? (see PID REUSE)
        const p = probes.get(h.token);
        if (!p || now() - p.at >= IDENTITY_RECHECK_MS) probes.set(h.token, { at: now(), id: identify(h.pid) });
        const id = probes.get(h.token).id;
        if (!sameHolder(h, id)) { stale = true; reason = 'pid_reused'; nowRunning = id; }
      } else if (stale) {   // D283: a young lock needs a second witness (see the header)
        const age = ageOf(h, now());
        if (age === null || age < YOUNG_MS) {
          const second = confirmGone(h.pid);
          if (second !== true) {
            stale = false;
            if (!disagreed.has(h.token)) {
              disagreed.add(h.token);
              log(`heavy-run: ${describe(h)} reads not-running to process.kill(pid, 0) but ${second === false ? 'RUNNING to tasklist' : 'tasklist could not confirm it'}; the lock is ${age === null ? 'of unknown age' : mins(age) + ' old'}, younger than ${mins(YOUNG_MS)}, so it is NOT taken over: waiting`);
            }
          }
        }
      }
    }
    if (!stale) return false;
    const aside = `${file}.stale-${process.pid}-${now()}`;
    if (beforeTake) beforeTake({ slot: k, file });   // a seam for the tests: the instant between judging a lock stale and moving it aside (D289 F1)
    try { fs.renameSync(file, aside); } catch (e) { if (e.code === 'ENOENT') return true; throw e; }
    const moved = readLock(aside);
    // D289 F1: an UNREADABLE moved lock is another runner's claim caught between its 'wx' open and its write, unless it is OLD. The rule every unreadable lock gets decides
    // (UNREADABLE_GRACE_MS, by mtime, which the rename keeps): the old unreadable file the first read saw is still taken, and a fresh claim that replaced it is put back.
    const movedAge = () => { try { return now() - fs.statSync(aside).mtimeMs; } catch (_) { return 0; } };   // the aside vanished under us: unknown is the safe side (try to put back, judge at the next poll)
    if (moved && (moved.unreadable ? movedAge() <= UNREADABLE_GRACE_MS : moved.token !== h.token)) {
      // A race: between our read and our rename another runner took the lock. Put ITS lock back; linkSync fails
      // rather than overwrite, so a lock created meanwhile is never clobbered either. D289: put back whether or not kill(0) reads it alive, and judged
      // at the next poll by the rules every lock gets: judging it here by kill(0) alone threw a young lock away without D283's second witness.
      try { fs.linkSync(aside, file); } catch (_) { /* a newer lock is already there */ }
      try { fs.unlinkSync(aside); } catch (_) {}
      return false;
    }
    try { fs.unlinkSync(aside); } catch (_) {}
    const age = h.started ? now() - Date.parse(h.started) : null;
    tookOver = { holder: { pid: h.pid ?? null, seat: h.seat ?? null, cmd: h.cmd ?? null, started: h.started ?? null }, age_ms: Number.isFinite(age) ? age : null, reason };
    const ageTxt = `it was ${Number.isFinite(age) ? mins(age) : 'an unknown age'} old (slot ${k})`;
    if (reason === 'pid_reused') {
      const at = Number.isFinite(nowRunning.start) ? new Date(nowRunning.start).toISOString() : null;
      tookOver.now_running = { image: nowRunning.image ?? null, start: at };
      log(`heavy-run: took over a stale lock — ${describe(h)}: pid ${h.pid} is now ${nowRunning.image || '?'}, started ${at || '?'} — the pid was reused (the lock recorded ${h.image || '?'}, started ${h.holder_start || '?'}); ${ageTxt}`);
    } else {
      log(`heavy-run: took over a stale lock — ${h.unreadable ? `an unreadable lock (${h.unreadable})` : describe(h)} is not running; ${ageTxt}`);
    }
    return true;
  }

  // D663: the exclusive hold (see the header). foreignHold() reads <data>/heavy-run.hold: null = none that binds me (absent, mine, my parent's, or stale and now taken
  // over); { h, ignored } = another run's hold, ignored when past holdMaxMs (said once per hold).
  const holdFile = path.join(dir, HOLD_NAME);
  const ignoredHolds = new Set();
  let myHold = false, saidHold = false, holdTookOver = null;
  function foreignHold() {
    for (let i = 0; i < 3; i++) {
      const h = readLock(holdFile);
      if (h === null) return null;
      if (h.token && (h.token === token || h.token === env[TOKEN_ENV])) return null;   // mine, or the holder's child
      const before = tookOver;
      if (takeIfStale(holdFile, 'hold', h)) { holdTookOver = tookOver; tookOver = before; continue; }   // a stale hold, taken over by the lock's own rules and logged
      const hAge = ageOf(h, now());
      if (hAge !== null && hAge > holdMaxMs) {
        if (!ignoredHolds.has(h.token)) {
          ignoredHolds.add(h.token);
          log(`heavy-run: IGNORING the exclusive hold by ${describe(h)}: it is ${mins(hAge)} old, past the ${mins(holdMaxMs)} maximum, so it no longer parks the room. If its run is over, remove ${holdFile}`);
        }
        return { h, ignored: true };
      }
      return { h, ignored: false };
    }
    return null;
  }
  const dropMyHold = () => { if (!myHold) return; const cur = readLock(holdFile); if (cur && cur.token === token) { try { fs.unlinkSync(holdFile); } catch (_) {} } myHold = false; };
  const holdWait = (h) => {
    const waited = now() - t0;
    if (waited >= maxWaitMs) { dropMyHold(); throw Object.assign(new Error(`heavy-run: gave up waiting on an exclusive hold after ${mins(waited)} — ${describe(h)} still holds ${holdFile}. Not running inside it: an exclusive hold is a quiet window (a timing session or a landing). Wait for it, or ask that seat.`), { code: 'HEAVY_RUN_TIMEOUT', holder: h, holders: [h] }); }
    if (!saidHold) { saidHold = true; log(`heavy-run: waiting on an exclusive hold by ${describe(h)}`); }
    sleep(pollMs);
  };
  if (exclusive) {
    for (;;) {
      const f = foreignHold();
      if (f && f.ignored) {   // past the maximum: moved aside, loudly (said by foreignHold), so this run's hold can be written
        const aside = `${holdFile}.ignored-${process.pid}-${now()}`;
        try { fs.renameSync(holdFile, aside); } catch (_) { continue; }
        const moved = readLock(aside);
        if (moved && moved.token !== f.h.token) { try { fs.linkSync(aside, holdFile); } catch (_) { /* a newer hold is already there */ } }
        try { fs.unlinkSync(aside); } catch (_) {}
        continue;
      }
      if (f) { holdWait(f.h); continue; }
      let hfd;
      try { hfd = fs.openSync(holdFile, 'wx'); } catch (e) { if (e.code === 'EEXIST') continue; throw e; }
      const hrec = { pid: process.pid, seat: seatName(env), cmd, exclusive: true, tree: myTree, started: new Date(now()).toISOString(), token, image: self.image, holder_start: self.holder_start };
      if (holdTookOver) hrec.took_over = holdTookOver;
      try { fs.writeSync(hfd, JSON.stringify(hrec)); } finally { fs.closeSync(hfd); }
      myHold = true;
      break;
    }
  }
  // An exclusive holder waits for EVERY other run (any tree, any seat); everyone else by the slot rules.
  const blocksMe = (h) => exclusive || blocks(h);

  try {
  for (;;) {
    if (!exclusive) {   // D663: a hold binds every runner but its holder and the holder's children
      const fh = foreignHold();
      if (fh && !fh.ignored) { holdWait(fh.h); continue; }
    }
    // Look at every slot — the ones above n too: a runner told to use fewer slots still honours a holder in another.
    const live = [], free = [];
    for (let k = 1; k <= MAX_SLOTS; k++) {
      const file = slotFile(dir, k), h = readLock(file);
      if (h === null) { if (k <= n) free.push(k); continue; }
      if (takeIfStale(file, k, h)) { if (k <= n) free.push(k); continue; }
      live.push({ k, file, h });
    }
    const blockers = live.filter((x) => blocksMe(x.h));
    if (blockers.length === 0 && free.length) {
      const k = free[0], file = slotFile(dir, k);
      const rec = { pid: process.pid, seat: seatName(env), cmd, tree: myTree, started: new Date(now()).toISOString(), token, image: self.image, holder_start: self.holder_start };
      if (tookOver) rec.took_over = tookOver;
      if (beforeClaim) beforeClaim({ slot: k, file });   // a seam for the tests: the instant between looking and claiming
      let fd;
      try { fd = fs.openSync(file, 'wx'); } catch (e) { if (e.code === 'EEXIST') continue; throw e; }
      try { fs.writeSync(fd, JSON.stringify(rec)); } finally { fs.closeSync(fd); }
      if (onClaim) onClaim({ slot: k, file });
      // Two runners of one tree can each claim a DIFFERENT free slot in the same instant. Look again: whoever finds another lock that blocks it backs off, so the one that
      // proceeds is the one that saw nobody, and any later claimer sees it (that claimer's look comes after its own write, which comes after the earlier one's look).
      let clash = false;
      for (let j = 1; j <= MAX_SLOTS && !clash; j++) {
        if (j === k) continue;
        const o = readLock(slotFile(dir, j));
        if (o && o.token !== token && blocks(o)) clash = true;
      }
      if (!clash && !exclusive) {   // D663: a hold written between my look and my claim: back off, so a racing claim never runs inside it
        const late = foreignHold();
        if (late && !late.ignored) clash = true;
      }
      if (!clash) {
        env[TOKEN_ENV] = token;
        let released = false;
        return {
          file, slot: k, reentrant: false, holder: rec,
          release() {
            if (released) return;
            released = true;
            const cur = readLock(file);
            if (cur && cur.token === token) { try { fs.unlinkSync(file); } catch (_) { /* already gone */ } }
            const curHold = myHold ? readLock(holdFile) : null;   // D663: the hold goes only with its own token
            if (curHold && curHold.token === token) { try { fs.unlinkSync(holdFile); } catch (_) { /* already gone */ } }
            if (env[TOKEN_ENV] === token) delete env[TOKEN_ENV];
          },
        };
      }
      const cur = readLock(file);
      if (cur && cur.token === token) { try { fs.unlinkSync(file); } catch (_) {} }
      sleep(Math.floor(Math.random() * pollMs));
      continue;
    }

    // Wait. Name what holds us: the locks that block us if there are any (the same tree), else every holder (all slots taken).
    const heldBy = blockers.length ? blockers : live;
    const named = heldBy.map((x) => x.h);
    const waited = now() - t0;
    if (waited >= maxWaitMs) {
      const many = named.length > 1;
      throw Object.assign(new Error(`heavy-run: gave up after ${mins(waited)} — ${many ? `${named.map(describe).join(' and ')} still hold the slots` : `${describe(named[0])} still holds ${heldBy[0].file}`}. Not running anyway: two heavy runs in one tree make both readings meaningless. Wait for ${many ? 'them' : 'it'}, or ask ${many ? 'those seats' : 'that seat'}.`), { code: 'HEAVY_RUN_TIMEOUT', holder: named[0], holders: named });
    }
    watchIdle(named);
    if (now() - said >= SAY_EVERY_MS) {
      log(`heavy-run: waiting on ${named.map(describe).join(' and ')}${blockers.length ? (n === 1 ? ' — one heavy run at a time' : ' — it holds this tree') : ` — all ${n} slots are held`}`);
      said = now();
    }
    sleep(pollMs);
  }
  } catch (e) { dropMyHold(); throw e; }   // D663: a holder that gives up (the max wait) leaves no hold behind
}

/** Take the lock for this process (waiting as acquire does) and release it on exit, error and signal. On a timeout or a
 *  refusal the process EXITS here, loudly — the runner never starts. */
function hold(opts = {}) {
  let h;
  try { h = acquire(opts); } catch (e) {
    process.stderr.write(e.message + '\n');
    process.exit(e.code === 'HEAVY_RUN_TIMEOUT' ? 3 : e.code === 'HEAVY_RUN_DISK' ? 4 : 2);
  }
  if (h.reentrant) return h;
  applyCap({ env: opts.env || process.env, heavy: opts.heavy });   // L155: after the lock, so a waiter is never throttled
  process.on('exit', () => h.release());
  // On a signal, EXIT, and the 'exit' handler above releases. (A release call here was redundant — process.exit fires
  // 'exit' — and its mutant could not be told apart: L098 H7.) Only when this is the sole listener: a harness with its
  // own signal cleanup exits itself, and its exit releases the same way.
  for (const sig of ['SIGINT', 'SIGTERM', 'SIGBREAK', 'SIGHUP']) {
    process.on(sig, () => { if (process.listenerCount(sig) === 1) process.exit(130); });
  }
  return h;
}

module.exports = { IDLE_WINDOW_MS, IDLE_CPU_S, IDLE_CHECK_MS, idleSampleTree, seatMountUrl, postBoardVia, reportIdle, HOLD_NAME, HOLD_MAX_MS, runCli, acquire, hold, cpuMask, spreadMask, coreMasks, applyCap, profile, pidAlive, pidGone, processIdentity, sameHolder, START_TOLERANCE_MS, IDENTITY_RECHECK_MS, slotCount, slotFile, resolveTree, checkDisk, writePaths, freeBytes, LOCK_NAME, TOKEN_ENV, MAX_WAIT_MS, YOUNG_MS, DEFAULT_SLOTS, MAX_SLOTS, NON_GIT_TREE, DISK_WARN_BYTES, DISK_REFUSE_BYTES };

// D663: `node heavy-run.js --run [--exclusive] --cmd "<what>" -- <program> [args...]` runs one program under the lock (and the hold, with --exclusive) and exits
// with its code. For a run that is not node (a Blender bake, a game run over 10 s, a timing session's own binary): GATES.md, "The heavy-run lock".
function runCli(argv, { spawn = spawnSync } = {}) {
  const dd = argv.indexOf('--');
  const flags = dd < 0 ? argv : argv.slice(0, dd), prog = dd < 0 ? [] : argv.slice(dd + 1);
  const ci = flags.indexOf('--cmd');
  const cmd = ci >= 0 ? flags[ci + 1] : undefined;
  if (!prog.length || !cmd) { process.stderr.write('heavy-run: usage: node heavy-run.js --run [--exclusive] --cmd "<what>" -- <program> [args...]\n'); return 2; }
  hold({ cmd, exclusive: flags.includes('--exclusive') });
  const r = spawn(prog[0], prog.slice(1), { stdio: 'inherit', windowsHide: true });
  if (r.error) { process.stderr.write(`heavy-run: could not start ${prog[0]}: ${r.error.message}\n`); return 2; }
  return r.status === null ? 1 : r.status;
}

if (require.main === module && process.argv[2] === '--run') {
  process.exitCode = runCli(process.argv.slice(3));
}

// L202: the detached child reportIdle starts, so a waiter never waits on the network. It says nothing and fails quietly.
if (require.main === module && process.argv[2] === '--post-board') {
  postBoardVia(process.argv[3], process.argv[4]).catch(() => {});
}

if (require.main === module && process.argv[2] === '--profile') {
  const { values } = profile();
  const key = process.argv[3];
  if (key === undefined) process.stdout.write(JSON.stringify(values) + '\n');
  else if (key in values) process.stdout.write(String(values[key]) + '\n');
}
