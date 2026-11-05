const W = 'C:/Users/nname/Desktop/worktrees/t180-d642-c3/', AD = require(W + 'src/core/adapter.js'), TB = require(W + 'src/core/turnby.js'), { extend } = require(W + 'src/core/extend.js'), D = require(W + 'src/core/document.js');
const C = require(process.argv[2]), doc = extend(D.createDoc('g'), { length: 1000, family: 'bowl' });
const built = (k) => TB.extendCorner(doc, C[k].options), a = built('1-minus90-alone'), b = built('2-minus90-extra-turn-0');
console.log('the laid piece, byte for byte:', JSON.stringify(a.pieces[1]) === JSON.stringify(b.pieces[1]) ? 'IDENTICAL' : 'DIFFERENT');
console.log('the built path segments:', JSON.stringify(AD.toPath(a).segments) === JSON.stringify(AD.toPath(b).segments) ? 'IDENTICAL' : 'DIFFERENT');
