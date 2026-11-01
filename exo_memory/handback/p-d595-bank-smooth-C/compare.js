// compare.js (D521, O): saved.js's outputs from the base tree and the new one, track by track.   node compare.js <base.json> <new.json>
const fs = require('fs');
const [a, b] = process.argv.slice(2).map((p) => JSON.parse(fs.readFileSync(p, 'utf8')));
let changed = 0;
console.log('track | pieces (road / with a bank change) | document sha base = new | exported geometry sha base = new | largest bank change at any 0.5 m station (°)');
for (const f of Object.keys(a)) {
  const x = a[f], y = b[f];
  if (x.skipped) { console.log(`${f} | skipped: ${x.skipped}`); continue; }
  const db = Math.max(0, ...x.bank.map((v, i) => Math.abs(v - y.bank[i]) * 180 / Math.PI));
  const same = x.doc === y.doc && x.geometry === y.geometry && db === 0; if (!same) changed++;
  console.log(`${f} | ${x.pieces} (${x.roads} / ${x.banked}) | ${x.doc} ${x.doc === y.doc ? '=' : '≠'} ${y.doc} | ${x.geometry} ${x.geometry === y.geometry ? '=' : '≠'} ${y.geometry} | ${db}`);
}
console.log(`tracks that would export differently: ${changed}`);
