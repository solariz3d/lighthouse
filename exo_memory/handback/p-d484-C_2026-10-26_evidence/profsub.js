// profsub.js (C, D482): node profsub.js <file.cpuprofile> <rootFn> <rootFileTail> — within the samples whose stack passes through rootFn in a file ending rootFileTail:
// the ms under it, its direct callees' inclusive ms, the top self ms, and the top inclusive ms of every function below it.
'use strict';
const fs = require('fs');
const [file, rootFn, rootTail] = process.argv.slice(2);
const p = JSON.parse(fs.readFileSync(file, 'utf8')), byId = new Map(p.nodes.map((n) => [n.id, n])), parent = new Map();
for (const n of p.nodes) for (const c of n.children || []) parent.set(c, n.id);
const dt = new Map(); for (let i = 0; i < p.samples.length; i++) dt.set(p.samples[i], (dt.get(p.samples[i]) || 0) + (p.timeDeltas[i] || 0) / 1000);
const total = [...dt.values()].reduce((a, b) => a + b, 0);
const key = (n) => `${n.callFrame.functionName || '(anon)'} ${(n.callFrame.url || '').split('/').slice(-2).join('/')}:${n.callFrame.lineNumber + 1}`;
const isRoot = (n) => n.callFrame.functionName === rootFn && (n.callFrame.url || '').endsWith(rootTail);
let under = 0; const direct = new Map(), self = new Map(), incl = new Map();
for (const [id, ms] of dt) {
  const chain = []; let cur = id; while (cur !== undefined) { chain.push(byId.get(cur)); cur = parent.get(cur); }
  const ri = chain.findIndex(isRoot); if (ri < 0) continue;   // chain[0] is the leaf; chain[ri] the root frame
  under += ms;
  const below = chain.slice(0, ri);
  const d = ri > 0 ? key(chain[ri - 1]) : '(self)'; direct.set(d, (direct.get(d) || 0) + ms);
  const leaf = below.length ? key(below[0]) : '(root self)'; self.set(leaf, (self.get(leaf) || 0) + ms);
  const seen = new Set(); for (const n of below) { const k = key(n); if (!seen.has(k)) { seen.add(k); incl.set(k, (incl.get(k) || 0) + ms); } }
}
const pc = (v) => `${v.toFixed(0).padStart(6)} ms ${(100 * v / under).toFixed(1).padStart(5)}%`;
console.log(`total sampled ${total.toFixed(0)} ms; under ${rootFn} ${rootTail}: ${under.toFixed(0)} ms`);
console.log('DIRECT callees:'); for (const [k, v] of [...direct].sort((a, b) => b[1] - a[1]).slice(0, +(process.env.TOPN || 10))) console.log(`  ${pc(v)}  ${k}`);
console.log('INCLUSIVE below, top 18:'); for (const [k, v] of [...incl].sort((a, b) => b[1] - a[1]).slice(0, 18)) console.log(`  ${pc(v)}  ${k}`);
console.log('SELF, top 10:'); for (const [k, v] of [...self].sort((a, b) => b[1] - a[1]).slice(0, +(process.env.TOPN || 10))) console.log(`  ${pc(v)}  ${k}`);
