// table.js: the measured and built profiles side by side every <step> m. usage: node table.js out/profiles.json [step]
const P = require(require('path').resolve(process.argv[2])), step = +(process.argv[3] || 8);
const at = (p, d) => p.reduce((b, x) => (Math.abs(x.d - d) < Math.abs(b.d - d) ? x : b));
const laid = P.attempts.filter((a) => a.prof);
console.log('d     | measured h  bank |' + laid.map((a, i) => ` [${i + 1}] h  bank |`).join(''));
for (let d = 340; d <= 720; d += step) {
  const m = at(P.meas, d);
  console.log(String(d).padEnd(6) + '|' + m.h.toFixed(0).padStart(7) + m.bank.toFixed(0).padStart(7) + '   |' + laid.map((a) => { const b = at(a.prof, d); return b.h.toFixed(0).padStart(7) + b.bank.toFixed(0).padStart(6) + ' |'; }).join(''));
}
laid.forEach((a, i) => console.log(`[${i + 1}] ${a.name}`));
