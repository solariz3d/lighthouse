'use strict';

// live-host.test.js — the bars for the cross-machine one-live-host decision. L049, pane E.
//
// Run: node consonance/tools/live-host.test.js
//
// THE MODULE IS WIRED TO NOTHING AND THIS FILE TOUCHES NOTHING. No fs, no git, no network, no
// `Date.now()`, and above all no `C:\Consonance\data` — the machine-bound class
// (`loop/machine_bound_class_2026-08-25.md`) was born from a test that read the real board and so
// gave a different verdict on the desktop. Every input here is a literal.
//
// WHAT THAT COSTS, stated up front rather than discovered later: none of this has met a real
// `live_host.json`, a real `git push` of a lock ref, or a real clock. The decision is proven; the
// plumbing that will feed it is not, and the Rust that calls it does not exist yet.

const assert = require('node:assert');
const test = require('node:test');
const H = require('./live-host.js');

const SELF = 'install-8f3a-this-laptop';
const OTHER = 'install-11c2-the-desktop';

const P = H.policy({ publishMs: 1000 });          // staleAfterMs = 1000*3 + 1000 = 4000
const T0 = Date.parse('2026-09-09T06:00:00.000Z');

/** A LIVE claim held by `who`, beat `beat`, whose own timestamp is `atIso`. */
function liveClaim({ who = OTHER, label = 'THE-DESKTOP', beat = 812, seq = 7, atIso = '2026-09-09T05:59:50.000Z' } = {}) {
  return {
    schema: 'live_host/1',
    state: 'LIVE',
    holder: { install_id: who, host_label: label, pid: 4242 },
    lease_seq: seq,
    heartbeat: { token: `${seq}:${beat}`, beat, writer_started: '2026-09-09T05:00:00.000Z', at: atIso },
    hosts: [],
    forced: [],
  };
}

function closedClaim({ who = OTHER, clean = true } = {}) {
  return {
    schema: 'live_host/1',
    state: 'CLOSED',
    holder: { install_id: who, host_label: 'THE-DESKTOP', pid: 4242 },
    lease_seq: 7,
    heartbeat: { token: '7:812', beat: 812, writer_started: '2026-09-09T05:00:00.000Z', at: '2026-09-09T05:59:50.000Z' },
    closed: { at: '2026-09-09T05:59:51.000Z', clean, beat: 812 },
    hosts: [],
    forced: [],
  };
}

const base = (over = {}) => ({
  selfId: SELF, claim: null, syncVerified: true, lease: 'UNAVAILABLE',
  observation: null, nowLocalMs: T0, policy: P, ...over,
});

/* ============================================================ RED FIRST 1 — the clock does not vote

   The packet's whole hazard: a stale heartbeat and a live foreign host look identical to a naive
   reader. A reader that settles it with `now - heartbeat.at` is reading the OTHER machine's clock,
   and clock skew between two hosts is unbounded in both directions.

   So the bar is an invariance: hold the local observation fixed, move the foreign timestamp
   anywhere at all — an hour stale, ten minutes into this machine's future — and the verdict must
   not move. If the wall clock has any vote, one of these flips. */

test('RED FIRST: the foreign timestamp cannot change the verdict — the clock does not vote', () => {
  const cases = [
    ['ten minutes stale', '2026-09-09T05:50:00.000Z'],
    ['one second old', '2026-09-09T05:59:59.000Z'],
    ['an hour stale', '2026-09-09T05:00:00.000Z'],
    ['ten minutes in THIS machine\'s future', '2026-09-09T06:10:00.000Z'],
    ['a year ahead', '2027-09-09T06:00:00.000Z'],
    ['unparseable', 'sometime tuesday'],
    ['absent', undefined],
  ];

  // Same local observation throughout: seen once, 5s ago on OUR clock, token unchanged. That is
  // past staleAfterMs (4000), so the answer is ASK_FOREIGN_STALE and must stay there.
  const obs = { token: '7:812', firstSeenLocalMs: T0 - 5000 };
  for (const [name, atIso] of cases) {
    const c = liveClaim({ atIso });
    if (atIso === undefined) delete c.heartbeat.at;
    const d = H.decide(base({ claim: c, observation: obs }));
    assert.strictEqual(d.verdict, H.VERDICTS.ASK_FOREIGN_STALE,
      `the foreign timestamp (${name}) moved the verdict — the wall clock is voting`);
  }

  // And the mirror: same timestamps, but the token ADVANCED under our own eyes. Live, always.
  for (const [name, atIso] of cases) {
    const c = liveClaim({ beat: 900, atIso });
    if (atIso === undefined) delete c.heartbeat.at;
    const d = H.decide(base({ claim: c, observation: { token: '7:812', firstSeenLocalMs: T0 - 5000 } }));
    assert.strictEqual(d.verdict, H.VERDICTS.REFUSE_FOREIGN_LIVE,
      `an advancing heartbeat was not read as live when its timestamp said ${name}`);
  }
});

test('a foreign heartbeat in this machine\'s future is NAMED as skew, not silently resolved', () => {
  const d = H.decide(base({
    claim: liveClaim({ atIso: '2026-09-09T06:10:00.000Z' }),
    observation: { token: '7:812', firstSeenLocalMs: T0 - 5000 },
  }));
  assert.match(d.named.clockSkew, /clocks disagree/);
  assert.strictEqual(d.named.wallClockAdvisoryOnly, true);
  assert.ok(d.named.wallClockAgeMs < 0, 'a negative age is the measurement of skew and is reported');
});

test('when the two readings disagree, the disagreement is reported and the observed one is used', () => {
  // Foreign timestamp says 10s old (fresh, under the 4000ms threshold); our own eyes say the token
  // has not moved for 5s. The verdict follows our eyes, and says so.
  const d = H.decide(base({
    claim: liveClaim({ atIso: '2026-09-09T05:59:59.500Z' }),
    observation: { token: '7:812', firstSeenLocalMs: T0 - 5000 },
  }));
  assert.strictEqual(d.verdict, H.VERDICTS.ASK_FOREIGN_STALE);
  assert.match(d.named.readingsDisagree, /observed reading is the one used/);
});

/* ========================================== RED FIRST 2 — a never-started heartbeat is not "stale"

   Done-vs-never-started, on a new surface. Four situations produce "no heartbeat here" and they
   call for four different actions. The dangerous conflation is that three of them read as MAXIMUM
   staleness, and maximum staleness reads as SAFE TO TAKE OVER. */

test('RED FIRST: the four absences are four answers, and none of them is silence', () => {
  const A = H.ABSENCE;

  // 1. no file, sync verified complete — nothing has ever claimed this house
  assert.strictEqual(H.absenceClass(null, true), A.NEVER_INSTALLED);
  // 2. no file, sync NOT known to have finished — the dangerous one
  assert.strictEqual(H.absenceClass(null, false), A.SYNC_UNVERIFIED);
  assert.strictEqual(H.absenceClass(null, null), A.SYNC_UNVERIFIED,
    'UNKNOWN sync must not be read as a verified one — that is the absence that lets a live host in');
  // 3. file exists, writer started, no beat ever written — a broken writer
  const neverWrote = liveClaim();
  delete neverWrote.heartbeat.token; delete neverWrote.heartbeat.beat;
  assert.strictEqual(H.absenceClass(neverWrote, true), A.WRITER_NEVER_WROTE);
  // 4. a beat exists — the only one that means what a naive reader assumes
  assert.strictEqual(H.absenceClass(liveClaim(), true), A.STOPPED);
});

test('a writer that started and never wrote is NOT reported as maximally stale', () => {
  const c = liveClaim({ atIso: '2020-01-01T00:00:00.000Z' });  // ancient, if anyone were reading it
  delete c.heartbeat.token; delete c.heartbeat.beat;
  const d = H.decide(base({ claim: c, observation: null }));
  assert.strictEqual(d.verdict, H.VERDICTS.ASK_INDETERMINATE);
  assert.strictEqual(d.named.liveness, H.LIVENESS.NEVER_STARTED);
  assert.notStrictEqual(d.verdict, H.VERDICTS.PROCEED,
    'a broken writer must never be read as an idle machine');
  assert.match(d.reason, /broken writer, not an idle machine/);
});

test('an absent file with an unverified sync is ASKED, never assumed empty', () => {
  const verified = H.decide(base({ claim: null, syncVerified: true }));
  assert.strictEqual(verified.verdict, H.VERDICTS.PROCEED);

  for (const s of [false, null, undefined]) {
    const d = H.decide(base({ claim: null, syncVerified: s }));
    assert.strictEqual(d.verdict, H.VERDICTS.ASK_INDETERMINATE,
      `syncVerified=${String(s)} was treated as a completed sync`);
    assert.match(d.reason, /absent claim and an unarrived claim look identical/);
  }
});

/* ================================================================== THE FAILURE DIRECTION, pinned

   It fails toward letting the keeper in: never silently, never without a record, but in. */

test('NO verdict this module can return is a lockout', () => {
  for (const v of Object.values(H.VERDICTS)) {
    assert.notStrictEqual(H.OVERRIDE_COST[v], undefined, `${v} has no override cost declared`);
    assert.notStrictEqual(H.OVERRIDE_COST[v], 'never', `${v} is a lockout — the ruling forbids one`);
  }
});

test('every reachable decision is overridable, and the cost scales with the evidence', () => {
  const seen = new Map();
  const inputs = [
    base({ lease: null }),
    base({ lease: { holder: SELF } }),
    base({ claim: liveClaim(), observation: { token: '7:812', firstSeenLocalMs: T0 - 9000 } }),
    base({ claim: liveClaim({ beat: 900 }), observation: { token: '7:812', firstSeenLocalMs: T0 - 9000 } }),
    base({ claim: 'CORRUPT' }),
    base({ claim: null, syncVerified: false }),
    base({ claim: closedClaim() }),
    base({ claim: liveClaim({ who: SELF }) }),
  ];
  for (const i of inputs) {
    const d = H.decide(i);
    assert.strictEqual(d.overridable, true, `${d.verdict} is not overridable`);
    seen.set(d.verdict, d.overrideCost);
  }
  assert.strictEqual(seen.size, 5, `all five verdicts must be reachable; reached ${[...seen.keys()]}`);
  assert.strictEqual(seen.get(H.VERDICTS.REFUSE_FOREIGN_LIVE), 'type-the-other-host',
    'the strongest evidence against must cost the most to step over');
  assert.strictEqual(seen.get(H.VERDICTS.ASK_FOREIGN_STALE), 'confirm');
  assert.strictEqual(seen.get(H.VERDICTS.PROCEED), 'none');
});

test('a refusal always NAMES the other host — an unexplained refusal is a lockout with manners', () => {
  const d = H.decide(base({
    claim: liveClaim({ beat: 900 }),
    observation: { token: '7:812', firstSeenLocalMs: T0 - 1000 },
  }));
  assert.strictEqual(d.verdict, H.VERDICTS.REFUSE_FOREIGN_LIVE);
  assert.match(d.reason, /THE-DESKTOP/);
  assert.strictEqual(d.named.holder, 'THE-DESKTOP');
});

/* ============================================== ENFORCED — the flag that keeps the falsifier honest

   Only the remote lease enforces anything. Everything else is evidence, and says so, so that a
   double-live found later can be traced to a launch that recorded `enforced: false`. */

test('enforced is TRUE only when the remote lease decided', () => {
  assert.strictEqual(H.decide(base({ lease: null })).enforced, true);
  assert.strictEqual(H.decide(base({ lease: { holder: SELF } })).enforced, true);

  for (const i of [
    base({ claim: closedClaim() }),
    base({ claim: null, syncVerified: true }),
    base({ claim: liveClaim({ who: SELF }) }),
    base({ claim: liveClaim(), observation: { token: '7:812', firstSeenLocalMs: T0 - 9000 } }),
    base({ claim: 'CORRUPT' }),
    base({ lease: { holder: OTHER }, claim: liveClaim() }),
  ]) {
    assert.strictEqual(H.decide(i).enforced, false,
      'a verdict the lease did not make must never claim to be enforced');
  }
});

test('offline, a CLOSED file still PROCEEDS but carries what it cannot know', () => {
  const off = H.decide(base({ claim: closedClaim(), lease: 'UNAVAILABLE' }));
  assert.strictEqual(off.verdict, H.VERDICTS.PROCEED);
  assert.strictEqual(off.enforced, false);
  assert.match(off.named.caveat, /only as current as the last publish/,
    'a CLOSED record read offline is a claim about the past and must say so');
});

/* THE BUG THIS MODULE SHIPPED ON ITS FIRST PASS, kept as a test rather than as a memory.
   A foreign lease standing over a file that says CLOSED returned PROCEED, because the file was
   read before the lease's ownership was settled. That is the exact double-live the lap exists to
   prevent: the other host took the lease and its close simply never published. */
test('a foreign lease OUTRANKS a CLOSED file — the close never published', () => {
  const d = H.decide(base({ lease: { holder: OTHER }, claim: closedClaim() }));
  assert.notStrictEqual(d.verdict, H.VERDICTS.PROCEED,
    'the synced file said CLOSED while the remote lease was held by another host, and this proceeded');
  assert.match(d.named.leaseFileDisagree, /close\s+never published/);
});

/* ================================================================ ONE SAMPLE IS NOT AN OBSERVATION */

test('a single sighting cannot tell live from stale, and does not pretend to', () => {
  const d = H.decide(base({ claim: liveClaim(), observation: null }));
  assert.strictEqual(d.named.liveness, H.LIVENESS.UNOBSERVED);
  assert.strictEqual(d.verdict, H.VERDICTS.ASK_INDETERMINATE);
  assert.match(d.reason, /One sample cannot tell live from stale/);
  assert.match(d.reason, /4000ms/, 'the price of a clock-free answer must be quoted to the human');
});

test('the observed reading crosses at exactly staleAfterMs, and not before', () => {
  const t = (dt) => H.decide(base({
    claim: liveClaim(), observation: { token: '7:812', firstSeenLocalMs: T0 - dt },
  })).verdict;
  assert.strictEqual(t(3999), H.VERDICTS.ASK_INDETERMINATE, 'one ms short of the threshold is not stale');
  assert.strictEqual(t(4000), H.VERDICTS.ASK_FOREIGN_STALE, 'the boundary is inclusive');
  assert.strictEqual(t(4001), H.VERDICTS.ASK_FOREIGN_STALE);
});

test('our OWN clock jumping backwards does not manufacture an observation', () => {
  // A resync or a resume-from-suspend can move the local clock. The interval is then unmeasurable,
  // and an unmeasurable interval is UNOBSERVED, never a negative duration read as "not yet stale"
  // and never an absolute value read as "very stale".
  const l = H.liveness(liveClaim(), { token: '7:812', firstSeenLocalMs: T0 + 60_000 }, T0, P);
  assert.strictEqual(l.state, H.LIVENESS.UNOBSERVED);
  assert.strictEqual(l.observedForMs, null);
});

/* ================================================================================ SELF vs FOREIGN */

test('whose() has three answers and never folds UNKNOWN into either', () => {
  assert.strictEqual(H.whose(liveClaim({ who: SELF }), SELF), 'SELF');
  assert.strictEqual(H.whose(liveClaim({ who: OTHER }), SELF), 'FOREIGN');
  for (const bad of [{}, { holder: {} }, { holder: { install_id: '' } }, { holder: { install_id: '   ' } }, null]) {
    assert.strictEqual(H.whose(bad, SELF), 'UNKNOWN');
  }
  assert.strictEqual(H.whose(liveClaim({ who: OTHER }), ''), 'UNKNOWN',
    'a host with no identity of its own cannot call anything foreign');
});

test('an unidentified claim is ASKED, not reclaimed', () => {
  const c = liveClaim(); delete c.holder.install_id;
  const d = H.decide(base({ claim: c }));
  assert.strictEqual(d.verdict, H.VERDICTS.ASK_INDETERMINATE);
  assert.match(d.reason, /cannot tell its own leftover/);
});

test('our own standing LIVE record is reclaimed, because the local mutex already excludes a twin', () => {
  const d = H.decide(base({ claim: liveClaim({ who: SELF, label: 'THIS-LAPTOP' }) }));
  assert.strictEqual(d.verdict, H.VERDICTS.PROCEED_RECLAIM);
});

/* THE SILENT FAILURE WORTH MORE THAN THE REST OF THIS FILE. If the install-id file travels, both
   machines share one identity, and the guard returns PROCEED_RECLAIM at exactly the moment it
   should refuse — quietly, with no error anywhere. */
test('a shared install id turns every refusal into a reclaim — which is why the hazard is asserted', () => {
  const shared = 'install-SHARED-because-it-travelled';
  const d = H.decide(base({ selfId: shared, claim: liveClaim({ who: shared }) }));
  assert.strictEqual(d.verdict, H.VERDICTS.PROCEED_RECLAIM,
    'this is the failure, demonstrated: a genuinely foreign live host read as our own leftover');

  assert.match(H.identityHazard('C:\\Consonance\\data\\install_id.json', 'C:\\Consonance\\data'),
    /both machines would share an identity/);
  assert.match(H.identityHazard('C:/Consonance/DATA/sub/install_id.json', 'c:\\consonance\\data\\'),
    /share an identity/, 'the check must survive separator and case differences on Windows');
  assert.strictEqual(H.identityHazard('C:\\Users\\x\\.consonance\\install_id.json', 'C:\\Consonance\\data'), null);
  assert.match(H.identityHazard('', 'C:\\Consonance\\data'), /identity cannot be established/);
  assert.strictEqual(H.identityHazard('C:\\Consonance\\database\\id.json', 'C:\\Consonance\\data'), null,
    'a sibling directory whose name merely starts with the root is not inside it');
});

/* ============================================================================ THE NUMBER, DERIVED */

test('staleAfterMs is a derivation from the transport, not a constant', () => {
  assert.strictEqual(H.staleAfterMs(120_000), 480_000, '3 misses + one margin period, at the placeholder');
  assert.strictEqual(H.staleAfterMs(1000, 3, 1000), 4000);
  assert.strictEqual(H.staleAfterMs(1000, 1, 0), 1000);
  assert.strictEqual(H.MISSES_TOLERATED, 3);
  // If the transport gets faster, the threshold follows it, rather than a stale literal surviving.
  assert.strictEqual(H.policy({ publishMs: 10_000 }).staleAfterMs, 40_000);
});

test('the derivation refuses nonsense rather than returning NaN', () => {
  for (const bad of [0, -1, NaN, Infinity, null, undefined, '120000']) {
    assert.throws(() => H.staleAfterMs(bad), /publishMs/, `publishMs=${String(bad)} was accepted`);
  }
  assert.throws(() => H.staleAfterMs(1000, 0), /missesTolerated/);
  assert.throws(() => H.staleAfterMs(1000, 2.5), /missesTolerated/);
  assert.throws(() => H.staleAfterMs(1000, 3, -1), /marginMs/);
});

test('the publish period declares itself UNMEASURED until somebody times it', () => {
  assert.strictEqual(H.policy().publishMsMeasured, false,
    'a number nobody has timed must say so in its own output, not in a comment');
  assert.strictEqual(H.policy().publishMs, H.DEFAULT_PUBLISH_MS);
  assert.strictEqual(H.policy({ publishMs: 3000, publishMsMeasured: true }).publishMsMeasured, true);
});

/* ==================================================================== THE RECORD AN OVERRIDE LEAVES */

test('a forced record carries who, when, and what it stepped over — or it is not a record', () => {
  const decision = H.decide(base({
    claim: liveClaim({ beat: 900 }),
    observation: { token: '7:812', firstSeenLocalMs: T0 - 1000 },
  }));
  const r = H.forcedRecord({ byInstallId: SELF, byLabel: 'THIS-LAPTOP', atIso: '2026-09-09T06:00:01Z', decision });
  assert.strictEqual(r.by.install_id, SELF);
  assert.strictEqual(r.stepped_over.verdict, H.VERDICTS.REFUSE_FOREIGN_LIVE);
  assert.strictEqual(r.stepped_over.enforced, false);
  assert.strictEqual(r.stepped_over.named.holder, 'THE-DESKTOP',
    'the record must name the host that was stepped over, or F2 is uncheckable');

  assert.throws(() => H.forcedRecord({ atIso: 'x', decision }), /no author/);
  assert.throws(() => H.forcedRecord({ byInstallId: SELF, decision }), /no time/);
  assert.throws(() => H.forcedRecord({ byInstallId: SELF, atIso: 'x' }), /the decision it stepped over/);
});

/* ========================================================================= STRUCTURAL / TOTALITY */

test('every decision is a declared verdict with a non-empty reason and a frozen result', () => {
  const inputs = [
    base({ lease: null }), base({ lease: { holder: SELF } }), base({ lease: { holder: OTHER } }),
    base({ claim: 'CORRUPT' }), base({ claim: null, syncVerified: false }), base({ claim: closedClaim() }),
    base({ claim: closedClaim({ clean: false }) }), base({ claim: liveClaim({ who: SELF }) }),
    base({ claim: liveClaim() }),
    base({ claim: liveClaim(), observation: { token: '7:812', firstSeenLocalMs: T0 - 9000 } }),
    base({ claim: liveClaim({ beat: 900 }), observation: { token: '7:812', firstSeenLocalMs: T0 - 1 } }),
    base({}),
  ];
  const declared = new Set(Object.values(H.VERDICTS));
  for (const i of inputs) {
    const d = H.decide(i);
    assert.ok(declared.has(d.verdict), `undeclared verdict ${d.verdict}`);
    assert.ok(typeof d.reason === 'string' && d.reason.length > 20, `thin reason for ${d.verdict}`);
    assert.ok(Object.isFrozen(d) && Object.isFrozen(d.named), 'a decision a caller can edit is not a record');
  }
});

test('the default policy is used when none is passed, and 8 minutes is what it means', () => {
  const d = H.decide({ selfId: SELF, claim: liveClaim(), syncVerified: true, lease: 'UNAVAILABLE',
    observation: null, nowLocalMs: T0 });
  assert.match(d.reason, /480000ms/, 'the default threshold must be the derived 8 minutes');
});
