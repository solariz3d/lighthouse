// scan.js <worktree> <base> <head>: dump, for every commit in base..head, its message and its own added lines (a merge: its added lines against
// its first parent), plus the net added lines; then run sweep.js (the private terms + the room's words, counts only) and the credential checks
// (push-gate's findKeys, and loose prefixes built split so this file holds none) over every dump. Prints counts, never a matched line.
'use strict';
const { execFileSync } = require('child_process'), fs = require('fs'), path = require('path');
const [W, B, H] = process.argv.slice(2), D = path.join(__dirname, 'scan');
const git = (...a) => execFileSync('git', ['-C', W, ...a], { encoding: 'utf8', windowsHide: true, maxBuffer: 1 << 28 });
const added = (patch) => patch.split(/\r?\n/).filter((l) => l.startsWith('+') && !l.startsWith('+++')).map((l) => l.slice(1)).join('\n');
fs.rmSync(D, { recursive: true, force: true }); fs.mkdirSync(D);
const shas = git('rev-list', '--reverse', `${B}..${H}`).trim().split('\n'); const files = [];
shas.forEach((c, i) => {
  const parents = git('rev-list', '--parents', '-n', '1', c).trim().split(' ').slice(1), short = c.slice(0, 7);
  const m = path.join(D, `msg-${i + 1}-${short}.txt`), a = path.join(D, `added-${i + 1}-${short}.txt`);
  fs.writeFileSync(m, git('log', '-1', '--format=%B', c)); fs.writeFileSync(a, added(git('diff', parents[0], c)));
  files.push(m, a); console.log(`${i + 1} ${short} ${parents.length > 1 ? 'merge' : 'commit'}: ${git('log', '-1', '--format=%s', c).trim()}`);
});
const net = path.join(D, 'net-added.txt'); fs.writeFileSync(net, added(git('diff', B, H))); files.push(net);
console.log(`commits ${shas.length}; added lines over the commits' own diffs ${files.filter((f) => /added-/.test(f)).reduce((n, f) => n + fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).length, 0)}; net added lines ${fs.readFileSync(net, 'utf8').split('\n').filter(Boolean).length}; net ${git('diff', '--shortstat', B, H).trim()}`);
let sw; try { sw = execFileSync('node', [path.join(__dirname, 'sweep.js'), ...files], { encoding: 'utf8', windowsHide: true }); } catch (e) { sw = e.stdout; }
const lines = sw.trim().split('\n'); console.log(lines.filter((l) => !/term hits 0; room words 0$/.test(l)).map((l) => l.replace(D + path.sep, '').replace(D + '/', '')).join('\n'));
console.log(`sweep: ${lines.length - 1} files; ${lines.filter((l) => /term hits 0; room words 0$/.test(l)).length} clean`);
const { findKeys } = require('C:/Users/nname/Desktop/lighthouse/consonance/hooks/push-gate.js');
const loose = ['gh' + 'p_', 'gh' + 'o_', 'gh' + 's_', 'github' + '_pat_', 's' + 'k-ant-', 'AK' + 'IA', 'xox' + 'b-', 'xox' + 'p-', 'AI' + 'za', '-----BEGIN ' + 'PRIVATE KEY', '-----BEGIN RSA ' + 'PRIVATE KEY', 'sk' + '-proj-'];
let fk = 0, lo = 0;
for (const f of files) { const s = fs.readFileSync(f, 'utf8'); const k = findKeys(s); fk += Array.isArray(k) ? k.length : (k ? 1 : 0); for (const p of loose) lo += s.split(p).length - 1; }
console.log(`credentials over ${files.length} files: push-gate findKeys ${fk}; loose prefixes (${loose.length} patterns) ${lo}`);
