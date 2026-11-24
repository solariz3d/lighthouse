'use strict';
// q6: a drag, frame by frame: mark 1 of a three-mark list dragged from 45 to 125 m by 1 m; the time of each extend (lays or refuses), and how many extends a refusal's room search makes
const D = require('./t/src/core/document.js'), EX = require('./t/src/core/extend.js');
const DEG = Math.PI / 180, lead = EX.extend(D.createDoc('p'), { length: 300, family: 'bowl', first: { w: 33 } });
let calls = 0; const orig = EX.extend;
const rows = [];
for (let at = 45; at <= 125; at += 1) {
  const o = { length: 300, targets: { phi: 29.2 * DEG }, transition: { phi: 23.2 }, bankShape: 'flow', through: { phi: [{ at: 40.9, target: -11.2 * DEG }, { at, target: 25.2 * DEG }, { at: at + 17.4, target: 20.6 * DEG }] } };
  const t0 = performance.now(); let r; try { orig(lead, o); r = 'lays'; } catch (e) { r = e instanceof D.CoreError ? 'refused' : 'THROW'; }
  rows.push({ at, r, ms: performance.now() - t0 });
}
const sum = (f) => rows.filter(f).map((x) => x.ms);
const st = (a) => { const s = [...a].sort((x, y) => x - y); return a.length ? `n ${a.length}, median ${s[s.length >> 1].toFixed(0)} ms, max ${s[s.length - 1].toFixed(0)} ms, total ${a.reduce((x, y) => x + y, 0).toFixed(0)} ms` : '-'; };
console.log('drag frames laid:    ' + st(sum((x) => x.r === 'lays')));
console.log('drag frames refused: ' + st(sum((x) => x.r === 'refused')));
console.log('throws: ' + rows.filter((x) => x.r === 'THROW').length);
console.log(rows.map((x) => (x.r === 'lays' ? '#' : '.')).join(''));
