// muted.js <worktree> <test file> [name pattern]: runs a copy of a page test with --mute-audio added to its Chrome (verification only, until C's D409 puts the flag in launchChrome; the copy is deleted after)
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const [wt, file, pattern] = process.argv.slice(2);
const src = path.join(wt, file), dst = path.join(path.dirname(src), 'zz-muted-' + path.basename(src));
let s = fs.readFileSync(src, 'utf8');
const n = (s.match(/launchChrome\(CHROME, \[/g) || []).length;
if (n !== 1) throw new Error(`expected one launchChrome(CHROME, [ in ${file}, found ${n}`);
s = s.replace('launchChrome(CHROME, [', "launchChrome(CHROME, ['--mute-audio', ");
fs.writeFileSync(dst, s);
try {
  const r = spawnSync(process.execPath, ['--test', '--test-timeout=900000', ...(pattern ? ['--test-name-pattern=' + pattern] : []), dst], { stdio: 'inherit', cwd: wt });
  process.exitCode = r.status;
} finally { fs.rmSync(dst, { force: true }); }
