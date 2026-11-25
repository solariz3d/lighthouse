// Runs the real helper (relaunch.js at d79cf37b) once per non-program of pane C's choosing, with a pid that has already exited.
const { spawnSync } = require('child_process'); const fs = require('fs'); const path = require('path');
const [helper, base] = process.argv.slice(2);
const cases = [
  ['a directory named consonance.exe', 'dir_case/consonance.exe'],
  ['a PNG (C\'s redrawn picture 3), its own name', 'png_case/3_restart.png'],
  ['a markdown hand-back renamed consonance.exe', 'txt_case/consonance.exe'],
  ['a zero-byte consonance.exe', 'zero_case/consonance.exe'],
  ['a .cmd batch file (body: exit /b 0)', 'cmd_case/consonance.cmd'],
  ['a real PE that is a DLL (System32 version.dll) renamed consonance.exe', 'dll_case/consonance.exe'],
];
for (const [what, rel] of cases) {
  const exe = path.join(base, rel), log = path.join(base, rel.split('/')[0] + '.jsonl');
  const dead = spawnSync(process.execPath, ['-e', '0']).pid;
  let alive = true; try { process.kill(dead, 0); } catch (e) { alive = e.code !== 'ESRCH'; }
  const t = Date.now();
  const r = spawnSync(process.execPath, [helper, '--pid', String(dead), '--exe', exe, '--log', log], { encoding: 'utf8', timeout: 30000 });
  const rows = fs.existsSync(log) ? fs.readFileSync(log, 'utf8').trim().split('\n').map((l) => JSON.parse(l)) : [];
  const last = rows.at(-1) || {};
  console.log(`${what}\n   pid ${dead} dead: ${!alive} | exit ${r.status} in ${Date.now() - t} ms | rows ${rows.length} | outcome ${last.outcome} | why ${last.why || '-'} | child ${last.child ?? '-'} | stderr: ${(r.stderr || '').trim().split('\n')[0] || '-'}`);
}
