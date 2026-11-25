require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const T = process.argv[2], D = require(T + '/src/core/document.js'), { extend } = require(T + '/src/core/extend.js'), TB = require(T + '/src/core/turnby.js'), DEG = Math.PI / 180;
const lead = () => extend(D.createDoc('flow'), { length: 300, family: 'bowl', first: { w: 33 } });
const chg = [{ from: 145, target: 0 }, { from: 200, target: 25 * DEG }];
for (let it = 0; it < 12; it++) {
  try { TB.extendCorner(lead(), { length: 300, turnDeg: 0, changes: { turnDeg: [{ from: 80, deg: 92 }, { from: 200, deg: -91 }], phi: chg }, targets: { phi: -27 * DEG }, transition: { phi: 145 }, bankShape: 'rounded' }); console.log('LAID', JSON.stringify(chg.map((c) => ({ from: c.from, deg: +(c.target / DEG).toFixed(3) })))); break; }
  catch (e) { const k = /change (\d+)/.exec(e.message), m = /from at most (-?[\d.]+)/.exec(e.message), n = /from at least (-?[\d.]+)/.exec(e.message); console.log(e.code, e.message.slice(0, 200)); if (!k || !(m || n)) break; chg[+k[1] - 1].from = +(m || n)[1]; }
}
