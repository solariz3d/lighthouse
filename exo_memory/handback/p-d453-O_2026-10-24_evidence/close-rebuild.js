'use strict';
// D453 (O): Close's preview rebuild on a 24 km track closed by new road, in Node, through createTrackModel as preview-close-reuse does: the track model is built on the
// open track, then updated to the closed one, and that update is timed (and a fresh full build of the closed track, for scale). Reports the segments kept.
//   node close-rebuild.js <tree> [reps] [mixed|rect]      (holds a heavy-run slot; set BelowNormal by its caller)
const path = require('path'), T = path.resolve(process.argv[2]), REPS = +(process.argv[3] || 3), MIXED = process.argv[4] === 'mixed', RECT = process.argv[4] === 'rect';
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'd453 close-rebuild ' + path.basename(T) });
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { createTrackModel } = require(path.join(T, 'app/preview/trackmodel.js'));
const DEG = Math.PI / 180;
(async () => {
  // THE LAP, built in the document from exact turns (Turn by), then opened in the shell from a stub storage: four sides, each three units of bends that end where they
  // began (200 m straight, then +30°, −30°, −30°, +30° at R 600 with 200 m straights between), joined by 90° corners at R 300; the fourth side stops two units in, so
  // the end lies short of the start and Close lays new road. About 24 km placed.
  const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js')), { extendTurnBy } = require(path.join(T, 'src/core/turnby.js'));
  // 'mixed': the 30° bends of the first three sides banked by hand, 15° into the turn (as his own laps are, so bankLap leaves them); the corners and the last
  // side upright (its end as in the upright lap, so Finish closes it the same way): Close banks those
  let handSide = false; const own = (deg) => (MIXED && handSide && Math.abs(deg) === 30 ? { targets: { phi: -Math.sign(deg) * 15 * DEG }, transition: 20 } : {});
  const turn = (d, deg, R) => extendTurnBy(d, { length: (R * Math.abs(deg) * DEG), ...own(deg) }, deg * DEG), St = (d, L = 200) => extend(d, { length: L, ...(MIXED && handSide ? { targets: { phi: 0 }, transition: 20 } : {}) });
  const unit = (d) => { d = St(d); d = turn(d, 30, 600); d = St(d); d = turn(d, -30, 600); d = St(d); d = turn(d, -30, 600); d = St(d); return turn(d, 30, 600); };
  let d = D.createDoc('d453'); d = extend(d, { length: 300, family: 'bowl' });
  // 'rect': four straight sides of 6 km laid as 1 km pieces, three upright 90° corners at R 300, the fourth side 2 km short: Close banks only the corners
  if (RECT) for (let side = 0; side < 4; side++) { for (let k = 0; k < (side === 3 ? 4 : 6); k++) d = St(d, 1000); if (side < 3) d = turn(d, 90, 300); }
  else for (let side = 0; side < 4; side++) { handSide = side < 3; for (let u = 0; u < (side === 3 ? 2 : 3); u++) d = unit(d); handSide = false; if (side < 3) { d = St(d); d = turn(d, 90, 300); } }
  d = St(d);
  const text = D.serialize(d), storage = { openDoc: async () => text };
  const s = await createCoreShell({ storage, brushFn: null, autosaveMs: 0, overlapRunner: { run: () => new Promise(() => {}), cancel() {} } });
  await s.open('d453');
  const open = s.getState().resolved, openLen = open.segments.length;
  const t0 = Date.now(); await s.closeBest(); const closeS = (Date.now() - t0) / 1000;
  const closed = s.getState().resolved, msg = s.getState().message;
  const lengthM = closed.segments.reduce((a, g) => a + (g.length || 0), 0);
  console.log(`tree ${path.basename(T)}: open segments ${openLen}, closed ${closed.segments.length}, about ${(lengthM / 1000).toFixed(1)} km; Close ${closeS.toFixed(1)} s: ${msg}`);
  for (let r = 0; r < REPS; r++) {
    const tm = createTrackModel(); tm.update(open);
    const a = process.hrtime.bigint(); const kept = tm.update(closed); const b = process.hrtime.bigint();
    const f0 = process.hrtime.bigint(); createTrackModel().update(closed); const f1 = process.hrtime.bigint();
    console.log(`  rep ${r}: Close's rebuild (update open → closed) ${(Number(b - a) / 1e6).toFixed(0)} ms, reused ${kept.mesh.stats.reused} of ${openLen}; a full build of the closed track ${(Number(f1 - f0) / 1e6).toFixed(0)} ms`);
  }
})().catch((e) => { console.error(e); process.exit(1); });
