// profsum.js <a.cpuprofile>: self time by function (top 14), over the whole profile
const p = JSON.parse(require('fs').readFileSync(process.argv[2], 'utf8')), self = new Map(), byId = new Map(p.nodes.map((n) => [n.id, n]));
const dt = p.timeDeltas, s = p.samples; for (let i = 0; i < s.length; i++) { const n = byId.get(s[i]), f = n.callFrame, k = `${f.functionName || '(anon)'} ${(f.url || '').split('/').pop()}:${f.lineNumber + 1}`; self.set(k, (self.get(k) || 0) + (dt[i] || 0) / 1000); }
for (const [k, v] of [...self.entries()].sort((a, b) => b[1] - a[1]).slice(0, 14)) console.log(v.toFixed(1).padStart(8), 'ms ', k);
