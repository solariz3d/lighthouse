// JS-SUITE: MACHINE-BOUND home=L root=CONSONANCE_PYTHON
//
// pulse-degrade.test.js — the four-arm proof of userprompt_pulse.py's ROW 10 degrade, promoted
// from a scratchpad into an instrument. Added 2026-09-08 (BRAVO, L044).
//
// WHY IT EXISTS. On 2026-09-07 the pulse hook was changed so that an unresolvable data dir SAYS SO
// on the pulse line instead of printing nothing — before that, "restart detection is off for this
// whole session" and "no restart happened" were byte-identical. The change was proved by a
// four-arm script in a session scratchpad, and that hand-back said, in as many words, that the fix
// had a proof and no test: `js-suite` discovers `.js`, `dev/shell/hooks/*.py` is discovered by
// nothing, and a guard nobody runs is indistinguishable from one that never existed. The scratchpad
// is gone — the session ended and took it — which is the prediction landing rather than a surprise.
//
// THE INTERPRETER IS RESOLVED, NOT ASSUMED, and that is the point of the file as much as the arms
// are. A test that shells `python` would report this machine's WORKING hook as a failure: measured
// here, `python` and `python3` are absent from PATH (the Windows Store alias answers and exits
// non-zero), only `py -3` works, and the hook itself is registered in settings.json against an
// absolute `...\Python312\python.exe`. Assuming the name would be the corpus-age defect pointed the
// other way — a runtime fact about one box baked into an instrument.
//
// THE CLASS, and why MACHINE-BOUND is the honest one. This file's universe is an INTERPRETER, not a
// corpus. On a machine with no Python 3 the right answer is NOT-RUN with a reason, never a red:
// a suite that goes red because of what is missing from a machine rather than from the code is the
// failure this room calls hardware reported as deficiency, and it has happened twice. `home=L` is
// what stops that being a free pass — this laptop RUNS the pulse hook through a real python.exe on
// every prompt, so a NOT-RUN here is a defect and js-suite fails it (rule f).
//
// `root=CONSONANCE_PYTHON` is the runner's deny handle, and the override is AUTHORITATIVE for it to
// work: if CONSONANCE_PYTHON is set it is the only candidate tried, so pointing it at the runner's
// fresh empty directory really does take the universe away and the gate flips. An override treated
// as a mere hint would let the probe fall through to `py -3`, the gate would not flip, and js-suite
// would correctly call it decorative (rule d).
//
//   node consonance/tools/pulse-degrade.test.js
//   CONSONANCE_PYTHON=/nonexistent node consonance/tools/pulse-degrade.test.js   # the deny probe
'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

// CONSONANCE_PULSE_HOOK is a MUTATION SEAM, same convention as CONSONANCE_WATCH_STATE in
// transcript-watch.js. These arms assert that the hook DEGRADES LOUDLY, and an assertion of that
// shape is worthless until someone has watched it fail — but `dev/shell/hooks/userprompt_pulse.py`
// belongs to no seat this lap and lives in a checkout three other panes are writing to, so
// mutating it in place to prove the point is exactly the in-flight capture this repo has already
// recorded (38ae5c2). The seam lets the mutant run against a COPY and leaves the shared tree alone.
const HOOK = (process.env.CONSONANCE_PULSE_HOOK || '').trim()
  || path.join(__dirname, '..', '..', 'dev', 'shell', 'hooks', 'userprompt_pulse.py');
const MODE = String(process.env.JS_SUITE_UNIVERSE || '').toLowerCase();

// ── THE INTERPRETER GATE ─────────────────────────────────────────────────────────────────────
//
// Candidates in order of authority, each PROBED rather than believed: a name on PATH proves
// nothing on Windows, where `python` resolves to an App Execution Alias that prints an
// advertisement and exits non-zero. The probe demands that the thing actually be a Python 3.
//
// The settings.json candidate is deliberately second. It is the interpreter the hook is REGISTERED
// to run as on this machine, so it is the most faithful answer to "what does this hook run as" —
// but it is one machine's absolute path, so it is read from that machine's own config at runtime
// and never written down here. Reading it is not the same as hardcoding it.
function candidates() {
  const out = [];
  const override = (process.env.CONSONANCE_PYTHON || '').trim();
  if (override) return [{ cmd: override, args: [], why: 'CONSONANCE_PYTHON' }];

  try {
    const s = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.claude', 'settings.json'), 'utf8'));
    for (const group of (s.hooks && s.hooks.UserPromptSubmit) || []) {
      for (const h of group.hooks || []) {
        const m = /^"([^"]+python[^"]*\.exe)"/i.exec(String(h.command || ''));
        if (m && String(h.command).includes('userprompt_pulse.py')) {
          out.push({ cmd: m[1], args: [], why: 'the interpreter this hook is registered against' });
        }
      }
    }
  } catch (_) { /* no settings, or not this machine's shape — fall through to the names */ }

  out.push({ cmd: 'py', args: ['-3'], why: 'the Windows launcher' });
  out.push({ cmd: 'python3', args: [], why: 'python3 on PATH' });
  out.push({ cmd: 'python', args: [], why: 'python on PATH' });
  return out;
}

function resolveInterpreter() {
  const tried = [];
  for (const c of candidates()) {
    const r = spawnSync(c.cmd, [...c.args, '-c', 'import sys; print(sys.version_info[0])'],
      { encoding: 'utf8', timeout: 20000 });
    if (r.status === 0 && String(r.stdout).trim() === '3') return { ...c, ok: true };
    tried.push(`${c.cmd}${c.args.length ? ' ' + c.args.join(' ') : ''} (${c.why}): `
      + (r.error ? r.error.code || r.error.message : `exit ${r.status}`));
  }
  return { ok: false, tried };
}

const PY = resolveInterpreter();

if (PY.ok) {
  console.log(`JS-SUITE: UNIVERSE python3 found — ${PY.cmd}${PY.args.length ? ' ' + PY.args.join(' ') : ''} (${PY.why}); hook ${fs.existsSync(HOOK) ? 'present' : 'MISSING'}`);
} else {
  console.log('JS-SUITE: UNIVERSE no python3 — tried: ' + PY.tried.join(' | '));
}
if (!fs.existsSync(HOOK)) {
  console.log(`JS-SUITE: NOT-RUN — the hook under test is absent at ${path.relative(process.cwd(), HOOK)}, so there is nothing on this machine for these arms to be about`);
  process.exit(0);
}
// `force` is honoured BEFORE the decline, so the runner can prove the gate is not a skip: forced,
// the arms run and either pass (the gate was wrong) or fail (the universe really was absent).
if (!PY.ok && MODE !== 'force') {
  console.log('JS-SUITE: NOT-RUN — no working Python 3 on this machine, and this file drives a '
    + '.py hook as a subprocess. Tried: ' + PY.tried.join(' | '));
  process.exit(0);
}

// ── THE ARMS ─────────────────────────────────────────────────────────────────────────────────

let pass = 0, fail = 0;
function t(name, fn) {
  try { fn(); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n       ${e.message}`); fail++; }
}

// Every arm builds its own HOME and its own cwd, so nothing here can touch the live pulse state.
// The hook keys its state file on the BASENAME of the working directory
// (`pulse_state.<cwd>.json`), so the cwd is part of the isolation and not incidental.
function arm({ configDataDir, envDataDir, ledger }) {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'pulse-home-'));
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'pulse-cwd-'));
  const data = fs.mkdtempSync(path.join(os.tmpdir(), 'pulse-data-'));

  const cfg = { machine_tag: 'TEST' };
  if (configDataDir) cfg.data_dir = data;
  fs.writeFileSync(path.join(home, '.consonance.json'), JSON.stringify(cfg));

  // A prompt two hours back, so `prev` is set and the restart check actually runs. Without it the
  // whole ROW 10 block is skipped and every arm would agree by doing nothing.
  const twoHoursAgo = new Date(Date.now() - 2 * 3600 * 1000);
  const shell = path.join(home, '.claude', 'shell');
  fs.mkdirSync(shell, { recursive: true });
  fs.writeFileSync(path.join(shell, `pulse_state.${path.basename(cwd)}.json`),
    JSON.stringify({ last_prompt_iso: twoHoursAgo.toISOString().replace('Z', '+00:00') }));

  // The restart the detector is meant to find: a `start` event AFTER the seeded prompt.
  if (ledger) {
    fs.writeFileSync(path.join(data, 'head-watch.jsonl'),
      JSON.stringify({ event: 'start', ts: new Date(Date.now() - 3600 * 1000).toISOString() }) + '\n');
  }

  const env = { ...process.env, USERPROFILE: home, HOME: home };
  delete env.CONSONANCE_DATA;
  if (envDataDir) env.CONSONANCE_DATA = data;

  const out = execFileSync(PY.cmd, [...PY.args, HOOK], {
    input: JSON.stringify({ session_id: 'test', transcript_path: '' }),
    cwd, env, encoding: 'utf8', timeout: 60000,
  });
  let line = '';
  try { line = JSON.parse(out).hookSpecificOutput.additionalContext; } catch (_) { line = out; }
  for (const d of [home, cwd, data]) fs.rmSync(d, { recursive: true, force: true });
  return line;
}

t('ARM A — config resolves and the ledger is there: the restart is DETECTED', () => {
  const line = arm({ configDataDir: true, ledger: true });
  assert.ok(/crosses a restart/.test(line), `expected a restart detection, got: ${line}`);
  assert.ok(!/detection OFF/.test(line), `a working machine must not degrade: ${line}`);
});

t('THE BAR — ARM B: no env and no data_dir in the config, so the detector SAYS it is off', () => {
  // This is the arm the whole change exists for. Before 2026-09-07 this printed nothing at all,
  // which read exactly like "no restart happened" — a detector that is off reporting as a detector
  // that found nothing.
  const line = arm({ configDataDir: false, ledger: false });
  assert.ok(/restart detection OFF/.test(line), `expected a spoken degrade, got: ${line}`);
  assert.ok(/CONSONANCE_DATA unset/.test(line), `the degrade must name the cause, got: ${line}`);
  assert.ok(!/crosses a restart/.test(line), `it must not also claim a detection: ${line}`);
});

t('ARM C — the dir resolves but the ledger is absent: still off, and it says WHICH layer', () => {
  const line = arm({ configDataDir: true, ledger: false });
  assert.ok(/restart detection OFF/.test(line), `expected a degrade, got: ${line}`);
  assert.ok(/head-watch\.jsonl/.test(line),
    `arm C must name the missing ledger, not repeat arm B's reason: ${line}`);
});

t('ARM D — CONSONANCE_DATA still wins over a config with no data_dir', () => {
  const line = arm({ configDataDir: false, envDataDir: true, ledger: true });
  assert.ok(/crosses a restart/.test(line), `tier one must still resolve, got: ${line}`);
  assert.ok(!/detection OFF/.test(line), `tier one resolved, so nothing is off: ${line}`);
});

t('the degrade is not prefixed twice — the line already opens with [pulse]', () => {
  // A real defect in the first draft of the fix, caught by running it: the marker was written into
  // the degrade string as well, so arm B printed "[pulse] ... · [pulse] restart detection OFF".
  const line = arm({ configDataDir: false, ledger: false });
  const marks = (line.match(/\[pulse\]/g) || []).length;
  assert.ok(marks <= 1, `"[pulse]" appears ${marks} times in one line: ${line}`);
});

t('A and D cost the normal path nothing — a working machine reads as it always did', () => {
  // The degrade must be invisible where nothing is wrong. Both resolving arms carry the detection
  // and neither carries a word about tiers, configs or what could not be found.
  for (const [name, opts] of [['A', { configDataDir: true, ledger: true }],
                              ['D', { configDataDir: false, envDataDir: true, ledger: true }]]) {
    const line = arm(opts);
    assert.ok(!/OFF|unset|no head-watch/.test(line),
      `arm ${name} leaked degrade wording onto a healthy machine: ${line}`);
  }
});

console.log(`\npulse-degrade: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
