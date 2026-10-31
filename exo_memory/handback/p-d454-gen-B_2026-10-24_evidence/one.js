// one.js: run ONE test file in the stranger env (E's rule), print its tail. node one.js <clone> <home> <file> [--test]
const path = require('path'), { spawnSync } = require('child_process'); const [root, home, f, mode] = process.argv.slice(2);
const env = { ...process.env }; for (const k of Object.keys(env)) if (/^(CONSONANCE_|CLAUDE|ANTHROPIC_|AMBIENT_)/i.test(k) || /^(NODE_OPTIONS|PYTHONPATH|PROBE_|PRIV_PATTERN)/i.test(k) || /TOKEN|KEY|SECRET|PASS|AUTH|CREDENTIAL/i.test(k)) delete env[k];
const local = path.join(home, 'AppData', 'Local'); Object.assign(env, { USERPROFILE: home, HOME: home, APPDATA: path.join(home, 'AppData', 'Roaming'), LOCALAPPDATA: local, TEMP: path.join(local, 'Temp'), TMP: path.join(local, 'Temp') });
const r = spawnSync(process.execPath, mode ? ['--test', f] : [f], { cwd: root, env, encoding: 'utf8', maxBuffer: 1 << 26 });
const out = ((r.stdout || '') + (r.stderr || '')).replace(/\x1b\[[0-9;]*m/g, '').split('\n');
console.log('exit', r.status); console.log(out.filter((l) => /FAIL|skipped|ℹ (pass|fail|skipped)|needs a set-up|passed,/.test(l)).slice(0, 12).join('\n').slice(0, 1500));
