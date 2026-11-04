// mutants.js — D081. Each mutant: a FRESH throwaway checkout (git init) holding dev/diversity/{score.mjs,
// score-portable.mjs, score-portable.test.js, phase-window.js}, the mutant applied to ONE file, the FAST checks run.
// Anchor must match exactly once or NOT APPLIED; a syntax error is INVALID (node --check), never caught.
const fs = require('fs'), path = require('path'), os = require('os');
const { spawnSync, execFileSync } = require('child_process');
const R = 'C:/Users/nname/Desktop/lighthouse/dev/diversity';
const FILES = ['score.mjs', 'score-portable.mjs', 'score-portable.test.js', 'phase-window.js'];
const P = 'score-portable.mjs', O = 'score.mjs';
const MUT = [
  ['C0', 'control: no change', P, 'const REPO = (() => {', 'const REPO = (() => {'],
  ['M1', 'silent fallback to the old hard-coded path', P, "  throw new Error(`no repo root:", "  return 'C:/Users/nname/Desktop/lighthouse'; throw new Error(`no repo root:"],
  ['M2', 'LIGHTHOUSE_REPO ignored', P, 'const fromEnv = process.env.LIGHTHOUSE_REPO;', 'const fromEnv = undefined;'],
  ['M3', 'LIGHTHOUSE_REPO not validated', P, "    if (!ok(fromEnv)) throw", "    if (false) throw"],
  ['M4', 'the checkout it sits in not consulted', P, '  if (ok(top)) return top;', ''],
  ['M5', 'a second change elsewhere in the scorer (window 1800 -> 1801)', P, 'const WIN = 1800;', 'const WIN = 1801;'],
  ['M6', 'the HASHED ORIGINAL edited (a comment)', O, "const REPO = 'C:/Users/nname/Desktop/lighthouse';", "const REPO = 'C:/Users/nname/Desktop/lighthouse'; //"],
  ['M7', 'a git root accepted without phase-window.js', P, '  if (ok(top)) return top;', '  if (top) return top;'],
  ['X8', 'control: an anchor that is not in the file', P, 'THIS IS NOT IN THE FILE', 'x'],
];
const base = fs.mkdtempSync(path.join(os.tmpdir(), 'd081-mut-'));
const out = [];
for (const [id, desc, file, a, b] of MUT) {
  const src = fs.readFileSync(path.join(R, file), 'utf8');
  const n = src.split(a).length - 1;
  if (n !== 1) { out.push(`NOT APPLIED  ${id}  ${desc}  (anchor x${n})`); continue; }
  const root = path.join(base, id), dd = path.join(root, 'dev', 'diversity');
  fs.mkdirSync(dd, { recursive: true });
  for (const f of FILES) fs.copyFileSync(path.join(R, f), path.join(dd, f));
  fs.writeFileSync(path.join(dd, file), src.replace(a, () => b));
  execFileSync('git', ['init', '-q', root]);
  if (spawnSync(process.execPath, ['--check', path.join(dd, file)]).status !== 0) { out.push(`INVALID      ${id}  ${desc}`); continue; }
  const r = spawnSync(process.execPath, [path.join(dd, 'score-portable.test.js')], { encoding: 'utf8', env: { ...process.env, LIGHTHOUSE_REPO: '' } });
  const failed = (r.stdout.match(/^ {2}FAIL .*/gm) || []).map((l) => l.replace(/^ {2}FAIL /, ''));
  out.push(failed.length ? `caught       ${id}  ${desc}\n               by: ${failed.join(' | ')}` : `SURVIVED     ${id}  ${desc}   (${(r.stdout.match(/\d+ passed, \d+ failed/) || ['?'])[0]})`);
}
console.log(out.join('\n'));
const c = (k) => out.filter((l) => l.startsWith(k)).length;
console.log(`\n${out.length - c('NOT APPLIED')} applied: ${c('caught')} caught · ${c('SURVIVED')} SURVIVED (C0 must) · ${c('NOT APPLIED')} NOT APPLIED · ${c('INVALID')} INVALID    under ${base}`);
