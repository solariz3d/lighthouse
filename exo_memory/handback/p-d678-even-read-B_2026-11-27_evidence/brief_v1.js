// brief_v1.js: the V1 rows as a table; FAIL marks against the 0.01 m bar
'use strict';
const fs = require('fs');
const BAR = 0.01, f = (x) => (x === undefined ? '-' : typeof x === 'number' ? x.toFixed(4) : String(x));
for (const line of fs.readFileSync(process.argv[2], 'utf8').split(/\r?\n/)) {
  if (!line.trim()) continue;
  const o = JSON.parse(line), r = o.rule;
  const rl = `w ${r.w.rule}${r.w.movingW0 ? '*' : ''}${r.w.movingW1 ? '*' : ''} l ${r.l.rule} agree ${r.agree}`;
  const bad = [];
  if (o.laid) {
    if (o.wSpread > BAR) bad.push('wSpread'); if (o.heldRunU > BAR) bad.push('heldRunU'); if (o.heldMarU > BAR) bad.push('heldMarU');
    if (o.outside) bad.push('outside'); if (o.joints) bad.push('joints'); if (o.centre !== undefined && o.centre > BAR) bad.push('centre');
  }
  console.log([o.fx.padEnd(4), o.case.padEnd(13), o.hold.padEnd(5), `grabW ${o.grabW.join('/')}`, o.laid ? 'laid' : `NOT LAID: ${o.said}`, `spread ${f(o.wSpread)}`, `runU ${f(o.heldRunU)}@${o.heldRunUat}`, `marU ${f(o.heldMarU)}@${o.heldMarUat}`, `runS ${f(o.heldRunS)}`, `out ${f(o.outside)} jt ${f(o.joints)}`, `ctr ${f(o.centre)}`, rl, bad.length ? `FAIL ${bad.join(',')}` : 'ok'].join(' | '));
}
