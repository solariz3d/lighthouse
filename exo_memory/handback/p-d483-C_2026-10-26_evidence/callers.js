// callers.js (C, D483): node callers.js <file.cpuprofile> <fn> <fileTail> [depth] — the inclusive ms of fn, split by the chain of its callers (depth frames up)
'use strict';
const fs = require('fs');
const [file, fn, tail, depth = '2'] = process.argv.slice(2);
const p = JSON.parse(fs.readFileSync(file, 'utf8')), byId = new Map(p.nodes.map((n) => [n.id, n])), parent = new Map();
for (const n of p.nodes) for (const c of n.children || []) parent.set(c, n.id);
const dt = new Map(); for (let i = 0; i < p.samples.length; i++) dt.set(p.samples[i], (dt.get(p.samples[i]) || 0) + (p.timeDeltas[i] || 0) / 1000);
const key = (n) => `${n.callFrame.functionName || '(anon)'} ${(n.callFrame.url || '').split('/').slice(-2).join('/')}:${n.callFrame.lineNumber + 1}`;
const by = new Map(); let total = 0;
for (const [id, ms] of dt) {
  const chain = []; let cur = id; while (cur !== undefined) { chain.push(byId.get(cur)); cur = parent.get(cur); }
  const i = chain.findIndex((n) => n.callFrame.functionName === fn && (n.callFrame.url || '').endsWith(tail)); if (i < 0) continue;
  total += ms; const k = chain.slice(i + 1, i + 1 + +depth).map(key).join(' < '); by.set(k, (by.get(k) || 0) + ms);
}
console.log(`${fn} ${tail}: ${total.toFixed(0)} ms`);
for (const [k, v] of [...by].sort((a, b) => b[1] - a[1]).slice(0, 12)) console.log(`  ${v.toFixed(0).padStart(5)} ms  < ${k}`);
