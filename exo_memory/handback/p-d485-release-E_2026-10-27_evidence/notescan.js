// notescan.js (D485, pane E): counts only, over a text file: the public word, the home path, credential shapes, A's priv.txt alternatives, pane E's term list
'use strict';
const fs = require('fs');
const S = 'C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-07b8a48f/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/';
const A = 'C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-3d57124e/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/d457/priv.txt';
const t = fs.readFileSync(process.argv[2], 'utf8'), low = t.toLowerCase();
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const c = { publicWord: low.split('kee' + 'per').length - 1, home: (t.match(/users[\\/]+nname/gi) || []).length,
  cred: (t.match(new RegExp(['sk' + '-or-', 'vc' + 'k_', 'sk' + '-ant-'].join('|'), 'g')) || []).length,
  privA: fs.readFileSync(A, 'utf8').trim().split('|').map((x) => (t.match(new RegExp(x, 'gi')) || []).length),
  myList: require(S + 'd161/private_terms.json').map((x) => (t.match(new RegExp(esc(x), 'gi')) || []).length) };
console.log(JSON.stringify(c));
