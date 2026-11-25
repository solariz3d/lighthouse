// L229 R5 (pane A): two pictures of "Smooth S as driven L" for his eye, made headless, read only on his folder.
//   node pictures.js docs <app data dir> <docs.json>     open the project through the shell, undo twice, write [before, after one undo, after two undos]
//   node pictures.js comp <dir with r0_*.png r1_*.png r2_*.png> <out dir>   composite: ghost = pixels the undone road adds to the placed road, blended 50% into it
// The composite STANDS IN for the app's WebGL ghost (the rasteriser has no see-through pass); the ghost road itself is the shell's st.undoGhost.candidate in the tests.
'use strict';
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const T = process.env.TREE || 'C:/Consonance/t180-wt-ghost';
const [mode, a, b] = process.argv.slice(2);
if (mode === 'docs') {
  const { createCoreShell } = require(T + '/app/core/coreshell.js'), D = require(T + '/src/core/document.js');
  const f = (n, e) => path.join(a, 'tracks', n + e);
  const storage = { openDoc: async (n) => fs.readFileSync(f(n, '.t180track'), 'utf8'), openUndo: async (n) => (fs.existsSync(f(n, '.t180undo')) ? fs.readFileSync(f(n, '.t180undo'), 'utf8') : null),
    saveDoc: async () => { throw new Error('read only'); }, saveUndo: async () => { throw new Error('read only'); }, savePiece: async () => {}, openPiece: async () => '', listPieces: async () => [], deletePiece: async () => {}, listDocs: async () => [],
    saveAutosave: async () => {}, clearAutosave: async () => {}, openAutosave: async () => null, backupDoc: async () => {}, listBackups: async () => [], docSavedAt: async () => null };
  (async () => {
    const sh = await createCoreShell({ brushFn: null, storage }); await sh.open('Smooth S as driven L');
    const out = [{ name: 'before the undo', doc: D.parse(sh.text()) }];
    sh.undo(); out.push({ name: 'after one undo', doc: D.parse(sh.text()), ghostPieces: sh.getState().undoGhost && sh.getState().undoGhost.removed });
    sh.undo(); out.push({ name: 'after two undos', doc: D.parse(sh.text()), ghostPieces: sh.getState().undoGhost && sh.getState().undoGhost.removed });
    fs.writeFileSync(b, JSON.stringify(out)); console.log(out.map((o) => o.name + ': ' + o.doc.pieces.length + ' pieces, ghost ' + (o.ghostPieces || 'none')).join(' | '));
  })();
} else {
  const { decodePng, encodePng } = require(T + '/src/texture/png.js');
  const rd = (n) => decodePng(fs.readFileSync(path.join(a, n)));
  fs.mkdirSync(b, { recursive: true });
  for (const view of ['view', 'top']) {
    const full = rd('r0_' + view + '.png'), W = full.width, H = full.height;
    const put = (name, placed, whole) => {   // placed: the document after the undo; whole: the one before it
      const out = Buffer.from(placed.rgba);
      for (let i = 0; i < out.length; i += 4) {
        const d = Math.abs(whole.rgba[i] - placed.rgba[i]) + Math.abs(whole.rgba[i + 1] - placed.rgba[i + 1]) + Math.abs(whole.rgba[i + 2] - placed.rgba[i + 2]);
        if (d > 12) { out[i] = (placed.rgba[i] + whole.rgba[i] * 0.5 + 255 * 0.2) / 1.7 | 0; out[i + 1] = (placed.rgba[i + 1] + whole.rgba[i + 1] * 0.5 + 255 * 0.5) / 2.0 | 0; out[i + 2] = (placed.rgba[i + 2] + whole.rgba[i + 2] * 0.5 + 255 * 0.7) / 2.2 | 0; }
      }
      fs.writeFileSync(path.join(b, name), encodePng({ width: W, height: H, rgba: out }, (x) => zlib.deflateSync(x)));
    };
    fs.copyFileSync(path.join(a, 'r0_' + view + '.png'), path.join(b, `l229_before_${view}.png`));
    put(`l229_after1_${view}.png`, rd('r1_' + view + '.png'), full);
    put(`l229_after2_${view}.png`, rd('r2_' + view + '.png'), rd('r1_' + view + '.png'));   // the second undo's ghost is the S only: the redo state is the document after the first undo
  }
  console.log('composites written to', b);
}
