// extra.js: more command forms for G2 (on the dirs g2.js planted), odd inputs, and a hook whose stdin never closes. Deletes nothing.
const L = require('./lib.js'); const { fs, path, hook, bash, check, verdict, BASE, rows } = L; const { spawn } = require('child_process');
const fw = (p) => p.replace(/\\/g, '/'); const deep = path.join(BASE, 'deep'), clean = path.join(BASE, 'scratch');
const G = (cmd, cwd = BASE, tool) => verdict(hook('delete-gate', bash(cmd, cwd, tool)));
// the trees: `deep` holds a junction 5 levels down; `scratch` is clean
for (const [id, cmd, tool] of [
  ['x1', `rm -fr ${fw(deep)}`], ['x2', `rm -R ${fw(deep)}`], ['x3', `rm --recursive --force ${fw(deep)}`], ['x4', `rm -r -f -- ${fw(deep)}`], ['x5', `rm -rf a-clean-missing ${fw(clean)} ${fw(deep)}`],
  ['x6', `Remove-Item -Recurse -LiteralPath "${deep}"`, 'PowerShell'], ['x7', `Remove-Item -Path "${clean}","${deep}" -Recurse -Force`, 'PowerShell'], ['x8', `ri -Recurse "${deep}"`, 'PowerShell'], ['x9', `Get-ChildItem x | Remove-Item -Recurse`, 'PowerShell'],
  ['x10', `rd -Recurse "${deep}"`, 'PowerShell'], ['x11', `rm -Recurse -Force "${deep}"`, 'PowerShell'], ['x12', `del -Recurse "${deep}"`, 'PowerShell'],
]) check(id, cmd.replace(/C:[^ "]*\\work\\|C:\/[^ "]*\/work\//g, '<work>/').slice(0, 78), G(cmd, BASE, tool), id === 'x9' ? 'allow' : 'deny', id === 'x9' ? 'a pipeline of Get-ChildItem into Remove-Item is not seen' : '');
check('x13', 'a NUL in the path', G(`rm -rf "x\u0000y"`), 'allow'); check('x14', 'a 1 MB command', G('rm -rf ' + 'a'.repeat(1000000)), 'allow'); check('x15', 'rm -rf with no target', G('rm -rf'), 'allow'); check('x16', 'rm -rf ~', G('rm -rf ~/definitely-not-here-xyz'), 'allow');
// a hook whose stdin never closes: the 8 s watchdog is a timer, and the first thing the hook does is a synchronous read of stdin
function hang(name) { return new Promise((res) => { const t0 = Date.now(); const p = spawn(process.execPath, [path.join(L.HOOKS, name + '.js')], { stdio: ['pipe', 'pipe', 'pipe'], env: { ...process.env, CONSONANCE_DATA: L.data } }); let done = false; p.on('exit', (c) => { done = true; res({ exited: true, code: c, ms: Date.now() - t0 }); }); setTimeout(() => { if (!done) { p.kill(); res({ exited: false, ms: Date.now() - t0 }); } }, 13000); }); }
(async () => { for (const name of ['delete-gate', 'push-gate', 'ask-ending']) { const r = await hang(name); check('stdin-' + name, `${name}: stdin never closed (the watchdog is 5 to 8 s)`, r.exited ? `exited after ${r.ms} ms` : `STILL RUNNING after ${r.ms} ms`, 'exited after ~8000 ms', 'the settings timeout is 10 s'); }
  console.log('\nDIFFS:', rows.filter((r) => !r.ok).map((r) => r.id).join(', ') || 'none'); })();
