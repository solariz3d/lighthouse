// fix-m22.js: rewrite ownmut.js's M22-M25 entries on one line each, mutating only the return expression (no newline in the anchor)
'use strict';
const fs = require('fs'), f = __dirname + '/ownmut.js';
let s = fs.readFileSync(f, 'utf8');
const start = s.indexOf("  ['M22 "), end = s.indexOf('];\nlet applied = 0');
if (start < 0 || end < start) throw new Error('anchors ' + start + ' ' + end);
const from = "return path.join(os.homedir(), '.consonance');   // D454: the app's third step (main.rs default_data), so a new user's";
const to = "return null;   // D454: the app's third step (main.rs default_data), so a new user's";
const rows = [[22, 'ask-ending'], [23, 'second-reader'], [24, 'push-gate'], [25, 'delete-gate']]
  .map(([n, g]) => '  ' + JSON.stringify([`M${n} ${g}: no third step`, `consonance/hooks/${g}.js`, from, to, `consonance/hooks/${g}.test.js`]) + ',');
s = s.slice(0, start) + rows.join('\n') + '\n' + s.slice(end);
fs.writeFileSync(f, s);
console.log('rewrote M22-M25');
