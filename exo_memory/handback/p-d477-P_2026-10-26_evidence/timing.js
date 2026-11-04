'use strict';
// D477: the lap press's time on TEST 10 (his own banked pieces: the fixed point's rounds) on a4bfe52 and d477-p, and the second press's; byte-equality of the first.
const os = require('os'); os.setPriority(os.constants.priority.PRIORITY_BELOW_NORMAL);
const path = require('path'), fs = require('fs'), crypto = require('crypto');
const OLD = 'C:/Users/nname/Downloads/t180-wt-e473', NEW = 'C:/Users/nname/Downloads/t180-wt-p477';
const r = (T, f) => require(path.join(T, f));
const D = r(NEW, 'src/core/document.js'), { close } = r(NEW, 'src/core/close.js');
const sha = (d) => crypto.createHash('sha256').update(D.serialize(d)).digest('hex').slice(0, 16);
for (const name of ['test10-open.t180track', 'testtrack10-open.t180track']) {
  const open = D.parse(fs.readFileSync(path.join(NEW, 'fixtures-d431', name), 'utf8'));
  const c = close(open, { edited: [open.pieces.length - 1] }); if (!c.converged) { console.log(`${name}: close() ${c.report.slice(0, 120)}`); continue; }
  const lap = c.doc, Fo = r(OLD, 'src/core/finish.js'), Fn = r(NEW, 'src/core/finish.js'), times = {};
  for (const [tag, F] of [['OLD', Fo], ['NEW', Fn], ['OLD', Fo], ['NEW', Fn]]) { const t0 = process.hrtime.bigint(); const b = F.bankLapWith(lap); times[tag] = (times[tag] || []).concat(Number(process.hrtime.bigint() - t0) / 1e6); times[tag + '_sha'] = sha(b.doc); times[tag + '_level'] = JSON.stringify(b.level); }
  const n1 = Fn.bankLapWith(lap); let t0 = process.hrtime.bigint(); const n2 = Fn.bankLapWith(n1.doc); const t2 = Number(process.hrtime.bigint() - t0) / 1e6;
  t0 = process.hrtime.bigint(); const o2 = Fo.bankLapWith(Fo.bankLapWith(lap).doc); const t2o = Number(process.hrtime.bigint() - t0) / 1e6;
  console.log(`${name} (${lap.pieces.length} pieces, close()): press 1 OLD ${times.OLD.map((x) => x.toFixed(0)).join('/')} ms NEW ${times.NEW.map((x) => x.toFixed(0)).join('/')} ms; ${times.OLD_sha === times.NEW_sha ? 'BYTE-EQUAL' : 'DIFFER'} (${times.NEW_sha}); level OLD ${times.OLD_level} NEW ${times.NEW_level}`);
  console.log(`  press 2: NEW ${n2.doc === n1.doc ? 'same doc' : 'CHANGED'} in ${t2.toFixed(0)} ms (OLD ${o2.doc === Fo.bankLapWith(lap).doc ? 'same' : 'changed/other'} in ${t2o.toFixed(0)} ms, two presses)`);
}
