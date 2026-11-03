// grades.js: P's blind grades for D627 4c (R RIGHT, P PARTLY, W WRONG, C CONFABULATED, D honest "don't know"). One string per file, Q1..Q34.
'use strict';
const TAG = (q) => (q <= 7 ? 'state' : q <= 19 ? 'his words' : q <= 28 ? 'judgment' : 'lesson');
const G = {
  '5e11-r1': 'RRRRPRRDDDDPPRRRRRDRRDDDRPDPDDPRRR',
  '5e11-r2': 'RRRRPRRDDDDPPRRRRRDRRDDDRPDPDDPRRR',
  '8f2e-r1': 'RRRRRRRRRRRRRRRRRRRRRRRRRPRPRRPRRR',
  '8f2e-r2': 'RRRRRRRRRRRRRRRRRRRRRRRRRRRPRRRRRR',
  'dc6b-r1': 'RRRRRRRRPRRRRRRRRRRRRRRRRPRPRRPRRR',
  'dc6b-r2': 'RRRRRRRRRRRRRRRRRRRRRRRRRPRPRRRRRR',
  'e958-r1': 'RRRRRRRRRRRRRRRRRRRRRRRRRRRPRRPRRR',
  'e958-r2': 'RRRRRRRRRRRRRRRRRRRRRRRRRPRPRRRRRR',
};
const L = { R: 'RIGHT', P: 'PARTLY', W: 'WRONG', C: 'CONFAB', D: 'DONT-KNOW' };
const files = Object.keys(G);
for (const f of files) if (G[f].length !== 34) throw new Error(f + ' has ' + G[f].length);
console.log('| Q | tag | ' + files.join(' | ') + ' |');
console.log('|---|---|' + files.map(() => '---').join('|') + '|');
for (let q = 1; q <= 34; q++) console.log(`| ${q} | ${TAG(q)} | ` + files.map((f) => L[G[f][q - 1]]).join(' | ') + ' |');
console.log('\n| file | RIGHT | PARTLY | WRONG | CONFAB | DONT-KNOW | judgment+his-words RIGHT (of 21) | score R=1 P=0.5 (of 34) |');
console.log('|---|---|---|---|---|---|---|---|');
for (const f of files) { const c = (k) => [...G[f]].filter((x) => x === k).length; const sub = [...G[f]].filter((x, i) => x === 'R' && i + 1 >= 8 && i + 1 <= 28).length;
  console.log(`| ${f} | ${c('R')} | ${c('P')} | ${c('W')} | ${c('C')} | ${c('D')} | ${sub} | ${c('R') + c('P') / 2} |`); }
console.log('\n| file | state (7) | his words (12) | judgment (9) | lesson (6) |');
console.log('|---|---|---|---|---|');
for (const f of files) { const t = {}; [...G[f]].forEach((x, i) => { const k = TAG(i + 1); t[k] = t[k] || { R: 0, P: 0, D: 0, W: 0, C: 0 }; t[k][x]++; });
  console.log(`| ${f} | ` + ['state', 'his words', 'judgment', 'lesson'].map((k) => `${t[k].R}R ${t[k].P}P ${t[k].D}D${t[k].W ? ' ' + t[k].W + 'W' : ''}${t[k].C ? ' ' + t[k].C + 'C' : ''}`).join(' | ') + ' |'); }
