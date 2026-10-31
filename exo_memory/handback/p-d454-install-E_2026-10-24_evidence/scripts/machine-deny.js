// machine-deny.js (D454 part 3, pane E): on THIS machine (its USERPROFILE, its ~/.consonance.json, no CONSONANCE_DATA), one deny case for
// push-gate and one for delete-gate, run under fsprobe: no write anywhere is made (PROBE_ALLOW empty), git children run (PROBE_CHILD=allow),
// and every write the gate TRIED is logged. Prints, per gate: the exit, the whole stdout (the deny JSON) and the writes it tried.
//   node machine-deny.js <tag> <hooks dir> [<hooks dir> ...]   every dir's gates run on the SAME fixture, so their outputs can be compared byte for byte
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const [tag, ...dirs] = process.argv.slice(2);
const P = __dirname, work = fs.mkdtempSync(path.join('G:\\consonance-scratch', 'mdeny-'));
const git = (cwd, ...a) => { const r = spawnSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'init.defaultBranch=main', '-c', 'core.autocrlf=false', ...a], { cwd, encoding: 'utf8' }); if (r.status) throw new Error('git ' + a.join(' ') + ': ' + r.stderr); };
// the push fixture: a bare origin, a clone with one pushed commit, then a commit that ADDS a key-shaped line (built split, so no file here holds the shape)
const origin = path.join(work, 'origin.git'), clone = path.join(work, 'work');
git(work, 'init', '--bare', '-q', origin); git(work, 'clone', '-q', origin, clone);
fs.writeFileSync(path.join(clone, 'README.md'), 'hello\n'); git(clone, 'add', 'README.md'); git(clone, 'commit', '-q', '-m', 'first'); git(clone, 'push', '-q', '-u', 'origin', 'HEAD:main'); git(clone, 'remote', 'set-head', 'origin', 'main');
fs.writeFileSync(path.join(clone, 'config.txt'), 'a = 1\nkey = ' + ['vck', 'a1B2c3D4e5F6g7H8i9J0k1L2'].join('_') + '\n'); git(clone, 'add', 'config.txt'); git(clone, 'commit', '-q', '-m', 'oops');
// the delete fixture: a tree holding a junction to a precious folder outside it
const tree = path.join(work, 'tree'), precious = path.join(work, 'precious');
fs.mkdirSync(path.join(tree, 'src'), { recursive: true }); fs.writeFileSync(path.join(tree, 'src', 'a.js'), 'x');
fs.mkdirSync(precious); fs.writeFileSync(path.join(precious, 'keep.txt'), 'irreplaceable'); fs.symlinkSync(precious, path.join(tree, 'reads'), 'junction');
const env = { ...process.env, NODE_OPTIONS: '--require ' + path.join(P, 'fsprobe.js').split(path.sep).join('/'), PROBE_ALLOW: '', PROBE_DENYREAD: '', PROBE_CHILD: 'allow', CONSONANCE_DREAM: '' };
delete env.CONSONANCE_DATA;
const norm = (s) => String(s).split(work).join('<WORK>').split(work.split('\\').join('/')).join('<WORK>');
const out = [];
for (const hooks of dirs) for (const [gate, payload] of [['push-gate.js', { tool_name: 'Bash', tool_input: { command: 'git push' }, cwd: clone, session_id: 'mdeny' }],
  ['delete-gate.js', { tool_name: 'Bash', tool_input: { command: `rm -rf "${tree}"` }, cwd: work, session_id: 'mdeny' }]]) {
  const log = path.join(work, gate + '.probe.jsonl');
  const r = spawnSync(process.execPath, [path.join(hooks, gate)], { input: JSON.stringify(payload), encoding: 'utf8', env: { ...env, PROBE_LOG: log }, timeout: 60000 });
  const rows = fs.existsSync(log) ? fs.readFileSync(log, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)) : [];
  const writes = [...new Set(rows.filter((x) => x.w && x.path !== '<fd>' && !String(x.path).includes('/mdeny-')).map((x) => x.op + ' ' + x.path))];
  out.push({ hooks, gate, exit: r.status, stdout: norm(r.stdout.trim()), triedWrites: writes, unblocked: rows.filter((x) => x.w && !x.blocked && x.path !== '<fd>').map((x) => x.path) });
}
const keep = fs.readFileSync(path.join(precious, 'keep.txt'), 'utf8');
fs.rmSync(path.join(tree, 'reads')); fs.rmSync(work, { recursive: true, force: true });
fs.writeFileSync(path.join(P, 'machine-deny-' + tag + '.json'), JSON.stringify(out, null, 1));
for (const o of out) console.log(o.hooks.split(/[\/]/).slice(-2).join('/'), o.gate, 'exit', o.exit, 'deny', /"permissionDecision":"deny"/.test(o.stdout), 'stdout', o.stdout.length, 'B; tried writes:', o.triedWrites.join(' | ') || '-', '; made:', o.unblocked.length);
console.log('precious file intact:', keep === 'irreplaceable');
for (const g of ['push-gate.js', 'delete-gate.js']) { const o = out.filter((x) => x.gate === g); console.log(g, 'stdout byte-identical across dirs:', o.every((x) => x.stdout === o[0].stdout), '; tried writes identical:', o.every((x) => JSON.stringify(x.triedWrites) === JSON.stringify(o[0].triedWrites))); }
