// rank_layouts.js <dir>: joins O's every_installed_layout output (cargo_ignored_rows.txt) with key_census.js's ai flag (census_namefree.txt), names-free:
// the layouts by bytes to the page, the heaviest one the panel can pick (it needs an AI line), and the road of the layouts with none.
const fs = require('fs'), path = require('path'), d = process.argv[2] || __dirname, by = {}, ai = {};
for (const l of fs.readFileSync(path.join(d, 'cargo_ignored_rows.txt'), 'utf8').split(/\r?\n/)) { const m = /layout (\d+): (\d+) files.*?, (\d+) triangles, (\d+) batches, (\d+) bytes/.exec(l); if (m) by[m[1]] = { tris: +m[3], bytes: +m[5] }; }
for (const l of fs.readFileSync(path.join(d, 'census_namefree.txt'), 'utf8').split(/\r?\n/)) { const m = /^layout (\d+): ai=(\d)/.exec(l); if (m) ai[m[1]] = m[2] === '1'; }
const all = Object.entries(by).map(([n, v]) => ({ n: +n, ...v, ai: ai[n] }));
console.log(`layouts ${all.length}, with an AI line ${all.filter((x) => x.ai).length}`);
for (const x of all.slice().sort((a, b) => b.bytes - a.bytes).slice(0, 5)) console.log(`layout ${x.n}: ai ${x.ai ? 1 : 0}, ${x.tris} triangles, ${x.bytes} bytes`);
const tri = all.filter((x) => x.ai).sort((a, b) => b.tris - a.tris)[0], byt = all.filter((x) => x.ai).sort((a, b) => b.bytes - a.bytes)[0], none = all.filter((x) => !x.ai);
console.log(`pickable, most triangles: layout ${tri.n} (${tri.tris}); most bytes: layout ${byt.n} (${byt.bytes})`);
console.log(`no AI line: ${none.length} layouts, ${none.reduce((a, x) => a + x.tris, 0)} triangles of road`);
