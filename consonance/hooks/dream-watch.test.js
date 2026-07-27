// dream-watch.test.js — run: node consonance/hooks/dream-watch.test.js
//
// Zero dependencies, matching the hooks' own style: they are installed by copy onto a
// machine that has node and nothing else. There is no JS test harness in this repo (the
// Rust side has cargo, the live loop has pytest); this file is the whole harness for the
// hook layer, and it is deliberately runnable with one command and no install.
//
// What it covers is what a hook can get wrong silently: a parse that fails and returns a
// plausible-looking nothing (the BOM lesson, twice), a signed/unsigned confusion that
// turns a real failure into a benign one, and a cooldown that swallows a NEW failure
// because an old one already spoke.
'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const W = require('./dream-watch.js');

let pass = 0;
const fails = [];
function t(name, fn) {
  try { fn(); pass++; }
  catch (e) { fails.push(`${name}\n    ${e.message.split('\n')[0]}`); }
}

// ── parseTaskQuery ──────────────────────────────────────────────────────────
// Captured verbatim from this bed, 2026-07-27. /fo LIST /v repeats every field once per
// trigger; the parser must take the first block and not trip over the repeats.
const REAL = `
Folder: \\
HostName:                             ZACHSLEGION
TaskName:                             \\Consonance Dream Cycle
Next Run Time:                        2026-07-27 10:30:00 AM
Status:                               Ready
Last Run Time:                        2026-07-27 12:26:22 AM
Last Result:                          -2147020576
Scheduled Task State:                 Enabled

HostName:                             ZACHSLEGION
TaskName:                             \\Consonance Dream Cycle
Next Run Time:                        2026-07-27 10:30:00 AM
Status:                               Ready
Last Run Time:                        2026-07-27 12:26:22 AM
Last Result:                          -2147020576
Scheduled Task State:                 Enabled
`;

t('parseTaskQuery reads the first block of a repeated /v listing', () => {
  const p = W.parseTaskQuery(REAL);
  assert.strictEqual(p.lastResult, -2147020576);
  assert.strictEqual(p.lastRun, '2026-07-27 12:26:22 AM');
  assert.strictEqual(p.status, 'Ready');
});

t('parseTaskQuery survives a task that has never run', () => {
  const p = W.parseTaskQuery('TaskName: \\X\nLast Run Time: N/A\nLast Result: 267011\n');
  assert.strictEqual(p.lastResult, 267011);
  assert.strictEqual(p.lastRun, 'N/A');
});

t('parseTaskQuery returns null on junk rather than a plausible empty', () => {
  assert.strictEqual(W.parseTaskQuery('ERROR: cannot find the file specified.'), null);
  assert.strictEqual(W.parseTaskQuery(''), null);
  assert.strictEqual(W.parseTaskQuery(null), null);
});

t('parseTaskQuery tolerates an unparsable result without inventing one', () => {
  const p = W.parseTaskQuery('TaskName: \\X\nLast Result: \n');
  assert.strictEqual(p.lastResult, null);
});

// ── classifyResult ──────────────────────────────────────────────────────────
t('classifyResult treats success and the two running/never-ran codes as healthy', () => {
  assert.strictEqual(W.classifyResult(0), null);
  assert.strictEqual(W.classifyResult(267009), null); // 0x41301 running
  assert.strictEqual(W.classifyResult(267011), null); // 0x41303 not yet run
  assert.strictEqual(W.classifyResult(null), null);
  assert.strictEqual(W.classifyResult(undefined), null);
});

t('classifyResult normalises the SIGNED int schtasks prints — this is the live failure', () => {
  const signed = W.classifyResult(-2147020576);
  const unsigned = W.classifyResult(2147946720);
  assert.ok(signed && /0x800710E0/.test(signed), `expected 0x800710E0, got ${signed}`);
  assert.strictEqual(signed, unsigned, 'signed and unsigned forms must classify identically');
  assert.ok(/power conditions/i.test(signed), 'the one code this bed actually hit should be named');
});

t('classifyResult reports an unknown code as bare hex rather than guessing', () => {
  assert.strictEqual(W.classifyResult(5), '0x00000005');
});

// ── staleThresholdMs ────────────────────────────────────────────────────────
const H = 3600 * 1000;
t('staleThresholdMs floors at 48h so a normal quiet day never speaks', () => {
  assert.strictEqual(W.staleThresholdMs({}), 48 * H);                         // default 4/day -> 18h -> floor
  assert.strictEqual(W.staleThresholdMs({ dream_times: ['1', '2', '3', '4'] }), 48 * H);
  assert.strictEqual(W.staleThresholdMs({ dream_times: ['1', '2'] }), 48 * H); // 2/day -> 36h -> floor
});

t('staleThresholdMs stretches for a slow cadence', () => {
  assert.strictEqual(W.staleThresholdMs({ dream_times: ['04:30'] }), 72 * H); // 1/day -> 3 x 24h
});

t('staleThresholdMs lets config override, and ignores nonsense', () => {
  assert.strictEqual(W.staleThresholdMs({ dream_stale_hours: 6 }), 6 * H);
  assert.strictEqual(W.staleThresholdMs({ dream_stale_hours: 0 }), 48 * H);
  assert.strictEqual(W.staleThresholdMs({ dream_stale_hours: 'soon' }), 48 * H);
});

// ── buildLine ───────────────────────────────────────────────────────────────
const NOW = Date.parse('2026-07-27T04:00:00');
const healthy = {
  taskMissing: false, resultText: null, lastRun: '2026-07-27 00:26',
  newestDream: NOW - 3 * H, newestLog: NOW - 3 * H, instances: 3,
  dreamAgeMs: 3 * H, thresholdMs: 48 * H,
};

t('buildLine is silent when the cycle is healthy', () => {
  assert.strictEqual(W.buildLine(healthy), null);
});

t('buildLine names the 13-day silence this hook exists for', () => {
  const age = 13 * 24 * H;
  const line = W.buildLine({ ...healthy, newestDream: NOW - age, newestLog: NOW - age, dreamAgeMs: age });
  assert.ok(/13d/.test(line), line);
  assert.ok(/no dream in/.test(line), line);
});

t('buildLine reports a nonzero task result even while dreams are fresh', () => {
  const line = W.buildLine({ ...healthy, resultText: '0x800710E0 refused' });
  assert.ok(/scheduled task returned 0x800710E0/.test(line), line);
  assert.ok(/last run 2026-07-27 00:26/.test(line), line);
});

t('buildLine joins both findings when both are true', () => {
  const age = 13 * 24 * H;
  const line = W.buildLine({
    ...healthy, resultText: '0x800710E0 refused',
    newestDream: NOW - age, newestLog: NOW - age, dreamAgeMs: age,
  });
  assert.ok(/scheduled task returned/.test(line) && /no dream in/.test(line), line);
});

t('buildLine separates firing-and-skipping from silent — different failures, different first move', () => {
  const age = 13 * 24 * H;
  const line = W.buildLine({
    ...healthy, newestDream: NOW - age, dreamAgeMs: age, newestLog: NOW - 2 * H,
  });
  assert.ok(/firing and skipping/.test(line), line);
});

t('buildLine says so when a bed exists but has never dreamed', () => {
  const line = W.buildLine({ ...healthy, newestDream: 0, dreamAgeMs: Infinity });
  assert.ok(/no dream has ever been written on this bed/.test(line), line);
});

t('buildLine stays silent about dreams on a machine with no instances at all', () => {
  assert.strictEqual(W.buildLine({ ...healthy, newestDream: 0, instances: 0, dreamAgeMs: Infinity }), null);
});

t('buildLine reports a missing registration', () => {
  const line = W.buildLine({ ...healthy, taskMissing: true });
  assert.ok(/no "Consonance Dream Cycle" task is registered/.test(line), line);
});

t('buildLine never issues an instruction — facts only, per the digest law', () => {
  const age = 13 * 24 * H;
  const line = W.buildLine({
    ...healthy, resultText: '0x800710E0 refused',
    newestDream: NOW - age, newestLog: NOW - age, dreamAgeMs: age,
  });
  assert.ok(!/\byou should\b|\bre-run\b|\bplease\b|\bfix\b/i.test(line), `verdict language leaked: ${line}`);
});

// ── shouldEmit (the cooldown) ───────────────────────────────────────────────
t('shouldEmit speaks the first time', () => {
  assert.strictEqual(W.shouldEmit({}, 'a', NOW, W.COOLDOWN_MS), true);
  assert.strictEqual(W.shouldEmit(null, 'a', NOW, W.COOLDOWN_MS), true);
});

t('shouldEmit stays quiet for a repeat inside the window', () => {
  assert.strictEqual(W.shouldEmit({ line: 'a', at: NOW - 60000 }, 'a', NOW, W.COOLDOWN_MS), false);
});

t('shouldEmit speaks again once the window passes', () => {
  assert.strictEqual(W.shouldEmit({ line: 'a', at: NOW - 7 * H }, 'a', NOW, W.COOLDOWN_MS), true);
});

t('a NEW failure breaks the cooldown immediately — the whole point of keying on the reason', () => {
  assert.strictEqual(W.shouldEmit({ line: 'a', at: NOW - 60000 }, 'b', NOW, W.COOLDOWN_MS), true);
});

t('shouldEmit survives a corrupt state file', () => {
  assert.strictEqual(W.shouldEmit({ line: 'a', at: 'yesterday' }, 'a', NOW, W.COOLDOWN_MS), true);
});

// ── scanDreams (real filesystem, temp fixture) ──────────────────────────────
t('scanDreams finds the newest dream and the newest log across beds', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dreamwatch-'));
  try {
    const a = path.join(root, 'sibling-a', 'dreams');
    const b = path.join(root, 'sibling-b', 'dreams');
    fs.mkdirSync(a, { recursive: true });
    fs.mkdirSync(b, { recursive: true });
    fs.writeFileSync(path.join(a, '2026-07-13_0646.md'), 'x');
    fs.writeFileSync(path.join(b, '2026-07-14_0157.md'), 'x');
    fs.writeFileSync(path.join(b, 'dream.log'), 'x');
    fs.writeFileSync(path.join(root, 'sibling-b', 'notes.md'), 'x'); // outside dreams/ — must be ignored

    const old = Date.now() - 10 * 24 * H;
    fs.utimesSync(path.join(a, '2026-07-13_0646.md'), old / 1000, old / 1000);
    const mid = Date.now() - 5 * 24 * H;
    fs.utimesSync(path.join(b, '2026-07-14_0157.md'), mid / 1000, mid / 1000);
    const recent = Date.now() - 2 * H;
    fs.utimesSync(path.join(b, 'dream.log'), recent / 1000, recent / 1000);

    const s = W.scanDreams(root, Date.now());
    assert.strictEqual(s.instances, 2);
    assert.ok(Math.abs(s.newestDream - mid) < 5000, 'newest .md should be the 5-day-old one');
    assert.ok(Math.abs(s.newestLog - recent) < 5000, 'dream.log tracked separately from dreams');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

t('scanDreams reports nothing rather than throwing when the instances dir is absent', () => {
  const s = W.scanDreams(path.join(os.tmpdir(), 'definitely-not-here-' + Date.now()), Date.now());
  assert.deepStrictEqual(s, { newestDream: 0, newestLog: 0, instances: 0 });
});

t('scanDreams ignores a future mtime — clock skew is not evidence of health', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dreamwatch-'));
  try {
    const d = path.join(root, 'sibling-a', 'dreams');
    fs.mkdirSync(d, { recursive: true });
    const f = path.join(d, 'future.md');
    fs.writeFileSync(f, 'x');
    const soon = Date.now() + 3 * 24 * H;
    fs.utimesSync(f, soon / 1000, soon / 1000);
    assert.strictEqual(W.scanDreams(root, Date.now()).newestDream, 0);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

// ── underDir (the global-install guard) ─────────────────────────────────────
t('underDir gates the hook to Consonance instances', () => {
  assert.strictEqual(W.underDir('C:\\Consonance\\instances\\sibling-a', 'C:\\Consonance\\instances'), true);
  assert.strictEqual(W.underDir('C:\\Consonance\\instances', 'C:\\Consonance\\instances'), true);
  assert.strictEqual(W.underDir('C:\\Users\\zackn\\code', 'C:\\Consonance\\instances'), false);
  assert.strictEqual(W.underDir('', 'C:\\Consonance\\instances'), false);
});

// ── END TO END: emit() and main(), the two paths that fail INVISIBLY ────────
//
// Added after a rotation read found the gap: every test above exercises a pure helper, and
// five mutations reachable only in emit()/main() broke the hook with the whole suite green —
// four of them into silence that looks healthy, which is verbatim the failure this hook was
// written to end. The tests below run the real file as a real subprocess against a fixture
// tree and read what a hook host would actually receive.
const { execFileSync } = require('child_process');
const HOOK = path.join(__dirname, 'dream-watch.js');

const TASK_FAILING = `TaskName:      \\Consonance Dream Cycle
Next Run Time: 2026-07-27 10:30:00 AM
Status:        Ready
Last Run Time: 2026-07-27 12:26:22 AM
Last Result:   -2147020576
`;
const TASK_OK = `TaskName:      \\Consonance Dream Cycle
Next Run Time: 2026-07-27 10:30:00 AM
Status:        Ready
Last Run Time: 2026-07-27 04:30:00 AM
Last Result:   0
`;

// A fixture bed: one instance, one dream of the given age, one log of the given age.
function bed(root, dreamAgeH, logAgeH) {
  const d = path.join(root, 'instances', 'sibling-fixture', 'dreams');
  fs.mkdirSync(d, { recursive: true });
  fs.mkdirSync(path.join(root, 'data'), { recursive: true });
  const md = path.join(d, '2026-07-14_0157.md');
  fs.writeFileSync(md, 'x');
  const t = (Date.now() - dreamAgeH * H) / 1000;
  fs.utimesSync(md, t, t);
  if (logAgeH != null) {
    const lg = path.join(d, 'dream.log');
    fs.writeFileSync(lg, 'x');
    const lt = (Date.now() - logAgeH * H) / 1000;
    fs.utimesSync(lg, lt, lt);
  }
  return { instances: path.join(root, 'instances'), data: path.join(root, 'data') };
}

// Run the hook exactly as a host does: JSON on stdin, read stdout.
function runHook(fx, taskFixture, cwd) {
  return execFileSync(process.execPath, [HOOK], {
    input: JSON.stringify({ cwd: cwd || path.join(fx.instances, 'sibling-fixture'), session_id: 'test' }),
    encoding: 'utf8',
    env: {
      ...process.env,
      CONSONANCE_DATA: fx.data,
      CONSONANCE_INSTANCES: fx.instances,
      CONSONANCE_DREAM_TASK_FIXTURE: taskFixture,
    },
  });
}

function withFixture(dreamAgeH, logAgeH, taskText, fn) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dreamwatch-e2e-'));
  try {
    const fx = bed(root, dreamAgeH, logAgeH);
    let taskFixture = 'MISSING';
    if (taskText !== 'MISSING') {
      taskFixture = path.join(root, 'task.txt');
      fs.writeFileSync(taskFixture, taskText);
    }
    fn(fx, taskFixture);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

t('E2E: the host receives parseable JSON in the shape a UserPromptSubmit hook must return', () => {
  withFixture(13 * 24, 13 * 24, TASK_FAILING, (fx, tf) => {
    const out = runHook(fx, tf);
    const parsed = JSON.parse(out); // a wrong key or a truncated write dies here
    assert.strictEqual(parsed.hookSpecificOutput.hookEventName, 'UserPromptSubmit');
    assert.ok(
      typeof parsed.hookSpecificOutput.additionalContext === 'string' &&
        parsed.hookSpecificOutput.additionalContext.length > 0,
      'the line must arrive under hookSpecificOutput.additionalContext or the host delivers nothing'
    );
  });
});

t('E2E: the emitted line carries BOTH halves — the task verdict and the dream age', () => {
  withFixture(13 * 24, 13 * 24, TASK_FAILING, (fx, tf) => {
    const line = JSON.parse(runHook(fx, tf)).hookSpecificOutput.additionalContext;
    assert.ok(/0x800710E0/.test(line), `task verdict missing: ${line}`);
    assert.ok(/no dream in 13d/.test(line), `dream age missing: ${line}`);
  });
});

t('E2E: age is measured from the DREAM, not from the log — swapping them is invisible to unit tests', () => {
  // 13-day-old dream, 2-hour-old log: the runner is alive and its guards are eating the cycle.
  withFixture(13 * 24, 2, TASK_OK, (fx, tf) => {
    const line = JSON.parse(runHook(fx, tf)).hookSpecificOutput.additionalContext;
    assert.ok(/no dream in 13d/.test(line), `read the wrong file for age: ${line}`);
    assert.ok(/firing and skipping/.test(line), `the alive-but-skipping split was lost: ${line}`);
  });
});

t('E2E: a healthy bed produces NOTHING — no line, no stray output, exit 0', () => {
  withFixture(3, 3, TASK_OK, (fx, tf) => {
    assert.strictEqual(runHook(fx, tf).trim(), '');
  });
});

t('E2E: an unregistered task is reported even when the dreams are fresh', () => {
  withFixture(3, 3, 'MISSING', (fx, tf) => {
    const line = JSON.parse(runHook(fx, tf)).hookSpecificOutput.additionalContext;
    assert.ok(/no "Consonance Dream Cycle" task is registered/.test(line), line);
  });
});

t('E2E: the cooldown holds across processes — the second turn is silent', () => {
  withFixture(13 * 24, 13 * 24, TASK_FAILING, (fx, tf) => {
    assert.ok(runHook(fx, tf).trim().length > 0, 'first run must speak');
    assert.strictEqual(runHook(fx, tf).trim(), '', 'a stuck task must not stamp every turn');
  });
});

t('E2E: outside a Consonance instance the hook says nothing at all', () => {
  withFixture(13 * 24, 13 * 24, TASK_FAILING, (fx, tf) => {
    assert.strictEqual(runHook(fx, tf, os.tmpdir()).trim(), '');
  });
});

t('E2E: malformed stdin makes it fall back and stay quiet rather than crash', () => {
  withFixture(3, 3, TASK_OK, (fx, tf) => {
    const out = execFileSync(process.execPath, [HOOK], {
      input: '{not json at all',
      encoding: 'utf8',
      env: { ...process.env, CONSONANCE_DATA: fx.data, CONSONANCE_INSTANCES: fx.instances, CONSONANCE_DREAM_TASK_FIXTURE: tf },
    });
    assert.strictEqual(out.trim(), '');
  });
});

// ── report ──────────────────────────────────────────────────────────────────
console.log(`\ndream-watch: ${pass} passed, ${fails.length} failed`);
if (fails.length) {
  for (const f of fails) console.log('  FAIL  ' + f);
  process.exit(1);
}
