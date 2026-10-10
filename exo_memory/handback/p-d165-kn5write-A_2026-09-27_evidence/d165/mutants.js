// D165 mutants on writeKn5, each on a COPY of the repo's src/, test/ and tools/ in a temp dir. Caught = the copied
// test/kn5write.test.js exits non-zero. The live repo is never written.
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const REPO = 'C:/Users/nname/Desktop/t180-track-builder';
const LIVE = path.join(REPO, 'src/export/kn5write.js');
const before = fs.readFileSync(LIVE, 'utf8');
const M = [
  ['M1 flip the V (the flip removed: v written as given)', 'vb.writeFloatLE(1 - UV[2 * v + 1], o + 28);', 'vb.writeFloatLE(UV[2 * v + 1], o + 28);'],
  ['M2 drop the transpose', null, null],   // the writer has no transpose to drop (see kn5write.js header); M2b is its inverse
  ['M2b add a transpose (matrix written column-major)', 'for (const x of n.matrix) out.f32(x);', 'for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) out.f32(n.matrix[r * 4 + c]);'],
  ['M3 swap the winding (a, c, b)', 'for (let k = 0; k < n.indices.length; k++) ib.writeUInt16LE(n.indices[k], 2 * k);', 'for (let k = 0; k < n.indices.length; k++) ib.writeUInt16LE(n.indices[k - (k % 3) + [0, 2, 1][k % 3]], 2 * k);'],
  ['M4 wrong string length (UTF-16 length, not UTF-8 bytes)', 'this.i32(b.length); this.parts.push(b);', 'this.i32(s.length); this.parts.push(b);'],
  ['M4b wrong string length (one byte too long)', 'this.i32(b.length); this.parts.push(b);', 'this.i32(b.length + 1); this.parts.push(b);'],
  ['M5 header says version 6 (with no extra int)', 'out.i32(5);\n', 'out.i32(6);\n'],
  ['M6 every prop into slot A', 'slots[p.value.length - 1] = p.value.slice();', 'slots[0] = [p.value[0]];'],
];
function copyDir(src, dst) { fs.mkdirSync(dst, { recursive: true }); for (const e of fs.readdirSync(src, { withFileTypes: true })) { const a = path.join(src, e.name), b = path.join(dst, e.name); if (e.isDirectory()) copyDir(a, b); else fs.copyFileSync(a, b); } }
const t = { listed: M.length, applied: 0, caught: 0, survived: [], na: [], nr: [] };
for (const [name, from, to] of M) {
  if (from === null) { t.na.push(name); console.log('NOT APPLIED', name, '- no transpose exists in the writer'); continue; }
  const top = fs.mkdtempSync(path.join(os.tmpdir(), 'd165m-'));
  for (const d of ['src', 'test', 'tools']) copyDir(path.join(REPO, d), path.join(top, d));
  const f = path.join(top, 'src/export/kn5write.js'), src = fs.readFileSync(f, 'utf8');
  if (src.split(from).length !== 2) { t.na.push(name); console.log('NOT APPLIED', name, '- anchor not found once'); fs.rmSync(top, { recursive: true, force: true }); continue; }
  fs.writeFileSync(f, src.replace(from, to)); t.applied++;
  const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', 'test/kn5write.test.js'], { cwd: top, encoding: 'utf8', timeout: 120000 });
  fs.rmSync(top, { recursive: true, force: true });
  const out = (r.stdout || '') + (r.stderr || ''), fail = /^# fail (\d+)/m.exec(out);
  if (!fail) { t.nr.push(name); console.log('NO RESULT', name, out.slice(-300)); continue; }
  if (r.status !== 0) { t.caught++; console.log('caught  ', name, `(${fail[1]} failing)`); } else { t.survived.push(name); console.log('SURVIVED', name); }
}
console.log(`${t.listed} listed · ${t.applied} applied · ${t.caught} caught · ${t.survived.length} survived · ${t.na.length} NOT APPLIED · ${t.nr.length} NO RESULT · live kn5write.js ${fs.readFileSync(LIVE, 'utf8') === before ? 'unchanged' : 'CHANGED'}`);
