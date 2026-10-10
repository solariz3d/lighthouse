const fs = require('fs'), crypto = require('crypto'), tree = process.argv[2] + '/';
const D = require(tree + 'src/core/document.js'), { extend } = require(tree + 'src/core/extend.js');
const t = fs.readFileSync('C:/Users/nname/Desktop/a-d195-wt/test/core_ramp.test.js', 'utf8'), m = t.match(/const GOLDEN_CASES = (\[[\s\S]*?\n\]);/);
const cases = eval(m[1]), sha = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);
console.log(JSON.stringify(cases.map((steps) => sha(D.serialize(steps.reduce((d, a) => extend(d, a), D.createDoc('t')))))));
