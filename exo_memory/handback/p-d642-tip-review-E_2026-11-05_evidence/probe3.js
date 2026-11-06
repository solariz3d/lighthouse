// usage: node probe3.js <t180 tree>   D642 review of a924f1b: B's tightened guard (app/preview/trackmodel.js ghostSteps, roll fields only)
//  B2. his rolling piece's true next-100 m candidate, then ONE segment of the last placed piece tampered, field by field (every field a segment carries); the four roll
//      fields alone, and a roll change on the piece BEFORE the last
//  A2. every real next piece of the spread still gets its ghost (the shell's own candidate makers; the corner as the panel sends it; the jump)
'use strict';
const path = require('path'), R = path.resolve(process.argv[2]);
const { createCoreShell } = require(path.join(R, 'app/core/coreshell.js')), { createTrackModel } = require(path.join(R, 'app/preview/trackmodel.js'));
const DEG = Math.PI / 180;
const modelOf = (r) => { const tm = createTrackModel(); tm.update({ segments: r.segments, closed: !!r.closed, start: r.start }); return tm; };
async function placed(pieces) { const s = await createCoreShell({ brushFn: null, autosaveMs: 0 }); for (const o of pieces) s.extend({ family: 'bowl', ...o }); return s; }
const HIS = { length: 1000, targets: { phi: 88.45 * DEG }, bankShape: 'rounded' };
const tryGhost = (st, c) => { try { const g = modelOf(st.resolved).ghostFor(c); return g.relaid === undefined ? 'accepted, copy-and-extend' : `accepted, re-laid from ${g.relaid}`; } catch (e) { return `REFUSED: ${String(e.message).slice(0, 70)}`; } };
(async () => {
  const out = { B2: [], A2: [] };
  { const s = await placed([{ length: 1000 }, HIS]), st = s.getState(), c = s.candidate({ length: 100 }), n = st.resolved.segments.length, j0 = n - 3;
    const seg = c.segments[j0]; out.segmentFields = Object.keys(seg);
    const tamper = (j, patch) => ({ ...c, segments: c.segments.map((g, k) => (k === j ? { ...g, ...patch } : g)) });
    const bump = (v) => (typeof v === 'number' ? v + (Math.abs(v) > 1 ? 1 : 1e-3) : v);
    out.B2.push({ what: 'the true candidate', result: tryGhost(st, c) });
    for (const f of Object.keys(seg)) {
      if (['id'].includes(f)) continue;
      const v = seg[f]; let patch;
      if (typeof v === 'number') patch = { [f]: bump(v) };
      else if (typeof v === 'string') patch = { [f]: v + 'x' };
      else if (v && typeof v === 'object') patch = { [f]: JSON.parse(JSON.stringify(v, (k, x) => (typeof x === 'number' ? x + 1e-3 : x))) };
      else continue;
      out.B2.push({ what: `last placed piece, segment ${j0}: ${f} changed`, result: tryGhost(st, tamper(j0, patch)) });
    }
    out.B2.push({ what: `last placed piece, segment ${j0}: roll0, roll1, rollRate0, rollRate1 all changed`, result: tryGhost(st, tamper(j0, { roll0: seg.roll0 + 0.1, roll1: seg.roll1 + 0.1, rollRate0: (seg.rollRate0 || 0) + 1e-3, rollRate1: (seg.rollRate1 || 0) + 1e-3 })) });
    out.B2.push({ what: 'the piece BEFORE the last, its segment 400: roll0 and roll1 changed', result: tryGhost(st, tamper(400, { roll0: c.segments[400].roll0 + 0.1, roll1: c.segments[400].roll1 + 0.1 })) });
    out.B2.push({ what: 'a segment of the last placed piece removed (one fewer placed segment)', result: tryGhost(st, { ...c, segments: c.segments.filter((_, k) => k !== j0) }) });
  }
  const LAST = { 'his rounded 88.45 over 1,000': HIS, 'bank -90 over 250 (corkscrew)': { length: 250, targets: { phi: -90 * DEG } }, 'turn rate 30 + bank 40 rounded': { length: 600, targets: { kh: 30 * DEG / 100, phi: 40 * DEG }, bankShape: 'rounded' }, 'bank 30 at rest': { length: 1000, targets: { phi: 30 * DEG } } };
  const NEXT = { 'straight 100': (s) => s.candidate({ length: 100 }), 'bank -180 over 250': (s) => s.candidate({ length: 250, targets: { phi: -180 * DEG } }), 'turn rate -20, bank 0': (s) => s.candidate({ length: 400, targets: { kh: -20 * DEG / 100, phi: 0 } }), 'corner +90 (turnDeg)': (s) => s.candidate({ length: 400, turnDeg: 90 }), 'width 20, cup 0': (s) => s.candidate({ length: 300, targets: { w: 20, c: 0 } }), 'jump': (s) => s.candidateJump({}) };
  for (const [ln, lo] of Object.entries(LAST)) for (const [nn, mk] of Object.entries(NEXT)) { const s = await placed([{ length: 1000 }, lo]), st = s.getState(); let c; try { c = mk(s); } catch (e) { out.A2.push({ last: ln, next: nn, maker: `threw: ${String(e.message).slice(0, 60)}` }); continue; } out.A2.push({ last: ln, next: nn, result: tryGhost(st, c) }); }
  console.log(JSON.stringify(out, null, 1));
})().catch((e) => { console.error(e && e.stack || e); process.exit(1); });
