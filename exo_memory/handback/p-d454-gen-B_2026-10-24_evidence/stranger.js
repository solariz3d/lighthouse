// stranger.js (D454 part 1, B): E's 13 files (p-d454-install-E_2026-10-24.md §6), each run on its own in a CLONE of the B generation (gen3) under a
// stranger env built by E's gen-env.js rule (no CONSONANCE_*/CLAUDE*/ANTHROPIC_*/credential-named variables; USERPROFILE, HOME, APPDATA,
// LOCALAPPDATA, TEMP, TMP moved to a scratch home), and in the d454-b worktree with this machine's env. Names only are printed, never values.
//   node stranger.js <clone root> <worktree root> <stranger home>
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const [clone, wt, home] = process.argv.slice(2);
const env = { ...process.env };
for (const k of Object.keys(env)) if (/^(CONSONANCE_|CLAUDE|ANTHROPIC_|AMBIENT_)/i.test(k) || /^(NODE_OPTIONS|PYTHONPATH|PROBE_|PRIV_PATTERN)/i.test(k) || /TOKEN|KEY|SECRET|PASS|AUTH|CREDENTIAL/i.test(k)) delete env[k];
const roam = path.join(home, 'AppData', 'Roaming'), local = path.join(home, 'AppData', 'Local'), temp = path.join(local, 'Temp');
for (const d of [roam, local, temp]) fs.mkdirSync(d, { recursive: true });
Object.assign(env, { USERPROFILE: home, HOME: home, APPDATA: roam, LOCALAPPDATA: local, TEMP: temp, TMP: temp });
const FILES = ['consonance/hooks/claim-check.test.js', 'consonance/hooks/delete-gate.test.js', 'consonance/hooks/dispatch-gate.test.js', 'consonance/hooks/dream-gate.test.js',
  'consonance/hooks/push-gate.test.js', 'consonance/hooks/sessionstart-state.test.js', 'consonance/tools/attached.test.js', 'consonance/tools/claim-check-adapter.test.js',
  'consonance/tools/claim-replay.test.js', 'consonance/tools/janitor.test.js', 'consonance/tools/mistake-bench.test.js', 'consonance/tools/pulse-degrade.test.js', 'consonance/tools/scratch.test.js'];
for (const f of FILES) {
  console.log(f);
  for (const [name, root, e] of [['stranger clone of gen3', clone, env], ['d454-b worktree, this machine', wt, process.env]]) {
    if (!fs.existsSync(path.join(root, f))) { console.log(`   ${name}: not shipped`); continue; }
    const r = spawnSync(process.execPath, ['--test', f], { cwd: root, env: e, encoding: 'utf8', timeout: 300000, windowsHide: true, maxBuffer: 1 << 26 });
    const out = ((r.stdout || '') + (r.stderr || '')).replace(/\x1b\[[0-9;]*m/g, '');
    const fails = [...new Set(out.split('\n').filter((l) => /^✖ /.test(l) && !/failing tests:/.test(l)).map((l) => l.replace(/ \(\d[\d.]*ms\)$/, '').slice(2, 150)))];
    const why = out.split('\n').find((l) => /AssertionError|Error:|expected:|Cannot find module/.test(l)) || '';
    console.log(`   ${name}: exit ${r.status}${r.status ? ' — ' + why.trim().slice(0, 150) : ''}`);
    for (const t of fails) console.log('      ✖ ' + t);
  }
}
