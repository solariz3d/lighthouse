// dg-probe.js (D454, B): run the shipped dispatch-gate hook once, as its test does, under the stranger env or this machine's, and print the ledger
// row it wrote (keys and values; the payload carries only a fake token and fake text). node dg-probe.js <clone root> <stranger home|-> <ledger dir>
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const [root, home, ledger] = process.argv.slice(2);
const env = { ...process.env };
if (home !== '-') {
  for (const k of Object.keys(env)) if (/^(CONSONANCE_|CLAUDE|ANTHROPIC_|AMBIENT_)/i.test(k) || /TOKEN|KEY|SECRET|PASS|AUTH|CREDENTIAL/i.test(k)) delete env[k];
  const roam = path.join(home, 'AppData', 'Roaming'), local = path.join(home, 'AppData', 'Local'), temp = path.join(local, 'Temp');
  Object.assign(env, { USERPROFILE: home, HOME: home, APPDATA: roam, LOCALAPPDATA: local, TEMP: temp, TMP: temp });
}
fs.mkdirSync(ledger, { recursive: true });
env.CONSONANCE_DATA = ledger;
const r = spawnSync(process.execPath, [path.join(root, 'consonance/hooks/dispatch-gate.js')], { input: JSON.stringify({ tool_name: 'mcp__consonance__chair_inject', tool_input: { target: 'B', token: 'FAKE-TOKEN', text: 'uncited prose' } }), encoding: 'utf8', env });
console.log('exit', r.status, 'stdout', (r.stdout || '').slice(0, 300), 'stderr', (r.stderr || '').slice(0, 300));
const f = path.join(ledger, 'dispatch-gate.jsonl');
console.log(fs.existsSync(f) ? fs.readFileSync(f, 'utf8').trim().split('\n').slice(-2).join('\n') : '(no ledger file)');
