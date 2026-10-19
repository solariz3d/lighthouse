// cond.js <outdir>: a condensed table (script ms of the work frames: median / p95 / p99, share over 6.9 and over 4.2 ms)
const fs = require('fs'), path = require('path'); const dir = process.argv[2];
const R = fs.readdirSync(dir).filter((f) => f.endsWith('.json') && !f.startsWith('_')).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
const f = (r) => r.work ? `${r.work.script.median} / ${r.work.script.p95} / ${r.work.script.p99} | ${Math.round(100 * r.work.script.over69)}% | ${Math.round(100 * r.work.script.over42)}%` : 'n/a';
const pick = (pre) => R.filter((r) => r.id.startsWith(pre) && !r.error).sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
const pool = (rs) => { const s = rs.map((r) => r.work && r.work.script).filter(Boolean); const m = (k) => +(s.reduce((a, x) => a + x[k], 0) / s.length).toFixed(1); return s.length ? { median: m('median'), p95: m('p95'), p99: m('p99'), over69: s.reduce((a, x) => a + x.over69, 0) / s.length, over42: s.reduce((a, x) => a + x.over42, 0) / s.length } : null; };
const line = (name, rs) => { const p = pool(rs); return p ? `| ${name} | ${p.median} / ${p.p95} / ${p.p99} | ${Math.round(100 * p.over69)}% | ${Math.round(100 * p.over42)}% | ${rs.length} |` : `| ${name} | n/a | | | |`; };
const H = '| case | median / p95 / p99 ms | frames > 6.9 ms | > 4.2 ms | runs |\n|---|---|---|---|---|';
const out = [];
for (const L of [1000, 2000]) { const rows = []; for (const kind of ['turn', 'stretch']) for (const look of ['aqua', 'skyline', 'glass', 'aurora', 'sigil']) { const r2 = R.filter((r) => !r.error && (r.id.startsWith(`looks-${look}-${kind}-${L}-r`) || (L === 1000 && r.id.startsWith(`looks-${look}-${kind}-1000-r`)))); if (r2.length) rows.push(line(`${look} ${kind} ${L} m`, r2)); } if (rows.length) out.push(`\n**Looks, ${L} m**\n${H}\n${rows.join('\n')}`); }
out.push(`\n**Ladder (aqua)**\n${H}\n${[100, 500, 1000, 2000, 5000, 10000, 20000].flatMap((L) => ['turn', 'stretch'].map((k) => line(`${k} ${L} m`, R.filter((r) => !r.error && r.id === `ladder-aqua-${k}-${L}`)))).join('\n')}`);
out.push(`\n**Blur and animation off, 1000/2000 m turn**\n${H}\n${R.filter((r) => r.id.startsWith('noblur-') && !r.error).sort((a, b) => a.id.localeCompare(b.id)).map((r) => line(r.id, [r])).join('\n')}`);
const old = R.filter((r) => r.id.startsWith('old-') && !r.error).sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
if (old.length) out.push(`\n**Older releases, 1000 m, default look**\n${H}\n${old.map((r) => line(r.id.replace('old-', ''), [r])).join('\n')}`);
console.log(out.join('\n'));
