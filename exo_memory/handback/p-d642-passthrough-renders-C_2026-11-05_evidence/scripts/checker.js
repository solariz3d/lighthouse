const W = 'C:/Users/nname/Desktop/worktrees/t180-d642-c3/', V = require(W + 'src/validate/index.js'), AD = require(W + 'src/core/adapter.js'), TB = require(W + 'src/core/turnby.js');
const { extend } = require(W + 'src/core/extend.js'), D = require(W + 'src/core/document.js'), fs = require('fs');
const cases = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
for (const [name, c] of Object.entries(cases)) {
  const doc = extend(D.createDoc('g'), { length: 1000, family: 'bowl' }), dc = TB.extendCorner(doc, c.options), tp = AD.toPath(dc), v = V.validate(tp.path, tp.segments);
  const keys = Object.keys(v); const list = v.ranges || v.findings || v.issues || v.reds || null;
  console.log(name, '| keys', keys.join(','), '| red', JSON.stringify(v.red || v.reds || null).slice(0, 200), '| amber', JSON.stringify(v.amber || v.ambers || null).slice(0, 200));
}
const b = cases['3-his-p2-extra-turn-plus180-bank-back'].bank; console.log('case 3 bank, s: deg', b.filter(([s]) => s >= 450 && s <= 620).map(([s, d]) => `${s}:${d}`).join(' '));
