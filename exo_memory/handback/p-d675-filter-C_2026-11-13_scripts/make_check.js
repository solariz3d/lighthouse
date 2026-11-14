// make_check.js: writes check.js (the pacing check, D675, the chair's 01:28Z order) from row C's driver (pane P's bench.js,
// adapted): the SAME method, DEFAULTS only, ONE run each of three builds (a: 31d1c6d on G:; b: main 81eb524; c: the
// filter branch), in that order, each from a copy of its own tree's game/config with flashlight = 1; no retry; frames
// drawn against paced reported, the p99 beside. Each tree's HEAD and the exe are checked before and after.
'use strict';
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', 'rowc', 'bench.js'), 'utf8');
let s = src;
const rep = (a, b) => { if (s.split(a).length !== 2) throw new Error('anchor: ' + a.slice(0, 80)); s = s.replace(a, () => b); };

rep("const CLONE = 'C:/Users/nname/Desktop/worktrees/dz3-filter-c', EXE = path.win32.join(CLONE, 'build', 'bin', 'dz-world.exe');",
`const TARGETS = [
  { key: 'a-31d1c6d', clone: 'G:/consonance-scratch/c-d675-pacing/wt-31d1c6d', head: '31d1c6d' },
  { key: 'b-main-81eb524', clone: 'C:/Users/nname/Desktop/worktrees/dz3-land-tell', head: '81eb524' },
  { key: 'c-filter-4e90b03', clone: 'C:/Users/nname/Desktop/worktrees/dz3-filter-c', head: '4e90b03' },
];
for (const t of TARGETS) t.exe = path.win32.join(t.clone, 'build', 'bin', 'dz-world.exe');
let CLONE = TARGETS[0].clone, EXE = TARGETS[0].exe;`);
rep("const ARMS = { defaults: [], filter: ['light_filter = 3', 'light_filter_kernel = 3'] };", "const ARMS = { defaults: [] };");
rep("for (let r = 1; r <= 3; r++) for (const a of ['defaults', 'filter']) ORDER.push(a);\nORDER.push('defaults');", "for (const t of TARGETS) ORDER.push(t.key);");
// every tree's HEAD and exe, before and after; per-target config dirs
rep(/const state = \(\) => [^\n]*\n/.exec(s)[0], "const state = () => TARGETS.map((t) => t.key + ': ' + execFileSync('git', ['-C', t.clone, 'status', '--porcelain'], { encoding: 'utf8', windowsHide: true }).trim()).join('\\n');\n");
rep(/const head = execFileSync[^\n]*\n/.exec(s)[0], "const head = TARGETS.map((t) => execFileSync('git', ['-C', t.clone, 'rev-parse', 'HEAD'], { encoding: 'utf8', windowsHide: true }).trim()).join(' ');\n");
rep(/if \(!head\.startsWith\([^\n]*\n/.exec(s)[0], "for (const t of TARGETS) { const h = execFileSync('git', ['-C', t.clone, 'rev-parse', 'HEAD'], { encoding: 'utf8', windowsHide: true }).trim(); if (!h.startsWith(t.head)) { log(`STOP: ${t.key} at ${h}`); process.exit(2); } }\n");
rep("const exeStat = () => { const s = fs.statSync(EXE); return `${s.size} bytes, mtime ${s.mtime.toISOString()}`; };",
    "const exeStat = () => TARGETS.map((t) => { const s = fs.statSync(t.exe); return `${t.key} ${s.size} bytes, mtime ${s.mtime.toISOString()}`; }).join('; ');");
rep("for (const [arm, lines] of Object.entries(ARMS)) {\n  const dir = path.join(O, 'cfg-' + arm);",
    "for (const t of TARGETS) {\n  const arm = t.key, lines = ARMS.defaults, CLONE = t.clone;\n  const dir = path.join(O, 'cfg-' + arm);");
// the run uses its target's exe and tree
rep("async function runOnce(arm, k, attempt) {", "async function runOnce(arm, k, attempt) {\n  const T = TARGETS.find((t) => t.key === arm); const EXE = T.exe, CLONE = T.clone;");
rep("for (let attempt = 1; attempt <= 3 && !ok; attempt++)", "for (let attempt = 1; attempt <= 1 && !ok; attempt++)");
rep("if (!ok) log(`${ORDER[k]} run ${k + 1}: void three times; left void`);", "if (!ok) log(`${ORDER[k]} run ${k + 1}: one run, as ordered; its reason is on its line`);");
s = s.replace(/^\/\/ bench\.js \(D675, pane C, row C[^\n]*\n/, '// check.js (D675, pane C, the pacing check; written by make_check.js from row C\'s driver):\n');
fs.writeFileSync(path.join(__dirname, 'check.js'), s);
console.log('check.js written');
