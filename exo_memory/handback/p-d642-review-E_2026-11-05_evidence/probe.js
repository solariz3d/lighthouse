// usage: node probe.js <t180 tree>   D642 review, three probes of B's re-laid-tail ghost (app/preview/trackmodel.js ghostSteps), all through the real core shell and model:
//  A. which segment fields of the LAST placed piece a next piece's candidate changes, over a spread of last pieces and next pieces (the shell's own candidate makers)
//  B. what the new guard (segments differ only inside the last placed piece, by segment id) takes: a true route change there (k, kp), a width change (profile), a roll change
//  C. the cost: ghostFor on a long track, the next piece after a rolling end (the new branch: the whole path built afresh) against after a piece at rest (copy-and-extend)
'use strict';
const path = require('path'), R = path.resolve(process.argv[2]);
const { createCoreShell } = require(path.join(R, 'app/core/coreshell.js')), { createTrackModel } = require(path.join(R, 'app/preview/trackmodel.js'));
const DEG = Math.PI / 180;
const modelOf = (r) => { const tm = createTrackModel(); tm.update({ segments: r.segments, closed: !!r.closed, start: r.start }); return tm; };
async function placed(pieces) { const s = await createCoreShell({ brushFn: null, autosaveMs: 0 }); for (const o of pieces) s.extend({ family: 'bowl', ...o }); return s; }
const FIELDS = ['length', 'k0', 'k1', 'kp0', 'kp1', 'roll0', 'roll1', 'rollRate0', 'rollRate1', 'heartline', 'profile', 'blend', 'speed', 'kind', 'part'];
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
(async () => {
  const out = { A: [], B: [], C: [] };
  // A
  const LAST = {
    'rounded bank 88.45 over 1,000 (his)': { length: 1000, targets: { phi: 88.45 * DEG }, bankShape: 'rounded' },
    'bank -90 over 250 (corkscrew)': { length: 250, targets: { phi: -90 * DEG } },
    'turn rate 30°/100m + bank 40 rounded': { length: 600, targets: { kh: 30 * DEG / 100, phi: 40 * DEG }, bankShape: 'rounded' },
    'climb 4°/100m + cup 20 + width 40': { length: 500, targets: { kv: 4 * DEG / 100, c: 20, w: 40 } },
    'bank 30 at rest': { length: 1000, targets: { phi: 30 * DEG } },
  };
  const NEXT = {
    'straight 100': (s) => s.candidate({ length: 100 }),
    'bank -180 over 250': (s) => s.candidate({ length: 250, targets: { phi: -180 * DEG } }),
    'turn rate -20, bank 0': (s) => s.candidate({ length: 400, targets: { kh: -20 * DEG / 100, phi: 0 } }),
    'corner +90': (s) => (s.candidateCorner ? s.candidateCorner({ length: 400, turnDeg: 90 }) : s.candidate({ length: 400, turnDeg: 90 })),
    'width 20, cup 0': (s) => s.candidate({ length: 300, targets: { w: 20, c: 0 } }),
    'jump': (s) => (s.candidateJump ? s.candidateJump({ length: 100 }) : null),
  };
  for (const [ln, lo] of Object.entries(LAST)) for (const [nn, mk] of Object.entries(NEXT)) {
    const s = await placed([{ length: 1000 }, lo]), st = s.getState(), P = st.resolved.segments; let c; try { c = mk(s); } catch (e) { out.A.push({ last: ln, next: nn, error: String(e.message).slice(0, 120) }); continue; }
    if (!c) { out.A.push({ last: ln, next: nn, error: 'no maker' }); continue; }
    const lastId = P[P.length - 1].id, diff = new Set(); let nseg = 0, routeMax = 0;
    for (let j = 0; j < P.length; j++) { const a = P[j], b = c.segments[j]; if (same(a, b)) continue; nseg++; if (a.id !== lastId) diff.add('A PIECE BEFORE THE LAST'); for (const f of FIELDS) if (!same(a[f], b[f])) { diff.add(f); if (/^k/.test(f)) routeMax = Math.max(routeMax, Math.abs(a[f] - b[f])); } }
    let ghost = null; try { const g = modelOf(st.resolved).ghostFor(c); ghost = g.relaid === undefined ? 'copy-and-extend' : `re-laid from ${g.relaid} of ${P.length}`; } catch (e) { ghost = 'REFUSED: ' + String(e.message).slice(0, 60); }
    out.A.push({ last: ln, next: nn, placedSegsChanged: nseg, fieldsChanged: [...diff], routeMax, ghost });
  }
  // B: the guard against a true change inside the last placed piece
  { const s = await placed([{ length: 1000 }, LAST['rounded bank 88.45 over 1,000 (his)']]), st = s.getState(), c = s.candidate({ length: 100 }), n = st.resolved.segments.length;
    const tamper = (f, fn) => ({ ...c, segments: c.segments.map((g, j) => (j === n - 3 ? { ...g, ...fn(g) } : g)) });
    for (const [what, cand] of [
      ['the true candidate', c],
      ['its last placed piece turns 1e-3 rad/m more on one segment (a route change)', tamper('k1', (g) => ({ k0: g.k0 + 1e-3, k1: g.k1 + 1e-3 }))],
      ['its last placed piece climbs 1e-3 rad/m more on one segment', tamper('kp1', (g) => ({ kp0: g.kp0 + 1e-3, kp1: g.kp1 + 1e-3 }))],
      ['its last placed piece 10 m longer on one segment', tamper('length', (g) => ({ length: g.length + 10 }))],
      ['its last placed piece rolled 0.5 rad more on one segment', tamper('roll1', (g) => ({ roll0: g.roll0 + 0.5, roll1: g.roll1 + 0.5 }))],
    ]) { let r; try { const g = modelOf(st.resolved).ghostFor(cand); r = g.relaid === undefined ? 'accepted, copy-and-extend' : `ACCEPTED as re-laid from ${g.relaid}`; } catch (e) { r = 'refused: ' + String(e.message).slice(0, 60); } out.B.push({ what, result: r }); } }
  // C: the cost on a long track (40 pieces of 500 m, alternating turns), the last one rolling or at rest; ghostFor of the next 100 m, coarse and full, median of 7
  for (const lastShape of ['rolling (rounded 88.45 over 1,000)', 'at rest (bank 30 over 1,000)']) {
    const pcs = [{ length: 1000 }]; for (let i = 0; i < 40; i++) pcs.push({ length: 500, targets: { kh: (i % 2 ? -1 : 1) * 20 * DEG / 100 } });
    pcs.push(lastShape.startsWith('rolling') ? LAST['rounded bank 88.45 over 1,000 (his)'] : { length: 1000, targets: { phi: 30 * DEG } });
    const s = await placed(pcs), st = s.getState(), tm = modelOf(st.resolved), rows = {};
    for (const coarse of [true, false]) { const ts = []; let rel; for (let i = 0; i < 7; i++) { const c = s.candidate({ length: 100 + i }, coarse ? { coarse: true } : undefined), t0 = process.hrtime.bigint(); const g = tm.ghostFor(c); ts.push(Number(process.hrtime.bigint() - t0) / 1e6); rel = g.relaid; } ts.sort((a, b) => a - b); rows[coarse ? 'coarse (a drag)' : 'full'] = { medianMs: +ts[3].toFixed(1), maxMs: +ts[6].toFixed(1), relaid: rel }; }
    out.C.push({ last: lastShape, km: +(st.resolved.segments.reduce((a, g) => a + g.length, 0) / 1000).toFixed(1), ...rows });
  }
  console.log(JSON.stringify(out, null, 1));
})().catch((e) => { console.error(e && e.stack || e); process.exit(1); });
