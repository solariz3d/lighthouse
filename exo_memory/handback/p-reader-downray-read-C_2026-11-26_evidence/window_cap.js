// window_cap.js: the band cap that downBand's ray window (piecewise.cjs:123, top = 8, depth = 11: from 8 m over the station to 3 m under it) puts on a
// plane banked b, with the station `strip` m under the surface along its normal (so strip/cos(b) m straight down)
const strip = 1.5;
for (const b of [20, 40, 52]) { const r = b * Math.PI / 180, dv = strip / Math.cos(r), up = (8 - dv) / Math.sin(r), dn = (3 + dv) / Math.sin(r);
  console.log(`bank ${b}: cap ${(up + dn).toFixed(1)} m (uphill ${up.toFixed(1)}, downhill ${dn.toFixed(1)})`); }
console.log(`above (2.5 m straight up) passed when ${strip}/cos(b) > 2.5: b > ${(Math.acos(strip / 2.5) * 180 / Math.PI).toFixed(1)} deg`);
