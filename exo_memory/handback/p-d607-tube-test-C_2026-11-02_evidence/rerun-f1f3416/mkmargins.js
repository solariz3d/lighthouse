// builds margins.js: the test's own fixture() and helpers, with the rows replaced by margin reads. node mkmargins.js <worktree>
const fs = require('fs'), path = require('path');
const wt = process.argv[2];
let src = fs.readFileSync(path.join(wt, 'test/tube_cases.test.js'), 'utf8');
src = src.replace("const test = require('node:test');", 'const test = () => {};').split("require('../").join(`require('${wt}/`).replace("path.join(__dirname, 'fixtures'", `path.join('${wt}/test', 'fixtures'`);
src += '\n' + fs.readFileSync(path.join(__dirname, 'margins-body.js'), 'utf8');
fs.writeFileSync(path.join(__dirname, 'margins.js'), src);
