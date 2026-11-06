// L142 (pane C): measure.js = the glitch test's harness (B's mount, at a523589) + the item 2 and item 3 measurements. node gen.js <worktree>
const fs = require('fs'), path = require('path'), W = path.resolve(process.argv[2]).replace(/\\/g, '/');
let s = fs.readFileSync(path.join(W, 'app/test/core-extra-handles-glitches.test.js'), 'utf8');
s = s.slice(0, s.indexOf("test('L140 G1"));
s = s.split("require('../core/").join(`require('${W}/app/core/`).split("require('../../src/").join(`require('${W}/src/`);
s += fs.readFileSync(path.join(__dirname, 'body.js'), 'utf8').split('__W__').join(W);
fs.writeFileSync(path.join(__dirname, 'measure.js'), s); console.log('measure.js written');
