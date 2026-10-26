'use strict';
const os = require('os'); os.setPriority(os.constants.priority.PRIORITY_BELOW_NORMAL);
const path = require('path'), fs = require('fs');
const OLD = 'C:/Users/nname/Downloads/t180-wt-e473', NEW = 'C:/Users/nname/Downloads/t180-wt-p477', r = (T, f) => require(path.join(T, f));
const D = r(NEW, 'src/core/document.js'), { close } = r(NEW, 'src/core/close.js'), DEG = Math.PI / 180;
const open = D.parse(fs.readFileSync(path.join(NEW, 'fixtures-d431', 'test10-open.t180track'), 'utf8'));
const lap = close(open, { edited: [open.pieces.length - 1] }).doc, up = D.valuesAt(lap.pieces[0], 0).phi;
const o = r(OLD, 'src/core/finish.js').bankLapWith(lap), n = r(NEW, 'src/core/finish.js').bankLapWith(lap);
const mx = (a, b) => Math.max(...a.map((v, k) => Math.abs(v - b[k]))) / DEG;
for (const [i, P] of lap.pieces.entries()) {
  if (P.type !== 'road') continue; const carried = Math.max(...P.channels.phi.map((v) => Math.abs(v - up))) / DEG;
  if (carried > 5) continue;
  console.log(`${P.id} n${P.channels.phi.length}: carried max ${carried.toFixed(4)}° (first two ${(P.channels.phi[0] - up) / DEG}, ${((P.channels.phi[1] - up) / DEG).toFixed(4)}); OLD adds max ${mx(o.doc.pieces[i].channels.phi, P.channels.phi).toFixed(4)}°, NEW adds max ${mx(n.doc.pieces[i].channels.phi, P.channels.phi).toFixed(4)}°`);
}
console.log('open fixture p1 bank variation:', (Math.max(...open.pieces[0].channels.phi) - Math.min(...open.pieces[0].channels.phi)) / DEG, '°');
