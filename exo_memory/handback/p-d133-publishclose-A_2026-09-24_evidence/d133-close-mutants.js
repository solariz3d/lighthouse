// D133 close.js mutants, on COPIES of consonance/tools (close.test.js needs state-sync.js beside it).
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const REPO = 'C:/Users/nname/Desktop/lighthouse';
const LIVE = path.join(REPO, 'consonance/tools/close.js');
const before = fs.readFileSync(LIVE, 'utf8');
const M = [
  ['C1 the head is never consulted (the old false green)', "  if (!head || heads.every((m) => m.commit === head)) return 'in sync: '", "  if (true) return 'in sync: '"],
  ['C2 behind and head swapped', "    : m.commit === head ? `${m.machine} ${m.commit} (head)` : `${m.machine} behind — last pushed ${m.commit}`", "    : m.commit !== head ? `${m.machine} ${m.commit} (head)` : `${m.machine} behind — last pushed ${m.commit}`"],
  ['C3 never-pushed read as behind', "  return 'NOT in sync: ' + heads.map((m) => (!m.commit ? `${m.machine} never pushed`", "  return 'NOT in sync: ' + heads.map((m) => (false ? `${m.machine} never pushed`"],
  ['C4 the NOT line says "in sync"', "  return 'NOT in sync: ' + heads.map(", "  return 'in sync: ' + heads.map("],
  ['C5 finish() prints the old line again', "  out('  ' + syncLine(heads, head.ok ? head.out : null));", "  out('  in sync: ' + heads.map((m) => `${m.machine} ${m.commit || 'never'}`).join(' · '));"],
  ['C6 no-head case claims NOT in sync', "  if (!head || heads.every((m) => m.commit === head))", "  if (heads.every((m) => m.commit === head))"],
];
function copyDir(src, dst) { fs.mkdirSync(dst, { recursive: true }); for (const e of fs.readdirSync(src, { withFileTypes: true })) { const a = path.join(src, e.name), b = path.join(dst, e.name); if (e.isDirectory()) copyDir(a, b); else fs.copyFileSync(a, b); } }
const t = { listed: M.length, applied: 0, caught: 0, survived: [], na: [], nr: [] };
for (const [name, from, to] of M) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'd133c-'));
  copyDir(path.join(REPO, 'consonance/tools'), path.join(root, 'consonance/tools'));
  fs.copyFileSync(path.join(REPO, 'consonance/state-manifest.json'), path.join(root, 'consonance/state-manifest.json'));
  const tf = path.join(root, 'consonance/tools/close.js'), src = fs.readFileSync(tf, 'utf8');
  if (!src.includes(from)) { t.na.push(name); console.log('NOT APPLIED', name); continue; }
  fs.writeFileSync(tf, src.replace(from, to)); t.applied++;
  const r = spawnSync(process.execPath, [path.join(root, 'consonance/tools/close.test.js')], { encoding: 'utf8', timeout: 300000 });
  const m = /close\.test\.js: (\d+) passed, (\d+) failed/.exec((r.stdout || '') + (r.stderr || ''));
  if (!m) { t.nr.push(name); console.log('NO RESULT', name); continue; }
  if (+m[2] > 0) { t.caught++; console.log('caught  ', name, `(${m[2]} red)`); } else { t.survived.push(name); console.log('SURVIVED', name); }
}
console.log(`${t.listed} listed · ${t.applied} applied · ${t.caught} caught · ${t.survived.length} survived · ${t.na.length} NOT APPLIED · ${t.nr.length} NO RESULT · live file ${fs.readFileSync(LIVE, 'utf8') === before ? 'unchanged' : 'CHANGED'}`);
