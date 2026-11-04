const fs = require('fs'), path = require('path'); const dir = 'out-d399';
const R = fs.readdirSync(dir).filter((f) => f.endsWith('.json') && !f.startsWith('_') && !f.startsWith('trace')).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))).filter((r) => !r.error && r.work);
const key = (r) => { const m = /^(v047fix|d399fix|v047|d399)-(\w+)-(turn|stretch)-(\d+)-r(\d)/.exec(r.id); return m && { tree: m[1], look: m[2], kind: m[3], L: +m[4], rep: +m[5] }; };
const agg = {}; for (const r of R) { const k = key(r); if (!k) continue; const id = `${k.tree}|${k.look}|${k.kind}|${k.L}`; (agg[id] = agg[id] || []).push(r.work.script); }
const m = (a, f) => a.reduce((s, x) => s + x[f], 0) / a.length, sd = (a, f) => { const mu = m(a, f); return Math.sqrt(a.reduce((s, x) => s + (x[f] - mu) ** 2, 0) / a.length); };
const row = (id) => agg[id] ? { med: m(agg[id], 'median'), p95: m(agg[id], 'p95'), p99: m(agg[id], 'p99'), o69: m(agg[id], 'over69'), o42: m(agg[id], 'over42'), sdMed: sd(agg[id], 'median'), sdP95: sd(agg[id], 'p95'), n: agg[id].length } : null;
const out = [];
for (const [a, b, title] of [['v047', 'd399', 'as the trees are (no D404 fix in either)'], ['v047fix', 'd399fix', 'with the D404 fix in both']]) {
  out.push(`\n**${title}**\n| look, drag | ${a} median / p95 / p99 | ${b} median / p95 / p99 | difference median / p95 | frames >6.9 (${a} -> ${b}) | >4.2 | runs |\n|---|---|---|---|---|---|---|`);
  for (const [kind, L] of [['turn', 1000], ['turn', 2000], ['stretch', 1000]]) for (const look of ['aqua', 'skyline', 'glass', 'aurora', 'sigil']) {
    if (a.endsWith('fix') && kind === 'stretch') continue;
    const x = row(`${a}|${look}|${kind}|${L}`), y = row(`${b}|${look}|${kind}|${L}`); if (!x || !y) continue;
    const f = (v) => `${v.med.toFixed(1)} / ${v.p95.toFixed(1)} / ${v.p99.toFixed(1)}`, d = (p, q) => `${(q - p >= 0 ? '+' : '') + (q - p).toFixed(2)}`;
    out.push(`| ${look} ${kind} ${L} m | ${f(x)} | ${f(y)} | ${d(x.med, y.med)} / ${d(x.p95, y.p95)} | ${Math.round(100 * x.o69)}% -> ${Math.round(100 * y.o69)}% | ${Math.round(100 * x.o42)}% -> ${Math.round(100 * y.o42)}% | ${x.n}+${y.n} |`);
  }
}
// the run-to-run spread, for scale
const sp = Object.entries(agg).filter(([k]) => k.startsWith('v047fix|')).map(([k, v]) => `${k.split('|').slice(1).join(' ')}: sd of median ${sd(v, 'median').toFixed(2)}, sd of p95 ${sd(v, 'p95').toFixed(2)}`);
out.push('\nrun-to-run spread (3 runs each, v047fix): ' + sp.join('; '));
console.log(out.join('\n'));
