// ss-probe.js: run the clone's sessionstart-state hook as its test does, under the stranger env; print the block's first line only.
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process'); const [root, home, data] = process.argv.slice(2);
const env = { ...process.env }; for (const k of Object.keys(env)) if (/^(CONSONANCE_|CLAUDE|ANTHROPIC_|AMBIENT_)/i.test(k) || /TOKEN|KEY|SECRET|PASS|AUTH|CREDENTIAL/i.test(k)) delete env[k];
const local = path.join(home, 'AppData', 'Local'); Object.assign(env, { USERPROFILE: home, HOME: home, APPDATA: path.join(home, 'AppData', 'Roaming'), LOCALAPPDATA: local, TEMP: path.join(local, 'Temp'), TMP: path.join(local, 'Temp'), CONSONANCE_DATA: data });
fs.mkdirSync(data, { recursive: true });
const r = spawnSync(process.execPath, [path.join(root, 'consonance/hooks/sessionstart-state.js')], { input: JSON.stringify({ source: 'compact' }), encoding: 'utf8', env });
let ctx = ''; try { ctx = JSON.parse(r.stdout).hookSpecificOutput.additionalContext; } catch (_) { ctx = r.stdout; }
console.log('exit', r.status, '|', ctx.split('\n').filter((l) => /FAILED|state-block/.test(l)).slice(0, 3).join(' / ').slice(0, 300));
