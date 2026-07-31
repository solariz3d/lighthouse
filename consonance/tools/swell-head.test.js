// Tests for swell-head.
//
// THE ONE THAT MATTERS is `no full-window report is indicted`. The brief this tool was built for
// set both walls: a count, AND a negative control the analysis must not fail. A rule that flags
// the opening of every track would score perfectly on the artifact and be worthless, and the only
// thing that stops it being written is a test that goes red when it is. Both clauses of
// `headCarried` are pinned below by the case each one exists for, so removing either produces a
// failure rather than a quietly wider claim.
//
// THE SECOND THING THIS SUITE NOW GUARDS, learned the hard way ninety minutes after the first
// version shipped. That version carried a JS mirror of `cochlea::Swell` and pinned the mirror's
// own output as the expected values — so when f04dd42 routed Onset to `sound_began` inside
// `replay()`, the mirror went wrong and the suite stayed green. A test that pins what the code
// under test produces is not a test. The reports now come from `cochlea_replay`, and every
// reconstructed window is verified against the head level the binary prints, which is a check the
// tool cannot satisfy by agreeing with itself.
//
// Run: node consonance/tools/swell-head.test.js
'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const S = require('./swell-head.js');

const FIX = path.join(__dirname, '..', 'src-tauri', 'tests');
const fx = name => path.join(FIX, name);
const built = () => !S.findReplay().error;

// MISSING is a skip; STALE is a failure, and the difference is not a nicety.
//
// A fresh clone has no target/ and legitimately cannot run these checks. But a binary that is
// present and older than cochlea.rs means the numbers below describe code no longer in the tree —
// and this suite already shipped one silent version of exactly that. On the first run after
// f04dd42 landed, twelve of these tests skipped on a stale binary and the suite reported
// 23/23 green. A skip that reads as a pass is the coverage illusion covgap exists to name, and it
// happened here, in the file whose subject is measurements that mean less than they look like.
let skipsAnnounced = 0;
const needBinary = () => {
  const bin = S.findReplay();
  if (bin.stale) assert.fail(bin.error);
  if (bin.missing) {
    if (skipsAnnounced++ === 0) console.log(`  !! SKIPPING every fixture check — ${bin.error}`);
    return false;
  }
  return true;
};

const reports = name => S.reportsFor(fx(name)).reports;
const at = (rs, t) => {
  const r = rs.find(x => Math.abs(x.at - t) < 0.3);
  assert.ok(r, `no swell report near t=${t}`);
  return r;
};

/* ---------------- the negative control, which is the whole point ---------------- */

test("the Bernstein's real crescendo is not indicted", () => {
  if (!needBinary()) return;
  // 3:07 into the Adagio, the climb the piece is famous for. +19.8 dB across a full window.
  // If this ever flags, the analysis has failed its own control and the tool is worthless.
  const climax = at(reports('fixture-adagio-op11-956.jsonl'), 187.2);
  assert.ok(climax.db > 19 && climax.db < 21, `expected ~+19.8 dB, got ${climax.db}`);
  const h = S.headCarried(climax);
  assert.equal(h.flagged, false);
  // Not merely unflagged — untouched. Removing five seconds moves it by less than a decibel.
  assert.ok(Math.abs(h.refit - climax.db) < 1.0,
    `a real crescendo must survive its head being removed: ${climax.db} -> ${h.refit}`);
});

test('no full-window report in any fixture is indicted', () => {
  if (!needBinary()) return;
  // The population the control is really about: every report the music's own dynamics produced,
  // across every recording that carries a level. A single flag here is a false positive.
  let full = 0; const flagged = [];
  for (const name of fs.readdirSync(FIX).filter(f => f.endsWith('.jsonl'))) {
    for (const r of S.reportsFor(fx(name)).reports) {
      if (r.over < S.WINDOW_SECS - 0.5) continue;
      full += 1;
      if (S.headCarried(r).flagged) flagged.push(`${name} @ ${r.at.toFixed(1)}`);
    }
  }
  assert.equal(full, 77);
  assert.deepEqual(flagged, []);
});

test("Fratres' opening crescendo off the floor is not indicted", () => {
  if (!needBinary()) return;
  // The case that kills the obvious rule. Truncated window, head near the silence guard,
  // +30.3 dB — the exact shape of the artifact — and it is real music: Fratres begins that way.
  // This is why `headCarried` requires the refit to COLLAPSE and not merely to shrink.
  const opening = reports('fixture-partt-fratres.jsonl')[0];
  assert.ok(opening.over < S.WINDOW_SECS - 0.5, 'expected a truncated opening window');
  assert.ok(opening.window[0][1] < -50, 'expected a floor-level head');
  assert.ok(opening.db > 29, `expected ~+30.3 dB, got ${opening.db}`);
  assert.equal(S.headCarried(opening).flagged, false);
});

test('the collapse clause is load-bearing — shrink-only would indict Fratres', () => {
  if (!needBinary()) return;
  const opening = reports('fixture-partt-fratres.jsonl')[0];
  const refit = S.refitWithoutHead(opening, 5);
  assert.ok(refit < opening.db, 'the refit does shrink');
  assert.ok(Math.abs(refit) >= S.SWELL_DB, 'and it does not collapse — which is why it is kept');
});

test('the truncated clause is load-bearing — without it a threshold-marginal swell is indicted', () => {
  if (!needBinary()) return;
  // The Adagio at 4:50: a legitimate mid-track +5.0 dB that refits to -0.2 because it sits on the
  // threshold. The full-length window is the only thing keeping it out of the report.
  const marginal = at(reports('fixture-adagio-op11-956.jsonl'), 290.4);
  assert.ok(marginal.over >= S.WINDOW_SECS - 0.5, 'full-length window');
  assert.ok(Math.abs(S.refitWithoutHead(marginal, 5)) < S.SWELL_DB,
    'it would collapse under the refit — so only the truncation clause spares it');
  assert.equal(S.headCarried(marginal).flagged, false);
});

test('the head level alone cannot order these — it interleaves', () => {
  if (!needBinary()) return;
  // A's field is NECESSARY and NOT sufficient, and this is the evidence rather than the assertion.
  // Sorted by head level, the four floor-opening reports alternate artifact / real / artifact /
  // real. No threshold on the head separates them; only the refit does.
  const rows = [];
  for (const name of fs.readdirSync(FIX).filter(f => f.endsWith('.jsonl'))) {
    for (const r of S.reportsFor(fx(name)).reports) {
      if (r.over < S.WINDOW_SECS - 0.5 && r.window[0][1] < -50) {
        rows.push({ head: r.window[0][1], flagged: S.headCarried(r).flagged });
      }
    }
  }
  rows.sort((a, b) => a.head - b.head);
  assert.equal(rows.length, 4);
  assert.deepEqual(rows.map(r => r.flagged), [true, false, true, false]);
});

/* ---------------- the positive side ---------------- */

test("the Adagio's opening report is carried by its own first seconds, and reverses", () => {
  if (!needBinary()) return;
  const opening = reports('fixture-adagio-op11-956.jsonl')[0];
  assert.ok(Math.abs(opening.at - 116.75) < 0.3);
  assert.ok(opening.db > 10 && opening.db < 12, `expected ~+11.0 dB, got ${opening.db}`);
  assert.ok(opening.over < 49, 'the minimum span — it fires the instant it is allowed to');
  const h = S.headCarried(opening);
  assert.equal(h.flagged, true);
  assert.equal(h.reverses, true, 'the 43s of music it describes are actually falling');
});

test('the family is not confined to track starts — the grand pause produces one too', () => {
  if (!needBinary()) return;
  // 8:08 into the Adagio: silence, then an onset, then a window that opens on the re-entry. This
  // appeared only after f04dd42 routed Onset to sound_began — the guard that stops the window
  // spanning the pause also gives the next window a head made of the re-entry. Same arithmetic,
  // no track boundary anywhere near it. Recorded because the first version of this analysis said
  // "at a track start" and the mechanism is wider than that.
  const r = at(reports('fixture-adagio-op11-956.jsonl'), 536.6);
  assert.ok(r.over < 49, 'truncated by the onset, not by a title change');
  const h = S.headCarried(r);
  assert.equal(h.flagged, true);
  assert.ok(Math.abs(h.refit) < 1, `the 43s after the re-entry are flat: ${h.refit}`);
});

test('exactly two reports across every levelled fixture are head-carried', () => {
  if (!needBinary()) return;
  const flagged = []; let total = 0;
  for (const name of fs.readdirSync(FIX).filter(f => f.endsWith('.jsonl'))) {
    for (const r of S.reportsFor(fx(name)).reports) {
      total += 1;
      if (S.headCarried(r).flagged) flagged.push(`${name}@${r.at.toFixed(1)}`);
    }
  }
  assert.equal(total, 83);
  assert.deepEqual(flagged, [
    'fixture-adagio-op11-956.jsonl@116.8',
    'fixture-adagio-op11-956.jsonl@536.6',
  ]);
});

test('a track-start report can be real — skinshine is pinned and not head-carried', () => {
  if (!needBinary()) return;
  // The live ledger's `+12.2 dB over 48s` at 00:33:53, recorded. Same shape as the artifact, same
  // pinning to a track start, and it holds: the track goes from digital silence to -34 dB almost
  // at once and then genuinely builds. Pinning alone is not evidence of an artifact.
  const opening = reports('fixture-beat-phyllzx-skinshine.jsonl')[0];
  assert.ok(opening.over < S.WINDOW_SECS - 0.5, 'truncated, pinned to the start of audio');
  assert.ok(opening.db > 11 && opening.db < 14, `expected ~+12.3 dB, got ${opening.db}`);
  assert.equal(S.headCarried(opening).flagged, false);
});

/* ---------------- the detector is read, not reimplemented ---------------- */

test('every reconstructed window opens on the head level the binary printed', () => {
  if (!needBinary()) return;
  // The check that replaced the mirror. It cannot be satisfied by this file agreeing with itself:
  // the head comes from cochlea.rs and the window comes from the fixture.
  let checked = 0;
  for (const name of fs.readdirSync(FIX).filter(f => f.endsWith('.jsonl'))) {
    const r = S.reportsFor(fx(name));
    assert.deepEqual(r.skipped, [], `${name}: a window failed to reconstruct`);
    for (const rep of r.reports) {
      assert.equal(rep.verified, true, `${name} @ ${rep.at}: window not verified`);
      assert.ok(Math.abs(rep.window[0][1] - rep.from) <= 0.06);
      checked += 1;
    }
  }
  assert.equal(checked, 83);
});

test('a stale or missing binary is refused, not worked around', () => {
  // The whole point of dropping the mirror: a fallback that "probably still matches" is the drift
  // with the warning removed. Missing and stale are reported as distinct facts because the callers
  // must treat them differently — one is a fresh clone, the other is a wrong answer.
  const bin = S.findReplay();
  if (bin.error) {
    assert.match(bin.error, /cochlea_replay/);
    assert.ok(bin.missing || bin.stale, 'a refusal must say which kind it is');
    return;
  }
  assert.ok(fs.existsSync(bin.path));
  const src = path.join(__dirname, '..', 'src-tauri', 'src', 'cochlea.rs');
  assert.ok(fs.statSync(bin.path).mtimeMs >= fs.statSync(src).mtimeMs,
    'the binary in the tree is older than cochlea.rs — rebuild before trusting any number here');
});

test('replay output is parsed across all three eras of the swell line', () => {
  // THIS TEST IS WHY THE SUITE WENT RED RATHER THAN QUIET. c032a27 added `, -4.8 past 6s` inside
  // the parenthesis and the old pattern stopped matching the whole clause — so `from` became null,
  // the window fell back to being inferred from a span rounded to the second, and every head this
  // tool printed was subtly wrong. Nothing about that is visible in the output. What made it
  // visible is that the verification is asserted, not merely printed: two tests failed the moment
  // the printer's wording moved.
  const got = S.parseReplay([
    ' 116.75  growing  +11.0 dB over 48s (from -59.4 dB, -4.8 past 6s)',   // c032a27 and after
    ' 536.61  growing   +7.0 dB over 48s (from -54.7 dB)',                 // f04dd42 .. c032a27
    ' 137.66  fading   -5.1 dB over 60s',                                  // before f04dd42
    '  68.62  onset      ~925 Hz',
  ].join('\n'));
  assert.equal(got.length, 3);
  assert.deepEqual(got[0],
    { at: 116.75, rising: true, db: 11.0, over: 48, from: -59.4, refit: -4.8, trim: 6 });
  assert.equal(got[1].from, -54.7);
  assert.equal(got[1].refit, null, 'a build with a head and no refit is read as exactly that');
  assert.equal(got[2].from, null, 'an absent head stays absent rather than becoming zero');
  assert.equal(got[2].refit, null);
});

test("this file's refit agrees with the detector's own, at the detector's trim", () => {
  if (!needBinary()) return;
  // The mirror is gone, but a second computation of a shipped number is still a second copy, and
  // this is the only thing that keeps it honest. Compared at `trim_s` off the event — a 5 s refit
  // and a 6 s refit of one window are different quantities, and comparing them would produce a
  // disagreement that means nothing.
  let checked = 0;
  for (const name of fs.readdirSync(FIX).filter(f => f.endsWith('.jsonl'))) {
    for (const r of S.reportsFor(fx(name)).reports) {
      const a = r.refitAgrees;
      assert.ok(a, `${name} @ ${r.at}: the binary printed no refit — rebuild after c032a27`);
      assert.equal(a.trim, 6);
      assert.ok(a.agrees, `${name} @ ${r.at}: ours ${a.ours.toFixed(1)} vs theirs ${a.theirs}`);
      checked += 1;
    }
  }
  assert.equal(checked, 83);
});

test('a refit with too little window left is null, not zero', () => {
  if (!needBinary()) return;
  // An absent measurement must not wear the shape of a flat one — the rule Frame.db follows.
  const opening = reports('fixture-adagio-op11-956.jsonl')[0];
  assert.equal(S.refitWithoutHead(opening, 1000), null);
  assert.equal(S.headCarried(opening, 1000).flagged, false);
});

/* ---------------- the ledger, and its refusals ---------------- */

const line = (at, kind, text, extra = {}) => JSON.stringify({ at, kind, text, ...extra });

test('a day rollover in HH:MM:SS timestamps is not read as time going backwards', () => {
  const ev = S.readLedger([line('23:59:50', 'track', '♪ a'), line('00:00:10', 'track', '♪ b')].join('\n'));
  assert.equal(ev[1].abs - ev[0].abs, 20);
});

test('millisecond stamps and the det field are read, and mark the format era', () => {
  // 62a5a84. Written before the app was restarted, so this is the only place the new shape is
  // exercised until it appears live — a parser that silently mis-reads is worse than one that
  // refuses.
  const ev = S.readLedger([
    line('11:00:00', 'growing', 'growing · +9.0 dB over 48s'),
    line('11:00:30.125', 'growing', 'growing · +9.0 dB over 60s (from -57.2 dB)', { det: 'swell' }),
  ].join('\n'));
  assert.equal(ev[0].millis, false);
  assert.equal(ev[1].millis, true);
  assert.equal(ev[1].det, 'swell');
  assert.equal(ev[1].from, -57.2);
  assert.equal(ev[0].from, null, 'an absent head stays absent');
  assert.ok(Math.abs((ev[1].abs - ev[0].abs) - 30.125) < 1e-6, 'the milliseconds are kept');
  const b = S.eraBoundaries(ev);
  assert.equal(b.length, 1);
  assert.equal(b[0].kind, 'format');
  assert.equal(S.eras(ev).length, 2);
});

test('the service wording and the replay wording are read by one grammar', () => {
  // The two printers do not agree: cochlea_replay prints `past 6s`, cochlea_service prints
  // `past the first 6s`. One regex reads both, because two would drift and the tool would go
  // half-blind on whichever ledger it was not last fixed against.
  const ev = S.readLedger([
    line('11:00:00.100', 'growing', 'growing · +11.0 dB over 48s (from -59.4 dB, -4.8 past the first 6s)', { det: 'swell' }),
  ].join('\n'));
  assert.equal(ev[0].from, -59.4);
  assert.equal(ev[0].refit, -4.8);
  assert.equal(ev[0].trim, 6);
});

test('the ev block wins over the sentence that describes it', () => {
  // Era 4 ships the numbers as fields. Parsing the rendered string when the value is right there
  // is the same defect as mirroring a detector that can be run — so where they disagree, and they
  // will as soon as a printer is reworded, the field is the fact.
  const ev = S.readLedger([
    line('11:00:00.100', 'growing', 'growing · +9.9 dB over 48s (from -59.4 dB, -4.8 past the first 6s)',
         { det: 'swell', ev: { from_dbfs: -59.42, delta_db: 9.94, window_s: 48.2, refit_db: -4.81, trim_s: 6.0 } }),
  ].join('\n'));
  assert.equal(ev[0].from, -59.42);
  assert.equal(ev[0].db, 9.94);
  assert.equal(ev[0].over, 48.2);
  assert.equal(ev[0].refit, -4.81);
  assert.ok(Math.abs(ev[0].windowStart - (11 * 3600 + 0.1 - 48.2)) < 1e-6,
    'the window start follows the field, not the rounded span in the prose');
});

test('the detector boundary is found from arithmetic the current code cannot produce', () => {
  const ev = S.readLedger([
    line('10:00:00', 'growing', 'growing · +3.1 dB over 60s'),   // below threshold
    line('10:00:04', 'growing', 'growing · +3.4 dB over 60s'),   // inside the gate
    line('11:00:00', 'growing', 'growing · +9.0 dB over 48s'),
    line('11:00:30', 'growing', 'growing · +9.0 dB over 60s'),
  ].join('\n'));
  const b = S.eraBoundaries(ev);
  assert.equal(b.length, 1);
  assert.equal(b[0].kind, 'arithmetic');
  assert.equal(b[0].at, 10 * 3600 + 4);
  const parts = S.eras(ev);
  assert.equal(parts.length, 2);
  assert.equal(parts[0].events.length, 2);
  assert.equal(parts[1].events.length, 2);
});

test('both boundaries can be present, and produce three eras', () => {
  const ev = S.readLedger([
    line('10:00:00', 'growing', 'growing · +3.1 dB over 60s'),
    line('11:00:00', 'growing', 'growing · +9.0 dB over 48s'),
    line('12:00:00.500', 'growing', 'growing · +9.0 dB over 60s (from -40.0 dB)', { det: 'swell' }),
  ].join('\n'));
  assert.equal(S.eraBoundaries(ev).length, 2);
  assert.deepEqual(S.eras(ev).map(e => e.events.length), [1, 1, 1]);
});

test('a ledger from one detector and one format is not split', () => {
  const ev = S.readLedger([
    line('11:00:00', 'growing', 'growing · +9.0 dB over 48s'),
    line('11:00:30', 'growing', 'growing · +9.0 dB over 60s'),
  ].join('\n'));
  assert.deepEqual(S.eraBoundaries(ev), []);
  assert.equal(S.eras(ev).length, 1);
});

test('pinning is measured from the window start, not the report time', () => {
  // The report lands 48 seconds after the track begins. Comparing report times to track times
  // would find nothing here, which is why the earlier hand-reading of this ledger found nothing.
  const ev = S.readLedger([
    line('12:00:00', 'track', '♪ a'),
    line('12:00:20', 'settled', '2:1 octave'),
    line('12:00:48', 'growing', 'growing · +14.0 dB over 48s'),
    line('12:01:30', 'track', '♪ b'),
  ].join('\n'));
  const a = S.pinAnalysis(ev);
  assert.equal(a.pinnedGrowing, 1);
  assert.equal(a.distinctTracks, 1);
  assert.equal(a.eligible, 1);
  assert.equal(a.produced, 1);
});

test('a mid-track swell is not counted as pinned', () => {
  const ev = S.readLedger([
    line('12:00:00', 'track', '♪ a'),
    line('12:03:00', 'growing', 'growing · +14.0 dB over 60s'),
    line('12:06:00', 'track', '♪ b'),
  ].join('\n'));
  assert.equal(S.pinAnalysis(ev).pinnedGrowing, 0);
});

test('a track too short to produce a report is not counted in the denominator', () => {
  const ev = S.readLedger([
    line('12:00:00', 'track', '♪ skipped'),
    line('12:00:05', 'settled', '2:1 octave'),
    line('12:00:10', 'track', '♪ also skipped'),
    line('12:00:15', 'settled', '2:1 octave'),
    line('12:00:20', 'track', '♪ played'),
    line('12:00:30', 'settled', '2:1 octave'),
    line('12:01:08', 'growing', 'growing · +14.0 dB over 48s'),
    line('12:05:00', 'track', '♪ next'),
  ].join('\n'));
  const a = S.pinAnalysis(ev);
  assert.equal(a.tracks, 4);
  assert.equal(a.eligible, 1);
  assert.equal(a.produced, 1);
});

test('the live ledger, current era: the pinning holds as the file grows', () => {
  // The count the brief asked for was 10 of 16 eligible when it was measured at 00:54. By 02:07
  // the app was still listening and it was 11 of 19. THE COUNT IS NOT ASSERTED, because pinning a
  // moving number would make this suite go red every time the keeper plays a song — which is the
  // same mistake the deleted mirror made: pinning a value instead of a property. What is asserted
  // is what the finding actually claims and what does not move.
  //
  // Skipped rather than failed when the ledger is absent — it is gitignored, and this suite must
  // run on a fresh clone.
  const p = 'C:/Consonance/data/heard.jsonl';
  if (!fs.existsSync(p)) return;
  const parts = S.eras(S.readLedger(fs.readFileSync(p, 'utf8')));
  const era = parts[parts.length - 1];
  const a = S.pinAnalysis(era.events);
  console.log(`  (live snapshot: ${a.produced} of ${a.eligible} eligible track starts, ${a.growing} growing)`);

  // These two hold at any sample size, so they are checked unconditionally.
  //
  // One report per implicated track start, never two.
  assert.equal(a.pinnedGrowing, a.distinctTracks);
  // Every one of them fires at the earliest instant a report is permitted.
  for (const r of a.rows) {
    assert.ok(r.over < 49, `pinned report at ${r.at} has span ${r.over}, expected the 48s minimum`);
  }

  // The remaining two clauses are statistical, and a new era starts empty. Era 3 opened at
  // 03:21:32 with the restart that switched on millisecond stamps, and eleven minutes later it
  // held one eligible track start and zero pinned reports — which failed this test the first time
  // it ran after the restart. Nothing had broken; there was nothing there yet. An under-powered
  // sample must read as neither pass nor fail, the same cut this suite already makes between
  // MISSING and STALE.
  //
  // The bar is derived, not chosen. The lowest pinning rate the corpus has shown is era 1's 5 of
  // 18, ≈0.28; at eight eligible starts a run of pure misses would be 0.72^8 ≈ 7%, so below eight
  // a zero says nothing. Above it, a zero is a finding.
  const POWERED = 8;
  if (a.eligible < POWERED) {
    console.log(`  (under-powered: ${a.eligible} eligible track starts, ${POWERED} needed before an ` +
      `absence means anything — the statistical clauses are not evaluated)`);
    return;
  }
  // Overwhelmingly more than coincidence.
  assert.ok(a.pinnedGrowing > 10 * a.chanceRate * a.growing,
    `${a.pinnedGrowing} pinned against a chance expectation of ${(a.chanceRate * a.growing).toFixed(2)}`);
  // And the direction is asymmetric: a truncated window at a boundary reports growth, not decay.
  assert.ok(a.pinnedGrowing > a.pinnedFading * 3);
});
