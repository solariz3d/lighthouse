// boundary-reminder.test.js — acceptance for boundary-reminder.js. Acceptance is MUTATION.
//
// PORTABLE ON PURPOSE, AND THAT IS A DECISION WITH A COST. Every assertion here runs against
// fixtures built in this file, so it works on any machine. The real numbers — 1,546 turns, 98.5%,
// 916 turns per arm — are NOT pinned as assertions, because the chair's transcript grows while the
// chair works and any pinned figure would be stale within the hour. They are re-derived by the
// command printed in the tool's header instead.
//
// What IS pinned, and it is the finding rather than the figures: **a fixture built to the measured
// shape of the chair's own turns makes the power gate REFUSE at the window the packet allocates,
// and text_chars alone cannot open it.** If someone quietly promotes text_chars to a quality signal
// or removes the gate, two tests go red. That is the part that had to survive, and it survives
// without binding this file to one machine — the split actors.evidence.test.js was created to make.
//
// The mutation harness follows imprint-measure.test.js: every probe is run against the UNMUTATED
// module first and must come back clean, a probe that fires on healthy code is reported as BROKEN
// PROBE rather than as a catch, NOT APPLIED is its own bucket because a substitution that did not
// land proves nothing about the guard it was aimed at, and the buckets must sum.

'use strict';
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const SRC = path.join(__dirname, 'boundary-reminder.js');
const B = require(SRC);

let pass = 0, fail = 0;
function test(name, fn) {
  try { fn(); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n       ${e.message}`); fail++; }
}
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'boundary-reminder-'));

// ── fixtures ────────────────────────────────────────────────────────────────────────────────────

const DISPATCH = 'mcp__consonance__chair_inject';
let uid = 0;
const uid_ = () => 'id' + (++uid);
const prompt = (ts, pid) => ({ type: 'user', promptSource: 'typed', isSidechain: false,
                               timestamp: ts, promptId: pid, message: { role: 'user', content: 'go' } });
const say = (n) => ({ type: 'assistant', isSidechain: false,
                      message: { role: 'assistant', content: [{ type: 'text', text: 'x'.repeat(n) }] } });
const call = (name, id) => ({ type: 'assistant', isSidechain: false, timestamp: '2026-08-30T00:00:00Z',
                              message: { role: 'assistant', content: [{ type: 'tool_use', name, id }] } });
const result = (id, isErr) => ({ type: 'user', isSidechain: false,
                                 message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: id, is_error: !!isErr }] } });

// turn 1: text, one failing tool, text, no dispatch
// turn 2: 100 chars, DISPATCH, 50 chars, DISPATCH, 10 chars   -> 10 chars after the last dispatch
// turn 3: one Write, one DISPATCH, nothing after              -> ends ON the dispatch
function fixtureRows() {
  const t1 = uid_(), d1 = uid_(), d2 = uid_(), w1 = uid_(), d3 = uid_();
  return [
    prompt('2026-08-30T01:00:00Z', 'p1'),
    say(5), call('Bash', t1), result(t1, true), say(4),
    // a subagent's own prompt row must not open a chair turn, and its traffic must not be counted
    { type: 'user', promptSource: 'typed', isSidechain: true, timestamp: '2026-08-30T01:00:30Z',
      promptId: 'sub', message: { role: 'user', content: 'sub' } },
    { type: 'assistant', isSidechain: true,
      message: { role: 'assistant', content: [{ type: 'text', text: 'y'.repeat(9999) }] } },
    prompt('2026-08-30T02:00:00Z', 'p2'),
    say(100), call(DISPATCH, d1), say(50), call(DISPATCH, d2), say(10),
    prompt('2026-08-30T03:00:00Z', 'p3'),
    call('Write', w1), call(DISPATCH, d3),
  ];
}

// Turns shaped like the chair's measured ones. THE SHAPE IS THE WHOLE ARGUMENT — zero-inflation
// with a standard deviation several times the mean is what makes the quality signals unpowered — so
// the fixture is built to the published per-signal statistics and then CHECKED against them by
// `the fixture reproduces the measured shape`. A fixture that quietly drifted away from the real
// distribution would make this file's central finding an artefact of its own test data.
//
// Targets, from `node boundary-reminder.js --scan --power` at 2026-08-30 ~05:40 (n=1,546 turns):
//     failed_tools  mean 0.108  sd 0.413  zeros 92%
//     edits         mean 0.523  sd 1.688  zeros 81%
//     tool_calls    mean 3.323  sd 6.334  zeros 49%
//     text_chars    mean 2085   sd 1463   zeros  6%
const MEASURED_SHAPE = {
  failed_tools: { mean: 0.108, sd: 0.413, zeros: 0.92 },
  edits: { mean: 0.523, sd: 1.688, zeros: 0.81 },
  tool_calls: { mean: 3.323, sd: 6.334, zeros: 0.49 },
  text_chars: { mean: 2085, sd: 1463, zeros: 0.06 },
};

function measuredShapeTurns(n, turnsPerDay, dispatchesPerDay) {
  let s = 12345;
  const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  const bucket = (r, table) => { for (const [p, v] of table) if (r < p) return v; return table[table.length - 1][1]; };
  const out = [];
  const perDay = Math.max(1, Math.round(turnsPerDay));
  for (let i = 0; i < n; i++) {
    const day = Math.floor(i / perDay);
    const failed = bucket(rnd(), [[0.92, 0], [0.97, 1], [0.99, 2], [1, 3]]);
    const edits = bucket(rnd(), [[0.81, 0], [0.92, 1], [0.97, 3], [1, 10]]);
    const tools = bucket(rnd(), [[0.49, 0], [0.79, 2], [0.94, 7], [1, 25]]);
    out.push({
      start: '2026-0' + (7 + Math.floor(day / 30)) + '-' + String((day % 30) + 1).padStart(2, '0') +
             'T0' + (i % 9) + ':00:00Z',
      promptId: 'q' + i,
      text_chars: Math.max(0, Math.round(2085 + (rnd() - 0.5) * 5000)),
      tool_calls: tools,
      failed_tools: failed,
      edits,
      dispatches: (i % Math.max(1, Math.round(turnsPerDay / dispatchesPerDay)) === 0) ? 1 : 0,
      dispatchTimestamps: [],
      charsAfterLastDispatch: 0,
    });
  }
  return out;
}

// ── PART 1 — segmentation and detection ─────────────────────────────────────────────────────────

console.log('\n-- segmentation --');

test('a turn runs from one typed prompt to the next, and subagent traffic belongs to none of them', () => {
  const t = B.segmentTurns(fixtureRows());
  assert.strictEqual(t.length, 3, 'expected 3 chair turns, got ' + t.length);
  assert.strictEqual(t[0].text_chars, 9);
  assert.strictEqual(t[0].failed_tools, 1, 'the failing Bash call was not attributed');
  assert.strictEqual(t[0].dispatches, 0);
  assert.ok(t[0].text_chars < 9999, 'a sidechain text block leaked into a chair turn');
});

test('post-dispatch text is counted from the LAST dispatch, not the first', () => {
  const t = B.segmentTurns(fixtureRows());
  assert.strictEqual(t[1].dispatches, 2);
  assert.strictEqual(t[1].text_chars, 160);
  assert.strictEqual(t[1].charsAfterLastDispatch, 10,
    'the 50 chars between the two dispatches must not count against the second');
});

test('a turn that ends on its dispatch scores zero chars after it', () => {
  const t = B.segmentTurns(fixtureRows());
  assert.strictEqual(t[2].dispatches, 1);
  assert.strictEqual(t[2].edits, 1);
  assert.strictEqual(t[2].charsAfterLastDispatch, 0);
});

test('the violation threshold is exclusive, so a turn AT the threshold is not a violation', () => {
  const t = B.segmentTurns(fixtureRows());
  assert.strictEqual(B.classifyDispatchTurns(t, 0).violations, 1);
  assert.strictEqual(B.classifyDispatchTurns(t, 10).violations, 0, '10 chars is not > 10');
  assert.strictEqual(B.classifyDispatchTurns(t, 9).violations, 1);
  assert.strictEqual(B.classifyDispatchTurns(t, 0).dispatchTurns, 2);
});

// ── PART 2 — the power arithmetic, against textbook values ──────────────────────────────────────

console.log('\n-- power arithmetic (values known independently of this implementation) --');

test('n per arm for a one-SD difference is 16 — the standard two-sample result', () => {
  assert.strictEqual(B.requiredNPerArm(1, 1), 16,
    'n = 2(z_a/2 + z_b)^2 sigma^2/delta^2 = 2(1.96+0.842)^2 = 15.7 -> 16');
  assert.strictEqual(B.requiredNPerArm(2, 1), 63, 'doubling sd must quadruple n');
  assert.strictEqual(B.requiredNPerArm(1, 0.5), 63, 'halving delta must quadruple n');
});

test('two-proportion n for 0.20 vs 0.40 lands where the standard formula puts it', () => {
  const n = B.requiredNPerArmProportion(0.2, 1.0);
  assert.ok(n >= 70 && n <= 95, 'got ' + n + '; the unpooled normal approximation gives ~79 and ' +
            'the continuity-corrected form ~86, so anything outside 70..95 is a different formula');
});

test('required n rises without bound as the effect shrinks', () => {
  assert.ok(B.requiredNPerArm(1, 0.1) > B.requiredNPerArm(1, 0.2));
  assert.strictEqual(B.requiredNPerArm(1, 0), Infinity);
});

// ── PART 3 — THE FINDING, pinned without binding this file to one machine ───────────────────────

console.log('\n-- the power gate: the finding this packet returned --');

const SHAPED = measuredShapeTurns(1500, 71, 12.24);
const GATE_OPTS = { windowDispatches: 20, relEffect: 0.5, activeDayWindow: 21, seed: 1, threshold: 0 };

test('the fixture reproduces the measured shape — otherwise the finding is an artefact of the fixture', () => {
  for (const sig of Object.keys(MEASURED_SHAPE)) {
    const want = MEASURED_SHAPE[sig];
    const got = B.signalStats(SHAPED, sig);
    const rel = (a, b) => Math.abs(a - b) / Math.abs(b);
    assert.ok(rel(got.mean, want.mean) < 0.35,
      sig + ' mean ' + got.mean.toFixed(3) + ' is far from the measured ' + want.mean);
    assert.ok(rel(got.sd, want.sd) < 0.35,
      sig + ' sd ' + got.sd.toFixed(3) + ' is far from the measured ' + want.sd);
    assert.ok(Math.abs(got.zeroFraction - want.zeros) < 0.06,
      sig + ' zero fraction ' + got.zeroFraction.toFixed(3) + ' is far from the measured ' + want.zeros);
  }
});

test('the three quality signals are zero-inflated, which is what decides the question', () => {
  for (const sig of B.QUALITY_SIGNALS) {
    const f = B.signalStats(SHAPED, sig);
    assert.ok(f.zeroFraction > 0.4, sig + ' is not zero-inflated: ' + f.zeroFraction.toFixed(2));
    assert.ok(f.sd / f.mean > 1.5,
      sig + ' sd should run above its mean; got ratio ' + (f.sd / f.mean).toFixed(2));
  }
  const tc = B.signalStats(SHAPED, 'text_chars');
  assert.ok(tc.sd / tc.mean < 1, 'text_chars is the well-behaved one; ratio ' + (tc.sd / tc.mean).toFixed(2));
});

test('THE QUALITY ARM IS UNDERPOWERED at twenty dispatches — the refusal this packet returned', () => {
  const g = B.powerGate(SHAPED, GATE_OPTS);
  assert.strictEqual(g.qualityArmPowered, false,
    'the gate now says a +50% harm is visible in twenty dispatches. If the cadence or the signal ' +
    'set really changed, that is GOOD NEWS and the finding in boundary-reminder.js must be updated ' +
    '— do not just delete this assertion.');
  for (const s of B.QUALITY_SIGNALS) {
    const row = g.rows.find((r) => r.signal === s);
    assert.ok(row.requiredPerArm > g.perArm,
      s + ' needs ' + row.requiredPerArm + ' per arm and ' + g.perArm + ' are available');
  }
});

test('text_chars is powered and STILL cannot open the gate', () => {
  const g = B.powerGate(SHAPED, GATE_OPTS);
  const tc = g.rows.find((r) => r.signal === 'text_chars');
  assert.strictEqual(tc.powered, true, 'text_chars should be the one signal with resolution');
  assert.strictEqual(tc.isQuality, false, 'text_chars must never count as a quality signal');
  assert.strictEqual(g.qualityArmPowered, false, 'a powered non-quality signal opened the gate');
});

test('scoring REFUSES while the quality arm is underpowered, and says what would fix it', () => {
  assert.throws(() => B.scoreWindow(SHAPED, GATE_OPTS), /UNDERPOWERED/);
  try { B.scoreWindow(SHAPED, GATE_OPTS); } catch (e) {
    assert.ok(/allow-underpowered/.test(e.message), 'the refusal must name its override');
    assert.ok(/active days/.test(e.message), 'the refusal must say how much window would suffice');
  }
});

test('the override reports, and marks the report as underpowered', () => {
  const r = B.scoreWindow(SHAPED, Object.assign({}, GATE_OPTS, { allowUnderpowered: true }));
  assert.strictEqual(r.underpowered, true);
  assert.ok(r.arms.on.turns > 0 && r.arms.off.turns > 0, 'both arms must be populated');
});

test('a long enough window DOES open the gate — the refusal is about n, not about disapproval', () => {
  const g = B.powerGate(SHAPED, Object.assign({}, GATE_OPTS, { windowDispatches: 4000 }));
  assert.strictEqual(g.qualityArmPowered, true,
    'no window opens the gate, so the gate is a wall and not a measurement');
});

// ── PART 4 — arm assignment ─────────────────────────────────────────────────────────────────────

console.log('\n-- randomised arms --');

test('arms are balanced, deterministic, and moved by the seed', () => {
  let on = 0;
  const N = 20000;
  for (let i = 0; i < N; i++) if (B.armFor('id-' + i, 1) === 'on') on++;
  assert.ok(Math.abs(on / N - 0.5) < 0.02, 'imbalanced: ' + (on / N).toFixed(4));
  assert.strictEqual(B.armFor('abc', 1), B.armFor('abc', 1), 'not deterministic');
  let moved = 0;
  for (let i = 0; i < 200; i++) if (B.armFor('id-' + i, 1) !== B.armFor('id-' + i, 2)) moved++;
  assert.ok(moved > 50, 'the seed barely changes the assignment (' + moved + '/200)');
});

// ── PART 5 — MUTATION ───────────────────────────────────────────────────────────────────────────

console.log('\n-- mutation --');

const SOURCE = fs.readFileSync(SRC, 'utf8');
const MUT_DIR = path.join(tmp, 'mutants');
fs.mkdirSync(MUT_DIR, { recursive: true });

function loadMutant(id, find, replace) {
  const occurrences = SOURCE.split(find).length - 1;
  if (occurrences !== 1) {
    return { applied: false, why: occurrences === 0 ? 'string not found' : occurrences + ' occurrences, ambiguous' };
  }
  const mutated = SOURCE.replace(find, replace);
  if (mutated === SOURCE) return { applied: false, why: 'replacement was a no-op' };
  const p = path.join(MUT_DIR, id.replace(/[^a-z0-9]/gi, '_') + '.js');
  fs.writeFileSync(p, mutated);
  try { return { applied: true, module: require(p) }; }
  catch (e) { return { applied: true, module: null }; }
}
function threw(fn, re) {
  try { fn(); return false; } catch (e) { return re ? re.test(String(e.message)) : true; }
}

const MUTANTS = [
  // ── the power gate: the thing the packet asked to exist ───────────────────────────────────────
  {
    id: 'power/text-chars-promoted-to-a-quality-signal',
    find: "const QUALITY_SIGNALS = ['failed_tools', 'edits', 'tool_calls'];",
    replace: "const QUALITY_SIGNALS = ['failed_tools', 'edits', 'tool_calls', 'text_chars'];",
    probe: (m) => !threw(() => m.scoreWindow(SHAPED, GATE_OPTS), /UNDERPOWERED/),
  },
  {
    id: 'power/score-gate-disabled',
    find: '  if (!gate.qualityArmPowered && !opts.allowUnderpowered) {',
    replace: '  if (false) {',
    probe: (m) => !threw(() => m.scoreWindow(SHAPED, GATE_OPTS), /UNDERPOWERED/),
  },
  {
    id: 'power/required-n-forgets-there-are-two-arms',
    find: '  return Math.ceil(2 * Math.pow(Z_ALPHA_2 + Z_BETA_80, 2) * sd * sd / (delta * delta));',
    replace: '  return Math.ceil(Math.pow(Z_ALPHA_2 + Z_BETA_80, 2) * sd * sd / (delta * delta));',
    probe: (m) => m.requiredNPerArm(1, 1) !== 16,
  },
  {
    id: 'power/required-n-drops-the-power-term',
    find: 'const Z_BETA_80 = 0.841621234;    // power 0.80',
    replace: 'const Z_BETA_80 = 0;    // power 0.80',
    probe: (m) => m.requiredNPerArm(1, 1) !== 16,
  },
  {
    id: 'power/proportion-n-ignores-the-second-arm-variance',
    find: '  return Math.ceil(Math.pow(Z_ALPHA_2 + Z_BETA_80, 2) * (p1 * (1 - p1) + p2 * (1 - p2)) / (delta * delta));',
    replace: '  return Math.ceil(Math.pow(Z_ALPHA_2 + Z_BETA_80, 2) * (p1 * (1 - p1)) / (delta * delta));',
    probe: (m) => { const n = m.requiredNPerArmProportion(0.2, 1.0); return !(n >= 70 && n <= 95); },
  },

  // ── segmentation: the universe every number above is computed over ────────────────────────────
  {
    id: 'segment/subagent-rows-open-a-chair-turn',
    find: '  return row.type === \'user\' && !!row.promptSource && !row.isSidechain;',
    replace: '  return row.type === \'user\' && !!row.promptSource;',
    probe: (m) => m.segmentTurns(fixtureRows()).length !== 3,
  },
  {
    id: 'segment/subagent-traffic-counted-in-the-chair-turn',
    find: '    if (!cur || row.isSidechain) continue;',
    replace: '    if (!cur) continue;',
    probe: (m) => m.segmentTurns(fixtureRows())[0].text_chars !== 9,
  },
  {
    id: 'segment/dispatch-detector-matches-every-tool',
    find: 'const DISPATCH_NAME = /chair_inject/;',
    replace: 'const DISPATCH_NAME = /./;',
    probe: (m) => {
      const t = m.segmentTurns(fixtureRows());
      return t[0].dispatches !== 0 || t[1].dispatches !== 2;
    },
  },
  {
    id: 'segment/post-dispatch-counter-not-reset-by-a-later-dispatch',
    find: '            cur.charsAfterLastDispatch = 0;',
    replace: '            /* reset removed */;',
    probe: (m) => m.segmentTurns(fixtureRows())[1].charsAfterLastDispatch !== 10,
  },
  {
    id: 'segment/tool-errors-not-attributed',
    find: '        if (c.type === \'tool_result\' && c.is_error) {',
    replace: '        if (c.type === \'tool_result\' && false) {',
    probe: (m) => m.segmentTurns(fixtureRows())[0].failed_tools !== 1,
  },
  {
    id: 'classify/threshold-becomes-inclusive',
    find: '  const violations = d.filter((t) => t.charsAfterLastDispatch > threshold);',
    replace: '  const violations = d.filter((t) => t.charsAfterLastDispatch >= threshold);',
    probe: (m) => m.classifyDispatchTurns(m.segmentTurns(fixtureRows()), 10).violations !== 0,
  },

  // ── arm assignment ────────────────────────────────────────────────────────────────────────────
  {
    id: 'arm/always-on',
    find: "  return (h[0] & 1) ? 'on' : 'off';",
    replace: "  return 'on';",
    probe: (m) => {
      let on = 0; const N = 2000;
      for (let i = 0; i < N; i++) if (m.armFor('id-' + i, 1) === 'on') on++;
      return Math.abs(on / N - 0.5) >= 0.02;
    },
  },
  {
    id: 'arm/seed-ignored',
    find: "  const h = crypto.createHmac('sha256', String(seed)).update(String(promptId)).digest();",
    replace: "  const h = crypto.createHash('sha256').update(String(promptId)).digest();",
    probe: (m) => {
      let moved = 0;
      for (let i = 0; i < 200; i++) if (m.armFor('id-' + i, 1) !== m.armFor('id-' + i, 2)) moved++;
      return moved <= 50;
    },
  },
  {
    id: 'arm/nondeterministic',
    find: "function armFor(promptId, seed) {",
    replace: "function armFor(promptId, seed) {\n  if (Math.random() < 0.5) return 'on'; else return 'off';",
    probe: (m) => {
      for (let i = 0; i < 50; i++) if (m.armFor('abc', 1) !== m.armFor('abc', 1)) return true;
      return false;
    },
  },
];

let applied = 0, caught = 0, notApplied = 0, brokenProbe = 0, equivalent = 0;
const survivors = [], skipped = [], broken = [], equivalents = [];

for (const mut of MUTANTS) {
  let baseline;
  try { baseline = mut.probe(B); } catch (e) { baseline = 'threw: ' + e.message; }
  if (baseline !== false) {
    brokenProbe++; broken.push(mut.id + '  (baseline returned ' + JSON.stringify(baseline) + ')');
    continue;
  }
  const m = loadMutant(mut.id, mut.find, mut.replace);
  if (!m.applied) { notApplied++; skipped.push(mut.id + '  (' + m.why + ')'); continue; }
  applied++;
  let got;
  if (!m.module) got = true;
  else { try { got = mut.probe(m.module); } catch (e) { got = true; } }
  if (got) { caught++; console.log('  killed     ' + mut.id); continue; }
  if (mut.equivalent) {
    let worst = null, ok = true;
    try { worst = mut.equivalent.verify(); }
    catch (e) { ok = false; broken.push(mut.id + ' equivalence proof FAILED: ' + e.message); }
    if (ok) {
      equivalent++;
      equivalents.push(mut.id + '  (' + mut.equivalent.reason + '; re-measured ' + worst + ')');
      console.log('  EQUIVALENT ' + mut.id);
      continue;
    }
  }
  survivors.push(mut.id); console.log('  SURVIVED   ' + mut.id);
}

console.log('\nMUTATION: applied ' + applied + ' / caught ' + caught + ' / NOT APPLIED ' + notApplied +
            ' / EQUIVALENT ' + equivalent + (brokenProbe ? ' / BROKEN PROBE ' + brokenProbe : ''));
if (skipped.length) {
  console.log('  NOT APPLIED (these prove NOTHING about the guard they were aimed at):');
  for (const s of skipped) console.log('    ' + s);
}
if (broken.length) {
  console.log('  BROKEN PROBE (fired on healthy code, so its catch would be meaningless):');
  for (const s of broken) console.log('    ' + s);
}
if (survivors.length) {
  console.log('  SURVIVED — the construct was broken and nothing noticed:');
  for (const s of survivors) console.log('    ' + s);
}

test('every mutant that was applied was caught or proved equivalent', () => {
  assert.strictEqual(survivors.length, 0, 'survivors: ' + survivors.join(', '));
});
test('no mutant was skipped — a NOT APPLIED mutant is not evidence of anything', () => {
  assert.strictEqual(notApplied, 0, 'not applied: ' + skipped.join(', '));
});
test('no probe fired on healthy code', () => {
  assert.strictEqual(brokenProbe, 0, 'broken probes: ' + broken.join(', '));
});
test('the mutation buckets sum to the mutant roster', () => {
  assert.strictEqual(caught + equivalent + survivors.length + notApplied + brokenProbe, MUTANTS.length);
});
test('the power gate is not decorative — breaking it turns something red', () => {
  const g = MUTANTS.filter((x) => x.id.startsWith('power/')).map((x) => x.id);
  assert.ok(g.length >= 5, 'fewer than five power mutants exist');
  for (const id of g) {
    assert.ok(!survivors.includes(id) && !skipped.some((s) => s.startsWith(id)),
      'the power mutant ' + id + ' turned nothing red, so the gate is decorative');
  }
});

console.log(`\n${pass} passed, ${fail} failed`);
try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (_) {}
process.exit(fail ? 1 : 0);
