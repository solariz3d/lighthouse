'use strict';
// D443 (O): what if rule 1 read the lean against the HORIZONTAL turn (κ with its world-up part removed, curved stations by |κh| > 1/600 m) instead of the 3-D
// curvature, which reads a crest as a lean out? A probe copy of the tree's finish.js (src/core/finish_hlean_probe_o.js, deleted after, never committed) changes
// closerLoad's lean only. It runs family.js's laps (pitched, tight) and his two tracks against that copy, under a heavy-run slot.
//   node hlean-probe.js <tree> <out prefix>
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const T = path.resolve(process.argv[2]), OUT = process.argv[3], SRC = path.join(T, 'src/core/finish.js'), PROBE = path.join(T, 'src/core/finish_hlean_probe_o.js');
require(path.join(__dirname, '..', '..', '..', 'consonance', 'tools', 'heavy-run.js')).hold({ cmd: 'O D443 probe: rule 1 against the horizontal turn (not a timing run)', tree: T });
let s = fs.readFileSync(SRC, 'utf8').replace(/\r\n/g, '\n');
const rep = (a, b) => { if (s.split(a).length !== 2) throw new Error(`anchor: ${a.slice(0, 80)}`); s = s.replace(a, b); };
rep(`    const km = Math.hypot(k[0], k[1], k[2]); if (km < 1 / 600) continue;
    curved++; if (Math.asin(Math.max(-1, Math.min(1, (q.U[0] * k[0] + q.U[1] * k[1] + q.U[2] * k[2]) / km))) < -LEAN_OUT_DEG * DEG) out++;`,
`    const km = Math.hypot(k[0], k[2]); if (km < 1 / 600) continue;
    curved++; if (Math.asin(Math.max(-1, Math.min(1, (q.U[0] * k[0] + q.U[2] * k[2]) / km))) < -LEAN_OUT_DEG * DEG) out++;`);
fs.writeFileSync(PROBE, s); process.on('exit', () => { try { fs.unlinkSync(PROBE); } catch (e) { /* gone */ } });
// family.js and figures.js read src/core/finish.js; run them against a shadow tree view by swapping the require through an env-free wrapper
const wrap = (script, args) => spawnSync(process.execPath, ['-e', `const Module = require('module'), path = require('path'), orig = Module._resolveFilename;
Module._resolveFilename = function (req, parent, ...rest) { const r = orig.call(this, req, parent, ...rest); return r === ${JSON.stringify(SRC)} ? ${JSON.stringify(PROBE)} : r; };
process.argv = [process.argv[0], ${JSON.stringify(script)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(script)});`], { encoding: 'utf8', maxBuffer: 1 << 26 });
for (const [name, script, args] of [['pitched', path.join(__dirname, 'family.js'), [T, 'pitched']], ['tight', path.join(__dirname, 'family.js'), [T, 'tight']], ['tracks', path.join(__dirname, 'figures.js'), [T, T, 'testtrack10-open,test10-open']]]) {
  const o = wrap(script, args); fs.writeFileSync(`${OUT}-${name}.out`, o.stdout + (o.stderr ? `\nERR ${o.stderr.slice(-600)}` : '')); console.log(`${name}: written (${o.status})`);
}
