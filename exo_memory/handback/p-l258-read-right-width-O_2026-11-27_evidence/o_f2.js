// o_f2.js (pane O, L258 F2 delta read, 8b7cafc..de6c069; scratch): B's backToWidth, varied. The fake DOM is B's own (app/test/core-right-width-panel.test.js
// lines 13-39, read from the tree and evaluated here, so the panel is mounted exactly as B's mounted-panel row mounts it). Our own synthetic roads only.
//   M  the MOUNTED panel, typed as he types: the width field left as shown, then right width m = the width as shown; the width field typed too; a
//      second Extend after the first; the SPLIT_HEAD advice through the mounted panel on a brushed head
//   R  a right width he really wants a few mm off the width, through extendOptions (the panel's conversion)
//   C  the CHANGELOG's way back on a road that HAS a step: what the file is after "set the right width back to the width", and what brings core/4 back
//   usage: node o_f2.js <tree at de6c069>
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), assert = require('node:assert/strict');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js')), PC = require(path.join(T, 'src/core/piece.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), PN = require(path.join(T, 'app/core/panel.js')), { extendOptions } = PN;
const src = fs.readFileSync(path.join(T, 'app/test/core-right-width-panel.test.js'), 'utf8').split('\n').slice(12, 39).join('\n');
const { fakeWindow } = new Function('assert', `${src}\nreturn { fakeWindow };`)(assert);
const out = { M: [], R: [], C: [] };
const msg = (e) => (e && (e.code ? `${e.code}: ` : '') + String(e.message || e)).slice(0, 260);
const schemaOf = (d) => JSON.parse(D.serialize(d)).schema;
const endWd = (P) => (P.split ? +D.pieceEnd(P).wd.v.toFixed(6) : 0);
const roadAt = (w) => extend(extend(D.createDoc('f2'), { length: 120, first: { w }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: 8 * Math.PI / 180 } });
async function mounted(doc, { brush = false } = {}) {
  const { doc: fdoc } = fakeWindow(), root = fdoc.createElement('div');
  const pieces = new Map(), storage = { openDoc: async () => null, listPieces: async () => [...pieces.keys()], openPiece: async (n) => pieces.get(n), savePiece: async (n, t) => { pieces.set(n, t); }, openRecipe: async () => null, saveRecipe: async () => {} };
  const shell = await createCoreShell({ storage, autosaveMs: 0 }); shell.commitDoc(doc);
  if (brush) { const L = doc.pieces.reduce((a, P) => a + P.length, 0); shell.beginBrush({ mode: 'rate', channel: 'w', s0: L - 5, r: 20 }); shell.brushTo(1.37); shell.endBrush(); }
  PN.mount(root, shell);
  const field = (text) => root.all().find((e) => e.tagName === 'LABEL' && e.children[0] && e.children[0].textContent === text).children[1];
  const type = (text, v) => { const f = field(text); f.value = String(v); f.oninput(); };
  const press = () => root.all().find((e) => e.tagName === 'BUTTON' && e.textContent === 'Extend').onclick();
  return { shell, field, type, press, pieces };
}
const rec = async (bucket, name, f) => { try { bucket.push({ case: name, ...(await f()) }); } catch (e) { bucket.push({ case: name, threw: msg(e) }); } };
(async () => {
  // ── M: the mounted panel ──
  for (const [label, w, wd, brush] of [['split head, width 19.1346, right +3.5', 19.1346, 3.5, false], ['split head, width 19.1 brushed +1.37 at the head', 19.1, 3.5, true], ['unsplit head, width 19.1346', 19.1346, 0, false]]) {
    await rec(out.M, `${label}: width left as shown, right width m typed as the width is shown`, async () => {
      const d = wd ? extend(roadAt(w), { length: 100, transition: { wd: 5 }, targets: { wd } }) : roadAt(w);
      const m = await mounted(d, { brush }), hw = m.shell.headState().w, shownW = m.field('width m').value, shownR = m.field('right width m').value;
      m.type('length m', 100); m.type('right width m', shownW); m.press();
      const ps = m.shell.getState().history.present.pieces, P = ps[ps.length - 1];
      const r = { headW: +hw.toFixed(6), widthFieldShows: shownW, rightFieldShowed: shownR, message: m.shell.getState().message || null, lastSplit: !!P.split, lastEndWd: endWd(P), schema: schemaOf(m.shell.getState().history.present) };
      // a second Extend with nothing typed: the piece after is one width (no wd), and the right width field now shows the width
      m.type('length m', 80); m.press(); const ps2 = m.shell.getState().history.present.pieces, Q = ps2[ps2.length - 1];
      r.nextSplit = !!Q.split; r.rightFieldNow = m.field('right width m').value; r.widthFieldNow = m.field('width m').value;
      return r;
    });
  }
  await rec(out.M, 'split head 19.1346: the width field typed as shown ("19.13") and right width m typed as shown', async () => {
    const m = await mounted(extend(roadAt(19.1346), { length: 100, transition: { wd: 5 }, targets: { wd: 3.5 } }));
    m.type('length m', 100); m.type('width m', m.field('width m').value); m.type('right width m', '19.13'); m.press();
    const P = m.shell.getState().history.present.pieces.slice(-1)[0];
    return { lastEndWd: endWd(P), lastEndW: +D.pieceEnd(P).w.v.toFixed(6), note: 'the width field typed equal to what it shows counts as left as shown (asTyped)' };
  });
  await rec(out.M, 'split head 19.1346: the width typed as a NEW number (19.2) and right width m typed 19.13', async () => {
    const m = await mounted(extend(roadAt(19.1346), { length: 100, transition: { wd: 5 }, targets: { wd: 3.5 } }));
    m.type('length m', 100); m.type('width m', '19.2'); m.type('right width m', '19.13'); m.press();
    const P = m.shell.getState().history.present.pieces.slice(-1)[0];
    return { lastEndWd: endWd(P), lastEndW: +D.pieceEnd(P).w.v.toFixed(6) };
  });
  await rec(out.M, 'brushed split head: SPLIT_HEAD, then its advice typed into the mounted panel, then the piece added', async () => {
    const plain = PC.serialize(PC.saveRun(extend(D.createDoc('p'), { length: 60, first: { w: 19.1 }, targets: { kh: 1 / 300 } }), 0, 0, { name: 'plain' }));
    const m = await mounted(extend(roadAt(19.1), { length: 100, transition: { wd: 5 }, targets: { wd: 3.5 } }), { brush: true }); await m.pieces.set('plain', plain);
    const n0 = m.shell.getState().history.present.pieces.length; await m.shell.insertPiece('plain'); const said = m.shell.getState().message;
    const adv = /set to the width \(([\d.]+)\)/.exec(said || ''); m.type('length m', 100); m.type('right width m', adv ? adv[1] : ''); m.press();
    const n1 = m.shell.getState().history.present.pieces.length; await m.shell.insertPiece('plain');
    return { firstRefused: m.shell.getState().history.present.pieces.length === n1 + 1 ? said : said, laidAfterAdvice: m.shell.getState().history.present.pieces.length - n1, advice: adv && adv[1], afterMessage: m.shell.getState().message, before: n0 };
  });
  // ── R: a right width he really wants a few mm off the width ──
  for (const [hw, typed] of [[19.1346, '19.1316'], [19.1346, '19.133'], [19.1346, '19.1376'], [19.1346, '19.13'], [19.1, '19.097'], [19.1, '19.103'], [19.1, '19.1']])
    await rec(out.R, `width ${hw}, right width typed ${typed}`, async () => { const o = extendOptions({ length: 100, widthR: typed, head: { w: hw }, turnAs: 'rate' }); const d = extend(roadAt(hw), o), P = d.pieces.slice(-1)[0];
      return { sent: +o.targets.wd.toFixed(6), wanted: +(Number(typed) - hw).toFixed(6), endWd: endWd(P), rightSide: +(hw + endWd(P)).toFixed(4), split: !!P.split }; });
  // ── C: the CHANGELOG's way back, on a road that HAS a step ──
  for (const w of [19.1, 19.1346]) await rec(out.C, `width ${w}: a 3.5 m step, then "set the right width back to the width" (Extend, right width as shown)`, async () => {
    const stepped = extend(extend(roadAt(w), { length: 100, transition: { wd: 5 }, targets: { wd: 3.5 } }), { length: 100 });
    const o = extendOptions({ length: 100, widthR: String(Math.round(w * 100) / 100), head: { w }, turnAs: 'rate' }), back = extend(stepped, o), after = extend(back, { length: 80 });
    const wrote = JSON.parse(D.serialize(after)).pieces.map((P, i) => (P.channels && P.channels.wd ? i : null)).filter((x) => x !== null);
    // what does bring the older schema back: the stepped pieces taken off the end (as Undo or Delete would), so no piece carries a right width
    const undone = roadAt(w);
    return { schemaBefore: schemaOf(stepped), schemaAfterSettingBack: schemaOf(after), piecesThatWriteWd: wrote, pieceThatSetItBackWritesWd: wrote.includes(after.pieces.length - 2), nextPieceSplit: !!after.pieces[after.pieces.length - 1].split, schemaWithTheStepTakenOff: schemaOf(undone) };
  });
  console.log(JSON.stringify(out, null, 1));
})();
