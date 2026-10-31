// stranger6.js (D454 part 1, B): the six files still red in a stranger clone, each run alone under the stranger env (E's gen-env.js rule) with the
// full failure text kept per file, so each can be classified fix / exclude / env-only. Names only, never values.
//   node stranger6.js <clone root> <stranger home> <out dir>
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const [clone, home, outDir] = process.argv.slice(2);
const env = { ...process.env };
for (const k of Object.keys(env)) if (/^(CONSONANCE_|CLAUDE|ANTHROPIC_|AMBIENT_)/i.test(k) || /^(NODE_OPTIONS|PYTHONPATH|PROBE_|PRIV_PATTERN)/i.test(k) || /TOKEN|KEY|SECRET|PASS|AUTH|CREDENTIAL/i.test(k)) delete env[k];
const roam = path.join(home, 'AppData', 'Roaming'), local = path.join(home, 'AppData', 'Local'), temp = path.join(local, 'Temp');
for (const d of [roam, local, temp, outDir]) fs.mkdirSync(d, { recursive: true });
Object.assign(env, { USERPROFILE: home, HOME: home, APPDATA: roam, LOCALAPPDATA: local, TEMP: temp, TMP: temp });
const FILES = ['consonance/hooks/delete-gate.test.js', 'consonance/hooks/dispatch-gate.test.js', 'consonance/hooks/dream-gate.test.js',
  'consonance/hooks/push-gate.test.js', 'consonance/hooks/sessionstart-state.test.js', 'consonance/tools/attached.test.js'];
for (const f of FILES) {
  const r = spawnSync(process.execPath, ['--test', f], { cwd: clone, env, encoding: 'utf8', timeout: 300000, windowsHide: true, maxBuffer: 1 << 26 });
  const out = ((r.stdout || '') + (r.stderr || '')).replace(/\x1b\[[0-9;]*m/g, '');
  fs.writeFileSync(path.join(outDir, path.basename(f) + '.out'), out);
  const fails = [...new Set(out.split('\n').filter((l) => /^✖ /.test(l) && !/failing tests:/.test(l)).map((l) => l.replace(/ \(\d[\d.]*ms\)$/, '').slice(2, 140)))];
  console.log(`${f}: exit ${r.status}, ${fails.length} failing`);
  for (const t of fails) console.log('   ✖ ' + t);
}
