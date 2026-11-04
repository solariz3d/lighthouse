// survey.js: READ ONLY. The gate's own decide() on REAL directories of ours, to see what it WOULD refuse. Nothing is deleted: decide() only lstat's and reads directories.
const fs = require('fs'), path = require('path');
const { decide } = require('C:/Users/nname/Desktop/lighthouse/consonance/hooks/delete-gate.js');
const rows = [];
const probe = (label, dir) => { if (!fs.existsSync(dir)) return; const t0 = Date.now(), d = decide(`rm -rf "${dir}"`, 'C:/'); rows.push({ label, dir, decision: d.decision, links: (d.hits || []).slice(0, 3).map((h) => `${path.relative(dir, h.link) || '.'} -> ${h.to}`), ms: Date.now() - t0 }); };
const W = 'C:/Users/nname/Desktop/worktrees';
for (const n of fs.readdirSync(W)) probe('worktree ' + n, path.join(W, n));
// scratchpads of the sessions on this machine (they hold build targets, copies, node installs)
const T = 'C:/Users/nname/AppData/Local/Temp/claude';
for (const proj of fs.existsSync(T) ? fs.readdirSync(T) : []) { const pp = path.join(T, proj); let sess = []; try { sess = fs.readdirSync(pp); } catch (_) { continue; } for (const s of sess) { const sp = path.join(pp, s, 'scratchpad'); probe('scratchpad ' + proj.slice(-22) + '/' + s.slice(0, 8), sp); } }
// node_modules directories under the Desktop projects (depth <= 4)
const found = [];
const walk = (d, depth) => { if (depth > 4) return; let ents; try { ents = fs.readdirSync(d, { withFileTypes: true }); } catch (_) { return; } for (const e of ents) { if (!e.isDirectory() || e.isSymbolicLink()) continue; const p = path.join(d, e.name); if (e.name === 'node_modules') { found.push(p); continue; } if (e.name === '.git' || e.name === 'target') continue; walk(p, depth + 1); } };
walk('C:/Users/nname/Desktop', 0);
for (const p of found) probe('node_modules', p);
const by = {}; for (const r of rows) by[r.decision] = (by[r.decision] || 0) + 1;
console.log('probed', rows.length, JSON.stringify(by)); for (const r of rows.filter((x) => x.decision !== 'allow')) console.log('  ', r.decision, r.label, r.dir.slice(-70), JSON.stringify(r.links)); console.log('slowest ms:', Math.max(...rows.map((r) => r.ms)));
console.log('node_modules found:', found.length); for (const r of rows.filter((x) => x.label === 'node_modules')) console.log('  ', r.decision, r.dir.slice(-80), r.ms + ' ms');
fs.writeFileSync(path.join(__dirname, 'survey_rows.json'), JSON.stringify(rows, null, 1));
