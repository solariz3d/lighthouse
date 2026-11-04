// node measure2.js [root]: ONE ghost drag step on a 1000 m tube piece, headless: the core's candidate + candidateReadout, then the track model's ghostFor (full, then cheap). Median of 9 steps; vertices and the bytes
// the renderer would upload (positions, normals, uvs as floats, indices as 32-bit) are counted too. `cheap` is ignored by a tree without D266 item 2 (so the "cheap" column of a base tree equals its full one).
const path = require('path'); const ROOT = process.argv[2] || 'C:/Users/nname/Desktop/worktrees/a-cheap-wt';
const { createCoreShell } = require(path.join(ROOT, 'app/core/coreshell.js')); const { createTrackModel } = require(path.join(ROOT, 'app/preview/trackmodel.js')); const XS = require(path.join(ROOT, 'app/core/xsec.js'));
(async () => {
  const sh = await createCoreShell({ brushFn: null, autosaveMs: 0 }); sh.extend({ length: 300, family: 'bowl' });
  const tm = createTrackModel(); tm.update(sh.getState().resolved);
  const ms = (f) => { const a = process.hrtime.bigint(); const r = f(); return [Number(process.hrtime.bigint() - a) / 1e6, r]; }, med = (xs) => xs.slice().sort((a, b) => a - b)[xs.length >> 1];
  const bytes = (g) => g.batches.reduce((a, b) => a + (b.positions ? b.positions.length * 4 + (b.normals ? b.normals.length * 4 : 0) + (b.uvs ? b.uvs.length * 4 : 0) + (b.indices ? b.indices.length * 4 : 0) : 0), 0);
  const verts = (g) => g.batches.reduce((a, b) => a + (b.positions ? b.positions.length / 3 : 0), 0);
  const run = (cheap) => { const t = [], core = []; let v = 0, by = 0; for (let i = 0; i < 9; i++) { const o = { length: 1000, targets: { kh: (1 / 600) * (1 + i * 0.04), [XS.CHANNEL.tube]: 360, w: 31 } }; const [c1, cand] = ms(() => sh.candidate(o)); const [c2] = ms(() => sh.candidateReadout(o)); const [g1, g] = ms(() => tm.ghostFor(cand, { cheap })); core.push(c1 + c2); t.push(c1 + c2 + g1); v = verts(g); by = bytes(g); } return { stepMs: Math.round(med(t)), coreMs: Math.round(med(core)), ghostMs: Math.round(med(t) - med(core)), vertices: v, uploadMB: Math.round(by / 1e5) / 10 }; };
  run(false); run(true);   // warm
  console.log(JSON.stringify({ root: path.basename(ROOT), full: run(false), cheap: run(true) }));
})().catch((e) => console.error('ERR', e.stack));
