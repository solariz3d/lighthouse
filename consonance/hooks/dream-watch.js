// dream-watch.js — UserPromptSubmit hook. One line when the dream cycle has stopped
// dreaming; silent when it hasn't.
//
// WHY THIS EXISTS. Measured 2026-07-27: no dream had been produced in 13 days, on any
// bed, and nothing in the system could say so. The cycle's only observability is
// <instance>\dreams\dream.log — which a task refused by the scheduler never reaches — and
// the night table returns "" for a quiet night on purpose, so THIRTEEN SILENT DAYS AND A
// HEALTHY QUIET NIGHT ARE BYTE-IDENTICAL to the waking thread. Every gauge was green.
// The failure the whole reliability arc was written to abolish was the live state of the
// machine, and it took an adversarial review to notice.
//
// So this hook reads the two things dream.log cannot report on its own:
//   · the scheduled task's own verdict (LastTaskResult / LastRunTime), which is where a
//     refusal lands when the runner never starts, and
//   · the age of the newest dream on disk, against the machine's configured cadence.
//
// LAWS IT KEEPS (inherited from board-digest.js, each paid for by an earlier failure):
//   · Facts, no verdicts — it reports the code, the time and the age. It never says
//     "you should re-run the installer." Naming a file as the source of truth is a fact;
//     telling the reader what to do would make the program the judge.
//   · Silent when healthy — a working cycle produces no line, ever.
//   · Quiet when broken, too — one line per COOLDOWN_MS per machine, shared across panes,
//     because a stuck task would otherwise stamp every turn of every pane. A CHANGED
//     reason breaks the cooldown immediately: a new failure must never be swallowed by an
//     old one's silence.
//   · Defensive: never throws, never blocks a turn, always exits 0.
//   · Safe to install globally — outside a Consonance instance it says nothing at all.
//
// Node, not Rust: same reason as board-digest — no cargo build, no reinstall, and it runs
// against the live machine the night it is written.
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const TASK_NAME = '\\Consonance Dream Cycle';
const COOLDOWN_MS = 6 * 60 * 60 * 1000; // one line per 6h per machine unless the reason changes
const DEFAULT_TIMES = 4;                // install_dream.ps1's built-in default: 4 cycles/day
const MIN_STALE_HOURS = 48;             // a quiet day is normal (guard 2 skips whenever a pane is up)
const STALE_CADENCE_MULT = 3;           // …but three missed cadences in a row is not

// Task-result codes that are NOT failures. schtasks reports the result as a SIGNED 32-bit
// int, so 0x800710E0 arrives as -2147020576 and must be normalised before comparison.
const BENIGN = new Set([
  0,        // success
  267009,   // 0x41301 currently running
  267011,   // 0x41303 has not yet run
]);

// Only the codes this room has actually seen or can act on. Anything else is reported as
// bare hex rather than guessed at — a wrong decode is worse than none.
const KNOWN = {
  2147946720: '0x800710E0 the operator or administrator refused the request — on a laptop that is the task\'s own power conditions (DisallowStartIfOnBatteries / StopIfGoingOnBatteries)',
  267014: '0x41306 the last run was terminated by the user',
  267012: '0x41304 no more runs are scheduled',
  2147942401: '0x80070001 incorrect function — the action could not be started',
  2147942402: '0x80070002 the system cannot find the file specified — the runner or its shim is missing',
};

function emit(line) {
  if (line) {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: line,
      },
    }));
  }
  process.exit(0);
}

// Stream, not readFileSync(0): on Windows a piped fd 0 throws EAGAIN, and swallowing that
// loses cwd — which would make the instances-dir guard pass everywhere. board-digest paid
// for this line already.
function withStdin(cb) {
  let data = '';
  let done = false;
  let timer = null;
  const finish = () => {
    if (done) return;
    done = true;
    if (timer) clearTimeout(timer);
    let parsed = {};
    try { parsed = JSON.parse(data.replace(/^﻿/, '')); } catch (_) {}
    cb(parsed);
  };
  try {
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (d) => { data += d; });
    process.stdin.on('end', finish);
    process.stdin.on('error', finish);
    timer = setTimeout(finish, 2000); // never hang a turn; hook budget is 10s
  } catch (_) {
    finish();
  }
}

function readJson(p, fallback) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8').replace(/^﻿/, ''));
  } catch (_) {
    return fallback;
  }
}

function underDir(child, parent) {
  if (!child || !parent) return false;
  const rel = path.relative(path.resolve(parent), path.resolve(child));
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}

// ── pure helpers (exported for the test file) ───────────────────────────────

// schtasks /fo LIST /v prints one block PER TRIGGER, so every field repeats. Take the
// first occurrence of each; they describe the same task.
function parseTaskQuery(text) {
  if (!text) return null;
  const field = (name) => {
    const m = text.match(new RegExp('^\\s*' + name + ':\\s*(.+?)\\s*$', 'im'));
    return m ? m[1] : '';
  };
  const raw = field('Last Result');
  if (!raw && !field('TaskName')) return null;
  const n = parseInt(raw, 10);
  return {
    lastResult: Number.isNaN(n) ? null : n,
    lastRun: field('Last Run Time'),
    nextRun: field('Next Run Time'),
    status: field('Status'),
    state: field('Scheduled Task State'),
  };
}

// Returns null when the task is fine, or a human string naming the code.
function classifyResult(signed) {
  if (signed === null || signed === undefined) return null;
  const u = signed < 0 ? signed >>> 0 : signed;
  if (BENIGN.has(u)) return null;
  return KNOWN[u] || ('0x' + u.toString(16).toUpperCase().padStart(8, '0'));
}

// How old a dream may get before silence is itself the finding. Config wins; otherwise
// three missed cadences, floored so a normal quiet day never speaks.
function staleThresholdMs(cfg) {
  const override = Number(cfg && cfg.dream_stale_hours);
  if (Number.isFinite(override) && override > 0) return override * 3600 * 1000;
  const perDay = Array.isArray(cfg && cfg.dream_times) && cfg.dream_times.length
    ? cfg.dream_times.length
    : DEFAULT_TIMES;
  const cadenceHours = 24 / perDay;
  return Math.max(MIN_STALE_HOURS, STALE_CADENCE_MULT * cadenceHours) * 3600 * 1000;
}

function humanAge(ms) {
  const h = ms / 3600000;
  if (h < 48) return `${Math.floor(h)}h`;
  const d = Math.floor(h / 24);
  return `${d}d ${Math.floor(h - d * 24)}h`;
}

function stamp(ms) {
  const d = new Date(ms);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

// Newest dream file and newest runner activity, across every instance on this bed.
// Split on purpose: a log that is newer than the newest dream means the runner IS firing
// and its guards are skipping — a different failure from the runner never starting, and
// the two want different first moves.
function scanDreams(instancesDir, now) {
  const out = { newestDream: 0, newestLog: 0, instances: 0, lastEvent: '', lastReason: '' };
  let entries = [];
  try { entries = fs.readdirSync(instancesDir, { withFileTypes: true }); } catch (_) { return out; }
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const dir = path.join(instancesDir, e.name, 'dreams');
    let files = [];
    try { files = fs.readdirSync(dir); } catch (_) { continue; }
    out.instances++;
    for (const f of files) {
      let st;
      try { st = fs.statSync(path.join(dir, f)); } catch (_) { continue; }
      const t = st.mtimeMs;
      if (t > now + 60000) continue; // a clock-skewed future stamp is not evidence of health
      if (f.toLowerCase() === 'dream.log') {
        if (t > out.newestLog) {
          out.newestLog = t;
          /* WHY it skipped, not merely THAT it ran. Without this the watcher reports a healthy
           * guard as a fault: on this laptop 21 of 21 skips are 'someone is here', which is the
           * guard working exactly as designed on a machine its keeper works at overnight. */
          try {
            const lines = fs.readFileSync(path.join(dir, f), 'utf8').split(/\r?\n/).filter(Boolean);
            for (let i = lines.length - 1; i >= 0; i--) {
              const m = lines[i].match(/\b(skip|cycle end|cycle start):?\s*(.*)$/);
              if (m) { out.lastEvent = m[1]; out.lastReason = (m[2] || '').trim(); break; }
            }
          } catch (_) { /* unreadable log is not evidence of anything */ }
        }
      }
      else if (f.toLowerCase().endsWith('.md')) { if (t > out.newestDream) out.newestDream = t; }
    }
  }
  return out;
}

// The whole judgement, as one pure function of measurements. Returns null when healthy.
function buildLine(m) {
  const parts = [];

  if (m.taskMissing) {
    parts.push(`no "${TASK_NAME.replace(/^\\/, '')}" task is registered on this machine`);
  } else if (m.resultText) {
    const when = m.lastRun && m.lastRun !== 'N/A' ? `, last run ${m.lastRun}` : '';
    parts.push(`the scheduled task returned ${m.resultText}${when}`);
  }

  if (m.newestDream === 0 && m.instances > 0) {
    parts.push('no dream has ever been written on this bed');
  } else if (m.newestDream > 0 && m.dreamAgeMs > m.thresholdMs) {
    /* A GUARD THAT FIRES IS NOT A FAULT. If the runner's last act was a deliberate skip -- a
     * human at the machine, a live pane, battery -- then the cycle is working and this watcher
     * has nothing to report. Saying otherwise on a machine whose keeper works overnight is the
     * cry-wolf failure, and on 2026-08-24 it fed a false finding to the librarian: 'the one
     * consolidation organ is broken right now'. 21 of 21 skips on that machine were the guard. */
    const deliberate = m.lastEvent === 'skip'
      && /someone is here|live |on battery|idle/i.test(m.lastReason || '');
    if (!deliberate) {
      let s = `no dream in ${humanAge(m.dreamAgeMs)} (newest ${stamp(m.newestDream)})`;
      // runner alive + no dream = the guards are eating it; that is a different first move
      if (m.newestLog > m.newestDream + 3600000) {
        s += `, though the runner logged activity as recently as ${stamp(m.newestLog)} — it is firing and skipping, not silent`;
      }
      parts.push(s);
    }
  }

  if (!parts.length) return null;
  return `[dream-watch] ${parts.join('; ')}. The registration's source of truth is dev/dream/install_dream.ps1; the runner logs to <instance>\\dreams\\dream.log.`;
}

// Cooldown, shared across panes. A changed reason always speaks immediately.
function shouldEmit(state, line, now, cooldownMs) {
  if (!state || typeof state !== 'object') return true;
  if (state.line !== line) return true;
  const last = Number(state.at);
  if (!Number.isFinite(last)) return true;
  return now - last >= cooldownMs;
}

function writeStateAtomic(p, obj) {
  try {
    const tmp = `${p}.tmp${process.pid}`;
    fs.writeFileSync(tmp, JSON.stringify(obj));
    fs.renameSync(tmp, p); // rename is atomic on NTFS; two panes racing can't interleave a half file
  } catch (_) {}
}

// ── main ────────────────────────────────────────────────────────────────────

// Test seams. CONSONANCE_DATA already exists as an override in tools/tell-index.js, so this
// follows a convention rather than inventing one. They exist because the rotation read found
// the real gap in this file: every unit test covered a pure helper, and emit()/main() — the
// two places where a break is INVISIBLE — were untested. Five mutations reachable only there
// broke the hook with the whole suite still green, and four of them broke it into silence
// that looks healthy, which is the exact failure this hook was written to end. An instrument
// against silent failure cannot have a silent-failure gap in its own tests, and it cannot be
// closed without being able to run the hook end to end against a fixture.
function envOverride(name) {
  const v = process.env[name];
  return v && String(v).trim() ? String(v).trim() : null;
}

function main(input) {
  const home = process.env.USERPROFILE || os.homedir();
  const cfg = readJson(path.join(home, '.consonance.json'), {});
  const dataDir = envOverride('CONSONANCE_DATA') || cfg.data_dir || path.join(home, '.consonance');
  const instancesDir = envOverride('CONSONANCE_INSTANCES') || cfg.instances_dir || path.join(home, 'claude-instances');

  const cwd = input && input.cwd ? input.cwd : process.cwd();
  if (!underDir(cwd, instancesDir)) emit(null); // outside an instance there is no bed to report

  const now = Date.now();

  let task = null;
  let taskMissing = false;
  const fixture = envOverride('CONSONANCE_DREAM_TASK_FIXTURE');
  if (fixture) {
    // A canned schtasks listing, or the literal MISSING to stand for an unregistered task.
    if (fixture === 'MISSING') taskMissing = true;
    else {
      try { task = parseTaskQuery(fs.readFileSync(fixture, 'utf8')); } catch (_) { taskMissing = true; }
    }
  } else {
    try {
      const out = execFileSync('schtasks', ['/query', '/tn', TASK_NAME, '/fo', 'LIST', '/v'], {
        encoding: 'latin1', timeout: 5000, windowsHide: true, stdio: ['ignore', 'pipe', 'ignore'],
      });
      task = parseTaskQuery(out);
    } catch (_) {
      // nonzero exit = the task does not exist (or schtasks is unavailable, e.g. non-Windows).
      // Only claim "not registered" where the query itself is meaningful.
      taskMissing = process.platform === 'win32';
    }
  }

  const scan = scanDreams(instancesDir, now);
  const line = buildLine({
    taskMissing,
    resultText: task ? classifyResult(task.lastResult) : null,
    lastRun: task ? task.lastRun : '',
    newestDream: scan.newestDream,
    newestLog: scan.newestLog,
    instances: scan.instances,
    dreamAgeMs: scan.newestDream ? now - scan.newestDream : Infinity,
    thresholdMs: staleThresholdMs(cfg),
  });
  if (!line) emit(null);

  const statePath = path.join(dataDir, 'dream-watch.state.json');
  const state = readJson(statePath, {});
  if (!shouldEmit(state, line, now, COOLDOWN_MS)) emit(null);
  writeStateAtomic(statePath, { line, at: now });
  emit(line);
}

// THE DREAM GATE. dev/dream/dream_cycle.ps1 sets CONSONANCE_DREAM=1 in the `claude -p`
// environment it spawns. The gap-dream is an anti-instruction and gets no hooks — and of all
// five, this is the one that would be strangest to leak: a dreaming instance handed a health
// report about the dream cycle it is currently inside. A dream told its own machinery is
// failing has been given a task, which is the one thing the register is built to be free of.
// (Blind-pair review, 2026-07-27.)
if (process.env.CONSONANCE_DREAM) process.exit(0);

if (require.main === module) {
  try { withStdin(main); } catch (_) { process.exit(0); }
}

module.exports = {
  parseTaskQuery, classifyResult, staleThresholdMs, scanDreams,
  buildLine, shouldEmit, humanAge, underDir,
  TASK_NAME, COOLDOWN_MS, MIN_STALE_HOURS,
};
