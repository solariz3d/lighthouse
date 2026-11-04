// bytes.js (pane B, D228): sha256 of the kn5 for (1) a TEXTURED words-page export (the stadium, floor = the rainbow preset and, separately,
// the asphalt preset, on w1), (2) the same words export with no set, (3) an UNTEXTURED core export (a plain oval and a closed tube oval),
// (4) control: the core oval WITH the asphalt set, which only exists after a334a18. Run in two trees and compare.   node bytes.js <tree>
'use strict';
const path = require('path'), crypto = require('crypto'), T0 = path.resolve(process.argv[2]) + '/';
const D = require(T0 + 'src/doc/index.js'), Tx = require(T0 + 'src/texture/index.js'), TM = require(T0 + 'src/texmaker/index.js');
const { buildExport, buildFromSegments } = require(T0 + 'src/export/fromwords.js');
const { appendOld } = require(T0 + 'test/pre_d182_words.js');
const Dc = require(T0 + 'src/core/document.js'), { extend } = require(T0 + 'src/core/extend.js'), { close } = require(T0 + 'src/core/close.js'), A = require(T0 + 'src/core/adapter.js');
const { startLayout } = require(T0 + 'app/core/coreshell.js');
const sha = (b) => crypto.createHash('sha256').update(Buffer.from(b)).digest('hex').slice(0, 16), kmh = (v) => v / 3.6;
function stadium() {
  let d = D.createDoc('Tex');
  for (const [w, o] of [['straight', { handles: { length: 600 } }], ['tight', { font: 'flat' }], ['tight', { font: 'flat' }], ['straight', { handles: { length: 600 } }], ['tight', { font: 'flat' }], ['tight', { font: 'flat' }]]) d = appendOld(D, d, w, { ...o, speed: kmh(200) });
  return D.checkDoc({ ...d, closed: true });
}
const out = {};
for (const [name, preset] of [['rainbow', TM.PRESETS.rainbow], ['asphalt', TM.PRESETS.asphalt]]) {
  const d = D.editWord(stadium(), 'w1', { textures: { floor: { make: TM.serialize(preset), size: 64 } } }), set = Tx.buildTextureSet(d, {});
  out[`words+${name}`] = sha(buildExport(d, { textures: set }).kn5);
}
out['words, no set'] = sha(buildExport(stadium()).kn5);
const Rr = 180, Q = (Math.PI * Rr) / 2;
function lap(first) {
  let d = extend(Dc.createDoc('b lap'), { length: 300, ...(first ? { first } : { family: 'bowl' }) });
  for (let i = 0; i < 4; i++) d = extend(d, { length: Q, transition: 40, targets: { kh: 1 / Rr } });
  d = extend(d, { length: 60, transition: 40, targets: { kh: 0 } });
  return close(d, { edited: [0] }).doc;
}
const coreExport = (doc, textures) => { const segs = A.toSegments(doc), lift = (q) => A.offsetPath(doc, segs, q), start = { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch };
  return buildFromSegments(segs, { name: 'b', via: 'probe', liftPath: lift, start }, { markers: startLayout(segs, lift, start), ...(textures !== undefined ? { textures } : {}) }); };
const plain = lap({ w: 31 }), tube = lap({ w: 31, t: 360 });
out['core plain, no set'] = sha(coreExport(plain).kn5);
out['core tube, no set'] = sha(coreExport(tube).kn5);
out['core plain, set null'] = sha(coreExport(plain, null).kn5);
let ctl = 'n/a (no app/core/textures.js in this tree)';
try { const { createCoreTextures } = require(T0 + 'app/core/textures.js'); const set = createCoreTextures({ segments: () => A.toSegments(plain), kind: 'asphalt' }).current(); ctl = sha(coreExport(plain, set).kn5); } catch (e) { if (e.code !== 'MODULE_NOT_FOUND') throw e; }
out['CONTROL core plain + asphalt set'] = ctl;
console.log(JSON.stringify(out));
