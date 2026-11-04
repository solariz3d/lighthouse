'use strict';
// D447 §9 (O): his five copies closed by the page's press in two trees, the closed lap's document compared byte for byte (sha256 of its JSON) and the report word
// for word. Inputs read only.   node copies-bytes.js <tree A> <tree B> <librarian scratchpad>   (cwd: tree B, for fixtures-d431)
const path = require('path'), fs = require('fs'), crypto = require('crypto');
const [A, B, LIB] = process.argv.slice(2).map((p) => path.resolve(p));
require(path.join(__dirname, '..', '..', '..', 'consonance', 'tools', 'heavy-run.js')).hold({ cmd: 'd447 copies-bytes (five Close presses in two trees)' });
const COPIES = [['TEST TRACK 10 open', path.join(B, 'fixtures-d431/testtrack10-open.t180track'), 'open'], ['TEST 10 open', path.join(B, 'fixtures-d431/test10-open.t180track'), 'open'],
  ['TEST TRACK 10 reopened', path.join(LIB, 'd434/eq-TEST TRACK 10.t180track'), 'reopen'], ['TEST 10 reopened', path.join(LIB, 'd431/eq-TEST 10.t180track'), 'reopen'], ['ELYSIUM reopened', path.join(LIB, 'd437/eq-ELYSIUM.t180track'), 'reopen']];
const press = (T, file, mode) => { const D = require(path.join(T, 'src/core/document.js')), CJ = require(path.join(T, 'app/core/closejob.js'));
  const s = D.parse(fs.readFileSync(file, 'utf8')), open = mode === 'reopen' ? D.checkDoc({ ...s, closed: false }) : s, r = CJ.runCloseBest({ doc: open });
  return { sha: crypto.createHash('sha256').update(JSON.stringify(r.doc)).digest('hex').slice(0, 16), report: r.report }; };
for (const [name, file, mode] of COPIES) { const a = press(A, file, mode), b = press(B, file, mode);
  console.log(`${name}: sha256 ${a.sha} | ${b.sha}  ${a.sha === b.sha ? 'IDENTICAL' : 'DIFFER'}; report ${a.report === b.report ? 'IDENTICAL' : `DIFFERS: "${a.report}" | "${b.report}"`}`); }
