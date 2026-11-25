require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const T = process.argv[2], D = require(T + '/src/core/document.js'), { extend } = require(T + '/src/core/extend.js'), A = require(T + '/src/core/adapter.js');
const DEG = Math.PI / 180;
let d = extend(D.createDoc('x'), { length: 300, family: 'bowl' });
d = extend(d, { length: 200, targets: { phi: 20 * DEG }, transition: { phi: 100 }, bankShape: 'rounded' });
const S = A.toPath(d, { step: 0.5 }).path.samples;
for (const s of [300, 350, 400, 450, 499]) { const x = S.reduce((p, q) => Math.abs(q.s - s) < Math.abs(p.s - s) ? q : p); console.log(s, (x.roll / DEG).toFixed(4), (D.channelValue(d.pieces[1], 'phi', s - 300) / DEG).toFixed(4), Object.keys(x).join(',')); }
const c = extend(D.createDoc('c'), { length: 300, first: { kh: 1 / 50 } }); console.log('kh const', D.channelValue(c.pieces[0], 'kh', 150));
