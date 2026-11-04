// idonly.js <repo> <file> <rev>: the comment-stripped code of <file> at <rev> and in the working tree, with the four renamed mutant ids mapped back
// (M-KEYa..d -> M-D584a..d): EQUAL means the ONLY code change is those four id strings.
'use strict';
const path = require('path'), { execFileSync } = require('child_process'), fs = require('fs');
const [, , REPO, FILE, REV] = process.argv;
const J = require(path.join(__dirname, '..', 'd578', 'jsscan.js'));
const strip = (t) => J.strip(t.replace(/\r\n/g, '\n'));
const before = strip(execFileSync('git', ['-C', REPO, 'show', `${REV}:${FILE}`], { encoding: 'utf8' }));
const nowRaw = fs.readFileSync(path.join(REPO, FILE), 'utf8'), now = strip(nowRaw);
const back = now.replace(/M-KEY([a-d]) /g, 'M-D584$1 ');
console.log(`ids renamed in code: ${(now.match(/M-KEY[a-d] /g) || []).length}; code equal with them mapped back: ${back === before ? 'EQUAL' : 'DIFFERS'}; code equal as is: ${now === before ? 'EQUAL' : 'DIFFERS'}`);
