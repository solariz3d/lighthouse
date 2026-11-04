'use strict';
// D438 Part 2 (O): the keeper's own road as the reference. Over his pieces p1..p<n> (before the closer) of one saved track: the fastest change of the cup (°/m) and
// of the bank (°/m) anywhere, read every 1 m on each piece's channels (within a piece; a joint is continuous by the document's C1 rule), and the same on the closer's
// pieces and through the seam into p1. Bank in the flipped form is compared as stored inside each piece (no piece changes form inside itself).
//   node own-rates.js <tree> <track> <first closer index>
const [T, FILE, FROM] = process.argv.slice(2);
const fs = require('fs'), path = require('path'), D = require(path.join(T, 'src/core/document.js'));
const doc = D.parse(fs.readFileSync(FILE, 'utf8')), from = Number(FROM), deg = (x) => (x * 180) / Math.PI;
function rates(pieces) {
  let c = { r: 0 }, b = { r: 0 };
  for (const P of pieces) {
    if (P.type !== 'road') continue;
    let prev = D.valuesAt(P, 0);
    for (let s = 1; s <= P.length; s += 1) {
      const v = D.valuesAt(P, Math.min(s, P.length));
      if (P.cup) { const r = Math.abs(v.c - prev.c); if (r > c.r) c = { r, at: `${P.id} +${s} m` }; }
      const rb = Math.abs(deg(v.phi - prev.phi)); if (rb > b.r) b = { r: rb, at: `${P.id} +${s} m` };
      prev = v;
    }
  }
  return { cupDegPerM: +c.r.toFixed(3), cupAt: c.at || '-', bankDegPerM: +b.r.toFixed(3), bankAt: b.at || '-' };
}
console.log(JSON.stringify({ track: path.basename(FILE), his: rates(doc.pieces.slice(0, from)), closer: rates(doc.pieces.slice(from)) }));
