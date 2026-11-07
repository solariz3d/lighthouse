// isodump.js <tree> <out.json>: a copy of <tree>'s app/test/export-isolated.test.js whose row 1 also writes every file's sha256 and every kn5's nodes
// (the tree's test/fixtures/kn5nodes.js) to <out.json>; only row 1 runs; the copy is removed after.
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const T = path.resolve(process.argv[2]), OUT = path.resolve(process.argv[3]);
const src = path.join(T, 'app/test/export-isolated.test.js'), tmp = path.join(T, 'app/test/_isodump.test.js');
let s = fs.readFileSync(src, 'utf8');
const hook = "  if (process.env.PRINT_D437B) console.log('D437B PIN', JSON.stringify({ lap, open }));";
if (s.split(hook).length !== 2) throw new Error('hook not found once');
s = s.replace("const s = await pitLap({ exporter: ex }), lap = digestOf(s.buildExport({ textures: asphaltOf(s) }));", "const s = await pitLap({ exporter: ex }), lapOut = s.buildExport({ textures: asphaltOf(s) }), lap = digestOf(lapOut);")
  .replace("const o = await openRun({ exporter: ex }), open = digestOf(o.buildExport({ test: true }));", "const o = await openRun({ exporter: ex }), openOut = o.buildExport({ test: true }), open = digestOf(openOut);")
  .replace(hook, hook + `
  { const { kn5Nodes } = require('../../test/fixtures/kn5nodes.js'), d = {};
    for (const [nm, out] of [['lap', lapOut], ['open', openOut]]) { d[nm] = {}; for (const f of out.folders) for (const file of f.files) { const b = Buffer.from(file.bytes.buffer, file.bytes.byteOffset, file.bytes.byteLength);
      d[nm][f.folder + '/' + file.path] = { sha: crypto.createHash('sha256').update(b).digest('hex'), ...(file.path.endsWith('.kn5') ? { nodes: kn5Nodes(b) } : {}) }; } }
    fs.writeFileSync(${JSON.stringify(OUT)}, JSON.stringify(d)); }`);
if (!s.includes('lapOut = ') || !s.includes('openOut = ')) throw new Error('row 1 not patched');
fs.writeFileSync(tmp, s);
try {
  const r = spawnSync(process.execPath, ['--test', '--test-name-pattern=row 1:', '--test-reporter=spec', tmp], { cwd: T, encoding: 'utf8', windowsHide: true });
  console.log((r.stdout + r.stderr).split('\n').filter((l) => /D437B|row 1|tests|pass|fail/.test(l)).join('\n'));
} finally { fs.rmSync(tmp, { force: true }); }
