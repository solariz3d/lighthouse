// D190 row 2 probe (pane E): does fitting a Bloss blend to a target (extend.js channelFn + document.js fitChannel) put control
// points or values PAST the target? Measured on the r channel (the same fit any channel gets), target 150 from 15.5.
const T = __dirname + '/t/', D = require(T + 'src/core/document.js'), { extend } = require(T + 'src/core/extend.js');
const rows = [];
for (const [len, tr] of [[100, 100], [100, 40], [60, 20], [30, 10], [200, 15], [12, 12]]) {
  let d = D.createDoc('o'); d = extend(d, { length: 50, family: 'bowl', first: { r: 15.5 } }); d = extend(d, { length: len, transition: tr, targets: { r: 150 } });
  const P = d.pieces[1], cps = P.channels.r; let vmax = -Infinity; for (let k = 0; k <= len * 20; k++) vmax = Math.max(vmax, D.channelAt(P, 'r', k / 20).v);
  rows.push({ len, transition: tr, maxCP: Math.max(...cps), maxValue: +vmax.toFixed(6), endCP: cps[cps.length - 1] });
}
// continuation with no target after a rising piece: v + m·s
{ let d = D.createDoc('o'); d = extend(d, { length: 50, family: 'bowl', first: { r: 15.5 } }); d = extend(d, { length: 60, targets: { r: 140 } }); const e = D.pieceEnd(d.pieces[1]).r; d = extend(d, { length: 100 }); rows.push({ continuation_from: e, next_piece_end: D.pieceEnd(d.pieces[2]).r.v }); }
console.log(rows.map((r) => JSON.stringify(r)).join('\n'));
