// sb-probe.js: run the clone's state-block.js once under the stranger env; print the exit code and the first error lines only.
const path = require('path'), { spawnSync } = require('child_process'); const [root, home] = process.argv.slice(2);
const env = { ...process.env }; for (const k of Object.keys(env)) if (/^(CONSONANCE_|CLAUDE|ANTHROPIC_|AMBIENT_)/i.test(k) || /TOKEN|KEY|SECRET|PASS|AUTH|CREDENTIAL/i.test(k)) delete env[k];
const local = path.join(home, 'AppData', 'Local'); Object.assign(env, { USERPROFILE: home, HOME: home, APPDATA: path.join(home, 'AppData', 'Roaming'), LOCALAPPDATA: local, TEMP: path.join(local, 'Temp'), TMP: path.join(local, 'Temp') });
const r = spawnSync(process.execPath, [path.join(root, 'consonance/tools/state-block.js')], { encoding: 'utf8', env });
console.log('exit', r.status); console.log((r.stderr || '').split('\n').filter((l) => /Error|ENOENT|at /.test(l)).slice(0, 4).join('\n').slice(0, 600));
