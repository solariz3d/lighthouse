// clampprobe.js <tree> <mutantTree>: every case of extend() with an e/er target over a grid of heads, lengths, transitions and targets, on the tree and on the copy
// whose clamp is removed (KE2-6); a case COUNTS when the two disagree: a different outcome (accepted vs refused) or an e/er control point that differs by > 1e-9.
'use strict';
require('os').setPriority(require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const [T, M] = process.argv.slice(2);
const load = (t) => ({ D: require(t + '/src/core/document.js'), X: require(t + '/src/core/extend.js') });
const A = load(T), B = load(M);
const heads = [];
const mk = (name, f) => heads.push({ name, make: (L) => f(L) });
mk('empty bowl', (L) => L.D.createDoc('e'));
mk('legacy bowl 100', (L) => L.X.extend(L.D.createDoc('l'), { length: 100, family: 'bowl' }));
mk('legacy flat 100', (L) => L.X.extend(L.D.createDoc('l'), { length: 100, family: 'flat' }));
for (const c of [0, 30, 60, 90, 120, 149, 150]) mk(`cup ${c}`, (L) => L.X.extend(L.X.extend(L.D.createDoc('c'), { length: 100 }), { length: 120, targets: { c } }));
for (const t of [40, 120, 180, 300, 360]) mk(`tube ${t}`, (L) => L.X.extend(L.X.extend(L.D.createDoc('t'), { length: 100 }), { length: 120, targets: { t } }));
for (const e0 of [10, 40, -20]) mk(`edge held ${e0}`, (L) => L.X.extend(L.X.extend(L.D.createDoc('h'), { length: 100 }), { length: 120, targets: { e: e0 } }));
for (const e0 of [10, 40]) mk(`cup 60 + edge ${e0}`, (L) => L.X.extend(L.X.extend(L.X.extend(L.D.createDoc('h'), { length: 100 }), { length: 120, targets: { c: 60 } }), { length: 120, targets: { e: e0 } }));
// a live tail: the previous piece's edge still rising (or falling) at its end, as a file from before D459 or a closed lap's closer can hold
for (const [e0, slope] of [[10, 0.5], [40, 0.5], [40, -0.5], [10, 2], [-10, -0.5]]) mk(`live tail e ${e0} slope ${slope}`, (L) => {
  let d = L.X.extend(L.X.extend(L.D.createDoc('h'), { length: 100 }), { length: 120, targets: { e: e0 } });
  const j = JSON.parse(JSON.stringify(d)), P = j.pieces[1], n = P.channels.e.length, h = P.length - P.knots[P.knots.length - 1];
  P.channels.e[n - 2] = +(e0 - (slope * h) / 3).toFixed(6); P.channels.er[n - 2] = P.channels.e[n - 2];
  return L.D.checkDoc(j);
});
const lengths = [8, 12, 20, 30, 50, 100, 200];
const trans = (L) => [undefined, 4, 10, L / 2, L, { e: 'start' }, { e: 4 }, { er: 'start' }].filter((t) => typeof t !== 'number' || t <= L);
const targetsFor = (cap) => [0, 0.5, 5, 30, 60, 120, 150, -1, -10, -29.99, -30, cap, cap - 0.01, cap - 1];
let total = 0, differ = [];
const capAt = (L, d) => { const P = d.pieces[d.pieces.length - 1]; if (!P) return 150 - L.D.legacyEdgeDeg('bowl', 10, 0.5); const E = L.D.pieceEnd(P); return P.tube ? 180 - E.t.v / 2 : P.cup ? 150 - E.c.v : 150 - L.D.legacyEdgeDeg(P.family, E.w.v, E.r.v); };
const run = (L, d, o) => { try { const r = L.X.extend(d, o); const P = r.pieces[r.pieces.length - 1]; return { ok: true, e: P.channels.e, er: P.channels.er }; } catch (e) { return { ok: false, code: e.code, msg: e.message }; } };
for (const H of heads) { process.stderr.write(H.name + " " + total + " " + differ.length + String.fromCharCode(10));
  const dA = H.make(A), dB = H.make(B); const cap = capAt(A, dA);
  for (const length of lengths) for (const transition of trans(length)) for (const side of ['e', 'er', 'both']) for (const tv of targetsFor(cap)) {
    if (!Number.isFinite(tv)) continue;
    const targets = side === 'both' ? { e: tv, er: tv } : { [side]: tv };
    const o = { length, transition, targets };
    const a = run(A, dA, o), b = run(B, dB, o); total++;
    let why = null, max = 0;
    if (a.ok !== b.ok) why = `outcome tree ${a.ok ? 'accepted' : a.code} / mutant ${b.ok ? 'accepted' : b.code}`;
    else if (a.ok) { for (const ch of ['e', 'er']) a[ch].forEach((v, i) => { max = Math.max(max, Math.abs(v - b[ch][i])); }); if (max > 1e-9) why = `control points differ by ${max.toExponential(2)}`; }
    if (why) differ.push({ head: H.name, length, transition: JSON.stringify(transition), targets: JSON.stringify(targets), why, max, treeCode: a.ok ? 'ok' : a.code, mutCode: b.ok ? 'ok' : b.code, msg: (b.msg || a.msg || '').slice(0, 120) });
  }
}
console.log(`cases ${total}, where the clamp matters ${differ.length}`);
const byHead = {}; for (const x of differ) byHead[x.head] = (byHead[x.head] || 0) + 1; console.log('by head:', JSON.stringify(byHead));
const byT = {}; for (const x of differ) byT[x.transition] = (byT[x.transition] || 0) + 1; console.log('by transition:', JSON.stringify(byT));
const byO = {}; for (const x of differ) { const k = `${x.treeCode}/${x.mutCode}`; byO[k] = (byO[k] || 0) + 1; } console.log('tree/mutant outcome:', JSON.stringify(byO));
differ.sort((p, q) => q.max - p.max);
for (const x of differ.slice(0, 40)) console.log(`${x.head} | L ${x.length} | T ${x.transition} | ${x.targets} | ${x.why} | ${x.msg}`);
require('fs').writeFileSync(process.argv[4] || 'clampprobe.json', JSON.stringify(differ, null, 1));
