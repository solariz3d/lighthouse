// mutants.js — D090. Scores the rows in rows.js, which the tracked harness cannot score this lap: it builds a
// worktree of HEAD and copies in only the mutated file, and dev/shell/lib/ready.test.js is UNTRACKED today, so the
// scorer would not exist there. Same rows, same anchors (they passed `mutant-harness.js --audit`).
// Each mutant goes in a FRESH copy of the two files; the live repo is read only, and hashed before and after.
const fs = require('fs'), os = require('os'), path = require('path'), crypto = require('crypto');
const { spawnSync } = require('child_process');
const cfg = require('./rows.js');
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const LIB = path.join(cfg.repo, 'dev/shell/lib');
const before = { 'ready.js': sha(path.join(LIB, 'ready.js')), 'ready.test.js': sha(path.join(LIB, 'ready.test.js')) };
const src = fs.readFileSync(path.join(LIB, 'ready.js'), 'utf8');
const base = fs.mkdtempSync(path.join(os.tmpdir(), 'd090-mut-'));
const out = [];
cfg.rows.forEach(([name, anchor, repl], i) => {
  const n = src.split(anchor).length - 1;
  if (n !== 1) { out.push(`NOT APPLIED  ${i + 1} ${name} (anchor x${n})`); return; }
  const d = path.join(base, String(i + 1));
  fs.mkdirSync(d);
  fs.writeFileSync(path.join(d, 'ready.js'), src.replace(anchor, () => repl));
  fs.copyFileSync(path.join(LIB, 'ready.test.js'), path.join(d, 'ready.test.js'));
  if (spawnSync(process.execPath, ['--check', path.join(d, 'ready.js')]).status !== 0) { out.push(`INVALID      ${i + 1} ${name}`); return; }
  const r = spawnSync(process.execPath, [path.join(d, 'ready.test.js')], { encoding: 'utf8' });
  const failed = (r.stdout.match(/^ {2}FAIL .*/gm) || []).map((l) => l.replace(/^ {2}FAIL /, ''));
  out.push(failed.length
    ? `caught       ${i + 1} ${name}\n               by: ${failed.join(' | ')}`
    : `SURVIVED     ${i + 1} ${name}   (${(r.stdout.match(/\d+ passed, \d+ failed/) || ['?'])[0]})`);
});
// A control row the harness's gates would refuse (empty replacement), kept here to prove the anchor check bites.
{
  const n = src.split('THIS TEXT IS NOT IN READY.JS').length - 1;
  out.push(n === 1 ? 'control applied?!' : `NOT APPLIED  control: an anchor that is not in the file (anchor x${n})`);
}
console.log(out.join('\n'));
const c = (k) => out.filter((l) => l.startsWith(k)).length;
console.log(`\n${cfg.rows.length} rows: ${c('caught')} caught · ${c('SURVIVED')} SURVIVED · ${c('NOT APPLIED')} NOT APPLIED · ${c('INVALID')} INVALID`);
const after = { 'ready.js': sha(path.join(LIB, 'ready.js')), 'ready.test.js': sha(path.join(LIB, 'ready.test.js')) };
console.log('live files unchanged:', JSON.stringify(before) === JSON.stringify(after), JSON.stringify(after, null, 0));
