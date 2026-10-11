// digest-repair.test.js - D292 part 1 (the keeper chose repair: "2, 14kb is nothing lol"): the dated session digests count the LOCAL day, say what they count, and
// a day nothing ended on (or ended early) is completed at the next wake. The measurement behind it: exo_memory/handback/p-digestwriter-E_2026-10-11.md.
//
// Nothing here touches the real ~/.claude/shell: every hook runs with CONSONANCE_SHELL_DIR at a temp folder, a pinned TZ (America/Regina, UTC-6 all year, the
// keeper's) and a fixed clock (the preload session-start-light.test.js uses), so a row means the same thing on any machine and any day.
//
// Run: node --test dev/shell/hooks/digest-repair.test.js   (the js-suite finds it by name)
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const SRC = __dirname;
const scratch = require('../../../consonance/tools/scratch.js');
const roots = [];
// the in-process rows require session-end.js, which reads its pulse folder from CONSONANCE_SHELL_DIR at load: a temp one, never the real ~/.claude/shell
const PROC_SHELL = scratch.mkdtemp('digest-repair-proc-'); roots.push(PROC_SHELL); process.env.CONSONANCE_SHELL_DIR = PROC_SHELL;
test.after(() => { for (const r of roots) try { fs.rmSync(r, { recursive: true, force: true }); } catch (_) { /* temp */ } });

// timestamps in the shape hooks/stop.js really writes (toISOString: milliseconds, then Z); without the milliseconds a time reads "03:00:00Z UTC" and a row that
// looks for "03:00:00 UTC" can never fail
const stop = (iso, session, cwd = 'C:\\work\\a') => JSON.stringify({ type: 'session_stop', timestamp: new Date(iso).toISOString(), cwd, transcript_path: `C:\\t\\${session}.jsonl`, session_id: session });
/** A temp shell with both hooks, its lib, an event log and (optionally) digests; `clock` is the fixed now (ISO). */
function shell({ rows = [], digests = {}, clock }) {
  const root = scratch.mkdtemp('digest-repair-'); roots.push(root);
  const sh = path.join(root, 'shell'), home = path.join(root, 'home');
  fs.mkdirSync(path.join(sh, 'hooks'), { recursive: true }); fs.mkdirSync(path.join(sh, 'lib'), { recursive: true }); fs.mkdirSync(path.join(sh, 'digests'), { recursive: true }); fs.mkdirSync(home, { recursive: true });
  for (const f of ['session-end.js', 'session-start.js']) fs.copyFileSync(path.join(SRC, f), path.join(sh, 'hooks', f));
  for (const f of ['ambient.js', 'fresh-guard.js']) fs.copyFileSync(path.join(SRC, '..', 'lib', f), path.join(sh, 'lib', f));   // dev/shell/lib, as session-start-light.test.js
  fs.writeFileSync(path.join(sh, 'event_log.jsonl'), rows.join('\n') + (rows.length ? '\n' : ''));
  for (const [day, { text, mtime }] of Object.entries(digests)) { const f = path.join(sh, 'digests', day + '.md'); fs.writeFileSync(f, text); if (mtime) fs.utimesSync(f, new Date(mtime), new Date(mtime)); }
  fs.writeFileSync(path.join(home, '.consonance.json'), JSON.stringify({ ambient_lat: '12.3456', ambient_lon: '-65.4321', ambient_tz: 'America/Regina' }));
  const F = Date.parse(clock);
  fs.writeFileSync(path.join(root, 'clock.js'), `const R = Date, F = ${F}; class FD extends R { constructor(...a) { if (a.length) super(...a); else super(F); } static now() { return F; } } global.Date = FD;\n`);
  return { root, sh, home };
}
function run(s, hook, payload) {
  const r = spawnSync(process.execPath, ['-r', path.join(s.root, 'clock.js'), path.join(s.sh, 'hooks', hook)], {
    input: JSON.stringify(payload), encoding: 'utf8', timeout: 30000, cwd: s.root,
    env: { PATH: process.env.PATH, SystemRoot: process.env.SystemRoot, USERPROFILE: s.home, HOME: s.home, CONSONANCE_SHELL_DIR: s.sh, TZ: 'America/Regina' },
  });
  assert.equal(r.status, 0, `${hook} exit ${r.status}: ${r.stderr}`);
  return r.stdout;
}
const end = (s) => run(s, 'session-end.js', { hook_event_name: 'SessionEnd', session_id: 'x', cwd: 'C:\\Consonance\\instances\\x' });
const start = (s, cwd = 'C:\\Consonance\\instances\\librarian') => run(s, 'session-start.js', { hook_event_name: 'SessionStart', source: 'startup', session_id: 'now', cwd });
const digest = (s, day) => { const f = path.join(s.sh, 'digests', day + '.md'); return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null; };

test('D292 late evening: an end at 22:24 local counts that local evening (the next UTC date) and never the evening before it', () => {
  // the 10-10 end of the measurement: 22:24 local = 04:24Z on 10-11. Local 10-10 holds 07:00Z (01:00 local) and 02:00Z on 10-11 (20:00 local);
  // 05:00Z on 10-10 is 23:00 on local 10-09, and 06:30Z on 10-11 is after the end
  const s = shell({ clock: '2026-10-11T04:24:52Z', rows: [stop('2026-10-10T05:00:00Z', 'prev'), stop('2026-10-10T07:00:00Z', 's1'), stop('2026-10-11T02:00:00Z', 's2')] });
  end(s);
  const d = digest(s, '2026-10-10');
  assert.match(d, /^## 2 turn ends from 2 sessions$/m, d);
  assert.match(d, /^- 07:00:00 UTC$/m, 'control: a counted time is listed in this form, so the next line can fail');
  assert.doesNotMatch(d, /05:00:00 UTC/, 'the evening before (local 10-09) was counted');
});

test('D292 early morning (the 10-02 case): the part-day an early end writes is completed at the next day\'s first wake, and only that day is rewritten', () => {
  // the end at 04:57 local on 10-02 (10:57Z): local 10-02 has nothing yet; 03:00Z on 10-02 is 21:00 on local 10-01, which is NOT 10-02
  const s = shell({ clock: '2026-10-02T10:57:04Z', rows: [stop('2026-10-02T03:00:00Z', 'eve')] });   // at the end, the log holds only what has happened
  end(s);
  fs.appendFileSync(path.join(s.sh, 'event_log.jsonl'), [stop('2026-10-02T15:00:00Z', 'day1'), stop('2026-10-02T20:00:00Z', 'day2'), stop('2026-10-03T01:00:00Z', 'day2')].join('\n') + '\n');   // the rest of local 10-02
  assert.equal(digest(s, '2026-10-02'), '# 2026-10-02 Digest\n\nNo session activity recorded.', 'at 04:57 local nothing of 10-02 has happened: the part-day is honest');
  fs.utimesSync(path.join(s.sh, 'digests', '2026-10-02.md'), new Date('2026-10-02T10:57:04Z'), new Date('2026-10-02T10:57:04Z'));   // written before the day ended
  fs.writeFileSync(path.join(s.root, 'clock.js'), fs.readFileSync(path.join(s.root, 'clock.js'), 'utf8').replace(/F = \d+/, `F = ${Date.parse('2026-10-03T14:00:00Z')}`));
  start(s);
  assert.match(digest(s, '2026-10-02'), /^## 3 turn ends from 2 sessions$/m, 'the whole local day (15:00Z, 20:00Z and 01:00Z on 10-03), the evening before left out');
  assert.equal(digest(s, '2026-10-01'), [
    '# 2026-10-01 Digest', '', '## 1 turn end from 1 session', '', '### C:\\work\\a', '- 03:00:00 UTC', '',
  ].join('\n'), 'the missing evening before is caught up too, as its own local day');
});

test('D292 catch-up: a missing past day is written at the next wake; a complete day and today are left as they are', () => {
  const rows = [stop('2026-10-08T15:00:00Z', 'a'), stop('2026-10-08T16:00:00Z', 'b'), stop('2026-10-07T15:00:00Z', 'c'), stop('2026-10-11T15:00:00Z', 'd')];
  const seven = '# 2026-10-07 Digest\n\nwritten after the day ended: left alone\n';
  const s = shell({ clock: '2026-10-11T16:00:00Z', rows, digests: { '2026-10-07': { text: seven, mtime: '2026-10-08T07:00:00Z' } } });
  start(s);
  assert.match(digest(s, '2026-10-08'), /^## 2 turn ends from 2 sessions$/m, 'the missing day');
  assert.equal(digest(s, '2026-10-07'), seven, 'a digest written after its day ended is not rewritten');
  assert.equal(digest(s, '2026-10-11'), null, 'today is the SessionEnd write\'s, never the catch-up\'s');
  assert.equal(digest(s, '2026-10-09'), null, 'a day with no turn ends gets no file');
});

test('D292 label: the headline says what it counts, N turn ends from M distinct sessions, singular when one', () => {
  const E = require('./session-end.js');
  const rows = ['a', 'a', 'b'].map((sid, i) => ({ type: 'session_stop', timestamp: `2026-10-10T1${i}:00:00Z`, cwd: 'C:\\w', session_id: sid }));
  assert.match(E.buildDigest('2026-10-10', rows), /^## 3 turn ends from 2 sessions$/m);
  assert.match(E.buildDigest('2026-10-10', rows.slice(0, 1)), /^## 1 turn end from 1 session$/m);
  assert.doesNotMatch(E.buildDigest('2026-10-10', rows), /^## \d+ sessions?$/m, 'the old headline, which counted turn ends as sessions');
});

test('D292 light mode reads the new headline and says it back; the old headline is still read', () => {
  const s = shell({ clock: '2026-10-11T16:00:00Z', rows: [stop('2026-10-10T15:00:00Z', 'a'), stop('2026-10-10T16:00:00Z', 'b'), stop('2026-10-10T17:00:00Z', 'b')],
    digests: { '2026-10-09': { text: '# 2026-10-09 Digest\n\n## 5 sessions\n\n### C:\\w\n- 01:00:00 UTC\n', mtime: '2026-10-10T07:00:00Z' } } });
  fs.writeFileSync(path.join(s.home, '.consonance.json'), JSON.stringify({ ambient_lat: '12.3456', ambient_lon: '-65.4321', ambient_tz: 'America/Regina', gates_mode: 'light' }));
  const ctx = JSON.parse(start(s)).hookSpecificOutput.additionalContext;
  assert.match(ctx, /### 2026-10-10\n3 turn ends from 2 sessions\n/, 'the caught-up day, in light, with its honest count');
  assert.match(ctx, /### 2026-10-09\n5 sessions\n/, 'an old-format day is still read (said back as it was written)');
});

test('D292 cost: a wake with every day in place reads no event log; the catch-up never throws', () => {
  const E = require('./session-end.js'), dir = scratch.mkdtemp('digest-repair-dir-'); roots.push(dir);
  const now = new Date(2026, 9, 11, 10);
  for (let k = 1; k <= 14; k++) { const d = new Date(2026, 9, 11 - k), f = path.join(dir, `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}.md`); fs.writeFileSync(f, 'x'); }
  assert.deepEqual(E.catchUp({ dir, log: path.join(dir, 'no-such-log.jsonl'), now }), { written: [], read: false });
  assert.deepEqual(E.catchUp({ dir: path.join(dir, 'missing', 'dir'), log: path.join(dir, 'no-such-log.jsonl'), now }), { written: [], read: true }, 'no digests folder and no log: nothing written, no throw');
});
