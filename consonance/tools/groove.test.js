// The two directions, and the one that would quietly retire this tool.
//
// A pulse detector that says PULSE to everything is the failure this repo already shipped and
// refused once (f07dd7e: 17 and 21 confident tempos spanning the whole allowed range, with a
// steadiness metric that could not come out low). So the assertions below care most about the
// measure STAYING ABLE TO SAY NO — the Poisson walls, the withheld CV, the refusal on a file whose
// level is unknown. A green run here means the negative controls still fail, not just that the
// positive ones pass.
//
// The other direction matters too and is cheaper to lose: a detector that goes silent looks
// identical to a clean result. Hence the walls asserting that onsets ARE found and a CV IS
// produced on material that has one.
//
//   node consonance/tools/groove.test.js
'use strict';

const assert = require('assert');
const test = require('node:test');
const fs = require('fs');
const path = require('path');

const G = require('./groove.js');

// Small trial counts keep the suite quick; every generator is seeded, so results are exact and
// repeatable rather than approximately right.
const FAST = { trials: 40 };

function framesFor(times, opts) {
  return G.renderHits(times, Object.assign({ decayMs: 150 }, opts || {}));
}

// ---------------------------------------------------------------------------
// Reading, and the missing-db boundary
// ---------------------------------------------------------------------------

test('a frame with no db field parses as null, never as zero or silence', () => {
  const txt = '{"t":1.0,"peaks":[]}\n{"t":1.085,"db":-20.5,"peaks":[]}\n';
  const p = G.parseFixture(txt);
  assert.strictEqual(p.frames.length, 2);
  assert.strictEqual(p.frames[0].db, null, 'absent db must be null, not 0');
  assert.strictEqual(p.missingDb, 1);
  assert.strictEqual(p.frames[1].db, -20.5);
});

test('malformed and empty lines are counted, not silently dropped into the data', () => {
  const txt = '{"t":1.0,"db":-10}\nnot json\n\n{"no_t":true}\n{"t":1.085,"db":-11}\n';
  const p = G.parseFixture(txt);
  assert.strictEqual(p.frames.length, 2);
  assert.strictEqual(p.malformed, 2, 'one unparseable line and one lacking t');
});

test('parseFixture on empty input yields no frames rather than throwing', () => {
  const p = G.parseFixture('');
  assert.strictEqual(p.frames.length, 0);
  assert.strictEqual(p.malformed, 0);
});

// ---------------------------------------------------------------------------
// The timing axis
// ---------------------------------------------------------------------------

test('auditFrames recovers the nominal frame period from jittered timestamps', () => {
  // build a perfect 85.333ms grid, then add +/-5ms of the bimodal wall-clock jitter the real
  // fixtures carry, and require the fitted period back to well under a millisecond
  const frames = [];
  for (let i = 0; i < 400; i++) {
    const jitter = (i % 2 === 0 ? 0.005 : -0.005);
    frames.push({ t: 10 + i * G.T + jitter, db: -20, peaks: [] });
  }
  const a = G.auditFrames(frames);
  assert.ok(a.ok);
  assert.ok(Math.abs(a.slopeMs - G.TMS) < 0.5,
    'fitted period ' + a.slopeMs + ' should recover nominal ' + G.TMS);
  assert.strictEqual(a.matchesNominal, true);
  assert.ok(a.jitterRms > 1, 'the injected jitter must be visible, not smoothed away');
});

test('auditFrames flags a series whose spacing is NOT the nominal period', () => {
  const frames = [];
  for (let i = 0; i < 100; i++) frames.push({ t: i * 0.020, db: -20, peaks: [] });
  const a = G.auditFrames(frames);
  assert.strictEqual(a.matchesNominal, false,
    'a 20ms hop must not be silently reconstructed onto the 85ms grid');
});

test('auditFrames refuses a series too short to fit', () => {
  const a = G.auditFrames([{ t: 0, db: -20, peaks: [] }]);
  assert.strictEqual(a.ok, false);
});

// ---------------------------------------------------------------------------
// Coherence
// ---------------------------------------------------------------------------

test('coherence is 1 on a perfect grid and near zero on scattered onsets', () => {
  const grid = [];
  for (let k = 0; k < 24; k++) grid.push(k * 0.5);
  assert.ok(G.coherenceAt(grid, 500) > 0.999, 'exact grid must be fully coherent');

  // onsets spread evenly across the period cancel around the circle
  const spread = [];
  for (let k = 0; k < 24; k++) spread.push(k * 0.5 + (k % 8) * (0.5 / 8));
  assert.ok(G.coherenceAt(spread, 500) < 0.2,
    'phases covering the circle must not read as a pulse');
});

test('coherence is unchanged by shifting all onsets in time', () => {
  const a = [], b = [];
  for (let k = 0; k < 20; k++) { a.push(k * 0.42); b.push(k * 0.42 + 137.9); }
  assert.ok(Math.abs(G.coherenceAt(a, 420) - G.coherenceAt(b, 420)) < 1e-9,
    'R is the magnitude of a mean phasor, so a common offset cannot matter');
});

test('coherence survives the frame quantisation it will actually be fed', () => {
  const q = [];
  for (let k = 0; k < 24; k++) q.push(Math.round((k * 0.5) / G.T) * G.T);
  assert.ok(G.coherenceAt(q, 500) > 0.8,
    '85ms snapping must cost little at a 500ms beat, or the whole approach is dead');
});

// ---------------------------------------------------------------------------
// Octave folding and reliability
// ---------------------------------------------------------------------------

test('foldOctaves brings halves and doubles onto the median octave', () => {
  const folded = G.foldOctaves([500, 500, 1000, 250, 500]);
  for (const v of folded) {
    assert.ok(Math.abs(v - 500) < 1e-6, 'expected 500, got ' + v);
  }
});

test('foldOctaves leaves a genuine within-octave spread alone', () => {
  const input = [667, 750, 857, 1000];   // 90 -> 60 bpm, a real rubato, ratio < 2
  const folded = G.foldOctaves(input);
  assert.deepStrictEqual(folded.map(Math.round), input.map(Math.round),
    'a real tempo change inside one octave must not be folded away');
});

test('foldOctaves on empty input returns empty rather than throwing', () => {
  assert.deepStrictEqual(G.foldOctaves([]), []);
});

test('neighbourDrift is zero for a steady series and large for an alternating one', () => {
  assert.strictEqual(G.neighbourDrift([500, 500, 500, 500]), 0);
  assert.ok(G.neighbourDrift([500, 1000, 500, 1000, 500]) > 0.9,
    'octave-alternating neighbours must register ~1 octave of drift');
});

// ---------------------------------------------------------------------------
// Onset detection
// ---------------------------------------------------------------------------

test('onsets are found on percussive material — the detector must not go quiet', () => {
  const { frames, times } = framesFor(G.synthClicks(120, 40, 0, 3));
  const d = G.detectOnsets(frames, times, G.DEFAULT_GATE_DB);
  assert.ok(d.onsets.length >= 30,
    'expected ~40 clicks to be found, got ' + d.onsets.length);
});

// Built from explicit dB series rather than rendered audio: a hit rising out of DIGITAL silence
// is deliberately not an onset (see the silence-gap test below), so rendering one hit into an
// empty buffer yields zero and would test the wrong rule. I got that wrong first time round.
test('the refractory rule collapses one attack spread over two frames into one onset', () => {
  const dbs = [-30, -20, -10, -30, -30, -30];
  const frames = dbs.map((db, i) => ({ t: i * G.T, db, peaks: [] }));
  const times = frames.map((_, i) => i * G.T);
  const d = G.detectOnsets(frames, times, 3.0);
  assert.strictEqual(d.onsets.length, 1,
    'two adjacent 10dB rises are one attack, not two events');
});

test('rises further apart than the refractory window are two onsets', () => {
  const dbs = [-30, -20, -30, -30, -30, -20, -30, -30];
  const frames = dbs.map((db, i) => ({ t: i * G.T, db, peaks: [] }));
  const times = frames.map((_, i) => i * G.T);
  const d = G.detectOnsets(frames, times, 3.0);
  assert.strictEqual(d.onsets.length, 2);
});

test('a rise across a silence gap is not an onset', () => {
  // two loud frames separated by a -100 floor frame: the jump out of silence must not count,
  // because the floor is absence of signal rather than a level to rise from
  const frames = [
    { t: 0 * G.T, db: -30, peaks: [] },
    { t: 1 * G.T, db: -100, peaks: [] },
    { t: 2 * G.T, db: -10, peaks: [] },
  ];
  const times = frames.map((_, i) => i * G.T);
  const d = G.detectOnsets(frames, times, 3.0);
  assert.strictEqual(d.onsets.length, 0);
});

test('frames whose db is unknown contribute no onsets', () => {
  const frames = [], times = [];
  for (let i = 0; i < 50; i++) { frames.push({ t: i * G.T, db: null, peaks: [] }); times.push(i * G.T); }
  const d = G.detectOnsets(frames, times, 3.0);
  assert.strictEqual(d.onsets.length, 0);
  assert.strictEqual(d.nUsable, 0);
});

test('a higher gate finds fewer onsets, monotonically', () => {
  const { frames, times } = framesFor(G.synthClicks(120, 40, 0, 4));
  const lo = G.detectOnsets(frames, times, 1.0).onsets.length;
  const hi = G.detectOnsets(frames, times, 8.0).onsets.length;
  assert.ok(lo >= hi, 'gate 1.0 found ' + lo + ', gate 8.0 found ' + hi);
});

// ---------------------------------------------------------------------------
// THE WALLS — the pulse gate has to be able to say no
// ---------------------------------------------------------------------------

test('WALL: a Poisson process with no pulse is reported NO PULSE', () => {
  const { frames, times } = framesFor(G.synthPoisson(500, 120, 13));
  const r = G.analyze(frames, Object.assign({ times, noSweep: true }, FAST));
  assert.strictEqual(r.pulse.verdict, 'NO PULSE',
    'coherence ' + r.pulse.score + ' vs null p99 ' + r.pulse.null.p99);
  assert.strictEqual(r.tempo, null, 'no pulse means no tempo series at all');
});

test('WALL: a sparse Poisson process is also NO PULSE', () => {
  const { frames, times } = framesFor(G.synthPoisson(1500, 100, 14));
  const r = G.analyze(frames, Object.assign({ times, noSweep: true }, FAST));
  assert.strictEqual(r.pulse.verdict, 'NO PULSE');
});

test('WALL: too few onsets reports NO DATA instead of guessing', () => {
  const g = G.pulseGate([1.0, 1.5, 2.0], FAST);
  assert.strictEqual(g.verdict, 'NO DATA');
  assert.match(g.reason, /onsets/);
});

test('WALL: silence yields no onsets and no verdict', () => {
  const frames = [], times = [];
  for (let i = 0; i < 200; i++) { frames.push({ t: i * G.T, db: -100, peaks: [] }); times.push(i * G.T); }
  const r = G.analyze(frames, Object.assign({ times, noSweep: true }, FAST));
  assert.strictEqual(r.detection.onsets.length, 0);
  assert.strictEqual(r.pulse.verdict, 'NO DATA');
});

test('a click track IS found, at the right tempo — the opposite wall', () => {
  const { frames, times } = framesFor(G.synthClicks(120, 100, 0, 11));
  const r = G.analyze(frames, Object.assign({ times, noSweep: true }, FAST));
  assert.strictEqual(r.pulse.verdict, 'PULSE');
  assert.ok(Math.abs(r.pulse.impliedBpm - 120) < 2,
    'expected ~120bpm, got ' + r.pulse.impliedBpm);
});

// ---------------------------------------------------------------------------
// Tempo CV
// ---------------------------------------------------------------------------

test('a click track CV sits at or below the resolution floor', () => {
  const { frames, times } = framesFor(G.synthClicks(120, 100, 0, 11));
  const r = G.analyze(frames, Object.assign({ times, noSweep: true }, FAST));
  assert.ok(r.tempo, 'a pulse should produce a tempo series');
  assert.strictEqual(r.tempo.resolvable, false,
    'CV ' + r.tempo.cv + ' must not exceed floor ' + r.tempo.cvFloor + ' on a metronome');
});

test('per-onset jitter does NOT raise the tempo CV — CV is blind to microtiming', () => {
  // 30ms of jitter averages down over a 12-onset window fit, so this is the measured form of the
  // resolution finding: tempo CV cannot substitute for a microtiming measurement.
  const { frames, times } = framesFor(G.synthClicks(120, 100, 30, 12));
  const r = G.analyze(frames, Object.assign({ times, noSweep: true }, FAST));
  assert.strictEqual(r.pulse.verdict, 'PULSE');
  assert.strictEqual(r.tempo.resolvable, false,
    'CV ' + r.tempo.cv + ' rose above floor ' + r.tempo.cvFloor + ' on pure per-onset jitter');
});

test('a planted tempo ramp IS resolved, and the recovered range brackets it', () => {
  const { frames, times } = framesFor(G.synthRamp(60, 90, 120));
  const r = G.analyze(frames, Object.assign({ times, noSweep: true }, FAST));
  assert.strictEqual(r.pulse.verdict, 'PULSE');
  assert.strictEqual(r.tempo.resolvable, true, 'a 60->90bpm ramp must clear the floor');
  assert.ok(r.tempo.minBpm < 70 && r.tempo.maxBpm > 80,
    'recovered ' + r.tempo.minBpm + '-' + r.tempo.maxBpm + ' should bracket 60-90');
});

// THE SENSITIVITY EDGE, and it really is an edge. A 4 bpm drift at 120 BPM produces CV 0.0100
// against a floor of 0.0050, and `resolvable` requires cv > 2*floor — so 120 beats lands EXACTLY
// on the bar and reads false, while 150 beats gives 0.0102 and reads true. Recorded rather than
// tuned around: ~4 bpm over ~150 beats is the smallest tempo drift this instrument can call, and
// anything smaller is genuinely below its resolution.
test('a small 118->122bpm drift clears the floor at the calibrated length', () => {
  const { frames, times } = framesFor(G.synthRamp(118, 122, 150));
  const r = G.analyze(frames, Object.assign({ times, noSweep: true }, FAST));
  assert.strictEqual(r.tempo.resolvable, true,
    'CV ' + r.tempo.cv + ' vs floor ' + r.tempo.cvFloor);
});

test('the same drift over fewer beats sits exactly on the bar and is NOT claimed', () => {
  const { frames, times } = framesFor(G.synthRamp(118, 122, 120));
  const r = G.analyze(frames, Object.assign({ times, noSweep: true }, FAST));
  assert.strictEqual(r.tempo.resolvable, false,
    'at the boundary the instrument must decline, not round up');
});

test('a genuine subdivided pulse needs NO octave folding', () => {
  // the control that licenses using octave-splitting as a disqualifier at all
  const { frames, times } = framesFor(G.synthSubdivided(120, 120, 1));
  const r = G.analyze(frames, Object.assign({ times, noSweep: true }, FAST));
  assert.strictEqual(r.pulse.verdict, 'PULSE');
  assert.ok(r.tempo.octaveFlips <= G.MAX_OCTAVE_FLIPS,
    'subdivision alone produced ' + r.tempo.octaveFlips + ' folding');
});

test('the CV resolution floor is derived from the frame period, not hardcoded', () => {
  const t = G.tempoCV([500, 500, 500, 500, 500]);
  // sd(period) = sqrt(QUANT^2/Sxx + step^2/12), Sxx = W(W^2-1)/12
  const W = G.ONSETS_PER_WINDOW;
  const Sxx = W * (W * W - 1) / 12;
  const expected = Math.sqrt((G.QUANT_SD_MS ** 2) / Sxx + (5 ** 2) / 12);
  assert.ok(Math.abs(t.sdPeriodMs - expected) < 1e-9);
  assert.ok(Math.abs(t.cvFloor - expected / 500) < 1e-9);
});

test('tempoCV returns null rather than a number when there is nothing to average', () => {
  assert.strictEqual(G.tempoCV([]), null);
  assert.strictEqual(G.tempoCV([500]), null);
  assert.strictEqual(G.tempoCV(null), null);
});

// ---------------------------------------------------------------------------
// The fixed-vs-free model comparison — the verdict layer
// ---------------------------------------------------------------------------

test('a fixed tempo is classified STEADY, and one global period explains it', () => {
  const { frames, times } = framesFor(G.synthClicks(120, 120, 0, 11));
  const r = G.analyze(frames, Object.assign({ times, noSweep: true }, FAST));
  const cls = G.classifyTempo(r.pulse);
  assert.strictEqual(cls.label, 'STEADY');
  assert.ok(r.pulse.freeMinusFixed <= G.GAP_STEADY_MAX,
    'gap ' + r.pulse.freeMinusFixed + ' should be tiny for a metronome');
});

test('a genuine rubato is classified ELASTIC because no fixed period fits', () => {
  const { frames, times } = framesFor(G.synthRamp(60, 90, 150));
  const r = G.analyze(frames, Object.assign({ times, noSweep: true }, FAST));
  assert.strictEqual(G.classifyTempo(r.pulse).label, 'ELASTIC');
  assert.ok(r.pulse.freeMinusFixed >= G.GAP_ELASTIC_MIN,
    'gap ' + r.pulse.freeMinusFixed + ' should be large when the tempo really moves');
});

test('subdivision does not push a steady pulse out of STEADY', () => {
  const { frames, times } = framesFor(G.synthSubdivided(120, 120, 1));
  const r = G.analyze(frames, Object.assign({ times, noSweep: true }, FAST));
  assert.strictEqual(G.classifyTempo(r.pulse).label, 'STEADY');
});

test('classifyTempo declines rather than guessing when there is no pulse', () => {
  assert.strictEqual(G.classifyTempo(null).label, 'NO PULSE');
  assert.strictEqual(G.classifyTempo({ verdict: 'NO PULSE' }).label, 'NO PULSE');
});

test('the uncalibrated middle is UNCLASSIFIED, not rounded to the nearer label', () => {
  // gap between the steady controls (<=0.027) and the rubato control (0.750), with a fixed model
  // that does not beat the null — exactly where every real fixture lands
  const cls = G.classifyTempo({
    verdict: 'PULSE', score: 0.68, bar: 0.62,
    global: { score: 0.58, period: 470 }, freeMinusFixed: 0.10,
  });
  assert.strictEqual(cls.label, 'UNCLASSIFIED');
  assert.strictEqual(cls.ok, false);
  assert.match(cls.why, /uncalibrated middle/);
});

test('STEADY requires the fixed model to beat the null, not merely a small gap', () => {
  // small gap, but the fixed period cannot clear the pulseless null: naming a tempo here would be
  // asserting a global period the data does not support
  const cls = G.classifyTempo({
    verdict: 'PULSE', score: 0.60, bar: 0.62,
    global: { score: 0.59, period: 500 }, freeMinusFixed: 0.01,
  });
  assert.notStrictEqual(cls.label, 'STEADY');
});

// ---------------------------------------------------------------------------
// The trust gate
// ---------------------------------------------------------------------------

test('a CV is withheld when windows solve to the edge of the search range', () => {
  const rails = [];
  for (let i = 0; i < 20; i++) rails.push(i % 2 ? 2000 : 1990);
  const t = G.tempoCV(rails);
  assert.strictEqual(G.cvIsTrustworthy(t).ok, false);
  assert.match(G.cvIsTrustworthy(t).why, /edge of the/);
});

test('a CV is withheld when the search splits between two octaves', () => {
  const split = [];
  for (let i = 0; i < 20; i++) split.push(i % 2 ? 800 : 400);
  const t = G.tempoCV(split);
  const trust = G.cvIsTrustworthy(t);
  assert.strictEqual(trust.ok, false);
  assert.match(trust.why, /octave/);
});

test('a CV is withheld when neighbouring windows disagree despite sharing onsets', () => {
  // inside one octave so folding leaves it alone, but alternating enough to be incoherent
  const jumpy = [];
  for (let i = 0; i < 30; i++) jumpy.push(i % 2 ? 560 : 460);
  const t = G.tempoCV(jumpy);
  const trust = G.cvIsTrustworthy(t);
  assert.strictEqual(trust.ok, false);
  assert.match(trust.why, /wandering/);
});

test('a steady series passes the trust gate', () => {
  const steady = [];
  for (let i = 0; i < 20; i++) steady.push(500 + (i % 3));
  assert.strictEqual(G.cvIsTrustworthy(G.tempoCV(steady)).ok, true);
});

// ---------------------------------------------------------------------------
// Spacing trend, and its confound
// ---------------------------------------------------------------------------

test('the spacing trend reports a slope and a level correlation, or nothing', () => {
  const { frames, times } = framesFor(G.synthRamp(60, 90, 60));
  const d = G.detectOnsets(frames, times, G.DEFAULT_GATE_DB);
  const s = G.spacingTrend(d.onsets, frames, times);
  assert.ok(s, 'a 60-onset series should produce a trend');
  assert.ok(s.slope < 0, 'a speeding-up ramp must show spacing shortening, got ' + s.slope);
  assert.ok(typeof s.levelCorr === 'number', 'the confound must always be reported alongside');
});

test('spacingTrend returns null on too few onsets instead of a slope from noise', () => {
  assert.strictEqual(G.spacingTrend([1, 2, 3], [], []), null);
});

// ---------------------------------------------------------------------------
// CLI parsing — the flag-swallowing bug this repo has shipped before
// ---------------------------------------------------------------------------

test('a flag expecting a value does not swallow the next flag', () => {
  const o = G.parseArgs(['--file', 'a.jsonl', '--bpm', '--gate', '3']);
  assert.deepStrictEqual(o.files, ['a.jsonl']);
  assert.strictEqual(o.bpm, null, '--bpm had no value and must not eat --gate');
  assert.strictEqual(o.gate, 3);
});

test('repeated --file accumulates', () => {
  const o = G.parseArgs(['--file', 'a', '--file', 'b']);
  assert.deepStrictEqual(o.files, ['a', 'b']);
});

test('an unknown flag is captured rather than ignored', () => {
  const o = G.parseArgs(['--nope']);
  assert.deepStrictEqual(o.unknown, ['--nope']);
});

test('main rejects a non-numeric gate with a non-zero exit code', () => {
  assert.strictEqual(G.main(['--gate', 'abc']), 2);
});

test('main rejects an unknown flag with a non-zero exit code', () => {
  assert.strictEqual(G.main(['--wat']), 2);
});

// ---------------------------------------------------------------------------
// The real fixtures — regression on what the tool currently reports
// ---------------------------------------------------------------------------

const adagio = path.join(G.FIXTURE_DIR, 'fixture-adagio-op11-956.jsonl');
const fratres = path.join(G.FIXTURE_DIR, 'fixture-partt-fratres.jsonl');
const oldAdagio = path.join(G.FIXTURE_DIR, 'fixtures-adagio-op11.jsonl');

test('Barber Adagio: NO PULSE, and no tempo number is produced', { skip: !fs.existsSync(adagio) },
  () => {
    const fx = G.loadFixture(adagio);
    const r = G.analyze(fx.frames, Object.assign({ noSweep: true }, FAST));
    assert.strictEqual(r.pulse.verdict, 'NO PULSE',
      'a piece with no drum kit and heavy rubato must not yield a pulse');
    assert.strictEqual(r.tempo, null);
  });

test('every real fixture refuses, and none reports a tempo number',
  { skip: !fs.existsSync(fratres) }, () => {
    // The honest state of the instrument on real material: the two orchestral fixtures and the
    // percussive one all decline, each for a reason with numbers behind it. If a future fixture
    // ever DOES classify, this test failing is the good news and should be updated deliberately.
    for (const f of [fratres, path.join(G.FIXTURE_DIR, 'fixture-beat-nero-reaching-out.jsonl')]) {
      if (!fs.existsSync(f)) continue;
      const r = G.analyze(G.loadFixture(f).frames, Object.assign({ noSweep: true }, FAST));
      if (r.pulse.verdict !== 'PULSE') continue;
      const cls = G.classifyTempo(r.pulse);
      assert.strictEqual(cls.ok, false,
        path.basename(f) + ' classified as ' + cls.label + ' — verify before accepting');
    }
  });

test('the older fixture with no db field is refused, not analysed to a confident nothing',
  { skip: !fs.existsSync(oldAdagio) }, () => {
    const fx = G.loadFixture(oldAdagio);
    assert.strictEqual(fx.missingDb, fx.frames.length,
      'this fixture is expected to carry no db at all');
    const d = G.detectOnsets(fx.frames, fx.frames.map((_, i) => i * G.T), G.DEFAULT_GATE_DB);
    assert.strictEqual(d.onsets.length, 0,
      'unknown level must produce no onsets rather than onsets from an assumed zero');
  });

test('both fixtures reconstruct to the nominal frame period',
  { skip: !fs.existsSync(adagio) }, () => {
    for (const f of [adagio, fratres]) {
      if (!fs.existsSync(f)) continue;
      const a = G.auditFrames(G.loadFixture(f).frames);
      assert.strictEqual(a.matchesNominal, true, path.basename(f) + ' period ' + a.slopeMs);
      assert.ok(a.jitterRms > 1 && a.jitterRms < 6,
        path.basename(f) + ' timestamp jitter ' + a.jitterRms + 'ms outside the measured 2-4ms');
    }
  });
