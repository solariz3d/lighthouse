// anchors.js (pane B, D226): does every mutation anchor in the harnesses that touch A's changed files still occur EXACTLY once? node anchors.js <tree>
'use strict';
const fs = require('fs'), path = require('path'), T = path.resolve(process.argv[2]);
const out = {};
const count = (file, from) => { const t = fs.readFileSync(file, 'utf8'); return t.split(from).length - 1; };
// app harnesses: entries { file: 'core/x.js', from: '...' } relative to app/
for (const h of ['app/test/core-mutation.test.js', 'app/test/core-xsec-mutation.test.js']) {
  const M = []; const src = fs.readFileSync(path.join(T, h), 'utf8');
  const re = /id: '((?:[^'\\]|\\.)*)', file: '([^']+)', from: ((?:'(?:[^'\\]|\\.)*')|(?:"(?:[^"\\]|\\.)*")|(?:`(?:[^`\\]|\\.)*`))/g; let m;
  while ((m = re.exec(src))) M.push({ id: m[1], file: m[2], from: eval(m[3]) });
  const bad = M.filter((x) => count(path.join(T, 'app', x.file), x.from) !== 1).map((x) => x.id);
  out[h] = { anchors: M.length, notOnce: bad };
}
// chord harness K13: edits [['app/core/coreshell.js', from, to]]
{ const src = fs.readFileSync(path.join(T, 'test/core_chord_mutation.test.js'), 'utf8'), m = src.match(/\['app\/core\/coreshell\.js', ('(?:[^'\\]|\\.)*')/);
  out['test/core_chord_mutation.test.js K13'] = { occurs: m ? count(path.join(T, 'app/core/coreshell.js'), eval(m[1])) : 'no anchor parsed' }; }
console.log(JSON.stringify(out));
