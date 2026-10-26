'use strict';
// D477 edit 5: rows 3–6 of app/test/core-bank-lap.test.js, the D477 mutants in app/test/core-close-mutation.test.js, the CHANGELOG lines.
const fs = require('fs');
const T = 'C:/Users/nname/Downloads/t180-wt-p477';
function patch(file, pairs) {
  let x = fs.readFileSync(file, 'utf8');
  const crlf = x.includes('\r\n'), nl = (s) => (crlf ? s.replace(/\r?\n/g, '\r\n') : s);
  for (const [from0, to0] of pairs) {
    const from = nl(from0), to = nl(to0), n = x.split(from).length - 1;
    if (n !== 1) throw new Error(`${file}: expected once, found ${n}: ${from0.slice(0, 80)}`);
    x = x.replace(from, to);
  }
  fs.writeFileSync(file, x); console.log(`${file}: ${pairs.length} edits`);
}
// A. the shell rows
patch(`${T}/app/test/core-bank-lap.test.js`, [
  [`//   2  a loop held back by the level rule is named in the status line, and a level curve on the same lap is banked
'use strict';`,
   `//   2  a loop held back by the level rule is named in the status line, and a level curve on the same lap is banked
// D477 (pane P; C's D474 review): a second press changes nothing, the level words by the plan-bank test, a copy of the track first. Rows:
//   3  on a lap shaped like TEST 10 (his own bank into a corner he banked himself, a loop that turns beside the curves the press banks), a second press changes
//      nothing: no undo step, every bank channel as the first press left it, and the status line says so (the first press left two pieces banked under 5°)
//   4  a loop whose stored turn is under 1/600 is named in the status line when the level rule holds it back (the plan would have banked it about 48°)
//   5  the press copies the track to its backups first, as it was; a second press, which changes nothing, writes no second copy
//   6  a copy that cannot be written refuses by name, and nothing changes: no undo step, the lap as it was
// The second press's row on core-bank-lap.test.js row 2's looped lap is C's red row, app/test/core-bank-lap-twice.test.js, as C wrote it.
'use strict';`],
  [`async function shellWith(d) { const s = await createCoreShell({ brushFn: null, autosaveMs: 0 }); s.adopt(d); return s; }
const present = (s) => s.getState().history.present;`,
   `/** TEST 10's shape in public words: his own 30° bank over 100 m into a corner he banked himself and a roll back, a loop that turns (loopDeg over loopM, climbing
 *  360°), then upright corners. \`loopDeg\` 40 over 600 m: the loop's stored turn is over 1/600 and two pieces beside it (p6, p10) are banked under 5° by the first
 *  press (the second re-banked them, +3.8° each, before D477); 25 over 700 m: the loop's stored turn peaks at 1.23e-3, under 1/600. */
function t10Lap(loopM, loopDeg) {
  let d = extend(D.createDoc('t10 shape'), { length: 200, family: 'bowl' });
  d = extend(d, { length: 100, transition: 40, targets: { phi: 30 * DEG } });
  d = extend(d, { length: QQ, transition: 40, targets: { kh: 1 / 300 } });
  d = extend(d, { length: 100, transition: 40, targets: { phi: 0, kh: 0 } });
  d = extendTurnBy(d, { length: loopM, climbDeg: 360 }, loopDeg * DEG);
  d = extend(d, { length: 100 }); d = extendTurnBy(d, { length: QQ }, (140 - loopDeg) * DEG); d = extend(d, { length: 200 });
  d = extendTurnBy(d, { length: QQ }, 90 * DEG); d = extend(d, { length: 100 }); d = extendTurnBy(d, { length: QQ }, 90 * DEG);
  const c = close(d, { edited: [d.pieces.length - 1] }); assert.equal(c.converged, true, c.report);
  return c.doc;
}
/** A storage for the shell, as core-smooth-ramps.test.js has it: the copies it was asked to keep, and whether the copy fails. */
function store({ backupFails = false } = {}) {
  const st = { docs: new Map(), backups: [], log: [] };
  return Object.assign(st, {
    listDocs: async () => [...st.docs.keys()],
    openDoc: async (n) => { if (!st.docs.has(n)) throw new Error(\`not found: \${n}\`); return st.docs.get(n); },
    saveDoc: async (n, t) => { st.log.push('save'); st.docs.set(n, t); },
    backupDoc: async (name, text) => { st.log.push('backup'); if (backupFails) throw new Error('the disk is full'); st.backups.push({ name, text }); return \`\${name}.bak\`; },
  });
}
async function shellWith(d, storage = undefined) { const s = await createCoreShell({ brushFn: null, autosaveMs: 0, ...(storage ? { storage } : {}) }); s.adopt(d); return s; }
const present = (s) => s.getState().history.present;
const ROLL_FREE = 5 * DEG;`],
]);
fs.appendFileSync(`${T}/app/test/core-bank-lap.test.js`, `
test('row 3: on a lap shaped like TEST 10, a second press changes nothing (no undo step, every bank channel as the first press left it, and the status line says so)', async () => {
  const before = t10Lap(600, 40), s = await shellWith(before), up = D.valuesAt(before.pieces[0], 0).phi;
  await s.bankLap();
  const once = present(s), depth = s.getState().history.past.length;
  assert.equal(depth, 1, \`control: the first press banks the lap (\${s.getState().message})\`);
  const under = once.pieces.filter((P, i) => JSON.stringify(P.channels.phi) !== JSON.stringify(before.pieces[i].channels.phi) && P.channels.phi.every((x) => Math.abs(x - up) <= ROLL_FREE)).map((P) => P.id);
  assert.ok(under.length >= 2, \`control: the first press left pieces banked under 5° beside the loop (the ones a second press re-banked): \${under.join(', ') || 'none'}\`);
  await s.bankLap();
  const twice = present(s), moved = twice.pieces.filter((P, i) => JSON.stringify(P.channels.phi) !== JSON.stringify(once.pieces[i].channels.phi)).map((P) => P.id);
  assert.deepEqual(moved, [], \`the second press re-banked \${moved.join(', ')}: \${s.getState().message}\`);
  assert.equal(s.getState().history.past.length, depth, 'no second undo step');
  assert.equal(twice, once, 'the document the first press made, the same object');
  assert.equal(s.getState().message, 'nothing to bank: every curve on this lap already has its bank; nothing changed');
});

test('row 4: a loop whose stored turn is under 1/600 is named in the status line when the level rule holds it back', async () => {
  const before = t10Lap(700, 25), LOOP = before.pieces[4];
  const kmax = Math.max(...LOOP.channels.kh.map(Math.abs));
  assert.ok(kmax < 1 / 600, \`control: the loop's stored turn is under 1/600 (\${kmax.toExponential(3)})\`);
  const s = await shellWith(before);
  await s.bankLap();
  const msg = s.getState().message;
  assert.match(msg, /^banked the lap: /);
  assert.ok(msg.includes(\`no bank on \${LOOP.id}: it climbs or dives too steeply to bank (a loop or a steep ramp)\`), msg);
  assert.deepEqual(present(s).pieces[4].channels.phi, before.pieces[4].channels.phi, 'the loop keeps its bank channel');
});

test('row 5: the press copies the track to its backups first, as it was; a press that changes nothing writes no copy', async () => {
  const before = flatLap(), st = store(), s = await shellWith(before, st);
  await s.bankLap();
  assert.match(s.getState().message, /^banked the lap: /);
  assert.deepEqual(st.backups.map((b) => [b.name, b.text]), [['eq-unsaved', D.serialize(before)]], 'one copy, of the track as it was');
  assert.deepEqual(st.log, ['backup'], 'the copy, and no save');
  await s.bankLap();
  assert.equal(st.backups.length, 1, 'a second press, which changes nothing, writes no copy');
  assert.equal(s.getState().history.past.length, 1);
});

test('row 6: a copy that cannot be written refuses by name, and nothing changes', async () => {
  const before = flatLap(), st = store({ backupFails: true }), s = await shellWith(before, st), past = s.getState().history.past.length;
  await s.bankLap();
  assert.equal(s.getState().message, 'not banked: the copy from before could not be written (the disk is full); nothing changed');
  assert.equal(present(s), before, 'the lap as it was');
  assert.equal(s.getState().history.past.length, past, 'no undo step');
  assert.deepEqual(st.log, ['backup']);
  assert.deepEqual(st.backups, []);
});
`);
console.log('rows 3-6 appended');
// B. the harness: the D477 mutants
patch(`${T}/app/test/core-close-mutation.test.js`, [
  [`FIN = 'test/core_finish.test.js', C2 = 'test/core_joint_c2.test.js';`,
   `FIN = 'test/core_finish.test.js', C2 = 'test/core_joint_c2.test.js', BANK = 'app/test/core-bank-lap.test.js', TWICE = 'app/test/core-bank-lap-twice.test.js';`],
  [`  // D469 (P): the cup at a window's seam: the adapter's tolerance on the unrounded solve, and the cup rows' fallback`,
   `  // D477 (P; C's D474 review): a second Bank the lap changes nothing (finish.js bankPlan \`carried\`, bankLapRun's fixed point), the level words, the copy first
  { id: 'R1 the plan ignores the bank a piece carries (the whole share bank added again)', file: 'src/core/finish.js', from: 'e = carried ? carried.get(p)[i] : 0;', to: 'e = 0;', tests: [TWICE], caughtBy: 'Bank the lap pressed again' },
  { id: 'R2 a piece banked past ROLL_FREE is never found again as the press\\'s own (the second press plans against different pins)', file: 'src/core/finish.js', from: 'let mine = doc.pieces.map((P, p) => p).filter(', to: 'let mine = [].filter(', tests: [TWICE, BANK], caughtBy: 'Bank the lap pressed again' },
  { id: 'R3 the curvature rows are on the total bank, not the added bank (a straight\\'s roll-off tail is taken back)', file: 'src/core/finish.js', from: 'res += w * (x.t - x.e);', to: 'res += w * x.t;', tests: [TWICE, BANK], caughtBy: 'Bank the lap pressed again' },
  { id: 'R4 the farthest candidates are not dropped first (every candidate the plan would change goes at once)', file: 'src/core/finish.js', from: 'mine.filter((p) => most(p) >= top / 2)', to: 'mine.filter((p) => most(p) > BANK_STILL)', tests: [BANK], caughtBy: 'row 3: on a lap shaped like TEST 10' },
  { id: 'R5 the level words name the pieces by their stored turn (curved), not by the plan-bank test', file: 'src/core/finish.js', from: 'info.level = flat.filter((p) => planned(p) && !level(doc.pieces[p]))', to: 'info.level = flat.filter((p) => curved(p) && !level(doc.pieces[p]))', tests: [BANK], caughtBy: 'row 4: a loop whose stored turn is under 1/600' },
  { id: 'R6 the press writes no copy from before the bank', file: 'app/core/coreshell.js', from: "try { await api.backupNow('pre-bank'); }", to: 'try { }', tests: [BANK], caughtBy: 'row 5: the press copies the track' },
  { id: 'R7 a failed copy still banks', file: 'app/core/coreshell.js', from: 'catch (e) { return set({ message: \`not banked: the copy from before could not be written', to: 'catch (e) { set({ message: \`not banked: the copy from before could not be written', tests: [BANK], caughtBy: 'row 6: a copy that cannot be written' },
  // D469 (P): the cup at a window's seam: the adapter's tolerance on the unrounded solve, and the cup rows' fallback`],
]);
// C. the CHANGELOG, in user words
patch(`${T}/CHANGELOG.md`, [
  [`The status line says which pieces it banked and how far, and names any piece it held back: a loop or a steep ramp (too steep to bank), a piece that would lean out of its turn, or a place where the turn changes direction faster than the road can roll.
`,
   `The status line says which pieces it banked and how far, and names any piece it held back: a loop or a steep ramp (too steep to bank), a piece that would lean out of its turn, or a place where the turn changes direction faster than the road can roll.

### Fixed
- **Bank the lap pressed again leaves the lap as the first press made it.** A second press used to add a little more bank to a piece the first press had banked by only a few degrees (a run-out next to a loop, for one), and each press added an undo step. A lap that already carries its bank is now read as banked: the status line says "nothing to bank: every curve on this lap already has its bank; nothing changed", and nothing is added to the undo history.
- **Bank the lap names every loop it leaves flat.** On a lap with a loop whose turn is gentle, the status line left that loop out of "no bank on …: it climbs or dives too steeply to bank". It now names every piece the loop rule holds back that would otherwise have been banked.
- **Bank the lap keeps a copy of the track from before.** As Smooth ramps does, it writes the track as it was to the app's track-backups folder before it changes anything, so the lap before the bank is there after the session's undo history is gone. If that copy cannot be written, the lap is not banked and the message says so.
`],
]);
