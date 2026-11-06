// profincl.js <a.cpuprofile> <file-regex>: inclusive time per function in files matching the regex (each sample counted once per function on its stack)
const p = JSON.parse(require('fs').readFileSync(process.argv[2], 'utf8')), re = new RegExp(process.argv[3]), byId = new Map(p.nodes.map((n) => [n.id, n])), parent = new Map();
for (const n of p.nodes) for (const c of n.children || []) parent.set(c, n.id);
const incl = new Map(), dt = p.timeDeltas;
p.samples.forEach((id, i) => { const seen = new Set(); for (let x = id; x !== undefined; x = parent.get(x)) { const f = byId.get(x).callFrame, file = (f.url || '').split('/').pop(); if (!re.test(file)) continue; const k = `${f.functionName || '(anon)'} ${file}:${f.lineNumber + 1}`; if (seen.has(k)) continue; seen.add(k); incl.set(k, (incl.get(k) || 0) + (dt[i] || 0) / 1000); } });
for (const [k, v] of [...incl.entries()].sort((a, b) => b[1] - a[1]).slice(0, 16)) console.log(v.toFixed(1).padStart(8), 'ms ', k);
