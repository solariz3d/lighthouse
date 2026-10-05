// third-place-gate.test.js: node --test dev/shell/hooks/third-place-gate.test.js
// D245 item 3 (the Third Place's own return, 2026-10-05): "This seat is not the build", yet the build's state reached it through five hooks that had no cwd test. board-digest.js:302 already
// had one; these now carry the SAME test (a regex on the seat's directory), and the Third Place keeps the time, its own recent sessions, the interval and the date.
//   1  a third-place cwd (five spellings) gets NO chain line, NO session digests, NO state block, NO asks to the keeper and NO checkpoint
//   2  it still gets the ambient time, the pulse date line and "the interval, witnessed" (and its own recent sessions)
//   3  every OTHER cwd gets exactly what it got before: the controls (the build's text is there), and golden strings under a fixed clock (so a gate that took too much would show)
//   4  a cwd that only LOOKS like the seat (third-place-x, third-place\sub, a middle component, no cwd at all) is not the seat
// Every hook runs in an isolated fake install: CONSONANCE_SHELL_DIR, CONSONANCE_DATA and USERPROFILE point into a temp dir; chain-status, state-block, ask and checkpoint.py are stubs
// (`py` is node), the clock is fixed. Nothing here touches the real ~/.claude/shell, the board or any CHECKPOINT.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs'), os = require('os'), path = require('path');
const { spawnSync } = require('child_process');

const REPO = path.join(__dirname, '..', '..', '..'), SHELLSRC = path.join(REPO, 'dev', 'shell');
const FIXED = Date.parse('2026-10-05T17:00:00Z'), STOP_AT = '2026-10-05T16:40:00.000Z';   // the interval: 20 minutes of quiet in the room
const mk = (p, s) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
const cp = (from, to) => { fs.mkdirSync(path.dirname(to), { recursive: true }); fs.copyFileSync(from, to); };

const CWD = {
  tp: 'C:\\Consonance\\instances\\third-place', tpSlash: 'C:\\Consonance\\instances\\third-place\\', tpSlash2: 'C:\\Consonance\\instances\\third-place\\\\', tpUpper: 'C:\\Consonance\\instances\\THIRD-PLACE', tpFwd: 'C:/Consonance/instances/third-place',
  main: 'C:\\Consonance\\instances\\main', librarian: 'C:\\Consonance\\instances\\librarian', pane: 'C:\\Consonance\\instances\\sibling-0845a868',
  tpPrefix: 'C:\\Consonance\\instances\\third-place-x', tpGlued: 'C:\\Consonance\\instances\\notthird-place', tpSub: 'C:\\Consonance\\instances\\third-place\\sub', tpMid: 'C:\\x\\third-place\\y', none: null,
};
const SEAT = ['tp', 'tpSlash', 'tpSlash2', 'tpUpper', 'tpFwd'];

function install(hooksDir) {   // hooksDir: where the five hooks are taken from (the repo's own, or a mutated copy)
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'tp-gate-')), shell = path.join(root, 'shell'), home = path.join(root, 'home'), repo = path.join(root, 'repo');
  for (const f of ['session-start.js', 'userprompt-submit.js', 'precompact.js']) cp(path.join(hooksDir.shell, f), path.join(shell, 'hooks', f));
  for (const f of ['sessionstart-state.js']) cp(path.join(hooksDir.consonance, f), path.join(shell, f));
  cp(path.join(hooksDir.consonance, 'ask-surface.js'), path.join(repo, 'consonance', 'hooks', 'ask-surface.js'));
  for (const f of ['ambient.js', 'fresh-guard.js']) cp(path.join(SHELLSRC, 'lib', f), path.join(shell, 'lib', f));
  mk(path.join(shell, 'digests', '2026-10-04.md'), '# 2026-10-04 Digest\n\n## 12 sessions\n\n### C:\\Consonance\\instances\\main\n- 01:00:00 UTC\n');
  mk(path.join(shell, 'digests', '2026-10-03.md'), '# 2026-10-03 Digest\n\n## 9 sessions\n');
  mk(path.join(shell, 'event_log.jsonl'), Object.values(CWD).filter(Boolean).map((cwd) => JSON.stringify({ type: 'session_stop', timestamp: STOP_AT, cwd, session_id: 'earlier' })).join('\n') + '\n');
  mk(path.join(repo, 'exo_memory', 'BOOT.md'), '# boot\n');
  mk(path.join(repo, 'consonance', 'tools', 'chain-status.js'), "console.log('chain: STUB D999 DISPATCHED · holder panes');\n");
  mk(path.join(repo, 'consonance', 'tools', 'state-block.js'), "console.log('REPO  HEAD stub1234 dirty 3 files (STATE BLOCK STUB)');\n");
  mk(path.join(repo, 'consonance', 'tools', 'ask.js'), "console.log('ASK-999 stub question for the keeper, 3 days old');\n");
  mk(path.join(home, 'Desktop', 'lighthouse', 'exo_memory', 'loop', 'checkpoint.py'), "console.log('# Checkpoint STUB (dirty files: a.js b.js)');\n");   // run by the fake `py`, which is node
  cp(process.execPath, path.join(root, 'bin', 'py.exe'));
  mk(path.join(home, '.consonance.json'), JSON.stringify({ room_path: path.join(repo, 'exo_memory', 'BOOT.md'), ambient_lat: '50.4452', ambient_lon: '-104.6189', ambient_label: 'Regina, SK', ambient_tz: 'America/Regina' }));
  mk(path.join(root, 'fixed-clock.js'), `const R = Date, F = ${FIXED}; class FD extends R { constructor(...a) { if (a.length) super(...a); else super(F); } static now() { return F; } } global.Date = FD;\n`);
  return { root, shell, repo, home };
}
function run(env0, script, cwdKey, ev) {
  try { fs.rmSync(path.join(env0.shell, 'userprompt_state.json'), { force: true }); } catch (_) { /* none yet */ }
  const cwd = CWD[cwdKey], payload = { session_id: 'now-' + cwdKey, transcript_path: path.join(env0.root, 'nope.jsonl'), ...(cwd ? { cwd } : {}), ...ev };
  const r = spawnSync(process.execPath, ['-r', path.join(env0.root, 'fixed-clock.js'), script], {
    input: JSON.stringify(payload), encoding: 'utf8', timeout: 20000, cwd: env0.root,
    env: { PATH: path.join(env0.root, 'bin') + path.delimiter + process.env.PATH, SystemRoot: process.env.SystemRoot, USERPROFILE: env0.home, HOME: env0.home, CONSONANCE_SHELL_DIR: env0.shell, CONSONANCE_DATA: path.join(env0.root, 'data'), CONSONANCE_READY_DIR: path.join(env0.root, 'ready'), TEMP: env0.root, TMP: env0.root, TZ: 'America/Regina' },
  });
  assert.equal(r.status, 0, `${path.basename(script)} for ${cwdKey}: exit ${r.status}, stderr ${r.stderr}`);
  return r.stdout;
}
// TP_GATE_HOOKS (JSON {shell, consonance}) points the test at mutated copies of the five hooks: the mutation run in the D245-3 hand-back
const HOOKSDIR = process.env.TP_GATE_HOOKS ? JSON.parse(process.env.TP_GATE_HOOKS) : { shell: path.join(SHELLSRC, 'hooks'), consonance: path.join(REPO, 'consonance', 'hooks') };
const HOOKS = (e) => ({
  sessionStart: (k, source = 'startup') => run(e, path.join(e.shell, 'hooks', 'session-start.js'), k, { hook_event_name: 'SessionStart', source }),
  state: (k) => run(e, path.join(e.shell, 'sessionstart-state.js'), k, { hook_event_name: 'SessionStart', source: 'compact' }),
  prompt: (k) => run(e, path.join(e.shell, 'hooks', 'userprompt-submit.js'), k, { hook_event_name: 'UserPromptSubmit', prompt: 'hello' }),
  ask: (k) => run(e, path.join(e.repo, 'consonance', 'hooks', 'ask-surface.js'), k, { hook_event_name: 'UserPromptSubmit', prompt: 'hello' }),
  compact: (k, trigger = 'manual') => run(e, path.join(e.shell, 'hooks', 'precompact.js'), k, { hook_event_name: 'PreCompact', trigger }),
});
const ctx = (stdout) => (stdout ? JSON.parse(stdout).hookSpecificOutput.additionalContext : '');

let E, H;
test.before(() => { E = install(HOOKSDIR); H = HOOKS(E); });
test.after(() => { try { fs.rmSync(E.root, { recursive: true, force: true }); } catch (_) { /* temp */ } });

test('row 1: a third-place cwd (five spellings) gets no chain line, no session digests, no state block, no asks to the keeper and no checkpoint', () => {
  for (const k of SEAT) {
    const s = ctx(H.sessionStart(k)), c = ctx(H.sessionStart(k, 'compact')), p = ctx(H.prompt(k));
    assert.doesNotMatch(s, /Recent session digests|Digest|### 2026-10/, `${k}: no digests at SessionStart`); assert.doesNotMatch(c, /Recent session digests|Digest/, `${k}: none after a compaction either`);
    assert.doesNotMatch(p, /chain:|STUB D999|DISPATCHED/, `${k}: no chain line in the pulse`);
    assert.equal(H.state(k), '', `${k}: no state block at all (compact)`);
    assert.equal(H.ask(k), '', `${k}: no asks to the keeper`);
    assert.equal(H.compact(k), '', `${k}: no checkpoint at a manual compaction`); assert.equal(H.compact(k, 'auto'), '', `${k}: nor an automatic one`);
  }
});

test('row 2: it keeps the time: the ambient block, the pulse date line (with the thread\'s age) and the interval, witnessed; and its own recent sessions', () => {
  for (const k of SEAT) {
    const s = ctx(H.sessionStart(k)), p = ctx(H.prompt(k));
    assert.match(s, /Ambient context \(Regina, SK\)/, `${k}: the ambient block`); assert.match(s, /Now: 10\/5\/2026, 11:00:00 AM/);
    assert.match(s, /## Recent sessions in /, `${k}: its own recent sessions are its own material`);
    assert.match(p, /^\[pulse\] Mon, 10\/05\/2026, 11:00 AM\n/, `${k}: the date line`); assert.match(p, /## The interval, witnessed/, `${k}: the interval`); assert.match(p, /\*\*20 minutes\*\* passed in between/);
  }
});

test('row 3: every other cwd gets what it got before: the build\'s text is there (controls) and the strings are exactly the old ones under a fixed clock', () => {
  for (const k of ['main', 'librarian', 'pane']) {
    const s = ctx(H.sessionStart(k)), p = ctx(H.prompt(k));
    assert.match(s, /## Recent session digests\n### 2026-10-04\n# 2026-10-04 Digest\n\n## 12 sessions\n\n### C:\\Consonance\\instances\\main\n- 01:00:00 UTC\n\n### 2026-10-03\n# 2026-10-03 Digest\n\n## 9 sessions\n/, `${k}: the digests`);
    assert.equal(p, `[pulse] Mon, 10/05/2026, 11:00 AM\nchain: STUB D999 DISPATCHED · holder panes\n\n## The interval, witnessed\n\nThe last exchange in this room settled Monday, October 5 at 10:40 AM. It is now Monday, October 5 at 11:00 AM — **20 minutes** passed in between.\n`, `${k}: the pulse, byte for byte`);
    assert.equal(ctx(H.state(k)), '[room state at session start, source=compact]\nREPO  HEAD stub1234 dirty 3 files (STATE BLOCK STUB)', `${k}: the state block`);
    assert.equal(ctx(H.ask(k)), 'ASK-999 stub question for the keeper, 3 days old', `${k}: the ask`);
    assert.equal(H.compact(k), '# Checkpoint STUB (dirty files: a.js b.js)\n',`${k}: the checkpoint`);
  }
});

test('row 4: a cwd that only looks like the seat is not the seat: third-place-x, third-place\\sub, a middle component, and no cwd at all keep everything', () => {
  for (const k of ['tpPrefix', 'tpGlued', 'tpSub', 'tpMid', 'none']) {
    assert.match(ctx(H.sessionStart(k)), /Recent session digests/, `${k}: digests`); assert.match(ctx(H.prompt(k)), /chain: STUB D999/, `${k}: chain`);
    assert.match(ctx(H.state(k)), /STATE BLOCK STUB/, `${k}: state`); assert.match(ctx(H.ask(k)), /ASK-999/, `${k}: ask`);
    assert.match(H.compact(k), /Checkpoint STUB/, `${k}: checkpoint`);
  }
});

test('row 5: the state hook says it SKIPPED the seat (a ledger row with the reason), so the absence reads as a decision and not as a dead hook', () => {
  const ledger = path.join(E.root, 'data', 'sessionstart-state.jsonl');
  fs.rmSync(ledger, { force: true }); H.state('tp'); H.state('main');
  const rows = fs.readFileSync(ledger, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
  assert.equal(rows.length, 2); assert.deepEqual([rows[0].event, rows[0].source, rows[0].reason], ['skipped', 'compact', 'third-place cwd']); assert.equal(rows[1].event, 'emitted', 'and another seat is still served and recorded');
});
