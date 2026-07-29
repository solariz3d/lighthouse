// Both directions of the staleness rule, plus the two live/stale pairs it exists to answer.
//
// The RED path is the one that matters and the one nobody tests, because on a healthy machine
// it never fires — an untested red path is an alarm stuck OFF, which is the same failure as an
// alarm stuck on and much harder to notice. So the rule is pure and both branches are pinned
// here rather than waiting for a stale binary to happen.
//
//   node consonance/tools/whats-live.test.js
'use strict';

const assert = require('assert');
const test = require('node:test');
const { staleness, check, dreams } = require('./whats-live.js');

const MIN = 60_000;
const base = { hash: 'abc1234 some commit', profile: 'release' };

test('RED: source committed after the running binary was built', () => {
  // Finding 4, made unaskable: the claim "this fix is live" is a claim about the binary the
  // PROCESS holds, never about whichever profile happens to be newest on disk.
  const r = staleness({ ...base, srcTs: 2 * MIN, built: 1 * MIN, started: 1 * MIN });
  assert.strictEqual(r.length, 1);
  assert.match(r[0], /predates abc1234/);
  assert.match(r[0], /NOT live/);
});

test('RED: rebuilt but not restarted', () => {
  const r = staleness({ ...base, srcTs: 1 * MIN, built: 3 * MIN, started: 2 * MIN });
  assert.strictEqual(r.length, 1);
  assert.match(r[0], /rebuilt but not restarted/);
});

test('RED twice: both conditions at once are both reported', () => {
  // Not collapsed into one line. Two different repairs — one needs a build, one needs a
  // restart — and a single message would send you to do only half of it.
  const r = staleness({ ...base, srcTs: 5 * MIN, built: 3 * MIN, started: 2 * MIN });
  assert.strictEqual(r.length, 2);
});

test('GREEN: binary built after the newest source commit, and the process started after that', () => {
  const r = staleness({ ...base, srcTs: 1 * MIN, built: 2 * MIN, started: 3 * MIN });
  assert.deepStrictEqual(r, []);
});

test('GREEN: equal timestamps are not stale — a build in the same second is not behind', () => {
  const r = staleness({ ...base, srcTs: 2 * MIN, built: 2 * MIN, started: 2 * MIN });
  assert.deepStrictEqual(r, []);
});

test('missing inputs never manufacture a RED', () => {
  // No process, no build time, no commits: the honest answer is "nothing to compare", not a
  // failure. A checker that fires on absence gets muted for crying wolf.
  assert.deepStrictEqual(staleness({ ...base, srcTs: 0, built: 0, started: 0 }), []);
  assert.deepStrictEqual(staleness({ ...base, srcTs: 9 * MIN, built: 0, started: 0 }), []);
});

test('the live dream set is the per-instance one, never the retired repo pool', () => {
  // Finding 2 in assertion form. The pool was retired 2026-07-15; reading its age and calling
  // the system "two weeks dark" was wrong by a whole artifact.
  const d = dreams();
  if (d.live === 0 && d.poolCount === 0) return;          // other machine
  assert.ok(d.live >= d.poolCount,
    `live dreams (${d.live}) must not be fewer than the retired pool (${d.poolCount}) — ` +
    'if this trips, the pool is being read as the live set again');
  if (d.live) assert.ok(d.where && d.where.includes('dreams'), 'the live set reports where it lives');
});

test('check() names the profile that is NOT running, so nobody measures it', () => {
  const c = check();
  if (!c.app) return;                                     // app closed: nothing to name
  const notRunning = c.rows.find(r => String(r[2]).includes('NOT RUNNING'));
  if (notRunning) {
    assert.ok(/debug|release/.test(notRunning[0]),
      'the other profile is named explicitly rather than left for someone to infer');
  }
  const profileRow = c.rows.find(r => r[0] === 'app exe');
  assert.ok(profileRow && ['release', 'debug', 'unknown'].includes(profileRow[1]));
});
