// usage: node bankplot.js <base checkout> <fix checkout> <his save> <out.svg> [s0 s1]
// Bank and roll rate against distance as BUILT (src/core/adapter.js toSegments, each 2 m segment's roll0 and rate), base in grey and the fix in red, the joints
// as dashed lines; and a text table beside it (out.txt): at each joint, the bank and the rate either side, base and fix.
'use strict';
const fs = require('fs'), path = require('path');
const [RB, RF, save, out, s0a, s1a] = process.argv.slice(2);
const S0 = Number(s0a || 5000), S1 = Number(s1a || 6050), DEG = Math.PI / 180;
const series = (R) => {
  const D = require(path.join(R, 'src/core/document.js')), A = require(path.join(R, 'src/core/adapter.js'));
  const doc = D.parse(fs.readFileSync(save, 'utf8')), segs = A.toSegments(doc); let s = 0; const pts = [];
  for (const g of segs) { pts.push({ s, bank: g.roll0 / DEG, rate: (g.roll1 - g.roll0) / g.length / DEG }); s += g.length; }
  let j = 0; const joints = doc.pieces.map((P) => (j += P.length));
  return { pts: pts.filter((p) => p.s >= S0 && p.s <= S1), joints: joints.filter((x) => x > S0 && x < S1) };
};
const B = series(RB), F = series(RF);
const W = 1400, H = 760, padL = 70, padR = 20, top1 = 30, h1 = 320, top2 = 400, h2 = 320;
const X = (s) => padL + ((s - S0) / (S1 - S0)) * (W - padL - padR);
const bMin = Math.min(...B.pts.map((p) => p.bank), ...F.pts.map((p) => p.bank)), bMax = Math.max(...B.pts.map((p) => p.bank), ...F.pts.map((p) => p.bank));
const rMin = Math.min(...B.pts.map((p) => p.rate), ...F.pts.map((p) => p.rate), 0), rMax = Math.max(...B.pts.map((p) => p.rate), ...F.pts.map((p) => p.rate), 0);
const Y1 = (v) => top1 + h1 - ((v - bMin) / (bMax - bMin || 1)) * h1, Y2 = (v) => top2 + h2 - ((v - rMin) / (rMax - rMin || 1)) * h2;
const line = (pts, key, Y, col, w) => `<polyline fill="none" stroke="${col}" stroke-width="${w}" points="${pts.map((p) => `${X(p.s).toFixed(1)},${Y(p[key]).toFixed(1)}`).join(' ')}"/>`;
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" font-family="sans-serif" font-size="13"><rect width="${W}" height="${H}" fill="white"/>`;
svg += `<text x="${padL}" y="20">bank, degrees (as built): grey a005e1d (0.4.38's build), red d624-e with the corners rounded</text><text x="${padL}" y="${top2 - 10}">roll rate, degrees per metre (each 2 m segment)</text>`;
for (const j of B.joints) svg += `<line x1="${X(j)}" y1="${top1}" x2="${X(j)}" y2="${top2 + h2}" stroke="#888" stroke-dasharray="4 4"/><text x="${X(j) + 4}" y="${top2 + h2 + 16}">joint ${j}</text>`;
for (const v of [bMin, (bMin + bMax) / 2, bMax]) svg += `<text x="4" y="${Y1(v) + 4}">${v.toFixed(0)}</text>`;
for (const v of [rMin, 0, rMax]) svg += `<text x="4" y="${Y2(v) + 4}">${v.toFixed(2)}</text><line x1="${padL}" y1="${Y2(v)}" x2="${W - padR}" y2="${Y2(v)}" stroke="#eee"/>`;
svg += line(B.pts, 'bank', Y1, '#999', 3) + line(F.pts, 'bank', Y1, '#d22', 1.5) + line(B.pts, 'rate', Y2, '#999', 3) + line(F.pts, 'rate', Y2, '#d22', 1.5) + '</svg>';
fs.writeFileSync(out, svg);
const near = (S, s) => S.pts.reduce((b, p) => (Math.abs(p.s - s) < Math.abs(b.s - s) ? p : b), S.pts[0]);
const rows = ['joint\tbank base\tbank fix\trate 20 m before (base / fix)\trate at the joint (base / fix)\trate 20 m after (base / fix)\tslowest within 60 m (base / fix)'];
for (const j of B.joints) {
  const slow = (S) => Math.min(...S.pts.filter((p) => Math.abs(p.s - j) < 60).map((p) => Math.abs(p.rate)));
  rows.push(`${j}\t${near(B, j).bank.toFixed(2)}\t${near(F, j).bank.toFixed(2)}\t${near(B, j - 20).rate.toFixed(3)} / ${near(F, j - 20).rate.toFixed(3)}\t${near(B, j).rate.toFixed(3)} / ${near(F, j).rate.toFixed(3)}\t${near(B, j + 20).rate.toFixed(3)} / ${near(F, j + 20).rate.toFixed(3)}\t${slow(B).toFixed(3)} / ${slow(F).toFixed(3)}`);
}
fs.writeFileSync(out.replace(/\.svg$/, '.txt'), rows.join('\n') + '\n');
console.log(rows.join('\n'));
