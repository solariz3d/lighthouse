// ordinary.js: banked turns laid the ORDINARY way through the panel (extendOptions; the bank typed on the turn piece, straights typed level), the built road
// written as a read-shaped file (stations every 4 m: d, c = pos, f = T, n = U, width 33), for the librarian's style.js to measure unchanged.
// usage: node ordinary.js <t180 tree> <out.json> <variant>   variant: plain | sonly | carry
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const path = require('path'), fs = require('fs'), [tree, outFile, variant = 'plain'] = process.argv.slice(2), R = (p) => require(path.join(tree, p));
const D = R('src/core/document.js'), { extend } = R('src/core/extend.js'), { extendCorner } = R('src/core/turnby.js'), A = R('src/core/adapter.js'), { extendOptions } = R('app/core/panel.js');
let doc = extend(D.createDoc('ordinary'), { length: 200, family: 'bowl', first: { w: 33 } });
const lay = (fields) => { const P = doc.pieces[doc.pieces.length - 1], o = extendOptions({ turnAs: 'corner', head: D.valuesAt(P, P.length), ...fields }); doc = o.turnDeg !== undefined || o.climbDeg !== undefined ? extendCorner(doc, o) : extend(doc, o); };
// a mix a user lays: 90 deg turns of 100 and 130 m (radius about 64 and 83 m by length; the eased rate peaks tighter), bank 25 and 35, both hands
const TURNS = [[100, 90, 25], [130, -90, 35], [100, -90, 30], [130, 90, 25], [100, 90, 35], [130, -90, 30]];
const STRAIGHT = variant === 'carry' ? (b) => ({ length: '150' }) : (b) => ({ length: '150', bank: '0' });   // carry: the straight's bank field left empty
if (!['sonly', 'sbb', 'sgap'].includes(variant)) for (const [L, t, b] of TURNS) { lay({ length: String(L), turn: String(t), bank: String(-Math.sign(t) * b) }); lay(STRAIGHT(b)); }
// S pairs: two opposite 90s back to back, and with a 30 m level straight between (the bank typed into each turn: + = left side up, so a LEFT turn leans in with a NEGATIVE bank)
for (const [L, b, gap] of [[100, 25, 0], [100, 35, 0], [130, 30, 0], [100, 25, 30], [130, 35, 30], [100, 30, 30]].filter(([, , g]) => variant === 'sbb' ? !g : variant === 'sgap' ? g : true)) {
  lay({ length: String(L), turn: '90', bank: String(-b) }); if (gap) lay({ length: String(gap), bank: '0' });
  lay({ length: String(L), turn: '-90', bank: String(b) }); lay(STRAIGHT(b));
}
const { path: P } = A.toPath(doc, { step: 0.5 }), st = [];
for (const x of P.samples) if (Math.abs(x.s / 4 - Math.round(x.s / 4)) < 1e-6) st.push({ d: Math.round(x.s), c: x.pos, f: x.T, n: x.U, width: 33 });
fs.writeFileSync(outFile, JSON.stringify({ track: `builder-${variant}`, walked_m: P.lengthM, stations: st }));
console.log(`${variant}: ${doc.pieces.length} pieces, ${P.lengthM.toFixed(0)} m, ${st.length} stations -> ${outFile}`);
