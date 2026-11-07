// gridkn5.js <tree> <doc> <out prefix>: the doc exported with the page's textures, the underside's texture replaced by a TEST GRID (16 x 16 cells, each labelled with
// a row letter A-P and a column digit 0-F, a checker tint, thick lines every 4 cells), written twice: <prefix>-full.kn5 (lightHull: false) and <prefix>-light.kn5
'use strict';
const fs = require('fs'), path = require('path'), T = process.argv[2], R_ = (p) => require(path.join(T, p));
const D = R_('src/core/document.js'), A = R_('src/core/adapter.js'), FW = R_('src/export/fromwords.js'), { startLayout } = R_('app/core/coreshell.js');
const { createCoreTextures } = R_('app/core/textures.js'), { encodeDds } = R_('src/texture/dds.js'), { writeKn5 } = R_('src/export/kn5write.js');
const doc = D.parse(fs.readFileSync(process.argv[3], 'utf8')), segs = A.toSegments(doc), lift = (q) => A.offsetPath(doc, segs, q);
const start = { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch };
const textures = createCoreTextures({ segments: () => segs, closed: () => !!doc.closed, edge: true }).current();
// a 5x7 font: each glyph 7 rows of 5 bits
const F = { 0: '01110 10001 10011 10101 11001 10001 01110', 1: '00100 01100 00100 00100 00100 00100 01110', 2: '01110 10001 00001 00010 00100 01000 11111', 3: '11110 00001 00001 01110 00001 00001 11110',
  4: '00010 00110 01010 10010 11111 00010 00010', 5: '11111 10000 11110 00001 00001 10001 01110', 6: '00110 01000 10000 11110 10001 10001 01110', 7: '11111 00001 00010 00100 01000 01000 01000',
  8: '01110 10001 10001 01110 10001 10001 01110', 9: '01110 10001 10001 01111 00001 00010 01100', A: '01110 10001 10001 11111 10001 10001 10001', B: '11110 10001 10001 11110 10001 10001 11110',
  C: '01110 10001 10000 10000 10000 10001 01110', D: '11110 10001 10001 10001 10001 10001 11110', E: '11111 10000 10000 11110 10000 10000 11111', F: '11111 10000 10000 11110 10000 10000 10000',
  G: '01110 10001 10000 10111 10001 10001 01111', H: '10001 10001 10001 11111 10001 10001 10001', I: '01110 00100 00100 00100 00100 00100 01110', J: '00111 00010 00010 00010 00010 10010 01100',
  K: '10001 10010 10100 11000 10100 10010 10001', L: '10000 10000 10000 10000 10000 10000 11111', M: '10001 11011 10101 10101 10001 10001 10001', N: '10001 11001 10101 10011 10001 10001 10001',
  O: '01110 10001 10001 10001 10001 10001 01110', P: '11110 10001 10001 11110 10000 10000 10000' };
const W = 1024, cell = W / 16, rgba = new Uint8Array(W * W * 4);
for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) {
  const cx = Math.floor(x / cell), cy = Math.floor(y / cell), o = (y * W + x) * 4, tint = (cx + cy) % 2 ? [235, 225, 200] : [200, 220, 240];
  const lx = x % cell, ly = y % cell, thick = cx % 4 === 0 && lx < 4 || cy % 4 === 0 && ly < 4, line = lx < 2 || ly < 2;
  const c = thick ? [200, 20, 20] : line ? [20, 20, 20] : tint;
  rgba[o] = c[0]; rgba[o + 1] = c[1]; rgba[o + 2] = c[2]; rgba[o + 3] = 255;
}
const glyph = (ch, X, Y, s) => { const g = F[ch].split(' '); for (let r = 0; r < 7; r++) for (let c = 0; c < 5; c++) if (g[r][c] === '1') for (let a = 0; a < s; a++) for (let b = 0; b < s; b++) { const o = ((Y + r * s + a) * W + X + c * s + b) * 4; rgba[o] = 10; rgba[o + 1] = 10; rgba[o + 2] = 90; } };
for (let cy = 0; cy < 16; cy++) for (let cx = 0; cx < 16; cx++) { glyph('ABCDEFGHIJKLMNOP'[cy], cx * cell + 10, cy * cell + 14, 3); glyph('0123456789ABCDEF'[cx], cx * cell + 30, cy * cell + 14, 3); }
const dds = Buffer.from(encodeDds({ width: W, height: W, rgba }));
for (const light of [false, true]) {
  const ex = FW.buildFromSegments(segs, { name: 'x', via: 'test', liftPath: lift, start }, { markers: startLayout(segs, lift, start, { open: !doc.closed }), test: true, lightHull: light, textures });
  const sc = ex.acScene, skin = sc.materials.find((m) => m.name === 't180b_underskin'), tx = skin.samplers.find((s) => s.name === 'txDiffuse').texture;
  // the underside gets its own copy of its sampler's texture, under a new name, as the grid (the road keeps its own)
  const name = 't180b_testgrid.dds', mats = sc.materials.map((m) => (m === skin ? { ...m, samplers: m.samplers.map((s) => (s.name === 'txDiffuse' ? { ...s, texture: name } : s)) } : m));
  const out = { ...sc, materials: mats, textures: [...sc.textures, { name, data: dds }] };
  const f = `${process.argv[4]}-${light ? 'light' : 'full'}.kn5`; fs.writeFileSync(f, Buffer.from(writeKn5(out)));
  let n = 0; for (const m of sc.root.children) if (m.type === 'mesh' && /^UNDERSKIN_/.test(m.name)) n += m.indices.length / 3;
  console.log('written', f, 'underside tris', n, 'underside texture was', tx);
}
