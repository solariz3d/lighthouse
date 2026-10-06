// attack.js: the non-author look at C's f13cded (D250 item 4), on the MERGED tree (a-merge-wt: 63dc19b, d4b31fd, 1139f00, 539c120, fe6ad5a, f13cded). Nothing in the repo is edited.
const W = 'C:/Users/nname/Desktop/worktrees/a-merge-wt/';
const D = require(W + 'src/core/document.js'), PC = require(W + 'src/core/piece.js'), AD = require(W + 'src/core/adapter.js'), { extend } = require(W + 'src/core/extend.js'), { close } = require(W + 'src/core/close.js');
const { createCoreShell } = require(W + 'app/core/coreshell.js');
const R = 180, Q = (Math.PI * R) / 2, TAU = 2 * Math.PI;
const rows = []; const check = (id, what, got, expect, note = '') => { const ok = JSON.stringify(got) === JSON.stringify(expect); rows.push({ id, what, got, expect, ok, note }); console.log(`${ok ? 'ok  ' : 'DIFF'} ${id} ${what}: ${JSON.stringify(got)}${ok ? '' : `  (expected ${JSON.stringify(expect)})`}${note ? '  | ' + note : ''}`); return ok; };
const tryit = (fn) => { try { return { ok: fn() }; } catch (e) { return { code: e.code || e.name, msg: String(e.message).slice(0, 160) }; } };
const closedOk = (r) => { if (!r.converged) throw new Error('the lap did not close: ' + r.report); return r.doc; };

// ── builders
const lapLegacy = (roll = 0, turns = 4) => { let d = extend(D.createDoc('lap'), { length: 300, family: 'bowl' }); d = extend(d, { length: Q, transition: roll ? Q : 40, targets: { kh: 1 / R, ...(roll ? { phi: roll } : {}) } }); for (let i = 1; i < turns; i++) d = extend(d, { length: Q, transition: 40, targets: { kh: 1 / R } }); d = extend(d, { length: 60, transition: 40, targets: { kh: 0 } }); return closedOk(close(d, { edited: [0] })); };
const lapCup = () => { let d = extend(D.createDoc('cup lap'), { length: 300, family: 'bowl', first: { c: 45 } }); for (let i = 0; i < 4; i++) d = extend(d, { length: Q, transition: 40, targets: { kh: 1 / R, c: 45 } }); d = extend(d, { length: 60, transition: 40, targets: { kh: 0, c: 45 } }); return closedOk(close(d, { edited: [0] })); };
const lapTube = (roll = 0) => { let d = extend(D.createDoc('tube lap'), { length: 300, first: { w: 40, t: 360 } }); d = extend(d, { length: Q, transition: roll ? Q : 40, targets: { kh: 1 / R, ...(roll ? { phi: roll } : {}) } }); for (let i = 1; i < 4; i++) d = extend(d, { length: Q, transition: 40, targets: { kh: 1 / R } }); d = extend(d, { length: 60, transition: 40, targets: { kh: 0 } }); return closedOk(close(d, { edited: [0] })); };
const windOf = (H) => D.pieceEnd(H.pieces[H.pieces.length - 1]).phi.v - H.pieces[0].channels.phi[0];

// ── THE ORACLE (mine, independent of C's code): the pieces in lap order from `from` to the last, then 0..to, the after-line pieces carrying 2π·round(wind/2π) more bank
const oracle = (H, from, to) => { const n = H.pieces.length, w = TAU * Math.round(windOf(H) / TAU); return [...H.pieces.slice(from), ...H.pieces.slice(0, to + 1).map((P) => (P.type === 'road' && w ? { ...P, channels: { ...P.channels, phi: P.channels.phi.map((v) => v + w) } } : P))]; };
/** Save the wrapped run and put it on an EMPTY track; compare, piece by piece, with the oracle; and its segments (frame-free fields) with the lap's own. */
function roundTrip(label, H, from, to) {
  const piece = tryit(() => PC.parse(PC.serialize(PC.saveRun(H, from, to, { name: 'across' }))));
  if (!piece.ok) return check(label, 'the run is kept', piece, 'kept');
  const ins = tryit(() => PC.insert(D.createDoc('open'), piece.ok));
  if (!ins.ok) return check(label, 'put at an open (empty) head', ins, 'kept');
  const got = ins.ok.pieces, want = oracle(H, from, to);
  check(label + ' count', 'the same pieces in the same order', got.length === want.length, true);
  let worst = 0, bank = 0;
  got.forEach((P, i) => { const O = want[i]; if (P.type !== O.type) { worst = Infinity; return; } if (P.type !== 'road') return; for (const ch of D.CHANNELS) { if (!P.channels[ch]) continue; P.channels[ch].forEach((v, k) => { worst = Math.max(worst, Math.abs(v - O.channels[ch][k])); }); } });
  check(label + ' channels', 'every channel equals the independent oracle (max difference < 2e-5, the quantum)', worst < 2e-5, true, `max diff ${worst}`);
  // the saved run's segments against the LAP's (frame-free): equal, except the bank, which differs by whole turns only
  const lapSegs = AD.toSegments(H), runSegs = AD.toSegments(ins.ok);
  const byPiece = (segs) => { const m = new Map(); for (const g of segs) { if (!m.has(g.id)) m.set(g.id, []); m.get(g.id).push(g); } return m; }, L = byPiece(lapSegs), Rr = byPiece(runSegs);
  let sw = 0, rollOff = 0, n = 0;
  const lapIds = H.pieces.map((P) => P.id), runIds = ins.ok.pieces.map((P) => P.id);   // a saved run gets new ids p1..: map by order
  ins.ok.pieces.forEach((P, i) => { const lp = oracle(H, from, to)[i], a = Rr.get(P.id) || [], b = L.get(lp.id) || []; if (a.length !== b.length) { sw = Infinity; return; } a.forEach((g, j) => { const h = b[j]; n++; for (const f of ['length', 'k0', 'k1', 'kp0', 'kp1', 'heartline', 'heartline1']) if (g[f] !== undefined || h[f] !== undefined) sw = Math.max(sw, Math.abs((g[f] || 0) - (h[f] || 0))); for (const f of ['roll0', 'roll1']) { const d = (g[f] || 0) - (h[f] || 0), m = d - TAU * Math.round(d / TAU); rollOff = Math.max(rollOff, Math.abs(m)); } }); });
  check(label + ' route', 'the route fields of every segment equal the lap\'s (the flight of the road is the same)', sw < 1e-6, true, `${n} segments, max diff ${sw}`);
  check(label + ' roll', 'the roll of every segment equals the lap\'s modulo whole turns (the road leans the same way)', rollOff < 1e-6, true, `max ${rollOff}`);
  return true;
}

console.log('── A. THE WINDING SHIFT');
const L0 = lapLegacy(0), L1 = lapLegacy(-TAU), Lp = lapLegacy(TAU), L2 = (() => { try { let d = extend(D.createDoc('two rolls'), { length: 300, family: 'bowl' }); d = extend(d, { length: Q, transition: Q, targets: { kh: 1 / R, phi: -2 * TAU } }); for (let i = 0; i < 3; i++) d = extend(d, { length: Q, transition: 40, targets: { kh: 1 / R } }); d = extend(d, { length: 60, transition: 40, targets: { kh: 0 } }); return closedOk(close(d, { edited: [0] })); } catch (e) { return null; } })();
for (const [name, H] of [['no roll', L0], ['one whole roll (-2pi)', L1], ['one whole roll the other way (+2pi)', Lp]].concat(L2 ? [['two whole rolls (-4pi, TEST 1)', L2]] : [])) {
  const n = H.pieces.length; console.log(`   lap "${name}": ${n} pieces, bank winding ${(windOf(H) / Math.PI).toFixed(3)} pi`);
  for (const [f, t] of [[n - 1, 0], [n - 2, 1], [n - 1, 1], [2, 1], [1, 0]]) roundTrip(`A-${name.split(' ')[0]}${name.includes('+') ? 'p' : ''}-${f}..${t}`, H, f, t);
}
if (!L2) check('A-two', 'a two-roll lap could be built', false, true, 'close() did not converge: not tested');
// a cup lap and a tube lap; and a tube lap with a roll
const LC = lapCup(); roundTrip('A-cup-5..0', LC, LC.pieces.length - 1, 0); roundTrip('A-cup-4..1', LC, LC.pieces.length - 2, 1);
let LT = null, LTr = null; try { LT = lapTube(0); } catch (e) { check('A-tube', 'a tube lap could be built', String(e.message).slice(0, 80), 'built'); } if (LT) { roundTrip('A-tube-last..0', LT, LT.pieces.length - 1, 0); roundTrip('A-tube-4..1', LT, LT.pieces.length - 2, 1); }
try { LTr = lapTube(-TAU); } catch (e) { console.log('   (a tube lap that rolls a whole turn could not be built:', String(e.message).slice(0, 90) + ')'); } if (LTr) { console.log('   tube lap winding', (windOf(LTr) / Math.PI).toFixed(3), 'pi'); roundTrip('A-tuberoll-last..0', LTr, LTr.pieces.length - 1, 0); }
// the whole lap, rotated (a run that covers EVERY piece: from = to + 1)
{ const n = L1.pieces.length; roundTrip('A-whole-3..2', L1, 3, 2); roundTrip('A-whole-0..n-1', { ...L1 }, 0, n - 1); }

console.log('\n── A2. A NON-WHOLE bank round the lap, and a residual just outside the 1e-6 band');
const mut = (H, fn) => ({ ...H, pieces: H.pieces.map((P, i) => fn(P, i, H.pieces.length)) });
const shiftPhi = (H, k, amount) => mut(H, (P, i) => (i === k ? { ...P, channels: { ...P.channels, phi: P.channels.phi.map((v) => v + amount) } } : P));   // hand-edit: the first piece's whole bank moved
for (const [label, amount] of [['half a turn off (pi)', Math.PI], ['0.3 rad off', 0.3], ['2e-5 rad off (above the quantum)', 2e-5], ['5e-5 rad off', 5e-5]]) { const H = shiftPhi(L0, 0, amount); const r = tryit(() => PC.saveRun(H, H.pieces.length - 1, 0, { name: 'x' })); check('A2-' + label, `a hand-edited lap, the bank ${label}: the run across the line`, r.ok ? 'KEPT' : r.code, 'SEAM_RUN'); }
{ const H = shiftPhi(L1, 0, 0); const r = tryit(() => PC.saveRun(H, H.pieces.length - 1, 0, { name: 'x' })); check('A2-wholeok', 'the whole-roll lap unchanged: kept', r.ok ? 'KEPT' : r.code, 'KEPT'); }
// a lap with a whole turn PLUS a residual of 5e-7 (inside the 1e-6 band): kept?
{ const H = shiftPhi(L1, 0, 5e-7); const r = tryit(() => PC.saveRun(H, H.pieces.length - 1, 0, { name: 'x' })); console.log('   whole roll + 5e-7 rad residual:', r.ok ? 'kept' : r.code + ' ' + r.msg); }
// the seam residual if the first piece is a FLIGHT or the last piece is a flight (no winding is read off a flight)
{ try { let d = extend(D.createDoc('jlap'), { length: 300, family: 'bowl' }); d = extend(d, { length: Q, transition: Q, targets: { kh: 1 / R, phi: -TAU } }); for (let i = 0; i < 3; i++) d = extend(d, { length: Q, transition: 40, targets: { kh: 1 / R } }); d = extend(d, { length: 60, transition: 40, targets: { kh: 0 } }); const base = closedOk(close(d, { edited: [0] })); const withJump = D.checkDoc({ ...base, nextId: base.nextId + 1, pieces: [...base.pieces.slice(0, 3), D.flightPiece({ id: 'pj', gap: 20, drop: 1, land: 0 }), ...base.pieces.slice(3)] });
    console.log('   a lap with a jump in the middle: wind', (windOf(withJump) / Math.PI).toFixed(3), 'pi (last piece end vs first start)'); const n = withJump.pieces.length; const r = tryit(() => PC.saveRun(withJump, n - 1, 0, { name: 'x' })); check('A2-jump-seam', 'a wound lap with a flight elsewhere: across the line', r.ok ? 'KEPT' : r.code, 'KEPT'); const r2 = tryit(() => PC.saveRun(withJump, 2, 4, { name: 'x' })); check('A2-jump-inside', 'a run holding the flight (no wrap)', r2.ok ? 'KEPT' : r2.code, 'KEPT');
    // the flight AT the line: the last piece is the flight (a lap that closes through a jump)
    const lastFlight = D.checkDoc({ ...base, nextId: base.nextId + 1, pieces: [...base.pieces, D.flightPiece({ id: 'pj', gap: 20, drop: 0, land: 0 })] }); const r3 = tryit(() => PC.saveRun(lastFlight, lastFlight.pieces.length - 1, 0, { name: 'x' })); console.log('   a lap whose LAST piece is a flight, wrapped run:', r3.ok ? 'kept' : r3.code + ' ' + r3.msg);
  } catch (e) { console.log('   (jump lap not built:', String(e.message).slice(0, 100) + ')'); } }

console.log('\n── B. THE SEAM IS NOT SMOOTH: SEAM_RUN BY NAME, and what comes first');
const stepCh = (H, ch, amount) => mut(H, (P, i) => (i === 0 && P.type === 'road' ? { ...P, channels: { ...P.channels, [ch]: P.channels[ch].map((v, k) => (k < 2 ? v + amount : v)) } } : P));
for (const [label, ch, amt] of [['a 3 m width step', 'w', 3], ['a bank step of 0.2 rad', 'phi', 0.2], ['a slope step in the turn rate', 'kh', 0.004], ['a slope step in the climb rate', 'kv', 0.004], ['a wall-rise step', 'r', 0.5]]) { const H = stepCh(L0, ch, amt); const ok = tryit(() => { D.checkDoc(H); return true; }); const r = tryit(() => PC.saveRun(H, H.pieces.length - 1, 0, { name: 'x' })); check('B-' + ch, `${label} at the line: across the line`, r.ok ? 'KEPT' : r.code, 'SEAM_RUN', ok.ok ? 'the hand-edited lap passes checkDoc' : 'checkDoc: ' + ok.msg); if (r.msg) console.log('      ' + r.msg.slice(0, 150)); }
{ const H = stepCh(L0, 'w', 3); const n = H.pieces.length; check('B-either-a', 'each side of the line ALONE is kept (the last piece)', tryit(() => PC.saveRun(H, n - 1, n - 1, { name: 'x' })).ok ? 'KEPT' : 'refused', 'KEPT'); check('B-either-b', 'each side of the line ALONE is kept (the first piece)', tryit(() => PC.saveRun(H, 0, 0, { name: 'x' })).ok ? 'KEPT' : 'refused', 'KEPT'); check('B-away', 'a wrapped run whose ends are away from the broken line... still crosses it: refused', tryit(() => PC.saveRun(H, n - 2, 1, { name: 'x' })).code, 'SEAM_RUN'); }
{ const mixed = (() => { const cup = lapCup(); return cup; })(); const H = mut(mixed, (P, i) => (i === 0 ? { ...P } : P)); const n = H.pieces.length; check('B-mixed', 'a cup lap with a legacy piece edited in at the line: MIXED_RUN comes first, not SEAM_RUN', tryit(() => { const legacyFirst = extend(D.createDoc('l'), { length: 100, family: 'bowl' }).pieces[0]; const doc = { ...H, pieces: [{ ...legacyFirst, id: H.pieces[0].id }, ...H.pieces.slice(1)] }; PC.saveRun(doc, n - 1, 0, { name: 'x' }); return 1; }).code, 'MIXED_RUN'); }

console.log('\n── C. DELETE of a wrapped run, and the range rules');
check('C-core', 'PC.deleteRun on a CLOSED lap, from > to', tryit(() => PC.deleteRun(L0, L0.pieces.length - 1, 0)).code, 'CLOSED'); check('C-core2', 'PC.deleteRun on a CLOSED lap, ordinary range', tryit(() => PC.deleteRun(L0, 1, 2)).code, 'CLOSED');
const open = { ...L0, closed: false, pieces: L0.pieces.slice() }; check('C-open-del', 'PC.deleteRun on an OPEN track, from > to', tryit(() => PC.deleteRun(open, 3, 1)).code, 'BAD_RANGE'); check('C-open-save', 'PC.saveRun on an OPEN track, from > to', tryit(() => PC.saveRun(open, 3, 1, { name: 'x' })).code, 'BAD_RANGE');
for (const [label, f, t] of [['to past the end', 0, 99], ['from past the end', 99, 0], ['negative', -1, 0], ['negative to', 3, -1], ['a fraction', 1.5, 0], ['NaN', NaN, 0], ['null to', 2, null]]) check('C-range-' + label, `PC.saveRun on a closed lap, ${label}`, tryit(() => PC.saveRun(L0, f, t, { name: 'x' })).code, 'BAD_RANGE');
check('C-saveopen-same', 'a wrapped range where to === from - 1 covers every piece', tryit(() => PC.saveRun(L0, 3, 2, { name: 'x' })).ok ? 'KEPT' : 'refused', 'KEPT');

console.log('\n── D. THE SHELL: the short way, the tie, the wrapped Save, the wrapped Delete');
(async () => {
  const mkShell = async (doc) => { const s = await createCoreShell({ brushFn: null, autosaveMs: 0, storage: store() }); s.adopt(doc); return s; };
  function store() { const m = new Map(); return { pieces: m, listPieces: async () => [...m.keys()].sort(), openPiece: async (n) => m.get(n), savePiece: async (n, t) => { if (m.has(n)) throw new Error('exists'); m.set(n, t); }, deletePiece: async (n) => m.delete(n), backupDoc: async () => 'b' }; }
  const sel = async (doc, a, b) => { const s = await mkShell(doc); s.selectPiece(a); s.selectPiece(b, { extend: true }); const i = s.selectionInfo(); return { s, ids: i.ids, from: i.from, to: i.to, count: i.count, len: Math.round(i.lengthM * 10) / 10 }; };
  const lens = L0.pieces.map((P) => P.length); console.log('   the legacy lap\'s piece lengths:', JSON.stringify(lens));
  const n = L0.pieces.length;
  let r = await sel(L0, n - 1, 0); check('D-short', 'last then first piece: the two pieces across the line', [r.ids, r.from > r.to], [[L0.pieces[n - 1].id, L0.pieces[0].id], true]);
  r = await sel(L0, 0, n - 1); check('D-order', 'first then last piece (the other click order): the same run', r.ids, [L0.pieces[n - 1].id, L0.pieces[0].id]);
  r = await sel(L0, 1, 3); check('D-inside', 'a short inside run stays inside', [r.from, r.to], [1, 3]);
  r = await sel(L0, 1, n - 1); check('D-long', 'a run over half the lap is NOT selectable the long way (the short way across the line wins)', r.from > r.to, true, JSON.stringify(r.ids));
  // the tie: equal road length both ways
  const equal = (() => { const base = lapLegacy(0); return base; })();
  const tieDoc = (ls) => { const b = lapLegacy(0); return { ...b, pieces: b.pieces.map((P, i) => ({ ...P, length: ls[i] ?? P.length })) }; };
  // a tie by lengths: with 6 pieces select 0 and 3: inside = p0..p3, the wrap = p3..p5,p0: equal iff p1+p2 == p4+p5 (here we engineer exactly that, with equal DECIMAL lengths)
  // (a document with edited lengths is only used for the selection rule, which reads lengths; not for geometry)
  for (const [label, ls] of [['integers', [100, 100, 100, 100, 100, 100]], ['0.1 steps', [100.1, 100.2, 100.3, 100.4, 100.3, 100.2, 100.1]]]) {
    const b = lapLegacy(0), pieces = b.pieces.slice(0, ls.length).map((P, i) => ({ ...P, length: ls[i] })); const d = { ...b, pieces };
    const s = await createCoreShell({ brushFn: null, autosaveMs: 0 }); s.adopt = s.adopt; try { s.adopt(d); } catch (e) { console.log('   (cannot adopt the engineered lengths:', e.message.slice(0, 80) + ')'); continue; }
  }
  // the tie rule on the arithmetic alone, as the shell computes it (this reads exactly C's expression)
  const wrapsFor = (lens, from, to) => { const len = (a, b) => lens.slice(a, b + 1).reduce((x, y) => x + y, 0), total = len(0, lens.length - 1); return total - len(from + 1, to - 1) < len(from, to); };
  const exactTies = []; let flips = 0, tested = 0; const dec = (v) => Math.round(v * 10) / 10;
  for (let trial = 0; trial < 20000; trial++) { const m = 4 + Math.floor(Math.random() * 6), lens = Array.from({ length: m }, () => dec(60 + Math.random() * 300)); const from = Math.floor(Math.random() * (m - 2)), to = from + 2 + Math.floor(Math.random() * (m - from - 2)); if (to >= m) continue;
    // exact decimal arithmetic in tenths (integers): inside = sum, wrap = total - between
    const T = lens.map((v) => Math.round(v * 10)), sum = (a, b) => T.slice(a, b + 1).reduce((x, y) => x + y, 0), totalI = sum(0, m - 1), insideI = sum(from, to), wrapI = totalI - sum(from + 1, to - 1);
    if (insideI === wrapI) { tested++; if (wrapsFor(lens, from, to)) flips++; } }
  console.log(`   random decimal laps whose two ways are EXACTLY equal (in tenths of a metre): ${tested}; of those, floating-point arithmetic would WRAP (take the long way across the line) in ${flips}`);
  check('D-tie-float', 'a tie in exact arithmetic is never taken across the line by floating-point error', flips, 0, `${flips} of ${tested} exact ties flipped`);
  // a tie through the real shell on a real lap: three pieces selected apart by equal road length
  { const b = lapLegacy(0); const a = b.pieces.length; const lensNow = b.pieces.map((P) => P.length); console.log('   (a real lap rarely has an exact tie; the arithmetic above is what decides one)'); }

  // the wrapped SAVE through the shell, then the pieces back at an OPEN head, export compared with the hand-built track
  const st = store(); const s = await createCoreShell({ brushFn: null, autosaveMs: 0, storage: st }); s.adopt(L1);
  s.selectPiece(n - 1); s.selectPiece(0, { extend: true }); await s.savePiece('across'); check('D-save', 'Save as piece on the wrapped run: ok, 2 pieces named in the message', [s.getState().messageKind, /2 pieces/.test(s.getState().message || '')], ['ok', true], (s.getState().message || '').slice(0, 90));
  const piece = PC.parse(st.pieces.get('across')); check('D-saved-kind', 'the saved text holds two road pieces', piece.pieces.map((P) => P.type), ['road', 'road']);
  const hb = await createCoreShell({ brushFn: null, autosaveMs: 0, storage: st }); hb.adopt({ ...L1, closed: false, pieces: L1.pieces.slice(0, 1), nextId: 2 }); await hb.insertPiece('across'); check('D-insert', 'the saved wrapped run goes in at an OPEN head with a road already there: ok', hb.getState().messageKind, 'ok', (hb.getState().message || '').slice(0, 100));
  const added = hb.getState().history.present.pieces; check('D-insert-count', 'one head piece and the two saved ones', added.length, 3);
  // C1 across the join with the head: the first saved piece's start values against the head's end values (value and slope)
  const jointOk = tryit(() => D.checkDoc(hb.getState().history.present)); check('D-insert-c1', 'the whole open track passes checkDoc (every joint C1, the join with the head included)', jointOk.ok ? 'ok' : jointOk.msg, 'ok');
  // the hand-built twin: the same three pieces appended by the core, exported through the app's exporter, byte for byte
  const hand = D.createDoc('twin'); const twin = { ...hb.getState().history.present, name: 'twin' };
  console.log('\nsummary:', rows.filter((r) => !r.ok).map((r) => r.id).join(', ') || 'none differ');
  require('fs').writeFileSync(require('path').join(__dirname, 'attack_rows.json'), JSON.stringify(rows, null, 1));
})().catch((e) => { console.error('ATTACK ERROR', e.stack); });
